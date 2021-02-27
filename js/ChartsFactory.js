angular.module('TrackkartApp.factory')

.factory('ChartsFactory',['OrderFactory','ConfigFactory','Loader',function(OrderFactory,ConfigFactory,Loader){
	//var orders=[];
	var vendors=['pepperfry','fabfurnish','flipkart','amazon','snapdeal','jabong'];
	var ChartsAPI={
			
			getLastMonthData:function(orders){
				//this.checkOrders();
				//console.log(orders);
				var data=new Array(6);
				for (var i=0; i <data.length; i++)
				{
				    data[i]=new Array(1);
				    for (var j=0; j <data[i].length; j++)
				    	data[i][j]=0;
				}
				var offset;
				for(var i = 0; i < orders.length;i++){
					var date=new Date(orders[i].date);
					var today=new Date();
					if(date.getMonth()==today.getMonth()&& date.getYear()==today.getYear())
					{
						offset=vendors.indexOf(orders[i].vendor);
			
						data[offset][0]=data[offset][0]+parseInt(orders[i].paid);		
					}				
				}
			
				return data;
			},
			getSixMonthsData:function(orders){
				var data=new Array(6);
				for (var i=0; i <data.length; i++)
				{
				    data[i]=new Array(6);
				    for (var j=0; j <data[i].length; j++)
				    	data[i][j]=0;
				}
				var vendorOffset;
				for(var monthOffset = 0; monthOffset < 6; monthOffset++){
					for(var i = 0; i < orders.length;i++){
						var date=new Date(orders[i].date);
						var today=new Date();
						var month=today.getMonth()-monthOffset;
						var year= today.getYear();
						
						if(month<0)
						{
							year=year-1;
							month=12+month;
						}	
						if(date.getMonth()== month && date.getYear()== year)
						{
							if(orders[i].barColor!=='custom-assertive' && orders[i].vendor!='snapdeal')
							{
								vendorOffset=vendors.indexOf(orders[i].vendor);
								data[vendorOffset][monthOffset]=data[vendorOffset][monthOffset]+parseInt(orders[i].paid);
							}
						}
						
					}
				}	
			
				return data;
			}
		
	};
		return ChartsAPI;
}]);