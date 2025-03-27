---
layout: default
title: plugin | Miguel's Programing Notes
description: Guía del paquete plugin de Go para carga dinámica de módulos
permalink: /paquetes/plugin/
categories: paquetes
icon: 🔌
---

# Paquete `plugin` en Go: Guía Práctica con Ejemplos y Consideraciones

El paquete `plugin` en Go permite cargar módulos compilados dinámicamente (`.so` en Linux/macOS) para extender aplicaciones en tiempo de ejecución. A continuación, se presenta una guía detallada con ejemplos, mejores prácticas y advertencias clave.

---

## Requisitos y Limitaciones
- **Sistemas soportados**: Linux, macOS (no soportado oficialmente en Windows).
- **Versión de Go**: El plugin y el programa principal deben compilarse con la misma versión de Go y flags.
- **Dependencias**: Los plugins deben compartir las mismas dependencias que el programa principal.

---

## Ejemplo Básico: Crear y Usar un Plugin

### 1. Crear el Plugin (`mi_plugin.go`)
```go
// mi_plugin.go
package main

import "fmt"

// Exportar una función (nombre en mayúscula)
func Saludar() string {
    return "¡Hola desde el plugin!"
}

// main() no es necesario, pero se puede incluir
func main() {
    fmt.Println("Este es un plugin de ejemplo.")
}
```

### 2. Compilar el Plugin
```bash
go build -buildmode=plugin -o mi_plugin.so mi_plugin.go
```

### 3. Cargar el Plugin en el Programa Principal
```go
// main.go
package main

import (
    "fmt"
    "plugin"
)

func main() {
    // 1. Cargar el plugin
    p, err := plugin.Open("mi_plugin.so")
    if err != nil {
        fmt.Println("Error al abrir el plugin:", err)
        return
    }

    // 2. Buscar la función "Saludar"
    sym, err := p.Lookup("Saludar")
    if err != nil {
        fmt.Println("Error al buscar el símbolo:", err)
        return
    }

    // 3. Convertir el símbolo a una función
    saludarFunc, ok := sym.(func() string)
    if !ok {
        fmt.Println("Error: Tipo de función incorrecto")
        return
    }

    // 4. Ejecutar la función del plugin
    fmt.Println(saludarFunc()) // Output: ¡Hola desde el plugin!
}
```

---

## Casos de Uso Avanzados

### 1. Variables Exportadas en el Plugin
```go
// Plugin
var Version = "1.0.0"

// Programa principal
sym, _ := p.Lookup("Version")
version := *sym.(*string)
fmt.Println("Versión del plugin:", version) // 1.0.0
```

### 2. Funciones con Parámetros y Retorno
```go
// Plugin
func Sumar(a, b int) int {
    return a + b
}

// Programa principal
sym, _ := p.Lookup("Sumar")
sumarFunc := sym.(func(int, int) int)
fmt.Println(sumarFunc(2, 3)) // 5
```

---

## Mejores Prácticas

1. **Manejo de Errores**:
   - Verifica errores en `plugin.Open` y `Lookup`.
   - Usar type assertion segura:
     ```go
     if saludarFunc, ok := sym.(func() string); ok {
         // Usar la función
     }
     ```

2. **Compatibilidad**:
   - Compila el plugin y el programa principal en el mismo entorno.
   - Usa versiones idénticas de dependencias.

3. **Nombrado de Símbolos**:
   - Las funciones/variables deben estar en mayúsculas para ser exportadas.
   - Evita colisiones de nombres entre plugins.

4. **Despliegue**:
   - Distribuye los archivos `.so` junto con la aplicación.
   - Considera rutas relativas o configurables para cargar plugins.

---

## Advertencias y Problemas Comunes

1. **Incompatibilidad de Versiones**:
   ```bash
   # Error común:
   plugin.Open("mi_plugin.so"): plugin was built with a different version of package...
   ```

2. **Tipos Incorrectos**:
   - Si la firma de la función no coincide, el type assertion fallará:
     ```go
     // Plugin: func Saludar() string
     sym.(func() int) // Panic: interface conversion error
     ```

3. **Sistemas No Soportados**:
   - En Windows, el buildmode `plugin` no está disponible. Usa alternativas como `go-plugin` de HashiCorp.

4. **Seguridad**:
   - No cargues plugins de fuentes no confiables (riesgo de código malicioso).

---

## Ejemplo Integrado: Sistema de Plugins Modular

**Estructura de Archivos**:
```
mi_app/
├── main.go
└── plugins/
    ├── plugin_math/
    │   ├── math.go
    │   └── go.mod
    └── plugin_greeter/
        ├── greeter.go
        └── go.mod
```

**Plugin de Matemáticas** (`math.go`):
```go
package main

func Sumar(a, b int) int { return a + b }
func Restar(a, b int) int { return a - b }
```

**Cargar Múltiples Plugins**:
```go
func cargarPlugin(ruta string) {
    p, err := plugin.Open(ruta)
    if err != nil {
        log.Printf("Error cargando %s: %v", ruta, err)
        return
    }

    if sym, err := p.Lookup("Sumar"); err == nil {
        if sumar, ok := sym.(func(int, int) int); ok {
            fmt.Println("Sumar(5, 3) =", sumar(5, 3))
        }
    }
}

func main() {
    cargarPlugin("plugins/plugin_math.so")
    cargarPlugin("plugins/plugin_greeter.so")
}
```

---

## Conclusión

El paquete `plugin` de Go es una herramienta poderosa para:
- Crear aplicaciones extensibles sin recompilar.
- Implementar arquitecturas modulares.
- Desarrollar sistemas de complementos.

**Recomendaciones Finales**:
- Úsalo en entornos controlados (Linux/macOS).
- Mantén consistencia en versiones y dependencias.
- Prioriza la seguridad al cargar plugins externos.

Con esta guía, puedes integrar plugins en tus aplicaciones Go de manera efectiva, aprovechando la flexibilidad de la carga dinámica de código.