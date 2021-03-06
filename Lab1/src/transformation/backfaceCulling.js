import { camera } from '../objects/camera.js';
import { model } from '../objects/model.js';
import {view} from "../objects/view.js";
import { vecSubtract, vec3dCrossMultiply, vec3dDotMultiply } from '../math/matrix.js';

// Visible if Np dot product N > 0

export const backfaceCulling = () => {
    model.backFaceSet = new Set();
    model.faces.forEach((x, index) => {
        if (vec3dDotMultiply(vec3dCrossMultiply(vecSubtract(model.points[x[0]], model.points[x[1]]), vecSubtract(model.points[x[1]], model.points[x[2]])),
            vecSubtract(camera.C, model.points[x[0]])) > 0) {
            view.backFaceSet.add(index);
        }
    });
};
