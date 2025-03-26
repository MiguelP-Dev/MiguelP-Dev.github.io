# Guía Completa del Paquete `time` en Go

## Introducción

El paquete `time` es uno de los paquetes fundamentales en el lenguaje de programación Go. Este paquete proporciona funcionalidades para medir, manipular y representar el tiempo de diversas formas. Desde obtener la hora actual hasta realizar operaciones complejas con fechas, el paquete `time` ofrece un conjunto robusto de herramientas para trabajar con información temporal.

En esta guía, examinaremos en profundidad las funciones más importantes del paquete `time`, exploraremos casos de uso prácticos y proporcionaremos ejemplos detallados que te ayudarán a comprender cómo implementar estas funcionalidades en tus aplicaciones Go.

## Fundamentos del Tiempo en Go

Antes de adentrarnos en las funciones específicas, es importante entender algunos conceptos fundamentales sobre cómo Go representa el tiempo:

- **Tipo `Time`**: Es el tipo principal del paquete, representa un instante en el tiempo con precisión de nanosegundos.
- **Tipo `Duration`**: Representa un intervalo de tiempo, también con precisión de nanosegundos.
- **Zonas horarias**: Go maneja zonas horarias a través del tipo `Location`.
- **Formato de referencia**: Go utiliza un enfoque único basado en la fecha "2006-01-02 15:04:05", donde cada número representa una parte específica de la fecha y hora.

## Funciones Principales del Paquete `time`

### 1. `time.Now()` - Obteniendo el Tiempo Actual

La función `Now()` es posiblemente la más utilizada del paquete `time`. Devuelve un valor de tipo `Time` que representa el instante actual.

#### Ejemplo Detallado de time.Now

```go
package main

import (
    "fmt"
    "time"
)

func main() {
    // Obtener el tiempo actual
    ahora := time.Now()
    
    // Mostrar la hora completa
    fmt.Println("Hora actual completa:", ahora)
    
    // Extraer componentes individuales
    fmt.Printf("Año: %d\n", ahora.Year())
    fmt.Printf("Mes: %s (%d)\n", ahora.Month(), int(ahora.Month()))
    fmt.Printf("Día: %d\n", ahora.Day())
    fmt.Printf("Hora: %d\n", ahora.Hour())
    fmt.Printf("Minuto: %d\n", ahora.Minute())
    fmt.Printf("Segundo: %d\n", ahora.Second())
    fmt.Printf("Nanosegundo: %d\n", ahora.Nanosecond())
    
    // Obtener el día de la semana
    fmt.Printf("Día de la semana: %s\n", ahora.Weekday())
    
    // Obtener información de la zona horaria
    zona, offset := ahora.Zone()
    fmt.Printf("Zona horaria: %s (offset: %d segundos)\n", zona, offset)
    
    // Verificar si estamos en horario de verano
    fmt.Printf("¿Horario de verano? %t\n", ahora.IsDST())
}
```

Este ejemplo no solo muestra la hora actual, sino que también ilustra cómo puedes acceder a los componentes individuales del tiempo y obtener información adicional como la zona horaria y si estamos en horario de verano.

### 2. `time.Parse()` - Analizando Cadenas de Tiempo

La función `Parse()` te permite convertir una cadena de texto que representa una fecha y hora en un valor de tipo `Time`. Esta función es especialmente útil cuando necesitas trabajar con fechas que provienen de entradas de usuario, APIs o archivos.

#### Formato de Referencia en Go

Go utiliza un enfoque único para el formato de tiempo. En lugar de códigos como `%Y` o `yyyy`, Go usa una fecha específica como referencia: **2006-01-02 15:04:05 -0700 MST**.

Aquí está el significado de cada componente:

- `2006`: Año (4 dígitos)
- `01`: Mes (2 dígitos)
- `02`: Día (2 dígitos)
- `15`: Hora en formato 24h (2 dígitos)
- `04`: Minuto (2 dígitos)
- `05`: Segundo (2 dígitos)
- `-0700`: Offset de zona horaria
- `MST`: Abreviatura de zona horaria

#### Ejemplo Extendido de parse

```go
package main

import (
    "fmt"
    "time"
)

func main() {
    // Varios formatos comunes
    formatos := map[string]string{
        "Fecha simple": "2006-01-02",
        "Fecha y hora": "2006-01-02 15:04:05",
        "ISO 8601": "2006-01-02T15:04:05Z07:00",
        "RFC 3339": time.RFC3339,
        "RFC 822": time.RFC822,
        "Formato personalizado": "02/01/2006 a las 15:04 horas",
    }
    
    // Cadena de tiempo para analizar
    timeStr := "2024-12-30 02:46:00"
    
    // Formato principal para este ejemplo
    layoutPrincipal := "2006-01-02 15:04:05"
    
    // Analizar la cadena de tiempo
    t, err := time.Parse(layoutPrincipal, timeStr)
    if err != nil {
        fmt.Println("Error al analizar el tiempo:", err)
        return
    }
    
    fmt.Println("Hora analizada:", t)
    fmt.Println("\nFormatos diferentes para la misma hora:")
    
    // Mostrar la misma hora en diferentes formatos
    for nombre, formato := range formatos {
        fmt.Printf("%s: %s\n", nombre, t.Format(formato))
    }
    
    // Análisis con zona horaria
    timeStrTZ := "2024-12-30T02:46:00+01:00"
    tTZ, err := time.Parse(time.RFC3339, timeStrTZ)
    if err != nil {
        fmt.Println("Error al analizar con zona horaria:", err)
    } else {
        fmt.Println("\nHora con zona horaria:", tTZ)
        fmt.Println("UTC:", tTZ.UTC())
    }
    
    // Manejo de formatos diversos
    ejemplosDiversos := []struct {
        formato string
        valor   string
    }{
        {"January 2, 2006", "December 30, 2024"},
        {"Jan 2, 2006 3:04 PM", "Dec 30, 2024 2:46 AM"},
        {"2006年01月02日", "2024年12月30日"},
        {"Monday, January 2, 2006", "Monday, December 30, 2024"},
    }
    
    fmt.Println("\nAnálisis de formatos diversos:")
    for _, ejemplo := range ejemplosDiversos {
        t, err := time.Parse(ejemplo.formato, ejemplo.valor)
        if err != nil {
            fmt.Printf("Error analizando '%s': %v\n", ejemplo.valor, err)
        } else {
            fmt.Printf("'%s' => %v\n", ejemplo.valor, t)
        }
    }
}
```

Este ejemplo muestra cómo analizar fechas en diferentes formatos, incluyendo formatos personalizados y estándares como RFC 3339. También ilustra cómo manejar zonas horarias durante el análisis.

### 3. `time.Format()` - Formateando el Tiempo

El método `Format()` permite convertir un valor de tipo `Time` en una cadena de texto formateada según tus necesidades. Utiliza el mismo sistema de formato de referencia que la función `Parse()`.

#### Ejemplo Extendido de format

```go
package main

import (
    "fmt"
    "time"
)

func main() {
    // Crear un tiempo específico para este ejemplo
    t := time.Date(2024, time.December, 30, 14, 35, 22, 0, time.Local)
    
    fmt.Println("Tiempo original:", t)
    
    // Formatos básicos
    fmt.Println("\nFormatos básicos:")
    fmt.Println("Solo fecha:", t.Format("2006-01-02"))
    fmt.Println("Solo hora:", t.Format("15:04:05"))
    fmt.Println("Fecha y hora:", t.Format("2006-01-02 15:04:05"))
    
    // Formatos con nombres
    fmt.Println("\nFormatos con nombres:")
    fmt.Println("Mes completo:", t.Format("2 de January de 2006"))
    fmt.Println("Mes abreviado:", t.Format("2 de Jan de 2006"))
    fmt.Println("Día de la semana:", t.Format("Monday, 2 de January de 2006"))
    
    // Formatos con AM/PM
    fmt.Println("\nFormatos con AM/PM:")
    fmt.Println("Hora 12h:", t.Format("3:04:05 PM"))
    
    // Formatos con zona horaria
    fmt.Println("\nFormatos con zona horaria:")
    fmt.Println("Con zona:", t.Format("2006-01-02 15:04:05 -0700"))
    fmt.Println("Con zona abreviada:", t.Format("2006-01-02 15:04:05 MST"))
    fmt.Println("RFC3339:", t.Format(time.RFC3339))
    
    // Formatos localizados (ejemplos)
    fmt.Println("\nFormatos localizados:")
    fmt.Println("Español:", t.Format("02/01/2006 a las 15:04 horas"))
    fmt.Println("US:", t.Format("January 2, 2006 at 3:04 PM"))
    fmt.Println("ISO:", t.Format("2006-01-02T15:04:05Z07:00"))
    
    // Formatos especiales
    fmt.Println("\nFormatos especiales:")
    fmt.Println("Año de 2 dígitos:", t.Format("06-01-02"))
    fmt.Println("Día del año:", t.Format("2006-01-02 (día 002)"))
    
    // Constantes de formato predefinidas
    fmt.Println("\nConstantes de formato predefinidas:")
    fmt.Println("ANSIC:", t.Format(time.ANSIC))
    fmt.Println("UnixDate:", t.Format(time.UnixDate))
    fmt.Println("RFC822:", t.Format(time.RFC822))
    fmt.Println("RFC850:", t.Format(time.RFC850))
    fmt.Println("RFC1123:", t.Format(time.RFC1123))
    fmt.Println("RFC3339Nano:", t.Format(time.RFC3339Nano))
    fmt.Println("Kitchen:", t.Format(time.Kitchen))
    
    // Uso práctico: generar nombre de archivo con timestamp
    fmt.Println("\nUso práctico:")
    nombreArchivo := fmt.Sprintf("backup_%s.zip", t.Format("20060102_150405"))
    fmt.Println("Nombre de archivo con timestamp:", nombreArchivo)
}
```

Este ejemplo muestra la versatilidad de `Format()` para crear representaciones de tiempo en una amplia variedad de formatos, desde los más básicos hasta formatos específicos para diferentes regiones o casos de uso.

### 4. `time.Sleep()` - Pausando la Ejecución

La función `Sleep()` pausa la ejecución de la goroutine actual durante la duración especificada. Es útil para implementar esperas, retrasos o simular operaciones que toman tiempo.

#### Ejemplo Extendido de sleep

```go
package main

import (
    "fmt"
    "time"
    "sync"
)

func main() {
    fmt.Println("Ejemplos de time.Sleep()")
    
    // Ejemplo básico
    fmt.Println("\n1. Ejemplo básico:")
    fmt.Println("Inicio")
    fmt.Println("Esperando 2 segundos...")
    time.Sleep(2 * time.Second)
    fmt.Println("Continuando después de 2 segundos")
    
    // Diferentes unidades de tiempo
    fmt.Println("\n2. Diferentes unidades de tiempo:")
    
    unidades := []struct {
        nombre string
        duracion time.Duration
    }{
        {"Nanosegundo", 1 * time.Nanosecond},
        {"Microsegundo", 1 * time.Microsecond},
        {"Milisegundo", 1 * time.Millisecond},
        {"Segundo", 1 * time.Second},
        {"Minuto", 1 * time.Minute}, // Solo simulado
        {"Hora", 1 * time.Hour},     // Solo simulado
    }
    
    for _, u := range unidades {
        if u.duracion >= time.Second {
            fmt.Printf("No vamos a esperar realmente %s, solo simulando\n", u.nombre)
            continue
        }
        
        inicio := time.Now()
        time.Sleep(u.duracion)
        duracionReal := time.Since(inicio)
        fmt.Printf("Sleep de 1 %s tomó: %v\n", u.nombre, duracionReal)
    }
    
    // Uso con goroutines
    fmt.Println("\n3. Sleep con goroutines:")
    
    var wg sync.WaitGroup
    
    for i := 1; i <= 3; i++ {
        wg.Add(1)
        go func(id int, delay time.Duration) {
            defer wg.Done()
            fmt.Printf("Goroutine %d: iniciando\n", id)
            time.Sleep(delay)
            fmt.Printf("Goroutine %d: finalizada después de %v\n", id, delay)
        }(i, time.Duration(i) * time.Second)
    }
    
    fmt.Println("Esperando a que todas las goroutines terminen...")
    wg.Wait()
    fmt.Println("Todas las goroutines han finalizado")
    
    // Implementando un temporizador simple
    fmt.Println("\n4. Implementando un temporizador simple:")
    
    duracion := 3 * time.Second
    fmt.Printf("Temporizador de %v iniciado\n", duracion)
    
    inicio := time.Now()
    time.Sleep(duracion)
    tiempoTranscurrido := time.Since(inicio)
    
    fmt.Printf("Temporizador finalizado después de %v\n", tiempoTranscurrido)
    
    // Limitaciones y consideraciones
    fmt.Println("\n5. Limitaciones y consideraciones:")
    fmt.Println("- Sleep no garantiza una precisión exacta")
    fmt.Println("- Para intervalos más precisos, considera time.Ticker")
    fmt.Println("- Sleep bloquea solo la goroutine actual, no toda la aplicación")
}
```

Este ejemplo explora varios aspectos de `time.Sleep()`, incluyendo su uso con diferentes unidades de tiempo, su interacción con goroutines, y consideraciones importantes sobre su precisión y comportamiento.

### 5. `time.After()` - Canal de Tiempo

La función `After()` es especialmente útil en patrones de concurrencia. Devuelve un canal que recibirá un valor después de la duración especificada, lo que permite implementar timeouts y otras operaciones basadas en tiempo en programas concurrentes.

#### Ejemplo Extendido de After

```go
package main

import (
    "fmt"
    "time"
)

func main() {
    fmt.Println("Ejemplos de time.After()")
    
    // Ejemplo básico
    fmt.Println("\n1. Uso básico:")
    fmt.Println("Esperando 2 segundos usando time.After()...")
    <-time.After(2 * time.Second)
    fmt.Println("Continuando después de 2 segundos")
    
    // Ejemplo con select
    fmt.Println("\n2. Uso con select para implementar un timeout:")
    
    // Simulamos un canal que podría recibir datos
    ch := make(chan string)
    
    // Goroutine que envía un mensaje después de 3 segundos
    go func() {
        time.Sleep(3 * time.Second)
        ch <- "¡Datos recibidos!"
    }()
    
    // Establecemos un timeout de 2 segundos
    fmt.Println("Esperando datos con un timeout de 2 segundos...")
    select {
    case msg := <-ch:
        fmt.Println("Recibido:", msg)
    case <-time.After(2 * time.Second):
        fmt.Println("Timeout! No se recibieron datos en 2 segundos")
    }
    
    // Limpiar el canal (para evitar fugas de memoria)
    go func() {
        for range ch {
            // Consumimos cualquier mensaje que llegue
        }
    }()
    
    // Ejemplo con múltiples timeouts
    fmt.Println("\n3. Múltiples operaciones con diferentes timeouts:")
    
    op1 := make(chan string)
    op2 := make(chan string)
    
    // Simulamos dos operaciones que toman diferentes tiempos
    go func() {
        time.Sleep(1 * time.Second)
        op1 <- "Operación 1 completada"
    }()
    
    go func() {
        time.Sleep(3 * time.Second)
        op2 <- "Operación 2 completada"
    }()
    
    // Esperamos resultados con diferentes timeouts
    for i := 0; i < 2; i++ {
        select {
        case resultado := <-op1:
            fmt.Println(resultado)
            op1 = nil // Evitamos recibir más de una vez
        case resultado := <-op2:
            fmt.Println(resultado)
            op2 = nil // Evitamos recibir más de una vez
        case <-time.After(2 * time.Second):
            fmt.Println("Timeout para alguna operación")
        }
    }
    
    // Consideraciones importantes
    fmt.Println("\n4. Consideraciones importantes:")
    fmt.Println("- Cada llamada a time.After() crea un nuevo timer")
    fmt.Println("- Para múltiples usos, time.NewTimer() es más eficiente")
    fmt.Println("- Los timers no utilizados eventualmente serán recogidos por el GC")
    
    // Comparación con time.Sleep()
    fmt.Println("\n5. Comparación con time.Sleep():")
    fmt.Println("- Sleep() bloquea la goroutine actual")
    fmt.Println("- After() permite continuar con otras operaciones")
    
    fmt.Println("\nEjemplo de operación no bloqueante:")
    inicio := time.Now()
    
    select {
    case <-time.After(1 * time.Second):
        fmt.Println("Timer completado")
    default:
        fmt.Println("Continuando inmediatamente sin esperar")
    }
    
    fmt.Printf("Tiempo transcurrido: %v\n", time.Since(inicio))
}
```

Este ejemplo muestra cómo `time.After()` se usa en situaciones concurrentes, especialmente con la instrucción `select` para implementar timeouts y operaciones asíncronas con límites de tiempo.

### 6. `time.NewTicker()` - Eventos Periódicos

La función `NewTicker()` crea un ticker que envía la hora actual en un canal a intervalos regulares. Es útil para operaciones periódicas como actualizaciones, comprobaciones de estado, o cualquier tarea que deba ejecutarse a intervalos fijos.

#### Ejemplo Extendido de NewTicker

```go
package main

import (
    "fmt"
    "time"
    "sync"
    "context"
)

func main() {
    fmt.Println("Ejemplos de time.NewTicker()")
    
    // Ejemplo básico
    fmt.Println("\n1. Uso básico:")
    ticker := time.NewTicker(500 * time.Millisecond)
    done := make(chan bool)
    
    go func() {
        // Recibimos 5 ticks y luego terminamos
        for i := 0; i < 5; i++ {
            t := <-ticker.C
            fmt.Printf("Tick %d a las %v\n", i+1, t.Format("15:04:05.000"))
        }
        done <- true
    }()
    
    <-done
    ticker.Stop()
    fmt.Println("Ticker detenido")
    
    // Uso con select
    fmt.Println("\n2. Uso con select:")
    ticker2 := time.NewTicker(1 * time.Second)
    stopCh := make(chan struct{})
    
    go func() {
        time.Sleep(5500 * time.Millisecond)
        close(stopCh)
    }()
    
    go func() {
        for {
            select {
            case t := <-ticker2.C:
                fmt.Printf("Tick a las %v\n", t.Format("15:04:05.000"))
            case <-stopCh:
                fmt.Println("Deteniendo el ticker...")
                ticker2.Stop()
                return
            }
        }
    }()
    
    // Esperamos a que termine
    <-stopCh
    time.Sleep(1 * time.Second) // Damos tiempo para que la goroutine imprima el mensaje final
    
    // Simulando un heartbeat
    fmt.Println("\n3. Simulando un heartbeat para monitoreo:")
    
    wg := sync.WaitGroup{}
    wg.Add(1)
    
    ctx, cancel := context.WithTimeout(context.Background(), 6*time.Second)
    defer cancel()
    
    go func() {
        defer wg.Done()
        
        heartbeat := time.NewTicker(1 * time.Second)
        defer heartbeat.Stop()
        
        estado := "En funcionamiento"
        fallaSimulada := time.After(3500 * time.Millisecond)
        
        for {
            select {
            case <-fallaSimulada:
                estado = "¡Alerta! Sistema degradado"
            case t := <-heartbeat.C:
                fmt.Printf("[%s] Estado del sistema: %s\n", 
                    t.Format("15:04:05"), estado)
            case <-ctx.Done():
                fmt.Println("Monitoreo finalizado.")
                return
            }
        }
    }()
    
    wg.Wait()
    
    // Creando un ticker personalizado con frecuencia variable
    fmt.Println("\n4. Ticker con frecuencia variable:")
    
    // Simulamos un ticker que aumenta su frecuencia gradualmente
    const inicialDelay = 1000
    const finalDelay = 200
    const pasos = 5
    
    wg.Add(1)
    go func() {
        defer wg.Done()
        
        delay := inicialDelay
        decremento := (inicialDelay - finalDelay) / pasos
        
        for i := 0; i < pasos; i++ {
            ticker := time.NewTicker(time.Duration(delay) * time.Millisecond)
            fmt.Printf("Ticker configurado a %d ms\n", delay)
            
            // Usamos el ticker por un tiempo
            timeout := time.After(3 * time.Duration(delay) * time.Millisecond)
            tickCount := 0
            
        tickLoop:
            for {
                select {
                case t := <-ticker.C:
                    tickCount++
                    fmt.Printf("  Tick #%d a %dms: %s\n", 
                        tickCount, delay, t.Format("15:04:05.000"))
                case <-timeout:
                    break tickLoop
                }
            }
            
            ticker.Stop()
            delay -= decremento
        }
    }()
    
    wg.Wait()
    
    // Consideraciones importantes
    fmt.Println("\n5. Consideraciones importantes:")
    fmt.Println("- Siempre detén un ticker cuando ya no lo necesites (ticker.Stop())")
    fmt.Println("- El canal de un ticker puede acumular ticks si no los consumes")
    fmt.Println("- Para una sola notificación, usa time.After() o time.NewTimer()")
    fmt.Println("- El ticker no es exactamente preciso en nanosegundos")
    fmt.Println("- Para intervalos variables, detén y crea nuevos tickers")
}
```

Este ejemplo explora diversos usos de `time.NewTicker()`, desde un uso básico hasta aplicaciones más avanzadas como la simulación de un sistema de monitoreo con heartbeats y la implementación de tickers con frecuencia variable.

### 7. `time.NewTimer()` - Eventos Programados

La función `NewTimer()` crea un temporizador que enviará la hora actual en su canal después de la duración especificada. A diferencia de `After()`, `NewTimer()` devuelve un objeto que puede ser detenido o reiniciado.

#### Ejemplo Extendido de NewTimer

```go
package main

import (
    "fmt"
    "time"
    "sync"
)

func main() {
    fmt.Println("Ejemplos de time.NewTimer()")
    
    // Ejemplo básico
    fmt.Println("\n1. Uso básico:")
    timer := time.NewTimer(2 * time.Second)
    
    fmt.Println("Timer iniciado a las", time.Now().Format("15:04:05"))
    t := <-timer.C
    fmt.Println("Timer completado a las", t.Format("15:04:05"))
    
    // Cancelación de un timer
    fmt.Println("\n2. Cancelando un timer:")
    timer2 := time.NewTimer(5 * time.Second)
    
    go func() {
        fmt.Println("Goroutine: Esperando al timer...")
        <-timer2.C
        fmt.Println("Goroutine: ¡Timer completado!")
    }()
    
    time.Sleep(2 * time.Second)
    
    if timer2.Stop() {
        fmt.Println("Timer cancelado con éxito")
    } else {
        fmt.Println("Timer ya estaba completado o cancelado")
        // Vaciamos el canal si ya había disparado
        select {
        case <-timer2.C:
        default:
        }
    }
    
    // Reinicio de un timer
    fmt.Println("\n3. Reiniciando un timer:")
    
    timer3 := time.NewTimer(1 * time.Second)
    fmt.Println("Timer inicial: 1 segundo a las", time.Now().Format("15:04:05"))
    
    // Esperar a que el timer dispare
    <-timer3.C
    fmt.Println("Timer disparado a las", time.Now().Format("15:04:05"))
    
    // Reiniciar con nueva duración
    if !timer3.Reset(2 * time.Second) {
        fmt.Println("Timer se reinició mientras estaba activo (raro)")
    } else {
        fmt.Println("Timer reiniciado con 2 segundos a las", time.Now().Format("15:04:05"))
    }
    
    // Esperar al timer reiniciado
    <-timer3.C
    fmt.Println("Timer reiniciado disparado a las", time.Now().Format("15:04:05"))
    
    // Comparación con time.After
    fmt.Println("\n4. Comparación con time.After():")
    fmt.Println("- NewTimer permite cancelar el timer")
    fmt.Println("- NewTimer puede ser reutilizado con Reset()")
    fmt.Println("- After() es más conveniente para un solo uso")
    
    // Ejemplo práctico: timeout para una operación
    fmt.Println("\n5. Implementando un timeout para operación:")
    
    operacionCh := make(chan string)
    timer4 := time.NewTimer(2 * time.Second)
    
    // Simulamos una operación lenta
    go func() {
        // Esta operación toma 3 segundos
        time.Sleep(3 * time.Second)
        operacionCh <- "Resultado de la operación"
    }()
    
    select {
    case resultado := <-operacionCh:
        fmt.Println("Operación completada:", resultado)
    case <-timer4.C:
        fmt.Println("Timeout: La operación tardó demasiado")
    }
    
    // Ejemplo avanzado: múltiples timers
    fmt.Println("\n6. Gestionando múltiples timers:")
    
    var wg sync.WaitGroup
    wg.Add(3)
    
    // Crear varios timers
    timers := []*time.Timer{
        time.NewTimer(1 * time.Second),
        time.NewTimer(2 * time.Second),
        time.NewTimer(3 * time.Second),
    }
    
    // Procesar cada timer en una goroutine
    for i, timer := range timers {
        go func(id int, t *time.Timer) {
            defer wg.Done()
            fmt.Printf("Timer %d: esperando...\n", id)
            <-t.C
            fmt.Printf("Timer %d: completado a las %s\n", 
                id, time.Now().Format("15:04:05.000"))
        }(i, timer)
    }
    
    // Cancelar el timer del medio
    time.Sleep(500 * time.Millisecond)
    if timers[1].Stop() {
        fmt.Println("Timer 1 cancelado")
        // Importante: señalizar a la goroutine que el timer fue cancelado
        // para que no quede bloqueada eternamente
        wg.Done() // Reducimos el contador porque una goroutine no recibirá señal
    }
    
    wg.Wait()
    fmt.Println("Todos los timers procesados")
}
```

Este ejemplo muestra cómo trabajar con `time.NewTimer()`, incluyendo operaciones avanzadas como cancelar y reiniciar timers, y la gestión de múltiples temporizadores. También explica las ventajas que ofrece sobre `time.After()`.

### 8. `time.Since()` - Midiendo el Tiempo Transcurrido

La función `Since()` es útil para medir el tiempo transcurrido desde un momento específico. Es especialmente valiosa para medir el rendimiento de funciones, operaciones o algoritmos.

#### Ejemplo Extendido de Since

```go
package main

import (
    "fmt"
    "math/rand"
    "sort"
    "time"
)

// Simulamos diferentes algoritmos de ordenamiento
func bubbleSort(items []int) {
    n := len(items)
    for i := 0; i < n; i++ {
        for j := 0; j < n-i-1; j++ {
            if items[j] > items[j+1] {
                items[j], items[j+1] = items[j+1], items[j]
            }
        }
    }
}

func insertionSort(items []int) {
    n := len(items)
    for i := 1; i < n; i++ {
        key := items[i]
        j := i - 1
        for j >= 0 && items[j] > key {
            items[j+1] = items[j]
            j-- 
        }
        items[j+1] = key
    }
}

func quickSort(items []int, low, high int) {
    if low < high {
        pi := partition(items, low, high)
        quickSort(items, low, pi-1)
        quickSort(items, pi+1, high)
    }
}

func partition(items []int, low, high int) int {
    pivot := items[high]
    i := low - 1

    for j := low; j < high; j++ {
        if items[j] <= pivot {
            i++
            items[i], items[j] = items[j], items[i]
        }
    }

    items[i+1], items[high] = items[high], items[i+1]
    return i + 1
}

func benchmarkSort(name string, f func([]int), size int) time.Duration {
    arr := generateRandomArray(size)
    start := time.Now()
    f(arr)
    elapsed := time.Since(start)
    fmt.Printf("%s took %s for array of size %d\n", name, elapsed, size)
    return elapsed
}

func generateRandomArray(size int) []int {
    arr := make([]int, size)
    for i := 0; i < size; i++ {
        arr[i] = rand.Intn(size * 10)
    }
    return arr
}

func main() {
    rand.Seed(time.Now().UnixNano())
    sizes := []int{1000, 5000, 10000}

    for _, size := range sizes {
        fmt.Printf("\nBenchmarking sorting algorithms with array size %d\n", size)
        fmt.Println("-----------------------------------------------")

        // Bubble Sort
        benchmarkSort("Bubble Sort", func(arr []int) {
            tempArr := make([]int, len(arr))
            copy(tempArr, arr)
            bubbleSort(tempArr)
        }, size)

        // Insertion Sort
        benchmarkSort("Insertion Sort", func(arr []int) {
            tempArr := make([]int, len(arr))
            copy(tempArr, arr)
            insertionSort(tempArr)
        }, size)

        // Quick Sort
        benchmarkSort("Quick Sort", func(arr []int) {
            tempArr := make([]int, len(arr))
            copy(tempArr, arr)
            quickSort(tempArr, 0, len(tempArr)-1)
        }, size)

        // Go's built-in Sort
        benchmarkSort("Go's sort.Ints", func(arr []int) {
            tempArr := make([]int, len(arr))
            copy(tempArr, arr)
            sort.Ints(tempArr)
        }, size)
    }
}
```
