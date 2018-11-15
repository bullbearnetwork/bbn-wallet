require('angular');

angular.module('liskApp').service('delegateService', function (riseAPI, $http, $filter, $q) {

    function filterData(data, filter) {
        return $filter('filter')(data, filter);
    }

    function orderData(data, params) {
        return params.sorting() ? $filter('orderBy')(data, params.orderBy()) : filteredData;
    }

    function sliceData(data, params) {
        return data.slice((params.page() - 1) * params.count(), params.page() * params.count());
    }

    function transformData(data, filter, params) {
        return sliceData(orderData(filterData(data, filter), params), params)
          .map(function(item) {
              item.rate = item.rank;
              return item;
          });
    }

    var delegates = {
        topRate: 41,
        gettingStandBy: false,
        gettingTop: false,
        gettingVoted: false,
        cachedTOP: {data: [], time: new Date()},
        cachedStandby: {data: [], time: new Date()},
        cachedVotedDelegates: {data: [], time: new Date()},

        isActiveRate: function (rate) {
            return rate <= this.topRate;
        },

        getTopList: function ($defer, params, filter, cb) {
            if (!this.gettingTop) {
                this.gettingTop = !this.gettingTop;
                if (delegates.cachedTOP.data.length > 0 && new Date() - delegates.cachedTOP.time < 1000 * 10) {
                    var filteredData = filterData(delegates.cachedTOP.data, filter);
                    var transformedData = sliceData(orderData(filteredData, params), params);
                    params.total(filteredData.length)
                    this.gettingTop = !this.gettingTop;
                    cb();
                    $defer.resolve(transformedData);
                } else {
                    riseAPI.delegates.getList({orderBy: 'rank:asc', limit: this.topRate, offset: 0})
                        .then(function (response) {
                            angular.copy(response.delegates, delegates.cachedTOP.data);
                            delegates.cachedTOP.time = new Date();
                            params.total(response.delegates.length);
                            var filteredData = $filter('filter')(delegates.cachedTOP.data, filter);
                            var transformedData = transformData(delegates.cachedTOP.data, filter, params);
                            delegates.gettingTop = !delegates.gettingTop;
                            cb();
                            $defer.resolve(transformedData);
                        });
                }
            }
        },
        getStandbyList: function ($defer, params, filter, cb) {
            if (!this.gettingStandBy) {
                this.gettingStandBy = !this.gettingStandBy;
                if (delegates.cachedStandby.data.length > 0 && new Date() - delegates.cachedStandby.time < 1000 * 10) {
                    var filteredData = filterData(delegates.cachedStandby.data, filter);
                    var transformedData = sliceData(orderData(filteredData, params), params);
                    params.total(filteredData.length);
                    this.gettingStandBy = !this.gettingStandBy;
                    cb();
                    $defer.resolve(transformedData);
                }
                else {
                    this.cachedStandby.data = [];
                    var getPart = function (limit, offset) {
                        riseAPI.delegates.getList({orderBy: 'rank:asc', limit: limit, offset: offset})
                            .then(function (response) {
                                if (response.delegates.length > 0) {
                                    delegates.cachedStandby.data = delegates.cachedStandby.data.concat(response.delegates);
                                    getPart(limit, limit + offset);
                                } else {
                                    delegates.cachedStandby.time = new Date();
                                    params.total(delegates.cachedStandby.data.length);
                                    var filteredData = $filter('filter')(delegates.cachedStandby.data, filter);
                                    var transformedData = transformData(delegates.cachedStandby.data, filter, params);
                                    delegates.gettingStandBy = !delegates.gettingStandBy;
                                    cb();
                                    $defer.resolve(transformedData);
                                }
                            });
                    };
                    getPart(this.topRate, this.topRate);
                }
            }
        },
        getMyDelegates: function ($defer, params, filter, address, cb) {
            if (!this.gettingVoted) {
                this.gettingVoted = !this.gettingVoted;
                if (delegates.cachedVotedDelegates.data.length > 0 && new Date() - delegates.cachedVotedDelegates.time < 1000 * 10) {
                    var filteredData = filterData(delegates.cachedVotedDelegates.data, filter);
                    var transformedData = sliceData(orderData(filteredData, params), params);
                    params.total(filteredData.length);
                    this.gettingVoted = !this.gettingVoted;
                    $defer.resolve(transformedData);
                    cb();
                } else {
                  riseAPI.accounts.getDelegates(address)
                        .then(function (response) {
                            angular.copy(response.delegates ? response.delegates : [], delegates.cachedVotedDelegates.data);
                            delegates.cachedVotedDelegates.time = new Date();
                            params.total(response.delegates ? response.delegates.length : 0);
                            var filteredData = $filter('filter')(delegates.cachedVotedDelegates.data, filter);
                            var transformedData = transformData(delegates.cachedVotedDelegates.data, filter, params);
                            delegates.gettingVoted = !delegates.gettingVoted;
                            $defer.resolve(transformedData);
                            cb();
                        });
                }
            }
        },
        getDelegate: function (publicKey, cb) {
            riseAPI.delegates.getByPublicKey(publicKey)
              .catch(function (error) {
                cb({ noDelegate: true, rate: 0, productivity: 0, vote: 0 });
                return null;
              })
              .then(function (response) {
                if (!response) return;
                response.delegate.active = delegates.isActiveRate(response.delegate.rank);
                cb(response.delegate);

              })
            ;
        },
        getCountedDelegate: function (publicKey, cb) {
            $q.all([
              riseAPI.delegates.getByPublicKey(publicKey).catch(function (error) { return {success: false}}),
              riseAPI.delegates.getList({}).catch(function () { return {success: false}})
            ]).then(function(results) {
                if (results[0].success) {
                    var response = results[0];

                    if (results[1].success) {
                        response.delegate.totalCount = parseInt(results[1].totalCount) || 0;
                    } else {
                        response.delegate.totalCount = 0;
                    }

                    response.delegate.active = delegates.isActiveRate(response.delegate.rank);
                    cb(response.delegate);
                } else {
                    cb({noDelegate: true, rate: 0, productivity: 0, vote: 0, totalCount: 0});
                }
            });
        },
        getSearchList: function ($defer, search, params, filter, cb) {
            var queryParams = { params: { q: search } };
            var endpoint    = riseAPI.nodeAddress+"/api/delegates/search";
            if (search === '') {
                endpoint    = riseAPI.nodeAddress+'/api/delegates';
                queryParams = undefined;
            }
            $http.get(endpoint, queryParams)
                .then(function (response) {
                    var delegates = angular.copy(response.data.delegates) || [];
                    params.total(delegates.length);
                    var transformedData = transformData(delegates, filter, params);
                    cb();
                    $defer.resolve(transformedData);
                });
        },
    };

    return delegates;

});
