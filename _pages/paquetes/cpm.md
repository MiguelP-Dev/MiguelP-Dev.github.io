# Paquete cmp en Go

El paquete `cmp` en Go proporciona funciones útiles para comparar valores ordenados. Este documento explora en detalle sus funcionalidades y usos prácticos.

## 1. Funciones Principales

| **Función** | **Descripción** |
|-------------|-----------------|
| `Compare`   | Compara dos valores y devuelve -1 si el primer valor es menor que el segundo, 0 si son iguales, y +1 si el primer valor es mayor que el segundo. |
| `Less`      | Determina si un valor es menor que otro. |
| `Or`        | Devuelve el primer valor no igual al valor cero de sus argumentos. Si no hay argumentos no cero, devuelve el valor cero. |
| `Equal`     | Compara dos valores y determina si son iguales, utilizando opciones personalizadas si es necesario. |
| `Diff`      | Devuelve una cadena que describe las diferencias entre dos valores. |
| `Indirect`  | Representa un valor indirecto, proporcionando métodos para obtener el tipo y los valores indirectos. |
| `MapIndex`  | Representa un índice de un mapa, proporcionando métodos para obtener la clave y los valores. |
| `SliceIndex`| Representa un índice de una lista, proporcionando métodos para obtener la clave y los valores. |

## 2. Ejemplos Prácticos

### 2.1 Comparación Básica

```go
func ejemplosComparacionBasica() {
    // Comparación de números
    fmt.Println(cmp.Compare(1, 2))        // -1
    fmt.Println(cmp.Compare(2, 2))        // 0
    fmt.Println(cmp.Compare(3, 2))        // 1

    // Comparación de strings
    fmt.Println(cmp.Compare("a", "b"))    // -1
    fmt.Println(cmp.Compare("b", "b"))    // 0
    fmt.Println(cmp.Compare("c", "b"))    // 1
}
```

### 2.2 Comparación de Estructuras Complejas

```go
type Persona struct {
    Nombre string
    Edad   int
}

func ejemploComparacionEstructuras() {
    p1 := Persona{Nombre: "Juan", Edad: 30}
    p2 := Persona{Nombre: "Juan", Edad: 30}
    p3 := Persona{Nombre: "Ana", Edad: 25}

    fmt.Println(cmp.Equal(p1, p2))  // true
    fmt.Println(cmp.Equal(p1, p3))  // false

    diff := cmp.Diff(p1, p3)
    fmt.Printf("Diferencias encontradas:\n%s", diff)
}
```

### 2.3 Comparación con Opciones Personalizadas

```go
type Producto struct {
    ID        int
    Nombre    string
    Precio    float64
    CreadoEn  time.Time
}

func ejemploComparacionPersonalizada() {
    prod1 := Producto{
        ID:       1,
        Nombre:   "Laptop",
        Precio:   999.99,
        CreadoEn: time.Now(),
    }

    prod2 := Producto{
        ID:       1,
        Nombre:   "Laptop",
        Precio:   999.99,
        CreadoEn: time.Now().Add(time.Second),
    }

    // Ignorar el campo CreadoEn en la comparación
    opts := cmp.Options{
        cmp.FilterPath(func(p cmp.Path) bool {
            return p.String() == "CreadoEn"
        }, cmp.Ignore()),
    }

    fmt.Println(cmp.Equal(prod1, prod2, opts))  // true
}
```

## 3. Casos de Uso Avanzados

### 3.1 Comparación de Slices

```go
func ejemploComparacionSlices() {
    nums1 := []int{1, 2, 3, 4, 5}
    nums2 := []int{1, 2, 3, 4, 5}
    nums3 := []int{5, 4, 3, 2, 1}

    // Comparación directa de slices
    fmt.Println(cmp.Equal(nums1, nums2))  // true
    fmt.Println(cmp.Equal(nums1, nums3))  // false

    // Comparación con opciones personalizadas
    equalLength := cmp.Comparer(func(a, b []int) bool {
        return len(a) == len(b)
    })
    fmt.Println(cmp.Equal(nums1, nums3, equalLength))  // true

    // Encontrar diferencias
    diff := cmp.Diff(nums1, nums3)
    fmt.Printf("Diferencias encontradas:\n%s", diff)

    // Comparación de slices ignorando el orden
    opts := cmp.Options{
        cmpopts.SortSlices(func(a, b int) bool { return a < b }),
    }
    fmt.Println(cmp.Equal(nums1, nums3, opts))  // true
}

### 3.2 Comparación de Maps

```go
func ejemploComparacionMaps() {
    map1 := map[string]int{"a": 1, "b": 2, "c": 3}
    map2 := map[string]int{"c": 3, "b": 2, "a": 1}
    map3 := map[string]int{"a": 1, "b": 2, "d": 4}

    fmt.Println(cmp.Equal(map1, map2))  // true
    fmt.Println(cmp.Equal(map1, map3))  // false

    diff := cmp.Diff(map1, map3)
    fmt.Printf("Diferencias encontradas:\n%s", diff)
}
```
