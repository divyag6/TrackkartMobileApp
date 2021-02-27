angular.module('TrackkartApp.factory')

.factory('PasswordResetFactory',['$http','ServerFactory',function($http,ServerFactory){
	var base= ServerFactory.get();
	var header={headers:{'Authorization': ''}};
	var ResetAPI={
			sendLink:function(email){
				var formData = {
						 email: email
				
		         };
				return $http.post(base+'/api/password/email',formData,header);
			},
			resetPassword:function(reset){
				return $http.post(base+'/api/password/reset',reset,header);
			}
	};
	return ResetAPI;
}]);
                          