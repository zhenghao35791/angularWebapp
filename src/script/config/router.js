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