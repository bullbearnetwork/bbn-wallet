require('angular');
var riseJs  = require('risejs').rise;
angular.module('liskApp').service('riseAPI', function () {
  riseJs.nodeAddress = nodeAddress;
  riseJs.errorAsResponse = false;
  return riseJs;

});
