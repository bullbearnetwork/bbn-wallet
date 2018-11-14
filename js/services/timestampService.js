require('angular');

angular.module('liskApp').service('timestampService', function () {
    return function () {
        return Math.floor(((new Date()).getTime() - (new Date(Date.UTC(2018, 9, 1, 0, 0, 0, 0))).getTime())/1000) - 1;
    }
});
// floor tired swim medal grid below dog copy plug bike awake butter
// risk inmate inmate kingdom bitter leopard glare gun riot detail outdoor orchard