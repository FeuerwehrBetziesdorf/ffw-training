/* Freigabe-Sperre für Unterrichtsseiten der FFW Betziesdorf.
   Einbinden am Ende des body:  <script src="../sperre.js" data-ordner="04-beispiel"></script>
   Regel: Eine Einheit ist nur sichtbar, wenn sie in freigabe.json mit "frei": true steht.
   Fehlt sie dort oder steht "frei": false, sieht die Mannschaft nur einen Hinweis.
   Geräte mit eingerichtetem Trainer-Zugang sehen die Seite trotzdem (Vorschau mit Banner). */
(function(){
  var s=document.currentScript, ordner=s&&s.getAttribute('data-ordner');
  if(!ordner) return;
  function lies(k){try{return localStorage.getItem(k)}catch(e){return null}}
  var trainer=!!lies('ffwTrainerToken');
  var css=document.createElement('style');
  css.textContent='html.ffw-pruefe main,html.ffw-pruefe nav.tabs{visibility:hidden}'+
    '.ffw-vorschau{position:sticky;top:0;z-index:50;background:#9B1B1F;color:#fff;padding:8px 12px;font:600 .95rem/1.3 system-ui,sans-serif;text-align:center}'+
    '.ffw-vorschau a{color:#fff}';
  document.head.appendChild(css);
  if(!trainer) document.documentElement.classList.add('ffw-pruefe');
  function frei(f){var e=(f&&f.einheiten||[]).filter(function(x){return x.ordner===ordner})[0];return !!(e&&e.frei===true)}
  function sperren(){
    var n=document.querySelector('nav.tabs'); if(n) n.hidden=true;
    var m=document.querySelector('main');
    if(m) m.innerHTML='<div class="card" style="margin-top:16px"><h2 style="margin-top:0">Gerade nicht freigegeben</h2><p>Diese Einheit ist im Moment noch nicht dran. Sie wird freigeschaltet, sobald der Unterricht gehalten wurde.</p><p><a href="../">Zur Übersicht aller Unterrichte</a></p></div>';
  }
  function banner(){
    var b=document.createElement('div'); b.className='ffw-vorschau';
    b.innerHTML='Trainer-Vorschau: Diese Einheit ist für die Mannschaft noch gesperrt. <a href="../trainer/">Freigeben</a>';
    document.body.insertBefore(b,document.body.firstChild);
  }
  function fertig(f){
    var ok=frei(f);
    if(!ok){ if(trainer) banner(); else sperren(); }
    document.documentElement.classList.remove('ffw-pruefe');
  }
  fetch('../freigabe.json?t='+Date.now(),{cache:'no-store'})
    .then(function(r){if(!r.ok)throw 0;return r.json()})
    .then(function(f){try{localStorage.setItem('ffwFreigabe',JSON.stringify(f))}catch(e){};fertig(f)})
    .catch(function(){var c=null;try{c=JSON.parse(lies('ffwFreigabe'))}catch(e){};fertig(c)});
})();
