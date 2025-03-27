---
layout: default
title: json | Miguel's Programing Notes
description: Guía completa del paquete encoding/json de Go
permalink: /paquetes/json/
categories: paquetes
icon: 📄
---

# Paquete `encoding/json` en Go

El paquete `encoding/json` proporciona herramientas para trabajar con datos JSON en Go. Esta guía cubre desde lo básico hasta técnicas avanzadas de serialización y deserialización.

## 1. Conceptos Básicos

### 1.1 Serialización (Marshal)

```go
package main

import (
    "encoding/json"
    "fmt"
    "log"
)

type Usuario struct {
    ID        int      `json:"id"`
    Nombre    string   `json:"nombre"`
    Email     string   `json:"email,omitempty"`
    Activo    bool     `json:"activo"`
    Etiquetas []string `json:"etiquetas,omitempty"`
}

func main() {
    usuario := Usuario{
        ID:        1,
        Nombre:    "Ana García",
        Email:     "ana@ejemplo.com",
        Activo:    true,
        Etiquetas: []string{"admin", "desarrollador"},
    }
    
    // Convertir a JSON
    data, err := json.Marshal(usuario)
    if err != nil {
        log.Fatal(err)
    }
    
    fmt.Println(string(data))
    // Output: {"id":1,"nombre":"Ana García","email":"ana@ejemplo.com","activo":true,"etiquetas":["admin","desarrollador"]}
    
    // JSON con formato legible
    prettyData, _ := json.MarshalIndent(usuario, "", "  ")
    fmt.Println(string(prettyData))
}
```

### 1.2 Deserialización (Unmarshal)

```go
func deserializarJSON() {
    jsonData := []byte(`{
        "id": 2,
        "nombre": "Carlos López",
        "email": "carlos@ejemplo.com",
        "activo": false
    }`)
    
    var usuario Usuario
    err := json.Unmarshal(jsonData, &usuario)
    if err != nil {
        log.Fatal(err)
    }
    
    fmt.Printf("Usuario: %+v\n", usuario)
    // Output: Usuario: {ID:2 Nombre:Carlos López Email:carlos@ejemplo.com Activo:false Etiquetas:[]}
}
```

## 2. Tags JSON

### 2.1 Tags Comunes

```go
type Producto struct {
    ID          int     `json:"id"`
    Nombre      string  `json:"nombre"`
    Precio      float64 `json:"precio"`
    Descripcion string  `json:"descripcion,omitempty"` // omitir si vacío
    SKU         string  `json:"-"`                     // nunca incluir en JSON
    Inventario  int     `json:"inventario,string"`     // salida como string
    Creado      string  `json:"creado"`
}
```

### 2.2 Campos Privados y Tags

```go
type Sesion struct {
    ID        string    `json:"id"`
    Usuario   string    `json:"usuario"`
    Expirado  bool      `json:"expirado"`
    creado    time.Time // no exportado, no incluido en JSON
    UltimoUso time.Time `json:"ultimo_uso,omitempty"`
}
```

## 3. Trabajo con Streams

### 3.1 Encoder y Decoder

```go
func streamJSON() {
    // Encoder
    var buf bytes.Buffer
    encoder := json.NewEncoder(&buf)
    encoder.SetIndent("", "  ")
    
    usuarios := []Usuario{
        {ID: 1, Nombre: "Ana"},
        {ID: 2, Nombre: "Bruno"},
    }
    
    if err := encoder.Encode(usuarios); err != nil {
        log.Fatal(err)
    }
    
    fmt.Println(buf.String())
    
    // Decoder
    decoder := json.NewDecoder(strings.NewReader(buf.String()))
    var resultado []Usuario
    if err := decoder.Decode(&resultado); err != nil {
        log.Fatal(err)
    }
    
    fmt.Printf("Decodificado: %+v\n", resultado)
}
```

### 3.2 Streaming de Grandes Documentos

```go
func procesarJSONGrande(r io.Reader) {
    decoder := json.NewDecoder(r)
    
    // Leer token de apertura
    t, err := decoder.Token()
    if err != nil {
        log.Fatal(err)
    }
    fmt.Printf("Token inicial: %T: %v\n", t, t)
    
    // Mientras sea un array
    for decoder.More() {
        var usuario Usuario
        if err := decoder.Decode(&usuario); err != nil {
            log.Fatal(err)
        }
        procesarUsuario(usuario)
    }
    
    // Leer token de cierre
    t, err = decoder.Token()
    if err != nil {
        log.Fatal(err)
    }
    fmt.Printf("Token final: %T: %v\n", t, t)
}

func procesarUsuario(u Usuario) {
    fmt.Printf("Procesando usuario: %s\n", u.Nombre)
}
```

## 4. Tipos Personalizados

### 4.1 Implementando Marshaler/Unmarshaler

```go
type Fecha time.Time

func (f Fecha) MarshalJSON() ([]byte, error) {
    fecha := time.Time(f)
    if fecha.IsZero() {
        return []byte(`""`), nil
    }
    return []byte(fmt.Sprintf(`"%s"`, fecha.Format("2006-01-02"))), nil
}

func (f *Fecha) UnmarshalJSON(data []byte) error {
    var fechaStr string
    if err := json.Unmarshal(data, &fechaStr); err != nil {
        return err
    }
    
    if fechaStr == "" {
        *f = Fecha(time.Time{})
        return nil
    }
    
    fecha, err := time.Parse("2006-01-02", fechaStr)
    if err != nil {
        return err
    }
    
    *f = Fecha(fecha)
    return nil
}

type Evento struct {
    Titulo     string `json:"titulo"`
    Fecha      Fecha  `json:"fecha"`
    Asistentes int    `json:"asistentes"`
}
```

### 4.2 Uso de json.RawMessage

```go
type Mensaje struct {
    Tipo    string          `json:"tipo"`
    Datos   json.RawMessage `json:"datos"`
}

func procesarMensajePolimórfico(jsonData string) {
    var msg Mensaje
    if err := json.Unmarshal([]byte(jsonData), &msg); err != nil {
        log.Fatal(err)
    }
    
    fmt.Printf("Tipo de mensaje: %s\n", msg.Tipo)
    
    switch msg.Tipo {
    case "usuario":
        var usuario Usuario
        if err := json.Unmarshal(msg.Datos, &usuario); err != nil {
            log.Fatal(err)
        }
        fmt.Printf("Usuario: %+v\n", usuario)
        
    case "producto":
        var producto Producto
        if err := json.Unmarshal(msg.Datos, &producto); err != nil {
            log.Fatal(err)
        }
        fmt.Printf("Producto: %+v\n", producto)
    }
}
```

## 5. Manejo de Estructuras Dinámicas

### 5.1 Map[string]interface{}

```go
func manejarJSONDinamico(jsonData string) {
    var resultado map[string]interface{}
    if err := json.Unmarshal([]byte(jsonData), &resultado); err != nil {
        log.Fatal(err)
    }
    
    for k, v := range resultado {
        fmt.Printf("Clave: %s, Valor: %v (Tipo: %T)\n", k, v, v)
        
        // Manejar arrays
        if array, ok := v.([]interface{}); ok {
            for i, item := range array {
                fmt.Printf("  [%d]: %v\n", i, item)
            }
        }
        
        // Manejar objetos anidados
        if obj, ok := v.(map[string]interface{}); ok {
            for ck, cv := range obj {
                fmt.Printf("  %s: %v\n", ck, cv)
            }
        }
    }
}
```

### 5.2 Validación Dinámica

```go
func validarJSON(jsonData []byte) (bool, error) {
    var js json.RawMessage
    if err := json.Unmarshal(jsonData, &js); err != nil {
        return false, err
    }
    return true, nil
}
```

## 6. Mejores Prácticas

### 6.1 Manejo de Errores

```go
func manejoErroresSerialization() {
    jsonData := []byte(`{"id": "no-un-numero", "nombre": "Error"}`)
    
    var usuario Usuario
    err := json.Unmarshal(jsonData, &usuario)
    if err != nil {
        // Verificar tipo específico de error
        var syntaxErr *json.SyntaxError
        var typeErr *json.UnmarshalTypeError
        
        switch {
        case errors.As(err, &syntaxErr):
            fmt.Printf("Error de sintaxis en posición %d: %v\n", 
                syntaxErr.Offset, syntaxErr)
            
        case errors.As(err, &typeErr):
            fmt.Printf("Error de tipo al convertir %s a %s en posición %d\n", 
                typeErr.Value, typeErr.Type, typeErr.Offset)
            
        default:
            fmt.Printf("Error deserializando JSON: %v\n", err)
        }
        return
    }
    
    fmt.Printf("Usuario: %+v\n", usuario)
}
```

### 6.2 Rendimiento

```go
func optimizacionesRendimiento() {
    // Uso de sync.Pool para reducir asignaciones de memoria
    pool := sync.Pool{
        New: func() interface{} {
            return make([]byte, 0, 64*1024) // 64KB buffer inicial
        },
    }
    
    // Reutilizar buffer
    buffer := pool.Get().([]byte)
    buffer = buffer[:0] // reset length
    
    var buf bytes.Buffer
    buf.Write(buffer)
    
    // Codificar directamente al Writer
    encoder := json.NewEncoder(&buf)
    encoder.Encode(datos)
    
    // Hacer algo con buf.Bytes()
    
    // Devolver buffer al pool
    pool.Put(buffer)
}
```

Esta guía proporciona una visión completa del paquete `encoding/json` en Go, desde operaciones básicas hasta técnicas avanzadas para manejar datos JSON de manera eficiente y flexible en tus aplicaciones. 