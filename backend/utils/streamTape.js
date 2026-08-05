const { chromium } = require("playwright");

async function getStreamTapeVideo(url) {

    const browser = await chromium.launch({
        headless: true
    });

    const page = await browser.newPage({
        userAgent:
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140 Safari/537.36"
    });

    await page.goto(url, {
        waitUntil: "networkidle"
    });

    const video = await page.evaluate(() => {

        const v = document.querySelector("video");

        if (v) return v.src;

        return null;

    });

    await browser.close();

    return video;
}

module.exports = getStreamTapeVideo;