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

  // 2. Hero Interactive Subtle Parallax on Desktop
  const heroShowcase = document.querySelector('.hero-cutout-showcase');
  const heroCutoutImg = document.querySelector('.hero-cutout-img');
  const heroBackdrop = document.querySelector('.hero-cutout-backdrop');

  if (heroShowcase && heroCutoutImg && window.matchMedia('(pointer: fine)').matches) {
    let ticking = false;
    let targetX = 0;
    let targetY = 0;

    heroShowcase.addEventListener('mousemove', (e) => {
      const rect = heroShowcase.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = x * 18;
      targetY = y * 18;

      if (!ticking) {
        requestAnimationFrame(() => {
          // Chỉ dịch ngang — giữ chân ảnh luôn dính đáy hero
          heroCutoutImg.style.transform = `translate3d(${targetX}px, 0, 0) scale(1.015)`;
          if (heroBackdrop) {
            heroBackdrop.style.transform = `translate(calc(-50% + ${-targetX * 0.8}px), calc(-50% + ${-targetY * 0.8}px)) scale(1.06)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    });

    heroShowcase.addEventListener('mouseleave', () => {
      heroCutoutImg.style.transform = '';
      if (heroBackdrop) {
        heroBackdrop.style.transform = '';
      }
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

  // 9. Milestone Stats Animation (Kích hoạt 1 lần mượt mà khi cuộn tới, chống giật 100%)
  const statsSection = document.querySelector('.section-stats-milestones');
  if (statsSection) {
    const statBoxes = statsSection.querySelectorAll('.stat-box');
    const portrait = statsSection.querySelector('.stats-mc-portrait');
    const counters = statsSection.querySelectorAll('[data-counter]');
    let statsDone = false;

    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsDone) {
          statsDone = true;
          if (portrait) portrait.classList.add('in-view');
          statBoxes.forEach(box => box.classList.add('in-view'));
          counters.forEach(counter => animateCounter(counter));
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px 40px 0px'
    });

    statsObserver.observe(statsSection);
  }

  // 10. General Scroll Reveal (Xuất hiện 1 lần ổn định, loại bỏ hoàn toàn giật nảy)
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px 60px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // 11. Typewriter Running Text Animation (Hiệu ứng gõ chữ cho lời ngỏ MC)
  const quoteBox = document.querySelector('.intro-quote-box');
  const quoteText = document.querySelector('.quote-text');
  const quoteSign = document.querySelector('.quote-author-sign');

  if (quoteBox && quoteText) {
    const fullText = quoteText.textContent.trim().replace(/\s+/g, ' ');
    quoteText.dataset.fullText = fullText;
    let isTyping = false;
    let isDone = false;

    // Con trỏ nhấp nháy ánh vàng
    const cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    cursor.setAttribute('aria-hidden', 'true');

    const startTyping = () => {
      if (isTyping || isDone) return;

      // Hỗ trợ chế độ giảm chuyển động
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        quoteText.textContent = fullText;
        if (quoteSign) quoteSign.classList.add('sign-visible');
        isDone = true;
        return;
      }

      isTyping = true;
      quoteText.textContent = '';
      quoteText.appendChild(cursor);
      if (quoteSign) quoteSign.classList.remove('sign-visible');

      let charIndex = 0;
      const speed = 20; // 20ms mỗi ký tự: mượt mà, sống động, dễ đọc

      const typeNext = () => {
        if (charIndex < fullText.length) {
          const nextChar = fullText.charAt(charIndex);
          cursor.insertAdjacentText('beforebegin', nextChar);
          charIndex++;
          setTimeout(typeNext, speed);
        } else {
          isTyping = false;
          isDone = true;
          setTimeout(() => {
            cursor.classList.add('cursor-fade');
            if (quoteSign) quoteSign.classList.add('sign-visible');
          }, 350);
        }
      };

      typeNext();
    };

    const quoteObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !isDone) {
          startTyping();
        }
      });
    }, {
      threshold: 0.3
    });

    quoteObserver.observe(quoteBox);
  }

  // 12. Gallery Category Filtering (Lọc lưới ảnh theo chủ đề: BĐS, Gala, Hội thảo, Mẹ & Bé, YEP...)
  const galleryTabs = document.querySelectorAll('.gallery-tab-btn');
  const galleryCells = document.querySelectorAll('.gallery-masonry-grid .gallery-cell');

  if (galleryTabs.length > 0 && galleryCells.length > 0) {
    galleryTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const category = tab.dataset.category;

        // Active tab button state
        galleryTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Filter grid items with staggered animation
        let visibleIndex = 0;
        galleryCells.forEach(cell => {
          const cellCat = cell.dataset.category;
          if (category === 'all' || cellCat === category) {
            cell.classList.remove('is-hidden');
            cell.style.animation = 'none';
            // Trigger reflow for animation restart
            void cell.offsetWidth;
            cell.style.animation = `galleryFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) ${Math.min(visibleIndex * 0.03, 0.3)}s both`;
            visibleIndex++;
          } else {
            cell.classList.add('is-hidden');
          }
        });
      });
    });
  }

});
