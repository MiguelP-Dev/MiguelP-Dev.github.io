# Guía detallada de expresiones regulares

## **¿Que son las expresiones regulares?**

Expresiones regulares o `regexp` son patrones que ayudan a buscar y manipular cadenas de texto. En golang, se utiliza el paquete `regexp` para trabajar con ellas.

## Construccion de una expresión regular

Para usar una expresión regular, primero debemos compilarla. Esto se hace con la función `Compile` o `MustCompile` que pertenecen al paquete `regexp`. La diferencia es que `MustCompile` entra en panico si la expresión regular no es válida, mientras que `Compile`, solo devuelve el error.

```go
// Coincide con  cualquier texto excepto un salto de línea: "hlo", "clo", "vlo" etc.
re, err := regexp.Compile(".lo")
if err != nil {
    log.Fatal(err)
}
```

## Estructura básica de una expresión regular

### **Una expresión regular consta de**

* *Caracteres literales*: Coinciden con ellos mismos (ejemplo: `a`, `1`, etc.)
* *Metacaracteres*: Tienen significados especiales (ejemplo: `.`, `*`, `+`, etc.)
* *Clases de caracteres*: Representan rangos o conjuntos de caracteses (ejemplo: `[a-z]`, `\d`, etc.)
* *Grupos y referencias*: Permiten capturar y reutilizar partes de la coincidencia (ejemplo: `()`, `\1`, etc.)

### **Metacaracteres comunes en expresiones regulares**

* `.`: Coincide con cualquier caracter excepto un salto de línea.
* `*`: Coincide con 0 o más repeticiones del caracter anterior.
* `+`: Coincide con 1 o más repeticiones del caracter anterior.
* `?`: Coincide con 0 o 1 repetición del caracter anterior.
* `^`: Coincide con el inicio de una cadena.
* `$`: Coincide con el final de una cadena.
* `[]`: Define un conjunto de caracteres. Por ejemplo: `[abc]` coincide con 'a', 'b' y 'c'.
* `[^]`: Define un conjunto de caracteres negados. Por ejemplo `[^abc]` coincide con cualquier caracter que no sea 'a', 'b' o 'c'.
* `()`: Agrupa expresiones. Por ejemplo, `(abc)` que coincide con la secuencia 'abc'.
* `|`: Operador 'OR'. Por ejemplo, `a|b` coincide con 'a' o 'b'.
* `\d`: Coincide con un dígito (equivalente a `[0-9]`).
* `\D`: Coincide con cualquier caracter que no sea un dígito.
* `\w`: Coincide con cualquier caracter alfanumérico (equivalente a `[a-zA-Z0-9_]`).
* `\W`: Coincide con cualquier espacio que no sea alfanumérico.
* `\s`: Coincide con un espacio en blanco (espacio, tabulación, salto de línea, etc.).
* `\S`: Coincide con cualquier caracter que no sea un espacio en blanco.

### **Validar un correo electrónico**

```go
package main 

import (
    "fmt"
    "regexp"
)

func main(){
    email := "user@mail.com"
    re := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
    
    if  re.MatchString(email) {
        fmt.Println("El correo electrónico es válido.")
    } else {
        fmt.Println("El correo electrónico no es válido.")
    }
}
```

---

### **Extraer números de una cadena de texto**

```go
package main 

import (
    "fmt"
    "regexp"
)

func main(){
    text := "The year is 2025 and mounth is 03."
    re := regexp.MustCompile(`\d+`)
    numbers := re.FindAllString(text, -1)
    fmt.Println("Números encontrados: ", numbers)
}
```

### Reemplazar texto

```go
package main

import (
    "fmt"
    "regexp"
)

func main() {
    text := "The cat is black and the dog is brown."
    re := regexp.MustCompile(`cat|dog`)
    newText := re.ReplaceAllString(text, "animal")
    fmt.Println(newText)
}
```

### **Extra**

En las expresiones regulares de Golang, el símbolo `%` no tiene un significado especial. Es tratado como un carácter literal, es decir, coincide exactamente con el símbolo `%` en la cadena de texto.

Por ejemplo, si tienes una expresión regular que incluye `%`, como en `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`, el `%` simplemente coincide con el carácter `%` en una dirección de correo electrónico.

Aquí tienes un ejemplo de cómo se usa en una expresión regular para validar correos electrónicos:

```go
package main 

import (
    "fmt"
    "regexp"
)

func main(){
    email := "user%example@mail.com"
    re := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
    
    if re.MatchString(email) {
        fmt.Println("El correo electrónico es válido.")
    } else {
        fmt.Println("El correo electrónico no es válido.")
    }
}
```

En este caso, el `%` es parte del conjunto de caracteres permitidos en la parte local de la dirección de correo electrónico.

### **Explicación de la cadena de validación de un correo electrónico: `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`**

La expresión regular proporcionada se utiliza para validar direcciones de correo electrónico. A continuación, se desglosa cada parte de la expresión para entender su funcionamiento:

* `^`: Este símbolo indica el inicio de la cadena. Asegura que la coincidencia comience desde el principio del texto.
* `[a-zA-Z0-9._%+-]+`: Esta parte define el conjunto de caracteres permitidos antes del símbolo `@`. Incluye letras mayúsculas y minúsculas (`a-zA-Z`), dígitos (`0-9`), y los caracteres especiales `._%+-`. El signo `+` indica que debe haber al menos un carácter de este conjunto.
* `@`: Este símbolo es obligatorio y separa el nombre de usuario del dominio en una dirección de correo electrónico.
* `[a-zA-Z0-9.-]+`: Esta sección define el conjunto de caracteres permitidos para el dominio. Incluye letras mayúsculas y minúsculas (`a-zA-Z`), dígitos (`0-9`), y los caracteres especiales `.-`. Al igual que antes, el signo `+` indica que debe haber al menos un carácter de este conjunto.
* `\.`: Este es un carácter de escape que representa un punto literal (`.`) en la expresión regular. Es necesario porque el punto tiene un significado especial en las expresiones regulares.
* `[a-zA-Z]{2,}$`: Esta parte define la extensión del dominio, que debe consistir en letras mayúsculas o minúsculas (`a-zA-Z`) y tener una longitud de al menos dos caracteres. El símbolo `$` indica el final de la cadena, asegurando que no haya caracteres adicionales después de la extensión del dominio.

En resumen, esta expresión regular valida que una cadena tenga el formato de una dirección de correo electrónico estándar, con un nombre de usuario seguido de un símbolo `@`, un dominio, un punto, y una extensión de dominio de al menos dos letras.

### Conclusión

Las expresiones regulares son una herramienta poderosa para mamipular texto. En GO(Golang), el paquete regexp facilita el trabajo con estas expresiones. Es importante entender los símbolos y cómo se combinan para formar patrones efectivos.
