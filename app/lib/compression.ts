import { gzip, gunzip } from 'zlib';
import { promisify } from 'util';

const gzipAsync = promisify(gzip);
const gunzipAsync = promisify(gunzip);

/**
 * Compression utilities for maximizing 512MB MongoDB storage
 * Provides 60-80% space savings for JSON data
 */

export interface CompressedData {
  data: string; // Base64 encoded compressed data
  compressed: boolean;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
}

/**
 * Compress data for storage
 */
export async function compressData(data: any): Promise<CompressedData> {
  try {
    const jsonString = JSON.stringify(data);
    const originalSize = Buffer.byteLength(jsonString, 'utf8');
    
    // Only compress if data is larger than 1KB
    if (originalSize < 1024) {
      return {
        data: jsonString,
        compressed: false,
        originalSize,
        compressedSize: originalSize,
        compressionRatio: 1
      };
    }

    const compressed = await gzipAsync(jsonString);
    const compressedSize = compressed.length;
    const compressionRatio = originalSize / compressedSize;

    return {
      data: compressed.toString('base64'),
      compressed: true,
      originalSize,
      compressedSize,
      compressionRatio
    };
  } catch (error) {
    console.error('Compression error:', error);
    // Fallback to uncompressed data
    const jsonString = JSON.stringify(data);
    return {
      data: jsonString,
      compressed: false,
      originalSize: Buffer.byteLength(jsonString, 'utf8'),
      compressedSize: Buffer.byteLength(jsonString, 'utf8'),
      compressionRatio: 1
    };
  }
}

/**
 * Decompress data for retrieval
 */
export async function decompressData(compressedData: CompressedData): Promise<any> {
  try {
    if (!compressedData.compressed) {
      return JSON.parse(compressedData.data);
    }

    const buffer = Buffer.from(compressedData.data, 'base64');
    const decompressed = await gunzipAsync(buffer);
    return JSON.parse(decompressed.toString('utf8'));
  } catch (error) {
    console.error('Decompression error:', error);
    // Fallback: try to parse as regular JSON
    try {
      return JSON.parse(compressedData.data);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return null;
    }
  }
}

/**
 * Compress large text content (blog posts, descriptions)
 */
export async function compressText(text: string): Promise<CompressedData> {
  return compressData({ content: text });
}

/**
 * Decompress text content
 */
export async function decompressText(compressedData: CompressedData): Promise<string> {
  const result = await decompressData(compressedData);
  return result?.content || '';
}

/**
 * Utility to check if compression is beneficial
 */
export function shouldCompress(data: any, threshold: number = 1024): boolean {
  const jsonString = JSON.stringify(data);
  return Buffer.byteLength(jsonString, 'utf8') > threshold;
}

/**
 * Get compression statistics
 */
export function getCompressionStats(compressedData: CompressedData): {
  spaceSaved: number;
  spaceSavedPercent: number;
  efficiency: string;
} {
  const spaceSaved = compressedData.originalSize - compressedData.compressedSize;
  const spaceSavedPercent = (spaceSaved / compressedData.originalSize) * 100;
  
  let efficiency = 'Poor';
  if (spaceSavedPercent > 70) efficiency = 'Excellent';
  else if (spaceSavedPercent > 50) efficiency = 'Good';
  else if (spaceSavedPercent > 30) efficiency = 'Fair';

  return {
    spaceSaved,
    spaceSavedPercent: Math.round(spaceSavedPercent * 100) / 100,
    efficiency
  };
}

/**
 * Batch compression for multiple items
 */
export async function compressBatch(items: any[]): Promise<CompressedData[]> {
  const compressionPromises = items.map(item => compressData(item));
  return Promise.all(compressionPromises);
}

/**
 * Batch decompression for multiple items
 */
export async function decompressBatch(compressedItems: CompressedData[]): Promise<any[]> {
  const decompressionPromises = compressedItems.map(item => decompressData(item));
  return Promise.all(decompressionPromises);
}
