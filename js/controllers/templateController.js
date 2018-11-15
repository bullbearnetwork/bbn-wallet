require('angular');

angular.module('liskApp').controller('templateController', ['$scope', '$rootScope', 'riseAPI', 'userService', "$interval", 'gettextCatalog', function ($rootScope, $scope, riseAPI, userService, $interval, gettextCatalog) {

    $scope.getInitialSync = function () {
        riseAPI.loader.syncStatus()
          .then(function (resp) {
            $rootScope.syncing = resp.syncing;
            $rootScope.height = resp.height;
            $rootScope.heightToSync = resp.blocks;
          });
    };

    $scope.syncInterval = $interval(function () {
        $scope.getInitialSync();
    }, 1000 * 10);

    $scope.getInitialSync();

}]);
