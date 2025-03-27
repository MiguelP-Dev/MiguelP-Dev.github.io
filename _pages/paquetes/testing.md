---
layout: default
title: testing | Miguel's Programing Notes
description: Guía completa del paquete testing de Go para pruebas unitarias
permalink: /paquetes/testing/
categories: paquetes
icon: 🧪
---

# Paquete `testing` en Go

El paquete `testing` es esencial para crear pruebas robustas en Go. Esta guía ampliada cubre desde fundamentos hasta técnicas avanzadas, incluyendo mejores prácticas y ejemplos del mundo real.  

---

## Componentes Principales  

### 1. **Pruebas Unitarias (`testing.T`)**

**Métodos Clave**:

- `Error()/Errorf()`: Reportar fallos sin detener la prueba.  
- `Fatal()/Fatalf()`: Detener la prueba inmediatamente.  
- `Run()`: Ejecutar subtests.  
- `Parallel()`: Ejecutar pruebas en paralelo.  
- `Helper()`: Marcar función como helper.  

**Ejemplo de Tabla de Pruebas**:

```go  
func TestSuma(t *testing.T) {  
    casos := []struct {  
        a, b, esperado int  
    }{  
        {2, 3, 5},  
        {0, 0, 0},  
        {-1, 1, 0},  
        {100, 200, 300},  
    }  

    for _, c := range casos {  
        t.Run(fmt.Sprintf("%d+%d", c.a, c.b), func(t *testing.T) {  
            resultado := Suma(c.a, c.b)  
            if resultado != c.esperado {  
                t.Errorf("Esperado %d, obtenido %d", c.esperado, resultado)  
            }  
        })  
    }  
}  
```  

**Mejores Prácticas**:

- Usar subtests para organizar casos.  
- Proporcionar nombres descriptivos en `t.Run()`.  

---

### 2. **Benchmarks (`testing.B`)**

**Métodos Clave**:

- `ResetTimer()`: Ignorar tiempo de inicialización.  
- `ReportAllocs()`: Monitorear asignaciones de memoria.  

**Ejemplo Comparativo**:

```go  
func BenchmarkSuma(b *testing.B) {  
    b.ReportAllocs()  
    for i := 0; i < b.N; i++ {  
        Suma(10, 20)  
    }  
}  

func BenchmarkSumaOptimizada(b *testing.B) {  
    b.ResetTimer()  
    for i := 0; i < b.N; i++ {  
        SumaOptimizada(10, 20)  
    }  
}  
```  

**Interpretación de Resultados**:

```bash  
go test -bench . -benchmem  
# Output:  
# BenchmarkSuma-8            1000000000   0.250 ns/op   0 B/op   0 allocs/op  
```  

---

### 3. **Ejemplos (`Example`)**

**Convenciones**:

- Nombre de función: `ExampleFuncion()`.  
- Salida esperada: `// Output: resultado`.  

**Ejemplo con Documentación**:

```go  
func ExampleSuma() {  
    fmt.Println(Suma(3, 4))  
    // Output: 7  
}  
```  

---

### 4. **Configuración Global (`testing.M`)**

**Uso para Setup/Teardown**:

```go  
func TestMain(m *testing.M) {  
    fmt.Println("Inicializando base de datos...")  
    db = setupDB()  
    codigo := m.Run()  
    fmt.Println("Limpiando recursos...")  
    db.Close()  
    os.Exit(codigo)  
}  
```  

---

## Funcionalidades Avanzadas  

### 1. **Pruebas en Paralelo**

```go  
func TestDescargas(t *testing.T) {  
    t.Parallel()  
    // Pruebas de descargas simultáneas  
}  

func TestSubida(t *testing.T) {  
    t.Parallel()  
    // Pruebas de subida  
}  
```  

### 2. **Coverage y Perfilado**

**Generar Reporte de Cobertura**:

```bash  
go test -coverprofile=coverage.out  
go tool cover -html=coverage.out  
```  

**Perfilado de CPU**:

```bash  
go test -cpuprofile=cpu.out  
go tool pprof cpu.out  
```  

---

## Mejores Prácticas  

### 1. **Diseño de Pruebas**

- **Pruebas Deterministas**: Evitar dependencias de estado global.

- **Aislamiento**: Cada test debe ser independiente.  
- **Nombres Descriptivos**: `TestParsearFecha_FormatoInvalido`.  

### 2. **Manejo de Errores**

```go  
func TestLeerArchivo(t *testing.T) {  
    data, err := os.ReadFile("testdata/input.txt")  
    if err != nil {  
        t.Fatalf("No se pudo leer archivo: %v", err)  
    }  
    // ...  
}  
```  

### 3. **Mocking con Interfaces**

```go  
type DB interface {  
    ObtenerUsuario(id int) (*Usuario, error)  
}  

func TestServicio(t *testing.T) {  
    mockDB := &MockDB{  
        usuarios: map[int]*Usuario{1: {"Admin"}},  
    }  
    servicio := NuevoServicio(mockDB)  
    // ...  
}  
```  

---

## Errores Comunes  

### 1. **Dependencia de Orden**

```go  
// ❌ Incorrecto: Tests dependen de ejecución previa  
var contador int  

func TestA(t *testing.T) { contador++ }  
func TestB(t *testing.T) { contador++ }  
```  

### 2. **Ignorar Errores**

```go  
// ❌ Incorrecto  
resultado, _ := FuncionRiesgosa()  
// ✅ Correcto  
resultado, err := FuncionRiesgosa()  
if err != nil {  
    t.Fatal(err)  
}  
```  

### 3. **Pruebas Lentas**

```go  
func TestAPI(t *testing.T) {  
    if testing.Short() {  
        t.Skip("Skip en modo corto")  
    }  
    // Llamada HTTP real  
}  
```  

---

## Integración con Herramientas Externas  

### 1. **Testify para Aserciones**

```go  
import (  
    "github.com/stretchr/testify/assert"  
)  

func TestDivision(t *testing.T) {  
    resultado, err := Dividir(10, 2)  
    assert.NoError(t, err)  
    assert.Equal(t, 5, resultado)  
}  
```  

### 2. **httptest para APIs HTTP**

```go  
func TestHandler(t *testing.T) {  
    req := httptest.NewRequest("GET", "/", nil)  
    w := httptest.NewRecorder()  
    MiHandler(w, req)  
    assert.Equal(t, http.StatusOK, w.Code)  
}  
```  

---

## Comandos Útiles  

| Comando                     | Descripción                          |  
|-----------------------------|--------------------------------------|  
| `go test -v`                | Modo verbose                         |  
| `go test -run TestNombre`   | Ejecutar prueba específica           |  
| `go test -race`             | Detectar race conditions             |  
| `go test -shuffle=on`       | Ejecutar tests en orden aleatorio    |  

---

## Conclusión

El paquete `testing` en Go ofrece un conjunto poderoso de herramientas para garantizar la calidad del código. Al dominar sus características y seguir buenas prácticas, podrás construir sistemas confiables y mantenibles. Combina pruebas unitarias, benchmarks y ejemplos para cubrir todos los aspectos de tu aplicación.  
