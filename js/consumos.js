// JavaScript específico para la página de consumos
document.addEventListener('DOMContentLoaded', function() {
    const consumoForm = document.getElementById('consumo-form');
    const formSection = document.getElementById('form-section');
    const resumenSection = document.getElementById('resumen-section');
    const nuevoRegistroBtn = document.getElementById('nuevo-registro');

    // Manejar envío del formulario
    consumoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateForm(consumoForm)) {
            showNotification('Por favor completa todos los campos requeridos', 'error');
            return;
        }

        // Obtener datos del formulario
        const formData = new FormData(consumoForm);
        const fechaFactura = formData.get('fecha-factura');
        const consumoKwh = parseFloat(formData.get('consumo-kwh'));
        const habitantes = parseInt(formData.get('habitantes'));
        const infoVerificada = formData.get('info-verificada');
        const terminos = formData.get('terminos');

        if (!infoVerificada || !terminos) {
            showNotification('Debes aceptar las confirmaciones requeridas', 'error');
            return;
        }

        // Generar resumen
        generarResumen(fechaFactura, consumoKwh, habitantes);
        
        // Mostrar sección de resumen
        formSection.style.display = 'none';
        resumenSection.style.display = 'block';
        
        showNotification('Resumen generado exitosamente', 'success');
    });

    // Botón para nuevo registro
    nuevoRegistroBtn.addEventListener('click', function() {
        formSection.style.display = 'block';
        resumenSection.style.display = 'none';
        clearForm(consumoForm);
    });

    function generarResumen(fechaFactura, consumoKwh, habitantes) {
        // Actualizar consumo total
        document.getElementById('consumo-total').innerHTML = `${consumoKwh} <span class="unit">kWh</span>`;
        
        // Formatear fecha
        const fecha = new Date(fechaFactura + '-01');
        const opciones = { year: 'numeric', month: 'long' };
        const fechaFormateada = fecha.toLocaleDateString('es-ES', opciones);
        document.getElementById('periodo-consumo').textContent = fechaFormateada;

        // Calcular consumo por habitante
        const consumoPorHabitante = (consumoKwh / habitantes).toFixed(1);
        document.getElementById('consumo-habitante').innerHTML = `${consumoPorHabitante} <span class="unit">kWh</span>`;

        // Generar comparación
        const comparacionHabitante = document.getElementById('comparacion-habitante');
        if (consumoPorHabitante <= 50) {
            comparacionHabitante.textContent = 'Consumo eficiente';
            comparacionHabitante.className = 'card-comparison eficiente';
        } else if (consumoPorHabitante <= 75) {
            comparacionHabitante.textContent = 'Consumo moderado';
            comparacionHabitante.className = 'card-comparison moderado';
        } else {
            comparacionHabitante.textContent = 'Consumo elevado';
            comparacionHabitante.className = 'card-comparison alto';
        }

        // Calcular nivel de eficiencia
        const eficiencia = calcularEficiencia(consumoKwh, habitantes);
        document.getElementById('nivel-eficiencia').textContent = eficiencia.nivel;
        
        const efficiencyFill = document.getElementById('efficiency-fill');
        efficiencyFill.style.width = `${eficiencia.porcentaje}%`;
        efficiencyFill.className = `efficiency-fill ${eficiencia.clase}`;

        // Generar consejos
        generarConsejos(consumoKwh, habitantes, eficiencia.clase);
    }

    function calcularEficiencia(consumo, habitantes) {
        const consumoPorHabitante = consumo / habitantes;
        
        if (consumoPorHabitante <= 50) {
            return {
                nivel: 'Excelente',
                porcentaje: 85,
                clase: 'eficiente'
            };
        } else if (consumoPorHabitante <= 75) {
            return {
                nivel: 'Bueno',
                porcentaje: 60,
                clase: 'moderado'
            };
        } else if (consumoPorHabitante <= 100) {
            return {
                nivel: 'Regular',
                porcentaje: 40,
                clase: 'moderado'
            };
        } else {
            return {
                nivel: 'Deficiente',
                porcentaje: 20,
                clase: 'alto'
            };
        }
    }

    function generarConsejos(consumo, habitantes, clase) {
        const consejosContainer = document.getElementById('consejos-container');
        consejosContainer.innerHTML = '';

        let consejos = [];

        if (clase === 'eficiente') {
            consejos = [
                {
                    titulo: '¡Excelente trabajo!',
                    descripcion: 'Tu consumo es muy eficiente. Continúa con estos buenos hábitos de ahorro energético.',
                    clase: 'eficiente'
                },
                {
                    titulo: 'Mantén el buen ritmo',
                    descripcion: 'Considera instalar paneles solares para reducir aún más tu dependencia de la red eléctrica.',
                    clase: 'eficiente'
                },
                {
                    titulo: 'Comparte tus consejos',
                    descripcion: 'Ayuda a tus vecinos compartiendo tus mejores prácticas de ahorro energético.',
                    clase: 'eficiente'
                }
            ];
        } else if (clase === 'moderado') {
            consejos = [
                {
                    titulo: 'Optimiza tu iluminación',
                    descripcion: 'Cambia todas las bombillas por tecnología LED. Pueden reducir el consumo hasta en un 80%.',
                    clase: 'moderado'
                },
                {
                    titulo: 'Electrodomésticos eficientes',
                    descripcion: 'Desconecta los electrodomésticos cuando no los uses. Muchos consumen energía en modo standby.',
                    clase: 'moderado'
                },
                {
                    titulo: 'Aire acondicionado',
                    descripcion: 'Mantén el termostato entre 22-24°C. Cada grado menos puede aumentar el consumo hasta 8%.',
                    clase: 'moderado'
                }
            ];
        } else {
            consejos = [
                {
                    titulo: 'Revisión urgente',
                    descripcion: 'Tu consumo es muy elevado. Revisa si hay equipos dañados o instalaciones con fugas eléctricas.',
                    clase: 'alto'
                },
                {
                    titulo: 'Hábitos de consumo',
                    descripcion: 'Evita usar varios electrodomésticos de alto consumo al mismo tiempo (lavadora, secadora, etc.).',
                    clase: 'alto'
                },
                {
                    titulo: 'Horarios de consumo',
                    descripcion: 'Programa el uso de electrodomésticos en horarios de menor demanda para reducir costos.',
                    clase: 'alto'
                }
            ];
        }

        consejos.forEach(consejo => {
            const consejoCard = document.createElement('div');
            consejoCard.className = `consejo-card ${consejo.clase}`;
            consejoCard.innerHTML = `
                <h4>${consejo.titulo}</h4>
                <p>${consejo.descripcion}</p>
            `;
            consejosContainer.appendChild(consejoCard);
        });
    }

    // Validación en tiempo real
    const inputs = consumoForm.querySelectorAll('input[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (!this.value.trim()) {
                this.style.borderColor = 'var(--danger-color)';
            } else {
                this.style.borderColor = 'var(--border-color)';
            }
        });

        input.addEventListener('input', function() {
            if (this.value.trim()) {
                this.style.borderColor = 'var(--border-color)';
            }
        });
    });

    // Validación específica para números
    const numeroInputs = consumoForm.querySelectorAll('input[type="number"]');
    numeroInputs.forEach(input => {
        input.addEventListener('input', function() {
            const valor = parseFloat(this.value);
            if (this.id === 'consumo-kwh' && valor < 0) {
                this.value = 0;
            }
            if (this.id === 'habitantes' && (valor < 1 || valor > 20)) {
                this.style.borderColor = 'var(--danger-color)';
            } else {
                this.style.borderColor = 'var(--border-color)';
            }
        });
    });
});
