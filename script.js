// API Base URL
const API_BASE_URL = 'http://localhost:5000/api';

// DOM Elements
const audioPlayer = document.getElementById('audio-player');
const playBtn = document.getElementById('play-btn');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const volumeSlider = document.getElementById('volume-slider');
const searchInput = document.getElementById('search-input');
const recentSongsEl = document.getElementById('recent-songs');
const trendingSongsEl = document.getElementById('trending-songs');
const featuredPlaylistsEl = document.getElementById('featured-playlists');
const playlistsContainer = document.getElementById('playlists-container');
const nowPlayingCover = document.getElementById('now-playing-cover');
const nowPlayingTitle = document.getElementById('now-playing-title');
const nowPlayingArtist = document.getElementById('now-playing-artist');

// State
let currentSong = null;
let songs = [];
let playlists = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadSongs();
    loadPlaylists();
    loadTrendingSongs();
    setupEventListeners();
});

// Load songs from API
async function loadSongs() {
    try {
        const response = await fetch(`${API_BASE_URL}/songs`);
        songs = await response.json();
        displaySongs(songs.slice(0, 6), recentSongsEl);
        
        // Set first song as current
        if (songs.length > 0) {
            setCurrentSong(songs[0]);
        }
    } catch (error) {
        console.error('Error loading songs:', error);
    }
}

// Load playlists from API
async function loadPlaylists() {
    try {
        const response = await fetch(`${API_BASE_URL}/playlists`);
        playlists = await response.json();
        displayPlaylists(playlists, featuredPlaylistsEl);
        displaySidebarPlaylists(playlists);
    } catch (error) {
        console.error('Error loading playlists:', error);
    }
}

// Load trending songs
async function loadTrendingSongs() {
    try {
        const response = await fetch(`${API_BASE_URL}/trending`);
        const trending = await response.json();
        displaySongs(trending.slice(0, 6), trendingSongsEl);
    } catch (error) {
        console.error('Error loading trending songs:', error);
    }
}

// Display songs in grid
function displaySongs(songsArray, container) {
    container.innerHTML = songsArray.map(song => `
        <div class="song-card" data-id="${song.id}" onclick="playSong(${song.id})">
            <img src="${song.cover}" alt="${song.title}" class="song-cover">
            <h4>${song.title}</h4>
            <p>${song.artist}</p>
        </div>
    `).join('');
}

// Display playlists
function displayPlaylists(playlistsArray, container) {
    container.innerHTML = playlistsArray.map(playlist => `
        <div class="playlist-card" onclick="viewPlaylist(${playlist.id})">
            <img src="${playlist.cover}" alt="${playlist.name}" class="playlist-cover">
            <h4>${playlist.name}</h4>
            <p>${playlist.songs.length} songs</p>
        </div>
    `).join('');
}

// Display sidebar playlists
function displaySidebarPlaylists(playlistsArray) {
    playlistsContainer.innerHTML = playlistsArray.map(playlist => `
        <a href="#" onclick="viewPlaylist(${playlist.id}); return false;">
            <i class="fas fa-list"></i> ${playlist.name}
        </a>
    `).join('');
}

// Set current song
function setCurrentSong(song) {
    currentSong = song;
    audioPlayer.src = song.url;
    
    nowPlayingCover.src = song.cover;
    nowPlayingTitle.textContent = song.title;
    nowPlayingArtist.textContent = song.artist;
    
    // Update play count
    fetch(`${API_BASE_URL}/play/${song.id}`, { method: 'POST' });
}

// Play song by ID
async function playSong(songId) {
    try {
        const response = await fetch(`${API_BASE_URL}/songs/${songId}`);
        const song = await response.json();
        setCurrentSong(song);
        playAudio();
    } catch (error) {
        console.error('Error playing song:', error);
    }
}

// Audio controls
function playAudio() {
    audioPlayer.play();
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    playBtn.classList.add('playing');
}

function pauseAudio() {
    audioPlayer.pause();
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    playBtn.classList.remove('playing');
}

// Update progress bar
audioPlayer.addEventListener('timeupdate', () => {
    const currentTime = audioPlayer.currentTime;
    const duration = audioPlayer.duration;
    const progressPercent = (currentTime / duration) * 100;
    
    progress.style.width = `${progressPercent}%`;
    
    currentTimeEl.textContent = formatTime(currentTime);
    if (duration) {
        durationEl.textContent = formatTime(duration);
    }
});

// Format time (seconds to MM:SS)
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Seek functionality
const progressContainer = document.querySelector('.progress-container');
progressContainer.addEventListener('click', (e) => {
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    const duration = audioPlayer.duration;
    
    audioPlayer.currentTime = (clickX / width) * duration;
});

// Volume control
volumeSlider.addEventListener('input', (e) => {
    audioPlayer.volume = e.target.value / 100;
});

// Search functionality
let searchTimeout;
searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(async () => {
        const query = e.target.value;
        if (query.length >= 2) {
            try {
                const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`);
                const results = await response.json();
                displaySongs(results, recentSongsEl);
            } catch (error) {
                console.error('Error searching:', error);
            }
        } else if (query.length === 0) {
            loadSongs();
        }
    }, 500);
});

// Setup event listeners
function setupEventListeners() {
    // Play/Pause button
    playBtn.addEventListener('click', () => {
        if (audioPlayer.paused) {
            playAudio();
        } else {
            pauseAudio();
        }
    });
    
    // Previous/Next buttons (simplified)
    document.querySelectorAll('.control-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (e.target.closest('.fa-step-backward')) {
                const currentIndex = songs.findIndex(s => s.id === currentSong.id);
                const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
                playSong(songs[prevIndex].id);
            } else if (e.target.closest('.fa-step-forward')) {
                const currentIndex = songs.findIndex(s => s.id === currentSong.id);
                const nextIndex = (currentIndex + 1) % songs.length;
                playSong(songs[nextIndex].id);
            }
        });
    });
    
    // Song ends
    audioPlayer.addEventListener('ended', () => {
        const currentIndex = songs.findIndex(s => s.id === currentSong.id);
        const nextIndex = (currentIndex + 1) % songs.length;
        playSong(songs[nextIndex].id);
    });
}

// View playlist (placeholder)
function viewPlaylist(playlistId) {
    alert(`Opening playlist ${playlistId}`);
    // In a real app, this would navigate to playlist page
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        if (audioPlayer.paused) {
            playAudio();
        } else {
            pauseAudio();
        }
    } else if (e.code === 'ArrowRight' && e.ctrlKey) {
        const currentIndex = songs.findIndex(s => s.id === currentSong.id);
        const nextIndex = (currentIndex + 1) % songs.length;
        playSong(songs[nextIndex].id);
    } else if (e.code === 'ArrowLeft' && e.ctrlKey) {
        const currentIndex = songs.findIndex(s => s.id === currentSong.id);
        const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
        playSong(songs[prevIndex].id);
    }
});

// Initialize volume
audioPlayer.volume = volumeSlider.value / 100;