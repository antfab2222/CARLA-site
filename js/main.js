/* =========================================================
   CARLA DUCROCQ — PORTFOLIO
   JavaScript principal
========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const loader = document.querySelector(".loader");
  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav__toggle");
  const mobileMenu = document.querySelector(".mobile-menu");
  const mobileLinks = document.querySelectorAll(".mobile-menu a");
  const revealElements = document.querySelectorAll(".reveal");
  const pointerLight = document.querySelector(".pointer-light");
  const currentYear = document.querySelector("#current-year");
  const heroImage = document.querySelector(".hero__image");
  const heroVisual = document.querySelector(".hero__visual");
  const projectMediaElements = document.querySelectorAll(".project__media");

  /* ======================================================
     ANNÉE AUTOMATIQUE
  ====================================================== */

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  /* ======================================================
     LOADER
  ====================================================== */

  const hideLoader = () => {
    if (!loader || loader.classList.contains("is-hidden")) {
      return;
    }

    loader.classList.add("is-hidden");

    window.setTimeout(() => {
      loader.remove();
    }, 1000);
  };

  window.addEventListener("load", () => {
    window.setTimeout(hideLoader, 1700);
  });

  /*
    Sécurité :
    le loader disparaît même si une image ou une police
    externe met trop de temps à charger.
  */
  window.setTimeout(hideLoader, 4500);

  /* ======================================================
     DÉTECTION DES PRÉFÉRENCES UTILISATEUR
  ====================================================== */

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const supportsFinePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  ).matches;

  /* ======================================================
     HALO DE SOURIS
  ====================================================== */

  if (supportsFinePointer && pointerLight && !prefersReducedMotion) {
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;

    let currentX = targetX;
    let currentY = targetY;

    document.addEventListener("pointermove", (event) => {
      targetX = event.clientX;
      targetY = event.clientY;

      document.documentElement.style.setProperty(
        "--pointer-x",
        `${event.clientX}px`
      );

      document.documentElement.style.setProperty(
        "--pointer-y",
        `${event.clientY}px`
      );
    });

    const animatePointer = () => {
      currentX += (targetX - currentX) * 0.075;
      currentY += (targetY - currentY) * 0.075;

      pointerLight.style.transform =
        `translate3d(${currentX - 260}px, ${currentY - 260}px, 0)`;

      window.requestAnimationFrame(animatePointer);
    };

    animatePointer();
  }

  /* ======================================================
     NAVIGATION AU SCROLL
  ====================================================== */

  const updateHeader = () => {
    if (!header) return;

    if (window.scrollY > 32) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  };

  updateHeader();

  window.addEventListener("scroll", updateHeader, {
    passive: true
  });

  /* ======================================================
     MENU MOBILE
  ====================================================== */

  const closeMenu = () => {
    if (!navToggle || !mobileMenu) return;

    navToggle.classList.remove("is-active");
    mobileMenu.classList.remove("is-open");
    body.classList.remove("menu-open");

    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Ouvrir le menu");
  };

  const openMenu = () => {
    if (!navToggle || !mobileMenu) return;

    navToggle.classList.add("is-active");
    mobileMenu.classList.add("is-open");
    body.classList.add("menu-open");

    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Fermer le menu");
  };

  if (navToggle && mobileMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.contains("is-open");

      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  mobileLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      closeMenu();
    }
  });

  /* ======================================================
     ANIMATIONS AU SCROLL
  ====================================================== */

  if (prefersReducedMotion) {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  } else if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -8% 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  }

  /* ======================================================
     SCROLL FLUIDE DES LIENS INTERNES
  ====================================================== */

  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      /*
        Retour en haut.
      */
      if (targetId === "#") {
        event.preventDefault();

        window.scrollTo({
          top: 0,
          behavior: prefersReducedMotion ? "auto" : "smooth"
        });

        return;
      }

      const target = document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      const headerHeight = header
        ? header.getBoundingClientRect().height
        : 0;

      const targetPosition =
        target.getBoundingClientRect().top +
        window.scrollY -
        headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: prefersReducedMotion ? "auto" : "smooth"
      });
    });
  });

  /* ======================================================
     PARALLAXE DU PORTRAIT
  ====================================================== */

  if (
    heroImage &&
    heroVisual &&
    supportsFinePointer &&
    !prefersReducedMotion
  ) {
    heroVisual.addEventListener("pointermove", (event) => {
      const rect = heroVisual.getBoundingClientRect();

      const relativeX =
        (event.clientX - rect.left) / rect.width - 0.5;

      const relativeY =
        (event.clientY - rect.top) / rect.height - 0.5;

      heroImage.style.transform =
        `scale(1.09) translate3d(${relativeX * 8}px, ${relativeY * 8}px, 0)`;
    });

    heroVisual.addEventListener("pointerleave", () => {
      heroImage.style.transform =
        "scale(1.04) translate3d(0, 0, 0)";
    });
  }

  /* ======================================================
     PARALLAXE SUR LES IMAGES DES PROJETS
  ====================================================== */

  if (supportsFinePointer && !prefersReducedMotion) {
    projectMediaElements.forEach((media) => {
      const image = media.querySelector(".project__image");

      if (!image) return;

      media.addEventListener("pointermove", (event) => {
        const rect = media.getBoundingClientRect();

        const relativeX =
          (event.clientX - rect.left) / rect.width - 0.5;

        const relativeY =
          (event.clientY - rect.top) / rect.height - 0.5;

        image.style.transform =
          `scale(1.075) translate3d(${relativeX * 10}px, ${relativeY * 10}px, 0)`;
      });

      media.addEventListener("pointerleave", () => {
        image.style.transform =
          "scale(1.02) translate3d(0, 0, 0)";
      });
    });
  }

  /* ======================================================
     GESTION DES IMAGES MANQUANTES
  ====================================================== */

  const images = document.querySelectorAll("img");

  images.forEach((image) => {
    image.addEventListener("error", () => {
      const parent = image.parentElement;

      image.style.display = "none";

      if (!parent) return;

      if (image.classList.contains("hero__image")) {
        parent.classList.add("portrait-missing");
      } else {
        parent.classList.add("image-missing");
      }
    });
  });
});
