import { color } from "../objects/color.js";

// convert 2d point to canvas point
export const toFloatPixel = (value, height) => {
    return (value + 1) * height / 2;
};

export const toPixel = (value, height, shortten = false) => {
    return Math.floor((value + 1) * height / 2) - (shortten ? 1 : 0);
};

export const bufferInit = (height, width) => {
    const iBuffer = [];
    const zBuffer = [];
    for (let i = 0; i < height; i++) {
        iBuffer[i] = [];
        zBuffer[i] = [];
        for (let j = 0; j < width; j++) {
            iBuffer[i][j] = new color();
            zBuffer[i][j] = 1;
        }
    }
    return [iBuffer, zBuffer];
};

export const edgeTableInit = (height) => {
    const edgeTable = [];
    for (let i = 0; i < height; i++) {
        edgeTable[i] = [];
    }
    return edgeTable;
};
