/**
 * ============================================================
 * WEBSITE DATA KELOMPOK - JAVASCRIPT LOGIC
 * Mata Kuliah / Pelajaran: Pemrograman Web (Bu Aini)
 * Fitur:
 *  1. Sticky Navbar & Shadow on Scroll
 *  2. Mobile Hamburger Menu Toggle & Auto-Close
 *  3. ScrollSpy (Active Link Indicator based on scroll position)
 *  4. Dark / Light Mode Switcher with LocalStorage
 *  5. Filter Kategori Anggota
 *  6. Modal Pop-up Biodata Detail Anggota
 *  7. Form Kontak Interaktif & Toast Notification
 *  8. Floating Button Back to Top
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. NAVBAR SCROLL EFFECT ---
  const navbar = document.getElementById('navbar');
  const backToTopBtn = document.getElementById('back-to-top');

  const handleWindowScroll = () => {
    const scrollPos = window.scrollY;

    // Tambah shadow & blur saat discroll lebih dari 30px
    if (scrollPos > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Tampilkan tombol back-to-top jika scroll lebih dari 400px
    if (scrollPos > 400) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  };

  window.addEventListener('scroll', handleWindowScroll, { passive: true });

  // Scroll to Top action
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }


  // --- 2. MOBILE HAMBURGER MENU ---
  const navToggle = document.getElementById('nav-toggle');
  const navMenuWrapper = document.getElementById('nav-menu-wrapper');
  const navLinks = document.querySelectorAll('.nav-link');

  const toggleMobileMenu = () => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !isExpanded);
    navToggle.classList.toggle('active');
    navMenuWrapper.classList.toggle('active');
  };

  const closeMobileMenu = () => {
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.classList.remove('active');
    navMenuWrapper.classList.remove('active');
  };

  if (navToggle && navMenuWrapper) {
    navToggle.addEventListener('click', toggleMobileMenu);

    // Otomatis tutup menu saat link di klik
    navLinks.forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    // Tutup menu jika klik di luar navbar
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && navMenuWrapper.classList.contains('active')) {
        closeMobileMenu();
      }
    });
  }


  // --- 3. SCROLLSPY (ACTIVE LINK HIGHLIGHTING) ---
  const sections = document.querySelectorAll('section[id]');

  const updateActiveNavLink = () => {
    const scrollPosition = window.scrollY + 140; // Offset penyesuaian posisi navbar
    const isAtBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 50);

    if (isAtBottom) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#contact') {
          link.classList.add('active');
        }
      });
      return;
    }

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });


  // --- 4. DARK / LIGHT THEME TOGGLE ---
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const htmlRoot = document.documentElement;

  // Cek preferensi yang tersimpan di localStorage atau preferensi sistem browser
  const savedTheme = localStorage.getItem('theme-preference');
  const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  const applyTheme = (theme) => {
    htmlRoot.setAttribute('data-theme', theme);
    localStorage.setItem('theme-preference', theme);

    if (theme === 'dark') {
      themeIcon.className = 'fa-solid fa-sun';
      themeToggle.setAttribute('title', 'Ganti ke Mode Terang');
    } else {
      themeIcon.className = 'fa-solid fa-moon';
      themeToggle.setAttribute('title', 'Ganti ke Mode Gelap');
    }
  };

  // Terapkan tema awal
  if (savedTheme) {
    applyTheme(savedTheme);
  } else if (systemPrefersDark) {
    applyTheme('dark');
  } else {
    applyTheme('light');
  }

  // Toggle saat tombol diklik
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    });
  }


  // --- 5. FILTER KATEGORI ANGGOTA ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const memberCards = document.querySelectorAll('.member-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Ganti class active pada tombol filter
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterCategory = btn.getAttribute('data-filter');

      // Tampilkan atau sembunyikan kartu dengan transisi
      memberCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterCategory === 'all' || cardCategory === filterCategory) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });


  // --- 6. MODAL POP-UP DETAIL ANGGOTA ---
  const memberModal = document.getElementById('member-modal');
  const modalClose = document.getElementById('modal-close');
  const detailButtons = document.querySelectorAll('.btn-detail');

  // Elemen di dalam modal
  const modalImg = document.getElementById('modal-img');
  const modalRole = document.getElementById('modal-role');
  const modalName = document.getElementById('modal-name');
  const modalNim = document.getElementById('modal-nim');
  const modalEmail = document.getElementById('modal-email');
  const modalPhone = document.getElementById('modal-phone');
  const modalBio = document.getElementById('modal-bio');
  const modalSkills = document.getElementById('modal-skills');
  const modalQuote = document.getElementById('modal-quote');

  const openModal = (data) => {
    if (!memberModal) return;

    modalImg.src = data.img || '';
    modalImg.alt = data.name || 'Foto Anggota';
    modalRole.textContent = data.role || 'Anggota Tim';
    modalName.textContent = data.name || '-';
    modalNim.textContent = `NIM / NIS: ${data.nim || '-'}`;
    modalEmail.textContent = data.email || '-';
    modalPhone.textContent = data.phone || '-';
    modalBio.textContent = data.bio || '-';
    modalQuote.textContent = `"${data.quote || 'Semangat belajar dan berkembang bersama.'}"`;

    // Render tag keahlian
    modalSkills.innerHTML = '';
    if (data.skills) {
      const skillsArray = data.skills.split(',').map(s => s.trim());
      skillsArray.forEach(skill => {
        const skillTag = document.createElement('span');
        skillTag.className = 'skill-tag';
        skillTag.textContent = skill;
        modalSkills.appendChild(skillTag);
      });
    }

    memberModal.classList.add('active');
    memberModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Kunci scroll halaman saat modal terbuka
  };

  const closeModal = () => {
    if (!memberModal) return;
    memberModal.classList.remove('active');
    memberModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Kembalikan scroll halaman
  };

  // Event listener tombol Detail Profil
  detailButtons.forEach(button => {
    button.addEventListener('click', () => {
      const data = {
        name: button.dataset.name,
        role: button.dataset.role,
        nim: button.dataset.nim,
        email: button.dataset.email,
        phone: button.dataset.phone,
        bio: button.dataset.bio,
        skills: button.dataset.skills,
        quote: button.dataset.quote,
        img: button.dataset.img
      };
      openModal(data);
    });
  });

  // Tutup modal saat tombol close diklik
  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  // Tutup modal saat klik area latar belakang (overlay)
  if (memberModal) {
    memberModal.addEventListener('click', (e) => {
      if (e.target === memberModal) {
        closeModal();
      }
    });
  }

  // Tutup modal jika tombol keyboard Escape ditekan
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && memberModal && memberModal.classList.contains('active')) {
      closeModal();
    }
  });


  // --- 7. FORM SUBMISSION & TOAST NOTIFICATION ---
  const contactForm = document.getElementById('contact-form');
  const btnSubmit = document.getElementById('btn-submit');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');

  const showToast = (message, duration = 3500) => {
    if (!toast) return;
    toastMessage.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  };

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const originalBtnHTML = btnSubmit.innerHTML;
      btnSubmit.disabled = true;
      btnSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mengirim Pesan...';

      // Simulasi pengiriman data
      setTimeout(() => {
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = originalBtnHTML;
        contactForm.reset();

        showToast('Pesan berhasil terkirim! Terima kasih atas tanggapan Anda.');
      }, 900);
    });
  }

});
