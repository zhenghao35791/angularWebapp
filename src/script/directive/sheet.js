angular.module('mainapp').directive('appSheet',[function(){
  return{
    restrict:'A',
    replace: true,
    scope:{
      list:'=',
      visible:'=',
      selectTablist:'&'
    },
    templateUrl: 'view/template/sheet.html'
  }
}]);