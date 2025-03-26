# Paquete builtin en Go

El paquete `builtin` en Go no es un paquete tradicional que requiera importación. Representa las funciones, tipos y constantes predefinidas en el lenguaje Go que están disponibles globalmente sin necesidad de importación.

## 1. Funciones Predefinidas

### 1.1 append

Agrega elementos a un slice y devuelve el slice resultante.

```go
func ejemplosAppend() {
    // Ejemplo básico
    slice := []int{1, 2}
    slice = append(slice, 3, 4)
    
    // Append con múltiples elementos
    extras := []int{5, 6, 7}
    slice = append(slice, extras...)
    
    // Append con capacidad pre-reservada
    slice = make([]int, 0, 10)
    for i := 0; i < 5; i++ {
        slice = append(slice, i)
    }
    
    // Append en slices de interfaces
    var mixed []interface{}
    mixed = append(mixed, 42, "hola", true)
}
```

### 1.2 cap y len

Funciones para manejar capacidad y longitud de estructuras de datos.

```go
func ejemplosCapLen() {
    // Arrays
    arr := [5]int{1, 2, 3}
    fmt.Printf("Array - len: %d, cap: %d\n", len(arr), cap(arr))
    
    // Slices
    slice := make([]int, 3, 10)
    fmt.Printf("Slice - len: %d, cap: %d\n", len(slice), cap(slice))
    
    // Strings
    str := "hola"
    fmt.Printf("String - len: %d\n", len(str))
    
    // Canales
    ch := make(chan int, 5)
    fmt.Printf("Canal - len: %d, cap: %d\n", len(ch), cap(ch))
}
```

### 1.3 copy

Copia elementos entre slices.

```go
func ejemplosCopy() {
    // Copia básica
    src := []int{1, 2, 3, 4, 5}
    dst := make([]int, len(src))
    copied := copy(dst, src)
    fmt.Printf("Copiados: %d elementos\n", copied)
    
    // Copia parcial
    dst2 := make([]int, 3)
    copied = copy(dst2, src)
    fmt.Printf("Copiados parcialmente: %d elementos\n", copied)
    
    // Copia con solapamiento
    slice := []int{1, 2, 3, 4, 5}
    copy(slice[2:], slice[1:])
    fmt.Println("Después del solapamiento:", slice)
}
```

### 1.4 delete y make

Operaciones con mapas y creación de estructuras de datos.

```go
func ejemplosDeleteMake() {
    // Mapas
    m := make(map[string]int)
    m["uno"] = 1
    m["dos"] = 2
    
    delete(m, "uno")
    
    // Slices
    slice := make([]int, 5, 10)
    
    // Canales
    ch := make(chan string, 5)
    
    // Mapas con tipo personalizado
    type Persona struct {
        Nombre string
        Edad   int
    }
    personas := make(map[string]Persona)
}
```

### 1.5 panic y recover

Manejo de errores y recuperación.

```go
func ejemplosPanicRecover() {
    // Ejemplo básico
    defer func() {
        if r := recover(); r != nil {
            fmt.Printf("Recuperado de: %v\n", r)
        }
    }()
    
    // Panic con error personalizado
    type ErrorPersonalizado struct {
        Mensaje string
        Codigo  int
    }
    
    // Función que puede entrar en pánico
    procesarDatos := func(data []int) {
        if len(data) == 0 {
            panic(ErrorPersonalizado{
                Mensaje: "Datos vacíos",
                Codigo:  500,
            })
        }
    }
    
    procesarDatos([]int{}) // Esto causará pánico
}
```

## 2. Tipos Predefinidos

### 2.1 Tipos Numéricos

```go
func ejemplosTiposNumericos() {
    // Enteros
    var (
        a int     = 42
        b int8    = 127
        c int16   = 32767
        d int32   = 2147483647
        e int64   = 9223372036854775807
    )
    
    // Enteros sin signo
    var (
        f uint     = 42
        g uint8    = 255
        h uint16   = 65535
        i uint32   = 4294967295
        j uint64   = 18446744073709551615
        k uintptr  = uintptr(unsafe.Pointer(&a))
    )
    
    // Punto flotante
    var (
        l float32 = 3.14159
        m float64 = 3.14159265359
    )
    
    // Complejos
    var (
        n complex64  = 1 + 2i
        o complex128 = 1.5 + 2.5i
    )
}
```

### 2.2 Tipos Compuestos

```go
func ejemplosTiposCompuestos() {
    // Arrays
    var matriz [3][4]int
    
    // Slices
    slice := []string{"a", "b", "c"}
    
    // Mapas
    mapa := map[string]interface{}{
        "nombre": "Juan",
        "edad":   30,
        "activo": true,
    }
    
    // Canales
    ch1 := make(chan int)        // Canal sin buffer
    ch2 := make(chan int, 10)    // Canal con buffer
    ch3 := make(chan<- int)      // Canal solo envío
    ch4 := make(<-chan int)      // Canal solo recepción
}
```

## 3. Constantes Predefinidas

### 3.1 iota

```go
func ejemplosIota() {
    const (
        Domingo = iota
        Lunes
        Martes
        Miércoles
        Jueves
        Viernes
        Sábado
    )
    
    const (
        _           = iota             // 0
        KB float64  = 1 << (10 * iota) // 1 << 10
        MB                             // 1 << 20
        GB                             // 1 << 30
        TB                             // 1 << 40
    )
    
    const (
        Norte = 1 << iota // 1
        Este             // 2
        Sur              // 4
        Oeste           // 8
    )
}
```

## 4. Ejemplos Prácticos

### 4.1 Manejo de Colecciones

```go
func ejemplosColecciones() {
    // Slice dinámico
    datos := make([]int, 0, 10)
    for i := 0; i < 20; i++ {
        datos = append(datos, i)
        fmt.Printf("len=%d cap=%d %v\n", len(datos), cap(datos), datos)
    }
    
    // Mapa con valores compuestos
    type Producto struct {
        Nombre  string
        Precio  float64
        Stock   int
    }
    
    inventario := make(map[string]Producto)
    inventario["A001"] = Producto{"Laptop", 999.99, 10}
    inventario["A002"] = Producto{"Mouse", 29.99, 50}
    
    // Eliminación segura
    if _, existe := inventario["A003"]; existe {
        delete(inventario, "A003")
    }
}
```

### 4.2 Manejo de Errores Avanzado

```go
func ejemploErroresAvanzados() {
    type ErrorOperacion struct {
        Operacion string
        Err       error
    }
    
    func (e *ErrorOperacion) Error() string {
        return fmt.Sprintf("error en %s: %v", e.Operacion, e.Err)
    }
    
    // Función que usa panic y recover
    procesarOperacion := func(operacion string) (err error) {
        defer func() {
            if r := recover(); r != nil {
                err = &ErrorOperacion{
                    Operacion: operacion,
                    Err:       fmt.Errorf("%v", r),
                }
            }
        }()
        
        // Simular operación que puede fallar
        if operacion == "" {
            panic("operación inválida")
        }
        
        return nil
    }
}
```

## 5. Mejores Prácticas

1. **Uso de append**
   - Pre-reserva capacidad cuando conoces el tamaño final
   - Usa append(...) para concatenar slices
   - Considera la capacidad al hacer operaciones en batch

2. **Manejo de Errores**
   - Usa panic solo para errores irrecuperables
   - Implementa recover en funciones críticas
   - Propaga errores apropiadamente

3. **Optimización de Memoria**
   - Reutiliza slices y mapas cuando sea posible
   - Libera referencias a objetos grandes
   - Usa make con capacidad inicial apropiada

4. **Concurrencia**
   - Cierra canales desde el emisor
   - Usa canales con buffer cuando sea apropiado
   - Considera el uso de select para operaciones timeout

## 6. Referencias y Recursos Adicionales

- [Documentación oficial de Go](https://golang.org/pkg/builtin/)
- [Effective Go](https://golang.org/doc/effective_go.html)
- [Go by Example](https://gobyexample.com/)
