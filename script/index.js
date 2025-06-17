console.log("Hello World");

async function load(){
  let response = await fetch("http://127.0.0.1:3000/Spotify-Clone/music/");

  let data = await response.text();

  console.log(data);

  
}

load();