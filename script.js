/* script.js
   Versión consolidada para DJ MEXX KINY
   Incluye: modales, countdown, navegación, animaciones, lazy-loading,
   validación de formulario, mensajes de éxito, video controls, analytics
   y botones sociales (Facebook, Instagram, WhatsApp, Twitter (X), LinkedIn).
*/

'use strict';

// ===== VARIABLES GLOBALES =====
let eventModal;
let scrollToTopBtn;
let navbar;
let menuToggle;
let navMenu;
let countdownInterval;
let resizeTimeout;

// ===== INICIALIZACIÓN ÚNICA =====
document.addEventListener('DOMContentLoaded', function () {
    initializeElements();
    initializeEventModal();
    initializeNavigation();
    initializeScrollEffects(); // agrega listener de scroll debounced
    initializeFormHandling();
    initializeVideoControls();
    initializeAnimations();
    initializeCountdown();
    initializeLazyLoading();
    initializeSocialButtons();
    initializeAnalyticsTracking();

    // Precargar imágenes críticas - ajusta rutas si es necesario
    const criticalImages = [
        'images/hero-background.jpg',
        'images/pricing-image.jpg'
    ];
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });

    console.log('🎵 DJ MEXX KINY - script.js cargado correctamente 🎵');
});

// ===== INICIALIZAR ELEMENTOS =====
function initializeElements() {
    eventModal = document.getElementById('eventModal');
    scrollToTopBtn = document.getElementById('scrollToTop');
    navbar = document.querySelector('.navbar');
    menuToggle = document.getElementById('menu-toggle');
    navMenu = document.querySelector('.nav-menu');
}

// ===== MODAL DE EVENTO PROMOCIONAL =====
function initializeEventModal() {
    const closeModalBtn = document.getElementById('closeEventModal');
    const modalOverlay = document.querySelector('.event-modal-overlay');

    // Mostrar modal después de 2 segundos (si existe)
    setTimeout(() => {
        if (eventModal && !eventModal.classList.contains('show')) {
            eventModal.classList.add('show');
            document.body.style.overflow = 'hidden';
            // Foco accesible al primer elemento
            const focusable = eventModal.querySelector('button, a, input, [tabindex]');
            if (focusable) focusable.focus();
        }
    }, 2000);

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeEventModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeEventModal);

    // Cerrar modal con tecla ESC
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && eventModal && eventModal.classList.contains('show')) {
            closeEventModal();
        }
    });
}

function closeEventModal() {
    if (eventModal) {
        eventModal.classList.remove('show');
        document.body.style.overflow = 'auto';
        if (countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }
    }
}

// ===== COUNTDOWN DEL EVENTO =====
function initializeCountdown() {
    // <-- ATENCIÓN: Actualiza esta fecha a la próxima fecha del evento -->
    // Actualmente era: 2025-02-15T21:00:00 (es una fecha pasada a Agosto 2025)
    const eventDate = new Date('2025-02-15T21:00:00').getTime();

    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');

    if (!daysElement || !hoursElement || !minutesElement || !secondsElement) return;

    countdownInterval = setInterval(function () {
        const now = new Date().getTime();
        const distance = eventDate - now;

        if (distance <= 0) {
            clearInterval(countdownInterval);
            daysElement.textContent = '00';
            hoursElement.textContent = '00';
            minutesElement.textContent = '00';
            secondsElement.textContent = '00';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        daysElement.textContent = String(days).padStart(2, '0');
        hoursElement.textContent = String(hours).padStart(2, '0');
        minutesElement.textContent = String(minutes).padStart(2, '0');
        secondsElement.textContent = String(seconds).padStart(2, '0');
    }, 1000);
}

// ===== NAVEGACIÓN =====
function initializeNavigation() {
    // Navegación móvil (overflow control)
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('change', function () {
            document.body.style.overflow = this.checked ? 'hidden' : 'auto';
        });

        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (menuToggle) menuToggle.checked = false;
                document.body.style.overflow = 'auto';
            });
        });
    }

    // Smooth scroll para enlaces internos
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            // si el href es '#' puro, no hacemos scroll
            const href = this.getAttribute('href');
            if (!href || href === '#') return;

            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // ajuste para navbar fija
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== EFECTOS DE SCROLL (usando debounce) =====
function initializeScrollEffects() {
    // handler que actualiza navbar, botón scroll y animaciones
    function onScroll() {
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        if (scrollToTopBtn) {
            if (window.scrollY > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        }

        handleScrollAnimations();
    }

    // Debounce para performance
    const debouncedOnScroll = debounce(onScroll, 10);
    window.addEventListener('scroll', debouncedOnScroll);

    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// ===== ANIMACIONES AL HACER SCROLL =====
function handleScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    const windowHeight = window.innerHeight;

    fadeElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('visible');
        }
    });
}

// ===== INICIALIZAR ANIMACIONES / INTERSECTION OBSERVER =====
function initializeAnimations() {
    // Ejecutar animaciones iniciales
    handleScrollAnimations();

    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        const fadeElements = document.querySelectorAll('.fade-in');
        fadeElements.forEach(element => observer.observe(element));
    }
}

// ===== CONTROLES DE VIDEO =====
function initializeVideoControls() {
    const videoWrapper = document.querySelector('.video-wrapper');
    const video = videoWrapper ? videoWrapper.querySelector('video') : null;
    const playButton = videoWrapper ? videoWrapper.querySelector('.video-play-button') : null;
    const overlay = videoWrapper ? videoWrapper.querySelector('.video-overlay') : null;

    if (!video || !playButton || !overlay) return;

    playButton.addEventListener('click', function () {
        if (video.paused) {
            video.play();
            overlay.style.opacity = '0';
        } else {
            video.pause();
            overlay.style.opacity = '1';
        }
    });

    video.addEventListener('play', function () { overlay.style.opacity = '0'; });
    video.addEventListener('pause', function () { overlay.style.opacity = '1'; });
    video.addEventListener('ended', function () { overlay.style.opacity = '1'; });

    video.addEventListener('click', function () {
        if (this.paused) this.play(); else this.pause();
    });
}

// ===== MANEJO DE FORMULARIOS =====
function initializeFormHandling() {
    const contactForm = document.querySelector('.contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (validateForm(this)) {
            handleFormSubmission(this);
        }
    });

    // Validación en tiempo real
    const inputs = contactForm.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function () { validateField(this); });
        input.addEventListener('input', function () { clearFieldError(this); });
    });
}

function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        if (!validateField(field)) isValid = false;
    });
    return isValid;
}

function validateField(field) {
    const value = (field.value || '').trim();
    let isValid = true;
    let errorMessage = '';

    clearFieldError(field);

    if (field.hasAttribute('required') && !value) {
        errorMessage = 'Este campo es obligatorio';
        isValid = false;
    }

    if (value && field.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            errorMessage = 'Ingresa un email válido';
            isValid = false;
        }
    }

    if (value && field.type === 'tel') {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{9,}$/;
        if (!phoneRegex.test(value)) {
            errorMessage = 'Ingresa un teléfono válido';
            isValid = false;
        }
    }

    if (value && field.type === 'date') {
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
            errorMessage = 'La fecha debe ser futura';
            isValid = false;
        }
    }

    if (!isValid) showFieldError(field, errorMessage);
    return isValid;
}

function showFieldError(field, message) {
    try {
        field.classList.add('error');
        let errorElement = field.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.className = 'error-message';
            field.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
        errorElement.style.color = '#ff4444';
        errorElement.style.fontSize = '0.8rem';
        errorElement.style.marginTop = '0.25rem';
        errorElement.style.display = 'block';
    } catch (err) {
        console.warn('No se pudo mostrar el mensaje de error', err);
    }
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = field.parentNode.querySelector('.error-message');
    if (errorElement) errorElement.remove();
}

function handleFormSubmission(form) {
    const submitButton = form.querySelector('.form-submit');
    const originalText = submitButton ? submitButton.innerHTML : 'Enviando...';

    if (submitButton) {
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitButton.disabled = true;
    }

    // Simulación de envío - integrar con back-end real aquí
    setTimeout(() => {
        showSuccessMessage();
        form.reset();
        if (submitButton) {
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    }, 2000);
}

function showSuccessMessage() {
    // Crear modal de éxito
    const successModal = document.createElement('div');
    successModal.className = 'success-modal';
    successModal.innerHTML = `
        <div class="success-modal-overlay" aria-hidden="true"></div>
        <div class="success-modal-content" role="dialog" aria-modal="true" aria-label="Mensaje enviado">
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h3>¡Mensaje Enviado!</h3>
            <p>Gracias por contactarnos. Te responderemos pronto.</p>
            <button class="btn-primary success-close">
                <i class="fas fa-check"></i>
                Entendido
            </button>
        </div>
    `;

    // Estilos rápidos (puedes moverlos al CSS)
    successModal.style.cssText = `
        position: fixed; top:0; left:0; width:100%; height:100%; z-index:10000;
        display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .25s ease;
    `;
    const overlay = successModal.querySelector('.success-modal-overlay');
    overlay.style.cssText = `
        position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);backdrop-filter: blur(4px);
    `;
    const content = successModal.querySelector('.success-modal-content');
    content.style.cssText = `
        position:relative;background:#000;padding:2.5rem;border-radius:12px;text-align:center;border:2px solid #FFFF00;
        box-shadow: 0 20px 60px rgba(255,255,0,0.2);transform:scale(.9);transition:transform .2s ease;
    `;
    const icon = successModal.querySelector('.success-icon i');
    if (icon) icon.style.cssText = 'font-size:3rem;color:#FFFF00;margin-bottom:1rem;';

    document.body.appendChild(successModal);

    // Mostrar
    setTimeout(() => {
        successModal.style.opacity = '1';
        content.style.transform = 'scale(1)';
    }, 50);

    // Cerrar
    const closeBtn = successModal.querySelector('.success-close');
    closeBtn.addEventListener('click', closeSuccessModal);
    overlay.addEventListener('click', closeSuccessModal);

    // Auto-cerrar
    setTimeout(() => closeSuccessModal(), 5000);
}

function closeSuccessModal() {
    const modal = document.querySelector('.success-modal');
    if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => modal.remove(), 300);
    }
}

// ===== UTILIDADES =====
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

// ===== MANEJO DE ERRORES GLOBAL =====
window.addEventListener('error', function (e) {
    console.error('Error en la aplicación:', e.error || e.message || e);
});

// ===== INICIALIZAR LAZY LOADING =====
function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset && img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// ===== MANEJO DE RESIZE =====
window.addEventListener('resize', function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function () {
        handleScrollAnimations();
    }, 250);
});

// ===== ACCESIBILIDAD: TRAP DE FOCUS EN MODAL =====
document.addEventListener('keydown', function (e) {
    if (eventModal && eventModal.classList.contains('show')) {
        if (e.key === 'Tab') {
            const focusableElements = eventModal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }
});

// ===== ANALYTICS Y TRACKING (BÁSICO) =====
function trackEvent(category, action, label) {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, { event_category: category, event_label: label });
    }
    console.log(`Event tracked: ${category} - ${action} - ${label}`);
}

function initializeAnalyticsTracking() {
    // Trackear clicks en botones principales
    const primaryButtons = document.querySelectorAll('.btn-primary');
    primaryButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            trackEvent('Button', 'Click', this.textContent.trim().slice(0, 30));
        });
    });

    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function () {
            trackEvent('Form', 'Submit', 'Contact Form');
        });
    }
}

// ===== FUNCIONES ADICIONALES: COMPARTIR / REDES SOCIALES =====
function initializeSocialButtons() {
    const socialButtons = document.querySelectorAll('.social-share, .social-links a');

    if (!socialButtons || socialButtons.length === 0) return;

    socialButtons.forEach(button => {
        // Evitar múltiples listeners
        button.addEventListener('click', function (e) {
            e.preventDefault();

            // Permite override por data- attributes:
            const customUrl = this.dataset.url || this.getAttribute('href') || window.location.href;
            const customText = this.dataset.text || document.title;
            const profile = this.dataset.profile || null; // para instagram si quieres abrir perfil directo

            // Manejo por plataforma (busca clases)
            let shareUrl = '';

            if (this.classList.contains('facebook')) {
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(customUrl)}`;
            } else if (this.classList.contains('instagram')) {
                // Instagram no comparte enlaces públicos; abrir perfil o copiar enlace
                if (profile) {
                    shareUrl = `https://www.instagram.com/${profile.replace(/^\//, '')}/`;
                } else if (this.getAttribute('href') && this.getAttribute('href') !== '#') {
                    shareUrl = this.getAttribute('href');
                } else {
                    // Intentar usar Web Share API en móviles como fallback
                    if (navigator.share) {
                        navigator.share({ title: customText, text: customText, url: customUrl }).catch(() => {
                            copyToClipboard(customUrl);
                            alert('Enlace copiado al portapapeles. Pégalo en tu historia de Instagram.');
                        });
                        return;
                    } else {
                        copyToClipboard(customUrl);
                        alert('Enlace copiado al portapapeles. Pégalo en tu historia de Instagram.');
                        return;
                    }
                }
            } else if (this.classList.contains('whatsapp')) {
                // WhatsApp: usa api.whatsapp.com para web y wa.me
                shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(customText + ' ' + customUrl)}`;
            } else if (this.classList.contains('twitter') || this.classList.contains('x')) {
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(customText)}&url=${encodeURIComponent(customUrl)}`;
            } else if (this.classList.contains('linkedin')) {
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(customUrl)}`;
            } else if (this.classList.contains('youtube')) {
                // si es link directo a YouTube
                shareUrl = this.getAttribute('href') || 'https://www.youtube.com/';
            } else {
                // Default: si tiene href real, abrirlo; si no, intentar web share
                const href = this.getAttribute('href');
                if (href && href !== '#') {
                    shareUrl = href;
                } else if (navigator.share) {
                    navigator.share({ title: customText, text: customText, url: customUrl }).catch(() => { /* noop */ });
                    return;
                } else {
                    // nothing to do
                    return;
                }
            }

            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        });
    });
}

function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text);
    } else {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
        } catch (err) { /* ignore */ }
        document.body.removeChild(textarea);
        return Promise.resolve();
    }
}
