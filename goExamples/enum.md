# Emum en Golang

Los enums en `Go` no existen de la misma manera que en otros lenguajes de programación como C++ o Java. Sin embargo, puedes lograr un comportamiento similar utilizando tipos definidos por el usuario junto con constantes. La idea es definir un tipo y luego crear constantes que representen los valores posibles de ese tipo.

Aquí tienes una explicación teórica de cómo puedes implementar enums en Go:

1. **Definición del Tipo**: Crea un tipo definido por el usuario utilizando `type`.
2. **Creación de Constantes**: Define constantes para los diferentes valores posibles del enum utilizando `const` y el tipo definido.
3. **Uso de iota**: `iota` es una constante predefinida en Go que se puede utilizar para crear secuencias de valores.

Aquí tienes un ejemplo teórico:

```go
// Definir un tipo para los estados de la orden
type OrderStatus int

// Constantes que representan los diferentes estados de la orden
const (
    Pending OrderStatus = iota
    Shipped
    Delivered
    Cancelled
)

// Método para convertir el estado de la orden a una cadena
func (status OrderStatus) String() string {
    return [...]string{"Pending", "Shipped", "Delivered", "Cancelled"}[status]
}
```

Esta línea de código en Go implementa una técnica común para manejar enumeraciones de estados. Vamos a desglosarla:

1. `[...]string`: Esta sintaxis crea un array de tamaño fijo en Go. Los tres puntos `...` indican que el compilador debe inferir automáticamente el tamaño del array basándose en el número de elementos proporcionados.

2. `{"Pending", "Shipped", "Delivered", "Cancelled"}`: Define los valores del array, que son cuatro estados posibles de lo que parece ser un sistema de seguimiento de envíos.

3. `[status]`: Accede a un elemento específico del array usando la variable `status` como índice.

Por ejemplo, si `status` es `0`, devolverá "Pending", si es `1` devolverá "Shipped", y así sucesivamente.

## Consideraciones importantes

- Este patrón es una forma concisa de implementar una especie de enumeración en Go
- Es importante asegurarse de que `status` esté dentro del rango válido (0-3), ya que Go entrará en pánico si intentas acceder a un índice fuera de rango
- Una alternativa más segura podría ser usar constantes definidas o un tipo personalizado con `iota`

Aquí un ejemplo más seguro usando constantes:

````go
const (
    StatusPending   = iota // 0
    StatusShipped         // 1
    StatusDelivered      // 2
    StatusCancelled      // 3
)

func getStatusString(status int) string {
    statusStrings := [...]string{"Pending", "Shipped", "Delivered", "Cancelled"}
    if status < 0 || status >= len(statusStrings) {
        return "Unknown"
    }
    return statusStrings[status]
}
````

---

**Explicación:**

- **Definición del Tipo**: `type OrderStatus int` define un nuevo tipo llamado `OrderStatus` que es un alias para `int`.
- **Creación de Constantes**: `const` define las constantes `Pending`, `Shipped`, `Delivered` y `Cancelled`, todas del tipo `OrderStatus`. `iota` se utiliza para generar valores consecutivos para estas constantes.
- **Función `String()`**: Esta función convierte el valor del estado de la orden en una cadena legible.

Este patrón es común en Go y se utiliza para crear enumeraciones que son fáciles de entender y utiliza.
