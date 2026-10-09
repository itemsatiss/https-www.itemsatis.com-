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

      <button class="account-close" type="button" onclick="this.closest('.account-overlay').classList.remove('open'); this.closest('.account-overlay').style.setProperty('display','none','important')">×</button>
    </div>
    

      <div class="account-dashboard">

  <div class="account-profile-card">
    <div class="account-profile-avatar">
      👤
    </div>

    <div class="account-profile-info">
      <div class="account-profile-name">ggGrandPhoenix51...</div>
      <div class="account-profile-link">Profili Gör</div>
    </div>

    <div class="account-wallet">
      <div class="account-wallet-icon">▱</div>
      <div class="account-balance">
        <div><b>0.00 ₺</b></div>
        <div>Bakiyeniz</div>
      </div>
    </div>
  </div>

  <div class="account-withdrawable">
  <div class="account-withdrawable-icon">⇩</div>

  <div>
    <div class="account-withdrawable-value">
      <b>0.00 ₺</b>
    </div>

    <span>Çekilebilir Bakiye</span>
  </div>
</div>

  <button class="account-verify">
    🛡️ &nbsp; Kimlik Doğrula
  </button>

  <div class="account-money-buttons">
    <button class="account-add-money">
      💵 &nbsp; Bakiye Yükle
    </button>

    <button class="account-withdraw">
      ⇩ &nbsp; Para Çek
    </button>
  </div>

  <button class="account-add-listing">
    ＋ &nbsp; İlan Ekle
  </button>

</div>
    <div class="account-menu">

      <button class="account-menu-item" id="supportOpen" type="button">
  <span class="account-menu-icon">◉</span>
  <span>Destek Sistemi</span>
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
  position:relative;
z-index:1000000;
pointer-events:auto;
cursor:pointer;
  width:42px;
  height:42px;
  border:0;
  border-radius:50%;
  background:#464b64;
  color:#fff;
  font-size:30px;
  line-height:42px;
}
.account-dashboard{
  width:100%;
  display:flex;
  flex-direction:column;
  gap:22px;
  margin:8px 0 28px;
}

.account-profile-card{
  width:100%;
  min-height:155px;
  padding:22px 28px;
  box-sizing:border-box;
  display:flex;
  align-items:center;
  gap:20px;
  border-radius:22px;
  background:#454d7b;
}

.account-profile-avatar{
  width:72px;
  height:72px;
  flex:none;
  border-radius:50%;
  display:flex;
  align-items:center;
  justify-content:center;
  overflow:hidden;
  background:#08735f;
  color:#fff;
  font-size:34px;
}

.account-profile-avatar img{
  width:100%;
  height:100%;
  object-fit:cover;
}

.account-profile-info{
  min-width:0;
  flex:1;
}

.account-profile-name{
  color:#fff;
  font-size:24px;
  font-weight:400;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
}

.account-profile-link{
  margin-top:7px;
  color:#aebcff;
  font-size:18px;
}

.account-wallet{
  display:flex;
  align-items:center;
  gap:10px;
  flex:0 1 auto;
  min-width:0;
}

.account-wallet-icon{
  font-size:42px;
  color:#d4dcff;
  flex:none;
}

.account-balance{
  min-width:0;
  width:auto;
  text-align:right;
  overflow:hidden;
}

.account-balance b{
  color:#fff;
  font-size:20px;
  font-weight:500;
  white-space:nowrap;
}

.account-balance div:last-child{
  margin-top:5px;
  color:#aebcff;
  font-size:15px;
  white-space:nowrap;
}

.account-wallet-icon{
  font-size:54px;
  color:#d4dcff;
}

.account-balance{
  min-width:145px;
  text-align:right;
}

.account-balance b{
  color:#fff;
  font-size:27px;
  font-weight:500;
}

.account-balance div:last-child{
  margin-top:7px;
  color:#aebcff;
  font-size:18px;
}

.account-withdrawable{
  width:100%;
  min-height:130px;
  padding:25px 32px;
  box-sizing:border-box;
  display:flex;
  align-items:center;
  gap:25px;
  border-radius:22px;
  background:#39537f;
}

.account-withdrawable-icon{
  width:65px;
  flex:none;
  text-align:center;
  color:#dbe3ff;
  font-size:52px;
}

.account-withdrawable b{
  color:#fff;
  font-size:28px;
  font-weight:500;
}

.account-withdrawable span{
  display:block;
  margin-top:8px;
  color:#9ecbff;
  font-size:19px;
}

.account-verify{
  width:100%;
  height:78px;
  border:0;
  border-radius:17px;
  background:#2864df;
  color:#fff;
  font-size:24px;
  font-weight:500;
}

.account-money-buttons{
  width:100%;
  display:grid;
  grid-template-columns:1.25fr .85fr;
  gap:20px;
}

.account-money-buttons button{
  height:78px;
  border:0;
  border-radius:17px;
  color:#fff;
  font-size:21px;
  font-weight:500;
}

.account-add-money{
  background:#5144d7;
}

.account-withdraw{
  background:#2864df;
}

.account-add-listing{
  width:100%;
  height:78px;
  border:0;
  border-radius:18px;
  background:#6265ed;
  color:#fff;
  font-size:24px;
  font-weight:500;
}

@media(max-width:520px){

  .account-dashboard{
  width:100%;
  display:flex;
  flex-direction:column;
  gap:14px;
  margin:8px 0 20px;
  box-sizing:border-box;
}

.account-profile-card{
  width:100%;
  min-height:120px;
  padding:16px;
  display:grid;
  grid-template-columns:58px minmax(0,1fr) 125px;
  align-items:center;
  gap:10px;
  box-sizing:border-box;
  border-radius:16px;
  background:#454d7b;
  overflow:hidden;
}

.account-profile-avatar{
  width:58px;
  height:58px;
  border-radius:50%;
  display:flex;
  align-items:center;
  justify-content:center;
  overflow:hidden;
  background:#08735f;
  color:#fff;
  font-size:27px;
}

.account-profile-avatar img{
  width:100%;
  height:100%;
  object-fit:cover;
}

.account-profile-info{
  min-width:0;
  overflow:hidden;
}

.account-profile-name{
  color:#fff;
  font-size:18px;
  font-weight:400;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
}

.account-profile-link{
  margin-top:4px;
  color:#aebcff;
  font-size:15px;
}

.account-wallet{
  min-width:0;
  display:flex;
  align-items:center;
  justify-content:flex-end;
  gap:7px;
  overflow:hidden;
}

.account-wallet-icon{
  flex:none;
  font-size:38px;
  color:#d4dcff;
}

.account-balance{
  min-width:0;
  overflow:hidden;
  text-align:right;
}

.account-balance b{
  display:block;
  color:#fff;
  font-size:19px;
  font-weight:400;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
}

.account-balance div:last-child{
  margin-top:4px;
  color:#aebcff;
  font-size:15px;
  white-space:nowrap;
}

.account-withdrawable{
  width:100%;
  min-height:105px;
  padding:18px;
  display:flex;
  align-items:center;
  gap:15px;
  box-sizing:border-box;
  border-radius:16px;
  background:#39537f;
}

.account-withdrawable-icon{
  width:45px;
  flex:none;
  text-align:center;
  color:#dbe3ff;
  font-size:38px;
}

.account-withdrawable b{
  color:#fff;
  font-size:21px;
  font-weight:400;
}

.account-withdrawable span{
  display:block;
  margin-top:5px;
  color:#9ecbff;
  font-size:16px;
}

.account-verify{
  width:100%;
  height:65px;
  border:0;
  border-radius:15px;
  background:#2864df;
  color:#fff;
  font-size:19px;
  font-weight:400;
}

.account-money-buttons{
  width:100%;
  display:grid;
  grid-template-columns:1.25fr .9fr;
  gap:12px;
}

.account-money-buttons button{
  width:100%;
  height:65px;
  border:0;
  border-radius:15px;
  color:#fff;
  font-size:17px;
  font-weight:400;
}

.account-add-money{
  background:#5144d7;
}

.account-withdraw{
  background:#2864df;
}

.account-add-listing{
  width:100%;
  height:65px;
  border:0;
  border-radius:15px;
  background:#6265ed;
  color:#fff;
  font-size:20px;
  font-weight:400;
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
  font-weight:400;
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

    accountOverlay.style.removeProperty("display");
accountOverlay.classList.add("open");
loadWallet(user);
  }

  window.itemsatisOpenProfile = openAccountPanel;

  accountOverlay.addEventListener("click", (e) => {
  const closeButton = e.target.closest(".account-close");

  if (e.target === accountOverlay || closeButton) {
    e.preventDefault();
    e.stopPropagation();
    accountOverlay.classList.remove("open");
    accountOverlay.style.setProperty("display", "none", "important");
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

  const loginModal = document.getElementById("loginModal");

  if (loginModal) {
  loginModal.style.removeProperty("display");
  loginModal.classList.add("open");
}

  setMode(false);
}

const accountLogoutButton =
  accountOverlay.querySelector(".account-logout-menu");

accountLogoutButton?.addEventListener("click", async () => {
  if (!supabase) return;

  const { error } = await supabase.auth.signOut();

  if (error) {
    alert("Çıkış yapılamadı: " + error.message);
    console.error(error);
    return;
  }

  accountOverlay.classList.remove("open");
  accountOverlay.style.removeProperty("display");
  updateUser(null);
});
  // Replace the existing top/bottom login hooks with the auth-aware handler.
  document.getElementById("bottomLogin")?.addEventListener("click", openAuth);
  document.getElementById("loginOpen")?.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();

  if (window.ITEMSATIS_AUTH_USER) {
    window.itemsatisOpenProfile?.();
  } else {
    openAuth();
  }
});
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
    const withdrawableEl = accountOverlay.querySelector(
  ".account-withdrawable-value b"
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

    if (withdrawableEl) {
  withdrawableEl.textContent = withdrawable;
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
// CANLI DESTEK SİSTEMİ
document.addEventListener("click", function (event) {
  document.getElementById("loginClose")?.addEventListener("click", function(e) {
  e.preventDefault();
  document.getElementById("loginModal")?.classList.remove("open");
  document.getElementById("loginModal")?.style.setProperty("display", "none", "important");
});
  if (event.target.closest("#supportOpen")) {
    openSupportChat();
  }
});

function openSupportChat() {
  if (document.getElementById("supportChatOverlay")) return;

  const overlay = document.createElement("div");
  overlay.id = "supportChatOverlay";

  overlay.innerHTML = `
    <div class="support-chat-panel">
      <div class="support-chat-header">
        <button id="supportBack">‹</button>
        <div>
          <b>Canlı Destek</b>
          <span>Destek ekibi</span>
        </div>
        <button id="supportClose">×</button>
      </div>

      <div id="supportMessages" class="support-messages">
        <div class="support-welcome">
          Merhaba 👋<br>
          Size nasıl yardımcı olabiliriz?
        </div>
      </div>

      <div class="support-input-area">
        <input
          id="supportInput"
          type="text"
          placeholder="Mesajınızı yazın..."
          autocomplete="off"
        >
        <button id="supportSend">➤</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
    const chatClient = window.supabase.createClient(
    window.ITEMSATIS_SUPABASE_URL,
    window.ITEMSATIS_SUPABASE_ANON_KEY
  );

  const messagesBox = document.getElementById("supportMessages");
  const input = document.getElementById("supportInput");
  const sendBtn = document.getElementById("supportSend");

  let chatUser = null;
  let lastMessageId = 0;

  async function loadSupportMessages() {
    if (!chatUser) return;

    const { data, error } = await chatClient
      .from("support_messages")
      .select("*")
      .eq("user_id", chatUser.id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Destek mesajları:", error.message);
      return;
    }

    messagesBox.innerHTML = "";

    if (!data.length) {
      messagesBox.innerHTML =
        '<div class="support-welcome">Merhaba 👋<br>Size nasıl yardımcı olabiliriz?</div>';
      return;
    }

    data.forEach((item) => {
      const bubble = document.createElement("div");
      bubble.textContent =
        (item.sender === "support" ? "Destek: " : "Siz: ") +
        item.message;

      bubble.style.cssText = `
        margin:10px 0;
        padding:12px;
        border-radius:12px;
        background:${item.sender === "support" ? "#41445f" : "#5144d7"};
        color:white;
        overflow-wrap:anywhere;
      `;

      messagesBox.appendChild(bubble);
      lastMessageId = Math.max(lastMessageId, Number(item.id) || 0);
    });

    messagesBox.scrollTop = messagesBox.scrollHeight;
  }

  async function sendSupportMessage() {
    const message = input.value.trim();

    if (!message || !chatUser) return;

    sendBtn.disabled = true;

    const { error } = await chatClient
      .from("support_messages")
      .insert({
        user_id: chatUser.id,
        sender: "user",
        message
      });

    sendBtn.disabled = false;

    if (error) {
      alert("Mesaj gönderilemedi: " + error.message);
      return;
    }

    input.value = "";
    await loadSupportMessages();
  }

  chatClient.auth.getUser().then(({ data, error }) => {
    if (error || !data.user) {
      messagesBox.textContent = "Canlı desteği kullanmak için giriş yapmalısınız.";
      return;
    }

    chatUser = data.user;
    loadSupportMessages();

    setInterval(() => {
      if (document.getElementById("supportChatOverlay")) {
        loadSupportMessages();
      }
    }, 3000);
  });

  sendBtn.onclick = sendSupportMessage;

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") sendSupportMessage();
  });

  document.getElementById("supportClose").onclick = () => {
    overlay.remove();
  };

  document.getElementById("supportBack").onclick = () => {
    overlay.remove();
  };
}
/* GIRIS VE HESAP KAPATMA */
document.addEventListener("click", function (event) {
  const close = event.target.closest("#loginClose, .account-close");
  if (!close) return;

  event.preventDefault();
  event.stopPropagation();

  const login = document.getElementById("loginModal");
  const account = document.querySelector(".account-overlay");

  if (close.matches(".account-close") && account) {
    account.classList.remove("open");
account.style.setProperty("display", "none", "important");
  }

  if (close.matches("#loginClose") && login) {
    login.classList.remove("open");
    login.style.removeProperty("display");
  }
}, true);
