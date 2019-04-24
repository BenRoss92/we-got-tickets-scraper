const capitalizeWords = (words) => words && words
  .toLowerCase()
  .split(' ')
  .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
  .join(' ');

const formatCity = (cityAndVenue) => {
  if (!cityAndVenue) {
    return;
  }

  if (cityAndVenue.includes(':')) {
    const cityUpperCase = cityAndVenue.split(':')[0].trim();
    return capitalizeWords(cityUpperCase);
  }

  return 'WARNING: CHECK FORMATTING';
};

const formatArtists = upperCaseArtists => capitalizeWords(upperCaseArtists);
  
const formatVenue = cityAndVenue => {
  if (!cityAndVenue) {
    return;
  }

  if (cityAndVenue.includes(':')) {
    const venue = cityAndVenue.split(':')[1];
    return venue && venue.trim();
  }

  return 'WARNING: CHECK FORMATTING';
};

const formatDateAndTime = dateAndTime => dateAndTime.join('. ');

const formatPrices = prices => prices.map(price => `${price.title}: ${price.value}`).join(', ');

const formatEventDetails = unformattedDetails => {
  const { artists, cityAndVenue, dateAndTime, prices } = unformattedDetails;

  return {
    artists: formatArtists(artists),
    city: formatCity(cityAndVenue),
    venue: formatVenue(cityAndVenue),
    date: formatDateAndTime(dateAndTime),
    prices: formatPrices(prices),
  };
};

const formatHeaders = headers => `${headers.join(',')}\n`;

module.exports = {
  formatCity,
  formatVenue,
  formatArtists,
  formatEventDetails,
  formatHeaders,
  formatDateAndTime,
  formatPrices,
};