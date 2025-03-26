# Paquete `path` en Go: Guía Completa con Ejemplos Avanzados

El paquete `path` en Go ofrece utilidades para manipular rutas de archivos y directorios usando la sintaxis de barras (`/`). Es ideal para trabajar con URLs y rutas independientes del sistema operativo. A continuación, se presenta una guía detallada con ejemplos prácticos y mejores prácticas.

---

## Funciones Principales y Casos de Uso

### 1. **`path.Base` - Obtener el Último Elemento de una Ruta**
**Propósito**: Extrae el nombre del archivo o directorio final.  
**Ejemplo**:
```go
fmt.Println(path.Base("/usr/local/bin/go"))  // "go"
fmt.Println(path.Base("docs/README.md"))     // "README.md"
fmt.Println(path.Base("/var/log/"))          // "log" (ignora la barra final)
```
**Caso Especial**:
```go
fmt.Println(path.Base("")) // "." (ruta vacía devuelve directorio actual)
```

---

### 2. **`path.Dir` - Obtener el Directorio Padre**
**Propósito**: Extrae la ruta sin el último elemento.  
**Ejemplo**:
```go
fmt.Println(path.Dir("/a/b/c.txt"))   // "/a/b"
fmt.Println(path.Dir("config.yaml"))  // "." (ruta relativa)
fmt.Println(path.Dir("/static/css/")) // "/static"
```

---

### 3. **`path.Ext` - Obtener la Extensión del Archivo**
**Propósito**: Identifica la extensión del archivo (incluyendo el punto).  
**Ejemplo**:
```go
fmt.Println(path.Ext("image.jpg"))          // ".jpg"
fmt.Println(path.Ext("/tmp/.hidden/file"))  // "" (sin extensión)
fmt.Println(path.Ext("archive.tar.gz"))     // ".gz" (solo la última extensión)
```

---

### 4. **`path.Clean` - Simplificar Rutas**
**Propósito**: Elimina elementos redundantes como `.`, `..` y barras duplicadas.  
**Ejemplo**:
```go
fmt.Println(path.Clean("/a/./b/../c"))     // "/a/c"
fmt.Println(path.Clean("//duplicate///"))  // "/duplicate"
fmt.Println(path.Clean("../../parent"))    // "../../parent"
```

---

### 5. **`path.Join` - Construir Rutas Seguras**
**Propósito**: Combina múltiples segmentos de ruta, manejando automáticamente las barras.  
**Ejemplo**:
```go
fmt.Println(path.Join("dir", "sub", "file.txt"))  // "dir/sub/file.txt"
fmt.Println(path.Join("/abs/path", "../file"))    // "/abs/file"
fmt.Println(path.Join("", "file.txt"))            // "file.txt"
```
**Mejor Práctica**:  
Siempre usar `Join` en lugar de concatenar strings con `/` para evitar errores.

---

### 6. **`path.Split` - Dividir Ruta en Directorio y Archivo**
**Propósito**: Separa la ruta en directorio y nombre de archivo.  
**Ejemplo**:
```go
dir, file := path.Split("/var/log/app.log")
fmt.Println(dir)   // "/var/log/"
fmt.Println(file)  // "app.log"

dir, file = path.Split("config.yaml")
fmt.Println(dir)   // ""
fmt.Println(file)  // "config.yaml"
```

---

## Comparación: `path` vs `filepath`

| Característica               | `path` (rutas genéricas)       | `filepath` (rutas del SO)       |
|-------------------------------|--------------------------------|----------------------------------|
| Separador                     | `/` siempre                    | `\` en Windows, `/` en Unix     |
| Manejo de `..` y `.`          | Sí                             | Sí                               |
| Compatibilidad multiplataforma| No (solo rutas estilo POSIX)   | Sí (usa separadores del SO)      |
| Uso típico                    | URLs, rutas en configuraciones | Manipulación de archivos locales |

**Regla General**:  
- Usa `path` para rutas lógicas (ej: endpoints HTTP, rutas en configuraciones).  
- Usa `filepath` para interactuar con el sistema de archivos del SO.

---

## Casos de Uso Avanzados

### 1. **Construcción de URLs Dinámicas**
```go
func buildAPIEndpoint(baseURL string, resource string, id string) string {
    return path.Join(baseURL, "/api/v1", resource, id)
}

fmt.Println(buildAPIEndpoint("https://example.com", "users", "123")) 
// "https://example.com/api/v1/users/123"
```

### 2. **Validación de Extensiones de Archivo**
```go
func isImageFile(filename string) bool {
    ext := path.Ext(filename)
    switch ext {
    case ".jpg", ".png", ".webp":
        return true
    }
    return false
}

fmt.Println(isImageFile("photo.jpg")) // true
```

### 3. **Normalización de Rutas en Configuraciones**
```go
cfg := map[string]string{
    "log_dir": "/var//logs/../app_logs/",
}

normalized := path.Clean(cfg["log_dir"])
fmt.Println(normalized) // "/var/app_logs"
```

---

## Mejores Prácticas y Advertencias

1. **No usar `path` para rutas del sistema de archivos**:  
   En Windows, `path.Join("dir", "file.txt")` crea `dir/file.txt`, que no es válido. Usa `filepath` en su lugar.

2. **Manejo de rutas vacías**:  
   ```go
   path.Join("", "file.txt")  // "file.txt" (correcto)
   path.Base("")              // "." (puede ser inesperado)
   ```

3. **Rutas absolutas vs relativas**:  
   ```go
   path.IsAbs("/tmp/file")  // No existe en `path`, usar `filepath.IsAbs`
   ```

---

## Ejemplo Integrado: Router HTTP Simple
```go
package main

import (
    "fmt"
    "net/http"
    "path"
)

func main() {
    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        cleanPath := path.Clean(r.URL.Path)
        
        switch cleanPath {
        case "/":
            fmt.Fprint(w, "Página de inicio")
        case "/about":
            fmt.Fprint(w, "Acerca de nosotros")
        default:
            w.WriteHeader(http.StatusNotFound)
            fmt.Fprint(w, "404 Página no encontrada")
        }
    })
    
    http.ListenAndServe(":8080", nil)
}
```

---

## Conclusión

El paquete `path` es esencial para:
- Manipular rutas lógicas independientes del SO.
- Construir URLs y rutas de configuración.
- Evitar errores comunes en la concatenación manual de rutas.

**Recuerda**:  
- Utiliza `filepath` para operaciones con archivos locales.  
- Aprovecha `Clean` y `Join` para mantener rutas consistentes.  
- Combínalo con `filepath` cuando necesites compatibilidad multiplataforma.

Esta guía proporciona las herramientas necesarias para trabajar eficientemente con rutas en Go, asegurando código limpio y mantenible en diversos escenarios.