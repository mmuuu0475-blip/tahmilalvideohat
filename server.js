const express = require('express');
const ytLp = require('yt-dlp-exec');
const cors = require('cors');
const path = require('path'); // إضافة مكتبة المسارات
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public')); 

app.get('/api/extract', async (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).json({ error: 'الرابط مطلوب' });

    try {
        // إضافة الخيارات التي تجعل السيرفر يبدو كمتصفح حقيقي لتجنب الرفض
        const output = await ytLp(videoUrl, {
            dumpSingleJson: true,
            noCheckCertificates: true,
            noWarnings: true,
            preferFreeFormats: true,
            // القناع البرمجي (User-Agent) لخداع حماية يوتيوب
            addHeader: [
                'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept-Language: en-US,en;q=0.9'
            ]
        });

        res.json({
            title: output.title,
            thumbnail: output.thumbnail,
            duration: output.duration_string,
            uploader: output.uploader,
            // تصفية الجودات التي تحتوي على صوت وصورة معاً
            formats: output.formats.filter(f => f.vcodec !== 'none' && f.acodec !== 'none').reverse(),
            description: output.description
        });
    } catch (error) {
        console.error(error); // طباعة الخطأ في سجلات ريندر للتحليل
        res.status(500).json({ error: 'عذراً، الخادم المصدر رفض الطلب أو الرابط غير مدعوم حالياً.' });
    }
});

// تعديل هام جداً: Render يستخدم منفذ متغير، لذا نستخدم process.env.PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`القلعة تعمل الآن على منفذ ${PORT}`));
