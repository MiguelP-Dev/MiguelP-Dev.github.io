 ---
layout: default
title: Tests Unitarios con Go | Miguel's Programing Notes
description: Implementación de pruebas unitarias en Go usando el paquete testing
permalink: /ejemplos/tests/testing-con-go/
categories: ejemplos
icon: 🧪
destacado: true
---

# Tests unitarios con Go

El testing unitario en Go (Golang) es una práctica fundamental para asegurar la calidad del código.

## Introducción a los Testing Unitarios en Go

### 1. ¿Qué es un Test Unitario?

Un test unitario es una función que prueba una pequeña parte del código, generalmente una función individual, para asegurarse de que funciona correctamente. En Go, los tests unitarios se colocan en archivos que terminan en `_test.go`.

### 2. Estructura Básica de un Test

Go utiliza el paquete `testing` para realizar tests unitarios. A continuación, te muestro un ejemplo básico de cómo se escribe un test unitario:

```go
package main

import (
    "testing"
)

// Función a testear
func Suma(a, b int) int {
    return a + b
}

// Test unitario para la función Suma
func TestSuma(t *testing.T) {
    resultado := Suma(2, 3)
    esperado := 5

    if resultado != esperado {
        t.Errorf("Resultado incorrecto: obtuve %v, esperaba %v", resultado, esperado)
    }
}
```

### 3. Ejecutar Tests

Para ejecutar los tests, puedes usar el comando `go test` en la línea de comandos. Go ejecutará todos los archivos que terminan en `_test.go` y mostrará los resultados.

```sh
go test
```

### 4. Subtests y Table-Driven Tests

Go permite organizar los tests en subtests y usar un enfoque basado en tablas para probar múltiples casos con menos código repetitivo.

### Subtests

```go
func TestSuma(t *testing.T) {
    casos := []struct {
        nombre     string
        a, b, esperado int
    }{
        {"Suma positiva", 2, 3, 5},
        {"Suma negativa", -1, -2, -3},
    }

    for _, caso := range casos {
        t.Run(caso.nombre, func(t *testing.T) {
            resultado := Suma(caso.a, caso.b)
            if resultado != caso.esperado {
                t.Errorf("Para %s: obtuve %v, esperaba %v", caso.nombre, resultado, caso.esperado)
            }
        })
    }
}
```

### 5. Cobertura de Código

Puedes ver la cobertura de tu código con los tests utilizando el siguiente comando:

```sh
go test -cover
```

Esto mostrará un porcentaje de cuánto de tu código está siendo cubierto por los tests.

## Conclusión

Los tests unitarios son una parte esencial del desarrollo en Go. Te permiten asegurarte de que cada parte de tu código funciona como esperas y te facilitan mantener la calidad a medida que tu proyecto crece.
