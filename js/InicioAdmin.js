// JavaScript para el Dashboard Administrativo
class AdminDashboard {
    constructor() {
        this.init();
        this.loadDashboardData();
        this.setupEventListeners();
        this.initializeCharts();
    }

    init() {
        // Configuración inicial
        this.currentTab = 'complaints';
        this.charts = {};
        this.mockData = this.generateMockData();
    }

    // Generar datos simulados para el dashboard
    generateMockData() {
        return {
            stats: {
                totalUsers: 15420,
                avgConsumption: 325,
                paidBills: 12856,
                totalRevenue: 4250000
            },
            consumptionData: {
                labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
                data: [280, 310, 295, 340, 325, 360]
            },
            usersData: {
                labels: ['Residencial', 'Comercial', 'Industrial', 'Gubernamental'],
                data: [65, 20, 10, 5],
                colors: ['#3498db', '#e74c3c', '#f39c12', '#27ae60']
            },
            complaints: [
                {
                    id: 'RC-001',
                    user: 'Carlos Mendoza',
                    type: 'Facturación',
                    description: 'Cobro incorrecto en factura del mes de junio',
                    date: '2025-07-12',
                    status: 'pending',
                    priority: 'high'
                },
                {
                    id: 'RC-002',
                    user: 'María García',
                    type: 'Servicio',
                    description: 'Interrupciones frecuentes en el suministro',
                    date: '2025-07-11',
                    status: 'in-progress',
                    priority: 'medium'
                },
                {
                    id: 'RC-003',
                    user: 'Juan Pérez',
                    type: 'Técnico',
                    description: 'Solicitud de revisión de medidor',
                    date: '2025-07-10',
                    status: 'resolved',
                    priority: 'low'
                },
                {
                    id: 'RC-004',
                    user: 'Ana Rodríguez',
                    type: 'Facturación',
                    description: 'Error en cálculo de consumo',
                    date: '2025-07-09',
                    status: 'pending',
                    priority: 'high'
                },
                {
                    id: 'RC-005',
                    user: 'Luis Torres',
                    type: 'Servicio',
                    description: 'Baja tensión en el sector',
                    date: '2025-07-08',
                    status: 'in-progress',
                    priority: 'medium'
                }
            ]
        };
    }

    // Configurar event listeners
    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Refresh data
        const refreshBtn = document.getElementById('refresh-data');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshData());
        }

        // Export report
        const exportBtn = document.getElementById('export-report');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportReport());
        }

        // Tab switching
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                this.switchTab(tabName);
            });
        });

        // Search functionality
        const searchInput = document.getElementById('search-complaints');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.filterComplaints(e.target.value));
        }

        // Status filter
        const statusFilter = document.getElementById('status-filter');
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => this.filterComplaintsByStatus(e.target.value));
        }

        // Report generation
        const reportButtons = document.querySelectorAll('.btn-generate');
        reportButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const reportType = e.target.closest('.btn-generate').dataset.report;
                this.generateReport(reportType);
            });
        });

        // Quick actions
        const actionButtons = document.querySelectorAll('.action-btn');
        actionButtons.forEach(btn => {
            btn.addEventListener('click', () => this.showNotification('Funcionalidad en desarrollo'));
        });

        // Modal functionality
        this.setupModalListeners();
    }

    // Configurar listeners del modal
    setupModalListeners() {
        const modal = document.getElementById('complaint-modal');
        const closeBtn = document.querySelector('.modal-close');
        const closeModalBtn = document.getElementById('close-modal');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }

        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => this.closeModal());
        }

        // Cerrar modal al hacer clic fuera
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }
    }

    // Cargar datos del dashboard
    loadDashboardData() {
        this.updateStatistics();
        this.loadComplaints();
    }

    // Actualizar estadísticas
    updateStatistics() {
        const stats = this.mockData.stats;
        
        // Animación de contadores
        this.animateCounter('total-users', stats.totalUsers);
        this.animateCounter('avg-consumption', stats.avgConsumption, ' kWh');
        this.animateCounter('paid-bills', stats.paidBills);
        this.animateCounter('total-revenue', stats.totalRevenue, '$', true);
    }

    // Animación de contadores
    animateCounter(elementId, target, suffix = '', isRevenue = false) {
        const element = document.getElementById(elementId);
        if (!element) return;

        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            let displayValue = Math.floor(current);
            if (isRevenue) {
                displayValue = displayValue.toLocaleString('es-CO');
            }
            
            element.textContent = displayValue + suffix;
        }, 20);
    }

    // Inicializar gráficos
    initializeCharts() {
        this.createConsumptionChart();
        this.createUsersChart();
    }

    // Crear gráfico de consumo
    createConsumptionChart() {
        const ctx = document.getElementById('consumptionChart');
        if (!ctx) return;

        const data = this.mockData.consumptionData;
        
        this.charts.consumption = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Consumo Promedio (kWh)',
                    data: data.data,
                    borderColor: '#e65c00',
                    backgroundColor: 'rgba(230, 92, 0, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#e65c00',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    // Crear gráfico de usuarios
    createUsersChart() {
        const ctx = document.getElementById('usersChart');
        if (!ctx) return;

        const data = this.mockData.usersData;
        
        this.charts.users = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.data,
                    backgroundColor: data.colors,
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Cargar quejas y reclamos
    loadComplaints() {
        const tbody = document.getElementById('complaints-tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        
        this.mockData.complaints.forEach(complaint => {
            const row = this.createComplaintRow(complaint);
            tbody.appendChild(row);
        });
    }

    // Crear fila de reclamo
    createComplaintRow(complaint) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${complaint.id}</td>
            <td>${complaint.user}</td>
            <td>${complaint.type}</td>
            <td>${complaint.description.substring(0, 50)}...</td>
            <td>${this.formatDate(complaint.date)}</td>
            <td><span class="status-badge ${complaint.status}">${this.getStatusText(complaint.status)}</span></td>
            <td><span class="priority-badge ${complaint.priority}">${this.getPriorityText(complaint.priority)}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn-action view" onclick="adminDashboard.viewComplaint('${complaint.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-action edit" onclick="adminDashboard.editComplaint('${complaint.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </td>
        `;
        return row;
    }

    // Formatear fecha
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    // Obtener texto de estado
    getStatusText(status) {
        const statusMap = {
            'pending': 'Pendiente',
            'in-progress': 'En Proceso',
            'resolved': 'Resuelto'
        };
        return statusMap[status] || status;
    }

    // Obtener texto de prioridad
    getPriorityText(priority) {
        const priorityMap = {
            'low': 'Baja',
            'medium': 'Media',
            'high': 'Alta'
        };
        return priorityMap[priority] || priority;
    }

    // Cambiar tema
    toggleTheme() {
        document.body.classList.toggle('dark-theme');
        const themeIcon = document.querySelector('#theme-toggle i');
        
        if (document.body.classList.contains('dark-theme')) {
            themeIcon.className = 'fas fa-sun';
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.className = 'fas fa-moon';
            localStorage.setItem('theme', 'light');
        }
    }

    // Actualizar datos
    refreshData() {
        this.showNotification('Actualizando datos...', 'info');
        
        // Simular carga de datos
        setTimeout(() => {
            this.mockData = this.generateMockData();
            this.loadDashboardData();
            
            // Actualizar gráficos
            if (this.charts.consumption) {
                this.charts.consumption.data.datasets[0].data = this.mockData.consumptionData.data;
                this.charts.consumption.update();
            }
            
            this.showNotification('Datos actualizados correctamente', 'success');
        }, 1500);
    }

    // Exportar reporte
    exportReport() {
        this.showNotification('Generando reporte...', 'info');
        
        // Simular exportación
        setTimeout(() => {
            const data = {
                fecha: new Date().toISOString().split('T')[0],
                usuarios: this.mockData.stats.totalUsers,
                consumo: this.mockData.stats.avgConsumption,
                facturas: this.mockData.stats.paidBills,
                ingresos: this.mockData.stats.totalRevenue
            };
            
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `reporte-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showNotification('Reporte exportado correctamente', 'success');
        }, 1000);
    }

    // Cambiar tab
    switchTab(tabName) {
        // Actualizar botones
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Actualizar contenido
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');
        
        this.currentTab = tabName;
    }

    // Filtrar reclamos por búsqueda
    filterComplaints(searchTerm) {
        const rows = document.querySelectorAll('#complaints-tbody tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            const show = text.includes(searchTerm.toLowerCase());
            row.style.display = show ? '' : 'none';
        });
    }

    // Filtrar reclamos por estado
    filterComplaintsByStatus(status) {
        const rows = document.querySelectorAll('#complaints-tbody tr');
        
        rows.forEach(row => {
            const statusCell = row.querySelector('.status-badge');
            const show = status === 'all' || statusCell.classList.contains(status);
            row.style.display = show ? '' : 'none';
        });
    }

    // Ver detalles de reclamo
    viewComplaint(id) {
        const complaint = this.mockData.complaints.find(c => c.id === id);
        if (!complaint) return;

        const modal = document.getElementById('complaint-modal');
        const details = document.getElementById('complaint-details');
        
        details.innerHTML = `
            <div class="complaint-details">
                <div class="detail-row">
                    <strong>ID:</strong> ${complaint.id}
                </div>
                <div class="detail-row">
                    <strong>Usuario:</strong> ${complaint.user}
                </div>
                <div class="detail-row">
                    <strong>Tipo:</strong> ${complaint.type}
                </div>
                <div class="detail-row">
                    <strong>Descripción:</strong> ${complaint.description}
                </div>
                <div class="detail-row">
                    <strong>Fecha:</strong> ${this.formatDate(complaint.date)}
                </div>
                <div class="detail-row">
                    <strong>Estado:</strong> 
                    <span class="status-badge ${complaint.status}">${this.getStatusText(complaint.status)}</span>
                </div>
                <div class="detail-row">
                    <strong>Prioridad:</strong> 
                    <span class="priority-badge ${complaint.priority}">${this.getPriorityText(complaint.priority)}</span>
                </div>
            </div>
        `;
        
        modal.style.display = 'block';
    }

    // Editar reclamo
    editComplaint(id) {
        this.showNotification('Función de edición en desarrollo', 'info');
    }

    // Cerrar modal
    closeModal() {
        const modal = document.getElementById('complaint-modal');
        modal.style.display = 'none';
    }

    // Generar reporte específico
    generateReport(type) {
        const reportTypes = {
            'consumption': 'Reporte de Consumo',
            'users': 'Reporte de Usuarios',
            'financial': 'Reporte Financiero',
            'incidents': 'Reporte de Incidencias'
        };
        
        this.showNotification(`Generando ${reportTypes[type]}...`, 'info');
        
        setTimeout(() => {
            this.showNotification(`${reportTypes[type]} generado correctamente`, 'success');
        }, 1500);
    }

    // Mostrar notificación
    showNotification(message, type = 'info') {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;
        
        // Estilos de notificación
        notification.style.cssText = `
            position: fixed;
            top: 90px;
            right: 20px;
            background: var(--admin-card-bg);
            color: var(--admin-text);
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: var(--admin-shadow-hover);
            z-index: 3000;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            max-width: 400px;
            animation: slideIn 0.3s ease-out;
            border-left: 4px solid ${this.getNotificationColor(type)};
        `;
        
        document.body.appendChild(notification);
        
        // Auto-cerrar después de 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease-in';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 5000);
        
        // Cerrar manualmente
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
    }

    // Obtener icono de notificación
    getNotificationIcon(type) {
        const icons = {
            'info': 'info-circle',
            'success': 'check-circle',
            'warning': 'exclamation-triangle',
            'error': 'times-circle'
        };
        return icons[type] || 'info-circle';
    }

    // Obtener color de notificación
    getNotificationColor(type) {
        const colors = {
            'info': '#3498db',
            'success': '#27ae60',
            'warning': '#f39c12',
            'error': '#e74c3c'
        };
        return colors[type] || '#3498db';
    }

    // Inicializar tema guardado
    initTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            const themeIcon = document.querySelector('#theme-toggle i');
            if (themeIcon) {
                themeIcon.className = 'fas fa-sun';
            }
        }
    }
}

// Agregar estilos de animación para notificaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-close {
        background: none;
        border: none;
        font-size: 1.2rem;
        cursor: pointer;
        color: var(--admin-text-light);
        margin-left: auto;
    }
    
    .detail-row {
        margin-bottom: 0.75rem;
        padding: 0.5rem;
        background: var(--admin-bg);
        border-radius: 4px;
    }
`;
document.head.appendChild(style);

// Inicializar dashboard cuando se carga la página
let adminDashboard;
document.addEventListener('DOMContentLoaded', () => {
    adminDashboard = new AdminDashboard();
    adminDashboard.initTheme();
});
