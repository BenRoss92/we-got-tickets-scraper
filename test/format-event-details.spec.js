var chai = require('chai');
const expect = chai.expect;

const formatCity = require('../src/format-event-details').formatCity;
const formatVenue = require('../src/format-event-details').formatVenue;
const formatArtists = require('../src/format-event-details').formatArtists;
const formatEventDetails = require('../src/format-event-details').formatEventDetails;

describe('format event details', () => {
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
  