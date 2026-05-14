/* ===================== KONFIGURASI ===================== */

const API_KEY = "AIzaSyDrOlaKeTgOo9DWw01IzdgDgENHJaX2_DI";

let nextPageToken = "";
let currentQuery = "trending shorts";
let isLoading = false;

let players = [];
let currentCategory = "trending";

/* ===================== DATA VIDEO PER KATEGORI (MANUAL MODE) ===================== */

const videoData = {

  trending: ["dQw4w9WgXcQ","9bZkp7q19f0","3tmd-ClpJxA"],
  comedy: ["l482T0yNkeo","kJQP7kiw5Fk","RgKAFK5djSk"],
  anime: ["QczGoCmX-pI","6hzrDeceEKc","w7ejDZ8SWv8"],
  news: ["21X5lGlDOfg","hHW1oY26kxQ","M7lc1UVf-VE"],
  sports: ["kXYiU_JCYtU","JGwWNGJdvx8","CevxZvSJLk8"],
  product: ["e-ORhEE9VVg","uelHwf8o7_U","2Vv-BfVoq4g"]
};

/* ===================== TOGGLE MENU ===================== */

function toggleMenu(){
  document.getElementById("dropdown").classList.toggle("show");
}

/* ===================== SET CATEGORY ===================== */

function setCategory(category){

  currentCategory = category;

  const feed = document.querySelector(".container");

  // Stop old players
  players.forEach(p=>{
    if(p && p.destroy){
      p.destroy();
    }
  });

  players = [];
  feed.innerHTML = "";

  // ===== MODE MANUAL (videoData) =====
  videoData[category].forEach((videoId,index)=>{

    const box = document.createElement("div");
    box.className = "video-box";

    box.innerHTML = `
      <div id="player${index}"></div>

      <div class="actions">
        <div onclick="likeRedirect()">❤️</div>
        <div onclick="openComment('${videoId}')">💬</div>
        <div onclick="shareSite()">🔗</div>
        <div onclick="openCart()">🛒</div>
      </div>
    `;

    feed.appendChild(box);

  });

  setTimeout(initPlayers,300);
}

/* ===================== INIT YOUTUBE PLAYER ===================== */

function initPlayers(){

  videoData[currentCategory].forEach((videoId,index)=>{

    players[index] = new YT.Player("player"+index,{
      videoId: videoId,
      playerVars:{
        autoplay:0,
        controls:0,
        modestbranding:1,
        rel:0
      }
    });

  });

}

/* ===================== YOUTUBE READY ===================== */

function onYouTubeIframeAPIReady(){
  initPlayers();
}

/* ===================== AUTO PLAY SAAT SCROLL ===================== */

document.addEventListener("DOMContentLoaded",function(){

  const container = document.querySelector(".container");

  container.addEventListener("scroll",function(){

    const boxes = document.querySelectorAll(".video-box");

    boxes.forEach((box,index)=>{
      const rect = box.getBoundingClientRect();
      const center = window.innerHeight/2;

      if(rect.top <= center && rect.bottom >= center){
        players[index]?.playVideo();
      }else{
        players[index]?.pauseVideo();
      }
    });

  });

});

/* ===================== MODE API (OPTIONAL LOAD MORE) ===================== */

async function loadVideos(){

  if(isLoading) return;
  isLoading = true;

  let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=5&q=${currentQuery}&key=${API_KEY}&pageToken=${nextPageToken}`;

  let res = await fetch(url);
  let data = await res.json();

  nextPageToken = data.nextPageToken;

  if(data.items){
    data.items.forEach(item=>{
      console.log("API Video:", item.id.videoId);
    });
  }

  isLoading = false;
}

/* ===================== ACTION BUTTON ===================== */

function likeRedirect(){
  window.open("https://minitok.fun/donasi.html");
}

function openComment(videoId){
  window.open(`https://www.youtube.com/watch?v=${videoId}`);
}

function shareSite(){
  window.open("https://omg10.com/4/10980966/");
}

function openCart(){
  window.open("https://collshp.com/l0ver5/");
}

/* ===================== LOAD AWAL ===================== */

document.addEventListener("DOMContentLoaded",()=>{
  setCategory("trending");
});
