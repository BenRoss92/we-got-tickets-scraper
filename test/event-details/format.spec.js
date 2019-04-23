var chai = require('chai');
const expect = chai.expect;

const formatCity = require('../../src/event-details/format').formatCity;
const formatVenue = require('../../src/event-details/format').formatVenue;
const formatArtists = require('../../src/event-details/format').formatArtists;
const formatEventDetails = require('../../src/event-details/format').formatEventDetails;
const formatHeaders = require('../../src/event-details/format').formatHeaders;

describe('format headers', () => {
  describe('#formatHeaders', () => {
    it('formats an array of headers into CSV headers', () => {
      const headerArray = ['artists', 'city', 'venue', 'date', 'price'];

      const headerString = formatHeaders(headerArray);
      
      expect(headerString).to.eql("artists,city,venue,date,price\n");
    });
  });
});

describe('format event details', () => {
  const formattingWarning = 'WARNING: CHECK FORMATTING'; 

  describe('#formatCity', () => {
    it('returns the correctly formatted city', () => {
      // given
      const expectedCity = 'Hockley';
      const cityAndVenue = 'HOCKLEY : Touchline Live Music @ Hockley Community Centre';
  
      // when
      const city = formatCity(cityAndVenue);
  
      // then
      expect(city).to.equal(expectedCity);
    });
  
    describe('when a city has two words', () => {
      it('returns both words correctly formatted', () => { 
  
        // given
        const cityAndVenue = 'BUENOS AIRES : The Prince Albert';
        const expectedCity = 'Buenos Aires';
  
        // when
        const city = formatCity(cityAndVenue);
        
        // then
        expect(city).to.equal(expectedCity);
      });
    });

    describe('when neither city nor venue contain semicolon', () => {
      it('returns warning to check formatting', () => {
        const cityAndVenue = 'Emsworth Community Centre, Church Path, Emsworth, PO10 7DD';

        const city = formatCity(cityAndVenue);

        expect(city).to.equal(formattingWarning);
      });
    });

    describe('when city does not exist', () => {
      it('returns undefined', () => {
        const cityAndVenue = '';

        const city = formatCity(cityAndVenue);

        expect(city).to.be.undefined;
      });
    });
  });

  describe('#formatVenue', () => {
    it('returns correctly formatted venue', () => {
      // given
      const cityAndVenue = 'BRIGHTON: The Prince Albert';
      const expectedVenue = 'The Prince Albert';

      // when
      const venue = formatVenue(cityAndVenue);

      // then
      expect(venue).to.equal(expectedVenue);
    });

    describe('when neither city nor venue contain semicolon', () => {
      it('returns warning to check formatting', () => {
        const cityAndVenue = 'Emsworth Community Centre, Church Path, Emsworth, PO10 7DD';

        const venue = formatVenue(cityAndVenue);

        expect(venue).to.equal(formattingWarning);
      });
    });

    describe('when venue does not exist', () => {
      it('returns undefined', () => {
        const cityAndVenue = '';

        const venue = formatVenue(cityAndVenue);

        expect(venue).to.be.undefined;
      });
    });
  });

  describe('#formatArtists', () => {
    it('returns correctly formatted artists', () => {
      const upperCaseArtist = 'THE DREAMERS';
      const expectedArtist = 'The Dreamers';

      const artist = formatArtists(upperCaseArtist);

      expect(artist).to.equal(expectedArtist);
    });
  });

  describe('#formatEventDetails', () => {
    it('correctly formats unformatted event details', () => {
      // given
      const unformattedDetails = {
        artists: 'THE DREAMERS',
        cityAndVenue: 'DARLINGTON: Harrowgate Club & Institute Ltd',
        date: 'FRI 28TH SEP, 2018 6:30pm',
        price: '£9.90',
      };

      const formattedDetails = {
        artists: 'The Dreamers',
        city: 'Darlington',
        venue: 'Harrowgate Club & Institute Ltd',
        date: 'FRI 28TH SEP, 2018 6:30pm',
        price: '£9.90',
      };

      // when
      const details = formatEventDetails(unformattedDetails);

      // then
      expect(details).to.eql(formattedDetails);
    });
  });
});
  