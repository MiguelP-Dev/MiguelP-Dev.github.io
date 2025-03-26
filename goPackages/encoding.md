# Paquete encoding en Go

El paquete `encoding` proporciona interfaces y subpaquetes para codificar y decodificar datos en varios formatos. Este documento explora en detalle sus características y casos de uso prácticos.

## 1. Subpaquetes Principales

### 1.1 encoding/json

```go
// filepath: ejemplos/encoding/json_example.go
package main

import (
    "encoding/json"
    "fmt"
    "log"
)

type Usuario struct {
    ID        int      `json:"id"`
    Nombre    string   `json:"nombre"`
    Email     string   `json:"email"`
    Roles     []string `json:"roles,omitempty"`
    Activo    bool     `json:"activo"`
    MetaData  map[string]interface{} `json:"metadata,omitempty"`
}

func ejemploJSON() {
    usuario := Usuario{
        ID:     1,
        Nombre: "Juan Pérez",
        Email:  "juan@ejemplo.com",
        Roles:  []string{"admin", "user"},
        Activo: true,
        MetaData: map[string]interface{}{
            "último_acceso": "2024-03-22",
            "preferencias": map[string]string{
                "tema": "oscuro",
                "idioma": "es",
            },
        },
    }

    // Codificación con formato
    jsonData, err := json.MarshalIndent(usuario, "", "    ")
    if err != nil {
        log.Fatal(err)
    }
    fmt.Printf("JSON Formateado:\n%s\n", jsonData)

    // Decodificación con validación
    var usuarioDecodificado Usuario
    if err := json.Unmarshal(jsonData, &usuarioDecodificado); err != nil {
        log.Fatal(err)
    }
}
```

### 1.2 encoding/xml

```go
// filepath: ejemplos/encoding/xml_example.go
package main

import (
    "encoding/xml"
    "fmt"
    "log"
)

type Configuracion struct {
    XMLName     xml.Name `xml:"configuracion"`
    Version     string   `xml:"version,attr"`
    BaseDatos   DB      `xml:"database"`
    Servidor    Server  `xml:"server"`
}

type DB struct {
    Host     string `xml:"host"`
    Puerto   int    `xml:"port"`
    Usuario  string `xml:"user"`
    Password string `xml:"password,omitempty"`
}

type Server struct {
    Puerto    int      `xml:"port"`
    SSL       bool     `xml:"ssl"`
    Dominios  []string `xml:"domains>domain"`
}

func ejemploXML() {
    config := Configuracion{
        Version: "1.0",
        BaseDatos: DB{
            Host:     "localhost",
            Puerto:   5432,
            Usuario:  "admin",
            Password: "secreto",
        },
        Servidor: Server{
            Puerto: 8080,
            SSL:    true,
            Dominios: []string{
                "ejemplo.com",
                "api.ejemplo.com",
            },
        },
    }

    xmlData, err := xml.MarshalIndent(config, "", "    ")
    if err != nil {
        log.Fatal(err)
    }

    // Agregar cabecera XML
    xmlString := xml.Header + string(xmlData)
    fmt.Printf("XML Formateado:\n%s\n", xmlString)
}
```

### 1.3 encoding/csv

```go
// filepath: ejemplos/encoding/csv_example.go
package main

import (
    "encoding/csv"
    "fmt"
    "log"
    "os"
    "strconv"
)

type Producto struct {
    ID        int
    Nombre    string
    Precio    float64
    Stock     int
    Categoria string
}

func procesarCSV(filename string) ([]Producto, error) {
    file, err := os.Open(filename)
    if err != nil {
        return nil, err
    }
    defer file.Close()

    reader := csv.NewReader(file)
    reader.Comma = ';'  // Personalizar separador
    reader.Comment = '#' // Ignorar líneas que comienzan con #

    // Leer encabezados
    headers, err := reader.Read()
    if err != nil {
        return nil, err
    }

    var productos []Producto
    for {
        record, err := reader.Read()
        if err != nil {
            break // EOF o error
        }

        id, _ := strconv.Atoi(record[0])
        precio, _ := strconv.ParseFloat(record[2], 64)
        stock, _ := strconv.Atoi(record[3])

        producto := Producto{
            ID:        id,
            Nombre:    record[1],
            Precio:    precio,
            Stock:     stock,
            Categoria: record[4],
        }
        productos = append(productos, producto)
    }

    return productos, nil
}
```

## 2. Casos de Uso Avanzados

### 2.1 Codificador/Decodificador Personalizado

```go
// filepath: ejemplos/encoding/custom_codec.go
package main

import (
    "encoding/json"
    "time"
)

type FechaPersonalizada time.Time

func (f FechaPersonalizada) MarshalJSON() ([]byte, error) {
    fecha := time.Time(f)
    return json.Marshal(fecha.Format("02/01/2006"))
}

func (f *FechaPersonalizada) UnmarshalJSON(data []byte) error {
    var fechaStr string
    if err := json.Unmarshal(data, &fechaStr); err != nil {
        return err
    }

    fecha, err := time.Parse("02/01/2006", fechaStr)
    if err != nil {
        return err
    }

    *f = FechaPersonalizada(fecha)
    return nil
}
```

### 2.2 Procesador de Configuración Multi-formato

```go
// filepath: ejemplos/encoding/config_processor.go
package main

import (
    "encoding/json"
    "encoding/xml"
    "fmt"
    "io"
    "path/filepath"
)

type ConfigProcessor struct {
    decoders map[string]func(io.Reader) (map[string]interface{}, error)
}

func NewConfigProcessor() *ConfigProcessor {
    cp := &ConfigProcessor{
        decoders: make(map[string]func(io.Reader) (map[string]interface{}, error)),
    }

    // Registrar decodificadores por extensión
    cp.decoders[".json"] = cp.decodeJSON
    cp.decoders[".xml"] = cp.decodeXML

    return cp
}

func (cp *ConfigProcessor) decodeJSON(r io.Reader) (map[string]interface{}, error) {
    var result map[string]interface{}
    decoder := json.NewDecoder(r)
    if err := decoder.Decode(&result); err != nil {
        return nil, err
    }
    return result, nil
}

func (cp *ConfigProcessor) decodeXML(r io.Reader) (map[string]interface{}, error) {
    var result map[string]interface{}
    decoder := xml.NewDecoder(r)
    if err := decoder.Decode(&result); err != nil {
        return nil, err
    }
    return result, nil
}
```

## 3. Mejores Prácticas

1. **Rendimiento**
   - Usar `Encoder/Decoder` para streams grandes
   - Reutilizar buffers cuando sea posible
   - Considerar formatos binarios para datos internos

2. **Validación**
   - Implementar validación de datos
   - Manejar errores de formato
   - Validar límites y tipos de datos

3. **Seguridad**
   - Evitar deserialización de datos no confiables
   - Implementar límites de tamaño
   - Usar campos privados cuando sea necesario

## 4. Referencias

- [Documentación oficial de encoding](https://golang.org/pkg/encoding/)
- [Go Blog: JSON and Go](https://blog.golang.org/json)
- [Go XML Package Documentation](https://golang.org/pkg/encoding/xml/)
