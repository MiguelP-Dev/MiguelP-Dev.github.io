# Paquete archive en Go

El paquete `archive` en Go proporciona funciones para trabajar con archivos comprimidos. Este documento explora en detalle los subpaquetes `archive/tar` y `archive/zip`, incluyendo ejemplos prácticos de uso.

## Subpaquete archive/tar

### Conceptos Básicos

El formato TAR (Tape Archive) es ampliamente utilizado en sistemas Unix para almacenar múltiples archivos en un solo archivo.

### Funciones Principales

1. **`NewReader`**:

   ```go
   reader := tar.NewReader(file)
   ```

   Ejemplo completo de lectura:

   ```go
   func readTarFile(filename string) error {
       file, err := os.Open(filename)
       if err != nil {
           return err
       }
       defer file.Close()

       tr := tar.NewReader(file)
       for {
           header, err := tr.Next()
           if err == io.EOF {
               break
           }
           if err != nil {
               return err
           }
           
           fmt.Printf("Contenido del archivo: %s\n", header.Name)
           if _, err := io.Copy(os.Stdout, tr); err != nil {
               return err
           }
       }
       return nil
   }
   ```

2. **`NewWriter`** con ejemplo completo:

   ```go
   func createTarArchive(files []string, output string) error {
       outFile, err := os.Create(output)
       if err != nil {
           return err
       }
       defer outFile.Close()

       tw := tar.NewWriter(outFile)
       defer tw.Close()

       for _, file := range files {
           err := addToTar(tw, file)
           if err != nil {
               return err
           }
       }
       return nil
   }

   func addToTar(tw *tar.Writer, filename string) error {
       file, err := os.Open(filename)
       if err != nil {
           return err
       }
       defer file.Close()

       info, err := file.Stat()
       if err != nil {
           return err
       }

       header, err := tar.FileInfoHeader(info, info.Name())
       if err != nil {
           return err
       }

       if err := tw.WriteHeader(header); err != nil {
           return err
       }

       _, err = io.Copy(tw, file)
       return err
   }
   ```

## Subpaquete archive/zip

### Conceptos Básicos-

El formato ZIP es uno de los formatos de compresión más populares, especialmente en entornos Windows.

### Ejemplos Detallados

1. **Crear un archivo ZIP**:

   ```go
   func createZip(files []string, zipName string) error {
       zipfile, err := os.Create(zipName)
       if err != nil {
           return err
       }
       defer zipfile.Close()

       archive := zip.NewWriter(zipfile)
       defer archive.Close()

       for _, file := range files {
           if err := addFileToZip(archive, file); err != nil {
               return err
           }
       }
       return nil
   }

   func addFileToZip(archive *zip.Writer, filename string) error {
       file, err := os.Open(filename)
       if err != nil {
           return err
       }
       defer file.Close()

       info, err := file.Stat()
       if err != nil {
           return err
       }

       header, err := zip.FileInfoHeader(info)
       if err != nil {
           return err
       }
       header.Method = zip.Deflate

       writer, err := archive.CreateHeader(header)
       if err != nil {
           return err
       }

       _, err = io.Copy(writer, file)
       return err
   }
   ```

2. **Leer un archivo ZIP**:

   ```go
   func readZip(filename string) error {
       reader, err := zip.OpenReader(filename)
       if err != nil {
           return err
       }
       defer reader.Close()

       for _, file := range reader.File {
           fmt.Printf("Archivo: %s\n", file.Name)
           
           rc, err := file.Open()
           if err != nil {
               return err
           }
           defer rc.Close()

           content, err := io.ReadAll(rc)
           if err != nil {
               return err
           }
           fmt.Printf("Contenido: %s\n", content)
       }
       return nil
   }
   ```

### Características Avanzadas

1. **Compresión con Contraseña (ZIP)**:

   ```go
   func createPasswordProtectedZip(files []string, zipName, password string) error {
       zipfile, err := os.Create(zipName)
       if err != nil {
           return err
       }
       defer zipfile.Close()

       archive := zip.NewWriter(zipfile)
       defer archive.Close()

       for _, file := range files {
           header := &zip.FileHeader{
               Name:   file,
               Method: zip.Deflate,
           }
           
           // Establecer el bit de encriptación
           header.SetPassword(password)
           
           writer, err := archive.CreateHeader(header)
           if err != nil {
               return err
           }

           content, err := os.ReadFile(file)
           if err != nil {
               return err
           }

           _, err = writer.Write(content)
           if err != nil {
               return err
           }
       }
       return nil
   }
   ```

### Mejores Prácticas

1. **Manejo de Errores**
2. **Cierre de Recursos**
3. **Compresión Eficiente**
4. **Consideraciones de Memoria**

### Tips y Trucos

- Utiliza `io.Copy` para archivos grandes
- Considera usar goroutines para procesamiento paralelo
- Implementa progress bars para archivos grandes
- Verifica la integridad de los archivos después de la compresión

Este documento proporciona una visión general completa del paquete `archive` en Go. Para casos específicos o necesidades particulares, consulta la documentación oficial o pregunta para más detalles.
