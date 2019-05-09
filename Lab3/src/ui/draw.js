import {getiBuffer} from "../transformation/getModel.js";
import { model } from "../objects/model.js";
import {lights, shadingMode} from "../objects/lights.js";

// Draw model on the canvas
export const draw = (ctx, width, height) => () => {
    // clear before image
    ctx.clearRect(0, 0, width, height);
    // draw
    const imageData = ctx.createImageData(width, height);
    const data = new Uint8Array(width * height * 4);
    const iBuffer = getiBuffer(model, lights, shadingMode.value, height, width);
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            const t = i * width + j;
            const c = iBuffer[i][j];
            data[t * 4 + 0] = c.r;
            data[t * 4 + 1] = c.g;
            data[t * 4 + 2] = c.b;
            data[t * 4 + 3] = c.a;
        }
    }
    imageData.data.set(data);
    ctx.putImageData(imageData, 0, 0);
};

