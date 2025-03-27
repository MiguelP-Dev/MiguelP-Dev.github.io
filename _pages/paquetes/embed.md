---
layout: default
title: embed | Miguel's Programing Notes
description: Guía del paquete embed de Go para incrustación de archivos
permalink: /paquetes/embed/
categories: paquetes
icon: 📦
---

# Paquete embed en Go

El paquete `embed` en Go permite incrustar archivos y directorios en un binario Go. Este documento explora en profundidad sus características y casos de uso prácticos.

## 1. Conceptos Básicos

### 1.1 Directiva go:embed

La directiva `//go:embed` es fundamental para especificar qué archivos se deben incrustar.

```go
// filepath: ejemplos/embed/basic/main.go
package main

import (
    "embed"
    "fmt"
)

//go:embed hello.txt
var contenido string

//go:embed config.json
var configBytes []byte

//go:embed templates/*
var templates embed.FS

func main() {
    fmt.Printf("Contenido del archivo: %s\n", contenido)
    fmt.Printf("Bytes de configuración: %d bytes\n", len(configBytes))
}
```

```go
// filepath: ejemplos/embed/tipos/main.go
package main

import (
    "embed"
    "fmt"
)

// String para archivos de texto
//go:embed datos/texto.txt
var textoPlano string

// []byte para archivos binarios
//go:embed datos/imagen.png
var imagenBytes []byte

// embed.FS para múltiples archivos
//go:embed datos/* templates/*
var filesystem embed.FS

func main() {
    // Trabajar con string
    fmt.Printf("Contenido texto: %s\n", textoPlano)

    // Trabajar con []byte
    fmt.Printf("Tamaño imagen: %d bytes\n", len(imagenBytes))

    // Trabajar con embed.FS
    archivos, _ := filesystem.ReadDir("datos")
    for _, archivo := range archivos {
        fmt.Printf("Archivo encontrado: %s\n", archivo.Name())
    }
}
```

```go
// filepath: ejemplos/embed/config/main.go
package main

import (
    "embed"
    "encoding/json"
    "fmt"
    "log"
)

//go:embed configs/*.json
var configFiles embed.FS

type Config struct {
    Database struct {
        Host     string `json:"host"`
        Port     int    `json:"port"`
        User     string `json:"user"`
        Password string `json:"password"`
    } `json:"database"`
    Server struct {
        Port    int      `json:"port"`
        Hosts   []string `json:"hosts"`
        TLS     bool     `json:"tls"`
    } `json:"server"`
}

func LoadConfig(env string) (*Config, error) {
    fileName := fmt.Sprintf("configs/%s.json", env)
    data, err := configFiles.ReadFile(fileName)
    if (err != nil) {
        return nil, fmt.Errorf("error leyendo config: %w", err)
    }

    var config Config
    if err := json.Unmarshal(data, &config); err != nil {
        return nil, fmt.Errorf("error parseando config: %w", err)
    }

    return &config, nil
}

func main() {
    // Cargar configuración para diferentes entornos
    environments := []string{"development", "staging", "production"}

    for _, env := range environments {
        config, err := LoadConfig(env)
        if err != nil {
            log.Printf("Error cargando config %s: %v", env, err)
            continue
        }

        fmt.Printf("=== Configuración: %s ===\n", env)
        fmt.Printf("Database Host: %s\n", config.Database.Host)
        fmt.Printf("Server Port: %d\n", config.Server.Port)
    }
}
```

```go
// filepath: ejemplos/embed/assets/main.go
package main

import (
    "embed"
    "fmt"
    "image"
    _ "image/png"
    "io/fs"
)

//go:embed assets/*
var assets embed.FS

type AssetManager struct {
    fs embed.FS
}

func NewAssetManager(filesystem embed.FS) *AssetManager {
    return &AssetManager{fs: filesystem}
}

func (am *AssetManager) ListAssets(dir string) ([]string, error) {
    var files []string
    
    entries, err := am.fs.ReadDir(dir)
    if err != nil {
        return nil, fmt.Errorf("error listando directorio: %w", err)
    }

    for _, entry := range entries {
        if !entry.IsDir() {
            files = append(files, entry.Name())
        }
    }

    return files, nil
}

func (am *AssetManager) LoadImage(path string) (image.Image, error) {
    file, err := am.fs.Open(path)
    if err != nil {
        return nil, fmt.Errorf("error abriendo imagen: %w", err)
    }
    defer file.Close()

    img, _, err := image.Decode(file)
    if err != nil {
        return nil, fmt.Errorf("error decodificando imagen: %w", err)
    }

    return img, nil
}

func main() {
    manager := NewAssetManager(assets)

    // Listar assets
    files, err := manager.ListAssets("assets")
    if (err != nil) {
        panic(err)
    }

    fmt.Println("Assets encontrados:")
    for _, file := range files {
        fmt.Printf("- %s\n", file)
    }

    // Cargar una imagen
    img, err := manager.LoadImage("assets/logo.png")
    if (err != nil) {
        panic(err)
    }

    bounds := img.Bounds()
    fmt.Printf("\nDimensiones de la imagen: %dx%d\n", 
        bounds.Max.X, bounds.Max.Y)
}
```

### Ejemplos de Uso

1. **Incrustar un archivo de texto en una cadena**
   - **Descripción**: El contenido del archivo `mensaje.txt` se incrusta en la variable `mensaje`.
   - **Código**:
     ```go
     package main

     import (
         "embed"
         "fmt"
     )

     //go:embed mensaje.txt
     var mensaje string

     func main() {
         fmt.Println(mensaje)
     }
     ```

2. **Incrustar un archivo binario en un slice de bytes**
   - **Descripción**: El contenido del archivo `imagen.png` se incrusta en la variable `imagen`.
   - **Código**:
     ```go
     package main

     import (
         "embed"
         "fmt"
     )

     //go:embed imagen.png
     var imagen []byte

     func main() {
         fmt.Printf("La imagen tiene %d bytes\n", len(imagen))
     }
     ```

3. **Incrustar múltiples archivos en un sistema de archivos virtual**
   - **Descripción**: Todos los archivos en el directorio `templates` se incrustan en la variable `templates` de tipo `embed.FS`.
   - **Código**:
     ```go
     package main

     import (
         "embed"
         "fmt"
     )

     //go:embed templates/*
     var templates embed.FS

     func main() {
         data, err := templates.ReadFile("templates/template1.html")
         if err != nil {
             panic(err)
         }
         fmt.Println(string(data))
     }
     ```

### Explicación

1. **`//go:embed archivo.txt`**: Incrusta el contenido de `archivo.txt` en una variable.
2. **`string`**: Incrusta un archivo de texto como una cadena.
3. **`[]byte`**: Incrusta un archivo binario como un slice de bytes.
4. **`embed.FS`**: Incrusta múltiples archivos o directorios en un sistema de archivos virtual.

Estas herramientas proporcionan una manera poderosa y conveniente de incluir recursos estáticos directamente en los binarios de tu aplicación Go, eliminando la necesidad de llevar archivos externos junto con tu ejecutable.

Si tienes más preguntas o necesitas más detalles sobre el uso del paquete `embed`, ¡háblame! Estoy aquí para ayudarte.
