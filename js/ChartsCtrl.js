angular.module('TrackkartApp')

.controller('ChartsCtrl', ['$rootScope','$scope', 'Loader','ChartsFactory','$filter','OrderFactory','ConfigFactory',
    function( $rootScope,$scope, Loader, ChartsFactory, $filter, OrderFactory, ConfigFactory) {

	var orders=[];
	$scope.checkForOrders=function(){
		if(!OrderFactory.hasOrders())
		{
			if(ConfigFactory.hasConfigs())
			{
	    		//fetches orders from the server
				OrderFactory.show().success(function(response) {
		            Loader.hideLoading();
		        	var returnedOrders=OrderFactory.onSuccess(response);
		        	orders=returnedOrders;
		        	//sets retreived orders in the local storage
		        	OrderFactory.setOrders(orders);
		        	$scope.displayCharts(orders);
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
		}
		else
		{
			orders=OrderFactory.getOrders();
			$scope.displayCharts(orders);
			
		}
	};	
	
	$scope.refreshCharts=function(){
		
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
	
	$scope.displayCharts=function(orders)
	{
	  $scope.lmGraph = {}; // Empty graph object to hold the details for this graph
	  $scope.lmGraph.data=[];
	  $scope.lmGraph.data=ChartsFactory.getLastMonthData(orders);
	  $scope.lmGraph.labels = ['Last Month'];    // Add labels for the X-axis
	  $scope.lmGraph.series = ['Pepperfry', 'Fabfurnish','Flipkart', 'Amazon','Snapdeal', 'Jabong'];  // Add information for the hover/touch effect
	  $scope.lmGraph.options = { legend: { display: true },scales: {
		  yAxes: [{
			  ticks: {
				  beginAtZero:true
			  }
		  }]
	  } };
	 
	  var myDate = new Date();
	  var month = new Date(myDate);
	  var months=[];
	  for(var i=0;i<6;i++)
	  {
		  month.setMonth(myDate.getMonth()-i);
		  months.push($filter('date')(month, 'MMMM'));
	  }

	  $scope.graph = {};                        // Empty graph object to hold the details for this graph
	  $scope.graph.data = [];                     // Add bar data, this will set your bars height in the graph
	  $scope.graph.data=ChartsFactory.getSixMonthsData(orders); 
	  $scope.graph.labels = months;    // Add labels for the X-axis
	  $scope.graph.series = ['Pepperfry', 'Fabfurnish', 'Flipkart', 'Amazon', 'Snapdeal', 'Jabong'];
	  $scope.graph.options = { legend: { display: true }, scales: {
		  yAxes: [{
			  ticks: {
				  beginAtZero:true
			  }
		  }]
	  } };
	  $scope.onClick = function (points, evt) {
		    console.log(points, evt);
		  };
	};
}]);
