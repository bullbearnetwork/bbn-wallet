require('angular');

angular.module('liskApp').controller('walletTransactionsController',
  ['$scope', '$rootScope', '$http', 'riseAPI', "userService", "$interval", "sendTransactionModal", "secondPassphraseModal", "delegateService", 'viewFactory', 'transactionsService', 'ngTableParams', 'transactionInfo', '$timeout', 'userInfo', '$filter', 'multiMembersModal', '$stateParams', 'multiService', 'gettextCatalog',
    function ($rootScope, $scope, $http, riseAPI, userService, $interval, sendTransactionModal, secondPassphraseModal, delegateService, viewFactory, transactionsService, ngTableParams, transactionInfo, $timeout, userInfo, $filter, multiMembersModal, $stateParams, multiService, gettextCatalog) {

    $scope.view = viewFactory;
    $scope.view.page = {title: gettextCatalog.getString('Transactions'), previous: 'main.multi'};
    $scope.view.bar = {};
    $scope.showAllColumns = true;
    $scope.showFullTime = false;
    $scope.transactionsView = transactionsService;
    $scope.searchTransactions = transactionsService;
    $scope.countForgingBlocks = 0;
    $scope.walletAddress = $stateParams.walletId;

    $scope.userInfo = function (userId) {
        $scope.modal = userInfo.activate({userId: userId});
    }

    $scope.transactionInfo = function (block, signList) {
        $scope.modal = transactionInfo.activate({block: block, signList: signList});
    }

    $scope.getParams = function () {

        riseAPI.accounts.getAccount($scope.walletAddress)
            .then(function (response) {
                $scope.requestParams = {
                    ownerPublicKey: response.account.publicKey,
                    ownerAddress: response.account.address,
                    recipientId: response.account.address,
                    senderId: response.account.address
                };
                $scope.updateTransactions();
            })
          .catch(function (err) {
              console.log(err);
          });

    }();

    // Transactions
    $scope.tableWalletTransactions = new ngTableParams({
        page: 1,
        count: 25,
        sorting: {
            timestamp: 'desc'
        }
    }, {
        total: 0,
        counts: [],
        getData: function ($defer, params) {
            if ($scope.requestParams) {
                transactionsService.getMultiTransactions($defer, params, $scope.filter,
                    $scope.requestParams, function (error) {
                        $timeout(function () {
                            $scope.$apply();
                        }, 1);
                    });
            }
        }
    });

    $scope.tableWalletTransactions = {
        height : gettextCatalog.getString('Height'),
        id : gettextCatalog.getString('Transaction ID'),
        recipientId : gettextCatalog.getString('Recipient'),
        timestamp : gettextCatalog.getString('Time'),
        amount : gettextCatalog.getString('Amount'),
        fee : gettextCatalog.getString('Fee'),
        confirmations : gettextCatalog.getString('Confirmations')
    };

    $scope.tableWalletTransactions.settings().$scope = $scope;

    $scope.$watch("filter.$", function () {
        $scope.tableWalletTransactions.reload();
    });
    // end Transactions

    $scope.updateTransactions = function () {
        $scope.tableWalletTransactions.reload();
    }

    $scope.$on('$destroy', function () {
    });

    $scope.showMembers = function (confirmed) {
        $scope.multiMembersModal = multiMembersModal.activate({
            confirmed: confirmed,
            destroy: function () {
            }
        });
    }

}]);
