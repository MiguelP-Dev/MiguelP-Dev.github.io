---
layout: default
title: maps | Miguel's Programing Notes
description: Guía del paquete maps de Go para manipulación de mapas
permalink: /paquetes/maps/
categories: paquetes
icon: 🗺️
---

# Paquete `golang.org/x/exp/maps` en Go: Guía Completa

El paquete `maps` del repositorio experimental de Go (`golang.org/x/exp/maps`) ofrece utilidades para manipular mapas. A continuación, se detallan sus funciones clave con ejemplos mejorados y consideraciones importantes.

---

## Instalación y Uso
Primero, instala el paquete:
```bash
go get golang.org/x/exp/maps
```
Importa en tu código:
```go
import "golang.org/x/exp/maps"
```

---

## Funciones Principales

### 1. **`maps.Clear`**
**Propósito**: Elimina todas las entradas de un mapa.  
**Ejemplo**:
```go
m := map[string]int{"a": 1, "b": 2}
maps.Clear(m)
fmt.Println(len(m)) // 0
```
**Advertencia**: Si el mapa es `nil`, causa pánico.

### 2. **`maps.Clone`**
**Propósito**: Crea una copia superficial del mapa.  
**Ejemplo**:
```go
original := map[string]int{"a": 1}
copia := maps.Clone(original)
copia["a"] = 2
fmt.Println(original["a"]) // 1 (no afecta al original)
```
**Limitación**: No clona mapas anidados profundamente.

### 3. **`maps.Copy`**
**Propósito**: Copia entradas de un mapa a otro.  
**Ejemplo**:
```go
destino := map[string]int{"b": 3}
origen := map[string]int{"a": 1, "b": 2}
maps.Copy(destino, origen)
fmt.Println(destino) // map[a:1 b:2]
```
**Nota**: Claves existentes en `destino` se sobrescriben.

### 4. **`maps.Equal`**
**Propósito**: Compara si dos mapas tienen las mismas claves/valores.  
**Ejemplo**:
```go
m1 := map[string]int{"a": 1}
m2 := map[string]int{"a": 1}
fmt.Println(maps.Equal(m1, m2)) // true
```
**Detalle**: Funciona con tipos comparables (`int`, `string`, etc.).

### 5. **`maps.Keys`** y **`maps.Values`**
**Propósito**: Obtiene claves o valores como slice.  
**Ejemplo**:
```go
m := map[string]int{"a": 1, "b": 2}
claves := maps.Keys(m)   // []string{"a", "b"}
valores := maps.Values(m) // []int{1, 2}
```
**Advertencia**: El orden de los elementos no está garantizado.

---

## Consideraciones Clave

1. **Manejo de `nil`**:
   ```go
   var m map[string]int
   maps.Clear(m) // Pánico: assignment to entry in nil map
   ```

2. **Rendimiento**:
   - `Clone` y `Copy` tienen complejidad O(n).
   - `Keys`/`Values` crean slices nuevos (uso de memoria).

3. **Tipos No Comparables**:
   ```go
   type Person struct { Name string }
   m1 := map[int]Person{1: {"Alice"}}
   m2 := map[int]Person{1: {"Alice"}}
   fmt.Println(maps.Equal(m1, m2)) // Error si Person no es comparable
   ```

---

## Ejemplo Integrado: Gestión de Configuraciones
```go
func mergeConfigs(base, override map[string]string) map[string]string {
    merged := maps.Clone(base)
    maps.Copy(merged, override)
    return merged
}

// Uso:
config := map[string]string{"theme": "dark"}
userConfig := map[string]string{"theme": "light", "lang": "es"}
finalConfig := mergeConfigs(config, userConfig)
// finalConfig: map[lang:es theme:light]
```

---

## Alternativas en la Biblioteca Estándar
Para proyectos que no pueden usar paquetes experimentales:
- **`Clear`**: Iterar y eliminar claves.
- **`Clone`**: Crear nuevo mapa y copiar manualmente.
- **`Equal`**: Comparar clave por clave.

---

Este paquete experimental simplifica operaciones comunes con mapas, pero es crucial evaluar su estabilidad antes de usarlo en producción. Para casos críticos, implementa versiones personalizadas de estas funciones.