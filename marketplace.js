((() => {
  const products = [
    {id:1,cat:"Steam",title:"Steam İstediğiniz 3 Oyun",price:60,seller:"Eson"},
    {id:2,cat:"Discord",title:"STOKVAR | 7/24 | 14X BOOST 1 HAFTALIK",price:32.90,seller:"BerilStore"},
    {id:3,cat:"Valorant",title:"Champions 25 Setli 2 Vandal +500Vpli Gümüş Hesap",price:1900,seller:"yusufbalka61"},
    {id:4,cat:"Steam",title:"Steam Random Key 200$",price:19.90,seller:"Eson"},
    {id:5,cat:"Instagram",title:"Instagram Takipçi 1.000",price:89.90,seller:"StellMarket"},
    {id:6,cat:"Yapay Zeka",title:"Antigravity Pro +3 Ay",price:129.90,seller:"Eson"},
    {id:7,cat:"Facebook",title:"Facebook Reklam Hesabı",price:299,seller:"Prenses2026"},
    {id:8,cat:"Rust",title:"Rust Round 53 Twitch Drop",price:15,seller:"StellMarket"},
    {id:9,cat:"Youtube",title:"Youtube Keşfet Paketi",price:30,seller:"Eson"},
    {id:10,cat:"Discord",title:"STOKVAR | 7/24 | 20X BOOST 1 AYLIK",price:117.90,seller:"BerilStore"}
  ];

  const categories = [
    "Tümü","Valorant","Roblox","Discord","Steam","PUBG Mobile",
    "Minecraft","Instagram","TikTok","Youtube","Rust",
    "Yapay Zeka","Facebook"
  ];

  let cart = [];

try {
  cart = JSON.parse(localStorage.getItem("itemsatis_cart") || "[]");

  if (!Array.isArray(cart)) {
    cart = [];
  }
} catch (e) {
  localStorage.removeItem("itemsatis_cart");
  cart = [];
}
  let selectedCategory = "Tümü";

  const style = document.createElement("style");

  style.textContent = `
    .is-market{
      max-width:1180px;
      margin:20px auto 110px;
      padding:0 14px;
      color:#eef0f7;
    }

    .is-market *{box-sizing:border-box}

    .is-market-head{
      background:linear-gradient(135deg,#292d49,#171a2b);
      border:1px solid #363c5b;
      border-radius:20px;
      padding:25px;
      margin-bottom:15px;
    }

    .is-market-head h1{
      margin:0 0 7px;
      font-size:28px;
    }

    .is-market-head p{
      margin:0;
      color:#aeb5cc;
    }

    .is-stats{
      display:flex;
      gap:28px;
      margin-top:20px;
    }

    .is-stats b{
      display:block;
      font-size:20px;
    }

    .is-stats span{
      color:#929ab2;
      font-size:12px;
    }

    .is-market-bar{
      display:flex;
      gap:9px;
      margin-bottom:15px;
    }

    .is-search{
      flex:1;
      min-width:0;
      background:#20243a;
      border:1px solid #363c5b;
      border-radius:12px;
      color:#fff;
      padding:13px 15px;
      outline:none;
    }

    .is-market button{
      cursor:pointer;
    }

    .is-cartbtn,
    .is-filterbtn{
      border:0;
      border-radius:12px;
      padding:0 17px;
      background:#5967ff;
      color:#fff;
      font-weight:700;
    }

    .is-layout{
      display:grid;
      grid-template-columns:250px 1fr;
      gap:15px;
    }

    .is-filter{
      background:#20243a;
      border:1px solid #363c5b;
      border-radius:16px;
      padding:15px;
      height:max-content;
    }

    .is-filter h3{
      margin:3px 0 12px;
    }

    .is-cat{
      display:block;
      width:100%;
      text-align:left;
      background:transparent;
      color:#bfc5d8;
      border:0;
      border-radius:9px;
      padding:10px;
    }

    .is-cat.on,
    .is-cat:hover{
      background:#343b61;
      color:#fff;
    }

    .is-results{
      display:grid;
      grid-template-columns:repeat(2,minmax(0,1fr));
      gap:12px;
    }

    .is-card{
      background:#20243a;
      border:1px solid #363c5b;
      border-radius:15px;
      padding:15px;
    }

    .is-card-top{
      display:flex;
      justify-content:space-between;
      gap:10px;
    }

    .is-badge{
      color:#9da8ff;
      font-size:11px;
    }

    .is-price{
      font-size:19px;
      font-weight:800;
      white-space:nowrap;
    }

    .is-card h3{
      font-size:15px;
      line-height:1.35;
      margin:12px 0 9px;
    }

    .is-seller{
      color:#929ab2;
      font-size:12px;
      margin-bottom:12px;
    }

    .is-actions{
      display:flex;
      gap:8px;
    }

    .is-actions button{
      flex:1;
      border:0;
      border-radius:9px;
      padding:10px;
    }

    .is-add{
      background:#343b61;
      color:#fff;
    }

    .is-buy{
      background:#5967ff;
      color:#fff;
    }

    .is-drawer,
    .is-detail{
      position:fixed;
      inset:0;
      z-index:10020;
      background:rgba(4,6,14,.72);
    }

    .is-drawer{
      display:none;
    }

    .is-drawer.open{
      display:block;
    }

    .is-panel{
      position:absolute;
      right:0;
      top:0;
      height:100%;
      width:min(430px,94vw);
      background:#20243a;
      padding:20px;
      overflow:auto;
      box-shadow:-15px 0 40px #0008;
    }

    .is-panel-head{
      display:flex;
      justify-content:space-between;
      align-items:center;
    }

    .is-close{
      background:none;
      border:0;
      color:#fff;
      font-size:28px;
    }

    .is-item{
      display:flex;
      justify-content:space-between;
      gap:10px;
      border-bottom:1px solid #363c5b;
      padding:14px 0;
    }

    .is-remove{
      background:none;
      border:0;
      color:#ff7d8a;
    }

    .is-total{
      display:flex;
      justify-content:space-between;
      font-size:20px;
      font-weight:800;
      padding:20px 0;
    }

    .is-checkout{
      width:100%;
      padding:13px;
      border:0;
      border-radius:11px;
      background:#5967ff;
      color:#fff;
      font-weight:800;
    }

    .is-detail{
      display:none;
      align-items:center;
      justify-content:center;
      padding:15px;
    }

    .is-detail.open{
      display:flex;
    }

    .is-detailbox{
      width:min(620px,100%);
      background:#20243a;
      border:1px solid #363c5b;
      border-radius:18px;
      padding:22px;
    }

    .is-detailbox h2{
      margin-top:0;
    }

    .is-detailprice{
      font-size:27px;
      font-weight:900;
      margin:15px 0;
    }

    .is-note{
      color:#9ba3bb;
      font-size:13px;
      line-height:1.5;
    }

    @media(max-width:760px){
      .is-layout{
        grid-template-columns:1fr;
      }

      .is-filter{
        display:none;
      }

      .is-filter.show{
        display:block;
      }

      .is-results{
        grid-template-columns:1fr;
      }

      .is-stats{
        gap:15px;
      }

      .is-market-head h1{
        font-size:23px;
      }
    }
  `;

  document.head.appendChild(style);

  const market = document.createElement("section");
  market.className = "is-market";

  market.innerHTML = `
    <div class="is-market-head">
      <h1>İtemSatış İlan Pazarı</h1>
      <p>Ücretsiz ilan oluşturabileceğiniz güvenli oyuncu pazarı.</p>

      <div class="is-stats">
        <div><b>100K+</b><span>Aktif İlan</span></div>
        <div><b>2M+</b><span>Kullanıcı</span></div>
        <div><b>100%</b><span>Güvenlik</span></div>
      </div>
    </div>

    <div class="is-market-bar">
      <input class="is-search" placeholder="İlanlarda ara...">
      <button class="is-filterbtn">Filtre</button>
      <button class="is-cartbtn">
        Sepet <span>0</span>
      </button>
    </div>

    <div class="is-layout">
      <aside class="is-filter">
        <h3>Kategoriler</h3>
        <input class="is-search" style="width:100%;margin-bottom:8px" placeholder="Kategori ara...">
        <div class="is-cats"></div>
      </aside>

      <div class="is-results"></div>
    </div>
  `;

  const showcase =
    document.querySelector(".showcase") ||
    document.querySelector(".quick-reference");

  if(showcase){
    showcase.parentNode.insertBefore(market,showcase);
  }else{
    document.body.appendChild(market);
  }

  const results = market.querySelector(".is-results");
  const search = market.querySelector(".is-market-bar .is-search");
  const cats = market.querySelector(".is-cats");

  function money(value){
    return value.toLocaleString("tr-TR",{
      minimumFractionDigits:2,
      maximumFractionDigits:2
    }) + " ₺";
  }

  function render(){
    const query = search.value.trim().toLowerCase();

    results.innerHTML = products
      .filter(p =>
        (selectedCategory === "Tümü" || p.cat === selectedCategory) &&
        (!query ||
          (p.title + " " + p.cat + " " + p.seller)
          .toLowerCase()
          .includes(query))
      )
      .map(p => `
        <article class="is-card" data-id="${p.id}">
          <div class="is-card-top">
            <span class="is-badge">${p.cat}</span>
            <span class="is-price">${money(p.price)}</span>
          </div>

          <h3>${p.title}</h3>

          <div class="is-seller">
            ${p.seller}
          </div>

          <div class="is-actions">
            <button class="is-add">Sepete Ekle</button>
            <button class="is-buy">Hemen Al</button>
          </div>
        </article>
      `)
      .join("") || `
        <div class="is-card">
          İlan bulunamadı.
        </div>
      `;

    cats.innerHTML = categories.map(c => `
      <button class="is-cat ${c === selectedCategory ? "on" : ""}"
              data-cat="${c}">
        ${c}
      </button>
    `).join("");

    updateCart();
  }

  function updateCart(){
    market.querySelector(".is-cartbtn span").textContent =
      cart.reduce((total,item) => total + item.qty,0);
  }

  function addToCart(id){
    const product = products.find(p => p.id === id);
    const existing = cart.find(p => p.id === id);

    if(existing){
      existing.qty++;
    }else{
      cart.push({...product,qty:1});
    }

    localStorage.setItem(
      "itemsatis_cart",
      JSON.stringify(cart)
    );

    updateCart();
  }

  const drawer = document.createElement("div");

  drawer.className = "is-drawer";

  drawer.innerHTML = `
    <div class="is-panel">

      <div class="is-panel-head">
        <h2>Sepetim</h2>
        <button class="is-close">×</button>
      </div>

      <div class="is-list"></div>

      <div class="is-total">
        <span>Toplam</span>
        <span class="is-sum">0 ₺</span>
      </div>

      <button class="is-checkout">
        Satın Almaya Geç
      </button>

    </div>
  `;

  document.body.appendChild(drawer);

  function openCart(){
    const list = drawer.querySelector(".is-list");

    list.innerHTML = cart.length
      ? cart.map(item => `
          <div class="is-item">
            <div>
              <b>${item.title}</b><br>
              <small>${item.qty} × ${money(item.price)}</small>
            </div>

            <button class="is-remove"
                    data-id="${item.id}">
              Sil
            </button>
          </div>
        `).join("")
      : "<p>Sepetiniz boş.</p>";

    const total = cart.reduce(
      (sum,item) => sum + item.price * item.qty,
      0
    );

    drawer.querySelector(".is-sum").textContent =
      money(total);

    drawer.classList.add("open");
  }

  const detail = document.createElement("div");

  detail.className = "is-detail";

  detail.innerHTML = `
    <div class="is-detailbox">
      <button class="is-close" style="float:right">×</button>
      <div class="is-detailcontent"></div>
    </div>
  `;

  document.body.appendChild(detail);

  market.addEventListener("click",event => {

    const category = event.target.closest(".is-cat");

    if(category){
      selectedCategory = category.dataset.cat;render();
      return;
     }   
    if(
      event.target === profilePanel ||
      event.target.closest(".is-profile-close")
    ){
      closeProfile();
      return;
    }

    if(event.target.closest(".is-profile-logout")){
      closeProfile();

      if(typeof openLogin === "function"){
        openLogin();
      }
    }
  

    const card = event.target.closest(".is-card");

    if(!card) return;

    const id = Number(card.dataset.id);

    if(event.target.closest(".is-add")){
      addToCart(id);
      return;
    }

    if(event.target.closest(".is-buy")){
      addToCart(id);
      openCart();
      return;
    }

    if(event.target.closest("h3")){
      const product = products.find(p => p.id === id);

      detail.querySelector(".is-detailcontent").innerHTML = `
        <div class="is-badge">${product.cat}</div>

        <h2>${product.title}</h2>

        <p class="is-note">
          Satıcı: ${product.seller}
        </p>

        <div class="is-detailprice">
          ${money(product.price)}
        </div>

        <p class="is-note">
          Ürün satın alma işlemi hesabınızla
          devam eder.
        </p>

        <button class="is-checkout"
                data-buy="${product.id}">
          Sepete Ekle
        </button>
      `;

      detail.classList.add("open");
    }
  });

  market.querySelector(".is-cartbtn")
    .addEventListener("click",openCart);

  market.querySelector(".is-filterbtn")
    .addEventListener("click",() => {
      market.querySelector(".is-filter")
        .classList.toggle("show");
    });

  search.addEventListener("input",render);

  drawer.addEventListener("click",event => {

    if(
      event.target === drawer ||
      event.target.closest(".is-close")
    ){
      drawer.classList.remove("open");
      return;
    }

    const remove = event.target.closest(".is-remove");

    if(remove){
      cart = cart.filter(
        item => item.id !== Number(remove.dataset.id)
      );

      localStorage.setItem(
        "itemsatis_cart",
        JSON.stringify(cart)
      );

      openCart();
    }
  });

  drawer.querySelector(".is-checkout")
  .addEventListener("click",() => {
    const accountText =
      document.querySelector("#bottomLogin span")?.textContent?.trim();

    if(accountText === "Hesabım"){
      drawer.classList.remove("open");

      alert(
        "Sipariş oluşturma ekranı açılıyor.\n\n" +
        "Hesabınız doğrulandı. Ödeme adımına geçebilirsiniz."
      );

      return;
    }

    drawer.classList.remove("open");

    if(typeof openLogin === "function"){
      openLogin();
    }else{
      alert("Önce hesabınıza giriş yapmanız gerekiyor.");
    }
  });

  detail.addEventListener("click",event => {

    if(
      event.target === detail ||
      event.target.closest(".is-close")
    ){
      detail.classList.remove("open");
      return;
    }

    const buy = event.target.closest("[data-buy]");

    if(buy){
      addToCart(Number(buy.dataset.buy));
      detail.classList.remove("open");
      openCart();
    }
  });

  render();

})();
/* İLAN EKLE — KATEGORİ SEÇİM EKRANI */
(() => {
  if (document.getElementById("ilanWizard")) return;

  const categories = [
  { name: "Sosyal Medya", image: "social-media.webp", sub: ["Instagram", "TikTok", "YouTube", "Facebook", "Discord"] },
  { name: "Mobil Oyunlar", image: "mobile-games.webp", sub: ["PUBG Mobile", "PUBG Mobile Lite", "PUBG Mobile Random Hesap", "PUBG Mobile Boost", "PUBG New State"] },
  { name: "Freelancer", image: "freelancer.webp", sub: ["Grafik Tasarım", "Video Montaj", "Yazılım", "Diğer Hizmetler"] },
  { name: "Reklam Satışı", image: "advertising-sales.webp", sub: ["Instagram Reklam", "Facebook Reklam", "TikTok Reklam", "YouTube Reklam"] },
  { name: "MMO Oyunlar", image: "mmo-games.webp", sub: ["Metin2", "Knight Online", "World of Warcraft", "Diğer Oyunlar"] },
  { name: "Boost Hizmetleri", image: "boost-services.webp", sub: ["PUBG Mobile Boost", "Valorant Boost", "League of Legends Boost"] },
  { name: "Platformlar", image: "platforms.webp", sub: ["Steam", "PlayStation", "Xbox", "Epic Games"] },
  { name: "Yazılım Ürünleri", image: "software-products.webp", sub: ["Windows", "Office", "Antivirüs", "Diğer Yazılımlar"] },
  { name: "Random Hesap", image: "random-accounts.webp", sub: ["Random Hesap"] },
  { name: "Diğer Ürün Satışları", image: "other-product-sales.webp", sub: ["Diğer Ürünler"] },
  { name: "Valorant", image: "valorant.webp", sub: ["Valorant Hesap", "Valorant VP", "Valorant Boost"] },
  { name: "Roblox", image: "roblox.webp", sub: ["Roblox Hesap", "Robux", "Roblox Hizmetleri"] },
  { name: "Discord", image: "discord.webp", sub: ["Discord Hesap", "Discord Nitro"] },
  { name: "Growtopia", image: "growtopia.webp", sub: ["Growtopia Hesap", "Growtopia WL"] },
  { name: "PUBG Mobile", image: "pubg-mobile.webp", sub: ["PUBG Mobile", "PUBG Mobile Hesap", "PUBG Mobile Boost"] },
  { name: "Counter Strike 2", image: "counter-strike-2.webp", sub: ["CS2 Hesap", "CS2 Skin"] },
  { name: "Minecraft", image: "minecraft.webp", sub: ["Minecraft Hesap", "Minecraft Sunucu"] }
];

  const wizard = document.createElement("div");
  wizard.id = "ilanWizard";

  wizard.innerHTML = `
    <div class="iw-panel">
      <button class="iw-close" type="button" aria-label="Kapat">×</button>

      <div class="iw-steps">
        <div class="iw-progress"><i></i><i></i><i></i><i></i></div>
        <div class="iw-step-labels">
          <span class="active">▰ Kategori</span>
          <span>▧ Detaylar</span>
          <span>ϟ Doping</span>
          <span>▤ Sözleşme</span>
        </div>
      </div>

      <section class="iw-content">
        <div class="iw-heading">
          <button class="iw-back" type="button" hidden>←</button>
          <h2>Kategori Seçin</h2>
          <span class="iw-selected">Seçim yapılmadı</span>
        </div>

        <input class="iw-search" type="search" placeholder="⌕  Kategori arayın">

        <div class="iw-grid"></div>
        <div class="iw-next-wrap" hidden>
          <button class="iw-next" type="button">Devam Et →</button>
        </div>
      </section>
    </div>
  `;

  const css = document.createElement("style");
  css.textContent = `
    #ilanWizard {
      position:fixed; inset:0; z-index:999999;
      display:none; overflow-y:auto;
      background:rgba(12,14,28,.88);
      color:#f6f6fc; padding:24px 12px 100px;
      box-sizing:border-box;
      font-family:inherit;
    }
    #ilanWizard.open { display:block; }
    #ilanWizard * { box-sizing:border-box; }
    #ilanWizard .iw-panel {
      position:relative; width:100%; max-width:850px;
      margin:10px auto; padding:24px;
      border:1px solid #41445f; border-radius:22px;
      background:#303247;
      box-shadow:0 20px 60px #0006;
    }
    #ilanWizard .iw-close {
      display:block; margin-left:auto; margin-bottom:14px;
      background:transparent; border:0; color:#fff;
      font-size:32px; cursor:pointer;
    }
    #ilanWizard .iw-steps {
      padding:22px 18px; margin-bottom:26px;
      border:1px solid #41445f; border-radius:18px;
    }
    #ilanWizard .iw-progress {
      display:grid; grid-template-columns:repeat(4,1fr); gap:12px;
      margin-bottom:18px;
    }
    #ilanWizard .iw-progress i {
      height:8px; border-radius:20px; background:#1f2131;
    }
    #ilanWizard .iw-progress i:first-child { background:#6862f5; }
    #ilanWizard .iw-step-labels {
      display:grid; grid-template-columns:repeat(4,minmax(0,1fr));
      gap:5px; color:#a9abc0; font-size:13px; text-align:center;
    }
    #ilanWizard .iw-step-labels .active { color:#827bff; }
    #ilanWizard .iw-heading {
      display:flex; align-items:center; flex-wrap:wrap;
      gap:10px; margin-bottom:18px;
    }
    #ilanWizard .iw-heading h2 {
      margin:0; font-size:25px; flex:1;
    }
    #ilanWizard .iw-selected {
      border:1px solid #51536d; border-radius:12px;
      padding:9px 12px; font-size:13px; color:#d6d7e4;
    }
    #ilanWizard .iw-back {
      border:1px solid #51536d; border-radius:10px;
      background:#292b40; color:#fff; padding:8px 12px;
      font-size:20px; cursor:pointer;
    }
    #ilanWizard .iw-search {
      display:block; width:100%; height:58px;
      margin-bottom:24px; padding:0 18px;
      border:1px solid #51536d; border-radius:13px;
      background:#3b3e55; color:white; font:inherit; font-size:16px;
      outline:none;
    }
    #ilanWizard .iw-search::placeholder { color:#a7a9bd; }
    #ilanWizard .iw-grid {
      display:grid; grid-template-columns:repeat(3,minmax(0,1fr));
      gap:14px;
    }
    #ilanWizard .iw-card {
      position:relative; min-width:0; height:205px;
      display:flex; flex-direction:column; justify-content:flex-end;
      align-items:center; padding:14px 8px;
      border:1px solid #4b4e68; border-radius:18px;
      background:linear-gradient(155deg,#424866,#222437 80%);
      color:#fff; overflow:hidden; cursor:pointer;
      text-align:center; font:inherit; font-size:15px;
      transition:transform .15s,border-color .15s;
    }
    #ilanWizard .iw-card:active { transform:scale(.98); }
    #ilanWizard .iw-card::before {
      content:""; position:absolute; inset:0;
      background:linear-gradient(180deg,transparent 15%,rgba(14,15,29,.94) 100%);
      pointer-events:none;
    }
    #ilanWizard .iw-card .iw-icon {
    #ilanWizard .iw-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}

#ilanWizard .iw-card::before {
  z-index: 1;
}

#ilanWizard .iw-card .iw-icon {
  z-index: 2;
}

#ilanWizard .iw-card b {
  z-index: 3;
}
      position:absolute; top:34%; left:50%;
      transform:translate(-50%,-50%);
      font-size:47px; filter:drop-shadow(0 3px 5px #0008);
    }
    #ilanWizard .iw-card b {
      position:relative; z-index:1; line-height:1.35;
      overflow-wrap:anywhere;
    }
    #ilanWizard .iw-card.selected {
      border:2px solid #716aff;
      box-shadow:0 0 0 2px #716aff33;
    }
    #ilanWizard .iw-next-wrap { margin-top:22px; }
    #ilanWizard .iw-next {
      width:100%; padding:15px; border:0; border-radius:12px;
      background:#6862f5; color:#fff; font-size:16px;
      font-weight:700; cursor:pointer;
    }
    @media(max-width:520px) {
      #ilanWizard { padding:12px 10px 90px; }
      #ilanWizard .iw-panel { padding:16px 12px; margin:0 auto; border-radius:18px; }
      #ilanWizard .iw-steps { padding:16px 8px; margin-bottom:18px; }
      #ilanWizard .iw-progress { gap:7px; }
      #ilanWizard .iw-step-labels { font-size:10px; }
      #ilanWizard .iw-heading h2 { font-size:21px; }
      #ilanWizard .iw-selected { font-size:11px; padding:7px 9px; }
      #ilanWizard .iw-search { height:52px; margin-bottom:16px; }
      #ilanWizard .iw-grid { gap:9px; }
      #ilanWizard .iw-card { height:170px; border-radius:14px; font-size:13px; }
      #ilanWizard .iw-card .iw-icon { font-size:38px; }
    }
  `;
  document.head.appendChild(css);
  document.body.appendChild(wizard);

  const grid = wizard.querySelector(".iw-grid");
  const search = wizard.querySelector(".iw-search");
  const heading = wizard.querySelector(".iw-heading h2");
  const selectedBadge = wizard.querySelector(".iw-selected");
  const back = wizard.querySelector(".iw-back");
  const nextWrap = wizard.querySelector(".iw-next-wrap");
  let currentCategory = null;
  let currentSubcategory = null;

  function render(list) {
    grid.innerHTML = "";

    list.forEach(item => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "iw-card";
      button.innerHTML = `
  ${item.image ? `<img class="iw-image" src="${item.image}" alt="">` : ""}
  <span class="iw-icon">${item.image ? "" : (item.icon || "🎮")}</span>
  <b></b>
`;
      button.querySelector("b").textContent = item.name;

      button.addEventListener("click", () => {
        if (currentCategory === null) {
          currentCategory = item;
          currentSubcategory = null;
          heading.textContent = item.name + " kategorileri";
          selectedBadge.textContent = item.name;
          back.hidden = false;
          nextWrap.hidden = true;

          render(item.sub.map(name => ({name, icon: name.toLowerCase().includes("boost") ? "⚡" : "🎯"})));
          search.value = "";
          search.placeholder = "Alt kategori arayın";
        } else {
          currentSubcategory = item.name;
          selectedBadge.textContent = item.name;
          grid.querySelectorAll(".iw-card").forEach(card => {
            card.classList.toggle("selected", card.textContent.includes(item.name));
          });
          nextWrap.hidden = false;
        }
      });

      grid.appendChild(button);
    });
  }

  function reset() {
    currentCategory = null;
    currentSubcategory = null;
    heading.textContent = "Kategori Seçin";
    selectedBadge.textContent = "Seçim yapılmadı";
    back.hidden = true;
    nextWrap.hidden = true;
    search.value = "";
    search.placeholder = "⌕  Kategori arayın";
    render(categories);
  }

  search.addEventListener("input", () => {
    const q = search.value.toLocaleLowerCase("tr");
    if (currentCategory === null) {
      render(categories.filter(item => item.name.toLocaleLowerCase("tr").includes(q)));
    } else {
      render(currentCategory.sub
        .filter(name => name.toLocaleLowerCase("tr").includes(q))
        .map(name => ({name, icon: name.toLowerCase().includes("boost") ? "⚡" : "🎯"})));
    }
  });

  back.addEventListener("click", reset);
  wizard.querySelector(".iw-close").addEventListener("click", () => wizard.classList.remove("open"));

  wizard.addEventListener("click", event => {
    if (event.target === wizard) wizard.classList.remove("open");
  });

  wizard.querySelector(".iw-next").addEventListener("click", () => {
  if (!currentCategory || !currentSubcategory) {
    alert("Lütfen önce kategori ve alt kategori seç.");
    return;
  }

  const content = wizard.querySelector(".iw-content");

  content.innerHTML = `
    <div class="iw-heading">
      <button class="iw-back" type="button">←</button>
      <h2>İlan Detayları</h2>
    </div>

    <p style="color:#aaa;margin-bottom:20px">
      ${currentCategory.name} / ${currentSubcategory}
    </p>

    <label for="iw-type">İlan Türü</label>
    <select id="iw-type" class="iw-search">
      <option>Manuel Teslimat</option>
      <option>Stoklu Ürün</option>
      <option>Alım İlanı</option>
    </select>

    <label for="iw-title">İlan Başlığı</label>
    <input id="iw-title" class="iw-search"
      maxlength="48" placeholder="İlan başlığınızı yazın">

    <label for="iw-description">Açıklama</label>
    <textarea id="iw-description" class="iw-search"
      maxlength="4000" rows="6"
      placeholder="İlanınızı detaylıca anlatın"></textarea>

    <label for="iw-price">Fiyat (TL)</label>
    <input id="iw-price" class="iw-search"
      type="number" min="30" step="0.01"
      placeholder="En az 30 TL">

    <button id="iw-check" class="iw-next" type="button">
      Bilgileri Kontrol Et →
    </button>
  `;

  content.querySelector(".iw-back").addEventListener("click", reset);

  content.querySelector("#iw-check").addEventListener("click", () => {
  const title = content.querySelector("#iw-title").value.trim();
  const description = content.querySelector("#iw-description").value.trim();
  const price = Number(content.querySelector("#iw-price").value);
  const type = content.querySelector("#iw-type").value;
window.ilanFormData = {
  title,
  description,
  price,
  type,
  category: currentCategory.name,
  subcategory: currentSubcategory
};
  if (!title || !description || !Number.isFinite(price) || price < 30) {
    alert("Başlık ve açıklama gir; fiyat en az 30 TL olmalı.");
    return;
  }

  content.innerHTML = `
    <div class="iw-heading">
      <button class="iw-back" type="button">←</button>
      <h2>İlan Görselleri</h2>
    </div>

    <p style="color:#aaa;margin-bottom:16px">
      ${currentCategory.name} / ${currentSubcategory}
    </p>

    <label for="iw-images">İlan fotoğrafları</label>
    <input id="iw-images" class="iw-search"
      type="file" accept="image/*" multiple>

    <div id="iw-preview"
      style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px">
    </div>

    <button id="iw-publish" class="iw-next" type="button">
      İlanı Yayınla
    </button>
  `;

  content.querySelector(".iw-back").addEventListener("click", reset);

  const imageInput = content.querySelector("#iw-images");
  const preview = content.querySelector("#iw-preview");

  imageInput.addEventListener("change", () => {
    preview.innerHTML = "";

    [...imageInput.files].slice(0, 5).forEach(file => {
      if (!file.type.startsWith("image/")) return;

      const img = document.createElement("img");
      img.src = URL.createObjectURL(file);
      img.style.cssText =
        "width:100%;height:130px;object-fit:cover;border-radius:10px";

      preview.appendChild(img);
    });
  });

  content.querySelector("#iw-publish").addEventListener("click", async () => {
  const publishButton = content.querySelector("#iw-publish");
  const supabase = window.itemsatisSupabase;

  if (!supabase) {
    alert("Supabase bağlantısı bulunamadı. Sayfayı yenileyip tekrar dene.");
    return;
  }

  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  const user = sessionData?.session?.user;

  if (sessionError || !user) {
    alert("İlan vermek için önce hesabına giriş yapmalısın.");
    return;
  }

  if (!imageInput.files.length) {
    alert("Lütfen en az bir fotoğraf seç.");
    return;
  }

  const formData = window.ilanFormData;

const title = formData?.title;
const description = formData?.description;
const price = Number(formData?.price);
const type = formData?.type;
  
  if (!title || !description || !Number.isFinite(price) || price < 30) {
    alert("İlan bilgileri eksik veya fiyat 30 TL'den düşük.");
    return;
  }

  publishButton.disabled = true;
  publishButton.textContent = "İlan yayınlanıyor...";

  try {
    const imageUrls = [];

    for (const file of [...imageInput.files].slice(0, 5)) {
      if (!file.type.startsWith("image/")) continue;

      if (file.size > 5 * 1024 * 1024) {
        throw new Error("Her fotoğraf en fazla 5 MB olabilir.");
      }

      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `${user.id}/${crypto.randomUUID()}-${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from("listing-images")
        .upload(path, file, { upsert: false });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("listing-images")
        .getPublicUrl(path);

      imageUrls.push(urlData.publicUrl);
    }

    if (!imageUrls.length) {
      throw new Error("Geçerli bir fotoğraf seçmelisin.");
    }

    const { error: insertError } = await supabase
      .from("listings")
      .insert({
        user_id: user.id,
        category: formData.category,
subcategory: formData.subcategory,
listing_type: formData.type,
        title,
        description,
        price,
        image_urls: imageUrls,
        status: "pending"
      });

    if (insertError) throw insertError;

    alert("İlanın başarıyla kaydedildi! Onay bekliyor.");
    reset();
    wizard.classList.remove("open");
  } catch (error) {
    console.error("İlan yayınlama hatası:", error);
    alert("İlan kaydedilemedi: " + (error.message || "Bilinmeyen hata"));
  } finally {
    if (publishButton.isConnected) {
      publishButton.disabled = false;
      publishButton.textContent = "İlanı Yayınla";
    }
  }
});

document.addEventListener(“click”, event => {
const button = event.target.closest(
“.drawer-actions button:first-child, #addListingButton, .add-listing-btn”
);

if (!button) return;

event.preventDefault();
reset();
wizard.classList.add(“open”);
});

render(categories);
})();