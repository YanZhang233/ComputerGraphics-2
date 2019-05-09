// edge
class edge {
    yStart;
    yMax;
    xStart;
    delta;
    zStart;
    zDeltaToY;
    normalStart;
    normalEnd;

    constructor(yStart, yMax, xStart, delta, zStart, zDeltaToY, normalStart, normalEnd) {
        this.yStart = yStart;
        this.yMax = yMax;
        this.xStart = xStart;
        this.delta = delta;
        this.zStart = zStart;
        this.zDeltaToY = zDeltaToY;
        this.normalStart = normalStart;
        this.normalEnd = normalEnd;
    }
}

export { edge };
