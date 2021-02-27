


angular.module('TrackkartApp.factory',[])

.factory('ServerFactory',['$http',function($http){
	var SERVERAPI={
			get:function(){
				//return 'http://trackkart-env-staging.ap-southeast-1.elasticbeanstalk.com';
				return "http://192.168.0.178:8083";
			}
	};
	return  SERVERAPI;
}])

.factory('Loader',['$ionicLoading','$timeout',
	function($ionicLoading,$timeout){
		var LOADERAPI={
			showLoading: function(text)	{ 
				text=text ||'Loading...';
				$ionicLoading.show({
					template:text
				});
			},
			hideLoading: function(){
				$ionicLoading.hide();
			},
			toggleLoadingWithMessage: function(text,timeout){
			
				LOADERAPI.showLoading(text);
				$timeout(function(){
					LOADERAPI.hideLoading();
				},timeout||2000);
			}
		};
	return LOADERAPI;
}])

.factory('LSFactory',[function(){
		var LSAPI={
		clear:function(){
			return localStorage.clear();
		},
		
		get:function(key){
			return JSON.parse(localStorage.getItem(key));
		},
		
		set:function(key,data){
			return localStorage.setItem(key,JSON.stringify(data));
		},
		
		remove:function(key){
			return localStorage.removeItem(key);
		}
	};
	return LSAPI;	
}])

.factory('AuthFactory',['LSFactory',function(LSFactory){
		var userKey='user'; var tokenKey='token'; var emailKey='emails';
		var configKey='config';
		var AuthAPI={
			isLoggedIn: function(){
			return this.getToken()===null?false:true;
			},
			
			getUser: function(){
				return LSFactory.get(userKey);
			},
			
			setUser:function(user){
				//this.setConfigKey(user);
				return LSFactory.set(userKey,user);
			},
			
			getToken:function(){
				return LSFactory.get(tokenKey);
			},
			setConfigKey:function(user){
				return LSFactory.set(configKey,"configs"+user.email);
			},
			
			getConfigKey:function(){
				return LSFactory.get(configKey);
			},
			setToken:function(token){
				return LSFactory.set(tokenKey,token);
			},
			
			deleteAuth:function(){
				//LSFactory.remove(userKey);
				LSFactory.remove(tokenKey);
			},
			hasEmails: function(){
				var emails=[];
				emails=this.getUserEmails();
				return emails==null || emails[0] == null?false:true;
			},
			getUserEmails: function(){
				return LSFactory.get(emailKey);
			},
			
			addUserEmails:function(email){
				var emails;
				if(this.hasEmails())
					emails=this.getUserEmails();
				else
					emails=[];
				
				 emails.push(email);
				 console.log(emails);
				 return LSFactory.set(emailKey,emails);
				
			},
		};
		return AuthAPI;
}])
.factory('UserFactory',['$http','AuthFactory','ServerFactory','LSFactory',function($http,AuthFactory,ServerFactory,LSFactory){
		var base= ServerFactory.get();
		var UserAPI={
				
				login: function(user){
					
					 var formData = {
							 email: user.email,
							 password: user.password
			         };
					// $http.get("http://127.0.0.1:8083/api/auth/login");
					//console.log(result);
					return $http.post(base+'/api/auth/login',formData);
				},
				
				register:function(user){
					
					return $http.post(base+'/api/auth/register',user);
				},
				
				logout:function(vendors){
					for(var i=0;i<vendors.length;i++)
					{
						if(LSFactory.get('attempts'+vendors[i])!=null)
						{
							LSFactory.set('attempts'+vendors[i],1);
						}
							
					}	
					var token=AuthFactory.getToken();
					var header={headers:{'Authorization': ''}};
					AuthFactory.deleteAuth();
					return $http.get(base+'/api/auth/logout?token='+token.token,header);
				}
		};
		return UserAPI;
}])

.factory('TokenInterceptor',['$q','AuthFactory','$window', '$injector','$rootScope','$location',
         function($q,AuthFactory,$window,$injector,$rootScope,$location){
		return{
			request : function(config){
				config.headers=config.headers ||{};
				var token= AuthFactory.getToken();
				if(token!=null)
				if(token){
					config.headers.Authorization='Bearer '+token.token;
				}
				return config || $q.when(config);
			},
			
			response:function(response){
				
				if(response.headers('Authorization')){
					var token=response.headers('Authorization');
					token=token.replace('Bearer ','');
				
					AuthFactory.setToken({
						token: token
                    });
				}
				return response || $q.when(response);
			
			},
			
			responseError:function(response)
			{
				
				if(response.headers('Authorization')){
					
					var token=response.headers('Authorization');
					token=token.replace('Bearer ','');
					//console.log("response:"+token);
					AuthFactory.setToken({
						token: token
                    });
				}
				
				if(response.status == 400 || response.status == 401){
					console.log(response.status);
					var Load =$injector.get('Loader');
					Load.hideLoading();
					
               		AuthFactory.deleteAuth();
               		$rootScope.isAuthenticated = false;
               
               		$location.path('/app/home');
					
				}
				if(response.status ==500){
					
					var Load =$injector.get('Loader');
					Load.hideLoading();
					console.log(response.data.error);
					if(typeof response.data['error'] === 'undefined')
					{
						response.error={message:"Cannot not process your request at the moment.."} ;
						console.log(response.error.message);
					}
				}
				return $q.reject(response);
			}
		};
}])
.factory('SendMailFactory',['$http','ServerFactory' ,function($http,ServerFactory){
	var base= ServerFactory.get();
	var SendMailAPI={
			
			sendMail:function(message){
				 var header={headers:{'Authorization': ''}};
				return $http.post(base+'/api/contact',message,header);
			},
			
			
	};
	return SendMailAPI;
}]);

