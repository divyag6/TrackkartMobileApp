angular.module('TrackkartApp.factory')

.factory('OrderFactory',['$http','ServerFactory','LSFactory',function($http,ServerFactory,LSFactory){
	var base= ServerFactory.get();
	var user;
	var orderKey;
	var OrderAPI={
			refresh:function(configs){
				var header={headers:{'Content-Type': 'application/json'}};
				return $http.post(base+'/api/account/refresh-orders',JSON.stringify(configs),header);
			},
			show:function(){
				return $http.get(base+'/api/account/orders');
			},
			getOrders: function(){
				user=LSFactory.get('user');
				orderKey='orders'+user.email;
				return LSFactory.get(orderKey);
			},
			hasOrders: function(){
				var orders=[];
				orders=this.getOrders();
				return orders==null || orders[0] == null?false:true;
			},
			setOrders:function(orders){
				user=LSFactory.get('user');
				orderKey='orders'+user.email;
				return LSFactory.set(orderKey,orders);
			},
			deleteOrders:function(){
				LSFactory.remove(orderKey);
			},
			onSuccess: function(response){
				var orders=[];
				if(typeof response['message'] !== 'undefined')
	    		{
	        		for(var i = 0; i < response.message.length;i++){
	        			Loader.toggleLoadingWithMessage(response.message[i]);
	        		}
	    		}
	        	for(var i = 0; i < response.data.length;i++){
	        		response.data[i].order_placed.date=new Date(response.data[i].order_placed.date);
	        		response.data[i].order_placed.barColor=this.getStatusColor(response.data[i].order_placed);
	        		orders.push(response.data[i].order_placed);
	        	}
	        	return orders;
			},
			getStatusColor: function(order){
				
		    	for(var i = 1; i < order.item_count;i++)
		    	{
		    		if(typeof order[i]['shipment_status'] !== 'undefined')
		    		{
				    	if(order[i]['shipment_status'].indexOf("Delivered") > -1)
				    		return "custom-balanced";
				    	else if(order[i]['shipment_status'].indexOf("Cancelled") ||
				    			order[i]['shipment_status'].indexOf("Failed transaction")||
				    			order[i]['shipment_status'].indexOf("Refund Initiated") >-1)
				    		return "custom-assertive";
			    		else
				    		return "custom-energized";
		    		}
		    		else
		    		{
		    			return "custom-energized";
		    		}
		    	}
			}
			
		
	};
	return OrderAPI;
}]);

