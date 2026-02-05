const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Mock Data
const songs = [
  {
    id: 1,
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    duration: 200,
    cover: "https://upload.wikimedia.org/wikipedia/en/c/c1/The_Weeknd_-_Blinding_Lights.png",
    url: "/uploads/songs/song1.mp3",
    plays: 2450000
  },
  {
    id: 2,
    title: "Flowers",
    artist: "Miley Cyrus",
    album: "Endless Summer Vacation",
    duration: 200,
    cover: "https://upload.wikimedia.org/wikipedia/en/d/dc/Miley_Cyrus_-_Flowers.png",
    url: "/uploads/songs/song2.mp3",
    plays: 1890000
  },
  {
    id: 3,
    title: "As It Was",
    artist: "Harry Styles",
    album: "Harry's House",
    duration: 167,
    cover: "https://upload.wikimedia.org/wikipedia/en/4/4f/Harry_Styles_-_As_It_Was.png",
    url: "/uploads/songs/song3.mp3",
    plays: 3120000
  }
];

const playlists = [
  {
    id: 1,
    name: "Today's Top Hits",
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    songs: [1, 2, 3]
  },
  {
    id: 2,
    name: "Chill Vibes",
    cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    songs: [1, 3]
  }
];

// API Routes
app.get('/api/songs', (req, res) => {
  res.json(songs);
});

app.get('/api/songs/:id', (req, res) => {
  const song = songs.find(s => s.id === parseInt(req.params.id));
  if (song) {
    res.json(song);
  } else {
    res.status(404).json({ error: 'Song not found' });
  }
});

app.get('/api/playlists', (req, res) => {
  res.json(playlists);
});

app.get('/api/trending', (req, res) => {
  const trending = [...songs].sort((a, b) => b.plays - a.plays);
  res.json(trending.slice(0, 10));
});

app.post('/api/play/:id', (req, res) => {
  const song = songs.find(s => s.id === parseInt(req.params.id));
  if (song) {
    song.plays++;
    res.json({ message: 'Play count updated', plays: song.plays });
  } else {
    res.status(404).json({ error: 'Song not found' });
  }
});

// Search endpoint
app.get('/api/search', (req, res) => {
  const query = req.query.q?.toLowerCase() || '';
  const results = songs.filter(song => 
    song.title.toLowerCase().includes(query) ||
    song.artist.toLowerCase().includes(query) ||
    song.album.toLowerCase().includes(query)
  );
  res.json(results);
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});