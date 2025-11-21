// ================================================
// CYBERPUNK TERMINAL THEME - JavaScript Effects
// Version: 2.0
// ================================================

(function() {
    'use strict';

    // ========================================
    // MATRIX RAIN EFFECT
    // ========================================
    function initMatrixRain() {
        const canvas = document.getElementById('matrix-rain');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        // Set canvas size
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        // Matrix characters
        const matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?/~`';
        const characters = matrixChars.split('');

        // Column properties
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = [];

        // Initialize drops
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * -100;
        }

        // Drawing function
        function draw() {
            // Fade effect
            ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Set text properties
            ctx.fillStyle = '#00ff00'; // Cyberpunk green
            ctx.font = fontSize + 'px monospace';

            // Draw characters
            for (let i = 0; i < drops.length; i++) {
                const text = characters[Math.floor(Math.random() * characters.length)];
                const x = i * fontSize;
                const y = drops[i] * fontSize;

                ctx.fillText(text, x, y);

                // Reset drop to top randomly
                if (y > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }

                drops[i]++;
            }
        }

        // Animation loop
        const matrixInterval = setInterval(draw, 50);

        // Resize handler
        window.addEventListener('resize', function() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        });

        // Cleanup on page unload
        window.addEventListener('beforeunload', function() {
            clearInterval(matrixInterval);
        });
    }

    // ========================================
    // GLITCH TEXT EFFECT ON HOVER
    // ========================================
    function initGlitchEffects() {
        const glitchElements = document.querySelectorAll('.glitch-on-hover');
        
        glitchElements.forEach(element => {
            let glitchInterval;
            
            element.addEventListener('mouseenter', function() {
                glitchInterval = setInterval(() => {
                    this.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
                }, 50);
            });

            element.addEventListener('mouseleave', function() {
                clearInterval(glitchInterval);
                this.style.transform = 'translate(0, 0)';
            });
        });
    }

    // ========================================
    // NEON GLOW ANIMATION ON SCROLL
    // ========================================
    function initScrollGlowEffects() {
        const glowElements = document.querySelectorAll('.cyber-text-glow');
        
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'neon-glow 2s ease-in-out infinite alternate';
                }
            });
        }, observerOptions);

        glowElements.forEach(element => {
            observer.observe(element);
        });
    }

    // ========================================
    // BUTTON RIPPLE EFFECT
    // ========================================
    function initButtonRipple() {
        const buttons = document.querySelectorAll('.btn-cyber');
        
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const ripple = document.createElement('span');
                ripple.style.position = 'absolute';
                ripple.style.width = '0';
                ripple.style.height = '0';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.style.background = 'rgba(0, 255, 255, 0.5)';
                ripple.style.borderRadius = '50%';
                ripple.style.transform = 'translate(-50%, -50%)';
                ripple.style.pointerEvents = 'none';
                ripple.style.transition = 'width 0.6s, height 0.6s, opacity 0.6s';
                ripple.style.opacity = '1';

                this.appendChild(ripple);

                setTimeout(() => {
                    ripple.style.width = '300px';
                    ripple.style.height = '300px';
                    ripple.style.opacity = '0';
                }, 10);

                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }

    // ========================================
    // CARD HOVER 3D EFFECT
    // ========================================
    function initCard3DEffect() {
        const cards = document.querySelectorAll('.card-cyber');
        
        cards.forEach(card => {
            // Skip cards that contain the post editor form
            if (card.querySelector('#postForm')) {
                return;
            }
            
            card.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
            });

            card.addEventListener('mouseleave', function() {
                this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
    }

    // ========================================
    // TYPING EFFECT FOR TERMINAL TEXT
    // ========================================
    function initTypingEffect() {
        const typingElements = document.querySelectorAll('.typing-effect');
        
        typingElements.forEach((element, index) => {
            const text = element.textContent;
            element.textContent = '';
            element.style.display = 'inline-block';
            
            let i = 0;
            const typingSpeed = 50;
            const startDelay = index * 1000; // Stagger multiple typing effects

            setTimeout(() => {
                const typeInterval = setInterval(() => {
                    if (i < text.length) {
                        element.textContent += text.charAt(i);
                        i++;
                    } else {
                        clearInterval(typeInterval);
                        // Remove blinking cursor after typing completes
                        setTimeout(() => {
                            element.style.borderRight = 'none';
                        }, 500);
                    }
                }, typingSpeed);
            }, startDelay);
        });
    }

    // ========================================
    // SMOOTH SCROLL TO TOP
    // ========================================
    function initScrollToTop() {
        // Create scroll-to-top button
        const scrollBtn = document.createElement('button');
        scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        scrollBtn.className = 'scroll-to-top-cyber';
        scrollBtn.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: transparent;
            color: var(--cyber-cyan);
            border: 2px solid var(--cyber-cyan);
            border-radius: 50%;
            cursor: pointer;
            display: none;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            transition: all 0.3s ease;
            z-index: 1000;
        `;

        document.body.appendChild(scrollBtn);

        // Show/hide button on scroll
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollBtn.style.display = 'flex';
            } else {
                scrollBtn.style.display = 'none';
            }
        });

        // Scroll to top on click
        scrollBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Hover effect
        scrollBtn.addEventListener('mouseenter', function() {
            this.style.background = 'var(--cyber-cyan)';
            this.style.color = 'var(--cyber-bg)';
            this.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.8)';
            this.style.transform = 'translateY(-5px)';
        });

        scrollBtn.addEventListener('mouseleave', function() {
            this.style.background = 'transparent';
            this.style.color = 'var(--cyber-cyan)';
            this.style.boxShadow = 'none';
            this.style.transform = 'translateY(0)';
        });
    }

    // ========================================
    // NAVBAR SCROLL EFFECT
    // ========================================
    function initNavbarScrollEffect() {
        const navbar = document.querySelector('.navbar-cyber');
        if (!navbar) return;

        let lastScroll = 0;

        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 100) {
                navbar.style.background = 'rgba(13, 17, 23, 0.98)';
                navbar.style.boxShadow = '0 0 30px rgba(0, 255, 255, 0.5)';
            } else {
                navbar.style.background = 'rgba(13, 17, 23, 0.95)';
                navbar.style.boxShadow = '0 0 15px rgba(0, 255, 255, 0.3)';
            }

            lastScroll = currentScroll;
        });
    }

    // ========================================
    // FORM VALIDATION ENHANCEMENT
    // ========================================
    function initFormValidation() {
        const forms = document.querySelectorAll('.form-cyber');
        
        forms.forEach(form => {
            const inputs = form.querySelectorAll('.form-control-cyber');
            
            inputs.forEach(input => {
                // Add focus glow effect
                input.addEventListener('focus', function() {
                    this.style.boxShadow = '0 0 15px rgba(255, 0, 255, 0.5)';
                });

                input.addEventListener('blur', function() {
                    if (this.value === '') {
                        this.style.boxShadow = 'none';
                    } else {
                        this.style.boxShadow = '0 0 10px rgba(0, 255, 0, 0.3)';
                    }
                });

                // Real-time validation feedback
                input.addEventListener('input', function() {
                    if (this.checkValidity()) {
                        this.style.borderColor = 'var(--cyber-green)';
                    } else {
                        this.style.borderColor = 'var(--cyber-pink)';
                    }
                });
            });
        });
    }

    // ========================================
    // LOADING ANIMATION
    // ========================================
    function initLoadingAnimation() {
        // Create loading overlay
        const loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'cyber-loading';
        loadingOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--cyber-bg);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 99999;
            transition: opacity 0.5s ease;
        `;

        loadingOverlay.innerHTML = `
            <div class="cyber-glitch-text" data-text="LOADING..." style="font-size: 2rem; color: var(--cyber-cyan);">
                LOADING...
            </div>
            <div class="terminal-text mt-3" style="color: var(--cyber-green);">
                <span>> INITIALIZING_SYSTEM...</span>
            </div>
        `;

        document.body.prepend(loadingOverlay);

        // Remove loading overlay when page is loaded
        window.addEventListener('load', function() {
            setTimeout(() => {
                loadingOverlay.style.opacity = '0';
                setTimeout(() => {
                    loadingOverlay.remove();
                }, 500);
            }, 500);
        });
    }

    // ========================================
    // CONSOLE EASTER EGG
    // ========================================
    function initConsoleEasterEgg() {
        console.log('%c⚡ CYBERBLOG.SYS ⚡', 'color: #00ffff; font-size: 24px; font-weight: bold; text-shadow: 0 0 10px #00ffff;');
        console.log('%c> SYSTEM_STATUS: ONLINE', 'color: #00ff00; font-family: monospace;');
        console.log('%c> NEURAL_NETWORK: ACTIVE', 'color: #ff00ff; font-family: monospace;');
        console.log('%c> ENJOY YOUR STAY IN THE MATRIX', 'color: #00ffff; font-family: monospace;');
    }

    // ========================================
    // CKEDITOR PROTECTION - EXCLUDE FROM EFFECTS
    // ========================================
    function excludeCKEditorFromEffects() {
        // Ensure CKEditor elements are never affected by custom animations
        const ckElements = document.querySelectorAll('.ck-editor, .ck-toolbar, .ck-editor__editable');
        
        ckElements.forEach(element => {
            // Remove any animation classes
            element.style.animation = 'none';
            element.style.transition = 'none';
            element.style.opacity = '1';
            element.style.visibility = 'visible';
        });

        // Observer to watch for CKEditor initialization
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.classList && (node.classList.contains('ck-editor') || node.classList.contains('ck-toolbar'))) {
                        node.style.animation = 'none';
                        node.style.transition = 'none';
                        node.style.opacity = '1';
                        node.style.visibility = 'visible';
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // ========================================
    // INITIALIZE ALL EFFECTS
    // ========================================
    function init() {
        // Core effects
        initMatrixRain();
        initGlitchEffects();
        initScrollGlowEffects();
        initButtonRipple();
        //initCard3DEffect();
        initTypingEffect();
        
        // UI enhancements
        initScrollToTop();
        initNavbarScrollEffect();
        initFormValidation();
        
        // Special effects
        initLoadingAnimation();
        initConsoleEasterEgg();
        
        // CKEditor protection
        //excludeCKEditorFromEffects();

        console.log('%c✓ Cyberpunk theme initialized', 'color: #00ff00; font-family: monospace;');
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Reinitialize on page show (for back/forward navigation)
    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            init();
        }
    });

})();