import { color } from "../objects/color.js";
import { vecUnit, vec3dCrossMultiply, vecSubtract, vecAbs, vecAdd} from "../math/matrix.js";

// Model Parameters
export const model = {
    points : [],
    pointsNormal: [],
    faces : [],
    facesColor : [],
    facesNormal: []
};

export const colorInit = () => {
    model.facesColor = [];
    for (let i = 0; i < model.faces.length; i++) {
        model.facesColor.push(new color(
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * 256),
            255
        ));
    }
};

export const normalizeFace = (faceIndex) => {
    const face = model.faces[faceIndex];
    const [p1, p2, p3] = [model.points[face[0]], model.points[face[1]], model.points[face[2]]];
    return vecUnit(vec3dCrossMultiply(vecSubtract(p2, p1), vecSubtract(p3, p2)));
};

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
