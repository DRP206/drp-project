// Animation des boutons
document.querySelectorAll('.btn, .choice-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'scale(1.05)';
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'scale(1)';
    });
});

// Effet de chargement
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});