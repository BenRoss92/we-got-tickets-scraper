var chai = require('chai');
const expect = chai.expect;

const formatCity = require('../../src/event-details/format').formatCity;
const formatVenue = require('../../src/event-details/format').formatVenue;
const formatArtists = require('../../src/event-details/format').formatArtists;
const formatEventDetails = require('../../src/event-details/format').formatEventDetails;
const formatHeaders = require('../../src/event-details/format').formatHeaders;
const formatDateAndTime = require('../../src/event-details/format').formatDateAndTime;
const formatPrices = require('../../src/event-details/format').formatPrices;

describe('format headers', () => {
  describe('#formatHeaders', () => {
    it('formats an array of headers into CSV headers', () => {
      const headerArray = ['artists', 'city', 'venue', 'date', 'prices'];

      const headerString = formatHeaders(headerArray);
      
      expect(headerString).to.eql("artists,city,venue,date,prices\n");
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

  describe('#formatDateAndTime', () => {
    it('returns correctly formatted date and time', () => {
      const dateAndTime = ['Wed 24th Apr, 2019', 'Door time: 7:30pm'];
      const expectedDateAndTime = 'Wed 24th Apr, 2019. Door time: 7:30pm'

      expect(formatDateAndTime(dateAndTime)).to.equal(expectedDateAndTime);
    });
  });

  describe('#formatPrices', () => {
    describe('when receiving a single price', () => {
      it('returns a string containing the price title and value', () => {
        const prices = [
          {
              title: 'General Admission', value: '£11.00'
          },
        ];
  
        const expectedPrices = 'General Admission: £11.00';
  
        expect(formatPrices(prices)).to.equal(expectedPrices);
      });
    });

    describe('when receiving multiple prices', () => {
      it('returns a string of price titles and values, separated by commas', () => {
        const prices = [
          {
              title: 'General Admission', value: '£11.00'
          },
          {
              title: 'CONCESSIONS', value: '£9.90'
          },
          {
              title: 'Family Ticket (2 adults & 2 children)', value: '£23.10'
          },
          {
              title: 'school children', value: '£3.30'
          },
        ];
  
        const expectedPrices = 'General Admission: £11.00, CONCESSIONS: £9.90, Family Ticket (2 adults & 2 children): £23.10, school children: £3.30';
  
        expect(formatPrices(prices)).to.equal(expectedPrices);
      });
    });
  });

  describe('#formatEventDetails', () => {
    it('correctly formats unformatted event details', () => {
      // given
      const unformattedDetails = {
        artists: 'PUPPY',
        cityAndVenue: 'LEEDS: The Brudenell Social Club',
        dateAndTime: ['Wed 24th Apr, 2019', 'Door time: 7:30pm'],
        prices: [
          { title: 'General Admission', value: '£11.00' }
        ],
      };

      const formattedDetails = {
        artists: 'Puppy',
        city: 'Leeds',
        venue: 'The Brudenell Social Club',
        date: 'Wed 24th Apr, 2019. Door time: 7:30pm',
        prices: 'General Admission: £11.00',
      };

      // when
      const details = formatEventDetails(unformattedDetails);

      // then
      expect(details).to.eql(formattedDetails);
    });
  });
});
  