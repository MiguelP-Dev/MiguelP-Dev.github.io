¡Con mucho gusto! Trabajar con archivos XML y JSON en Go es bastante directo gracias a los paquetes estándar `encoding/xml` y `encoding/json`. A continuación, te proporcionaré ejemplos para ambos casos.

### Trabajar con XML en Go

#### Leer XML

Supongamos que tienes un archivo `personas.xml` con el siguiente contenido:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<personas>
    <persona>
        <nombre>Juan</nombre>
        <edad>30</edad>
    </persona>
    <persona>
        <nombre>Ana</nombre>
        <edad>25</edad>
    </persona>
</personas>
```

Puedes leer este archivo y decodificar su contenido en una estructura Go de la siguiente manera:

```go
package main

import (
    "encoding/xml"
    "fmt"
    "os"
)

type Persona struct {
    Nombre string `xml:"nombre"`
    Edad   int    `xml:"edad"`
}

type Personas struct {
    XMLName xml.Name `xml:"personas"`
    Personas []Persona `xml:"persona"`
}

func main() {
    file, err := os.Open("personas.xml")
    if err != nil {
        fmt.Println("Error al abrir el archivo:", err)
        return
    }
    defer file.Close()

    var personas Personas
    decoder := xml.NewDecoder(file)
    if err := decoder.Decode(&personas); err != nil {
        fmt.Println("Error al decodificar el archivo:", err)
        return
    }

    for _, persona := range personas.Personas {
        fmt.Printf("Nombre: %s, Edad: %d\n", persona.Nombre, persona.Edad)
    }
}
```

#### Escribir XML

Para crear un archivo XML a partir de estructuras de Go, puedes hacer lo siguiente:

```go
package main

import (
    "encoding/xml"
    "fmt"
    "os"
)

type Persona struct {
    Nombre string `xml:"nombre"`
    Edad   int    `xml:"edad"`
}

type Personas struct {
    XMLName xml.Name `xml:"personas"`
    Personas []Persona `xml:"persona"`
}

func main() {
    personas := Personas{
        Personas: []Persona{
            {Nombre: "Juan", Edad: 30},
            {Nombre: "Ana", Edad: 25},
        },
    }

    file, err := os.Create("nuevo_personas.xml")
    if err != nil {
        fmt.Println("Error al crear el archivo:", err)
        return
    }
    defer file.Close()

    encoder := xml.NewEncoder(file)
    encoder.Indent("", "  ")
    if err := encoder.Encode(personas); err != nil {
        fmt.Println("Error al codificar el archivo:", err)
        return
    }

    fmt.Println("Archivo XML creado con éxito.")
}
```

### Trabajar con JSON en Go

#### Leer JSON

Supongamos que tienes un archivo `personas.json` con el siguiente contenido:

```json
[
    {
        "nombre": "Juan",
        "edad": 30
    },
    {
        "nombre": "Ana",
        "edad": 25
    }
]
```

Puedes leer este archivo y decodificar su contenido en una estructura Go de la siguiente manera:

```go
package main

import (
    "encoding/json"
    "fmt"
    "os"
)

type Persona struct {
    Nombre string `json:"nombre"`
    Edad   int    `json:"edad"`
}

func main() {
    file, err := os.Open("personas.json")
    if err != nil {
        fmt.Println("Error al abrir el archivo:", err)
        return
    }
    defer file.Close()

    var personas []Persona
    decoder := json.NewDecoder(file)
    if err := decoder.Decode(&personas); err != nil {
        fmt.Println("Error al decodificar el archivo:", err)
        return
    }

    for _, persona := range personas {
        fmt.Printf("Nombre: %s, Edad: %d\n", persona.Nombre, persona.Edad)
    }
}
```

#### Escribir JSON

Para crear un archivo JSON a partir de estructuras de Go, puedes hacer lo siguiente:

```go
package main

import (
    "encoding/json"
    "fmt"
    "os"
)

type Persona struct {
    Nombre string `json:"nombre"`
    Edad   int    `json:"edad"`
}

func main() {
    personas := []Persona{
        {Nombre: "Juan", Edad: 30},
        {Nombre: "Ana", Edad: 25},
    }

    file, err := os.Create("nuevo_personas.json")
    if err != nil {
        fmt.Println("Error al crear el archivo:", err)
        return
    }
    defer file.Close()

    encoder := json.NewEncoder(file)
    encoder.SetIndent("", "  ")
    if err := encoder.Encode(personas); err != nil {
        fmt.Println("Error al codificar el archivo:", err)
        return
    }

    fmt.Println("Archivo JSON creado con éxito.")
}
```

### Resumen

- **XML**: Usa el paquete `encoding/xml` para leer y escribir archivos XML.
- **JSON**: Usa el paquete `encoding/json` para leer y escribir archivos JSON.

Espero que estos ejemplos te sean útiles para trabajar con archivos XML y JSON en Go. Si tienes más preguntas o necesitas ayuda adicional, ¡estaré encantado de asistirte!