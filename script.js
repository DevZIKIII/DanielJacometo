document.addEventListener('DOMContentLoaded', function() {
    // --- THEME TOGGLE ---
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'light') {
        document.documentElement.classList.add('light-theme');
    }
    themeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('light-theme');
        let theme = document.documentElement.classList.contains('light-theme') ? 'light' : 'dark';
        localStorage.setItem('theme', theme);
    });

    // --- MOBILE MENU ---
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));

    // --- TYPING EFFECT ---
    const typingElement = document.getElementById('typing-effect');
    if (typingElement) {
        new Typed('#typing-effect', {
            strings: ['Desenvolvedor Full Stack', 'Game Developer'],
            typeSpeed: 50,
            backSpeed: 25,
            backDelay: 1500,
            loop: true
        });
    }

    // --- SCROLL ANIMATIONS ---
    const sections = document.querySelectorAll('.section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    sections.forEach(section => observer.observe(section));

    // --- BACK TO TOP BUTTON ---
    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            backToTopButton.classList.toggle('visible', window.scrollY > 300);
        });
    }
    
    // --- CONTACT FORM ---
    const form = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    if(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(form);
            // Cole sua Chave de Acesso Web3Forms aqui
            formData.set("access_key", "16ec7e46-8ddb-4992-99ef-187214c00a94");
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);
            formStatus.innerHTML = "Enviando...";

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
            .then(async (response) => {
                let json = await response.json();
                if (response.status == 200) {
                    formStatus.innerHTML = "Mensagem enviada com sucesso!";
                    formStatus.style.color = "green";
                } else {
                    console.log(response);
                    formStatus.innerHTML = json.message;
                    formStatus.style.color = "red";
                }
            })
            .catch(error => {
                console.log(error);
                formStatus.innerHTML = "Algo deu errado. Tente novamente.";
                formStatus.style.color = "red";
            })
            .then(function() {
                form.reset();
                setTimeout(() => {
                    formStatus.innerHTML = "";
                }, 5000);
            });
        });
    }
});