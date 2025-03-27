---
layout: default
title: Ejemplos de Go | Miguel's Programing Notes
description: Ejemplos prácticos y casos de uso de Go
permalink: /ejemplos/
categories: ejemplos
icon: 🧩
---

# Ejemplos de Go

Esta sección contiene ejemplos prácticos y casos de uso para diferentes escenarios de programación con Go, desde conceptos básicos hasta implementaciones avanzadas.

## Categorías

<div class="grid-container">
    <a href="/ejemplos/api-rest/" class="card">
        <div>
            <div class="card-icon">🔌</div>
            <h3>API REST</h3>
            <p>Implementaciones de APIs RESTful con Go</p>
        </div>
    </a>
    <a href="/ejemplos/concurrentes/" class="card">
        <div>
            <div class="card-icon">⚡</div>
            <h3>Programación Concurrente</h3>
            <p>Ejemplos de goroutines, channels y patrones concurrentes</p>
        </div>
    </a>
    <a href="/ejemplos/tests/" class="card">
        <div>
            <div class="card-icon">🧪</div>
            <h3>Test Unitarios</h3>
            <p>Prácticas de testing en Go</p>
        </div>
    </a>
</div>

## Ejemplos Destacados

{% assign ejemplos_destacados = site.pages | where:"categories","ejemplos" | where_exp:"page", "page.destacado" | sort:"title" %}
{% for ejemplo in ejemplos_destacados limit:6 %}
    <a href="{{ ejemplo.url | relative_url }}" class="card">
        <div>
            <div class="card-icon">{{ ejemplo.icon | default: "🧩" }}</div>
            <h3>{{ ejemplo.title | split: " | " | first }}</h3>
            <p>{{ ejemplo.description | default: "Ejemplo de código Go" }}</p>
        </div>
    </a>
{% endfor %}

## Todos los Ejemplos

{% assign todos_ejemplos = site.pages | where:"categories","ejemplos" | where_exp:"page", "page.url != '/ejemplos/'" | sort:"title" %}
<ul class="lista-ejemplos">
{% for ejemplo in todos_ejemplos %}
    <li><a href="{{ ejemplo.url | relative_url }}">{{ ejemplo.title | split: " | " | first }}</a></li>
{% endfor %}
</ul> 