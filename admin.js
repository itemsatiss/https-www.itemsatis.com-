(() => {
  const ADMIN_EMAILS = [
  "pubgtemplateform@gmail.com",
  "pasadevir@gmail.com"
];

  function startAdmin() {
    if (document.getElementById("adminWalletButton")) return;

    const user = window.ITEMSATIS_AUTH_USER;

    if (!user) {
      setTimeout(startAdmin, 1000);
      return;
    }

    if (!ADMIN_EMAILS.includes((user.email || "").toLowerCase())) {
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
// CANLI DESTEK YÖNETİMİ
(function () {
  const ADMIN_EMAIL = "pubgtemplateform@gmail.com";
  let client;
  let selectedUser = null;

  function startSupportAdmin() {
    const user = window.ITEMSATIS_AUTH_USER;

    if (!user) {
      setTimeout(startSupportAdmin, 1000);
      return;
    }

    if (!ADMIN_EMAILS.includes((user.email || "").toLowerCase())) return;
    if (document.getElementById("supportAdminButton")) return;

    client = window.supabase.createClient(
      window.ITEMSATIS_SUPABASE_URL,
      window.ITEMSATIS_SUPABASE_ANON_KEY
    );

    const button = document.createElement("button");
    button.id = "supportAdminButton";
    button.textContent = "💬 Canlı Destek";
    button.style.cssText =
      "position:fixed;right:14px;bottom:215px;z-index:999999;background:#5144d7;color:white;border:0;border-radius:14px;padding:14px;font-weight:bold;";
    document.body.appendChild(button);

    button.onclick = openPanel;
  }

  function openPanel() {
    if (document.getElementById("supportAdminOverlay")) return;

    const overlay = document.createElement("div");
    overlay.id = "supportAdminOverlay";
    overlay.style.cssText =
      "position:fixed;inset:0;z-index:1000000;background:#171827;color:white;padding:18px;box-sizing:border-box;overflow:auto;";

    overlay.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center">
        <h2>Canlı Destek</h2>
        <button id="supportAdminClose" style="font-size:25px">×</button>
      </div>
      <p>Müşteri konuşmaları</p>
      <div id="supportConversationList">Mesajlar yükleniyor...</div>
      <hr style="margin:20px 0;border-color:#444">
      <h3 id="supportCustomerTitle">Bir müşteri seç</h3>
      <div id="supportAdminMessages" style="min-height:150px"></div>
      <div style="display:flex;gap:8px;position:sticky;bottom:0;background:#171827;padding:10px 0">
        <input id="supportAdminInput" placeholder="Yanıtını yaz..." style="flex:1;min-width:0;padding:12px;border-radius:10px">
        <button id="supportAdminSend" style="padding:12px;background:#5144d7;color:white;border:0;border-radius:10px">Gönder</button>
      </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById("supportAdminClose").onclick = () => overlay.remove();
    document.getElementById("supportAdminSend").onclick = sendReply;

    document.getElementById("supportAdminInput").addEventListener("keydown", e => {
      if (e.key === "Enter") sendReply();
    });

    loadConversations();

    overlay._refresh = setInterval(() => {
      loadConversations();
      if (selectedUser) loadConversation(selectedUser);
    }, 4000);
  }

  async function loadConversations() {
    const list = document.getElementById("supportConversationList");
    if (!list || !client) return;

    const { data, error } = await client
      .from("support_messages")
      .select("user_id,message,created_at")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) {
      list.textContent = "Hata: " + error.message;
      return;
    }

    const users = [...new Set((data || []).map(m => m.user_id))];

    list.innerHTML = "";

    if (!users.length) {
      list.textContent = "Henüz müşteri mesajı yok.";
      return;
    }

    users.forEach(id => {
      const row = document.createElement("button");
      row.textContent = "Müşteri: " + id.slice(0, 8) + "…";
      row.style.cssText =
        "display:block;width:100%;text-align:left;padding:14px;margin:8px 0;background:#303249;color:white;border:0;border-radius:10px;";
      row.onclick = () => {
        selectedUser = id;
        document.getElementById("supportCustomerTitle").textContent =
          "Müşteri: " + id.slice(0, 8) + "…";
        loadConversation(id);
      };
      list.appendChild(row);
    });
  }

  async function loadConversation(userId) {
    const box = document.getElementById("supportAdminMessages");
    if (!box) return;

    const { data, error } = await client
      .from("support_messages")
      .select("sender,message,created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (error) {
      box.textContent = "Hata: " + error.message;
      return;
    }

    box.innerHTML = "";

    (data || []).forEach(m => {
      const bubble = document.createElement("div");
      bubble.textContent =
        (m.sender === "support" ? "Sen: " : "Müşteri: ") + m.message;
      bubble.style.cssText =
        "padding:10px;margin:8px 0;border-radius:10px;background:" +
        (m.sender === "support" ? "#5144d7" : "#303249") +
        ";overflow-wrap:anywhere;";
      box.appendChild(bubble);
    });

    box.scrollTop = box.scrollHeight;
  }

  async function sendReply() {
    if (!selectedUser) {
      alert("Önce bir müşteri seç.");
      return;
    }

    const input = document.getElementById("supportAdminInput");
    const message = input.value.trim();

    if (!message) return;

    const { error } = await client
      .from("support_messages")
      .insert({
        user_id: selectedUser,
        sender: "support",
        message
      });

    if (error) {
      alert("Yanıt gönderilemedi: " + error.message);
      return;
    }

    input.value = "";
    loadConversation(selectedUser);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startSupportAdmin);
  } else {
    startSupportAdmin();
  }
})();