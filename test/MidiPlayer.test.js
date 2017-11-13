const assert = require('assert');
const MidiPlayer = require('../build/MidiPlayer');
const MidiParser = require('../build/MidiParser');
const testData = require('./data/MidiPlayerTestData');

describe('MidiPlayer', function() {
    const midiPlayer = new MidiPlayer();

    describe('loadingFunctions', function() {
        it('parsed dataUrl and provided test data should be equal', function(done) {
            const dataUrl = testData.dataUrl;
            midiPlayer.loadFromDataUrl(dataUrl, 5)
                .then(parsedData => {
                    assert.deepEqual(parsedData, testData.loadedWithNoteShiftFive);
                    done();
                })
                .catch(done);
        });
        it('parsed uint8Array and provided test data should be equal', function(done) {
            const uint8 = testData.uint8;
            midiPlayer.loadFromUint8Array(uint8, 5)
                .then(parsedData => {
                    assert.deepEqual(parsedData, testData.loadedWithNoteShiftFive);
                    done();
                })
                .catch(done);
        });
        it('parsed events and provided test data should be equal', function() {
            const midiParser = new MidiParser();
            const dataUrl = testData.dataUrl;
            const parsed = midiParser.parseDataUrl(dataUrl);
            const loadedData = midiPlayer.loadParsedMidi(parsed, 5);
            assert.deepEqual(loadedData, testData.loadedWithNoteShiftFive);
        });
        it('getDuration', function() {
            assert.equal(midiPlayer.getDuration(), testData.duration);
        });
    });

    describe('getEvents', function() {
        before('load player data', function(done) {
            midiPlayer.loadFromDataUrl(testData.dataUrl)
                .then(() => done())
                .catch(done);
        });

        it('getMidiEvents should equal provided test events', function() {
            assert.deepEqual(midiPlayer.getMidiEvents(), testData.events);
        });
        it('getNextEventsByTime should equal filtered data', function() {
            const time = 2000;
            const start = midiPlayer.getCurrentTime();
            const end = start + time;
            const expected = testData.events.filter(event => start <= event.timestamp && event.timestamp <= end);
            assert.deepEqual(midiPlayer.getNextEventsByTime(time), expected);
        });
        it('getPreviousEventsByTime should equal filtered data', function() {
            const time = 2000;
            const end = midiPlayer.getCurrentTime();
            const start = end - time;
            const expected = testData.events.filter(event => start <= event.timestamp && event.timestamp <= end);
            assert.deepEqual(midiPlayer.getPreviousEventsByTime(time), expected);
        });
        it('getPreviousEventsByTime should equal filtered data', function() {
            const start = 0;
            const end = midiPlayer.getDuration();
            assert.deepEqual(midiPlayer.getEventsByTimeRange(start, end), testData.events);
        });
    });
});