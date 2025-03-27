---
layout: default
title: container | Miguel's Programing Notes
description: Guía del paquete container de Go para estructuras de datos
permalink: /paquetes/container/
categories: paquetes
icon: 📚
---

# Paquete container en Go

El paquete `container` proporciona implementaciones de estructuras de datos básicas como listas, anillos y montículos (heaps). Este documento explora en detalle cada subpaquete con ejemplos prácticos.

## 1. container/heap

### 1.1 Implementación de un Min-Heap

```go
// Ejemplo de implementación de un min-heap de enteros
type IntHeap []int

func (h IntHeap) Len() int           { return len(h) }
func (h IntHeap) Less(i, j int) bool { return h[i] < h[j] }
func (h IntHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }

func (h *IntHeap) Push(x interface{}) {
    *h = append(*h, x.(int))
}

func (h *IntHeap) Pop() interface{} {
    old := *h
    n := len(old)
    x := old[n-1]
    *h = old[0 : n-1]
    return x
}

// Ejemplo de uso
func ejemploMinHeap() {
    h := &IntHeap{4, 8, 3, 6, 1}
    heap.Init(h)
    
    // Insertar elemento
    heap.Push(h, 2)
    
    // Obtener el mínimo
    fmt.Printf("Mínimo: %d\n", (*h)[0])
    
    // Extraer elementos ordenados
    for h.Len() > 0 {
        fmt.Printf("%d ", heap.Pop(h))
    }
}
```

### 1.2 Implementación de un Priority Queue

```go
type Item struct {
    valor    string
    prioridad int
    index    int
}

type PriorityQueue []*Item

func (pq PriorityQueue) Len() int { return len(pq) }

func (pq PriorityQueue) Less(i, j int) bool {
    return pq[i].prioridad > pq[j].prioridad
}

func (pq PriorityQueue) Swap(i, j int) {
    pq[i], pq[j] = pq[j], pq[i]
    pq[i].index = i
    pq[j].index = j
}

func (pq *PriorityQueue) Push(x interface{}) {
    n := len(*pq)
    item := x.(*Item)
    item.index = n
    *pq = append(*pq, item)
}

func (pq *PriorityQueue) Pop() interface{} {
    old := *pq
    n := len(old)
    item := old[n-1]
    old[n-1] = nil
    item.index = -1
    *pq = old[0 : n-1]
    return item
}

// Ejemplo de uso de la cola de prioridad
func ejemploPriorityQueue() {
    pq := make(PriorityQueue, 0)
    heap.Init(&pq)

    // Agregar elementos
    heap.Push(&pq, &Item{valor: "urgente", prioridad: 3})
    heap.Push(&pq, &Item{valor: "normal", prioridad: 2})
    heap.Push(&pq, &Item{valor: "bajo", prioridad: 1})

    // Procesar elementos por prioridad
    for pq.Len() > 0 {
        item := heap.Pop(&pq).(*Item)
        fmt.Printf("Procesando: %s (prioridad: %d)\n", 
                  item.valor, item.prioridad)
    }
}
```

## 2. container/list

### 2.1 Lista Doblemente Enlazada como Cache LRU

```go
type LRUCache struct {
    capacidad int
    items     map[string]*list.Element
    lista     *list.List
}

type par struct {
    clave string
    valor interface{}
}

func NuevoLRUCache(capacidad int) *LRUCache {
    return &LRUCache{
        capacidad: capacidad,
        items:     make(map[string]*list.Element),
        lista:     list.New(),
    }
}

func (c *LRUCache) Obtener(clave string) (interface{}, bool) {
    if elem, existe := c.items[clave]; existe {
        c.lista.MoveToFront(elem)
        return elem.Value.(*par).valor, true
    }
    return nil, false
}

func (c *LRUCache) Poner(clave string, valor interface{}) {
    if elem, existe := c.items[clave]; existe {
        c.lista.MoveToFront(elem)
        elem.Value.(*par).valor = valor
        return
    }

    if c.lista.Len() >= c.capacidad {
        ultimo := c.lista.Back()
        if ultimo != nil {
            c.lista.Remove(ultimo)
            delete(c.items, ultimo.Value.(*par).clave)
        }
    }

    elem := c.lista.PushFront(&par{clave, valor})
    c.items[clave] = elem
}
```

### 2.2 Implementación de una Cola de Tareas

```go
type Tarea struct {
    ID        int
    Nombre    string
    Completada bool
}

type ColaTareas struct {
    tareas *list.List
}

func NuevaColaTareas() *ColaTareas {
    return &ColaTareas{
        tareas: list.New(),
    }
}

func (c *ColaTareas) Agregar(tarea Tarea) {
    c.tareas.PushBack(tarea)
}

func (c *ColaTareas) ProcesarSiguiente() (Tarea, bool) {
    if c.tareas.Len() == 0 {
        return Tarea{}, false
    }
    
    elem := c.tareas.Front()
    tarea := elem.Value.(Tarea)
    c.tareas.Remove(elem)
    return tarea, true
}
```

## 3. container/ring

### 3.1 Buffer Circular

```go
type BufferCircular struct {
    datos *ring.Ring
    capacidad int
}

func NuevoBufferCircular(capacidad int) *BufferCircular {
    return &BufferCircular{
        datos: ring.New(capacidad),
        capacidad: capacidad,
    }
}

func (b *BufferCircular) Agregar(valor interface{}) {
    b.datos.Value = valor
    b.datos = b.datos.Next()
}

func (b *BufferCircular) ObtenerTodos() []interface{} {
    valores := make([]interface{}, 0, b.capacidad)
    b.datos.Do(func(x interface{}) {
        if x != nil {
            valores = append(valores, x)
        }
    })
    return valores
}
```

### 3.2 Planificador de Tareas Cíclicas

```go
type TareaCiclica struct {
    nombre string
    intervalo time.Duration
    ejecutar func()
}

type PlanificadorCiclico struct {
    tareas *ring.Ring
    activo bool
}

func NuevoPlanificador(tareas []TareaCiclica) *PlanificadorCiclico {
    r := ring.New(len(tareas))
    for _, t := range tareas {
        r.Value = t
        r = r.Next()
    }
    return &PlanificadorCiclico{tareas: r}
}

func (p *PlanificadorCiclico) Iniciar() {
    p.activo = true
    go func() {
        for p.activo {
            tarea := p.tareas.Value.(TareaCiclica)
            go tarea.ejecutar()
            time.Sleep(tarea.intervalo)
            p.tareas = p.tareas.Next()
        }
    }()
}
```

## 4. Ejemplos de Uso Práctico

### 4.1 Sistema de Procesamiento de Eventos

```go
type Evento struct {
    ID        int
    Tipo      string
    Prioridad int
    Datos     interface{}
}

type ProcesadorEventos struct {
    cola    PriorityQueue
    history *list.List
    buffer  *BufferCircular
}

func NuevoProcesadorEventos() *ProcesadorEventos {
    return &ProcesadorEventos{
        cola:    make(PriorityQueue, 0),
        history: list.New(),
        buffer:  NuevoBufferCircular(100),
    }
}
```

## 5. Mejores Prácticas

1. **Elección de Estructura**
   - Usa `heap` para priorización
   - Usa `list` para inserción/eliminación frecuente
   - Usa `ring` para datos circulares

2. **Consideraciones de Rendimiento**
   - Preasigna capacidad cuando sea posible
   - Considera la complejidad de las operaciones
   - Implementa limpieza de recursos

3. **Concurrencia**
   - Protege estructuras compartidas
   - Usa canales para comunicación
   - Implementa patrones de sincronización

## 6. Referencias

- [Documentación oficial de container](https://golang.org/pkg/container/)
- [Effective Go](https://golang.org/doc/effective_go.html)
