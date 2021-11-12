const menu = document.getElementById("menu");

const buttonMenu = document.getElementById("openMenu");
const menulist = document.getElementById("menulist");
const close = document.getElementById("close");

buttonMenu.addEventListener("click", e => {
  menulist.classList.add("menu__list--mobile");
})

close.addEventListener("click", e => {
  menulist.classList.remove("menu__list--mobile");
})

window.onscroll = function (e) {
  const posY = document.documentElement.scrollTop;
  if (posY >= 150) {
    menu.classList.add('menu--scroll');
  } else {
    menu.classList.remove('menu--scroll');
  }
}

var swiper = new Swiper(".mySwiper", {
  spaceBetween: 30,
  centeredSlides: true,
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

