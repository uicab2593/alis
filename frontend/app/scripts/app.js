'use strict';

/**
 * @ngdoc overview
 * @name angularApp
 * @description
 * # angularApp
 *
 * Main module of the application.
 */
angular
  .module('angularApp', ['ngRoute'])
  .config(function($routeProvider){
  	$routeProvider.
  	when('/',{
  		controller:'InicioController',
  		templateUrl: 'views/inicio.html',
  	}).
  	when('/dictado',{
  		// controller:'controllers/DictadoController',
  		templateUrl: 'views/dictado.html',
  	});
  });
