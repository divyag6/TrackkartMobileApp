angular.module('TrackkartApp.factory')

.factory('ConfigFactory',['$http','LSFactory','ServerFactory',function($http,LSFactory,ServerFactory){
	var base= ServerFactory.get();
	var user;
	var configKey;
	var ConfigAPI={
			
			notRedundant:function(checkConfig){
				if(this.hasConfigs())
				{
					
					var configs=this.getConfigs();
					
					for(var i=0;i<configs.length;i++)
					{
						if(configs[i].vendor_id===checkConfig.vendor_id && configs[i].email===checkConfig.email){	
							return false;
						}	
		
					 }		
				}
				return true;
			},
			notUpdateRedundant:function(checkConfig,index){
				if(this.hasConfigs())
				{
					
					var configs=this.getConfigs();
					
					for(var i=0;i<configs.length;i++)
					{
						if(i!=index)
						{
							if(configs[i].vendor_id===checkConfig.vendor_id && configs[i].email===checkConfig.email){	
								return false;
							}
						}
		
					 }		
				}
				return true;
			},
			verify: function(config){
				
				return $http.post(base+'/api/vendorconfig',config);
			
			},
			hasConfigs: function(){
				var configs=[];
				configs=this.getConfigs();
				return configs==null || configs[0] == null?false:true;
			},
			addConfig: function(config){
				var configs;
				if(this.hasConfigs())
					configs=this.getConfigs();
				else
					configs=[];
				
				 configs.push(config);
				 LSFactory.set(configKey,configs);
			},
			verifyUpdate:function(oldConfig,config){
				var	formData={
							vendor_id:config.vendor_id,
							email:config.email,
							password:config.password
				};
				return $http.put(base+'/api/vendorconfig/'+oldConfig.id,formData);
			},
			update:function(config,index){
				var configs = [];
				configs=this.getConfigs();
				configs[index]['password']=config.password;
				LSFactory.set(configKey,configs);
			},
			
			deleteConfig:function(index){
				var configs = [];
				configs=this.getConfigs();
				var id=configs[index]['id'];
				configs.splice(index,1);
				LSFactory.set(configKey,configs);
				return $http.delete(base+'/api/vendorconfig/'+id);
				//return LSFactory.remove(configKey);
			},
			getServerConfigs:function(){
				return $http.get(base+'/api/vendorconfig');
			},
			getConfigs:function(){
				user=LSFactory.get('user');
				configKey='configs'+user.email;
				return LSFactory.get(configKey);
			},	
			setConfigs:function(configs)	
			{
				LSFactory.set(configKey,configs);
				
			}
			
			
			
	};
	return ConfigAPI;
}]);
                          