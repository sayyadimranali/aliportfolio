// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

/**
 * 1. THREE.JS HERO SECTION
 * Creating a dynamic particle field that reacts to the mouse
 */
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#hero-canvas'), alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);

// Particle Geometry
const particlesGeometry = new THREE.BufferGeometry();
const count = 5000;
const positions = new Float32Array(count * 3);

for(let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

// Particle Material
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.015,
    color: '#00f2ff'
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);
camera.position.z = 3;

// Mouse Interaction
let mouseX = 0;
let mouseY = 0;
document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) - 0.5;
    mouseY = (e.clientY / window.innerHeight) - 0.5;
    
    // Custom Cursor Movement
    gsap.to('.cursor', { x: e.clientX, y: e.clientY, duration: 0.2 });
});

function animate() {
    requestAnimationFrame(animate);
    particlesMesh.rotation.y += 0.001;
    particlesMesh.rotation.x += (mouseY * 0.05);
    particlesMesh.rotation.y += (mouseX * 0.05);
    renderer.render(scene, camera);
}
animate();

/**
 * 2. GSAP SCROLL ANIMATIONS
 * Triggering entry animations for sections
 */
gsap.from(".section-title", {
    scrollTrigger: {
        trigger: ".section-title",
        start: "top 80%",
    },
    opacity: 0,
    y: 50,
    duration: 1,
    stagger: 0.2
});

// Skills Progress Bar Animation
const progressBars = document.querySelectorAll('.progress');
progressBars.forEach(bar => {
    ScrollTrigger.create({
        trigger: bar,
        onEnter: () => {
            bar.style.width = bar.getAttribute('data-done');
            bar.style.transition = 'width 1.5s ease-in-out';
        }
    });
});

/**
 * 3. UI LOGIC (Loaders, Nav, Form)
 */
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    gsap.to(loader, { opacity: 0, duration: 1, onComplete: () => loader.style.display = 'none' });
});

// Hamburger Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('toggle');
});

// Smooth Scroll for Nav Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Form Submission Feedback
const form = document.getElementById('contact-form');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert("Message Sent! Thank you for reaching out.");
    form.reset();
});
