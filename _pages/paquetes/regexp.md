---
layout: default
title: regexp | Miguel's Programing Notes
description: Guía completa del paquete regexp de Go para expresiones regulares
permalink: /paquetes/regexp/
categories: paquetes
icon: 🔍
---

# Paquete `regexp` en Go: Guía Completa con Ejemplos

El paquete `regexp` en Go permite trabajar con expresiones regulares para buscar, validar y manipular texto. Aquí tienes una guía detallada con ejemplos prácticos:

---

## 1. **Compilar Expresiones Regulares**

### `Compile` y `MustCompile`

- **`Compile`**: Compila una expresión regular, retornando un error si es inválida.

```go
    re, err := regexp.Compile(`\d+`) // Busca números
    if err != nil {
        log.Fatal(err)
    }
```

- **`MustCompile`**: Útil para expresiones conocidas y válidas.

```go
    re := regexp.MustCompile(`\d+`) // Pánico si hay error
```

---

## 2. **Búsquedas Básicas**

### `MatchString`

Verifica si una cadena coincide con el patrón.

```go
matched := re.MatchString("El año 2023")
fmt.Println(matched) // true
```

### `FindString`

Encuentra la primera coincidencia.

```go
match := re.FindString("Precio: $1500")
fmt.Println(match) // "1500"
```

### `FindAllString`

Encuentra todas las coincidencias.

```go
matches := re.FindAllString("Tel: 555-1234, 555-5678", -1)
fmt.Println(matches) // [555 1234 555 5678]
```

---

## 3. **Extracción de Subgrupos**

### `FindStringSubmatch`

Captura grupos definidos con paréntesis `()`.

```go
re := regexp.MustCompile(`(\d{4})-(\d{2})-(\d{2})`) // Fecha YYYY-MM-DD
submatches := re.FindStringSubmatch("Fecha: 2023-10-25")
fmt.Println(submatches) // [2023-10-25 2023 10 25]
```

### `FindAllStringSubmatch`

Captura múltiples coincidencias con subgrupos.

```go
dates := re.FindAllStringSubmatch("Fechas: 2023-10-25 y 2024-01-01", -1)
for _, date := range dates {
    fmt.Printf("Año: %s, Mes: %s, Día: %s\n", date[1], date[2], date[3])
}
```

---

## 4. **Reemplazo de Texto**

### `ReplaceAllString`

Reemplaza todas las coincidencias.

```go
re := regexp.MustCompile(`\s+`) // Espacios en blanco
result := re.ReplaceAllString("Hola   mundo   Go", " ")
fmt.Println(result) // "Hola mundo Go"
```

### `ReplaceAllStringFunc`

Reemplazo personalizado con una función.

```go
re := regexp.MustCompile(`\b\w`)
result := re.ReplaceAllStringFunc("hello world", strings.ToUpper)
fmt.Println(result) // "Hello World"
```

---

## 5. **División de Cadenas**

### `Split`

Divide una cadena usando el patrón como separador.

```go
re := regexp.MustCompile(`[,;]\s*`) // Comas o puntos y coma
parts := re.Split("manzana, banana; pera", -1)
fmt.Println(parts) // [manzana banana pera]
```

---

## 6. **Índices de Coincidencias**

### `FindStringIndex`

Obtiene las posiciones de la primera coincidencia.

```go
re := regexp.MustCompile(`\d+`)
idx := re.FindStringIndex("ID: 12345")
fmt.Println(idx) // [4 9] (substring "12345")
```

### `FindAllStringIndex`

Posiciones de todas las coincidencias.

```go
indices := re.FindAllStringIndex("Números: 1, 2, 3", -1)
fmt.Println(indices) // [[9 10] [12 13] [15 16]]
```

---

## 7. **Validación de Patrones**

### Validar un email

```go
emailRe := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
email := "usuario@example.com"
valid := emailRe.MatchString(email)
fmt.Println("Email válido:", valid) // true
```

### Validar una URL

```go
urlRe := regexp.MustCompile(`^(https?://)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*/?$`)
url := "https://www.example.com/path"
valid := urlRe.MatchString(url)
```

---

## 8. **Mejores Prácticas**

1. **Reutilizar Expresiones Compiladas**:

   ```go
   var (
       dateRe = regexp.MustCompile(`\d{4}-\d{2}-\d{2}`)
       emailRe = regexp.MustCompile(`...`)
   )
   ```

2. **Evitar Compilar en Bucles**:

```go
    // ❌ Ineficiente
    for _, text := range textos {
        re := regexp.MustCompile(`...`)
        // ...
    }

    // ✅ Correcto
    re := regexp.MustCompile(`...`)
    for _, text := range textos {
        // ...
    }
```

3. **Usar Subgrupos con Moderación**:

- Los subgrupos impactan en el rendimiento. Úsalos solo cuando sean necesarios.

---

## Ejemplo Integrado: Procesamiento de Logs

```go
package main

import (
    "fmt"
    "regexp"
)

func main() {
    logEntry := `[ERROR] 2023-10-25 14:30:45 - Conexión fallida desde 192.168.1.1`
    re := regexp.MustCompile(`\[(\w+)\] (\d{4}-\d{2}-\d{2}) \d{2}:\d{2}:\d{2} - (.+) desde (\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})`)
    matches := re.FindStringSubmatch(logEntry)

    if len(matches) >= 5 {
        nivel := matches[1]
        fecha := matches[2]
        mensaje := matches[3]
        ip := matches[4]
        fmt.Printf("Nivel: %s\nFecha: %s\nMensaje: %s\nIP: %s\n", nivel, fecha, mensaje, ip)
    }
}
// Salida:
// Nivel: ERROR
// Fecha: 2023-10-25
// Mensaje: Conexión fallida
// IP: 192.168.1.1
```

---

Con esta guía, podrás aprovechar al máximo el paquete `regexp` en Go para tareas comunes como validación, extracción de datos y manipulación de texto. ¡Experimenta con estos ejemplos y adapta los patrones a tus necesidades!
