# Paquete `reflect` en Go: Guía Práctica con Ejemplos

El paquete `reflect` en Go permite inspeccionar y manipular tipos y valores en tiempo de ejecución. A continuación, se presenta una guía detallada con ejemplos prácticos y casos de uso comunes.

---

## Funciones y Tipos Clave

### 1. **Obtener Tipo y Valor**
```go
package main

import (
    "fmt"
    "reflect"
)

func main() {
    x := 42
    fmt.Println("Tipo de x:", reflect.TypeOf(x))   // int
    fmt.Println("Valor de x:", reflect.ValueOf(x)) // 42
}
```

### 2. **Modificar Valores (Requiere Direccionabilidad)**
```go
func modificarValor() {
    y := 10
    v := reflect.ValueOf(&y).Elem() // Usar Elem() para obtener el valor direccionable
    if v.CanSet() {
        v.SetInt(20)
    }
    fmt.Println("y modificada:", y) // 20
}
```

### 3. **Crear Valores Dinámicamente**
```go
func crearValor() {
    t := reflect.TypeOf(0)                // Tipo int
    zero := reflect.Zero(t)               // Valor cero (0)
    nuevo := reflect.New(t).Elem()        // Nuevo int (0)
    nuevo.SetInt(15)
    fmt.Println("Valor creado:", nuevo)   // 15
}
```

---

## Casos de Uso Avanzados

### 1. **Inspeccionar una Estructura**
```go
type Usuario struct {
    Nombre string `json:"nombre"`
    Edad   int    `json:"edad"`
}

func inspeccionarStruct() {
    u := Usuario{"Ana", 30}
    t := reflect.TypeOf(u)
    v := reflect.ValueOf(u)

    for i := 0; i < t.NumField(); i++ {
        campo := t.Field(i)
        valor := v.Field(i)
        tag := campo.Tag.Get("json")
        fmt.Printf("Campo: %s, Valor: %v, Tag JSON: %s\n", campo.Name, valor, tag)
    }
}
// Salida:
// Campo: Nombre, Valor: Ana, Tag JSON: nombre
// Campo: Edad, Valor: 30, Tag JSON: edad
```

### 2. **Llamar a una Función Dinámicamente**
```go
func llamarFuncion() {
    // Función a llamar: func Sumar(a, b int) int
    suma := func(a, b int) int { return a + b }
    v := reflect.ValueOf(suma)

    args := []reflect.Value{
        reflect.ValueOf(3),
        reflect.ValueOf(5),
    }

    resultado := v.Call(args)
    fmt.Println("3 + 5 =", resultado[0].Int()) // 8
}
```

### 3. **Validar Tipos en Tiempo de Ejecución**
```go
func validarTipo(valor interface{}, esperado reflect.Kind) bool {
    return reflect.TypeOf(valor).Kind() == esperado
}

func main() {
    fmt.Println(validarTipo(42, reflect.Int))      // true
    fmt.Println(validarTipo("Hola", reflect.Bool)) // false
}
```

---

## Mejores Prácticas y Advertencias

1. **Direccionabilidad**:
   - Solo los valores obtenidos con `reflect.ValueOf(&x).Elem()` son modificables.
   ```go
   x := 5
   v := reflect.ValueOf(x)
   // v.SetInt(10) // Panic: valor no direccionable
   ```

2. **Verificar `Kind()` Antes de Operar**:
   ```go
   v := reflect.ValueOf(42)
   if v.Kind() == reflect.Int {
       fmt.Println("Es un entero:", v.Int())
   }
   ```

3. **Rendimiento**:
   - Evita usar reflection en código crítico para el rendimiento.

4. **Manejo de Errores**:
   - Usa `recover()` para capturar panics en operaciones inseguras:
   ```go
   defer func() {
       if r := recover(); r != nil {
           fmt.Println("Error:", r)
       }
   }()
   ```

---

## Ejemplo Integrado: Serialización Genérica

```go
func serializar(valor interface{}) map[string]interface{} {
    resultado := make(map[string]interface{})
    v := reflect.ValueOf(valor)
    t := reflect.TypeOf(valor)

    for i := 0; i < v.NumField(); i++ {
        campo := t.Field(i)
        clave := campo.Tag.Get("json")
        if clave == "" {
            clave = campo.Name
        }
        resultado[clave] = v.Field(i).Interface()
    }
    return resultado
}

func main() {
    u := Usuario{"Carlos", 25}
    fmt.Println(serializar(u)) // map[nombre:Carlos edad:25]
}
```

---

## Conclusión

El paquete `reflect` es útil para:
- Implementar librerías genéricas (JSON, YAML).
- Validar estructuras dinámicamente.
- Crear sistemas de plugins o configuración flexible.

**Recomendaciones**:
- Úsalo solo cuando sea necesario (evítalo en código crítico).
- Verifica siempre tipos y direccionabilidad.
- Combínalo con interfaces para mantener seguridad de tipos.

Con estos ejemplos y prácticas, podrás aprovechar el poder de la reflexión en Go manteniendo tu código robusto y eficiente.