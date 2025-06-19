// load Songs
async function loadSongs(){
  let response = await fetch("http://127.0.0.1:3000/Spotify-Clone/music/");

  let data = await response.text();

  let div = document.createElement("div");
  div.innerHTML = data;


  let songs = div.querySelectorAll("a");


  let songsArr = [];
  songs.forEach((s)=>{
    let url = s.href;
    
    if(url.endsWith(".mp3")) songsArr.push(url);
  });
  
  return songsArr;
}

let getDetail = (song)=>{

    // get last string after '/'
    let songDetail = song.split("/").pop();
    songDetail = songDetail.slice(0,-4); // remove .mp3
    songDetail = songDetail.replaceAll("_-_"," ");

    songDetail = songDetail.split(" ");

    return songDetail;
}


// add Data in Songs

async function loadData() {
  let songs = await loadSongs();
  
  let songBox = document.querySelector(".song-box");
  
  for(const song of songs){
    
    let songDetail = getDetail(song);
    let songName = songDetail[1];
    let artistName = songDetail[0];
    
    songBox.innerHTML += `
    <li>

    <div class="song-card">
                  <span class="material-symbols-outlined"> music_note </span>
                  <div class="info">
                    <diV>${songName}</diV>
                    <div>${artistName}</div>
                    <div class = "song-link">${song}</div>
                  </div>
                  <div class="play-now">
                  <span>Play Now</span>
                  <img src="images/play.svg" class = "invert" alt="play">
                  </div>
                </div>
                

              </li>
              
          `
  }

}

let currentSong = new Audio();



// add Listeners to Song Card
async function main() {
  await loadData();
  
  let cardArray = document.querySelectorAll(".song-card");

  // intial song
  let songUrl = cardArray[0].querySelector(".song-link").innerText;
  
  cardArray.forEach((e)=>{
    e.addEventListener("click",()=>{
      songUrl = e.querySelector(".song-link").innerText;
      
      play(songUrl);
      
    })
  })
  
  play(songUrl);
}

// Play Song
function play(track){
  
  currentSong.src = track;
  document.querySelector(".song-info").innerText = getDetail(track)[1];
  document.querySelector("#play").src = "images/play.svg";

  let time = document.querySelector(".song-time");

  let circle = document.querySelector(".circle");
  
  currentSong.addEventListener("timeupdate",()=>
  {

    let currentTime = getTime(currentSong.currentTime);
    let duartion = getTime(currentSong.duration);

    time.innerText = currentTime+"/"+duartion;
    
    p = currentSong.currentTime/currentSong.duration;
    circle.style.left = `${p*100}%`;

    if(p==1){
      circle.style.left = `0%`;
      playBtn.src = "images/play.svg";
    }

    if(isNaN(currentSong.duration)){
      time.innerText = "";
      circle.style.left = `0%`;
    }

  });

}

// Time

function getTime(sec){
  if(isNaN(sec)) return '00:00';
  sec = Math.round(sec);

  let min = Math.round(sec/60);
  let s = sec%60;

  return format(min) +":"+ format(s); 
};

function format(time){
  return time.toString().padStart(2,'0');
}

main();


// play buttons

let prevBtn = document.querySelector("#prev");
let playBtn = document.querySelector("#play");
let nextBtn = document.querySelector("#next");

playBtn.addEventListener("click",()=>{
  if(currentSong.src === "") return;

  if(currentSong.paused){
    currentSong.play();
    playBtn.src = "images/pause.svg";
  }
  else{
    currentSong.pause();
    playBtn.src = "images/play.svg";
  }
})

let seekBar = document.querySelector(".seek-bar");

seekBar.addEventListener("click",(e)=>{
  let totalWidth = e.target.getBoundingClientRect().width;

  let per = (e.offsetX/totalWidth)*100;

  let duration = currentSong.duration;
  
  let time = (duration/100)*per;

  currentSong.currentTime = time;

})

// Hamberger

let ham = document.querySelector(".menu");
ham.addEventListener("click",()=>{
  let obj = document.querySelector(".left");
  obj.style.left = "0%";
})