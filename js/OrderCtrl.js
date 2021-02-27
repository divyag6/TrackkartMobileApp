angular.module('TrackkartApp')

.controller('OrderCtrl', ['$rootScope','$ionicModal', '$scope', 'Loader','OrderFactory','$ionicActionSheet','$ionicPopup','ConfigFactory',
    function($rootScope, $ionicModal, $scope, Loader, OrderFactory, $ionicActionSheet, $ionicPopup,ConfigFactory) {

	$scope.orders=[];
	$scope.showDetails=false;
	$scope.showFilters=false;
	/*$scope.byAmount=[{'name':'Ascending','value':false},
	               {'name': 'Descending','value':true}];
	$scope.sortByAmount=$scope.byAmount[0].value;
	$scope.byDate=[{'name':'Latest','value':true},
	               {'name': 'Oldest','value':false}];*/
	$scope.propertyName = 'date';
	$scope.reverse = true;
	$scope.configArr=[];
	//$scope.reverse=$scope.byDate[0].value;
	$scope.vendors = [{'name':'All','value':''}];
	$scope.selected=$scope.vendors[0];
	         
	
	
	$scope.showOrders=function(){	
        
    	Loader.showLoading('Loading...This may take a few minutes');
    	//checks if there are configurations in the local stordage
    	if(ConfigFactory.hasConfigs())
		{
    		var configs= ConfigFactory.getConfigs();
    		
    		for(var i=0;i<configs.length;i++)
    		{
    			var obj={};
    			obj.name = configs[i].name;
    			obj.value=configs[i].name;
    			$scope.vendors.push(obj);
    			$scope.configArr.push(configs[i].name);
    		}
    		
    		//fetches orders from the server
			OrderFactory.show().success(function(response) {
	            Loader.hideLoading();
	            var returnedOrders=OrderFactory.onSuccess(response);
	        	$scope.orders=returnedOrders;
	        	//sets retreived orders in the local storage
	        	OrderFactory.setOrders($scope.orders);
            }).error(function(response){
               	Loader.hideLoading();
               	Loader.toggleLoadingWithMessage(response.error.message);
            });
		}
		else
		{
			console.log("No vendor configurations");
			Loader.hideLoading();
           	Loader.toggleLoadingWithMessage("Configure vendors!");
		}
    };
    
    $scope.refreshOrders=function(){	
    	
    	//refreshing orders from the server
    	Loader.showLoading('Refreshing...This may take a few minutes');
    	if(ConfigFactory.hasConfigs())
    	{
    		OrderFactory.refresh(ConfigFactory.getConfigs()).success(function(response) {
	        	Loader.hideLoading();
	        	if(typeof response['message'] !== 'undefined')
	    		{
	        		var message="";
	        		for(var i = 0; i < response.message.length;i++)
	        			message=message+response.message[i];
	        		
	        		Loader.toggleLoadingWithMessage(message);
	        	}
	        	for(var i = 0; i < response.data.length;i++)
	        	{
	        		response.data[i].date=new Date(response.data[i].date);
	        		response.data[i].barColor=OrderFactory.getStatusColor(response.data[i]);
	        	}
	        	
	        	$scope.orders=response.data;
	        	//setting retrieved orders in local storage
	        	OrderFactory.setOrders($scope.orders);
	        }).error(function(response){
	        	console.log(response);
	           	Loader.hideLoading();
	        }).finally(function() {
	            $scope.$broadcast('scroll.refreshComplete');
	            $rootScope.processOn=false;
	        });
    	}
    	else
		{
			console.log("No vendor configurations");
			
			Loader.hideLoading();
           	Loader.toggleLoadingWithMessage("Configure vendors!");
		}
    };
    
    $scope.getItems = function(order) {
    	var items=[];
    	for(var i = 1; i < order.item_count;i++){
    		
    		if(typeof order[i]['shipment_status'] !== 'undefined')
    		{
		    	if(order[i]['shipment_status'].indexOf("Delivered") > -1)
		    		order[i].textColor="balanced";
		    	else if(order[i]['shipment_status'].indexOf("Cancelled")|| 
		    			order[i]['shipment_status'].indexOf("Failed transaction")||
		    			order[i]['shipment_status'].indexOf("Refund Initiated") > -1)
		    		order[i].textColor="assertive";
		    	else
		    		order[i].textColor="energized";
		    }
    		items.push(order[i]);
    	} 
    	return items;
    };
    
    $scope.customFilter=function(order)
    {
    	
    	if($scope.selected.name!='All')
    		return order.vendor==$scope.selected.value;
    	else
    		if($scope.configArr.indexOf(order.vendor)!=-1)
    			return true;
    }
   
    $scope.sortFunction = function(order) 
    {
    	 if($scope.propertyName=='paid')
    		 return parseInt(order[$scope.propertyName]);
    	 else
    		 return order[$scope.propertyName];
    	 
    };
}]);
