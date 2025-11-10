// assets/JS/script.js

// Menu mobile toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const nav = document.querySelector('.nav');
    
    if (mobileMenu && nav) {
        mobileMenu.addEventListener('click', function() {
            nav.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            
            // Animar as barras do menu hamburguer
            const spans = mobileMenu.querySelectorAll('span');
            if (nav.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
                
                // Mostrar o menu mobile
                nav.style.display = 'block';
                nav.style.position = 'absolute';
                nav.style.top = '100%';
                nav.style.left = '0';
                nav.style.right = '0';
                nav.style.background = 'white';
                nav.style.padding = '1rem';
                nav.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
                
                if (nav.querySelector('ul')) {
                    nav.querySelector('ul').style.flexDirection = 'column';
                    nav.querySelectorAll('ul li').forEach(li => {
                        li.style.margin = '0.5rem 0';
                    });
                }
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
                nav.style.display = 'none';
            }
        });
    }
    
    // Adicionar classe ativa aos links de navegação
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav a');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
            link.classList.add('active');
        }
    });
    
    console.log('Nomad Maps carregado com sucesso!');
});
