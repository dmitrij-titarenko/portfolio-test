document.addEventListener('DOMContentLoaded', function () {
    const sections = document.querySelectorAll('.section');
    let currentSectionIndex = 0;
    let isAnimating = false;

    let scrollTimeout;
    let accumulatedDeltaY = 0;

    function scrollToSection(index) {
        if (index < 0 || index >= sections.length || isAnimating) return;

        if (index > currentSectionIndex) {
            // Scrolling down
            if (index === 1 && currentSectionIndex === 0) {
                isAnimating = true;
                triggerCoveringAnimation();
            } else {
                performScroll(index);
            }
        } else if (index < currentSectionIndex) {
            // Scrolling up
            if (index === 0 && currentSectionIndex === 1) {
                isAnimating = true;
                reverseCoveringAnimation();
            } else {
                performScroll(index);
            }
        }
    }

    function performScroll(index) {
        isAnimating = true;
        const targetSection = sections[index];
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        const scrollEndHandler = () => {
            const rect = targetSection.getBoundingClientRect();
            if (Math.abs(rect.top) < 2) {
                isAnimating = false;
                currentSectionIndex = index;
                window.removeEventListener('scroll', scrollEndHandler);
            }
        };
        window.addEventListener('scroll', scrollEndHandler);
    }

    function triggerCoveringAnimation() {
        const secondSection = document.querySelector('.section.business-analysis.initial');
        const hiddenContent = document.querySelector('.description-practices.hidden-content');

        // Reset opacity before starting animation
        hiddenContent.style.opacity = '0';
        hiddenContent.style.pointerEvents = 'none';

        secondSection.classList.remove('position-static'); // Ensure correct positioning
        secondSection.classList.add('animate-in');

        secondSection.addEventListener('animationend', function onCoveringAnimationEnd(e) {
            if (e.animationName === 'slideUp') {
                secondSection.removeEventListener('animationend', onCoveringAnimationEnd);
                startCountingAnimation();
            }
        });
    }

    function reverseCoveringAnimation() {
        const secondSection = document.querySelector('.section.business-analysis.initial');
        const titleDescription = document.querySelector('.title-description');
        const hiddenContent = document.querySelector('.hidden-content');
        const headers = document.querySelectorAll('.third-header');
        const bodyText = document.querySelector('.body-text');
        const listItems = document.querySelectorAll('.practicies-list li');
    
        // Reset styles and classes for hidden-content and title-description
        hiddenContent.classList.remove('visible');
        hiddenContent.style.opacity = '0';
        hiddenContent.style.pointerEvents = 'none';
    
        titleDescription.style.transform = 'translateY(0)';
        titleDescription.style.transition = ''; // Remove any transition effect
    
        // Reset all 'active' classes, re-add 'fade-blur', and reset styles for repeated reveals
        headers.forEach(header => {
            header.classList.remove('active'); // Ensure active class is removed
            header.classList.add('fade-blur'); // Reapply fade-blur
            header.style.opacity = '1'; // Reset opacity to initial state
            header.style.filter = 'blur(10px)'; // Reset blur effect
            header.style.transform = 'translateY(20px)'; // Reset transform for animation
            header.style.transition = ''; // Clear transition to ensure proper reset
        });
    
        bodyText.classList.remove('active');
        bodyText.classList.add('fade-blur');
        bodyText.style.opacity = '0';
        bodyText.style.filter = 'blur(10px)';
        bodyText.style.transform = 'translateY(0px)';
        bodyText.style.transition = ''; // Clear transition
    
        listItems.forEach(item => {
            item.classList.remove('active');
            item.classList.add('fade-blur');
            item.style.opacity = '0';
            item.style.filter = 'blur(10px)';
            item.style.transform = 'translateY(0px)';
            item.style.transition = ''; // Clear transition
        });
    
        secondSection.classList.remove('position-static'); // Ensure proper positioning
        secondSection.classList.add('animate-out');
    
        secondSection.addEventListener('animationend', function onReverseAnimationEnd(e) {
            if (e.animationName === 'slideDown') {
                secondSection.removeEventListener('animationend', onReverseAnimationEnd);
                secondSection.classList.remove('animate-out');
                secondSection.style.bottom = '-100vh'; // Revert to initial position
                secondSection.style.top = null; // Reset top if modified
    
                // Ensure all states are reverted
                hiddenContent.style.display = 'none';
                isAnimating = false;
                currentSectionIndex = 0;
            }
        });
    }

    function startCountingAnimation() {
        const pageNumberElement = document.querySelector('.section.business-analysis.initial .page-number');

        const duration = 1500; // 1.5 seconds
        const interval = 75; // Update every 100ms
        const totalIterations = duration / interval;
        let iterations = 0;

        const targetNumber = '01';

        const prefix = pageNumberElement.textContent.replace(/\d+/g, '');

        const countingInterval = setInterval(() => {
            iterations++;

            if (iterations >= totalIterations) {
                clearInterval(countingInterval);
                pageNumberElement.textContent = prefix + targetNumber;
                showRestOfContent();
            } else {
                const randomNumber = Math.floor(Math.random() * 100).toString().padStart(2, '0');
                pageNumberElement.textContent = prefix + randomNumber;
            }
        }, interval);
    }

    function showRestOfContent() {
        const descriptionPractices = document.querySelector('.section.business-analysis.initial .description-practices');
        descriptionPractices.style.display = 'flex';

        revealHiddenContent();

        const secondSection = document.querySelector('.section.business-analysis.initial');
        secondSection.classList.add('position-static');
        secondSection.classList.remove('animate-in');

        secondSection.style.bottom = null;
        secondSection.style.top = null;

        isAnimating = false;
        currentSectionIndex = 1;
    }

    function revealHiddenContent() {
        const titleDescription = document.querySelector('.title-description');
        const hiddenContent = document.querySelector('.hidden-content');
        const headers = document.querySelectorAll('.third-header');
        const bodyText = document.querySelector('.body-text');
        const listItems = document.querySelectorAll('.practicies-list li');
    
        const hiddenContentHeight = hiddenContent.scrollHeight;
    
        // Slide up the title-description
        titleDescription.style.transition = 'transform 1.2s ease-in-out';
        titleDescription.style.transform = `translateY(-${hiddenContentHeight}px)`;
    
        // Start revealing content after slide-up animation
        setTimeout(() => {
            hiddenContent.classList.add('visible');
            hiddenContent.style.opacity = '1';
            hiddenContent.style.pointerEvents = 'auto';
    
            // Apply blur animation to headers
            headers.forEach(header => {
                header.classList.add('active'); // Trigger animation
                header.classList.remove('fade-blur'); // Remove fade-blur to apply blur removal animation
                header.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out, filter 0.6s ease-out';
                header.style.opacity = '1';
                header.style.filter = 'blur(0)';
                header.style.transform = 'translateY(0)';
            });
    
            // Reveal body text with delay
            setTimeout(() => {
                bodyText.classList.add('active');
                bodyText.classList.remove('fade-blur');
                bodyText.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out, filter 0.6s ease-out';
                bodyText.style.opacity = '1';
                bodyText.style.filter = 'blur(0)';
                bodyText.style.transform = 'translateY(0)';
    
                // Reveal list items with staggered animation
                listItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('active');
                        item.classList.remove('fade-blur');
                        item.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out, filter 0.5s ease-out';
                        item.style.opacity = '1';
                        item.style.filter = 'blur(0)';
                        item.style.transform = 'translateY(0)';
                    }, index * 200); // Stagger list item animation
                });
            }, 800); // Delay for body text after headers
        }, 1000); // Delay for slide-up animation
    }

    function onWheel(e) {
        e.preventDefault();

        if (isAnimating) return;

        accumulatedDeltaY += e.deltaY;

        clearTimeout(scrollTimeout);

        scrollTimeout = setTimeout(() => {
            if (accumulatedDeltaY > 40) {
                if (currentSectionIndex < sections.length - 1) {
                    scrollToSection(currentSectionIndex + 1);
                }
            } else if (accumulatedDeltaY < -40) {
                if (currentSectionIndex > 0) {
                    scrollToSection(currentSectionIndex - 1);
                }
            }
            accumulatedDeltaY = 0;
        }, 50);
    }

    window.addEventListener('wheel', onWheel, { passive: false });

    window.addEventListener('keydown', function (e) {
        if (isAnimating) return;

        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            e.preventDefault();
            if (currentSectionIndex < sections.length - 1) {
                scrollToSection(currentSectionIndex + 1);
            }
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            if (currentSectionIndex > 0) {
                scrollToSection(currentSectionIndex - 1);
            }
        }
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.6
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                currentSectionIndex = Array.from(sections).indexOf(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
});