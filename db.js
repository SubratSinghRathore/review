require("dotenv").config();
const mongoose = require("mongoose");
mongoose.connect(process.env.db_uri)
.then(console.log("database connected"));

const reviewSystemSchema = mongoose.Schema({
    reviewTitle: String,
    reviewId: Number,
    review: [String]
});

const reviewModel = mongoose.model("review", reviewSystemSchema);

module.exports = {
    reviewModel
};