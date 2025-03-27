# Ejemplo de laberinto con pseudocódigo

Resolver un laberinto utilizando recursividad es una técnica elegante y efectiva. Aquí te explicaré paso a paso cómo puedes hacerlo:

## Concepto Básico

La idea principal es intentar moverse en diferentes direcciones (arriba, abajo, izquierda, derecha) desde la posición actual y usar recursividad para explorar el laberinto. Si llegamos a un punto sin salida, retrocedemos (backtracking) y probamos una ruta diferente.

## Paso a Paso

1. **Definir el laberinto y los movimientos posibles**:
   - Representa el laberinto como una matriz (array bidimensional).
   - Define los movimientos posibles (arriba, abajo, izquierda, derecha).

2. **Establecer las condiciones base**:
   - Si se llega a la salida, la solución ha sido encontrada.
   - Si se llega a una pared o a una celda ya visitada, retrocede.

3. **Explorar recursivamente**:
   - Marca la celda actual como visitada.
   - Intenta moverse en cada una de las direcciones.
   - Si alguno de los movimientos lleva a la salida, retorna `true`.
   - Si ninguno de los movimientos funciona, desmarca la celda y retorna `false` (backtracking).

## Ejemplo Simplificado (Pseudocódigo)

```plaintext
función resolverLaberinto(laberinto, x, y, solución)
    si (x, y) es la salida
        marcar (x, y) en solución
        retornar verdadero

    si (x, y) es un movimiento válido
        marcar (x, y) en solución

        si mover hacia arriba desde (x, y) y resolverLaberinto(x-1, y, solución)
            retornar verdadero
        si mover hacia derecha desde (x, y) y resolverLaberinto(x, y+1, solución)
            retornar verdadero
        si mover hacia abajo desde (x, y) y resolverLaberinto(x+1, y, solución)
            retornar verdadero
        si mover hacia izquierda desde (x, y) y resolverLaberinto(x, y-1, solución)
            retornar verdadero

        desmarcar (x, y) en solución
        retornar falso

función principal()
    laberinto = [...]
    solución = matriz del mismo tamaño que laberinto
    si resolverLaberinto(laberinto, posición_inicial_x, posición_inicial_y, solución)
        imprimir solución
    sino
        imprimir "No hay solución"
```

## Explicación

1. **Definir el laberinto**: Representa el laberinto como una matriz 2D donde 1s representan paredes y 0s representan caminos.

2. **Movimientos válidos**: Un movimiento es válido si está dentro de los límites del laberinto y lleva a una celda que no es una pared y no ha sido visitada antes.

3. **Recursividad**: La función `resolverLaberinto` intenta moverse en cada dirección (arriba, derecha, abajo, izquierda). Si un movimiento lleva a la salida, la función retorna verdadero.

4. **Backtracking**: Si un movimiento no lleva a la solución, desmarca la celda actual y retorna falso para intentar una nueva ruta.

Este es un enfoque general para resolver un laberinto de manera recursiva utilizando backtracking.
