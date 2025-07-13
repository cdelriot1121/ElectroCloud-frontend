// Script para la pagina de inicio usuario donde esta el Dashboard
// Elementos del DOM
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.getElementById('nav-links');
const sidebar = document.getElementById('sidebar');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.querySelector('.theme-icon');
const body = document.body;

// Elementos del dropdown
const userProfileBtn = document.getElementById('user-profile-btn');
const dropdownMenu = document.getElementById('dropdown-menu');

// Funcionalidad de modo oscuro
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    body.classList.toggle('dark-theme', savedTheme === 'dark');
    updateThemeIcon(savedTheme === 'dark');
}

function updateThemeIcon(isDark) {
    themeIcon.textContent = isDark ? '☀️' : '🌙';
}

function toggleTheme() {
    const isDark = body.classList.toggle('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcon(isDark);
}

// Funcionalidad del dropdown de perfil
function toggleDropdown() {
    const isOpen = dropdownMenu.classList.toggle('show');
    userProfileBtn.classList.toggle('active', isOpen);
}

function closeDropdown() {
    dropdownMenu.classList.remove('show');
    userProfileBtn.classList.remove('active');
}

// Event listeners
themeToggle.addEventListener('click', toggleTheme);
userProfileBtn.addEventListener('click', toggleDropdown);

// Cerrar dropdown al hacer clic fuera
document.addEventListener('click', function(event) {
    if (!userProfileBtn.contains(event.target) && !dropdownMenu.contains(event.target)) {
        closeDropdown();
    }
});

// Cerrar dropdown al presionar ESC
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeDropdown();
    }
});

// Script para menú móvil
mobileMenu.addEventListener('click', function () {
    navLinks.classList.toggle('active');
    mobileMenu.classList.toggle('active');

    if (window.innerWidth <= 1024) {
        sidebar.classList.toggle('active');
    }
});

// Función para manejar cambios de tamaño de ventana
window.addEventListener('resize', function () {
    if (window.innerWidth > 1024) {
        sidebar.classList.remove('active');
        navLinks.classList.remove('active');
        mobileMenu.classList.remove('active');
    }
    // Cerrar dropdown en cambios de tamaño
    closeDropdown();
});

// Animaciones para los números en las tarjetas
function animateNumbers() {
    const numberElements = document.querySelectorAll('.card-value');
    numberElements.forEach(el => {
        const finalValue = el.textContent.replace(/[^\d]/g, '');
        if (finalValue) {
            animateNumber(el, 0, parseInt(finalValue), 2000);
        }
    });
}

function animateNumber(element, start, end, duration) {
    const range = end - start;
    const startTime = performance.now();

    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(start + (range * progress));

        const originalText = element.textContent;
        element.textContent = originalText.replace(/\d+/, current);

        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }

    requestAnimationFrame(updateNumber);
}

// Funcionalidad de notificaciones
function markNotificationAsRead(notification) {
    notification.style.opacity = '0.7';
    notification.style.transform = 'translateX(20px)';
}

// Event listeners para notificaciones
document.querySelectorAll('.notification').forEach(notification => {
    notification.addEventListener('click', () => {
        markNotificationAsRead(notification);
    });
});

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    setTimeout(animateNumbers, 500);
});