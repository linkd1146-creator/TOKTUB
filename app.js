/* ===================== KONFIGURASI ===================== */

const API_KEY = "AIzaSyDrOlaKeTgOo9DWw01IzdgDgENHJaX2_DI";

let nextPageToken = "";
let currentCategory = "trending";
let isLoading = false;
let players = [];
let youtubeReady = false;
let lastWatchedKeyword = "viral";

/* ===================== CATEGORY QUERY ===================== */

const categoryQuery = {
  trending: "viral shorts 2026",
  news: "breaking news shorts",
  sports: "sports highlights shorts"
};

/* ===================== MUSIC VIDEO LIST ===================== */
/* Semua ID lama + tambahan baru */

const musicList = [
"oofSnsGkops","XgdY_s1LsZc","lpdRqn6xwiM","6EEW-9NDM5k",
"oRdxUFDoQe0","YHRvDo8rUoQ","e1mOmdykmwI","FcOctsNXyjk",
"PlK_crOqt64","Z4DKAy7Biq8","ttcMfY7emxs","OdL3O67C-Bc",
"-LESbtPT8uw","ufHLYw9q7vQ","KHlSq1rOmWU","0VOhIR3bnXY",
"BeVwwJ4FpO0","2e0BMACvymo","F0d8JJUNkqo","Whyt3_lG3dA",
"k9MWCWvN4Nc","2CE1i-l3xaI","SpLK5pSXQdc",
"dQw4w9WgXcQ","vXU_IaMrB7c","5xrvXId-ef8","Tet6_BlStEM"
];

/* ===================== YOUTUBE READY ===================== */

function onYouTubeIframeAPIReady(){
  youtubeReady = true;
  setCategory("trending");
}

/* ===================== TOPBAR COLOR ===================== */

function updateTopbarColor(category){
  const topbar = document.getElementById("topbar");
  if(topbar){
    topbar.className = "topbar " + category;
  }
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

  if(category === "music"){
    openMusicCategory();
  } else {
    await loadVideos(true);
  }
}

/* ===================== LOAD API VIDEOS ===================== */

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

  if(lastWatchedKeyword){
    smartQuery += " " + lastWatchedKeyword;
  }

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=6&q=${smartQuery}&key=${API_KEY}&pageToken=${nextPageToken}`;

  const res = await fetch(url);
  const data = await res.json();

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

/* ===================== OPEN MUSIC CATEGORY ===================== */

function openMusicCategory(){

  const feed = document.getElementById("feed");
  if(!feed) return;

  players.forEach(p=>p?.destroy());
  players = [];
  feed.innerHTML = "";

  musicList.forEach((videoId,index)=>{

    const box = document.createElement("div");
    box.className = "video-box";

    box.innerHTML = `
      <div id="musicPlayer${index}"></div>
      <div class="actions">
        <div onclick="likeRedirect()">❤️</div>
        <div onclick="openComment('${videoId}')">💬</div>
        <div onclick="shareSite()">🔗</div>
        <div onclick="openCart()">🛒</div>
      </div>
    `;

    feed.appendChild(box);

    players[index] = new YT.Player("musicPlayer"+index,{
      videoId: videoId,
      playerVars:{
        autoplay:0,
        controls:1,
        modestbranding:1,
        rel:0
      }
    });

  });

}

/* ===================== AUTO PLAY + PRELOAD ===================== */

document.addEventListener("scroll",function(){

  const boxes = document.querySelectorAll(".video-box");

  boxes.forEach((box,index)=>{
    const rect = box.getBoundingClientRect();
    const center = window.innerHeight/2;

    if(rect.top<=center && rect.bottom>=center){
      players[index]?.playVideo();

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

document.getElementById("feed")?.addEventListener("scroll",function(){
  if(currentCategory !== "music"){
    if(this.scrollTop + this.clientHeight >= this.scrollHeight - 500){
      loadVideos();
    }
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
