document.addEventListener('DOMContentLoaded', () => {
  // 0. Ensure Header is removed from DOM (if cached)
  document.querySelectorAll('header, .header-nav, #topNav').forEach(el => el.remove());

  // 1. Scroll To Top Button
  const scrollToTopBtn = document.getElementById('scrollToTopBtn');
  if (scrollToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        scrollToTopBtn.classList.add('visible');
      } else {
        scrollToTopBtn.classList.remove('visible');
      }
    });

    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
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

  // 8. Dynamic Number Counter Animation (Nhảy số ấn tượng)
  const easeOutExpo = (x) => {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
  };

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.counter, 10);
    const suffix = el.dataset.suffix || '';
    if (isNaN(target)) return;

    if (el._rafId) {
      cancelAnimationFrame(el._rafId);
      el._rafId = null;
    }

    const duration = target > 100 ? 1900 : (target > 20 ? 1400 : 1200);
    const startTime = performance.now();

    const updateCount = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutExpo(progress);
      const current = Math.floor(eased * target);

      el.textContent = current + suffix;

      if (progress < 1) {
        el._rafId = requestAnimationFrame(updateCount);
      } else {
        el.textContent = target + suffix;
        el.classList.add('count-done');
        setTimeout(() => el.classList.remove('count-done'), 700);
      }
    };

    el._rafId = requestAnimationFrame(updateCount);
  };

  const resetCounter = (el) => {
    if (el._rafId) {
      cancelAnimationFrame(el._rafId);
      el._rafId = null;
    }
    const suffix = el.dataset.suffix || '';
    el.textContent = '0' + suffix;
    el.classList.remove('count-done');
  };

  // 9. Milestone Stats Animation In & Out with Number Jump
  const statsSection = document.querySelector('.section-stats-milestones');
  if (statsSection) {
    const statBoxes = statsSection.querySelectorAll('.stat-box');
    const portrait = statsSection.querySelector('.stats-mc-portrait');
    const counters = statsSection.querySelectorAll('[data-counter]');

    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Animation IN
          if (portrait) portrait.classList.add('in-view');
          statBoxes.forEach(box => box.classList.add('in-view'));
          counters.forEach(counter => animateCounter(counter));
        } else {
          // Animation OUT: Cho phép lặp lại khi cuộn lại
          if (portrait) portrait.classList.remove('in-view');
          statBoxes.forEach(box => box.classList.remove('in-view'));
          counters.forEach(counter => resetCounter(counter));
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    statsObserver.observe(statsSection);
  }

  // 10. General Scroll Reveal (Animation In & Out cho các khối nội dung)
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        } else {
          // Animation OUT khi ra khỏi màn hình
          entry.target.classList.remove('in-view');
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -30px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

});
