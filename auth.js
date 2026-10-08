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

    <div class="account-head">
      <div class="account-user">
        <div class="account-avatar">👤</div>

        <div class="account-user-text">
          <div class="account-name">Hesabım</div>
          <div class="account-email"></div>
        </div>
      </div>

      <button class="account-close" type="button">×</button>
    </div>
    <div class="account-dashboard">

      <div class="account-profile-card">
        <div class="account-profile-avatar">👤</div>

        <div class="account-profile-info">
          <div class="account-profile-name">Hesabım</div>
          <div class="account-profile-link">Profili Gör</div>
        </div>

        <div class="account-wallet">
          <div class="account-wallet-icon">▱</div>
          <div class="account-balance">
            <div><b>0,00 ₺</b></div>
            <div>Bakiyeniz</div>
          </div>
        </div>
      </div>

      <div class="account-withdrawable">
        <div class="account-withdrawable-icon">⇩</div>
        <div>
          <div><b>0,00 ₺</b></div>
          <span>Çekilebilir Bakiye</span>
        </div>
      </div>

      <button class="account-verify">
        🛡️ <span>Kimlik Doğrula</span>
      </button>

      <div class="account-money-buttons">
        <button class="account-add-money">💵 &nbsp; Bakiye Yükle</button>
        <button class="account-withdraw">⇩ &nbsp; Para Çek</button>
      </div>

      <button class="account-add-listing">
        ＋ &nbsp; İlan Ekle
      </button>

    </div>
    <div class="account-menu">

      <button class="account-menu-item">
        <span class="account-menu-icon">⚙</span>
        <span>Kontrol Merkezi</span>
        <b>›</b>
      </button>

      <button class="account-menu-item">
        <span class="account-menu-icon">▣</span>
        <span>Üyelik Paketleri</span>
        <b>›</b>
      </button>

      <button class="account-menu-item">
        <span class="account-menu-icon">🛒</span>
        <span>Siparişlerim</span>
        <b>›</b>
      </button>

      <button class="account-menu-item">
        <span class="account-menu-icon">▤</span>
        <span>İlanlarım</span>
        <b>›</b>
      </button>

      <button class="account-menu-item">
        <span class="account-menu-icon">▥</span>
        <span>Sattığım İlanlar</span>
        <b>›</b>
      </button>

      <button class="account-menu-item">
        <span class="account-menu-icon">🛒</span>
        <span>Sepetim</span>
        <b>›</b>
      </button>

      <button class="account-menu-item">
        <span class="account-menu-icon">◉</span>
        <span>Destek Sistemi</span>
        <b>›</b>
      </button>

    </div>

    <button class="account-logout-menu" type="button">
      <span>↪</span>
      <span>Çıkış Yap</span>
    </button>

  </div>`;


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
  justify-content:center;
  background:rgba(7,9,20,.72);
  backdrop-filter:blur(8px);
}

.account-overlay.open{
  display:flex;
}

.account-panel{
  width:100%;
  max-width:709px;
  max-height:92vh;
  overflow-y:auto;
  box-sizing:border-box;
  padding:20px 14px 28px;
  background:#303249;
  color:#fff;
  border-radius:26px 26px 0 0;
  box-shadow:0 -15px 50px rgba(0,0,0,.45);
}

.account-head{
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:4px 6px 20px;
}

.account-user{
  display:flex;
  align-items:center;
  gap:14px;
}

.account-avatar{
  width:58px;
  height:58px;
  flex:none;
  border-radius:50%;
  overflow:hidden;
  display:flex;
  align-items:center;
  justify-content:center;
  background:#454a67;
  border:2px solid rgba(255,255,255,.12);
  font-size:28px;
}

.account-avatar img{
  width:100%;
  height:100%;
  object-fit:cover;
}

.account-name{
  color:#fff;
  font-size:20px;
  font-weight:700;
}

.account-email{
  color:#aeb3c8;
  font-size:13px;
  margin-top:5px;
}

.account-close{
  width:42px;
  height:42px;
  border:0;
  border-radius:50%;
  background:#464b64;
  color:#fff;
  font-size:30px;
  line-height:42px;
}

.account-menu{
  display:flex;
  flex-direction:column;
  gap:7px;
}

.account-menu-item{
  width:100%;
  min-height:61px;
  display:flex;
  align-items:center;
  gap:14px;
  padding:0 14px;
  box-sizing:border-box;
  border:0;
  border-radius:15px;
  background:#393e59;
  color:#f5f5f8;
  text-align:left;
  font-size:16px;
}

.account-menu-item:active{
  transform:scale(.985);
  background:#454b68;
}

.account-menu-icon{
  width:35px;
  height:35px;
  flex:none;
  display:flex;
  align-items:center;
  justify-content:center;
  border-radius:10px;
  background:#484e6c;
  color:#fff;
  font-size:18px;
}

.account-menu-item span:nth-child(2){
  flex:1;
  font-weight:500;
}

.account-menu-item b{
  color:#a4a9bf;
  font-size:25px;
  font-weight:400;
}

.account-logout-menu{
  width:100%;
  height:58px;
  margin-top:15px;
  display:flex;
  align-items:center;
  justify-content:center;
  gap:10px;
  border:0;
  border-radius:15px;
  background:#874052;
  color:#ffb1b8;
  font-size:17px;
  font-weight:600;
}

.account-logout-menu:active{
  transform:scale(.985);
}

@media(max-width:520px){
  .account-panel{
    padding:20px 14px 25px;
  }

  .account-menu-item{
    min-height:58px;
    font-size:15px;
  }

  .account-name{
    font-size:19px;
  }
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

  
  googleBtn.addEventListener("click", () => {
  alert("GOOGLE BUTON ÇALIŞTI");
  oauth("google");
});

  

  
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
  if (!user || !accountOverlay) return;

  try {
    const client = supabase;

    if (!client) return;

    const { data: currentUser } = await client.auth.getUser();

    const userId = currentUser?.user?.id || user.id;

    const { data, error } = await client
      .from("wallets")
      .select("balance, withdrawable_balance")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Wallet error:", error);
      return;
    }

    const balances = accountOverlay.querySelectorAll(
      ".account-balance div b"
    );

    const balance =
      Number(data?.balance || 0)
        .toFixed(2)
        .replace(".", ",") + " ₺";

    const withdrawable =
      Number(data?.withdrawable_balance || 0)
        .toFixed(2)
        .replace(".", ",") + " ₺";

    if (balances[0]) {
      balances[0].textContent = balance;
    }

    if (balances[1]) {
      balances[1].textContent = withdrawable;
    }

  } catch (err) {
    console.error("Wallet load error:", err);
  }
}function updateUser(user) {
    window.ITEMSATIS_AUTH_USER = user || null;
    const label = document.querySelector("#bottomLogin span");
    if (label) label.textContent = user ? "Hesabım" : "Giriş Yap";
    logoutBtn.hidden = !user;
    if (user) {
      loadWallet(user);
      title.textContent = "Hesabım"; 
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