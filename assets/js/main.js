document.addEventListener('DOMContentLoaded', () => {
  // 0. Grand Stage Curtain Reveal (Tấm màn kéo sân khấu khai màn khi vào web)
  const stageCurtain = document.getElementById('stageCurtain');
  if (stageCurtain) {
    document.body.classList.add('curtain-locked');

    let curtainOpened = false;
    const openCurtain = () => {
      if (curtainOpened) return;
      curtainOpened = true;

      stageCurtain.classList.add('curtain-open');
      document.body.classList.remove('curtain-locked');
      document.body.classList.add('curtain-revealed');

      // Kích hoạt hiệu ứng Fade-in Hero khi cái cửa/rèm mở ra
      const heroSection = document.getElementById('hero');
      if (heroSection) {
        heroSection.classList.add('hero-in-view');
      }

      // Kích hoạt Fade-in cho Quote lời ngỏ MC khi mở cửa (nếu thấy) hoặc khi cuộn tới
      setTimeout(() => {
        initQuoteReveal();
      }, 550);

      // Sau khi rèm mở hoàn tất (1.6s), ẩn hoàn toàn
      setTimeout(() => {
        stageCurtain.classList.add('curtain-hidden');
      }, 1650);
    };

    // Tự động mở sau 850ms để người xem chiêm ngưỡng màn khai mạc
    const autoOpenTimer = setTimeout(openCurtain, 850);

    // Người dùng chạm hoặc click bất cứ đâu -> Mở màn ngay lập tức
    stageCurtain.addEventListener('click', () => {
      clearTimeout(autoOpenTimer);
      openCurtain();
    });
  }

  // 0.1 Ensure Header is removed from DOM (if cached)
  document.querySelectorAll('header, .header-nav, #topNav').forEach(el => el.remove());

  // 1. Scroll To Top Button (Tối ưu rAF chống giật lag khi cuộn)
  const scrollToTopBtn = document.getElementById('scrollToTopBtn');
  if (scrollToTopBtn) {
    let scrollTicking = false;
    window.addEventListener('scroll', () => {
      if (!scrollTicking) {
        requestAnimationFrame(() => {
          if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('visible');
          } else {
            scrollToTopBtn.classList.remove('visible');
          }
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    }, { passive: true });

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

  // 4. Lightbox Modal for Gallery & Event Photos
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const zoomableElements = document.querySelectorAll('[data-zoom]');

  zoomableElements.forEach(item => {
    item.addEventListener('click', () => {
      const src = (item.dataset.zoom || '').trim() || (item.querySelector('img')?.getAttribute('src') || '').trim();
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

  // 9. Milestone Stats Animation (Kích hoạt nhảy số khi cuộn tới khối Chỉ số & Ngoại hình)
  const statsContainer = document.querySelector('.body-stats-card') || document.querySelector('.stats-numbers-grid');
  if (statsContainer) {
    const statBoxes = statsContainer.querySelectorAll('.stat-box');
    const counters = statsContainer.querySelectorAll('[data-counter]');
    let statsDone = false;

    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsDone) {
          statsDone = true;
          statBoxes.forEach(box => box.classList.add('in-view'));
          counters.forEach(counter => animateCounter(counter));
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px 40px 0px'
    });

    statsObserver.observe(statsContainer);
  }

  // 10. General Scroll Reveal (Xuất hiện 1 lần ổn định, loại bỏ hoàn toàn giật nảy)
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view', 'is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // 11. Intro Quote & Signature Fade-in khi mở cửa / cuộn tới
  function initQuoteReveal() {
    const quoteBox = document.querySelector('.intro-quote-box');
    if (!quoteBox) return;

    let quoteTriggered = false;
    const triggerQuote = () => {
      if (quoteTriggered) return;
      quoteTriggered = true;
      quoteBox.classList.add('quote-revealed', 'in-view', 'is-revealed');
    };

    // Kiểm tra xem vị trí hiện tại có đang nằm trong tầm mắt người xem không
    const rect = quoteBox.getBoundingClientRect();
    const inViewNow = rect.top < window.innerHeight - 50 && rect.bottom > 50;

    if (inViewNow) {
      triggerQuote();
    } else {
      // Khi người dùng cuộn tới thì kích hoạt hiệu ứng Fade-in
      const quoteObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            triggerQuote();
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      });
      quoteObserver.observe(quoteBox);
    }
  }

  // Khởi tạo ngay nếu không có rèm sân khấu
  if (!stageCurtain) {
    initQuoteReveal();
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


  // ==========================================================================
  // 12. MARQUEE IMAGE SLIDERS (Băng chuyền ảnh tự động chạy liên tục 100%)
  //     data-direction="right" => chạy từ trái sang phải
  //     data-direction="left"  => chạy từ phải sang trái
  // ==========================================================================
  function initMarqueeSliders() {
    const carousels = document.querySelectorAll('.insta-carousel');
    if (!carousels.length) return;

    const lbModal = document.getElementById('lightboxModal');
    const lbImg = document.getElementById('lightboxImg');
    const MIN_ITEMS_PER_GROUP = 8;
    const SECONDS_PER_ITEM = 4.0;

    carousels.forEach((carousel, i) => {
      const sources = Array.from(carousel.querySelectorAll('.insta-slide img')).map(img => ({
        src: img.getAttribute('src'),
        alt: img.getAttribute('alt') || ''
      }));
      if (!sources.length) return;

      const direction = carousel.dataset.direction || (i % 2 === 0 ? 'right' : 'left');

      // Lặp ảnh cho đủ dài để băng chuyền phủ kín khung hình
      const groupItems = [];
      while (groupItems.length < Math.max(MIN_ITEMS_PER_GROUP, sources.length)) {
        groupItems.push(...sources);
      }

      const track = document.createElement('div');
      track.className = 'insta-marquee-track';

      // 2 nhóm giống hệt nhau => loop liền mạch (dịch chuyển 50%)
      for (let g = 0; g < 2; g++) {
        const group = document.createElement('div');
        group.className = 'insta-marquee-group';
        if (g === 1) group.setAttribute('aria-hidden', 'true');

        groupItems.forEach(item => {
          const figure = document.createElement('div');
          figure.className = 'insta-marquee-item';
          const img = document.createElement('img');
          img.src = item.src;
          img.alt = g === 0 ? item.alt : '';
          img.decoding = 'async';
          img.loading = 'lazy';
          img.draggable = false;
          figure.appendChild(img);

          if (lbModal && lbImg) {
            figure.addEventListener('click', () => {
              lbImg.src = item.src;
              lbModal.classList.add('active');
            });
          }
          group.appendChild(figure);
        });
        track.appendChild(group);
      }

      const durationSec = Math.round(groupItems.length * SECONDS_PER_ITEM);
      carousel.innerHTML = '';
      carousel.classList.add('insta-marquee', direction === 'right' ? 'marquee-to-right' : 'marquee-to-left');
      carousel.style.setProperty('--marquee-duration', durationSec + 's');
      carousel.appendChild(track);
    });
  }

  // Khởi chạy Marquee Sliders
  initMarqueeSliders();

  // ==========================================================================
  // 14. VIDEO PLAYLIST PORTFOLIO (Chuẩn Video HTML5, Nút Play/Pause ở giữa video)
  // ==========================================================================
  function initVideoPlaylist() {
    const card = document.querySelector('[data-video-playlist]');
    if (!card) return;

    const stage = card.querySelector('.vp-stage');
    const video = card.querySelector('.vp-video');
    const centerBtn = stage ? stage.querySelector('.vp-center-btn') : null;
    const backdrop = card.querySelector('.vp-backdrop');
    const titleEl = card.querySelector('.vp-now-title');
    const items = card.querySelectorAll('.vp-item');

    let currentIndex = 0;
    let controlsTimer = null;

    function showControlsBriefly() {
      if (!stage) return;
      stage.classList.add('show-controls');
      clearTimeout(controlsTimer);
      controlsTimer = setTimeout(() => {
        if (video && !video.paused) {
          stage.classList.remove('show-controls');
        }
      }, 2200);
    }

    function togglePlayPause() {
      if (!video) return;
      if (video.paused) {
        video.play().catch(err => {
          console.warn('Playback error:', err);
          if (stage) {
            stage.classList.remove('is-playing');
            stage.classList.add('is-paused');
          }
        });
      } else {
        video.pause();
      }
    }

    // Tương tác nút Play / Pause ở giữa màn hình video
    if (centerBtn) {
      centerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        togglePlayPause();
      });
    }

    // Hiện nút điều khiển khi tương tác chuột hoặc chạm trên video
    if (stage) {
      stage.addEventListener('mousemove', () => {
        if (video && !video.paused) {
          showControlsBriefly();
        }
      });

      stage.addEventListener('pointerdown', (e) => {
        if (e.target.closest('.vp-center-btn') || e.target.closest('.vp-list')) return;
        if (video && !video.paused) {
          showControlsBriefly();
        }
      });
    }

    function switchVideo(index, autoPlay = true) {
      if (index < 0 || index >= items.length) return;
      currentIndex = index;

      items.forEach((item, idx) => {
        item.classList.toggle('is-active', idx === currentIndex);
      });

      const activeItem = items[currentIndex];
      const src = activeItem.dataset.src;
      const poster = activeItem.dataset.poster;
      const title = activeItem.dataset.title;
      const orientation = activeItem.dataset.orientation || 'portrait';

      // Chuyển orientation ngay lập tức để tỷ lệ stage co giãn mượt mà
      stage.classList.remove('is-portrait', 'is-landscape');
      stage.classList.add(`is-${orientation}`);

      if (titleEl) titleEl.textContent = title;
      if (backdrop) backdrop.style.backgroundImage = `url('${poster}')`;
      video.poster = poster;
      video.src = src;
      video.load();

      // Kiểm tra chính xác tỷ lệ video sau khi load metadata
      video.addEventListener('loadedmetadata', () => {
        const isPort = video.videoHeight > video.videoWidth;
        stage.classList.toggle('is-portrait', isPort);
        stage.classList.toggle('is-landscape', !isPort);
      }, { once: true });

      if (autoPlay) {
        video.play().catch(err => {
          console.warn('Playback notice:', err);
          if (stage) {
            stage.classList.remove('is-playing');
            stage.classList.add('is-paused');
          }
        });
      }
    }

    items.forEach((item, index) => {
      item.addEventListener('click', () => {
        switchVideo(index, true);
      });
    });

    if (video) {
      // Khi video phát: ẩn nút Play, chuẩn bị nút Pause
      video.addEventListener('play', () => {
        if (stage) {
          stage.classList.remove('is-paused');
          stage.classList.add('is-playing');
          showControlsBriefly();
        }
      });

      // Khi video dừng: hiện nút Play nổi bật ở trung tâm
      video.addEventListener('pause', () => {
        if (stage) {
          stage.classList.remove('is-playing', 'show-controls');
          stage.classList.add('is-paused');
        }
      });

      // Khi video kết thúc, tự động chuyển tiếp sang video kế tiếp
      video.addEventListener('ended', () => {
        const nextIndex = (currentIndex + 1) % items.length;
        switchVideo(nextIndex, true);
      });
    }

    // Thiết lập orientation & trạng thái ban đầu
    const initialItem = items[currentIndex];
    if (initialItem && stage) {
      const initOrient = initialItem.dataset.orientation || 'landscape';
      stage.classList.remove('is-portrait', 'is-landscape');
      stage.classList.add(`is-${initOrient}`, 'is-paused');
    }

    // Tự động tạm dừng video khi cuộn ra ngoài màn hình (tiết kiệm GPU & CPU)
    if ('IntersectionObserver' in window) {
      const videoCardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting && video && !video.paused) {
            video.pause();
          }
        });
      }, { threshold: 0.1 });
      videoCardObserver.observe(card);
    }
  }

  // Khởi chạy Video Playlist Portfolio
  initVideoPlaylist();

  // ==========================================================================
  // 15. FEEDBACK CAROUSEL (Tự động lướt mượt mà, vuốt chạm, kéo chuột, lightbox)
  // ==========================================================================
  function initFeedbackCarousel() {
    const wrapper = document.querySelector('.feedback-carousel-wrapper');
    if (!wrapper) return;

    const track = wrapper.querySelector('.feedback-track');
    const prevBtn = wrapper.querySelector('.fb-prev');
    const nextBtn = wrapper.querySelector('.fb-next');
    if (!track) return;

    const AUTO_INTERVAL = 3200; // Tự động lướt sau mỗi 3.2s
    const RESUME_DELAY = 4000;  // Chờ 4s sau khi người dùng chạm/thao tác trước khi tự lướt tiếp
    let autoTimer = null;
    let resumeTimeout = null;
    let isIntersecting = false;
    let isInteracting = false;

    function getStep() {
      const firstSlide = track.querySelector('.feedback-slide');
      return (firstSlide ? firstSlide.offsetWidth : 280) + 20;
    }

    // Tự động lướt tiến tới ảnh tiếp theo
    function slideNext() {
      const step = getStep();
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (track.scrollLeft >= maxScroll - 20) {
        // Đã đến ảnh cuối cùng -> mượt mà lướt về đầu
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        track.scrollBy({ left: step, behavior: 'smooth' });
      }
    }

    // Tự động lướt lùi lại ảnh trước
    function slidePrev() {
      const step = getStep();
      if (track.scrollLeft <= 20) {
        const maxScroll = track.scrollWidth - track.clientWidth;
        track.scrollTo({ left: maxScroll, behavior: 'smooth' });
      } else {
        track.scrollBy({ left: -step, behavior: 'smooth' });
      }
    }

    function startAutoSlide() {
      stopAutoSlide();
      if (!isIntersecting || isInteracting) return;
      autoTimer = setInterval(() => {
        // Nếu modal lightbox đang mở thì tạm dừng
        const lbModal = document.getElementById('lightboxModal');
        if (lbModal && lbModal.classList.contains('active')) return;

        if (!isInteracting && isIntersecting) {
          slideNext();
        }
      }, AUTO_INTERVAL);
    }

    function stopAutoSlide() {
      if (autoTimer) {
        clearInterval(autoTimer);
        autoTimer = null;
      }
    }

    function pauseAndResumeLater(delay = RESUME_DELAY) {
      stopAutoSlide();
      if (resumeTimeout) clearTimeout(resumeTimeout);
      resumeTimeout = setTimeout(() => {
        if (!isInteracting && isIntersecting) {
          startAutoSlide();
        }
      }, delay);
    }

    isIntersecting = true;
    startAutoSlide();

    // Kích hoạt tự động lướt khi section Feedback hiển thị trên khung nhìn màn hình
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isIntersecting = entry.isIntersecting;
          if (isIntersecting) {
            startAutoSlide();
          } else {
            stopAutoSlide();
          }
        });
      }, { rootMargin: '100px 0px 100px 0px', threshold: 0 });
      observer.observe(wrapper);
    }

    // Dừng khi ẩn tab trình duyệt, chạy lại khi quay lại trang
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopAutoSlide();
      } else if (isIntersecting && !isInteracting) {
        startAutoSlide();
      }
    });

    // Tạm dừng khi di chuột vào (Desktop Hover)
    wrapper.addEventListener('mouseenter', () => {
      isInteracting = true;
      stopAutoSlide();
    });

    wrapper.addEventListener('mouseleave', () => {
      isInteracting = false;
      pauseAndResumeLater(1500);
    });

    // Tạm dừng khi chạm vuốt trên màn hình điện thoại (Mobile Touch)
    track.addEventListener('touchstart', () => {
      isInteracting = true;
      stopAutoSlide();
    }, { passive: true });

    track.addEventListener('touchend', () => {
      isInteracting = false;
      pauseAndResumeLater(RESUME_DELAY);
    }, { passive: true });

    // Điều hướng bằng nút bấm mũi tên trái / phải
    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        slidePrev();
        pauseAndResumeLater(RESUME_DELAY);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        slideNext();
        pauseAndResumeLater(RESUME_DELAY);
      });
    }

    // Kéo trượt bằng chuột trên máy tính (Mouse Drag-to-Scroll)
    let isDown = false;
    let startX = 0;
    let scrollLeftPos = 0;
    let hasDragged = false;

    track.addEventListener('mousedown', (e) => {
      // Chỉ kích hoạt khi nhấn chuột trái
      if (e.button !== 0) return;
      isDown = true;
      hasDragged = false;
      isInteracting = true;
      stopAutoSlide();
      track.classList.add('is-dragging');
      startX = e.pageX - track.offsetLeft;
      scrollLeftPos = track.scrollLeft;
    });

    window.addEventListener('mouseup', () => {
      if (!isDown) return;
      isDown = false;
      track.classList.remove('is-dragging');
      isInteracting = false;
      pauseAndResumeLater(RESUME_DELAY);
      // Reset flag sau một chu kỳ nhỏ để tránh kích hoạt click mở lightbox nhầm
      setTimeout(() => {
        hasDragged = false;
      }, 60);
    });

    let dragTicking = false;
    track.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      const walk = (x - startX) * 1.5;
      if (Math.abs(walk) > 6) {
        hasDragged = true;
      }
      if (!dragTicking) {
        requestAnimationFrame(() => {
          track.scrollLeft = scrollLeftPos - walk;
          dragTicking = false;
        });
        dragTicking = true;
      }
    });

    // Chặn sự kiện click mở lightbox nếu người dùng vừa thực hiện thao tác kéo chuột
    track.addEventListener(
      'click',
      (e) => {
        if (hasDragged) {
          e.preventDefault();
          e.stopPropagation();
        }
      },
      true
    );
  }

  // Khởi chạy Feedback Carousel
  initFeedbackCarousel();

});