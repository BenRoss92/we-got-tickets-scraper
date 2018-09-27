const capitalizeWords = (words) => words
  .toLowerCase()
  .split(' ')
  .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
  .join(' ');

const formatCity = (cityAndVenue) => {
  const cityUpperCase = cityAndVenue.split(':')[0].trim();

  return capitalizeWords(cityUpperCase);
};

const formatArtists = upperCaseArtists => capitalizeWords(upperCaseArtists);
  
const formatVenue = cityAndVenue => cityAndVenue.split(':')[1].trim();

const formatEventDetails = unformattedDetails => {
  const {artists, cityAndVenue, date, price } = unformattedDetails;

  return {
    artists: formatArtists(artists),
    city: formatCity(cityAndVenue),
    venue: formatVenue(cityAndVenue),
    date,
    price,
  };
};

module.exports = {
    formatCity,
    formatVenue,
    formatArtists,
    formatEventDetails,
};