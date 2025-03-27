---
layout: default
title: API REST con Go | Miguel's Programing Notes
description: Ejemplos de implementación de APIs RESTful con Go
permalink: /ejemplos/api-rest/
categories: ejemplos
icon: 🔌
---

# APIs REST con Go

Esta sección contiene ejemplos de implementaciones de APIs RESTful con Go, desde servidores HTTP básicos hasta APIs completas con middlewares, rutas y manejo de autenticación.

## Ejemplos disponibles

<div class="grid-container">
{% assign api_rest_examples = site.pages | where:"categories","ejemplos" | where_exp:"page", "page.url contains '/ejemplos/api-rest/'" | where_exp:"page", "page.url != '/ejemplos/api-rest/'" | sort:"title" %}
{% for example in api_rest_examples %}
    <a href="{{ example.url | relative_url }}" class="card">
        <div>
            <div class="card-icon">{{ example.icon | default: "🔌" }}</div>
            <h3>{{ example.title | split: " | " | first }}</h3>
            <p>{{ example.description | default: "Ejemplo de API REST en Go" }}</p>
        </div>
    </a>
{% endfor %}
</div>

## Conceptos clave

### HTTP en Go
El paquete `net/http` de Go proporciona una API potente y flexible para crear servidores HTTP. A diferencia de otros lenguajes, Go no necesita frameworks adicionales para crear un servidor web robusto.

### Ventajas de Go para APIs REST
- **Rendimiento**: Go es un lenguaje compilado con excelente rendimiento
- **Concurrencia**: Las goroutines permiten manejar miles de conexiones simultáneas
- **Simplicidad**: API limpia y clara sin dependencias externas
- **Seguridad**: Fuerte tipado y manejo de errores explícito

### Estructura básica

```go
package main

import (
    "encoding/json"
    "log"
    "net/http"
)

func main() {
    http.HandleFunc("/api/hello", helloHandler)
    log.Fatal(http.ListenAndServe(":8080", nil))
}

func helloHandler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(map[string]string{
        "message": "¡Hola, mundo!",
    })
}
``` 