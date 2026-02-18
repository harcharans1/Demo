const uploadBtn = document.getElementById("uploadBtn");
const songInput = document.getElementById("songInput");
const songList = document.getElementById("songList");

const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const shuffleBtn = document.getElementById("shuffle");
const repeatBtn = document.getElementById("repeat");
const progress = document.getElementById("progress");
const songTitle = document.getElementById("songTitle");

let songs = JSON.parse(localStorage.getItem("songs")) || [];
let currentIndex = 0;
let repeat = false;

/* UPLOAD */
uploadBtn.onclick = () => songInput.click();

songInput.addEventListener("change", e=>{
  const file = e.target.files[0];
  if(!file) return;

  const url = URL.createObjectURL(file);

  songs.push({
    name:file.name,
    url:url
  });

  localStorage.setItem("songs", JSON.stringify(songs));
  renderSongs();
});

/* SHOW SONGS */
function renderSongs(){
  songList.innerHTML = "";

  songs.forEach((song,index)=>{
    const div = document.createElement("div");
    div.className="song-card";
    div.innerText="🎵 " + song.name;

    div.onclick=()=>{
      currentIndex=index;
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
  audio.src = songs[currentIndex].url;
  songTitle.innerText = songs[currentIndex].name;
}

/* PLAY / PAUSE */
playBtn.onclick=()=>{
  if(audio.paused){
    audio.play();
    playBtn.innerText="⏸";
  }else{
    audio.pause();
    playBtn.innerText="▶️";
  }
};

/* NEXT / PREV */
nextBtn.onclick=()=>{
  currentIndex = (currentIndex+1)%songs.length;
  loadSong();
  audio.play();
};

prevBtn.onclick=()=>{
  currentIndex = (currentIndex-1+songs.length)%songs.length;
  loadSong();
  audio.play();
};

/* SHUFFLE */
shuffleBtn.onclick=()=>{
  currentIndex = Math.floor(Math.random()*songs.length);
  loadSong();
  audio.play();
};

/* REPEAT */
repeatBtn.onclick=()=>{
  repeat=!repeat;
  repeatBtn.style.opacity = repeat ? "1" : "0.5";
};

audio.onended=()=>{
  repeat ? audio.play() : nextBtn.click();
};

/* PROGRESS */
audio.ontimeupdate=()=>{
  progress.value = (audio.currentTime/audio.duration)*100 || 0;
};

progress.oninput=()=>{
  audio.currentTime = (progress.value/100)*audio.duration;
};

renderSongs();