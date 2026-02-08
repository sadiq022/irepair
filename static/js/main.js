// Mobile menu toggle
// const menuToggle = document.getElementById('menuToggle');
// const navMenu = document.getElementById('navMenu');

// menuToggle.addEventListener('click', () => {
//     menuToggle.classList.toggle('active');
//     navMenu.classList.toggle('active');
// });
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Close menu when clicking on a link
// const navLinks = document.querySelectorAll('.nav-menu a');
// navLinks.forEach(link => {
//     link.addEventListener('click', () => {
//         menuToggle.classList.remove('active');
//         navMenu.classList.remove('active');
//     });
// });
const navLinks = document.querySelectorAll('.nav-menu a');
if (menuToggle && navMenu) {
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Scroll to services function
function scrollToServices() {
    document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
}

// Phone "Know More" button functionality
const knowMoreButtons = document.querySelectorAll('.know-more-button');
knowMoreButtons.forEach(button => {
    button.addEventListener('click', function() {
        const phoneName = this.closest('.phone-details').querySelector('.phone-name').textContent;
        alert(`More details about ${phoneName}... Contact us for purchase!`);
    });
});

// Phone "Add to Cart" button functionality
const addCartButtons = document.querySelectorAll('.add-cart-button');
addCartButtons.forEach(button => {
    button.addEventListener('click', function() {
        const phoneName = this.closest('.phone-details').querySelector('.phone-name').textContent;
        alert(`${phoneName} added to cart!`);
    });
});

// Testimonials Slider
const slider = document.getElementById('testimonialsSlider');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
const dotsContainer = document.getElementById('sliderDots');
const testimonials = document.querySelectorAll('.testimonial-card');
let currentIndex = 0;
const totalTestimonials = testimonials.length;
let autoSlideInterval;

// Create dots
for (let i = 0; i < totalTestimonials; i++) {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
}

const dots = document.querySelectorAll('.dot');

function updateSlider() {
    slider.style.transform = `translateX(-${currentIndex * 100}%)`;
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
}

function goToSlide(index) {
    currentIndex = index;
    updateSlider();
    resetAutoSlide();
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % totalTestimonials;
    updateSlider();
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + totalTestimonials) % totalTestimonials;
    updateSlider();
}

function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 2000); // Change slide every 2 seconds
}

function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
}

// Event listeners
nextButton.addEventListener('click', () => {
    nextSlide();
    resetAutoSlide();
});

prevButton.addEventListener('click', () => {
    prevSlide();
    resetAutoSlide();
});

// Start auto-sliding
startAutoSlide();

// Pause auto-slide on hover
const testimonialsContainer = document.querySelector('.testimonials-container');
testimonialsContainer.addEventListener('mouseenter', () => {
    clearInterval(autoSlideInterval);
});

testimonialsContainer.addEventListener('mouseleave', () => {
    startAutoSlide();
});

// Contact Form Submission → WhatsApp Redirect
document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.getElementById("contactForm");

    if (!contactForm) return; // prevents errors on pages without the form

    contactForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const subject = document.getElementById("subject").value;
        const message = document.getElementById("message").value.trim();

        const whatsappNumber = "918171828762";

        const subjectMap = {
            repair: "Repair Service",
            purchase: "Phone Purchase",
            inquiry: "General Inquiry",
            complaint: "Complaint",
            feedback: "Feedback"
        };

        const readableSubject = subjectMap[subject] || subject;

        const whatsappMessage =
            `📩 *New Contact Form Message*\n\n` +
            `👤 Name: ${name}\n` +
            `📧 Email: ${email}\n` +
            `📞 Phone: ${phone}\n` +
            `📌 Subject: ${readableSubject}\n\n` +
            `💬 Message:\n${message}`;

        const whatsappURL =
            `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

        window.open(whatsappURL, "_blank");

        contactForm.reset();
    });
});

// Parallax effect for desktop only
if (window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const phone1 = document.querySelector('.phone-1');
        const phone2 = document.querySelector('.phone-2');
        
        if (phone1 && phone2) {
            phone1.style.transform = `rotate(-8deg) translateY(${scrolled * 0.1}px)`;
            phone2.style.transform = `rotate(8deg) translateY(${scrolled * 0.08}px)`;
        }
    });
}

// Add touch interaction for mobile
const phoneImages = document.querySelectorAll('.phone-image');
phoneImages.forEach(phone => {
    phone.addEventListener('touchstart', function() {
        this.style.transform = this.classList.contains('phone-1') 
            ? 'rotate(-5deg) scale(1.05)' 
            : 'rotate(5deg) scale(1.05)';
    });
    
    phone.addEventListener('touchend', function() {
        this.style.transform = this.classList.contains('phone-1') 
            ? 'rotate(-8deg) scale(1)' 
            : 'rotate(8deg) scale(1)';
    });
});

// Collection Auto-Scroll
// ================= FEATURED PRODUCTS SLIDER =================
document.addEventListener("DOMContentLoaded", () => {
    const slider = document.getElementById("collectionSlider");
    if (!slider) return;

    const cards = slider.children;
    const gap = 30;
    let index = 0;

    function visibleCards() {
        if (window.innerWidth > 1024) return 3;
        if (window.innerWidth > 768) return 2;
        return 1;
    }

    function scrollSlider() {
        const cardWidth = cards[0].offsetWidth + gap;
        index++;

        if (index > cards.length - visibleCards()) {
            index = 0;
        }

        slider.style.transform =
            `translateX(-${index * cardWidth}px)`;
    }

    let autoScroll = setInterval(scrollSlider, 2000);

    slider.addEventListener("mouseenter", () => clearInterval(autoScroll));
    slider.addEventListener("mouseleave", () =>
        autoScroll = setInterval(scrollSlider, 2000)
    );

    window.addEventListener("resize", () => {
        index = 0;
        slider.style.transform = "translateX(0)";
    });
});
