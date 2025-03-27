# Trabajando con Pilas(Stack) y Colas(Queue) en GO

Aquí hay ejemplos de cómo implementar pilas (stack) y colas (queue) utilizando las estructuras (`struct`) en Go.

## Pila (Stack)

Una pila es una estructura de datos LIFO (Last In, First Out), donde el último elemento en entrar es el primero en salir.

```go
package main

import "fmt"

// Definir la estructura de la pila
type Stack struct {
    items []int
}

// Apilar (push) un elemento en la pila
func (s *Stack) Push(item int) {
    s.items = append(s.items, item)
}

// Desapilar (pop) un elemento de la pila
func (s *Stack) Pop() int {
    if len(s.items) == 0 {
        fmt.Println("Pila vacía")
        return -1
    }
    // Obtener el último elemento
    item := s.items[len(s.items)-1]
    // Remover el último elemento
    s.items = s.items[:len(s.items)-1]
    return item
}

func main() {
    stack := Stack{}

    // Apilar elementos
    stack.Push(1)
    stack.Push(2)
    stack.Push(3)

    // Desapilar elementos
    fmt.Println(stack.Pop()) // 3
    fmt.Println(stack.Pop()) // 2
    fmt.Println(stack.Pop()) // 1
    fmt.Println(stack.Pop()) // Pila vacía
}
```

## Cola (Queue)

Una cola es una estructura de datos FIFO (First In, First Out), donde el primer elemento en entrar es el primero en salir.

```go
package main

import "fmt"

// Definir la estructura de la cola
type Queue struct {
    items []int
}

// Encolar (enqueue) un elemento en la cola
func (q *Queue) Enqueue(item int) {
    q.items = append(q.items, item)
}

// Desencolar (dequeue) un elemento de la cola
func (q *Queue) Dequeue() int {
    if len(q.items) == 0 {
        fmt.Println("Cola vacía")
        return -1
    }
    // Obtener el primer elemento
    item := q.items[0]
    // Remover el primer elemento
    q.items = q.items[1:]
    return item
}

func main() {
    queue := Queue{}

    // Encolar elementos
    queue.Enqueue(1)
    queue.Enqueue(2)
    queue.Enqueue(3)

    // Desencolar elementos
    fmt.Println(queue.Dequeue()) // 1
    fmt.Println(queue.Dequeue()) // 2
    fmt.Println(queue.Dequeue()) // 3
    fmt.Println(queue.Dequeue()) // Cola vacía
}
```

En estos ejemplos:

- **Pila (Stack)**:
  - La estructura `Stack` tiene un slice `items` para almacenar los elementos.
  - La función `Push` agrega un elemento al final del slice.
  - La función `Pop` elimina y devuelve el último elemento del slice, asegurándose de que la pila no esté vacía.

- **Cola (Queue)**:
  - La estructura `Queue` también tiene un slice `items` para almacenar los elementos.
  - La función `Enqueue` agrega un elemento al final del slice.
  - La función `Dequeue` elimina y devuelve el primer elemento del slice, asegurándose de que la cola no esté vacía.
