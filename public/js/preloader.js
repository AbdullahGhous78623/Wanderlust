// Wait for the page to fully load
document.addEventListener("DOMContentLoaded", () => {
    const preloader = document.getElementById("preloader");
    
    // Simulate a delay of 1.5 seconds
    setTimeout(() => {
        if (preloader) {
            preloader.classList.add("hidden"); // Hide preloader with animation
        }
    }, 1500); // 1.5 seconds
});
