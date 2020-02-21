// 判断手机号格式
module.exports.checkPhone = function(phone){
	var flag = false
	phone = phone.replace(/\s/g, "") 
	
	if(!(/^1[3456789]\d{9}$/.test(phone))){
		uni.showToast({
		    title: '手机号格式错误',
		    duration: 2000,
			icon: 'none'
		});
		flag = false; 
	}else{
		flag = true
	}
	
	return flag;
},

//每次通话开始时候储存一个时间
module.exports.getLastime = function(){
	var data = new Date();
	var year = data.getFullYear();
	var month = data.getMonth() + 1;
	month = month < 10 ? "0" + month : month;
	var date = data.getDate();
	var hour = data.getHours() < 10 ? "0" + data.getHours() : data.getHours();
	var minute = data.getMinutes() < 10 ? "0" + data.getMinutes() : data.getMinutes();
	var second = data.getSeconds() < 10 ? "0" + data.getSeconds() : data.getSeconds();
	return (year +'-'+ month +'-'+ date +' '+ hour +':'+ minute +':'+ second)
	//this.callStartTime = lastConnectTime
},

// 获取当天的时间 
module.exports.getCurrentDay = function(){
	var data = new Date();
	var year = data.getFullYear();
	var month = data.getMonth() + 1;
	month = month < 10 ? "0" + month : month;
	var date = data.getDate();
	date = date < 10 ? "0" + date : date;
	var lastTime = year + '-' + month + '-' + date
	return lastTime
},

// 获取当天上一个月的时间
module.exports.getPrevMonthDay = function(endDate){
	var date = endDate
	var arr = date.split('-');  
	var year = arr[0]; //获取当前日期的年份  
	var month = arr[1]; //获取当前日期的月份  
	var day = arr[2]; //获取当前日期的日  
	var days = new Date(year, month, 0);  
	days = days.getDate(); //获取当前日期中月的天数  
	var year2 = year;  
	var month2 = parseInt(month) - 1;  
	if (month2 == 0) {  
		year2 = parseInt(year2) - 1;  
		month2 = 12;  
	}  
	var day2 = day;  
	var days2 = new Date(year2, month2, 0);  
	days2 = days2.getDate();  
	if (day2 > days2) {  
		day2 = days2;  
	}  
	if (month2 < 10) {  
		month2 = '0' + month2;  
	}  
	var t2 = year2 + '-' + month2 + '-' + day2;  
	return t2; 
},

//每次通话结束时候储存一个时间
module.exports.callEndTimes = function(){
	var data = new Date();
	var year = data.getFullYear();
	var month = data.getMonth() + 1;
	month = month < 10 ? "0" + month : month;
	var date = data.getDate();
	var hour = data.getHours() < 10 ? "0" + data.getHours() : data.getHours();
	var minute = data.getMinutes() < 10 ? "0" + data.getMinutes() : data.getMinutes();
	var second = data.getSeconds() < 10 ? "0" + data.getSeconds() : data.getSeconds();
	return (year +'-'+ month +'-'+ date +' '+ hour +':'+ minute +':'+ second)
	//this.endTime = lastcallEndTime
}   