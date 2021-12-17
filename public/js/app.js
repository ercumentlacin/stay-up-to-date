function init() {
  const menuItems = document.querySelectorAll('nav ul li a');
  const currentPathName = window.location.pathname;

  menuItems.forEach((item) => {
    if (item.classList.contains('active')) {
      item.classList.remove('active');
    }

    if (item.pathname === currentPathName) {
      item.classList.add('active');
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
