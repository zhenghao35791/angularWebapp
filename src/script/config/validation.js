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
