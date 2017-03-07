angular.module('mainapp').controller('companyCtrl', ['$http', '$state', '$scope', function($http, $state, $scope){
  $http.get('data/company.json?id='+$state.params.id).then(function(resp){
    $scope.company = resp.data;
    console.log("$scope.company: "+$scope.company);
    $scope.$broadcast('abc',{id:1});//父级控制器向下进行广播，仅用来测试用，无状态的事件，不管是否接收，这里headBar.js接收
  });
  //接收子控制器headBar.js 用$emit传过来的事件。
  $scope.$on('cba',function(event,data){
    console.log("$emit: "+event, data);
  })
}]);
