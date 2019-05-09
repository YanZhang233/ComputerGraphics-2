import { toPixel, toFloatPixel, bufferInit, edgeTableInit } from "./initPixel.js";
import { edge } from "../objects/edge.js";
import {vecAdd, vecScale} from "../math/matrix.js";
import {vecSubtract, vecUnit} from "../math/matrix.js";
import {color} from "../objects/color.js";
import { diffuseTerm } from "./illumination.js";

// Scan Conversion
export const addEdgeToEdgeTable = (model, indexStart, indexEnd, lowerPoint, upperPoint, edgeTable, height) => {
    // ignore horizontal edge and out of range points
    if (toPixel(lowerPoint[1], height) === toPixel(upperPoint[1], height)
    || lowerPoint[1] > 1 || lowerPoint[1] < -1) {
        return;
    }

    // switch the order of 2 points
    if (lowerPoint[1] > upperPoint[1]) {
        [lowerPoint, upperPoint] = [upperPoint, lowerPoint];
        [indexStart, indexEnd] = [indexEnd, indexStart];
    }

    const textureDelta = [
        (model.pointsTexture[indexEnd][0] - model.pointsTexture[indexStart][0]) / (toPixel(upperPoint[1], height) - toPixel(lowerPoint[1], height)),
        (model.pointsTexture[indexEnd][1] - model.pointsTexture[indexStart][1]) / (toPixel(upperPoint[1], height) - toPixel(lowerPoint[1], height))
    ];

    // yStart;
    // yMax;
    // xStart;
    // delta;
    // zStart;
    // zDeltaToY;
    // normalStart;
    // normalEnd;
    // textureStart;
    // textureDeltaToY;

    // add edges to edgeTable
    const e = new edge(toPixel(lowerPoint[1], height),
                       toPixel(upperPoint[1], height),
                       toFloatPixel(lowerPoint[0], height),
                (lowerPoint[0] - upperPoint[0]) / (lowerPoint[1] - upperPoint[1]),
                       lowerPoint[2],
            (lowerPoint[2] - upperPoint[2]) / (toPixel(lowerPoint[1], height) - toPixel(upperPoint[1], height)),
                       model.pointsNormal[indexStart],
                       model.pointsNormal[indexEnd],
                       model.pointsTexture[indexStart],
                       textureDelta);
    edgeTable[toPixel(lowerPoint[1], height)].push(e);
};

export const scanConversion = (model, lights, calcPoints, backfaceSet, height, width) => {
    const [iBuffer, zBuffer] = bufferInit(height, width);
    let activeEdgeTable = [];
    // for each face
    model.faces.forEach((face, index) => {
        // don't need to consider backface
        if (backfaceSet.has(index)) return;

        // build edge table
        const edgeTable = edgeTableInit(height);
        for (let i = 0; i < face.length; i++) {
            // get an edge
            let [indexStart, indexEnd] = [face[i], face[(i + 1) % face.length]];
            let [lowerPoint, upperPoint] = [calcPoints[indexStart], calcPoints[indexEnd]];

            addEdgeToEdgeTable(model, indexStart, indexEnd, lowerPoint, upperPoint, edgeTable, height);
        }

        // fill pixel buffer
        let currentScanline = 0;
        for (let i = 0; i < height; i++) {
            if (edgeTable[i].length > 0) {
                currentScanline = i;
                break;
            }
        }
        for (let i = currentScanline; i < height; i++) {
            // move edge from edgeTable to activeEdgeTable
            for (let j = 0; j < edgeTable[i].length; j++) {
                activeEdgeTable.push(edgeTable[i][j]);
            }

            // remove the leaving edge
            activeEdgeTable = activeEdgeTable
            // remove edge from Active Edge Table while y = yMax
                .filter(edge => edge.yMax !== i)
                // sort AET by xStart
                .sort((a, b) => {
                    return a.xStart - b.xStart;
                });

            for (let j = 0; j < activeEdgeTable.length; j += 2) {
                const [left, right] = [activeEdgeTable[j], activeEdgeTable[j + 1]];
                let zCurrent = left.zStart;
                const zDeltaToX = (left.zStart - right.zStart) / (left.xStart - right.xStart);

                // Phong Shading
                // according to intensity
                const la = vecAdd(
                    vecScale(left.normalEnd, (i - left.yStart) / (left.yMax - left.yStart)),
                    vecScale(left.normalStart, (left.yMax - i) / (left.yMax - left.yStart))
                );
                const lb = vecAdd(
                    vecScale(right.normalEnd, (i - right.yStart) / (right.yMax - right.yStart)),
                    vecScale(right.normalStart, (right.yMax - i) / (right.yMax - right.yStart))
                );

                // pixel scanned horizontally
                for (let k = Math.floor(left.xStart); k < Math.floor(right.xStart); k++) {
                    if (zCurrent < zBuffer[i][k]) {
                        //update depth buffer
                        zBuffer[i][k] = zCurrent;

                        // texture map coordinate

                        let U = k === Math.floor(left.xStart) ? left.textureStart[0] :
                            left.textureStart[0] * ((Math.floor(right.xStart) - k) / (Math.floor(right.xStart) - Math.floor(left.xStart))) +
                            right.textureStart[0] * ((k - Math.floor(left.xStart)) / (Math.floor(right.xStart) - Math.floor(left.xStart)));

                        let V = k === Math.floor(left.xStart) ? left.textureStart[1] :
                            left.textureStart[1] * ((Math.floor(right.xStart) - k) / (Math.floor(right.xStart) - Math.floor(left.xStart))) +
                            right.textureStart[1] * ((k - Math.floor(left.xStart)) / (Math.floor(right.xStart) - Math.floor(left.xStart)));

                        let curNormal;

                        if (k === Math.floor(left.xStart)) {
                            if (i === left.yStart) {
                                curNormal = left.normalStart;
                            } else {
                                curNormal = la;
                            }
                        } else {
                            curNormal = vecAdd(
                                vecScale(la, right.xStart - k),
                                vecScale(lb, k - left.xStart)
                            );
                        }

                        curNormal = vecUnit(curNormal);

                        // let gray = 0;
                        // const org = [0, 0, 0];
                        // for(let light of lights) {
                        //     light = vecUnit(vecSubtract(org, light));
                        //     gray += diffuseTerm(1, 100, curNormal, light, 3);
                        // }

                        const light = vecUnit([-100, -100, -100]);
                        let gray = diffuseTerm(1, 100, curNormal, light, 3);

                        if (gray < 0) {
                            gray = 0;
                        }
                        if (gray > 255) {
                            gray = 255;
                        }

                        const intensity = gray / 100;

                        U = U < 0 ? 0 : U;
                        U = U >= 1 ? 0.99 : U;

                        V = V < 0 ? 0 : V;
                        V = V >= 1 ? 0.99 : V;

                        const textureX = Math.floor(U * model.textureMap.length);
                        const textureY = Math.floor(V * model.textureMap[textureX].length);

                        const r = Math.max(Math.min(model.textureMap[textureX][textureY][0] * intensity + 30, 255), 0);
                        const g = Math.max(Math.min(model.textureMap[textureX][textureY][1] * intensity + 30, 255), 0);
                        const b = Math.max(Math.min(model.textureMap[textureX][textureY][2] * intensity + 30, 255), 0);
                        // const a = Math.max(Math.min(model.textureMap[textureX][textureY][3] * intensity + 30, 255), 0);

                        iBuffer[i][k] = new color(r, g, b, 255);

                        // iBuffer[i][k] = new color(gray, gray, gray, 255);
                    }
                    zCurrent += zDeltaToX;
                }
                // update x and z
                left.xStart += left.delta;
                right.xStart += right.delta;

                left.zStart += left.zDeltaToY;
                right.zStart += right.zDeltaToY;

                // update texture map
                left.textureStart[0] += left.textureDeltaToY[0];
                left.textureStart[1] += left.textureDeltaToY[1];
                right.textureStart[0] += right.textureDeltaToY[0];
                right.textureStart[1] += right.textureDeltaToY[1];
            }
        }
    });
    return iBuffer;
};
