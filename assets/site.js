
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
  