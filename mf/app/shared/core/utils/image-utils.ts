export class ImageUtils {
  /**
   * Convierte un archivo de imagen a base64 (asíncrono)
   */
  static async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Error en la conversión'));
        }
      };

      reader.onerror = (error) => reject(new Error(error instanceof Error ? error.message : String(error)));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Extrae solo el string base64 (sin metadata)
   */
  static async getPureBase64(file: File): Promise<string> {
    const fullBase64 = await this.fileToBase64(file);
    return fullBase64.split(',')[1];
  }
}
