// Utility: Sanitize input to prevent XSS
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

// Greeting based on time of day
document.addEventListener('DOMContentLoaded', () => {
    const greetingElement = document.getElementById('greeting');
    if (greetingElement) {
        try {
            const hour = new Date().getHours();
            let greeting = '';
            if (hour < 12) greeting = 'Good Morning!';
            else if (hour < 18) greeting = 'Good Afternoon!';
            else greeting = 'Good Evening!';
            greetingElement.textContent = greeting;
        } catch (error) {
            console.error('Error setting greeting:', error);
            greetingElement.textContent = 'Welcome!';
        }
    }

    // Highlight current page in navigation
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav ul li a').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

    // Load theme preference from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.classList.toggle('dark', savedTheme === 'dark');
    }
});

// Dark/Light Mode Toggle with Local Storage
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        const isDark = document.body.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}

// Form Validation and Submission for Contact Form
function validateForm() {
    const email = document.getElementById('email')?.value;
    const phone = document.getElementById('phone')?.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return false;
    }
    if (phone && !phoneRegex.test(phone)) {
        alert('Please enter a valid 10-digit phone number.');
        return false;
    }
    return true;
}

const contactForm = document.getElementById('contact-form');
if (contactForm) {
    // Check if form has already been submitted in this session
    const hasSubmitted = localStorage.getItem('contactFormSubmitted');
    if (hasSubmitted) {
        contactForm.innerHTML = '<p class="success-message">You have already submitted the form. Thank you!</p>';
    } else {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!validateForm()) return;

            // Sanitize inputs
            const name = sanitizeInput(document.getElementById('name').value);
            const email = sanitizeInput(document.getElementById('email').value);
            const phone = sanitizeInput(document.getElementById('phone').value);
            const message = sanitizeInput(document.getElementById('message').value);

            // Store form data in localStorage
            const formData = { name, email, phone, message, timestamp: new Date().toISOString() };
            localStorage.setItem('contactFormData', JSON.stringify(formData));
            localStorage.setItem('contactFormSubmitted', 'true');

            // Show success message with animation
            contactForm.innerHTML = '<p class="success-message">Form submitted successfully!</p>';
        });
    }
}

// Survey Form Submission and Results
const surveyForm = document.getElementById('survey-form');
if (surveyForm) {
    surveyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const rating = document.querySelector('input[name="rating"]:checked')?.value;
        const sections = Array.from(document.querySelectorAll('input[name="section"]:checked'))
            .map(input => input.value);

        if (!rating) {
            alert('Please select a rating.');
            return;
        }

        // Store survey results in localStorage
        const surveyData = { rating, sections, timestamp: new Date().toISOString() };
        let surveyResults = JSON.parse(localStorage.getItem('surveyResults')) || [];
        surveyResults.push(surveyData);
        localStorage.setItem('surveyResults', JSON.stringify(surveyResults));

        // Display results
        const resultsDiv = document.createElement('div');
        resultsDiv.className = 'survey-results';
        resultsDiv.innerHTML = `
            <h3>Thank You for Your Feedback!</h3>
            <p>Rating: ${rating}</p>
            <p>Sections Liked: ${sections.join(', ') || 'None'}</p>
        `;
        surveyForm.parentElement.appendChild(resultsDiv);
        surveyForm.style.display = 'none';
    });
}

// Show/Hide Project Details with Event Delegation
document.addEventListener('click', (e) => {
    if (e.target.matches('.project button')) {
        const button = e.target;
        const details = button.previousElementSibling;
        details.classList.toggle('show');
        button.textContent = details.classList.contains('show') ? 'Hide Details' : 'Show Details';
    }
});

// Accessibility: Keyboard Navigation for Project Buttons
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.matches('.project button')) {
        e.target.click();
    }
});

// Back to Top Button
const backToTopButton = document.createElement('button');
backToTopButton.id = 'back-to-top';
backToTopButton.textContent = '↑ Top';
document.body.appendChild(backToTopButton);

window.addEventListener('scroll', () => {
    backToTopButton.style.display = window.scrollY > 300 ? 'block' : 'none';
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Event Listeners for Accessibility
document.querySelectorAll('button, a').forEach(element => {
    element.addEventListener('focus', () => {
        element.style.outline = '2px solid #2d88ff';
    });
    element.addEventListener('blur', () => {
        element.style.outline = 'none';
    });
});

// Mouse Click Event for Portfolio Items
document.addEventListener('click', (e) => {
    if (e.target.closest('.project')) {
        const project = e.target.closest('.project');
        project.style.backgroundColor = '#f0f0f0';
    }
});