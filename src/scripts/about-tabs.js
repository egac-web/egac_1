(function () {
  const tabs = ['locations', 'academy', 'fees'];

  function setTabState(active) {
    tabs.forEach(t => {
      const btn = document.getElementById('tab-' + t);
      const panel = document.getElementById('panel-' + t);
      if (!btn || !panel) return;
      btn.setAttribute('aria-selected', t === active ? 'true' : 'false');
      btn.setAttribute('tabindex', t === active ? '0' : '-1');
      panel.hidden = t !== active;
    });
  }

  function init() {
    const buttons = Array.from(document.querySelectorAll('.tab-btn[data-tab]'));
    console.log('[EGAC] about-tabs loaded, found buttons:', buttons.length);
    if (buttons.length === 0) return;

    buttons.forEach(btn => {
      btn.addEventListener('click', () => setTabState(btn.dataset.tab));
      btn.addEventListener('keydown', (e) => {
        const idx = buttons.indexOf(btn);
        if (e.key === 'ArrowRight') {
          const next = buttons[(idx + 1) % buttons.length];
          next.focus();
          setTabState(next.dataset.tab);
          e.preventDefault();
        } else if (e.key === 'ArrowLeft') {
          const prev = buttons[(idx - 1 + buttons.length) % buttons.length];
          prev.focus();
          setTabState(prev.dataset.tab);
          e.preventDefault();
        } else if (e.key === 'Enter' || e.key === ' ') {
          setTabState(btn.dataset.tab);
          e.preventDefault();
        }
      });
    });

    // ensure default
    setTabState('locations');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();