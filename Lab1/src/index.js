import { cameraInit } from './transformation/initCamera.js';
import {
    bindSlider,
    backfaceCullingOption,
    cameraOperation } from './ui/configs.js';
import {initModel} from "./transformation/initModel.js";
import { draw } from "./ui/draw.js";

// Get canvas ready
const canvas = document.querySelector('#content');
const [height, width] = [canvas.height, canvas.width];
const ctx = canvas.getContext('2d');
ctx.fillRect(0, 0, width, height);
ctx.strokeStyle = 'white';

// Draw model on canvas
const drawCtx = draw(ctx, width, height);

// Read model file
const uploadedFile = document.getElementById("model");
uploadedFile.addEventListener('change', () => {
    initModel(uploadedFile, drawCtx);
});

// Bind select button with backfaceCulling
const backfaceCulling = document.getElementById('backfaceCulling');
backfaceCullingOption(backfaceCulling, drawCtx);

// Get three slides ready binding with h, d, f parameter
['h', 'd', 'f'].forEach(item => bindSlider(item, drawCtx));

// Binding
cameraOperation('content', drawCtx);

// Calculate N, U, V vector
cameraInit();

