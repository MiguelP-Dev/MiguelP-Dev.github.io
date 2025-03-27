# Paquete errors en Go

El paquete `errors` proporciona funcionalidades para crear y manipular errores en Go. Este documento explora en detalle sus características y casos de uso prácticos.

## 1. Conceptos Básicos

### 1.1 Creación de Errores

```go
// filepath: ejemplos/errors/basic.go
package main

import (
    "errors"
    "fmt"
)

// Error simple
var ErrRecursoNoEncontrado = errors.New("recurso no encontrado")

// Error con formato
func newErrorConContexto(id string) error {
    return fmt.Errorf("recurso %s no encontrado", id)
}

// Error personalizado
type ValidationError struct {
    Campo   string
    Mensaje string
}

func (e *ValidationError) Error() string {
    return fmt.Sprintf("error de validación en %s: %s", e.Campo, e.Mensaje)
}
```

### 1.2 Envoltura de Errores (Error Wrapping)

```go
// filepath: ejemplos/errors/wrapping.go
package main

import (
    "errors"
    "fmt"
)

func procesarDatos(data []byte) error {
    if len(data) == 0 {
        return fmt.Errorf("datos vacíos: %w", ErrRecursoNoEncontrado)
    }
    return nil
}

func manejarError(err error) {
    if errors.Is(err, ErrRecursoNoEncontrado) {
        fmt.Println("Error de recurso no encontrado")
    }
    
    var valErr *ValidationError
    if errors.As(err, &valErr) {
        fmt.Printf("Error de validación: %v\n", valErr)
    }
}
```

## 2. Patrones Avanzados

### 2.1 Cadena de Errores

```go
// filepath: ejemplos/errors/chain.go
package main

import (
    "errors"
    "fmt"
)

type ErrorCode int

const (
    ErrCodeDB ErrorCode = iota + 1
    ErrCodeValidation
    ErrCodeBusiness
)

type AppError struct {
    Code    ErrorCode
    Message string
    Err     error
}

func (e *AppError) Error() string {
    if e.Err != nil {
        return fmt.Sprintf("[%d] %s: %v", e.Code, e.Message, e.Err)
    }
    return fmt.Sprintf("[%d] %s", e.Code, e.Message)
}

func (e *AppError) Unwrap() error {
    return e.Err
}

func procesarOperacion() error {
    err := operacionDB()
    if err != nil {
        return &AppError{
            Code:    ErrCodeDB,
            Message: "error en base de datos",
            Err:     err,
        }
    }
    return nil
}
```

### 2.2 Error Group Pattern

```go
// filepath: ejemplos/errors/errorgroup.go
package main

import (
    "context"
    "errors"
    "fmt"
    "sync"
)

type ErrorGroup struct {
    wg     sync.WaitGroup
    errMu  sync.Mutex
    err    error
    ctx    context.Context
    cancel context.CancelFunc
}

func NewErrorGroup() *ErrorGroup {
    ctx, cancel := context.WithCancel(context.Background())
    return &ErrorGroup{
        ctx:    ctx,
        cancel: cancel,
    }
}

func (g *ErrorGroup) Go(f func() error) {
    g.wg.Add(1)

    go func() {
        defer g.wg.Done()

        if err := f(); err != nil {
            g.errMu.Lock()
            if g.err == nil {
                g.err = err
                g.cancel()
            }
            g.errMu.Unlock()
        }
    }()
}

func (g *ErrorGroup) Wait() error {
    g.wg.Wait()
    g.cancel()
    return g.err
}
```

## 3. Casos de Uso Prácticos

### 3.1 API REST con Manejo de Errores

```go
// filepath: ejemplos/errors/api.go
package main

import (
    "encoding/json"
    "errors"
    "net/http"
)

type ErrorResponse struct {
    Code    int    `json:"code"`
    Message string `json:"message"`
    Details string `json:"details,omitempty"`
}

func handleError(w http.ResponseWriter, err error) {
    var response ErrorResponse

    switch {
    case errors.Is(err, ErrRecursoNoEncontrado):
        response = ErrorResponse{
            Code:    404,
            Message: "Recurso no encontrado",
            Details: err.Error(),
        }
    case errors.As(err, &ValidationError{}):
        response = ErrorResponse{
            Code:    400,
            Message: "Error de validación",
            Details: err.Error(),
        }
    default:
        response = ErrorResponse{
            Code:    500,
            Message: "Error interno del servidor",
        }
    }

    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(response.Code)
    json.NewEncoder(w).Encode(response)
}
```

### 3.2 Sistema de Logging con Errores

```go
// filepath: ejemplos/errors/logging.go
package main

import (
    "errors"
    "log"
    "runtime"
)

type ErrorLogger struct {
    logger *log.Logger
}

func (el *ErrorLogger) LogError(err error) {
    if err == nil {
        return
    }

    // Obtener información del stack
    pc, file, line, _ := runtime.Caller(1)
    fn := runtime.FuncForPC(pc).Name()

    // Log del error con contexto
    el.logger.Printf("[ERROR] %s:%d %s: %v", file, line, fn, err)

    // Log de la cadena de errores
    for unwrapped := errors.Unwrap(err); unwrapped != nil; unwrapped = errors.Unwrap(unwrapped) {
        el.logger.Printf("[CAUSA] %v", unwrapped)
    }
}
```

## 4. Mejores Prácticas

1. **Diseño de Errores**
   - Usar errores descriptivos y específicos
   - Incluir contexto relevante
   - Mantener consistencia en el formato

2. **Manejo de Errores**
   - No ignorar errores
   - Usar wrapping apropiadamente
   - Implementar logging adecuado

3. **Consideraciones de Rendimiento**
   - Evitar crear errores innecesarios
   - Reutilizar errores comunes
   - Considerar el impacto en el stack trace

## 5. Referencias

- [Documentación oficial de errors](https://golang.org/pkg/errors/)
- [Error Handling in Go](https://blog.golang.org/error-handling-and-go)
- [Working with Errors in Go](https://blog.golang.org/go1.13-errors)
