// Configuración y funciones para comunicación con el backend
class ElectroCloudAPI {
    constructor() {
        this.baseURL = 'https://56.124.98.165/api';
        this.token = localStorage.getItem('electrocloud_token');
    }

    // Configurar headers por defecto
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json',
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        return headers;
    }

    // Manejar respuestas de la API
    async handleResponse(response) {
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Error en la solicitud');
        }
        return await response.json();
    }

    // AUTH ENDPOINTS
    async register(userData) {
        try {
            const response = await fetch(`${this.baseURL}/auth/register`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(userData)
            });

            const data = await this.handleResponse(response);
            
            if (data.token) {
                this.setToken(data.token);
            }

            return data;
        } catch (error) {
            console.error('Error en registro:', error);
            throw error;
        }
    }

    async login(credentials) {
        try {
            const response = await fetch(`${this.baseURL}/auth/login`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(credentials)
            });

            const data = await this.handleResponse(response);
            
            if (data.token) {
                this.setToken(data.token);
            }

            return data;
        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        }
    }

    async verifyToken() {
        try {
            if (!this.token) return null;

            const response = await fetch(`${this.baseURL}/auth/verify`, {
                headers: this.getHeaders()
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error verificando token:', error);
            this.removeToken();
            return null;
        }
    }

    // USER ENDPOINTS
    async getUserProfile() {
        try {
            const response = await fetch(`${this.baseURL}/user/profile`, {
                headers: this.getHeaders()
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error obteniendo perfil:', error);
            throw error;
        }
    }

    async getLatestConsumption() {
        try {
            const response = await fetch(`${this.baseURL}/user/consumption/latest`, {
                headers: this.getHeaders()
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error obteniendo consumo:', error);
            throw error;
        }
    }

    async getLatestBill() {
        try {
            const response = await fetch(`${this.baseURL}/user/bill/latest`, {
                headers: this.getHeaders()
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error obteniendo factura:', error);
            throw error;
        }
    }

    async getUserClaims() {
        try {
            const response = await fetch(`${this.baseURL}/user/claims`, {
                headers: this.getHeaders()
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error obteniendo reclamos:', error);
            throw error;
        }
    }

    // CONSUMPTION ENDPOINTS
    async getConsumptionHistory(limit = 12) {
        try {
            const response = await fetch(`${this.baseURL}/consumption/history?limit=${limit}`, {
                headers: this.getHeaders()
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error obteniendo historial de consumo:', error);
            throw error;
        }
    }

    async registerConsumption(consumptionData) {
        try {
            const response = await fetch(`${this.baseURL}/consumption/register`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(consumptionData)
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error registrando consumo:', error);
            throw error;
        }
    }

    // BILLS ENDPOINTS
    async getBills(estado = null, limit = 10) {
        try {
            let url = `${this.baseURL}/bills?limit=${limit}`;
            if (estado) {
                url += `&estado=${estado}`;
            }

            const response = await fetch(url, {
                headers: this.getHeaders()
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error obteniendo facturas:', error);
            throw error;
        }
    }

    async payBill(facturaId, metodoPago = 'online') {
        try {
            const response = await fetch(`${this.baseURL}/bills/pay`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({
                    factura_id: facturaId,
                    metodo_pago: metodoPago
                })
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error procesando pago:', error);
            throw error;
        }
    }

    // CLAIMS ENDPOINTS
    async createClaim(claimData) {
        try {
            const response = await fetch(`${this.baseURL}/claims/create`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(claimData)
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error creando reclamo:', error);
            throw error;
        }
    }

    async getClaims(estado = null, tipo = null) {
        try {
            let url = `${this.baseURL}/claims`;
            const params = new URLSearchParams();
            
            if (estado) params.append('estado', estado);
            if (tipo) params.append('tipo', tipo);
            
            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const response = await fetch(url, {
                headers: this.getHeaders()
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error obteniendo reclamos:', error);
            throw error;
        }
    }

    async getClaimDetails(claimId) {
        try {
            const response = await fetch(`${this.baseURL}/claims/${claimId}`, {
                headers: this.getHeaders()
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error obteniendo detalles del reclamo:', error);
            throw error;
        }
    }

    // NOTIFICATIONS ENDPOINTS
    async getNotifications(limit = 20, leido = null) {
        try {
            let url = `${this.baseURL}/notifications?limit=${limit}`;
            if (leido !== null) {
                url += `&leido=${leido}`;
            }

            const response = await fetch(url, {
                headers: this.getHeaders()
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error obteniendo notificaciones:', error);
            throw error;
        }
    }

    async markNotificationAsRead(notificationId) {
        try {
            const response = await fetch(`${this.baseURL}/notifications/${notificationId}/read`, {
                method: 'PUT',
                headers: this.getHeaders()
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error marcando notificación:', error);
            throw error;
        }
    }

    // TOKEN MANAGEMENT
    setToken(token) {
        this.token = token;
        localStorage.setItem('electrocloud_token', token);
    }

    removeToken() {
        this.token = null;
        localStorage.removeItem('electrocloud_token');
    }

    // UTILITY METHODS
    async checkConnection() {
        try {
            const response = await fetch(`${this.baseURL.replace('/api', '')}/api/health`);
            return await response.json();
        } catch (error) {
            console.error('Error verificando conexión:', error);
            return null;
        }
    }
}

// Crear instancia global de la API
window.electroAPI = new ElectroCloudAPI();