(function () {
  'use strict';

  var WA_NUMBER = '241066556029';
  var chat = document.getElementById('chat');
  var toggle = document.getElementById('chat-toggle');
  var body = document.getElementById('chat-body');
  var chipsBox = document.getElementById('chat-chips');
  var form = document.getElementById('chat-form');
  var input = document.getElementById('chat-input');
  var fab = document.getElementById('fab');
  var started = false;

  function waLink(text) {
    return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text);
  }
  function waButton(text, label) {
    return '<a class="chat__cta" href="' + waLink(text) + '" target="_blank" rel="noopener">' + (label || 'Continuer sur WhatsApp') + '</a>';
  }
  var DEVIS_WA = "Bonjour SY'M BTP GABON, je souhaite un devis pour un projet.";

  // Base de connaissances issue de la présentation institutionnelle
  var KB = [
    { id: 'bonjour', keys: ['bonjour', 'bonsoir', 'salut', 'hello', 'coucou', 'bjr'],
      answer: "Bonjour et bienvenue chez <strong>SY'M BTP GABON</strong> ! Je peux vous renseigner sur nos métiers, nos réalisations, nos délais ou vous aider à demander un devis. Que puis-je faire pour vous ?" },
    { id: 'services', keys: ['service', 'prestation', 'metier', 'que faites', 'activite', 'expertise', 'domaine', 'proposez', 'offre', 'competence'],
      answer: "Nous intervenons sur <strong>six pôles</strong> :<ul><li>Bâtiment tous corps d'état</li><li>Réhabilitation, rénovation, réfection</li><li>Travaux publics &amp; aménagement</li><li>Études de sol &amp; forage d'eau</li><li>Menuiserie &amp; ébénisterie</li><li>Approvisionnement en bois</li></ul>Quel type de projet avez-vous ?",
      chips: ['Bâtiment', 'Travaux publics', 'Forage', 'Menuiserie'] },
    { id: 'batiment', keys: ['batiment', 'construction', 'maison', 'villa', 'immeuble', 'gros oeuvre', 'gros-oeuvre', 'beton', 'dalle', 'fondation', 'structure', 'facade', 'finition', 'cle en main', 'logement', 'duplex', 'r+'],
      answer: "En <strong>bâtiment</strong>, nous réalisons des ouvrages résidentiels, tertiaires et industriels : gros œuvre, structures, coffrage, ferraillage, béton, second œuvre, façades et finitions — jusqu'aux villas clés en main. Nos équipes suivent chaque étape, de la conception à la livraison.",
      chips: ['Demander un devis', 'Délais', 'Réalisations'] },
    { id: 'rehab', keys: ['rehabilit', 'renov', 'refection', 'refaire', 'reparer', 'reparation', 'ancien', 'vetuste', 'amenagement interieur'],
      answer: "Nous prenons en charge la <strong>réhabilitation d'immeubles</strong>, la <strong>rénovation d'espaces</strong> et la <strong>réfection d'infrastructures</strong>. Une visite sur site permet d'évaluer l'existant avant de chiffrer les travaux.",
      chips: ['Demander un devis', 'Contact'] },
    { id: 'tp', keys: ['travaux public', 'route', 'voirie', 'terrassement', 'nivellement', 'plateforme', 'engin', 'deblai', 'piste', 'goudron', 'bitume', 'vrd'],
      answer: "En <strong>travaux publics</strong>, nous réalisons le terrassement et le nivellement, la construction et la réhabilitation de voiries, la préparation de plateformes et divers aménagements — en zone urbaine comme en zone forestière, avec notre propre parc d'engins.",
      chips: ['Nos moyens', 'Demander un devis'] },
    { id: 'forage', keys: ['forage', 'forer', 'puits', 'eau ', 'eaux', 'sol ', 'sols', 'geotechni', 'etude de sol', 'foreuse'],
      answer: "Nous réalisons des <strong>études de sol et géotechniques</strong> ainsi que des <strong>forages d'eau</strong>, avec des équipements adaptés (foreuse sur chenilles) et des équipes spécialisées. Connaître le sol, c'est garantir des fondations solides.",
      chips: ['Demander un devis', 'Contact'] },
    { id: 'bois', keys: ['menuiserie', 'menuisier', 'ebenist', 'meuble', 'mobilier', 'porte', 'placard', 'cuisine', 'bois', 'charpente', 'parquet', 'sur mesure'],
      answer: "Notre <strong>atelier de menuiserie</strong> conçoit et réalise du mobilier sur mesure, l'aménagement intérieur, la menuiserie du bâtiment et la construction bois. Nous assurons aussi l'<strong>approvisionnement en bois</strong> débités et traités, de la fourniture à la pose.",
      chips: ['Demander un devis', 'Réalisations'] },
    { id: 'devis', keys: ['devis', 'prix', 'tarif', 'cout', 'combien', 'budget', 'estimation', 'chiffrage', 'chiffrer', 'cher', 'montant'],
      answer: "Chaque projet fait l'objet d'un <strong>devis personnalisé</strong>, établi selon vos plans, le terrain et les prestations souhaitées. Décrivez-nous votre projet (type de travaux, lieu, surface) :<br>" + waButton(DEVIS_WA, 'Demander un devis sur WhatsApp') + '<a class="chat__link" href="#contact" data-close>ou remplir le formulaire de devis</a>' },
    { id: 'delai', keys: ['delai', 'combien de temps', 'duree', 'quand', 'rapide', 'planning', 'date'],
      answer: "Les délais dépendent de la nature et de l'ampleur du chantier. Ils sont fixés dans le devis et suivis de près par notre encadrement : <strong>la maîtrise des délais et des coûts</strong> fait partie de nos engagements.",
      chips: ['Demander un devis'] },
    { id: 'zone', keys: ['ou etes', 'etes ou', 'c est ou', 'ou se trouve', 'trouver', 'adresse', 'situe', 'localisation', 'siege', 'bureau', 'akanda', 'libreville', 'zone', 'province', 'interieur', 'deplace', 'venez', 'intervenez'],
      answer: "Notre siège est à <strong>Akanda, dans l'agglomération de Libreville</strong>. Nous intervenons à Libreville et à l'intérieur du pays — par exemple sur le marché de <strong>Lébamba</strong>.",
      chips: ['Contact', 'Réalisations'] },
    { id: 'contact', keys: ['contact', 'telephone', 'numero', 'appeler', 'joindre', 'mail', 'email', 'courriel', 'whatsapp', 'parler', 'humain', 'conseiller', 'rappeler'],
      answer: "Vous pouvez nous joindre :<ul><li>Tél. : <a href=\"tel:+241066556029\">+241 066 55 60 29</a> / <a href=\"tel:+241076300400\">076 30 04 00</a></li><li>E-mail : <a href=\"mailto:symbtp@gmail.com\">symbtp@gmail.com</a></li><li>Siège : Akanda — Libreville</li></ul>" + waButton("Bonjour SY'M BTP GABON, je souhaite être recontacté.", 'Écrire sur WhatsApp') },
    { id: 'refs', keys: ['reference', 'realisation', 'projet', 'chantier', 'client', 'experience', 'deja fait', 'exemple', 'portfolio', 'photo'],
      answer: "Quelques références :<ul><li><strong>30 logements sociaux</strong> — Village Akeni</li><li><strong>Chantier Alhambra</strong> (Addoha, Libreville) — structures, gros œuvre et façades</li><li><strong>Marché de Lébamba</strong> — avec Mika Service</li></ul><a class=\"chat__link\" href=\"#realisations\" data-close>Voir la galerie de réalisations</a>" },
    { id: 'moyens', keys: ['moyen', 'materiel', 'engins', 'pelle', 'camion', 'equipe', 'personnel', 'ouvrier', 'combien etes', 'effectif'],
      answer: "Nous disposons d'un <strong>parc d'engins</strong> (pelles hydrauliques, engins de terrassement, camions, foreuse) entretenu régulièrement, et d'<strong>équipes terrain qualifiées</strong> encadrées en continu sur chaque chantier.",
      chips: ['Travaux publics', 'Demander un devis'] },
    { id: 'qualite', keys: ['qualite', 'securite', 'norme', 'garantie', 'confiance', 'serieux', 'fiable', 'valeur'],
      answer: "Nos engagements : <strong>professionnalisme, qualité, partenariat, durabilité et performance</strong>. Nos ouvrages respectent les normes en vigueur, avec un contrôle qualité, sécurité et délais à chaque étape. « Construire avec expertise. Réhabiliter avec exigence. Livrer avec engagement. »" },
    { id: 'direction', keys: ['directeur', 'pdg', 'patron', 'dirigeant', 'responsable', 'mamadou', 'fondateur'],
      answer: "SY'M BTP GABON est dirigée par <strong>M. Mamadou SY</strong>, Président-directeur général." },
    { id: 'emploi', keys: ['emploi', 'recrut', 'stage', 'cv', 'candidature', 'travailler chez', 'job', 'poste'],
      answer: "Pour une candidature ou un stage, vous pouvez adresser votre CV et une lettre de motivation à <a href=\"mailto:symbtp@gmail.com\">symbtp@gmail.com</a>." },
    { id: 'plaquette', keys: ['plaquette', 'brochure', 'presentation', 'pdf', 'document', 'catalogue'],
      answer: "Voici notre présentation institutionnelle et technique : <a class=\"chat__link\" href=\"SYM_BTP_GABON_Presentation_institutionnelle.pdf\" download>Télécharger le PDF</a>" },
    { id: 'merci', keys: ['merci', 'au revoir', 'bye', 'a bientot', 'parfait', 'super', 'ok merci'],
      answer: "Avec plaisir ! N'hésitez pas si vous avez d'autres questions. À bientôt chez SY'M BTP GABON." }
  ];

  var CHIP_MAP = {
    'Nos services': 'services', 'Bâtiment': 'batiment', 'Travaux publics': 'tp', 'Forage': 'forage',
    'Menuiserie': 'bois', 'Demander un devis': 'devis', 'Délais': 'delai', 'Réalisations': 'refs',
    'Contact': 'contact', 'Nos moyens': 'moyens', 'Où êtes-vous ?': 'zone'
  };
  var DEFAULT_CHIPS = ['Nos services', 'Demander un devis', 'Réalisations', 'Où êtes-vous ?', 'Contact'];

  function norm(s) {
    return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9+ ]/g, ' ').replace(/\s+/g, ' ');
  }

  function findAnswer(q) {
    var t = ' ' + norm(q) + ' ';
    var best = null, bestScore = 0;
    KB.forEach(function (e) {
      var score = 0;
      e.keys.forEach(function (k) { if (t.indexOf(' ' + k) !== -1) score += k.length > 5 ? 2 : 1; });
      // Les salutations ne l'emportent que si la question ne contient rien d'autre
      if (e.id === 'bonjour' && score) score = 0.5;
      if (score > bestScore) { bestScore = score; best = e; }
    });
    return best;
  }

  function addMsg(html, who) {
    var m = document.createElement('div');
    m.className = 'chat__msg chat__msg--' + who;
    m.innerHTML = html;
    body.appendChild(m);
    body.scrollTop = body.scrollHeight;
    return m;
  }

  function setChips(list) {
    chipsBox.innerHTML = '';
    (list || DEFAULT_CHIPS).forEach(function (c) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'chat__chip';
      b.textContent = c;
      b.addEventListener('click', function () { ask(c, CHIP_MAP[c]); });
      chipsBox.appendChild(b);
    });
  }

  function botReply(html, chips) {
    var typing = addMsg('<span class="chat__typing"><i></i><i></i><i></i></span>', 'bot');
    setTimeout(function () {
      typing.innerHTML = html;
      body.scrollTop = body.scrollHeight;
      setChips(chips);
    }, 550 + Math.min(html.length, 400));
  }

  function ask(text, forcedId) {
    addMsg(text.replace(/</g, '&lt;'), 'user');
    var entry = null;
    if (forcedId) KB.forEach(function (e) { if (e.id === forcedId) entry = e; });
    if (!entry) entry = findAnswer(text);
    if (entry) {
      botReply(entry.answer, entry.chips);
    } else {
      botReply("Je n'ai pas la réponse précise à cette question, mais notre équipe peut vous répondre directement :<br>" +
        waButton("Bonjour SY'M BTP GABON, j'ai une question : " + text, 'Poser ma question sur WhatsApp'));
    }
  }

  function open() {
    chat.classList.add('is-open');
    fab.classList.add('is-chat-open');
    chat.setAttribute('aria-hidden', 'false');
    toggle.setAttribute('aria-expanded', 'true');
    if (!started) {
      started = true;
      botReply("Bonjour 👋 Je suis l'assistant de <strong>SY'M BTP GABON</strong>. Posez-moi vos questions sur nos métiers, nos réalisations ou votre projet — je vous réponds tout de suite.");
    }
    setTimeout(function () { input.focus(); }, 300);
  }
  function close() {
    chat.classList.remove('is-open');
    fab.classList.remove('is-chat-open');
    chat.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', function () { chat.classList.contains('is-open') ? close() : open(); });
  document.getElementById('chat-close').addEventListener('click', close);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && chat.classList.contains('is-open')) close(); });
  body.addEventListener('click', function (e) {
    var a = e.target.closest('a[data-close]');
    if (a) close();
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var q = input.value.trim();
    if (!q) return;
    input.value = '';
    ask(q);
  });

  // Invitation discrète après quelques secondes, une seule fois par visite
  setTimeout(function () {
    try { if (sessionStorage.getItem('symChatHint')) return; sessionStorage.setItem('symChatHint', '1'); } catch (e) {}
    if (!chat.classList.contains('is-open')) fab.classList.add('is-hint');
    setTimeout(function () { fab.classList.remove('is-hint'); }, 6000);
  }, 5000);
})();
