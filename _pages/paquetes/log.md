# Paquete `log` en Go: Guía Completa de Logging con Ejemplos Avanzados

El paquete `log` en Go ofrece herramientas fundamentales para el registro de eventos en aplicaciones. Esta guía ampliada cubre técnicas avanzadas, mejores prácticas y ejemplos prácticos para implementar un sistema de logging robusto.

---

## Funciones Principales y Uso Avanzado

### 1. **Registro Básico**
```go
// Registro simple
log.Print("Inicio de la aplicación")

// Registro formateado
log.Printf("Conexión establecida en %s", time.Now().Format("15:04:05"))

// Registro con salto de línea
log.Println("Usuario: john_doe | Acción: login")
```

### 2. **Manejo de Errores Críticos**
```go
func cargarConfiguracion() error {
    if _, err := os.ReadFile("config.yaml"); err != nil {
        return fmt.Errorf("error leyendo configuración: %w", err)
    }
    return nil
}

func main() {
    if err := cargarConfiguracion(); err != nil {
        log.Fatalf("Fallo de inicialización: %v", err) // Termina con os.Exit(1)
    }
}
```

### 3. **Diferencias entre `Panic` y `Fatal`**
- **`log.Panic`**: Genera un panic (recuperable con `recover`)
  ```go
  defer func() {
      if r := recover(); r != nil {
          log.Println("Recuperado de panic:", r)
      }
  }()
  log.Panic("Error grave pero recuperable")
  ```

- **`log.Fatal`**: Termina el programa inmediatamente
  ```go
  if conn == nil {
      log.Fatal("Conexión de base de datos no disponible")
  }
  ```

---

## Configuración Avanzada

### 4. **Personalización de Formato**
```go
// Configurar prefijo y formato
log.SetFlags(log.Ldate | log.Ltime | log.Lmicroseconds | log.Lshortfile)
log.SetPrefix("[APP] ")

// Output: [APP] 2023/10/25 14:35:09.123456 main.go:17: Evento importante
log.Println("Evento importante")
```

### 5. **Redirección de Logs**
```go
// Escribir en múltiples destinos
func setupLogging() {
    file, _ := os.OpenFile("app.log", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
    multiWriter := io.MultiWriter(os.Stdout, file)
    
    log.SetOutput(multiWriter)
    log.Println("Sistema de logging inicializado") // Escribe en consola y archivo
}
```

### 6. **Loggers Personalizados**
```go
// Logger para módulo de autenticación
var authLogger = log.New(os.Stdout, "[AUTH] ", log.LstdFlags|log.Lmsgprefix)

// Logger para módulo de base de datos
var dbLogger = log.New(os.Stderr, "[DB] ", log.Lshortfile)

func main() {
    authLogger.Println("Intento de login desde 192.168.1.10")
    dbLogger.Println("Query ejecutada: SELECT * FROM users")
}
```

---

## Mejores Prácticas

### 7. **Estructuración de Logs**
```go
type LogEntry struct {
    Timestamp time.Time
    Level     string
    Component string
    Message   string
}

func structuredLog(entry LogEntry) {
    log.Printf(
        "[%s] %s | %s: %s",
        entry.Timestamp.Format("2006-01-02T15:04:05Z07:00"),
        entry.Level,
        entry.Component,
        entry.Message,
    )
}

// Uso:
structuredLog(LogEntry{
    time.Now(),
    "ERROR",
    "API",
    "Timeout en solicitud a servicio externo",
})
```

### 8. **Niveles de Logging (Implementación Básica)**
```go
const (
    LevelInfo  = "INFO"
    LevelWarn  = "WARN"
    LevelError = "ERROR"
)

func Log(level string, message string) {
    log.Printf("[%s] %s", level, message)
}

// Uso:
Log(LevelWarn, "Uso de CPU sobre el 90%")
```

---

## Escalando el Logging

### 9. **Integración con Sistemas Externos**
```go
// Ejemplo: Envío de logs a Syslog
func syslogIntegration() {
    syslogWriter, _ := syslog.Dial("udp", "logs.example.com:514", syslog.LOG_INFO, "myapp")
    log.SetOutput(syslogWriter)
    log.Println("Mensaje enviado a servidor remoto")
}
```

### 10. **Rotación de Logs**
```go
// Uso de lumberjack para rotación
import "gopkg.in/natefinch/lumberjack.v2"

func rotatingLogs() {
    log.SetOutput(&lumberjack.Logger{
        Filename:   "app.log",
        MaxSize:    100, // MB
        MaxBackups: 3,
        MaxAge:     28, // días
    })
}
```

---

## Comparativa con Bibliotecas Avanzadas

| Característica          | Paquete `log` | logrus          | zap             |
|-------------------------|---------------|-----------------|-----------------|
| Niveles de logging      | Básicos       | Múltiples       | Múltiples       |
| Logging estructurado    | Manual        | Soporte nativo  | Alto rendimiento|
| Rotación de logs        | Requiere libs | Requiere libs   | Requiere libs   |
| Rendimiento             | Alto          | Medio           | Muy alto        |
| Contexto                | Limitado      | Campos extras   | Campos anidados |

---

## Ejemplo Completo: Sistema de Logging Empresarial

```go
package main

import (
    "log"
    "os"
    "io"
    "gopkg.in/natefinch/lumberjack.v2"
)

func main() {
    // Configurar logger principal
    log.SetFlags(log.Ldate | log.Ltime | log.LUTC | log.Lshortfile)
    
    // Redirección múltiple
    multiWriter := io.MultiWriter(
        os.Stdout,
        &lumberjack.Logger{
            Filename:   "app.log",
            MaxSize:    100,
            MaxBackups: 3,
            MaxAge:     28,
        },
    )
    log.SetOutput(multiWriter)

    // Logger especializado para API
    apiLogger := log.New(multiWriter, "[API] ", log.Lmsgprefix)
    
    // Simulación de uso
    log.Println("Aplicación iniciada")
    apiLogger.Println("GET /api/users - 200 OK")
    
    defer func() {
        if r := recover(); r != nil {
            log.Printf("PANIC: %v", r)
        }
    }()
    
    // ... código de la aplicación ...
}
```

---

Esta guía ampliada proporciona técnicas profesionales para implementar un sistema de logging eficiente en Go. Desde configuraciones básicas hasta integración con sistemas externos y manejo de alto volumen, estos ejemplos muestran cómo aprovechar al máximo el paquete `log` estándar y cuándo considerar soluciones más avanzadas.