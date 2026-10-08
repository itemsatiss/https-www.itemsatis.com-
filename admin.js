(() => {
  const ADMIN_EMAIL = "pubgtemplateform@gmail.com";

  function startAdmin() {
    if (document.getElementById("adminWalletButton")) return;

    const user = window.ITEMSATIS_AUTH_USER;

    if (!user) {
      setTimeout(startAdmin, 1000);
      return;
    }

    if ((user.email || "").toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      return;
    }

    const btn = document.createElement("button");

    btn.id = "adminWalletButton";
    btn.textContent = "⚙️ Admin Paneli";

    btn.style.cssText = `
      position:fixed;
      right:14px;
      bottom:150px;
      z-index:999999;
      background:#e94b5f;
      color:white;
      border:0;
      border-radius:14px;
      padding:13px 17px;
      font-size:15px;
      font-weight:700;
      box-shadow:0 8px 25px rgba(0,0,0,.35);
    `;

    document.body.appendChild(btn);

    btn.onclick = () => {
      const email = prompt("Kullanıcının Gmail adresini yaz:");

      if (!email) return;

      const amount = prompt("Kaç ₺ bakiye eklensin?");

      if (!amount || Number(amount) <= 0) return;

      const client = window.supabase.createClient(
        window.ITEMSATIS_SUPABASE_URL,
        window.ITEMSATIS_SUPABASE_ANON_KEY
      );

      client.rpc("admin_add_balance", {
        p_email: email.trim(),
        p_amount: Number(amount)
      }).then(({ error }) => {

        if (error) {
          alert("Hata: " + error.message);
          return;
        }

        alert(Number(amount).toFixed(2) + " ₺ bakiye eklendi.");
      });
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startAdmin);
  } else {
    startAdmin();
  }
})();