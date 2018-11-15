require('angular');

angular.module('liskApp').service('feeService', function ($http, riseAPI) {

    return function (cb) {
        $http.get(riseAPI.nodeAddress+'/api/blocks/getFees').then(function (response) {
            return cb(response.data.fees || {
                send: 0,
                vote: 0,
                secondsignature: 0,
                delegate: 0,
                multisignature: 0,
                dapp: 0
            });
        });
    }

});
