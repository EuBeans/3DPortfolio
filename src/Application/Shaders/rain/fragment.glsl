
uniform float uTime;

void dropEffect(vec2 uv, float time, out vec4 color) {
    float wave = sin(uv.y * 25.0 + time * 5.0) * 0.5 + 0.5;
    float drop = smoothstep(0.4, 0.0, uv.y) * wave;
    color = vec4(vec3(drop), 1.0);
}

void main() {
    vec2 uv = gl_PointCoord - vec2(0.5, 0.5);
    float time = uTime * 0.5;
    vec4 color;
    dropEffect(uv, time, color);
    gl_FragColor = color;
}



