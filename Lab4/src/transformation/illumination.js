import {vec3dDotMultiply} from "../math/matrix.js";

export const diffuseTerm = (kd, ILight, normal, light, power) => {
    const gradient = Math.pow(vec3dDotMultiply(normal, light), power);
    return gradient > 0 ? gradient * kd * ILight : 0;
};
