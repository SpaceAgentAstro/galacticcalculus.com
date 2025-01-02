document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.querySelector(".sidebar");
    const toggleButton = document.querySelector(".toggle-sidebar");

    toggleButton.addEventListener("click", () => {
        sidebar.classList.toggle("active");
    });

    document.addEventListener("click", (e) => {
        // Close sidebar if clicked outside
        if (!sidebar.contains(e.target) && !toggleButton.contains(e.target)) {
            sidebar.classList.remove("active");
        }
    });
});
