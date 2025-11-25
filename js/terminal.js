/* ============================================
   TERMINAL PORTFOLIO - JAVASCRIPT
   ============================================ */

(function() {
	'use strict';

	// Initialize when DOM is ready
	document.addEventListener('DOMContentLoaded', function() {
		initBootScreen();
		initTypingEffect();
		initMatrixRain();
		initSmoothScroll();
		initFormHandling();
		initUptime();
		initLastLogin();
		initGlitchEffects();
		initCustomCursor();
	});

	/* ============================================
	   BOOT SCREEN
	   ============================================ */
	function initBootScreen() {
		const bootScreen = document.getElementById('boot-screen');
		const mainContent = document.getElementById('main-content');

		// Hide boot screen after animation
		setTimeout(function() {
			bootScreen.classList.add('hidden');
			mainContent.classList.add('loaded');
			
			// Remove boot screen from DOM after fade out
			setTimeout(function() {
				bootScreen.style.display = 'none';
			}, 500);
		}, 3000);
	}

	/* ============================================
	   TYPING EFFECT
	   ============================================ */
	function initTypingEffect() {
		const typingElement = document.getElementById('typing-text');
		if (!typingElement) return;

		const texts = [
			'Breaking in to keep them out',
			'Thinking like a hacker. Defending like a pro',
			'I find the holes before the bad guys do',
			'Offensive Security Specialist | Ethical Hacker | Digital Strategist',
			'Turning vulnerabilities into fortified strengths',
			'Based in Casablanca, Morocco'
		];

		let textIndex = 0;
		let charIndex = 0;
		let isDeleting = false;
		let typingSpeed = 100;

		function typeText() {
			const currentText = texts[textIndex];
			const cursor = '<span class="typing-cursor">_</span>';

			if (isDeleting) {
				typingElement.innerHTML = currentText.substring(0, charIndex - 1) + cursor;
				charIndex--;
				typingSpeed = 50;
			} else {
				typingElement.innerHTML = currentText.substring(0, charIndex + 1) + cursor;
				charIndex++;
				typingSpeed = 100;
			}

			if (!isDeleting && charIndex === currentText.length) {
				// Pause at end of text
				setTimeout(function() {
					isDeleting = true;
					typeText();
				}, 2000);
				return;
			}

			if (isDeleting && charIndex === 0) {
				isDeleting = false;
				textIndex = (textIndex + 1) % texts.length;
			}

			setTimeout(typeText, typingSpeed);
		}

		// Start typing after boot screen
		setTimeout(function() {
			typeText();
		}, 3500);
	}

	/* ============================================
	   MATRIX RAIN BACKGROUND
	   ============================================ */
	function initMatrixRain() {
		const canvas = document.getElementById('matrix-canvas');
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		// Matrix characters
		const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
		const fontSize = 14;
		const columns = canvas.width / fontSize;
		const drops = [];

		// Initialize drops
		for (let x = 0; x < columns; x++) {
			drops[x] = Math.random() * -100;
		}

		function draw() {
			// Semi-transparent background for trail effect
			ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			ctx.fillStyle = '#00ff41';
			ctx.font = fontSize + 'px monospace';

			for (let i = 0; i < drops.length; i++) {
				const text = chars[Math.floor(Math.random() * chars.length)];
				const x = i * fontSize;
				const y = drops[i] * fontSize;

				// Gradient effect
				const opacity = Math.min(1, (canvas.height - y) / (canvas.height * 0.3));
				ctx.fillStyle = `rgba(0, 255, 65, ${opacity})`;
				ctx.fillText(text, x, y);

				// Reset drop
				if (y > canvas.height && Math.random() > 0.975) {
					drops[i] = 0;
				}

				drops[i]++;
			}
		}

		// Resize handler
		window.addEventListener('resize', function() {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		});

		// Start animation
		setInterval(draw, 50);
	}

	/* ============================================
	   SMOOTH SCROLL
	   ============================================ */
	function initSmoothScroll() {
		const navLinks = document.querySelectorAll('.nav-link');
		
		navLinks.forEach(function(link) {
			link.addEventListener('click', function(e) {
				const href = this.getAttribute('href');
				if (href.startsWith('#')) {
					e.preventDefault();
					const target = document.querySelector(href);
					if (target) {
						const offsetTop = target.offsetTop - 60; // Account for fixed nav
						window.scrollTo({
							top: offsetTop,
							behavior: 'smooth'
						});
					}
				}
			});
		});
	}

	/* ============================================
	   FORM HANDLING
	   ============================================ */
	function initFormHandling() {
		const form = document.querySelector('.contact-form');
		const successMessage = document.getElementById('form-success');

		if (!form) return;

		form.addEventListener('submit', function(e) {
			e.preventDefault();

			// Get form data
			const formData = new FormData(form);
			const data = {
				name: formData.get('name'),
				email: formData.get('email'),
				message: formData.get('message')
			};

			// Show loading state
			const submitBtn = form.querySelector('.form-submit');
			const originalText = submitBtn.innerHTML;
			submitBtn.innerHTML = '<span class="submit-prefix">></span><span class="submit-text">Sending...</span><span class="submit-icon">⏳</span>';
			submitBtn.disabled = true;

			// Submit to Formspree
			fetch(form.action, {
				method: 'POST',
				headers: {
					'Accept': 'application/json'
				},
				body: formData
			})
			.then(function(response) {
				if (response.ok) {
					// Show success message
					successMessage.style.display = 'block';
					form.reset();
					
					// Scroll to success message
					successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
					
					// Hide success message after 5 seconds
					setTimeout(function() {
						successMessage.style.display = 'none';
					}, 5000);
				} else {
					throw new Error('Form submission failed');
				}
			})
			.catch(function(error) {
				console.error('Error:', error);
				alert('Failed to send message. Please try again later.');
			})
			.finally(function() {
				submitBtn.innerHTML = originalText;
				submitBtn.disabled = false;
			});
		});
	}

	/* ============================================
	   UPTIME COUNTER
	   ============================================ */
	function initUptime() {
		const uptimeElement = document.getElementById('uptime');
		if (!uptimeElement) return;

		const startTime = Date.now();

		function updateUptime() {
			const elapsed = Date.now() - startTime;
			const seconds = Math.floor(elapsed / 1000) % 60;
			const minutes = Math.floor(elapsed / 60000) % 60;
			const hours = Math.floor(elapsed / 3600000);

			const formatted = 
				String(hours).padStart(2, '0') + ':' +
				String(minutes).padStart(2, '0') + ':' +
				String(seconds).padStart(2, '0');

			uptimeElement.textContent = formatted;
		}

		setInterval(updateUptime, 1000);
		updateUptime();
	}

	/* ============================================
	   LAST LOGIN
	   ============================================ */
	function initLastLogin() {
		const lastLoginElement = document.getElementById('last-login');
		if (!lastLoginElement) return;

		// Get or set last login time
		let lastLogin = localStorage.getItem('lastLogin');
		if (!lastLogin) {
			lastLogin = new Date().toLocaleString();
			localStorage.setItem('lastLogin', lastLogin);
		}

		// Format date
		const date = new Date(lastLogin);
		const formatted = date.toLocaleString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});

		lastLoginElement.textContent = formatted;
	}

	/* ============================================
	   GLITCH EFFECTS
	   ============================================ */
	function initGlitchEffects() {
		const glitchElements = document.querySelectorAll('.terminal-window, .project-card');

		glitchElements.forEach(function(element) {
			element.addEventListener('mouseenter', function() {
				this.style.animation = 'glitch 0.3s';
			});

			element.addEventListener('mouseleave', function() {
				this.style.animation = '';
			});
		});

		// Random glitch on page elements
		setInterval(function() {
			const elements = document.querySelectorAll('.terminal-window, .section-title');
			if (elements.length > 0 && Math.random() > 0.95) {
				const randomElement = elements[Math.floor(Math.random() * elements.length)];
				randomElement.style.animation = 'glitch 0.2s';
				setTimeout(function() {
					randomElement.style.animation = '';
				}, 200);
			}
		}, 5000);
	}

	/* ============================================
	   CUSTOM CURSOR
	   ============================================ */
	function initCustomCursor() {
		const cursor = document.querySelector('body::before');
		
		document.addEventListener('mousemove', function(e) {
			const cursorElement = document.querySelector('body');
			if (cursorElement) {
				cursorElement.style.setProperty('--cursor-x', e.clientX + 'px');
				cursorElement.style.setProperty('--cursor-y', e.clientY + 'px');
			}
		});
	}

	/* ============================================
	   TERMINAL WINDOW INTERACTIONS
	   ============================================ */
	document.addEventListener('DOMContentLoaded', function() {
		const terminalControls = document.querySelectorAll('.control');

		terminalControls.forEach(function(control) {
			control.addEventListener('click', function(e) {
				e.stopPropagation();
				const terminal = this.closest('.terminal-window');
				
				if (this.classList.contains('close')) {
					terminal.style.opacity = '0';
					terminal.style.transform = 'scale(0.9)';
					setTimeout(function() {
						terminal.style.display = 'none';
					}, 300);
				} else if (this.classList.contains('minimize')) {
					const body = terminal.querySelector('.terminal-body');
					if (body) {
						body.style.display = body.style.display === 'none' ? 'block' : 'none';
					}
				} else if (this.classList.contains('maximize')) {
					terminal.style.transform = terminal.style.transform === 'scale(1.05)' ? 'scale(1)' : 'scale(1.05)';
				}
			});
		});
	});

	/* ============================================
	   SCROLL ANIMATIONS
	   ============================================ */
	function initScrollAnimations() {
		const observerOptions = {
			threshold: 0.1,
			rootMargin: '0px 0px -50px 0px'
		};

		const observer = new IntersectionObserver(function(entries) {
			entries.forEach(function(entry) {
				if (entry.isIntersecting) {
					entry.target.style.opacity = '1';
					entry.target.style.transform = 'translateY(0)';
				}
			});
		}, observerOptions);

		const animatedElements = document.querySelectorAll('.terminal-window, .project-card');
		animatedElements.forEach(function(el) {
			el.style.opacity = '0';
			el.style.transform = 'translateY(20px)';
			el.style.transition = 'opacity 0.5s, transform 0.5s';
			observer.observe(el);
		});
	}

	// Initialize scroll animations after page load
	window.addEventListener('load', function() {
		setTimeout(initScrollAnimations, 1000);
	});

	/* ============================================
	   KEYBOARD SHORTCUTS
	   ============================================ */
	document.addEventListener('keydown', function(e) {
		// Ctrl+K or Cmd+K to focus search/navigation
		if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
			e.preventDefault();
			const navLinks = document.querySelectorAll('.nav-link');
			if (navLinks.length > 0) {
				navLinks[0].focus();
			}
		}

		// Escape to close terminal windows
		if (e.key === 'Escape') {
			const hiddenTerminals = document.querySelectorAll('.terminal-window[style*="display: none"]');
			hiddenTerminals.forEach(function(terminal) {
				terminal.style.display = 'block';
				terminal.style.opacity = '1';
				terminal.style.transform = 'scale(1)';
			});
		}
	});

	/* ============================================
	   RESUME BUTTON ANIMATIONS
	   ============================================ */
	document.addEventListener('DOMContentLoaded', function() {
		const resumeButtons = document.querySelectorAll('.resume-btn, .resume-download-btn');

		resumeButtons.forEach(function(button) {
			button.addEventListener('click', function(e) {
				// Add click animation
				this.style.transform = 'scale(0.95)';
				setTimeout(function() {
					this.style.transform = '';
				}.bind(this), 150);

				// Track download (optional analytics)
				const lang = this.classList.contains('resume-fr') || this.classList.contains('resume-btn-fr') ? 'fr' : 'en';
				console.log('Resume download:', lang);
			});
		});
	});

})();

