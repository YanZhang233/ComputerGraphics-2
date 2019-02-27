import { color } from "../objects/color.js";

// Model Parameters
export const model = {
    pointsNum: 0,
    facesNum: 0,
    points: [],
    faces: [],
    facesColor: []
};

export const colorInit = () => {
    for (let i = 0; i < model.faces.length; i++) {
        model.facesColor.push(new color(
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * 256),
            255
        ));
    }
};
