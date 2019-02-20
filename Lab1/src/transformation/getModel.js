import { matMultiply, matMulVec, vecExtend, vecCollapse } from '../math/matrix.js';
import { worldToCamera } from "./worldToCamera.js";
import { perspectiveTrans } from "./perspectiveTrans.js";

export const getModel = model => {
    const combo = matMultiply(perspectiveTrans(), worldToCamera());
    return model.points.map(point => {
        let t = matMulVec(combo, vecExtend(point));
        return vecCollapse(t);
    });
};
