const sharp = require('sharp');
const fs = require('fs');

async function createIcon() {
  const logoBuffer = fs.readFileSync('public/assets/pwa/logo.png');
  
  // Resize logo slightly smaller than the full icon to give it padding
  const paddingLogo = await sharp(logoBuffer)
    .resize(360, 360, { fit: 'inside' })
    .toBuffer();

  // 512x512 Icon
  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 0, g: 139, b: 69, alpha: 1 } // #008b45
    }
  })
  .composite([{ input: paddingLogo, gravity: 'center' }])
  .png()
  .toFile('public/assets/pwa/icon-512.png');

  // 192x192 Icon
  const paddingLogoSmall = await sharp(logoBuffer)
    .resize(130, 130, { fit: 'inside' })
    .toBuffer();

  await sharp({
    create: {
      width: 192,
      height: 192,
      channels: 4,
      background: { r: 0, g: 139, b: 69, alpha: 1 }
    }
  })
  .composite([{ input: paddingLogoSmall, gravity: 'center' }])
  .png()
  .toFile('public/assets/pwa/icon-192.png');

  // 180x180 Apple Touch Icon
  const paddingLogoApple = await sharp(logoBuffer)
    .resize(120, 120, { fit: 'inside' })
    .toBuffer();

  await sharp({
    create: {
      width: 180,
      height: 180,
      channels: 4,
      background: { r: 0, g: 139, b: 69, alpha: 1 }
    }
  })
  .composite([{ input: paddingLogoApple, gravity: 'center' }])
  .png()
  .toFile('public/assets/pwa/apple-touch-icon.png');

  console.log('Icons generated successfully with green background!');
}

createIcon();
