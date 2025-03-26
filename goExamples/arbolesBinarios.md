# Árbol Binario

## ¿Qué es un árbol binario?

Un árbol binario es una estructura de datos en la que cada nodo tiene como máximo dos hijos, comúnmente llamados "hijo izquierdo" y "hijo derecho". Esta estructura es muy útil en informática debido a su eficiencia en operaciones como búsqueda, inserción y eliminación de elementos. A continuación se explican algunos conceptos clave sobre los árboles binarios:

## Componentes de un Árbol Binario

1. **Nodo**: Cada elemento del árbol se llama nodo. Un nodo contiene un valor y referencias a sus hijos.
2. **Raíz**: Es el nodo superior del árbol. Desde la raíz, se pueden alcanzar todos los demás nodos.
3. **Hijo**: Un nodo directamente conectado desde otro nodo se llama hijo.
4. **Padre**: Un nodo que tiene uno o dos hijos se llama padre.
5. **Hojas**: Los nodos que no tienen hijos se llaman hojas.
6. **Altura**: La altura de un árbol binario es la longitud del camino más largo desde la raíz hasta una hoja.
7. **Profundidad**: La profundidad de un nodo es la longitud del camino desde la raíz hasta ese nodo.

## Tipos de Árboles Binarios

1. **Árbol Binario Completo**: Un árbol en el que todos los niveles, excepto posiblemente el último, están completamente llenos, y todos los nodos están lo más a la izquierda posible.
2. **Árbol Binario Perfecto**: Un árbol en el que todos los niveles están completamente llenos.
3. **Árbol Binario de Búsqueda (BST)**: Un árbol binario en el que para cada nodo, todos los valores en el subárbol izquierdo son menores que el valor del nodo y todos los valores en el subárbol derecho son mayores.

## Operaciones Comunes

1. **Inserción**: Agregar un nuevo nodo al árbol en la posición correcta de acuerdo con las reglas del árbol binario.
2. **Eliminación**: Remover un nodo del árbol y reajustar los otros nodos según sea necesario para mantener la estructura.
3. **Búsqueda**: Encontrar un nodo con un valor específico, generalmente comenzando desde la raíz y recorriendo el árbol según sea necesario.
4. **Recorridos**:
   - **Inorden**: Visitar el subárbol izquierdo, luego el nodo, y luego el subárbol derecho.
   - **Preorden**: Visitar el nodo, luego el subárbol izquierdo y finalmente el subárbol derecho.
   - **Postorden**: Visitar el subárbol izquierdo, luego el subárbol derecho y finalmente el nodo.

## Ejemplo Visual

```plaintext
        8
       / \
      3   10
     / \    \
    1   6    14
       / \   /
      4   7 13
```

En este ejemplo:

- El nodo `8` es la raíz.
- Los nodos `3` y `10` son hijos de `8`.
- Los nodos `1`, `6`, `14` y `13` son hojas.

Los árboles binarios son fundamentales en muchas aplicaciones de informática, incluyendo la gestión de bases de datos, sistemas de archivos y algoritmos de inteligencia artificial.

---

## Creacion de un árbol binario

Puedes crear un árbol binario y realizar búsquedas en él utilizando la recursividad en Go. Vamos con el paso a paso.

### Paso 1: Definir la estructura del nodo

Primero, define la estructura del nodo del árbol binario. Cada nodo debe tener un valor y dos punteros a sus hijos, izquierdo y derecho.

### Paso 2: Crear una función para insertar nodos

Crea una función recursiva para insertar nuevos nodos en el árbol. Esta función debe recorrer el árbol hasta encontrar la posición correcta para el nuevo nodo.

### Paso 3: Crear una función para buscar nodos

Crea una función recursiva para buscar un valor en el árbol. Esta función debe recorrer el árbol comparando el valor buscado con los valores de los nodos y seguir a la izquierda o a la derecha según corresponda.

### Ejemplo de implementación en Go

1. **Definir la estructura del nodo**:

   ```go
   package main

   type TreeNode struct {
       Value int
       Left  *TreeNode
       Right *TreeNode
   }
   ```

2. **Función para insertar nodos**:

   ```go
   func Insert(node *TreeNode, value int) *TreeNode {
       if node == nil {
           return &TreeNode{Value: value}
       }
       if value < node.Value {
           node.Left = Insert(node.Left, value)
       } else {
           node.Right = Insert(node.Right, value)
       }
       return node
   }
   ```

3. **Función para buscar un nodo**:

   ```go
   func Search(node *TreeNode, value int) bool {
       if node == nil {
           return false
       }
       if value == node.Value {
           return true
       } else if value < node.Value {
           return Search(node.Left, value)
       } else {
           return Search(node.Right, value)
       }
   }
   ```

### Ejemplo de uso

```go
func main() {
    var root *TreeNode

    // Insertar nodos en el árbol
    values := []int{8, 3, 10, 1, 6, 14, 4, 7, 13}
    for _, value := range values {
        root = Insert(root, value)
    }

    // Buscar valores en el árbol
    fmt.Println(Search(root, 6))  // true
    fmt.Println(Search(root, 15)) // false
}
```

### Explicación detallada

1. **Definir la estructura del nodo**:
   - La estructura `TreeNode` tiene un campo `Value` para almacenar el valor del nodo y dos punteros (`Left` y `Right`) para los hijos.

2. **Insertar nodos**:
   - La función `Insert` acepta un nodo y un valor.
   - Si el nodo es `nil`, crea un nuevo nodo con el valor.
   - Si el valor es menor que el valor del nodo actual, llama recursivamente a `Insert` para el hijo izquierdo.
   - Si el valor es mayor o igual, llama recursivamente a `Insert` para el hijo derecho.
   - Devuelve el nodo actualizado.

3. **Buscar nodos**:
   - La función `Search` acepta un nodo y un valor.
   - Si el nodo es `nil`, el valor no se encuentra en el árbol y devuelve `false`.
   - Si el valor es igual al valor del nodo, devuelve `true`.
   - Si el valor es menor, llama recursivamente a `Search` para el hijo izquierdo.
   - Si el valor es mayor, llama recursivamente a `Search` para el hijo derecho.
