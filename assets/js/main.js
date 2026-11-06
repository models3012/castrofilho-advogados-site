/* Castro Filho Advogados Associados — interações do site */
(function () {
  "use strict";

  var CONFIG = {
    whatsapp: "556234138125",
    email: "contato@castrofilhoadvogados.com.br",
    // Para receber o formulário direto no e-mail sem abrir o app do visitante,
    // crie um formulário gratuito em https://formspree.io e cole a URL aqui
    // (ex.: "https://formspree.io/f/abcdwxyz"). Vazio = abre o e-mail do visitante.
    formEndpoint: ""
  };

  var doc = document;
  var root = doc.documentElement;

  /* ---------- Ano no rodapé ---------- */
  doc.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Cabeçalho sólido ao rolar ---------- */
  var header = doc.querySelector("[data-header]");
  var hero = doc.querySelector(".hero");
  if (header && hero && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      header.classList.toggle("is-solid", !entries[0].isIntersecting);
    }, { rootMargin: "-" + (header.offsetHeight + 1) + "px 0px 0px 0px" }).observe(hero);
  } else if (header && !header.classList.contains("site-header--solid")) {
    header.classList.add("is-solid");
  }

  /* ---------- Menu mobile ---------- */
  var toggle = doc.querySelector("[data-nav-toggle]");
  var nav = doc.querySelector("[data-nav]");

  function setNav(open) {
    root.classList.toggle("nav-open", open);
    doc.body.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.querySelector(".visually-hidden").textContent = open ? "Fechar menu" : "Abrir menu";
    // Com o menu aberto, o restante da página sai da ordem de foco e do leitor de tela
    doc.querySelectorAll("main, footer, [data-wa-float]").forEach(function (el) {
      if (open) el.setAttribute("inert", ""); else el.removeAttribute("inert");
    });
    if (open) {
      var first = nav.querySelector("a");
      if (first) first.focus();
    }
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setNav(toggle.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setNav(false);
    });
    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && root.classList.contains("nav-open")) {
        setNav(false);
        toggle.focus();
      }
    });
    var desktopMq = window.matchMedia("(min-width: 1061px)");
    var onDesktop = function (mq) { if (mq.matches) setNav(false); };
    if (desktopMq.addEventListener) desktopMq.addEventListener("change", onDesktop);
    else if (desktopMq.addListener) desktopMq.addListener(onDesktop);
  }

  /* ---------- Seção ativa no menu ---------- */
  var navLinks = Array.prototype.slice.call(doc.querySelectorAll('.nav__list a[href^="#"]'));
  if (navLinks.length && "IntersectionObserver" in window) {
    var byId = { inicio: null, blog: null };
    navLinks.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) { a.removeAttribute("aria-current"); });
        var link = byId[entry.target.id];
        if (link) link.setAttribute("aria-current", "true");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(byId).forEach(function (id) {
      var section = doc.getElementById(id);
      if (section) spy.observe(section);
    });
  }

  /* ---------- Currículos (dialog) ---------- */
  doc.querySelectorAll("[data-cv]").forEach(function (btn) {
    var dialog = doc.getElementById(btn.getAttribute("data-cv"));
    if (!dialog || typeof dialog.showModal !== "function") return;
    btn.addEventListener("click", function () {
      dialog.showModal();
      doc.body.style.overflow = "hidden";
    });
    dialog.addEventListener("close", function () {
      doc.body.style.overflow = "";
      btn.focus();
    });
    dialog.addEventListener("click", function (e) {
      if (e.target === dialog) dialog.close();
    });
    dialog.querySelectorAll("[data-cv-close]").forEach(function (c) {
      c.addEventListener("click", function () { dialog.close(); });
    });
  });

  /* ---------- Áreas → pré-seleciona assunto no formulário ---------- */
  var areaSelect = doc.getElementById("f-area");
  doc.querySelectorAll("[data-area]").forEach(function (link) {
    link.addEventListener("click", function () {
      if (areaSelect) areaSelect.value = link.getAttribute("data-area");
      setTimeout(function () {
        var nome = doc.getElementById("f-nome");
        if (nome) nome.focus({ preventScroll: true });
      }, 600);
    });
  });

  /* ---------- Mapa carregado só quando visível ---------- */
  var map = doc.querySelector("[data-map] iframe");
  if (map) {
    var loadMap = function () { if (!map.src) map.src = map.getAttribute("data-src"); };
    if ("IntersectionObserver" in window) {
      var mo = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { loadMap(); mo.disconnect(); }
      }, { rootMargin: "400px" });
      mo.observe(map);
    } else {
      loadMap();
    }
  }

  /* ---------- WhatsApp flutuante: oculto sobre o hero e o rodapé ---------- */
  var wa = doc.querySelector("[data-wa-float]");
  var footer = doc.querySelector(".site-footer");
  if (wa) {
    var ticking = false;
    var update = function () {
      ticking = false;
      var overHero = hero && window.scrollY < hero.offsetHeight * 0.5;
      var overFooter = footer && footer.getBoundingClientRect().top < window.innerHeight - 40;
      wa.classList.toggle("is-hidden", !!(overHero || overFooter));
    };
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* ---------- Formulário de contato ---------- */
  var form = doc.querySelector("[data-form]");
  if (!form) return;
  var status = form.querySelector("[data-form-status]");
  var submitBtn = form.querySelector('button[type="submit"]');

  var tel = form.querySelector("#f-tel");
  tel.addEventListener("input", function () {
    var d = tel.value.replace(/\D/g, "");
    if (d.length > 11 && d.indexOf("55") === 0) d = d.slice(2);
    d = d.slice(0, 11);
    var out = d;
    if (d.length > 2) out = "(" + d.slice(0, 2) + ") " + d.slice(2);
    if (d.length > 6) out = "(" + d.slice(0, 2) + ") " + d.slice(2, d.length === 11 ? 7 : 6) + "-" + d.slice(d.length === 11 ? 7 : 6);
    tel.value = out;
  });

  var rules = {
    nome: function (v) { return v.trim().length >= 2 ? "" : "Informe seu nome."; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Informe um e-mail válido, como nome@exemplo.com."; },
    telefone: function (v) { var d = v.replace(/\D/g, ""); return !d || d.length >= 10 ? "" : "Informe o telefone com DDD."; },
    mensagem: function (v) { return v.trim().length >= 10 ? "" : "Escreva sua mensagem (mínimo de 10 caracteres)."; }
  };

  function validate(field) {
    var rule = rules[field.name];
    if (!rule) return true;
    var msg = rule(field.value);
    var err = doc.getElementById(field.getAttribute("aria-describedby"));
    field.setAttribute("aria-invalid", msg ? "true" : "false");
    if (err) err.textContent = msg;
    return !msg;
  }

  form.querySelectorAll("input, textarea").forEach(function (f) {
    f.addEventListener("blur", function () { if (f.value) validate(f); });
    f.addEventListener("input", function () { if (f.getAttribute("aria-invalid") === "true") validate(f); });
  });

  function showStatus(text, isError) {
    status.textContent = text;
    status.classList.toggle("is-error", !!isError);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (form._gotcha && form._gotcha.value) return;

    var fields = ["nome", "email", "telefone", "mensagem"].map(function (n) { return form.elements[n]; });
    var invalid = fields.filter(function (f) { return !validate(f); });
    if (invalid.length) {
      invalid[0].focus();
      showStatus("Revise os campos destacados para enviar.", true);
      return;
    }

    var data = {
      nome: form.nome.value.trim(),
      email: form.email.value.trim(),
      telefone: form.telefone.value.trim(),
      area: form.area.value,
      mensagem: form.mensagem.value.trim()
    };

    if (CONFIG.formEndpoint) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Enviando…";
      fetch(CONFIG.formEndpoint, {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(data)
      }).then(function (r) {
        if (!r.ok) throw new Error();
        form.reset();
        showStatus("Obrigado pelo envio! Responderemos em breve pelo e-mail informado.");
      }).catch(function () {
        showStatus("Não foi possível enviar agora. Ligue para (62) 3030-0855 ou escreva para " + CONFIG.email + ".", true);
      }).finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = "Enviar mensagem";
      });
      return;
    }

    var subject = "Contato pelo site" + (data.area ? " — " + data.area : "") + " — " + data.nome;
    var body = [
      "Nome: " + data.nome,
      "E-mail: " + data.email,
      data.telefone ? "Telefone: " + data.telefone : "",
      data.area ? "Assunto: " + data.area : "",
      "",
      data.mensagem
    ].filter(function (l, i) { return l || i === 4; }).join("\n");

    window.location.href = "mailto:" + CONFIG.email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    showStatus("Seu aplicativo de e-mail deve abrir com a mensagem pronta: conclua o envio por lá. Se ele não abrir, escreva para " + CONFIG.email + " ou ligue para (62) 3030-0855.");
  });
})();
