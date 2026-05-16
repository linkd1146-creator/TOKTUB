/* ===================== KONFIGURASI ===================== */

const API_KEY = "AIzaSyDrOlaKeTgOo9DWw01IzdgDgENHJaX2_DI";

let nextPageToken = "";
let currentCategory = "trending";
let isLoading = false;

let players = [];          // FEED players
let musicPlayer = null;    // MUSIC player
let youtubeReady = false;

/* ===================== LOAD YOUTUBE IFRAME API ===================== */

(function(){
  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(tag);
})();

function onYouTubeIframeAPIReady(){
  youtubeReady = true;
  initMusicSection();   // init music dulu
  setCategory("trending"); // baru load feed
}

/* ===================== DATA QUERY PER KATEGORI ===================== */

const categoryQuery = {
  trending: "viral shorts 2026",
  news: "breaking news shorts",
  sports: "sports highlights shorts"
};

/* ===================== MUSIC LIST ===================== */

let musicList = [
"oofSnsGkops","XgdY_s1LsZc","lpdRqn6xwiM","6EEW-9NDM5k",
"oRdxUFDoQe0","YHRvDo8rUoQ","e1mOmdykmwI","FcOctsNXyjk"
];

let musicIndex = 0;

/* ===================== INIT MUSIC SECTION ===================== */

function initMusicSection(){

  if(document.getElementById("musicSection")) return;

  const section = document.createElement("div");
  section.id = "musicSection";
  section.style.padding = "15px";
  section.style.background = "#000";
  section.style.color = "#fff";
  section.style.textAlign = "center";

  section.innerHTML = `
    <h3>🎵 Music Player</h3>
    <div id="musicPlayer"></div>
    <div style="margin-top:10px;">
      <button onclick="prevMusic()">⏮</button>
      <button onclick="nextMusic()">⏭</button>
    </div>
  `;

  document.body.insertBefore(section, document.body.firstChild);

  musicPlayer = new YT.Player("musicPlayer",{
    height:"250",
    width:"100%",
    videoId: musicList[0],
    playerVars:{
      autoplay:0,
      controls:1,
      modestbranding:1,
      rel:0
    }
  });
}

/* ===================== MUSIC CONTROL ===================== */

function nextMusic(){
  musicIndex++;
  if(musicIndex >= musicList.length) musicIndex = 0;
  musicPlayer.loadVideoById(musicList[musicIndex]);
}

function prevMusic(){
  musicIndex--;
  if(musicIndex < 0) musicIndex = musicList.length - 1;
  musicPlayer.loadVideoById(musicList[musicIndex]);
}

/* ===================== TOGGLE MENU ===================== */

function toggleMenu(){
  document.getElementById("dropdown")?.classList.toggle("show");
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

/* ===================== LOAD FEED VIDEO ===================== */

async function loadVideos(reset = false){

  if(isLoading) return;
  isLoading = true;

  const feed = document.querySelector(".container");
  if(!feed) return;

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

    data.items.forEach((item)=>{

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

      players[boxIndex] = new YT.Player("player"+boxIndex,{
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

  isLoading = false;
}

/* ===================== AUTO PLAY FEED ===================== */

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

/* ================= TOPBAR SWITCH SYSTEM ================= */

function setCategory(category){

  if(!youtubeReady) return;

  // tampilkan feed, sembunyikan music
  document.getElementById("feed").style.display = "block";
  document.getElementById("musicSection").style.display = "none";

  currentCategory = category;
  nextPageToken = "";

  document.querySelectorAll(".cat-btn").forEach(btn=>{
    btn.classList.remove("active");
  });

  event.target.classList.add("active");

 setTimeout(()=>{
  if(players[index+1]){
  players[index+1].cueVideoById(players[index+1].getVideoData().video_id);
}
  
/* ================= OPEN MUSIC ================= */

function openMusic(){

  document.getElementById("feed").style.display = "none";
  document.getElementById("musicSection").style.display = "block";

  document.querySelectorAll(".cat-btn").forEach(btn=>{
    btn.classList.remove("active");
  });

  event.target.classList.add("active");

}

function openMusic(){
  document.getElementById("feed").style.display="none";
  document.getElementById("musicSection").style.display="block";
  document.getElementById("miniMusicBar").style.display="flex";
}

function toggleMusic(){
  if(musicPlayer.getPlayerState() == 1){
    musicPlayer.pauseVideo();
  } else {
    musicPlayer.playVideo();
  }
}

document.querySelector(".container").addEventListener("scroll", function(){

  const container = this;
  
  if(container.scrollTop + container.clientHeight >= container.scrollHeight - 500){
    loadVideos(); // load page berikutnya
  }

});


