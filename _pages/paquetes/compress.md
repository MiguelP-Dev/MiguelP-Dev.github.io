# Paquete compress en Go

El paquete `compress` en Go proporciona varios subpaquetes para trabajar con diferentes algoritmos de compresión y formatos de archivo comprimido. Este documento explora en detalle cada subpaquete con ejemplos prácticos.

## 1. compress/bzip2

### 1.1 Lectura de Archivos bzip2

```go
func ejemploLecturaBzip2() error {
    // Abrir archivo bzip2
    archivo, err := os.Open("datos.bz2")
    if err != nil {
        return fmt.Errorf("error abriendo archivo: %w", err)
    }
    defer archivo.Close()

    // Crear lector bzip2
    reader := bzip2.NewReader(archivo)

    // Leer contenido descomprimido
    contenido, err := io.ReadAll(reader)
    if (err != nil) {
        return fmt.Errorf("error leyendo contenido: %w", err)
    }

    fmt.Printf("Contenido descomprimido: %s\n", contenido)
    return nil
}
```

### 1.2 Procesamiento por Bloques

```go
func procesarBzip2PorBloques(filename string, tamañoBloque int) error {
    archivo, err := os.Open(filename)
    if err != nil {
        return err
    }
    defer archivo.Close()

    reader := bzip2.NewReader(archivo)
    buffer := make([]byte, tamañoBloque)

    for {
        n, err := reader.Read(buffer)
        if err == io.EOF {
            break
        }
        if err != nil {
            return err
        }

        // Procesar el bloque leído
        procesarBloque(buffer[:n])
    }
    return nil
}

func procesarBloque(datos []byte) {
    // Implementar procesamiento específico
}
```

## 2. compress/flate

### 2.1 Compresión Básica

```go
func comprimirDatos(datos []byte) ([]byte, error) {
    var buf bytes.Buffer
    
    // Crear escritor con compresión
    writer, err := flate.NewWriter(&buf, flate.BestCompression)
    if err != nil {
        return nil, err
    }
    
    // Escribir datos
    if _, err := writer.Write(datos); err != nil {
        return nil, err
    }
    
    // Cerrar para asegurar que todos los datos se escriban
    if err := writer.Close(); err != nil {
        return nil, err
    }
    
    return buf.Bytes(), nil
}
```

### 2.2 Descompresión con Diccionario

```go
func descomprimirConDiccionario(datos []byte, diccionario []byte) ([]byte, error) {
    // Crear reader con diccionario
    reader := flate.NewReaderDict(bytes.NewReader(datos), diccionario)
    defer reader.Close()
    
    // Leer datos descomprimidos
    return io.ReadAll(reader)
}
```

## 3. compress/gzip

### 3.1 Compresión de Archivos

```go
func comprimirArchivo(entrada, salida string) error {
    // Abrir archivo de entrada
    in, err := os.Open(entrada)
    if err != nil {
        return err
    }
    defer in.Close()

    // Crear archivo de salida
    out, err := os.Create(salida)
    if err != nil {
        return err
    }
    defer out.Close()

    // Crear escritor gzip
    gw := gzip.NewWriter(out)
    defer gw.Close()

    // Configurar metadatos
    gw.Name = filepath.Base(entrada)
    gw.ModTime = time.Now()
    gw.Comment = "Comprimido con Go"

    // Copiar datos
    if _, err := io.Copy(gw, in); err != nil {
        return err
    }

    return nil
}
```

### 3.2 Lectura de Archivos Gzip con Metadata

```go
func leerArchivoGzip(filename string) error {
    // Abrir archivo
    file, err := os.Open(filename)
    if err != nil {
        return err
    }
    defer file.Close()

    // Crear lector gzip
    gr, err := gzip.NewReader(file)
    if err != nil {
        return err
    }
    defer gr.Close()

    // Mostrar metadata
    fmt.Printf("Nombre original: %s\n", gr.Name)
    fmt.Printf("Fecha modificación: %v\n", gr.ModTime)
    fmt.Printf("Comentario: %s\n", gr.Comment)

    // Leer contenido
    contenido, err := io.ReadAll(gr)
    if err != nil {
        return err
    }

    fmt.Printf("Contenido: %s\n", contenido)
    return nil
}
```

## 4. compress/zlib

### 4.1 Compresión en Memoria

```go
func comprimirZlib(datos []byte, nivel int) ([]byte, error) {
    var buf bytes.Buffer

    // Crear escritor con nivel específico
    writer, err := zlib.NewWriterLevel(&buf, nivel)
    if err != nil {
        return nil, err
    }

    // Escribir datos
    if _, err := writer.Write(datos); err != nil {
        return nil, err
    }

    if err := writer.Close(); err != nil {
        return nil, err
    }

    return buf.Bytes(), nil
}
```

### 4.2 Compresión con Progress Bar

```go
func comprimirConProgreso(entrada, salida string) error {
    // Abrir archivo de entrada
    in, err := os.Open(entrada)
    if err != nil {
        return err
    }
    defer in.Close()

    // Obtener tamaño del archivo
    info, err := in.Stat()
    if err != nil {
        return err
    }

    // Crear archivo de salida
    out, err := os.Create(salida)
    if err != nil {
        return err
    }
    defer out.Close()

    // Crear writer zlib
    zw := zlib.NewWriter(out)
    defer zw.Close()

    // Crear progress bar
    bar := progressbar.DefaultBytes(
        info.Size(),
        "Comprimiendo",
    )

    // Copiar datos con progreso
    if _, err := io.Copy(io.MultiWriter(zw, bar), in); err != nil {
        return err
    }

    return nil
}
```

## 5. Utilidades y Helpers

### 5.1 Detector de Formato

```go
func detectarFormatoCompresion(datos []byte) string {
    if len(datos) < 4 {
        return "desconocido"
    }

    // Detectar formato basado en magic numbers
    switch {
    case bytes.HasPrefix(datos, []byte{0x1f, 0x8b}):
        return "gzip"
    case bytes.HasPrefix(datos, []byte{0x42, 0x5a, 0x68}):
        return "bzip2"
    case bytes.HasPrefix(datos, []byte{0x78, 0x01}):
        return "zlib"
    default:
        return "desconocido"
    }
}
```

### 5.2 Compresor Universal

```go
type CompresorConfig struct {
    Formato    string
    Nivel      int
    Dictionary []byte
}

func ComprimirDatos(datos []byte, config CompresorConfig) ([]byte, error) {
    var buf bytes.Buffer

    switch config.Formato {
    case "gzip":
        w, err := gzip.NewWriterLevel(&buf, config.Nivel)
        if err != nil {
            return nil, err
        }
        defer w.Close()
        _, err = w.Write(datos)
        return buf.Bytes(), err

    case "zlib":
        w, err := zlib.NewWriterLevel(&buf, config.Nivel)
        if err != nil {
            return nil, err
        }
        defer w.Close()
        _, err = w.Write(datos)
        return buf.Bytes(), err

    // Agregar más formatos según sea necesario
    
    default:
        return nil, fmt.Errorf("formato no soportado: %s", config.Formato)
    }
}
```

## 6. Mejores Prácticas

1. **Manejo de Recursos**
   - Siempre cerrar readers y writers
   - Usar `defer` para garantizar el cierre
   - Manejar errores apropiadamente

2. **Optimización**
   - Elegir el nivel de compresión adecuado
   - Usar buffers de tamaño apropiado
   - Considerar el uso de goroutines para compresión paralela

3. **Seguridad**
   - Validar tamaños de entrada
   - Establecer límites de memoria
   - Verificar integridad de datos comprimidos

## 7. Referencias

- [Documentación oficial de compress](https://golang.org/pkg/compress/)
- [Especificación GZIP](https://tools.ietf.org/html/rfc1952)
- [Especificación ZLIB](https://tools.ietf.org/html/rfc1950)
