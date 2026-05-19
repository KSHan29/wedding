const weddingDate = new Date("2026-11-15T19:00:00+08:00");
const countdown = document.querySelector("[data-countdown]");
const responsiveVideo = document.querySelector("[data-youtube-video]");
const videoPoster = document.querySelector("[data-video-poster]");
const videoFrame = document.querySelector("[data-video-frame]");
const playToggle = document.querySelector(".play-toggle");
const hero = document.querySelector(".hero");

function detectMobileDevice() {
  const userAgent = navigator.userAgent || "";
  const platform = navigator.platform || "";
  const isTouchMac =
    /Macintosh/i.test(userAgent) &&
    /Mac/i.test(platform) &&
    navigator.maxTouchPoints > 1;

  return /Android|iPhone|iPad|iPod/i.test(userAgent) || isTouchMac;
}

const isMobileDevice = detectMobileDevice();
document.documentElement.classList.toggle("is-mobile-device", isMobileDevice);

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

function getActiveVideoConfig() {
  if (!responsiveVideo) return {};

  return isMobileDevice
    ? {
        embed: responsiveVideo.dataset.mobileEmbed,
        poster: responsiveVideo.dataset.mobilePoster,
      }
    : {
        embed: responsiveVideo.dataset.desktopEmbed,
        poster: responsiveVideo.dataset.desktopPoster,
      };
}

function resetVideoPreview() {
  if (!responsiveVideo || !videoPoster || !videoFrame) return;

  const { poster } = getActiveVideoConfig();
  if (poster && videoPoster.getAttribute("src") !== poster) {
    videoPoster.src = poster;
  }

  videoFrame.replaceChildren();
  playToggle?.classList.remove("is-hidden");
  hero?.classList.remove("is-video-playing");
}

function playResponsiveVideo() {
  if (!videoFrame) return;

  const { embed } = getActiveVideoConfig();
  if (!embed) return;

  const separator = embed.includes("?") ? "&" : "?";
  const iframe = document.createElement("iframe");
  iframe.src = `${embed}${separator}autoplay=1&rel=0`;
  iframe.title = "YouTube video player";
  iframe.allow =
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  iframe.referrerPolicy = "strict-origin-when-cross-origin";
  iframe.allowFullscreen = true;

  videoFrame.replaceChildren(iframe);
  playToggle?.classList.add("is-hidden");
  hero?.classList.add("is-video-playing");
}

function initVideoControls() {
  if (!responsiveVideo || !playToggle) return;

  resetVideoPreview();
  playToggle.addEventListener("click", playResponsiveVideo);
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
initVideoControls();
initRsvpFormFallback();
