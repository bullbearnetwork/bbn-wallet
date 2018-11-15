require('angular');

angular.module('liskApp').controller("loadingController", ["$scope", "riseAPI", "$interval", "$window", function ($scope, riseAPI, $interval, $window) {

    $scope.height = null;
    $scope.height = 0;

    $scope.getHeight = function () {
      riseAPI.loader.status()
        .then(function (resp) {
          $window.location.href = '/';
        });
    };

    $scope.getHeight();

    $scope.heightInterval = $interval(function () {
        $scope.getHeight();
    }, 2000);

}]);
