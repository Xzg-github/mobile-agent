<template>
	<view class="container">
		<Softphone 
			@callStartTime="callStartTime" 
			@callEndTime="callEndTime" 
			@setStateActiveCallId='setStateActiveCallId'
			@phoneCallID='phoneCallID'
			@getPageLen="getPageLen"
			@connectFlag="connectFlag"
			@apiinsAdd="apiinsAdd"
			:socketType = "socketType"
			:toCallFlag="toCallFlag" 
			:pageName="pageName" 
			:socketObj="socketObj" 
			:phone='phone'
			v-if="dial == true"
		>
		</Softphone> <!-- 软电话组件  -->
		<!-- 消息组件 -->
		<News></News> 
		<view class="header">
			<view class="header-item">
				<text class="side-nav">外呼号码</text>
				<text v-for="(item,index) in tel" :key="index">{{ item }}</text>
				<button @click="toCall" class="iconfont">&#xe76d;</button>
			</view>
			<view class="header-item">
				<text class="side-nav">归属地</text> 
				<text>{{ province }} {{ city }}</text>
			</view> 
		</view>
		<BasicInfo :cus_info="cus_info"></BasicInfo>
		<view class="innerBox">
			<view class="wrap">
				<view class="nav">
					<view :class='["nav-item",show=="A" ? "active" : ""]' @click="changeNav('A')">
						<text>名单信息</text>
					</view>
					<view :class='["nav-item",show=="U" ? "active" : ""]' @click="changeNav('U')">
						<text>联络历史</text>
					</view>
					<view :class='["nav-item",show=="H" ? "active" : ""]' @click="changeNav('H')">
						<text>问卷</text>
					</view>
				</view>
				
				<!-- 名单信息 -->
				<ContactInfo  v-if="show == 'A'" :customInfoObj='customInfoObj'></ContactInfo>
				
				<!-- 联络历史 -->
				<ContactHistory v-if="show == 'U'" :infoArr="infoArr"></ContactHistory>
				
				<!-- 问卷 -->
				<Questionnaire 
					v-else-if="show == 'H'" 
					:boot="boot" 
					:cur_id="prev_id" 
					:cur_arr="prev_arr" 
					:questionData="questionData" 
					:questionObj="questionObj" 
					:questionnaireId="questionnaireId"
					:radioCheckArr="radioCheckArr"
					@radioCheck="radioCheck"
					@funa="loadQuestionList"
				>
				</Questionnaire>
			</view>
			
			<!--填写服务结果 -->
			<view class="btm-wrap">
				<Service :picketData="picketData" :ajaxobj_rs="ajaxobj_rs" @formSubmit="formSubmit" @getPickerData="getPickerData" @getTimeData="getTimeData" @serviceLog='serviceLog' ></Service>
			</view>
		</view>
		
	</view>
</template>

<script>
	import { mapState,mapMutations } from 'vuex'
	import ContactInfo from "@/components/ContactInfo.vue"
	import ContactHistory from "@/components/ContactHistory.vue"
	import Questionnaire from "@/components/Questionnaire.vue"
	import Service from "@/components/Service.vue"
	import BasicInfo from "@/components/BasicInfo.vue"
	import News from "@/components/News.vue";
	import Softphone from "@/components/softphone/index.vue";
	import '@/components/softphone/css/shoftphone.less';
	import socketYatai from "@/components/softphone/config/socket/yatai";
	import socketMain from "@/components/softphone/config/socket/main";
	import common from "@/components/softphone/config/common";
	import api from "@/components/softphone/config/api";
	
	export default {
		components: {
			ContactInfo,
			ContactHistory,
			Questionnaire,
			Service,
			BasicInfo, //客户基本信息
			Softphone,
			News //消息
		},
		data() {
			return {
				pageName: '详情', //详情页拨号不需要回到首页弹窗标记
				phone: '', //电话号码
				tel:'',   //隐藏中间四位的电话号码
				newPhone: '', //加90的电话号码
				province: '', //省份
				city: '', //城市
				phoneCode: '', //地区编号
				campaignId: '', //活动id
				id: '', //名单ID
				batchId:'', //批次ID
				customerCode: '',//客户ID
				customerName: '',//客户姓名
				customInfoObj: '', //客户信息
				show: 'A', // 默认显示客户信息
				questionnaireId: '', //问卷id
				typeCode: '', //表单服务类型
				picket_item_2: 0,
				questionData: {}, //问卷引导语
				ajaxobj_rs: {},
				multiIndex: [0, 0, 0], // 服务类型下标
				questionObj:{}, //组件更新的值
				picketData: [],
				lastConnectTime:'' ,//最后一次拨打电话时间
				yes: 'N', //服务结果
				nextSubjectId: '0', //下一题的id 第一题为
				prev_arr: ['0'],  // 问卷列表 
				prev_id: 0,	// 问卷请求的id
				infoArr:[], //联络历史数据
				endDate:'', //联络历史结束时间
				starDate:'' ,//联络历史开始时间
				cus_info:'', //客户基本信息
				boot: false, //引导语
				textArea:'', //输入框的内容
				dial: false, //软电话隐藏
				socketObj: {},// 软电话接收socket对象
				callid:'' ,//通话id
				startTime:'',//通话开始时间
				toCallFlag: false, //拨号的状态
				contentTime:'',//通话开始时间
				endTime:'',//通话结束时间
				contentState: '' ,//通话接通的标识
				phoneCallId: '', //新建接口传的CALLID
				radioCheckArr: []  ,// 问卷选中的ID
				socketType: 'yatai',//亚太客户（API）
			}
		},
  
		computed:{
			...mapState(['hasLogin', 'uerInfo']), 
			
			phoneReceiveObj() {
				console.log('computed method in Home.vue')
				return this.$store.state.phoneReceiveObj
			}
		},
		watch: {
			phoneReceiveObj(curData,prevData){
				
				console.log('watch method in Home.vue')
				this.socketObj = curData
			}
		},
		onLoad(options) {
			var self = this
			this.campaignId = options.campaignId //活动id，即任务列表中的campaignId
			this.id = options.id //名单ID
			this.batchId = options.batchId //批次id
			this.phone = options.phone //客户的电话号码
			this.customerCode = options.customerCode //客户ID
			this.customerName = options.customerName//客户姓名
			this.questionnaireId = options.questionnaireId //问卷id
			this.typeCode = options.serviceType //服务类型
			this.endDate = common.getCurrentDay() //获取结束时间
			this.starDate = common.getPrevMonthDay(this.endDate) //获取开始时间

			this.getBasicInfo() //获取客户基本信息
			this.changeNav('A') //活动信息接口调用
			this.history_info() //获取联络历史
			
			this.tel= this.geTel(this.phone) //隐藏手机号中间四位数(新开了一个变量)
			
			this.pageName = '详情'

			// 获取服务类型
			uni.request({
				method: 'GET',
				url: this.apiDomian + '/serviceType/findTreeByCode',
				data: {
					typeCode: self.typeCode //1
				},
				header: {
					'content-type': 'application/json',
					'Authorization': 'Arch6WithCloud ' + self.uerInfo.token
				}
			}).then((data) => {
				var ajaxobj = data[1].data.data.children
				self.ajaxobj_rs = ajaxobj
				var ajaxarr1 = self.setPickerData(ajaxobj)
				var ajaxarr2 = []
				var ajaxarr3 = []
				if(ajaxobj[0]){
					ajaxarr2 = self.setPickerData(ajaxobj[0].children)
					if(ajaxobj[0].children[0]){ 
						ajaxarr3 = self.setPickerData(ajaxobj[0].children[0].children)
					}
				}
				var temp_arr = []
				temp_arr.push(ajaxarr1)
				temp_arr.push(ajaxarr2)
				temp_arr.push(ajaxarr3)
				self.picketData = temp_arr
			})
			
			api.getPhoneCode(self.apiDomian,self.uerInfo.token,self.phone,function(data){
				var rs = data[1].data.data
				self.province = rs.province
				self.city = rs.city
				self.phoneCode = rs.phoneCode
			})
		},

		methods: {
			
			
			//电话接通标识
			connectFlag(val){
				this.contentState = val
			},
			
			//控制呼入弹屏 
			getPageLen(val){
				this.page_len = val
			},
	
			//获取callid
			setStateActiveCallId(val){
				this.callid = val
			},
			//获取新建接口传的ID
			phoneCallID(val){
				this.phoneCallId = val
			},
			
			//联系开始时间
			callStartTime(val){
				this.contentTime = val
			},
			
			//通话结束时间
			callEndTime(val){
				this.endTime = val
			},
			
			//获取活动名单(show= A)
			task_info(){
				uni.showLoading({
					title: '加载中'
				})
				var self = this
				uni.request({
					method: 'GET',
					url: this.apiDomian + '/batchTask/info',
					data: {
						campaignId: self.campaignId,
						id: self.id,
					},
					header: {
						'content-type': 'application/json',
						'Authorization': 'Arch6WithCloud ' + self.uerInfo.token
					}
				})
				.then((data) => {
					uni.hideLoading();
					this.customInfoObj = data[1].data.data
				})
			},
			
			// 获取联络历史(show= U)
			history_info(){
				var self = this
				api.getCusInfo(self.apiDomian,self.uerInfo.token,self.phone,self.starDate,self.endDate,function(data){
					if(data[1].data.data){
						self.infoArr = data[1].data.data.records
					}else{
						self.infoArr = ''
					}
				})
			},
			
			//电话号码中间隐藏4位
			geTel(tel){
			    var reg = /^(\d{3})\d{4}(\d{4})$/;  
			    return tel.replace(reg, "$1****$2");
			},
			
			// 获取客户基本信息
			getBasicInfo(){
				uni.request({
				    method: 'GET',
				    url: this.apiDomian+'/customer/list/' + this.phone, 
				    data: {},
				    header: {
				        'content-type': 'application/json',
						'Authorization': 'Arch6WithCloud '+this.uerInfo.token
				    }
				})
				.then((data) => {
					if( !data[1].data.data){
						this.cus_info = ''
					}else{
						this.cus_info = data[1].data.data[0]
					}
				})
			},
			
			//前台每次点击拨打电话储存一个时间
			getLastimes(){
				this.lastConnectTime = common.getLastime()
			},
			
			// 从picker 组件获取值
			getPickerData(val1,val2){
				this.multiIndex = val1
				this.picketData = val2
			},
			
			// 从子级获取ridao的值
			getTimeData(val1,val2,val3){
				this.yes= val1,
				this.date= val2,
				this.time= val3
			},
			
			//获取服务小结输入内容
			serviceLog(val){
				this.textArea = val
			},
			
			// 切换导航
			changeNav(key) {
				this.show = key
				if(this.show == 'A' && this.customInfoObj == ''){
					this.task_info() //调用活动名单接口
				}else if(this.show == 'U' && this.infoArr == ''){
					this.history_info() //调用联络历史接口
				}
			},

			// 获取问卷引导语
			getValue(key) {
				if (key == 'H') {
					uni.showLoading({
						title: '加载中'
					})
					var self = this
					uni.request({
						method: 'GET',
						url: this.apiDomian + '/exam/' + self.questionnaireId,
						data: {},
						header: {
							'content-type': 'application/json',
							'Authorization': 'Arch6WithCloud '+this.uerInfo.token
						}
					})
					.then((data) => {
						uni.hideLoading();
						var obj = data[1].data.data
						this.questionData = obj
					})

				}
			},
			
			// 拨打电话获取问卷信息
			toCall() {
				var self = this
				self.toCallFlag = true; //详情页外呼的标识
				if(!self.uerInfo.extension){
					uni.showToast({
					    title: '软电话未登录',
					    duration: 2000,
						icon: 'none'
					});
					return false
				}
				self.show = 'H' //问卷模块显示
				self.boot = true //问卷内容显示
				self.dial = true //软电话显示
				self.getLastimes()// 获取拨打时间
				self.getValue('H') //获取问卷信息	
				
				//获取处理好的电话号码 外地加0
				uni.request({
					method: 'GET',
					url: self.apiDomian + '/phoneArea/getDialNumber',
					data: {
						phone: self.phone,
						code: self.uerInfo.areaCode //区号
					},
					header: {
						'content-type': 'application/json',
						'Authorization': 'Arch6WithCloud '+self.uerInfo.token
					}
				})
				.then((data) => {
					var phone = '9'+data[1].data.data //外地号码已加0
					self.newPhone = phone
					//发送socket
					socketMain.makecall(self.newPhone)
				})
				
				//获取问卷下一题
				uni.request({
					method: 'GET',
					url: self.apiDomian + '/examSubject/next/' + self.questionnaireId+'/'+ self.nextSubjectId, //问卷id + 下一题ID
					data: {},
					header: {
						'content-type': 'application/json',
						'Authorization': 'Arch6WithCloud ' + self.uerInfo.token
					}
				})
				.then((data) => {
					var obj = data[1].data.data //返回一个对象
					self.questionObj = obj
				})
			},
			
			//清除下一题的默认选项
			radioCheck(key,val,cur_id){
				this.radioCheckArr[key] = val+'|'+cur_id
			},
			
			//新建-联络历史
			apiinsAdd(){
				var self = this
				uni.request({
					method: 'POST',
					url: this.apiDomian + '/serviceLog/apiinsAdd', 
					data: {
						callType: '0', //呼叫方向 0呼出 1呼入
						ani: self.uerInfo.extension, //主叫号码
						dnis: this.phone, //被叫号码
						customerCode: self.customerCode == 'null' ? '' : self.customerCode, //客户ID
						customerName: self.customerName == 'null' ? '' : self.customerName, //客户姓名
						userCode: self.uerInfo.username, //坐席工号
						userName: self.uerInfo.nickname, //坐席姓名
						organCode: self.uerInfo.organCode, //坐席组织机构代码
						organName: self.uerInfo.organName, //坐席组织机构名称
						agentNo: self.uerInfo.agentNo, //坐席工号
						serviceLog: '', //服务结果(可以不传)
						campaignId: self.campaignId, //活动id (直接拨号的不传)
						batchId: self.batchId, //批次id(直接拨号的不传)
						taskId: self.id, //任务id(直接拨号的不传)此处传的是名单id
						phoneCode: self.phoneCode, //手机区号
						province: self.province, //归属地-省
						city: self.city, //归属地-市
						callId: self.phoneCallId, //通话id 
						callStartTime: self.contentTime, //通话开始时间
						serviceStartTime: self.contentTime, //通话开始时间
					},
					
					header: {
						'content-type': 'application/json',
						'Authorization': 'Arch6WithCloud ' + this.uerInfo.token
					}
				})
				.then((data) => {})
			},
			
			// 提交表单数据
			formSubmit() {
				var self = this
				if( self.toCallFlag == false ){
					uni.showToast({
					    title: '请先进行外呼',
					    duration: 2000,
						icon: 'none'
					});
					return false
				}
				
				
				var post_data = {
					callType: 0, //呼叫方向 0呼出 1呼入
					connectStatus: this.contentState == ''? 'N':'Y', //联系状态，Y-接通；N-未接通
					id: this.id, //名单ID
					lastConnectTime: this.lastConnectTime, //前台每次点击拨打电话储存一个时间
					orderPhone: this.phone, //预约号码
					orderStatus: this.yes, //是否预约：Y-是；N-否
					serviceResult1: this.picketData[0][this.multiIndex[0]].name,
					serviceType1: this.picketData[0][this.multiIndex[0]].id,
					validStatus: 3 //拨打状态，3为已拨打
				}
				//判断服务类型传的参数
				if(this.picketData[1][this.multiIndex[1]]){
					post_data.serviceResult2 = this.picketData[1][this.multiIndex[1]].name
					post_data.serviceType2 = this.picketData[1][this.multiIndex[1]].id
					
					if(this.picketData[2][this.multiIndex[2]]){
						post_data.serviceResult3 = this.picketData[2][this.multiIndex[2]].name
						post_data.serviceType3 = this.picketData[2][this.multiIndex[2]].id
					}
				}
				if(this.yes == 'Y'){
					post_data.orderTime = this.date +' '+this.time //预约时间
				}
				
				//存储服务小结的内容
				uni.setStorage({
					key: 'service_data',
					data: post_data,
					success: function() {
						//console.log(post_data)
					}
				});
				
				var data = {
					serviceResult1: this.picketData[0][this.multiIndex[0]].name,
					serviceType1: this.picketData[0][this.multiIndex[0]].id,
					serviceLog: this.textArea ,//服务结果
					callId: self.phoneCallId,//通话id
					callEndTime: self.endTime,//通话结束时间
					serviceEndTime: self.endTime, //通话结束时间
				}
				//判断服务类型传的参数
				if(this.picketData[1][this.multiIndex[1]]){
					data.serviceResult2 = this.picketData[1][this.multiIndex[1]].name
					data.serviceType2 = this.picketData[1][this.multiIndex[1]].id
					
					if(this.picketData[2][this.multiIndex[2]]){
						data.serviceResult3 = this.picketData[2][this.multiIndex[2]].name
						data.serviceType3 = this.picketData[2][this.multiIndex[2]].id
					}
				
				}
				
				//联络历史更新
				uni.setStorage({
					key: 'contact_update',
					data: data,
					success: function() {
						uni.showToast({
							title: '提交成功',
							duration: 2000,
						});
					}
				});


				// 设置可结束软电话
				uni.setStorage({
					key: 'endPhoneFlag',
					data: true,
					success: function() {
					}
				});
			},
			
			// 问卷组件传的更新值
			loadQuestionList(val1,val2,val3){
				if(val3 == 'add'){  
					this.prev_id = this.prev_id + 1
					this.prev_arr[this.prev_id] = val2
					
				}else{
					this.prev_id = this.prev_id - 1
				}
				//console.log(this.prev_id)
				
				this.questionObj = val1
			},
			
			// 获取ajax三级联动的数据
			setPickerData(obj){
				if(!obj) return
				var ajaxarr = [];
				for (var i in obj) {
					var temp = {}
					temp.id = obj[i].id
					temp.name = obj[i].typeName
					ajaxarr.push(temp); 
				}
				return ajaxarr
			},

		}
	}
</script>

<style lang="less">
	body {
		background: #f0f0f0;
		padding-bottom: 60upx;
	}
	
	.header {
		background: #fff;
		border-radius: 14upx;
		margin: 30upx 30upx 20upx 30upx;
		padding: 30upx;
		font-size: 34upx;
		line-height: 60upx;

		.side-nav {
			width: 26%;
		}

		.header-item {
			display: flex;

			.iconfont {
				background: #4a85d3;
				color: #fff;
				height: 60upx;
				line-height: 60upx;
				width: 80upx;
				text-align: center;
				padding: 0;
				font-size: 32upx;
			}
		}
	}
	
	.innerBox {
		margin: 20upx 30upx;
		
		.wrap {
			background: #fff;
			margin-bottom: 20upx;
			padding-bottom: 10upx;
			border-radius: 14upx;
		}
	}

	.nav {
		display: flex;
		text-align: center;
		font-size: 32upx;
		font-weight: bold;
		height: 88upx;
		border-bottom: 1upx solid #ccc;
		line-height: 88upx;

		.nav-item {
			flex: 1;

			&.active {
				text {
					position: relative;
					color: #4a85d3;

					&:before {
						content: " ";
						position: absolute;
						top: 64upx;
						left: 50%;
						margin-left: -18upx;
						width: 40upx;
						height: 4upx;
						background-color: #4a85d3;
					}
				}
			}
		}
	}
	
	.btm-wrap {
		background: #fff;
		padding-bottom: 30upx;
		border-radius: 14upx;
	}
	
	//子级的样式
	.mainBody {
		border-radius: 14upx;
	}

</style>
