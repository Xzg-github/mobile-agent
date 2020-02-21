<template>
	<view>
		<News></News>
		<view>
			<image class="banner" src="../../static/images/banner.jpg"></image>
			<view class="main-wrap">
				<navigator class="box" url="../home/roster/roster">
					<image class="img" src="../../static/images/menu2.png"></image>
					<view>外呼名单</view>
				</navigator>
				<navigator class="box" style="border-right: none;" url="../home/contact/contact">
					<image class="img" src="../../static/images/menu3.png"></image>
					<view>联络历史</view>
				</navigator>
<!-- 				<navigator class="box" url="../home/order/order">
					<image class="img" src="../../static/images/menu1.png"></image>
					<view>工单管理</view>
				</navigator>
				<navigator class="box" style="border-right: none;" url="../home/case/case">
					<image class="img" src="../../static/images/menu4.png"></image>
					<view>案件</view>
				</navigator>
				<navigator class="box" style="border-right: none;" url="../home/policy/policy">
					<image class="img" src="../../static/images/menu5.png"></image>
					<view>保单</view>
				</navigator>    
				<navigator class="box" style="border-right: none;" url="../home/task/task">
					<image class="img" src="../../static/images/menu6.png"></image>
					<view>任务</view>
				</navigator> -->
			</view>
		</view>

		<!-- 呼入弹屏 -->
		<view class="bound-wrap" v-if="page_len == 2 && !phoneObj.num">
			<Inbound :phoneCallId="phoneCallId" :contentState="contentState" :meetingFlag="meetingFlag" :contentTime="contentTime"
			 :endTime="endTime" :stra="expand_type" :strb="callPhone" :strc='callid' @closePop='getChose' @getPageLen="getPageLen"></Inbound>
		</view>

		<!-- 用户信息弹窗 呼出 -->
		<view v-if="phoneObj.num">
			<Exhale :phoneCallId="phoneCallId" :contentState="contentState" :meetingFlag="meetingFlag" :contentTime="contentTime"
			 :endTime="endTime" :phoneObj='phoneObj' :strc='callid' :strb="callPhone" @closePop='getChosePop'></Exhale>
		</view>

		<!-- 软电话 -->
		<Softphone :socketType="socketType" :class_a="page_len == 1 ? '1' : '2'" :toCallFlag="toCallFlag" :pageName="pageName"
		 :socketObj="socketObj" @callStartTime="callStartTime" @callEndTime="callEndTime" @phoneCallID='phoneCallID'
		 @setStateActiveCallId='setStateActiveCallId' @getPhoneObj="getCallPhone" @getPageLen="getPageLen" @expand="expand"
		 @bossFlag="bossFlag" @connectFlag="connectFlag">
		</Softphone>
	</view>
</template>

<script>
	import { mapState,mapMutations } from 'vuex'
	import Inbound from "@/components/Inbound.vue";
	import Exhale from "@/components/Exhale.vue";
	import News from "@/components/News.vue";
	import Softphone from "@/components/softphone/index.vue";
	import common from "@/components/softphone/config/common";
	import '@/components/softphone/css/shoftphone.less';
	import socketMain from "@/components/softphone/config/socket/main";
	import socketYatai from "@/components/softphone/config/socket/yatai";

	export default {

		components: {
			Softphone, //软电话
			Inbound, //呼入弹窗
			Exhale, //拨打电话弹窗
			News //消息弹窗
		},

		data() {
			return {
				socketType: 'yatai', //亚太客户（API）
				pageName: '首页',
				page_len: 1,
				expand_type: 2,
				callPhone: '',
				starDate: '', //开始时间
				endDate: '', //结束时间
				phoneObj: {}, //拨号的电话号码 地区  省份
				callid: '', //电话的id
				socketObj: {}, //软电话的返回数据
				contentTime: '', //联系时间
				endTime: '', //通话结束时间
				toCallFlag: false, //拨号的状态
				contentState: '', //电话接通情况
				phoneCallId: '', //新建接口传的CALLID
				meetingFlag: '' //不在会议中的标识
			}
		},

		computed: {
			...mapState(['hasLogin', 'uerInfo']),
			//软电话
			phoneReceiveObj() {
				//console.log('computed method in Home.vue')
				return this.$store.state.phoneReceiveObj
			},

		},
		watch: {
			//软电话
			phoneReceiveObj(curData, prevData) {
				//console.log('watch method in Home.vue')
				this.socketObj = curData
			},

		},

		onShow() {
			// 未读消息数量
			var self = this
			uni.request({
					method: 'GET',
					url: this.apiDomian + '/news/page',
					data: {
						selectType: 1, //查询类型 1：未读消息列表 
						agentId: self.uerInfo.username, //坐席工号
						startTime: self.starDate, //查询时间开始
						endTime: self.endDate, //查询时间结束
						contentKeyWords: '',
						title: '',
					},
					header: {
						'content-type': 'application/json',
						'Authorization': 'Arch6WithCloud ' + self.uerInfo.token
					}

				})
				.then((data) => {
					if (data[1].data.errCode < 0) {
						this.num = ''
					} else {
						this.num = data[1].data.data.total
					}
					if (this.num != 0) {
						wx.setTabBarBadge({
							index: 1,
							text: this.num.toString()
						})
					}

				})
		},

		onLoad() {
			var self = this
			this.endDate = common.getCurrentDay() //获取当前时间
			this.starDate = common.getPrevMonthDay(this.endDate) //获取上一个月的时间
			//判断连接yatai or aspect 
			var socketConnectUrl;
			if (this.uerInfo.platformType == 3) {
				//亚太测试环境接口
				socketConnectUrl = 'wss://zkr-softphone.apiins.com/msg'
			} else {
				//PC aspect测试环境接口可连接
				socketConnectUrl = 'ws://192.168.1.192:9093/softPhone/?userId=test5&portal=10.9.11.122:8180&EIO=3&transport=websocket'
			}

			// 连接软电话socket
			let SocketSoftPhone = uni.connectSocket({
				url: socketConnectUrl,
				//url: "ws://192.168.1.176:8181/msg", 
				success: function(event) {
					console.log('软电话连接成功')
				},
				fail: function(event) {
					console.log('软电话连接失败')
				},
			})

			// 监听软电话的实时事件
			SocketSoftPhone.onMessage(function(event) {

				var data = event.data;
					//yatai
				if (self.uerInfo.platformType == 3) {
					var dataobj = JSON.parse(data);
					self.setPhoneReceiveObj(dataobj)
				} else {
					// aspect 第一个socket 连接成功会报错
					if(data[0] == '0' && data[1] == '{'){
						return false
					} 
					var dataobj = JSON.parse(data.substr(data.indexOf('[')))
					// 判断是否无效数据
					if (Object.keys(dataobj).length < 2) {
						return false;
					}
				}
				self.setPhoneReceiveObj(dataobj)
			})


			//心跳包--避免长时间不操作socket导致断开
			setInterval(function(){
				SocketSoftPhone.send({
					data:'2'
				})
			},5000)

			//软电话初始化登录
			setTimeout(function() {
				socketMain.login()
			}, 1000)


			//消息实时推送连接
			let SocketTask = uni.connectSocket({
				url: "wss://zkr-inform-dev.apiins.com/inform/?userId=" + this.uerInfo.id + "&userCode=" + this.uerInfo.username +
					"&EIO=3&transport=websocket",
				//url: "ws://172.10.6.162:9092/inform/?userId=4806c5d170264b9ab4c8f46458940af9&userCode=8099&EIO=3&transport=websocket",
				success: function(event) {
					console.log(event)
				},
			})

			//消息实时推送接收值
			SocketTask.onMessage(function(rs) {
				//console.log('进入了消息')
				var str = rs.data
				if (str.indexOf('news') > -1) { //news
					str = JSON.parse(str.substr(str.indexOf('['))) //去除数组前面的数字
					self.messageFlag = true;
					self.messageData = str[1]
					self.setNewsReceiveObj(str[1]) //存储消息返回值
				}
			})

			//心跳包--避免长时间不操作socket导致断开
			setInterval(function() {
				SocketTask.send({
					data: '2'
				})
			}, 5000)

		},

		methods: {

			...mapMutations(['setNewsReceiveObj', 'setPhoneReceiveObj']), //消息vuex
			//...mapMutations(['setPhoneReceiveObj']),

			//电话接通标识
			connectFlag(val) {
				this.contentState = val
			},
			//不在会议中的标识
			bossFlag(val) {
				this.meetingFlag = val
			},

			expand(val) {
				this.expand_type = val
			},

			getPageLen(val) {
				this.page_len = val
			},

			//联系开始时间
			callStartTime(val) {
				this.contentTime = val
			},

			//通话结束时间
			callEndTime(val) {
				this.endTime = val
			},
			//获取新建接口传的ID
			phoneCallID(val) {
				this.phoneCallId = val
			},

			// 设置手机号码
			getCallPhone(obj) {
				if (obj.num) {
					console.log('当前拨打的号码：' + obj.num)
					this.callPhone = obj.num

					// 展开客户信息
					this.phoneObj = obj
				} else {
					this.callPhone = obj
				}

			},

			//获取callid
			setStateActiveCallId(val) {
				this.callid = val
			},

			//关闭呼入弹窗
			getChose(val) {
				this.page_len = val
			},

			//关闭拨号弹窗
			getChosePop() {
				this.phoneObj.num = ''
			}


		}
	}
</script>

<style lang="less">
	body {
		background: #f7f6f9;
	}

	.banner {
		display: block;
		width: 100%;
		height: 300upx;
	}

	.main-wrap {
		justify-content: space-between;
		flex-flow: row wrap;
		display: flex;
		background: #fff;
		margin: 20upx;
		border-radius: 8upx;
		box-shadow: 0 0 8upx #ccc;
		box-sizing: border-box;

		.box {
			padding: 40upx 0;
			width: 50%;
			text-align: center;
			font-size: 30upx;
			color: #666;
			box-sizing: border-box;

			.img {
				display: block;
				margin: 0 auto 20upx auto;
				width: 58upx;
				height: 58upx;
			}


		}

		// .box {
		// 	padding: 40upx 0;
		// 	width: 33%;
		// 	text-align: center;
		// 	font-size: 30upx;
		// 	color: #666;
		// 	box-sizing: border-box;
			
		// 	.img {
		// 		display: block;
		// 		margin: 0 auto 20upx auto;
		// 		width: 56upx;
		// 		height: 56upx;
		// 	}
			
			
		// }
	}
</style>
