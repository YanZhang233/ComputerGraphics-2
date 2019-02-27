// edge
class edge {
    yStart;
    yMax;
    xStart;
    delta;
    zUpper;
    zLower;
    constructor(yStart, yMax, xStart, delta, zUpper, zLower) {
        this.yStart = yStart;
        this.yMax = yMax;
        this.xStart = xStart;
        this.delta = delta;
        this.zUpper = zUpper;
        this.zLower = zLower;
    }
}

export { edge };
