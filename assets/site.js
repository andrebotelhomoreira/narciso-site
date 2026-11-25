
  (() => {
    'use strict';
    const root = document.documentElement;
    root.classList.add('js');
    const themeButton = document.getElementById('themeButton');
    const menuButton = document.getElementById('menuButton');
    const mainNav = document.getElementById('mainNav');
    const category = document.getElementById('productCategory');
    // Tema: a escolha do visitante é preservada entre visitas quando permitido.
    let storedTheme = null;
    try { storedTheme = localStorage.getItem('narciso-theme'); } catch(e) {}
    const systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    function applyTheme(theme) {
      root.dataset.theme = theme;
      const dark = theme === 'dark';
      if(themeButton) themeButton.setAttribute('aria-label', dark ? 'Ativar modo claro' : 'Ativar modo escuro');
      if(themeButton) themeButton.setAttribute('aria-pressed', String(dark));
    }
    applyTheme(storedTheme === 'dark' || storedTheme === 'light' ? storedTheme : (systemDark ? 'dark' : 'light'));
    if(themeButton) themeButton.addEventListener('click', () => {
      const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try {localStorage.setItem('narciso-theme', next);} catch(e) {}
    });
    // Navegação mobile com estado ARIA e fechamento por Esc.
    function closeMenu(){if(!mainNav || !menuButton)return;mainNav.classList.remove('open');menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Abrir menu');}
    if(menuButton && mainNav) menuButton.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      menuButton.setAttribute('aria-expanded',String(isOpen));
      menuButton.setAttribute('aria-label',isOpen ? 'Fechar menu' : 'Abrir menu');
    });
    if(mainNav) mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (event) => {if(event.key === 'Escape') closeMenu();});
    document.addEventListener('click', (event) => {if(mainNav && menuButton && !mainNav.contains(event.target) && !menuButton.contains(event.target))closeMenu();});
    // Um toque numa categoria preenche automaticamente o orçamento.
    document.querySelectorAll('[data-category]').forEach(card => card.addEventListener('click', () => {
      const value=card.getAttribute('data-category');
      if(category && Array.from(category.options).some(option=>option.value===value)) category.value=value;
    }));
    document.getElementById('quoteForm')?.addEventListener('submit', event => {
      event.preventDefault();
      const name = document.getElementById('personName').value.trim();
      const items = document.getElementById('itemsList').value.trim();
      const lines = ['Olá! Gostaria de solicitar um orçamento na Narciso Material de Construção.'];
      if(name) lines.push('Meu nome: ' + name);
      lines.push('Categoria: ' + category.value);
      if(items) lines.push('Materiais que procuro:\n' + items);
      lines.push('Podem me informar valores e disponibilidade?');
      const url = 'https://wa.me/5527999259494?text=' + encodeURIComponent(lines.join('\n\n'));
      // Abre a conversa na aba atual; evita bloqueio de pop-up ou abas duplicadas.
      window.location.assign(url);
    });
    const yearNode=document.getElementById('currentYear');if(yearNode)yearNode.textContent=new Date().getFullYear();
    const reveals = document.querySelectorAll('.reveal');
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if('IntersectionObserver' in window && !reduceMotion) {
      const observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}
      }),{threshold:.06,rootMargin:'0px 0px 35px 0px'});
      reveals.forEach(el=>observer.observe(el));
    } else {reveals.forEach(el=>el.classList.add('visible'));}
  })();

  // GA4 da Narciso: não envia texto de orçamento, telefone, query string ou dados pessoais.
  (() => {
    const measurementId = 'G-QGH5GMDCHL';
    if (window.__narcisoGaInitialized) return;
    window.__narcisoGaInitialized = true;

    window.dataLayer = window.dataLayer || [];
    function gtag(){window.dataLayer.push(arguments);}
    window.gtag = window.gtag || gtag;
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {send_page_view: true});

    const tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(measurementId);
    document.head.appendChild(tag);

    let referrerHost = 'direct';
    try { if (document.referrer) referrerHost = new URL(document.referrer).hostname || 'direct'; } catch (e) {}
    const pageContext = () => ({
      page_path: window.location.pathname,
      page_title: document.title,
      referrer_host: referrerHost,
      interaction_source: 'website',
      transport_type: 'beacon'
    });
    const sendEvent = (name, extra = {}) => window.gtag('event', name, {...pageContext(), ...extra});

    document.addEventListener('click', event => {
      const link = event.target.closest && event.target.closest('a[href]');
      if (!link) return;
      let target;
      try { target = new URL(link.href, window.location.href); } catch (e) { return; }
      const host = target.hostname.toLowerCase();
      if (host === 'wa.me' || host === 'api.whatsapp.com' || host === 'web.whatsapp.com') {
        sendEvent('whatsapp_click', {link_host: host});
      } else if (target.protocol === 'tel:' || target.protocol === 'mailto:') {
        sendEvent('contact_click', {contact_type: target.protocol.slice(0, -1)});
      } else if (host === 'maps.google.com' || (host.endsWith('.google.com') && target.pathname.startsWith('/maps')) || host === 'maps.app.goo.gl' || host === 'waze.com' || host.endsWith('.waze.com')) {
        sendEvent('click_directions', {link_host: host});
      }
    }, true);

    document.addEventListener('submit', event => {
      if (event.target && event.target.id === 'quoteForm') sendEvent('quote_request', {form_id: 'quoteForm'});
    }, true);
  })();
