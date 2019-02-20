// adjust model
let factor;
let [xMax, yMax] = [-1, -1];
export const adjustModel = (calcPoints, len) => {
    if (!factor) {
        calcPoints.forEach(point => {
            xMax = Math.max(xMax, Math.abs(point[0]));
            yMax = Math.max(yMax, Math.abs(point[1]));
        });
        factor = Math.floor(len / Math.max(xMax, yMax));
    }
    return calcPoints.map(point => [
        point[0] * factor / 3 + Math.max(xMax, yMax) * factor / 2,
        -point[1] * factor / 3 + Math.max(xMax, yMax) * factor / 2
    ]);
};

// view model on canvas
export const view = {
    // A set used to save back face index
    backFaceSet: new Set(),
    // backfaceCulling or not
    cullingPreference: false,
};

