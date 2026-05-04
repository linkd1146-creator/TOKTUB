const API_KEY = "AIzaSyDrOlaKeTgOo9DWw01IzdgDgENHJaX2_DI";
let nextPageToken = "";
let currentQuery = "trending shorts";

const productLinks = [
"https://s.blibli.com/GNtk/7dr918nl",
"https://collshp.com/l0ver5",
"https://s.blibli.com/GNtk/hha5m7gv",
"https://tiket.com/hotel/indonesia/the-langham-jakarta-511001669349468935"
];

async function loadVideos() {
  let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=6&q=${currentQuery}&key=${API_KEY}&pageToken=${nextPageToken}`;
  
  let res = await fetch(url);
  let data = await res.json();
  
  nextPageToken = data.nextPageToken;

  data.items.forEach(addVideo);
}

function addVideo(item){
  let id = item.id.videoId;
  let box = document.createElement("div");
  box.className = "video-box";

  let randomProduct = productLinks[Math.floor(Math.random()*productLinks.length)];

  box.innerHTML = `
    <iframe src="https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=1"></iframe>

    <div class="overlay">
      <h3>${item.snippet.channelTitle}</h3>
      <p>${item.snippet.title}</p>
    </div>

    <div class="actions">
      <div onclick="share('${id}')">🔗</div>
      <div onclick="window.open('${randomProduct}')">🛒</div>
    </div>
  `;

  document.getElementById("feed").appendChild(box);
}

function share(id){
  let link = `https://youtube.com/watch?v=${id}`;
  window.open(`https://wa.me/?text=${link}`);
}

function setCategory(cat){
  document.getElementById("feed").innerHTML="";
  nextPageToken="";
  
  let map = {
    trending:"trending shorts",
    comedy:"funny video",
    anime:"anime edit",
    news:"news viral",
    sports:"sports highlight",
    product:"review product"
  };

  currentQuery = map[cat];
  loadVideos();
}

const container = document.getElementById("feed");

container.addEventListener("scroll",()=>{
  if(container.scrollTop + container.clientHeight >= container.scrollHeight-200){
    loadVideos();
  }
});

loadVideos();
