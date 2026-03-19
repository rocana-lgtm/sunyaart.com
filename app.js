document.addEventListener('DOMContentLoaded', () => {
    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Reveal Animation on Scroll
    const reveals = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 150;

        reveals.forEach(reveal => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    };
    
    // Initial check
    revealOnScroll();
    window.addEventListener('scroll', revealOnScroll);

    // Currency Toggle Logic
    const toggleBtn = document.getElementById('currency-toggle');
    const spanKrw = document.querySelector('.currency-krw');
    const spanUsd = document.querySelector('.currency-usd');
    const priceTags = document.querySelectorAll('.price-tag');
    let currentCurrency = 'KRW';

    toggleBtn.addEventListener('click', () => {
        if (currentCurrency === 'KRW') {
            currentCurrency = 'USD';
            spanKrw.classList.remove('active');
            spanUsd.classList.add('active');
            
            // Update prices
            priceTags.forEach(tag => {
                tag.textContent = tag.getAttribute('data-usd');
            });
        } else {
            currentCurrency = 'KRW';
            spanUsd.classList.remove('active');
            spanKrw.classList.add('active');
            
            // Update prices
            priceTags.forEach(tag => {
                tag.textContent = tag.getAttribute('data-krw');
            });
        }
    });

    // Modal Logic
    const modal = document.getElementById('payment-modal');
    const closeModal = document.querySelector('.close-modal');
    const modalProductName = document.getElementById('modal-product-name');

    window.openPaymentModal = (productName) => {
        modalProductName.textContent = productName;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    };

    closeModal.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
});
