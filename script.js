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

// Demo login: production admin permissions must be enforced by a secure backend.
let isMenuAdmin = false;
document.getElementById('login-form').addEventListener('submit', event => {
  event.preventDefault();
  const role = document.getElementById('login-role').value;
  const username = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  if (role === 'admin' && username === 'admin' && password === 'admin123') {
    isMenuAdmin = true;
    document.getElementById('admin-menu-toolbar').classList.remove('hidden');
    document.querySelectorAll('.admin-item-actions').forEach(el => el.classList.remove('hidden'));
    closeModal();
    document.getElementById('login-form').reset();
    alert('Admin mode enabled. You can now add, edit and remove menu items.');
  } else if (role === 'staff') {
    closeModal();
    alert('Staff view enabled. Menu editing is available to Admin only.');
    document.getElementById('login-form').reset();
  } else {
    alert('Invalid admin login. Use the demo admin credentials shown in the login window.');
  }
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





// Category-based menu navigation and admin menu management.
const MENU_CATEGORIES = [
  'All Items', 'Chicken & More Combos', 'Charbroiled Burgers', 'Chicken & More',
  'Beverages', "Biryani's", 'Starters', 'Veg', 'Non Veg',
  'Veg Starters', 'Non-Veg Starters', 'Sides', 'Breakfast', 'Desserts'
];
const categoryList = document.getElementById('menu-category-list');
const categorySelect = document.getElementById('admin-item-category');
const categoryPanel = document.getElementById('menu-category-panel');
const categoryToggle = document.getElementById('category-menu-toggle');
const menuGrid = document.getElementById('menu-grid');
const adminEditor = document.getElementById('admin-item-modal');
const adminForm = document.getElementById('admin-item-form');
let activeMenuCategory = 'All Items';
let editingMenuCard = null;

function guessMenuCategory(title) {
  const t = title.toLowerCase();
  if (/biryani/.test(t)) return "Biryani's";
  if (/combo/.test(t)) return 'Chicken & More Combos';
  if (/veg starter/.test(t)) return 'Veg Starters';
  if (/non.?veg starter/.test(t)) return 'Non-Veg Starters';
  if (/starter/.test(t)) return 'Starters';
  if (/shake|coca-cola|coffee|drink|beverage|tea|juice|water/.test(t)) return 'Beverages';
  if (/pie|cinnamon|dessert|ice cream/.test(t)) return 'Desserts';
  if (/burger|famous star|bacon beast|frisco/.test(t)) return 'Charbroiled Burgers';
  if (/tender|chicken|steak|pork|sausage|bacon/.test(t)) return 'Chicken & More';
  if (/fries|fries|hash|crispy curls|side/.test(t)) return 'Sides';
  if (/biscuit|omelet|breakfast|burrito/.test(t)) return 'Breakfast';
  return 'All Items';
}
function makeCategoryButtons() {
  categoryList.innerHTML = '';
  MENU_CATEGORIES.forEach(category => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'menu-category-button' + (category === activeMenuCategory ? ' active' : '');
    button.textContent = category;
    button.addEventListener('click', () => {
      activeMenuCategory = category;
      filterMenuCards();
      makeCategoryButtons();
      categoryPanel.classList.remove('hidden');
      categoryToggle.setAttribute('aria-expanded', 'true');
    });
    categoryList.appendChild(button);
  });
}
function filterMenuCards() {
  menuGrid.querySelectorAll('.menu-card').forEach(card => {
    const match = activeMenuCategory === 'All Items' || card.dataset.category === activeMenuCategory;
    card.classList.toggle('category-hidden', !match);
  });
}
function addAdminActions(card) {
  if (card.querySelector('.admin-item-actions')) return;
  const actions = document.createElement('div');
  actions.className = 'admin-item-actions hidden';
  const edit = document.createElement('button');
  edit.type = 'button'; edit.textContent = 'EDIT';
  edit.addEventListener('click', event => { event.stopPropagation(); openAdminEditor(card); });
  const remove = document.createElement('button');
  remove.type = 'button'; remove.textContent = 'REMOVE';
  remove.addEventListener('click', event => {
    event.stopPropagation();
    const name = card.querySelector('h3')?.textContent || 'this item';
    if (confirm(`Remove ${name} from the menu?`)) {
      card.remove();
      saveMenuItems();
    }
  });
  actions.append(edit, remove);
  card.querySelector('.menu-card-copy')?.appendChild(actions);
  if (isMenuAdmin) actions.classList.remove('hidden');
}
function saveMenuItems() {
  const items = [...menuGrid.querySelectorAll('.menu-card')].map(card => ({
    name: card.querySelector('h3')?.textContent || '',
    description: card.querySelector('.menu-card-copy p')?.textContent || '',
    price: card.querySelector('.menu-price')?.textContent || '',
    category: card.dataset.category || 'All Items',
    image: card.querySelector('.food-photo')?.getAttribute('src') || 'assets/menu-burger.jpg'
  }));
  localStorage.setItem('hardeesAdminMenuItems', JSON.stringify(items));
}
function createMenuCard(item) {
  const card = document.createElement('article');
  card.className = 'menu-card admin-created-card';
  card.setAttribute('role', 'button'); card.tabIndex = 0; card.setAttribute('aria-haspopup', 'dialog');
  const image = document.createElement('img');
  image.className = 'food-photo'; image.src = item.image || 'assets/menu-burger.jpg'; image.alt = item.name; image.loading = 'lazy';
  const copy = document.createElement('div'); copy.className = 'menu-card-copy';
  const title = document.createElement('h3'); title.textContent = item.name;
  const description = document.createElement('p'); description.textContent = item.description || '';
  const price = document.createElement('strong'); price.className = 'menu-price'; price.textContent = item.price || 'View item details';
  copy.append(title, description, price); card.append(image, copy);
  card.dataset.category = item.category || guessMenuCategory(item.name);
  card.addEventListener('click', () => openMenuItem(card));
  card.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openMenuItem(card); } });
  addAdminActions(card);
  return card;
}
function openAdminEditor(card = null) {
  editingMenuCard = card;
  document.getElementById('admin-item-heading').textContent = card ? 'EDIT MENU ITEM' : 'ADD MENU ITEM';
  document.getElementById('admin-item-name').value = card?.querySelector('h3')?.textContent || '';
  document.getElementById('admin-item-description').value = card?.querySelector('.menu-card-copy p')?.textContent || '';
  document.getElementById('admin-item-price').value = card?.querySelector('.menu-price')?.textContent || '';
  document.getElementById('admin-item-category').value = card?.dataset.category || 'Charbroiled Burgers';
  document.getElementById('admin-item-image').value = card?.querySelector('.food-photo')?.getAttribute('src') || 'assets/menu-burger.jpg';
  adminEditor.classList.add('open'); adminEditor.setAttribute('aria-hidden', 'false');
}
function closeAdminEditor() {
  adminEditor.classList.remove('open'); adminEditor.setAttribute('aria-hidden', 'true');
  editingMenuCard = null;
}
MENU_CATEGORIES.forEach(category => {
  const option = document.createElement('option'); option.value = category; option.textContent = category;
  if (category !== 'All Items') categorySelect.appendChild(option);
});
menuGrid.querySelectorAll('.menu-card').forEach(card => {
  const title = card.querySelector('h3')?.textContent || '';
  card.dataset.category = guessMenuCategory(title);
  addAdminActions(card);
});
// Restore the admin-managed menu on this browser after refresh.
try {
  const savedMenu = JSON.parse(localStorage.getItem('hardeesAdminMenuItems') || 'null');
  if (Array.isArray(savedMenu)) {
    menuGrid.innerHTML = '';
    savedMenu.forEach(item => menuGrid.appendChild(createMenuCard(item)));
  }
} catch (error) {
  console.warn('Saved menu could not be restored.', error);
}
makeCategoryButtons();
categoryToggle.addEventListener('click', () => {
  const open = categoryPanel.classList.toggle('hidden') === false;
  categoryToggle.setAttribute('aria-expanded', String(open));
});
document.getElementById('admin-add-item').addEventListener('click', () => openAdminEditor());
document.querySelector('.admin-editor-close').addEventListener('click', closeAdminEditor);
adminEditor.addEventListener('click', event => { if (event.target === adminEditor) closeAdminEditor(); });
adminForm.addEventListener('submit', event => {
  event.preventDefault();
  if (!isMenuAdmin) return alert('Only an Admin can manage menu items.');
  const item = {
    name: document.getElementById('admin-item-name').value.trim(),
    description: document.getElementById('admin-item-description').value.trim(),
    price: document.getElementById('admin-item-price').value.trim(),
    category: categorySelect.value,
    image: document.getElementById('admin-item-image').value.trim() || 'assets/menu-burger.jpg'
  };
  if (editingMenuCard) {
    const photo = editingMenuCard.querySelector('.food-photo');
    photo.src = item.image; photo.alt = item.name;
    editingMenuCard.querySelector('h3').textContent = item.name;
    editingMenuCard.querySelector('.menu-card-copy p').textContent = item.description;
    editingMenuCard.querySelector('.menu-price').textContent = item.price || 'View item details';
    editingMenuCard.dataset.category = item.category;
  } else {
    menuGrid.appendChild(createMenuCard(item));
  }
  saveMenuItems();
  closeAdminEditor();
  filterMenuCards();
});
document.getElementById('login-role').addEventListener('change', event => {
  document.getElementById('login-title').textContent = event.target.value === 'admin' ? 'ADMIN LOGIN' : 'STAFF LOGIN';
});

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
    videoAdSound.setAttribute('aria-label', videoAdPlayer.muted ? 'Turn sound on' : 'Turn sound off');
    videoAdSound.setAttribute('aria-pressed', String(!videoAdPlayer.muted));
    if (!videoAdPlayer.paused) return;
    const playback = videoAdPlayer.play();
    if (playback && typeof playback.catch === 'function') playback.catch(() => {});
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeVideoAd(); });
}
