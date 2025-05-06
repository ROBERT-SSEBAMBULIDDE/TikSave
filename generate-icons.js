import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconPath = path.join(__dirname, 'client', 'public', 'icons', 'app-icon.svg');
const outputDir = path.join(__dirname, 'client', 'public', 'icons');

async function generateIcons() {
  try {
    console.log('Starting icon generation...');
    console.log(`SVG path: ${iconPath}`);
    console.log(`Output directory: ${outputDir}`);
    
    // Check if SVG file exists
    if (!fs.existsSync(iconPath)) {
      console.error(`SVG file not found at ${iconPath}`);
      return;
    }
    
    // Ensure the output directory exists
    if (!fs.existsSync(outputDir)) {
      console.log(`Creating output directory: ${outputDir}`);
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Read the SVG file
    console.log('Reading SVG file...');
    const svgBuffer = fs.readFileSync(iconPath);
    console.log(`SVG file size: ${svgBuffer.length} bytes`);

    // Generate each icon size
    for (const size of sizes) {
      const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
      console.log(`Generating ${outputPath}...`);
      
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      
      console.log(`Generated icon-${size}x${size}.png`);
    }

    console.log('All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
    console.error(error.stack);
  }
}

generateIcons();
