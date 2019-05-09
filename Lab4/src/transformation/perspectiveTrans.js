import { camera } from '../objects/camera.js';

export const perspectiveTrans = () => {
    const a = camera.f / (camera.f - camera.d);
    const b = camera.d / camera.h;
    const mPers = [
        [b, 0, 0, 0          ],
        [0, b, 0, 0          ],
        [0, 0, a, -a*camera.d],
        [0, 0, 1, 0          ]
    ];
    return mPers;
};
