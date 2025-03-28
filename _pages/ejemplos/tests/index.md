---
layout: default
title: Testing en Go | Miguel's Programing Notes
description: Ejemplos de implementación de tests unitarios en Go
permalink: /ejemplos/tests/
categories: ejemplos
icon: 🧪
---

# Testing en Go

Go incluye un framework de testing simple pero potente en su biblioteca estándar. Esta sección muestra cómo realizar diferentes tipos de pruebas en Go, desde tests unitarios básicos hasta benchmarks y tests de integración.

## Ejemplos disponibles
<div class="grid-container">
{% assign test_examples = site.pages | where:"categories","ejemplos" | where_exp:"page", "page.url contains '/ejemplos/tests/'" | where_exp:"page", "page.url != '/ejemplos/tests/'" | sort:"title" %}
{% for example in test_examples %}
    <a href="{{ example.url | relative_url }}" class="card">
        <div>
            <div class="card-icon">{{ example.icon | default: "🧪" }}</div>
            <h3>{{ example.title | split: " | " | first }}</h3>
            <p>{{ example.description | default: "Ejemplo de testing en Go" }}</p>
        </div>
    </a>
{% endfor %}
</div>

## Conceptos clave

### Tests unitarios
Los tests unitarios en Go se escriben utilizando el paquete `testing` y se colocan en archivos con el sufijo `_test.go`. El comando `go test` ejecuta automáticamente estos tests.

### Table-driven tests
Un patrón común en Go es el uso de "table-driven tests", donde se define una tabla de casos de prueba y se itera sobre ellos para realizar las pruebas.

### Benchmarks
Go permite medir el rendimiento del código utilizando benchmarks, que son funciones de prueba especiales que se ejecutan múltiples veces para obtener mediciones estadísticas.

### Mocks y stubs
Para tests que requieren aislar componentes, Go utiliza interfaces para facilitar la creación de mocks y stubs.

### Ejemplo básico

```go
package main

import "testing"

func Suma(a, b int) int {
    return a + b
}

func TestSuma(t *testing.T) {
    cases := []struct {
        a, b, esperado int
        nombre         string
    }{
        {1, 2, 3, "positivos"},
        {-1, -2, -3, "negativos"},
        {0, 0, 0, "ceros"},
    }

    for _, c := range cases {
        t.Run(c.nombre, func(t *testing.T) {
            resultado := Suma(c.a, c.b)
            if resultado != c.esperado {
                t.Errorf("Suma(%d, %d) = %d; esperado %d", 
                    c.a, c.b, resultado, c.esperado)
            }
        })
    }
}
``` 