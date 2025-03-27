# Esto es un ejemplo del manejo de querys especiales con Go

```go
package main

import (
    "database/sql"
    "fmt"
    _ "github.com/go-sql-driver/mysql"
)

func main() {
    var str string = "str"
    var num int = 32
    var floatNum float64 = 25.2
    var boolVal bool = true

    query := fmt.Sprintf("INSERT INTO your_table (col1, col2, col3, col4) VALUES (%s, %d, %.2f, %t)", str, num, floatNum, boolVal)
    fmt.Println(query)

    db, err := sql.Open("mysql", "user:password@tcp(127.0.0.1:3306)/dbname")
    if err != nil {
        fmt.Println(err)
        return
    }
    defer db.Close()

    _, err = db.Exec(query)
    if err != nil {
        fmt.Println(err)
        return
    }

    fmt.Println("Query ejecutada exitosamente")
}
```
