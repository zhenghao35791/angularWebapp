angular.module('mainapp').controller('registerCtrl', ['$interval', '$http', '$scope', '$state', function($interval, $http, $scope, $state){
  $scope.time = '';
  console.log("$scope.time: "+$scope.time);
  $scope.submit = function() {
    console.log("$scope.user: "+$scope.user);
    $http.post('data/regist.json',$scope.user).success(function(resp){
      console.log("$scope.user resp: "+resp);
      $state.go('login');
    });
  };
  var count = 60;
  $scope.send = function() {
    $http.get('data/code.json').then(function(resp){
      console.log("resp.data.state: "+resp.data.state);
      if(1===resp.data.state) {
        count = 60;
        $scope.time = '60s';
        var interval = $interval(function() {
          if(count<=0) {
            $interval.cancel(interval);
            $scope.time = '';
          } else {
            count--;
            $scope.time = count + 's';
          }
        }, 1000);
      }
    });
  };
}]);
