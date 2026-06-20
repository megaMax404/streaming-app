const bcrypt = require("bcryptjs");

async function run() {
  const hash = await bcrypt.hash(
    "jso19441xowa@-1",
    10
  );

}

run();