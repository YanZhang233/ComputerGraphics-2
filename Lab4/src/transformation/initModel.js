import { model, colorInit } from "../objects/model.js";
import {normalizeFace, computeScenePointNormal} from "../objects/model.js";
import {lights} from "../objects/lights.js";
import {textureMap} from "../objects/model.js";

export const initModel = (uploadedFile, draw) => {
    const file = uploadedFile.files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
        const data = reader.result;
        parseFile(data);
        colorInit(true, lights);
        computeScenePointNormal();
        textureMap();
        draw();
    };
};

const parseFile = (data) => {
    let lines = data.match(/[^\r\n]+/g);
    let [num, pointsNum, facesNum] = lines[0].trim().split(/\s+/);

    // Cause in some file, there are just two number in first line
    if(facesNum === undefined) {
        facesNum = pointsNum;
        pointsNum = num;
    }

    const pNum = parseInt(pointsNum, 10);
    const fNum = parseInt(facesNum, 10);
    // load data to model
    const lastModelPNum = model.points.length;

    for (let i = 1; i <= pNum; i++) {
        let [x, y, z] = lines[i].trim().split(/\s+/);
        model.points.push([parseFloat(x), parseFloat(y), parseFloat(z)]);
        model.pointsNormal.push([0, 0, 0]);
    }

    for (let i = pNum + 1; i <= pNum + fNum; i++) {
        let [num, ...res] = lines[i].trim().split(/\s+/);
        if (res.length > 2) {
            model.faces.push(res.map(x => parseInt(x, 10) - 1 + lastModelPNum));
            model.facesNormal.push(normalizeFace(model.faces.length - 1));
        }
    }
};

