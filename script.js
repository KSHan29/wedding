const weddingDate = new Date("2026-11-15T19:00:00+08:00");
const countdown = document.querySelector("[data-countdown]");
const responsiveVideo = document.querySelector("[data-responsive-video]");
const playToggle = document.querySelector(".play-toggle");
const hero = document.querySelector(".hero");
const mobileQuery = window.matchMedia("(max-width: 820px)");

function setText(selector, value) {
  const element = document.querySelector(selector);
  if (!element || element.textContent === value) return;

  element.textContent = value;
  element.classList.remove("is-ticking");
  window.requestAnimationFrame(() => element.classList.add("is-ticking"));
}

function pad(value) {
  return String(value).padStart(2, "0");
}

function updateCountdown() {
  if (!countdown) return;

  const now = new Date();
  const distance = Math.max(0, weddingDate.getTime() - now.getTime());
  const seconds = Math.floor(distance / 1000);
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  setText("[data-days]", String(days).padStart(3, "0"));
  setText("[data-hours]", pad(hours));
  setText("[data-minutes]", pad(minutes));
  setText("[data-seconds]", pad(remainingSeconds));
}

function initReveals() {
  const revealItems = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function setVideoForViewport() {
  if (!responsiveVideo) return;

  const nextSrc = mobileQuery.matches
    ? responsiveVideo.dataset.mobileSrc
    : responsiveVideo.dataset.desktopSrc;

  if (!nextSrc || responsiveVideo.dataset.activeSrc === nextSrc) return;

  const wasPlaying = !responsiveVideo.paused && !responsiveVideo.ended;
  responsiveVideo.dataset.activeSrc = nextSrc;
  responsiveVideo.src = nextSrc;
  responsiveVideo.load();

  if (wasPlaying) {
    responsiveVideo.play().catch(() => {});
  }
}

function initVideoControls() {
  if (!responsiveVideo || !playToggle) return;

  playToggle.addEventListener("click", () => {
    responsiveVideo.play().catch(() => {});
  });

  responsiveVideo.addEventListener("play", () => {
    playToggle.classList.add("is-hidden");
    hero?.classList.add("is-video-playing");
  });

  responsiveVideo.addEventListener("pause", () => {
    playToggle.classList.remove("is-hidden");
    hero?.classList.remove("is-video-playing");
  });

  responsiveVideo.addEventListener("ended", () => {
    playToggle.classList.remove("is-hidden");
    hero?.classList.remove("is-video-playing");
  });

  responsiveVideo.addEventListener("error", () => {
    const fallbackSrc = responsiveVideo.dataset.fallbackSrc;
    if (!fallbackSrc || responsiveVideo.dataset.activeSrc === fallbackSrc) return;

    responsiveVideo.dataset.activeSrc = fallbackSrc;
    responsiveVideo.src = fallbackSrc;
    responsiveVideo.load();
  });
}

function initRsvpFormFallback() {
  const shell = document.querySelector("[data-form-shell]");
  const form = document.querySelector("[data-rsvp-form]");
  const fallback = document.querySelector("[data-rsvp-fallback]");

  if (!shell || !form || !fallback) return;

  let hasLoaded = false;

  function showFallback() {
    if (hasLoaded) return;

    shell.classList.add("is-form-unavailable");
    fallback.hidden = false;
  }

  const fallbackTimer = window.setTimeout(showFallback, 7000);

  form.addEventListener("load", () => {
    hasLoaded = true;
    window.clearTimeout(fallbackTimer);
  });

  form.addEventListener("error", showFallback);
}

updateCountdown();
setInterval(updateCountdown, 1000);
initReveals();
setVideoForViewport();
initVideoControls();
initRsvpFormFallback();

if (typeof mobileQuery.addEventListener === "function") {
  mobileQuery.addEventListener("change", setVideoForViewport);
} else {
  mobileQuery.addListener(setVideoForViewport);
}
