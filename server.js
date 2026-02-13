const express = require('express');
const ytLp = require('yt-dlp-exec');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // للملفات الواجهة

app.get('/api/extract', async (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).json({ error: 'الرابط مطلوب' });

    try {
        const output = await ytLp(videoUrl, {
            dumpSingleJson: true,
            noCheckCertificates: true,
            noWarnings: true,
            preferFreeFormats: true,
        });

        res.json({
            title: output.title,
            thumbnail: output.thumbnail,
            duration: output.duration_string,
            uploader: output.uploader,
            formats: output.formats.filter(f => f.vcodec !== 'none' && f.acodec !== 'none').reverse(),
            description: output.description
        });
    } catch (error) {
        res.status(500).json({ error: 'فشل استخراج البيانات. تأكد من الرابط.' });
    }
});

app.listen(3000, () => console.log('القلعة تعمل على منفذ 3000'));