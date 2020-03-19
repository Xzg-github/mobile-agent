//接受实时事件(事件没写到这里,后期有需要可以写,暂放)
module.exports.receiveEvenName = function(dataobj){
	console.log(dataobj[0])
	// ORIGINATED 接通中
	// CONNECTION_CLEARED 挂断 event_callclear
	// DELIVERED 振铃  event_dialing
	// ESTABLISHED 通话中 event_active
	// SERVICE_INITIATED 服务连接（获取咨询的callid）
	// TRANSFERRED 咨询中
	// FAILED 错误

	//var evenName = ['','','','event_active','SERVICE_INITIATED','TRANSFERRED','FAILED']
	var evenName = []
	var obj = {}
	return {
		'name': dataobj[0],  
		'type': evenName
	} 
},

// 接收状态
module.exports.clickBtn = function(dataobj,show){ 
	
	var obj = {}
	// console.log(dataobj[0])
	 console.log(dataobj[1])
	switch (dataobj[0]){ 
		case 'event_loggingin':   // 签入中 event_loggingin
			show = 11  
			break;
		case 'event_login':   // 签入成功 (状态示忙中)
			var date = { agentId:"test5",status:5 }
			uni.sendSocketMessage({
				data: '421["phone:getStatusReasons",' + JSON.stringify(date)+ ']' , //签入成功  获取示忙原因
			})
			show = 2  
			break;
		case 'event_idle':   // 示闲中
			show = 3  
			break;
		case 'event_dialing':   // 拨打号码
		
			console.log('show---'+show)
			if( show == 10  || show == 7 )  {
				return false
			}
			
			// 外拨振铃
			if (dataobj[1].statusReason == 14) {
				show = 5 
			} else if (dataobj[1].statusReason == 10 || dataobj[1].statusReason == 17) {
				// 10外部咨询振铃，17内部咨询坐席振铃
				show = 13
			}
			break;
		case 'event_active':   // 接通
			show = 6  
			break;
		case 'event_callclear':   // 挂断
			if (dataobj[1].statusReason == 1 || dataobj[1].statusReason == 6) {
				// 1  被咨询方挂断， 6  咨询方挂断
				show = 6
			}
			break;
		case 'event_hold':   // 保持中
			show = 7  
			break;
		case 'event_consult':   // 咨询中(需测试)
			show = 8  
			break;
		case 'event_notready':  //结束后处理 
			if (dataobj[1].toParkState) { // 示忙成功
				show = 4 
			}
			break;
		case 'event_conference':   // 会议通话中(需测试)
			show = 9  
			break;
		case 'event_screenpop':   // 转接(需测试)
		 
			if (dataobj[1].statusReason == 17) { // 别的坐席咨询呼入或转接呼入
				show = 6 
			}if(dataobj[1].statusReason == 1){
				
				obj.phoneNum = dataobj[1].callInfo.screenData.ani //呼入电话号码
				show = 13
			} else{
				show = 10
			}
			
			break;
		case 'event_wrap':   // 后处理
			show = 10  
			break;
		case 'event_error':   // 错误事件
			if(dataobj[1].errorCode !== 245 && dataobj[1].errorCode !== 20){
				uni.showToast({
				    title: dataobj[1].localized,
				    duration: 3000,
					icon: 'none'
				});
			}else if(dataobj[1].errorCode === 40){
				console.log('客户挂断')
			}else if(dataobj[1].errorCode === 246){
				console.log('忙音 未接通')
			}
			break;
		default:
			break;
		    
	} 
	obj.show = show
	return obj
	
},


// 签入-初始化
module.exports.login = function(uerInfo){
	
	var self = this
	var cmd = {
		agentId: uerInfo.agentNo,
		organCode: uerInfo.organCode,
		organId: uerInfo.organId,
		organName: encodeURI(uerInfo.organName), 
		password: uerInfo.password,
		platformId: uerInfo.platformId,
		portal: uerInfo.ctiIpPort,
		recordPlatformId: uerInfo.recordPlatformId,
		station: uerInfo.extension,
		userCode: uerInfo.username,
		userId: uerInfo.id,
		userName: encodeURI(uerInfo.nickname)
	}
	
	uni.sendSocketMessage({
		data: '420["phone:login",' + JSON.stringify(cmd)+ ']' ,//JSON.stringify(cmd), //6081是分机号 签入中
		success:function(event){
			console.log('软电话登入')
		},
		fail:function(event){
			uni.showToast({
			    title: '软电话连接失败',
			    duration: 2000,
				icon: 'none',
			});
		},
	});
	
},

//点击示闲
module.exports.agentavailable = function(uerInfo){
	uni.sendSocketMessage({
		data: '422["phone:idle",'+ '"' + uerInfo.username + '"' +']',
	});
},

//签出
module.exports.agentLogout = function(uerInfo,cb){
	uni.sendSocketMessage({
		data:'423["phone:logout",'+ '"' + uerInfo.username + '"' +']',
		success:function(event){
			cb()
		},
	});
},

//示忙原因下拉选择
module.exports.agentAuxwork = function(id,uerInfo,cb){
	var ids = '0' //暂放(可外拨)
	if (id == '1') {
		ids = '113'
	} else if (id == '2') {
		ids = '112'
	} else if (id == '3') {
		ids = '114'
	} else if (id == '4') {
		ids = '115'
	} else if (id == '5') {
		ids = '116'
	}
	var cmd = {
		agentId: uerInfo.username,
		reasonId: ids
	}
	if( id != '0' ){
		uni.sendSocketMessage({
			data:'424["phone:busy",' + JSON.stringify(cmd) + ']',
			success:function(){
				cb()
			}
		});
	}else {
		uni.sendSocketMessage({
			data:'425["phone:busyPending",' + JSON.stringify(cmd) + ']',
			success:function(){
				cb()
			}
		});
	}
	
},

// 拨打电话(手动//外呼)
module.exports.makecall = function(num,uerInfo){
	var cmd = {
		agentId: uerInfo.username,
		phoneNumber: num,
	}
	uni.sendSocketMessage({
		data: '425["phone:dialCall",' + JSON.stringify(cmd)+ ']',
	});
},

//挂断
module.exports.hangUp = function(uerInfo,cb){
	uni.sendSocketMessage({
		data: '426["phone:hangup",' + '"' + uerInfo.username + '"' + ']',
	});
},

//外呼振铃中挂断
module.exports.hangOff = function(uerInfo,cb){
	uni.sendSocketMessage({
		data: '429["phone:hangup",' + '"' + uerInfo.username + '"' + ']',
		success:function(){
			cb()
		}
	});
},

//保持通话
module.exports.hold = function(uerInfo){
	uni.sendSocketMessage({
		data: '427["phone:hold",' + '"' + uerInfo.username + '"' + ']',
	});
},

//取消保持
module.exports.unHold = function(uerInfo){
	uni.sendSocketMessage({
		data: '428["phone:unHold",' + '"' + uerInfo.username + '"' + ']',
	});
},

//咨询
module.exports.iniConsult = function(phoneData,cb,uerInfo){
	var cmd = {
		agentId: uerInfo.username,
		number: phoneData, // 外呼号码
		transferWay: 1 // 咨询服务 0: '坐席', 1: '外部', 2: '服务'
	};
	uni.sendSocketMessage({
		data: '429["phone:consult",' + JSON.stringify(cmd)+ ']',
		success:function(event){
			cb()
		}
	});
},

//后处理
module.exports.afterTreatment = function(uerInfo,cb){
	uni.sendSocketMessage({
		data: '425["phone:acw",' + '"' + uerInfo.username + '"' + ']',
		success:function(){
			cb()
		}
	});
},

//转接
module.exports.finishTransfer = function(uerInfo){
	// var cmd = {
	// 	number: agentId, // 要转接的坐席的工号
	// 	transferWay: 0 // 转坐席
	// };
	uni.sendSocketMessage({
		data: '4212["phone:doubleTransfer",' + '"' + uerInfo.username + '"' + ']',
	});
},

//盲转接
module.exports.blindTransfer = function(uerInfo,key){
	var cmd = {
		agentId: uerInfo.username,
		number: key, // 要转接的坐席的工号
		transferWay: 1 // 转外部号码
	};
	uni.sendSocketMessage({
		data: '426["phone:singleTransfer",' + JSON.stringify(cmd)+ ']',
		success:function(){
			//self.pop = 0
		}
	});
},

//会议
module.exports.finishConference = function(uerInfo){
	uni.sendSocketMessage({
		data: '427["phone:conference",' + '"' + uerInfo.username + '"' + ']',
	});
},


//结束咨询
module.exports.end = function(uerInfo){
	uni.sendSocketMessage({
		data: '428["phone:hangup",' + '"' + uerInfo.username + '"' + ']',
	});
},

//点击接听
module.exports.answer = function(uerInfo){
	uni.sendSocketMessage({
		data: '429["phone:answer",' + '"' + uerInfo.username + '"' + ']',
	});
}   