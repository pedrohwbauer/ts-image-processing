import './style.css';

const img = new Image();
img.src =
  'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

ctx.drawImage(img, 0, 0);

const imageData = ctx.createImageData(100, 100);

// Iterate through every pixel
for (let i = 0; i < imageData.data.length; i += 4) {
  // Modify pixel data
  imageData.data[i + 0] = 190; // R value
  imageData.data[i + 1] = 0; // G value
  imageData.data[i + 2] = 210; // B value
  imageData.data[i + 3] = 255; // A value
}

//ctx.putImageData(imageData);
