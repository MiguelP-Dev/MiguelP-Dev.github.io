# Paquete `strings` en Go

El paquete `strings` ofrece herramientas completas para manipular y analizar cadenas en Go. Esta guía ampliada incluye ejemplos detallados, mejores prácticas y casos de uso avanzados.  

---

## 1. Funciones Esenciales  

### 1.1 Búsqueda y Comparación

**Funciones clave**:

```go  
package main  

import (  
    "fmt"  
    "strings"  
)  

func main() {  
    s := "Go es rápido y divertido 🔥"  

    // Contains vs ContainsAny  
    fmt.Println("Contiene 'rápido':", strings.Contains(s, "rápido"))          // true  
    fmt.Println("Contiene 'aeiou':", strings.ContainsAny(s, "aeiou"))        // true (busca cualquier carácter)  

    // Index y LastIndex con Unicode  
    fmt.Println("Índice de 'es':", strings.Index(s, "es"))                   // 3  
    fmt.Println("Última 'o':", strings.LastIndex(s, "o"))                    // 1  

    // Comparación exacta vs insensible a mayúsculas  
    fmt.Println("Igualdad exacta:", strings.Compare("Go", "go"))             // -1  
    fmt.Println("Igualdad insensible:", strings.EqualFold("Go", "go"))       // true  
}  
```  

---

### 1.2 División y Unión

**Ejemplos con manejo de slices**:

```go  
func main() {  
    // Split con múltiples separadores  
    csv := "a,b;c|d"  
    parts := strings.FieldsFunc(csv, func(r rune) bool {  
        return r == ',' || r == ';' || r == '|'  
    })  
    fmt.Println("Split personalizado:", parts) // [a b c d]  

    // Unión eficiente  
    palabras := []string{"Go", "es", "genial"}  
    fmt.Println("Unido:", strings.Join(palabras, "💡")) // Go💡es💡genial  

    // Repetición de cadenas  
    fmt.Println("Ritmo:", strings.Repeat("🎵", 3)) // 🎵🎵🎵  
}  
```  

---

## 2. Transformaciones Avanzadas  

### 2.1 Manipulación de Caracteres

**Uso de `strings.Map` y `strings.ToValidUTF8`**:

```go  
func main() {  
    // Eliminar dígitos de una cadena  
    limpio := strings.Map(func(r rune) rune {  
        if r >= '0' && r <= '9' {  
            return -1 // Eliminar  
        }  
        return r  
    }, "H0l4 MUnd0")  
    fmt.Println("Sin dígitos:", limpio) // Hl MUnd  

    // Sanitizar UTF-8  
    corrupto := "Hola\x80Mundo"  
    seguro := strings.ToValidUTF8(corrupto, "�")  
    fmt.Println("Sanitizado:", seguro) // Hola�Mundo  
}  
```  

---

### 2.2 Recortes Específicos

**Ejemplos con `TrimPrefix`, `TrimSuffix` y `TrimFunc`**:

```go  
func main() {  
    // Eliminar prefijos/sufijos  
    path := "/home/usuario/archivo.txt"  
    fmt.Println("Sin prefijo:", strings.TrimPrefix(path, "/home/")) // usuario/archivo.txt  
    fmt.Println("Sin extensión:", strings.TrimSuffix(path, ".txt")) // /home/usuario/archivo  

    // Recortar usando lógica personalizada  
    s := "!!!¡Alerta!!!¡¡"  
    trimmed := strings.TrimFunc(s, func(r rune) bool {  
        return r == '!' || r == '¡'  
    })  
    fmt.Println("Recortado:", trimmed) // Alerta  
}  
```  

---

## 3. Casos de Uso Profesionales  

### 3.1 Procesamiento de CSV

**Parseo seguro con manejo de comillas**:

```go  
func parseCSV(csvData string) [][]string {  
    reader := strings.NewReader(csvData)  
    var result [][]string  

    for {  
        line, err := reader.ReadString('\n')  
        if err != nil {  
            break  
        }  
        line = strings.TrimSpace(line)  
        fields := strings.Split(line, ",")  
        // Manejar comillas dobles  
        for i, field := range fields {  
            fields[i] = strings.Trim(field, `"`)  
        }  
        result = append(result, fields)  
    }  
    return result  
}  
```  

---

### 3.2 Validación de Correo Electrónico

**Implementación básica**:

```go  
func esEmailValido(email string) bool {  
    // Verificar estructura básica  
    if !strings.Contains(email, "@") || strings.Count(email, "@") > 1 {  
        return false  
    }  
    partes := strings.Split(email, "@")  
    local, dominio := partes[0], partes[1]  

    // Longitudes mínimas  
    if len(local) < 1 || len(dominio) < 3 {  
        return false  
    }  

    // Caracteres prohibidos en dominio  
    return !strings.ContainsAny(dominio, "!#$%^&*()")  
}  
```  

---

## 4. Rendimiento y Optimización  

### 4.1 Benchmarks de Concatenación

**Resultados típicos**:

| Método              | 1000 iteraciones |  
|---------------------|------------------|  
| `+`                 | 1500 µs          |  
| `strings.Join`      | 200 µs           |  
| `strings.Builder`   | 50 µs            |  

**Código recomendado**:

```go  
func concatenarEficiente(palabras []string) string {  
    var sb strings.Builder  
    sb.Grow(1000) // Pre-asignar capacidad  
    for _, p := range palabras {  
        sb.WriteString(p)  
    }  
    return sb.String()  
}  
```  

---

### 4.2 Manejo de Slices

**Peligro de aliasing**:

```go  
func main() {  
    s := "uno,dos,tres"  
    partes := strings.Split(s, ",")  
    partes[0] = "cero"  
    fmt.Println(s) // "uno,dos,tres" (el original no cambia)  
}  
```  

---

## 5. Errores Comunes  

### 5.1 Índices y Subcadenas

**Ejemplo problemático**:

```go  
func main() {  
    s := "café"  
    fmt.Println("Longitud incorrecta:", len(s)) // 5 (bytes), no 4 (runas)  
    fmt.Println("Subcadena rota:", s[0:3])      // "caf" incompleto  
}  

// Solución:  
func subcadenaSegura(s string, inicio, fin int) string {  
    runas := []rune(s)  
    if inicio < 0 || fin > len(runas) {  
        return ""  
    }  
    return string(runas[inicio:fin])  
}  
```  

---

### 5.2 Trim vs Replace

**Confusión frecuente**:

```go  
// TrimSpace solo elimina espacios al inicio/final  
fmt.Println(strings.TrimSpace("  hola\t\n")) // "hola"  

// Replace elimina todos los espacios  
fmt.Println(strings.ReplaceAll("  hola\t\n", " ", "")) // No maneja tabs ni newlines  
```  

---

## 6. Ejercicios Prácticos  

1. **Inversión de Cadena**:

   ```go  
   func invertir(s string) string {  
       runas := []rune(s)  
       for i, j := 0, len(runas)-1; i < j; i, j = i+1, j-1 {  
           runas[i], runas[j] = runas[j], runas[i]  
       }  
       return string(runas)  
   }  
   ```  

2. **Contador de Palabras Únicas**:

   ```go  
   func contarUnicas(s string) int {  
       palabras := strings.Fields(s)  
       unicas := make(map[string]bool)  
       for _, p := range palabras {  
           unicas[strings.ToLower(p)] = true  
       }  
       return len(unicas)  
   }  
   ```  

---

## 7. Mejores Prácticas  

- **Unicode**: Usar `[]rune` para manipulación de caracteres multibyte.  
- **Pre-asignación**: Utilizar `Grow()` en `strings.Builder` para reducir asignaciones.  
- **Seguridad**: Sanitizar entradas con `strings.ToValidUTF8` y `strings.TrimSpace`.  
- **Testing**: Validar edge cases como cadenas vacías, UTF-8 complejo y caracteres de control.  

---

## Conclusión

El paquete `strings` es una herramienta poderosa para cualquier desarrollador Go. Al dominar sus funciones y aplicar estas prácticas, podrás escribir código más eficiente, seguro y mantenible.  
