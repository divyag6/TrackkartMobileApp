angular.module('TrackkartApp')

.controller('SendMailCtrl', ['$rootScope', '$location', '$scope', 'Loader','SendMailFactory','AuthFactory',
    function($rootScope, $location, $scope, Loader, SendMailFactory, AuthFactory) {
	
	$scope.showContact=function(){
		$scope.message={
			name:'',
			email: '',
			subject: '',
			message:''
		};
		if($rootScope.isAuthenticated){
			
			var user=AuthFactory.getUser();
			$scope.message.name=user.name;
			$scope.message.email=user.email;
		}
		
	};
	$scope.sendMail=function(){	
		Loader.showLoading('Sending your email..');	
        SendMailFactory.sendMail($scope.message).success(function(response) {
        	Loader.hideLoading();
        	$location.path('/app/home');
            Loader.toggleLoadingWithMessage(response.message, 2000);
        }).error(function(response){
        	console.log(response);
           	Loader.hideLoading();
           	Loader.toggleLoadingWithMessage(response.error, 2000);
           
        });
   	 
    };
    
}]);
