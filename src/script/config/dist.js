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
