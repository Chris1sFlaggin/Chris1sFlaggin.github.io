const fs = require('fs');
const path = require('path');

// Make sure the directory exists
const imgDir = path.join(__dirname, 'static', 'img');
if (!fs.existsSync(imgDir)) {
    fs.mkdirSync(imgDir, { recursive: true });
}

// Function to create SVG and save to file
function createSVGPlaceholder(filename, text, width, height, bgColor, textColor) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <rect width="100%" height="100%" fill="${bgColor}"/>
        <text x="50%" y="50%" font-family="Arial" font-size="20" fill="${textColor}" text-anchor="middle" dominant-baseline="middle">${text}</text>
    </svg>`;
    
    fs.writeFileSync(path.join(imgDir, filename), svg);
    console.log(`Created ${filename}`);
}

// Generate all placeholders
createSVGPlaceholder('pizza.png', '🍕', 100, 100, '#d32f2f', '#ffffff');
createSVGPlaceholder('logo.png', 'PizzaExpress', 200, 100, '#d32f2f', '#ffffff');
createSVGPlaceholder('logo-small.png', 'PizzaExpress', 100, 50, '#d32f2f', '#ffffff');
createSVGPlaceholder('user.png', '👤', 100, 100, '#f0f0f0', '#333333');
createSVGPlaceholder('pizza-delivery.svg', '🍕🛵', 300, 300, '#ffffff', '#d32f2f');
createSVGPlaceholder('favicon.ico', 'P', 32, 32, '#d32f2f', '#ffffff');