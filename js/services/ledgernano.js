require('angular');

angular.module('liskApp').service('ledgerNano', function ($location) {
  // var DposLedger       = require('dpos-ledger-api').DposLedger;
  // var LedgerAccount    = require('dpos-ledger-api').LedgerAccount;
  // var SupportedCoin    = require('dpos-ledger-api').SupportedCoin;
  // var transportBrowser = require('@ledgerhq/hw-transport-u2f').default;

  var obj = {
    account        : null, //new LedgerAccount().coinIndex(SupportedCoin.RISE).account(parseInt($location.$$search.ledgerAccount || '0', 10)),
    load: Promise.reject(false),
  };

  return obj;
});

/**
 new Promise(transportBrowser.create()
 .then(function (transport) {
        return new DposLedger(transport);
      })
 .then(function (instance) {
        obj.instance = instance;
        return instance.version();
      })
 .catch(function (err) {
        return false;
      })
 .then(function (version) {
        return version.coinID === 'rise';
      })
*/