// Upload button demo
document.querySelector(".upload-btn").addEventListener("click", () => {
  alert("Song upload feature coming soon!");
});

const uploadBtn = document.querySelector(".upload-btn");
const songInput = document.getElementById("songInput");

// Upload button click → file picker open
uploadBtn.addEventListener("click", () => {
  songInput.click();
});

// Song select hone par
songInput.addEventListener("change", (e) => {
  const file = e.target.files[0];

  if (file) {
    // Pehle saved songs lo
    let songs = JSON.parse(localStorage.getItem("songs")) || [];

    // New song add
    songs.push({
      name: file.name
    });

    // Save in browser
    localStorage.setItem("songs", JSON.stringify(songs));

    alert("Song saved in Library ✅");
  }
});