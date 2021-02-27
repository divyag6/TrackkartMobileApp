angular.module('TrackkartApp')

.controller('PasswordResetCtrl', ['$rootScope','$ionicModal', '$scope', 'Loader','PasswordResetFactory','$location','$stateParams','AuthFactory', 
    function($rootScope, $ionicModal, $scope, Loader, PasswordResetFactory, $location, $stateParams, AuthFactory) {
	
	// Set the default value of inputType
	  $scope.inputType = 'password';
	  $scope.reset=[];
	  $scope.reset.token=$stateParams.token;
	  $scope.user={email:''};
	  
	  $ionicModal.fromTemplateUrl('templates/password.html', {
	        scope: $scope
	    }).then(function(modal) {
	        $scope.modal = modal;
	   }); 	    
	    $scope.openModal = function() {
	        $scope.modal.show();
	    };
	    $scope.closeModal = function() {
	        $scope.modal.hide();
	    };
	      //Cleanup the modal when we're done with it!
	    $scope.$on('$destroy', function() {
	        $scope.modal.remove();
	    });
	      // Execute action on hide modal
	    $scope.$on('modal.hidden', function() {
	    	  console.log("Hide");
	        // Execute action
	    });
	     
	 $scope.hideShowPassword = function(){
 	    if ($scope.inputType == 'password')
 	      $scope.inputType = 'text';
 	    else
 	      $scope.inputType = 'password';
 	  };
 	  
    $scope.sendLink=function(){
    	Loader.showLoading('Sending the link...');
    	PasswordResetFactory.sendLink($scope.user.email).success(function(response) {
    		Loader.hideLoading();
    		$scope.modal.hide();
            $location.path('/app/home');
            Loader.toggleLoadingWithMessage(response.message, 2000);
    	}).error(function(response) {
            Loader.hideLoading();
            Loader.toggleLoadingWithMessage(response.error.message);
         });
     };
     
     $scope.resetPassword=function(){
    	 Loader.showLoading('Resetting Password...');
     	PasswordResetFactory.resetPassword($scope.reset).success(function(response) {
     		AuthFactory.setUser(response.user);
            AuthFactory.setToken({
                 token: response.token,
              //   expires: response.expires
             });

             $rootScope.isAuthenticated = true;
             //$scope.modal.hide();
             Loader.hideLoading();
             $location.path('/app/home');
             Loader.toggleLoadingWithMessage(response.message, 2000);
     	}).error(function(response) {
             Loader.hideLoading();
             Loader.toggleLoadingWithMessage(response.error.message);
          });
     };
	
}]);
