// GTM is loaded once, on the public website only. Tags are managed in GTM.
(() => {
  if (location.hostname !== 'www.tigabizcentre.com') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({'gtm.start': Date.now(), event: 'gtm.js'});
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-M3KKB945';
  document.head.appendChild(script);
})();
