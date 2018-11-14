require('angular');
var BBN = require('bbn-offline').BBN;


angular.module('liskApp').service('BBNOffline', function () {
  return BBN;
});
