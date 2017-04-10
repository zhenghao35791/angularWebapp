/*
  app.js
 */
var mainapp = angular.module('mainapp',['ui.router','ngCookies','validation','ngAnimate']);
/**
 * config/dist.js
 */
angular.module('mainapp').value('dict', {}).run(['dict', '$http', function(dict, $http){
  //.value('dict', {})创建一个全局变量dist，并初始化赋值为｛｝
  // 和service有点像，只是没有动态的逻辑，只是一个静态的值
  $http.get('data/city.json').then(function(resp){
    dict.city = resp.data;
  });
  $http.get('data/salary.json').then(function(resp){
    dict.salary = resp.data;
  });
  $http.get('data/scale.json').then(function(resp){
    dict.scale =  resp.data;
  });
}]);

/**
 * config/htpp.js
 */
angular.module('mainapp').config(['$provide', function($provide){
  $provide.decorator('$http', ['$delegate', '$q', function($delegate, $q){
    $delegate.post = function(url, data, config) {
      var def = $q.defer();
      $delegate.get(url).then(function(resp) {
        console.log("$delegate resp:"+resp);
        console.log("$delegate resp:"+resp.data);
        def.resolve(resp.data);
      }).catch(function(err) {
        def.reject(err);
      });
      return {
        success: function(cb){
          def.promise.then(cb);
        },
        error: function(cb) {
          def.promise.then(null, cb);
        }
      }
    };
    return $delegate;
  }]);
}]);
/**
 * config/router.js
 */
angular.module('mainapp').config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise('main');
    $stateProvider
      .state('main',{
      url:'/main',// /main:id 传参id
      templateUrl:'view/main.html',
      controller:'mainCtrl' //命名方式为，url+Ctrl
    }).state('position', {
      url: '/position/:id',
      templateUrl: 'view/position.html',
      controller: 'positionCtrl'
    }).state('company',{
        url:'/company/:id',
        templateUrl:'view/company.html',
        controller:'companyCtrl'
    }).state('search',{
      url:'/search',
      templateUrl:'view/search.html',
      controller:'searchCtrl'
    }).state('login', {
        url: '/login',
        templateUrl: 'view/login.html',
        controller: 'loginCtrl'
    }).state('register', {
      url: '/register',
      templateUrl: 'view/register.html',
      controller: 'registerCtrl'
    }).state('me', {
      url: '/me',
      templateUrl: 'view/me.html',
      controller: 'meCtrl'
    }).state('post', {
      url: '/post',
      templateUrl: 'view/post.html',
      controller: 'postCtrl'
    }).state('favorite', {
      url: '/favorite',
      templateUrl: 'view/favorite.html',
      controller: 'favoriteCtrl'
    });
}]);
/**
 * config/validation.js
 */
'use strict';
angular.module('mainapp').config(['$validationProvider', function($validationProvider) {
  var expression = {//校验表达式，可以是方法可以是正则
    phone: /^1[\d]{10}$/,
    password: function(value) {
      var str = value + '' //psd转成string
      return str.length > 5; //string长度要大于5
    },
    required: function(value) {//设定校验规则required不能为空
      return !!value;
    }
  };
  var defaultMsg = {//提示信息
    phone: {
      success: '',//如果校验成功的提示信息
      error: '必须是11位手机号' //如果校验失败的提示信息
    },
    password: {
      success: '',
      error: '长度至少6位'
    },
    required: {//设定校验规则required不能为空
      success: '',
      error: '不能为空'
    }
  };
  $validationProvider.setExpression(expression).setDefaultMsg(defaultMsg);//配置，先配置表达式，再配置提示信息
}]);

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

angular.module('mainapp').controller('favoriteCtrl', ['$http', '$scope', function($http, $scope){
  $http.get('data/myFavorite.json').then(function(resp) {
    $scope.list = resp.data;
  });
}]);

angular.module('mainapp').controller('loginCtrl',
  ['cache', '$state', '$http', '$scope',
    function(cache, $state, $http, $scope){
  $scope.submit = function() {
    console.log("login $scope.user: "+$scope.user);

    $http.post('data/login.json', $scope.user).success(function(resp){
    //  resp = resp.data;
      console.log("login resp: "+resp);
      cache.put('id',resp.id);
       cache.put('name',resp.name);
       cache.put('image',resp.image);
      $state.go('main');
    });
  }
}]);

angular.module('mainapp').controller('mainCtrl', ['$http', '$scope', function($http, $scope){
  $http.get('/data/positionList.json').then(function(resp){
    $scope.list = resp.data;
  });
}]);

angular.module('mainapp').controller('meCtrl',
  ['$state', 'cache', '$http', '$scope',
  function($state, cache, $http, $scope){
  if(cache.get('name')) {
    $scope.name = cache.get('name');
    $scope.image = cache.get('image');
  }
  $scope.logout = function() {
    cache.remove('id');
    cache.remove('name');
    cache.remove('image');
    $state.go('main');
  };
}]);

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

angular.module('mainapp').controller('postCtrl', ['$http', '$scope', function($http, $scope){
  $scope.tabList = [{
    id: 'all',
    name: '全部'
  }, {
    id: 'pass',
    name: '面试邀请'
  }, {
    id: 'fail',
    name: '不合适'
  }];
  $http.get('data/myPost.json').then(function(res){
    $scope.positionList = res.data;
  });
  $scope.filterObj = {};
  $scope.tClick = function(id, name) {
    switch (id) {
      case 'all':
        delete $scope.filterObj.state;
        break;
      case 'pass':
        $scope.filterObj.state = '1';
        break;
      case 'fail':
        $scope.filterObj.state = '-1';         
        break;
      default:

    }
  }
}]);

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

angular.module('mainapp').controller('searchCtrl',['$http', '$scope', 'dict',function($http,$scope,dist){
  $http.get('data/positionList.json').then(function(resp){
    $scope.positionList = resp.data;
  });
  $scope.name = '';
  $scope.search = function() {
    console.log("search");
    $http.get('data/positionList.json?name='+$scope.name).then(function(resp) {
      $scope.positionList = resp.data;
    });
  };
  $scope.search();
  $scope.sheet = {};
  $scope.filterObj = {};
  //tab三个标签的静态内容
  $scope.tabList = [{
    id: 'city',
    name: '城市'
  }, {
    id: 'salary',
    name: '薪水'
  }, {
    id: 'scale',
    name: '公司规模'
  }];
  var tabId = '';
  $scope.tClick = function(id,name){
    console.log("tClick: "+id, name);
    //123: city 城市
    //123: salary 薪水
    //123: scale 公司规模
    tabId = id;
    console.log("tabId: "+id);
    $scope.sheet.list = dist[id];//dist是提前加载过的静态变量
    //dist加载的内容，id为city，salary，scale。根据选择的id的不同，给list赋值不同的值
    $scope.sheet.visible = true;//点击的时候list列表就是可见的了
  };
  $scope.sClick = function(id,name){
    console.log(id,name);//s1 少于50人
    //点击的是第一个属性的时候，id为空，表明为所“全国”或者“不限”
    if(id){
      angular.forEach($scope.tabList, function(item){
        if(item.id === tabId){
          item.name = name;
        }
      });
      $scope.filterObj[tabId + 'Id'] = id;
      //如果选择的是城市北京（c1，北京），tabId是city，则过滤的对象是cityId
      //这里过滤对象就赋值为c1，过滤出所有有属性c1的item对象
    }
    else{
      delete $scope.filterObj[tabId + 'Id'];//选择不限或者全国的时候，删除掉过滤对象
      angular.forEach($scope.tabList, function(item){
        if(item.id === tabId){
          switch(item.id){
            case 'city':
              item.name = '城市';
              break;
            case 'salary':
              item.name = '薪资';
              break;
            case 'scale':
              item.name = '公司规模';
              break;
          }
        }
      });
    }

  }
}]);
/**
 * filter/filterByobj.js
 * 实现对数组的过滤
 */
angular.module('mainapp').filter('filterByObj',[function(){
  return function(list,obj){//数组| 要过滤的对象obj
    var result = [];
    angular.forEach(list,function(item){//对数组进行过滤
      var isEqual = true;
      for(var e in obj){
        if(item[e] !== obj[e]) {
          isEqual = false;
        }
      }
      if(isEqual){
        result.push(item);
      }
    });
    return result;
  }
}]);
angular.module('mainapp').directive('appCompany', [function(){
  return {
    restrict: 'A',
    replace: true,
    scope: {
      com: '='
    },
    templateUrl: 'view/template/company.html'
  };
}]);

angular.module('mainapp').directive('appFoot',[function(){
  return{
    restrict:'AE',
    replace:true,
    templateUrl:'view/template/foot.html'
  }
}]);
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
angular.module("mainapp").directive('appPositionInfo', ['$http', function($http){
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'view/template/positionInfo.html',
    scope:{
      pos:'=',
      isActive:'=',
      isLogin: '='
},
    link:function($scope){
      /*$scope.imagePath = $scope.isActive?'image/star-active.png':'image/star.png';
      $scope.isLogin = true;*/
      $scope.$watch('pos', function(newVal) {
        if(newVal) {
          $scope.pos.select = $scope.pos.select || false;
          $scope.imagePath = $scope.pos.select?'image/star-active.png':'image/star.png';
        }
      })
      $scope.favorite = function() {
        $http.post('data/favorite.json', {
          id: $scope.pos.id,
          select: !$scope.pos.select
        }).success(function(resp) {
          $scope.pos.select = !$scope.pos.select;
          $scope.imagePath = $scope.pos.select?'image/star-active.png':'image/star.png';
        });
      }
    }
  }
}]);

angular.module('mainapp').directive('appPositionList', ['cache', '$http', function(cache,$http){
    return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'view/template/positionList.html',
        scope: {
          data: '=',
          filterObj:'=',
          isFavorite: '='
        },
      link:function($scope){
       // $scope.name = cache.get('name') || '';
        $scope.select = function(item){
          $http.post('data/favorite.json', {
            id: item.id,
            select: !item.select
          }).success(function(resp){
            item.select = !item.select;
          })
        }
      }
    };
}]);

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
/**
 * service/cache.js
 */
angular.module('mainapp').service('cache',['$cookies',function($cookies){
  this.put = function(key, value){
    $cookies.put(key,value);
  };
  this.get = function(key){
    return $cookies.get(key);
  };
  this.remove = function(key){
    $cookies.remove(key);
  }
}]);