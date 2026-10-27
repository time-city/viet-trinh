document.addEventListener('DOMContentLoaded', () => {
  // 1. Header scroll effect
  const headerNav = document.querySelector('.header-nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      headerNav.classList.add('scrolled');
    } else {
      headerNav.classList.remove('scrolled');
    }
  });

  // 2. Mobile Nav Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      mobileToggle.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
    });

    // Close menu when clicking any nav item
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileToggle.textContent = '☰';
      });
    });
  }

  // 3. Hosting Styles Carousel Controls
  const trackWrapper = document.querySelector('.styles-track-wrapper');
  const prevBtn = document.querySelector('.carousel-btn.prev-btn');
  const nextBtn = document.querySelector('.carousel-btn.next-btn');

  if (trackWrapper && prevBtn && nextBtn) {
    const scrollAmount = 280;
    prevBtn.addEventListener('click', () => {
      trackWrapper.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', () => {
      trackWrapper.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
  }

  // 4. Interactive Video Playlist Switcher
  const playlistItems = document.querySelectorAll('.playlist-item');
  const activeVideoTitle = document.querySelector('.active-video-title');
  const activeVideoDuration = document.querySelector('.active-video-duration');
  const mainVideoFrame = document.querySelector('#mainVideoPlayer');
  const mainVideoPoster = document.querySelector('.video-custom-poster');

  if (playlistItems.length > 0) {
    playlistItems.forEach(item => {
      item.addEventListener('click', () => {
        playlistItems.forEach(el => el.classList.remove('active'));
        item.classList.add('active');

        const title = item.dataset.title;
        const duration = item.dataset.duration;
        const videoSrc = item.dataset.video;
        const posterSrc = item.dataset.poster;

        if (activeVideoTitle) activeVideoTitle.textContent = title;
        if (activeVideoDuration) activeVideoDuration.textContent = duration;
        
        if (mainVideoPoster && posterSrc) {
          mainVideoPoster.querySelector('img').src = posterSrc;
          mainVideoPoster.style.display = 'block';
        }
      });
    });

    if (mainVideoPoster) {
      mainVideoPoster.addEventListener('click', () => {
        mainVideoPoster.style.display = 'none';
        // Play video simulation or YouTube embed trigger
        alert('Phát video: Tính năng sẵn sàng kết nối video YouTube hoặc MP4 của MC.');
      });
    }
  }

  // 5. Lightbox Modal for Gallery & Event Photos
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const zoomableElements = document.querySelectorAll('[data-zoom]');

  zoomableElements.forEach(item => {
    item.addEventListener('click', () => {
      const src = item.dataset.zoom || item.querySelector('img')?.src;
      if (src && lightboxImg && lightboxModal) {
        lightboxImg.src = src;
        lightboxModal.classList.add('active');
      }
    });
  });

  if (lightboxClose && lightboxModal) {
    lightboxClose.addEventListener('click', () => {
      lightboxModal.classList.remove('active');
    });
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        lightboxModal.classList.remove('active');
      }
    });
  }

  // 6. Booking Modal
  const bookingModal = document.getElementById('bookingModal');
  const bookingButtons = document.querySelectorAll('.trigger-booking-modal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const bookingForm = document.getElementById('bookingForm');

  bookingButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (bookingModal) bookingModal.classList.add('active');
    });
  });

  if (modalCloseBtn && bookingModal) {
    modalCloseBtn.addEventListener('click', () => {
      bookingModal.classList.remove('active');
    });
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) {
        bookingModal.classList.remove('active');
      }
    });
  }

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Cảm ơn quý khách! Yêu cầu booking sự kiện đã được ghi nhận. Quản lý MC sẽ liên hệ lại trong vòng 30 phút.');
      bookingModal.classList.remove('active');
      bookingForm.reset();
    });
  }

  // 7. Event Showcase Dots / Pagination Demo
  const pageDots = document.querySelectorAll('.page-dot');
  if (pageDots.length > 0) {
    pageDots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        pageDots.forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        // Smooth feedback
        const eventCard = document.querySelector('.event-showcase-card');
        if (eventCard) {
          eventCard.style.opacity = '0.7';
          setTimeout(() => {
            eventCard.style.opacity = '1';
          }, 200);
        }
      });
    });
  }

});
