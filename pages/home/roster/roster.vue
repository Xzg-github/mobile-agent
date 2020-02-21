<template>
	<view>
		<News></News>
		<view class="nav">
			<view :class='["nav-item",show=="U" ? "active" : ""]' @click="changeNav('U')">
				<text>未拨打</text>
			</view>
			<view :class='["nav-item",show=="H" ? "active" : ""]' @click="changeNav('H')">
				<text>预约中</text>
			</view>
			<view :class='["nav-item",show=="P" ? "active" : ""]' @click="changeNav('P')">
				<text>已完成</text>
			</view>
		</view>
		<!-- <form action="" v-if="show == 'P'">
			<view class="ipt-box">
				<image src="../../../static/images/search.png" class="search-image"></image>
				<input class="ipt" type="text" placeholder="请选择日期" />
			</view>
		</form> -->

		<!-- 内容部分 -->
		<view>
			<CustomInfo :title='show' :customData='customData'></CustomInfo>
		</view>
		<!-- 内容部分 END -->

	</view> 
</template>

<script>
	
	import {  mapState,  mapMutations  } from 'vuex'
	import CustomInfo from "@/components/CustomInfo.vue"
	import News from "@/components/News.vue";
	
	export default {
		components: {
			CustomInfo,
			News
		},

		data() {
			return {
				show: 'U', //U未拨打 H预约中 P已完成
				customData: [],
				currentIndex:'',
				page: 1, //页码
			}
		},
		
		// 提取存储数据
		computed: mapState(['hasLogin','uerInfo']), 

		onLoad() {
			this.getData('U')
		},

		methods: {
			changeNav(key) {
				this.show = key
				this.page = 1
				this.customData = []
				this.getData(key)
			},
			
				 
			// 获取列表中的数据
			
			getData(key) {
				var self = this
				uni.showLoading({
					title: '加载中'
				})
				
				var postObj = {
					userId: self.uerInfo.id,
					current: this.page,
					size:'10'
				}
				//U未拨打 H预约中 P已完成
				if (key == 'U') {
					var ajaxUrl = this.apiDomian+'/batchTask/agentTaskPage'
				} else if (key == 'H') {
					var ajaxUrl = this.apiDomian+'/batchTask/agentOrderPage'
					postObj.descs = 'order_time'
				} else if (key == 'P') {
					var ajaxUrl = this.apiDomian+'/batchTask/agentFinishedPage'
					postObj.descs = 'last_connect_time'
				}	
				
				uni.request({
				    method: 'GET',
				    url: ajaxUrl,  
				    data:  postObj,
				    header: {
				        'content-type': 'application/json',
						'Authorization': 'Arch6WithCloud '+self.uerInfo.token
				    }
				})
				.then((data) => {
					uni.hideLoading();
					var obj = data[1].data.data
					
					if(obj.records.length == 0){
						uni.showToast({
						    title: '暂无更多数据',
						    duration: 2000,
							icon: 'none',
							image:'../../../static/images/nothing.png'
						});
					}else{
						self.page = this.page + 1
						self.customData = [...this.customData ,...obj.records]
					}
					
				})
				
				
				
			}
			
		},
		onReachBottom(){
			this.getData(this.show)
		}

	}
</script>

<style lang="less">
	body {
		border-top: 1upx solid #ccc;
		background: #f7f6f9;
	}

	.nav {
		display: flex;
		padding: 0 30upx;
		margin-bottom: 20upx;
		text-align: center;
		background-color: #fff;
		font-size: 28upx;
		height: 88upx;
		line-height: 88upx;
		border-top: 1upx solid #f0f0f0;

		.nav-item {
			flex: 1;

			// text {
			// 	color: #666;
			// }

			&.active {
				text {
					position: relative;
					color: #4a85d3;

					&:before {
						content: " ";
						position: absolute;
						top: 60upx;
						left: 50%;
						margin-left: -12upx;
						width: 24upx;
						height: 4upx;
						background-color: #4a85d3;
					}
				}
			}
		}
	}

	.ipt-box {
		position: relative;
		margin: 30upx 30upx 0 30upx;
		display: flex;
		align-items: center;
		height: 70upx;
		border-radius: 12upx;
		font-size: 26upx;
		border: 1upx solid #999;

		.ipt {
			padding: 0 120upx 0 30upx;
		}
		
		.search-image{
			width: 34upx;
			height: 34upx;
			margin-left: 30upx;
		}
	}
</style>
