require('angular');

angular.module('liskApp').controller('forgingModalController',
  ["$scope", "forgingModal", "riseAPI", "userService", 'gettextCatalog',
    function ($scope, forgingModal, riseAPI, userService, gettextCatalog) {

    $scope.error = null;
    $scope.sending = false;
    $scope.forging = userService.forging;
    $scope.focus = 'secretPhrase';

    if ($scope.forging) {
        $scope.label = gettextCatalog.getString('Disable Forging');
    } else {
        $scope.label = gettextCatalog.getString('Enable Forging');
    }

    $scope.close = function () {
        if ($scope.destroy) {
            $scope.destroy($scope.forging);
        }

        forgingModal.deactivate();
    }

    $scope.forgingState = function () {
        if ($scope.forging) {
            $scope.stopForging();
        } else {
            $scope.startForging();
        }
    }

    $scope.startForging = function () {
        $scope.error = null;

        if ($scope.forging) {
            return $scope.stopForging();
        }

        if (!$scope.sending) {
            $scope.sending = true;
          riseAPI.delegates.toggleForging({
            enable: true,
            secret: $scope.secretPhrase
          })
            .catch(function (error) {
              $scope.error = error.message;
              userService.setForging(false);
              $scope.forging = falses;
            })
            .then(function (resp) {
              userService.setForging(resp.success);
              $scope.forging = resp.success;
              $scope.sending = false;
              if ($scope.destroy) {
                $scope.destroy(resp.data.success);
              }

              Materialize.toast('Forging enabled', 3000, 'green white-text');
              forgingModal.deactivate();
            });
        }
    }

    $scope.stopForging = function () {
        $scope.error = null;

        if (!$scope.sending) {
            $scope.sending = true;
          riseAPI.delegates.toggleForging({
            enable: false,
            secret: $scope.secretPhrase
          })
            .catch(function (error) {
              $scope.error = error.message;
              userService.setForging(true);
              $scope.forging = true;
            })
            .then(function (resp) {
              userService.setForging(!resp.success);
              $scope.forging = !resp.success;
              $scope.sending = false;
              if ($scope.destroy) {
                $scope.destroy(resp.data.success);
              }

              Materialize.toast('Forging enabled', 3000, 'green white-text');
              forgingModal.deactivate();
            });
        }
    }

}]);
