const admin = require("firebase-admin");
const serviceAccount = require("../carrent-eb65c-firebase-adminsdk-ltzau-bed4a3b8fa.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
