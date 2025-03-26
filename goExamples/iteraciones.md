# Iteraciones en Golang

```go
package main

import (
    "fmt"
)

func main() {
    // 1. Bucle for básico
    for i := 1; i <= 10; i++ {
        fmt.Println(i)
    }

    // 2. Bucle for con condición
    i := 1
    for i <= 10 {
        fmt.Println(i)
        i++
    }

    // 3. Bucle for infinito con break
    i = 1
    for {
        if i > 10 {
            break
        }
        fmt.Println(i)
        i++
    }

    // 4. Iteración sobre un array
    nums := [10]int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}
    for _, num := range nums {
        fmt.Println(num)
    }

    // 5. Iteración sobre un slice
    numSlice := []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}
    for _, num := range numSlice {
        fmt.Println(num)
    }

    // 6. Iteración sobre un mapa
    numMap := map[int]string{
        1: "one", 2: "two", 3: "three", 4: "four", 5: "five",
        6: "six", 7: "seven", 8: "eight", 9: "nine", 10: "ten",
    }
    for key := range numMap {
        fmt.Println(key)
    }

    // 7. Iteración sobre una cadena de texto
    str := "12345678910"
    for _, char := range str {
        fmt.Println(string(char))
    }

    // 8. Iteración con goto (no recomendado)
    i = 1
    Loop:
    if i <= 10 {
        fmt.Println(i)
        i++
        goto Loop
    }

    // 9. Iteración con una función recursiva
    var recursivePrint func(int)
    recursivePrint = func(n int) {
        if n > 10 {
            return
        }
        fmt.Println(n)
        recursivePrint(n + 1)
    }
    recursivePrint(1)

    // 10. Iteración con un canal
    ch := make(chan int)
    go func() {
        for i := 1; i <= 10; i++ {
            ch <- i
        }
        close(ch)
    }()
    for num := range ch {
        fmt.Println(num)
    }
}
```

## Importante

El uso de `goto` para crear bucles no es recomendado en la mayoría de los lenguajes de programación, incluyendo Go, por varias razones:

1. **Legibilidad**: El uso de `goto` puede hacer que el flujo del programa sea difícil de seguir y entender. Los bucles `for` y `while` son estructuras de control más claras y fáciles de leer.

2. **Mantenimiento**: El código que utiliza `goto` puede ser más difícil de mantener y depurar. Los saltos incondicionales pueden llevar a errores difíciles de rastrear y corregir.

3. **Estructura**: Los lenguajes modernos promueven el uso de estructuras de control más estructuradas y legibles, como los bucles `for`, `while`, y las funciones recursivas. Estas estructuras ayudan a mantener el código organizado y comprensible.

4. **Errores**: El uso de `goto` puede llevar a errores como bucles infinitos o saltos a etiquetas incorrectas, lo que puede causar comportamientos inesperados en el programa.

En resumen, aunque `goto` puede ser útil en casos muy específicos, generalmente es mejor evitar su uso y optar por estructuras de control más claras y seguras.