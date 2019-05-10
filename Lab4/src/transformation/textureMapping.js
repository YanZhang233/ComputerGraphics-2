import {model} from "../objects/model.js";

// export const getTexture = (ctx, uploadedTexture, canvasHeight, canvasWidth) => {
//     if(uploadedTexture === null) {
//         const width = 1;
//         const height = 1;
//
//         let tBuffer = [];
//         for(let i = 0; i < height; i++) {
//             let h = [];
//             for(let j = 0; j < width * 3; j += 3) {
//                 h.push([
//                     135,
//                     206,
//                     235,
//                     255
//                 ]);
//             }
//             tBuffer.push(h);
//         }
//         model.textureMap = tBuffer;
//     } else {
//         const file = uploadedTexture.files[0];
//         const reader = new FileReader();
//         reader.readAsDataURL(file);
//         reader.onload = () => {
//             const image = new Image();
//             image.src = reader.result;
//             // image.src = 'texture/5.jpg';
//             image.onload = () => {
//                 ctx.drawImage(image, 0, 0);
//                 const width = Math.min(image.width, canvasWidth);
//                 const height = Math.min(image.height, canvasHeight);
//                 const data = ctx.getImageData(0, 0, width, height).data;
//
//                 let tBuffer = [];
//                 for(let i = 0; i < height; i++) {
//                     let h = [];
//                     for(let j = 0; j < width; j++) {
//                         const pos = i * width + j;
//                         h.push([
//                             data[pos * 4 + 0],
//                             data[pos * 4 + 1],
//                             data[pos * 4 + 2],
//                             data[pos * 4 + 3],
//                         ]);
//                     }
//                     tBuffer.push(h);
//                 }
//                 model.textureMap = tBuffer;
//             };
//         };
//     }
// };

// export const getTexture = (ctx, canvasHeight, canvasWidth) => {
//         const image = new Image();
//         // image.src = reader.result;
//         image.src = 'texture/7.jpg';
//         image.onload = () => {
//             ctx.drawImage(image, 0, 0);
//             const width = Math.min(image.width, canvasWidth);
//             const height = Math.min(image.height, canvasHeight);
//             const data = ctx.getImageData(0, 0, width, height).data;
//
//             // height * width
//             let tBuffer = [];
//             for(let i = 0; i < height; i++) {
//                 let h = [];
//                 for(let j = 0; j < width * 4; j += 4) {
//                     const pos = i * width + j;
//                     h.push([
//                         data[pos + 0],
//                         data[pos + 1],
//                         data[pos + 2],
//                         data[pos + 3],
//                     ]);
//                 }
//                 tBuffer.push(h);
//             }
//             // console.log('tBuffer', tBuffer);
//             model.textureMap = tBuffer;
//         };
// };

export const getTexture = (ctx, uploadedTexture, canvasHeight, canvasWidth) => {
    if(uploadedTexture === null) {
        const width = 1;
        const height = 1;

        let tBuffer = [];
        for(let i = 0; i < height; i++) {
            let h = [];
            for(let j = 0; j < width * 3; j += 3) {
                h.push([
                    230,
                    25,
                    25,
                    255
                ]);
            }
            tBuffer.push(h);
        }
        model.textureMap = tBuffer;
    } else {
        const file = uploadedTexture.files[0];
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = () => {
            const buffer = reader.result;
            const bitmap = getBMP(buffer);
            const imageData = convertToImageData(ctx, bitmap);
            ctx.putImageData(imageData, 0, 0);
        };
    }
};

export const getBMP = (buffer) => {
    const datav = new DataView(buffer);
    const bitmap = {};
    bitmap.fileheader = {};
    bitmap.fileheader.bfType =
        datav.getUint16(0, true);
    bitmap.fileheader.bfSize =
        datav.getUint32(2, true);
    bitmap.fileheader.bfReserved1 =
        datav.getUint16(6, true);
    bitmap.fileheader.bfReserved2 =
        datav.getUint16(8, true);
    bitmap.fileheader.bfOffBits =
        datav.getUint32(10, true);
    bitmap.infoheader = {};
    bitmap.infoheader.biSize =
        datav.getUint32(14, true);
    bitmap.infoheader.biWidth =
        datav.getUint32(18, true);
    bitmap.infoheader.biHeight =
        datav.getUint32(22, true);
    bitmap.infoheader.biPlanes =
        datav.getUint16(26, true);
    bitmap.infoheader.biBitCount =
        datav.getUint16(28, true);
    bitmap.infoheader.biCompression =
        datav.getUint32(30, true);
    bitmap.infoheader.biSizeImage =
        datav.getUint32(34, true);
    bitmap.infoheader.biXPelsPerMeter =
        datav.getUint32(38, true);
    bitmap.infoheader.biYPelsPerMeter =
        datav.getUint32(42, true);
    bitmap.infoheader.biClrUsed =
        datav.getUint32(46, true);
    bitmap.infoheader.biClrImportant =
        datav.getUint32(50, true);
    const start = bitmap.fileheader.bfOffBits;
    bitmap.stride =
        Math.floor((bitmap.infoheader.biBitCount
            * bitmap.infoheader.biWidth + 31) / 32) * 4;
    bitmap.pixels = new Uint8Array(buffer, start);
    return bitmap;
};

export const convertToImageData = (ctx, bitmap) => {
    const Width = bitmap.infoheader.biWidth;
    const Height = bitmap.infoheader.biHeight;
    const imageData = ctx.createImageData(Width, Height);
    const data = imageData.data;
    const bmpdata = bitmap.pixels;
    const stride = bitmap.stride;

    let tBuffer = [];
    for (let y = 0; y < Height; ++y) {
        let h = [];
        for (let x = 0; x < Width; ++x) {
            const index1 = (x+Width*(Height-y))*4;
            const index2 = x * 3 + stride * y;
            data[index1] = bmpdata[index2 + 2];
            data[index1 + 1] = bmpdata[index2 + 1];
            data[index1 + 2] = bmpdata[index2];
            data[index1 + 3] = 255;
            h.push([
                    data[index1],
                    data[index1 + 1],
                    data[index1 + 2],
                ]);
        }
        tBuffer.push(h);
    }
    model.textureMap = tBuffer;
    return imageData;
};
