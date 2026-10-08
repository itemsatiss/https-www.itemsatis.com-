(() => {
  const ADMIN_EMAIL = "pubgtemplateform@gmail.com";

  function getClient() {
    if (
      !window.supabase ||
      !window.ITEMSATIS_SUPABASE_URL ||
      !window.ITEMSATIS_SUPABASE_ANON_KEY
    ) return null;

    return window.supabase.createClient(
      window.ITEMSATIS_SUPABASE_URL,
      window.ITEMSATIS_SUPABASE_ANON_KEY
    );
  }

  async function initAdmin() {
    const client = getClient();
    if (!client) return;

    const { data: { session } } = await client.auth.getSession();
    const email = session?.user?.email?.toLowerCase();

    if (email !== ADMIN_EMAIL.toLowerCase()) return;

    const btn = document.createElement("button");
    btn.textContent = "⚙️ Admin Paneli";
    btn.style.cssText =
      "position:fixed;right:14px;bottom:86px;z-index:99998;" +
      "background:#e94b5f;color:#fff;border:0;border-radius:14px;" +
      "padding:12px 16px;font-weight:700;box-shadow:0 8px 25px rgba(0,0,0,.3);";

    document.body.appendChild(btn);

    const overlay = document.createElement("div");

    overlay.style.cssText =
      "display:none;position:fixed;inset:0;z-index:99999;" +
      "background:rgba(0,0,0,.72);align-items:center;" +
      "justify-content:center;padding:18px;";

    overlay.innerHTML = `
      <div style="
        width:min(430px,100%);
        background:#292c42;
        color:#fff;
        border-radius:22px;
        padding:22px;
        box-sizing:border-box;
      ">

        <button id="adminClose" style="
          float:right;
          border:0;
          background:#444a66;
          color:#fff;
          border-radius:50%;
          width:36px;
          height:36px;
          font-size:22px;
        ">×</button>

        <h2 style="margin:0 0 6px">Admin Bakiye Paneli</h2>

        <p style="
          margin:0 0 20px;
          color:#b8c0e8;
          font-size:13px;
        ">
          Kayıtlı kullanıcıya site bakiyesi ekle
        </p>

        <label style="display:block;margin-bottom:6px">
          Kullanıcı e-postası
        </label>

        <input
          id="adminEmail"
          type="email"
          placeholder="kullanici@gmail.com"
          style="
            width:100%;
            box-sizing:border-box;
            padding:13px;
            border-radius:11px;
            border:0;
            margin-bottom:14px;
          "
        >

        <label style="display:block;margin-bottom:6px">
          Eklenecek bakiye (₺)
        </label>

        <input
          id="adminAmount"
          type="number"
          min="0.01"
          step="0.01"
          placeholder="100"
          style="
            width:100%;
            box-sizing:border-box;
            padding:13px;
            border-radius:11px;
            border:0;
            margin-bottom:16px;
          "
        >

        <button id="adminAddBalance" style="
          width:100%;
          padding:14px;
          border:0;
          border-radius:12px;
          background:#2867dc;
          color:#fff;
          font-size:16px;
          font-weight:700;
        ">
          Bakiye Ekle
        </button>

        <div id="adminStatus" style="
          margin-top:14px;
          text-align:center;
          font-size:14px;
        "></div>

      </div>
    `;

    document.body.appendChild(overlay);

    btn.onclick = () => {
      overlay.style.display = "flex";
    };

    overlay.querySelector("#adminClose").onclick = () => {
      overlay.style.display = "none";
    };

    overlay.querySelector("#adminAddBalance").onclick = async () => {
      const userEmail =
        overlay.querySelector("#adminEmail").value.trim();

      const amount =
        Number(overlay.querySelector("#adminAmount").value);

      const status =
        overlay.querySelector("#adminStatus");

      if (!userEmail || !amount || amount <= 0) {
        status.textContent =
          "E-posta ve geçerli bir miktar gir.";
        return;
      }

      status.textContent = "Bakiye ekleniyor...";

      const { error } = await client.rpc(
        "admin_add_balance",
        {
          p_email: userEmail,
          p_amount: amount
        }
      );

      if (error) {
        status.textContent = error.message;
        return;
      }

      status.textContent =
        amount.toFixed(2) + " ₺ bakiye eklendi.";

      overlay.querySelector("#adminAmount").value = "";
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initAdmin
    );
  } else {
    initAdmin();
  }
})();
