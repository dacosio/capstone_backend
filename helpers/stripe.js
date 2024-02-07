const extractedInfo = (cardDetails) =>
  cardDetails.map((cardDetail) => {
    const { card } = cardDetail;
    const { brand, exp_month, exp_year, last4 } = card;
    const expYear = exp_year.toString().slice(-2);

    return {
      brand,
      expMonth: exp_month,
      expYear,
      last4,
    };
  });

module.exports = {
  extractedInfo,
};
