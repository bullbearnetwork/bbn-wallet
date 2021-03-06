require('angular');

angular.module('liskApp').controller('blockModalController', ["$scope", "$http", 'riseAPI', "blockModal", "userInfo", function ($scope, $http, riseAPI, blockModal, userInfo) {

    $scope.loading = true;
    $scope.transactions = [];
    $scope.getTransactionsOfBlock = function (blockId) {
        $http.get(riseAPI.nodeAddress+"/api/transactions/", {params: {blockId: blockId}})
            .then(function (resp) {
                $scope.transactions = resp.data.transactions;
                $scope.loading = false;
            });
    };

    $scope.getTransactionsOfBlock($scope.block.id);

    $scope.close = function () {
        blockModal.deactivate();
    }

    $scope.userInfo = function (userId) {
        blockModal.deactivate();
        $scope.userInfo = userInfo.activate({userId: userId});
    }

}]);
