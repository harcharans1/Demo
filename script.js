const uploadBtn = document.querySelector(".upload-btn");
const songInput = document.getElementById("songInput");
const audio = document.getElementById("audio");

const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

const progress = document.getElementById("progress");
const songName = document.getElementById("songName");

let songs = JSON.parse(localStorage.getItem("songs")) || [];
let currentIndex = 0;

// Upload Song
uploadBtn.addEventListener("click", () => {
  songInput.click();
});

songInput.addEventListener("change", (e) => {
  const file = e.target.files[0];

  if (file) {
    const url = URL.createObjectURL(file);

    songs.push({
      name: file.name,
      url: url
    });

    localStorage.setItem("songs", JSON.stringify(songs));
    alert("Song added ✅");
  }
});

// Load song
function loadSong(index) {
  if (songs.length === 0) return;

  audio.src = songs[index].url;
  songName.textContent = songs[index].name;
}

// Play / Pause
playBtn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    playBtn.textContent = "⏸";
  } else {
    audio.pause();
    playBtn.textContent = "▶️";
  }
});

// Next
nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % songs.length;
  loadSong(currentIndex);
  audio.play();
});

// Prev
prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + songs.length) % songs.length;
  loadSong(currentIndex);
  audio.play();
});

// Progress Bar update
audio.addEventListener("timeupdate", () => {
  progress.value = (audio.currentTime / audio.duration) * 100 || 0;
});

// Seek
progress.addEventListener("input", () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
});

// Auto next
audio.addEventListener("ended", () => {
  nextBtn.click();
});