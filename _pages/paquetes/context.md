# Paquete context en Go

El paquete `context` en Go es fundamental para el manejo de cancelaciones, timeouts y valores a través de la jerarquía de llamadas. Este documento explora en detalle sus características y usos comunes.

## 1. Conceptos Básicos

### 1.1 Contextos Base

```go
// Contextos base sin valores ni cancelación
func ejemplosContextosBase() {
    // Background - para uso general
    ctx := context.Background()
    
    // TODO - para cuando aún no está claro qué contexto usar
    ctxTodo := context.TODO()
}
```

### 1.2 Cancelación Manual

```go
func ejemploCancelacion() {
    // Crear contexto con cancelación
    ctx, cancel := context.WithCancel(context.Background())
    defer cancel()

    // Ejecutar tarea en goroutine
    go func() {
        for {
            select {
            case <-ctx.Done():
                fmt.Println("Tarea cancelada")
                return
            default:
                fmt.Println("Trabajando...")
                time.Sleep(500 * time.Millisecond)
            }
        }
    }()

    // Simular trabajo por 2 segundos
    time.Sleep(2 * time.Second)
    cancel() // Cancelar la tarea
}
```

## 2. Timeouts y Deadlines

### 2.1 Timeout Simple

```go
func ejemploTimeout() error {
    // Crear contexto con timeout de 2 segundos
    ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
    defer cancel()

    return realizarOperacionLenta(ctx)
}

func realizarOperacionLenta(ctx context.Context) error {
    doneChan := make(chan struct{})
    
    go func() {
        // Simular operación lenta
        time.Sleep(3 * time.Second)
        close(doneChan)
    }()

    select {
    case <-ctx.Done():
        return fmt.Errorf("operación cancelada por timeout: %w", ctx.Err())
    case <-doneChan:
        return nil
    }
}
```

### 2.2 Deadline Específica

```go
func ejemploDeadline() error {
    // Crear contexto que expira a medianoche
    midnight := time.Now().Add(24 * time.Hour)
    midnight = time.Date(
        midnight.Year(),
        midnight.Month(),
        midnight.Day(),
        0, 0, 0, 0,
        midnight.Location(),
    )

    ctx, cancel := context.WithDeadline(context.Background(), midnight)
    defer cancel()

    return realizarTareasProgramadas(ctx)
}
```

## 3. Valores en Contexto

### 3.1 Gestión de Valores

```go
type ctxKey string

func ejemploValores() {
    const (
        userIDKey   ctxKey = "userID"
        sessionKey  ctxKey = "session"
        requestKey  ctxKey = "requestID"
    )

    ctx := context.Background()
    ctx = context.WithValue(ctx, userIDKey, "123")
    ctx = context.WithValue(ctx, sessionKey, "abc-456")
    ctx = context.WithValue(ctx, requestKey, "req-789")

    procesarSolicitud(ctx)
}

func procesarSolicitud(ctx context.Context) {
    // Extraer valores de forma segura
    if userID, ok := ctx.Value(userIDKey).(string); ok {
        fmt.Printf("Procesando solicitud para usuario: %s\n", userID)
    }
}
```

## 4. Patrones de Uso Común

### 4.1 Cliente HTTP con Timeout

```go
func clienteHTTPConTimeout() {
    client := &http.Client{}
    
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()

    req, err := http.NewRequestWithContext(ctx, "GET", "https://api.ejemplo.com", nil)
    if err != nil {
        log.Fatal(err)
    }

    resp, err := client.Do(req)
    if err != nil {
        if ctx.Err() == context.DeadlineExceeded {
            log.Println("La solicitud excedió el timeout")
            return
        }
        log.Fatal(err)
    }
    defer resp.Body.Close()
}
```

### 4.2 Propagación de Cancelación

```go
func trabajoConcurrente() error {
    ctx, cancel := context.WithCancel(context.Background())
    defer cancel()

    errChan := make(chan error, 3)
    
    // Iniciar múltiples trabajadores
    for i := 0; i < 3; i++ {
        go func(id int) {
            errChan <- trabajador(ctx, id)
        }(i)
    }

    // Si cualquier trabajador falla, cancelar todos
    for i := 0; i < 3; i++ {
        if err := <-errChan; err != nil {
            cancel() // Cancela otros trabajadores
            return fmt.Errorf("error en trabajador: %w", err)
        }
    }

    return nil
}

func trabajador(ctx context.Context, id int) error {
    for {
        select {
        case <-ctx.Done():
            return ctx.Err()
        default:
            // Realizar trabajo
            time.Sleep(100 * time.Millisecond)
        }
    }
}
```

## 5. Mejores Prácticas

### 5.1 Middleware con Contexto

```go
func middlewareConContexto(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        // Agregar valores al contexto
        ctx := r.Context()
        ctx = context.WithValue(ctx, "requestID", uuid.New().String())
        ctx = context.WithValue(ctx, "startTime", time.Now())

        // Establecer timeout para la solicitud
        ctx, cancel := context.WithTimeout(ctx, 30*time.Second)
        defer cancel()

        // Llamar al siguiente handler con el contexto modificado
        next.ServeHTTP(w, r.WithContext(ctx))
    })
}
```

## 6. Consideraciones y Buenas Prácticas

1. **Cancelación**
   - Siempre llamar a `cancel()` cuando termines
   - Usar `defer cancel()` cuando sea posible
   - Propagar la cancelación a todas las goroutines

2. **Valores**
   - Usar tipos personalizados para las claves
   - No almacenar valores nil
   - Mantener el contexto inmutable

3. **Timeouts**
   - Establecer timeouts apropiados
   - Considerar el timeout total de la operación
   - Manejar timeouts en cascada

4. **Errores**
   - Verificar `ctx.Err()` para determinar la causa
   - Propagar errores de contexto apropiadamente
   - No ignorar cancelaciones

## 7. Referencias

- [Documentación oficial de context](https://golang.org/pkg/context/)
- [Go Blog: Context](https://blog.golang.org/context)
- [Effective Go](https://golang.org/doc/effective_go.html)
