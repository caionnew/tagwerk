// Uhrzeit-Eingabe: Die Zifferntastatur am Handy hat oft keinen Doppelpunkt, darum zählt jedes übliche Trennzeichen.
const test = require('node:test'), assert = require('node:assert/strict');
const { loadApp } = require('../helpers/load.js');
const timeMatches = loadApp().get('timeMatches');
for (const v of ['7:45', '7.45', '7,45', '7 45', '7h45', '07.45', '745', '0745', '19:45', '19,45', '1945']) test(`„${v}“ gilt als 7:45`, () => assert.equal(timeMatches(v, 7, 45), true));
for (const v of ['7.40', '74', '8.45', '7:4', '7.455', '']) test(`„${v}“ gilt nicht als 7:45`, () => assert.equal(timeMatches(v, 7, 45), false));
test('volle Stunde als einzelne Zahl', () => { assert.equal(timeMatches('9', 9, 0), true); assert.equal(timeMatches('21', 9, 0), true); });
