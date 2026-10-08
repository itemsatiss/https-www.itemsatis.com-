(() => {
  const cfg = window.ITEMSATIS_SUPABASE_URL && window.ITEMSATIS_SUPABASE_ANON_KEY;
  const configured = cfg &&
    !window.ITEMSATIS_SUPABASE_URL.includes("BURAYA_") &&
    !window.ITEMSATIS_SUPABASE_ANON_KEY.includes("BURAYA_");

  const modal = document.getElementById("loginModal");
  const title = document.getElementById("authTitle");
  const subtitle = document.getElementById("authSubtitle");
  const email = document.getElementById("authEmail");
  const password = document.getElementById("authPassword");
  const emailBtn = document.getElementById("emailAuth");
  const switchBtn = document.getElementById("switchAuth");
  const googleBtn = document.getElementById("googleAuth");
  const facebookBtn = document.getElementById("facebookAuth");
  const logoutBtn = document.getElementById("logoutAuth");
  const status = document.getElementById("authStatus");
  const toggle = document.getElementById("togglePassword");

  let signUpMode = false;
  let supabase = null;

  function msg(text, type="") {
    status.textContent = text;
    status.className = "auth-status" + (type ? " " + type : "");
  }

  function setMode(signup) {
    signUpMode = signup;
    title.textContent = signup ? "Ücretsiz Üye Ol" : "Giriş Yap";
    subtitle.textContent = signup
      ? "E-posta ve şifrenizle ücretsiz hesabınızı oluşturun."
      : "Hesabınızla giriş yapın veya ücretsiz hesap oluşturun.";
    emailBtn.textContent = signup ? "Üye Ol" : "Giriş Yap";
    switchBtn.textContent = signup
      ? "Zaten hesabın var mı? Giriş Yap"
      : "Hesabın yok mu? Ücretsiz üye ol";
    password.setAttribute("autocomplete", signup ? "new-password" : "current-password");
    msg("");
  }
  const accountPanel = document.createElement("div");

  accountPanel.innerHTML = `
    <div class="account-panel">
      <button class="account-close">×</button>

      <div class="account-user">
        <div class="account-avatar">👤</div>
        <div>
          <h2 class="account-name">Hesabım</h2>
          <p class="account-email"></p>
        </div>
      </div>

      <div class="account-balance">
        <div>
          <b>0,00 ₺</b>
          <span>Bakiye</span>
        </div>
        <div>
          <b>0,00 ₺</b>
          <span>Çekilebilir Bakiye</span>
        </div>
      </div>

      <button class="account-action verify">🪪　Kimlik Doğrula</button>

      <div class="account-two">
        <button class="account-action">💳　Bakiye Yükle</button>
        <button class="account-action">💸　Para Çek</button>
      </div>

      <button class="account-action add-listing">＋　İlan Ekle</button>
      <button class="account-action">⚙️　Kontrol Merkezi</button>
    </div>
  `;

  const accountOverlay = document.createElement("div");
  accountOverlay.className = "account-overlay";
  accountOverlay.appendChild(accountPanel.firstElementChild);
  document.body.appendChild(accountOverlay);

  const accountCSS = document.createElement("style");
  accountCSS.textContent = `
    .account-overlay{
      position:fixed;
      inset:0;
      z-index:999999;
      display:none;
      align-items:flex-end;
      background:rgba(0,0,0,.65);
    }

    .account-overlay.open{
      display:flex;
    }

    .account-panel{
      width:100%;
      box-sizing:border-box;
      padding:24px 18px 30px;
      background:#292c42;
      color:white;
      border-radius:26px 26px 0 0;
    }

    .account-close{
      float:right;
      border:0;
      background:#41465f;
      color:white;
      width:38px;
      height:38px;
      border-radius:50%;
      font-size:27px;
    }

    .account-user{
      display:flex;
      align-items:center;
      gap:14px;
      margin:8px 0 22px;
    }

    .account-avatar{
      width:62px;
      height:62px;
      border-radius:50%;
      overflow:hidden;
      background:#454a68;
      display:flex;
      align-items:center;
      justify-content:center;
      font-size:30px;
    }

    .account-avatar img{
      width:100%;
      height:100%;
      object-fit:cover;
    }

    .account-name{
      margin:0 0 4px;
      font-size:22px;
    }

    .account-email{
      margin:0;
      color:#b8c0e8;
      font-size:13px;
    }

    .account-balance{
      display:grid;
      grid-template-columns:1fr 1fr;
      gap:10px;
      margin-bottom:12px;
    }

    .account-balance div{
      padding:18px 14px;
      background:#414765;
      border-radius:15px;
    }

    .account-balance b{
      display:block;
      font-size:21px;
    }

    .account-balance span{
      display:block;
      margin-top:5px;
      color:#b8c0e8;
      font-size:13px;
    }

    .account-action{
      width:100%;
      min-height:54px;
      border:0;
      border-radius:14px;
      margin-top:10px;
      background:#3b405b;
      color:white;
      font-size:16px;
      font-weight:500;
    }

    .account-action.verify{
      background:#2867dc;
      min-height:62px;
    }

    .account-two{
      display:grid;
      grid-template-columns:1fr 1fr;
      gap:10px;
    }

    .account-action.add-listing{
      background:#5557e8;
      min-height:58px;
    }
  `;
  document.head.appendChild(accountCSS);

  function openAccountPanel(){
    if(!window.ITEMSATIS_AUTH_USER) return;
    
    const user = window.ITEMSATIS_AUTH_USER;
    const emailEl = accountOverlay.querySelector(".account-email");
    const nameEl = accountOverlay.querySelector(".account-name");
    const avatarEl = accountOverlay.querySelector(".account-avatar");

    emailEl.textContent = user.email || "Hesabınız";

    nameEl.textContent =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      "Hesabım";

    const avatar =
      user.user_metadata?.avatar_url ||
      user.user_metadata?.picture;

    avatarEl.innerHTML = avatar
      ? '<img src="' + avatar + '" alt="Profil">'
      : "👤";

    accountOverlay.classList.add("open");loadWallet(user);
  }

  window.itemsatisOpenProfile = openAccountPanel;

  accountOverlay.addEventListener("click", (e) => {
    if(
      e.target === accountOverlay ||
      e.target.closest(".account-close")
    ){
      accountOverlay.classList.remove("open");
    }
  });
  function openAuth() {
  if (
    window.ITEMSATIS_AUTH_USER &&
    typeof window.itemsatisOpenProfile === "function"
  ) {
    window.itemsatisOpenProfile();
    return;
  }

  if (typeof openLogin === "function") openLogin();
  setMode(false);
}

  // Replace the existing top/bottom login hooks with the auth-aware handler.
  document.getElementById("bottomLogin")?.addEventListener("click", openAuth);
  document.getElementById("drawerLogin")?.addEventListener("click", () => {
    if (typeof closeMenu === "function") closeMenu();
    openAuth();
  });
  document.getElementById("loginOpen")?.addEventListener("click", openAuth);

  switchBtn.addEventListener("click", () => setMode(!signUpMode));
  toggle.addEventListener("click", () => {
    password.type = password.type === "password" ? "text" : "password";
  });

  async function oauth(provider) {
    if (!configured || !supabase) {
      msg("Önce Supabase bağlantısını ayarlamak gerekiyor.", "error");
      return;
    }
    msg("Yönlendiriliyor...");
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin + window.location.pathname }
    });
    if (error) msg(error.message, "error");
  }

  googleBtn.addEventListener("click", () => oauth("google"));
  facebookBtn.addEventListener("click", () => oauth("facebook"));

  emailBtn.addEventListener("click", async () => {
    if (!configured || !supabase) {
      msg("Önce Supabase bağlantısını ayarlamak gerekiyor.", "error");
      return;
    }
    const e = email.value.trim();
    const p = password.value;
    if (!e || !p) return msg("E-posta ve şifreyi doldur.", "error");
    if (p.length < 6) return msg("Şifre en az 6 karakter olmalı.", "error");

    emailBtn.disabled = true;
    msg(signUpMode ? "Hesap oluşturuluyor..." : "Giriş yapılıyor...");

    let result;
    if (signUpMode) {
      result = await supabase.auth.signUp({
        email: e,
        password: p,
        options: { emailRedirectTo: window.location.origin + window.location.pathname }
      });
    } else {
      result = await supabase.auth.signInWithPassword({ email: e, password: p });
    }

    emailBtn.disabled = false;

    if (result.error) {
      msg(result.error.message, "error");
      return;
    }

    if (signUpMode && !result.data.session) {
      msg("Hesap oluşturuldu. E-posta adresini doğrula.", "ok");
    } else {
      msg("Giriş başarılı.", "ok");
      setTimeout(() => { if (typeof closeLogin === "function") closeLogin(); }, 700);
    }
  });

  logoutBtn.addEventListener("click", async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    updateUser(null);
    msg("Çıkış yapıldı.", "ok");
  });
async function loadWallet(user) {
  if (!supabase || !user || !accountOverlay) return;

  const { data, error } = await supabase
    .from("wallets")
    .select("balance, withdrawable_balance")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Wallet error:", error);
    return;
  }

  const balances = accountOverlay.querySelectorAll(
    ".account-balance div b"
  );

  if (balances[0]) {
    balances[0].textContent =
      Number(data?.balance || 0).toFixed(2).replace(".", ",") + " ₺";
  }

  if (balances[1]) {
    balances[1].textContent =
      Number(data?.withdrawable_balance || 0)
        .toFixed(2)
        .replace(".", ",") + " ₺";
  }
}
  function updateUser(user) {
    window.ITEMSATIS_AUTH_USER = user || null;
    const label = document.querySelector("#bottomLogin span");
    if (label) label.textContent = user ? "Hesabım" : "Giriş Yap";
    logoutBtn.hidden = !user;
    if (user) {
      title.textContent = "Hesabım";
      loadWallet(user);
      subtitle.textContent = user.email || "Oturum açık";
      email.value = user.email || "";
      emailBtn.style.display = "none";
      switchBtn.style.display = "none";
      googleBtn.style.display = "none";
      facebookBtn.style.display = "none";
      document.querySelector(".or").style.display = "none";
      email.style.display = "none";
      password.parentElement.style.display = "none";
      password.closest(".password").previousElementSibling.style.display = "none";
      logoutBtn.hidden = false;
    } else {
      emailBtn.style.display = "";
      switchBtn.style.display = "";
      googleBtn.style.display = "";
      facebookBtn.style.display = "";
      document.querySelector(".or").style.display = "";
      email.style.display = "";
      password.closest(".password").style.display = "";
      password.closest(".password").previousElementSibling.style.display = "";
      setMode(false);
    }
  }

  if (configured && window.supabase) {
    supabase = window.supabase.createClient(
      window.ITEMSATIS_SUPABASE_URL,
      window.ITEMSATIS_SUPABASE_ANON_KEY
    );
    supabase.auth.getSession().then(({ data }) => updateUser(data.session?.user || null));
    supabase.auth.onAuthStateChange((_event, session) => updateUser(session?.user || null));
  } else {
    // Keep the UI usable until the user fills in their own Supabase project values.
    updateUser(null);
  }
})();
const adminScript = document.createElement("script");
adminScript.src = "admin.js";
document.body.appendChild(adminScript);