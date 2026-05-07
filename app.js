const API_KEY = "AIzaSyDrOlaKeTgOo9DWw01IzdgDgENHJaX2_DI";
let nextPageToken = "";
let currentQuery = "trending shorts";
let isLoading = false;

function toggleMenu(){
  document.getElementById("dropdown").classList.toggle("show");
}

async function loadVideos(){

  if(isLoading) return;
  isLoading = true;

  let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=5&q=${currentQuery}&key=${API_KEY}&pageToken=${nextPageToken}`;

  let res = await fetch(url);
  let data = await res.json();

  nextPageToken = data.nextPageToken;

  data.items.forEach(addVideo);

  isLoading = false;
}

function addVideo(item){

  let id = item.id.videoId;

  let box = document.createElement("div");
  box.className = "video-box";

  box.innerHTML = `
    <iframe loading="lazy"
      src="https://www.youtube.com/embed/${id}?mute=1&controls=1">
    </iframe>

    <div class="overlay">
      <h3>${item.snippet.channelTitle}</h3>
      <p>${item.snippet.title}</p>
    </div>

    <div class="actions">
      <div onclick="likeRedirect()">❤️</div>
      <div onclick="shareSite()">🔗</div>
      <div onclick="openCart()">🛒</div>
    </div>
  `;

  document.getElementById("feed").appendChild(box);
}

function likeRedirect(){
  window.open("https://progressmagnify.com/z11qyhfr42?key=104549a6ff0bc9b735e5f1dcacc9f723");
}

function shareSite(){
  window.open("https://copilot.microsoft.com/");
}

function openCart(){
  window.open("https://collshp.com/l0ver5/");
}

function setCategory(cat){

  document.getElementById("feed").innerHTML="";
  nextPageToken="";

  const map = {
    trending:"trending shorts",
    comedy:"funny shorts",
    anime:"anime shorts",
    news:"news viral",
    sports:"sports highlight",
    product:"review product"
  };

  currentQuery = map[cat];
  loadVideos();
}

const container = document.getElementById("feed");

container.addEventListener("scroll",()=>{
  if(container.scrollTop + container.clientHeight >= container.scrollHeight-150){
    loadVideos();
  }
});

loadVideos();
