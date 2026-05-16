/* ===================== KONFIGURASI ===================== */

const API_KEY = "AIzaSyDrOlaKeTgOo9DWw01IzdgDgENHJaX2_DI";

let nextPageToken = "";
let currentCategory = "trending";
let isLoading = false;
let players = [];
let youtubeReady = false;

/* ===================== LOAD YOUTUBE IFRAME API ===================== */

(function loadYouTubeAPI(){
  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(tag);
})();

function onYouTubeIframeAPIReady(){
  youtubeReady = true;
  setCategory("trending");
}

/* ===================== DATA QUERY PER KATEGORI ===================== */

const categoryQuery = {
  trending: "viral shorts 2026",
  comedy: "funny shorts",
  anime: "anime shorts",
  news: "news shorts",
  sports: "sports shorts",
  product: "product review shorts"
};

/* ===================== TOGGLE MENU ===================== */

function toggleMenu(){
  document.getElementById("dropdown").classList.toggle("show");
}

/* ===================== SET CATEGORY ===================== */

async function setCategory(category){

  if(!youtubeReady) return;

  currentCategory = category;
  nextPageToken = "";

  document.querySelectorAll(".topbar button").forEach(btn=>{
    btn.classList.remove("active");
  });

  document.querySelector(`button[onclick="setCategory('${category}')"]`)
    ?.classList.add("active");

  await loadVideos(true);
}

/* ===================== LOAD VIDEO DARI API ===================== */

async function loadVideos(reset = false){

  if(isLoading) return;
  isLoading = true;

  const feed = document.querySelector(".container");

  if(reset){
    players.forEach(p=>{
      if(p && p.destroy) p.destroy();
    });
    players = [];
    feed.innerHTML = "";
  }

  const query = categoryQuery[currentCategory];

  let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=6&q=${query}&key=${API_KEY}&pageToken=${nextPageToken}`;

  let res = await fetch(url);
  let data = await res.json();

  nextPageToken = data.nextPageToken;

  if(data.items){

    data.items.forEach((item,index)=>{

      const videoId = item.id.videoId;
      const boxIndex = players.length;

      const box = document.createElement("div");
      box.className = "video-box";

      box.innerHTML = `
        <div id="player${boxIndex}"></div>

        <div class="actions">
          <div onclick="likeRedirect()">❤️</div>
          <div onclick="openComment('${videoId}')">💬</div>
          <div onclick="shareSite()">🔗</div>
          <div onclick="openCart()">🛒</div>
        </div>
      `;

      feed.appendChild(box);

      setTimeout(()=>{
        players[boxIndex] = new YT.Player("player"+boxIndex,{
          videoId: videoId,
          playerVars:{
            autoplay:0,
            controls:0,
            modestbranding:1,
            rel:0
          }
        });
      },300);

    });

  }

  isLoading = false;
}

/* ===================== AUTO PLAY SAAT SCROLL ===================== */

document.addEventListener("scroll",function(){

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

/* ===================== ACTION BUTTON ===================== */

function likeRedirect(){
  window.open("https://minitok.fun/donasi.html","_blank");
}

function openComment(videoId){
  window.open(`https://www.youtube.com/watch?v=${videoId}`,"_blank");
}

function shareSite(){
  window.open("https://omg10.com/4/10980966/","_blank");
}

function openCart(){
  window.open("https://collshp.com/l0ver5/","_blank");
}
