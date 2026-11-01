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

  // 4. Scroll Autoplay Video Reels & Sound Controller (Lướt tới tự động Play & Tự bật tiếng)
  const autoPlayVideos = document.querySelectorAll('.scroll-autoplay-video');
  const videoWrappers = document.querySelectorAll('.video-reel-wrapper');

  if (autoPlayVideos.length > 0) {
    // Cập nhật giao diện nút âm thanh
    const updateSoundBtnUI = (video, isMuted) => {
      const wrapper = video.closest('.video-reel-wrapper');
      if (!wrapper) return;
      const soundBtn = wrapper.querySelector('.video-sound-btn');
      if (!soundBtn) return;
      const iconMuted = soundBtn.querySelector('.sound-icon-muted');
      const iconUnmuted = soundBtn.querySelector('.sound-icon-unmuted');
      const btnText = soundBtn.querySelector('.sound-btn-text');

      if (isMuted) {
        if (iconMuted) iconMuted.style.display = 'block';
        if (iconUnmuted) iconUnmuted.style.display = 'none';
        if (btnText) btnText.textContent = 'Bật tiếng';
        soundBtn.classList.remove('is-playing-sound');
      } else {
        if (iconMuted) iconMuted.style.display = 'none';
        if (iconUnmuted) iconUnmuted.style.display = 'block';
        if (btnText) btnText.textContent = 'Tắt tiếng';
        soundBtn.classList.add('is-playing-sound');
      }
    };

    // Hàm phát video có tiếng (Tự động tắt các video khác để không bị lẫn tiếng)
    const playVideoWithSound = (video) => {
      // Tắt tiếng và tạm dừng các video khác
      autoPlayVideos.forEach(other => {
        if (other !== video) {
          if (!other.paused) other.pause();
          other.muted = true;
          updateSoundBtnUI(other, true);
        }
      });

      // Tự động bật tiếng và phát
      video.muted = false;
      video.volume = 1.0;

      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          updateSoundBtnUI(video, false);
        }).catch(() => {
          // Nếu chính sách trình duyệt yêu cầu tương tác trước khi unmuted:
          // Phát tạm muted và tự động bật tiếng ngay khi người dùng chạm hoặc lướt tiếp
          video.muted = true;
          video.play().catch(() => {});
          updateSoundBtnUI(video, true);

          // Nếu trình duyệt yêu cầu tương tác trước khi unmuted:
          // Lưu cờ và tự động bật tiếng ngay khi người dùng chạm hoặc click màn hình
          const autoUnmuteOnGesture = () => {
            if (!video.paused && video.muted) {
              video.muted = false;
              video.volume = 1.0;
              updateSoundBtnUI(video, false);
            }
            window.removeEventListener('click', autoUnmuteOnGesture);
            window.removeEventListener('touchstart', autoUnmuteOnGesture);
          };

          window.addEventListener('click', autoUnmuteOnGesture, { once: true, passive: true });
          window.addEventListener('touchstart', autoUnmuteOnGesture, { once: true, passive: true });
        });
      }
    };

    // Tự động phát khi cuộn vào tầm mắt, tạm dừng khi cuộn ra ngoài
    let currentlyActiveVideo = null;
    const videoObserverOptions = {
      root: null,
      rootMargin: '0px 0px -5% 0px',
      threshold: 0.3
    };

    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const video = entry.target;
        if (entry.isIntersecting) {
          currentlyActiveVideo = video;
          playVideoWithSound(video);
        } else {
          if (currentlyActiveVideo === video) {
            currentlyActiveVideo = null;
          }
          if (!video.paused) {
            video.pause();
          }
          video.muted = true;
          updateSoundBtnUI(video, true);
        }
      });
    }, videoObserverOptions);

    autoPlayVideos.forEach(vid => {
      videoObserver.observe(vid);
    });

    // Mở khóa âm thanh khi người dùng chạm màn hình lần đầu (100% không dùng scroll event để chống giật)
    const unlockGlobalAudio = () => {
      if (currentlyActiveVideo && currentlyActiveVideo.muted) {
        currentlyActiveVideo.muted = false;
        currentlyActiveVideo.volume = 1.0;
        updateSoundBtnUI(currentlyActiveVideo, false);
      }
    };
    window.addEventListener('touchstart', unlockGlobalAudio, { passive: true, once: true });
    window.addEventListener('click', unlockGlobalAudio, { passive: true, once: true });

    // Xử lý nút bấm thủ công bật/tắt âm thanh
    videoWrappers.forEach(wrapper => {
      const video = wrapper.querySelector('.scroll-autoplay-video');
      const soundBtn = wrapper.querySelector('.video-sound-btn');

      if (video && soundBtn) {
        soundBtn.addEventListener('click', (e) => {
          e.stopPropagation();

          video.muted = !video.muted;
          if (!video.muted) {
            video.volume = 1.0;
            if (video.paused) video.play().catch(() => {});
          }
          updateSoundBtnUI(video, video.muted);
        });

        // Click vào khung video để Play / Pause
        wrapper.addEventListener('click', () => {
          if (video.paused) {
            playVideoWithSound(video);
          } else {
            video.pause();
          }
        });
      }
    });
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

  // 11. Typewriter Running Text Animation (Hiệu ứng gõ chữ thị giác mượt mà, không tiếng ồn)
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
      const speed = 22; // Tốc độ gõ chữ mượt mà, êm ái

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
