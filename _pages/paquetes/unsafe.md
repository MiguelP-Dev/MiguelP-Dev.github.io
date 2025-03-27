---
layout: default
title: unsafe | Miguel's Programing Notes
description: Guía del paquete unsafe de Go para manipulación de memoria de bajo nivel
permalink: /paquetes/unsafe/
categories: paquetes
icon: ⚠️
---

# Paquete `unsafe` en Go

El paquete `unsafe` permite manipular memoria directamente, rompiendo las garantías de seguridad de tipos de Go. **Úsalo con extrema precaución**, ya que errores pueden causar crashes o vulnerabilidades.  

---

## Funciones Principales  

### 1. **`unsafe.Sizeof`**

**Descripción**: Obtiene el tamaño en bytes de un tipo o variable.  

**Ejemplo con Estructuras**:

```go  
type User struct {  
    ID    int32   // 4 bytes  
    Name  string  // 16 bytes (en 64-bit)  
    Admin bool    // 1 byte (pero alineación a 8 bytes)  
}  

func main() {  
    fmt.Println("Tamaño de User:", unsafe.Sizeof(User{})) // 4 + 16 + 8 = 32 bytes  
}  
```  

---

### 2. **`unsafe.Alignof`**

**Descripción**: Determina la alineación en memoria requerida por un tipo.  

**Ejemplo Práctico**:

```go  
func main() {  
    var (  
        a int8  
        b float64  
    )  
    fmt.Println("Alineación int8:", unsafe.Alignof(a))   // 1  
    fmt.Println("Alineación float64:", unsafe.Alignof(b)) // 8  
}  
```  

---

### 3. **`unsafe.Offsetof`**

**Descripción**: Calcula el desplazamiento de un campo dentro de una estructura.  

**Uso en Serialización Binaria**:

```go  
type Header struct {  
    Magic  [4]byte  
    Length uint32  
}  

func main() {  
    h := Header{}  
    // Obtener posición del campo Length  
    offset := unsafe.Offsetof(h.Length)  
    fmt.Println("Offset de Length:", offset) // 4  
}  
```  

---

### 4. **`unsafe.Pointer`**

**Descripción**: Puntero genérico que permite conversiones entre tipos.  

**Conversión de Slices a Bytes**:

```go  
func sliceToBytes(s []int) []byte {  
    size := len(s) * unsafe.Sizeof(s[0])  
    ptr := unsafe.Pointer(&s[0])  
    return unsafe.Slice((*byte)(ptr), size)  
}  

func main() {  
    nums := []int{0x12345678, 0x9ABCDEF0}  
    bytes := sliceToBytes(nums)  
    fmt.Printf("% x\n", bytes) // 78 56 34 12 f0 de bc 9a (little-endian)  
}  
```  

---

## Casos de Uso Avanzados  

### 1. **Acceso a Campos No Exportados**

```go  
type Secret struct {  
    visible int  
    hidden  int  
}  

func main() {  
    s := Secret{10, 20}  
    // Acceder al campo 'hidden'  
    ptr := unsafe.Pointer(&s)  
    hiddenPtr := unsafe.Add(ptr, unsafe.Offsetof(Secret{}.hidden))  
    fmt.Println("hidden:", *(*int)(hiddenPtr)) // 20  
}  
```  

### 2. **Interoperabilidad con C**

```go  
/* 
#include <stdlib.h> 
*/  
import "C"  
import "unsafe"  

func callCMalloc() {  
    cptr := C.malloc(100)  
    defer C.free(cptr)  
    goSlice := unsafe.Slice((*byte)(cptr), 100)  
    goSlice[0] = 0xFF  
}  
```  

---

## Mejores Prácticas  

1. **Alternativas Seguras**:

   - Usar `encoding/binary` para serialización en lugar de `unsafe`.  
   - Preferir `reflect` para inspección de tipos cuando sea posible.  

2. **Aislamiento**:

   - Limitar el uso de `unsafe` a paquetes pequeños y bien documentados.  

3. **Pruebas Rigurosas**:

   ```go  
   func TestUnsafeConversion(t *testing.T) {  
       orig := []int32{1, 2, 3}  
       bytes := sliceToBytes(orig)  
       restored := (*[3]int32)(unsafe.Pointer(&bytes[0]))[:]  
       assert.Equal(t, orig, restored)  
   }  
   ```  

---

## Errores Comunes  

### 1. **Punteros Inválidos por Recolección de Basura**

```go  
// ❌ Incorrecto  
ptr := uintptr(unsafe.Pointer(&x))  
// GC puede mover &x, haciendo ptr inválido  

// ✅ Correcto  
ptr := unsafe.Pointer(&x) // Mantiene referencia activa  
```  

### 2. **Alineación Incorrecta**

```go  
type Data struct {  
    a byte  
    b int64 // Requiere alineación de 8 bytes  
}  

func main() {  
    d := Data{}  
    // Offsetof(b) es 8, no 1  
}  
```  

---

## Rendimiento vs Seguridad  

### Benchmark: Suma de Slice con `unsafe`

```go  
func SumaSegura(s []int) (sum int) {  
    for _, v := range s {  
        sum += v  
    }  
    return  
}  

func SumaUnsafe(s []int) int {  
    ptr := unsafe.Pointer(&s[0])  
    size := len(s)  
    sum := 0  
    for i := 0; i < size; i++ {  
        sum += *(*int)(unsafe.Add(ptr, uintptr(i)*unsafe.Sizeof(s[0])))  
    }  
    return sum  
}  

// Resultados:  
// SumaSegura-8   500 ns/op  
// SumaUnsafe-8   150 ns/op  
```  

**Conclusión**: `unsafe` puede acelerar código crítico, pero sacrifica seguridad.  

---

## Advertencias de Seguridad  

1. **Corrupción de Memoria**:

   ```go  
   a := [3]int{1, 2, 3}  
   b := (*[4]int)(unsafe.Pointer(&a)) // ¡Peligro!  
   b[3] = 4 // Escribe fuera del array  
   ```  

2. **Violación de Tipos**:

   ```go  
   var x float64 = 3.14  
   y := *(*int64)(unsafe.Pointer(&x))  
   fmt.Println(y) // 4614253070214989087 (representación binaria)  
   ```  

---

## Conclusión

El paquete `unsafe` es una herramienta poderosa para:

- Optimización extrema de rendimiento  
- Interfaz con código de bajo nivel (C, hardware)  
- Experimentación con estructuras de memoria  

Siempre:

- Documenta exhaustivamente su uso  
- Aísla en módulos específicos  
- Valida con pruebas y análisis estático (`go vet`)  
