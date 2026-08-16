document.addEventListener("DOMContentLoaded", () => {
  // Initialize Lucide Icons
  lucide.createIcons();

  // --- 1. Header Scroll and Mobile Menu Logic ---
  const header = document.getElementById("main-header");
  const headerLogo = document.getElementById("header-logo");
  const navLinks = document.querySelectorAll(".nav-link");
  const menuBtn = document.getElementById("menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");

  function updateHeader() {
    const isScrolled = window.scrollY > 50;
    const isMenuOpen = mobileMenu && mobileMenu.classList.contains("open");

    if (isScrolled || isMenuOpen) {
      header.classList.remove("header-transparent");
      header.classList.add("header-scrolled");

      if (isMenuOpen) {
        header.style.backgroundColor = "#ffffff";
      } else {
        header.style.backgroundColor = "";
      }

      if (headerLogo) {
        headerLogo.classList.remove("brightness-0", "invert");
      }

      navLinks.forEach((link) => {
        link.classList.remove("text-white");
        link.classList.add("text-primary");
      });

      const toggleIcon = menuBtn ? menuBtn.querySelector("svg, i") : null;
      if (toggleIcon) {
        toggleIcon.classList.remove("text-white");
        toggleIcon.classList.add("text-primary");
      }
    } else {
      header.classList.add("header-transparent");
      header.classList.remove("header-scrolled");
      header.style.backgroundColor = "";

      if (headerLogo) {
        headerLogo.classList.add("brightness-0", "invert");
      }

      navLinks.forEach((link) => {
        link.classList.add("text-white");
        link.classList.remove("text-primary");
      });

      const toggleIcon = menuBtn ? menuBtn.querySelector("svg, i") : null;
      if (toggleIcon) {
        toggleIcon.classList.add("text-white");
        toggleIcon.classList.remove("text-primary");
      }
    }
  }

  window.addEventListener("scroll", updateHeader);

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("open");
      const isOpen = mobileMenu.classList.contains("open");

      // Replace Lucide icon
      const iconName = isOpen ? "x" : "menu";
      menuBtn.innerHTML = `<i data-lucide="${iconName}" class="w-7 h-7 transition-colors"></i>`;
      lucide.createIcons();
      updateHeader();
    });

    // Close menu when a link is clicked
    const mobileLinks = mobileMenu.querySelectorAll("a");
    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("open");
        menuBtn.innerHTML = `<i data-lucide="menu" class="w-7 h-7 transition-colors"></i>`;
        lucide.createIcons();
        updateHeader();
      });
    });
  }

  // --- 2. Copy Code to Clipboard ---
  const copyButtons = document.querySelectorAll(".copy-btn");
  copyButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const code = btn.getAttribute("data-code");
      const tooltip = btn.querySelector(".tooltip");

      navigator.clipboard.writeText(code).then(() => {
        tooltip.classList.add("show");
        setTimeout(() => {
          tooltip.classList.remove("show");
        }, 2000);
      });
    });
  });

  // --- 3. Results Section (Lightbox with Interactive Pan & Zoom Lupa) ---
  const lightbox = document.getElementById("print-lightbox");
  const lightboxImgWrapper = document.getElementById("lightbox-img-wrapper");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxTitle = document.getElementById("lightbox-title");
  const lightboxApp = document.getElementById("lightbox-app");
  const closeLightboxBtn = document.getElementById("close-lightbox-btn");
  const zoomHint = document.getElementById("lightbox-zoom-hint");

  let isZoomed = false;

  const resetZoom = () => {
    isZoomed = false;
    if (lightboxImg) {
      lightboxImg.style.transformOrigin = "center center";
      lightboxImg.style.transform = "scale(1)";
      lightboxImg.style.transition = "transform 0.3s ease";
    }
    if (lightboxImgWrapper) {
      lightboxImgWrapper.style.cursor = "zoom-in";
    }
    if (zoomHint) zoomHint.textContent = "Clique para ampliar";
  };

  const setZoomPosition = (e) => {
    if (!lightboxImgWrapper || !lightboxImg) return;
    const rect = lightboxImgWrapper.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    lightboxImg.style.transformOrigin = `${x.toFixed(1)}% ${y.toFixed(1)}%`;
  };

  const toggleZoom = (e) => {
    if (e) e.stopPropagation();
    isZoomed = !isZoomed;
    if (lightboxImg && lightboxImgWrapper) {
      if (isZoomed) {
        if (e) setZoomPosition(e);
        lightboxImg.style.transition = "transform 0.25s ease-out, transform-origin 0.08s ease-out";
        lightboxImg.style.transform = "scale(2.2)";
        lightboxImgWrapper.style.cursor = "zoom-out";
        if (zoomHint) zoomHint.textContent = "Clique para diminuir";
      } else {
        resetZoom();
      }
    }
  };

  if (lightboxImgWrapper) {
    lightboxImgWrapper.addEventListener("click", toggleZoom);
    lightboxImgWrapper.addEventListener("mousemove", (e) => {
      if (isZoomed) {
        setZoomPosition(e);
      }
    });
  }

  const resultCards = document.querySelectorAll(".result-card-btn");
  resultCards.forEach((card) => {
    card.addEventListener("click", (e) => {
      e.stopPropagation();
      const image = card.getAttribute("data-image");
      const title = card.getAttribute("data-title");
      const app = card.getAttribute("data-app");

      if (lightbox && lightboxImg && lightboxTitle && lightboxApp) {
        lightboxImg.src = image;
        lightboxImg.alt = title;
        lightboxTitle.textContent = title;
        lightboxApp.textContent = ` • ${app}`;
        resetZoom();
        lightbox.classList.remove("hidden");
      }
    });
  });

  const closeLightbox = () => {
    if (lightbox) {
      lightbox.classList.add("hidden");
      resetZoom();
    }
  };

  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox || e.target.closest("#close-lightbox-btn")) {
        closeLightbox();
      }
    });
  }

  if (closeLightboxBtn) {
    closeLightboxBtn.addEventListener("click", closeLightbox);
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox && !lightbox.classList.contains("hidden")) {
      closeLightbox();
    }
  });

  const showAllResultsBtn = document.getElementById("show-all-results-btn");
  if (showAllResultsBtn) {
    showAllResultsBtn.addEventListener("click", () => {
      const hiddenCards = document.querySelectorAll(".results-hidden-card");
      hiddenCards.forEach((card) => {
        card.classList.remove("hidden");
      });
      showAllResultsBtn.classList.add("hidden");
    });
  }

  // --- 4. Universal Testimonial Truncation & Modal System (Mobile & Desktop) ---
  const allTestimonialCards = document.querySelectorAll(
    "#testimonials-scroller .snap-center, #testimonials-desktop-grid > div"
  );

  allTestimonialCards.forEach((card) => {
    const title = card.querySelector("h3");
    const paragraphs = Array.from(card.querySelectorAll("p"));
    const handle = paragraphs.find((p) => p.textContent?.trim().startsWith("@"));
    const img = card.querySelector("img");
    
    // Find the body paragraph (the longest text block)
    const body = paragraphs.reduce((longest, p) => {
      if (p === handle) return longest;
      if (!longest) return p;
      return (p.textContent?.length || 0) > (longest.textContent?.length || 0) ? p : longest;
    }, null);

    if (body) {
      body.classList.add("line-clamp-5");

      // Read More Button
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = "Ler depoimento completo";
      button.className = "mt-4 text-xs md:text-sm font-bold text-secondary hover:text-gold transition-colors inline-flex items-center gap-1 cursor-pointer z-20 self-center hover:underline";

      const openModal = (e) => {
        e.stopPropagation();
        const overlay = document.createElement("div");
        overlay.className = "fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in";

        const modal = document.createElement("div");
        modal.className = "relative bg-white w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-3xl shadow-2xl p-6 md:p-8 text-center border border-gray-100";

        const closeBtn = document.createElement("button");
        closeBtn.type = "button";
        closeBtn.innerHTML = "&times;";
        closeBtn.className = "absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800 flex items-center justify-center text-xl font-bold transition-all";

        // Modal Avatar
        let avatarHtml = "";
        if (img) {
          avatarHtml = `
            <div class="relative w-20 h-20 mx-auto mb-3">
              <div class="absolute inset-0 bg-gold rounded-full blur opacity-30"></div>
              <img src="${img.src}" alt="${img.alt || 'Streamer'}" class="relative w-full h-full rounded-full object-cover border-2 border-white shadow-md" />
            </div>
          `;
        }

        const nameText = title?.textContent?.trim() || "Depoimento";
        const handleText = handle?.textContent?.trim() || "";
        const bodyText = body.textContent?.trim() || "";

        modal.innerHTML = `
          ${closeBtn.outerHTML}
          ${avatarHtml}
          <h3 class="text-2xl font-extrabold text-primary mb-1">${nameText}</h3>
          ${handleText ? `<p class="text-xs font-semibold text-secondary mb-3">${handleText}</p>` : ""}
          <div class="flex justify-center gap-1 text-yellow-400 mb-4">
            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          </div>
          <div class="relative bg-gray-50/80 rounded-2xl p-5 border border-gray-100 text-left">
            <p class="text-sm md:text-base leading-relaxed text-gray-700 italic">${bodyText}</p>
          </div>
        `;

        const closeModal = () => {
          overlay.classList.add("opacity-0");
          setTimeout(() => overlay.remove(), 200);
        };

        const modalCloseBtn = modal.querySelector("button");
        if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeModal);

        overlay.addEventListener("click", (event) => {
          if (event.target === overlay) closeModal();
        });

        const handleEscape = (e) => {
          if (e.key === "Escape") {
            closeModal();
            document.removeEventListener("keydown", handleEscape);
          }
        };
        document.addEventListener("keydown", handleEscape);

        overlay.appendChild(modal);
        document.body.appendChild(overlay);
      };

      button.addEventListener("click", openModal);
      body.insertAdjacentElement("afterend", button);
    }
  });

  // --- 5. Mobile Instagram-Style Carousel Dots ---
  const isMobile = window.matchMedia("(max-width: 767px)").matches;
  const MAX_VISIBLE_DOTS = 5;
  const DOT_SIZE = 8;
  const DOT_GAP = 6;
  const DOT_STEP = DOT_SIZE + DOT_GAP;

  const scrollers = document.querySelectorAll("#testimonials-scroller, #results-scroller");
  if (isMobile) {
    scrollers.forEach((scroller, index) => {
      const cards = Array.from(scroller.children);
      if (cards.length < 2) return;

      const visibleCount = Math.min(MAX_VISIBLE_DOTS, cards.length);

      const dotsWrapper = document.createElement("div");
      dotsWrapper.className = "flex items-center justify-center mt-2 mb-4 min-h-3 md:hidden";

      const dotsViewport = document.createElement("div");
      dotsViewport.style.width = `${visibleCount * DOT_SIZE + (visibleCount - 1) * DOT_GAP}px`;
      dotsViewport.style.overflow = "hidden";

      const dotsTrack = document.createElement("div");
      dotsTrack.style.display = "flex";
      dotsTrack.style.alignItems = "center";
      dotsTrack.style.gap = `${DOT_GAP}px`;
      dotsTrack.style.width = "max-content";
      dotsTrack.style.transition = "transform 240ms cubic-bezier(0.22, 1, 0.36, 1)";
      dotsTrack.style.willChange = "transform";

      dotsViewport.appendChild(dotsTrack);
      dotsWrapper.appendChild(dotsViewport);
      scroller.insertAdjacentElement("afterend", dotsWrapper);

      let activeIndex = 0;
      let ticking = false;
      const dots = [];

      const getActiveIndex = () => {
        const scrollerRect = scroller.getBoundingClientRect();
        const center = scrollerRect.left + scrollerRect.width / 2;
        let nearestIndex = 0;
        let nearestDistance = Number.POSITIVE_INFINITY;

        cards.forEach((card, i) => {
          const rect = card.getBoundingClientRect();
          const cardCenter = rect.left + rect.width / 2;
          const distance = Math.abs(center - cardCenter);

          if (distance < nearestDistance) {
            nearestDistance = distance;
            nearestIndex = i;
          }
        });

        return nearestIndex;
      };

      const getWindowStart = (current) => {
        if (cards.length <= MAX_VISIBLE_DOTS) return 0;
        const centeredStart = current - Math.floor(MAX_VISIBLE_DOTS / 2);
        return Math.max(0, Math.min(centeredStart, cards.length - MAX_VISIBLE_DOTS));
      };

      const updateDots = () => {
        const windowStart = getWindowStart(activeIndex);
        const windowEnd = windowStart + visibleCount - 1;

        dotsTrack.style.transform = `translateX(-${windowStart * DOT_STEP}px)`;

        dots.forEach((dot, i) => {
          const isActive = i === activeIndex;
          const isVisible = i >= windowStart && i <= windowEnd;
          const isLeadingEdge = i === windowStart && windowStart > 0;
          const isTrailingEdge = i === windowEnd && windowEnd < cards.length - 1;
          const isNearLeadingEdge = i === windowStart + 1 && windowStart > 0 && !isActive;
          const isNearTrailingEdge = i === windowEnd - 1 && windowEnd < cards.length - 1 && !isActive;

          let scale = 1;
          if (!isActive && (isLeadingEdge || isTrailingEdge)) scale = 0.55;
          else if (!isActive && (isNearLeadingEdge || isNearTrailingEdge)) scale = 0.8;

          dot.style.backgroundColor = isActive ? "#0095f6" : "#d1d5db";
          dot.style.transform = `scale(${scale})`;
          dot.style.opacity = isVisible ? "1" : "0.55";
        });
      };

      cards.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.style.width = `${DOT_SIZE}px`;
        dot.style.height = `${DOT_SIZE}px`;
        dot.style.padding = "0";
        dot.style.border = "0";
        dot.style.borderRadius = "9999px";
        dot.style.flexShrink = "0";
        dot.style.cursor = "pointer";
        dot.style.transition = "background-color 180ms ease, transform 240ms cubic-bezier(0.22, 1, 0.36, 1), opacity 180ms ease";

        dot.addEventListener("click", () => {
          cards[i].scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
          });
        });

        dots.push(dot);
        dotsTrack.appendChild(dot);
      });

      const updateActiveDot = () => {
        ticking = false;
        const nextIndex = getActiveIndex();
        if (nextIndex === activeIndex) return;
        activeIndex = nextIndex;
        updateDots();
      };

      scroller.addEventListener("scroll", () => {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(updateActiveDot);
      }, { passive: true });

      updateDots();
    });
  }

  // --- 6. Scroll Reveal Observer ---
  const revealOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const scrollRevealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        scrollRevealObserver.unobserve(entry.target);
      }
    });
  }, revealOptions);

  document.querySelectorAll(".scroll-reveal").forEach((el) => {
    scrollRevealObserver.observe(el);
  });

  // --- 7. Cookie Banner ---
  const cookieBanner = document.getElementById("cookie-banner");
  const acceptBtn = document.getElementById("accept-terms-btn");

  if (cookieBanner && acceptBtn) {
    if (!localStorage.getItem("termsAccepted")) {
      setTimeout(() => {
        cookieBanner.classList.remove("translate-y-full");
      }, 1000);
    }

    acceptBtn.addEventListener("click", () => {
      localStorage.setItem("termsAccepted", "true");
      cookieBanner.classList.add("translate-y-full");
    });
  }

  // --- 8. Silky Smooth Drag & Momentum Carousel Logic ---
  const sliders = document.querySelectorAll(".drag-carousel");
  
  sliders.forEach((slider) => {
    let isDown = false;
    let startX = 0;
    let scrollStart = 0;
    let velX = 0;
    let momentumID = null;
    let hasDragged = false;
    let lastX = 0;
    let lastTime = 0;

    const cancelMomentum = () => {
      if (momentumID) {
        cancelAnimationFrame(momentumID);
        momentumID = null;
      }
    };

    slider.addEventListener("mousedown", (e) => {
      if (e.button !== 0) return;
      isDown = true;
      hasDragged = false;
      cancelMomentum();
      slider.classList.add("active");
      startX = e.pageX - slider.offsetLeft;
      scrollStart = slider.scrollLeft;
      lastX = e.pageX;
      lastTime = performance.now();
      velX = 0;
    });

    const endDrag = () => {
      if (!isDown) return;
      isDown = false;
      slider.classList.remove("active");

      // Clear hasDragged after 80ms to permit subsequent clean clicks
      if (hasDragged) {
        setTimeout(() => {
          hasDragged = false;
        }, 80);
      }

      // Apply smooth momentum gliding if dragged with velocity
      if (hasDragged && Math.abs(velX) > 0.5) {
        const momentumLoop = () => {
          slider.scrollLeft -= velX;
          velX *= 0.94; // smooth exponential friction
          if (Math.abs(velX) > 0.4) {
            momentumID = requestAnimationFrame(momentumLoop);
          }
        };
        momentumID = requestAnimationFrame(momentumLoop);
      }
    };

    window.addEventListener("mouseup", endDrag);

    slider.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      const x = e.pageX - slider.offsetLeft;
      const walk = x - startX;
      
      // Only treat as drag if cursor moved more than 8 pixels
      if (Math.abs(walk) > 8) {
        hasDragged = true;
        e.preventDefault();
        slider.scrollLeft = scrollStart - walk;

        // Track velocity for natural inertia glide
        const now = performance.now();
        const dt = now - lastTime;
        if (dt > 0) {
          const dx = e.pageX - lastX;
          velX = (dx / dt) * 16;
        }
        lastX = e.pageX;
        lastTime = now;
      }
    });

    // Suppress clicks ONLY when there was an actual drag
    slider.addEventListener("click", (e) => {
      if (hasDragged) {
        e.stopPropagation();
        e.preventDefault();
      }
    }, true);
  });

  // --- 9. Carousel Arrow Buttons ---
  document.querySelectorAll(".carousel-wrapper").forEach((wrapper) => {
    const carousel = wrapper.querySelector(".drag-carousel");
    const leftBtn = wrapper.querySelector(".arrow-left");
    const rightBtn = wrapper.querySelector(".arrow-right");
    
    if (!carousel || !leftBtn || !rightBtn) return;
    
    const scrollAmount = () => {
      const firstChild = carousel.querySelector(":scope > *");
      return firstChild ? firstChild.offsetWidth + 24 : 350;
    };
    
    leftBtn.addEventListener("click", () => {
      carousel.scrollBy({ left: -scrollAmount(), behavior: "smooth" });
    });
    
    rightBtn.addEventListener("click", () => {
      carousel.scrollBy({ left: scrollAmount(), behavior: "smooth" });
    });
  });
});

