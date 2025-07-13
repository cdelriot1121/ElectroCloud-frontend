// JavaScript específico para la página de facturas
document.addEventListener('DOMContentLoaded', function() {
    const downloadAllBtn = document.getElementById('download-all-btn');
    const exportPaymentsBtn = document.getElementById('export-payments-btn');
    const actionButtons = document.querySelectorAll('.btn-action');

    // Descargar todas las facturas
    downloadAllBtn.addEventListener('click', function() {
        showNotification('Descargando todas las facturas...', 'info');
        
        // Simular descarga
        setTimeout(() => {
            showNotification('Todas las facturas han sido descargadas', 'success');
        }, 2000);
    });

    // Exportar historial de pagos
    exportPaymentsBtn.addEventListener('click', function() {
        showNotification('Exportando historial de pagos...', 'info');
        
        // Simular exportación
        setTimeout(() => {
            showNotification('Historial de pagos exportado exitosamente', 'success');
        }, 1500);
    });

    // Manejar botones de acción
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.title;
            const row = this.closest('tr');
            const periodo = row.querySelector('td:first-child').textContent;
            
            switch(action) {
                case 'Ver factura':
                    showNotification(`Abriendo factura de ${periodo}`, 'info');
                    break;
                    
                case 'Descargar':
                    showNotification(`Descargando factura de ${periodo}`, 'info');
                    setTimeout(() => {
                        showNotification(`Factura de ${periodo} descargada`, 'success');
                    }, 1000);
                    break;
                    
                case 'Pagar':
                    if (this.classList.contains('urgent')) {
                        showNotification(`Redirigiendo a pago urgente de ${periodo}`, 'warning');
                    } else {
                        showNotification(`Redirigiendo a pago de ${periodo}`, 'info');
                    }
                    break;
                    
                case 'Ver recibo':
                    showNotification(`Abriendo recibo de pago de ${periodo}`, 'info');
                    break;
                    
                default:
                    showNotification(`Acción: ${action}`, 'info');
            }
        });
    });

    // Efectos hover para las filas de las tablas
    const tableRows = document.querySelectorAll('tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'rgba(230, 92, 0, 0.08)';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
        });
    });

    // Función para actualizar estados de facturas
    function updateFacturaStatus() {
        const facturaRows = document.querySelectorAll('.facturas-table tbody tr');
        facturaRows.forEach(row => {
            const statusBadge = row.querySelector('.status-badge');
            const vencimiento = row.querySelector('td:nth-child(3)').textContent;
            const today = new Date();
            const vencimientoDate = new Date(vencimiento.split('/').reverse().join('-'));
            
            if (statusBadge.classList.contains('pending')) {
                if (vencimientoDate < today) {
                    statusBadge.textContent = 'Vencida';
                    statusBadge.className = 'status-badge overdue';
                }
            }
        });
    }

    // Actualizar estados al cargar
    updateFacturaStatus();

    // Función para filtrar facturas por estado
    function filterFacturas(estado) {
        const facturaRows = document.querySelectorAll('.facturas-table tbody tr');
        facturaRows.forEach(row => {
            const statusBadge = row.querySelector('.status-badge');
            const currentStatus = statusBadge.className.split(' ')[1];
            
            if (estado === 'all' || currentStatus === estado) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    // Función para buscar facturas
    function searchFacturas(searchTerm) {
        const facturaRows = document.querySelectorAll('.facturas-table tbody tr');
        facturaRows.forEach(row => {
            const periodo = row.querySelector('td:first-child').textContent.toLowerCase();
            const monto = row.querySelector('td:nth-child(5)').textContent.toLowerCase();
            
            if (periodo.includes(searchTerm.toLowerCase()) || monto.includes(searchTerm.toLowerCase())) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    // Agregar funcionalidad de ordenamiento
    function sortTable(table, column, direction) {
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        
        rows.sort((a, b) => {
            const aValue = a.querySelector(`td:nth-child(${column + 1})`).textContent;
            const bValue = b.querySelector(`td:nth-child(${column + 1})`).textContent;
            
            if (direction === 'asc') {
                return aValue.localeCompare(bValue);
            } else {
                return bValue.localeCompare(aValue);
            }
        });
        
        rows.forEach(row => tbody.appendChild(row));
    }

    // Agregar listeners a los headers para ordenamiento
    const tableHeaders = document.querySelectorAll('th');
    tableHeaders.forEach((header, index) => {
        header.style.cursor = 'pointer';
        header.addEventListener('click', function() {
            const table = this.closest('table');
            const currentDirection = this.getAttribute('data-direction') || 'asc';
            const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';
            
            // Limpiar otros headers
            tableHeaders.forEach(h => h.removeAttribute('data-direction'));
            
            // Establecer nueva dirección
            this.setAttribute('data-direction', newDirection);
            
            // Ordenar tabla
            sortTable(table, index, newDirection);
            
            // Mostrar indicador visual
            const indicator = newDirection === 'asc' ? ' ↑' : ' ↓';
            this.textContent = this.textContent.replace(/[↑↓]/g, '') + indicator;
        });
    });

    // Función para resaltar pagos recientes
    function highlightRecentPayments() {
        const paymentRows = document.querySelectorAll('.pagos-table tbody tr');
        const today = new Date();
        const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
        
        paymentRows.forEach(row => {
            const paymentDate = row.querySelector('td:first-child').textContent;
            const paymentDateObj = new Date(paymentDate.split('/').reverse().join('-'));
            
            if (paymentDateObj >= thirtyDaysAgo) {
                row.style.backgroundColor = 'rgba(39, 174, 96, 0.1)';
                row.style.borderLeft = '3px solid var(--success-color)';
            }
        });
    }

    // Resaltar pagos recientes
    highlightRecentPayments();

    // Animaciones para las tablas
    function animateTableRows() {
        const allRows = document.querySelectorAll('tbody tr');
        allRows.forEach((row, index) => {
            row.style.opacity = '0';
            row.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                row.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                row.style.opacity = '1';
                row.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // Ejecutar animaciones
    animateTableRows();
});
