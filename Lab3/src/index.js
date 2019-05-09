import {
    changeShadingMode,
    bindSlider,
    cameraOperation } from './ui/configs.js';
import {initModel} from "./transformation/initModel.js";
import { draw } from "./ui/draw.js";

// Get canvas ready
const canvas = document.querySelector('#content');
const [height, width] = [canvas.height, canvas.width];
const ctx = canvas.getContext('2d');
ctx.fillRect(0, 0, width, height);

// Draw model on canvas
const drawCtx = draw(ctx, width, height);

// Shading modes
const shading = document.getElementById("shading");
shading.addEventListener('change', () => {
    changeShadingMode(shading.value, drawCtx);
});

// Read model file
const uploadedFile1 = document.getElementById("model1");
uploadedFile1.addEventListener('change', () => {
    initModel(uploadedFile1, drawCtx);
});

// Get three slides ready binding with h, d, f parameter
['h', 'd', 'f'].forEach(item => bindSlider(item, drawCtx));

// Binding
cameraOperation('content', drawCtx);




