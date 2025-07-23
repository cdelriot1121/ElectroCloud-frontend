// JavaScript para la página de registro
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.querySelector('.register-form');
    
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Obtener datos del formulario
            const formData = new FormData(registerForm);
            const userData = {
                nombre: formData.get('nombre'),
                correo: formData.get('email'),
                contrasena: formData.get('password'),
                ciudad: formData.get('ciudad'),
                direccion: formData.get('direccion'),
                nit_poliza: formData.get('nit')
            };

            // Validaciones básicas
            if (!userData.nombre || !userData.correo || !userData.contrasena || !userData.ciudad) {
                showNotification('Por favor completa todos los campos requeridos', 'error');
                return;
            }

            // Validar formato de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(userData.correo)) {
                showNotification('Por favor ingresa un correo electrónico válido', 'error');
                return;
            }

            // Validar longitud de contraseña
            if (userData.contrasena.length < 6) {
                showNotification('La contraseña debe tener al menos 6 caracteres', 'error');
                return;
            }

            // Mostrar indicador de carga
            const submitBtn = registerForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Registrando...';
            submitBtn.disabled = true;

            try {
                const response = await window.electroAPI.register(userData);
                
                showNotification('¡Registro exitoso! Redirigiendo...', 'success');
                
                // Guardar información del usuario
                localStorage.setItem('electrocloud_user', JSON.stringify(response.user));
                
                // Redirigir al dashboard del usuario (siempre será cliente en registro)
                setTimeout(() => {
                    window.location.href = 'InicioUsuario.html';
                }, 1500);

            } catch (error) {
                console.error('Error en registro:', error);
                showNotification(error.message || 'Error al registrar usuario', 'error');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // Validación en tiempo real
    setupRealTimeValidation();
});

function setupRealTimeValidation() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');

    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (this.value && !emailRegex.test(this.value)) {
                this.style.borderColor = '#e74c3c';
                showFieldError(this, 'Formato de correo inválido');
            } else {
                this.style.borderColor = '';
                clearFieldError(this);
            }
        });
    }

    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            if (this.value.length > 0 && this.value.length < 6) {
                this.style.borderColor = '#e74c3c';
                showFieldError(this, 'Mínimo 6 caracteres');
            } else {
                this.style.borderColor = '';
                clearFieldError(this);
            }
        });
    }

    if (confirmPasswordInput && passwordInput) {
        confirmPasswordInput.addEventListener('blur', function() {
            if (this.value && this.value !== passwordInput.value) {
                this.style.borderColor = '#e74c3c';
                showFieldError(this, 'Las contraseñas no coinciden');
            } else {
                this.style.borderColor = '';
                clearFieldError(this);
            }
        });
    }
}

function showFieldError(field, message) {
    clearFieldError(field);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.cssText = 'color: #e74c3c; font-size: 0.8rem; margin-top: 0.25rem;';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

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