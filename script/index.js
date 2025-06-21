
// load Songs
async function loadSongs(folder){
  let response = await fetch(`http://127.0.0.1:3000/Spotify-Clone/songs/${folder}`);

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
    
    let songDetail = song.split("/").pop();
    songDetail = songDetail.slice(0,-4); // remove .mp3
    songDetail = songDetail.replaceAll("%20"," ");

    // songDetail = songDetail.split(" ");

    songDetail = songDetail.split("@");

    return songDetail;
}

let songs;

// add Data in Songs

async function loadData(folder) {
  songs = await loadSongs(folder);

  
  let songBox = document.querySelector(".song-box");

  songBox.innerHTML = "";
  
  for(const song of songs){
    
    let songDetail = getDetail(song);
    let songName = songDetail[0];
    let artistName =  songDetail[1] ?? "";
    
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

// load albums
async function loadAlbums(){
  let response = await fetch("data/album.json");
  
  let data = await response.json();

  let cardContainer = document.querySelector(".card-container");

  data.forEach((e)=>{
    cardContainer.innerHTML += `
          <div class="card" data-folder = ${e.folder}>
              <div class="play">
                <img src="images/play.svg" alt="play" />
              </div>

              <img
                src="images/${e.img}"
                alt="music"
              />
              <h2 id="title">${e.title}</h2>
              <p id = "description">${e.description}</p>
          </div>
  `
  })
}

// sould be called in start IIFE
(async ()=>{
  // in start let hanuman chalisa is in main function

  await main("HanumanChalisa");

  await loadAlbums();

  let cards = document.querySelectorAll(".card");
  
  cards.forEach((e)=>{
    e.addEventListener("click",async ()=>{
      let folder = e.dataset.folder;
      await main(folder);
    });
  });

})();


// add Listeners to Song Card
async function main(folder) {
  await loadData(folder);
  
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
  document.querySelector(".song-info").innerText = getDetail(track)[0];
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

// Hamburger

let ham = document.querySelector(".menu");
ham.addEventListener("click",()=>{
  let obj = document.querySelector(".left");
  obj.style.left = "0%";
});


// Close
let close = document.querySelector(".close");
close.addEventListener("click",()=>{
  let obj = document.querySelector(".left");
  obj.style.left = "-110%";
})

// add event listener to prev and next

prevBtn.addEventListener("click",()=>{
  for(let i=0 ; i<songs.length ; i++){
    if(songs[i] == currentSong.src){
        if(i==0) currentSong.src = songs[songs.length-1];
        else currentSong.src = songs[i-1];
        
        break;
      }
    }
  play(currentSong.src);
})

nextBtn.addEventListener("click",()=>{
  for(let i=0 ; i<songs.length ; i++){
    if(songs[i] == currentSong.src){
        currentSong.src = songs[(i+1)%songs.length];
        break;
    }
  }
  play(currentSong.src);
})

// addd volume feature

let vol = document.querySelector("#volume");
let volImg = document.querySelector(".vol").getElementsByTagName("span")[0];


vol.addEventListener("input",()=>{
  let x = vol.value;

  if(x == 0){
    volImg.innerText = "no_sound";
  }
  else{
    volImg.innerText = "volume_up";
  }

  currentSong.volume = x/100;
});

// on Volume Icon

volImg.addEventListener("click",()=>{
  if(volImg.innerText == "no_sound"){
    volImg.innerText = "volume_up";
    currentSong.volume = .25;
    vol.value = 25;
  }
  else{
    volImg.innerText = "no_sound";
    currentSong.volume = 0;
    vol.value = 0;
  }
})