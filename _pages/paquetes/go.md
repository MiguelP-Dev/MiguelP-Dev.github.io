# Guía Completa de los Comandos `go` en Golang

El ecosistema de Go incluye una amplia variedad de comandos para gestionar el ciclo de vida completo de un proyecto. A continuación, se presenta una guía detallada con ejemplos avanzados y casos de uso realistas.

---

## Comandos Esenciales

### 1. **`go run`**
**Descripción**: Compila y ejecuta código temporalmente sin generar binarios.  
**Casos de Uso Avanzados**:
- Ejecutar múltiples archivos:
  ```sh
  go run main.go utils.go config.go
  ```
- Pasar argumentos al programa:
  ```sh
  go run main.go -port=8080 -env=prod
  ```
- Usar tags de compilación:
  ```sh
  go run -tags=jsoniter main.go  # Usa una implementación alternativa de JSON
  ```

**Mejor Práctica**: Ideal para prototipado rápido, evita acumulación de binarios temporales.

---

### 2. **`go build`**
**Descripción**: Genera binarios optimizados.  
**Opciones Clave**:
- Compilación cruzada:
  ```sh
  GOOS=linux GOARCH=amd64 go build -o app-linux main.go
  GOOS=windows GOARCH=amd64 go build -o app.exe main.go
  ```
- Incluir metadatos:
  ```sh
  go build -ldflags "-X main.Version=1.2.3 -X main.BuildTime=$(date +%s)"
  ```
- Reducir tamaño con `-trimpath`:
  ```sh
  go build -trimpath -o minimal-app
  ```

**Ejemplo Completo**:
```sh
CGO_ENABLED=0 GOOS=darwin GOARCH=arm64 go build -ldflags "-s -w" -tags=prod -o release/app ./cmd/server
```

---

### 3. **`go install`**
**Descripción**: Instala herramientas en `$GOPATH/bin`.  
**Flujo de Trabajo**:
1. Crear herramienta CLI:
   ```go
   // tools/version/main.go
   package main
   func main() {
       fmt.Println("Versión 1.4.2")
   }
   ```
2. Instalar globalmente:
   ```sh
   go install ./tools/version
   ```
3. Ejecutar desde cualquier lugar:
   ```sh
   version  # Output: Versión 1.4.2
   ```

**Nota**: Asegurar que `$GOPATH/bin` esté en el `PATH` del sistema.

---

## Gestión de Dependencias

### 4. **`go get`**
**Funcionalidades Avanzadas**:
- Instalar versión específica:
  ```sh
  go get github.com/gorilla/mux@v1.8.0
  ```
- Actualizar a última versión:
  ```sh
  go get -u github.com/gin-gonic/gin
  ```
- Reemplazar dependencias (para forks):
  ```go
  // go.mod
  replace github.com/original/repo => ../local/fork
  ```

**Ejemplo de Workflow**:
```sh
go get github.com/spf13/cobra@latest  # Última versión
go mod tidy                          # Limpiar dependencias no usadas
```

---

### 5. **`go mod`**
**Comandos Clave**:
| Comando           | Descripción                          |
|-------------------|--------------------------------------|
| `go mod init`     | Inicializa nuevo módulo              |
| `go mod graph`    | Muestra gráfico de dependencias      |
| `go mod vendor`   | Crea directorio vendor               |
| `go mod verify`   | Verifica integridad de dependencias  |

**Ejemplo de Módulo Privado**:
```sh
GOPRIVATE=github.com/mi-empresa go mod download  # Ignora proxy para repos privados
```

---

## Calidad de Código

### 6. **`go test`**
**Técnicas Avanzadas**:
- Pruebas paralelas:
  ```go
  func TestFetch(t *testing.T) {
      t.Parallel()
      // ... código ...
  }
  ```
- Generar cobertura:
  ```sh
  go test -coverprofile=coverage.out && go tool cover -html=coverage.out
  ```
- Detección de race conditions:
  ```sh
  go test -race ./...
  ```
- Pruebas de integración:
  ```sh
  go test -tags=integration
  ```

**Ejemplo de Subtests**:
```go
func TestMath(t *testing.T) {
    t.Run("Suma", func(t *testing.T) {
        if sum(2,3) != 5 {
            t.Error("Falló suma")
        }
    })
    t.Run("Resta", func(t *testing.T) {
        // ... pruebas ...
    })
}
```

---

### 7. **`go vet` y `go fmt`**
**Integración con CI/CD**:
```yaml
# Ejemplo de GitHub Actions
jobs:
  lint:
    steps:
      - name: Formatear código
        run: go fmt ./...
      - name: Análisis estático
        run: go vet ./...
```

**Configuración Personalizada**:
- Crear `.gofmt` para reglas personalizadas
- Usar [staticcheck](https://staticcheck.io/) para análisis más profundo

---

## Herramientas de Desarrollo

### 8. **`go doc`**
**Usos Avanzados**:
- Servir documentación web:
  ```sh
  godoc -http=:6060
  ```
- Documentar paquetes:
  ```go
  // Package math provee operaciones matemáticas avanzadas.
  package math

  // Suma dos enteros.
  func Add(a, b int) int { ... }
  ```

**Consulta Rápida**:
```sh
go doc -all bytes.Buffer  # Ver todos los métodos
```

---

### 9. **`go generate`**
**Automatización de Código**:
1. Crear directiva:
   ```go
   //go:generate stringer -type=Estado
   type Estado int

   const (
       Activo Estado = iota
       Inactivo
   )
   ```
2. Ejecutar generación:
   ```sh
   go generate ./...
   ```

**Caso de Uso**: Generar código para protocolos gRPC, serializadores, etc.

---

## Comandos de Mantenimiento

### 10. **`go clean`**
**Escenarios Comunes**:
- Limpiar cache completo:
  ```sh
  go clean -cache -testcache -modcache
  ```
- Eliminar binarios específicos:
  ```sh
  go clean -i ./pkg/...  # Elimina instalaciones anteriores
  ```

---

## Comandos de Depuración

### 11. **`go env`**
**Configuración del Entorno**:
```sh
go env -w GOPRIVATE=github.com/mi-empresa/*  # Configuración persistente
go env GOMODCACHE  # Ver ubicación de cache
```

**Listado Completo**:
```sh
go env | grep -E 'GOOS|GOARCH|GOPATH'  # Filtra variables clave
```

---

## Mejores Prácticas

1. **Estructura de Proyectos**:
   ```sh
   mi-proyecto/
   ├── cmd/
   │   └── server/
   │       └── main.go
   ├── internal/
   │   └── pkg/
   ├── pkg/
   │   └── utils/
   └── go.mod
   ```

2. **Versionado Semántico**:
   ```sh
   git tag v1.2.3
   git push origin v1.2.3
   ```

3. **Optimización de Binarios**:
   - Usar `-ldflags "-s -w"` para reducir tamaño
   - Compilar con `CGO_ENABLED=0` para binarios estáticos

4. **Manejo de Errores**:
   ```go
   if _, err := os.Open("file.txt"); err != nil {
       return fmt.Errorf("error abriendo archivo: %w", err)
   }
   ```

---

## Flujo de Trabajo Completo

1. Inicializar proyecto:
   ```sh
   go mod init github.com/usuario/proyecto
   ```

2. Desarrollar con hot-reload:
   ```sh
   air -c .air.toml  # Usar herramienta externa
   ```

3. Lanzar pruebas:
   ```sh
   go test -cover -race ./...
   ```

4. Construir release:
   ```sh
   GOOS=linux GOARCH=amd64 go build -ldflags "-s -w" -o dist/app-linux
   ```

5. Desplegar:
   ```sh
   scp dist/app-linux usuario@servidor:/app
   ```

---

Este contenido ampliado cubre escenarios avanzados, integración con herramientas modernas y prácticas profesionales para el desarrollo eficiente en Go. Cada comando incluye ejemplos aplicables a entornos de producción y recomendaciones basadas en la experiencia de la comunidad Go.