import {initializeApp} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {getFirestore, doc, onSnapshot, collection, addDoc, serverTimestamp} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAuRwHUHDn5Nf-AhtNmo2ATITaRdiVJZnU",
  authDomain: "mb-s-pastries-and-bakery.firebaseapp.com",
  projectId: "mb-s-pastries-and-bakery",
  storageBucket: "mb-s-pastries-and-bakery.firebasestorage.app",
  messagingSenderId: "55184373579",
  appId: "1:55184373579:web:0eac0f989cdf1e4fc69ace",
  measurementId: "G-9W98RP182D"
};
const SITE_ID = "mbs-pastries-and-bakery";
const DEFAULT_BULK = {
  scones: [
    {size: "3L", price: "R150", popular: false},
    {size: "5L", price: "R280", popular: true},
    {size: "10L", price: "R400", popular: false},
    {size: "20L", price: "R850", popular: false}
  ],
  biscuits: [
    {size: "2.5L", price: "R200", popular: false},
    {size: "5L", price: "R400", popular: true},
    {size: "10L", price: "R730", popular: false}
  ]
};
const DEFAULT_SINGLES = [
  {id: "1", name: "Traditional Dikuku", desc: "Scones - No Eggs", price: "R12", tag: "Heritage"},
  {id: "2", name: "Scones", desc: "Soft & fluffy - per pack", price: "R18", tag: "Best Seller"},
  {id: "3", name: "Jam Tart", desc: "Buttery crust, sweet jam", price: "R35", tag: "Fave"},
  {id: "4", name: "Muffin", desc: "Fresh daily", price: "R15", tag: ""},
  {id: "5", name: "Biscuits", desc: "Crunchy homemade - from", price: "R25", tag: "Bulk"},
  {id: "6", name: "6 Mini Doughnuts", desc: "Sugar glazed", price: "R30", tag: "Mini"},
  {id: "7", name: "Mixed Loaf Slices", desc: "Banana / vanilla mix", price: "R30", tag: "Loaf"}
];
const DEFAULT_GALLERY = [
  {id: "g1", src: "WhatsApp%20Image%202026-11-03%20at%2020.13.30.jpeg", title: "Crunchy Biscuits Batch", desc: "Golden, crisp, and baked with love.", category: "Biscuits", price: "from R25"},
  {id: "g2", src: "WhatsApp%20Image%202026-11-03%20at%2020.13.jpeg", title: "Fresh Muffins", desc: "A fresh batch from our kitchen.", category: "Muffins", price: "R15"},
  {id: "g3", src: "WhatsApp%20Image%202026-11-03%20at%2020.13.32.jpeg", title: "Chocolate Cake", desc: "Made for sharing and celebrating.", category: "Cakes", price: ""},
  {id: "g4", src: "WhatsApp%20Image%202026-11-03%20at%2020.13.31.jpeg", title: "Mb's Full Menu", desc: "Take a look at our menu.", category: "Menu", price: ""}
];
const DEFAULT_SETTINGS = {
  deliveryFee: "Extra fee depending on location",
  businessName: "Mb's Pastries & Bakery",
  phone: "079 820 2255",
  tiktok: "Mb'sPastries&Bakery"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const siteRef = doc(db, "sites", SITE_ID);
let siteData = {
  bulk: DEFAULT_BULK,
  singles: DEFAULT_SINGLES,
  gallery: DEFAULT_GALLERY,
  settings: DEFAULT_SETTINGS
};
const el = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};

function renderBulk() {
  const container = document.getElementById("bulkContainer");
  container.replaceChildren();
  [["Plain Scones", siteData.bulk.scones], ["Biscuits", siteData.bulk.biscuits]].forEach(([name, items]) => {
    const card = el("article", "card bulk-card");
    card.append(el("h3", "", name), el("p", "sub", "Available in these bulk sizes"));
    items.forEach(item => {
      const row = el("div", "price-row");
      const size = el("span", "", item.size || "");
      if (item.popular) size.append(el("span", "popular", "POPULAR"));
      row.append(size, el("strong", "price", item.price || ""));
      card.append(row);
    });
    container.append(card);
  });
}

function renderSingles() {
  const container = document.getElementById("singlesContainer");
  const select = document.getElementById("orderProduct");
  container.replaceChildren();
  select.replaceChildren();
  if (!siteData.singles.length) {
    container.append(el("p", "", "Our treat menu is being refreshed. Please message us to ask about today's bakes."));
    select.append(new Option("Ask us about today's bakes", ""));
    return;
  }
  siteData.singles.forEach(treat => {
    const card = el("article", "treat");
    if (treat.tag) card.append(el("span", "treat-tag", treat.tag));
    card.append(el("h3", "", treat.name || "Fresh bake"), el("p", "", treat.desc || ""), el("strong", "", treat.price || "Ask"));
    container.append(card);
    select.append(new Option(`${treat.name || "Fresh bake"} — ${treat.price || "Ask"}`, `${treat.name || "Fresh bake"} — ${treat.price || "Ask"}`));
  });
}

function renderGallery() {
  const container = document.getElementById("galleryGrid");
  container.replaceChildren();
  if (!siteData.gallery.length) {
    container.append(el("p", "", "New bakes are on the way. Check back soon!"));
    return;
  }
  siteData.gallery.forEach(photo => {
    const card = el("article", "gallery-card");
    const image = el("img");
    image.src = photo.src || "";
    image.alt = photo.title || "Fresh bakery item";
    image.loading = "lazy";
    card.append(image);
    const copy = el("div", "gallery-copy");
    copy.append(el("h3", "", photo.title || "Fresh from our kitchen"));
    const details = [photo.category, photo.price].filter(Boolean).join(" · ");
    copy.append(el("p", "", [details, photo.desc].filter(Boolean).join(" — ")));
    card.append(copy);
    container.append(card);
  });
}

function renderSettings() {
  const settings = {...DEFAULT_SETTINGS, ...siteData.settings};
  document.title = `${settings.businessName} | Freshly Baked with Love`;
  ["brandName", "footerName"].forEach(id => document.getElementById(id).textContent = settings.businessName);
  const phone = settings.phone.replace(/[^\d+]/g, "");
  document.getElementById("contactPhone").textContent = settings.phone;
  document.getElementById("contactPhone").href = `tel:${phone}`;
  document.getElementById("contactTikTok").textContent = settings.tiktok;
  document.getElementById("deliveryText").textContent = settings.deliveryFee === "Extra fee depending on location" ? "Delivery at an extra fee depending on location." : `Delivery: ${settings.deliveryFee}.`;
  document.getElementById("headerOrder").href = `https://wa.me/${phone.replace(/^\+/, "").replace(/^0/, "27")}`;
}

function renderAll() {
  renderSettings();
  renderBulk();
  renderSingles();
  renderGallery();
}

renderAll();

function showConnectionError(error) {
  console.error("Could not load live bakery updates from Firebase.", error);
  const status = document.getElementById("syncStatus");
  status.textContent = "Updates unavailable";
  status.title = "Check your internet connection and Firebase Firestore rules.";
}

onSnapshot(siteRef, {includeMetadataChanges: true}, snapshot => {
  if (snapshot.exists()) {
    const data = snapshot.data();
    siteData = {
      bulk: data.bulk?.scones && data.bulk?.biscuits ? data.bulk : DEFAULT_BULK,
      singles: Array.isArray(data.singles) ? data.singles : DEFAULT_SINGLES,
      gallery: Array.isArray(data.gallery) ? data.gallery : DEFAULT_GALLERY,
      settings: {...DEFAULT_SETTINGS, ...(data.settings || {})}
    };
  }
  renderAll();
  const status = document.getElementById("syncStatus");
  status.textContent = snapshot.metadata.fromCache ? "● Connecting…" : "● Live synced";
  status.removeAttribute("title");
}, showConnectionError);

document.getElementById("orderForm").addEventListener("submit", async event => {
  event.preventDefault();
  const product = document.getElementById("orderProduct").value;
  const quantity = Number(document.getElementById("orderQty").value);
  const note = document.getElementById("orderNote").value.trim();
  const status = document.getElementById("orderStatus");
  if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) return;
  const phone = document.getElementById("contactPhone").textContent.replace(/\D/g, "").replace(/^0/, "27");
  const message = `Hi Mb's Pastries! 🧁 I would like to order:\nProduct: ${product}\nQuantity: ${quantity}${note ? `\nNote: ${note}` : ""}\nPlease confirm availability and delivery fee. Based in Polokwane/Turfloop.`;
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  const whatsappWindow = window.open("about:blank", "_blank");
  status.textContent = "Saving your enquiry…";
  try {
    await addDoc(collection(db, "inquiries"), {
      product,
      qty: quantity,
      note,
      status: "new",
      createdAt: serverTimestamp()
    });
    status.textContent = "Opening WhatsApp to send your order…";
    if (whatsappWindow) {
      whatsappWindow.location.href = whatsappUrl;
    } else {
      window.location.assign(whatsappUrl);
    }
  } catch (error) {
    console.error("Could not save the order enquiry to Firebase.", error);
    if (whatsappWindow) whatsappWindow.close();
    status.textContent = "We couldn't save your enquiry. Please try again or contact us by phone.";
  }
});
