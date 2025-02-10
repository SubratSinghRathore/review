const express = require("express");
const app = express();
require("dotenv").config();
const { reviewModel } = require("./db");
const cors = require("cors");

app.use(cors({
    origin: '*',
    methods: 'GET, POST, PUT, DELETE, PATCH',
    allowedHeaders: 'Content-Type, Authorization'
}));

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post("/review/admin/new-review", async (req, res) => {
    const title = req.query.title;
    const reviewId = Math.floor(Math.random() * (99999999 - 10000000 + 1)) + 10000000;
    try {
        const makeReview = await reviewModel({
            reviewTitle: title,
            reviewId: reviewId,
            review: []
        });
        makeReview.save();
        res.status(200).json({
            reviewTitle: title,
            reviewId: reviewId
        });
    }
    catch (error) {
        res.status(400).json({
            errorMsg: "fail to make new review please try again"
        });
    }
});

app.get("/review/user", async (req, res) => {
    const reviewId = req.query.reviewId;
    try {
        const reviewObject = await reviewModel.findOne({ reviewId });
        const title = reviewObject.reviewTitle;
        res.status(200).json({
            title: title
        })
    }
    catch (error) {
        res.status(400).json({
            errorMsg: "fail to add review Please try again after sometime"
        });
    }
});

app.patch("/review/user/update", async (req, res) => {
    const reviewId = req.query.reviewId;
    const reviewContent = req.query.reviewContent;

    try {
        const reviewObject = await reviewModel.updateOne(
            { reviewId },  
            { $push: { review: reviewContent } } 
        );

        if (reviewObject.modifiedCount === 0) {
            return res.status(404).json({ errorMsg: "Review not found or not updated." });
        }

        res.status(200).json({
            message: "Review updated successfully"
        });
    } catch (error) {
        console.error(error); 
        res.status(400).json({
            errorMsg: "Failed to add review. Please try again later.",
        });
    }
});

app.get("/review/admin/view", async (req, res) => {
    const reviewId = req.query.reviewId;
    try {
        const reviewObject = await reviewModel.findOne({ reviewId });
        const reviewArray = reviewObject.review;
        res.status(200).json(reviewArray);
    }
    catch (error) {
        res.status(400).json({
            errorMsg: `fail to load review of id ${reviewId} try to re-enter correct review id`
        });
    }
});

app.listen(PORT, () => { console.log(`listening on port ${PORT}`) });