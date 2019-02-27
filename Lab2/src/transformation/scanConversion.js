import { toPixel, toFloatPixel, bufferInit, edgeTableInit } from "./initPixel.js";
import { edge } from "../objects/edge.js";

// Scan Conversion
// 1. for each scan line, determine edges of polygons that intersect
// 2. Find the start and end of the span
// 3. Rely on scanline and pixel coherence to linearly interpolate (between scanlines and between pixels)

export const addEdgeToEdgeTable = (lowerPoint, upperPoint, edgeTable, height) => {
    // ignore horizontal edge and out of range points
    if (toPixel(lowerPoint[1], height) === toPixel(upperPoint[1], height)
    || lowerPoint[1] > 1 || lowerPoint[1] < -1) {
        return;
    }

    // switch the order of 2 points
    if (lowerPoint[1] > upperPoint[1]) {
        [lowerPoint, upperPoint] = [upperPoint, lowerPoint];
    }

    // add edges to edgeTable
    const e = new edge(toPixel(lowerPoint[1], height, false), toPixel(upperPoint[1], height, true),
        toFloatPixel(lowerPoint[0], height), (lowerPoint[0] - upperPoint[0]) / (lowerPoint[0] - upperPoint[0]), upperPoint[2], lowerPoint[2]);
    if (e.yStart > e.yMax) {
        e.yMax = e.yStart;
    }
    edgeTable[Math.floor(e.yStart)].push(e);
};

// calcute Z
export const calZ = (edge, ys) => {
    return edge.yMax === edge.yStart ? edge.zUpper :
        edge.zUpper - (edge.zUpper - edge.zLower) * (edge.yMax - ys) / (edge.yMax - edge.yStart);
};

export const scanConversion = (model, calcPoints, backfaceSet, height, width) => {
    const [iBuffer, zBuffer] = bufferInit(height, width);
    let activeEdgeTable = [];
    // for each face
    model.faces.forEach((face, index) => {
        // no need to consider backface
        if (backfaceSet.has(index)) return;
        // build edge table
        const edgeTable = edgeTableInit(height);
        for (let i = 0; i < face.length; i++) {
            // get an edge
            let lowerPoint = calcPoints[face[i]];
            let upperPoint = calcPoints[face[(i + 1) % face.length]];
            addEdgeToEdgeTable(lowerPoint, upperPoint, edgeTable, height);
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
            activeEdgeTable.sort((a, b) => {
                return a.xStart - b.xStart
            });

            for (let j = 0; j + 1 < activeEdgeTable.length; j += 2) {
                const [left, right] = [activeEdgeTable[j], activeEdgeTable[j + 1]];
                if (left.xStart > right.xStart) continue;
                const [za, zb] = [calZ(left, i), calZ(right, i)];
                for (let k = Math.max(0, Math.floor(left.xStart)); k < Math.floor(right.xStart) && k < width; k++) {
                    // calculate Z of the current point
                    let zp = (k === Math.max(0, left.xStart) ? za : zb - (zb - za) * (right.xStart - k) / (right.xStart - left.xStart));
                    if (zp > zBuffer[i][k]) continue;
                    zBuffer[i][k] = zp;
                    iBuffer[i][k] = model.facesColor[index];
                }
            }

            activeEdgeTable = activeEdgeTable
                .filter(edge => edge.yMax !== i) // remove edge from Active Edge Table while y = yMax
                .map(edge => {  // increase x with delta because y increased with 1
                    edge.xStart += edge.delta;
                    return edge;
                });
        }
    });
    return iBuffer;
};
