/**
 * CYBERPUNK TERMINAL THEME - Interactive Effects
 * Glitch effects, terminal animations, and neon interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== TERMINAL BOOT SEQUENCE =====
    function initTerminalBoot() {
        console.log('%c> SYSTEM INITIALIZING...', 'color: #00ffff; font-family: monospace;');
        console.log('%c> LOADING CYBERPUNK INTERFACE...', 'color: #00ff00; font-family: monospace;');
        console.log('%c> NEURAL LINK ESTABLISHED', 'color: #ff00ff; font-family: monospace;');
    }
    
    // ===== SCROLL REVEAL ANIMATIONS =====
    function initScrollReveal() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }
    
    // ===== GLITCH EFFECT ON HOVER =====
    function initGlitchEffects() {
        const glitchElements = document.querySelectorAll('.glitch-on-hover');
        
        glitchElements.forEach(element => {
            element.addEventListener('mouseenter', function() {
                this.classList.add('cyber-text-glitch');
                setTimeout(() => {
                    this.classList.remove('cyber-text-glitch');
                }, 500);
            });
        });
    }
    
    // ===== NEON GLOW ON SCROLL =====
    function initNeonGlowOnScroll() {
        const navbar = document.querySelector('.navbar-cyber');
        
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.style.boxShadow = '0 0 30px rgba(0, 255, 255, 0.8)';
            } else {
                navbar.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.5)';
            }
        });
    }
    
    // ===== TERMINAL TYPING EFFECT =====
    function typeWriter(element, text, speed = 50) {
        let i = 0;
        element.textContent = '';
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }
    
    // Apply typing effect to elements with class 'terminal-type'
    function initTypingEffects() {
        const typingElements = document.querySelectorAll('.terminal-type');
        
        typingElements.forEach((element, index) => {
            const text = element.textContent;
            setTimeout(() => {
                typeWriter(element, text, 50);
            }, index * 1000);
        });
    }
    
    // ===== RANDOM GLITCH ANIMATION =====
    function randomGlitch() {
        const glitchableElements = document.querySelectorAll('.hero-title-cyber, .navbar-brand-cyber');
        
        setInterval(() => {
            const randomElement = glitchableElements[Math.floor(Math.random() * glitchableElements.length)];
            if (randomElement) {
                randomElement.style.animation = 'glitch 0.3s';
                setTimeout(() => {
                    randomElement.style.animation = '';
                }, 300);
            }
        }, 5000);
    }
    
    // ===== MATRIX RAIN EFFECT (BACKGROUND) =====
    function createMatrixRain() {
        const canvas = document.createElement('canvas');
        canvas.id = 'matrix-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '0';
        canvas.style.pointerEvents = 'none';
        canvas.style.opacity = '0.1';
        
        document.body.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const matrix = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = [];
        
        for (let i = 0; i < columns; i++) {
            drops[i] = 1;
        }
        
        function draw() {
            ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#00ffff';
            ctx.font = fontSize + 'px monospace';
            
            for (let i = 0; i < drops.length; i++) {
                const text = matrix[Math.floor(Math.random() * matrix.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }
        
        setInterval(draw, 35);
        
        window.addEventListener('resize', function() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }
    
    // ===== CYBERPUNK BUTTON EFFECTS =====
    function initButtonEffects() {
        const cyberButtons = document.querySelectorAll('.btn-cyber');
        
        cyberButtons.forEach(button => {
            button.addEventListener('mouseenter', function() {
                this.style.textShadow = '0 0 10px currentColor';
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.textShadow = 'none';
            });
            
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                ripple.style.position = 'absolute';
                ripple.style.width = '20px';
                ripple.style.height = '20px';
                ripple.style.background = 'rgba(0, 255, 255, 0.5)';
                ripple.style.borderRadius = '50%';
                ripple.style.transform = 'scale(0)';
                ripple.style.animation = 'ripple-cyber 0.6s ease-out';
                ripple.style.pointerEvents = 'none';
                
                const rect = this.getBoundingClientRect();
                ripple.style.left = (e.clientX - rect.left - 10) + 'px';
                ripple.style.top = (e.clientY - rect.top - 10) + 'px';
                
                this.style.position = 'relative';
                this.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });
    }
    
    // Add ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple-cyber {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // ===== FORM INPUT EFFECTS =====
    function initFormEffects() {
        const formInputs = document.querySelectorAll('.form-cyber .form-control');
        
        formInputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.style.animation = 'borderGlow 1.5s infinite';
            });
            
            input.addEventListener('blur', function() {
                this.style.animation = '';
            });
        });
    }
    
    // ===== CARD HOVER SOUND (OPTIONAL) =====
    function initCardEffects() {
        const cards = document.querySelectorAll('.card-cyber');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                // Optional: Play hover sound
                // const audio = new Audio('/static/sounds/cyber-hover.mp3');
                // audio.volume = 0.1;
                // audio.play();
            });
        });
    }
    
    // ===== TERMINAL PROMPT ANIMATION =====
    function initTerminalPrompts() {
        const prompts = document.querySelectorAll('.terminal-prompt');
        
        prompts.forEach(prompt => {
            const cursor = document.createElement('span');
            cursor.textContent = '▮';
            cursor.style.animation = 'terminalBlink 1s infinite';
            cursor.style.color = 'var(--cyber-neon-green)';
            cursor.style.marginLeft = '5px';
            prompt.appendChild(cursor);
        });
    }
    
    // ===== INITIALIZE ALL EFFECTS =====
    function initCyberpunkTheme() {
        initTerminalBoot();
        initScrollReveal();
        initGlitchEffects();
        initNeonGlowOnScroll();
        // initTypingEffects(); // Uncomment if you want typing effects
        randomGlitch();
        createMatrixRain();
        initButtonEffects();
        initFormEffects();
        initCardEffects();
        // initTerminalPrompts(); // Uncomment if you want terminal cursors
        
        console.log('%c>> CYBERPUNK INTERFACE LOADED', 'color: #ff00ff; font-size: 16px; font-family: monospace; text-shadow: 0 0 10px #ff00ff;');
    }
    
    // Start the cyberpunk experience
    initCyberpunkTheme();
});

// ===== UTILITY FUNCTIONS =====

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Smooth scroll to top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

window.scrollToTop = scrollToTop;
