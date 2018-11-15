require('angular');

angular.module('liskApp').factory('serverSocket', ["socketFactory", "$location", 'riseAPI', function (socketFactory, $location, riseAPI) {

    var newIoSocket;
    if (riseAPI.nodeAddress !== '') {
      newIoSocket = io.connect(riseAPI.nodeAddress);
    } else {
      newIoSocket = io.connect($location.protocol() + '://' + $location.host() + ($location.port() ? ':' + $location.port() : ''));
    }
    serverSocket = socketFactory({
        ioSocket: newIoSocket
    });

    serverSocket.forward('transactions/change');
    serverSocket.forward('blocks/change');
    serverSocket.forward('delegates/change');
    serverSocket.forward('multisignatures/change');
    serverSocket.forward('multisignatures/signatures/change');
    serverSocket.forward('dapps/change');
    serverSocket.forward('rounds/change');

    return serverSocket;

}]);
