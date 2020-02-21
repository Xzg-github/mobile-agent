<template>
	<view :class="['phone-wrap', class_a == 1 ? 'bottom' : 'top'] " >
		<view class="iconfont frame-btn" v-if="expand" @click="changeOpen">&#xe60e;</view>
		<view v-else :class="['box',show != '2' && show != '11' || selectArr[selectIndex].id == 0 ? 'pd50' : '']">
			<Login v-if="show == 1" @funa="getMsgSon" :timer="timer" @close="close"></Login>
			<Logining  v-if="show == 11" :timer="timer" @close="close"></Logining>
			<AgreeLogin v-if="show == 2" :timer="timer" :leftval="leftval" @close="close"></AgreeLogin>
			<Available v-if="show == 3" @funa="getMsgSon" @funb="getLogout" :timer="timer" @close="close"></Available>
			<Callphone v-if="show == 4" @funa="getCallNum" @funb="getCallPhoneFlag" :timer="timer" @close="close"></Callphone>
			<Handup v-if="show == 5" @func="getState" :stra="setStateActiveCallId" :strb="phonenum" :timer="timer" @close="close"></Handup>
			<Callsuccess v-if="show == 6" :stra="setStateActiveCallId" :strb="phonenum" :timer="timer" @close="close"></Callsuccess>
			<Hold v-if="show == 7"  @funa="setMeeting" :stra="setStateActiveCallId" :strb="phonenum" :timer="timer" @close="close"></Hold>
			<Consult v-if="show == 8" @funa="getMsgSon" :stra="setStateActiveCallId" :strb="setStateCallId" :timer="timer" @close="close"></Consult>
			<Meeting v-if="show == 9" :stra="setStateCallId" :timer="timer" @close="close"></Meeting>
			<Reprocessing v-if="show == 10" @funa="getMsgSon" @funb="endPhone" :timer="timer" @close="close"></Reprocessing>
			<Callcontent v-if="show == 12" :stra="setStateActiveCallId" :strb="phonenum" :strc="meeting_flag" :timer="timer" @close="close"></Callcontent>
			<Answer v-if="show == 13" :stra="phonenum" :strb="setStateActiveCallId" :timer="timer" @close="close"></Answer>
		</view>
	</view>
</template>

<script>
	import {  mapState,  mapMutations  } from 'vuex';
	import Login from "@/components/softphone/Login.vue" 
	import Logining from "@/components/softphone/Logining.vue"
	import Available from "@/components/softphone/Available.vue"
	import AgreeLogin from "@/components/softphone/AgreeLogin.vue"
	import Callphone from "@/components/softphone/Callphone.vue"
	import Handup from "@/components/softphone/Handup.vue"
	import Callsuccess from "@/components/softphone/Callsuccess.vue"
	import Hold from "@/components/softphone/Hold.vue"
	import Consult from "@/components/softphone/Consult.vue"
	import Meeting from "@/components/softphone/Meeting.vue"
	import Reprocessing from "@/components/softphone/Reprocessing.vue"
	import Callcontent from "@/components/softphone/Callcontent.vue"
	import Answer from "@/components/softphone/Answer.vue"
	
	import common from "@/components/softphone/config/common";
	import api from "@/components/softphone/config/api";
	
	import socketMain from "@/components/softphone/config/socket/main";
	import socketApi from "@/components/softphone/config/socket/yatai";
	
	export default {
		props: {
			class_a: String,
			socketObj: Object,
			phone: Number,
			pageName: String,
			toCallFlag: String,
			socketType: String
		},
		
		// 提取存储数据
		computed: mapState(['hasLogin', 'uerInfo']),
		
		components :{
			Login, //签入1
			AgreeLogin,  //登入成功（默认示忙）2
			Available,  //示闲 3
			Callphone, //拨打电话4
			Handup, // 振铃中(挂断按钮) 5
			Callsuccess, //接通电话6
			Hold, //保持7
			Consult, //咨询8
			Meeting, //会议9
			Reprocessing, //结束后处理10
			Logining, //签入中 11
			Callcontent, //通话连接中12
			Answer, //接听13
		},
		
		data() {
			return {
				expand: false,  // 是否展开软电话
				timer_inter: false, //计时器
				timer: '00:00:00',    
				phonenum: '', //拨号输入的值
				state : false, //当客户挂断电话后客户这边挂断的情况
				show: 1, //1签入 2 示忙 3 示闲 4拨打电话 5振铃中(挂断按钮)  6接通电话  7保持 8咨询 9会议 10结束后处理 11签入中 12连接中 13接听来电
				meeting_flag: false,
				leftval:'', //切换示忙原因
				setStateActiveCallId:'',  //普通用户id(当前接听的电话)
				setStateCallId:'', // 平台客服id(转接、咨询等操作)
				otherPage: false,  // 是否从别的页面来
				callPhone:'',//呼入电话
				endDate:'', //结束时间(今天时间)
				starDate:'', //开始时间（一个月前）
				city:'', //电话号码的所在城市
				province:'',//电话号码的所在省份
				phoneCode:'',//手机区号
				callStartTime:'', //每次通话开始保存一个时间
				endTime:'',//通话结束时间
				phoneArea: {}   ,//手机归属地对象
				requestFlag: false,//判断新建联络历史接口只请求一次
				customerCode:'', //客户ID
				customerName:'', //客户姓名
				bossFlag: false,// 判断是否是被咨询方   客服打给客服
				callFlag: '',//拨号的标识
				connectFlag : '', //判断电话有没有接通
				phoneCallID: '' //新建接口传的callid 比较长的号码
			}
		},
		
		watch:{
			socketObj(dataobj,prevData){
				var self = this  
				self.getTimeDate()  //计时器
				
				//主动触发按钮 改变show
				this.show = socketMain.clickBtn(dataobj,this.show)
				/*if(this.uerInfo.platformType != '3'){
					return false
				}*/
				
				//接受实时事件
				var receiveEven = socketMain.receiveEvenName(dataobj)
				switch (receiveEven.name){   
					case receiveEven.type[0]: //接通中
						//socketMain.originated() 
						if(!self.meeting_flag){ //不在会议的情况 点击咨询不进入判断 会直接跳状态8
							self.show = 12 //连接中
							self.setStateActiveCallId = dataobj.callid
							self.$emit("setStateActiveCallId",self.setStateActiveCallId); 
						}
						
						break;
					case receiveEven.type[1]: //挂断
						self.callEndTime() //通话结束储存一个时间 
						self.$emit("callEndTime",self.endTime); 
						
						if( self.show == 5 ){ //客服挂断客服的通话
							if ( dataobj.localstate == '-1' ){
								self.show =10
							}else {
								self.show = 7
							}
							//self.show = 7
						}else if( self.show == 6 ){ //客服挂断当前通话中的通话（挂断咨询的客服）
							if ( dataobj.localstate == '-1' && self.meeting_flag){ //客服挂断与客服的通话
								self.show = 7
							}else {   //客服挂断与客户的通话
								self.show = 10
							}  
						} else if ( self.show == 7 ){ //客户挂断当前通话
							if( dataobj.localstate == '0' ){    // 被咨询的客户挂断
								self.show = 10
							}else if ( dataobj.localstate == '-1' ){ 
								if(self.meeting_flag){   //客服挂断与客户的通话
									self.show = 10
								}else if(self.state == true){ //客户挂断电话后  客服挂断
									self.show = 10
								}
								else {   //客服挂断与被咨询的通话
									self.show = 7
								}
							}
							else if ( dataobj.localstate == '4' ){ //客户挂断
								self.show = 10
							}
						}else if ( self.show == 8 ){ 
							if(self.meeting_flag && dataobj.localstate != '-1'){ //客服挂断客服
								self.show = 5
							}else {
								self.show = 7
							}
							
						}else if ( self.show == 10 ){ //客服挂断客服
							if(!self.meeting_flag){ // 非咨询
								self.show = 10 
							}else {
								self.show = 7
							}
							
						}else {
							self.show = 10
						} 
						
						self.meeting_flag = false
						break;
						   
					case receiveEven.type[2]:   //振铃
						console.log('振铃中....')
						if(!self.meeting_flag){
							self.phoneCallID = dataobj.callinfo.split('/')[2]  //接口传的callid 比较长的号码
							self.$emit("phoneCallID",self.phoneCallID);
							self.setStateActiveCallId = dataobj.callid //存储CallID
							self.$emit("setStateActiveCallId",self.setStateActiveCallId); 
						}
						
						if(self.otherPage){    // 别的页面来的  第2次响铃就不管了
							return false
						}
						self.otherPage = true
									
					    //呼入弹屏回到首页接收
						var page_len = getCurrentPages().length
						var route_name = getCurrentPages()[page_len-1].route
						
						if(route_name != 'pages/home/roster/callOut' && !self.callFlag ){
							//console.log(9998)
							self.callPhone = dataobj.callinfo.split('/')[0] //呼入电话存储
							self.$emit("getPhoneObj",self.callPhone); //呼入电话  
							
							self.$emit("getPageLen",2);//控制呼入弹屏 
							uni.switchTab({
								url:'/pages/index/home'  
							})
						}else if( route_name == 'pages/home/roster/callOut' 
									&& self.pageName != '首页' 
									&& !self.toCallFlag
								){
									//console.log(9999)
									self.$emit("getPageLen",2);//控制呼入弹屏 
									uni.switchTab({
										url:'/pages/index/home'
									}) 
									self.toCallFlag = true 
								
						}else {
							//console.log(9997) 
						}
						
						var temp_phone = dataobj.callinfo.split('/')[0]  //主叫号码
						var temp_phone2 = dataobj.callinfo.split('/')[1]  //被叫号码 （如果两个号码相等说明是被咨询）
						
						if(temp_phone.length > 6){ //用户打进来接听电话  保存电话号码 (这里还需考虑到客服跟客服的通话号码是4)
							self.show = 13 // 接听
							self.phonenum = temp_phone
							self.setStateActiveCallId = dataobj.callid
						} else if ( temp_phone.length == temp_phone2.length && !self.meeting_flag){ //两个号码相等 且不在会议中=被咨询方
							
							// 判断第一位是不是自己   自己5   否则13   
							if(self.uerInfo.extension == temp_phone){
								self.show = 5
								self.phonenum = temp_phone2
							}else{
								self.show = 13 // 接听
								self.phonenum = temp_phone
							}
							
							//self.show = 13 // 接听
							//self.phonenum = temp_phone
							self.setStateActiveCallId = dataobj.callid
							self.bossFlag = true
							self.$emit("bossFlag",self.bossFlag);
						}
						
						else if ( self.meeting_flag ) {  // 咨询的时候不显示 振铃中   
							self.show = 8      // 咨询中
						} else {
							self.show = 5    // 挂断    
						}
						break;
					case receiveEven.type[3]: //通话中
						self.connectFlag = 'Y' //接通的标识
						self.$emit("connectFlag",self.connectFlag); 
						
						// 设置不可结束软电话
						uni.setStorage({
							key: 'endPhoneFlag',
							data: false,
							success: function() {
							},
						});
						if(self.meeting_flag){   // 多人进入会议
							self.show = 8 
						}else {
							self.show = 6 
							self.getLastimes() //通话开始储存一个时间
							self.$emit("callStartTime",self.callStartTime); 
							
							var page_len = getCurrentPages().length
							var route_name = getCurrentPages()[page_len-1].route
							
							if(route_name == 'pages/home/roster/callOut'){
								if( self.requestFlag == false ){//判断新建接口是否请求
									self.$emit('apiinsAdd')
									self.requestFlag = true //请求完后面不需再请求
								} 
								
							}else if( self.pageName == '首页' ){
								console.log('进入了首页')
								var tel = dataobj.callinfo.split('/')
								var phone1 = parseInt(tel[0]).toString() //主叫号码(去除首位0)
								var phone2 = parseInt(tel[1]).toString() //被叫号码(去除首位0)
								if( self.requestFlag == false ){ //判断新建接口是否请求
									if( phone1.length > 6 ){
										self.apiinsAdd( '1',phone1,phone2 ) //新建 联络历史接口(呼入)
										self.requestFlag = true //请求完后面不需再请求
									} else if ( phone2.length > 6 ) {
										self.apiinsAdd( '0',phone1,phone2 ) //新建 联络历史接口(呼出)
										self.requestFlag = true//请求晚后面不需再请求
									}
								}
							}
						}
						break;
					case receiveEven.type[4]: //服务连接（获取咨询的callid）
						self.setStateCallId = dataobj.callid
						
						break;	
					case receiveEven.type[5]: //咨询中
						self.show = 10 
						break;
					case receiveEven.type[6]: //失败
						self.setStateActiveCallId = dataobj.callid
						self.$emit("setStateActiveCallId",self.setStateActiveCallId);
						uni.showToast({
							title: '连接数据异常',
							duration: 1500,
							icon: 'none',
						});
						break;
					default:
						break;
				}
			}
		}, 

		mounted: function(){
			
			var self = this
			this.getTimeDate() // 计时器
			this.endDate = common.getCurrentDay() //获取结束时间
			this.starDate = common.getPrevMonthDay(this.endDate) //获取开始时间
			this.phonenum = this.phone //详情页面传过来的电话
		},


		methods: {

			//接通电话新建-联络历史
			apiinsAdd(key,phone1,phone2){
				var self = this
				async function getInfo(){
					
					if(key == 0){    //呼出
						var setPhone = phone2
					}else{  //呼入
						var setPhone = phone1
					}
					//获取手机归属地
					await api.getPhoneCode(self.apiDomian,self.uerInfo.token,setPhone,function(data){
						var rs = data[1].data.data
						if(rs){
							self.phoneArea = rs
							self.city = rs.city
							self.province = rs.province
							self.phoneCode = rs.phoneCode //电话区号
						}
					})
				
					//获取客户ID、姓名
					await api.getCusInfo(self.apiDomian,self.uerInfo.token,setPhone,self.starDate,self.endDate,function(data){
						var obj = data[1].data.data
						if(obj){
							var infoArr = obj.records
							self.customerCode = infoArr[0].clientId //客户ID
							self.customerName = infoArr[0].clientName //客户姓名
						}
					})
				
					var post_obj = {
						callType: key, //呼叫方向
						ani: phone1, //主叫号码
						dnis: phone2.length == 4 ? self.uerInfo.extension : phone2, //被叫号码
						customerCode: self.customerCode, //客户ID
						customerName: self.customerName, //客户姓名
						userCode: self.uerInfo.username, //坐席工号
						userName: self.uerInfo.nickname, //坐席姓名
						organCode: self.uerInfo.organCode, //坐席组织机构代码
						organName: self.uerInfo.organName, //坐席组织机构名称
						agentNo: self.uerInfo.agentNo, //坐席工号
						serviceLog:'', //服务结果(可以不传)
						campaignId:'', //活动id (直接拨号的不传)
						batchId:'', //批次id(直接拨号的不传)
						taskId:'', //任务id(直接拨号的不传)
						phoneCode: self.phoneCode, //手机区号
						province: self.province , //归属地-省
						city: self.city, //归属地-市
						callId: self.phoneCallID, //通话id（较长的号码） 
						callStartTime: self.callStartTime, //通话开始时间
						serviceStartTime: self.callStartTime, //通话开始时间
					}
					await api.getApiinsAdd(self.apiDomian,self.uerInfo.token,post_obj)
				}  
				
				getInfo()
			},
			
			//每次通话时候储存一个时间
			getLastimes(){
				this.callStartTime = common.getLastime()
			},
			
			//每次通话结束储存一个时间
			callEndTime(){
				this.endTime = common.callEndTimes()
			},

			// 从子级获取值
			getMsgSon(val1,val2){
				this.show = val1
				this.leftval = val2
			},
			
			//aspect签出成功
			getLogout(val){
				this.show = val
				console.log('qianchuchengong')
			},
			
			//结束后处理需填写表单设置  
			endPhone(){
				var self = this
				self.requestFlag = false //新建接口重新恢复请求
				if(self.connectFlag == 'Y' && !self.bossFlag){ //接通电话需要填写服务小结  且不在会议中
					uni.getStorage({
						key: 'endPhoneFlag',
						success: function(res) {
							if (!res.data) {
								uni.showToast({
									title: '请填写服务小结',
									duration: 2000,
									icon: 'none',
								});
									return false
							}else{
								const serviceData = uni.getStorageSync('service_data');  //服务小结的内容
								const contactUpdate = uni.getStorageSync('contact_update');//联络历史更新
								
								async function func(){
									//服务小结的内容
									await api.batchTaskUpdate(self.apiDomian,self.uerInfo.token,serviceData)
									
									//没有挂断电话情况提交服务小结的情况
									if( contactUpdate.callEndTime == '' ){ 
										contactUpdate.callEndTime = self.endTime 
									}
									if( contactUpdate.serviceEndTime == '' ){ 
										contactUpdate.serviceEndTime = self.endTime
									}
									
									//联络历史更新
									await api.apiinsEditUpdate(self.apiDomian,self.uerInfo.token,contactUpdate)
									//软电话显示示闲状态
									
									if( self.uerInfo.platformType == '3') {
										await socketMain.agentavailable()
									}
								}
								func()
							}
						}
					})
				}else{
					if( self.uerInfo.platformType == '3') {
						socketMain.agentavailable()
					}
					
				}
			},
			
			// 收起软电话
			close(){
				this.expand = true
				this.$emit('expand','1')
			},
			
			//展开软电话
			changeOpen(){
				this.expand = false
				this.$emit('expand','2')
			},

			getState(val){
				this.state = val
			},
			
			//接收拨号的电话 城市 省份
			getCallNum(obj){
				this.phonenum = obj.num
				this.$emit('getPhoneObj',obj)
			},
			
			
			//咨询
			setMeeting(flag){
				this.meeting_flag = flag
			},
			//判断是拨打电话的弹窗  避免呼入弹窗冲突
			getCallPhoneFlag(val){
				this.callFlag = val
			},

			//计时器
			getTimeDate() {
				var self = this
				self.timer =  '00:00:00'
				clearInterval(self.timer_inter)
				
				var hh = 0;
				var mm = 0;
				var ss = 0;
				var str = '';
				this.timer_inter = setInterval(function() {
					str = "";
					if (++ss == 60) {
						if (++mm == 60) {
							hh++;
							mm = 0;
						}
						ss = 0;
					}
					str += hh < 10 ? "0" + hh : hh;
					str += ":";
					str += mm < 10 ? "0" + mm : mm;
					str += ":";
					str += ss < 10 ? "0" + ss : ss;
					self.timer = str;
				}, 1000);
			},
		}
	}
</script>

<style lang="less"> 
	
</style>
