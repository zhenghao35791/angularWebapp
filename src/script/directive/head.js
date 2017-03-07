angular.module('mainapp').directive('appHead', ['cache',function(cache){
  return {
    restrict: 'AE',
    replace: true,
    templateUrl: 'view/template/head.html',
    link: function($scope){
      $scope.name = cache.get('name') || '';
     }
  };
}]);
