const express = require("express");

const getStreamTapeVideo =
    require("../utils/streamTape");

const router = express.Router();

router.get("/streamtape", async (req, res) => {

    try {

        const { url } = req.query;

        if (!url) {

            return res.status(400).json({
                error: "Missing url"
            });

        }

        const video =
            await getStreamTapeVideo(url);

        res.json({
            success: true,
            video
        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            error: err.message
        });

    }

});

module.exports = router;