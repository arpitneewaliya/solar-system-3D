// Create a scene
const scene = new THREE.Scene();

// Create starfield background
function createStarfield() {
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 1.5,
        sizeAttenuation: false
    });

    const starsVertices = [];
    for (let i = 0; i < 7000; i++) {
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
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(0, 10, 20);

// Create a WebGL renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000011);
document.body.appendChild(renderer.domElement);

// Handle window resizing
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// Planet information database
const planetInfo = {
    mercury: {
        name: "Mercury",
        diameter: "4,879 km",
        distance: "57.9 million km from Sun",
        day: "59 Earth days",
        year: "88 Earth days",
        moons: "0",
        facts: "Closest planet to the Sun. Extreme temperature variations from -170°C to 427°C.",
        composition: "Rocky planet with a large iron core"
    },
    venus: {
        name: "Venus",
        diameter: "12,104 km",
        distance: "108.2 million km from Sun",
        day: "243 Earth days",
        year: "225 Earth days",
        moons: "0",
        facts: "Hottest planet in our solar system with surface temperatures of 462°C.",
        composition: "Rocky planet with thick, toxic atmosphere"
    },
    earth: {
        name: "Earth",
        diameter: "12,756 km",
        distance: "149.6 million km from Sun",
        day: "24 hours",
        year: "365.25 days",
        moons: "1",
        facts: "The only known planet to harbor life. 71% of surface covered by water.",
        composition: "Rocky planet with nitrogen-oxygen atmosphere"
    },
    mars: {
        name: "Mars",
        diameter: "6,792 km",
        distance: "227.9 million km from Sun",
        day: "24.6 hours",
        year: "687 Earth days",
        moons: "2 (Phobos, Deimos)",
        facts: "Known as the Red Planet due to iron oxide on its surface.",
        composition: "Rocky planet with thin atmosphere, polar ice caps"
    },
    jupiter: {
        name: "Jupiter",
        diameter: "142,984 km",
        distance: "778.5 million km from Sun",
        day: "9.9 hours",
        year: "12 Earth years",
        moons: "95+ known moons",
        facts: "Largest planet in our solar system. Great Red Spot is a giant storm.",
        composition: "Gas giant made mostly of hydrogen and helium"
    },
    saturn: {
        name: "Saturn",
        diameter: "120,536 km",
        distance: "1.43 billion km from Sun",
        day: "10.7 hours",
        year: "29 Earth years",
        moons: "146+ known moons",
        facts: "Famous for its prominent ring system made of ice and rock particles.",
        composition: "Gas giant with lower density than water"
    },
    uranus: {
        name: "Uranus",
        diameter: "51,118 km",
        distance: "2.87 billion km from Sun",
        day: "17.2 hours",
        year: "84 Earth years",
        moons: "27+ known moons",
        facts: "Tilted 98° on its side. Has faint rings and methane in atmosphere.",
        composition: "Ice giant with water, methane, and ammonia ices"
    },
    neptune: {
        name: "Neptune",
        diameter: "49,528 km",
        distance: "4.5 billion km from Sun",
        day: "16.1 hours",
        year: "165 Earth years",
        moons: "16+ known moons",
        facts: "Windiest planet with speeds up to 2,100 km/h. Deep blue color from methane.",
        composition: "Ice giant similar to Uranus"
    },
    sun: {
        name: "Sun",
        diameter: "1,392,700 km",
        distance: "Center of Solar System",
        day: "25 days (equator)",
        year: "N/A",
        moons: "N/A",
        facts: "A G-type main-sequence star. Contains 99.86% of the Solar System's mass.",
        composition: "Plasma ball of hydrogen and helium undergoing nuclear fusion"
    }
};

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
const sunGeometry = new THREE.SphereGeometry(3, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({
    map: sunTexture,
    emissive: 0xffa500,
    emissiveIntensity: 0.5
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
sun.userData = { name: 'sun', clickable: true };
scene.add(sun);

// Create all planets
const planets = [];

// Planet data: [name, size, map, orbitRadius, orbitSpeed]
const planetData = [
    ['mercury', 0.15, mercuryTexture, 4.5, 0.02],
    ['venus', 0.22, venusTexture, 6.75, 0.015],
    ['earth', 0.25, earthTexture, 9, 0.012],
    ['mars', 0.20, marsTexture, 12, 0.008],
    ['jupiter', 0.8, jupiterTexture, 18, 0.005],
    ['saturn', 0.7, saturnTexture, 24, 0.003],
    ['uranus', 0.4, uranusTexture, 30, 0.002],
    ['neptune', 0.38, neptuneTexture, 36, 0.001]
];

// Create planets and their orbits
planetData.forEach((data, index) => {
    const [name, size, map, orbitRadius, orbitSpeed] = data;

    // Create planet
    const planetGeometry = new THREE.SphereGeometry(size, 16, 16);
    const planetMaterial = new THREE.MeshLambertMaterial({ map });
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);
    planet.userData = { name: name, clickable: true };
    scene.add(planet);

    // Create orbit
    const orbitGeometry = new THREE.RingGeometry(orbitRadius - 0.05, orbitRadius + 0.05, 64);
    const orbitMaterial = new THREE.MeshBasicMaterial({
        color: 0x888888,
        transparent: true,
        opacity: 0.6,
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
        baseOrbitSpeed: orbitSpeed, // Store original speed for reset
        speedMultiplier: 1.0, // Current speed multiplier
        angle: Math.random() * Math.PI * 2,
        name
    });
});

// Add Lighting
const pointLight = new THREE.PointLight(0xffffff, 3, 100);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

// Add ambient light for better visibility
const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
scene.add(ambientLight);

// Setup speed controls for planets
function setupSpeedControls() {
    planets.forEach(planet => {
        const slider = document.getElementById(`${planet.name}-speed`);
        const valueDisplay = document.getElementById(`${planet.name}-value`);
        
        if (slider && valueDisplay) {
            // Set initial value
            slider.value = planet.speedMultiplier;
            valueDisplay.textContent = planet.speedMultiplier.toFixed(1) + 'x';
            
            // Add event listener
            slider.addEventListener('input', (e) => {
                const multiplier = parseFloat(e.target.value);
                planet.speedMultiplier = multiplier;
                planet.orbitSpeed = planet.baseOrbitSpeed * multiplier;
                valueDisplay.textContent = multiplier.toFixed(1) + 'x';
            });
        }
    });
}

// Reset all planet speeds to 1.0x
function resetPlanetSpeeds() {
    planets.forEach(planet => {
        planet.speedMultiplier = 1.0;
        planet.orbitSpeed = planet.baseOrbitSpeed;
        
        const slider = document.getElementById(`${planet.name}-speed`);
        const valueDisplay = document.getElementById(`${planet.name}-value`);
        
        if (slider && valueDisplay) {
            slider.value = 1.0;
            valueDisplay.textContent = '1.0x';
        }
    });
}

// Setup control panel toggle
function setupControlPanel() {
    const panel = document.getElementById('controls-panel');
    const toggleBtn = document.getElementById('toggle-panel');
    
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            panel.classList.toggle('collapsed');
            toggleBtn.textContent = panel.classList.contains('collapsed') ? '→' : '←';
        });
    }
    
    // Setup reset speeds button
    const resetBtn = document.getElementById('reset-speeds');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetPlanetSpeeds);
    }
}

// Initialize all controls
setupSpeedControls();
setupControlPanel();

// Create planet info card
function createPlanetInfoCard() {
    const card = document.createElement('div');
    card.id = 'planetInfoCard';
    card.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.9);
        border: 2px solid #dd0a0a;
        border-radius: 15px;
        padding: 20px;
        color: white;
        font-family: Arial, sans-serif;
        max-width: 400px;
        z-index: 1000;
        display: none;
        backdrop-filter: blur(10px);
        box-shadow: 0 0 20px rgba(221, 10, 10, 0.5);
    `;

    document.body.appendChild(card);
    return card;
}

// Show planet information
function showPlanetInfo(planetName) {
    const card = document.getElementById('planetInfoCard') || createPlanetInfoCard();
    const info = planetInfo[planetName];

    if (!info) return;

    card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h2 style="margin: 0; color: #dd0a0a; font-size: 24px;">${info.name}</h2>
            <button id="closeCard" style="background: #dd0a0a; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer; font-size: 16px;">×</button>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
            <div><strong>Diameter:</strong> ${info.diameter}</div>
            <div><strong>Distance:</strong> ${info.distance}</div>
            <div><strong>Day Length:</strong> ${info.day}</div>
            <div><strong>Year Length:</strong> ${info.year}</div>
            <div><strong>Moons:</strong> ${info.moons}</div>
            <div><strong>Type:</strong> ${info.composition}</div>
        </div>
        <div style="margin-top: 15px;">
            <strong>Interesting Facts:</strong>
            <p style="margin: 5px 0; line-height: 1.4;">${info.facts}</p>
        </div>
    `;

    card.style.display = 'block';

    // Add close button functionality
    document.getElementById('closeCard').addEventListener('click', () => {
        card.style.display = 'none';
    });
}

// Hide planet info card
function hidePlanetInfo() {
    const card = document.getElementById('planetInfoCard');
    if (card) {
        card.style.display = 'none';
    }
}

// Raycaster for mouse interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Mouse click event
function onMouseClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const clickableObjects = [sun, ...planets.map(p => p.mesh)];
    const intersects = raycaster.intersectObjects(clickableObjects);

    if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        if (clickedObject.userData.clickable) {
            showPlanetInfo(clickedObject.userData.name);
        }
    }
}

// Add event listeners for mouse interaction
document.addEventListener('click', onMouseClick);

// Close card when clicking outside
document.addEventListener('click', (event) => {
    const card = document.getElementById('planetInfoCard');
    if (card && card.style.display === 'block') {
        if (!card.contains(event.target)) {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            const clickableObjects = [sun, ...planets.map(p => p.mesh)];
            const intersects = raycaster.intersectObjects(clickableObjects);

            if (intersects.length === 0) {
                hidePlanetInfo();
            }
        }
    }
});

// Close card with Escape key
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        hidePlanetInfo();
    }
});

// Simple mouse controls for camera
let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;
let cameraDistance = 20;
const minDistance = 5;
const maxDistance = 100;
let manualCameraControl = false;

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

        if (slider && valueDisplay) {
            slider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                valueDisplay.textContent = value;

                if (axis === 'X') cameraX = value;
                else if (axis === 'Y') cameraY = value;
                else if (axis === 'Z') cameraZ = value;

                manualCameraControl = true;
                updateCameraPosition();
            });
        }
    });
}

// Update camera position
function updateCameraPosition() {
    camera.position.set(cameraX, cameraY, cameraZ);
    camera.lookAt(0, 0, 0);
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
    const sliders = ['cameraX', 'cameraY', 'cameraZ'];
    const values = [cameraX, cameraY, cameraZ];
    
    sliders.forEach((sliderId, index) => {
        const slider = document.getElementById(sliderId);
        const valueDisplay = document.getElementById(`${sliderId}-value`);
        
        if (slider && valueDisplay) {
            slider.value = values[index];
            valueDisplay.textContent = values[index];
        }
    });

    manualCameraControl = true;
    updateCameraPosition();
}

// Make setCameraPreset available globally
window.setCameraPreset = setCameraPreset;

// Initialize camera controls
setupCameraControls();

document.addEventListener('wheel', (event) => {
    event.preventDefault();
    if (event.deltaY > 0) {
        cameraDistance = Math.min(maxDistance, cameraDistance + 2);
    } else {
        cameraDistance = Math.max(minDistance, cameraDistance - 2);
    }
});

let isPaused = false;

// Animate everything
function animate() {
    if (!isPaused) {
        requestAnimationFrame(animate);
    }

    if (!isPaused) {
        // Rotate the Sun
        sun.rotation.y += 0.004;

        planets.forEach(planet => {
            // Update orbit angle using current speed
            planet.angle += planet.orbitSpeed;

            // Update planet position
            planet.mesh.position.x = Math.cos(planet.angle) * planet.orbitRadius;
            planet.mesh.position.z = Math.sin(planet.angle) * planet.orbitRadius;

            // Rotate planet on its axis
            planet.mesh.rotation.y += 0.01;
        });

        // Camera movement
        if (manualCameraControl) {
            camera.position.set(cameraX, cameraY, cameraZ);
            camera.lookAt(0, 0, 0);
        } else {
            targetX = mouseX * 0.001;
            targetY = mouseY * 0.001;

            camera.position.x += (targetX - camera.position.x) * 0.05;
            camera.position.y += (-targetY - camera.position.y) * 0.05;

            const currentDistance = camera.position.distanceTo(scene.position);
            if (Math.abs(currentDistance - cameraDistance) > 0.1) {
                const direction = camera.position.clone().normalize();
                camera.position.copy(direction.multiplyScalar(cameraDistance));
            }

            camera.lookAt(scene.position);
        }
    }
    renderer.render(scene, camera);
}
animate();

function pauseAnimation() {
    isPaused = true;
}

function resumeAnimation() {
    if (isPaused) {
        isPaused = false;
        animate();
    }
}

window.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        if (isPaused) {
            resumeAnimation();
        } else {
            pauseAnimation();
        }
    }
});

// Setup play/pause buttons
const playBtn = document.querySelector("#play-btn");
const pauseBtn = document.querySelector("#pause-btn");

if (pauseBtn) {
    pauseBtn.addEventListener('click', function() {
        pauseAnimation();
    });
}

if (playBtn) {
    playBtn.addEventListener('click', function() {
        resumeAnimation();
    });
}