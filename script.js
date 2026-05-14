let players = [];

function onYouTubeIframeAPIReady() {

  players[0] = new YT.Player('player1', {
    videoId: 'dQw4w9WgXcQ',
    playerVars:{ autoplay:0, controls:0 }
  });

  players[1] = new YT.Player('player2', {
    videoId: '9bZkp7q19f0',
    playerVars:{ autoplay:0, controls:0 }
  });

  players[2] = new YT.Player('player3', {
    videoId: '3tmd-ClpJxA',
    playerVars:{ autoplay:0, controls:0 }
  });
}

/* VOLUME GLOBAL */
document.addEventListener("DOMContentLoaded", function(){

  const slider = document.getElementById("volumeSlider");

  slider.addEventListener("input", function(){
    players.forEach(player=>{
      if(player && player.setVolume){
        player.setVolume(this.value);
      }
    });
  });

});

/* AUTO PLAY SAAT SCROLL */
const container = document.querySelector(".container");

container.addEventListener("scroll", function(){

  const boxes = document.querySelectorAll(".video-box");

  boxes.forEach((box,index)=>{
    const rect = box.getBoundingClientRect();
    const center = window.innerHeight / 2;

    if(rect.top <= center && rect.bottom >= center){
      players[index]?.playVideo();
    } else {
      players[index]?.pauseVideo();
    }
  });

});
