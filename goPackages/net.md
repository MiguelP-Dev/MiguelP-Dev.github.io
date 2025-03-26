# Paquete `net` en Go: Guía Completa con Ejemplos Prácticos

El paquete `net` en Go es fundamental para desarrollar aplicaciones de red, ofreciendo funcionalidades para manejar conexiones TCP/UDP, resolver direcciones DNS y trabajar con interfaces de red. A continuación, se presenta una guía detallada con ejemplos y mejores prácticas.

---

## Funciones Clave y Uso

### 1. **`net.Dial(network, address string) (Conn, error)`**
**Propósito**: Establece una conexión a un servidor remoto.  
**Redes soportadas**: `tcp`, `tcp4`, `tcp6`, `udp`, `udp4`, `udp6`, `unix`, `unixpacket`.  
**Ejemplo (TCP)**:
```go
conn, err := net.Dial("tcp", "google.com:80")
if err != nil {
    log.Fatal("Error de conexión:", err)
}
defer conn.Close()
fmt.Fprintf(conn, "GET / HTTP/1.0\r\n\r\n")
```

### 2. **`net.Listen(network, address string) (Listener, error)`**
**Propósito**: Crea un servidor que escucha conexiones entrantes.  
**Ejemplo (Servidor TCP)**:
```go
ln, err := net.Listen("tcp", ":8080")
if err != nil {
    log.Fatal("Error al escuchar:", err)
}
defer ln.Close()

for {
    conn, err := ln.Accept()
    if err != nil {
        log.Println("Error aceptando conexión:", err)
        continue
    }
    go manejarConexion(conn) // Manejar en una goroutine
}

func manejarConexion(conn net.Conn) {
    defer conn.Close()
    conn.Write([]byte("Hola desde el servidor!\n"))
}
```

### 3. **`net.ResolveIPAddr(network, address string) (*IPAddr, error)`**
**Propósito**: Resuelve un nombre de host a una dirección IP.  
**Ejemplo**:
```go
ip, err := net.ResolveIPAddr("ip", "google.com")
if err != nil {
    log.Fatal(err)
}
fmt.Println("IP de Google:", ip) // Ejemplo: 172.217.10.238
```

### 4. **`net.LookupHost(host string) ([]string, error)`**
**Propósito**: Obtiene todas las direcciones IP (IPv4 e IPv6) de un host.  
**Ejemplo**:
```go
addrs, err := net.LookupHost("google.com")
if err != nil {
    log.Fatal(err)
}
fmt.Println("Direcciones IP:", addrs) // [172.217.10.238 2a00:1450:4009:81c::200e]
```

### 5. **`net.Interfaces() ([]Interface, error)`**
**Propósito**: Lista las interfaces de red del sistema.  
**Ejemplo (Listar interfaces activas)**:
```go
ifaces, err := net.Interfaces()
if err != nil {
    log.Fatal(err)
}

for _, iface := range ifaces {
    if iface.Flags&net.FlagUp != 0 {
        fmt.Printf("Interfaz activa: %v\n", iface.Name)
    }
}
```

### 6. **`net.JoinHostPort(host, port string) string`**
**Propósito**: Formatea una dirección IP y puerto correctamente.  
**Ejemplo (IPv6)**:
```go
address := net.JoinHostPort("::1", "8080")
fmt.Println(address) // [::1]:8080
```

### 7. **`net.SplitHostPort(hostport string) (host, port string, err error)`**
**Propósito**: Divide una dirección en host y puerto.  
**Ejemplo**:
```go
host, port, err := net.SplitHostPort("[::1]:8080")
if err != nil {
    log.Fatal(err)
}
fmt.Println("Host:", host) // ::1
fmt.Println("Puerto:", port) // 8080
```

---

## Tipos Principales

### **`net.Conn`** (Interfaz)
**Métodos**:
- `Read(b []byte) (n int, err error)`: Lee datos de la conexión.
- `Write(b []byte) (n int, err error)`: Escribe datos en la conexión.
- `Close() error`: Cierra la conexión.

### **`net.Listener`** (Interfaz)
**Métodos**:
- `Accept() (Conn, error)`: Acepta una conexión entrante.
- `Close() error`: Detiene el listener.

### **`net.IP`** (Tipo)
**Uso**: Manipulación de direcciones IP.  
**Ejemplo**:
```go
ip := net.ParseIP("192.168.1.1")
if ip.To4() != nil {
    fmt.Println("Es IPv4:", ip)
}
```

### **`net.Addr`** (Interfaz)
**Propósito**: Representa una dirección de red (ej: `TCPAddr`, `UDPAddr`).

---

## Mejores Prácticas

1. **Manejo de Concurrencia**:
   - Usar goroutines para manejar múltiples conexiones simultáneamente.
   ```go
   ln, _ := net.Listen("tcp", ":8080")
   for {
       conn, _ := ln.Accept()
       go func(c net.Conn) {
           defer c.Close()
           // Manejar conexión
       }(conn)
   }
   ```

2. **Cierre Adecuado de Recursos**:
   - Siempre cerrar conexiones y listeners con `defer`.

3. **Manejo de Errores**:
   - Verificar errores en cada operación de red.
   ```go
   conn, err := net.Dial("tcp", "servidor:80")
   if err != nil {
       log.Fatal("Error de conexión:", err)
   }
   defer conn.Close()
   ```

4. **IPv6 y Formatos Especiales**:
   - Usar `JoinHostPort` para direcciones IPv6:
     ```go
     net.JoinHostPort("2001:db8::1", "80") // [2001:db8::1]:80
     ```

---

## Ejemplo Integrado: Cliente-Servidor TCP

**Servidor**:
```go
package main

import (
    "log"
    "net"
)

func main() {
    ln, err := net.Listen("tcp", ":8080")
    if err != nil {
        log.Fatal(err)
    }
    defer ln.Close()

    for {
        conn, err := ln.Accept()
        if err != nil {
            log.Println("Error aceptando conexión:", err)
            continue
        }
        go handleRequest(conn)
    }
}

func handleRequest(conn net.Conn) {
    defer conn.Close()
    conn.Write([]byte("Bienvenido al servidor!\n"))
}
```

**Cliente**:
```go
package main

import (
    "fmt"
    "io"
    "log"
    "net"
)

func main() {
    conn, err := net.Dial("tcp", "localhost:8080")
    if err != nil {
        log.Fatal(err)
    }
    defer conn.Close()

    msg, _ := io.ReadAll(conn)
    fmt.Println(string(msg)) // "Bienvenido al servidor!"
}
```

---

## Consideraciones Finales

- **DNS y Resolución de Nombres**: Preferir `net.LookupHost` para obtener todas las IPs asociadas a un dominio.
- **IPv4 vs IPv6**: Utilizar `net.ParseIP` y métodos como `To4()` para manejar diferentes formatos.
- **Seguridad**: Validar entradas al trabajar con direcciones de red para prevenir ataques (ej: inyecciones).

El paquete `net` proporciona todas las herramientas necesarias para construir aplicaciones de red eficientes y escalables en Go, desde clientes simples hasta servidores concurrentes complejos.