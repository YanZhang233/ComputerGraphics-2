// edge
class edge {
    // yStart;     // same as the edge index in the edge table
    // yMax;       // upper point y
    //
    // xStart;     // correspond to yStart
    // delta;      // delta x / delta y
    //
    // zStart;         // for zBuffer yIncreament
    // zDeltaToY;
    //
    // normalStart;    // vector3d
    // normalEnd;      // vector3d
    //
    // // [double, double]
    // textureStart;
    // textureDeltaToY;

    constructor(yStart, yMax, xStart, delta, zStart, zDeltaToY, normalStart, normalEnd, textureStart, textureDeltaToY) {
        this.yStart = yStart;
        this.yMax = yMax;
        this.xStart = xStart;
        this.delta = delta;
        this.zStart = zStart;
        this.zDeltaToY = zDeltaToY;
        this.normalStart = normalStart;
        this.normalEnd = normalEnd;
        this.textureStart = textureStart;
        this.textureDeltaToY = textureDeltaToY;
    }
}

export { edge };
