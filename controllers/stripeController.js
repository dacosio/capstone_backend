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
    const { payment_method, address } = req.body;
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

//add a new card to the customer
const addNewCardToCustomer = async (req, res) => {
  const { token } = req.body;

  try {
    // Find the StripeCustomer using the user ID
    const customer = await StripeCustomer.findOne({
      user: req.id,
    });

    if (customer) {
      // Create a source for the customer using the token
      const card = await stripe.customers.createSource(customer.customerId, {
        source: "tok_visa", //a token must be coming from the frontend using publishable key
      });

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
const getSavedCards = async (req, res) => {
  let cards = [];
  try {
    // Find the StripeCustomer using the user ID
    const customer = await StripeCustomer.findOne({
      user: req.id,
    });
    if (customer) {
      const savedCards = await stripe.customers.listSources(
        customer.customerId,
        { object: "card" }
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
    return res.status(500).json(response);
  }
};

module.exports = {
  createCustomer,
  addNewCardToCustomer,
  getSavedCards,
};
