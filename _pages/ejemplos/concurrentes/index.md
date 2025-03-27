---
layout: default
title: Programación Concurrente en Go | Miguel's Programing Notes
description: Ejemplos de programación concurrente con goroutines y channels en Go
permalink: /ejemplos/concurrentes/
categories: ejemplos
icon: ⚡
---

# Programación Concurrente en Go

Go es conocido por su excelente soporte para la programación concurrente con goroutines y channels. Esta sección contiene ejemplos prácticos de cómo utilizar estas características para crear programas concurrentes eficientes.

## Ejemplos disponibles

<div class="grid-container">
{% assign concurrent_examples = site.pages | where:"categories","ejemplos" | where_exp:"page", "page.url contains '/ejemplos/concurrentes/'" | where_exp:"page", "page.url != '/ejemplos/concurrentes/'" | sort:"title" %}
{% for example in concurrent_examples %}
    <a href="{{ example.url | relative_url }}" class="card">
        <div>
            <div class="card-icon">{{ example.icon | default: "⚡" }}</div>
            <h3>{{ example.title | split: " | " | first }}</h3>
            <p>{{ example.description | default: "Ejemplo de concurrencia en Go" }}</p>
        </div>
    </a>
{% endfor %}
</div>

## Conceptos clave

### Goroutines
Las goroutines son funciones que se ejecutan concurrentemente con otras goroutines en el mismo espacio de direcciones. Son mucho más livianas que los hilos del sistema operativo, lo que permite crear miles de goroutines sin un impacto significativo en el rendimiento.

### Channels
Los channels son conductos tipados a través de los cuales se pueden enviar y recibir valores con la operación de canal. Por defecto, el envío y la recepción bloquean hasta que el otro lado esté listo, lo que permite la sincronización sin locks explícitos.

### Patrones de concurrencia
Go fomenta un enfoque de "compartir memoria mediante la comunicación" en lugar de "comunicación mediante la memoria compartida", lo que reduce los problemas comunes asociados con la programación concurrente.

### Ejemplo básico

```go
package main

import (
    "fmt"
    "time"
)

func worker(id int, jobs <-chan int, results chan<- int) {
    for j := range jobs {
        fmt.Printf("Trabajador %d procesando trabajo %d\n", id, j)
        time.Sleep(time.Second) // Simular trabajo
        results <- j * 2
    }
}

func main() {
    const numJobs = 5
    jobs := make(chan int, numJobs)
    results := make(chan int, numJobs)

    // Iniciar 3 workers
    for w := 1; w <= 3; w++ {
        go worker(w, jobs, results)
    }

    // Enviar trabajos
    for j := 1; j <= numJobs; j++ {
        jobs <- j
    }
    close(jobs)

    // Recoger resultados
    for a := 1; a <= numJobs; a++ {
        <-results
    }
}
``` 