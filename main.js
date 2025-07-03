// Create a scene
const scene = new THREE.Scene();

// Create starfield background
function createStarfield() {
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 2,
        sizeAttenuation: false
    });

    const starsVertices = [];
    for (let i = 0; i < 10000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField);
}
createStarfield();

// Create a perspective camera
const camera = new THREE.PerspectiveCamera(
    75, // Field of view
    window.innerWidth / window.innerHeight, // Aspect ratio
    0.1, // Near clipping plane
    1000 // Far clipping plane
);
camera.position.set(0, 10, 20); // Better viewing angle for full solar system


// Create a WebGL renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000011); // Dark space background
document.body.appendChild(renderer.domElement);


// Handle window resizing
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});



const textureLoader = new THREE.TextureLoader();
const sunTexture = textureLoader.load('./public/sun_texture.jpg');
const mercuryTexture = textureLoader.load('./public/mercury_texture.jpg');
const venusTexture = textureLoader.load('./public/venus_texture.jpg');
const earthTexture = textureLoader.load('./public/earth_texture.jpg');
const marsTexture = textureLoader.load('./public/mars_texture.jpg');
const jupiterTexture = textureLoader.load('./public/jupiter_texture.jpg');
const saturnTexture = textureLoader.load('./public/saturn_texture.jpg');
const uranusTexture = textureLoader.load('./public/uranus_texture.jpg');
const neptuneTexture = textureLoader.load('./public/neptune_texture.jpg');



// Create Sun
const sunGeometry = new THREE.SphereGeometry(1, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({
    map: sunTexture,
    emissive: 0xffa500,
    emissiveIntensity: 0.5
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Create all planets
const planets = [];

// Planet data: [name, size, color, orbitRadius, orbitSpeed]
const planetData = [
    ['mercury', 0.15, mercuryTexture, 3, 0.02],      // Mercury - small, brown
    ['venus', 0.22, venusTexture, 4.5, 0.015],     // Venus - yellow
    ['earth', 0.25, earthTexture, 6, 0.012],       // Earth - blue
    ['mars', 0.20, marsTexture, 8, 0.008],        // Mars - red
    ['jupiter', 0.8, jupiterTexture, 12, 0.005],     // Jupiter - large, tan
    ['saturn', 0.7, saturnTexture, 16, 0.003],      // Saturn - pale yellow
    ['uranus', 0.4, uranusTexture, 20, 0.002],      // Uranus - cyan
    ['neptune', 0.38, neptuneTexture, 24, 0.001]     // Neptune - blue
];

// Create planets and their orbits
planetData.forEach((data, index) => {
    const [name, size, map, orbitRadius, orbitSpeed] = data;

    // Create planet
    const planetGeometry = new THREE.SphereGeometry(size, 16, 16);
    const planetMaterial = new THREE.MeshLambertMaterial({ map });
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);
    scene.add(planet);

    // Create orbit ring - make it more visible
    const orbitGeometry = new THREE.RingGeometry(orbitRadius - 0.05, orbitRadius + 0.05, 64);
    const orbitMaterial = new THREE.MeshBasicMaterial({
        color: 0x888888, // Brighter gray
        transparent: true,
        opacity: 0.6, // Much more visible
        side: THREE.DoubleSide
    });
    const orbitRing = new THREE.Mesh(orbitGeometry, orbitMaterial);
    orbitRing.rotation.x = Math.PI / 2;
    scene.add(orbitRing);

    // Store planet data
    planets.push({
        mesh: planet,
        orbitRadius,
        orbitSpeed,
        angle: Math.random() * Math.PI * 2, // Random starting position
        name
    });
});

// Add Lighting
const pointLight = new THREE.PointLight(0xffffff, 3, 100); // Increased intensity and distance
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

// Add ambient light for better visibility
const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
scene.add(ambientLight);

// Simple mouse controls for camera
let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;
let cameraDistance = 20; // Current zoom distance
const minDistance = 5;   // Closest zoom
const maxDistance = 100; // Furthest zoom
let manualCameraControl = false; // Track if user is manually controlling camera

// Camera position variables
let cameraX = 0, cameraY = 10, cameraZ = 20;

document.addEventListener('mousemove', (event) => {
    if (!manualCameraControl) {
        mouseX = (event.clientX - window.innerWidth / 2) / 100;
        mouseY = (event.clientY - window.innerHeight / 2) / 100;
    }
});

// Create camera control listeners
function setupCameraControls() {
    ['X', 'Y', 'Z'].forEach(axis => {
        const slider = document.getElementById(`camera${axis}`);
        const valueDisplay = document.getElementById(`camera${axis}-value`);

        slider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            valueDisplay.textContent = value;

            // Update camera position
            if (axis === 'X') cameraX = value;
            else if (axis === 'Y') cameraY = value;
            else if (axis === 'Z') cameraZ = value;

            manualCameraControl = true;
            updateCameraPosition();
        });
    });
}

// Update camera position
function updateCameraPosition() {
    camera.position.set(cameraX, cameraY, cameraZ);
    camera.lookAt(0, 0, 0); // Always look at the center (Sun)
}

// Camera preset positions
function setCameraPreset(preset) {
    switch (preset) {
        case 'top':
            cameraX = 0; cameraY = 50; cameraZ = 5;
            break;
        case 'side':
            cameraX = 40; cameraY = 0; cameraZ = 0;
            break;
        case 'angle':
            cameraX = 15; cameraY = 20; cameraZ = 25;
            break;
        case 'close':
            cameraX = 3; cameraY = 3; cameraZ = 8;
            break;
    }

    // Update sliders
    document.getElementById('cameraX').value = cameraX;
    document.getElementById('cameraY').value = cameraY;
    document.getElementById('cameraZ').value = cameraZ;
    document.getElementById('cameraX-value').textContent = cameraX;
    document.getElementById('cameraY-value').textContent = cameraY;
    document.getElementById('cameraZ-value').textContent = cameraZ;

    manualCameraControl = true;
    updateCameraPosition();
}

// Initialize camera controls
setupCameraControls();


// Smooth zoom with mouse wheel (bonus!)
document.addEventListener('wheel', (event) => {
    event.preventDefault();
    if (event.deltaY > 0) {
        // Scroll down - zoom out
        cameraDistance = Math.min(maxDistance, cameraDistance + 2);
    } else {
        // Scroll up - zoom in
        cameraDistance = Math.max(minDistance, cameraDistance - 2);
    }
});

// Animate everything
function animate() {
    requestAnimationFrame(animate);

    // Rotate the Sun
    sun.rotation.y += 0.005;

    // Update all planets' orbital positions
    planets.forEach(planet => {
        // Update orbit angle
        planet.angle += planet.orbitSpeed;

        // Calculate new position
        planet.mesh.position.x = Math.cos(planet.angle) * planet.orbitRadius;
        planet.mesh.position.z = Math.sin(planet.angle) * planet.orbitRadius;

        // Rotate planet on its axis
        planet.mesh.rotation.y += 0.01;
    });

    // Camera movement - use manual control if sliders are being used
    if (manualCameraControl) {
        // Manual camera control via sliders
        camera.position.set(cameraX, cameraY, cameraZ);
        camera.lookAt(0, 0, 0);
    } else {
        // Original mouse-based camera movement
        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;

        camera.position.x += (targetX - camera.position.x) * 0.05;
        camera.position.y += (-targetY - camera.position.y) * 0.05;

        // Update camera distance (zoom)
        const currentDistance = camera.position.distanceTo(scene.position);
        if (Math.abs(currentDistance - cameraDistance) > 0.1) {
            const direction = camera.position.clone().normalize();
            camera.position.copy(direction.multiplyScalar(cameraDistance));
        }

        camera.lookAt(scene.position);
    }

    renderer.render(scene, camera);
}
animate();
