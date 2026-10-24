
/* BLOOD X SADIQ - NAVBAR CONTROLS */

document.addEventListener("DOMContentLoaded", function () {
  const menuButton = document.getElementById("bxsMenuToggle");
  const navLinks = document.getElementById("bxsNavLinks");
  const dropdownItems = document.querySelectorAll(".bxs-nav-item");

  if (!menuButton || !navLinks) return;

  function closeDropdowns(exceptItem = null) {
    dropdownItems.forEach(function (item) {
      if (item !== exceptItem) {
        item.classList.remove("open");

        const button = item.querySelector(".bxs-dropdown-toggle");
        if (button) button.setAttribute("aria-expanded", "false");
      }
    });
  }

  function closeMenu() {
    navLinks.classList.remove("is-open");
    menuButton.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation menu");
    closeDropdowns();
  }

  menuButton.addEventListener("click", function () {
    const isOpen = navLinks.classList.toggle("is-open");

    menuButton.classList.toggle("is-open", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu"
    );

    if (!isOpen) closeDropdowns();
  });

  dropdownItems.forEach(function (item) {
    const button = item.querySelector(".bxs-dropdown-toggle");

    if (!button) return;

    button.addEventListener("click", function (event) {
      event.stopPropagation();

      const willOpen = !item.classList.contains("open");

      closeDropdowns(item);
      item.classList.toggle("open", willOpen);
      button.setAttribute("aria-expanded", String(willOpen));
    });
  });

  // Close the mobile menu after choosing a link
  navLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      closeMenu();

      const href = link.getAttribute("href");

      // Update active nav link for regular navigation
      if (href && href.startsWith("#")) {
        const target = document.querySelector(href);

        if (target) {
          navLinks.querySelectorAll(".bxs-nav-link").forEach(function (nav) {
            nav.classList.toggle(
              "active",
              nav.getAttribute("href") === href
            );
          });
        }
      }
    });
  });

  // Close dropdowns when clicking elsewhere
  document.addEventListener("click", function (event) {
    if (!event.target.closest(".bxs-navbar")) {
      closeDropdowns();
    }
  });

  // Close mobile navigation with Escape
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeMenu();
  });

  // Reset mobile menu when switching back to desktop
  window.addEventListener("resize", function () {
    if (window.innerWidth > 900) closeMenu();
  });
});





 /* BLOOD X SADIQ - PROFILE WINDOW CONTROLS */

document.addEventListener("DOMContentLoaded", function () {
  const overlay = document.getElementById("bxsProfileOverlay");
  const closeButton = document.getElementById("bxsProfileClose");
  const copyButton = document.getElementById("bxsCopyId");
  const playerId = document.getElementById("bxsPlayerId");
  const inlineId = document.getElementById("bxsPlayerIdInline");
  const message = document.getElementById("bxsCopyMessage");

  if (!overlay) return;

  // Open popup using a My Profile link
  const profileLinks = document.querySelectorAll(
    '.bxs-dropdown a[href="#profile"], ' +
    '.bxs-nav-link[href="#profile"], ' +
    'a[href="#open-player-profile"]'
  );

  function openProfile(event) {
    if (event) event.preventDefault();

    overlay.classList.add("bxs-profile-show");
    document.body.style.overflow = "hidden";

    if (closeButton) closeButton.focus();
  }

  function closeProfile() {
    overlay.classList.remove("bxs-profile-show");
    document.body.style.overflow = "";

    if (message) message.textContent = "";
  }

  profileLinks.forEach(function (link) {
    link.addEventListener("click", openProfile);
  });

  if (closeButton) {
    closeButton.addEventListener("click", closeProfile);
  }

  // Close by tapping the dark area outside the window
  overlay.addEventListener("click", function (event) {
    if (event.target === overlay) closeProfile();
  });

  // Close with Escape
  document.addEventListener("keydown", function (event) {
    if (
      event.key === "Escape" &&
      overlay.classList.contains("bxs-profile-show")
    ) {
      closeProfile();
    }
  });

  // Copy player ID
  if (copyButton && playerId) {
    copyButton.addEventListener("click", async function () {
      const id = playerId.textContent.trim();

      if (!id || id === "YOUR_PLAYER_ID") {
        if (message) {
          message.textContent = "আগে নিজের Player ID বসাও!";
        }
        return;
      }

      try {
        await navigator.clipboard.writeText(id);

        if (message) message.textContent = "✓ Player ID copied!";
      } catch (error) {
        // Fallback for browsers that block clipboard access
        const temp = document.createElement("textarea");
        temp.value = id;
        temp.style.position = "fixed";
        temp.style.opacity = "0";

        document.body.appendChild(temp);
        temp.select();

        const copied = document.execCommand("copy");
        temp.remove();

        if (message) {
          message.textContent = copied
            ? "✓ Player ID copied!"
            : "ID copy হয়নি — হাতে copy করো";
        }
      }
    });
  }

  // Keep both visible ID fields synchronized
  if (playerId && inlineId) {
    const syncId = function () {
      inlineId.textContent = playerId.textContent.trim();
    };

    syncId();
  }
});




/* BXS PERMANENT PROFILE BACKGROUND */

document.addEventListener("DOMContentLoaded", function () {
  const upload = document.getElementById("bxsCoverUpload");
  const changeBtn = document.getElementById("bxsChangeCover");
  const cover = document.querySelector(".bxs-profile-cover");

  if (!upload || !changeBtn || !cover) return;

  const STORAGE_KEY = "bxsPermanentProfileCover";

  // Apply saved photo
  function applyCover(imageData) {
    cover.style.backgroundImage =
      'linear-gradient(0deg, #08090c 0%, #08090c22 65%), ' +
      'url("' + imageData + '")';

    cover.classList.add("bxs-has-cover");
  }

  // Restore photo when page opens
  try {
    const savedPhoto = localStorage.getItem(STORAGE_KEY);

    if (savedPhoto) {
      applyCover(savedPhoto);
    }
  } catch (error) {
    console.warn("Could not load saved profile photo.", error);
  }

  // Open Gallery
  changeBtn.addEventListener("click", function () {
    upload.click();
  });

  // Select and permanently save photo
  upload.addEventListener("change", function () {
    const file = upload.files && upload.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("ভাই, একটা image file select কর!");
      upload.value = "";
      return;
    }

    // Avoid huge images filling browser storage
    if (file.size > 4 * 1024 * 1024) {
      alert("ভাই, ছবিটা 4 MB-এর নিচে রাখ। দরকার হলে compress করে নে।");
      upload.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = function (event) {
      const imageData = event.target.result;

      try {
        localStorage.setItem(STORAGE_KEY, imageData);
        applyCover(imageData);
        alert("✅ Profile Photo permanent save done!");
      } catch (error) {
        alert(
          "ছবি save করা যায়নি। অন্য ছোট ছবি try কর, অথবা project-এর images folder ব্যবহার কর।"
        );
      }
    };

    reader.readAsDataURL(file);
  });
});





/* BXS MY SQUAD - OPEN / CLOSE */

document.addEventListener("DOMContentLoaded", function () {
  const overlay = document.getElementById("bxsSquadOverlay");
  const closeBtn = document.getElementById("bxsSquadClose");

  if (!overlay || !closeBtn) return;

  // My Squad navbar/dropdown link
  const squadLinks = document.querySelectorAll(
    'a[href="#my-squad"], a[href="#squad"]'
  );

  function openSquad(event) {
    event.preventDefault();
    overlay.classList.add("bxs-squad-active");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function closeSquad() {
    overlay.classList.remove("bxs-squad-active");
    document.body.style.overflow = "";
  }

  squadLinks.forEach(function (link) {
    link.addEventListener("click", openSquad);
  });

  closeBtn.addEventListener("click", closeSquad);

  // Tap outside the window to close
  overlay.addEventListener("click", function (event) {
    if (event.target === overlay) {
      closeSquad();
    }
  });

  // Close with Escape key
  document.addEventListener("keydown", function (event) {
    if (
      event.key === "Escape" &&
      overlay.classList.contains("bxs-squad-active")
    ) {
      closeSquad();
    }
  });
});



/* BXS ARENA - SCROLL REVEAL ANIMATION */

document.addEventListener("DOMContentLoaded", function () {
  const arenaItems = document.querySelectorAll(".arena-reveal");

  if ("IntersectionObserver" in window) {
    const arenaObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("arena-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12
      }
    );

    arenaItems.forEach(function (item) {
      arenaObserver.observe(item);
    });
  } else {
    arenaItems.forEach(function (item) {
      item.classList.add("arena-visible");
    });
  }
});




/* BXS TOURNAMENT POSTER UPLOADER */

document.addEventListener("DOMContentLoaded", function () {
  const upload = document.getElementById("arenaPosterUpload");
  const poster = document.querySelector(".arena-main-image");

  if (!upload || !poster) return;

  // Restore the last poster saved in this browser
  try {
    const savedPoster = localStorage.getItem("bxsTournamentPoster");

    if (savedPoster) {
      poster.src = savedPoster;
    }
  } catch (error) {
    console.warn("Could not restore saved poster.");
  }

  upload.addEventListener("change", function () {
    const file = upload.files && upload.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image.");
      upload.value = "";
      return;
    }

    // Keep uploads reasonably sized for browser storage
    if (file.size > 2 * 1024 * 1024) {
      alert("Vai, 2 MB-er moddhe image select kor. Tahole save kora easy hobe.");
      upload.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = function (event) {
      const imageData = event.target.result;

      poster.src = imageData;

      try {
        localStorage.setItem("bxsTournamentPoster", imageData);
        alert("Tournament poster updated! ❤️‍🔥");
      } catch (error) {
        alert("Poster changed, but browser storage is full. Image may not stay after refresh.");
      }
    };

    reader.readAsDataURL(file);
  });
});




 // ===== BXS SCROLL REVEAL =====
document.addEventListener("DOMContentLoaded", function () {
  const items = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    items.forEach(item => item.classList.add("reveal-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal-visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -35px 0px"
  });

  items.forEach(item => observer.observe(item));
});






document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("bxsRegistrationForm");

  if (!form) {
    console.error("BLOOD X SADIQ registration form not found.");
    return;
  }

  emailjs.init({
    publicKey: "ilp3wXRy4_dtICZFk"
  });

  let message = document.getElementById("registrationMessage");

  if (!message) {
    message = document.createElement("p");
    message.id = "registrationMessage";
    message.setAttribute("role", "status");
    message.setAttribute("aria-live", "polite");
    form.appendChild(message);
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const submitButton = form.querySelector(
      'button[type="submit"], input[type="submit"]'
    );

    if (submitButton && submitButton.disabled) return;

    if (submitButton) submitButton.disabled = true;

    message.textContent = "Sending your registration...";
    message.style.color = "#ff3030";

    try {
      await emailjs.sendForm(
        "service_2q58uts",
        "template_n4z7wyn",
        form
      );

      message.textContent =
        "Registration submitted successfully! Check your email soon.";
      message.style.color = "#16a34a";

      form.reset();
    } catch (error) {
      console.error("EmailJS error:", error);

      message.textContent =
        "Registration failed. Please try again in a moment.";
      message.style.color = "#ff3030";
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
});






document.addEventListener("DOMContentLoaded", function () {
  const section = document.querySelector(".bxs-ach-section");
  if (!section) return;

  const items = section.querySelectorAll(".bxs-ach-reveal");
  const counters = section.querySelectorAll(".bxs-ach-counter");
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Stagger each card slightly
  items.forEach(function (item, index) {
    item.style.setProperty(
      "--ach-delay",
      Math.min(index % 3, 2) * 120 + "ms"
    );
  });

  function animateCounter(counter) {
    if (counter.dataset.animated === "true") return;
    counter.dataset.animated = "true";

    const target = Number(counter.dataset.target);
    if (!Number.isFinite(target) || target < 0) {
      counter.textContent = "0";
      return;
    }

    if (reduceMotion) {
      counter.textContent = Math.round(target).toLocaleString();
      return;
    }

    const duration = 1300;
    const startTime = performance.now();

    function update(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const value = Math.round(target * eased);

      counter.textContent = value.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  function revealItem(item) {
    item.classList.add("bxs-ach-visible");
  }

  if ("IntersectionObserver" in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            revealItem(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
      }
    );

    items.forEach(function (item) {
      revealObserver.observe(item);
    });

    const counterObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(function (counter) {
      counterObserver.observe(counter);
    });
  } else {
    items.forEach(revealItem);
    counters.forEach(animateCounter);
  }
});





document.addEventListener("DOMContentLoaded", function () {
  const section = document.querySelector(".bxs-videos-section");
  if (!section) return;

  const revealItems = section.querySelectorAll(".bxs-videos-reveal");
  const modal = document.getElementById("bxsVideosModal");
  const player = document.getElementById("bxsVideosPlayer");
  const closeBtn = document.getElementById("bxsVideosClose");
  const modalTitle = document.getElementById("bxsVideosModalTitle");

  // Staggered scroll animation
  revealItems.forEach(function (item, index) {
    item.style.setProperty(
      "--bv-delay",
      Math.min(index, 5) * 100 + "ms"
    );
  });

  function showReveal(item) {
    item.classList.add("bxs-videos-visible");
  }

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if ("IntersectionObserver" in window && !reduceMotion) {
    const observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            showReveal(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -25px 0px"
      }
    );

    revealItems.forEach(function (item) {
      observer.observe(item);
    });
  } else {
    revealItems.forEach(showReveal);
  }

  // Video popup
  if (!modal || !player || !closeBtn) return;

  let previousFocus = null;

  function openVideo(button) {
    const videoId = button.dataset.video || "";

    // Prevent placeholder IDs or invalid URLs from opening.
    if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
      alert("Vai, ei video-r jonno nijer 11-character YouTube video ID boshao!");
      return;
    }

    previousFocus = button;

    modalTitle.textContent =
      button.dataset.title || "NOW PLAYING";

    player.innerHTML = "";

    const iframe = document.createElement("iframe");
    iframe.src =
      "https://www.youtube-nocookie.com/embed/" +
      encodeURIComponent(videoId) +
      "?autoplay=1&rel=0";

    iframe.title = modalTitle.textContent;
    iframe.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = "strict-origin-when-cross-origin";

    player.appendChild(iframe);

    modal.classList.add("bxs-videos-modal-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function closeVideo() {
    modal.classList.remove("bxs-videos-modal-open");
    modal.setAttribute("aria-hidden", "true");

    // Removing iframe also stops playback.
    player.innerHTML = "";
    document.body.style.overflow = "";

    if (previousFocus) previousFocus.focus();
  }

  section.querySelectorAll("[data-video]").forEach(function (button) {
    button.addEventListener("click", function () {
      openVideo(button);
    });
  });

  closeBtn.addEventListener("click", closeVideo);

  modal.addEventListener("click", function (event) {
    if (event.target === modal) closeVideo();
  });

  document.addEventListener("keydown", function (event) {
    if (
      event.key === "Escape" &&
      modal.classList.contains("bxs-videos-modal-open")
    ) {
      closeVideo();
    }
  });
});






/* ============ BXS GALLERY SCROLL ANIMATION ============ */
(() => {
  const section = document.querySelector("#gaming-gallery");
  if (!section) return;

  const revealItems = section.querySelectorAll(".bxs-gallery-reveal");

  // Staggered animation: cards appear one after another
  revealItems.forEach((item, index) => {
    if (item.classList.contains("bxs-gallery-card")) {
      item.style.setProperty(
        "--bxs-gallery-delay",
        `${(index % 3) * 100}ms`
      );
    }
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("bxs-gallery-visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -35px 0px"
    });

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => {
      item.classList.add("bxs-gallery-visible");
    });
  }

  /* ============ IMAGE LIGHTBOX ============ */
  const lightbox = document.getElementById("bxsGalleryLightbox");
  const fullImage = document.getElementById("bxsGalleryFullImage");
  const closeButton = document.getElementById("bxsGalleryClose");
  const prevButton = document.getElementById("bxsGalleryPrev");
  const nextButton = document.getElementById("bxsGalleryNext");
  const counter = document.getElementById("bxsGalleryCounter");

  const cards = [...section.querySelectorAll(".bxs-gallery-card")];

  if (!lightbox || !fullImage || !closeButton) return;

  let currentIndex = 0;
  let previousFocus = null;

  function showImage(index) {
    currentIndex = (index + cards.length) % cards.length;

    const card = cards[currentIndex];
    const image = card.querySelector("img");

    fullImage.src = card.dataset.full;
    fullImage.alt = image ? image.alt : "Gaming screenshot";

    counter.textContent =
      `${String(currentIndex + 1).padStart(2, "0")} / ` +
      `${String(cards.length).padStart(2, "0")}`;
  }

  function openLightbox(index) {
    previousFocus = document.activeElement;
    showImage(index);

    lightbox.classList.add("bxs-gallery-lightbox-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeButton.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove("bxs-gallery-lightbox-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    // Clear image after the closing transition
    window.setTimeout(() => {
      if (!lightbox.classList.contains("bxs-gallery-lightbox-open")) {
        fullImage.removeAttribute("src");
      }
    }, 300);

    if (previousFocus && typeof previousFocus.focus === "function") {
      previousFocus.focus();
    }
  }

  cards.forEach((card, index) => {
    card.addEventListener("click", () => openLightbox(index));
  });

  closeButton.addEventListener("click", closeLightbox);
  prevButton.addEventListener("click", () => showImage(currentIndex - 1));
  nextButton.addEventListener("click", () => showImage(currentIndex + 1));

  // Close when clicking the dark background
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  // Keyboard controls
  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("bxs-gallery-lightbox-open")) return;

    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") showImage(currentIndex - 1);
    if (event.key === "ArrowRight") showImage(currentIndex + 1);
  });

  // Touch swipe for mobile
  let touchStartX = 0;

  lightbox.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });

  lightbox.addEventListener("touchend", (event) => {
    const difference = event.changedTouches[0].clientX - touchStartX;

    if (Math.abs(difference) > 60) {
      showImage(currentIndex + (difference < 0 ? 1 : -1));
    }
  }, { passive: true });
})();





/* ===== BXS YOUTUBE SHOWCASE SCROLL ANIMATION ===== */
(() => {
  const section = document.querySelector("#youtube");
  if (!section) return;

  const elements = section.querySelectorAll(".bxs-yt-show-reveal");

  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => {
      element.classList.add("bxs-yt-show-visible");
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("bxs-yt-show-visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -35px 0px"
  });

  elements.forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index * 100, 300)}ms`;
    observer.observe(element);
  });
})();




/* ===== BXS FACEBOOK SCROLL REVEAL ===== */
(() => {
  const section = document.querySelector("#facebook");
  if (!section) return;

  const elements = section.querySelectorAll(".bxs-fb-reveal");

  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => {
      element.classList.add("bxs-fb-visible");
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("bxs-fb-visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -30px 0px"
  });

  elements.forEach((element, index) => {
    element.style.setProperty(
      "--bxs-fb-delay",
      `${Math.min(index * 100, 300)}ms`
    );

    observer.observe(element);
  });
})();





/* ===== BXS TIKTOK SCROLL REVEAL ===== */

(() => {
  const items = document.querySelectorAll(".bxs-tt-reveal");

  if (!("IntersectionObserver" in window)) {
    items.forEach(item => item.classList.add("bxs-tt-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("bxs-tt-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -35px 0px"
    }
  );

  items.forEach((item, index) => {
    item.style.transitionDelay = `${(index % 3) * 140}ms`;
    observer.observe(item);
  });
})();






/* ===== BXS INSTAGRAM SCROLL REVEAL ===== */

(() => {
  const elements = document.querySelectorAll(".bxs-insta-reveal");

  if (!("IntersectionObserver" in window)) {
    elements.forEach(element => {
      element.classList.add("bxs-insta-visible");
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("bxs-insta-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -35px 0px"
    }
  );

  elements.forEach((element, index) => {
    element.style.transitionDelay = `${(index % 3) * 150}ms`;
    observer.observe(element);
  });
})();






/* ===== BXS ABOUT ME SCROLL ANIMATION ===== */

(() => {
  const elements = document.querySelectorAll(".bxs-about-reveal");

  if (!("IntersectionObserver" in window)) {
    elements.forEach(element => {
      element.classList.add("bxs-about-visible");
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("bxs-about-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -30px 0px"
    }
  );

  elements.forEach((element, index) => {
    element.style.transitionDelay = `${(index % 3) * 150}ms`;
    observer.observe(element);
  });
})();





/* ===== BXS CONTACT SECTION ===== */

(() => {
  // Scroll reveal animation
  const elements = document.querySelectorAll(".bxs-contact-reveal");

  if (!("IntersectionObserver" in window)) {
    elements.forEach(element => {
      element.classList.add("bxs-contact-visible");
    });
  } else {
    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("bxs-contact-visible");
            currentObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -30px 0px"
      }
    );

    elements.forEach((element, index) => {
      element.style.transitionDelay = `${(index % 2) * 150}ms`;
      observer.observe(element);
    });
  }

  // Contact form: open the visitor's email app
  
  // Contact form: send message using EmailJS
  const form = document.getElementById("bxsContactForm");
  const feedback = document.getElementById("bxsContactFeedback");

  if (form && feedback) {
    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      if (!form.reportValidity()) return;

      const name = document.getElementById("bxsContactName").value.trim();
      const email = document.getElementById("bxsContactEmail").value.trim();
      const subject = document.getElementById("bxsContactSubject").value.trim();
      const message = document.getElementById("bxsContactMessage").value.trim();

      const button = form.querySelector(
        'button[type="submit"], input[type="submit"]'
      );

      if (!name || !email || !subject || !message) {
        feedback.textContent = "Please fill in all fields.";
        feedback.classList.add("bxs-contact-feedback-visible");
        return;
      }

      if (button) {
        button.disabled = true;
        button.textContent = "SENDING...";
      }

      feedback.textContent = "Sending your message...";
      feedback.classList.add("bxs-contact-feedback-visible");

      try {
        await emailjs.send(
          "service_5vkuaj4",
          "template_92uox2k",
          {
            contact_name: name,
            contact_email: email,
            subject: subject,
            message: message
          }
        );

        
feedback.textContent =
  "✓ MESSAGE SENT SUCCESSFULLY! Thanks for contacting BLOOD X SADIQ.";
feedback.style.color = "#00ff99";

        
        form.reset();

      } catch (error) {
        console.error("EmailJS error:", error);

        feedback.textContent =
          "Message could not be sent. Please try again.";

      } finally {
        if (button) {
          button.disabled = false;
          button.textContent = "SEND MESSAGE";
        }
      }
    });
  }
})();




