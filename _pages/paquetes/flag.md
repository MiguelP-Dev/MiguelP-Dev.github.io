---
layout: default
title: flag | Miguel's Programing Notes
description: Guía del paquete flag de Go para procesamiento de argumentos
permalink: /paquetes/flag/
categories: paquetes
icon: 🚩
---

# Paquete `flag` en Go: Guía Completa con Ejemplos

El paquete `flag` en Go permite manejar argumentos de línea de comandos de forma estructurada. A continuación, se detallan sus funciones y métodos con ejemplos extensos y casos de uso realistas.

---

## Funciones para Definir Banderas

### 1. **`flag.Bool`**
**Descripción**: Define una bandera booleana (activa/desactiva).  
**Caso de Uso**: Controlar niveles de logging, características opcionales.

**Ejemplo Mejorado**:
```go
package main

import (
    "flag"
    "fmt"
    "log"
)

var (
    verbose = flag.Bool("verbose", false, "Habilita logging detallado")
    debug   = flag.Bool("debug", false, "Modo depuración (incluye trazas internas)")
)

func main() {
    flag.Parse()
    
    if *debug {
        log.SetFlags(log.LstdFlags | log.Lshortfile) // Formato detallado
        log.Println("[DEBUG] Iniciando en modo depuración")
    }
    
    if *verbose {
        fmt.Println("Configuración cargada:")
        fmt.Println(" - Usuario: admin")
        fmt.Println(" - Servidor: producción")
    }
    
    fmt.Println("Aplicación ejecutándose...")
}
```
**Uso**:
```bash
$ go run main.go -verbose -debug
```

---

### 2. **`flag.Int`**
**Descripción**: Define una bandera entera.  
**Caso de Uso**: Configurar puertos, límites de recursos.

**Ejemplo Mejorado**:
```go
package main

import (
    "flag"
    "fmt"
    "os"
)

var (
    port = flag.Int("port", 8080, "Puerto del servidor (rango: 1024-65535)")
)

func main() {
    flag.Parse()
    
    if *port < 1024 || *port > 65535 {
        fmt.Printf("Error: Puerto %d no válido\n", *port)
        os.Exit(1)
    }
    
    fmt.Printf("Servidor escuchando en 0.0.0.0:%d\n", *port)
    // Simulación: Iniciar servidor...
}
```
**Uso**:
```bash
$ go run main.go -port 3000
```

---

### 3. **`flag.String`**
**Descripción**: Define una bandera de texto.  
**Caso de Uso**: Rutas de archivos, mensajes personalizados.

**Ejemplo Mejorado**:
```go
package main

import (
    "flag"
    "fmt"
    "io/ioutil"
)

var (
    filePath = flag.String("file", "", "Ruta al archivo de configuración (requerido)")
)

func main() {
    flag.Parse()
    
    if *filePath == "" {
        fmt.Println("Error: Se requiere el flag -file")
        flag.PrintDefaults()
        return
    }
    
    data, err := ioutil.ReadFile(*filePath)
    if err != nil {
        fmt.Printf("Error leyendo archivo: %v\n", err)
        return
    }
    
    fmt.Printf("Contenido de %s:\n%s\n", *filePath, data)
}
```
**Uso**:
```bash
$ go run main.go -file config.yaml
```

---

### 4. **`flag.Float64`**
**Descripción**: Define una bandera de punto flotante.  
**Caso de Uso**: Parámetros matemáticos, umbrales.

**Ejemplo Mejorado**:
```go
package main

import (
    "flag"
    "fmt"
    "math"
)

var (
    threshold = flag.Float64("threshold", 0.5, "Umbral para activar alerta (0.0-1.0)")
)

func main() {
    flag.Parse()
    
    if *threshold < 0.0 || *threshold > 1.0 {
        fmt.Println("Error: El umbral debe estar entre 0 y 1")
        return
    }
    
    value := 0.7 // Simular valor leído de un sensor
    if value > *threshold {
        fmt.Printf("¡Alerta! Valor %.2f supera el umbral de %.2f\n", value, *threshold)
    }
}
```
**Uso**:
```bash
$ go run main.go -threshold 0.6
```

---

### 5. **`flag.Duration`**
**Descripción**: Define una bandera de tiempo (nanosegundos).  
**Caso de Uso**: Timeouts, intervalos de reintento.

**Ejemplo Mejorado**:
```go
package main

import (
    "flag"
    "fmt"
    "time"
)

var (
    timeout = flag.Duration("timeout", 5*time.Second, "Tiempo máximo de espera")
)

func main() {
    flag.Parse()
    
    fmt.Printf("Esperando máximo %s...\n", *timeout)
    
    // Simular una operación larga
    done := make(chan bool)
    go func() {
        time.Sleep(10 * time.Second)
        done <- true
    }()
    
    select {
    case <-done:
        fmt.Println("Operación completada")
    case <-time.After(*timeout):
        fmt.Println("Error: Timeout excedido")
    }
}
```
**Uso**:
```bash
$ go run main.go -timeout 10s
```

---

### 6. **`flag.Var`**
**Descripción**: Permite tipos personalizados.  
**Caso de Uso**: Listas, valores múltiples.

**Ejemplo Mejorado**:
```go
package main

import (
    "flag"
    "fmt"
    "strings"
)

type CSVList []string

func (list *CSVList) String() string {
    return strings.Join(*list, ", ")
}

func (list *CSVList) Set(value string) error {
    *list = append(*list, strings.Split(value, ",")...)
    return nil
}

var (
    users CSVList
)

func main() {
    flag.Var(&users, "users", "Lista de usuarios (separados por comas)")
    flag.Parse()
    
    if len(users) == 0 {
        fmt.Println("Error: Proporcione al menos un usuario")
        return
    }
    
    fmt.Println("Usuarios autorizados:")
    for _, user := range users {
        fmt.Printf(" - %s\n", strings.TrimSpace(user))
    }
}
```
**Uso**:
```bash
$ go run main.go -users "Alice,Bob,Charlie"
```

---

## Métodos Clave

### 1. **`flag.Parse()`**
**Descripción**: Procesa todas las banderas definidas.  
**Mejor Práctica**: Agrupar las flags en una estructura para claridad.

**Ejemplo**:
```go
type Config struct {
    Port    int
    Env     string
    Enable  bool
}

func loadConfig() Config {
    var cfg Config
    flag.IntVar(&cfg.Port, "port", 8080, "Puerto del servidor")
    flag.StringVar(&cfg.Env, "env", "dev", "Entorno (dev|prod|staging)")
    flag.BoolVar(&cfg.Enable, "enable", false, "Habilitar funcionalidad")
    flag.Parse()
    return cfg
}
```

---

### 2. **`flag.Args()`**
**Descripción**: Argumentos posicionales después de las banderas.  
**Caso de Uso**: Construir herramientas estilo CLI (ej: `git add <archivo>`).

**Ejemplo**:
```go
func main() {
    flag.Parse()
    files := flag.Args()
    
    if len(files) == 0 {
        fmt.Println("Error: Proporcione archivos a procesar")
        return
    }
    
    fmt.Println("Procesando archivos:")
    for _, file := range files {
        fmt.Printf(" - %s\n", file)
    }
}
```
**Uso**:
```bash
$ go run main.go -verbose file1.txt file2.txt
```

---

## Consejos y Buenas Prácticas
1. **Validación Temprana**: Verifica los valores de las flags después de `Parse()`.
2. **Documentación Clara**: Usa mensajes `usage` descriptivos.
3. **Flags Requeridas**: Implementa checks manuales si no son opcionales.
4. **Organización**: Agrupa flags relacionadas en structs.

---

Este enfoque no solo explica las funciones, sino que también muestra cómo integrarlas en aplicaciones reales, con manejo de errores y casos de uso prácticos.