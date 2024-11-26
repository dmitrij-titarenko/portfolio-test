// tabs.js

document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll(".tab");
    const tabContents = document.querySelectorAll(".business-analysis.full.content");
    const fullSection = document.querySelector(".full");

    // Define background colors for each tab
    const backgroundColors = [
        "#9DF1E3", // Background color for "Requirements Gathering"
        "#FDE68A", // Background color for "Documentation and Modeling"
        "#FECACA", // Background color for "Validation and Prioritization"
        "#C7D2FE", // Background color for "Support and Monitoring"
    ];

    // Add event listener to each tab
    tabs.forEach((tab, index) => {
        tab.addEventListener("click", () => {
            // Remove 'active' class from all tabs and tab contents
            tabs.forEach((t) => t.classList.remove("active"));
            tabContents.forEach((content) => content.classList.remove("active"));

            // Add 'active' class to the clicked tab and its corresponding content
            tab.classList.add("active");
            tabContents[index].classList.add("active");

            // Change the background color of the full section
            if (fullSection) {
                fullSection.style.backgroundColor = backgroundColors[index];
            }
        });
    });
});