document.addEventListener('DOMContentLoaded', () => {

    // 1. Navigation Scrolled State & Currency Toggle
    const navbar = document.querySelector('.navbar');
    if(navbar) {
        let navbarTimeout;
        const showNavbar = () => {
            navbar.classList.add('visible');
            clearTimeout(navbarTimeout);
            navbarTimeout = setTimeout(() => {
                if (!navbar.matches(':hover')) {
                    navbar.classList.remove('visible');
                }
            }, 2000);
        };

        window.addEventListener('scroll', () => {
            showNavbar();
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        document.addEventListener('mousemove', showNavbar);
        showNavbar(); // Initially show
    }

    const toggleBtn = document.getElementById('currency-toggle');
    const spanKrw = document.querySelector('.currency-krw');
    const spanUsd = document.querySelector('.currency-usd');
    const priceTags = document.querySelectorAll('.price-tag');
    let currentCurrency = 'KRW';

    if(toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            if (currentCurrency === 'KRW') {
                currentCurrency = 'USD';
                spanKrw.classList.remove('active');
                spanUsd.classList.add('active');
                priceTags.forEach(tag => tag.innerHTML = tag.getAttribute('data-usd'));
            } else {
                currentCurrency = 'KRW';
                spanUsd.classList.remove('active');
                spanKrw.classList.add('active');
                priceTags.forEach(tag => tag.innerHTML = tag.getAttribute('data-krw'));
            }
        });
    }

    // Modal Logic
    const modal = document.getElementById('payment-modal');
    const closeModal = document.querySelector('.close-modal');
    const modalProductName = document.getElementById('modal-product-name');

    window.openPaymentModal = (productName) => {
        if(modalProductName) modalProductName.textContent = productName;
        if(modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // 2. Three.js WebGL Setup (Interactive Deep Purple Void)
    const initWebGL = () => {
        const canvas = document.getElementById('webgl-canvas');
        if(!canvas) return;

        const scene = new THREE.Scene();
        // Solid dark purple base
        scene.background = new THREE.Color('#120A1A');

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        // Force webgl renderer transparent to allow mixing, though solid background preferred here.
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: false });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Create particles
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 1000;
        const posArray = new Float32Array(particlesCount * 3);

        for(let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 18;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        // Create soft glowing material
        const material = new THREE.PointsMaterial({
            size: 0.025,
            color: '#B68BEC', // Soft Lilac representing the Fluent accent
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        const particlesMesh = new THREE.Points(particlesGeometry, material);
        scene.add(particlesMesh);

        // Mouse Interactivity
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;

        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;

        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX - windowHalfX);
            mouseY = (event.clientY - windowHalfY);
        });

        const clock = new THREE.Clock();

        const tick = () => {
            const elapsedTime = clock.getElapsedTime();

            // Auto rotation for ambient feel
            particlesMesh.rotation.y = elapsedTime * 0.05;
            particlesMesh.rotation.x = elapsedTime * 0.02;

            // Parallax mouse effect
            targetX = mouseX * 0.001;
            targetY = mouseY * 0.001;

            particlesMesh.rotation.y += 0.5 * (targetX - particlesMesh.rotation.y);
            particlesMesh.rotation.x += 0.5 * (targetY - particlesMesh.rotation.x);

            renderer.render(scene, camera);
            window.requestAnimationFrame(tick);
        };
        tick();

        // Handle resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    };

    if (typeof THREE !== 'undefined') {
        initWebGL();
    }

    // 3. GSAP ScrollTrigger Storytelling
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Utility to configure elements for animation
        gsap.set('.gsap-fade-up, .gsap-fade-left, .gsap-fade-right', { autoAlpha: 0 });

        // Iterate through all chapters to apply scroll animations
        const chapters = document.querySelectorAll('.chapter');

        chapters.forEach(chapter => {
            const fadeUps = chapter.querySelectorAll('.gsap-fade-up');
            const fadeLefts = chapter.querySelectorAll('.gsap-fade-left');
            const fadeRights = chapter.querySelectorAll('.gsap-fade-right');

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: chapter,
                    start: 'top 80%', 
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                }
            });

            if (fadeUps.length) {
                tl.fromTo(fadeUps, { y: 60, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.2, stagger: 0.15, ease: 'power3.out' }, 0);
            }
            if (fadeLefts.length) {
                tl.fromTo(fadeLefts, { x: -60, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 1.2, stagger: 0.15, ease: 'power3.out' }, 0);
            }
            if (fadeRights.length) {
                tl.fromTo(fadeRights, { x: 60, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 1.2, stagger: 0.15, ease: 'power3.out' }, 0);
            }
        });
    }
});
