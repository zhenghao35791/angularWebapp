angular.module('mainapp').directive('appPositionClass',[function(){
  return {
    restrict: 'A',
    replace: true,
    scope: {
      com: '='
    },
    templateUrl: 'view/template/positionClass.html',
    link: function($scope) {
      console.log($scope);
      $scope.showPositionList = function(idx) {
        $scope.positionList = $scope.com.positionClass[idx].positionList;
        $scope.isActive = idx;
      };
      $scope.$watch('com', function(newVal){
        if(newVal) $scope.showPositionList(0);
      });
    }
  }
}])