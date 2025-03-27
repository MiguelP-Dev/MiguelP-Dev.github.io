---
layout: default
title: io | Miguel's Programing Notes
description: Guía completa del paquete io de Go para entrada/salida
permalink: /paquetes/io/
categories: paquetes
icon: 📤
---

# Paquete `io` en Go: Guía Completa con Ejemplos Prácticos

El paquete `io` en Go es fundamental para operaciones de entrada/salida (E/S), ofreciendo funciones versátiles para manejar flujos de datos. A continuación, se presenta una guía detallada con ejemplos y casos de uso para cada función clave.

---

## Funciones Principales y Casos de Uso

### 1. **`io.Copy`**
**Propósito**: Copiar datos desde un `Reader` a un `Writer`.  
**Ejemplo**: Copiar un archivo.
```go
srcFile, _ := os.Open("origen.txt")
defer srcFile.Close()

dstFile, _ := os.Create("destino.txt")
defer dstFile.Close()

bytesCopiados, err := io.Copy(dstFile, srcFile)
fmt.Printf("Se copiaron %d bytes\n", bytesCopiados)
```

### 2. **`io.CopyBuffer`**
**Propósito**: Optimizar copias con un búfer personalizado.  
**Ejemplo**: Copia con búfer de 4 KB.
```go
buf := make([]byte, 4096)
bytesCopiados, err := io.CopyBuffer(dstFile, srcFile, buf)
```

### 3. **`io.CopyN`**
**Propósito**: Copiar una cantidad específica de bytes.  
**Ejemplo**: Copiar los primeros 100 bytes de un archivo.
```go
bytesCopiados, err := io.CopyN(dstFile, srcFile, 100)
if err == io.EOF {
    fmt.Println("Archivo más pequeño que 100 bytes")
}
```

### 4. **`io.ReadAtLeast`**
**Propósito**: Leer un mínimo de bytes.  
**Ejemplo**: Validar encabezados.
```go
header := make([]byte, 16)
n, err := io.ReadAtLeast(reader, header, 16)
if err != nil {
    fmt.Println("Encabezado incompleto")
}
```

### 5. **`io.ReadFull`**
**Propósito**: Leer exactamente el tamaño del búfer.  
**Ejemplo**: Leer un bloque de datos fijo.
```go
dataBlock := make([]byte, 512)
n, err := io.ReadFull(reader, dataBlock)
if err != nil {
    fmt.Println("No hay suficientes datos")
}
```

### 6. **`io.WriteString`**
**Propósito**: Escribir cadenas eficientemente.  
**Ejemplo**: Escribir en un archivo de log.
```go
n, err := io.WriteString(logFile, "Error: conexión fallida\n")
```

---

## Funciones de Composición

### 7. **`io.LimitReader`**
**Propósito**: Limitar la lectura a `n` bytes.  
**Ejemplo**: Procesar solo los primeros 1 MB de un archivo.
```go
limitedReader := io.LimitReader(srcFile, 1<<20) // 1 MB
io.Copy(dstFile, limitedReader)
```

### 8. **`io.MultiReader`**
**Propósito**: Concatenar múltiples `Reader`s.  
**Ejemplo**: Combinar datos de dos archivos.
```go
reader1 := strings.NewReader("Parte 1\n")
reader2 := strings.NewReader("Parte 2\n")
combined := io.MultiReader(reader1, reader2)
io.Copy(os.Stdout, combined) // Imprime "Parte 1\nParte 2\n"
```

### 9. **`io.MultiWriter`**
**Propósito**: Escribir en múltiples `Writer`s.  
**Ejemplo**: Logging en consola y archivo.
```go
logFile, _ := os.Create("app.log")
logger := io.MultiWriter(os.Stdout, logFile)
fmt.Fprintf(logger, "Inicio: %s\n", time.Now())
```

### 10. **`io.TeeReader`**
**Propósito**: Leer y escribir simultáneamente.  
**Ejemplo**: Registrar datos mientras se procesan.
```go
src := strings.NewReader("Datos importantes")
var buffer bytes.Buffer
tee := io.TeeReader(src, &buffer) // Lee de src y escribe en buffer

io.Copy(os.Stdout, tee)          // Imprime "Datos importantes"
fmt.Println(buffer.String())     // Muestra "Datos importantes"
```

### 11. **`io.Pipe`**
**Propósito**: Comunicación síncrona entre goroutines.  
**Ejemplo**: Procesamiento en paralelo.
```go
reader, writer := io.Pipe()

go func() {
    defer writer.Close()
    writer.Write([]byte("Datos desde la goroutine"))
}()

data, _ := io.ReadAll(reader)
fmt.Println(string(data)) // "Datos desde la goroutine"
```

---

## Mejores Prácticas

1. **Manejo de Errores**:
   ```go
   n, err := io.Copy(dst, src)
   if err != nil {
       log.Fatal("Error en la copia:", err)
   }
   ```

2. **Optimización de Búfer**:
   - Usar `CopyBuffer` con tamaños de búfer grandes (ej: 32 KB) para archivos grandes.

3. **Uso de `WriteString`**:
   - Más eficiente que `Write([]byte(...))` para cadenas, ya que evita conversiones innecesarias.

4. **`LimitReader` para Datos Parciales**:
   - Ideal para procesar solo partes relevantes de streams grandes.

---

## Comparativa de Funciones

| Función           | Caso de Uso Típico                     | Ventajas                           |
|-------------------|----------------------------------------|------------------------------------|
| `Copy`            | Copia estándar entre Reader/Writer     | Sencillez                         |
| `CopyBuffer`      | Copia con control de memoria           | Optimización de rendimiento       |
| `TeeReader`       | Duplicar flujos de datos               | Útil para logging o auditoría     |
| `MultiWriter`     | Escritura múltiple                     | Redundancia en logging            |
| `Pipe`            | Comunicación entre goroutines          | Sincronización sin intermediarios |

---

Esta guía proporciona una comprensión práctica del paquete `io` en Go, demostrando cómo utilizar sus funciones para manejar eficientemente operaciones de E/S en diversos escenarios. Desde copias simples hasta composición compleja de flujos, estas herramientas son esenciales para desarrollar aplicaciones robustas y eficientes.