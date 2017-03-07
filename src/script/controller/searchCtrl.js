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