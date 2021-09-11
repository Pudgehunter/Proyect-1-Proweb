const menu = document.getElementById("menu");
window.onscroll = function(e) {
    const posY = document.documentElement.scrollTop;
    if (posY >= 150) {
        menu.classList.add('menu--scroll');
    } else {
        menu.classList.remove('menu--scroll');
    }
}