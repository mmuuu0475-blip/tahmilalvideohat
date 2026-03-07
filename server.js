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

    try {
        const output = await ytLp(videoUrl, {
            dumpSingleJson: true,
            noCheckCertificates: true,
            noWarnings: true,
            preferFreeFormats: true,
            noPlaylist: true,
            // السطر الذي يربط السيرفر بملف الهوية cookies.txt الذي رفعته
            cookies: path.join(__dirname, 'cookies.txt'),
            addHeader: [
                'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Accept-Language: en-US,en;q=0.9'
            ]
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
        console.error('خطأ في الاستخراج:', error);
        res.status(500).json({ error: 'عذراً، الخادم المصدر رفض الطلب أو الرابط غير مدعوم حالياً.' });
    }
});

// المنفذ المتغير ليعمل على Render بدون مشاكل
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`القلعة تعمل الآن على منفذ ${PORT}`));
