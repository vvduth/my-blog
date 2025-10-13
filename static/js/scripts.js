/*!
* Enhanced Blog JavaScript - Modern Interactions & Animations
* Built on top of Start Bootstrap Clean Blog theme
* Copyright 2025 - Enhanced Blog
*/

// ===== MAIN APP INITIALIZATION ===== 
window.addEventListener('DOMContentLoaded', () => {
    try {
        initializeNavigation();
        initializeScrollAnimations();
        initializePostAnimations();
        initializeFormEnhancements();
        initializeImageLoading();
        initializeTooltips();
    } catch (error) {
        console.warn('Some enhancements failed to initialize:', error);
        // Fallback: show all animated elements
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            if (el && el.classList) {
                el.classList.add('visible');
            }
        });
    }
});

// Also try to initialize after a short delay in case DOM is not fully ready
setTimeout(() => {
    // Ensure all animate-on-scroll elements are visible if they weren't already processed
    document.querySelectorAll('.animate-on-scroll:not(.visible)').forEach(el => {
        if (el && el.classList) {
            el.classList.add('visible');
        }
    });
}, 100);

// ===== ENHANCED NAVIGATION =====
function initializeNavigation() {
    let scrollPos = 0;
    const mainNav = document.getElementById('mainNav');
    if (!mainNav) return;
    
    const headerHeight = mainNav.clientHeight;
    
    window.addEventListener('scroll', function() {
        const currentTop = document.body.getBoundingClientRect().top * -1;
        
        // Add/remove navbar styling based on scroll position
        if (currentTop > 50) {
            mainNav.classList.add('navbar-scrolled');
        } else {
            mainNav.classList.remove('navbar-scrolled');
        }
        
        if (currentTop < scrollPos) {
            // Scrolling Up
            if (currentTop > 0 && mainNav.classList.contains('is-fixed')) {
                mainNav.classList.add('is-visible');
            } else {
                mainNav.classList.remove('is-visible', 'is-fixed');
            }
        } else {
            // Scrolling Down
            mainNav.classList.remove('is-visible');
            if (currentTop > headerHeight && !mainNav.classList.contains('is-fixed')) {
                mainNav.classList.add('is-fixed');
            }
        }
        scrollPos = currentTop;
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== SCROLL ANIMATIONS =====
function initializeScrollAnimations() {
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
        // Fallback: just show all elements
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            el.classList.add('visible');
        });
        return;
    }

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add staggered animation delay for multiple elements
                const siblings = entry.target.parentElement?.children;
                if (siblings) {
                    Array.from(siblings).forEach((sibling, index) => {
                        if (sibling.classList && sibling.classList.contains('post-preview')) {
                            setTimeout(() => {
                                sibling.classList.add('visible');
                            }, index * 100);
                        }
                    });
                }
            }
        });
    }, observerOptions);

    // Observe all post previews and animate-on-scroll elements
    const elementsToObserve = document.querySelectorAll('.post-preview, .comment-card, .animate-on-scroll');
    elementsToObserve.forEach(el => {
        if (el && el.classList) {
            observer.observe(el);
        }
    });
}

// ===== POST ANIMATIONS =====
function initializePostAnimations() {
    // Add loading animation to post cards
    const postPreviews = document.querySelectorAll('.post-preview');
    if (postPreviews.length > 0) {
        postPreviews.forEach((post, index) => {
            if (post && post.style) {
                post.style.animationDelay = `${index * 0.1}s`;
                
                // Add hover effect data
                post.addEventListener('mouseenter', function() {
                    if (this.style) {
                        this.style.transform = 'translateY(-10px)';
                    }
                });
                
                post.addEventListener('mouseleave', function() {
                    if (this.style) {
                        this.style.transform = 'translateY(0)';
                    }
                });
            }
        });
    }

    // Enhance delete buttons
    const deleteButtons = document.querySelectorAll('.delete-post-btn, a[href*="delete"]');
    if (deleteButtons.length > 0) {
        deleteButtons.forEach(btn => {
            if (btn) {
                btn.addEventListener('click', function(e) {
                    if (!confirm('Are you sure you want to delete this post?')) {
                        e.preventDefault();
                    } else {
                        // Add loading animation
                        const original = this.innerHTML;
                        this.innerHTML = '<div class="loading"></div>';
                        if (this.style) {
                            this.style.pointerEvents = 'none';
                        }
                    }
                });
            }
        });
    }
}

// ===== FORM ENHANCEMENTS =====
function initializeFormEnhancements() {
    // Floating label effect
    const formInputs = document.querySelectorAll('.form-control, .form-select');
    formInputs.forEach(input => {
        // Add focus/blur animations
        input.addEventListener('focus', function() {
            this.parentElement?.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement?.classList.remove('focused');
            }
        });

        // Add real-time validation visual feedback
        input.addEventListener('input', function() {
            if (this.checkValidity()) {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            } else {
                this.classList.remove('is-valid');
                this.classList.add('is-invalid');
            }
        });
    });

    // Enhanced submit button animations
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            const submitBtn = this.querySelector('[type="submit"]');
            if (submitBtn) {
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<div class="loading"></div> Processing...';
                submitBtn.disabled = true;
                
                // Reset button after 3 seconds if form hasn't redirected
                setTimeout(() => {
                    if (document.contains(submitBtn)) {
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                    }
                }, 3000);
            }
        });
    });
}

// ===== IMAGE LOADING ENHANCEMENTS =====
function initializeImageLoading() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        // Add loading placeholder
        if (!img.complete) {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
        }
        
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        img.addEventListener('error', function() {
            // Fallback for broken images
            this.style.opacity = '0.5';
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZCIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KPHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6I2Y4ZjlmYSIvPgo8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNlOWVjZWYiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyYWQpIi8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzZjNzU3ZCI+SW1hZ2UgTm90IEZvdW5kPC90ZXh0Pgo8L3N2Zz4=';
        });
    });
}

// ===== TOOLTIP INITIALIZATION =====
function initializeTooltips() {
    // Initialize Bootstrap tooltips if available
    if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
}

// ===== UTILITY FUNCTIONS =====

// Debounce function for scroll events
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

// Throttle function for performance
function throttle(func, delay) {
    let timeoutId;
    let lastExecTime = 0;
    return function (...args) {
        const currentTime = Date.now();
        
        if (currentTime - lastExecTime > delay) {
            func.apply(this, args);
            lastExecTime = currentTime;
        } else {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
                lastExecTime = Date.now();
            }, delay - (currentTime - lastExecTime));
        }
    };
}

// Smooth scroll to element
function scrollToElement(element, offset = 0) {
    const targetPosition = element.offsetTop - offset;
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

// ===== THEME TOGGLE (Optional Enhancement) =====
function initializeThemeToggle() {
    const themeToggle = document.querySelector('#theme-toggle');
    if (!themeToggle) return;
    
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Add transition effect
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    });
}

// ===== PERFORMANCE MONITORING =====
function logPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`Page loaded in ${loadTime}ms`);
        });
    }
}
