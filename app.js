/* ===================== KONFIGURASI ===================== */

const API_KEY = "AIzaSyDrOlaKeTgOo9DWw01IzdgDgENHJaX2_DI";

let nextPageToken = "";
let currentCategory = "trending";
let isLoading = false;

let players = [];
let musicPlayer = null;
let youtubeReady = false;
let lastWatchedKeyword = "viral";

/* ===================== LOAD YT API ===================== */

(function(){
  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(tag);
})();

function onYouTubeIframeAPIReady(){
  youtubeReady = true;
  initMiniMusicPlayer();
  setCategory("trending");
}

/* ===================== CATEGORY QUERY ===================== */

const categoryQuery = {
  trending: "viral shorts 2026",
  news: "breaking news shorts",
  sports: "sports highlights shorts"
};

/* ===================== TOPBAR COLOR ===================== */

function updateTopbarColor(category){
  const topbar = document.getElementById("topbar");
  topbar.className = "topbar " + category;
}

/* ===================== MINI FLOATING MUSIC ===================== */

let musicList = [
"oofSnsGkops","XgdY_s1LsZc","lpdRqn6xwiM","6EEW-9NDM5k",
"oRdxUFDoQe0","YHRvDo8rUoQ","e1mOmdykmwI","FcOctsNXyjk",
"PlK_crOqt64","Z4DKAy7Biq8","ttcMfY7emxs","OdL3O67C-Bc",
"-LESbtPT8uw","ufHLYw9q7vQ","KHlSq1rOmWU","0VOhIR3bnXY",
"BeVwwJ4FpO0","2e0BMACvymo","F0d8JJUNkqo","Whyt3_lG3dA"
];

let musicIndex = 0;

function initMiniMusicPlayer(){

  if(document.getElementById("miniMusicBar")) return;

  const bar = document.createElement("div");
  bar.id = "miniMusicBar";
  bar.style.position = "fixed";
  bar.style.bottom = "0";
  bar.style.left = "0";
  bar.style.width = "100%";
  bar.style.height = "70px";
  bar.style.background = "#111";
  bar.style.display = "flex";
  bar.style.alignItems = "center";
  bar.style.justifyContent = "space-between";
  bar.style.padding = "0 15px";
  bar.style.zIndex = "9999";
  bar.style.color = "#fff";

  bar.innerHTML = `
    <div>🎵 Music</div>
    <div>
      <button onclick="prevMusic()">⏮</button>
      <button onclick="toggleMusic()">▶</button>
      <button onclick="nextMusic()">⏭</button>
    </div>
  `;

  document.body.appendChild(bar);

  musicPlayer = new YT.Player(document.createElement("div"),{
    height:"0",
    width:"0",
    videoId: musicList[0],
    playerVars:{autoplay:0}
  });
}

function toggleMusic(){
  if(!musicPlayer) return;
  if(musicPlayer.getPlayerState() === 1){
    musicPlayer.pauseVideo();
  }else{
    musicPlayer.playVideo();
  }
}

function nextMusic(){
  musicIndex = (musicIndex+1) % musicList.length;
  musicPlayer.loadVideoById(musicList[musicIndex]);
}

function prevMusic(){
  musicIndex--;
  if(musicIndex < 0) musicIndex = musicList.length-1;
  musicPlayer.loadVideoById(musicList[musicIndex]);
}

/* ===================== SET CATEGORY ===================== */

async function setCategory(category){

  if(!youtubeReady) return;

  currentCategory = category;
  nextPageToken = "";

  updateTopbarColor(category);

  document.querySelectorAll(".cat-btn").forEach(btn=>{
    btn.classList.remove("active");
  });

  document.querySelector(`[data-cat="${category}"]`)
    ?.classList.add("active");

  await loadVideos(true);
}

/* ===================== LOAD VIDEOS ===================== */

async function loadVideos(reset=false){

  if(isLoading) return;
  isLoading = true;

  const feed = document.getElementById("feed");
  if(!feed) return;

  if(reset){
    players.forEach(p=>p?.destroy());
    players = [];
    feed.innerHTML = "";
  }

  let smartQuery = categoryQuery[currentCategory];

  // 🧠 AI RECOMMENDATION
  if(lastWatchedKeyword){
    smartQuery += " " + lastWatchedKeyword;
  }

  let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=6&q=${smartQuery}&key=${API_KEY}&pageToken=${nextPageToken}`;

  let res = await fetch(url);
  let data = await res.json();

  nextPageToken = data.nextPageToken;

  if(data.items){

    data.items.forEach(item=>{

      const videoId = item.id.videoId;
      const index = players.length;

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

      players[index] = new YT.Player("player"+index,{
        videoId: videoId,
        playerVars:{
          autoplay:0,
          controls:0,
          modestbranding:1,
          rel:0
        },
        events:{
          onStateChange:function(e){
            if(e.data === 1){
              lastWatchedKeyword = item.snippet.title.split(" ")[0];
            }
          }
        }
      });

    });
  }

  isLoading = false;
}

/* ===================== AUTO PLAY + PRELOAD ===================== */

document.addEventListener("scroll",function(){

  const boxes = document.querySelectorAll(".video-box");

  boxes.forEach((box,index)=>{
    const rect = box.getBoundingClientRect();
    const center = window.innerHeight/2;

    if(rect.top<=center && rect.bottom>=center){
      players[index]?.playVideo();

      // ⚡ PRELOAD NEXT
      if(players[index+1]){
        players[index+1].cueVideoById(
          players[index+1].getVideoData().video_id
        );
      }

    }else{
      players[index]?.pauseVideo();
    }
  });
});

/* ===================== INFINITE SCROLL ===================== */

document.getElementById("feed").addEventListener("scroll",function(){

  if(this.scrollTop + this.clientHeight >= this.scrollHeight - 500){
    loadVideos();
  }

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

/* ==========================
   YOUTUBE IFRAME MUSIC PLAYER
========================== */

let musicPlayer;
let musicReady = false;

// WAJIB global
window.onYouTubeIframeAPIReady = function () {
  musicReady = true;
  console.log("YouTube Iframe API Ready");
};

function loadMusic(videoId) {

  if (!musicReady) {
    console.log("Iframe API belum ready...");
    return;
  }

  const container = document.getElementById("musicPlayer");
  container.style.display = "block";

  if (musicPlayer) {
    musicPlayer.loadVideoById(videoId);
  } else {
    musicPlayer = new YT.Player("musicPlayer", {
      height: "200",
      width: "100%",
      videoId: videoId,
      playerVars: {
        autoplay: 1,
        controls: 1,
        modestbranding: 1
      },
      events: {
        onReady: (event) => {
          event.target.playVideo();
        }
      }
    });
  }
}
