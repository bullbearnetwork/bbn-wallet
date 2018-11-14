require('angular');

angular.module('liskApp').service('txService',
  function (riseAPI, BBNOffline, ledgerNano, userService, ledgerConfirmTransactionModal) {
  function _signTransaction(tx, secret, secondSecret) {
    if (userService.usingLedger) {
      tx.senderPublicKey = userService.publicKey;
      ledgerConfirmTransactionModal.activate({
        transaction: tx,
        address: userService.address,
      });
      return ledgerNano.instance
        .signTX(
          ledgerNano.account,
          tx.getBytes()
        )
        .then(function (signature) {
          ledgerConfirmTransactionModal.deactivate();
          tx._signature = signature.toString('hex');
          var transaction = tx.toObj();
          transaction.senderId = userService.address;
          return transaction;
        })
        .catch(function (err) {
          ledgerConfirmTransactionModal.deactivate();
          return Promise.reject(err);
        });
    } else {
      var walletKP = BBNOffline.deriveKeypair(secret);

      var secondWalletKP = null;
      if (secondSecret) {
        secondWalletKP = BBNOffline.deriveKeypair(secondSecret);
      }

      userService.checkWallets({
        address: BBNOffline.calcAddress(walletKP.publicKey),
        publicKey: walletKP.publicKey.toString('hex')
      }, {
        publicKey: secondWalletKP ? secondWalletKP.publicKey.toString('hex'): null
      });
      var signedTx = BBNOffline.txs.createAndSign(
        tx,
        BBNOffline.deriveKeypair(secret),
        true
        );
      if (secondSecret) {
        var secondSign = BBNOffline.txs.calcSignature(signedTx, BBNOffline.deriveKeypair(secondSecret), {
          skipSignature: false,
          skipSecondSignature: true
        });
        signedTx.signSignature = secondSign;
        signedTx.id = BBNOffline.txs.identifier(signedTx);
      }
      signedTx = BBNOffline.txs.toPostable(signedTx);
      return Promise.resolve(signedTx);
    }

  }

  function _broadcastSignedTX(tx) {
    return riseAPI
      .transactions
      .put(tx);
  }

  return {
    signAndBroadcast: function(tx, secret, secondSecret) {
      try {
        return _signTransaction(tx, secret, secondSecret)
          .then(_broadcastSignedTX)
          .then(function(r) {
            if (r.invalid.length === 1) {
              return Promise.reject(new Error(r.invalid[0].reason));
            }
            return r;
          })
      } catch (err) {
        console.log(err);
        return Promise.reject(err);
      }
    }
  }
});
