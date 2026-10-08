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

  function updateUser(user) {
    const label = document.querySelector("#bottomLogin span");
    if (label) label.textContent = user ? "Hesabım" : "Giriş Yap";
    logoutBtn.hidden = !user;
    if (user) {
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
