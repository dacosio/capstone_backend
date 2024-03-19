const { OpenAI } = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
console.log("🚀 ~ process.env.OPENAI_API_KEY:", process.env.OPENAI_API_KEY);

module.exports = {
    openai,
};
