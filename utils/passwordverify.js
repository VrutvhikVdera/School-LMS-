const bcrypt = require('bcrypt');

async function verifyPassword(plainTextPassword, encryptedPassword) {
    const isMatch = await bcrypt.compare(
        plainTextPassword,
        encryptedPassword
    );
    return isMatch;
}

module.exports = verifyPassword;
