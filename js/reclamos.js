// JavaScript específico para la página de reclamos
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const reclamoForm = document.getElementById('reclamo-form');
    const fallaForm = document.getElementById('falla-form');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const reclamosGrid = document.getElementById('reclamos-grid');

    // Manejo de tabs
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            
            // Actualizar botones activos
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Mostrar/ocultar formularios
            if (tab === 'reclamo') {
                reclamoForm.classList.remove('hidden');
                fallaForm.classList.add('hidden');
            } else {
                reclamoForm.classList.add('hidden');
                fallaForm.classList.remove('hidden');
            }
        });
    });

    // Manejo del formulario de reclamo
    reclamoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateForm(reclamoForm)) {
            showNotification('Por favor completa todos los campos requeridos', 'error');
            return;
        }

        const formData = new FormData(reclamoForm);
        const tipoReclamo = formData.get('tipo-reclamo');
        const prioridad = formData.get('prioridad');
        const asunto = formData.get('asunto');
        const descripcion = formData.get('descripcion');

        // Simular envío
        showNotification('Enviando reclamo...', 'info');
        
        setTimeout(() => {
            const nuevoReclamo = crearNuevoReclamo({
                tipo: 'reclamo',
                tipoReclamo,
                prioridad,
                asunto,
                descripcion,
                fecha: new Date().toLocaleDateString('es-ES'),
                id: generateReclamoId()
            });
            
            // Agregar al grid
            reclamosGrid.insertBefore(nuevoReclamo, reclamosGrid.firstChild);
            
            // Limpiar formulario
            clearForm(reclamoForm);
            
            showNotification('Reclamo enviado exitosamente', 'success');
        }, 1500);
    });

    // Manejo del formulario de falla
    fallaForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateForm(fallaForm)) {
            showNotification('Por favor completa todos los campos requeridos', 'error');
            return;
        }

        const formData = new FormData(fallaForm);
        const tipoFalla = formData.get('tipo-falla');
        const fechaFalla = formData.get('fecha-falla');
        const ubicacion = formData.get('ubicacion');
        const descripcionFalla = formData.get('descripcion-falla');
        const afectados = formData.get('afectados');

        // Simular envío
        showNotification('Reportando falla...', 'info');
        
        setTimeout(() => {
            const nuevoReporte = crearNuevoReclamo({
                tipo: 'falla',
                tipoFalla,
                fechaFalla,
                ubicacion,
                descripcion: descripcionFalla,
                afectados,
                fecha: new Date().toLocaleDateString('es-ES'),
                id: generateFallaId()
            });
            
            // Agregar al grid
            reclamosGrid.insertBefore(nuevoReporte, reclamosGrid.firstChild);
            
            // Limpiar formulario
            clearForm(fallaForm);
            
            showNotification('Falla reportada exitosamente', 'success');
        }, 1500);
    });

    // Manejo de filtros
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Actualizar botones activos
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filtrar reclamos
            filterReclamos(filter);
        });
    });

    // Función para crear nuevo reclamo
    function crearNuevoReclamo(data) {
        const card = document.createElement('div');
        card.className = 'reclamo-card';
        card.setAttribute('data-status', 'abierto');
        
        let tipoIcono = '';
        let tipoTexto = '';
        
        if (data.tipo === 'reclamo') {
            tipoIcono = getTipoReclamoIcon(data.tipoReclamo);
            tipoTexto = data.tipoReclamo.charAt(0).toUpperCase() + data.tipoReclamo.slice(1);
        } else {
            tipoIcono = '⚠️';
            tipoTexto = 'Falla';
        }
        
        card.innerHTML = `
            <div class="card-header">
                <div class="card-id">${data.id}</div>
                <div class="card-status abierto">Abierto</div>
            </div>
            <div class="card-content">
                <h3>${data.asunto || data.tipoFalla}</h3>
                <p>${data.descripcion}</p>
                <div class="card-meta">
                    <span class="card-date">📅 ${data.fecha}</span>
                    <span class="card-type">${tipoIcono} ${tipoTexto}</span>
                    <span class="card-priority ${data.prioridad || 'media'}">
                        ${getPriorityIcon(data.prioridad || 'media')} ${(data.prioridad || 'media').charAt(0).toUpperCase() + (data.prioridad || 'media').slice(1)}
                    </span>
                </div>
            </div>
            <div class="card-actions">
                <button class="btn-action">Ver Detalles</button>
                <button class="btn-action secondary">Actualizar</button>
            </div>
        `;
        
        // Agregar event listeners a los botones
        const actionButtons = card.querySelectorAll('.btn-action');
        actionButtons.forEach(button => {
            button.addEventListener('click', function() {
                const action = this.textContent;
                if (action === 'Ver Detalles') {
                    showNotification(`Abriendo detalles de ${data.id}`, 'info');
                } else if (action === 'Actualizar') {
                    showNotification(`Actualizando ${data.id}`, 'info');
                }
            });
        });
        
        return card;
    }

    // Función para filtrar reclamos
    function filterReclamos(filter) {
        const reclamoCards = document.querySelectorAll('.reclamo-card');
        
        reclamoCards.forEach(card => {
            const status = card.getAttribute('data-status');
            
            if (filter === 'todos' || status === filter) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Funciones auxiliares
    function generateReclamoId() {
        const year = new Date().getFullYear();
        const number = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `#REC-${year}-${number}`;
    }

    function generateFallaId() {
        const year = new Date().getFullYear();
        const number = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `#FAL-${year}-${number}`;
    }

    function getTipoReclamoIcon(tipo) {
        const icons = {
            'facturacion': '💰',
            'calidad': '⚡',
            'atencion': '👥',
            'cobro': '💳',
            'otro': '📋'
        };
        return icons[tipo] || '📋';
    }

    function getPriorityIcon(prioridad) {
        const icons = {
            'baja': '🟢',
            'media': '🟡',
            'alta': '🔴',
            'urgente': '🔴'
        };
        return icons[prioridad] || '🟡';
    }

    // Validación en tiempo real para campos específicos
    const selectFields = document.querySelectorAll('select[required]');
    selectFields.forEach(select => {
        select.addEventListener('change', function() {
            if (this.value) {
                this.style.borderColor = 'var(--border-color)';
            } else {
                this.style.borderColor = 'var(--danger-color)';
            }
        });
    });

    // Manejo de archivos
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
        input.addEventListener('change', function() {
            const files = this.files;
            let totalSize = 0;
            
            for (let file of files) {
                totalSize += file.size;
                if (file.size > 5 * 1024 * 1024) { // 5MB
                    showNotification(`El archivo ${file.name} es demasiado grande`, 'error');
                    this.value = '';
                    return;
                }
            }
            
            if (files.length > 0) {
                showNotification(`${files.length} archivo(s) seleccionado(s)`, 'info');
            }
        });
    });

    // Event listeners para botones existentes
    const existingActionButtons = document.querySelectorAll('.reclamo-card .btn-action');
    existingActionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.reclamo-card');
            const reclamoId = card.querySelector('.card-id').textContent;
            const action = this.textContent;
            
            switch(action) {
                case 'Ver Detalles':
                    showNotification(`Abriendo detalles de ${reclamoId}`, 'info');
                    break;
                case 'Seguimiento':
                    showNotification(`Consultando seguimiento de ${reclamoId}`, 'info');
                    break;
                case 'Calificar':
                    showNotification(`Abriendo calificación de ${reclamoId}`, 'info');
                    break;
                case 'Actualizar':
                    showNotification(`Actualizando ${reclamoId}`, 'info');
                    break;
                default:
                    showNotification(`Acción: ${action} para ${reclamoId}`, 'info');
            }
        });
    });

    // Animaciones para las cards
    function animateCards() {
        const cards = document.querySelectorAll('.reclamo-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 150);
        });
    }

    // Ejecutar animaciones
    animateCards();

    // Configurar fecha y hora actuales para el campo de fecha de falla
    const fechaFallaInput = document.getElementById('fecha-falla');
    if (fechaFallaInput) {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        
        fechaFallaInput.value = `${year}-${month}-${day}T${hours}:${minutes}`;
    }
});
