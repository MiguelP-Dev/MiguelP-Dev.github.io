```go
package main

import (
	"fmt"
	"sync"
	"time"
)

// Task ejecuta una tarea que dura un tiempo especificado
func Task(nombre string, duracion int, wg *sync.WaitGroup) {
	// Si se proporciona un WaitGroup, notificar cuando termine
	if wg != nil {
		defer wg.Done()
	}
	
	tiempoInicio := time.Now()
	fmt.Printf("Tarea \"%s\" iniciada a las %s\n", nombre, tiempoInicio.Format("15:04:05"))
	fmt.Printf("Tarea \"%s\" durará %d segundos\n", nombre, duracion)
	
	time.Sleep(time.Duration(duracion) * time.Second)
	
	tiempoFin := time.Now()
	fmt.Printf("Tarea \"%s\" finalizada a las %s\n", nombre, tiempoFin.Format("15:04:05"))
}

func main() {
	fmt.Println("Iniciando el programa...")
	
	// Crear un WaitGroup para sincronizar las goroutines
	var wg sync.WaitGroup
	
	// Añadir 3 tareas al WaitGroup
	wg.Add(3)
	
	// Ejecutar las tareas A, B y C en paralelo mediante goroutines
	go Task("C", 3, &wg)
	go Task("B", 2, &wg)
	go Task("A", 1, &wg)
	
	// Esperar a que todas las tareas anteriores finalicen
	wg.Wait()
	
	// Una vez que todas han finalizado, ejecutar la tarea D
	Task("D", 1, nil)
	
	fmt.Println("Programa finalizado.")
}

```

He implementado el ejercicio solicitado en Golang, utilizando goroutines para lograr la ejecución asíncrona y concurrente. A continuación detallo los aspectos principales de la implementación:

1. **Función Task**: Es la función principal que:
   - Recibe un nombre, una duración en segundos y un puntero a WaitGroup
   - Registra el momento de inicio y muestra cuánto durará
   - Utiliza `time.Sleep()` para simular el trabajo durante el tiempo especificado
   - Registra el momento de finalización

2. **Ejecución concurrente**:
   - Se utiliza `sync.WaitGroup` para coordinar la ejecución de las goroutines
   - Las tareas A, B y C se ejecutan en paralelo mediante la palabra clave `go`
   - El programa espera a que todas finalicen con `wg.Wait()`
   - La tarea D se ejecuta de manera secuencial después de que las anteriores terminen

3. **Orden de ejecución**:
   - Las tareas C (3 segundos), B (2 segundos) y A (1 segundo) comienzan casi simultáneamente
   - La tarea D (1 segundo) comienza después de que las tres anteriores hayan terminado

En Golang, la concurrencia se maneja de manera nativa con goroutines, que son más ligeras que los hilos del sistema operativo, y WaitGroup nos permite sincronizar estas goroutines de manera eficiente.

El resultado del programa mostrará cómo las tareas A, B y C se inician casi al mismo tiempo, terminan según su duración (A primero, luego B, luego C), y finalmente se ejecuta la tarea D.