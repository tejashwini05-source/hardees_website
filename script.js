const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.navigation');

function closeNavigation() {
  nav.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Open navigation');
}
toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeNavigation));
const yearLabel = document.getElementById('year');
if (yearLabel) yearLabel.textContent = new Date().getFullYear();

// Team login modal
const modal = document.getElementById('login-modal');
const closeModal = () => {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
};
document.querySelectorAll('[data-open-login]').forEach(trigger => trigger.addEventListener('click', event => {
  event.preventDefault();
  closeNavigation();
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.getElementById('login-email').focus();
}));
document.querySelector('.modal-close').addEventListener('click', closeModal);
modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });

// Offers card takes visitors directly to the menu items.
const offersCard = document.querySelector('.offers-card');
const goToMenuItems = () => document.getElementById('menu-grid').scrollIntoView({behavior:'smooth', block:'start'});
offersCard.addEventListener('click', goToMenuItems);
offersCard.addEventListener('keydown', event => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    goToMenuItems();
  }
});

// Expand/collapse additional menu cards.
const viewMoreButton = document.getElementById('view-more');
if (viewMoreButton) {
  viewMoreButton.addEventListener('click', event => {
    const extras = document.querySelectorAll('.extra-menu');
    const showing = event.currentTarget.getAttribute('aria-expanded') === 'true';
    extras.forEach(item => item.classList.toggle('hidden', showing));
    event.currentTarget.setAttribute('aria-expanded', String(!showing));
    event.currentTarget.textContent = showing ? 'VIEW MORE' : 'VIEW LESS';
  });
}

// The welcome hero starts directly with the burger-making video (no opening photo/modal).
const heroVideo = document.querySelector('.hero-video');
if (heroVideo) {
  const startHeroVideo = () => {
    const playback = heroVideo.play();
    if (playback && typeof playback.catch === 'function') playback.catch(() => {});
  };
  if (heroVideo.readyState >= 2) startHeroVideo();
  else heroVideo.addEventListener('canplay', startHeroVideo, { once: true });
}

// Unified gallery viewer: burger video is item 1, followed by the existing photos.
const galleryImages = Array.from(document.querySelectorAll('.gallery-photo img'));
const galleryVideoButton = document.querySelector('.gallery-video');
const galleryTileVideo = galleryVideoButton?.querySelector('video');
const lightbox = document.getElementById('gallery-lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxVideo = document.getElementById('lightbox-video');
const lightboxCount = document.getElementById('lightbox-count');
let activeGalleryItem = 0;

function showGalleryItem(index) {
  const itemCount = galleryImages.length + 1;
  activeGalleryItem = (index + itemCount) % itemCount;
  if (activeGalleryItem === 0) {
    lightboxImage.hidden = true;
    lightboxVideo.hidden = false;
    lightboxVideo.currentTime = 0;
    const playback = lightboxVideo.play();
    if (playback && typeof playback.catch === 'function') playback.catch(() => {});
  } else {
    lightboxVideo.pause();
    lightboxVideo.hidden = true;
    lightboxImage.hidden = false;
    const source = galleryImages[activeGalleryItem - 1];
    lightboxImage.src = source.src;
    lightboxImage.alt = source.alt;
  }
  lightboxCount.textContent = `${activeGalleryItem + 1} / ${itemCount}`;
}
function openGalleryItem(index) {
  showGalleryItem(index);
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closePhoto() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxVideo.pause();
  document.body.style.overflow = '';
}
galleryVideoButton?.addEventListener('click', () => openGalleryItem(0));
document.querySelectorAll('.gallery-photo').forEach(button => {
  button.addEventListener('click', () => openGalleryItem(Number(button.dataset.galleryIndex) + 1));
});
document.querySelector('.lightbox-prev').addEventListener('click', () => showGalleryItem(activeGalleryItem - 1));
document.querySelector('.lightbox-next').addEventListener('click', () => showGalleryItem(activeGalleryItem + 1));
document.querySelector('.lightbox-close').addEventListener('click', closePhoto);
lightbox.addEventListener('click', event => { if (event.target === lightbox) closePhoto(); });

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeModal();
    closePhoto();
    closeNavigation();
    closeMenuItem();
  }
  if (lightbox.classList.contains('open') && event.key === 'ArrowRight') showGalleryItem(activeGalleryItem + 1);
  if (lightbox.classList.contains('open') && event.key === 'ArrowLeft') showGalleryItem(activeGalleryItem - 1);
});

// This is a front-end demo form. Real staff/admin authentication must be connected server-side.
document.getElementById('login-form').addEventListener('submit', event => {
  event.preventDefault();
  alert('Login form is ready for your staff/admin authentication backend.');
});

// Click a menu item to view its larger photo and full details in a popup.
const menuItemModal = document.getElementById('menu-item-modal');
const menuItemImage = document.getElementById('menu-item-image');
const menuItemTitle = document.getElementById('menu-item-title');
const menuItemDescription = document.getElementById('menu-item-description');
const menuItemPrice = document.getElementById('menu-item-price');
const closeMenuItem = () => {
  if (!menuItemModal) return;
  menuItemModal.classList.remove('open');
  menuItemModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
};
const openMenuItem = card => {
  if (!menuItemModal || !card) return;
  const photo = card.querySelector('.food-photo');
  const title = card.querySelector('h3');
  const description = card.querySelector('.menu-card-copy p');
  const price = card.querySelector('.menu-price');
  menuItemImage.src = photo ? photo.currentSrc || photo.src : '';
  menuItemImage.alt = photo ? photo.alt : (title ? title.textContent.trim() : 'Menu item');
  menuItemTitle.textContent = title ? title.textContent.trim() : 'Menu item';
  menuItemDescription.textContent = description ? description.textContent.trim() : '';
  menuItemPrice.textContent = price ? price.textContent.trim() : '';
  menuItemModal.classList.add('open');
  menuItemModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  menuItemModal.querySelector('.menu-item-close').focus();
};
document.querySelectorAll('.menu-card').forEach(card => {
  card.addEventListener('click', () => openMenuItem(card));
  card.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openMenuItem(card);
    }
  });
});
if (menuItemModal) {
  menuItemModal.querySelector('.menu-item-close').addEventListener('click', closeMenuItem);
  menuItemModal.addEventListener('click', event => {
    if (event.target === menuItemModal) closeMenuItem();
  });
}




// Play the promotional video automatically when the website opens.
const videoAdPopup = document.getElementById('video-ad-popup');
const videoAdPlayer = document.getElementById('video-ad-player');
const videoAdSound = document.getElementById('video-ad-sound');
const closeVideoAd = () => {
  if (!videoAdPopup) return;
  videoAdPopup.classList.remove('open');
  videoAdPopup.setAttribute('aria-hidden', 'true');
  videoAdPlayer.pause();
  document.body.style.overflow = '';
};
if (videoAdPopup && videoAdPlayer) {
  videoAdPopup.classList.add('open');
  videoAdPopup.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  const adPlayback = videoAdPlayer.play();
  if (adPlayback && typeof adPlayback.catch === 'function') adPlayback.catch(() => {});
  document.getElementById('video-ad-close').addEventListener('click', closeVideoAd);
  videoAdPopup.addEventListener('click', event => { if (event.target === videoAdPopup) closeVideoAd(); });
  videoAdSound.addEventListener('click', () => {
    videoAdPlayer.muted = !videoAdPlayer.muted;
    videoAdSound.textContent = videoAdPlayer.muted ? '🔇' : '🔊';
    videoAdSound.setAttribute('aria-label', videoAdPlayer.muted ? 'Turn sound on' : 'Turn sound off');
    videoAdSound.setAttribute('aria-pressed', String(!videoAdPlayer.muted));
    if (!videoAdPlayer.paused) return;
    const playback = videoAdPlayer.play();
    if (playback && typeof playback.catch === 'function') playback.catch(() => {});
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeVideoAd(); });
}
