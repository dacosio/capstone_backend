const { OpenAI } = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_SECRET,
});

module.exports = {
    openai,
};
