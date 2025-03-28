---
layout: default
title: crypto | Miguel's Programing Notes
description: Guía del paquete crypto de Go para criptografía
permalink: /paquetes/crypto/
categories: paquetes
icon: 🔐
---

# Paquete crypto en Go

El paquete `crypto` en Go es una colección de subpaquetes que proporcionan diversas funcionalidades criptográficas. Este documento explora en detalle cada subpaquete con ejemplos prácticos y casos de uso.

## 1. crypto/aes (Advanced Encryption Standard)

### 1.1 Cifrado AES-GCM

```go
func ejemploAESGCM() {
    // Clave debe ser de 16, 24 o 32 bytes (para AES-128, AES-192 o AES-256)
    key := make([]byte, 32)
    if _, err := io.ReadFull(rand.Reader, key); err != nil {
        panic(err)
    }

    // Crear cipher block
    block, err := aes.NewCipher(key)
    if (err != nil) {
        panic(err)
    }

    // Crear GCM (Galois/Counter Mode)
    gcm, err := cipher.NewGCM(block)
    if (err != nil) {
        panic(err)
    }

    // Crear nonce
    nonce := make([]byte, gcm.NonceSize())
    if _, err := io.ReadFull(rand.Reader, nonce); err != nil {
        panic(err)
    }

    // Datos a cifrar
    plaintext := []byte("Información secreta")

    // Cifrar
    ciphertext := gcm.Seal(nil, nonce, plaintext, nil)

    // Descifrar
    plaintext2, err := gcm.Open(nil, nonce, ciphertext, nil)
    if err != nil {
        panic(err)
    }

    fmt.Printf("Texto original: %s\n", plaintext)
    fmt.Printf("Texto descifrado: %s\n", plaintext2)
}
```

### 1.2 Cifrar Archivo con AES

```go
func cifrarArchivo(inputPath, outputPath string, key []byte) error {
    // Abrir archivo de entrada
    input, err := os.Open(inputPath)
    if err != nil {
        return err
    }
    defer input.Close()

    // Crear archivo de salida
    output, err := os.Create(outputPath)
    if err != nil {
        return err
    }
    defer output.Close()

    // Crear cipher block
    block, err := aes.NewCipher(key)
    if err != nil {
        return err
    }

    // Crear GCM
    gcm, err := cipher.NewGCM(block)
    if err != nil {
        return err
    }

    // Crear nonce
    nonce := make([]byte, gcm.NonceSize())
    if _, err := io.ReadFull(rand.Reader, nonce); err != nil {
        return err
    }

    // Escribir nonce al inicio del archivo
    if _, err := output.Write(nonce); err != nil {
        return err
    }

    // Crear writer con cifrado
    writer := &cipher.StreamWriter{
        S: cipher.NewCTR(block, nonce),
        W: output,
    }

    // Copiar y cifrar datos
    if _, err := io.Copy(writer, input); err != nil {
        return err
    }

    return nil
}
```

## 2. crypto/rsa

### 2.1 Cifrado y Descifrado RSA
```go
package main

import (
    "crypto/rand"
    "crypto/rsa"
    "crypto/sha256"
    "fmt"
)

func main() {
    privateKey, err := rsa.GenerateKey(rand.Reader, 2048)
    if err != nil {
        panic(err)
    }

    publicKey := &privateKey.PublicKey
    message := []byte("Hello, world!")
    label := []byte("")
    hash := sha256.New()

    ciphertext, err := rsa.EncryptOAEP(hash, rand.Reader, publicKey, message, label)
    if err != nil {
        panic(err)
    }

    fmt.Printf("Encrypted message: %x\n", ciphertext)

    plaintext, err := rsa.DecryptOAEP(hash, rand.Reader, privateKey, ciphertext, label)
    if err != nil {
        panic(err)
    }

    fmt.Printf("Decrypted message: %s\n", plaintext)
}
```

### 2.2 Generar y Guardar Claves RSA

```go
func generarGuardarClaves() error {
    // Generar par de claves
    privateKey, err := rsa.GenerateKey(rand.Reader, 4096)
    if err != nil {
        return err
    }

    // Convertir a PEM
    privateKeyPEM := &pem.Block{
        Type:  "RSA PRIVATE KEY",
        Bytes: x509.MarshalPKCS1PrivateKey(privateKey),
    }

    publicKeyPEM := &pem.Block{
        Type:  "RSA PUBLIC KEY",
        Bytes: x509.MarshalPKCS1PublicKey(&privateKey.PublicKey),
    }

    // Guardar clave privada
    privateKeyFile, err := os.Create("private.pem")
    if err != nil {
        return err
    }
    defer privateKeyFile.Close()
    
    if err := pem.Encode(privateKeyFile, privateKeyPEM); err != nil {
        return err
    }

    // Guardar clave pública
    publicKeyFile, err := os.Create("public.pem")
    if err != nil {
        return err
    }
    defer publicKeyFile.Close()
    
    return pem.Encode(publicKeyFile, publicKeyPEM)
}
```

### 2.3 Firmar y Verificar Documentos con RSA

{% raw %}
```go
type DocumentoFirmado struct {
    Contenido    []byte
    Firma        []byte
    FechaFirma   time.Time
    FirmadoPor   string
}

func firmarDocumento(documento []byte, privateKey *rsa.PrivateKey, firmadoPor string) (*DocumentoFirmado, error) {
    // Calcular hash del documento
    hashed := sha256.Sum256(documento)

    // Firmar el hash
    firma, err := rsa.SignPSS(rand.Reader, privateKey, crypto.SHA256, hashed[:], nil)
    if err != nil {
        return nil, err
    }

    return &DocumentoFirmado{
        Contenido:    documento,
        Firma:        firma,
        FechaFirma:   time.Now(),
        FirmadoPor:   firmadoPor,
    }, nil
}

func verificarFirma(doc *DocumentoFirmado, publicKey *rsa.PublicKey) error {
    // Calcular hash del documento
    hashed := sha256.Sum256(doc.Contenido)

    // Verificar firma
    return rsa.VerifyPSS(publicKey, crypto.SHA256, hashed[:], doc.Firma, nil)
}
```
{% endraw %}

## 3. crypto/md5

### 3.1 Hash MD5

```go
package main

import (
    "crypto/md5"
    "fmt"
)

func main() {
    data := []byte("Hello, world!")
    hash := md5.Sum(data)
    fmt.Printf("MD5 hash: %x\n", hash)
}
```

## 4. crypto/sha256

### 4.1 Hash SHA-256

```go
package main

import (
    "crypto/sha256"
    "fmt"
)

func main() {
    data := []byte("Hello, world!")
    hash := sha256.Sum256(data)
    fmt.Printf("SHA-256 hash: %x\n", hash)
}
```

## 5. crypto/hmac

### 5.1 HMAC con SHA-256

```go
package main

import (
    "crypto/hmac"
    "crypto/sha256"
    "fmt"
)

func main() {
    key := []byte("secret key")
    message := []byte("Hello, world!")

    hash := hmac.New(sha256.New, key)
    hash.Write(message)
    sum := hash.Sum(nil)
    fmt.Printf("HMAC: %x\n", sum)
}
```

### 5.2 Crear y Verificar Mensaje Autenticado

```go
type MensajeAutenticado struct {
    Contenido   []byte
    HMAC        []byte
    Timestamp   time.Time
}

func crearMensajeAutenticado(contenido []byte, key []byte) *MensajeAutenticado {
    h := hmac.New(sha256.New, key)
    h.Write(contenido)
    
    return &MensajeAutenticado{
        Contenido: contenido,
        HMAC:     h.Sum(nil),
        Timestamp: time.Now(),
    }
}

func verificarMensaje(mensaje *MensajeAutenticado, key []byte) bool {
    h := hmac.New(sha256.New, key)
    h.Write(mensaje.Contenido)
    expectedHMAC := h.Sum(nil)
    
    return hmac.Equal(mensaje.HMAC, expectedHMAC)
}
```

### Subpaquetes adicionales en `crypto`

- **`crypto/ecdsa`**: Implementa las funciones para la firma y verificación con el algoritmo ECDSA (Elliptic Curve Digital Signature Algorithm).
- **`crypto/elliptic`**: Implementa las curvas elípticas utilizadas en criptografía.
- **`crypto/des`**: Implementa el cifrado y descifrado según el estándar DES (Data Encryption Standard) y Triple DES.

### Descripción General

1. **`crypto/aes`**: Cifrado y descifrado simétrico según AES.
2. **`crypto/rsa`**: Cifrado, descifrado, firma y verificación según RSA.
3. **`crypto/md5`**: Algoritmo de hash MD5 (no recomendado para criptografía).
4. **`crypto/sha256`**: Algoritmo de hash SHA-256.
5. **`crypto/hmac`**: Algoritmo HMAC para autenticación e integridad de mensajes.
6. **`crypto/ecdsa`**: Firma y verificación con ECDSA.
7. **`crypto/elliptic`**: Implementaciones de curvas elípticas.
8. **`crypto/des`**: Cifrado y descifrado según DES y Triple DES.

Estos son algunos de los componentes más importantes del paquete `crypto` en Go. Cada uno de estos subpaquetes ofrece herramientas esenciales para implementar diversas funcionalidades criptográficas. Si necesitas más información o ejemplos sobre algún subpaquete en particular, ¡háblame! Estoy aquí para ayudarte.

## 6. Generar Contraseñas Seguras

### 6.1 Generar Contraseña Aleatoria

```go
func generarPassword(longitud int) (string, error) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+"
    bytes := make([]byte, longitud)
    
    if _, err := rand.Read(bytes); err != nil {
        return "", err
    }
    
    for i, b := range bytes {
        bytes[i] = charset[b%byte(len(charset))]
    }
    
    return string(bytes), nil
}
```

### 6.2 Hash de Contraseña
{% raw %}
```go
func hashPassword(password string) (string, error) {
    // Generar salt aleatorio
    salt := make([]byte, 16)
    if _, err := rand.Read(salt); err != nil {
        return "", err
    }

    // Derivar clave usando Argon2
    key := argon2.IDKey([]byte(password), salt, 1, 64*1024, 4, 32)

    // Codificar resultado
    encoded := base64.StdEncoding.EncodeToString(append(salt, key...))
    return encoded, nil
}
```
{% endraw %}

### Mejores Prácticas

- Gestión de Claves
  - Almacenar claves de forma segura
  - Rotar claves periódicamente
  - Usar generadores de números aleatorios seguros

- Manejo de Errores
  - Validar entradas
  - Manejar errores criptográficos apropiadamente
  - No exponer información sensible en errores

- Consideraciones de Rendimiento
  - Usar búfers para operaciones grandes
  - Implementar caché cuando sea apropiado
  - Considerar operaciones concurrentes
