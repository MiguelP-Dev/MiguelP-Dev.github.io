# Ejemplo de validación de direcciones de email con Regex

Para validar una dirección de correo electrónico, podemos considerar varios criterios clave

1. **Formato Correcto**: La dirección debe seguir el formato estándar `local-part@domain`.
2. **Caracteres Válidos**: Verificar que la dirección contenga solo caracteres válidos (letras, números, puntos, guiones y guiones bajos).
3. **Presencia del Símbolo "@"**: Asegurarse de que la dirección contenga un solo símbolo "@".
4. **Longitud**: Comprobar que la longitud total de la dirección no exceda el límite razonable (por ejemplo, 254 caracteres).
5. **Dominio Válido**: Verificar que el dominio después del "@" sea válido y tenga una extensión apropiada (como .com, .net, .org, etc.).

Aquí tienes un pseudocódigo en Go para validar correos electrónicos:

```go
package main

import (
    "fmt"
    "regexp"
)

func isValidEmail(email string) bool {
    // Verificar la longitud
    if len(email) > 254 {
        return false
    }

    // Patrón de expresión regular para la validación del correo electrónico
    emailPattern := `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`
    match, _ := regexp.MatchString(emailPattern, email)
    return match
}

func main() {
    emails := []string{
        "example@example.com",
        "invalid-email@.com",
        "another.valid.email@example.co",
        "@missing-local-part.com",
        "missing-at-symbol.com",
    }

    for _, email := range emails {
        fmt.Printf("Email: %s is valid: %v\n", email, isValidEmail(email))
    }
}
```

Este código en Go verifica que la dirección de correo electrónico siga el formato correcto, contenga caracteres válidos, y tenga un dominio apropiado. Si una dirección de correo electrónico no cumple con estos criterios, se considera inválida.
