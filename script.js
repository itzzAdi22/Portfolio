// Typewriter Effect
const words = ['Computer Science Student', 'Full Stack Developer', 'Problem Solver', 'Tech Enthusiast'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typeSpeed = 100;
const deleteSpeed = 50;
const pauseTime = 2000;

function typeWriter() {
    const currentWord = words[wordIndex];
    const typewriterElement = document.getElementById('typewriter');
    
    if (isDeleting) {
        typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }
    
    let speed = isDeleting ? deleteSpeed : typeSpeed;
    
    if (!isDeleting && charIndex === currentWord.length) {
        speed = pauseTime;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        speed = 500;
    }
    
    setTimeout(typeWriter, speed);
}

// Initialize Typewriter
document.addEventListener('DOMContentLoaded', typeWriter);

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    const icon = mobileMenuBtn.querySelector('i');
    if (mobileMenu.classList.contains('hidden')) {
        icon.setAttribute('data-lucide', 'menu');
    } else {
        icon.setAttribute('data-lucide', 'x');
    }
    lucide.createIcons();
});

// Close mobile menu when clicking on a link
document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        const icon = mobileMenuBtn.querySelector('i');
        icon.setAttribute('data-lucide', 'menu');
        lucide.createIcons();
    });
});

// Skill Bar Animation on Scroll
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skillBars = entry.target.querySelectorAll('.skill-bar');
            skillBars.forEach(bar => {
                const width = bar.getAttribute('data-width');
                bar.style.width = width + '%';
            });
        }
    });
}, observerOptions);

const skillsSection = document.getElementById('skills');
if (skillsSection) {
    skillObserver.observe(skillsSection);
}

// Form Validation and LocalStorage
const contactForm = document.getElementById('contact-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
const successMessage = document.getElementById('success-message');

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function showError(inputId, errorId, show) {
    const errorElement = document.getElementById(errorId);
    const inputElement = document.getElementById(inputId);
    
    if (show) {
        errorElement.classList.remove('hidden');
        inputElement.classList.add('border-red-500');
        inputElement.classList.remove('border-slate-600', 'border-violet-500');
    } else {
        errorElement.classList.add('hidden');
        inputElement.classList.remove('border-red-500');
        inputElement.classList.add('border-slate-600');
    }
}

function validateForm() {
    let isValid = true;
    
    // Name validation
    if (nameInput.value.trim() === '') {
        showError('name', 'name-error', true);
        isValid = false;
    } else {
        showError('name', 'name-error', false);
    }
    
    // Email validation
    if (!emailRegex.test(emailInput.value.trim())) {
        showError('email', 'email-error', true);
        isValid = false;
    } else {
        showError('email', 'email-error', false);
    }
    
    // Message validation
    if (messageInput.value.trim() === '') {
        showError('message', 'message-error', true);
        isValid = false;
    } else {
        showError('message', 'message-error', false);
    }
    
    return isValid;
}

// Load feedback from localStorage on page load
function loadFeedback() {
    const feedbackContainer = document.getElementById('feedback-container');
    const noFeedbackDiv = document.getElementById('no-feedback');
    const feedbacks = JSON.parse(localStorage.getItem('portfolioFeedback')) || [];
    
    if (feedbacks.length > 0) {
        noFeedbackDiv.classList.add('hidden');
        
        feedbacks.forEach((feedback, index) => {
            createFeedbackElement(feedback, index === feedbacks.length - 1);
        });
    }
}

function createFeedbackElement(feedback, animate = false) {
    const feedbackContainer = document.getElementById('feedback-container');
    const noFeedbackDiv = document.getElementById('no-feedback');
    
    noFeedbackDiv.classList.add('hidden');
    
    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = `feedback-item glass rounded-xl p-6 border border-violet-500/20 ${animate ? 'feedback-item' : ''}`;
    
    const date = new Date(feedback.timestamp);
    const dateString = date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
    
    feedbackDiv.innerHTML = `
        <div class="flex items-start justify-between mb-3">
            <div>
                <h4 class="font-semibold text-white text-lg">${escapeHtml(feedback.name)}</h4>
                <p class="text-sm text-violet-400">${escapeHtml(feedback.email)}</p>
            </div>
            <span class="text-xs text-gray-500 bg-slate-800 px-2 py-1 rounded">${dateString}</span>
        </div>
        <p class="text-gray-300 leading-relaxed">${escapeHtml(feedback.message)}</p>
    `;
    
    // Insert after the "no feedback" message or at the beginning
    if (feedbackContainer.children.length > 0 && feedbackContainer.children[0].id === 'no-feedback') {
        feedbackContainer.insertBefore(feedbackDiv, feedbackContainer.children[1]);
    } else {
        feedbackContainer.insertBefore(feedbackDiv, feedbackContainer.firstChild);
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function saveFeedback(name, email, message) {
    const feedbacks = JSON.parse(localStorage.getItem('portfolioFeedback')) || [];
    const newFeedback = {
        name: name,
        email: email,
        message: message,
        timestamp: new Date().toISOString()
    };
    
    feedbacks.push(newFeedback);
    localStorage.setItem('portfolioFeedback', JSON.stringify(feedbacks));
    
    return newFeedback;
}

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (validateForm()) {
        // Save to localStorage
        const feedback = saveFeedback(
            nameInput.value.trim(),
            emailInput.value.trim(),
            messageInput.value.trim()
        );
        
        // Add to display with animation
        createFeedbackElement(feedback, true);
        
        // Show success message
        successMessage.classList.remove('hidden');
        successMessage.classList.add('feedback-item');
        
        // Reset form
        contactForm.reset();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            successMessage.classList.add('hidden');
        }, 5000);
        
        // Scroll to feedback section smoothly
        document.getElementById('feedback').scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
});

// Real-time validation
nameInput.addEventListener('blur', () => {
    if (nameInput.value.trim() !== '') {
        showError('name', 'name-error', false);
    }
});

emailInput.addEventListener('blur', () => {
    if (emailRegex.test(emailInput.value.trim())) {
        showError('email', 'email-error', false);
    }
});

messageInput.addEventListener('blur', () => {
    if (messageInput.value.trim() !== '') {
        showError('message', 'message-error', false);
    }
});

// Initialize feedback on page load
document.addEventListener('DOMContentLoaded', loadFeedback);

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll effect to header
let lastScroll = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.classList.add('glass', 'border-b', 'border-violet-500/20');
        if (currentScroll > lastScroll && currentScroll > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
    } else {
        header.classList.remove('glass', 'border-b', 'border-violet-500/20');
        header.style.background = 'transparent';
    }
    
    lastScroll = currentScroll;
});

// Custom cursor effect (optional enhancement)
document.addEventListener('mousemove', (e) => {
    const cursor = document.querySelector('.custom-cursor');
    // This is handled by CSS, but we could add JS enhancements here
});
