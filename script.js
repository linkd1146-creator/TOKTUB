/* ========================= */
/*        YOUTUBE SETUP      */
/* ========================= */

let players = [];

/* Dipanggil otomatis oleh YouTube API */
function onYouTubeIframeAPIReady() {

  players[0] = new YT.Player('player1', {
    videoId: 'dQw4w9WgXcQ',
    playerVars:{
      autoplay:0,
      controls:0,
      modestbranding:1,
      rel:0
    }
  });

  players[1] = new YT.Player('player2', {
    videoId: '9bZkp7q19f0',
    playerVars:{
      autoplay:0,
      controls:0,
      modestbranding:1,
      rel:0
    }
  });

  players[2] = new YT.Player('player3', {
    videoId: '3tmd-ClpJxA',
    playerVars:{
      autoplay:0,
      controls:0,
      modestbranding:1,
      rel:0
    }
  });
}

/* ========================= */
/*        DOM READY          */
/* ========================= */

document.addEventListener("DOMContentLoaded", function(){

  /* ===== SAFE VOLUME ===== */

  const slider = document.getElementById("volumeSlider");

  if(slider){
    slider.addEventListener("input", function(){
      players.forEach(player=>{
        if(player && player.setVolume){
          player.setVolume(parseInt(this.value));
        }
      });
    });
  }

  /* ===== AUTO PLAY SCROLL ===== */

  const container = document.querySelector(".container");

  if(container){

    container.addEventListener("scroll", function(){

      const boxes = document.querySelectorAll(".video-box");

      boxes.forEach((box,index)=>{

        const rect = box.getBoundingClientRect();
        const center = window.innerHeight / 2;

        if(rect.top <= center && rect.bottom >= center){

          players.forEach((p,i)=>{
            if(i !== index){
              p?.pauseVideo();
            }
          });

          players[index]?.playVideo();

        } else {
          players[index]?.pauseVideo();
        }

      });

    });

  }

});
