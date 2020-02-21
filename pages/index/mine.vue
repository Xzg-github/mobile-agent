<template>
	<view class="content">
		<News></News>
		<view class="userbar">
			<image class="head-img" src="../../static/images/head.png"></image>
			<view class="use-mane">{{ uerInfo.nickname }}</view>
			<view class="use-info">
				<view>
					<view class="role">{{ uerInfo.username || '未知' }}</view>
					<view>工号</view>
				</view>
				<view>
					<view class="role">{{ uerInfo.organName || '未知' }}</view>
					<view>组织机构</view>
				</view>
				<view>
					<view class="role">{{ uerInfo.roleNames || '未知' }}</view>
					<view>角色</view>
				</view>
			</view>
		</view>
		<view class="bottom">
			<navigator class="bottom-item" url="../mine/news">
				<view class="list">
					<view style="display: flex; position: relative;">
						<image src="../../static/images/xiaoxi.png" class="icon-left"></image>
						<text style="display: block;">消息</text>
						<view class="sign" v-if="num != 0">{{ mun }}</view>
					</view>
					<text class="iconfont icon-right">&#xe600;</text>
				</view>
			</navigator>
			<view class="bottom-item" hover-class="avtive">
				<view class="list">
					<view style="display: flex;">
						<image src="../../static/images/shezhi.png" class="icon-left"></image>
						<view style="display: block;">账户设置 <text class="tip">(暂无可设置选项)</text></view>
					</view>
					<text class="iconfont icon-right">&#xe600;</text>
				</view>
			</view>
			<view class="bottom-item" hover-class="avtive" @click="signOut">
				<view class="list">
					<view style="display: flex;">
						<image src="../../static/images/tuichu.png" class="icon-left"></image>
						<text style="display: block;">退出</text>
					</view>
					<text class="iconfont icon-right">&#xe600;</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {  mapState,  mapMutations  } from 'vuex'; 
	import News from "@/components/News.vue";
	import common from "@/components/softphone/config/common";
	
	export default {
		components :{
			News //消息弹窗
		},
		
		data() {
			return {
				num:'',
				endDate:'',
				starDate:'',
			}
		},
		 // 提取存储数据
		computed: mapState(['hasLogin','uerInfo']), 
		
		onShow() {
			
			// 未读消息数量
			var self = this
			uni.request({
			    method: 'GET',
			    url: this.apiDomian+'/news/page', 
			    data: {
					selectType: 1,  //查询类型 1：未读消息列表 
					agentId: self.uerInfo.username,  //坐席工号
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
				if(data[1].data.errCode < 0){
					this.num = ''
				}else{
					this.num = data[1].data.data.total
				}
				
				if(this.num != 0){
					wx.setTabBarBadge({
					  index: 1,
					  text: this.num.toString() 
					})
				}
			})
			
		},
		onLoad() {
			this.endDate = common.getCurrentDay() //获取结束时间
			this.starDate = common.getPrevMonthDay(this.endDate) //获取开始时间
		},
		methods: {
			
			//登出
			signOut(){
				var self =this
				uni.request({
				    method: 'POST',
				    url: this.apiDomian+'/jwt/logout', 
				    data: {
						username: this.uerInfo.username,  //用户工号
						//username: this.uerInfo.agentNo,  //用户工号
					},
				    header: {
				        'content-type' : 'application/x-www-form-urlencoded',
						'Authorization': 'Arch6WithCloud ' + self.uerInfo.token
				    }
				    
				})
				.then((data) => {
					var status = data[1].data.status
					if(status == '0'){
						this.offline()//坐席退出
					}
				})
			},
			
			//坐席登出
			offline(){
				var self= this
				uni.showLoading({
					title: '加载中'
				})
				uni.request({
				    method: 'POST',
				    url: this.apiDomian+'/onlineAgent/offline', 
				    data: {
						agentId: this.uerInfo.username,  //用户工号
					},
				    header: {
				        'content-type' : 'application/json',
						'Authorization': 'Arch6WithCloud ' + self.uerInfo.token
				    }
				    
				})
				.then((data) => {
					uni.hideLoading();
					//if(data[1].data.errCode == '0'){
						uni.reLaunch({
						    url: '/pages/index/login'
						});
					//}
					
				})
			},
			
		}
	}
</script>

<style lang="less">
	body {
		background: #f0f0f0;
	}
	.userbar {
		text-align: center;
		padding: 40upx 100upx;
		margin-bottom: 30upx;
		color: #fff;
		background: linear-gradient(left top, #6495ED, #4169E1);
		
		.head-img {
			width: 150upx;
			height: 150upx;
			border-radius: 50%;
		}
		.use-mane {
			margin: 26upx 0;
			font-weight: bold;
			font-size: 40upx;
		}
		
		.use-info {
			display: flex;
			justify-content: space-between;
			font-size: 26upx;
			color: #eee;
			
			.role {
				font-size: 30upx;
				color: #fff;
				padding-bottom: 10upx;
			}
		}
		
	}
	
	.bottom {
		background: #fff;
		
		.bottom-item {
			padding-left: 30upx;
			font-size: 32upx;
			
			.list {
				padding-right: 30upx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				border-bottom: 1upx solid #eee;
				height: 120upx;
				line-height: 40upx;
				
				.tip {
					padding-left: 30upx;
					font-size: 28upx;
					color: #666;
				}
			}
			
			// .icon-left {
			// 	font-size: 48upx;
			// 	padding-right: 28upx;
			// 	color: #4a85d3;
			// }
			
			.icon-left {
				width: 42upx;
				height: 42upx;
				margin-right: 30upx;
			}
			
			.icon-right {
				font-size: 26upx;
				color: #999;
				font-weight: bold;
			}
			
			.sign {
				position: absolute;
				right: -14upx;
				top: -2upx;
				width: 16upx;
				height: 16upx;
				line-height: 34upx;
				border-radius: 50%;
				background: #FF0000;
				font-size: 18upx;
				color: #fff;
				text-align: center;
			}
		}
		
		.avtive {
			background-color: rgba(0, 0, 0, 0.1);
			opacity: 0.7;
		}
	}
</style>

