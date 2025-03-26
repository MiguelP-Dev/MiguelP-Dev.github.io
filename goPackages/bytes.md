# Paquete bytes en Go

El paquete `bytes` en Go proporciona implementaciones eficientes para la manipulación de slices de bytes. Es fundamental para el procesamiento de datos binarios y texto en forma de bytes.

## 1. Operaciones Básicas

### 1.1 Comparación y Búsqueda

```go
func ejemplosComparacion() {
    // Compare
    texto1 := []byte("hello")
    texto2 := []byte("world")
    resultado := bytes.Compare(texto1, texto2) // -1 porque "hello" < "world"
    
    // Contains
    contenido := []byte("Go es un lenguaje increíble")
    subcadena := []byte("lenguaje")
    contiene := bytes.Contains(contenido, subcadena) // true
    
    // ContainsAny
    tieneVocales := bytes.ContainsAny([]byte("hello"), "aeiou") // true
    
    // ContainsRune
    tieneLetra := bytes.ContainsRune([]byte("golang"), 'g') // true
    
    // Count
    texto := []byte("go go go")
    ocurrencias := bytes.Count(texto, []byte("go")) // 3
}
```

### 1.2 Prefijos y Sufijos

```go
func ejemplosPrefijosySufijos() {
    datos := []byte("archivo.txt")
    
    // HasPrefix
    esArchivo := bytes.HasPrefix(datos, []byte("arch")) // true
    
    // HasSuffix
    esTexto := bytes.HasSuffix(datos, []byte(".txt")) // true
    
    // Ejemplo práctico de validación de archivos
    func validarArchivo(nombre []byte, extensionesPermitidas [][]byte) bool {
        for _, ext := range extensionesPermitidas {
            if bytes.HasSuffix(nombre, ext) {
                return true
            }
        }
        return false
    }
    
    extensiones := [][]byte{[]byte(".txt"), []byte(".doc"), []byte(".pdf")}
    esValido := validarArchivo([]byte("documento.pdf"), extensiones) // true
}
```

## 2. Manipulación de Texto

### 2.1 Transformación de Casos

```go
func ejemplosTransformacion() {
    // ToUpper/ToLower
    texto := []byte("Hello, World!")
    mayusculas := bytes.ToUpper(texto)
    minusculas := bytes.ToLower(texto)
    
    // Title
    titulo := bytes.Title([]byte("bienvenido a go")) // "Bienvenido A Go"
    
    // Ejemplo práctico de normalización
    func normalizarTexto(entrada []byte) []byte {
        // Convertir a minúsculas
        texto := bytes.ToLower(entrada)
        // Eliminar espacios extras
        texto = bytes.TrimSpace(texto)
        // Reemplazar múltiples espacios por uno solo
        texto = bytes.Join(bytes.Fields(texto), []byte(" "))
        return texto
    }
    
    normalizado := normalizarTexto([]byte("  HOLA   Mundo  ")) // "hola mundo"
}
```

### 2.2 Separación y Unión

```go
func ejemplosSeparacionUnion() {
    // Split
    csv := []byte("id,nombre,edad")
    campos := bytes.Split(csv, []byte(","))
    
    // Fields
    texto := []byte("  go  es  genial  ")
    palabras := bytes.Fields(texto)
    
    // Join
    slices := [][]byte{[]byte("hola"), []byte("mundo")}
    unidos := bytes.Join(slices, []byte(" "))
    
    // Ejemplo práctico de procesamiento CSV
    func procesarCSV(datos []byte) [][]byte {
        lineas := bytes.Split(datos, []byte("\n"))
        resultado := make([][]byte, 0, len(lineas))
        
        for _, linea := range lineas {
            if len(bytes.TrimSpace(linea)) > 0 {
                campos := bytes.Split(linea, []byte(","))
                for i := range campos {
                    campos[i] = bytes.TrimSpace(campos[i])
                }
                resultado = append(resultado, bytes.Join(campos, []byte(",")))
            }
        }
        
        return resultado
    }
}
```

## 3. Buffer

### 3.1 Operaciones con Buffer

```go
func ejemplosBuffer() {
    // Crear y escribir en un buffer
    var buf bytes.Buffer
    
    // Escribir bytes
    buf.Write([]byte("Hello"))
    
    // Escribir string
    buf.WriteString(", ")
    
    // Escribir un byte
    buf.WriteByte('W')
    
    // Escribir rune
    buf.WriteRune('🌟')
    
    // Leer del buffer
    contenido := buf.Bytes()
    str := buf.String()
    
    // Reset del buffer
    buf.Reset()
    
    // Ejemplo práctico: Constructor de consultas SQL
    type SQLBuilder struct {
        buffer bytes.Buffer
        args   []interface{}
    }
    
    func (sb *SQLBuilder) Where(condicion string, args ...interface{}) *SQLBuilder {
        if sb.buffer.Len() > 0 {
            sb.buffer.WriteString(" AND ")
        }
        sb.buffer.WriteString(condicion)
        sb.args = append(sb.args, args...)
        return sb
    }
    
    query := new(SQLBuilder)
    query.Where("edad > ?", 18).Where("activo = ?", true)
}
```

### 3.2 Ejemplo Avanzado de Buffer

```go
func ejemploBufferAvanzado() {
    // Buffer con capacidad inicial
    buf := bytes.NewBuffer(make([]byte, 0, 1024))
    
    // Escribir con formato
    fmt.Fprintf(buf, "Usuario: %s, Edad: %d", "Juan", 25)
    
    // Leer línea por línea
    for {
        linea, err := buf.ReadBytes('\n')
        if err == io.EOF {
            break
        }
        // Lógica para procesar línea
    }
    
    // Ejemplo práctico: Logger personalizado
    type Logger struct {
        buffer bytes.Buffer
        mu     sync.Mutex
    }
    
    func (l *Logger) Log(formato string, args ...interface{}) {
        l.mu.Lock()
        defer l.mu.Unlock()
        
        // Añadir timestamp
        l.buffer.WriteString(time.Now().Format(time.RFC3339))
        l.buffer.WriteString(" - ")
        fmt.Fprintf(&l.buffer, formato, args...)
        l.buffer.WriteByte('\n')
    }
}
```

## 4. Casos de Uso Prácticos

### 4.1 Procesamiento de Archivos

```go
func ejemploProcesamiento() {
    // Leer y procesar un archivo por chunks
    func procesarArchivoGrande(filename string) error {
        file, err := os.Open(filename)
        if err != nil {
            return err
        }
        defer file.Close()

        buffer := make([]byte, 4096)
        for {
            n, err := file.Read(buffer)
            if err == io.EOF {
                break
            }
            if err != nil {
                return err
            }

            // Procesar chunk
            chunk := buffer[:n]
            procesarChunk(chunk)
        }
        return nil
    }
}
```

### 4.2 Manipulación de Templates

```go
func ejemploTemplates() {
    // Template simple con reemplazo de variables
    func reemplazarVariables(template []byte, vars map[string][]byte) []byte {
        resultado := make([]byte, len(template))
        copy(resultado, template)
        
        for key, value := range vars {
            placeholder := []byte("{{" + key + "}}")
            resultado = bytes.Replace(resultado, placeholder, value, -1)
        }
        
        return resultado
    }
    
    template := []byte("Hola {{nombre}}, bienvenido a {{plataforma}}")
    vars := map[string][]byte{
        "nombre":     []byte("Juan"),
        "plataforma": []byte("Go"),
    }
    
    final := reemplazarVariables(template, vars)
}
```

## 5. Optimizaciones y Mejores Prácticas

### 5.1 Preasignación de Memoria

```go
func ejemplosOptimizacion() {
    // Preasignar slice para mejor rendimiento
    datos := make([]byte, 0, 1024)
    
    // Usar Builder para concatenaciones eficientes
    var builder strings.Builder
    builder.Grow(1024) // Preasignar capacidad
    
    // Reutilizar buffers
    pool := sync.Pool{
        New: func() interface{} {
            return bytes.NewBuffer(make([]byte, 0, 4096))
        },
    }
}
```

### 5.2 Procesamiento Concurrente

```go
func ejemplosConcurrencia() {
    // Procesar grandes cantidades de datos en paralelo
    func procesarDatosParalelo(datos [][]byte, numWorkers int) {
        jobs := make(chan []byte, len(datos))
        results := make(chan []byte, len(datos))
        
        // Iniciar workers
        for i := 0; i < numWorkers; i++ {
            go func() {
                for data := range jobs {
                    // Procesar datos
                    processed := bytes.ToUpper(data)
                    results <- processed
                }
            }()
        }
        
        // Enviar trabajos
        for _, data := range datos {
            jobs <- data
        }
        close(jobs)
        
        // Recolectar resultados
        for i := 0; i < len(datos); i++ {
            <-results
        }
    }
}
```

## 6. Referencias y Recursos Adicionales

- [Documentación oficial del paquete bytes](https://golang.org/pkg/bytes/)
- [Effective Go - Strings y Bytes](https://golang.org/doc/effective_go.html#strings)
- [Go Blog - Strings, bytes, runes and characters](https://blog.golang.org/strings)
