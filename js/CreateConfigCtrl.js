angular.module('TrackkartApp')

.controller('CreateConfigCtrl', ['$ionicModal', '$scope', 'Loader','ConfigFactory','$ionicPopup','$timeout','LSFactory','$rootScope',
                                 function($ionicModal, $scope, Loader, ConfigFactory,$ionicPopup,$timeout,LSFactory,$rootScope) {

	$scope.vendors = ['pepperfry', 'fabfurnish', 'flipkart' ,'amazon' ,'snapdeal' ,'jabong'];
	$scope.data = {};
	$scope.data.index = 0;
	// Set the default value of inputType
	$scope.inputType = 'password';
	$scope.showPassword=false;
	$scope.config = {
			vendor_id:'',
			name:'',
            email: $rootScope.email,
            password: ''
        };
	$scope.captcha={};
	
	$ionicModal.fromTemplateUrl('templates/create.html', {
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
		$scope.showPassword=!$scope.showPassword;
	    if ($scope.inputType == 'password')
	      $scope.inputType = 'text';
	    else
	      $scope.inputType = 'password';
	};
	  
	$scope.storeConfig=function(){
      	$scope.config.vendor_id=$scope.data.index+1;
      	$scope.config.name=$scope.vendors[$scope.data.index];
      	var attempts=LSFactory.get('attempts'+$scope.config.name); 
      	if(attempts==null)
      	{
      		LSFactory.set('attempts'+$scope.config.name,1);
      		attempts=1;
      	}
      	
      	if(attempts>=3)
         {
      		 console.log("please check");
      		var confirmPopup = $ionicPopup.confirm({
   		     title: 'This is your 3rd attempt!',
   		     template: 'Please ensure the username & password are correct.',
   		     okType: 'button-calm',	 
   		     cancelType: 'button-light'	 
      		});
      		confirmPopup.then(function(res) {
      			if(res)
      				$scope.verifyConfig();
      		});
         }
      	 else
      		$scope.verifyConfig();
	};
	
	$scope.verifyConfig=function(){
		Loader.showLoading('Verifying Vendor Configuration...');
		   
	    if(ConfigFactory.notRedundant($scope.config))
	    {
	    	ConfigFactory.verify($scope.config).success(function(response) {
	    		$scope.config.id=response.data.id;
	    		LSFactory.set('attempts'+$scope.config.name,1);
	        	Loader.showLoading(response.message);
	        	$scope.modal.hide();
	        	Loader.hideLoading();
	        	//var offset=response.data.vendor_id-1;
	        	//response.data.name=$scope.vendors[offset];
	        	
	        	ConfigFactory.addConfig($scope.config);
	        	$scope.configs.push($scope.config);
	        
	        	if($scope.configs!=null)
	        	{
	        		var element=document.getElementById('add-button');
	                element.style.animation="none";
	                element.style.border="none";
	        	}
		    }).error(function(response) {
	            Loader.hideLoading();
	            Loader.toggleLoadingWithMessage(response.error.message);
	            var attempts=LSFactory.get('attempts'+$scope.config.name); 
	            attempts++;
	            LSFactory.set('attempts'+$scope.config.name,attempts);
	            /*if(response.error.message[0]=="captcha")
	      		{
	            	$scope.config.postfields=response.error.message[2];
	            	$scope.showPopup(response.error.message[1]);
	            }
	            else{
	            	Loader.toggleLoadingWithMessage(response.error.message);
	            }*/
		    });
	    }
	    else
	    {
	    	Loader.hideLoading();
	    	Loader.toggleLoadingWithMessage("Configuration already exists!");
	    }
	};	
 // Triggered on a button click, or some other target
    $scope.showPopup = function(image) {
      // An elaborate, custom popup
      var myPopup = $ionicPopup.show({
        template:'<input type="password" ng-model="config.captcha">',
        title: 'Enter captcha',
        subTitle:image,
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Ok</b>',
            type: 'button-positive',
            onTap: function(e) {
              if (!$scope.config.captcha) {
                //don't allow the user to close unless he enters wifi password
                e.preventDefault();
              } else {
                return $scope.config.captcha;
              }
            }
          },
        ]
      });
      myPopup.then(function(res) {
        console.log(res);
        console.log($scope.config);
       $scope.storeConfig();
      });
      
     };	  
    
}]);
