/* =========================================================
   LIBRAIRIE DIGITALE — SCRIPT.JS
   Gère : les données des livres, la recherche, les filtres
   par catégorie, les sections spéciales (populaires, gratuits,
   Pulaar, Arabe), le choix numérique / physique avec livraison
   à domicile, la bascule de langue FR/AR (RTL) et l'animation
   au scroll. Aucun backend requis.
   ========================================================= */

// ----- 1. NUMÉRO WHATSAPP -----
// Remplace "TONNUMERO" par ton numéro complet (format international, sans "+")
const WHATSAPP_NUMBER = "22133602";

// ----- 2. FRAIS DE LIVRAISON À DOMICILE (version physique) -----
// Ajouté automatiquement au prix numérique pour obtenir le prix "livraison incluse".
// Modifie cette valeur pour ajuster le tarif de livraison sur tous les livres.
const SHIPPING_FEE = 300;

// ----- TÉLÉCHARGEMENT DES LIVRES GRATUITS -----
// Chaque livre gratuit a un champ "pdfFile" qui pointe vers son fichier PDF réel.
// Étapes pour que ça fonctionne :
//   1. Crée un dossier "livres" à côté de index.html, style.css et script.js
//   2. Dépose dedans le vrai fichier PDF de chaque livre gratuit
//   3. Vérifie que le nom du fichier correspond exactement à la valeur "pdfFile"
//      indiquée pour ce livre dans le tableau ci-dessous (ou modifie le chemin).
// Le bouton "Télécharger sur WhatsApp" devient alors un vrai téléchargement
// en un clic, sans passer par WhatsApp.

// Formate un nombre en prix affichable, ex: 4500 -> "4 500 MRU"
function formatPrice(amount) {
  return amount.toLocaleString("fr-FR") + " MRU";
}

// ----- 3. TRADUCTIONS DE L'INTERFACE -----
// Les titres de livres et les titres de section restent toujours en
// français ; seule l'interface générale (boutons, badges, messages...)
// change de langue.
const translations = {
  fr: {
    searchPlaceholder: "Rechercher un livre, un thème...",
    heroEyebrow: "Nouvelle étagère chaque semaine",
    heroTitle: "Des livres qui changent<br> votre façon de penser.",
    heroSub: "Développement personnel, business, technologie, Pulaar et livres en arabe — en version numérique livrée instantanément, ou en version physique livrée chez vous.",
    heroCta: "Découvrir le catalogue",
    navCatalogue: "Voir le catalogue",
    navTop: "Top ventes",
    navFree: "Livres gratuits",
    navPulaarLink: "Pulaar",
    navArabeLink: "Arabe",
    navContact: "Contact",
    trust1Title: "Téléchargement immédiat",
    trust1Desc: "Vos ebooks livrés en quelques secondes",
    trust2Title: "Paiement sécurisé",
    trust2Desc: "Une expérience d'achat fiable via WhatsApp",
    trust3Title: "Compatible tous appareils",
    trust3Desc: "Lisez où que vous soyez, sur mobile ou PC",
    trust4Title: "Support réactif",
    trust4Desc: "Nous sommes là pour vous aider 7j/7",
    navAll: "Tous les livres",
    catDev: "Développement personnel",
    catBusiness: "Business",
    catTech: "Technologie",
    catPulaar: "Pulaar",
    catArabe: "Arabe",
    noResults: "Aucun livre ne correspond à votre recherche.",
    popularBadge: "Populaire",
    freeLabel: "Gratuit",
    formatDigital: "Numérique",
    formatPhysical: "Physique",
    digitalDetail: "📩 Réception immédiate via WhatsApp (PDF/EPUB)",
    physicalDetail: "🚚 Livraison à domicile incluse dans le prix",
    freeFormatNote: "🎁 Offert en version numérique uniquement",
    buyBtnDigital: "Acheter sur WhatsApp",
    buyBtnPhysical: "Commander avec livraison",
    downloadBtn: "Télécharger le livre PDF",
    buyMsgDigital: (title, price) =>
      `Bonjour, je souhaite acheter la version numérique de l'ebook "${title}" (${price}).`,
    buyMsgPhysical: (title, price) =>
      `Bonjour, je souhaite commander la version physique du livre "${title}" avec livraison à domicile (${price}). Merci de me contacter pour organiser la livraison.`,
    freeMsg: (title) => `Bonjour, je souhaite recevoir l'ebook gratuit "${title}".`,
    whatsappDefaultMsg: "Bonjour, j'ai une question sur vos livres numériques et physiques.",
    resultsCount: (n) => `${n} livre${n > 1 ? "s" : ""}`,
    footerAboutDesc: "Des milliers de livres numériques et physiques entre vos mains, à tout moment, où que vous soyez.",
    footerLinksTitle: "Liens rapides",
    footerContactTitle: "Contact",
    footerWhatsappLabel: "WhatsApp",
    footerLine: "Paiement sécurisé via WhatsApp • Numérique livré instantanément • Physique livré à domicile",
    footerCopy: "© 2026 Librairie Digitale. Tous droits réservés.",
    switchTo: "العربية"
  },
  ar: {
    searchPlaceholder: "ابحث عن كتاب أو موضوع...",
    heroEyebrow: "رفوف جديدة كل أسبوع",
    heroTitle: "كتب تُغيّر<br> طريقة تفكيرك.",
    heroSub: "تطوير الذات، الأعمال، التكنولوجيا، الفولار وكتب باللغة العربية — بصيغة رقمية تصل فورًا، أو بنسخة ورقية تُوصَّل إلى منزلك.",
    heroCta: "اكتشف المكتبة",
    navCatalogue: "تصفح المكتبة",
    navTop: "الأكثر مبيعًا",
    navFree: "كتب مجانية",
    navPulaarLink: "فولار",
    navArabeLink: "عربي",
    navContact: "اتصل بنا",
    trust1Title: "تحميل فوري",
    trust1Desc: "كتبك تصل خلال ثوانٍ",
    trust2Title: "دفع آمن وسهل",
    trust2Desc: "تجربة شراء موثوقة عبر واتساب",
    trust3Title: "متوافق مع جميع الأجهزة",
    trust3Desc: "اقرأ أينما كنت، على الهاتف أو الحاسوب",
    trust4Title: "دعم فني سريع",
    trust4Desc: "نحن هنا لمساعدتك طوال الأسبوع",
    navAll: "كل الكتب",
    catDev: "التطوير الشخصي",
    catBusiness: "الأعمال",
    catTech: "التكنولوجيا",
    catPulaar: "فولار",
    catArabe: "عربي",
    noResults: "لا يوجد كتاب يطابق بحثك.",
    popularBadge: "الأكثر مبيعًا",
    freeLabel: "مجاني",
    formatDigital: "رقمي",
    formatPhysical: "ورقي",
    digitalDetail: "📩 استلام فوري عبر واتساب (PDF/EPUB)",
    physicalDetail: "🚚 التوصيل إلى المنزل ضمن السعر",
    freeFormatNote: "🎁 متوفر مجانًا بصيغة رقمية فقط",
    buyBtnDigital: "اشترِ عبر واتساب",
    buyBtnPhysical: "اطلب مع التوصيل",
    downloadBtn: "تحميل الكتاب PDF",
    buyMsgDigital: (title, price) =>
      `مرحبًا، أرغب في شراء النسخة الرقمية من الكتاب "${title}" (${price}).`,
    buyMsgPhysical: (title, price) =>
      `مرحبًا، أرغب في طلب النسخة الورقية من الكتاب "${title}" مع التوصيل إلى المنزل (${price}). يرجى التواصل معي لتنظيم التوصيل.`,
    freeMsg: (title) => `مرحبًا، أرغب في الحصول على الكتاب المجاني "${title}".`,
    whatsappDefaultMsg: "مرحبًا، لدي سؤال حول كتبكم الرقمية والورقية.",
    resultsCount: (n) => `${n} كتاب`,
    footerAboutDesc: "آلاف الكتب الرقمية والورقية بين يديك في أي وقت، من أي مكان.",
    footerLinksTitle: "روابط سريعة",
    footerContactTitle: "اتصل بنا",
    footerWhatsappLabel: "واتساب",
    footerLine: "دفع آمن عبر واتساب • النسخة الرقمية فورية • النسخة الورقية تُوصَّل إلى المنزل",
    footerCopy: "© 2026 المكتبة الرقمية. جميع الحقوق محفوظة.",
    switchTo: "Français"
  }
};

// Correspondance entre l'id canonique d'une catégorie et sa clé de traduction
const categoryLabelKey = {
  dev: "catDev",
  business: "catBusiness",
  tech: "catTech",
  pulaar: "catPulaar",
  arabe: "catArabe"
};

// ----- 4. BASE DE DONNÉES DES LIVRES -----
// price = prix de la version numérique (nombre).
// Le prix "physique" est calculé automatiquement (prix + SHIPPING_FEE).
// Les titres et descriptions restent toujours affichés en français.
const books = [
  {
    title: "Père riche, père pauvre",
    description: "Ce que les gens riches enseignent à leurs enfants à propos de l'argent et que ne font pas les gens pauvres et de la classe moyenne!",
    price: 100,
    category: "dev",
    popular: true,
    cover: "image livre/pere riche pere pauvre.jpg"
  },
  {
    title: "L’art subtil de s’ en foutre",
    description: "Transformez votre relation à l'argent grâce à des principes simples et éprouvés.",
    price: 70,
    category: "dev",
    popular: true,
    cover: "image livre/art de s'enfoutre.jpg"
  },
  {
    title: "Programmer avec javascript pour les nuls",
    description: "Apprenez les bases de la programmation avec une méthode claire, pensée pour les débutants.",
    price: 70,
    category: "tech",
    popular: true,
    cover: "image livre/imagejava.jpg"
  },
   {
    title: "introduction de deeplearning",
    description: "Apprenez les bases de la programmation avec une méthode claire, pensée pour les débutants.",
    price: 80,
    category: "tech",
    popular: true,
    cover: "image livre/introduction de deeplearning.jpg"
  },
    {
    title: "Développement système sous Linux Ordonnancement multitâche",
    description: "Apprenez les bases de la programmation avec une méthode claire, pensée pour les débutants.",
    price: 70,
    category: "tech",
    popular: true,
    cover: "image livre/Développement système sous Linux Ordonnancement multitâche, gestion mémoire, communications, programmation réseau (Blanche) (French Edition).jpg"
  },
    {
    title: "Sécurité informatique - Ethical Hacking",
    description: "Apprenez les bases de la programmation avec une méthode claire, pensée pour les débutants.",
    price: 70,
    category: "tech",
    popular: true,
    cover: "image livre/Sécurité informatique - Ethical Hacking - Apprendre l'attaque pour mieux se défendre (French Edition).jpg"
  },
   {
    title: "intro a wordpress",
    description: "Apprenez les bases de la programmation avec une méthode claire, pensée pour les débutants.",
    price: 70,
    category: "tech",
    popular: true,
    cover: "image livre/wordpress pour les nul.jpg"
  },
   {
    title: "Intro a la virualisation",
    description: "Apprenez les bases de la programmation avec une méthode claire, pensée pour les débutants.",
    price: 70,
    category: "tech",
    popular: true,
    cover: "image livre/intro a la vrtualisation.jpg"
  },
  {
    title: "Apprendre le Pulaar Facilement",
    description: "Un guide simple pour apprendre à lire, écrire et parler le pulaar au quotidien.",
    price: 70,
    category: "pulaar",
    popular: true,
    cover: "https://images.unsplash.com/photo-1531346680769-a1d79b57de5c?w=500&q=80"
  },
  {
    title: "Contes et Sagesse Peule",
    description: "Une collection de contes traditionnels peuls pour transmettre les valeurs ancestrales.",
    price: 70,
    category: "pulaar",
    popular: false,
    free: true,
    pdfFile: "livre pdf/pr.pdf",
    cover: "image livre/prd.png"
  },
  {
    title: "Grammaire Pulaar pour Débutants",
    description: "Les bases grammaticales du pulaar expliquées simplement, avec exercices pratiques.",
    price: 70,
    category: "pulaar",
    popular: false,
    cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRZci-KJxZ2HeXaQALoprK_LMr2nHkIp4TM4QTXeH3iA&s=10"
  },
  {
    title: "Focus Absolu",
    description: "Éliminez les distractions et retrouvez une concentration profonde au quotidien.",
    price: 70,
    category: "dev",
    popular: false,
    free: true,
    pdfFile: "livres/focus-absolu.pdf",
    cover: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=500&q=80"
  },
  {
    title: "Lancer sa Boîte en 30 Jours",
    description: "Un guide pratique pour transformer une idée en entreprise rentable, étape par étape.",
    price: 70,
    category: "business",
    popular: false,
    cover: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&q=80"
  },
  {
    title: "Intelligence Artificielle Simplifiée",
    description: "Comprenez les concepts clés de l'IA moderne sans jargon technique inutile.",
    price: 65,
    category: "tech",
    popular: false,
    cover: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=500&q=80"
  },
  {
    title: "Le Pouvoir des Habitudes Positives",
    description: "Un plan concret pour remplacer vos mauvaises habitudes par des routines gagnantes.",
    price: 70,
    category: "dev",
    popular: false,
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&q=80"
  },
  {
    title: "Négocier Comme un Pro",
    description: "Les techniques de négociation utilisées par les meilleurs entrepreneurs du monde.",
    price: 70,
    category: "business",
    popular: false,
    cover: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=500&q=80"
  },
  {
    title: "Cybersécurité pour Tous",
    description: "Protégez vos données personnelles et professionnelles grâce à des gestes simples.",
    price: 80,
    category: "tech",
    popular: false,
    cover: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&q=80"
  },
  {
    title: "Perles de Sagesse Arabe",
    description: "Un recueil de pensées et proverbes arabes classiques, expliqués et contextualisés.",
    price: 70,
    category: "arabe",
    popular: false,
    cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&q=80"
  },
  {
    title: "Le Marché de l'Entrepreneuriat Arabe",
    description: "Comment bâtir un projet rentable dans le monde arabophone, études de cas à l'appui.",
    price: 70,
    category: "arabe",
    popular: false,
    cover: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=500&q=80"
  },
  {
    title: "Poésie Arabe Moderne",
    description: "Une anthologie de poètes arabes contemporains, avec analyse et traduction.",
    price: 70,
    category: "arabe",
    popular: false,
    free: true,
    pdfFile: "livres/poesie-arabe-moderne.pdf",
    cover: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500&q=80"
  },
  {
    title: "UNE SI LONGUE LETTRE",
    description: "",
    price: 100,
    category: "business",
    popular: false,
    cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOMieHFkPyp04baWZ0dKfHXJsx-ZYTGonib7nKzU3eJA&s=10"
  }
];

// ----- 5. ÉTAT DE L'APPLICATION -----
let currentLang = "fr";       // "fr" ou "ar"
let activeCategory = "all";   // catégorie sélectionnée dans le filtre

// ----- 6. RÉFÉRENCES DOM -----
const bookGrid = document.getElementById("bookGrid");
const popularGrid = document.getElementById("popularGrid");
const freeGrid = document.getElementById("freeGrid");
const pulaarGrid = document.getElementById("pulaarGrid");
const arabicGrid = document.getElementById("arabicGrid");
const searchInput = document.getElementById("searchInput");
const categoryNav = document.getElementById("categoryNav");
const resultsCount = document.getElementById("resultsCount");
const noResults = document.getElementById("noResults");
const langToggle = document.getElementById("langToggle");
const langToggleText = document.getElementById("langToggleText");
const whatsappFloat = document.getElementById("whatsappFloat");
const footerWhatsapp = document.getElementById("footerWhatsapp");

// ----- 7. CRÉATION D'UNE CARTE LIVRE -----
function createBookCard(book) {
  const t = translations[currentLang];
  const categoryLabel = t[categoryLabelKey[book.category]];
  const isFree = book.free === true;

  const card = document.createElement("article");
  card.className = "book-card";
  card.setAttribute("data-category", book.category);

  // ----- CAS 1 : livre gratuit -> téléchargement PDF direct en un clic -----
  if (isFree) {
    // Nom de fichier propre pour le téléchargement (sans accents ni espaces)
    const downloadName = book.title.replace(/\s+/g, "_") + ".pdf";

    card.innerHTML = `
      <div class="book-cover-wrap">
        <img class="book-cover" src="${book.cover}" alt="${book.title}" loading="lazy">
        <span class="badge-free">${t.freeLabel}</span>
        <span class="price-tag price-tag-free">${t.freeLabel}</span>
      </div>
      <div class="book-info">
        <span class="book-category">${categoryLabel}</span>
        <h3 class="book-title">${book.title}</h3>
        <p class="book-desc">${book.description}</p>
        <p class="format-note">${t.freeFormatNote}</p>
        <a class="buy-btn download-btn" href="${book.pdfFile}" download="${downloadName}">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3v12m0 0l-4.5-4.5M12 15l4.5-4.5M4 18v2a1 1 0 001 1h14a1 1 0 001-1v-2" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="buy-btn-label">${t.downloadBtn}</span>
        </a>
      </div>
    `;
    return card;
  }

  // ----- CAS 2 : livre payant -> choix Numérique / Physique via WhatsApp -----
  let badgeHtml = book.popular ? `<span class="badge-popular">${t.popularBadge}</span>` : "";

  card.innerHTML = `
    <div class="book-cover-wrap">
      <img class="book-cover" src="${book.cover}" alt="${book.title}" loading="lazy">
      ${badgeHtml}
      <span class="price-tag"></span>
    </div>
    <div class="book-info">
      <span class="book-category">${categoryLabel}</span>
      <h3 class="book-title">${book.title}</h3>
      <p class="book-desc">${book.description}</p>
      <div class="format-toggle">
        <button type="button" class="format-btn active" data-format="digital">${t.formatDigital}</button>
        <button type="button" class="format-btn" data-format="physical">${t.formatPhysical}</button>
      </div>
      <p class="format-detail"></p>
      <a class="buy-btn" href="#" target="_blank" rel="noopener">
        <svg viewBox="0 0 32 32" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 3C9.4 3 4 8.4 4 15c0 2.3.6 4.4 1.7 6.3L4 29l7.9-1.6c1.8.9 3.9 1.4 6.1 1.4 6.6 0 12-5.4 12-12S22.6 3 16 3z"/>
        </svg>
        <span class="buy-btn-label"></span>
      </a>
    </div>
  `;

  // Écoute le clic sur les boutons Numérique / Physique
  card.querySelectorAll(".format-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      card.querySelectorAll(".format-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      updateCardDisplay(card, book, btn.getAttribute("data-format"));
    });
  });

  updateCardDisplay(card, book, "digital");

  return card;
}

// Met à jour le prix, le message WhatsApp et le libellé du bouton selon le format choisi
// (uniquement pour les livres payants ; les livres gratuits n'appellent pas cette fonction)
function updateCardDisplay(card, book, format) {
  const t = translations[currentLang];
  const priceTag = card.querySelector(".price-tag");
  const buyBtn = card.querySelector(".buy-btn");
  const buyLabel = card.querySelector(".buy-btn-label");
  const detailEl = card.querySelector(".format-detail");

  let priceValue, message, btnLabel;

  if (format === "physical") {
    priceValue = formatPrice(book.price + SHIPPING_FEE);
    message = t.buyMsgPhysical(book.title, priceValue);
    btnLabel = t.buyBtnPhysical;
    if (detailEl) detailEl.textContent = t.physicalDetail;
  } else {
    priceValue = formatPrice(book.price);
    message = t.buyMsgDigital(book.title, priceValue);
    btnLabel = t.buyBtnDigital;
    if (detailEl) detailEl.textContent = t.digitalDetail;
  }

  priceTag.textContent = priceValue;
  buyLabel.textContent = btnLabel;
  buyBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

// ----- 8. AFFICHAGE DE LA LISTE FILTRÉE (recherche + catégorie) -----
function renderBooks() {
  const t = translations[currentLang];
  const query = searchInput.value.trim().toLowerCase();

  const filtered = books.filter((book) => {
    const matchesCategory = activeCategory === "all" || book.category === activeCategory;
    const matchesSearch =
      book.title.toLowerCase().includes(query) ||
      book.description.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  bookGrid.innerHTML = "";
  filtered.forEach((book) => bookGrid.appendChild(createBookCard(book)));

  resultsCount.textContent = t.resultsCount(filtered.length);
  noResults.hidden = filtered.length !== 0;

  observeCards();
}

// ----- 9. SECTION LIVRES POPULAIRES (fixe, non filtrée) -----
function renderPopularBooks() {
  const popular = books.filter((book) => book.popular);
  popularGrid.innerHTML = "";
  popular.forEach((book) => popularGrid.appendChild(createBookCard(book)));
  observeCards();
}

// ----- 9bis. SECTION LIVRES GRATUITS (fixe, non filtrée) -----
function renderFreeBooks() {
  const freeBooks = books.filter((book) => book.free === true);
  freeGrid.innerHTML = "";
  freeBooks.forEach((book) => freeGrid.appendChild(createBookCard(book)));
  observeCards();
}

// ----- 10. SECTION LIVRES EN PULAAR (fixe, non filtrée) -----
function renderPulaarBooks() {
  const pulaarBooks = books.filter((book) => book.category === "pulaar");
  pulaarGrid.innerHTML = "";
  pulaarBooks.forEach((book) => pulaarGrid.appendChild(createBookCard(book)));
  observeCards();
}

// ----- 10bis. SECTION LIVRES EN ARABE (fixe, non filtrée) -----
function renderArabicBooks() {
  const arabicBooks = books.filter((book) => book.category === "arabe");
  arabicGrid.innerHTML = "";
  arabicBooks.forEach((book) => arabicGrid.appendChild(createBookCard(book)));
  observeCards();
}

// Regroupe le rafraîchissement de toutes les sections de livres
function renderAllSections() {
  renderPopularBooks();
  renderFreeBooks();
  renderPulaarBooks();
  renderArabicBooks();
  renderBooks();
}

// ----- 11. TRADUCTION DE L'INTERFACE STATIQUE -----
function applyStaticTranslations() {
  const t = translations[currentLang];

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (t[key] !== undefined) el.textContent = t[key];
  });

  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    const key = el.getAttribute("data-i18n-html");
    if (t[key] !== undefined) el.innerHTML = t[key];
  });

  searchInput.placeholder = t.searchPlaceholder;
  langToggleText.textContent = t.switchTo;

  const defaultMsg = encodeURIComponent(t.whatsappDefaultMsg);
  whatsappFloat.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${defaultMsg}`;
  if (footerWhatsapp) {
    footerWhatsapp.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${defaultMsg}`;
  }
}

// ----- 12. BASCULE DE LANGUE FR <-> AR -----
function toggleLanguage() {
  currentLang = currentLang === "fr" ? "ar" : "fr";

  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";

  applyStaticTranslations();
  renderAllSections();
}

langToggle.addEventListener("click", toggleLanguage);

// ----- 12bis. MENU HAMBURGER (version mobile) -----
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  // Ferme le menu quand on clique sur un lien
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// ----- 13. GESTION DE LA RECHERCHE -----
searchInput.addEventListener("input", renderBooks);

// ----- 14. GESTION DES CATÉGORIES -----
categoryNav.addEventListener("click", (e) => {
  const btn = e.target.closest(".cat-btn");
  if (!btn) return;

  document.querySelectorAll(".cat-btn").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");

  activeCategory = btn.getAttribute("data-category");
  renderBooks();
});

// ----- 15. ANIMATION LÉGÈRE AU SCROLL -----
function observeCards() {
  const cards = document.querySelectorAll(".book-card:not(.in-view)");
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  cards.forEach((card) => observer.observe(card));
}

// ----- 16. INITIALISATION -----
applyStaticTranslations();
renderAllSections();
