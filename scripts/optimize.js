import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = path.join(__dirname, '../public/pre');
const outputDir = path.join(__dirname, '../public/pre-optimized');

async function optimizeImages() {
  try {
    // Create output directory if it doesn't exist
    await fs.mkdir(outputDir, { recursive: true });

    // Read all files from input directory
    const files = await fs.readdir(inputDir);
    
    // Filter for image files
    const imageFiles = files.filter(file => 
      file.match(/\.(jpg|jpeg|png|webp|avif)$/i)
    );

    console.log(`Found ${imageFiles.length} images to optimize...`);

    for (const file of imageFiles) {
      const inputPath = path.join(inputDir, file);
      const outputPath = path.join(outputDir, file);
      
      console.log(`Optimizing ${file}...`);
      
      // Optimize image: resize to max width 1200px, 80% quality
      await sharp(inputPath)
        .resize({ width: 1200, withoutEnlargement: true })
        .jpeg({ quality: 80, progressive: true })
        .toFile(outputPath);
        
      const inputStats = await fs.stat(inputPath);
      const outputStats = await fs.stat(outputPath);
      
      console.log(`  Size reduced from ${(inputStats.size / 1024 / 1024).toFixed(2)}MB to ${(outputStats.size / 1024 / 1024).toFixed(2)}MB`);
    }

    console.log('Optimization complete!');
  } catch (error) {
    console.error('Error optimizing images:', error);
  }
}

optimizeImages();
