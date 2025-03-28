---
layout: default
title: slices | Miguel's Programing Notes
description: Guía del paquete slices de Go para manipulación eficiente de arreglos
permalink: /paquetes/slices/
categories: paquetes
icon: 🔪
---

# Paquete `slices` en Go

El paquete `slices`, parte de `golang.org/x/exp/slices`, ofrece funciones útiles para manipular slices de manera eficiente y segura. A continuación, se amplían las descripciones y ejemplos de sus funciones principales, incluyendo casos de uso avanzados y mejores prácticas.  

---

## Funciones Principales  

### 1. **`slices.Append`**

**Descripción**: Añade elementos a un slice, manejando automáticamente la reasignación de memoria si la capacidad es insuficiente. Similar al `append` nativo, pero con tipado genérico.  
**Sintaxis**: `func Append[S ~[]E, E any](s S, elems ...E) S`  

**Ejemplo Ampliado**:
{% raw %}
```go  
package main  

import (  
    "fmt"  
    "golang.org/x/exp/slices"  
)  

func main() {  
    s := make([]int, 2, 3) // Capacidad inicial: 3  
    s[0], s[1] = 1, 2  
    fmt.Printf("Antes de Append: %v, Capacidad: %d\n", s, cap(s)) // [1 2], 3  

    // Añadir 3 elementos (supera la capacidad)  
    s = slices.Append(s, 3, 4, 5)  
    fmt.Printf("Después de Append: %v, Nueva Capacidad: %d\n", s, cap(s)) // [1 2 3 4 5], 6  
}  
```
{% endraw %}

**Nota**: Al exceder la capacidad, `Append` crea un nuevo array con capacidad ampliada (normalmente el doble del tamaño anterior).  

---

### 2. **`slices.Clone`**

**Descripción**: Crea una copia superficial del slice. Los elementos no se duplican, pero el slice subyacente es nuevo.  
**Sintaxis**: `func Clone[S ~[]E, E any](s S) S`  

**Ejemplo con Structs**:
{% raw %}
```go  
type Persona struct {  
    Nombre string  
    Edad   int  
}  

func main() {  
    original := []Persona{{"Ana", 30}, {"Juan", 25}}  
    copia := slices.Clone(original)  

    copia[0].Edad = 31 // Modifica solo la copia  
    fmt.Println("Original:", original[0].Edad) // 30  
    fmt.Println("Copia:", copia[0].Edad)       // 31  
}  
```  
{% endraw %}
---

### 3. **`slices.Delete`**

**Descripción**: Elimina elementos desde el índice `i` hasta `j` (sin incluir `j`). Si los índices son inválidos, se genera un panic.  

**Ejemplo con Manejo de Errores**:
{% raw %}
```go  
func main() {  
    s := []string{"a", "b", "c", "d"}  

    // Caso válido  
    s = slices.Delete(s, 1, 3)  
    fmt.Println(s) // [a d]  

    // Caso inválido (índices fuera de rango)  
    defer func() {  
        if r := recover(); r != nil {  
            fmt.Println("Error:", r) // "slices: invalid slice indices"  
        }  
    }()  
    slices.Delete(s, 5, 10) // Genera panic  
}  
```  
{% endraw %}

---

### 4. **`slices.Insert`**

**Descripción**: Inserta elementos en la posición `i`. Si `i` es mayor que la longitud del slice, los elementos se añaden al final.  

**Ejemplos Variados**:

```go  
func main() {  
    s := []int{10, 20, 30}  

    // Insertar al inicio  
    s = slices.Insert(s, 0, 5)  
    fmt.Println(s) // [5 10 20 30]  

    // Insertar en posición intermedia  
    s = slices.Insert(s, 2, 15, 16)  
    fmt.Println(s) // [5 10 15 16 20 30]  

    // Insertar más allá de la longitud  
    s = slices.Insert(s, len(s)+5, 99) // Equivalente a Append  
    fmt.Println(s) // [5 10 15 16 20 30 99]  
}  
```  

---

### 5. **`slices.Index`**

**Descripción**: Retorna el primer índice del elemento `v`. Funciona con tipos `comparable` (enteros, strings, structs sin campos no comparables).  

**Ejemplo con Strings y Búsqueda Fallida**:

```go  
func main() {  
    frutas := []string{"manzana", "banana", "naranja"}  

    idx := slices.Index(frutas, "banana")  
    fmt.Println("Índice de banana:", idx) // 1  

    idx = slices.Index(frutas, "pera")  
    fmt.Println("Índice de pera:", idx) // -1  
}  
```  

---

### 6. **`slices.Sort`**

**Descripción**: Ordena el slice en orden ascendente. Soporta cualquier tipo que implemente `constraints.Ordered` (int, float, string).  

**Ejemplo con Strings y Ordenamiento Personalizado**:

```go  
func main() {  
    nombres := []string{"Carlos", "Ana", "David", "Beatriz"}  
    slices.Sort(nombres)  
    fmt.Println(nombres) // [Ana Beatriz Carlos David]  

    // Orden descendente usando SortFunc  
    slices.SortFunc(nombres, func(a, b string) bool {  
        return a > b  
    })  
    fmt.Println(nombres) // [David Carlos Beatriz Ana]  
}  
```  

---

### 7. **`slices.Equal`**

**Descripción**: Compara dos slices elemento por elemento. Para slices de structs, compara los valores de los campos.  

**Ejemplo con Slices de Distinta Longitud**:

```go  
func main() {  
    a := []int{1, 2, 3}  
    b := []int{1, 2, 3, 4}  
    c := []int{1, 2, 3}  

    fmt.Println(slices.Equal(a, b)) // false  
    fmt.Println(slices.Equal(a, c)) // true  
}  
```  

---

## Mejores Prácticas

1. **Capacidad vs. Longitud**: Al usar `Append`, pre-asigna capacidad con `make` si conoces el tamaño aproximado para evitar reasignaciones frecuentes.

2. **Índices en `Delete` e `Insert`**: Valida los índices dinámicamente para evitar panics.  
3. **Clonación Profunda**: `Clone` no duplica elementos anidados (ej: slices dentro de structs). Para copias profundas, implementa lógica personalizada.  
4. **Ordenamiento Personalizado**: Usa `SortFunc` para tipos complejos o criterios no estándar.  

---

## Conclusión

El paquete `slices` simplifica operaciones comunes, ofreciendo un rendimiento óptimo y seguridad de tipos. Al combinarlo con buenas prácticas, puedes escribir código Go más limpio y eficiente.  
