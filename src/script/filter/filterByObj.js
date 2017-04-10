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