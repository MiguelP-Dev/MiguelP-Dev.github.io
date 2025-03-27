---
layout: default
title: Servidor HTTP en Go | Miguel's Programing Notes
description: Implementación completa de un servidor HTTP en Go con mejores prácticas
permalink: /ejemplos/api-rest/http-server/
categories: ejemplos
icon: 🔌
destacado: true
---

# Clase completa sobre HTTP en Go, incluyendo mejores prácticas

```go
package main

import (
    "context"
    "encoding/json"
    "errors"
    "fmt"
    "io"
    "log"
    "net"
    "net/http"
    "os"
    "os/signal"
    "sync/atomic"
    "syscall"
    "time"
)

// User representa un modelo de datos para nuestro ejemplo
type User struct {
    ID    int    `json:"id"`
    Name  string `json:"name"`
    Email string `json:"email"`
}

// CustomHandler es un ejemplo de manejador personalizado
type CustomHandler struct {
    counter int64
}

func (h *CustomHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
    atomic.AddInt64(&h.counter, 1)
    
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(map[string]interface{}{
        "request_count": h.counter,
        "message":      "Hola desde el manejador personalizado!",
    })
}

// Middleware de registro (logging)
func loggingMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        start := time.Now()
        log.Printf("Iniciando %s %s", r.Method, r.URL.Path)
        
        next.ServeHTTP(w, r)
        
        log.Printf("Finalizado %s %s en %v", r.Method, r.URL.Path, time.Since(start))
    })
}

// Middleware de autenticación
func authMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        token := r.Header.Get("Authorization")
        if token != "Bearer mi-token-secreto" {
            http.Error(w, "No autorizado", http.StatusUnauthorized)
            return
        }
        next.ServeHTTP(w, r)
    })
}

func main() {
    // Configuración del servidor con mejores prácticas
    server := &http.Server{
        Addr:         ":8080",
        ReadTimeout:  5 * time.Second,
        WriteTimeout: 10 * time.Second,
        IdleTimeout: 15 * time.Second,
        Handler:      nil, // se configura más abajo
    }

    // Router usando el paquete estándar
    mux := http.NewServeMux()
    
    // Manejadores
    mux.Handle("/custom", &CustomHandler{})
    mux.HandleFunc("/users", handleUsers)
    mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Content-Type", "application/json")
        json.NewEncoder(w).Encode(map[string]bool{"ok": true})
    })

    // Configurar middlewares
    stack := loggingMiddleware(authMiddleware(mux))

    server.Handler = stack

    // Configurar el servidor en una goroutine
    go func() {
        log.Printf("Iniciando servidor en %s", server.Addr)
        if err := server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
            log.Fatalf("Error al iniciar el servidor: %v", err)
        }
    }()

    // Esperar por señales de interrupción
    quit := make(chan os.Signal, 1)
    signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
    <-quit

    // Apagado graceful
    ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
    defer cancel()
    
    server.SetKeepAlivesEnabled(false)
    if err := server.Shutdown(ctx); err != nil {
        log.Fatalf("Error durante el apagado del servidor: %v", err)
    }
    log.Println("Servidor detenido correctamente")
}

func handleUsers(w http.ResponseWriter, r *http.Request) {
    switch r.Method {
    case http.MethodGet:
        getUsers(w, r)
    case http.MethodPost:
        createUser(w, r)
    default:
        http.Error(w, "Método no permitido", http.StatusMethodNotAllowed)
    }
}

func getUsers(w http.ResponseWriter, r *http.Request) {
    users := []User{
        {ID: 1, Name: "Juan", Email: "juan@example.com"},
        {ID: 2, Name: "María", Email: "maria@example.com"},
    }

    w.Header().Set("Content-Type", "application/json")
    if err := json.NewEncoder(w).Encode(users); err != nil {
        http.Error(w, "Error al procesar la solicitud", http.StatusInternalServerError)
    }
}

func createUser(w http.ResponseWriter, r *http.Request) {
    var user User
    defer r.Body.Close()
    
    // Limitar el tamaño del cuerpo
    maxBytes := 1 << 20 // 1 MB
    r.Body = http.MaxBytesReader(w, r.Body, int64(maxBytes))
    
    body, err := io.ReadAll(r.Body)
    if err != nil {
        http.Error(w, "Cuerpo de solicitud demasiado grande", http.StatusRequestEntityTooLarge)
        return
    }
    
    if err := json.Unmarshal(body, &user); err != nil {
        http.Error(w, "Error al decodificar JSON", http.StatusBadRequest)
        return
    }
    
    // Validar datos
    if user.Name == "" || user.Email == "" {
        http.Error(w, "Nombre y email son requeridos", http.StatusBadRequest)
        return
    }
    
    // Simular guardado en base de datos
    user.ID = time.Now().Nanosecond()
    
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(user)
}
```

**Mejores prácticas incluidas:**

1. **Configuración segura del servidor:**
   - Timeouts apropiados (Read, Write, Idle)
   - Manejo de conexiones Keep-Alive
   - Apagado graceful

2. **Manejo de errores:**
   - Validación de entrada
   - Limitación del tamaño del request body
   - Manejo adecuado de códigos de estado HTTP

3. **Seguridad:**
   - Middleware de autenticación
   - Headers de seguridad (deberían agregarse más)
   - Validación de datos de entrada

4. **Performance:**
   - Uso de atomic para contadores concurrentes
   - Middleware de logging eficiente
   - Codificación JSON directa a la respuesta

5. **Mantenibilidad:**
   - Separación de responsabilidades
   - Middlewares reutilizables
   - Manejo centralizado de rutas

6. **Concurrencia segura:**
   - Uso de atomic para el contador
   - Manejadores stateless

**Prácticas recomendadas adicionales:**

1. **Seguridad avanzada:**

   ```go
   func securityHeadersMiddleware(next http.Handler) http.Handler {
       return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
           w.Header().Set("X-Content-Type-Options", "nosniff")
           w.Header().Set("X-Frame-Options", "DENY")
           w.Header().Set("Content-Security-Policy", "default-src 'self'")
           next.ServeHTTP(w, r)
       })
   }
   ```

2. **Manejo de CORS:**

   ```go
   func corsMiddleware(next http.Handler) http.Handler {
       return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
           w.Header().Set("Access-Control-Allow-Origin", "*")
           w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
           w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
           
           if r.Method == http.MethodOptions {
               w.WriteHeader(http.StatusNoContent)
               return
           }
           
           next.ServeHTTP(w, r)
       })
   }
   ```

3. **Rate Limiting:**

   ```go
   func rateLimitMiddleware(next http.Handler) http.Handler {
       limiter := NewLimiter(100) // 100 solicitudes por minuto
       return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
           if !limiter.Allow() {
               http.Error(w, "Límite de tasa excedido", http.StatusTooManyRequests)
               return
           }
           next.ServeHTTP(w, r)
       })
   }
   