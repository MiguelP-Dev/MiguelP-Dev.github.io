---
layout: default
title: Goroutines | Miguel's Programing Notes
description: Guía completa sobre el uso de goroutines en Go
permalink: /ejemplos/concurrentes/goroutines/
categories: ejemplos
icon: ⚡
destacado: true
---

# Aprendiendo Goroutines

## 1 Introducción a Goroutines

**`1.1 Conceptos básicos de Concurrencia y Paralelismo`**

La concurrencia y el paralelismo son dos conceptos comunes en la programación multi-hilos. Se utilizan para describir eventos o ejecuciones de programas que pueden ocurrir simultáneamente.

Concurrencia se refiere a múltiples tareas que se procesan en el mismo marco de tiempo, pero solo una tarea se ejecuta en un momento dado. Las tareas cambian rápidamente entre sí, dando al usuario la ilusión de una ejecución simultánea. La concurrencia es adecuada para procesadores de un solo núcleo.

Paralelismo se refiere a múltiples tareas que se ejecutan verdaderamente simultáneamente al mismo tiempo, lo cual requiere soporte de procesadores de varios núcleos.

El lenguaje Go está diseñado con la concurrencia en mente como uno de sus objetivos principales. Logra modelos eficientes de programación concurrente a través de Goroutines y Canales. La ejecución de las Goroutines es gestionada por el tiempo de ejecución de Go, y puede planificar estas Goroutines en múltiples hilos del sistema para lograr un procesamiento paralelo.

**`1.2 Goroutines en el lenguaje Go`**

Las Goroutines son el concepto principal para lograr la programación concurrente en el lenguaje Go. Son hilos livianos gestionados por el tiempo de ejecución de Go. Desde la perspectiva del usuario, son similares a los hilos, pero consumen menos recursos y se inician más rápidamente.

`Las características de las Goroutines incluyen:`

`Livianas:` Las Goroutines ocupan menos memoria de pila en comparación con los hilos tradicionales, y su tamaño de pila puede expandirse o contraerse dinámicamente según sea necesario.

`Bajo costo operativo:` El costo operativo de crear y destruir Goroutines es mucho menor que el de los hilos tradicionales.

`Mecanismo de comunicación simple:` Los Canales proporcionan un mecanismo de comunicación simple y efectivo entre las Goroutines.

`Diseño no bloqueante:` Las Goroutines no bloquean a otras Goroutines para ejecutarse en ciertas operaciones. Por ejemplo, mientras una Goroutine está esperando operaciones de E/S, otras Goroutines pueden continuar ejecutándose.

## 2 Creación y Gestión de Goroutines

**`2.1 Cómo Crear una Goroutine`**

En el lenguaje Go, puedes crear fácilmente una Goroutine usando la palabra clave go. Cuando precedes una llamada de función con la palabra clave go, la función se ejecutará de forma asíncrona en una nueva Goroutine.

`Veamos un ejemplo simple:`

```go
package main

import (
    "fmt"
    "time"
        )

// Define una función para imprimir Hola
func decirHola() {
    fmt.Println("Hola")
}

func main() {
    // Inicia una nueva Goroutine usando la palabra clave go
    go decirHola()

// La Goroutine principal espera un tiempo para permitir que decirHola se ejecute
    time.Sleep(1 * time.Second)
    fmt.Println("Función principal")
}
```

En el código anterior, la función `decirHola()` se ejecutará de forma asíncrona en una nueva Goroutine. Esto significa que la función `main()` no esperará a que termine `decirHola()` antes de continuar. Por lo tanto, usamos `time.Sleep` para pausar la Goroutine principal, permitiendo que se ejecute la instrucción de impresión en decirHola. Esto es solo con fines de demostración. En el desarrollo real, típicamente utilizamos canales u otros métodos de sincronización para coordinar la ejecución de diferentes Goroutines.

**Nota:** En aplicaciones prácticas, no se debe usar `time.Sleep()` para esperar a que termine una Goroutine, ya que no es un mecanismo de sincronización confiable.

**`2.2 Mecanismo de Programación de Goroutines`**

En Go, la programación de las Goroutines es manejada por el planificador del tiempo de ejecución de Go, que es responsable de asignar tiempo de ejecución en los procesadores lógicos disponibles. El planificador de Go utiliza la tecnología de programación M:N (múltiples Goroutines asignadas a múltiples hilos del sistema operativo) para lograr un mejor rendimiento en procesadores de varios núcleos.

**GOMAXPROCS y Procesadores Lógicos:**
`GOMAXPROCS` es una variable de entorno que define el número máximo de CPU disponibles para el planificador de tiempo de ejecución, con el valor predeterminado siendo el número de núcleos de CPU en la máquina. El tiempo de ejecución de Go asigna un hilo del sistema operativo para cada procesador lógico. Al establecer `GOMAXPROCS`, podemos restringir el número de núcleos utilizados por el tiempo de ejecución.

```go
import "runtime"

func init() {
    runtime.GOMAXPROCS(2)
}
```

El código anterior establece un máximo de dos núcleos para programar las Goroutines, incluso al ejecutar el programa en una máquina con más núcleos.

**Operación del Programador**
El programador funciona utilizando tres entidades importantes: M (máquina), P (procesador) y G (Goroutine). M representa una máquina o hilo, P representa el contexto de planificación y G representa una Goroutine específica.

**M:** Representa una máquina o hilo, sirviendo como una abstracción de los hilos del kernel del sistema operativo.

**P:** Representa los recursos necesarios para ejecutar una Goroutine. Cada P tiene una cola local de Goroutines.

**G:** Representa una Goroutine, incluyendo su pila de ejecución, conjunto de instrucciones y otra información.
Los principios de funcionamiento del programador de Go son:

M debe tener un P para ejecutar G. Si no hay un P, M será devuelto a la memoria caché del hilo.

Cuando G no está bloqueada por otras G (por ejemplo, en llamadas al sistema), se ejecuta en el mismo M tanto como sea posible, lo que ayuda a mantener los datos locales de G "calientes" para una utilización más eficiente de la caché de la CPU.

Cuando un G está bloqueada, M y P se separarán, y P buscará un nuevo M o despertará un nuevo M para atender a otros G.

```go
go func() {
    fmt.Println("Hola desde Goroutine")
}()
```

El código anterior demuestra cómo iniciar una nueva Goroutine, lo que llevará al programador a agregar esta nueva G a la cola para su ejecución.

**Programación Preventiva de Goroutines:**
En las etapas iniciales, Go usaba programación cooperativa, lo que significa que las Goroutines podían dejar sin recursos a otras Goroutines si se ejecutaban durante mucho tiempo sin ceder el control voluntariamente. Ahora, el programador de Go implementa programación preventiva, permitiendo pausar las G largas para darle la oportunidad a otras G de ejecutarse.

**`2.3 Gestión del Ciclo de Vida de Goroutines`**

Para garantizar la robustez y el rendimiento de tu aplicación Go, es crucial comprender y gestionar adecuadamente el ciclo de vida de las Goroutines. Iniciar Goroutines es sencillo, pero sin una gestión adecuada, pueden provocar problemas como fugas de memoria y condiciones de carrera.

**Iniciar Goroutines de forma segura:**
Antes de iniciar una Goroutine, asegúrate de comprender su carga de trabajo y características en tiempo de ejecución. Una Goroutine debe tener un inicio y fin claros para evitar crear "huérfanos de Goroutines" sin condiciones de terminación.

```go
func worker(done chan bool) {
    fmt.Println("Trabajando...")
    time.Sleep(time.Second) // simular tarea costosa
    fmt.Println("¡Trabajo terminado!")
    done <- true
}
```

```go
func main() {
    // Aquí se utiliza el mecanismo de canales en Go. Simplemente piensa en el canal como una cola de mensajes básica y utiliza el operador "<-" para leer y escribir datos en la cola.
    done := make(chan bool, 1)
    go worker(done)
    
    // Espera a que la Goroutine termine
    <-done
}
```

El código anterior muestra una forma de esperar a que una Goroutine termine utilizando el canal done.

**Nota:** Este ejemplo utiliza el mecanismo de canales en Go, que se detallará en capítulos posteriores.

Detener Goroutines
En general, el final del programa implícitamente terminará todas las Goroutines. Sin embargo, en servicios de larga duración, es posible que necesitemos detener activamente las Goroutines.

Usar canales para enviar señales de detención: Las Goroutines pueden sondear los canales para verificar señales de detención.

```go
stop := make(chan struct{})

go func() {
    for {
        select {
        case <-stop:
            fmt.Println("Se recibió la señal de detención. Apagando...")
            return
        default:
            // ejecutar operación normal
        }
    }
}()

// Enviar señal de detención
stop <- struct{}{}

// Usar el paquete context para gestionar el ciclo de vida:
ctx, cancel := context.WithCancel(context.Background())

go func(ctx context.Context) {
    for {
        select {
        case <-ctx.Done():
            fmt.Println("Se recibió la señal de detención. Apagando...")
            return
        default:
            // ejecutar operación normal
        }
    }
}(ctx)

// cuando desees detener la Goroutine
cancel()
```

El uso del paquete **`context`** permite un control más flexible de las Goroutines, proporcionando capacidades de tiempo de espera y cancelación. En aplicaciones grandes o microservicios, **`context`** es la forma recomendada de controlar los ciclos de vida de las Goroutines. 