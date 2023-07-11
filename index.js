window.addEventListener("scroll", function() {
    var header = document.querySelector("header");
    var hobbiesIntro = document.querySelector(".hobbies-intro");
    var stickyBgColor = getComputedStyle(header).getPropertyValue("--sticky-bg-color");
    var scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollPosition > 0) {
      hobbiesIntro.style.backgroundColor = stickyBgColor;
    } else {
      hobbiesIntro.style.backgroundColor = "";
    }
  });


const modalImages = document.querySelectorAll('.modal-body img');

  modalImages.forEach((image) => {
    image.addEventListener('click', () => {
      image.classList.toggle('enlarged');
    });
  });