const cards=[
 {title:'Outlook 50 Adet Hesap',seller:'GüvenilirMarket',price:'0,61 $',img:'assets/hero-roblox.jpg'},
 {title:'%100 TR Valorant Skin Garantili',seller:'FurkanMarket',price:'5,08 $',img:'assets/hero-roblox.jpg'},
 {title:'Roblox 100 Robux',seller:'Sinquary',price:'0,81 $',img:'assets/hero-roblox.jpg'},
 {title:'Steam İstediğiniz 1 Oyun',seller:'GüvenilirMarket',price:'0,61 $',img:'assets/hero-roblox.jpg'}
];
document.getElementById('cards').innerHTML=cards.map(c=>`<article class="card" onclick="showNotice('${c.title}')"><img class="card-img" src="${c.img}" alt=""><div class="card-body"><div class="card-title">${c.title}</div><div class="card-meta">SATICI ${c.seller}</div><div class="card-price">${c.price}</div></div></article>`).join('');
const drawer=document.getElementById('drawer'), shade=document.getElementById('shade'), modal=document.getElementById('loginModal');
function openMenu(){drawer.classList.add('open');shade.style.display='block'}
function closeMenu(){drawer.classList.remove('open');shade.style.display='none'}
function openLogin(){modal.classList.add('open')}
function closeLogin(){modal.classList.remove('open')}
document.getElementById('menuOpen').onclick=openMenu;
document.getElementById('menuClose').onclick=closeMenu;
shade.onclick=closeMenu;
document.getElementById('loginOpen').onclick=openLogin;
document.getElementById('bottomLogin').onclick=openLogin;
document.getElementById('drawerLogin').onclick=()=>{closeMenu();openLogin()};
document.getElementById('loginClose').onclick=closeLogin;
modal.addEventListener('click',e=>{if(e.target===modal)closeLogin()});
let toastTimer;
function showNotice(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),1800)}
