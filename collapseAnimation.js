document.addEventListener('DOMContentLoaded', function () {
    const initialSection = document.querySelector('.section.business-analysis.initial');
    const placeholderSection = document.querySelector('.placeholder-section');
    const imageButton = document.querySelector(".image-button");

    let isAnimating = false;
    let isCovered = false; // Tracks whether the placeholder is covering the initial section

    function coverInitialSection() {
        if (isAnimating || isCovered) return;
        isAnimating = true;

        // Ensure placeholder-section starts aligned with initialSection
        placeholderSection.style.transition = 'none';
        placeholderSection.style.transform = 'translateY(100vh)';
        placeholderSection.style.zIndex = '200'; // Ensure it covers the initialSection

        // Animate placeholder-section to slide up
        setTimeout(() => {
            placeholderSection.style.transition = 'transform 1s ease-in-out';
            placeholderSection.style.transform = 'translateY(0)';
        }, 0);

        // Mark animation complete
        setTimeout(() => {
            isAnimating = false;
            isCovered = true;
        }, 1000);
    }

    function resetCovering() {
        if (isAnimating || !isCovered) return;
        isAnimating = true;

        // Animate placeholder-section to slide back down
        placeholderSection.style.transition = 'transform 1s ease-in-out';
        placeholderSection.style.transform = 'translateY(100vh)';

        // Mark animation complete
        setTimeout(() => {
            isAnimating = false;
            isCovered = false;
            placeholderSection.style.zIndex = '200'; // Reset zIndex to default
        }, 1000);
    }

    // Attach event listener to main-title
    imageButton.addEventListener('click', function () {
        if (isCovered) {
            resetCovering(); // Slide back down
        } else {
            coverInitialSection(); // Slide up and cover
        }
    });
});