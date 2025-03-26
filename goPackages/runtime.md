# Paquete `runtime` en Go: Guía Práctica con Ejemplos y Explicaciones

El paquete `runtime` en Go ofrece herramientas para interactuar con el entorno de ejecución, incluyendo gestión de goroutines, memoria, y recursos del sistema. Aquí se presenta una guía detallada con ejemplos y mejores prácticas.

---

## Funciones Clave y Casos de Uso

### 1. **Obtener el Número de CPUs (`runtime.NumCPU()`)**

**Propósito**: Determinar la cantidad de núcleos lógicos disponibles.  
**Ejemplo**:

```go
package main

import (
    "fmt"
    "runtime"
)

func main() {
    numCPU := runtime.NumCPU()
    fmt.Println("Núcleos de CPU disponibles:", numCPU)
}
```

**Salida**:

```TEXT
Núcleos de CPU disponibles: 8
```

**Mejor Práctica**: Usa `runtime.GOMAXPROCS(runtime.NumCPU())` para maximizar el paralelismo en aplicaciones concurrentes.

---

### 2. **Configurar el Número de CPUs (`runtime.GOMAXPROCS()`)**

**Propósito**: Controlar cuántos hilos del sistema se usan para ejecutar goroutines.  
**Ejemplo**:

```go
func main() {
    prev := runtime.GOMAXPROCS(4) // Usar 4 núcleos
    defer runtime.GOMAXPROCS(prev) // Restaurar valor anterior al terminar
    fmt.Println("Configuración anterior de GOMAXPROCS:", prev)
}
```

**Recomendación**:

- Por defecto, Go usa todos los núcleos (`GOMAXPROCS = NumCPU()`).
- Ajustar manualmente solo en casos específicos (ej: limitar carga en servidores compartidos).

---

### 3. **Forzar Recolección de Basura (`runtime.GC()`)**

**Propósito**: Liberar memoria manualmente.  
**Ejemplo**:

```go
func main() {
    var memStats runtime.MemStats

    // Antes de GC
    runtime.ReadMemStats(&memStats)
    fmt.Println("Memoria antes de GC:", memStats.Alloc)

    // Liberar objetos
    data := make([]byte, 1000000)
    data = nil // Hacer el slice elegible para GC

    runtime.GC() // Forzar recolección

    // Después de GC
    runtime.ReadMemStats(&memStats)
    fmt.Println("Memoria después de GC:", memStats.Alloc)
}
```

**Salida**:

```text
Memoria antes de GC: 102456
Memoria después de GC: 65432
```

**Advertencia**: Evitar usarlo en producción a menos que sea estrictamente necesario.

---

### 4. **Terminar una Goroutine (`runtime.Goexit()`)**

**Propósito**: Finalizar una goroutine de manera controlada.  
**Ejemplo**:

```go
func worker() {
    defer fmt.Println("Goroutine finalizada")
    fmt.Println("Goroutine en ejecución")
    runtime.Goexit() // Termina esta goroutine
}

func main() {
    go worker()
    time.Sleep(time.Second) // Esperar para ver la salida
}
```

**Salida**:

```text
Goroutine en ejecución
Goroutine finalizada
```

**Nota**: `defer` se ejecuta antes de terminar la goroutine.

---

### 5. **Ceder el Procesador (`runtime.Gosched()`)**

**Propósito**: Permitir que otras goroutines se ejecuten.  
**Ejemplo**:

```go
func main() {
    go func() {
        for i := 0; i < 3; i++ {
            fmt.Println("Goroutine 1:", i)
            runtime.Gosched() // Ceder el control
        }
    }()

    go func() {
        for i := 0; i < 3; i++ {
            fmt.Println("Goroutine 2:", i)
            runtime.Gosched()
        }
    }()

    time.Sleep(time.Second)
}
```

**Salida** (ejemplo):

```text
Goroutine 1: 0
Goroutine 2: 0
Goroutine 1: 1
Goroutine 2: 1
...
```

**Uso Típico**: En bucles intensivos sin operaciones de E/S para evitar bloqueos.

---

### 6. **Contar Goroutines Activas (`runtime.NumGoroutine()`)**

**Propósito**: Monitorear el estado de concurrencia.  
**Ejemplo**:

```go
func main() {
    for i := 0; i < 5; i++ {
        go func() { time.Sleep(time.Minute) }()
    }
    time.Sleep(time.Second)
    fmt.Println("Goroutines activas:", runtime.NumGoroutine()) // 5 + main
}
```

**Salida**:

```text
Goroutines activas: 6
```

**Uso**: Detectar fugas de goroutines (valores inesperadamente altos).

---

### 7. **Obtener un Stack Trace (`runtime.Stack()`)**

**Propósito**: Depurar bloqueos o analizar ejecución.  
**Ejemplo**:

```go
func main() {
    buf := make([]byte, 1024)
    n := runtime.Stack(buf, true) // Capturar todas las goroutines
    fmt.Printf("Stack Trace:\n%s\n", buf[:n])
}
```

**Recomendación**: Usar un buffer grande (ej: 4096 bytes) para evitar truncamiento.

---

### 8. **Estadísticas de Memoria (`runtime.ReadMemStats()`)**

**Propósito**: Perfilar uso de memoria.  
**Ejemplo**:

```go
func main() {
    var memStats runtime.MemStats
    runtime.ReadMemStats(&memStats)
    
    fmt.Printf("Memoria usada: %d KB\n", memStats.Alloc / 1024)
    fmt.Printf("Memoria total asignada: %d KB\n", memStats.TotalAlloc / 1024)
    fmt.Printf("Número de GC ejecutadas: %d\n", memStats.NumGC)
}
```

**Campos Útiles**:

- `Alloc`: Memoria actualmente asignada.
- `HeapInuse`: Memoria en uso por el heap.
- `NumGC`: Veces que se ejecutó el GC.

---

## Mejores Prácticas

1. **Evitar `runtime.GC()` Manual**: Confía en el recolector automático a menos que tengas un motivo claro.
2. **Monitorear Goroutines**: Usa `runtime.NumGoroutine()` para detectar fugas.
3. **Ajustar `GOMAXPROCS` con Cautela**: Generalmente, el valor por defecto es óptimo.
4. **Usar `defer` en Goroutines**: Para limpiar recursos antes de `runtime.Goexit()`.
5. **Perfilar con `MemStats`**: Identifica patrones de uso de memoria en desarrollo.

---

## Ejemplo Integrado: Monitor de Rendimiento

```go
package main

import (
    "fmt"
    "runtime"
    "time"
)

func monitor() {
    var memStats runtime.MemStats
    for {
        runtime.ReadMemStats(&memStats)
        fmt.Printf(
            "Goroutines: %d | Memoria: %d KB | GCs: %d\n",
            runtime.NumGoroutine(),
            memStats.Alloc / 1024,
            memStats.NumGC,
        )
        time.Sleep(5 * time.Second)
    }
}

func main() {
    go monitor()
    
    // Simular carga
    for i := 0; i < 100; i++ {
        go func() { time.Sleep(time.Minute) }()
    }
    
    time.Sleep(time.Minute)
}
```

---

Con esta guía, podrás aprovechar el paquete `runtime` para optimizar y depurar aplicaciones Go, gestionando eficientemente recursos y concurrencia.
