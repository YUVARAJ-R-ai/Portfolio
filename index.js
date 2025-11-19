document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION FOR TEXTURE GEN ---
    const TEXTURE_WIDTH = 4096;
    const TEXTURE_HEIGHT = 2048;
    const RED_LINE_COLOR = '#8B0000';
    const OCEAN_COLOR = '#0077be';
    const GRAND_LINE_COLOR = '#40E0D0'; 
    const CALM_BELT_COLOR = '#AFEEEE'; 
    const RETRO_OVERLAY_COLOR = 'rgba(150, 100, 50, 0.2)';

    // --- DATA SOURCE ---
    const projectData = [
        { category: "PROJECT", title: "Dockerized Maps API", type: "Backend Engineering", icon: "🗺️", desc: "Microservice Maps API using PostGIS & OSRM.", tech: "Docker, PostGIS, OSRM", color: 0xff5733, geometryType: "factory" },
        { category: "PROJECT", title: "Smart Irrigation", type: "IoT & AI", icon: "🌱", desc: "AI water control using ESP8266 & moisture sensors.", tech: "MicroPython, IoT", color: 0x2ecc71, geometryType: "nature" },
        { category: "PROJECT", title: "Camera DL API", type: "Computer Vision", icon: "📷", desc: "Real-time YOLOv8 integration via REST API.", tech: "Python, YOLOv8", color: 0x3498db, geometryType: "tech" },
        { category: "PROJECT", title: "Geospatial Vis", type: "Data Science", icon: "🌍", desc: "Vector mapping of Tamil Nadu blocks using QGIS.", tech: "QGIS, OpenStreetMap", color: 0x9b59b6, geometryType: "standard" },
        { category: "PROJECT", title: "Hackathon Finalist", type: "Achievement", icon: "🏆", desc: "National Finalist: GenAI Project (36 hrs).", tech: "GenAI, Team Lead", color: 0xe74c3c, geometryType: "treasure" }
    ];

    const skillData = [
        { category: "SKILL", title: "Python & C++", type: "Core Languages", icon: "🐍", desc: "Proficiency in Python for AI and C++ for systems.", tech: "Advanced Level", color: 0xffca28, geometryType: "monolith" },
        { category: "SKILL", title: "PostgreSQL", type: "Database", icon: "🐘", desc: "Complex queries and geospatial data management.", tech: "Database", color: 0x00acc1, geometryType: "storage" },
        { category: "SKILL", title: "Docker", type: "DevOps", icon: "🐳", desc: "Containerization and deployment workflows.", tech: "Infrastructure", color: 0x039be5, geometryType: "cube" },
        { category: "SKILL", title: "IoT Embedded", type: "Hardware", icon: "🔌", desc: "Arduino, ESP8266, and sensor integration.", tech: "Embedded Systems", color: 0x7cb342, geometryType: "gear" }
    ];

    const allIslandsData = [...projectData, ...skillData];

    // --- THREE.JS SETUP ---
    const container = document.getElementById('canvas-container');
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020205);
    scene.fog = new THREE.FogExp2(0x020205, 0.02);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 10, 22); // Matched to previous layout

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    container.appendChild(renderer.domElement);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 15;
    controls.maxDistance = 40;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    // --- LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
    sunLight.position.set(10, 10, 10);
    scene.add(sunLight);
    const rimLight = new THREE.DirectionalLight(0x4455ff, 1.0);
    rimLight.position.set(-5, 0, -5);
    scene.add(rimLight);

    // --- PROCEDURAL TEXTURE GENERATION ---
    // (Adapted from your provided code)
    function generateWorldTextures() {
        const canvasColor = document.createElement('canvas');
        const canvasHeight = document.createElement('canvas');
        canvasColor.width = canvasHeight.width = TEXTURE_WIDTH;
        canvasColor.height = canvasHeight.height = TEXTURE_HEIGHT;

        const ctxC = canvasColor.getContext('2d');
        const ctxH = canvasHeight.getContext('2d');

        // 1. Ocean & Base Height
        ctxC.fillStyle = OCEAN_COLOR;
        ctxC.fillRect(0, 0, TEXTURE_WIDTH, TEXTURE_HEIGHT);
        ctxH.fillStyle = '#000000';
        ctxH.fillRect(0, 0, TEXTURE_WIDTH, TEXTURE_HEIGHT);

        // 2. Grid (Subtle)
        ctxC.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctxC.lineWidth = 1;
        for(let i = 0; i <= 24; i++) {
            const x = (i / 24) * TEXTURE_WIDTH;
            ctxC.beginPath(); ctxC.moveTo(x, 0); ctxC.lineTo(x, TEXTURE_HEIGHT); ctxC.stroke();
        }
        for(let i = 0; i <= 12; i++) {
            const y = (i / 12) * TEXTURE_HEIGHT;
            ctxC.beginPath(); ctxC.moveTo(0, y); ctxC.lineTo(TEXTURE_WIDTH, y); ctxC.stroke();
        }

        // 3. GRAND LINE (Equator)
        const glCenterY = TEXTURE_HEIGHT / 2;
        const glWidth = TEXTURE_HEIGHT * 0.15;
        ctxC.fillStyle = CALM_BELT_COLOR;
        ctxC.fillRect(0, glCenterY - glWidth/2 - 20, TEXTURE_WIDTH, 20); // Top Belt
        ctxC.fillRect(0, glCenterY + glWidth/2, TEXTURE_WIDTH, 20);     // Bottom Belt

        // 4. RED LINE
        const redLineWidthBase = TEXTURE_WIDTH * 0.025;
        function drawRedLine(offsetX) {
            ctxC.fillStyle = RED_LINE_COLOR;
            ctxH.fillStyle = '#FFFFFF';
            ctxC.beginPath(); ctxH.beginPath();
            
            const segments = 200;
            const hStep = TEXTURE_HEIGHT / segments;
            let pointsLeft = [], pointsRight = [];

            for(let i=0; i<=segments; i++) {
                const y = i * hStep;
                const noise = (Math.sin(i * 0.2) * 10) + (Math.random() - 0.5) * 20;
                pointsLeft.push({x: offsetX - redLineWidthBase + noise, y: y});
                pointsRight.push({x: offsetX + redLineWidthBase + noise, y: y});
            }
            ctxC.moveTo(pointsLeft[0].x, pointsLeft[0].y); ctxH.moveTo(pointsLeft[0].x, pointsLeft[0].y);
            pointsLeft.forEach(p => { ctxC.lineTo(p.x, p.y); ctxH.lineTo(p.x, p.y); });
            for(let i = segments; i >= 0; i--) {
                ctxC.lineTo(pointsRight[i].x, pointsRight[i].y); ctxH.lineTo(pointsRight[i].x, pointsRight[i].y);
            }
            ctxC.closePath(); ctxC.fill(); ctxH.closePath(); ctxH.fill();
        }
        const rl1 = TEXTURE_WIDTH * 0.25;
        const rl2 = TEXTURE_WIDTH * 0.75;
        drawRedLine(rl1);
        drawRedLine(rl2);

        // 5. BACKGROUND ISLANDS (Texture only)
        const numIslands = 150;
        for(let i=0; i<numIslands; i++) {
            const isGrandLine = Math.random() > 0.3; 
            let x, y;
            if (isGrandLine) y = glCenterY + (Math.random() - 0.5) * glWidth * 0.8;
            else y = Math.random() * TEXTURE_HEIGHT;
            x = Math.random() * TEXTURE_WIDTH;

            if(Math.abs(x - rl1) < TEXTURE_WIDTH * 0.04 || Math.abs(x - rl2) < TEXTURE_WIDTH * 0.04) continue;

            const size = 10 + Math.random() * 30;
            ctxC.fillStyle = Math.random() > 0.5 ? '#A07A4A' : '#708050';
            ctxC.beginPath(); ctxC.arc(x, y, size, 0, Math.PI*2); ctxC.fill();
            ctxH.fillStyle = '#808080'; 
            ctxH.beginPath(); ctxH.arc(x, y, size, 0, Math.PI*2); ctxH.fill();
        }

        // 6. RETRO TINT
        ctxC.fillStyle = RETRO_OVERLAY_COLOR;
        ctxC.fillRect(0, 0, TEXTURE_WIDTH, TEXTURE_HEIGHT);

        return {
            color: new THREE.CanvasTexture(canvasColor),
            height: new THREE.CanvasTexture(canvasHeight)
        };
    }

    const textures = generateWorldTextures();

    // --- GLOBE GEOMETRY ---
    // We scale the radius up to 8 to match the previous scene logic (Camera z=22)
    // Displacement scale must be increased accordingly (0.08 * 8 = ~0.64)
    const globeRadius = 8;
    const geometry = new THREE.SphereGeometry(globeRadius, 512, 256); 
    const material = new THREE.MeshStandardMaterial({
        map: textures.color,
        displacementMap: textures.height,
        displacementScale: 0.6, 
        roughness: 0.6,
        metalness: 0.1,
    });
    const globe = new THREE.Mesh(geometry, material);
    scene.add(globe);

    // --- ATMOSPHERE ---
    const atmoGeometry = new THREE.SphereGeometry(globeRadius + 0.2, 64, 64);
    const atmoMaterial = new THREE.MeshPhongMaterial({
        color: 0x40E0D0,
        transparent: true,
        opacity: 0.15,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        shininess: 0
    });
    const atmosphere = new THREE.Mesh(atmoGeometry, atmoMaterial);
    scene.add(atmosphere);

    // --- STARS ---
    const starGeo = new THREE.BufferGeometry();
    const starCount = 2000;
    const starPos = new Float32Array(starCount * 3);
    for(let i=0; i<starCount*3; i++) starPos[i] = (Math.random() - 0.5) * 100;
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({color: 0xffffff, size: 0.2, transparent: true, opacity: 0.8}));
    scene.add(stars);

    // --- ACHIEVEMENT ISLANDS (3D) ---
    const islandsGroup = new THREE.Group();
    scene.add(islandsGroup);
    const clickableObjects = [];

    function createIslandMesh(data) {
        const group = new THREE.Group();
        const type = data.geometryType;
        const color = data.color;
        const isSkill = data.category === 'SKILL';

        // Base
        const baseColor = isSkill ? 0x455a64 : 0x8d6e63; 
        const baseMat = new THREE.MeshStandardMaterial({ color: baseColor, flatShading: true });
        const baseGeo = new THREE.CylinderGeometry(0.8, 0.4, 0.5, 7);
        const base = new THREE.Mesh(baseGeo, baseMat);
        base.position.y = 0.25;
        group.add(base);

        // Structure
        const topMat = new THREE.MeshStandardMaterial({ color: color, flatShading: true });

        if (type === 'monolith') {
            const obelisk = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.2, 0.3), topMat);
            obelisk.position.y = 0.8; group.add(obelisk);
        } else if (type === 'cube') {
            const cube = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.6), topMat);
            cube.position.y = 1.0; cube.rotation.set(Math.PI/4, Math.PI/4, 0); group.add(cube);
        } else if (type === 'storage') {
            const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.8, 8), topMat);
            tank.position.y = 0.8; group.add(tank);
        } else if (type === 'gear') {
            const gear = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.2, 8), topMat);
            gear.position.y = 0.8; gear.rotation.x = Math.PI/2; group.add(gear);
        } else if (type === 'factory') {
            const box = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.8, 0.4), topMat);
            box.position.y = 0.8; group.add(box);
            const stack = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1, 8), new THREE.MeshStandardMaterial({color: 0x555555}));
            stack.position.set(0.3, 0.8, 0); group.add(stack);
        } else if (type === 'nature') {
            const cone = new THREE.Mesh(new THREE.ConeGeometry(0.6, 1.2, 5), topMat);
            cone.position.y = 0.9; group.add(cone);
        } else if (type === 'tech') {
            const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.5), topMat);
            crystal.position.y = 1.0; group.add(crystal);
            const ring = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.05, 4, 8), new THREE.MeshBasicMaterial({color: 0xafeeee}));
            ring.rotation.x = Math.PI / 2; ring.position.y = 0.8; group.add(ring);
        } else {
            const house = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), topMat);
            house.position.y = 0.75; group.add(house);
            const roof = new THREE.Mesh(new THREE.ConeGeometry(0.5, 0.4, 4), new THREE.MeshStandardMaterial({color: 0x5d4037}));
            roof.position.y = 1.2; roof.rotation.y = Math.PI/4; group.add(roof);
        }
        return group;
    }

    // Placement Logic: Grand Line Belt
    const phi = Math.PI * (3 - Math.sqrt(5)); 
    
    allIslandsData.forEach((data, index) => {
        // Place strictly around equator (Lat 0) with some random variance for "Belt" feel
        // Longitude spread evenly
        const lonAngle = (index / allIslandsData.length) * Math.PI * 2;
        
        // Small latitude variation to keep them in the Grand Line strip
        // Grand Line is visually around Y center. In Spherical coords, that's Phi ~ PI/2.
        const latAngle = (Math.PI / 2) + (Math.random() - 0.5) * 0.2; // +/- variance

        // Radius slightly above globe surface + displacement
        const r = globeRadius + 0.2;

        const x = r * Math.sin(latAngle) * Math.cos(lonAngle);
        const y = r * Math.cos(latAngle);
        const z = r * Math.sin(latAngle) * Math.sin(lonAngle);

        const island = createIslandMesh(data);
        island.position.set(x, y, z);
        island.lookAt(0,0,0);
        island.rotateX(Math.PI/2); // Orient upwards
        
        // Hitbox
        const hitbox = new THREE.Mesh(new THREE.SphereGeometry(1.5, 8, 8), new THREE.MeshBasicMaterial({visible:false}));
        hitbox.position.copy(island.position);
        hitbox.userData = { ...data, parentGroup: island };
        
        islandsGroup.add(island);
        islandsGroup.add(hitbox);
        clickableObjects.push(hitbox);
    });

    document.getElementById('loading').style.display = 'none';

    // --- INTERACTION & TOUR ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hoveredObj = null;
    let isTouring = false;

    const cardInfo = document.getElementById('info-card');
    const cardCat = document.getElementById('card-category');
    const cardElements = {
        title: document.getElementById('card-title'),
        type: document.getElementById('card-type'),
        desc: document.getElementById('card-desc'),
        tech: document.getElementById('card-tech'),
        icon: document.getElementById('card-icon')
    };

    function showCard(data) {
         cardCat.innerText = data.category;
         cardElements.title.innerText = data.title;
         cardElements.type.innerText = data.type;
         cardElements.desc.innerText = data.desc;
         cardElements.tech.innerText = data.tech;
         cardElements.icon.innerText = data.icon;
         cardCat.parentElement.style.backgroundColor = data.category === 'SKILL' ? '#0277bd' : '#00695c'; // Blue vs Teal
         cardInfo.classList.remove('hidden-card');
         cardInfo.classList.add('visible-card');
    }

    function hideCard() {
        cardInfo.classList.remove('visible-card');
        cardInfo.classList.add('hidden-card');
    }

    function onMouseMove(event) {
        if(isTouring) return; 
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(clickableObjects);

        if (intersects.length > 0) {
            const hit = intersects[0].object;
            const data = hit.userData;
            document.body.style.cursor = 'pointer';
            controls.autoRotate = false;
            if (hoveredObj !== hit) {
                hoveredObj = hit;
                if(data.parentGroup) new TWEEN_Scale(data.parentGroup, 1.5);
                showCard(data);
            }
        } else {
            if (hoveredObj) {
                if(hoveredObj.userData.parentGroup) new TWEEN_Scale(hoveredObj.userData.parentGroup, 1);
            }
            document.body.style.cursor = 'default';
            controls.autoRotate = true;
            hoveredObj = null;
            hideCard();
        }
    }

    function TWEEN_Scale(object, targetScale) {
        const start = object.scale.x;
        const diff = targetScale - start;
        let startTime = null;
        const duration = 300;
        function anim(time) {
            if (!startTime) startTime = time;
            const progress = Math.min((time - startTime) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3); 
            const s = start + (diff * ease);
            object.scale.set(s, s, s);
            if (progress < 1) requestAnimationFrame(anim);
        }
        requestAnimationFrame(anim);
    }

    document.getElementById('start-tour-btn').addEventListener('click', startTour);

    function startTour() {
        if(isTouring) return;
        isTouring = true;
        controls.autoRotate = false;
        const btn = document.getElementById('start-tour-btn');
        btn.innerHTML = "⛵ SAILING...";
        btn.classList.remove('btn-pulse');
        
        let currentStep = 0;
        
        function visitNext() {
            if(currentStep >= clickableObjects.length) {
                isTouring = false;
                controls.autoRotate = true;
                btn.innerHTML = "⛵ START JOURNEY";
                btn.classList.add('btn-pulse');
                hideCard();
                return;
            }

            const targetObj = clickableObjects[currentStep];
            const data = targetObj.userData;
            const islandPos = targetObj.position.clone();
            // Calculate safe camera position: Vector from center to island, scaled
            const cameraTargetPos = islandPos.clone().normalize().multiplyScalar(22); 
            
            animateCamera(cameraTargetPos, 1200, () => {
                if(data.parentGroup) new TWEEN_Scale(data.parentGroup, 1.5);
                showCard(data);
                setTimeout(() => {
                    if(data.parentGroup) new TWEEN_Scale(data.parentGroup, 1);
                    hideCard();
                    currentStep++;
                    visitNext();
                }, 2500);
            });
        }
        visitNext();
    }

    function animateCamera(targetPos, duration, onComplete) {
        const startPos = camera.position.clone();
        let startTime = null;
        function anim(time) {
            if (!startTime) startTime = time;
            const progress = Math.min((time - startTime) / duration, 1);
            const ease = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
            camera.position.lerpVectors(startPos, targetPos, ease);
            camera.lookAt(0, 0, 0);
            if (progress < 1) requestAnimationFrame(anim);
            else if (onComplete) onComplete();
        }
        requestAnimationFrame(anim);
    }

    window.addEventListener('mousemove', onMouseMove);

    function animate() {
        requestAnimationFrame(animate);
        
        // Rotate globe & Atmosphere slightly differently for depth
        globe.rotation.y += 0.0005;
        atmosphere.rotation.y += 0.0007;
        
        // Rotate the islands group with the globe so they stick
        islandsGroup.rotation.y += 0.0005;
        
        // Sync hitbox positions (they are separate meshes)
        // Since hitboxes are children of scene, not islandsGroup in current structure (wait, actually hitboxes are added to islandsGroup in code above, but let's verify).
        // Ah, I added hitboxes to `islandsGroup` in the code: `islandsGroup.add(hitbox);`. Perfect.
        
        controls.update();
        
        if(!isTouring) {
            const rot = Math.abs(controls.getAzimuthalAngle() * 57.29).toFixed(0);
            document.getElementById('coordinates').innerText = `N 0° ${rot}' E`;
        } else {
            document.getElementById('coordinates').innerText = `Navigating Grand Line...`;
        }

        renderer.render(scene, camera);
    }

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });

    animate();
});