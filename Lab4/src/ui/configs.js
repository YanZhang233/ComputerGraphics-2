import { camera } from '../objects/camera.js';
import { cameraInit } from "../transformation/initCamera.js";
import { vecScale } from '../math/matrix.js';

// slider
export const bindSlider = (name, operation) => {
    const slider = document.querySelector(`#${name}`);
    const sliderText = document.querySelector(`#${name}_V`);
    slider.value = camera[name];
    sliderText.innerHTML = camera[name];
    slider.addEventListener('change', function() {
        camera[name] = this.value;
        sliderText.innerHTML = this.value;
        camera.pRef[0] -= 10;
        operation();
    });
};

// camera controller
const objectLen = 1;
const cameraLen = 2;
export const cameraOperation = (name, draw) => {
    const canvas = document.querySelector(`#${name}`);
    // zooming the model
    canvas.addEventListener('mousewheel', function(e) {
        if (e.wheelDelta > 0) {
            camera.C = vecScale(camera.C, 6/5);
        } else {
            camera.C = vecScale(camera.C, 5/6);
        }
        draw();
    });
    // change the position of the model
    document.addEventListener('keypress', function(e) {
        switch (e.key) {
            case 'i':
                camera.C[1] -= cameraLen;
                cameraInit();
                draw();
                break;
            case 'k':
                camera.C[1] += cameraLen;
                cameraInit();
                draw();
                break;
            case 'j':
                camera.C[0] += cameraLen;
                cameraInit();
                draw();
                break;
            case 'l':
                camera.C[0] -= cameraLen;
                cameraInit();
                draw();
                break;
            default:
                break;
        }
    });
};
