import { camera } from '../objects/camera.js';
import { matMultiply } from '../math/matrix.js';

export const worldToCamera = () => {
    const T = [
        [1, 0, 0, -camera.C[0]],
        [0, 1, 0, -camera.C[1]],
        [0, 0, 1, -camera.C[2]],
        [0, 0, 0, 1           ]
    ];
    const R = [
        [camera.U[0], camera.U[1], camera.U[2], 0],
        [camera.V[0], camera.V[1], camera.V[2], 0],
        [camera.N[0], camera.N[1], camera.N[2], 0],
        [0          , 0          , 0          , 1]
    ];
    const RT = matMultiply(R, T);
    return RT;
};
