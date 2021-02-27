angular.module('TrackkartApp')

.controller('ConfigCtrl', ['$rootScope','$scope', 'Loader','ConfigFactory','UserFactory','$state','$ionicHistory','$ionicPopup',
    function( $rootScope,$scope, Loader, ConfigFactory, UserFactory, $state, $ionicHistory, $ionicPopup) {

	$scope.showConfigurations=function(){	
		
        if($rootScope.isAuthenticated)
        {
        	$scope.configs=[];
        	var isThere=false;
			var configs=[];
			$scope.configs=[];
	    	
			if(ConfigFactory.hasConfigs()){
				Loader.showLoading('Loading...');
				configs= ConfigFactory.getConfigs();
				ConfigFactory.getServerConfigs().success(function(response){
					Loader.hideLoading();
					for(var i=0;i<configs.length;i++)
					{
						for(var j=0;j<response.data.length;j++)
						{
							if(configs[i].id==response.data[j].id){	
								 isThere=true;
							}
						}	
						if(!isThere)
						{
							configs.splice(i,1);
						}	
						
					 }
					if(configs.length==0)
					{
						$scope.noVendorConfigs();
			        }
					$scope.configs=configs;
					ConfigFactory.setConfigs(configs);
				}).error(function(response){
    	    	   Loader.hideLoading();
    	    	   Loader.toggleLoadingWithMessage(response.error.message);
    	       });
			}
			else
				$scope.noVendorConfigs();
			
        }	
    };
    $scope.refreshConfigurations=function(){	
    	//refreshing configurations
    	//Loader.showLoading('Refreshing...This may take a few minutes');
    	$scope.showConfigurations();
        $scope.$broadcast('scroll.refreshComplete');
        $rootScope.processOn=false;
 
    };
    
    
    $scope.deleteConfig=function(index){
    	var confirmPopup = $ionicPopup.confirm({
    	     title: 'Delete Vendor Configuration',
    	     template: 'Are you sure you want to delete vendor configuration?',
    	     okType: 'button-calm'
    	   });

    	   confirmPopup.then(function(res) {
    	     if(res) {
    	       console.log('You are sure');
    	       Loader.showLoading('Deleting...');
    	      // console.log(index);
    	       ConfigFactory.deleteConfig(index).success(function(response) {
    	        	Loader.hideLoading();
    	        	$scope.configs.splice(index, 1);
    	        	if($scope.configs[0]==null){
    	        		$scope.noVendorConfigs();
    	        	}
    	       	
    	        	Loader.hideLoading();
    	       }).error(function(response){
    	    	   Loader.hideLoading();
    	    	   Loader.toggleLoadingWithMessage(response.error.message);
    	       });
    	        	
    	     } else {
    	       console.log('You are not sure');
    	     }
    	   });
    	
    };
    
   $scope.noVendorConfigs=function(){
	   var alertPopup = $ionicPopup.alert({
		     title: 'No vendor configurations!',
		     template: 'Please add vendors.',
		     okType: 'button-calm'	 
	   });

	   alertPopup.then(function(res) {
		 var element=document.getElementById('add-button');
        element.style.border = "3px solid white";
        element.style.animation=" blink 1s infinite";
	     console.log('No vendor configuration are found.');
	   });
   };
	
}]);
