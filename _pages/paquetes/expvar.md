---
layout: default
title: expvar | Miguel's Programing Notes
description: Guía del paquete expvar de Go para exposición de variables
permalink: /paquetes/expvar/
categories: paquetes
icon: 📊
---

# Paquete expvar en Go

El paquete `expvar` proporciona una interfaz estandarizada para publicar variables en tiempo de ejecución que pueden ser accedidas mediante HTTP. Este documento explora sus características y usos prácticos.

## 1. Conceptos Básicos

### 1.1 Variables Exportadas

```go
// filepath: ejemplos/expvar/basic.go
package main

import (
    "expvar"
    "fmt"
    "net/http"
)

// Declaración de variables exportadas
var (
    solicitudes = expvar.NewInt("solicitudes_totales")
    errores     = expvar.NewInt("errores_totales")
    latencia    = expvar.NewFloat("latencia_promedio")
    últimaIP    = expvar.NewString("ultima_ip")
)

func main() {
    // Incrementar contador de solicitudes
    solicitudes.Add(1)
    
    // Establecer valor de latencia
    latencia.Set(0.127)
    
    // Actualizar última IP
    últimaIP.Set("192.168.1.1")
    
    // Iniciar servidor HTTP en puerto 8080
    http.ListenAndServe(":8080", nil)
}
```

### 1.2 Mapas Personalizados

```go
// filepath: ejemplos/expvar/maps.go
package main

import (
    "expvar"
    "time"
)

var (
    stats = expvar.NewMap("estadisticas")
    users = expvar.NewMap("usuarios_activos")
)

func inicializarEstadísticas() {
    // Inicializar contadores en el mapa
    stats.Add("solicitudes", 0)
    stats.Add("errores", 0)
    stats.Add("bytes_enviados", 0)
    
    // Actualizar usuarios activos
    users.Set("admin", &expvar.Int{})
    users.Set("invitado", &expvar.Int{})
}
```

## 2. Casos de Uso Avanzados

### 2.1 Monitor de Rendimiento

```go
// filepath: ejemplos/expvar/monitor.go
package main

import (
    "expvar"
    "runtime"
    "time"
)

type Métricas struct {
    goroutines *expvar.Int
    memoria    *expvar.Map
    gc         *expvar.Map
}

func NuevoMonitor() *Métricas {
    m := &Métricas{
        goroutines: expvar.NewInt("goroutines"),
        memoria:    expvar.NewMap("memoria"),
        gc:         expvar.NewMap("gc"),
    }

    // Inicializar métricas de memoria
    m.memoria.Set("heap_alloc", &expvar.Int{})
    m.memoria.Set("heap_sys", &expvar.Int{})
    m.memoria.Set("heap_idle", &expvar.Int{})
    
    // Inicializar métricas de GC
    m.gc.Set("num_gc", &expvar.Int{})
    m.gc.Set("pause_total", &expvar.Int{})
    
    return m
}

func (m *Métricas) Actualizar() {
    // Actualizar número de goroutines
    m.goroutines.Set(int64(runtime.NumGoroutine()))
    
    // Obtener estadísticas de memoria
    var memStats runtime.MemStats
    runtime.ReadMemStats(&memStats)
    
    // Actualizar métricas de memoria
    m.memoria.Get("heap_alloc").(*expvar.Int).Set(int64(memStats.HeapAlloc))
    m.memoria.Get("heap_sys").(*expvar.Int).Set(int64(memStats.HeapSys))
    m.memoria.Get("heap_idle").(*expvar.Int).Set(int64(memStats.HeapIdle))
    
    // Actualizar métricas de GC
    m.gc.Get("num_gc").(*expvar.Int).Set(int64(memStats.NumGC))
    m.gc.Get("pause_total").(*expvar.Int).Set(int64(memStats.PauseTotalNs))
}
```

### 2.2 Middleware HTTP con Métricas

```go
// filepath: ejemplos/expvar/middleware.go
package main

import (
    "expvar"
    "net/http"
    "time"
)

func métricasMiddleware(next http.Handler) http.Handler {
    // Contadores para el middleware
    solicitudesTotal := expvar.NewMap("http_metricas")
    solicitudesTotal.Add("total", 0)
    solicitudesTotal.Add("exito", 0)
    solicitudesTotal.Add("error", 0)
    
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        inicio := time.Now()
        
        // Registrar métricas antes de la solicitud
        solicitudesTotal.Add("total", 1)
        
        // Envolver ResponseWriter para capturar el código de estado
        wrapped := &responseWriter{ResponseWriter: w}
        
        // Ejecutar el handler
        next.ServeHTTP(wrapped, r)
        
        // Registrar métricas después de la solicitud
        if wrapped.status < 400 {
            solicitudesTotal.Add("exito", 1)
        } else {
            solicitudesTotal.Add("error", 1)
        }
        
        // Registrar latencia
        latencia := time.Since(inicio).Milliseconds()
        solicitudesTotal.Add("latencia_total_ms", latencia)
    })
}

type responseWriter struct {
    http.ResponseWriter
    status int
}

func (rw *responseWriter) WriteHeader(code int) {
    rw.status = code
    rw.ResponseWriter.WriteHeader(code)
}
```

## 3. Publicadores Personalizados

### 3.1 Implementación de Var

```go
// filepath: ejemplos/expvar/custom.go
package main

import (
    "expvar"
    "sync"
)

// CacheStats implementa la interfaz expvar.Var
type CacheStats struct {
    mu      sync.RWMutex
    hits    int64
    misses  int64
    ratio   float64
}

func (c *CacheStats) String() string {
    c.mu.RLock()
    defer c.mu.RUnlock()
    
    return fmt.Sprintf(`{"hits":%d,"misses":%d,"ratio":%f}`,
        c.hits, c.misses, c.ratio)
}

func (c *CacheStats) Add(hit bool) {
    c.mu.Lock()
    defer c.mu.Unlock()
    
    if hit {
        c.hits++
    } else {
        c.misses++
    }
    
    total := float64(c.hits + c.misses)
    if total > 0 {
        c.ratio = float64(c.hits) / total
    }
}
```

## 4. Mejores Prácticas

1. **Rendimiento**
   - Utilizar tipos atómicos para contadores simples
   - Evitar bloqueos innecesarios en operaciones de lectura
   - Considerar el impacto de la recolección frecuente de métricas

2. **Seguridad**
   - Proteger el endpoint `/debug/vars`
   - Limitar la información expuesta
   - Implementar autenticación cuando sea necesario

3. **Organización**
   - Agrupar métricas relacionadas en mapas
   - Usar nombres descriptivos y consistentes
   - Documentar el significado de cada métrica

## 5. Referencias

- [Documentación oficial de expvar](https://golang.org/pkg/expvar/)
- [Go blog: Profiling Go Programs](https://blog.golang.org/pprof)
