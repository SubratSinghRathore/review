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

app.get("/review/user/giveReview", async (req, res) => {
    const id = req.query.reviewId;
    try {
        const a = await reviewModel.findOne({ reviewId: id })
        var title = a.reviewTitle;
    } catch (error) {
        res.status(403).send("invalid reviewId");
    }
    res.status(200).send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Add Review</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: Arial, sans-serif;
        }
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: url('https://source.unsplash.com/random/1600x900') no-repeat center center/cover;
        }
        .container {
            background: rgba(16, 66, 101, 0.2);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 20px;
            width: 400px;
            text-align: center;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        .title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
            color: black;
        }
        textarea {
            width: 100%;
            height: 100px;
            padding: 10px;
            border: none;
            border-radius: 10px;
            resize: none;
            outline: none;
            background: rgba(36, 49, 80, 0.2);
            backdrop-filter: blur(5px);
            color: black;
            font-size: 16px;
        }
        button {
            margin-top: 10px;
            padding: 10px 20px;
            border: none;
            border-radius: 10px;
            background: rgba(3, 6, 21, 0.85);
            color: white;
            cursor: pointer;
            transition: 0.3s;
        }
        button:hover {
            background: rgba(0, 0, 0, 0.5);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="heading">Leave a Review</div>
        <div class="title">${title}</div>
        <textarea id="reviewContent" placeholder="Write your review here..."></textarea>
        <button onclick="submitReview()">Submit</button>
    </div>
    <script>
        function submitReview() {
        const content = document.getElementById("reviewContent").value;
            fetch("https://review-dyeb.onrender.com/review/user/update?reviewId=${id}&reviewContent=${content}", {
        method: "PATCH",
        headers: { 'Content-Type': 'application/json' },
    })
        .then(res => {
            if (res.ok) {
                alert("review submitted successfully");
            };
            reloadPage();
        })
}
    </script>
</body>
</html>
`)
})

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