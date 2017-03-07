angular.module('mainapp').directive('appFoot',[function(){
  return{
    restrict:'AE',
    replace:true,
    templateUrl:'view/template/foot.html'
  }
}]);