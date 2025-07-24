// JavaScript para la página de login
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    
    // Verificar si ya hay una sesión activa
    checkExistingSession();

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
                
                // ✅ CORREGIDO: Rutas relativas correctas
                setTimeout(() => {
                    if (response.user.rol === 'admin') {
                        window.location.href = 'InicioAdmin.html';  // ← Sin "pages/"
                    } else {
                        window.location.href = 'InicioUsuario.html'; // ← Sin "pages/"
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

async function checkExistingSession() {
    try {
        const verification = await window.electroAPI.verifyToken();
        if (verification && verification.valid) {
            const user = verification.user;
            // ✅ CORREGIDO: Rutas relativas correctas
            if (user.rol === 'admin') {
                window.location.href = 'InicioAdmin.html';  // ← Sin "pages/"
            } else {
                window.location.href = 'InicioUsuario.html'; // ← Sin "pages/"
            }
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