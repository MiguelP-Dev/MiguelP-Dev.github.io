# Ejemplo de validación de Url usando Regexp

Para que una URL sea válida según un algoritmo sencillo, podemos considerar las siguientes características clave:

1. **Formato Correcto**: La URL debe seguir el formato estándar, por ejemplo, `http://www.example.com`. Esto incluye el protocolo (http, https), el nombre de dominio, y opcionalmente una ruta y parámetros.

2. **Protocolo**: Verificar que la URL comience con `http://` o `https://`.

3. **Nombre de Dominio**: Asegurarse de que el dominio contenga caracteres válidos (letras, números, guiones) y termine con una extensión de dominio válida (.com, .net, .org, etc.).

4. **Longitud**: Comprobar que la longitud de la URL no exceda un límite razonable (por ejemplo, 2048 caracteres).

5. **Codificación de Caracteres**: Verificar que los caracteres especiales en la URL estén debidamente codificados (%20 para un espacio, etc.).

6. **Sintaxis**: Asegurarse de que no haya errores de sintaxis como espacios no codificados o caracteres no permitidos.

Aquí tienes un pseudocódigo sencillo para verificar estos puntos:

```go
package main

import (
    "fmt"
    "net/url"
    "regexp"
)

func isValidURL(u string) bool {
    // Verificar la longitud
    if len(u) > 2048 {
        return false
    }

    // Parsear la URL
    parsedURL, err := url.Parse(u)
    if err != nil || parsedURL.Scheme == "" || parsedURL.Host == "" {
        return false
    }

    // Verificar el protocolo
    if parsedURL.Scheme != "http" && parsedURL.Scheme != "https" {
        return false
    }

    // Verificar el nombre de dominio (contiene letras, números, y guiones)
    domainPattern := `^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$`
    match, _ := regexp.MatchString(domainPattern, parsedURL.Host)
    if !match {
        return false
    }

    return true
}

func main() {
    urls := []string{
        "http://www.example.com",
        "https://valid-url.org",
        "ftp://invalid-protocol.com",
        "http://invalid domain.com",
        "http://toolong" + string(make([]byte, 2049)) + ".com",
    }

    for _, u := range urls {
        fmt.Printf("URL: %s is valid: %v\n", u, isValidURL(u))
    }
}
```

Este código en Go verifica la longitud de la URL, el protocolo, y el formato del nombre de dominio. Si una URL no cumple con estos criterios, se considera inválida.
