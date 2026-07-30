const axios = require("axios");

async function getLocation(ip) {

    try {

        const { data } = await axios.get(
            `http://ip-api.com/json/${ip}?fields=status,country,city`
        );
        console.log(data);

        if (data.status === "success") {

            return {

                country: data.country,

                city: data.city,

            };

        }

    } catch (err) {

        console.error("IP Lookup Error:", err.message);

    }

    return {

        country: "Unknown",

        city: "",

    };

}

module.exports = getLocation;