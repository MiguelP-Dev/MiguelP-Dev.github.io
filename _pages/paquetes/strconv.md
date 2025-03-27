# Paquete `strconv` en Go

El paquete `strconv` permite convertir entre tipos primitivos y cadenas de manera segura y eficiente. A continuación, se amplían las funciones clave con ejemplos detallados, casos de uso avanzados y mejores prácticas.  

---

## Conversión de Cadenas a Tipos Numéricos  

### 1. **`strconv.Atoi`**

**Descripción**: Convierte una cadena a `int`. Ideal para conversiones rápidas sin especificar bases.  

**Ejemplo con Manejo de Errores**:

```go  
package main  

import (  
    "fmt"  
    "strconv"  
)  

func main() {  
    num, err := strconv.Atoi("123")  
    if err != nil {  
        fmt.Println("Error:", err)  
        return  
    }  
    fmt.Println("Número convertido:", num) // 123  

    // Caso inválido  
    _, err = strconv.Atoi("12a3")  
    fmt.Println("Error esperado:", err) // "strconv.Atoi: parsing "12a3": invalid syntax"  
}  
```  

---

### 2. **`strconv.ParseInt`** vs **`strconv.ParseUint`**

**Diferencias Clave**:

- `ParseInt` acepta números con signo (base 2 a 36).  
- `ParseUint` rechaza valores negativos y maneja solo números sin signo.  

**Ejemplo Comparativo**:

```go  
func main() {  
    // ParseInt acepta negativos  
    i, _ := strconv.ParseInt("-42", 10, 64)  
    fmt.Println("ParseInt:", i) // -42  

    // ParseUint rechaza negativos  
    u, err := strconv.ParseUint("-42", 10, 64)  
    fmt.Println("ParseUint:", u, "Error:", err) // 0, "invalid syntax"  
}  
```  

---

### 3. **`strconv.ParseFloat`**

**Descripción**: Convierte cadenas a `float64` con control de precisión y formato.  

**Ejemplo con Notación Científica**:

```go  
func main() {  
    f, _ := strconv.ParseFloat("6.022e23", 64)  
    fmt.Println("Número de Avogadro:", f) // 6.022e+23  

    // Manejo de precisión  
    f, _ = strconv.ParseFloat("3.1415926535", 32) // Se trunca a float32  
    fmt.Println("Pi truncado:", f) // 3.1415927  
}  
```  

---

### 4. **`strconv.ParseBool`**

**Valores Aceptados**: "1", "t", "T", "TRUE", "true", "0", "f", "F", "FALSE", "false".  

**Ejemplo con Entradas Variadas**:

```go  
func main() {  
    b, _ := strconv.ParseBool("TRUE")  
    fmt.Println("Caso 1:", b) // true  

    b, _ = strconv.ParseBool("0")  
    fmt.Println("Caso 2:", b) // false  

    _, err := strconv.ParseBool("verdadero")  
    fmt.Println("Error:", err) // "strconv.ParseBool: parsing "verdadero": invalid syntax"  
}  
```  

---

## Conversión de Tipos Numéricos a Cadenas  

### 5. **`strconv.Itoa`** y **`strconv.FormatInt`**

**Diferencias**:

- `Itoa` es una versión simplificada para `int`.  
- `FormatInt` permite especificar la base (ej: binario, hexadecimal).  

**Ejemplo con Bases Numéricas**:

```go  
func main() {  
    s := strconv.Itoa(255)  
    fmt.Println("Decimal:", s) // "255"  

    s = strconv.FormatInt(255, 16)  
    fmt.Println("Hexadecimal:", s) // "ff"  
}  
```  

---

### 6. **`strconv.FormatFloat`**

**Verbos de Formato**:

- `'f'`: Notación decimal (ej: `123.456`).  
- `'e'`: Notación científica (ej: `1.2345e+02`).  
- `'g'`: Usa el formato más corto entre `'e'` y `'f'`.  

**Ejemplo con Precisión Controlada**:

```go  
func main() {  
    s := strconv.FormatFloat(123.456789, 'f', 2, 64)  
    fmt.Println("2 decimales:", s) // "123.46"  

    s = strconv.FormatFloat(123.456789, 'e', 3, 64)  
    fmt.Println("Científico:", s) // "1.235e+02"  
}  
```  

---

## Manipulación de Cadenas Especiales  

### 7. **`strconv.Quote`**

**Descripción**: Escapa caracteres no imprimibles y añade comillas.  

**Ejemplo con Caracteres Especiales**:

```go  
func main() {  
    quoted := strconv.Quote("Hola\nMundo\t!")  
    fmt.Println(quoted) // "Hola\nMundo\t!"  
}  
```  

---

### 8. **`strconv.Unquote`**

**Descripción**: Remueve comillas y decodifica caracteres escapados.  

**Ejemplo con Error Handling**:

```go  
func main() {  
    unquoted, err := strconv.Unquote(`"Hola\u0020Mundo"`)  
    if err != nil {  
        fmt.Println("Error:", err)  
        return  
    }  
    fmt.Println(unquoted) // "Hola Mundo"  

    // Cadena sin comillas  
    _, err = strconv.Unquote("Hola")  
    fmt.Println("Error esperado:", err) // "invalid syntax"  
}  
```  

---

## Mejores Prácticas  

1. **Validar Entradas Antes de Convertir**:

   ```go  
   if strings.TrimSpace(input) == "" {  
       return errors.New("entrada vacía")  
   }  
   ```  

2. **Usar `ParseInt` en Lugar de `Atoi` para Bases Distintas de 10**:

   ```go  
   hexValue, _ := strconv.ParseInt("ff", 16, 64) // 255  
   ```  

3. **Manejar Errores Siempre**:  
   Evitar ignorar el segundo valor de retorno, especialmente en conversiones de datos externos.  

4. **Preferir `FormatFloat` sobre `fmt.Sprintf` para Control de Precisión**:

   ```go  
   // Mejor  
   strconv.FormatFloat(3.1415, 'f', 2, 64) // "3.14"  

   // No recomendado  
   fmt.Sprintf("%.2f", 3.1415) // Funciona, pero menos eficiente  
   ```  

---

## Errores Comunes  

- **Ignorar Errores de Conversión**:

  ```go  
  num, _ := strconv.Atoi("abc") // num = 0, error ignorado  
  ```  

- **Usar `ParseUint` para Valores Negativos**:

  ```go  
  u, _ := strconv.ParseUint("-42", 10, 64) // u = 0, error no manejado  
  ```  

- **Malinterpretar la Base en `ParseInt`**:

  ```go  
  // Conversión de "12" en base 8:  
  val, _ := strconv.ParseInt("12", 8, 64) // 10 (1*8 + 2)  
  ```  

---

## Conclusión

El paquete `strconv` es esencial para conversiones seguras y eficientes en Go. Al seguir buenas prácticas como la validación de entradas y el manejo riguroso de errores, se evitan errores comunes y se garantiza la robustez de las aplicaciones. Utiliza funciones específicas (`ParseInt`, `FormatFloat`, etc.) para mantener el control sobre el formato y la precisión.  
