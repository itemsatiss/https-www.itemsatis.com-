(() => {
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

  let cart = JSON.parse(localStorage.getItem("itemsatis_cart") || "[]");
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
      selectedCategory = category.dataset.cat;
      render();
      return;
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
