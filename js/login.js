// JavaScript para la página de login
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    
    
    // checkExistingSession();

    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const correo = document.getElementById('correo').value;
            const contrasena = document.getElementById('contrasena').value;
            
            if (!correo || !contrasena) {
                showNotification('Por favor completa todos los campos', 'error');
                return;
            }

            // Mostrar indicador de carga
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Iniciando sesión...';
            submitBtn.disabled = true;

            try {
                const response = await window.electroAPI.login({
                    correo: correo,
                    contrasena: contrasena
                });

                showNotification('Inicio de sesión exitoso', 'success');
                
                // Guardar información del usuario
                localStorage.setItem('electrocloud_user', JSON.stringify(response.user));
                
                // Redirigir según el rol
                setTimeout(() => {
                    if (response.user.rol === 'admin') {
                        window.location.href = 'InicioAdmin.html';
                    } else {
                        window.location.href = 'InicioUsuario.html';
                    }
                }, 1000);

            } catch (error) {
                console.error('Error en login:', error);
                showNotification(error.message || 'Error al iniciar sesión', 'error');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // Verificar conexión con el backend
    checkBackendConnection();
});

// ✅ MODIFICAR LA FUNCIÓN PARA QUE NO REDIRIJA AUTOMÁTICAMENTE
async function checkExistingSession() {
    try {
        const verification = await window.electroAPI.verifyToken();
        if (verification && verification.valid) {
            // Solo mostrar un mensaje, no redirigir automáticamente
            console.log('Sesión activa detectada para:', verification.user.nombre);
            showNotification(`Bienvenido de nuevo, ${verification.user.nombre}`, 'info');
            
            // Opcional: Mostrar un botón para ir al dashboard
            setTimeout(() => {
                if (confirm(`¿Quieres ir a tu dashboard, ${verification.user.nombre}?`)) {
                    const user = verification.user;
                    if (user.rol === 'admin') {
                        window.location.href = 'InicioAdmin.html';
                    } else {
                        window.location.href = 'InicioUsuario.html';
                    }
                }
            }, 1500);
        }
    } catch (error) {
        console.log('No hay sesión activa');
    }
}

async function checkBackendConnection() {
    try {
        const health = await window.electroAPI.checkConnection();
        if (health && health.status === 'OK') {
            console.log('✅ Conexión con backend establecida');
        } else {
            showNotification('No se puede conectar con el servidor', 'warning');
        }
    } catch (error) {
        showNotification('Servidor no disponible', 'error');
    }
}

// Función para mostrar notificaciones (si no está en common.js)
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : type === 'warning' ? '#f39c12' : '#3498db'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 1rem;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}