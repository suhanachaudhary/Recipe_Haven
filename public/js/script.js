(function () {
    'use strict';
    var forms = document.querySelectorAll('.needs-validation');
    Array.prototype.slice.call(forms).forEach(function (form) {
        form.addEventListener('submit', function (event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });
})();

// Home page slider — only runs when elements exist
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");

if (nextBtn && prevBtn) {
    nextBtn.addEventListener("click", () => {
        let items = document.querySelectorAll(".item");
        if (items.length) document.querySelector('.slide').appendChild(items[0]);
    });
    prevBtn.addEventListener("click", () => {
        let items = document.querySelectorAll(".item");
        if (items.length) document.querySelector('.slide').prepend(items[items.length - 1]);
    });
}
