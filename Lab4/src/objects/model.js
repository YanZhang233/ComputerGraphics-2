import { color } from "../objects/color.js";
import { vec3dDotMultiply, vecUnit, vec3dCrossMultiply, vecSubtract, vecAbs, vecAdd} from "../math/matrix.js";

// Model Parameters
export const model = {
    points : [],
    pointsNormal: [],
    faces : [],
    facesColor : [],
    facesNormal: [],
    pointsTexture: [],
    textureMap: []
};

export const colorInit = (singleLightOn, lights) => {
    model.facesColor = [];
    for (let i = 0; i < model.faces.length; i++) {
        if(singleLightOn) {
            let gray = 0;
            let normal = model.facesNormal[i];
            for(let light of lights) {
                // gray += (128 + 128 * vec3dDotMultiply(vecUnit(normal), vecUnit(light)));
                gray += (255 - 100 * vec3dDotMultiply(vecUnit(normal), vecUnit(light)));
            }
            if(gray < 285) {
                gray = 0;
            }
            model.facesColor.push(new color(gray, gray, gray, 255));
        } else {
            model.facesColor.push(new color(
                Math.floor(Math.random() * 256),
                Math.floor(Math.random() * 256),
                Math.floor(Math.random() * 256),
                255
            ));
        }
    }
};

export const normalizeFace = (faceIndex) => {
    const face = model.faces[faceIndex];
    const [p1, p2, p3] = [model.points[face[0]], model.points[face[1]], model.points[face[2]]];
    const normal = vec3dCrossMultiply(vecSubtract(p2, p1), vecSubtract(p3, p2));
    if(vecAbs(normal)) {
        return vecUnit(normal);
    } else {
        return [0, 0, 1];
    }
};

// according to facesNormal, compute all points normal
export const computeScenePointNormal = () => {
    for(let i = 0; i < model.facesNormal.length; i++) {
        for(let j = 0; j < model.faces[i].length; j++) {
            const temp = model.faces[i][j];
            model.pointsNormal[temp] = vecAdd(model.pointsNormal[temp], model.facesNormal[i]);
        }
    }
    for(let i = 0; i < model.points.length; i++) {
        if(vecAbs(model.pointsNormal[i])) {
            model.pointsNormal[i] = vecUnit(model.pointsNormal[i]);
        }
    }
};

// texture mapping: S-Mapping(Cylinder)
export const textureMap = () => {

    let zMin = Number.MAX_VALUE, zMax = Number.MIN_VALUE,
        xMin = Number.MAX_VALUE, xMax = Number.MIN_VALUE,
        yMin = Number.MAX_VALUE, yMax = Number.MIN_VALUE;

    for(let i = 0; i < model.points.length; i++) {
        zMin = Math.min(zMin, model.points[i][2]);
        zMax = Math.max(zMax, model.points[i][2]);

        xMin = Math.min(xMin, model.points[i][0]);
        xMax = Math.max(xMax, model.points[i][0]);

        yMin = Math.min(yMin, model.points[i][1]);
        yMax = Math.max(yMax, model.points[i][1]);
    }

    for(let i = 0; i < model.points.length; i++) {
        const [x, y, z] = [
            (model.points[i][0] - xMin) / (xMax - xMin),
            (model.points[i][1] - yMin) / (yMax - yMin),
            (model.points[i][2] - zMin) / (zMax - zMin)
        ];
        const thetaDegree = coToDegree(x / Math.sqrt(x * x + y * y), y / Math.sqrt(x * x + y * y));

        model.pointsTexture.push([x, z]);
        // model.pointsTexture.push([thetaDegree / (2 * Math.PI), z]);
        // console.log('texturePoints', x + ' ' + z);
    }
};

export const coToDegree = (cosaT, sinaT) => {
    const angleCandidate = Math.acos(cosaT);
    return Math.floor((100)*sinaT) === Math.floor((100)*Math.sin(angleCandidate)) ?
        (angleCandidate * 180 / Math.PI) : (360 - angleCandidate * 180 / Math.PI);
};
