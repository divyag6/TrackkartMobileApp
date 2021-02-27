angular.module('TrackkartApp')

.controller('UpdateConfigCtrl', ['$ionicModal', '$scope', 'Loader','ConfigFactory',
    function($ionicModal, $scope, Loader, ConfigFactory) {
		
		$scope.inputType = 'password';
		$ionicModal.fromTemplateUrl('templates/update.html', {
	        scope: $scope
	    }).then(function(modal) {
	        $scope.modal = modal;
	   }); 	    
	    $scope.openModal = function(index) {
	    	$scope.config=angular.copy($scope.configs[index]);
		 	$scope.config.password="";
		 	$scope.index=index;
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
			$scope.showPassword=!$scope.showPassword;
		    if ($scope.inputType == 'password')
		      $scope.inputType = 'text';
		    else
		      $scope.inputType = 'password';
		};
	       
        $scope.updateConfig=function(index){
        	
	    	Loader.showLoading('Updating Vendor Configuration...');
	    	if(ConfigFactory.notUpdateRedundant($scope.config,index))
	    	{
	    		ConfigFactory.verifyUpdate($scope.configs[$scope.index],$scope.config).success(function(response) {
	    		
		    		ConfigFactory.update($scope.config,index);
		    		Loader.showLoading(response.message);
		        	$scope.modal.hide();
		        	Loader.hideLoading();
		        	$scope.configs[$scope.index]=$scope.config;
	    		}).error(function(response) {
	    			Loader.hideLoading();
	    			Loader.toggleLoadingWithMessage(response.error.message);
	    		});
	    	}
	    	else
	    	{
	    		Loader.hideLoading();
    			Loader.toggleLoadingWithMessage("Configuration already exists");
	    	}
	    };

}]);
