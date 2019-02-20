import { model } from '../objects/model.js';
import { backfaceCulling } from "../transformation/backfaceCulling.js";
import { getModel } from "../transformation/getModel.js";
import { view, adjustModel} from "../objects/view.js";

// Draw model on the canvas

export const draw = (ctx, width, height) => () => {
    // back face culling, save it to model object
    backfaceCulling();
    // transform points from virtual world to 2d screen
    let calcPoints = getModel(model);
    // move model to suitable position due to canvas' coordinate
    calcPoints = adjustModel(calcPoints, Math.min(width, height));
    // clear canvas to redraw
    ctx.clearRect(0, 0, width, height);
    ctx.fillRect(0, 0, width, height);
    model.faces.forEach((face, index) => {
        // depend on user's choice to back face culling or not
        if (view.cullingPreference && view.backFaceSet.has(index)) return;
        let n = face.length;
        ctx.beginPath();
        ctx.moveTo(calcPoints[face[0]][0], calcPoints[face[0]][1]);
        for (let i = 1; i < n; i++) {
            ctx.lineTo(calcPoints[face[i]][0], calcPoints[face[i]][1]);
        }
        ctx.closePath();
        ctx.stroke();
    });
};

