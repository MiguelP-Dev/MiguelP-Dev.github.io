# Paquete database/sql en Go

El paquete `database/sql` en Go proporciona una interfaz genérica para interactuar con bases de datos SQL. Este documento explora en detalle sus funcionalidades y usos prácticos.

## 1. Conceptos Básicos

### 1.1 Conexión a la Base de Datos

```go
// filepath: /home/miguel/Documentos/Programación/Paquetes de go explicados/ejemplos/database/conexion.go
package database

import (
    "database/sql"
    "fmt"
    "time"
    _ "github.com/go-sql-driver/mysql"
)

type DBConfig struct {
    Driver   string
    User     string
    Password string
    Host     string
    Port     int
    DBName   string
}

func NewConnection(config DBConfig) (*sql.DB, error) {
    dsn := fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?parseTime=true",
        config.User,
        config.Password,
        config.Host,
        config.Port,
        config.DBName,
    )

    db, err := sql.Open(config.Driver, dsn)
    if err != nil {
        return nil, fmt.Errorf("error abriendo conexión: %w", err)
    }

    // Configurar el pool de conexiones
    db.SetMaxOpenConns(25)
    db.SetMaxIdleConns(5)
    db.SetConnMaxLifetime(5 * time.Minute)

    // Verificar conexión
    if err := db.Ping(); err != nil {
        return nil, fmt.Errorf("error verificando conexión: %w", err)
    }

    return db, nil
}
```

### 1.2 Modelos y Estructuras

```go
// filepath: /home/miguel/Documentos/Programación/Paquetes de go explicados/ejemplos/database/models.go
package database

import "time"

type Usuario struct {
    ID        int64     `db:"id"`
    Nombre    string    `db:"nombre"`
    Email     string    `db:"email"`
    Edad      int       `db:"edad"`
    CreatedAt time.Time `db:"created_at"`
    UpdatedAt time.Time `db:"updated_at"`
}

type Producto struct {
    ID          int64     `db:"id"`
    Nombre      string    `db:"nombre"`
    Precio      float64   `db:"precio"`
    Stock       int       `db:"stock"`
    CategoriaID int64     `db:"categoria_id"`
    CreatedAt   time.Time `db:"created_at"`
    UpdatedAt   time.Time `db:"updated_at"`
}
```

## 2. Operaciones CRUD

### 2.1 Implementación del Repositorio

```go
// filepath: /home/miguel/Documentos/Programación/Paquetes de go explicados/ejemplos/database/repository.go
package database

import (
    "context"
    "database/sql"
    "fmt"
    "time"
)

type Repository struct {
    db *sql.DB
}

func NewRepository(db *sql.DB) *Repository {
    return &Repository{db: db}
}

// CreateUser inserta un nuevo usuario
func (r *Repository) CreateUser(ctx context.Context, u *Usuario) error {
    query := `
        INSERT INTO usuarios (nombre, email, edad, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?)
    `
    now := time.Now()
    result, err := r.db.ExecContext(ctx, query,
        u.Nombre,
        u.Email,
        u.Edad,
        now,
        now,
    )
    if err != nil {
        return fmt.Errorf("error creando usuario: %w", err)
    }

    id, err := result.LastInsertId()
    if err != nil {
        return fmt.Errorf("error obteniendo ID: %w", err)
    }

    u.ID = id
    u.CreatedAt = now
    u.UpdatedAt = now
    return nil
}

// GetUserByID obtiene un usuario por su ID
func (r *Repository) GetUserByID(ctx context.Context, id int64) (*Usuario, error) {
    query := `
        SELECT id, nombre, email, edad, created_at, updated_at
        FROM usuarios
        WHERE id = ?
    `
    
    u := &Usuario{}
    err := r.db.QueryRowContext(ctx, query, id).Scan(
        &u.ID,
        &u.Nombre,
        &u.Email,
        &u.Edad,
        &u.CreatedAt,
        &u.UpdatedAt,
    )
    
    if err == sql.ErrNoRows {
        return nil, fmt.Errorf("usuario no encontrado: %d", id)
    }
    if err != nil {
        return nil, fmt.Errorf("error consultando usuario: %w", err)
    }
    
    return u, nil
}
```

### 2.2 Transacciones

```go
// filepath: /home/miguel/Documentos/Programación/Paquetes de go explicados/ejemplos/database/transactions.go
package database

import (
    "context"
    "database/sql"
    "fmt"
)

type Transferencia struct {
    OrigenID      int64
    DestinoID     int64
    Monto         float64
    Descripcion   string
}

func (r *Repository) RealizarTransferencia(ctx context.Context, t *Transferencia) error {
    tx, err := r.db.BeginTx(ctx, &sql.TxOptions{
        Isolation: sql.LevelSerializable,
    })
    if err != nil {
        return fmt.Errorf("error iniciando transacción: %w", err)
    }
    defer tx.Rollback()

    // Verificar saldo origen
    var saldoOrigen float64
    err = tx.QueryRowContext(ctx,
        "SELECT saldo FROM cuentas WHERE id = ? FOR UPDATE",
        t.OrigenID,
    ).Scan(&saldoOrigen)
    if err != nil {
        return fmt.Errorf("error verificando saldo origen: %w", err)
    }

    if saldoOrigen < t.Monto {
        return fmt.Errorf("saldo insuficiente")
    }

    // Actualizar saldos
    _, err = tx.ExecContext(ctx,
        "UPDATE cuentas SET saldo = saldo - ? WHERE id = ?",
        t.Monto, t.OrigenID,
    )
    if err != nil {
        return fmt.Errorf("error actualizando saldo origen: %w", err)
    }

    _, err = tx.ExecContext(ctx,
        "UPDATE cuentas SET saldo = saldo + ? WHERE id = ?",
        t.Monto, t.DestinoID,
    )
    if err != nil {
        return fmt.Errorf("error actualizando saldo destino: %w", err)
    }

    // Registrar movimiento
    _, err = tx.ExecContext(ctx,
        `INSERT INTO movimientos (origen_id, destino_id, monto, descripcion)
         VALUES (?, ?, ?, ?)`,
        t.OrigenID, t.DestinoID, t.Monto, t.Descripcion,
    )
    if err != nil {
        return fmt.Errorf("error registrando movimiento: %w", err)
    }

    if err := tx.Commit(); err != nil {
        return fmt.Errorf("error commit transacción: %w", err)
    }

    return nil
}
```

## 3. Consultas Avanzadas

### 3.1 Consultas con Joins

```go
// filepath: /home/miguel/Documentos/Programación/Paquetes de go explicados/ejemplos/database/queries.go
package database

type ProductoDetalle struct {
    Producto
    CategoriaNombre string    `db:"categoria_nombre"`
    Proveedor      string    `db:"proveedor"`
}

func (r *Repository) GetProductosDetallados(ctx context.Context) ([]ProductoDetalle, error) {
    query := `
        SELECT 
            p.id,
            p.nombre,
            p.precio,
            p.stock,
            p.categoria_id,
            c.nombre as categoria_nombre,
            prov.nombre as proveedor,
            p.created_at,
            p.updated_at
        FROM productos p
        LEFT JOIN categorias c ON p.categoria_id = c.id
        LEFT JOIN proveedores prov ON p.proveedor_id = prov.id
        WHERE p.stock > 0
        ORDER BY p.nombre
    `

    rows, err := r.db.QueryContext(ctx, query)
    if err != nil {
        return nil, fmt.Errorf("error consultando productos: %w", err)
    }
    defer rows.Close()

    var productos []ProductoDetalle
    for rows.Next() {
        var p ProductoDetalle
        err := rows.Scan(
            &p.ID,
            &p.Nombre,
            &p.Precio,
            &p.Stock,
            &p.CategoriaID,
            &p.CategoriaNombre,
            &p.Proveedor,
            &p.CreatedAt,
            &p.UpdatedAt,
        )
        if err != nil {
            return nil, fmt.Errorf("error escaneando producto: %w", err)
        }
        productos = append(productos, p)
    }

    if err := rows.Err(); err != nil {
        return nil, fmt.Errorf("error iterando resultados: %w", err)
    }

    return productos, nil
}
```

## 4. Mejores Prácticas

1. **Manejo de Conexiones**
   - Usar un pool de conexiones
   - Configurar timeouts apropiados
   - Cerrar recursos adecuadamente

2. **Seguridad**
   - Usar consultas preparadas
   - Escapar valores adecuadamente
   - Implementar control de acceso

3. **Rendimiento**
   - Indexar columnas frecuentemente consultadas
   - Optimizar consultas complejas
   - Monitorear tiempos de respuesta

## 5. Referencias

- [Documentación oficial de database/sql](https://golang.org/pkg/database/sql/)
- [Go Database/SQL tutorial](http://go-database-sql.org/)
- [Effective SQL](https://use-the-index-luke.com/)
