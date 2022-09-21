const bcrypt = require('bcrypt');

async function run() {
    const salt = await bcrypt.genSalt(10); //10 is number of rounds to generate salt, higher number = more complex
    const hashed = await bcrypt.hash('1234', salt); //getting our hashed password where password is 1234 and is salted
    console.log(salt);
    console.log(hashed);
}

run();