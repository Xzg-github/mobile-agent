// 获取客户基本信息
module.exports.customerList = function(apiDomian,token,phone,cb){
	return new Promise(function (resolve, reject) {
		uni.request({
			method: 'GET',
			url: apiDomian+'/customer/list/' + phone, 
			data: {},
			header: {
				'content-type': 'application/json',
				'Authorization': 'Arch6WithCloud '+token
			}
		})
		.then((data) => {
			cb(data)
			resolve(data)
		})
	})
},

//获取手机归属地
module.exports.getPhoneCode = function(apiDomian,token,setPhone,cb){
	return new Promise(function (resolve, reject) {
		uni.request({
			method: 'GET',
			url: apiDomian + '/phoneArea/getRegion',
			data: {
				phoneArea: setPhone, //电话号码
			},
			header: {
				'content-type': 'application/json',
				'Authorization': 'Arch6WithCloud ' + token
			}
		})
		.then((data) => {
			cb(data)
			resolve()
		})
	})
},

// 手机号请求接口 - 异地手机号前加0
module.exports.getDialNumber = function(phone,code,domian,token,cb){
	return new Promise(function (resolve, reject) {
		uni.request({
			method: 'GET',
			url: domian+'/phoneArea/getDialNumber', 
			data: {
				phone: phone,
				code: code
			},
			header: {
				'content-type' : 'application/json',
				'Authorization': 'Arch6WithCloud '+token
			}
			
		})
		.then((data) => { 
			cb && cb(data)   //兼容 有没有回调
			resolve(data)
		})
	})
},


//获取在线坐席分机
module.exports.getInfoAjax = function(apiDomian,token,cb){
	var self = this
	uni.showLoading({
		title: '加载中'
	})
	uni.request({
	    method: 'GET',
	    url: apiDomian+'/onlineAgent/queryOnline', 
	    data: {},
	    header: {
	        'content-type': 'application/json',
			'Authorization': 'Arch6WithCloud '+token
	    }
	    
	})
	.then((data) => {
		uni.hideLoading();
		cb(data)
	})
},

//提交服务小结的内容
module.exports.batchTaskUpdate = function(apiDomian,token,serviceData){
	return new Promise(function (resolve, reject) {
		uni.request({
			method: 'GET',
			url: apiDomian + '/batchTask/update',
			data: serviceData,
			header: {
				'content-type': 'application/json',
				'Authorization': 'Arch6WithCloud '+token
			}
		})
		.then((data) => {
			resolve(data)
		})
	})
},

// 联络历史 - 获取列表数据
module.exports.getCusInfo = function(apiDomian,token,phone,starDate,endDate,cb){
	return new Promise(function (resolve, reject) {
		uni.request({
			method: 'GET',
			url: apiDomian+'/contact/page', 
			data: {
				callFrom: phone, //查询号码 
				callDirection: '', //呼叫方向 0呼出 1呼入
				agentId: '', //坐席工号
				agentName: '', //坐席姓名
				startDate: starDate, //开始日期
				endDate: endDate, //结束日期
			},
			header: {
				'content-type': 'application/json',
				'Authorization': 'Arch6WithCloud '+token
			}
			
		})
		.then((data) => {
			cb(data)
			resolve()
		})
	})
},

//联络历史 - 新建接通电话
module.exports.getApiinsAdd = function(apiDomian,token,obj){
	return new Promise(function (resolve, reject) {
		uni.request({
			method: 'POST',
			url: apiDomian + '/serviceLog/apiinsAdd', 
			data: obj,
			
			header: {
				'content-type': 'application/json',
				'Authorization': 'Arch6WithCloud ' + token
			}
		})
		.then((data) => {
			resolve(data)
		})
	})
},

//联络历史 - 更新
module.exports.apiinsEditUpdate = function(apiDomian,token,contactUpdate){
	return new Promise(function (resolve, reject) {
		uni.request({
			method: 'POST',
			url: apiDomian + '/serviceLog/apiinsEdit',
			data: contactUpdate,
			header: {
				'content-type': 'application/json',
				'Authorization': 'Arch6WithCloud '+token
			}
		})
		.then((data) => {
			resolve()
		})
	})
}