/* OCEANICA Engineering - SPK Ltd | Interactive Logic */

let isDraggingCarousel = false;
let startX = 0;
let scrollLeftStart = 0;
let dragMoved = false;

function navigateTo(viewName, targetSectionId = null) {
  const views = document.querySelectorAll('.page-view');
  views.forEach((v) => v.classList.remove('active'));

  const targetView = document.getElementById(`view-${viewName}`);
  if (targetView) {
    targetView.classList.add('active');
  }

  // Update desktop and mobile nav active links
  document.querySelectorAll('[data-nav]').forEach((link) => {
    if (link.getAttribute('data-nav') === viewName) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Close mobile menu if open
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
    mobileMenu.classList.add('hidden');
  }

  if (targetSectionId) {
    setTimeout(() => {
      scrollToServiceSection(targetSectionId);
    }, 60);
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function toggleMobileMenu() {
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenu) {
    mobileMenu.classList.toggle('hidden');
  }
}

function scrollToServiceSection(sectionId) {
  const el = document.getElementById(sectionId);
  if (!el) return;
  const headerOffset = 148;
  const elementPosition = el.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({
    top: elementPosition - headerOffset,
    behavior: 'smooth'
  });

  document.querySelectorAll('.service-jump-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-target') === sectionId);
  });
}

/* Horizontal Services Carousel Controls */
function scrollServicesCarousel(direction) {
  const carousel = document.getElementById('services-carousel');
  if (!carousel) return;
  const slide = carousel.querySelector('.service-slide');
  const step = slide ? slide.offsetWidth + 24 : 380;
  carousel.scrollBy({ left: direction * step, behavior: 'smooth' });
}

function goToServiceSlide(index) {
  const carousel = document.getElementById('services-carousel');
  if (!carousel) return;
  const slides = carousel.querySelectorAll('.service-slide');
  if (slides[index]) {
    carousel.scrollTo({
      left: slides[index].offsetLeft - carousel.offsetLeft,
      behavior: 'smooth'
    });
  }
}

function updateCarouselDots() {
  const carousel = document.getElementById('services-carousel');
  if (!carousel) return;
  const slides = carousel.querySelectorAll('.service-slide');
  const dots = document.querySelectorAll('.carousel-dot');
  if (!slides.length || !dots.length) return;

  const slideWidth = slides[0].offsetWidth + 24;
  const activeIndex = Math.min(
    slides.length - 1,
    Math.max(0, Math.round(carousel.scrollLeft / slideWidth))
  );

  dots.forEach((dot, idx) => {
    if (idx === activeIndex) {
      dot.classList.remove('w-2', 'bg-slate-300');
      dot.classList.add('w-7', 'bg-ocean-navy');
    } else {
      dot.classList.remove('w-7', 'bg-ocean-navy');
      dot.classList.add('w-2', 'bg-slate-300');
    }
  });
}

function handleServiceCardClick(event, serviceId) {
  if (dragMoved) {
    event.preventDefault();
    return;
  }
  navigateTo('services', serviceId);
}

/* Contact Modal Controls */
function openContactModal(preselectedService = '') {
  const modal = document.getElementById('contact-modal');
  const serviceSelect = document.getElementById('contact-service');
  const successBanner = document.getElementById('contact-success');
  const form = document.getElementById('contact-form');

  if (successBanner) successBanner.classList.add('hidden');
  if (form) form.classList.remove('hidden');

  if (serviceSelect && preselectedService) {
    serviceSelect.value = preselectedService;
  }

  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }
}

function closeContactModal() {
  const modal = document.getElementById('contact-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
  }
}

function handleContactSubmit(event) {
  event.preventDefault();
  const form = document.getElementById('contact-form');
  const successBanner = document.getElementById('contact-success');
  if (form) form.classList.add('hidden');
  if (successBanner) successBanner.classList.remove('hidden');
}

/* Initialize Drag-to-Scroll and Scroll Spy */
document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.getElementById('services-carousel');
  if (carousel) {
    carousel.addEventListener('scroll', updateCarouselDots, { passive: true });

    carousel.addEventListener('mousedown', (e) => {
      isDraggingCarousel = true;
      dragMoved = false;
      startX = e.pageX - carousel.offsetLeft;
      scrollLeftStart = carousel.scrollLeft;
      carousel.classList.add('cursor-grabbing');
    });

    window.addEventListener('mouseup', () => {
      if (!isDraggingCarousel) return;
      isDraggingCarousel = false;
      carousel.classList.remove('cursor-grabbing');
      setTimeout(() => {
        dragMoved = false;
      }, 50);
    });

    carousel.addEventListener('mousemove', (e) => {
      if (!isDraggingCarousel) return;
      e.preventDefault();
      const x = e.pageX - carousel.offsetLeft;
      const walk = (x - startX) * 1.4;
      if (Math.abs(walk) > 6) {
        dragMoved = true;
      }
      carousel.scrollLeft = scrollLeftStart - walk;
    });
  }

  // Highlight active service jump button on scroll
  const serviceSections = document.querySelectorAll('.service-editorial-section');
  window.addEventListener(
    'scroll',
    () => {
      const servicesView = document.getElementById('view-services');
      if (!servicesView || !servicesView.classList.contains('active')) return;

      let currentId = '';
      serviceSections.forEach((sec) => {
        const rect = sec.getBoundingClientRect();
        if (rect.top <= 220) {
          currentId = sec.id;
        }
      });

      if (currentId) {
        document.querySelectorAll('.service-jump-btn').forEach((btn) => {
          btn.classList.toggle('active', btn.getAttribute('data-target') === currentId);
        });
      }
    },
    { passive: true }
  );

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeContactModal();
    }
  });
});
