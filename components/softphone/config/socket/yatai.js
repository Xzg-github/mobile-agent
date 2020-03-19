//接受实时事件
module.exports.receiveEvenName = function(dataobj){
	// ORIGINATED 接通中
	// CONNECTION_CLEARED 挂断
	// DELIVERED 振铃 
	// ESTABLISHED 通话中
	// SERVICE_INITIATED 服务连接（获取咨询的callid）
	// TRANSFERRED 咨询中
	// FAILED 错误
	var evenName = ['ORIGINATED','CONNECTION_CLEARED','DELIVERED','ESTABLISHED','SERVICE_INITIATED','TRANSFERRED','FAILED']
	
	var obj = {}
	return {
		'name': dataobj.eventname,
		'type': evenName
	} 
},

// 接收状态
module.exports.clickBtn = function(dataobj,show){ 
	if(dataobj.res == 1){
		switch (dataobj.Method){ //主动触发按钮
			case 'init':   // 签入中 event_loggingin
				show = 11  
				break;
			case 'agent_login': // 签入成功后（默认示忙）
				show = 2
				break;
			case 'agent_logout': // 签出成功
				show = 1 
				break;
			case 'agent_available': //示闲中
				show = 3 
				break; 
			case 'agent_auxwork': //示忙中
				//self.show = 2 
				break;
			case 'make_call': //拨打电话
				show = 12
				break;
			case 'answer':   //点击接听
				show = 6 
				break;   
			case 'hangup':   //挂断（3个事件使用 挂断咨询 挂断会议 通话挂断）这里show显示要区分
				break;
			case 'hold':   //保持
				show = 7 
				break;
			case 'unhold':   //取消保持
				show = 6 
				break;
			case 'ini_consult':   //咨询 （这里的咨询挂断回到保持通话)
				show = 8 
				break;
			case 'finish_conference':   //会议
				show = 9
				break;
			case 'finish_transfer':   //转接
				show = 10
				break;
			default:
				break;
		}      
		
	}
	
	return show
	
},


// 接通中
// module.exports.originated = function(){
// 	var cmd = "Method" + "|" + "make_call" + "|" + phone + "|" + "";
// 	uni.sendSocketMessage({
// 		data: cmd,
// 	});
// },


// 拨打电话(手动//外呼)
module.exports.makecall = function(phone){
	var cmd = "Method" + "|" + "make_call" + "|" + phone + "|" + "";
	uni.sendSocketMessage({
		data: cmd,
	});
},


// 签入-初始化
module.exports.login = function(value){
	var self = this
	//获取vuex的信息
	const uerInfoObj = uni.getStorageSync('uerInfo'); 
	var cmd = "Method|init|"+uerInfoObj.port+"|"+uerInfoObj.ctiIp+"|"+uerInfoObj.agentNo+"||"+uerInfoObj.extension+"|4||"
	uni.sendSocketMessage({
		data: cmd, //6081是分机号 签入中
		success:function(event){
			setTimeout(function() {
				self.agentLogin()
			},1200)
			
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

// 软电话登入
module.exports.agentLogin = function(){
	uni.sendSocketMessage({
		data: "Method" + "|" + "agent_login", //登录成功
		success:function(event){
			var dataobj = JSON.stringify(event)
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
module.exports.agentavailable = function(){
	var cmd = "Method" + "|" + "agent_available";
	uni.sendSocketMessage({
		data: cmd,
	});
},

//点击接听
module.exports.answer = function(strb){
	var cmd = "Method" + "|" + "answer" + "|" + strb;
	uni.sendSocketMessage({
		data: cmd,
	});
},

//签出
module.exports.agentLogout = function(){
	uni.sendSocketMessage({
		data:"Method" + "|" + "agent_logout" + "|" + "1",
		success:function(event){
			var dataobj = JSON.stringify(event)
			setTimeout(function() {
				uni.sendSocketMessage({
					data:"Method" + "|" + "de_init", //签出成功
				});
			}, 1000);
		}
	});
},

//挂断
module.exports.hangUp = function(stra,cb){
	var cmd = "Method" + "|" + "hangup" + "|" + stra;//hangup_CallID
	uni.sendSocketMessage({
		data: cmd,
	});
},

//点击示闲
module.exports.agentAvailable = function(){
	var cmd = "Method" + "|" + "agent_available";
	uni.sendSocketMessage({
		data: cmd,
	});
},

//保持通话
module.exports.hold = function(stra){
	var cmd = "Method" + "|" + "hold" + "|" + stra;//hold_CallID
	uni.sendSocketMessage({
		data: cmd,
	});
},

//取消保持
module.exports.unHold = function(stra){
	var cmd = "Method" + "|" + "unhold" + "|" + stra; //unhold_CallID
	uni.sendSocketMessage({
		data: cmd,
	});
},


//会议
module.exports.finishConference = function(stra,strb){
	var cmd = "Method" + "|" + "finish_conference" + "|" +  stra + "|" + strb;
	uni.sendSocketMessage({
		data: cmd,
	});
},

//转接
module.exports.finishTransfer = function(stra,strb){
	var cmd = "Method" + "|" + "finish_transfer" + "|" + stra + "|" + strb;
	uni.sendSocketMessage({
		data: cmd,
		success:function(){
			//self.pop = 0
		}
	});
},


//结束咨询
module.exports.end = function(str,cb){
	var cmd = "Method" + "|" + "hangup" + "|" + str;//hangup_CallID咨询中的ID
	uni.sendSocketMessage({
		data: cmd,
		success:function(){
			cb()
		}
	});
},

//振铃中挂断
module.exports.hangOff = function(stra,cb){
	var cmd = "Method" + "|" + "hangup" + "|" + stra;//hangup_CallID
	uni.sendSocketMessage({
		data: cmd,
		success:function(){
			cb()
		}
	});
},


//示忙状态下拉选择
module.exports.agentAuxwork = function(cb){
	var cmd = "Method" + "|" + "agent_auxwork" + "|" + "3" + "|" + "0";
	uni.sendSocketMessage({
		data: cmd,
		success:function(){
			cb()
		}
		
	});
},

//盲转接
module.exports.blindTransfer = function(key){
	var cmd = "Method" + "|" + "blind_transfer" + "|" + key;
	uni.sendSocketMessage({
		data: cmd,
	});
},

//咨询
module.exports.iniConsult = function(newPhoneNum,stra,cb){
	var cmd = "Method" + "|" + "ini_consult" + "|" + newPhoneNum + "|" + stra;
	uni.sendSocketMessage({
		data: cmd,
		success:function(event){
			cb()
		}
	});
}

//后处理
module.exports.afterTreatment = function(cb){
	cb()
}