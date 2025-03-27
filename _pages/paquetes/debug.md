---
layout: default
title: debug | Miguel's Programing Notes
description: Guía del paquete runtime/debug de Go para depuración
permalink: /paquetes/debug/
categories: paquetes
icon: 🔍
---

# Paquete runtime/debug en Go

El paquete `runtime/debug` proporciona funcionalidades avanzadas para depurar y controlar el comportamiento del runtime de Go. Este documento explora en detalle sus características y casos de uso prácticos.

## 1. Funciones de Stack Trace

### 1.1 Impresión de Stack Trace

```go
// filepath: ejemplos/debug/stack_trace.go
package main

import (
    "runtime/debug"
    "fmt"
    "os"
)

func funcionC() {
    debug.PrintStack()
}

func funcionB() {
    funcionC()
}

func funcionA() {
    funcionB()
}

func main() {
    // Ejemplo básico de PrintStack
    fmt.Println("=== PrintStack ===")
    funcionA()

    // Ejemplo de Stack con formato personalizado
    fmt.Println("\n=== Stack personalizado ===")
    stack := debug.Stack()
    os.Stdout.Write(stack)

    // Ejemplo con información adicional
    fmt.Println("\n=== Stack con metadata ===")
    fmt.Printf("Goroutine actual: %d\n", debug.Stack())
}
```

### 1.2 Captura de Stack en Panic

```go
// filepath: ejemplos/debug/panic_handler.go
package main

import (
    "runtime/debug"
    "fmt"
    "log"
    "os"
)

func recuperadorPanic() {
    if r := recover(); r != nil {
        // Crear archivo de log
        f, err := os.Create("crash.log")
        if err != nil {
            log.Fatal(err)
        }
        defer f.Close()

        // Escribir información del panic
        fmt.Fprintf(f, "Panic: %v\n\n", r)
        fmt.Fprintf(f, "Stack Trace:\n")
        f.Write(debug.Stack())
    }
}

func funcionProblematica() {
    defer recuperadorPanic()
    
    // Simular un panic
    panic("¡Algo salió mal!")
}
```

## 2. Gestión de Memoria

### 2.1 Monitor de Uso de Memoria

```go
// filepath: ejemplos/debug/memory_monitor.go
package main

import (
    "runtime/debug"
    "fmt"
    "time"
)

type MemoryStats struct {
    Alloc      uint64
    TotalAlloc uint64
    Sys        uint64
    NumGC      uint32
    PauseTotal time.Duration
}

func monitorearMemoria(intervalo time.Duration) {
    ticker := time.NewTicker(intervalo)
    defer ticker.Stop()

    for range ticker.C {
        var stats debug.GCStats
        debug.ReadGCStats(&stats)

        fmt.Printf("\n=== Estadísticas de Memoria ===\n")
        fmt.Printf("Última GC: %v\n", stats.LastGC)
        fmt.Printf("Num GC: %d\n", stats.NumGC)
        fmt.Printf("Pausa Total GC: %v\n", stats.PauseTotal)
        fmt.Printf("Pausas GC: %v\n", stats.Pause)
        fmt.Printf("PauseEnd: %v\n", stats.PauseEnd)
    }
}
```

### 2.2 Optimizador de Memoria

```go
// filepath: ejemplos/debug/memory_optimizer.go
package main

import (
    "runtime/debug"
    "fmt"
    "time"
)

type MemoryOptimizer struct {
    gcPercent      int
    maxStackSize   int
    cleanupEnabled bool
}

func NewMemoryOptimizer() *MemoryOptimizer {
    return &MemoryOptimizer{
        gcPercent:      100,
        maxStackSize:   1 << 20, // 1MB
        cleanupEnabled: true,
    }
}

func (mo *MemoryOptimizer) Optimize() {
    // Configurar GC
    oldGCPercent := debug.SetGCPercent(mo.gcPercent)
    fmt.Printf("GC Percent cambiado de %d a %d\n", oldGCPercent, mo.gcPercent)

    // Configurar tamaño máximo de stack
    oldStackSize := debug.SetMaxStack(mo.maxStackSize)
    fmt.Printf("Max Stack Size cambiado de %d a %d\n", oldStackSize, mo.maxStackSize)

    // Programar limpieza periódica
    if mo.cleanupEnabled {
        go mo.scheduleCleanup()
    }
}

func (mo *MemoryOptimizer) scheduleCleanup() {
    ticker := time.NewTicker(5 * time.Minute)
    defer ticker.Stop()

    for range ticker.C {
        debug.FreeOSMemory()
        fmt.Println("Limpieza de memoria realizada")
    }
}
```

## 3. Configuración Avanzada

### 3.1 Gestor de Threads

```go
// filepath: ejemplos/debug/thread_manager.go
package main

import (
    "runtime/debug"
    "fmt"
    "sync"
)

type ThreadManager struct {
    maxThreads int
    mu         sync.Mutex
}

func NewThreadManager(maxThreads int) *ThreadManager {
    return &ThreadManager{
        maxThreads: maxThreads,
    }
}

func (tm *ThreadManager) Configure() {
    tm.mu.Lock()
    defer tm.mu.Unlock()

    oldMax := debug.SetMaxThreads(tm.maxThreads)
    fmt.Printf("Número máximo de threads cambiado de %d a %d\n", oldMax, tm.maxThreads)
}

func (tm *ThreadManager) RunWithThreadLimit(tasks []func()) {
    var wg sync.WaitGroup
    semaphore := make(chan struct{}, tm.maxThreads)

    for _, task := range tasks {
        wg.Add(1)
        go func(t func()) {
            defer wg.Done()
            semaphore <- struct{}{}
            defer func() { <-semaphore }()
            t()
        }(task)
    }

    wg.Wait()
}
```

## 4. Utilidades de Depuración

### 4.1 Logger Personalizado

```go
// filepath: ejemplos/debug/custom_logger.go
package main

import (
    "runtime/debug"
    "fmt"
    "time"
    "os"
    "path/filepath"
)

type DebugLogger struct {
    logDir string
    prefix string
}

func NewDebugLogger(logDir, prefix string) (*DebugLogger, error) {
    if err := os.MkdirAll(logDir, 0755); err != nil {
        return nil, err
    }

    return &DebugLogger{
        logDir: logDir,
        prefix: prefix,
    }, nil
}

func (dl *DebugLogger) LogWithStack(message string) error {
    filename := filepath.Join(dl.logDir, 
        fmt.Sprintf("%s_%s.log", dl.prefix, time.Now().Format("20060102_150405")))

    f, err := os.Create(filename)
    if err != nil {
        return err
    }
    defer f.Close()

    fmt.Fprintf(f, "=== %s ===\n", message)
    fmt.Fprintf(f, "Timestamp: %s\n", time.Now().Format(time.RFC3339))
    fmt.Fprintf(f, "\nStack Trace:\n")
    f.Write(debug.Stack())

    return nil
}
```

## 5. Mejores Prácticas

1. **Gestión de Memoria**
   - Monitorear el uso de memoria regularmente
   - Ajustar parámetros de GC según necesidades
   - Implementar limpieza periódica

2. **Debug en Producción**
   - Capturar y almacenar stack traces
   - Implementar recuperación de panics
   - Mantener logs detallados

3. **Optimización**
   - Ajustar límites de threads
   - Configurar tamaños de stack apropiados
   - Monitorear estadísticas de GC

## 6. Referencias

- [Documentación oficial de runtime/debug](https://golang.org/pkg/runtime/debug/)
- [Effective Go - Runtime y Depuración](https://golang.org/doc/effective_go.html)
- [Go Memory Management](https://povilasv.me/go-memory-management/)
