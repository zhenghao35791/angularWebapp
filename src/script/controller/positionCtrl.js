angular.module('mainapp').controller('positionCtrl', ['$log','$q', '$http', '$scope', '$state', 'cache',
  function($log, $q, $http, $scope, $state, cache){
   /*
    测试cache是否生效的代码
    cache.put("to","day");
    cache.remove("to");*/
    console.log("$scope.isLogin: "+$scope.isLogin);//“返回为登录名”
    console.log("!!$scope.isLogin: "+!!$scope.isLogin); //返回为true，通过！！强行将返回的登录名转换为布尔值
    $scope.isLogin = cache.get('name');
    $scope.message = $scope.isLogin?'投个简历':'去登录';

    function getPosition(){//把异步变同步
      var def = $q.defer();//首先创建一个延迟加载对象
      $http.get('data/position.json', {
        params: {
          id: $state.params.id
        }
      }).then(function(resp) {
        $scope.position = resp.data;
        console.log("id: "+$state.params.id);
        def.resolve(resp);//处理完异步操作的时候，调用resolve函数，传入需要传入的参数，一般为response
        //发生错误的时候，调用reject函数

        if(resp.posted) {  //查看返回数据，是否已经投递
          $scope.message = '已投递';
        }
      });
      return def.promise;//返回def对象的promise属性
    }

    function getCompany(id) {
      $http.get('data/company.json?id='+id).then(function(resp){
        $scope.company = resp.data;
        console.log("$scope.company: "+resp.data);
      })
    }

    //getPosition（）函数返回的时候promise对象，promise对象有then函数
    //then函数作用，当异步请求完成并调用reslove后，会调用第一个传入的函数，
    // 这里是function(resp)｛...｝，resp参数就是reslove函数传入的参数
    getPosition().then(function(obj){
      getCompany(obj.data.companyId);
      console.log("id2: "+obj.data.id);
    });

    $scope.go = function() {
      if($scope.message !== '已投递') {
        if($scope.isLogin) {
          $http.post('data/handle.json', {
            id: $scope.position.id
          }).success(function(resp) {
            $log.info(resp);
            $scope.message = '已投递';
          });
        } else {
          $state.go('login');
        }
      }
    }
}]);
