import { color } from "../objects/color.js";

// Model Parameters
class Model {
    points = [];
    faces = [];
    facesColor = [];

    constructor() {
        this.points = [];
        this.faces = [];
        this.facesColor = [];
    }

    colorInit() {
        for (let i = 0; i < this.faces.length; i++) {
            this.facesColor.push(new color(
                Math.floor(Math.random() * 256),
                Math.floor(Math.random() * 256),
                Math.floor(Math.random() * 256),
                255
            ));
        }
    }
}

export { Model }
