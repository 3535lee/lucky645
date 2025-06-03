const fs = require('fs');
const { createCanvas } = require('canvas');

function drawIcon(canvas, size) {
    const ctx = canvas.getContext('2d');
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size * 0.35;
    
    // Background
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(0, 0, size, size);
    
    // Circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = '#fbbf24';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = size * 0.02;
    ctx.stroke();
    
    // Text
    ctx.fillStyle = '#1f2937';
    ctx.font = `bold ${size * 0.15}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('L645', centerX, centerY);
    
    // Small decorative circles
    const smallRadius = size * 0.03;
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(centerX - radius * 0.7, centerY - radius * 0.7, smallRadius, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(centerX + radius * 0.7, centerY - radius * 0.7, smallRadius, 0, 2 * Math.PI);
    ctx.fill();
}

function drawDesktopScreenshot(canvas) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Background
    ctx.fillStyle = '#f9fafb';
    ctx.fillRect(0, 0, width, height);
    
    // Header
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(0, 0, width, height * 0.12);
    
    // Lucky645 title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Lucky645', 50, height * 0.08);
    
    // Main content
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Lucky645', width / 2, height * 0.3);
    
    ctx.font = '24px Arial';
    ctx.fillText('로또 6/45 당첨번호 조회 및 추천 서비스', width / 2, height * 0.4);
}

function drawMobileScreenshot(canvas) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Background
    ctx.fillStyle = '#f9fafb';
    ctx.fillRect(0, 0, width, height);
    
    // Header
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(0, 0, width, height * 0.1);
    
    // Lucky645 title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Lucky645', 20, height * 0.06);
    
    // Main content
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Lucky645', width / 2, height * 0.2);
    
    ctx.font = '16px Arial';
    ctx.fillText('로또 6/45 서비스', width / 2, height * 0.25);
}

// Create canvases and generate images
try {
    // Icon 192x192
    const icon192 = createCanvas(192, 192);
    drawIcon(icon192, 192);
    fs.writeFileSync('./public/icon-192x192.png', icon192.toBuffer('image/png'));
    
    // Icon 512x512
    const icon512 = createCanvas(512, 512);
    drawIcon(icon512, 512);
    fs.writeFileSync('./public/icon-512x512.png', icon512.toBuffer('image/png'));
    
    // Apple touch icon 180x180
    const apple180 = createCanvas(180, 180);
    drawIcon(apple180, 180);
    fs.writeFileSync('./public/apple-touch-icon.png', apple180.toBuffer('image/png'));
    
    // Desktop screenshot
    const desktop = createCanvas(1920, 1080);
    drawDesktopScreenshot(desktop);
    fs.writeFileSync('./public/screenshot-desktop.png', desktop.toBuffer('image/png'));
    
    // Mobile screenshot
    const mobile = createCanvas(540, 720);
    drawMobileScreenshot(mobile);
    fs.writeFileSync('./public/screenshot-mobile.png', mobile.toBuffer('image/png'));
    
    console.log('All images generated successfully!');
} catch (error) {
    console.error('Error generating images:', error);
    console.log('Canvas package may not be installed. Run: npm install canvas');
}