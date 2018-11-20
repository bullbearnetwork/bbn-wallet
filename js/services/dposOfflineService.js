require('angular');
var BBN = require('bbn-offline').BBN;
var BBT = require('bbn-offline').BBT;


angular.module('liskApp').service('BBNOffline', function () {
  return window.testnet ? BBT : BBN;
});
