import socketYatai from "@/components/softphone/config/socket/yatai";
import socketAspect from "@/components/softphone/config/socket/aspect";

// 判断登录
module.exports.getType = function(){
	return uni.getStorageSync('uerInfo')
},

// 签入-初始化
module.exports.login = function(){
	var userInfo = this.getType()
	if(userInfo.platformType == '3'){
		socketYatai.login()
	}else {
		socketAspect.login(userInfo)
	}
},

//软电话接收实时事件
module.exports.receiveEvenName = function(dataobj){
	var userInfo = this.getType()
	if(userInfo.platformType == '3'){
		return socketYatai.receiveEvenName(dataobj)
	}else {
		return socketAspect.receiveEvenName(dataobj)
	}
},

// 接通中
// module.exports.originated = function(){
// 	var userInfo = this.getType()
// 	if(userInfo.platformType == '3'){
// 		return socketYatai.originated()
// 	}else {
// 		return socketAspect.originated()
// 	}
// },

//主动触发软电话按钮 改变show
module.exports.clickBtn = function(dataobj,show){
	var userInfo = this.getType()
	if(userInfo.platformType == '3'){
		return socketYatai.clickBtn(dataobj,show)
	}else {
		return socketAspect.clickBtn(dataobj,show)
	}
},

// 拨打电话(手动//外呼)
module.exports.makecall = function(phone){
	var userInfo = this.getType()
	if(userInfo.platformType == '3'){
		socketYatai.makecall(phone)
	}else {
		socketAspect.makecall(phone,userInfo)
	}
},

//点击示闲
module.exports.agentavailable = function(){
	var userInfo = this.getType()
	if(userInfo.platformType == '3'){
		socketYatai.agentavailable()
	}else {
		socketAspect.agentavailable(userInfo)
	}
},

//点击接听
module.exports.answer = function(strb){
	var userInfo = this.getType()
	if(userInfo.platformType == '3'){
		socketYatai.answer(strb)
	}else {
		socketAspect.answer()
	}
},

//签出
module.exports.agentLogout = function(cb){
	var userInfo = this.getType()
	if(userInfo.platformType == '3'){
		socketYatai.agentLogout()
	}else {
		socketAspect.agentLogout(userInfo,cb)
	}
},

//示忙状态下拉选择
module.exports.agentAuxwork = function(id,cb){
	var userInfo = this.getType()
	if(userInfo.platformType == '3'){
		socketYatai.agentAuxwork(cb)
	}else {
		socketAspect.agentAuxwork(id,userInfo,cb)
	}
},

//挂断
module.exports.hangUp = function(stra){
	var userInfo = this.getType()
	if(userInfo.platformType == '3'){
		socketYatai.hangUp(stra)
	}else {
		socketAspect.hangUp(userInfo)
	}
},

//保持通话
module.exports.hold = function(stra){
	var userInfo = this.getType()
	if(userInfo.platformType == '3'){
		socketYatai.hold(stra)
	}else {
		socketAspect.hold(userInfo)
	}
},

//取消保持
module.exports.unHold = function(stra){
	var userInfo = this.getType()
	if(userInfo.platformType == '3'){
		socketYatai.unHold(stra)
	}else {
		socketAspect.unHold(userInfo)
	}
},

//振铃中挂断
module.exports.hangOff = function(stra,cb){
	var userInfo = this.getType()
	if(userInfo.platformType == '3'){
		socketYatai.hangOff(stra,cb)
	}else {
		socketAspect.hangOff(userInfo,cb)
	}
},

//咨询 (需测试)
module.exports.iniConsult = function(newPhoneNum,stra,cb){
	var userInfo = this.getType()
	if(userInfo.platformType == '3'){
		socketYatai.iniConsult(newPhoneNum,stra,cb)
	}else {
		socketAspect.iniConsult(newPhoneNum,cb)
	}
},

//后处理 (需测试,yatai的需多写代码)
module.exports.afterTreatment = function(cb){
	var userInfo = this.getType()
	if(userInfo.platformType == '3'){
		socketYatai.afterTreatment(cb)
	}else {
		socketAspect.afterTreatment(userInfo,cb)
	}
},

//转接(需测试)
module.exports.finishTransfer = function(stra,strb){
	var userInfo = this.getType()
	if(userInfo.platformType == '3'){
		socketYatai.finishTransfer(stra,strb)
	}else {
		socketAspect.finishTransfer()
	}
},


//盲转接(aspect需再测试)
module.exports.blindTransfer = function(key,phoneData){
	var userInfo = this.getType()
	if(userInfo.platformType == '3'){
		socketYatai.blindTransfer(key)
	}else {
		socketAspect.blindTransfer(userInfo,phoneData)
	}
},






// 软电话登入
// module.exports.agentLogin = function(){
// 	var userInfo = this.getType()
// 	if(userInfo.platformType == '3'){
// 		socketYatai.agentLogin()
// 	}else {
// 		socketAspect.agentLogin()
// 	}
// },









//点击示闲
// module.exports.agentAvailable = function(){
	
// },

//会议
module.exports.finishConference = function(stra,strb){
	
},




//结束咨询
module.exports.end = function(str,cb){
	
}







