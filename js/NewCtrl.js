angular.module('TrackkartApp')

.controller('NewCtrl', ['$ionicModal', '$scope',
                                 function($ionicModal, $scope) {

	
	// $scope.showCreate=function() {
		$scope.vendors = ['pepperfry', 'fabfurnish', 'flipkart' ,'amazon' ,'snapdeal' ,'jabong'];
		$scope.data = {};
		$scope.data.index = 0;
		// Set the default value of inputType
		$scope.inputType = 'password';
		$scope.showPassword=false;
		$scope.config = {
				vendor_id:'',
				name:'',
                email: '',
                password: ''
            };
		$scope.captcha={};
		$scope.viewCreate = true;
		
		$ionicModal.fromTemplateUrl('templates/create.html', {
	        scope: $scope
	    }).then(function(modal) {
	    	console.log("in modal");
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
	      // Execute action on remove modal
	      $scope.$on('modal.removed', function() {
	        // Execute action
	      });
	//};
}]);