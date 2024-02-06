const stripe = require("stripe")(process.env.STRIPE_SECRET);
const StripeCustomer = require("../models/StripeCustomer");

const errorHandler = async (err) => {
  switch (err.type) {
    case "StripeCardError":
      // A declined card error
      err.message; // => e.g. "Your card's expiration year is invalid."
      break;
    case "StripeRateLimitError":
      // Too many requests made to the API too quickly
      break;
    case "StripeInvalidRequestError":
      // Invalid parameters were supplied to Stripe's API
      break;
    case "StripeAPIError":
      // An error occurred internally with Stripe's API
      break;
    case "StripeConnectionError":
      // Some kind of error occurred during the HTTPS communication
      break;
    case "StripeAuthenticationError":
      // You probably used an incorrect API key
      break;
    default:
      // Handle any other types of unexpected errors
      break;
  }
};

const createCustomer = async (req, res) => {
  try {
    const { address } = req.body;
    // Create a customer
    const customer = await stripe.customers.create({
      email: req.user,
      address: {
        line1: address,
      },
    });

    const stripeCustomer = await StripeCustomer.create({
      customerId: customer.id,
      user: req.id,
    });

    res.status(201).json({ stripeCustomer });
    res.status(200).json();
  } catch (error) {
    errorHandler(error);
    res.status(400).json({ message: error.message });
  }
};

const getCustomer = async (req, res) => {
  try {
    const customer = await StripeCustomer.findOne({
      user: req.id,
    });

    if (customer) res.status(200).res.json({ customerId: customer.customerId });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//add a new card to the customer
const addNewCardToCustomer = async (req, res) => {
  try {
    console.log(req.body);
    console.log("test from backend");
    // Find the StripeCustomer using the user ID
    const customer = await StripeCustomer.findOne({
      user: req.id,
    });

    if (customer) {
      // const data = await stripe.paymentMethods.attach(
      //   JSON.stringify(paymentMethodId),
      //   {
      //     customer: customer.customerId,
      //   }
      // );
      // const paymentMethod = await stripe.paymentMethods.create({
      //   type: "card",
      //   card: {
      //     number: "4242424242424242",
      //     exp_month: 8,
      //     exp_year: 2026,
      //     cvc: "314",
      //   },
      // });

      return res.status(200).json({ message: "Card added successfully" });
    } else {
      return res.status(400).json({ message: "Customer not found" });
    }
  } catch (err) {
    errorHandler(err);

    // Handle specific error cases if needed
    let response = {
      message: err.message,
      data: err.decline_code,
    };

    return res.status(500).json(response);
  }
};

//Get list of all saved card of the customer
const getCustomerPaymentMethods = async (req, res) => {
  let cards = [];
  try {
    // Find the StripeCustomer using the user ID
    const customer = await StripeCustomer.findOne({
      user: req.id,
    });

    if (customer) {
      const savedCards = await stripe.customers.listPaymentMethods(
        customer.customerId
      );
      const cardDetails = Object.values((await savedCards).data);
      cardDetails.forEach((cardData) => {
        let obj = {
          cardId: cardData.id,
          cardType: cardData.brand,
          cardExpDetails: `${
            cardData.exp_month < 10
              ? "0" + cardData.exp_month
              : cardData.exp_month
          }/${cardData.exp_year % 100}`,
          cardLast4: cardData.last4,
          cardName: cardData.name ? cardData.name : "",
        };
        cards.push(obj);
      });
      return res.status(200).json(cards);
    }
  } catch (error) {
    errorHandler(error);
    return res.status(500).json(error);
  }
};

const chargeCard = async (req, res) => {
  try {
    const { amount } = req.body;
    // Find the StripeCustomer using the user ID
    const customer = await StripeCustomer.findOne({
      user: req.id,
    });
    const receipt = await stripe.customers.retrieve(customer.customerId);

    if (amount > 0) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Number(amount) * 100,
        currency: "cad",
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: "never",
        },
        customer: customer.customerId,
        description: `Stripe charge of amount $${Number(amount)} for payment`,
        confirm: true,
        receipt_email: receipt.email ? receipt.email : req.user,
      });

      return res.status(200).json({ receipt: "Payment Successful!" });
    }
  } catch (error) {
    errorHandler(error);
    console.log(error);
    return res.status(500).json(error);
  }
};

module.exports = {
  createCustomer,
  addNewCardToCustomer,
  getCustomerPaymentMethods,
  chargeCard,
  getCustomer,
};
