---
layout: default
title: os | Miguel's Programing Notes
description: Guía del paquete os de Go para interacción con el sistema operativo
permalink: /paquetes/os/
categories: paquetes
icon: 💻
---

# Paquete `os` en Go: Guía Práctica con Ejemplos

El paquete `os` en Go permite interactuar con el sistema operativo, gestionando archivos, directorios, variables de entorno y procesos. Aquí se presenta una guía práctica con ejemplos y explicaciones detalladas.

---

## Funciones Clave y Ejemplos

### 1. **Abrir y Leer un Archivo (`os.Open`)**
```go
package main

import (
    "fmt"
    "os"
    "io"
)

func main() {
    file, err := os.Open("archivo.txt")
    if err != nil {
        fmt.Println("Error al abrir:", err)
        return
    }
    defer file.Close() // Siempre cerrar el archivo

    contenido, err := io.ReadAll(file)
    if err != nil {
        fmt.Println("Error al leer:", err)
        return
    }
    fmt.Println("Contenido:", string(contenido))
}
```
- **Nota**: Si el archivo no existe, `os.Open` retorna un error. Usa `defer` para cerrar el archivo después de su uso.

---

### 2. **Crear un Archivo (`os.Create`)**
```go
package main

import (
    "fmt"
    "os"
)

func main() {
    file, err := os.Create("nuevo.txt")
    if err != nil {
        fmt.Println("Error al crear:", err)
        return
    }
    defer file.Close()

    _, err = file.WriteString("Hola, mundo!")
    if err != nil {
        fmt.Println("Error al escribir:", err)
    }
    fmt.Println("Archivo creado y escrito.")
}
```
- **Advertencia**: Si el archivo ya existe, `os.Create` lo **sobrescribe**.

---

### 3. **Verificar Existencia de un Archivo (`os.Stat`)**
```go
func archivoExiste(nombre string) bool {
    _, err := os.Stat(nombre)
    return !os.IsNotExist(err)
}

func main() {
    if archivoExiste("archivo.txt") {
        fmt.Println("El archivo existe.")
    } else {
        fmt.Println("El archivo no existe.")
    }
}
```
- **Condición de carrera**: Entre la verificación y la operación, otro proceso podría modificar el archivo.

---

### 4. **Manejo de Directorios**
#### Crear Directorio (`os.Mkdir`):
```go
err := os.Mkdir("directorio", 0755)
if err != nil {
    fmt.Println("Error al crear directorio:", err)
}
```
- **Permisos**: `0755` permite al dueño leer, escribir y ejecutar, y a otros solo leer y ejecutar.

#### Listar Archivos en un Directorio (`os.ReadDir`):
```go
entries, err := os.ReadDir(".")
if err != nil {
    fmt.Println("Error al listar:", err)
    return
}
for _, entry := range entries {
    fmt.Println(entry.Name())
}
```

#### Eliminar Directorio (`os.Remove`):
```go
err := os.Remove("directorio")
if err != nil {
    fmt.Println("Error al eliminar:", err)
}
```

---

### 5. **Variables de Entorno**
#### Obtener una Variable (`os.Getenv`):
```go
path := os.Getenv("PATH")
fmt.Println("PATH:", path)
```

#### Establecer una Variable (`os.Setenv`):
```go
err := os.Setenv("MODO_DEBUG", "true")
if err != nil {
    fmt.Println("Error al establecer:", err)
}
```
- **Alcance**: Solo afecta al proceso actual y sus subprocesos.

---

### 6. **Renombrar/Mover Archivos (`os.Rename`)**
```go
err := os.Rename("viejo.txt", "nuevo.txt")
if err != nil {
    fmt.Println("Error al renombrar:", err)
}
```

---

### 7. **Terminar el Programa (`os.Exit`)**
```go
func main() {
    defer fmt.Println("¡Esto no se ejecutará!") // defer no se ejecuta con os.Exit
    os.Exit(1) // Código de salida 1 (error)
}
```
- **Advertencia**: `os.Exit` termina el programa inmediatamente, sin ejecutar `defer`.

---

## Mejores Prácticas

1. **Manejo de Errores**:
   - Verifica siempre los errores retornados por las funciones del paquete `os`.
   ```go
   file, err := os.Open("archivo.txt")
   if err != nil {
       log.Fatal("Error crítico:", err) // Registra y termina
   }
   ```

2. **Cierre de Recursos**:
   - Usa `defer` para cerrar archivos y liberar recursos.
   ```go
   file, _ := os.Open("archivo.txt")
   defer file.Close()
   ```

3. **Permisos de Archivos**:
   - Usa permisos seguros (ej: `0600` para archivos, `0755` para directorios).

4. **Evitar Condiciones de Carrera**:
   - En lugar de verificar si un archivo existe antes de crearlo, intenta crearlo directamente y maneja el error si falla.

---

## Ejemplo Integrado: Copiar un Archivo
```go
package main

import (
    "io"
    "os"
)

func copiarArchivo(origen, destino string) error {
    src, err := os.Open(origen)
    if err != nil {
        return err
    }
    defer src.Close()

    dst, err := os.Create(destino)
    if err != nil {
        return err
    }
    defer dst.Close()

    _, err = io.Copy(dst, src)
    return err
}

func main() {
    if err := copiarArchivo("origen.txt", "destino.txt"); err != nil {
        fmt.Println("Error al copiar:", err)
        os.Exit(1)
    }
    fmt.Println("Copia exitosa.")
}
```

---

El paquete `os` es esencial para interactuar con el sistema operativo en Go. Con estas funciones, puedes manipular archivos, directorios, variables de entorno y gestionar el ciclo de vida de tu aplicación. Practica estos ejemplos y asegúrate de manejar errores adecuadamente para crear aplicaciones robustas.