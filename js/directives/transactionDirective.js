require('angular');

angular.module('liskApp').directive('transactionBlock', function () {
    return {
        templateUrl: 'templates/partials/directives/transactionBlock.html'
    };
})
