document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.querySelector(".sidebar");
    const toggleButton = document.querySelector(".toggle-sidebar");

    const toggleSidebar = () => {
        sidebar.classList.toggle("active");
    };

    toggleButton.addEventListener("click", toggleSidebar);

    const handleOutsideClick = (e) => {
        if (!sidebar.contains(e.target) && !toggleButton.contains(e.target) && sidebar.classList.contains("active")) {
            toggleSidebar();
        }
    };

    const handleVisibilityChange = () => {
        if (document.visibilityState === "hidden") {
            document.removeEventListener("click", handleOutsideClick);
        } else {
            document.addEventListener("click", handleOutsideClick);
        }
    };

    const addEventListeners = () => {
        document.addEventListener("click", handleOutsideClick);
        document.addEventListener("visibilitychange", handleVisibilityChange);
    };

    const removeEventListeners = () => {
        document.removeEventListener("click", handleOutsideClick);
        document.removeEventListener("visibilitychange", handleVisibilityChange);
    };

    const init = () => {
        addEventListeners();
    };

    const destroy = () => {
        removeEventListeners();
    };

    const sidebarController = {
        init,
        destroy
    };

    sidebarController.init();

    window.addEventListener("beforeunload", sidebarController.destroy);

    // Add event listener to window resize to handle sidebar visibility
    window.addEventListener("resize", () => {
        if (window.innerWidth < 768 && sidebar.classList.contains("active")) {
            toggleSidebar();
        }
    });
});