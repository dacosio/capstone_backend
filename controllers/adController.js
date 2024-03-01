const { openai } = require("../config/openAi");
const Ad = require("../models/Ad");
const AdPrice = require("../models/AdPrice");
const StripeCustomer = require("../models/StripeCustomer");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

const getAllAds = async (req, res) => {
    try {
        const ads = await Ad.find({}).lean();
        if (ads) return res.status(200).json({ message: "No Ads available" });

        return res.status(200).json(ads);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createAds = async (req, res) => {
    try {
        // TODO, image has to come from aws different route
        const {
            template,
            label,
            startDate,
            endDate,
            amount,
            image,
            paymentMethodId,
        } = req.body;

        const merchantId = req.merchantId;
        console.log(merchantId);

        if (!merchantId)
            return res.status(401).json({ message: "Please login." });
        if (Number(amount) <= 0) {
            return res.status(400).json({
                message: "Bad Request: Amount must be greater than zero.",
            });
        }
        if (!template || !label || !startDate || !endDate || !amount) {
            return res
                .status(400)
                .json({ message: "Bad Request: Missing required fields." });
        }
        // if (!req.files) {
        //     return res
        //         .status(400)
        //         .json({ message: "Bad Request: File is missing." });
        // }

        const customer = await StripeCustomer.findOne({
            user: req.id,
        });

        if (!customer) {
            res.status(404).json({ message: "Please setup a payment method." });
        }
        // TODO
        // const image = await s3UploadV3(req.files);

        const receipt = await stripe.customers.retrieve(customer.customerId);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Number(amount) * 100,
            currency: "cad",
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: "never",
            },
            payment_method: paymentMethodId,
            customer: customer.customerId,
            description: `Stripe charge of amount $${Number(amount)} for payment`,
            confirm: true,
            receipt_email: receipt.email ? receipt.email : req.user,
        });

        if (paymentIntent) {
            await Ad.create({
                image,
                template,
                label,
                startDate,
                endDate,
                merchantId,
            });
            return res
                .status(200)
                .json({ message: "Ad has been successfully created" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const generateAdText = async (req, res) => {
    const { description } = req.body;
    try {
        if (!description) {
            return res
                .status(400)
                .json({ error: "Description cannot be empty" });
        }
        const messages = [
            {
                role: "system",
                content: `Your response should give always give a headline and a tagline for a promo in my restaurant where the
                        headline has a maximum of 20 characters and the tagline has
                        a maximum of 40 characters, both considers white spaces. Return the response in the following parsable JSON format:
                    {
                        "h": "headline",
                        "t" "tagline" 
                    }
                    If you cannot provide the expected answer with the conditions above. Return the response:
                    {
                        "h": "Invalid Prompt",
                        "t": "Please, keep the description within the promo ad."
                    }
                    `,
            },
            {
                role: "user",
                content: `${description}`,
            },
        ];

        let content = null;
        while (
            !content ||
            !content.h ||
            !content.t ||
            content.h.length > 20 ||
            content.t.length > 50
        ) {
            const completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages,
                max_tokens: 100,
                temperature: 1,
            });

            const messageObject = completion.choices[0].message.content;
            content = JSON.parse(messageObject);
        }

        return res.status(200).json(content);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAdPrices = async (req, res) => {
    try {
        const adPrices = await AdPrice.find().select("label price").lean();
        return res.status(200).json(adPrices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createAdPrices = async (req, res) => {
    try {
        const { price, label } = req.body;

        const adPrices = await AdPrice.create({
            price,
            label,
        });
        return res.status(200).json(adPrices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllAds,
    createAds,
    generateAdText,
    getAdPrices,
    createAdPrices,
};
