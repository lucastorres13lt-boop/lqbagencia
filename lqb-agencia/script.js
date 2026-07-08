gsap.registerPlugin(ScrollTrigger);

// 1. Custom Cursor
const cursor = document.querySelector('.cursor');
if (window.innerWidth > 768) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    gsap.ticker.add(() => {
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        gsap.set(cursor, { x: cursorX, y: cursorY });
    });
}

// 2. Preloader & Hero Reveal
const tlLoader = gsap.timeline({
    onComplete: () => {
        document.body.classList.remove('loading');
        initScrollAnimations();
    }
});

let counter = { value: 0 };
tlLoader.to(counter, {
    value: 100,
    duration: 3,
    ease: "power4.inOut",
    onUpdate: () => {
        document.querySelector('.loader-counter').innerText = Math.round(counter.value) + '%';
    }
}, 0)
.to('.loader-bar', { width: "100%", duration: 3, ease: "power4.inOut" }, 0)
.to('.preloader', { yPercent: -100, duration: 1.2, ease: "power4.inOut" }, "+=0.1")
.to('.line span', { y: 0, duration: 1.2, stagger: 0.1, ease: "power4.out" }, "-=0.6");


// 3. Manifesto Text Splitter (Vanilla JS)
const manifestoText = document.getElementById('manifesto-text');
if (manifestoText) {
    const text = manifestoText.innerText;
    manifestoText.innerHTML = '';
    text.split(' ').forEach(word => {
        const span = document.createElement('span');
        span.innerText = word + ' ';
        span.style.color = '#222'; // Dark color initially
        manifestoText.appendChild(span);
    });
}

// 4. Initialize Main Scroll Animations
function initScrollAnimations() {
    // Manifesto Scroll Illumination
    const words = manifestoText.querySelectorAll('span');
    ScrollTrigger.create({
        trigger: '.manifesto-section',
        start: 'top top',
        end: '+=2000', // INCREASED: Makes the user scroll longer to pass the section
        pin: true,
        scrub: 0.5,
        onUpdate: (self) => {
            const progress = self.progress;
            const highlightCount = Math.floor(progress * (words.length + 5));
            words.forEach((word, index) => {
                if (index < highlightCount) {
                    word.style.color = '#fff';
                } else {
                    word.style.color = '#222';
                }
            });
        }
    });

    // Horizontal Scroll Ecosystem
    const horizontalContainer = document.querySelector('.horizontal-container');
    const hPanels = gsap.utils.toArray('.h-panel');
    
    gsap.to(hPanels, {
        xPercent: -100 * (hPanels.length - 1),
        ease: "none",
        ScrollTrigger: {
            trigger: ".horizontal-section",
            pin: true,
            scrub: 1,
            snap: 1 / (hPanels.length - 1),
            // INCREASED: Makes horizontal scroll pass much slower
            end: () => "+=" + (horizontalContainer.offsetWidth * 1.5) 
        }
    });

    // Work Hover Image Reveal
    const workItems = document.querySelectorAll('.work-item');
    const workImgReveal = document.querySelector('.work-img-reveal');

    if (window.innerWidth > 768) {
        workItems.forEach(item => {
            item.addEventListener('mouseenter', (e) => {
                const imgUrl = item.getAttribute('data-img');
                workImgReveal.style.backgroundImage = `url(${imgUrl})`;
                workImgReveal.classList.add('active');
                document.body.classList.add('hover-img');
            });
            item.addEventListener('mousemove', (e) => {
                gsap.to(workImgReveal, { x: e.clientX, y: e.clientY, duration: 0.6, ease: "power3.out" });
            });
            item.addEventListener('mouseleave', () => {
                workImgReveal.classList.remove('active');
                document.body.classList.remove('hover-img');
            });
        });
    }

    // HUD Dashboard Automation
    const counters = document.querySelectorAll('.counter');
    const hudLine = document.querySelector('.hud-line');
    
    ScrollTrigger.create({
        trigger: '.hud-section',
        start: 'top 60%',
        onEnter: () => {
            counters.forEach(c => {
                const target = +c.getAttribute('data-val');
                gsap.to(c, {
                    innerHTML: target,
                    duration: 3,
                    snap: { innerHTML: 1 },
                    ease: "power4.out"
                });
            });
            
            gsap.to(hudLine, {
                strokeDashoffset: 0,
                duration: 4,
                ease: "power3.inOut"
            });
        },
        once: true
    });
}
