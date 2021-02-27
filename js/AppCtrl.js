angular.module('TrackkartApp')

.controller('AppCtrl', ['$http','$rootScope','$ionicModal', 'AuthFactory', '$location', 'UserFactory', '$scope', 'Loader','$window','$ionicPopup',
    function($http,$rootScope, $ionicModal, AuthFactory, $location, UserFactory, $scope, Loader, $window,$ionicPopup) {

        $scope.$on('showLoginModal', function($event, scope, cancelCallback, callback) {
            $scope.user = {
                email: $rootScope.email,
                password:''
            };
         // Set the default value of inputType
  		  $scope.inputType = 'password';
  		  $scope.showPassword=false;
            $scope = scope || $scope;

            $scope.viewLogin = true;

            $ionicModal.fromTemplateUrl('templates/login.html', {
                scope: $scope
            }).then(function(modal) {
                $scope.modal = modal;
                $scope.modal.show();

                $scope.switchTab = function(tab) {
                    if (tab === 'login') {
                        $scope.viewLogin = true;
                    } else {
                        $scope.viewLogin = false;
                    }
                }

                $scope.hide = function() {
                    $scope.modal.hide();
                    if (typeof cancelCallback === 'function') {
                        cancelCallback();
                    }
                }

                $scope.login = function() {
                	
                    Loader.showLoading('Authenticating...');
                    UserFactory.login($scope.user).success(function(response) {
                    	
                    	//AuthFactory.addUserEmails(response.user.email);
                    	AuthFactory.setUser(response.user);
                        AuthFactory.setToken({
                             token: response.token
                         });
                        
                         $rootScope.isAuthenticated = true;
                         $scope.modal.hide();
                         Loader.hideLoading();
                         $location.path('/app/home');
                         
                    }).error(function(response) {
                        Loader.hideLoading();
                       Loader.toggleLoadingWithMessage(response.error.message);
                    });
                };

                $scope.register = function() {
                    Loader.showLoading('Registering...');

                    UserFactory.register($scope.user).success(function(response) {
                        AuthFactory.setUser(response.user);
                        AuthFactory.setToken({
                            token: response.token
                            //expires: data.expires
                        });

                        $rootScope.isAuthenticated = true;
                        $scope.modal.hide();
                        Loader.hideLoading();
                        var alertPopup = $ionicPopup.alert({
               		     title: 'Rest Assured!',
               		     template: 'We do not store any passwords at our end.',
               		     okType: 'button-calm'	 
                        });
                        alertPopup.then(function(res) {
                        	$location.path('/app/configurations');
                        });	
                	}).error(function(response) {
                		Loader.hideLoading();
                		Loader.toggleLoadingWithMessage(response.error.message);
                	});
                }
            });
       });

        $scope.loginFromMenu = function() {
        	$scope.$broadcast('showLoginModal', $scope, null, null);
        };

        $scope.logout = function() {
        	var vendors = ['pepperfry', 'fabfurnish', 'flipkart' ,'amazon' ,'snapdeal' ,'jabong'];
        	UserFactory.logout(vendors).success(function(response) {
            	
                $rootScope.isAuthenticated = false;
                Loader.hideLoading();
                $location.path('/app/home');
                Loader.toggleLoadingWithMessage(response.message, 2000);
                
            	}).error(function(response) {
            		Loader.hideLoading();
            		console.log(response);
            		Loader.toggleLoadingWithMessage(response.error.message);
            	});
            
            
        };
        $scope.hideShowPassword = function(){
        	$scope.showPassword=!$scope.showPassword;
    	    if ($scope.inputType == 'password')
    	      $scope.inputType = 'text';
    	    else
    	      $scope.inputType = 'password';
    	  };
        $scope.toggle=function(){
        	if($rootScope.isAuthenticated==true){
        		var user=AuthFactory.getUser();
        		if(user)
        		{
        			$scope.title ="Welcome " + user.name;
        		}
        		return true;
        	}else{
        		
        		$scope.title="Welcome Guest";
        		return true;
        	}
        		
        };

    }
]);