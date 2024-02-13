const Ad = require("../models/Ad");
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

module.exports = {
    getAllAds,
    createAds,
};
