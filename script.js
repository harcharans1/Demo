const uploadBtn = document.getElementById("uploadBtn");
const songInput = document.getElementById("songInput");
const songList = document.getElementById("songList");

const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const progress = document.getElementById("progress");
const songTitle = document.getElementById("songTitle");

let songs = JSON.parse(localStorage.getItem("songs")) || [];
let current = 0;

/* UPLOAD */
uploadBtn.onclick = ()=> songInput.click();

songInput.onchange = e=>{
  const file = e.target.files[0];
  if(!file) return;

  const url = URL.createObjectURL(file);

  songs.push({
    name:file.name,
    url:url
  });

  localStorage.setItem("songs", JSON.stringify(songs));
  renderSongs();
};

/* RENDER SONGS */
function renderSongs(){
  songList.innerHTML="";

  songs.forEach((song,index)=>{
    const div=document.createElement("div");
    div.className="song-card";
    div.innerText="🎵 " + song.name;

    div.onclick=()=>{
      current=index;
      loadSong();
      audio.play();
      playBtn.innerText="⏸";
    };

    songList.appendChild(div);
  });
}

/* LOAD SONG */
function loadSong(){
  if(!songs.length) return;
  audio.src = songs[current].url;
  songTitle.innerText = songs[current].name;
}

/* PLAY PAUSE */
playBtn.onclick=()=>{
  if(audio.paused){
    audio.play();
    playBtn.innerText="⏸";
  }else{
    audio.pause();
    playBtn.innerText="▶️";
  }
};

/* NEXT PREV */
nextBtn.onclick=()=>{
  current=(current+1)%songs.length;
  loadSong();
  audio.play();
};

prevBtn.onclick=()=>{
  current=(current-1+songs.length)%songs.length;
  loadSong();
  audio.play();
};

/* PROGRESS */
audio.ontimeupdate=()=>{
  progress.value=(audio.currentTime/audio.duration)*100 || 0;
};

progress.oninput=()=>{
  audio.currentTime=(progress.value/100)*audio.duration;
};

audio.onended=()=> nextBtn.click();

renderSongs();