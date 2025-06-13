document.addEventListener('DOMContentLoaded', function() {
    // A simple state variable to track login status
    let isLoggedIn = false; // Initialize to false

    // Get the user profile page section
    const userProfilePage = document.getElementById('user-profile-page');

    // Function to display status messages
    function displayMessage(elementId, message, type) {
        const messageElement = document.getElementById(elementId);
        if (messageElement) {
            messageElement.innerHTML = message;
            messageElement.className = `form-status-message ${type}`;
            messageElement.style.display = 'block';
            // Messages will persist until new action or specific hide command
        }
    }

    // Get all navigation links and sections
    const navLinks = document.querySelectorAll('.main-nav ul li a');
    const sections = document.querySelectorAll('main section[id]');

    // Function to remove 'active' class from all nav links
    function removeActiveClass() {
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
    }

    // Function to set active class on a specific nav link
    function setActiveLink(id) {
        removeActiveClass();
        const correspondingLink = document.querySelector(`.main-nav ul li a[href="#${id}"]`);
        if (correspondingLink) {
            correspondingLink.classList.add('active');
        } else if (id === 'home') { // Special handling for home as it might not be directly linked to a section
            document.querySelector('.main-nav ul li a[href="#home"]').classList.add('active');
        }
        // Also ensure profile link is active if profile page is active
        if (id === 'user-profile-page') {
            const profileLink = document.getElementById('profile-btn');
            if (profileLink) {
                profileLink.classList.add('active');
            }
        }
    }

    // Intersection Observer to detect current section in view
    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.7 // Percentage of section visible to be considered active
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Check if the current entry is actually the primary visible section
                // This helps avoid false positives when scrolling fast
                const rect = entry.target.getBoundingClientRect();
                if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                    setActiveLink(entry.target.id);
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Smooth scrolling for navigation links and active class on click
    document.querySelectorAll('nav a').forEach(anchor => {
        // Exclude dropdown toggles (dropbtn)
        if (anchor.classList.contains('dropbtn') || anchor.href === 'javascript:void(0)') {
            return;
        }

        // Special handling for the profile button
        if (anchor.id === 'profile-btn') {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                if (isLoggedIn) {
                    // If logged in, scroll to the profile page
                    if (userProfilePage) {
                        // Reset properties to trigger transition on re-entry
                        userProfilePage.classList.remove('is-active');
                        userProfilePage.style.opacity = '0';
                        userProfilePage.style.transform = 'translateX(100px)'; // Start from right
                        
                        userProfilePage.scrollIntoView({ behavior: 'smooth' });
                        
                        // Add active class after a short delay to trigger transition
                        setTimeout(() => {
                            userProfilePage.classList.add('is-active');
                            userProfilePage.style.opacity = ''; // Remove inline style
                            userProfilePage.style.transform = ''; // Remove inline style
                        }, 50); // Small delay to ensure CSS reset is applied before re-adding class

                        setActiveLink('user-profile-page'); // Set profile link active
                    }
                } else {
                    // If not logged in, show the authentication modal
                    authModal.style.display = 'block';
                    // Ensure register form is shown by default when opening modal
                    if (registerForm) registerForm.style.display = 'block';
                    if (loginForm) loginForm.style.display = 'none';
                    // Clear previous messages
                    displayMessage('registerFormStatus', '', '');
                    displayMessage('loginFormStatus', '', '');
                }
            });
            return; // Skip the rest of the loop for profile-btn
        }

        anchor.addEventListener('click', function (e) {
            if (this.getAttribute('href') && this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1); // Remove '#'
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                    // Immediately set active class on click for responsiveness
                    setActiveLink(targetId);
                }
            }
        });
    });

    // Set initial active link based on URL hash or default to 'home'
    const initialHash = window.location.hash.substring(1);
    if (initialHash && document.getElementById(initialHash)) {
        setActiveLink(initialHash);
    } else {
        setActiveLink('home');
    }

    // Handle contact form submission (client-side only)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            if (name === '' || email === '' || message === '') {
                displayMessage('contactFormStatus', 'សូមបំពេញគ្រប់វាលទាំងអស់។', 'error');
                return;
            }

            console.log('Contact Form Submitted!');
            console.log('Name:', name);
            console.log('Email:', email);
            console.log('Message:', message);

            displayMessage('contactFormStatus', 'សាររបស់អ្នកត្រូវបានផ្ញើដោយជោគជ័យ! យើងនឹងទាក់ទងអ្នកវិញឆាប់ៗ។', 'success');
            contactForm.reset();
        });
    }

    // Handle exam request form submission (client-side only)
    const examRequestForm = document.getElementById('examRequestForm');
    if (examRequestForm) {
        examRequestForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const reqName = document.getElementById('reqName').value;
            const reqEmail = document.getElementById('reqEmail').value;
            const reqCourse = document.getElementById('reqCourse').value;

            if (reqName === '' || reqEmail === '' || reqCourse === '') {
                displayMessage('examRequestStatus', 'សូមបំពេញគ្រប់វាលទាំងអស់សម្រាប់សំណើសុំប្រឡង។', 'error');
                return;
            }

            console.log('Exam Request Submitted!');
            console.log('Name:', reqName);
            console.log('Email:', reqEmail);
            console.log('Course:', reqCourse);

            displayMessage('examRequestStatus', 'សំណើសុំប្រឡងរបស់អ្នកត្រូវបានទទួលដោយជោគជ័យ។ យើងនឹងទាក់ទងអ្នកវិញឆាប់ៗ។', 'success');
            examRequestForm.reset();
        });
    }

    // Handle certificate verification (client-side example)
    const verifyCertificateForm = document.getElementById('verifyCertificateForm');
    const verificationResult = document.getElementById('verificationResult');

    if (verifyCertificateForm && verificationResult) {
        const validCertCodes = {
            'ABC12345': { name: 'ចាន់ សុខុម', course: 'ភាសាអង់គ្លេស I', date: '2024-05-15' },
            'XYZ98765': { name: 'លីណា សារ៉ាត់', course: 'ភាសាអង់គ្លីស បកប្រែ', date: '2024-03-20' },
            'PQR10112': { name: 'សុវណ្ណារ៉ា', course: 'ភាសាសំស្ក្រឹត', date: '2024-06-01' },
            '099090090': { name: 'ឧទាហរណ៍ៈ', course: 'វគ្គសិក្សាគំរូ', date: '2025-01-01' }
        };

        verifyCertificateForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const certCode = document.getElementById('certCode').value.trim().toUpperCase();

            verificationResult.innerHTML = '';
            verificationResult.className = 'form-status-message';
            verificationResult.style.display = 'none';

            if (certCode === '') {
                displayMessage('verificationResult', 'សូមបញ្ចូលលេខកូដវិញ្ញាបនបត្រ។', 'error');
                return;
            }

            if (validCertCodes[certCode]) {
                const certInfo = validCertCodes[certCode];
                const messageHtml = `
                    <p style="color: green;">វិញ្ញាបនបត្រនេះមានសុពលភាព!</p>
                    <p><strong>ឈ្មោះ:</strong> ${certInfo.name}</p>
                    <p><strong>វគ្គសិក្សា:</strong> ${certInfo.course}</p>
                    <p><strong>កាលបរិច្ឆេទចេញ:</strong> ${certInfo.date}</p>
                `;
                displayMessage('verificationResult', messageHtml, 'success');
            } else {
                displayMessage('verificationResult', 'លេខកូដវិញ្ញាបនបត្រមិនត្រឹមត្រូវ ឬរកមិនឃើញ។', 'error');
            }
        });
    }

    // Authentication Modal Logic
    const authModal = document.getElementById('authModal');
    const profileBtn = document.getElementById('profile-btn'); // Already handled above for isLoggedIn logic
    const modalCloseBtn = document.querySelector('.modal-close-button');
    
    // Forms inside modal
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('login-form');
    const showLoginLink = document.getElementById('show-login');
    const showRegisterLink = document.getElementById('show-register');

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', function() {
            authModal.style.display = 'none';
        });
    }

    // Close modal if click outside content
    window.addEventListener('click', function(event) {
        if (event.target === authModal) {
            authModal.style.display = 'none';
        }
    });

    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm_password').value;
            const registerFormStatus = document.getElementById('registerFormStatus');

            if (username === '' || password === '' || confirmPassword === '') {
                displayMessage('registerFormStatus', 'សូមបំពេញគ្រប់វាលទាំងអស់។', 'error');
                return;
            }

            if (password !== confirmPassword) {
                displayMessage('registerFormStatus', 'ពាក្យសម្ងាត់មិនត្រូវគ្នានោះទេ។', 'error');
                return;
            }
            
            console.log('Register attempt:', { username, password });
            displayMessage('registerFormStatus', 'ការចុះឈ្មោះជោគជ័យ! សូមចូលប្រើប្រាស់។', 'success');
            registerForm.reset();
            
            // Optionally, switch to login form after successful registration
            setTimeout(() => {
                if (registerForm) registerForm.style.display = 'none';
                if (loginForm) loginForm.style.display = 'block';
                displayMessage('loginFormStatus', 'សូមបញ្ចូលឈ្មោះអ្នកប្រើប្រាស់ និងពាក្យសម្ងាត់របស់អ្នក។', 'info');
                displayMessage('registerFormStatus', '', ''); // Clear register message
            }, 1000);
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const loginUsername = document.getElementById('login_username').value;
            const loginPassword = document.getElementById('login_password').value;
            const loginFormStatus = document.getElementById('loginFormStatus');

            if (loginUsername === '' || loginPassword === '') {
                displayMessage('loginFormStatus', 'សូមបំពេញឈ្មោះអ្នកប្រើប្រាស់ និងពាក្យសម្ងាត់។', 'error');
                return;
            }

            console.log('Login attempt:', { loginUsername, loginPassword });

            // Dummy login logic
            if (loginUsername === 'testuser' && loginPassword === 'password123') {
                displayMessage('loginFormStatus', 'ចូលប្រើប្រាស់ជោគជ័យ! ស្វាគមន៍!', 'success');
                isLoggedIn = true; // Set login status to true
                loginForm.reset();
                // Close the modal and optionally scroll to the user profile page
                setTimeout(() => {
                    authModal.style.display = 'none';
                    if (userProfilePage) {
                        // Reset properties to trigger transition on re-entry
                        userProfilePage.classList.remove('is-active');
                        userProfilePage.style.opacity = '0';
                        userProfilePage.style.transform = 'translateX(100px)'; // Start from right
                        
                        userProfilePage.scrollIntoView({ behavior: 'smooth' });
                        
                        // Add active class after a short delay to trigger transition
                        setTimeout(() => {
                            userProfilePage.classList.add('is-active');
                            userProfilePage.style.opacity = ''; // Remove inline style
                            userProfilePage.style.transform = ''; // Remove inline style
                        }, 50); // Small delay to ensure CSS reset is applied before re-adding class
                    }
                    setActiveLink('user-profile-page'); // Set profile link active
                }, 1500);
            } else {
                displayMessage('loginFormStatus', 'ឈ្មោះអ្នកប្រើប្រាស់ ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ។', 'error');
            }
        });
    }

    // Toggle between login and register forms within the modal
    if (showLoginLink) {
        showLoginLink.addEventListener('click', function(e) {
            e.preventDefault();
            if (registerForm) registerForm.style.display = 'none';
            if (loginForm) loginForm.style.display = 'block';
            displayMessage('registerFormStatus', '', ''); // Clear register message
            displayMessage('loginFormStatus', '', ''); // Clear login message
        });
    }

    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', function(e) {
            e.preventDefault();
            if (loginForm) loginForm.style.display = 'none';
            if (registerForm) registerForm.style.display = 'block';
            displayMessage('registerFormStatus', '', ''); // Clear register message
            displayMessage('loginFormStatus', '', ''); // Clear login message
        });
    }
});