import fs from 'fs';
import path from 'path';
import Jimp from 'jimp';

const dir = 'e:/QB/wedding/thakshila bhanuka/public/pre-optimized';
const tinyDir = 'e:/QB/wedding/thakshila bhanuka/public/pre-tiny';

if (!fs.existsSync(tinyDir)) {
  fs.mkdirSync(tinyDir);
}

const files = fs.readdirSync(dir).filter(f => f.endsWith('.jpeg'));

async function generateTiny() {
  for (const file of files) {
    const filePath = path.join(dir, file);
    const tinyFilePath = path.join(tinyDir, file);
    
    console.log(`Processing ${file}...`);
    try {
      const image = await Jimp.read(filePath);
      
      // Create tiny version
      image.resize(20, Jimp.AUTO);
      image.quality(20);
      image.blur(2);
      await image.writeAsync(tinyFilePath);
      console.log(`Created tiny version for ${file}`);
      
    } catch (err) {
      console.error(`Error processing ${file}:`, err);
    }
  }
}

generateTiny();
