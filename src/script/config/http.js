/**
 * config/htpp.js
 */
angular.module('mainapp').config(['$provide', function($provide){
  $provide.decorator('$http', ['$delegate', '$q', function($delegate, $q){
    $delegate.post = function(url, data, config) {
      var def = $q.defer();
      $delegate.get(url).then(function(resp) {
        console.log("$delegate resp:"+resp);
        console.log("$delegate resp:"+resp.data);
        def.resolve(resp.data);
      }).catch(function(err) {
        def.reject(err);
      });
      return {
        success: function(cb){
          def.promise.then(cb);
        },
        error: function(cb) {
          def.promise.then(null, cb);
        }
      }
    };
    return $delegate;
  }]);
}]);