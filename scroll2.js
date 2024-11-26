document.addEventListener('DOMContentLoaded', function () {
    const initialSection = document.querySelector('.section.business-analysis.initial');
    const processSection = document.querySelector('.section.business-analysis.initial.process');
    const secondaryBg = initialSection.querySelector('.secondary-bg');
    const thirdBg = initialSection.querySelector('.third-bg');
    let isAnimating = false;

    // Function to handle scrolling down from the initial section
    function onScrollDownFromInitial() {
        if (isAnimating) return;
        isAnimating = true;

        // Add slide-up animations
        initialSection.classList.add('animate-slide-up');
        secondaryBg.classList.add('animate-slide-up');
        thirdBg.classList.add('animate-slide-up');

        // After the animation ends
        initialSection.addEventListener('animationend', function handleAnimationEnd(e) {
            if (e.animationName === 'initialSlideUp') {
                initialSection.removeEventListener('animationend', handleAnimationEnd);

                // Hide the initial section
                initialSection.style.display = 'none';

                // Show the process section
                processSection.style.display = 'block';

                // Reset animations
                initialSection.classList.remove('animate-slide-up');
                secondaryBg.classList.remove('animate-slide-up');
                thirdBg.classList.remove('animate-slide-up');

                isAnimating = false;
            }
        });
    }

    // Function to handle scrolling up to the initial section
    function onScrollUpToInitial() {
        if (isAnimating) return;
        isAnimating = true;

        // Show the initial section
        initialSection.style.display = 'block';

        // Add slide-down animations
        initialSection.classList.add('animate-slide-down');
        secondaryBg.classList.add('animate-slide-down');
        thirdBg.classList.add('animate-slide-down');

        // Hide the process section
        processSection.style.display = 'none';

        // After the animation ends
        initialSection.addEventListener('animationend', function handleAnimationEnd(e) {
            if (e.animationName === 'initialSlideDown') {
                initialSection.removeEventListener('animationend', handleAnimationEnd);

                // Reset animations
                initialSection.classList.remove('animate-slide-down');
                secondaryBg.classList.remove('animate-slide-down');
                thirdBg.classList.remove('animate-slide-down');

                isAnimating = false;
            }
        });
    }

    // Scroll detection
    window.addEventListener('wheel', function (e) {
        if (isAnimating) return;

        const deltaY = e.deltaY;
        const scrollTop = window.scrollY || window.pageYOffset;

        if (deltaY > 0 && initialSectionIsInView()) {
            // Scrolling down from initial section
            e.preventDefault();
            onScrollDownFromInitial();
        } else if (deltaY < 0 && processSectionIsInView()) {
            // Scrolling up to initial section
            e.preventDefault();
            onScrollUpToInitial();
        }
    }, { passive: false });

    // Helper functions to determine if a section is in view
    function initialSectionIsInView() {
        const rect = initialSection.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom >= 0;
    }

    function processSectionIsInView() {
        const rect = processSection.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom >= 0;
    }
});