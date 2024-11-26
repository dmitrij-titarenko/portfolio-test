// Get the container element
const container = document.getElementById('webgl-overlay');

// Create the renderer
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
});

// Set the renderer size to the window size initially
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// Create the scene
const scene = new THREE.Scene();

// Create an orthographic camera
const camera = new THREE.OrthographicCamera(
    window.innerWidth / -2, // left
    window.innerWidth / 2,  // right
    window.innerHeight / 2, // top
    window.innerHeight / -2, // bottom
    -1000, // near
    1000 // far
);
camera.position.z = 1;
scene.add(camera);

// Get the video element and create a texture
const video = document.querySelector('.background-video');
const videoTexture = new THREE.VideoTexture(video);
videoTexture.minFilter = THREE.LinearFilter;
videoTexture.magFilter = THREE.LinearFilter;
videoTexture.format = THREE.RGBFormat;

// Define uniforms
const uniforms = {
    videoTexture: { value: videoTexture },
    mouse: { value: new THREE.Vector2(0.5, 0.5) },
    time: { value: 0 },
    resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
};

// Vertex shader
const vertexShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = `
uniform sampler2D videoTexture;
uniform vec2 mouse;
uniform float time;
uniform vec2 resolution; // Added resolution uniform
varying vec2 vUv;

// Simplex noise function (advanced)
vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
    return mod289(((x*34.0)+1.0)*x);
}

float simplexNoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                        0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                       -0.577350269189626,  // -1.0 + 2.0 * C.x
                        0.024390243902439); // 1.0 / 41.0
    // First corner
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);

    // Other corners
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;

    // Permutations
    i = mod289(i); // Avoid truncation effects in permutation
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                   + i.x + vec3(0.0, i1.x, 1.0));

    vec3 m = max(0.5 - vec3(
        dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)
    ), 0.0);
    m = m * m;
    m = m * m;

    // Gradients: 41 points uniformly over a unit circle.
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;

    // Normalize gradients implicitly by scaling m
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);

    // Compute final noise value at P
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

void main() {
    vec2 uv = vUv;

    // Calculate the aspect ratio
    float aspect = resolution.x / resolution.y;

    // Adjust the UV coordinates for aspect ratio correction
    vec2 diff = uv - mouse;
    diff.x *= aspect;
    float distToMouse = length(diff);

    float mouseEffect = smoothstep(0.35, 0.0, distToMouse);

    // Turbulence calculation
    vec2 turbulence = vec2(
        simplexNoise(uv * 3.0 + time * 0.1),
        simplexNoise(uv * 1.5 - time * 0.1)
    ) * 0.25;

    turbulence += vec2(
        simplexNoise(uv * 1.5 + time * 0.05),
        simplexNoise(uv * 3.0 - time * 0.05)
    ) * 0.2;

    uv += turbulence * (0.1 - mouseEffect);

    vec4 color = texture2D(videoTexture, uv);

    vec3 black = vec3(0.0, 0.0, 0.0);
    vec3 green = vec3(0.0, 0.1, 0.1);
    vec3 blendedColor = mix(black, green, mouseEffect);

    color.rgb = color.rgb * (1.0 - mouseEffect) + blendedColor * mouseEffect;

    gl_FragColor = color;
}
`;

        // Create the shader material
const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
});

// Create the plane geometry to match the window size
const geometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight);
const plane = new THREE.Mesh(geometry, material);
scene.add(plane);

// Mouse interaction variables
let targetMouseX = 0;
let targetMouseY = 0;
let currentMouseX = 0;
let currentMouseY = 0;
const smoothness = 0.05;

// Initial mouse position
window.addEventListener('load', () => {
    targetMouseX = 0.5;
    targetMouseY = 0.5;
});

// Mouse move event
window.addEventListener('mousemove', (event) => {
    const rect = renderer.domElement.getBoundingClientRect();
    targetMouseX = (event.clientX - rect.left) / rect.width;
    targetMouseY = 1 - ((event.clientY - rect.top) / rect.height);
});

// Update mouse position
function updateMousePosition() {
    currentMouseX += (targetMouseX - currentMouseX) * smoothness;
    currentMouseY += (targetMouseY - currentMouseY) * smoothness;
    uniforms.mouse.value.x = currentMouseX;
    uniforms.mouse.value.set(currentMouseX, currentMouseY);
}

// Ensure the video is updating continuously
videoTexture.needsUpdate = true;

// Handle window resizing
window.addEventListener('resize', () => {
    // Resize the renderer to the window's current dimensions
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Update the camera's projection matrix
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // Update the plane geometry if necessary
    plane.geometry.dispose();
    plane.geometry = new THREE.PlaneGeometry(2, 2);

    // Update the resolution uniform
    uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
});

let lastTime = performance.now();

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    const now = performance.now();
    const delta = (now - lastTime) / 1000; // Time delta in seconds
    lastTime = now;

    // Update uniforms
    uniforms.time.value += delta;
    updateMousePosition();

    // Update the video texture
    if (video.readyState >= video.HAVE_CURRENT_DATA) {
        videoTexture.needsUpdate = true;
    }

    renderer.render(scene, camera);
}

animate();