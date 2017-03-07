angular.module('mainapp').directive('appTab',[function(){
  return{
    restrict:'A',
    replace: true,
    scope:{
      list:'=',
      tabClick:'&'
    },
    templateUrl: 'view/template/tab.html',
    link:function($scope){
      $scope.click = function(item){
        $scope.selectId = item.id;
        tId = item.id;
        tName = item.name;

        //$scope.tabClick(tId,tName);//通知父级控制器，tab被点击了
        $scope.tabClick(item);//通知父级控制器，tab被点击了
        /*console.log("item: "+item);
        console.log("item.id: "+item.id);
        console.log("item.name: "+item.name);*/
      }
      /*$scope.$watch('com', function(newVal){
        if(newVal) $scope.showPositionList(0);
      });*/
    }
  }
}]);