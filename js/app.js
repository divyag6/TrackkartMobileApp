// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('TrackkartApp', ['ionic','chart.js','TrackkartApp.factory'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
    	
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.run(['$rootScope','AuthFactory','ConfigFactory', function($rootScope,AuthFactory,ConfigFactory){
	$rootScope.isAuthenticated=AuthFactory.isLoggedIn();
	var user=AuthFactory.getUser('user');
    if(user)
    {
    	$rootScope.email=user.email;
    }
    
	
}])

.config(['$stateProvider','$urlRouterProvider','$httpProvider',
         function($stateProvider, $urlRouterProvider, $httpProvider) {
	 
	$httpProvider.defaults.headers.post['Content-Type'] = 
		'application/x-www-form-urlencoded;charset=utf-8';
	
	$httpProvider.defaults.headers.put['Content-Type'] = 
		'application/x-www-form-urlencoded;charset=utf-8';
	
	//setup the token inspector
	$httpProvider.interceptors.push('TokenInterceptor');
	
	//$ionicConfigProvider.views.maxCache(0);
	
	/**
	   * The workhorse; converts an object to x-www-form-urlencoded serialization.
	   * @param {Object} obj
	   * @return {String}
	   */ 
	  var param = function(obj) {
	    var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
	      
	    for(name in obj) {
	      value = obj[name];
	        
	      if(value instanceof Array) {
	        for(i=0; i<value.length; ++i) {
	          subValue = value[i];
	          fullSubName = name + '[' + i + ']';
	          innerObj = {};
	          innerObj[fullSubName] = subValue;
	          query += param(innerObj) + '&';
	        }
	      }
	      else if(value instanceof Object) {
	        for(subName in value) {
	          subValue = value[subName];
	          fullSubName = name + '[' + subName + ']';
	          innerObj = {};
	          innerObj[fullSubName] = subValue;
	          query += param(innerObj) + '&';
	        }
	      }
	      else if(value !== undefined && value !== null)
	        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
	    } 
	    return query.length ? query.substr(0, query.length - 1) : query;
	  };
	 
	  // Override $http service's default transformRequest
	  $httpProvider.defaults.transformRequest = [function(data) {
	    return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
	  }];
	  

	  
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  
  .state('app.home', {
      url: '/home',
      views: {
        'menuContent': {
          templateUrl: 'templates/home.html'
        }
      }
    })
    
    .state('app.about', {
      url: '/about',
      views: {
        'menuContent': {
          templateUrl: 'templates/about.html'
        }
      }
    })

  .state('app.contact', {
    url: '/contact',
    cache:false,
    views: {
      'menuContent': {
        templateUrl: 'templates/contact.html',
        controller:	'SendMailCtrl'
      }
    }
  })
  .state('app.login', {
      url: '/login',
      views: {
        'menuContent': {
          templateUrl: 'templates/login.html'
        }
      }
    })
  .state('app.orders', {
	    url: '/orders',
	    cache:false,
	    views: {
	      'menuContent': {
	        templateUrl: 'templates/orders.html',
	        controller: 'OrderCtrl'
	      }
	    }
  })
  .state('app.charts', {
	    url: '/charts',
	    cache:false,
	    views: {
	      'menuContent': {
	        templateUrl: 'templates/charts.html',
	        controller: 'ChartsCtrl'
	      }
	    }
  })
  .state('app.reset', {
	    url: '/reset/:token',
	    cache:false,
	    views: {
	        'menuContent': {
	        	templateUrl: 'templates/reset.html',
	        	controller: 'PasswordResetCtrl'
	        }
	    }
  })
  .state('app.configurations', {
	    url: '/configurations',
	    cache:false,
	    views: {
	      'menuContent': {
	        templateUrl: 'templates/configurations.html',
	        controller: 'ConfigCtrl'
	      }
	    }
  });
  
 
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
  
}]);
