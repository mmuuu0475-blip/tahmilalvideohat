
const express = require('express');
const ytLp = require('yt-dlp-exec');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/api/extract', async (req, res) => {
const videoUrl = req.query.url;
if (!videoUrl) return res.status(400).json({ error: 'الرابط مطلوب' });

});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('القلعة تعمل بأعلى نظام حماية'));

