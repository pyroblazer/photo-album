import React from 'react';
import './Gallery.css';
import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import { table } from './constants';

const Gallery = () => {
    let isSlideOn = 0;
    let camera, scene, controls;
    let renderer = new CSS3DRenderer();
    const objects = [];
    const targets = { table: [], rand_pos: [] };
    let jk = 0;
    const isInitializedRef = React.useRef(false);
    let currPos = null;

    const init = () => {
        if (!isInitializedRef.current) {
            setupCamera();
            setupScene();
            createPanElement();
            prepareObjects();
            prepareRandomPositions();
            setupRenderer();
            setupControls();
            setupSlideButtons();
            window.onload = () => {
                transform(targets.rand_pos, 2000);
                slideShow();
            };
            window.addEventListener('resize', onWindowResize);

            isInitializedRef.current = true;
        }
    };

    // Create the camera
    const setupCamera = () => {
        camera = camera || new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.z = 3000;
    };

    // Create the scene and add the showing pan
    const setupScene = () => {
        scene = scene || new THREE.Scene();
    };

    const createPanElement = () => {
        const element = document.createElement('div');
        element.className = 'element';
        element.style.backgroundColor = `rgba(0,0,0,${Math.random() * 0.25 + 0.05})`;

        const objectCSS = new CSS3DObject(element);
        objectCSS.position.set(0, 0, 2599);
        scene.add(objectCSS);
    };

    // Set background image and get average color
    const setElementBackgroundImage = (element, i) => {
        let rgbaImgAvg;
        const photo = document.createElement('img');
        photo.className = 'center';
        photo.id = `img${i / 5}`;
        photo.src = table[i];
        photo.onload = () => {
            rgbaImgAvg = getAverageRGB(photo);
            element.style.backgroundColor = `rgba(${rgbaImgAvg.r},${rgbaImgAvg.g},${rgbaImgAvg.b},${Math.random() * 0.5 + 0.25})`;
        };
        element.appendChild(photo);
    };

    // Create an element for the object based on table data
    const createObjectElement = (i) => {
        const element = document.createElement('div');
        element.className = 'element';
        element.id = i / 5;
        element.style.backgroundColor = `rgba(0,127,127,${Math.random() * 0.5 + 0.25})`;
        setElementBackgroundImage(element, i);

        const details = document.createElement('div');
        details.className = 'details';
        details.innerHTML = `${table[i + 1]}<br>${table[i + 2]}`;
        details.id = `${i}-details`
        element.appendChild(details);

        const objectCSS = new CSS3DObject(element);
        return objectCSS;
    };

    // Set random position for the CSS3DObject
    const setRandomPosition = (objectCSS) => {
        objectCSS.position.x = Math.random() * 4000 - 2000;
        objectCSS.position.y = Math.random() * 4000 - 2000;
        objectCSS.position.z = Math.random() * 4000 - 2000;
    };

    // Prepare objects based on table data
    const prepareObjects = () => {
        jk++;
        console.log(jk);
        for (let i = 0; i < table.length; i += 5) {
            const objectCSS = createObjectElement(i);
            setRandomPosition(objectCSS);
            console.log(objectCSS)
            scene.add(objectCSS);
            objectCSS.element.addEventListener('pointerdown', function () {
                console.log(this.id);
                console.log(targets['rand_pos'][this.id].position);
                let pos = targets['rand_pos'][this.id].position;
        
                // Your position transformation logic here
                let k = 0 - pos.x;
                let l = 0 - pos.y;
                let m = 2600 - pos.z;
        
                for (let i = 0; i < objects.length; i++) {
                    targets.rand_pos[i].position.x += k;
                    targets.rand_pos[i].position.y += l;
                    targets.rand_pos[i].position.z += m;
        
                    // Your additional logic for handling position boundaries here
                }
        
                transform(targets.rand_pos, 2000);
            });            
            objects.push(objectCSS);
            const object = new THREE.Object3D();
            object.position.x = (table[i + 3] * 140) - 1330;
            object.position.y = - (table[i + 4] * 180) + 990;
            targets.table.push(object);
        }
    };

    // Prepare random positions for objects
    const prepareRandomPositions = () => {
        for (let i = 0; i < objects.length; i++) {
            const object = new THREE.Object3D();
            setRandomPosition(object);
            targets.rand_pos.push(object);
        }
    };

    // Set up the CSS3DRenderer
    const setupRenderer = () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('container').appendChild(renderer.domElement);
    };

    // Set up the TrackballControls
    const setupControls = () => {
        controls = new TrackballControls(camera, renderer.domElement);
        controls.minDistance = 500;
        controls.maxDistance = 6000;
        controls.addEventListener('change', render);
    };

    function slideShow() {
        let u, v, w = 0, mscore = 100000, score;

        for (let i = 0; i < objects.length; i++) {
            score = Math.abs(targets.rand_pos[i].position.x) + Math.abs(targets.rand_pos[i].position.y) + Math.abs(targets.rand_pos[i].position.z - 1000);
            if (score !== 1600 && mscore > score) {//targets.rand_pos[i].position.z>w  && targets.rand_pos[i].position.z<2100){
                mscore = score;
                u = targets.rand_pos[i].position.x;
                v = targets.rand_pos[i].position.y;
                w = targets.rand_pos[i].position.z;
            }
        }
        let k = 0 - u;
        let l = 0 - v;
        let m = 2600 - w;
        for (let i = 0; i < objects.length; i++) {
            targets.rand_pos[i].position.x += k;
            targets.rand_pos[i].position.y += l;
            targets.rand_pos[i].position.z += m;

            if (targets.rand_pos[i].position.x > 2600) targets.rand_pos[i].position.x -= 6000;
            if (targets.rand_pos[i].position.y > 2600) targets.rand_pos[i].position.y -= 6000;
            if (targets.rand_pos[i].position.z > 2600) targets.rand_pos[i].position.z -= 6000;

        }
        transform(targets.rand_pos, 2000);
        if (isSlideOn === 1) {
            setTimeout(slideShow, 4000);
        }
    }

    function randSlideShow() {
        let u, v, w;
        var pos = null;
        while (pos === currPos) pos = Math.floor((Math.random() * 4000) % objects.length);
        
        u = targets.rand_pos[pos].position.x;
        v = targets.rand_pos[pos].position.y;
        w = targets.rand_pos[pos].position.z;

        let k = 0 - u;
        let l = 0 - v;
        let m = 2600 - w;
        for (let i = 0; i < objects.length; i++) {
            targets.rand_pos[i].position.x += k;//Math.random() * 4000 - 2000;
            targets.rand_pos[i].position.y += l;//Math.random() * 4000 - 2000;
            targets.rand_pos[i].position.z += m;//Math.random() * 4000 - 2000;

            if (targets.rand_pos[i].position.x > 2600) targets.rand_pos[i].position.x -= 6000;
            if (targets.rand_pos[i].position.y > 2600) targets.rand_pos[i].position.y -= 6000;
            if (targets.rand_pos[i].position.z > 2600) targets.rand_pos[i].position.z -= 6000;

        }
        transform(targets.rand_pos, 2000);
        if (isSlideOn === 1) {
            setTimeout(randSlideShow, 4000);
        }
    }

    // Set up slide buttons
    const setupSlideButtons = () => {
        const buttonSlideShow = document.getElementById('slide');
        buttonSlideShow.addEventListener('click', () => {
            if (isSlideOn === 0) {
                isSlideOn = 1;
                slideShow();
            } else {
                isSlideOn = 0;
            }
        });

        const buttonRandSlideShow = document.getElementById('random_slide');
        buttonRandSlideShow.addEventListener('click', () => {
            if (isSlideOn === 0) {
                isSlideOn = 1;
                randSlideShow();
            } else {
                isSlideOn = 0;
            }
        });
    };

    function transform(targets, duration) {
        TWEEN.removeAll();
        for (let i = 0; i < objects.length; i++) {
            const object = objects[i];
            const target = targets[i];
            new TWEEN.Tween(object.position)
                .to({ x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration)
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();
            new TWEEN.Tween(object.rotation)
                .to({ x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration)
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();
        }
        new TWEEN.Tween(this)
            .to({}, duration * 2)
            .onUpdate(render)
            .start();
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        render();
    }

    function animate() {
        requestAnimationFrame(animate);
        TWEEN.update();
        controls.update();
    }

    function render() {
        renderer.render(scene, camera);
    }

    function getAverageRGB(imgEl) {
        imgEl.setAttribute('crossOrigin', '');

        var blockSize = 5, // only visit every 5 pixels
            defaultRGB = { r: 127, g: 255, b: 255 }, // for non-supporting envs
            canvas = document.createElement('canvas'),
            context = canvas.getContext && canvas.getContext('2d'),
            data, width, height,
            i = -4,
            length,
            rgb = { r: 0, g: 0, b: 0 },
            count = 0;

        if (!context) {
            console.log("get Average color is not supported!");
            return defaultRGB;
        }

        height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
        width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

        context.drawImage(imgEl, 0, 0);

        try {
            data = context.getImageData(0, 0, width, height);
        } catch (e) {
            /* security error, img on diff domain *///alert('x');
            return defaultRGB;
        }

        length = data.data.length;

        while ((i += blockSize * 4) < length) {
            ++count;
            rgb.r += data.data[i];
            rgb.g += data.data[i + 1];
            rgb.b += data.data[i + 2];
        }

        // ~~ used to floor values
        rgb.r = ~~(rgb.r / count);
        rgb.g = ~~(rgb.g / count);
        rgb.b = ~~(rgb.b / count);
        return rgb;

    }

    React.useEffect(() => {
        init();
        animate();
        render();
    }, [])

    return (
        <>
            <div id="info">
                <a href="https://threejs.org" target="_blank" rel="noopener">three.js</a>
                Three - Photo Album
            </div>
            <div id="container">
            </div>
            <div id="menu">
                <button id="slide">SlideShow (Closest)</button>
                <button id="random_slide">Random SlideShow</button>
            </div>
        </>
    )
}

export default Gallery;
