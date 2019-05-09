import { toPixel, toFloatPixel, bufferInit, edgeTableInit } from "./initPixel.js";
import { edge } from "../objects/edge.js";
import {vec3dDotMultiply, vecAdd, vecScale} from "../math/matrix.js";
import {vecSubtract, vecUnit} from "../math/matrix.js";
import {color} from "../objects/color.js";

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

    // yStart;
    // yMax;
    // xStart;
    // delta;
    // zStart;
    // zDeltaToY;
    // normalStart;
    // normalEnd;

    // add edges to edgeTable
    const e = new edge(toPixel(lowerPoint[1], height), toPixel(upperPoint[1], height),
        toFloatPixel(lowerPoint[0], height), (lowerPoint[0] - upperPoint[0]) / (lowerPoint[1] - upperPoint[1]), lowerPoint[2],
        (lowerPoint[2] - upperPoint[2]) / (toPixel(lowerPoint[1], height) - toPixel(upperPoint[1], height)),
        model.pointsNormal[indexStart], model.pointsNormal[indexEnd]);
    edgeTable[Math.floor(e.yStart)].push(e);
};

// illumination model
export const diffuseTerm = (kd, ILight, normal, light) => {
    const gradient = vec3dDotMultiply(normal, light);
    return gradient > 0 ? gradient * kd * ILight : 0;
};

export const scanConversion = (model, lights, shadingMode, calcPoints, backfaceSet, height, width) => {
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

            for (let j = 0; j + 1 < activeEdgeTable.length; j += 2) {
                const [left, right] = [activeEdgeTable[j], activeEdgeTable[j + 1]];
                let zCurrent = left.zStart;
                const zDeltaToX = (left.zStart - right.zStart) / (left.xStart - right.xStart);

                if(shadingMode === '0') {
                    // Constant Shading

                    // gray: constant shading color for each face
                    let gray = 0;
                    let curNormal = model.facesNormal[index];
                    const org = [0, 0, 0];
                    for(let light of lights) {
                        light = vecUnit(vecSubtract(org, light));
                        gray += diffuseTerm(1, 88, curNormal, light);
                    }

                    // gray += (255 - 100 * vec3dDotMultiply(vecUnit(normal), vecUnit(light)));
                    // if(gray < 285) {
                    //     gray = 0;
                    // }

                    for (let k = Math.floor(left.xStart); k < Math.floor(right.xStart); k++) {
                        if (zCurrent <= zBuffer[i][k]) {
                            zBuffer[i][k] = zCurrent;
                            iBuffer[i][k] = new color(gray, gray, gray, 255);
                        }
                        zCurrent += zDeltaToX;
                    }
                } else if(shadingMode === '1') {
                    // Gouraud Shading

                    // according to intensity
                    const la = vecAdd(
                        vecScale(left.normalEnd, (i - left.yStart) / (left.yMax - left.yStart)),
                        vecScale(left.normalStart, (left.yMax - i) / (left.yMax - left.yStart))
                    );
                    const lb = vecAdd(
                        vecScale(right.normalEnd, (i - right.yStart) / (right.yMax - right.yStart)),
                        vecScale(right.normalStart, (right.yMax - i) / (right.yMax - right.yStart))
                    );

                    const curNormal = right.xStart - left.xStart === 0 ? vecUnit(la) : vecUnit(vecAdd(la, lb));

                    let gray = 0;
                    const org = [0, 0, 0];
                    for (let light of lights) {
                        light = vecUnit(vecSubtract(org, light));
                        gray += diffuseTerm(1, 88, curNormal, light);
                    }
                    for (let k = Math.floor(left.xStart); k < Math.floor(right.xStart); k++) {
                        if (zCurrent <= zBuffer[i][k]) {
                            zBuffer[i][k] = zCurrent;
                            iBuffer[i][k] = new color(gray, gray, gray, 255);
                        }
                        zCurrent += zDeltaToX;
                    }

                } else {
                    // Phong Shading

                    // according to intensity
                    const la = vecAdd(
                        vecScale(left.normalEnd, (i - left.yStart) / (left.yMax - left.yStart)),
                        vecScale(left.normalStart, (left.yMax - i) / (left.yMax - left.yStart))
                    );
                    const lb = vecAdd(
                        vecScale(right.normalEnd, (i - right.yStart) / (right.yMax - right.yStart)),
                        vecScale(right.normalStart, (right.yMax - i) / (right.yMax -right.yStart))
                    );

                    for (let k = Math.floor(left.xStart); k < Math.floor(right.xStart); k++) {
                        if (zCurrent <= zBuffer[i][k]) {
                            zBuffer[i][k] = zCurrent;
                            const curNormal = right.xStart - left.xStart === 0 ? vecUnit(la) :
                                vecUnit(vecAdd(
                                    vecScale(la, (right.xStart - k) / (right.xStart - left.xStart)),
                                    vecScale(lb, (k - left.xStart) / (right.xStart - left.xStart))
                                ));
                            let gray = 0;
                            const org = [0, 0, 0];
                            for (let light of lights) {
                                light = vecUnit(vecSubtract(org, light));
                                gray += diffuseTerm(1, 88, curNormal, light);
                            }
                            iBuffer[i][k] = new color(gray, gray, gray, 255);
                        }
                        zCurrent += zDeltaToX;
                    }
                }
                left.xStart += left.delta;
                right.xStart += right.delta;
                left.zStart += left.zDeltaToY;
                right.zStart += right.zDeltaToY;
            }
        }
    });
    return iBuffer;
};
