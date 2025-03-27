# Paquete `html` en Go: Guía Completa para Manejo Seguro de HTML

El paquete `html` en Go proporciona herramientas esenciales para trabajar con contenido HTML de manera segura, previniendo ataques comunes como XSS (Cross-Site Scripting). Esta guía cubre tanto el paquete principal `html` como el subpaquete `html/template` con ejemplos avanzados y mejores prácticas.

---

## 1. Funciones Principales del Paquete `html`

### 1.1 **`html.EscapeString`**
**Propósito**: Convertir caracteres especiales en entidades HTML para prevenir inyección de código.  
**Caracteres Escapados**:
- `<` → `&lt;`
- `>` → `&gt;`
- `&` → `&amp;`
- `"` → `&quot;`
- `'` → `&#39;`

**Ejemplo Detallado**:
```go
package main

import (
    "fmt"
    "html"
)

func main() {
    userInput := `<script>alert("Hacked!")</script>`
    safeOutput := html.EscapeString(userInput)
    fmt.Println(safeOutput)
    // Output: &lt;script&gt;alert(&#34;Hacked!&#34;)&lt;/script&gt;
}
```

### 1.2 **`html.UnescapeString`**
**Propósito**: Revertir entidades HTML a sus caracteres originales.  
**Casos de Uso**:
- Procesar contenido almacenado previamente escapado
- Mostrar texto original en editores HTML

**Ejemplo con Entidades Complejas**:
```go
func main() {
    escaped := "&lt;div class=&quot;alert&quot;&gt;&amp;Atención&lt;/div&gt;"
    unescaped := html.UnescapeString(escaped)
    fmt.Println(unescaped) 
    // Output: <div class="alert">&Atención</div>
}
```

---

## 2. Subpaquete `html/template`: Plantillas Seguras

### 2.1 **Creación de Plantillas**
**Flujo Básico**:
1. Definir plantillas
2. Parsear contenido
3. Ejecutar con datos

**Ejemplo de Plantilla con Estructuras**:
```go
type User struct {
    Name    string
    Email   string
    IsAdmin bool
}

func main() {
    const tpl = `
    <!DOCTYPE html>
    <html>
        <head>
            <title>Perfil de {{.Name}}</title>
        </head>
        <body>
            <h1>{{.Name}}</h1>
            {{if .IsAdmin}}<p class="admin">Administrador</p>{{end}}
            <p>Contacto: <a href="mailto:{{.Email}}">{{.Email}}</a></p>
        </body>
    </html>`

    tmpl := template.Must(template.New("profile").Parse(tpl))
    user := User{"Ana", "ana@example.com", true}
    tmpl.Execute(os.Stdout, user)
}
```

### 2.2 **Funciones de Plantilla Personalizadas**
**Registro de Funciones**:
```go
func formatDate(t time.Time) string {
    return t.Format("2006-01-02")
}

func main() {
    tmpl := template.Must(template.New("").Funcs(template.FuncMap{
        "formatDate": formatDate,
    }).Parse(`<p>Fecha: {{. | formatDate}}</p>`))
    
    tmpl.Execute(os.Stdout, time.Now())
}
```

---

## 3. Características Avanzadas de `html/template`

### 3.1 **Herencia de Plantillas**
**Estructura de Archivos**:
```
templates/
├── base.html
└── home.html
```

**base.html**:
```html
{{define "base"}}
<!DOCTYPE html>
<html>
<head>
    <title>{{template "title" .}}</title>
</head>
<body>
    {{template "content" .}}
</body>
</html>
{{end}}
```

**home.html**:
```html
{{define "title"}}Inicio{{end}}
{{define "content"}}
    <h1>Bienvenido, {{.User.Name}}</h1>
{{end}}
```

**Código Go**:
```go
func main() {
    tmpl := template.Must(template.ParseGlob("templates/*.html"))
    data := map[string]interface{}{
        "User": User{Name: "Carlos"},
    }
    tmpl.ExecuteTemplate(os.Stdout, "base", data)
}
```

### 3.2 **Protección Automática contra XSS**
**Característica Clave**: Todas las variables insertadas se escapan automáticamente.  
**Excepciones Controladas**:
```go
// Usar tipo template.HTML para contenido confiable
tmpl := template.Must(template.New("").Parse(`
    <div>{{.SafeContent}}</div>
`))
tmpl.Execute(os.Stdout, map[string]interface{}{
    "SafeContent": template.HTML("<b>Texto seguro</b>"),
})
```

---

## 4. Mejores Prácticas y Seguridad

### 4.1 **Reglas de Escape Contextual**
- **Atributos HTML**: Escape automático de `"` y espacios
- **URLs**: Validación de esquemas (`javascript:` bloqueado)
- **CSS/JS**: Requiere tratamiento especial

### 4.2 **Validación de Datos**
```go
func sanitizeInput(input string) string {
    // Eliminar etiquetas HTML
    return html.EscapeString(input)
}

// Uso en plantillas:
tmpl.Parse(`<p>{{. | sanitizeInput}}</p>`)
```

### 4.3 **Manejo de Errores**
```go
tmpl, err := template.ParseFiles("plantilla.html")
if err != nil {
    log.Fatalf("Error cargando plantilla: %v", err)
}

err = tmpl.Execute(os.Stdout, data)
if err != nil {
    log.Printf("Error renderizando: %v", err)
}
```

---

## 5. Comparativa de Métodos

| Método                 | Uso Recomendado                     | Seguridad |
|------------------------|-------------------------------------|-----------|
| `html.EscapeString`    | Escape manual en código dinámico   | Alta      |
| `text/template`        | Contenido no HTML                  | Baja      |
| `html/template`        | Cualquier salida HTML              | Máxima    |

---

## 6. Ejemplo Completo: Sistema de Comentarios

**Estructura de Datos**:
```go
type Comment struct {
    Author  string
    Content string
    Date    time.Time
}
```

**Plantilla** (`comments.html`):
```html
{{define "comment"}}
<div class="comment">
    <h3>{{.Author}}</h3>
    <p class="content">{{.Content}}</p>
    <small>{{.Date | formatDate}}</small>
</div>
{{end}}
```

**Código**:
```go
func main() {
    comments := []Comment{
        {"Alice", "¡Gran publicación!", time.Now()},
        {"Bob", "<script>alert('XSS')</script>", time.Now()},
    }

    tmpl := template.Must(template.New("").Funcs(template.FuncMap{
        "formatDate": formatDate,
    }).ParseFiles("comments.html"))
    
    for _, c := range comments {
        tmpl.ExecuteTemplate(os.Stdout, "comment", c)
        // El contenido de Bob se escapa automáticamente
    }
}
```

---

Esta guía ampliada proporciona un entendimiento profundo del paquete `html` en Go, incluyendo técnicas avanzadas de plantillas y prácticas esenciales de seguridad. Los ejemplos prácticos demuestran cómo implementar funcionalidades reales manteniendo la protección contra vulnerabilidades comunes.