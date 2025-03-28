// Constantes
const MOBILE_BREAKPOINT = 768;
const DEBOUNCE_DELAY = 150;

// Utilidades
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Clase para manejar el sidebar
class SidebarManager {
    constructor() {
        this.sidebar = document.querySelector('.sidebar');
        this.menuToggle = document.querySelector('.menu-toggle');
        this.isOpen = false;
        
        this.init();
    }
    
    init() {
        if (!this.sidebar || !this.menuToggle) return;
        
        // Event listeners optimizados
        this.menuToggle.addEventListener('click', () => this.toggleSidebar());
        
        // Cierre automático en móviles con debounce
        document.addEventListener('click', debounce((e) => {
            if (window.innerWidth < MOBILE_BREAKPOINT && 
                !e.target.closest('.sidebar') && 
                !e.target.closest('.menu-toggle')) {
                this.closeSidebar();
            }
        }, DEBOUNCE_DELAY));
        
        // Manejo de resize con debounce
        window.addEventListener('resize', debounce(() => {
            if (window.innerWidth >= MOBILE_BREAKPOINT) {
                this.closeSidebar();
            }
        }, DEBOUNCE_DELAY));
    }
    
    toggleSidebar() {
        this.isOpen = !this.isOpen;
        this.sidebar.classList.toggle('active');
        this.updateAriaAttributes();
    }
    
    closeSidebar() {
        if (this.isOpen) {
            this.isOpen = false;
            this.sidebar.classList.remove('active');
            this.updateAriaAttributes();
        }
    }
    
    updateAriaAttributes() {
        this.sidebar.setAttribute('aria-expanded', this.isOpen);
        this.menuToggle.setAttribute('aria-expanded', this.isOpen);
    }
}

// Clase para manejar el scroll suave
class SmoothScroll {
    constructor() {
        this.init();
    }
    
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar componentes
    new SidebarManager();
    new SmoothScroll();
    
    // Optimización de rendimiento
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            // Cargar recursos no críticos
            document.querySelectorAll('img[data-src]').forEach(img => {
                img.src = img.dataset.src;
            });
        });
    }
});