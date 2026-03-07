const express = require('express');
const cors = require('cors');
const axios = require('axios'); // مكتبة بسيطة لإرسال الطلبات
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/api/extract', async (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).json({ error: 'الرابط مطلوب' });

    try {
        // نرسل الطلب لمحرك Cobalt العالمي
        const response = await axios.post('https://api.cobalt.tools/api/json', {
            url: videoUrl,
            vQuality: '720', // نطلب جودة عالية
            isAudioOnly: false
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        const data = response.data;

        // نعيد النتيجة لصفحتك الجميلة
        res.json({
            title: "تم جلب الفيديو بنجاح",
            thumbnail: "https://via.placeholder.com/150", // المحركات السريعة أحياناً لا تعطي صورة
            url: data.url, // الرابط المباشر للتحميل
            formats: [{ qualityLabel: 'تحميل مباشر (High Quality)', url: data.url }]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'عذراً، المحرك مشغول حالياً، جرب لاحقاً.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`القلعة تعمل عبر المحرك الخارجي على ${PORT}`));
