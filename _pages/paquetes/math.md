# Paquete `math` en Go: Guía Completa con Ejemplos Avanzados

El paquete `math` en Go proporciona una amplia gama de funciones matemáticas esenciales para aplicaciones científicas, de ingeniería y análisis de datos. Esta guía ampliada incluye ejemplos prácticos, casos especiales y aplicaciones del mundo real.

---

## Constantes Matemáticas Clave
```go
math.Pi   // 3.141592653589793
math.E    // 2.718281828459045
math.Phi  // 1.618033988749895 (proporción áurea)
math.Inf(1)  // +Infinito
math.NaN()   // Not-a-Number
```

---

## Funciones Básicas Mejoradas

### 1. **`math.Abs` - Valor Absoluto**
```go
// Manejo de tipos enteros
func AbsInt(x int) int {
    if x < 0 {
        return -x
    }
    return x
}

// Ejemplo con float64
fmt.Println(math.Abs(-3.14))      // 3.14
fmt.Println(math.Abs(math.Inf(1))) // +Inf
```

### 2. **`math.Pow` - Potenciación**
```go
// Cálculo de interés compuesto
principal := 1000.0
tasa := 0.05
años := 3.0
monto := principal * math.Pow(1 + tasa, años)
fmt.Printf("Monto final: $%.2f\n", monto) // $1157.63

// Caso especial: Potencia cero
fmt.Println(math.Pow(5, 0)) // 1 (siempre)
```

### 3. **`math.Sqrt` - Raíz Cuadrada**
```go
// Distancia entre dos puntos (teorema de Pitágoras)
func Distancia(x1, y1, x2, y2 float64) float64 {
    dx := x2 - x1
    dy := y2 - y1
    return math.Sqrt(dx*dx + dy*dy)
}
fmt.Println(Distancia(0, 0, 3, 4)) // 5
```

---

## Funciones Trigonométricas Avanzadas

### 4. **Conversión de Grados a Radianes**
```go
func GradosARadianes(grados float64) float64 {
    return grados * math.Pi / 180
}

// Cálculo de altura de un edificio usando ángulo
distancia := 50.0  // metros
angulo := 60.0      // grados
altura := distancia * math.Tan(GradosARadianes(angulo))
fmt.Printf("Altura: %.2f metros\n", altura) // 86.60 m
```

### 5. **`math.Sin` - Movimiento Ondulatorio**
```go
// Simulación de onda senoidal
amplitud := 2.0
frecuencia := 1.0
tiempo := 0.5

posicion := amplitud * math.Sin(2 * math.Pi * frecuencia * tiempo)
fmt.Printf("Posición: %.2f\n", posicion) // 2.00
```

---

## Funciones Logarítmicas y Exponenciales

### 6. **`math.Log` - Crecimiento Exponencial**
```go
// Cálculo de tiempo de duplicación (regla del 72)
tasaCrecimiento := 0.08  // 8%
tiempoDuplicacion := math.Log(2) / math.Log(1 + tasaCrecimiento)
fmt.Printf("Se duplica en %.1f años\n", tiempoDuplicacion) // 9.0 años
```

### 7. **`math.Exp` - Decaimiento Radioactivo**
```go
// Cálculo de material restante
cantidadInicial := 100.0  // gramos
constanteDecaimiento := 0.005
tiempo := 100.0

cantidad := cantidadInicial * math.Exp(-constanteDecaimiento * tiempo)
fmt.Printf("Material restante: %.2f gramos\n", cantidad) // 60.65 g
```

---

## Funciones de Comparación y Casos Especiales

### 8. **`math.Max`/`math.Min` - Normalización de Datos**
```go
// Normalizar valores entre 0 y 1
valores := []float64{4, 2, 7, 1}
minVal := math.Inf(1)
maxVal := math.Inf(-1)

for _, v := range valores {
    minVal = math.Min(minVal, v)
    maxVal = math.Max(maxVal, v)
}

for i, v := range valores {
    valores[i] = (v - minVal) / (maxVal - minVal)
}
fmt.Println(valores) // [0.5 0.166... 1 0]
```

### 9. **`math.Mod` - Manejo de Números Negativos**
```go
fmt.Println(math.Mod(7, 3))   // 1
fmt.Println(math.Mod(-7, 3))  // -1 (comportamiento particular)
fmt.Println(math.Mod(7, -3))  // 1
fmt.Println(math.Mod(7, 0))   // NaN
```

---

## Mejores Prácticas y Advertencias

1. **Precisión en Comparaciones**:
   ```go
   // Evitar comparaciones directas con floats
   a := 0.1 + 0.2
   b := 0.3
   fmt.Println(a == b)                  // false
   fmt.Println(math.Abs(a-b) < 1e-9)    // true
   ```

2. **Manejo de Valores Especiales**:
   ```go
   x := math.Log(-1)                    // NaN
   fmt.Println(math.IsNaN(x))           // true
   fmt.Println(math.IsInf(math.Inf(1), 1)) // true
   ```

3. **Optimización de Rendimiento**:
   ```go
   // Precalcular valores frecuentes
   var (
       rad30 = GradosARadianes(30)
       sin30 = math.Sin(rad30)
       cos30 = math.Cos(rad30)
   )
   ```

---

## Ejemplo Integrado: Simulación Física

```go
// Simulación de movimiento parabólico
func SimularProyectil(velocidad, angulo, gravedad float64) ([]float64, []float64) {
    rad := GradosARadianes(angulo)
    vx := velocidad * math.Cos(rad)
    vy := velocidad * math.Sin(rad)
    tTotal := 2 * vy / gravedad
    
    var x, y []float64
    for t := 0.0; t <= tTotal; t += 0.1 {
        x = append(x, vx * t)
        y = append(y, vy * t - 0.5 * gravedad * t * t)
    }
    return x, y
}

// Uso:
x, y := SimularProyectil(50, 45, 9.81)
fmt.Println("Posiciones X:", x[:3]) // [0 35.355... 70.710...]
fmt.Println("Posiciones Y:", y[:3]) // [0 35.355...-4.905 70.710...-19.62]
```

---

Esta guía ampliada muestra cómo utilizar el paquete `math` para resolver problemas complejos, desde cálculos financieros hasta simulaciones físicas. Incluye manejo de casos especiales, optimizaciones y ejemplos aplicados a escenarios reales, proporcionando una base sólida para el desarrollo de aplicaciones matemáticas en Go.