// Select the sidebar element
const sidebar = document.querySelector('.sidebar');

// Track the current state of the sidebar to prevent redundant toggling
let sidebarVisible = false;
let isAnimating = false;

// Helper function to get the current sidebar width dynamically
const getSidebarWidth = () => sidebar.offsetWidth;

// Function to show the sidebar
const showSidebar = () => {
    if (!sidebarVisible && !isAnimating) {
        isAnimating = true;
        sidebar.classList.add('show');
        sidebarVisible = true;
        setTimeout(() => (isAnimating = false), 400); // Sync with CSS transition
    }
};

// Function to hide the sidebar
const hideSidebar = () => {
    if (sidebarVisible && !isAnimating) {
        isAnimating = true;
        sidebar.classList.remove('show');
        sidebarVisible = false;
        setTimeout(() => (isAnimating = false), 400); // Sync with CSS transition
    }
};

// Show the sidebar when the mouse moves near the left edge
document.addEventListener('mousemove', (event) => {
    const sidebarWidth = getSidebarWidth();
    if (event.clientX < 50 && !sidebarVisible && !isAnimating) {
        showSidebar();
    } else if (event.clientX > sidebarWidth && sidebarVisible && !isAnimating) {
        hideSidebar();
    }
});

// Keep the sidebar visible while hovering over it
sidebar.addEventListener('mouseenter', showSidebar);

// Hide the sidebar when the mouse leaves its bounds
sidebar.addEventListener('mouseleave', (event) => {
    const sidebarWidth = getSidebarWidth();
    if (event.clientX > sidebarWidth && !isAnimating) {
        hideSidebar();
    }
});

// Ensure the sidebar is hidden on page load
document.addEventListener('DOMContentLoaded', hideSidebar);
