require('angular');

angular.module('liskApp').filter('shortId', function () {
    return function (address) {
        if (!address) {
            return '';
        }

        return address.substr(0,8)+'…'+address.slice(-8);
    }
});
