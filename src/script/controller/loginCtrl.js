angular.module('mainapp').controller('loginCtrl',
  ['cache', '$state', '$http', '$scope',
    function(cache, $state, $http, $scope){
  $scope.submit = function() {
    console.log("login $scope.user: "+$scope.user);

    $http.post('data/login.json', $scope.user).success(function(resp){
    //  resp = resp.data;
      console.log("login resp: "+resp);
      cache.put('id',resp.id);
       cache.put('name',resp.name);
       cache.put('image',resp.image);
      $state.go('main');
    });
  }
}]);
