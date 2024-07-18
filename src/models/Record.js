const mongoose = require('mongoose');

const RecordSchema = new mongoose.Schema({
    url: String,
    name: String,
    description: String,
    companyLogo: String,
    facebookURL: String,
    linkedinURL: String,
    twitterURL: String,
    instagramURL: String,
    address: String,
    phoneNumber: String,
    email: String,
}, { timestamps: true });

module.exports = mongoose.model('Record', RecordSchema);