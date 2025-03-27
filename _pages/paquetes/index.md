---
layout: default
title: Paquetes de Go | Miguel's Programing Notes
description: Documentación completa sobre los paquetes estándar de Go
permalink: /paquetes/
categories: paquetes
icon: 📦
---

# Paquetes de Go

Esta sección contiene información detallada sobre los paquetes estándar de Go más utilizados, con ejemplos prácticos, casos de uso y mejores prácticas.

## Paquetes Disponibles

<div class="grid-container">
{% assign sorted_pages = site.pages | where:"categories","paquetes" | where_exp:"page", "page.url != '/paquetes/'" | sort:"title" %}
{% for package in sorted_pages %}
    <a href="{{ package.url | relative_url }}" class="card">
        <div>
            <div class="card-icon">{{ package.icon | default: "📦" }}</div>
            <h3>{{ package.title | split: " | " | first }}</h3>
            <p>{{ package.description | default: "Documentación sobre el paquete" }}</p>
        </div>
    </a>
{% endfor %}
</div>

## Recursos Adicionales

- [Go Package Documentation](https://pkg.go.dev/std) - Documentación oficial de los paquetes estándar de Go
- [Go by Example](https://gobyexample.com/) - Ejemplos prácticos de Go
- [Go Tour](https://tour.golang.org/) - Tour interactivo de Go