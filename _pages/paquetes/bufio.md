---
layout: default
title: bufio | Miguel's Programing Notes
description: Guía del paquete bufio de Go para operaciones de I/O optimizadas
permalink: /paquetes/bufio/
categories: paquetes
icon: 📝
---

# Paquete bufio en Go

El paquete `bufio` en Go implementa operaciones de E/S (entrada/salida) buffered, proporcionando una capa de abstracción que mejora el rendimiento al reducir el número de llamadas al sistema operativo. Este documento explora en profundidad sus características y usos.

## 1. Conceptos Básicos

### 1.1 ¿Qué es un Buffer?

Un buffer es un área temporal de memoria que almacena datos antes de procesarlos. En el contexto de E/S:

- **Entrada**: Acumula datos antes de que el programa los lea
- **Salida**: Acumula datos antes de escribirlos al dispositivo final

### 1.2 Ventajas del Buffering

- Reduce llamadas al sistema operativo
- Mejora el rendimiento
- Proporciona métodos convenientes para lectura/escritura

## 2. Reader

### 2.1 Creación y Uso Básico

{% raw %}
```go
func ejemploBasicoReader() {
    input := strings.NewReader("Hola\nmundo\ndesde\nGo")
    reader := bufio.NewReader(input)
    
    // Lectura línea por línea
    for {
        linea, err := reader.ReadString('\n')
        if err == io.EOF {
            break
        }
        if err != nil {
            log.Fatal(err)
        }
        fmt.Printf("Leído: %s", linea)
    }
}
```
{% end raw %}

### 2.2 Ejemplo de Peek
{% raw %}
```go
func ejemploPeek() error {
    archivo, err := os.Open("documento.txt")
    if err != nil {
        return err
    }
    defer archivo.Close()

    reader := bufio.NewReader(archivo)
    
    // Inspeccionar los primeros 5 bytes sin consumirlos
    datos, err := reader.Peek(5)
    if err != nil {
        return err
    }
    fmt.Printf("Primeros 5 bytes: %s\n", datos)
    
    // Leer todo el contenido
    contenido, err := io.ReadAll(reader)
    if err != nil {
        return err
    }
    fmt.Printf("Contenido completo: %s\n", contenido)
    
    return nil
}
```
{% endraw %}

### 2.3 Manejo de Errores Robusto

```go
func manejoErroresRobusto(reader *bufio.Reader) error {
    for {
        linea, err := reader.ReadString('\n')
        
        // Procesar la línea incluso en caso de EOF
        if len(linea) > 0 {
            if err := procesarLinea(linea); err != nil {
                return fmt.Errorf("error procesando línea: %w", err)
            }
        }

        if err == io.EOF {
            break
        }
        if err != nil {
            return fmt.Errorf("error leyendo: %w", err)
        }
    }
    return nil
}
```

## 3. Funciones Comunes

### 3.1 `NewReader`

- Crea un nuevo `Reader` que lee desde un `io.Reader` dado (como un archivo o una conexión de red) y lo envuelve en un buffer.

- ```go
  reader := bufio.NewReader(file)
  ```

### 3.2 `NewWriter`

- Crea un nuevo `Writer` que escribe en un `io.Writer` dado (como un archivo o una conexión de red) y lo envuelve en un buffer.

- ```go
  writer := bufio.NewWriter(file)
  ```

### 3.3 `NewScanner`

- Crea un nuevo `Scanner` para leer datos secuenciales como líneas o palabras desde un `io.Reader`.

- ```go
  scanner := bufio.NewScanner(file)
  ```

### 3.4 `Peek`

- Permite ver los próximos `n` bytes del buffer sin avanzar el lector. Es útil para inspeccionar datos sin consumirlos.

- ```go
  bytes, err := reader.Peek(10)
  ```

### 3.5 `ReadLine`

- Lee una línea del `Reader`, excluyendo el delimitador de línea. Es útil para leer datos línea por línea.

- ```go
  line, isPrefix, err := reader.ReadLine()
  ```

### 3.6 `ReadBytes`

- Lee hasta y incluyendo el delimitador especificado y devuelve un slice de bytes.

- ```go
  bytes, err := reader.ReadBytes('\n')
  ```

### 3.7 `ReadString`

- Lee hasta e incluyendo el delimitador especificado y devuelve una cadena.

- ```go
  line, err := reader.ReadString('\n')
  ```

### 3.8 `Write`

- Escribe un slice de bytes en el buffer del `Writer`. Debes llamar a `Flush` para asegurarte de que los datos se escriban en el destino subyacente.

- ```go
  _, err := writer.Write([]byte("hello, world"))
  ```

### 3.9 `WriteString`

- Escribe una cadena en el buffer del `Writer`. Debes llamar a `Flush` para asegurarte de que los datos se escriban en el destino subyacente.

- ```go
  _, err := writer.WriteString("hello, world")
  ```

### 3.10 `Flush`

- Vacía el contenido del buffer del `Writer` y lo escribe en el destino subyacente.

- ```go
  err := writer.Flush()
  ```

### 3.11 `Scanner.Split`

- Configura el `Scanner` para dividir el texto según una función personalizada. El paquete `bufio` proporciona varias funciones de división predefinidas como `ScanLines`, `ScanWords`, y `ScanRunes`.

- ```go
  scanner.Split(bufio.ScanWords)
  ```

### 3.12 `Scanner.Scan`

- Avanza el `Scanner` al próximo token, que puede ser una línea, una palabra, o cualquier otra unidad definida por la función de división.

- ```go
  for scanner.Scan() {
      fmt.Println(scanner.Text())
  }
  ```

### 3.13 `Scanner.Text`

- Devuelve el token más reciente leído por el `Scanner` como una cadena.

- ```go
  text := scanner.Text()
  ```

### 3.14 `Reader.Read`

- Lee datos en un buffer de bytes. Similar a `io.Reader` pero con un buffer subyacente.

- ```go
  n, err := reader.Read(buf)
  ```

### 3.15 `Writer.Buffered`

- Devuelve el número de bytes que actualmente están almacenados en el buffer y que aún no se han escrito al destino subyacente.

- ```go
  buffered := writer.Buffered()
  ```

### 3.16 Ejemplo de Writer

```go
func ejemploWriter() error {
    archivo, err := os.Create("salida.txt")
    if err != nil {
        return err
    }
    defer archivo.Close()

    writer := bufio.NewWriter(archivo)
    
    // Escribir varias líneas
    for i := 0; i < 5; i++ {
        fmt.Fprintf(writer, "Línea %d\n", i+1)
    }
    
    // No olvidar hacer flush
    return writer.Flush()
}
```

### 3.17 Ejemplo de Writer Avanzado

```go
func ejemploWriterAvanzado() error {
    archivo, err := os.Create("datos_grandes.txt")
    if err != nil {
        return err
    }
    defer archivo.Close()

    writer := bufio.NewWriterSize(archivo, 8192) // Buffer de 8KB
    
    for i := 0; i < 1000; i++ {
        datos := fmt.Sprintf("Dato %d: %s\n", i, strings.Repeat("*", 100))
        _, err := writer.WriteString(datos)
        if err != nil {
            return err
        }
        
        // Hacer flush si el buffer está casi lleno
        if writer.Available() < 1000 {
            if err := writer.Flush(); err != nil {
                return err
            }
        }
    }
    
    return writer.Flush()
}
```

### 3.18 Ejemplo de Scanner

```go
func ejemploScanner() error {
    archivo, err := os.Open("datos.csv")
    if err != nil {
        return err
    }
    defer archivo.Close()

    scanner := bufio.NewScanner(archivo)
    
    // Configurar un buffer más grande para líneas largas
    const maxCapacity = 512 * 1024 // 512KB
    buf := make([]byte, maxCapacity)
    scanner.Buffer(buf, maxCapacity)

    // Configurar split personalizado
    scanner.Split(func(data []byte, atEOF bool) (advance int, token []byte, err error) {
        if atEOF && len(data) == 0 {
            return 0, nil, nil
        }
        
        // Buscar el delimitador ';'
        if i := bytes.IndexByte(data, ';'); i >= 0 {
            return i + 1, data[0:i], nil
        }
        
        if atEOF {
            return len(data), data, nil
        }
        
        return 0, nil, nil
    })

    lineNum := 0
    for scanner.Scan() {
        lineNum++
        fmt.Printf("Campo %d: %s\n", lineNum, scanner.Text())
    }

    return scanner.Err()
}
```

### 3.19 Ejemplo de Procesamiento Paralelo

```go
func procesarArchivosParalelo(archivos []string) error {
    var wg sync.WaitGroup
    errChan := make(chan error, len(archivos))

    for _, archivo := range archivos {
        wg.Add(1)
        go func(nombre string) {
            defer wg.Done()
            
            file, err := os.Open(nombre)
            if err != nil {
                errChan <- fmt.Errorf("error abriendo %s: %w", nombre, err)
                return
            }
            defer file.Close()

            scanner := bufio.NewScanner(file)
            for scanner.Scan() {
                // Procesar línea
                procesarLinea(scanner.Text())
            }

            if err := scanner.Err(); err != nil {
                errChan <- fmt.Errorf("error escaneando %s: %w", nombre, err)
            }
        }(archivo)
    }

    go func() {
        wg.Wait()
        close(errChan)
    }()

    // Recolectar errores
    for err := range errChan {
        if err != nil {
            return err
        }
    }

    return nil
}

func procesarLinea(linea string) {
    // Implementar procesamiento específico
}
```

### 3.20 Ejemplo de Optimización de Memoria

```go
func optimizacionMemoria() error {
    archivo, err := os.Open("archivo_grande.txt")
    if err != nil {
        return err
    }
    defer archivo.Close()

    const bufferSize = 4096
    reader := bufio.NewReaderSize(archivo, bufferSize)
    
    buffer := make([]byte, 1024)
    for {
        n, err := reader.Read(buffer)
        if err == io.EOF {
            break
        }
        if err != nil {
            return err
        }
        
        // Procesar solo los bytes leídos
        if err := procesarBytes(buffer[:n]); err != nil {
            return err
        }
    }
    return nil
}
```

### Tips y Consideraciones

- Tamaño del Buffer
  - Ajusta el tamaño según tus necesidades
  - Considera la memoria disponible
  - Balance entre rendimiento y uso de recursos
  - Flush Regular

- Realiza flush periódicamente en escrituras largas
  - No olvides el flush final
  - Considera flush en puntos de sincronización
  - Manejo de Recursos

- Cierra siempre los archivos
  - Utiliza defer para garantizar la limpieza
  - Considera el uso de context para operaciones cancelables
  - Rendimiento

- Evita crear buffers innecesarios
  - Reutiliza buffers cuando sea posible
  - Considera la concurrencia para operaciones intensivas

### Ejemplos de Casos de Uso Comunes

- Procesamiento de Logs
- Parsing de CSV
- Procesamiento de Streams
- Lectura de Configuraciones

Estas funciones te permiten manejar entradas y salidas de manera más eficiente utilizando buffers, lo que puede mejorar el rendimiento de tus aplicaciones. Si necesitas más detalles o ejemplos específicos, ¡házmelo saber! Estoy aquí para ayudarte.
