import { vecSubtract, vecUnit, vec3dCrossMultiply } from '../math/matrix.js';
import { camera } from "../objects/camera.js";

export const cameraInit = () => {
    camera.N = vecUnit(vecSubtract(camera.pRef, camera.C));
    camera.U = vecUnit(vec3dCrossMultiply(camera.N, camera.UP));
    camera.V = vec3dCrossMultiply(camera.U, camera.N);
};
