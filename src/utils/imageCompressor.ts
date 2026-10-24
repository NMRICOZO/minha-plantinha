/**
 * Client-side image compression and resizing utility for Minha Plantinha
 * Uses standard HTML5 Canvas API without external dependencies.
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 to 1.0
  mimeType?: 'image/jpeg' | 'image/webp';
}

const DEFAULT_OPTIONS: CompressionOptions = {
  maxWidth: 1280,
  maxHeight: 1280,
  quality: 0.82,
  mimeType: 'image/jpeg'
};

/**
 * Compresses an image File or Blob to a optimized Data URL (Base64)
 */
export async function compressImage(
  fileOrBlob: File | Blob, 
  customOptions?: CompressionOptions
): Promise<{ dataUrl: string; sizeBytes: number; originalSizeBytes: number }> {
  const options = { ...DEFAULT_OPTIONS, ...customOptions };
  const originalSizeBytes = fileOrBlob.size;

  return new Promise((resolve, reject) => {
    // Validate MIME type
    if (!fileOrBlob.type.startsWith('image/')) {
      return reject(new Error('O arquivo selecionado não é uma imagem válida.'));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Erro ao ler arquivo de imagem.'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Falha ao decodificar imagem para compressão.'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        const maxW = options.maxWidth || 1280;
        const maxH = options.maxHeight || 1280;

        // Calculate aspect-ratio-preserving dimensions
        if (width > maxW || height > maxH) {
          if (width / height > maxW / maxH) {
            height = Math.round((height * maxW) / width);
            width = maxW;
          } else {
            width = Math.round((width * maxH) / height);
            height = maxH;
          }
        }

        // Render to offscreen canvas
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);

        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) {
          return reject(new Error('Não foi possível obter contexto 2D para compressão.'));
        }

        // Fill background white to avoid black backgrounds on transparent PNGs converted to JPEG
        ctx.fillStyle = '#142a20'; // botanical tone fallback
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        try {
          const dataUrl = canvas.toDataURL(options.mimeType || 'image/jpeg', options.quality || 0.82);
          // Rough Base64 size estimation in bytes
          const sizeBytes = Math.round((dataUrl.length * 3) / 4);
          resolve({
            dataUrl,
            sizeBytes,
            originalSizeBytes
          });
        } catch (err) {
          reject(new Error('Erro ao exportar imagem comprimida do canvas.'));
        }
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(fileOrBlob);
  });
}

/**
 * Human-readable byte size formatter
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
