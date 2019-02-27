import { matMultiply, matMulVec, vecExtend, vecCollapse } from '../math/matrix.js';
import { worldToCamera } from "./worldToCamera.js";
import { perspectiveTrans } from "./perspectiveTrans.js";
import {backfaceCulling} from "./backfaceCulling.js";
import {model} from "../objects/model.js";
import {scanConversion} from "./scanConversion.js";
import {cameraInit} from "./initCamera.js";

export const getModel = model => {
    const combo = matMultiply(perspectiveTrans(), worldToCamera());
    return model.points.map(point => {
        let t = matMulVec(combo, vecExtend(point));
        return vecCollapse(t);
    });
};

export const getiBuffer = (height, width) => {
    // Calculate N, U, V vector
    cameraInit();
    const backfaceSet = backfaceCulling();
    const calcPoints = getModel(model);
    return scanConversion(model, calcPoints, backfaceSet, height, width);
};
