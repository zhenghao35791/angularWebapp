angular.module('mainapp').directive('appHeadBar', [function(){
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'view/template/headBar.html',
    scope: {
      text: '@'
    },
    link: function($scope) {
      $scope.back = function() {
        window.history.back();
      };
      //接受父控制器companyCtrl传来的广播事件
      $scope.$on('abc',function(event, data){
        console.log("event: "+event);
        console.log("data: "+data);
      })
      $scope.$emit('cba',{name:'zhenghao'});//向上冒泡传给父级companyCtrl.js一个事件；
    }
  };
}]);
