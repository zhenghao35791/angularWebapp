angular.module('mainapp').controller('favoriteCtrl', ['$http', '$scope', function($http, $scope){
  $http.get('data/myFavorite.json').then(function(resp) {
    $scope.list = resp.data;
  });
}]);
