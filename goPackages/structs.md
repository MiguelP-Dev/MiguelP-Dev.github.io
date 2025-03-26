# Paquete `structs` de Fatih para Go

El paquete `github.com/fatih/structs` simplifica el trabajo con estructuras en Go mediante reflexión. Esta guía ampliada cubre sus funcionalidades clave, ejemplos avanzados y mejores prácticas.  

---

## Funciones Principales  

### 1. **`structs.New`**

**Descripción**: Crea un wrapper `Struct` para manipular estructuras dinámicamente.  

**Ejemplo con Estructura Anidada**:

```go  
type Direccion struct {  
    Calle  string  
    Ciudad string  
}  

type Usuario struct {  
    Nombre    string  
    Edad      int  
    Direccion Direccion `json:"address"`  
}  

func main() {  
    u := Usuario{  
        Nombre: "Ana",  
        Edad:   28,  
        Direccion: Direccion{Ciudad: "Madrid"},  
    }  

    s := structs.New(u)  
    fmt.Println("Estructura original:", s)  
}  
```  

---

### 2. **`(*Struct) Field`**

**Descripción**: Accede a campos por nombre, incluyendo anidados.  

**Ejemplo con Campos Anidados y Tags**:

```go  
func main() {  
    s := structs.New(u)  

    // Acceder a campo anidado  
    ciudad := s.Field("Direccion").Field("Ciudad").Value()  
    fmt.Println("Ciudad:", ciudad) // Madrid  

    // Obtener tag JSON  
    field := s.Field("Direccion")  
    tag := field.Tag("json")  
    fmt.Println("Tag JSON:", tag) // address  
}  
```  

---

### 3. **`(*Struct) Fields`**

**Descripción**: Lista todos los campos, incluso los de estructuras embebidas.  

**Ejemplo con Campos Embebidos**:

```go  
type Base struct {  
    ID int  
}  

type Cliente struct {  
    Base   // Campo embebido  
    Nombre string  
}  

func main() {  
    c := Cliente{Base{42}, "Carlos"}  
    s := structs.New(c)  

    for _, f := range s.Fields() {  
        fmt.Printf("%s: %v\n", f.Name(), f.Value())  
    }  
    /* Output:  
       ID: 42  
       Nombre: Carlos  
    */  
}  
```  

---

### 4. **`(*Struct) Map`**

**Descripción**: Convierte la estructura a un `map[string]interface{}`, ideal para serialización.  

**Ejemplo con Conversión a JSON**:

```go  
func main() {  
    s := structs.New(u)  
    m := s.Map()  

    jsonData, _ := json.Marshal(m)  
    fmt.Println("JSON:", string(jsonData))  
    // {"Nombre":"Ana","Edad":28,"address":{"Calle":"","Ciudad":"Madrid"}}  
}  
```  

---

### 5. **`(*Struct) Names`**

**Descripción**: Obtiene los nombres de los campos, útil para validación dinámica.  

**Ejemplo de Validación de Campos Requeridos**:

```go  
func validarCampos(s *structs.Struct, requeridos []string) error {  
    for _, req := range requeridos {  
        if !s.Field(req).IsExported() || s.Field(req).IsZero() {  
            return fmt.Errorf("campo %s requerido", req)  
        }  
    }  
    return nil  
}  

func main() {  
    requeridos := []string{"Nombre", "Direccion.Ciudad"}  
    err := validarCampos(s, requeridos)  
    fmt.Println("Validación:", err) // nil  
}  
```  

---

### 6. **`IsStruct`**

**Descripción**: Verifica si un valor es una estructura.  

**Ejemplo con Tipos Mixtos**:

```go  
func main() {  
    fmt.Println(structs.IsStruct(Usuario{}))      // true  
    fmt.Println(structs.IsStruct(&Usuario{}))    // true (maneja punteros)  
    fmt.Println(structs.IsStruct([]Usuario{}))   // false  
    fmt.Println(structs.IsStruct("no es struct")) // false  
}  
```  

---

## Casos de Uso Avanzados  

### 1. **Generación Dinámica de Formularios**

```go  
func generarCamposFormulario(s interface{}) []string {  
    st := structs.New(s)  
    var campos []string  
    for _, f := range st.Fields() {  
        campos = append(campos, fmt.Sprintf("<input name='%s'>", f.Name()))  
    }  
    return campos  
}  
```  

---

### 2. **Comparación de Estructuras**

```go  
func compararStructs(a, b interface{}) bool {  
    s1 := structs.New(a).Map()  
    s2 := structs.New(b).Map()  

    return reflect.DeepEqual(s1, s2)  
}  
```  

---

## Mejores Prácticas  

1. **Uso de Tags**:

   ```go  
   type Ejemplo struct {  
       Campo string `xml:"campo_xml" validate:"required"`  
   }  

   // Obtener tags específicos  
   s := structs.New(Ejemplo{})  
   fmt.Println(s.Field("Campo").Tag("validate")) // "required"  
   ```  

2. **Manejo de Campos Privados**:  
   - El paquete **no puede acceder** a campos no exportados (en minúscula).  
   - Ejemplo fallido:

     ```go  
     type secreto struct {  
         clave string // campo privado  
     }  

     s := structs.New(secreto{"123"})  
     fmt.Println(s.Field("clave")) // Panic: campo no encontrado  
     ```  

3. **Rendimiento**:  
   - La reflexión es costosa. Evitar usarlo en bucles críticos.  
   - Alternativa para alto rendimiento: generar código con `go generate`.  

---

## Errores Comunes  

- **Acceso a Campos Inexistentes**:

  ```go  
  s.Field("Telefono") // Panic: campo no encontrado  
  ```

  **Solución**:

  ```go  
  if f, ok := s.FieldOk("Telefono"); ok {  
      // Usar f  
  }  
  ```  

- **Olvidar Punteros**:

  ```go  
  u := &Usuario{}  
  structs.New(u)  // Correcto  
  structs.New(*u) // También funciona  
  ```  

---

## Conclusión

El paquete `structs` es invaluable para manipular estructuras dinámicamente, aunque debe usarse con cuidado en escenarios sensibles al rendimiento. Combínalo con tags y validaciones para crear código flexible y mantenible.  
