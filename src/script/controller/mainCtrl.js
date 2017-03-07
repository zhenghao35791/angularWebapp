angular.module('mainapp').controller('mainCtrl', ['$http', '$scope', function($http, $scope){
  $http.get('/data/positionList.json').then(function(resp){
    $scope.list = resp.data;
  });
}]);
