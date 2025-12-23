document.addEventListener("DOMContentLoaded", () => {

    /* --- 2. ACTIVAR LINK DE BARRA LATERAL AL SCROLL --- */
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });


    /* --- 3. NUEVO: ANIMACIÓN DE CÍRCULOS (SKILLS) --- */
    const skillsSection = document.getElementById('skills');
    const progressCircles = document.querySelectorAll('.circular-chart');

    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // SI ENTRA EN PANTALLA: Animamos hacia arriba
                animateProgress();
            } else {
                // SI SALE DE PANTALLA: Reseteamos a 0 para la próxima vez
                resetProgress();
            }
        });
    }, { threshold: 0.5 }); // Se activa al ver el 50% de la sección

    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }

    // Función para animar (Llenar)
    function animateProgress() {
        progressCircles.forEach(chart => {
            const percent = chart.getAttribute('data-percent');
            const circle = chart.querySelector('.circle');
            const text = chart.querySelector('.percentage');

            // 1. Animar Círculo (CSS Transition lo hace suave)
            // Pequeño delay para que no sea instantáneo si scrolleas muy rápido
            setTimeout(() => {
                circle.style.strokeDasharray = `${percent}, 100`;
            }, 100);

            // 2. Animar Números
            let currentNum = 0;
            // Limpiamos cualquier intervalo anterior para evitar bugs visuales
            if (chart.dataset.interval) clearInterval(chart.dataset.interval);

            const timer = setInterval(() => {
                if (currentNum >= percent) {
                    clearInterval(timer);
                    text.textContent = percent + "%";
                } else {
                    currentNum++;
                    text.textContent = currentNum + "%";
                }
            }, 20); // Velocidad del contador

            // Guardamos el ID del intervalo en el elemento para poder limpiarlo luego
            chart.dataset.interval = timer;
        });
    }

    // Función para resetear (Vaciar)
    function resetProgress() {
        progressCircles.forEach(chart => {
            const circle = chart.querySelector('.circle');
            const text = chart.querySelector('.percentage');

            // Paramos el contador de números si aún está corriendo
            if (chart.dataset.interval) clearInterval(chart.dataset.interval);

            // Vaciamos el círculo y el texto
            circle.style.strokeDasharray = "0, 100";
            text.textContent = "0%";
        });
    }

    /* --- 4. ANIMACIÓN TIMELINE (EXPERIENCIA) --- */
    const experienceSection = document.getElementById('experience');
    const timeline = document.querySelector('.timeline');
    const timelineItems = document.querySelectorAll('.timeline-item');

    const experienceObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 1. DIBUJAR LA LÍNEA
                timeline.classList.add('line-active');

                // 2. MOSTRAR ÍTEMS EN CASCADA (Uno por uno)
                timelineItems.forEach((item, index) => {
                    // Multiplicamos el índice por 300ms. 
                    // El 1ro espera 300ms, el 2do 600ms, el 3ro 900ms...
                    setTimeout(() => {
                        item.classList.add('item-active');
                    }, (index + 1) * 300); 
                });

            } else {
                // RESETEAR AL SALIR
                timeline.classList.remove('line-active');
                timelineItems.forEach(item => {
                    item.classList.remove('item-active');
                });
            }
        });
    }, { threshold: 0.3 }); // Se activa al ver el 30% de la sección

    if (experienceSection) {
        experienceObserver.observe(experienceSection);
    }

    /* --- 5. ANIMACIÓN PROYECTOS (STACK) --- */
    const projectsSection = document.getElementById('projects');
    const projectStack = document.querySelector('.proyecto-preview-stack');

    const projectsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // CUANDO ENTRA: Añadir clase para animar entrada
                if(projectStack) {
                    projectStack.classList.add('stack-active');
                }
            } else {
                // CUANDO SALE: Quitar clase para repetir animación luego
                if(projectStack) {
                    projectStack.classList.remove('stack-active');
                }
            }
        });
    }, { threshold: 0.3 }); // Se activa al ver el 30% de la sección

    if (projectsSection) {
        projectsObserver.observe(projectsSection);
    }

    /* --- 6. MENÚ HAMBURGUESA (MÓVIL) --- */
    const menuToggle = document.getElementById('mobile-menu');
    const sidebar = document.getElementById('sidebar');
    const navLinksItems = document.querySelectorAll('.nav-links a');

    // 1. Abrir / Cerrar al tocar el botón
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            
            // Cambiar icono (de hamburguesa a X)
            const icon = menuToggle.querySelector('i');
            if (sidebar.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // 2. Cerrar menú al tocar un enlace
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            // Solo si estamos en móvil (si el sidebar tiene la clase active)
            if (sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
                // Restaurar icono
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });

    // 3. Cerrar al tocar fuera del menú (Opcional pero recomendado)
    document.addEventListener('click', (e) => {
        if (sidebar.classList.contains('active') && 
            !sidebar.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            
            sidebar.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

});