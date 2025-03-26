# Paquete `fmt` en Go: Guía Completa con Ejemplos Avanzados

El paquete `fmt` es fundamental para operaciones de entrada/salida en Go. Esta guía cubre todas sus funciones con ejemplos realistas y técnicas avanzadas.

---

## Funciones Básicas de Impresión

### 1. **`Print` y `Println`**
**Diferencias Clave**:
- `Print` no añade espacios automáticos entre argumentos
- `Println` añade espacios y un salto de línea final

**Ejemplo Mejorado**:
```go
func main() {
    // Comportamiento con múltiples argumentos
    fmt.Print("Hoy es:", time.Now().Weekday(), "\n")  // Hoy es:Monday
    fmt.Println("Hoy es:", time.Now().Weekday())      // Hoy es: Monday\n
    
    // Impresión de estructuras
    user := struct {
        Name string
        Age  int
    }{"Alice", 30}
    
    fmt.Println("Usuario:", user) // Usuario: {Alice 30}
}
```

### 2. **`Printf` - Formateo Avanzado**
**Verbos Comunes**:
- `%s` Cadena
- `%d` Entero
- `%f` Flotante (`%.2f` para 2 decimales)
- `%t` Booleano
- `%v` Valor en formato predeterminado
- `%+v` Campos de estructura con nombres
- `%#v` Sintaxis Go del valor

**Ejemplo Completo**:
```go
func main() {
    type Product struct {
        ID     int
        Name   string
        Price  float64
        InStock bool
    }
    
    p := Product{102, "Go Programming Book", 39.99, true}
    
    fmt.Printf("Detalle básico: %v\n", p)
    // Detalle básico: {102 Go Programming Book 39.99 true}
    
    fmt.Printf("Detalle extendido: %+v\n", p)
    // Detalle extendido: {ID:102 Name:Go Programming Book Price:39.99 InStock:true}
    
    fmt.Printf("Precio formateado: $%.2f\n", p.Price)
    // Precio formateado: $39.99
}
```

---

## Funciones de Cadena (Sprint Family)

### 3. **`Sprintf` - Construcción de Mensajes**
**Caso de Uso**: Generar HTML dinámico o mensajes de log estructurados

```go
func generateEmailTemplate(userName string, expiration time.Time) string {
    return fmt.Sprintf(`
        <html>
            <body>
                <h1>Hola, %s!</h1>
                <p>Tu suscripción expira en %d días</p>
            </body>
        </html>
    `, userName, int(expiration.Sub(time.Now()).Hours()/24))
}
```

### 4. **`Sprintln` vs `Sprint`**
**Ejemplo Comparativo**:
```go
func main() {
    logEntry := fmt.Sprint("Error en ", time.Now().Format("2006-01-02"), "\n")
    // "Error en 2023-10-25\n"
    
    logEntryLn := fmt.Sprintln("Error en", time.Now().Format("2006-01-02"))
    // "Error en 2023-10-25\n"
}
```

---

## Entrada/Salida con Interfaces (Fprint Family)

### 5. **`Fprintf` - Escritura en Archivos**
**Ejemplo Práctico**:
```go
func writeConfig(filePath string, config map[string]interface{}) error {
    file, err := os.Create(filePath)
    if err != nil {
        return fmt.Errorf("error creando archivo: %w", err)
    }
    defer file.Close()
    
    for key, value := range config {
        _, err := fmt.Fprintf(file, "%s = %v\n", key, value)
        if err != nil {
            return err
        }
    }
    return nil
}
```

### 6. **`Fscan` - Lectura desde io.Reader**
**Ejemplo Avanzado**:
```go
func parseServerConfig(r io.Reader) (host string, port int, err error) {
    _, err = fmt.Fscanf(r, "host:%s port:%d", &host, &port)
    if err != nil {
        return "", 0, fmt.Errorf("formato de configuración inválido: %w", err)
    }
    return host, port, nil
}

// Uso:
config := strings.NewReader("host:localhost port:8080")
host, port, err := parseServerConfig(config)
```

---

## Manejo de Errores

### 7. **`Errorf` con Wrapping**
**Mejor Práctica**: Usar `%w` para envolver errores
```go
func loadUserData(userID int) ([]byte, error) {
    data, err := os.ReadFile(fmt.Sprintf("users/%d.json", userID))
    if err != nil {
        return nil, fmt.Errorf("error cargando usuario %d: %w", userID, err)
    }
    return data, nil
}
```

---

## Funciones de Escaneo

### 8. **`Scan` vs `Scanln` - Captura de Entrada**
**Diferencias Clave**:
- `Scan` lee hasta cualquier espacio en blanco
- `Scanln` lee hasta nueva línea

**Ejemplo con Validación**:
```go
func getCredentials() (username, password string) {
    fmt.Print("Ingrese usuario: ")
    _, err := fmt.Scanln(&username)
    if err != nil {
        log.Fatal("Error leyendo usuario:", err)
    }
    
    fmt.Print("Ingrese contraseña: ")
    _, err = fmt.Scanln(&password)
    if err != nil {
        log.Fatal("Error leyendo contraseña:", err)
    }
    
    return username, password
}
```

### 9. **`Sscanf` - Parseo de Cadenas**
**Caso de Uso**: Procesar registros de log
```go
func parseLogEntry(entry string) (time.Time, string, error) {
    var (
        timestamp string
        level     string
        message   string
    )
    
    _, err := fmt.Sscanf(entry, "[%s] %s: %s", &timestamp, &level, &message)
    if err != nil {
        return time.Time{}, "", err
    }
    
    parsedTime, err := time.Parse("2006-01-02T15:04:05Z07:00", timestamp)
    return parsedTime, message, err
}
```

---

## Verbos Especiales y Trucos

### 10. **Formateo Avanzado**
```go
func main() {
    // Base numérica
    fmt.Printf("Hex: %x, Bin: %b, Octal: %o\n", 255, 255, 255)
    
    // Relleno y alineación
    fmt.Printf("|%10s|%-10s|\n", "derecha", "izquierda")
    
    // Caracteres Unicode
    fmt.Printf("Corazón: %c\n", '\u2764')
    
    // Punteros
    x := 42
    fmt.Printf("Dirección: %p\n", &x)
}
```

---

## Mejores Prácticas

1. **Validación de Entrada**:
   ```go
   var age int
   n, err := fmt.Scanf("%d", &age)
   if err != nil || n != 1 {
       // Manejar error
   }
   ```

2. **Optimización de Rendimiento**:
   - Usar `fmt.Fprint` en lugar de concatenar strings para output directo
   - Pre-allocatar buffers con `strings.Builder` para múltiples operaciones

3. **Logging Profesional**:
   ```go
   func logTransaction(t Transaction) {
       fmt.Printf("[%s] %-15s $%7.2f\n", 
           time.Now().Format("2006-01-02 15:04:05"),
           t.Type,
           t.Amount)
   }
   ```

4. **Manejo Seguro de Errores**:
   ```go
   if _, err := fmt.Fprintf(writer, data); err != nil {
       // Manejar error de escritura
   }
   ```

---

## Comparativa de Funciones

| Función       | Salida | Formato | Destino          | Retorno  |
|---------------|--------|---------|------------------|----------|
| `Print`       | Stdout | No      | -                | Bytes    |
| `Println`     | Stdout | No      | -                | Bytes    |
| `Printf`      | Stdout | Sí      | -                | Bytes    |
| `Sprint`      | -      | No      | String           | String   |
| `Fprintf`     | Custom | Sí      | io.Writer        | Bytes    |
| `Errorf`      | -      | Sí      | error            | error    |

---

Este contenido ampliado provee ejemplos prácticos, cubre casos de uso avanzados, y ofrece recomendaciones profesionales para usar efectivamente el paquete `fmt` en aplicaciones reales.