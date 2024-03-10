import {
  HAMBURGER_MENU_SELECTOR,
  MOBILE_NAV_CLOSE_BUTTON_SELECTOR,
  MOBILE_NAV_SELECTOR,
} from "../consts";

const hamburgerMenu = document.getElementById(HAMBURGER_MENU_SELECTOR);
const mobileNav = document.getElementById(MOBILE_NAV_SELECTOR);
const mobileNavCloseButton = document.getElementById(
  MOBILE_NAV_CLOSE_BUTTON_SELECTOR
);

const menuFocusableElements = mobileNav.querySelectorAll(
  'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
);
const firstFocusableElement = menuFocusableElements[0];
const lastFocusableElement =
  menuFocusableElements[menuFocusableElements.length - 1];

const openMobileNav = () => {
  hamburgerMenu.setAttribute("aria-expanded", "true");
  mobileNav.classList.remove("hidden");
  mobileNav.classList.add("flex");
  firstFocusableElement.focus();
};

const closeMobileNav = () => {
  mobileNav.classList.remove("flex");
  mobileNav.classList.add("hidden");
  hamburgerMenu.setAttribute("aria-expanded", "false");
  hamburgerMenu.focus();
};

let isMobile = false;

const resizeObserver = new ResizeObserver(([entry]) => {
  if (entry.contentBoxSize) {
    isMobile = entry.contentBoxSize[0].inlineSize < 640;
  } else {
    isMobile = entry.contentRect.width < 640;
  }

  if (!isMobile && mobileNav.classList.contains("flex")) {
    closeMobileNav();
  }
});

resizeObserver.observe(document.body);

if (hamburgerMenu && mobileNav && mobileNavCloseButton) {
  hamburgerMenu.addEventListener("click", () => {
    openMobileNav();
  });

  mobileNavCloseButton.addEventListener("click", () => {
    closeMobileNav();
  });

  window.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      hamburgerMenu.getAttribute("aria-expanded") === "true"
    ) {
      closeMobileNav();
    }

    if (
      e.key === "Tab" &&
      hamburgerMenu.getAttribute("aria-expanded") === "true"
    ) {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusableElement) {
          firstFocusableElement.focus();
          e.preventDefault();
        }
      }
    }
  });
}
