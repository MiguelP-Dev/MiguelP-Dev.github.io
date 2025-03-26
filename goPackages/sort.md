# Paquete `sort` en Go

El paquete `sort` de Go ofrece herramientas robustas para ordenar y buscar en colecciones. A continuación, se amplían las descripciones, ejemplos y mejores prácticas para aprovechar al máximo sus funcionalidades.  

---

## Funciones de Ordenación  

### 1. **`sort.Ints`**

**Descripción**: Ordena slices de enteros en orden ascendente de manera eficiente (complejidad O(n log n)).  

**Ejemplo con Duplicados y Capacidad**:

```go  
package main  

import (  
    "fmt"  
    "sort"  
)  

func main() {  
    nums := []int{4, 2, 4, 3, 1, 0}  
    sort.Ints(nums)  
    fmt.Println("Ordenado:", nums) // [0 1 2 3 4 4]  

    // Slice con capacidad predefinida  
    s := make([]int, 0, 10)  
    s = append(s, 9, 8, 7)  
    sort.Ints(s)  
    fmt.Println("Slice optimizado:", s) // [7 8 9]  
}  
```

**Nota**: La función modifica el slice original. Para evitar efectos secundarios, clona el slice antes de ordenar si es necesario.  

---

### 2. **`sort.Float64s`**

**Descripción**: Ordena slices de `float64`, manejando valores especiales como `NaN` (se colocan al final).  

**Ejemplo con NaN**:

```go  
package main  

import (  
    "fmt"  
    "math"  
    "sort"  
)  

func main() {  
    nums := []float64{4.2, math.NaN(), 2.1, math.NaN(), 3.3}  
    sort.Float64s(nums)  
    fmt.Println("Ordenado con NaN:", nums) // [2.1 3.3 4.2 NaN NaN]  
}  
```

**Advertencia**: Los valores `NaN` pueden causar comportamientos inesperados en comparaciones.  

---

### 3. **`sort.Strings`**

**Descripción**: Ordena lexicográficamente slices de strings, sensible a mayúsculas y minúsculas según Unicode.  

**Ejemplo con Unicode y Case-Insensitive**:

```go  
package main  

import (  
    "fmt"  
    "sort"  
    "strings"  
)  

func main() {  
    palabras := []string{"ñu", "Águila", "zapato", "árbol"}  
    sort.Strings(palabras)  
    fmt.Println("Orden lexicográfico:", palabras) // [Águila árbol zapato ñu]  

    // Orden case-insensitive  
    sort.Slice(palabras, func(i, j int) bool {  
        return strings.ToLower(palabras[i]) < strings.ToLower(palabras[j])  
    })  
    fmt.Println("Orden insensible a mayúsculas:", palabras) // [Águila árbol ñu zapato]  
}  
```

**Nota**: Usa `sort.Slice` para personalizar criterios de ordenación.  

---

### 4. **`sort.Sort` e Interfaces Personalizadas**

**Descripción**: Permite ordenar estructuras complejas implementando `sort.Interface`.  

**Ejemplo Multi-Criterio**:

```go  
type Producto struct {  
    Nombre  string  
    Precio  float64  
    Stock   int  
}  

// Ordenar por Precio (ascendente) y luego por Stock (descendente)  
type PorPrecioYStock []Producto  

func (p PorPrecioYStock) Len() int { return len(p) }  
func (p PorPrecioYStock) Swap(i, j int) { p[i], p[j] = p[j], p[i] }  
func (p PorPrecioYStock) Less(i, j int) bool {  
    if p[i].Precio == p[j].Precio {  
        return p[i].Stock > p[j].Stock // Stock descendente si Precio es igual  
    }  
    return p[i].Precio < p[j].Precio  
}  

func main() {  
    productos := []Producto{  
        {"Laptop", 999.99, 5},  
        {"Mouse", 19.99, 20},  
        {"Laptop", 999.99, 10},  
    }  
    sort.Sort(PorPrecioYStock(productos))  
    fmt.Println(productos) // [{Laptop 999.99 10} {Laptop 999.99 5} {Mouse 19.99 20}]  
}  
```

**Error común**: Olvidar implementar los tres métodos de `sort.Interface` genera errores de compilación.  

---

### 5. **`sort.Reverse`**

**Descripción**: Invierte el orden de una colección ya ordenable.  

**Ejemplo con Structs**:

```go  
func main() {  
    personas := []Persona{{"Juan", 30}, {"Ana", 25}, {"Pedro", 35}}  
    sort.Sort(sort.Reverse(PorEdad(personas)))  
    fmt.Println("Orden inverso por edad:", personas) // [{Pedro 35} {Juan 30} {Ana 25}]  
}  
```  

---

## Funciones de Búsqueda  

### 6. **`sort.Search`**

**Descripción**: Búsqueda binaria en colecciones ordenadas. Retorna el índice de inserción si el valor no existe.  

**Ejemplo con Validación**:

```go  
func main() {  
    nums := []int{10, 20, 30, 40, 50}  
    target := 35  

    idx := sort.Search(len(nums), func(i int) bool { return nums[i] >= target })  

    if idx < len(nums) && nums[idx] == target {  
        fmt.Println("Encontrado en posición:", idx)  
    } else {  
        fmt.Println("No encontrado. Se insertaría en:", idx) // Output: 3  
    }  
}  
```  

---

### 7. **`sort.SearchInts`**

**Descripción**: Versión optimizada de `Search` para slices de enteros.  

**Ejemplo con Slice Vacío**:

```go  
func main() {  
    var nums []int // Slice vacío  
    target := 5  
    idx := sort.SearchInts(nums, target)  
    fmt.Println("Índice para slice vacío:", idx) // 0 (siempre devuelve 0)  
}  
```  

---

## Mejores Prácticas y Consideraciones  

1. **Pre-Ordenar para Búsquedas**:  
   - `sort.Search` y `sort.SearchInts` requieren slices ordenados. Usar `sort.Ints` o similar antes de buscar.  

2. **Manejo de Estructuras Complejas**:  
   - Para ordenar por múltiples campos, define comparaciones jerárquicas en `Less` (ver ejemplo en `sort.Sort`).  

3. **Eficiencia con Slices Grandes**:  
   - Pre-asigna capacidad con `make` si el tamaño es conocido para minimizar reasignaciones.  

4. **Valores Especiales en Floats**:  
   - Los `NaN` pueden distorsionar resultados. Considera filtrarlos antes de ordenar.  

5. **Ordenamiento Inestable**:  
   - El paquete `sort` no garantiza estabilidad. Si es necesaria, implementa un algoritmo estable personalizado.  

---

## Casos Comunes de Error  

- **Índices Fuera de Rango**: Al usar `sort.Slice`, asegúrate de que `i` y `j` en `Less` estén dentro del rango del slice.  
- **Implementación Incorrecta de `sort.Interface`**: Omisión de métodos (`Len`, `Swap`, `Less`) causa errores en tiempo de compilación.  
- **Búsqueda en Slices No Ordenados**: `sort.Search` puede dar resultados incorrectos si el slice no está ordenado.  

---

## Conclusión

El paquete `sort` es una herramienta versátil para manejar operaciones de ordenación y búsqueda en Go. Al dominar sus funciones y comprender sus peculiaridades, puedes optimizar el rendimiento y claridad de tu código. Combínalo con prácticas como pre-ordenamiento y validación de índices para construir aplicaciones robustas.  
