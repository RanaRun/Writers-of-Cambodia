document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('main section[id]');
    let currentActiveSectionId = ''; // To keep track of the currently visible section

    function displayMessage(elementId, message, type) {
        const messageElement = document.getElementById(elementId);
        if (messageElement) {
            messageElement.innerHTML = message;
            messageElement.className = `form-status-message ${type}`;
            messageElement.style.display = 'block';
        }
    }

    const navLinks = document.querySelectorAll('.main-nav ul li a');

    function removeActiveClass() {
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
    }

    function setActiveLink(id) {
        removeActiveClass();
        const correspondingLink = document.querySelector(`.main-nav ul li a[href="#${id}"]`);
        if (correspondingLink) {
            correspondingLink.classList.add('active');
        } else if (id === 'home') {
            document.querySelector('.main-nav ul li a[href="#home"]').classList.add('active');
        }
    }

    // Function to manage section transitions for in-page navigation
    function showSection(targetId) {
        if (currentActiveSectionId === targetId) {
            return; // Already on this section
        }

        const currentSection = document.getElementById(currentActiveSectionId);
        const targetSection = document.getElementById(targetId);

        const transitionDuration = 600; // Match CSS transition duration

        // Hide current section
        if (currentSection) {
            currentSection.classList.remove('is-active-section');
            currentSection.classList.add('is-leaving-section');

            // After the transition, hide it completely
            setTimeout(() => {
                currentSection.classList.remove('is-leaving-section');
                currentSection.style.visibility = 'hidden';
                currentSection.style.pointerEvents = 'none';
            }, transitionDuration);
        }

        // Show target section
        if (targetSection) {
            targetSection.style.visibility = 'visible';
            targetSection.style.pointerEvents = 'auto';
            targetSection.classList.remove('is-leaving-section'); // Ensure no leaving class
            
            // Set initial state for slide-in (off-screen right)
            targetSection.style.opacity = '0';
            targetSection.style.transform = 'translateX(100%)';

            // Force reflow to ensure initial styles are applied before transition starts
            void targetSection.offsetWidth;

            // Trigger slide-in animation
            targetSection.classList.add('is-active-section');
        }

        currentActiveSectionId = targetId;
        setActiveLink(targetId);
        
        // Update URL hash without causing a jump for in-page sections
        history.pushState(null, '', `#${targetId}`);
    }

    // Initial section setup on page load
    const initialHash = window.location.hash.substring(1);
    const defaultSectionId = (initialHash && document.getElementById(initialHash)) ? initialHash : 'home';

    sections.forEach(section => {
        // Set initial hidden state for all sections
        section.style.visibility = 'hidden';
        section.style.opacity = '0';
        section.style.transform = 'translateX(100%)';
    });

    // Make the initial section visible with animation
    showSection(defaultSectionId);

    // Modify navigation click handling
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Only handle internal hash links for smooth transitions
            if (this.getAttribute('href') && this.getAttribute('href').startsWith('#')) {
                e.preventDefault(); // Prevent default link behavior for internal hashes
                showSection(this.getAttribute('href').substring(1));
            }
            // For external links, default browser navigation would occur, but we don't have external links anymore
        });
    });

    // Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default form submission

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            if (name === '' || email === '' || message === '') {
                alert('សូមបំពេញគ្រប់វាលទាំងអស់។');
                return;
            }

            // In a real application, you would send this data to a server.
            console.log('Contact Form Submitted!');
            console.log('Name:', name);
            console.log('Email:', email);
            console.log('Message:', message);

            alert('សាររបស់អ្នកត្រូវបានផ្ញើដោយជោគជ័យ!');
            contactForm.reset();
        });
    }

    // Certificate Verification Form (re-integrated)
    const verifyCertificateForm = document.getElementById('verifyCertificateForm');
    const verificationResult = document.getElementById('verificationResult');
    if (verifyCertificateForm) {
        // This data would typically come from a database
        const validCertCodes = {
            'ABC12345': { name: 'ចាន់ សុខុម', course: 'ភាសាអង់គ្លេស I', date: '2024-05-15' },
            'XYZ98765': { name: 'លីណា សារ៉ាត់', course: 'ភាសាអង់គ្លេស បកប្រែ', date: '2024-03-20' },
            'PQR10112': { name: 'សុវណ្ណារ៉ា', course: 'ភាសាសំស្ក្រឹត', date: '2024-06-01' }
        };

        verifyCertificateForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const certCode = document.getElementById('certCode').value.trim().toUpperCase();

            if (certCode === '') {
                verificationResult.textContent = 'សូមបញ្ចូលលេខកូដវិញ្ញាបនបត្រ។';
                verificationResult.className = 'error';
                return;
            }

            if (validCertCodes[certCode]) {
                const certInfo = validCertCodes[certCode];
                verificationResult.innerHTML = `
                    <p style="color: green;">វិញ្ញាបនបត្រនេះមានសុពលភាព!</p>
                    <p><strong>ឈ្មោះ:</strong> ${certInfo.name}</p>
                    <p><strong>វគ្គសិក្សា:</strong> ${certInfo.course}</p>
                    <p><strong>កាលបរិច្ឆេទចេញ:</strong> ${certInfo.date}</p>
                `;
                verificationResult.className = 'success';
            } else {
                verificationResult.textContent = 'លេខកូដវិញ្ញាបនបត្រមិនត្រឹមត្រូវ ឬរកមិនឃើញ។';
                verificationResult.className = 'error';
            }
        });
    }
});
