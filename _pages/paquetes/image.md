# Paquete `image` en Go: Guía Completa para Manipulación de Imágenes

El paquete `image` en Go proporciona herramientas fundamentales para crear, manipular y procesar imágenes rasterizadas. Esta guía ampliada incluye ejemplos prácticos avanzados, comparativas de formatos y técnicas de optimización.

---

## 1. Tipos de Imágenes y Casos de Uso

### Tabla Comparativa de Formatos
| Tipo de Imagen       | Profundidad | Transparencia | Uso Típico                 | Almacenamiento por Pixel |
|----------------------|-------------|---------------|----------------------------|--------------------------|
| `image.RGBA`         | 8 bits/canal | Sí (alpha)    | Gráficos generales         | 4 bytes (R, G, B, A)     |
| `image.NRGBA`        | 8 bits/canal | Premultiplicado | Web y formatos compatibles | 4 bytes                  |
| `image.RGBA64`       | 16 bits/canal| Sí            | Imágenes HDR               | 8 bytes                  |
| `image.Gray`         | 8 bits       | No            | Escala de grises           | 1 byte                   |
| `image.Paletted`     | 8 bits índice| Limitada      | GIFs y gráficos retro      | 1 byte + paleta          |

---

## 2. Creación de Imágenes Avanzadas

### 2.1 Generación de Gradiente Radial
```go
package main

import (
    "image"
    "image/color"
    "image/png"
    "math"
    "os"
)

func createGradient(width, height int) *image.RGBA {
    img := image.NewRGBA(image.Rect(0, 0, width, height))
    centerX := float64(width)/2
    centerY := float64(height)/2
    maxDist := math.Sqrt(centerX*centerX + centerY*centerY)

    for y := 0; y < height; y++ {
        for x := 0; x < width; x++ {
            dx := float64(x) - centerX
            dy := float64(y) - centerY
            dist := math.Sqrt(dx*dx + dy*dy)/maxDist
            
            c := color.RGBA{
                R: uint8(255 * (1 - dist)),
                G: uint8(255 * dist),
                B: uint8(128),
                A: 255,
            }
            img.Set(x, y, c)
        }
    }
    return img
}

func main() {
    gradient := createGradient(400, 400)
    f, _ := os.Create("gradient.png")
    png.Encode(f, gradient)
    f.Close()
}
```

### 2.2 Conversión a Escala de Grises
```go
func convertToGray(src image.Image) *image.Gray {
    bounds := src.Bounds()
    gray := image.NewGray(bounds)
    
    for y := bounds.Min.Y; y < bounds.Max.Y; y++ {
        for x := bounds.Min.X; x < bounds.Max.X; x++ {
            original := src.At(x, y)
            gray.Set(x, y, color.GrayModel.Convert(original))
        }
    }
    return gray
}
```

---

## 3. Manipulación de Imágenes

### 3.1 Aplicación de Filtro de Desenfoque
```go
func applyBlur(src *image.RGBA, radius int) *image.RGBA {
    bounds := src.Bounds()
    dst := image.NewRGBA(bounds)
    kernel := createGaussianKernel(radius)

    for y := bounds.Min.Y; y < bounds.Max.Y; y++ {
        for x := bounds.Min.X; x < bounds.Max.X; x++ {
            var r, g, b, a float64
            weightSum := 0.0
            
            for ky := -radius; ky <= radius; ky++ {
                for kx := -radius; kx <= radius; kx++ {
                    xx := clamp(x+kx, bounds.Min.X, bounds.Max.X-1)
                    yy := clamp(y+ky, bounds.Min.Y, bounds.Max.Y-1)
                    weight := kernel[ky+radius][kx+radius]
                    
                    c := src.At(xx, yy).(color.RGBA)
                    r += float64(c.R) * weight
                    g += float64(c.G) * weight
                    b += float64(c.B) * weight
                    a += float64(c.A) * weight
                    weightSum += weight
                }
            }
            
            dst.Set(x, y, color.RGBA{
                R: uint8(r / weightSum),
                G: uint8(g / weightSum),
                B: uint8(b / weightSum),
                A: uint8(a / weightSum),
            })
        }
    }
    return dst
}
```

### 3.2 Recorte de Imágenes con `Inset`
```go
func cropImage(src image.Image, margin int) image.Image {
    bounds := src.Bounds()
    cropped := bounds.Inset(margin)
    subImg := image.NewRGBA(cropped)
    
    for y := cropped.Min.Y; y < cropped.Max.Y; y++ {
        for x := cropped.Min.X; x < cropped.Max.X; x++ {
            subImg.Set(x - cropped.Min.X, y - cropped.Min.Y, src.At(x, y))
        }
    }
    return subImg
}
```

---

## 4. Animaciones y Formatos Especiales

### 4.1 Creación de GIF Animado
```go
func createAnimatedGif() {
    var frames []*image.Paletted
    var delays []int
    palette := color.Palette{color.White, color.Black}

    // Generar 10 cuadros de animación
    for i := 0; i < 10; i++ {
        img := image.NewPaletted(image.Rect(0, 0, 100, 100), palette)
        img.SetColorIndex(50+i*2, 50, 1)
        frames = append(frames, img)
        delays = append(delays, 10)
    }

    f, _ := os.Create("animation.gif")
    gif.EncodeAll(f, &gif.GIF{
        Image: frames,
        Delay: delays,
    })
    f.Close()
}
```

### 4.2 Codificación en JPEG con Calidad Ajustable
```go
import "image/jpeg"

func saveJpeg(img image.Image, path string, quality int) error {
    f, err := os.Create(path)
    if err != nil {
        return err
    }
    defer f.Close()

    return jpeg.Encode(f, img, &jpeg.Options{Quality: quality})
}
```

---

## 5. Mejores Prácticas y Optimización

### 5.1 Acceso Eficiente a Píxeles
```go
// Método óptimo para procesamiento por bloques
func processImageFast(img *image.RGBA) {
    bounds := img.Bounds()
    pix := img.Pix  // Acceso directo al slice de píxeles
    width := bounds.Dx() * 4

    for y := 0; y < bounds.Dy(); y++ {
        row := pix[y*img.Stride : y*img.Stride + width]
        for x := 0; x < len(row); x += 4 {
            // Modificar RGBA directamente
            row[x] = 255 - row[x]     // R
            row[x+1] = 255 - row[x+1] // G
            row[x+2] = 255 - row[x+2] // B
            // Alpha (x+3) permanece igual
        }
    }
}
```

### 5.2 Manejo de Errores Robusto
```go
func loadImage(path string) (image.Image, error) {
    f, err := os.Open(path)
    if err != nil {
        return nil, fmt.Errorf("error abriendo archivo: %w", err)
    }
    defer f.Close()

    img, _, err := image.Decode(f)
    if err != nil {
        return nil, fmt.Errorf("error decodificando imagen: %w", err)
    }
    return img, nil
}
```

---

## 6. Integración con Paquetes Externos

### 6.1 Uso de WebP con `github.com/chai2010/webp`
```go
import "github.com/chai2010/webp"

func saveWebP(img image.Image, path string) error {
    f, err := os.Create(path)
    if err != nil {
        return err
    }
    defer f.Close()
    
    return webp.Encode(f, img, &webp.Options{Lossless: true})
}
```

### 6.2 Procesamiento con Paralelismo
```go
func parallelProcess(img *image.RGBA) {
    bounds := img.Bounds()
    numWorkers := runtime.NumCPU()
    var wg sync.WaitGroup
    wg.Add(numWorkers)

    sectionHeight := bounds.Dy() / numWorkers
    for i := 0; i < numWorkers; i++ {
        go func(yStart, yEnd int) {
            defer wg.Done()
            for y := yStart; y < yEnd; y++ {
                for x := bounds.Min.X; x < bounds.Max.X; x++ {
                    // Procesamiento paralelo
                }
            }
        }(i*sectionHeight, (i+1)*sectionHeight)
    }
    wg.Wait()
}
```

---

## 7. Ejemplo Completo: Editor de Imágenes Básico

```go
package main

import (
    "image"
    "image/color"
    "image/jpeg"
    "math"
    "os"
)

type Filter func(*image.RGBA)

func main() {
    // Cargar imagen
    img, _ := loadImage("input.jpg")
    rgba := image.NewRGBA(img.Bounds())
    
    // Aplicar filtros
    filters := []Filter{
        applyContrast(1.5),
        applyVignette(0.8),
        applySepia(),
    }
    
    for _, filter := range filters {
        filter(rgba)
    }
    
    // Guardar resultado
    saveJpeg(rgba, "output.jpg", 90)
}

func applySepia() Filter {
    return func(img *image.RGBA) {
        bounds := img.Bounds()
        for y := bounds.Min.Y; y < bounds.Max.Y; y++ {
            for x := bounds.Min.X; x < bounds.Max.X; x++ {
                c := img.RGBAAt(x, y)
                r := float64(c.R)*0.393 + float64(c.G)*0.769 + float64(c.B)*0.189
                g := float64(c.R)*0.349 + float64(c.G)*0.686 + float64(c.B)*0.168
                b := float64(c.R)*0.272 + float64(c.G)*0.534 + float64(c.B)*0.131
                img.SetRGBA(x, y, color.RGBA{
                    R: uint8(math.Min(r, 255)),
                    G: uint8(math.Min(g, 255)),
                    B: uint8(math.Min(b, 255)),
                    A: c.A,
                })
            }
        }
    }
}
```

---

Esta guía ampliada proporciona técnicas avanzadas para el manejo de imágenes en Go, incluyendo procesamiento de píxeles, optimización de rendimiento y formatos especiales. Los ejemplos muestran aplicaciones prácticas desde filtros básicos hasta animaciones, siguiendo mejores prácticas de programación y eficiencia.