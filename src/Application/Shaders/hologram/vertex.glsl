uniform float uTime;

void main() {
    vec3 pos = position;

    // Unique speed modifier for each raindrop
    float speedModifier = fract(sin(dot(pos.xyz ,vec3(12.9898,78.233,45.164))) * 43758.5453);
    float speed = 200.0 + 100.0 * speedModifier; // Base speed + variation

    // Vertical movement with looping
    pos.y -= mod(uTime * speed + position.y, 4000.0); // Increase loop distance for better continuity

    // Horizontal sway with variability
    float swayAmount = 10.0 + 10.0 * speedModifier; // Base sway + variation
    pos.x += sin(uTime * 1.5 + position.y) * swayAmount; // Sway based on time, position, and modifier

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = 1.5 + 1.5 * speedModifier; // Varying size for a more dynamic look
}