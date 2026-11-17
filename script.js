/* ==========================================================
   Cultura em Movimento - Interações
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".header");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.getElementById("menu");
  const navAnchors = navLinks.querySelectorAll("a");

  /* ---------- Tema claro / escuro ---------- */
  const themeBtn = document.querySelector(".theme-toggle");
  const root = document.documentElement;

  const applyTheme = (theme) => {
    root.setAttribute("data-theme", theme);
    const label = theme === "light" ? "Ativar tema escuro" : "Ativar tema claro";
    themeBtn.setAttribute("aria-label", label);
    themeBtn.setAttribute("title", label);
  };

  applyTheme(root.getAttribute("data-theme") === "light" ? "light" : "dark");

  themeBtn.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    applyTheme(next);
    try {
      localStorage.setItem("tema", next);
    } catch (e) {
      /* armazenamento indisponível: a escolha vale só para esta visita */
    }
  });

  /* ---------- Cabeçalho com sombra ao rolar ---------- */
  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 40);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Menu mobile ---------- */
  const setMenu = (open) => {
    navLinks.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    document.body.style.overflow = open ? "hidden" : "";
  };

  navToggle.addEventListener("click", () => {
    setMenu(!navLinks.classList.contains("is-open"));
  });

  navAnchors.forEach((link) =>
    link.addEventListener("click", () => setMenu(false))
  );

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
  });

  /* ---------- Revelar elementos ao rolar ---------- */
  const revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            el.classList.add("is-visible");
            observer.unobserve(el);
            // Remove o atraso após a entrada para não afetar o hover
            setTimeout(() => (el.style.transitionDelay = ""), 1200);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    revealEls.forEach((el, index) => {
      // Pequeno atraso escalonado para cards que estão lado a lado
      el.style.transitionDelay = `${(index % 3) * 80}ms`;
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Filtro de projetos ---------- */
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;

      filterButtons.forEach((b) => {
        const active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-pressed", String(active));
      });

      projectCards.forEach((card) => {
        const match = filter === "todos" || card.dataset.category === filter;
        card.classList.toggle("is-hidden", !match);
      });
    });
  });

  /* ---------- Formulário de contato (validação simulada) ---------- */
  const form = document.getElementById("contact-form");
  const feedback = form.querySelector(".form-feedback");

  const validators = {
    nome: (v) => (v.trim().length >= 3 ? "" : "Informe seu nome completo."),
    email: (v) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "Informe um e-mail válido.",
    assunto: (v) => (v ? "" : "Selecione um assunto."),
    mensagem: (v) =>
      v.trim().length >= 10 ? "" : "A mensagem deve ter pelo menos 10 caracteres.",
  };

  const validateField = (field) => {
    const wrapper = field.closest(".field");
    const validator = validators[field.name];
    const message = validator ? validator(field.value) : "";

    wrapper.classList.toggle("has-error", Boolean(message));
    wrapper.querySelector(".error-msg").textContent = message;
    return !message;
  };

  form.querySelectorAll("input, select, textarea").forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      if (field.closest(".field").classList.contains("has-error")) {
        validateField(field);
      }
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const fields = form.querySelectorAll("input, select, textarea");
    let valid = true;
    let firstInvalid = null;

    fields.forEach((field) => {
      const ok = validateField(field);
      if (!ok) {
        valid = false;
        if (!firstInvalid) firstInvalid = field;
      }
    });

    if (!valid) {
      feedback.className = "form-feedback error";
      feedback.textContent = "Revise os campos destacados.";
      firstInvalid.focus();
      return;
    }

    // Simulação de envio (não há backend neste portfólio)
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = "Enviando...";

    setTimeout(() => {
      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = "Enviar mensagem";
      feedback.className = "form-feedback success";
      feedback.textContent = "Mensagem enviada! Retornaremos em até dois dias úteis.";
    }, 1200);
  });

  /* ---------- Ano atual no rodapé ---------- */
  const anoEl = document.getElementById("ano");
  if (anoEl) anoEl.textContent = new Date().getFullYear();
});
