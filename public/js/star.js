
    document.addEventListener("DOMContentLoaded", function () {
        const stars = document.querySelectorAll("#rating-stars .star");
        const ratingInput = document.getElementById("rating");
        const reviewForm = document.querySelector("form[action*='/reviews']");
        const invalidFeedback = ratingInput.nextElementSibling; // Invalid feedback div
        let selectedRating = 0;

        stars.forEach((star, index) => {
            const starValue = index + 1;

            star.addEventListener("mouseover", () => highlightStars(starValue));
            star.addEventListener("mouseout", () => highlightStars(selectedRating || 0));
            star.addEventListener("click", () => {
                selectedRating = starValue;
                ratingInput.value = selectedRating;
                highlightStars(selectedRating);
                hideValidationError(); // Hide error if a rating is selected
            });
        });

        reviewForm.addEventListener("submit", (event) => {
            // Check if a rating is selected
            if (!ratingInput.value) {
                event.preventDefault(); // Prevent form submission
                showValidationError(); // Show error message
            }
        });

        function highlightStars(value) {
            stars.forEach((star, index) => {
                if (index < value) {
                    star.classList.add("fa-solid");
                    star.classList.remove("fa-regular");
                    star.style.color = "gold";
                } else {
                    star.classList.add("fa-regular");
                    star.classList.remove("fa-solid");
                    star.style.color = "gray";
                }
            });
        }

        function showValidationError() {
            ratingInput.classList.add("is-invalid");
            invalidFeedback.style.display = "block";
        }

        function hideValidationError() {
            ratingInput.classList.remove("is-invalid");
            invalidFeedback.style.display = "none";
        }
    });

