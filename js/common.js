// JavaScript común para todas las páginas
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
if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

if (userProfileBtn) {
    userProfileBtn.addEventListener('click', toggleDropdown);
}

// Cerrar dropdown al hacer clic fuera
document.addEventListener('click', function(event) {
    if (userProfileBtn && dropdownMenu && 
        !userProfileBtn.contains(event.target) && 
        !dropdownMenu.contains(event.target)) {
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
if (mobileMenu) {
    mobileMenu.addEventListener('click', function () {
        navLinks.classList.toggle('active');
        mobileMenu.classList.toggle('active');

        if (window.innerWidth <= 1024 && sidebar) {
            sidebar.classList.toggle('active');
        }
    });
}

// Función para manejar cambios de tamaño de ventana
window.addEventListener('resize', function () {
    if (window.innerWidth > 1024) {
        if (sidebar) sidebar.classList.remove('active');
        if (navLinks) navLinks.classList.remove('active');
        if (mobileMenu) mobileMenu.classList.remove('active');
    }
    // Cerrar dropdown en cambios de tamaño
    closeDropdown();
});

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function () {
    initTheme();
});

// Funciones utilitarias
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification-toast ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    // Agregar estilos si no existen
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification-toast {
                position: fixed;
                top: 90px;
                right: 20px;
                background: var(--surface-color);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-md);
                padding: 1rem;
                box-shadow: var(--shadow-medium);
                z-index: 9999;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                max-width: 400px;
                transform: translateX(100%);
                transition: var(--transition);
                animation: slideInNotification 0.3s ease-out forwards;
            }
            
            .notification-toast.success {
                border-left: 4px solid var(--success-color);
            }
            
            .notification-toast.error {
                border-left: 4px solid var(--danger-color);
            }
            
            .notification-toast.warning {
                border-left: 4px solid var(--warning-color);
            }
            
            .notification-toast.info {
                border-left: 4px solid var(--info-color);
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                flex: 1;
            }
            
            .notification-icon {
                font-size: 1.2rem;
            }
            
            .notification-message {
                color: var(--text-color);
                font-size: 0.9rem;
                line-height: 1.4;
            }
            
            .notification-close {
                background: none;
                border: none;
                font-size: 1.2rem;
                cursor: pointer;
                color: var(--light-text);
                padding: 0;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: var(--transition);
            }
            
            .notification-close:hover {
                background-color: rgba(0, 0, 0, 0.1);
            }
            
            @keyframes slideInNotification {
                from {
                    transform: translateX(100%);
                }
                to {
                    transform: translateX(0);
                }
            }
            
            @keyframes slideOutNotification {
                from {
                    transform: translateX(0);
                }
                to {
                    transform: translateX(100%);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Agregar al DOM
    document.body.appendChild(notification);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        removeNotification(notification);
    }, 5000);
    
    // Cerrar al hacer clic en X
    notification.querySelector('.notification-close').addEventListener('click', () => {
        removeNotification(notification);
    });
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return '✅';
        case 'error': return '❌';
        case 'warning': return '⚠️';
        case 'info': return 'ℹ️';
        default: return 'ℹ️';
    }
}

function removeNotification(notification) {
    notification.style.animation = 'slideOutNotification 0.3s ease-out forwards';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Función para validar formularios
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = 'var(--danger-color)';
            isValid = false;
        } else {
            field.style.borderColor = 'var(--border-color)';
        }
    });
    
    return isValid;
}

// Función para limpiar formularios
function clearForm(form) {
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        if (input.type !== 'submit' && input.type !== 'button') {
            input.value = '';
            input.style.borderColor = 'var(--border-color)';
        }
    });
    
    const checkboxes = form.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
}
