<template>
	<view :class="['bound-wrap-content',stra =='2' ? 'pt250' : 'pt10']"> 
		<text class="close iconfont" @click="closePop">&#xe6c3;</text>
		<view class="header">
			<view class="header-item">
				<text class="side-nav">呼出号码</text>
				<text style="color: red;">{{ phoneObj.num }}</text>
				<button @click="call" class="iconfont">&#xe76d;</button>
			</view>
			<view class="header-item">
				<text class="side-nav">归属地</text>
				<text>{{ phoneObj.province }} {{ phoneObj.city }}</text>
			</view>
		</view>
		
		<view class="inner">
			<view class="wrap">
				<view class="nav">
					<view :class='["nav-item",show=="A" ? "active" : ""]' @click="changeNav('A')">
						<text>客户信息</text>
					</view>
					<view :class='["nav-item",show=="U" ? "active" : ""]' @click="changeNav('U')">
						<text>联络历史</text>
					</view>
				</view>
				
				<!-- 客户信息 -->
				<view class="customer-info" v-if="show == 'A'">
					<view>
						<text>等级：</text>
						<text>{{ cus_info.groupName || '暂无' }}</text>
					</view>
					<view>
						<text>姓名：</text>
						<text>{{ cus_info.clientName || '暂无' }}</text>
					</view>
					<view>
						<text>客户ID：</text>
						<text>{{ cus_info.clientId || '暂无' }}</text>
					</view>
					<view>
						<text>号码：</text>
						<text>{{ cus_info.phone || '暂无' }}</text>
					</view>
					<view>
						<text>身份：</text>
						<text>{{ cus_info.sourceName || '暂无' }}</text>
					</view>
					<view>
						<text>创建时间：</text>
						<text>{{ cus_info.updatetime || '暂无' }}</text>
					</view>
				</view>
				
				<!-- 联络历史 -->
				<ContactHistory v-if="show == 'U'" :infoArr='infoArr'></ContactHistory>
				
			</view>
			
			<!--填写服务结果 -->
			<view class="bottom-wrap">
				<Service :picketData="picketData" :ajaxobj_rs="ajaxobj_rs" @formSubmit="formSubmit" @getPickerData="getPickerData" @getTimeData="getTimeData" @serviceLog='serviceLog'></Service>
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
	//import socketYatai from "@/components/softphone/config/socket/yatai";
	import socketMain from "@/components/softphone/config/socket/main";
	import common from "@/components/softphone/config/common";
	import api from "@/components/softphone/config/api";
	
	export default {
		props:['strc','strb','phoneObj','contentTime','endTime','contentState','phoneCallId','meetingFlag'],
		components: {
			ContactInfo,
			ContactHistory,
			Questionnaire,
			Service
		},
		
		data() {
			return {
				star: '',
				phone: '', //电话号码
				province: '', //省份
				city: '', //城市
				phoneCode: '', //地区编号
				campaignId: '',
				id: '',
				customInfoObj: '', //客户信息
				show: 'A', // 默认显示客户信息
				questionnaireId: '',
				typeCode: '', //获取服务类型三级联动的参数
				picket_item_2: 0,
				questionData: {}, //问卷数据
				ajaxobj_rs: {},
				multiIndex: [0, 0, 0], // 服务类型下标
				questionObj:{},
				picketData: [], //服务类型三级联动数据
				yes: 'N', //服务结果
				date: '', //预约时间默认年月日
				time: '', //预约时间默认时分秒
				cus_info:'',//获取客户信息
				infoArr: ' ',//获取联络历史
				tel: '' //回拨的号码加90
			}
		},

		// 提取存储数据
		computed: mapState(['hasLogin', 'uerInfo']),

		mounted(options) {
			this.endDate = common.getCurrentDay() //获取结束时间
			this.starDate = common.getPrevMonthDay(this.endDate) //获取开始时间
			this.getBasicInfo() //获取客户信息
			this.history_date()//获取联络历史
			var self = this
			
			uni.request({
				method: 'GET',
				url: this.apiDomian + '/serviceType/findTreeByCode',
				data: {
					typeCode: 'callout' //固定写
				},
				header: {
					'content-type': 'application/json',
					'Authorization': 'Arch6WithCloud ' + self.uerInfo.token
				}
			})
			.then((data) => {
				var ajaxobj = data[1].data.data.children
				self.ajaxobj_rs = ajaxobj
				var ajaxarr1 = self.setPickerData(ajaxobj)
				var ajaxarr2 = []
				var ajaxarr3 = []
				if(ajaxobj[0].children){
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

		},

		methods: {
			
			//回拨电话
			call(){
				var self = this
				api.getDialNumber(self.phoneObj.num,self.uerInfo.areaCode,self.apiDomian,self.uerInfo.token,function(data){
					var phoneNum = '9'+data[1].data.data
					self.tel = phoneNum
					socketMain.makecall(self.tel)
				})
			},
			
			//获取服务小结输入内容     
			serviceLog(val){
				this.textArea = val
			},
			
			closePop(){
				var self = this
				if(self.contentState == 'Y' && !self.meetingFlag){
					uni.getStorage({
						key: 'endPhoneFlag',
						success: function(res) {
							if (!res.data) {
								uni.showToast({
									title: '请填写服务小结',
									duration: 2000,
									icon: 'none',
								});
							}else {
								self.$emit('closePop',1)
							}
						}
					})
					
				}else {
					self.$emit('closePop',1)
				}
				
			},
			
			// 获取联络历史
			history_date(){
				var self = this
				api.getCusInfo(self.apiDomian,self.uerInfo.token,self.phoneObj.num,self.starDate,self.endDate,function(data){
					if(data[1].data.data){
						self.infoArr = data[1].data.data.records
					}else{
						self.infoArr = ''
					}
				})
			},
			
			// 获取客户基本信息
			getBasicInfo(){
				var self = this
				api.customerList(self.apiDomian,self.uerInfo.token,self.phoneObj.num,function(data){
					if( !data[1].data.data){
						self.cus_info = ''
					}else{
						self.cus_info = data[1].data.data[0]
					}
				})
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
			
			// 切换导航
			changeNav(key) {
				this.show = key
			},
			
			// 提交表单数据
			formSubmit() {
				var self = this
				var post_data = {
					callType: 0, //呼叫方向 0呼出 1呼入
					connectStatus: this.contentState == ''? 'N':'Y', //联系状态，Y-接通；N-未接通
					id: this.id, //名单ID
					lastConnectTime: this.contentTime, //前台每次点击拨打电话储存一个时间
					orderPhone: this.strb, //预约号码
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
						console.log(post_data)
					}
				});
				
				var data = {
					serviceResult1: self.picketData[0][this.multiIndex[0]].name,
					serviceType1: self.picketData[0][this.multiIndex[0]].id,
					serviceLog: self.textArea ,//服务结果
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
						console.log(data)
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
	
	.customer-info {
		padding: 20upx 30upx;
		font-size: 28upx;
		line-height: 50upx;
	}
	
	.bound-wrap-content {
		postiton: relative;
		
		&.pt250 { padding-top: 250upx;}
		&.pt10 { padding-top: 10upx;}
		
		.close {
			display: block;
			position:absolute;
			width: 60upx;
			height: 60upx;
			line-height: 60upx;
			text-align: center;
			background: #fff;
			border-radius: 50%;
			border: 1upx solid #ccc;
			right: 16upx;
		}
		.header {
				background: #fff;
				margin: 30upx 30upx 0 30upx;
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
						font-size: 28upx;
					}
				}
			}
			
			.inner {
				margin: 0 30upx 0 30upx;
				
				.wrap {
					background: #fff;
					padding-bottom: 10upx;
					border-bottom: 4upx solid #ccc;
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
			
			.serve-wrap {
				background: #fff;
				padding-bottom: 30upx;
			}
			
			.btn {
				background: #4a85d3;
				padding: 0;
				margin: 0 30upx;
				color: #fff;
			}
	}
	
</style>
