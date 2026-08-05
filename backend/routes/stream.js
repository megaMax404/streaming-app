const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/streamtape", async (req, res) => {
    try {
        const { url } = req.query;

        if (!url) {
            return res.status(400).json({
                error: "Missing url",
            });
        }

        console.log("Fetching:", url);

        // โหลดหน้า Streamtape
        const page = await axios.get(url, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140 Safari/537.36",
            },
        });

        const html = page.data;

        // หา get_video
        const match = html.match(/get_video\?id=.*?token=[A-Za-z0-9\-_]+/);

        if (!match) {
            return res.status(404).json({
                success: false,
                error: "Cannot find get_video url",
            });
        }

        // สร้าง URL เต็ม
        const getVideoUrl = `https://streamtape.com/${match[0]}`;

        console.log("GET VIDEO =", getVideoUrl);

        // เรียก get_video
        const response = await axios.get(getVideoUrl, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140 Safari/537.36",
            },

            // อย่าให้ axios ตาม redirect
            maxRedirects: 0,

            // อนุญาต status 302
            validateStatus: (status) => status >= 200 && status < 400,
        });
        console.log("STATUS =", response.status);

        console.log("HEADERS =", response.headers);

        console.log("REQUEST =", response.request?.res?.responseUrl);

        // เอา URL ที่ redirect ไป
        const redirectUrl =
            response.headers.location ||
            response.request?.res?.responseUrl;

        res.json({
            success: true,
            status: response.status,
            headers: response.headers,
            requestUrl: response.request?.res?.responseUrl
        });
    } catch (err) {
        console.error(err.message);

        res.status(500).json({
            success: false,
            error: err.message,
        });
    }
});

module.exports = router;