# Estructuras de carpetas, arquitecturas y patrones de diseño en Go (Golang), incluyendo manejo de concurrencia

## 1. Estructuras de Carpetas en Go

### 1.1 Estructura Básica

```bash
project/
├── cmd/
│   └── app/
│       └── main.go
├── internal/
│   ├── handler/
│   ├── service/
│   └── repository/
├── pkg/
│   ├── utils/
│   └── logger/
├── api/
├── configs/
├── test/
├── scripts/
├── deployments/
├── go.mod
└── go.sum
```

### 1.2 Clean Architecture

```bash
project/
├── cmd/
├── internal/
│   ├── entity/      # Entidades de negocio
│   ├── usecase/     # Lógica de negocio
│   ├── repository/  # Interfaces de repositorio
│   └── delivery/    # Controladores (HTTP, gRPC, CLI)
├── pkg/
├── infrastructure/  # Implementaciones concretas
│   ├── db/
│   ├── cache/
│   └── web/
└── ...
```

### 1.3 Arquitectura Hexagonal

```bash
project/
├── core/            # Lógica de negocio
├── ports/           # Interfaces
├── adapters/        # Implementaciones
│   ├── primary/     # Controladores
│   └── secondary/   # Bases de datos, APIs externas
└── ...
```

## 2. Arquitecturas Principales

### 2.1 MVC (Model-View-Controller)

```go
// Model
type User struct {
    ID   int
    Name string
}

// Controller
type UserController struct {
    service UserService
}

func (c *UserController) GetUser(w http.ResponseWriter, r *http.Request) {
    // Lógica del controlador
}
```

### 2.2 Clean Architecture

Capas:

1. Entities: Estructuras de datos básicas
2. Use Cases: Reglas de negocio
3. Interface Adapters: Convertidores de datos
4. Frameworks & Drivers: Capa externa (DB, UI)

### 2.3 CQRS (Command Query Responsibility Segregation)

```go
type CommandHandler interface {
    Handle(command interface{}) error
}

type QueryHandler interface {
    Handle(query interface{}) (interface{}, error)
}
```

### 2.4 Event-Driven Architecture

```go
type EventBus struct {
    subscribers map[string][]chan interface{}
}

func (eb *EventBus) Publish(eventName string, data interface{}) {
    // Notificar a todos los suscriptores
}
```

### 2.5 Microservicios

```bash
services/
├── user-service/
├── order-service/
└── payment-service/
```

## 3. Patrones de Diseño en Go

### 3.1 Patrones Creacionales

#### Singleton

```go
type Database struct {
    conn *sql.DB
}

var instance *Database
var once sync.Once

func GetInstance() *Database {
    once.Do(func() {
        instance = &Database{conn: initDB()}
    })
    return instance
}
```

#### Factory

```go
type PaymentMethod interface {
    Pay(amount float64) string
}

func GetPaymentMethod(method string) PaymentMethod {
    switch method {
    case "credit":
        return &CreditCard{}
    case "paypal":
        return &PayPal{}
    default:
        return nil
    }
}
```

### 3.2 Patrones Estructurales

#### Adapter

```go
type LegacyPrinter interface {
    Print(s string) string
}

type ModernPrinter interface {
    PrintStored() string
}

type PrinterAdapter struct {
    LegacyPrinter LegacyPrinter
    Msg          string
}
```

### 3.3 Patrones de Comportamiento

#### Strategy

```go
type CompressionStrategy interface {
    Compress(data []byte) []byte
}

type ZipStrategy struct{}
type RarStrategy struct{}

type Compressor struct {
    strategy CompressionStrategy
}
```

## 4. Concurrencia en Go

### 4.1 Patrones de Concurrencia

#### Worker Pool

```go
func worker(id int, jobs <-chan int, results chan<- int) {
    for job := range jobs {
        // Procesar trabajo
        results <- job * 2
    }
}

func main() {
    jobs := make(chan int, 100)
    results := make(chan int, 100)
    
    // Iniciar workers
    for w := 1; w <= 3; w++ {
        go worker(w, jobs, results)
    }
    
    // Enviar trabajos
    for j := 1; j <= 9; j++ {
        jobs <- j
    }
    close(jobs)
    
    // Recibir resultados
    for a := 1; a <= 9; a++ {
        <-results
    }
}
```

#### Fan-Out/Fan-In

```go
func fanOut(input <-chan int, outputs []chan int) {
    for data := range input {
        for _, out := range outputs {
            out <- data
        }
    }
}

func fanIn(inputs ...<-chan int) <-chan int {
    var wg sync.WaitGroup
    out := make(chan int)
    
    // ... configuración de merge ...
    return out
}
```

### 4.2 Sync Package

```go
var mu sync.Mutex
var rwMu sync.RWMutex
var once sync.Once
var pool = sync.Pool{
    New: func() interface{} {
        return &Buffer{}
    },
}
```

## 5. Otras Consideraciones

1. **Dependency Management**: Usar Go Modules (`go.mod`)
2. **Configuración**: Implementar patrones para manejo de configuración
3. **Logging**: Usar interfaces para logging
4. **Error Handling**: Patrones de manejo de errores centralizados
5. **Testing**:
   - Unit Tests
   - Integration Tests
   - Mocking (usar interfaces)
6. **CI/CD**: Integración con GitHub Actions, GitLab CI, etc.

## 6. Ejemplo Completo (Clean Architecture + CQRS)

```go
// Entidad
type User struct {
    ID   uuid.UUID
    Name string
    Email string
}

// Use Case
type UserService struct {
    repo UserRepository
}

func (s *UserService) CreateUser(name, email string) (*User, error) {
    user := &User{
        ID:    uuid.New(),
        Name:  name,
        Email: email,
    }
    return user, s.repo.Save(user)
}

// Repositorio (Interfaz)
type UserRepository interface {
    Save(user *User) error
    FindByID(id uuid.UUID) (*User, error)
}

// Controlador HTTP
type UserHandler struct {
    service *UserService
}

func (h *UserHandler) CreateUser(w http.ResponseWriter, r *http.Request) {
    // Parsear request
    // Llamar al servicio
    // Devolver respuesta
}
```

## 7. Recursos Recomendados

1. Libro: "Go Design Patterns"
2. [Patrones de Concurrencia](https://github.com/golang/go/wiki/Patterns)
3. [Arquitectura Hexagonal en Go](https://github.com/ThreeDotsLabs/wild-workouts)
4. [Ejemplo Clean Architecture](https://github.com/bxcodec/go-clean-arch)

Este es un resumen completo de arquitecturas y patrones en Go. Cada sección podría profundizarse con implementaciones específicas y optimizaciones. La elección de arquitectura y patrones debe basarse en los requisitos específicos del proyecto.
