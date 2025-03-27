document.addEventListener('DOMContentLoaded', () => {
    // Sidebar responsiva
    const toggleSidebar = () => {
        document.querySelector('.sidebar').classList.toggle('active');
    };

    document.querySelector('.menu-toggle').addEventListener('click', toggleSidebar);
    
    // Cierre automático en móviles
    document.addEventListener('click', (e) => {
        if (window.innerWidth < 768 && 
            !e.target.closest('.sidebar') && 
            !e.target.closest('.menu-toggle')) {
            document.querySelector('.sidebar').classList.remove('active');
        }
    });
});