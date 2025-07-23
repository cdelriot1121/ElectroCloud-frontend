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

// Cargar datos reales del usuario
async function loadUserDashboard() {
    try {
        // Verificar autenticación
        const verification = await window.electroAPI.verifyToken();
        if (!verification || !verification.valid) {
            window.location.href = '../index.html';
            return;
        }

        // Cargar datos del perfil
        await loadUserProfile();
        
        // Cargar último consumo
        await loadLatestConsumption();
        
        // Cargar última factura
        await loadLatestBill();
        
        // Cargar reclamos
        await loadUserClaims();
        
        // Cargar notificaciones
        await loadUserNotifications();

    } catch (error) {
        console.error('Error cargando dashboard:', error);
        showNotification('Error al cargar los datos del dashboard', 'error');
    }
}

async function loadUserProfile() {
    try {
        const profile = await window.electroAPI.getUserProfile();
        
        // Actualizar nombre en el dashboard
        const welcomeSection = document.querySelector('.welcome-section h1');
        if (welcomeSection) {
            welcomeSection.textContent = `Bienvenido, ${profile.nombre}`;
        }

        // Actualizar información del dropdown
        const userNameSpan = document.getElementById('user-name');
        if (userNameSpan) {
            userNameSpan.textContent = profile.nombre;
        }

    } catch (error) {
        console.error('Error cargando perfil:', error);
    }
}

async function loadLatestConsumption() {
    try {
        const consumptionData = await window.electroAPI.getLatestConsumption();
        
        const energyCard = document.querySelector('.energy-card');
        if (energyCard && consumptionData.consumo_actual) {
            const consumo = consumptionData.consumo_actual;
            const comparacion = consumptionData.comparacion;
            
            // Actualizar valor principal
            const valueElement = energyCard.querySelector('.card-value');
            if (valueElement) {
                valueElement.textContent = `${consumo.kwh} kWh`;
            }

            // Actualizar comparación si existe
            if (comparacion && energyCard.querySelector('.card-change')) {
                const changeElement = energyCard.querySelector('.card-change');
                const isIncrease = comparacion.tendencia === 'aumento';
                
                changeElement.innerHTML = `
                    <span class="${isIncrease ? 'increase' : 'decrease'}">
                        ${isIncrease ? '↗' : '↘'} ${Math.abs(comparacion.porcentaje_cambio)}%
                    </span>
                    vs mes anterior
                `;
            }
        }

    } catch (error) {
        console.error('Error cargando consumo:', error);
    }
}

async function loadLatestBill() {
    try {
        const billData = await window.electroAPI.getLatestBill();
        
        const billCard = document.querySelector('.bill-card');
        if (billCard && billData.factura) {
            const factura = billData.factura;
            
            // Actualizar monto
            const valueElement = billCard.querySelector('.card-value');
            if (valueElement) {
                valueElement.textContent = `$${factura.monto.toLocaleString('es-CO')}`;
            }

            // Actualizar estado y vencimiento
            const statusElement = billCard.querySelector('.card-status');
            if (statusElement) {
                const estado = factura.estado === 'pendiente' ? 'Pendiente' : 'Pagada';
                const urgente = factura.urgente ? ' (URGENTE)' : '';
                statusElement.textContent = `${estado}${urgente}`;
                
                if (factura.urgente) {
                    statusElement.style.color = '#e74c3c';
                }
            }
        }

    } catch (error) {
        console.error('Error cargando factura:', error);
    }
}

async function loadUserClaims() {
    try {
        const claimsData = await window.electroAPI.getUserClaims();
        
        const claimsCard = document.querySelector('.claims-card');
        if (claimsCard && claimsData.reclamos) {
            const totalReclamos = claimsData.reclamos.length;
            const reclamosActivos = claimsData.reclamos.filter(r => 
                r.estado === 'pendiente' || r.estado === 'en_proceso'
            ).length;
            
            // Actualizar número total
            const valueElement = claimsCard.querySelector('.card-value');
            if (valueElement) {
                valueElement.textContent = totalReclamos.toString();
            }

            // Actualizar estado
            const statusElement = claimsCard.querySelector('.card-status');
            if (statusElement) {
                statusElement.textContent = `${reclamosActivos} activos`;
            }
        }

    } catch (error) {
        console.error('Error cargando reclamos:', error);
    }
}

async function loadUserNotifications() {
    try {
        const notificationsData = await window.electroAPI.getNotifications(5);
        
        if (notificationsData.notificaciones) {
            // Actualizar contador de notificaciones no leídas
            const notificationBadge = document.querySelector('.notification-badge');
            if (notificationBadge) {
                notificationBadge.textContent = notificationsData.no_leidas;
                notificationBadge.style.display = notificationsData.no_leidas > 0 ? 'block' : 'none';
            }
        }

    } catch (error) {
        console.error('Error cargando notificaciones:', error);
    }
}

// Agregar función de logout
function logout() {
    window.electroAPI.removeToken();
    localStorage.removeItem('electrocloud_user');
    showNotification('Sesión cerrada exitosamente', 'success');
    setTimeout(() => {
        window.location.href = '../index.html';
    }, 1000);
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    setTimeout(animateNumbers, 500);
    
    // Cargar datos reales del dashboard
    loadUserDashboard();
});