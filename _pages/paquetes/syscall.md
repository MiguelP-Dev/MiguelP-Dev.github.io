---
layout: default
title: syscall | Miguel's Programing Notes
description: Guía del paquete syscall de Go para acceso a llamadas del sistema
permalink: /paquetes/syscall/
categories: paquetes
icon: 🖥️
---

# Paquete `syscall` en Go

El paquete `syscall` proporciona acceso directo a las llamadas del sistema en Go. Esta guía ampliada profundiza en su uso con ejemplos avanzados, mejores prácticas y consideraciones de portabilidad.  

---

## Funciones Clave  

### 1. **`syscall.Open`**

**Descripción**: Abre o crea un archivo, devolviendo un descriptor de archivo.  

**Ejemplo con Combinación de Flags y Permisos**:

```go  
package main  

import (  
    "fmt"  
    "syscall"  
)  

func main() {  
    // Abrir en modo lectura/escritura, crear si no existe, truncar y añadir al final  
    fd, err := syscall.Open(  
        "datos.log",  
        syscall.O_RDWR|syscall.O_CREAT|syscall.O_TRUNC|syscall.O_APPEND,  
        uint32(syscall.S_IRUSR|syscall.S_IWUSR), // 0600  
    )  
    if err != nil {  
        fmt.Println("Error al abrir:", err)  
        return  
    }  
    defer syscall.Close(fd)  

    fmt.Println("Descriptor:", fd)  
}  
```

**Notas**:  

- Las banderas se combinan con `|`.  
- Los permisos siguen la notación octal (ej: `0600` = usuario tiene lectura/escritura).  

---

### 2. **`syscall.Read` y `syscall.Write`**

**Descripción**: Lectura/escritura de bajo nivel con buffers.  

**Ejemplo con Lectura en Bucle y Escritura Segura**:  

```go
func leerEscribirArchivo() {  
    fd, _ := syscall.Open("datos.bin", syscall.O_RDWR, 0600)  
    defer syscall.Close(fd)  

    // Leer todo el contenido  
    var buf [4096]byte  
    total := 0  
    for {  
        n, err := syscall.Read(fd, buf[total:])  
        if err != nil || n == 0 {  
            break  
        }  
        total += n  
    }  

    // Escribir datos cifrados  
    datos := []byte{0x48, 0x65, 0x6c, 0x6c, 0x6f} // "Hello"  
    if _, err := syscall.Write(fd, datos); err != nil {  
        fmt.Println("Error al escribir:", err)  
    }  
}  
```  

---

### 3. **`syscall.Exec`**

**Descripción**: Reemplaza el proceso actual.  

**Ejemplo con Variables de Entorno y Argumentos Dinámicos**:

```go  
func ejecutarProceso() {  
    argv := []string{"/usr/bin/env", "bash", "-c", "echo $USER"}  
    env := []string{"USER=usuario_go", "PATH=/usr/bin"}  

    err := syscall.Exec(  
        "/usr/bin/env",  
        argv,  
        env,  
    )  
    if err != nil {  
        fmt.Println("Error al ejecutar:", err)  
    }  
}  
```

**Advertencia**: Tras `Exec`, el proceso original termina.  

---

### 4. **`syscall.Socket` y `syscall.Connect`**

**Descripción**: Comunicación de red de bajo nivel.  

**Ejemplo de Cliente TCP**:

```go  
func conectarServidor() {  
    fd, _ := syscall.Socket(syscall.AF_INET, syscall.SOCK_STREAM, 0)  

    addr := &syscall.SockaddrInet4{  
        Port: 8080,  
        Addr: [4]byte{127, 0, 0, 1},  
    }  

    if err := syscall.Connect(fd, addr); err != nil {  
        fmt.Println("Error de conexión:", err)  
        return  
    }  

    mensaje := "GET / HTTP/1.1\r\n\r\n"  
    syscall.Write(fd, []byte(mensaje))  

    // Leer respuesta  
    buf := make([]byte, 1024)  
    n, _ := syscall.Read(fd, buf)  
    fmt.Println("Respuesta:", string(buf[:n]))  
}  
```  

---

## Constantes y Combinaciones Comunes  

### Banderas de Apertura de Archivos

| Combinación                  | Comportamiento                          |  
|------------------------------|-----------------------------------------|  
| `O_RDONLY + O_CREAT`           | Lectura, crea si no existe |
| `O_WRONLY + O_TRUNC`           | Escritura, trunca el archivo|
| `O_RDWR + O_APPEND`            | Lectura/escritura, añade al final  |

**Ejemplo de Permisos**:

```go  
permisos := uint32(syscall.S_IRUSR | syscall.S_IWGRP | syscall.S_IROTH) // 0640  
```  

---

## Mejores Prácticas  

1. **Portabilidad**:  
   - El paquete `syscall` varía entre sistemas operativos. Usa `golang.org/x/sys/unix` para código multiplataforma.  
   - Ejemplo para Linux vs Windows:

     ```go  
     // En Linux  
     syscall.Syscall(syscall.SYS_GETPID, 0, 0, 0)  

     // En Windows (no compatible)  
     ```  

2. **Manejo de Errores**:

   ```go  
   if _, err := syscall.Write(fd, data); err != nil {  
       if err == syscall.EPIPE {  
           fmt.Println("Error: tubería rota")  
       }  
   }  
   ```  

3. **Alternativas de Alto Nivel**:  
   - Usa `os.Open` en lugar de `syscall.Open` para manejo automático de errores y cierre.  
   - Para procesos, prefiere `os/exec`.  

---

## Casos de Uso Avanzados  

### 1. **Mapeo de Memoria con `syscall.Mmap`**

```go  
func mapearArchivo() {  
    fd, _ := syscall.Open("datos.bin", syscall.O_RDWR, 0600)  
    defer syscall.Close(fd)  

    // Mapear 1KB del archivo  
    data, err := syscall.Mmap(  
        fd,  
        0,  
        1024,  
        syscall.PROT_READ|syscall.PROT_WRITE,  
        syscall.MAP_SHARED,  
    )  
    if err != nil {  
        panic(err)  
    }  
    defer syscall.Munmap(data)  

    // Modificar contenido directamente  
    copy(data, []byte("Nuevos datos"))  
}  
```  

### 2. **Señales del Sistema con `syscall.Kill`**

```go  
func enviarSenal() {  
    pid := 12345 // ID del proceso  
    err := syscall.Kill(pid, syscall.SIGTERM)  
    if err != nil {  
        fmt.Println("Error al enviar señal:", err)  
    }  
}  
```  

---

## Advertencias Comunes  

1. **Fugas de Descriptores**:

   ```go  
   fd, _ := syscall.Open(...)  
   // Olvidar syscall.Close(fd) → Fuga de recurso  
   ```  

   **Solución**: Usar `defer` sistemáticamente.  

2. **Uso en Windows**:  
   - Muchas funciones de `syscall` (ej: `SockaddrInet4`) no son compatibles.  

3. **Bloqueos en Llamadas de Red**:  
   - Las operaciones como `Read` en sockets pueden bloquearse indefinidamente.  

---

## Conclusión

El paquete `syscall` es una herramienta poderosa para operaciones de bajo nivel, pero requiere un manejo cuidadoso de recursos y errores. Para la mayoría de casos, se recomienda usar paquetes de nivel superior como `os` o `net`, reservando `syscall` para situaciones que requieran control absoluto del sistema.  
