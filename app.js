const products=[
["PUBG","PUBG UC 660 UC",249,"GameMarket","🪖"],
["PUBG","PUBG UC 3850 UC",1299,"GüvenliSatıcı","🪖"],
["PUBG","PUBG UC 8100 UC",2599,"GüvenliSatıcı","🪖"],
["Valorant","Valorant 2050 VP",799,"VPlay","🎯"],
["Minecraft","Minecraft Java Edition",899,"PixelStore","⛏️"],
["Roblox","Roblox 1700 Robux",549,"RoboShop","🧱"],
["CS2","CS2 Prime Upgrade",699,"GameMarket","🔫"],
["LoL","LoL 2800 RP",749,"VPlay","⚔️"]
];
const grid=document.getElementById("grid");
const q=document.getElementById("q");
const drawer=document.getElementById("drawer");

function render(filter="all"){
 const query=q.value.toLowerCase().trim();
 const list=products.filter(p=>(filter==="all"||p[0]===filter)&&
 (p[0]+" "+p[1]+" "+p[3]).toLowerCase().includes(query));
 grid.innerHTML=list.map(p=>`
 <article class="product" onclick="add('${p[1]}')">
  <div class="thumb">${p[4]}</div>
  <div class="info">
   <div class="tag">${p[0]}</div>
   <h3>${p[1]}</h3>
   <div class="seller">Satıcı: ${p[3]} ✓</div>
   <div class="price">${p[2].toLocaleString("tr-TR")} TL</div>
  </div>
 </article>`).join("") || "<p>Ürün bulunamadı.</p>";
}
function game(x){render(x);document.getElementById("products").scrollIntoView({behavior:"smooth"});closeMenu()}
function add(name){alert(name+" sepete eklendi.");}
function closeMenu(){drawer.classList.remove("open")}
document.getElementById("menuBtn").onclick=()=>drawer.classList.add("open");
q.addEventListener("input",()=>render());
render();