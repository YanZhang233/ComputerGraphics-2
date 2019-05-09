export const vecSubtract = (vec1, vec2) => {
    if (vec1.length !== vec2.length) {
        console.log('Invalid vector substraction');
        return;
    }
    return vec1.map((value, index) => value - vec2[index]);
};

export const vecAdd = (vec1, vec2) => {
    if (vec1.length !== vec2.length) {
        console.log('Invalid vector addition');
        return;
    }
    return vec1.map((value, index) => value + vec2[index]);
};

export const vecUnit = (vector) => {
    return vecScale(vector, 1 / vecAbs(vector));
};

export const vecScale = (vector, n) => {
    return vector.map(i => i * n);
};

export const vecAbs = (vector) => {
    return Math.sqrt(vector.reduce((pre, cur) => {
        return pre + cur * cur;
    }, 0));
};

export const vec3dDotMultiply = (vec1, vec2) => {
    return vec1[0] * vec2[0] + vec1[1] * vec2[1] + vec1[2] * vec2[2];
};

export const vec3dCrossMultiply = (vec1, vec2) => {
    return [
        vec1[1] * vec2[2] - vec2[1] * vec1[2],
        -(vec1[0] * vec2[2] - vec2[0] * vec1[2]),
        vec1[0] * vec2[1] - vec2[0] * vec1[1]
    ];
};

export const vecExtend = (vector) => {
    return [...vector, 1];
};

export const vecCollapse = (vector) => {
    let vec = Array.from(vector);
    let t = vec.pop();
    return vec.map(item => item / t);
};

export const matMultiply = (m1, m2) => {
    if (m1[0].length !== m2.length) {
        console.log('Cannot multiply these two matrices!');
        return null;
    }
    const [m, n, k] = [m1.length, m2.length, m2[0].length];
    // initialize m * k matrix with 0
    const newMatrix = [];
    for (let i = 0; i < m; i++) {
        newMatrix.push(Array.from({length: k}, _ => 0));
    }
    // multiply
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < k; j++) {
            for (let t = 0; t < n; t++) {
                newMatrix[i][j] += m1[i][t] * m2[t][j]
            }
        }
    }
    return newMatrix;
};

export const matMulVec = (matrix, vector) => {
    let [m, n] = [matrix.length, vector.length];
    const ret = Array.from({length: m}, _ => 0);
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            ret[i] += matrix[i][j] * vector[j];
        }
    }
    return ret;
};



