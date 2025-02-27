require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors");
const crypto = require("crypto");

const app = express();

// ✅ Enable CORS for frontend requests
app.use(cors({ origin: "https://lindsaysyson09.github.io" }));

// ✅ Allow Host header (Fixes Gitpod 400 Errors)
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Host");
    next();
});

// ✅ Enable JSON + URL-encoded parsing
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Root Route (Prevents 404 Errors)
app.get("/", (req, res) => {
    res.send("✅ Server is running!");
});

// ✅ Adyen Checkout Session API (Frontend Calls This)
app.post("/createSession", async (req, res) => {
    try {
        const { amount, countryCode, shopperLocale } = req.body;

        const sessionAmount = amount || { currency: "USD", value: 1000 };
        const sessionCountry = countryCode || "US";
        const sessionLocale = shopperLocale || (sessionCountry === "CN" ? "zh_CN" : "en_US");

        // Request a new checkout session from Adyen
        const sessionResponse = await axios.post(
            "https://checkout-test.adyen.com/v70/sessions",
            {
                merchantAccount: process.env.MERCHANT_ACCOUNT,
                amount: sessionAmount,
                countryCode: sessionCountry,
                shopperLocale: sessionLocale,
                channel: "Web",
                returnUrl: "https://lindsaysyson09.github.io/adyen-checkout-demo",
                reference: "Test-Payment"
            },
            {
                headers: { "X-API-Key": process.env.ADYEN_API_KEY, "Content-Type": "application/json" }
            }
        );

        res.json(sessionResponse.data);
    } catch (error) {
        console.error("❌ Error creating session:", error);
        res.status(500).send(error.response?.data || { error: "Server error" });
    }
});

// ✅ Webhook Endpoint (Handles Real-Time Notifications)
app.post("/webhooks", (req, res) => {
    try {
        console.log("🔔 Webhook Received:", req.body);

        // ✅ Always return HTTP 200 OK
        res.status(200).send("[accepted]");

    } catch (error) {
        console.error("❌ Webhook Error:", error);
        res.status(500).send("Internal Server Error");
    }
});

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

