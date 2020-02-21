<template>
	<view class="content">
		<News></News>
		<view v-if="infoArr.length > 0">
			<view class="info-list" hover-class="active" @click="goNext(index,list.clientPhoneNo)" v-for="(list, index) in infoArr" :key="index">
				<view class="info-item first">
					<view>
						<text class="item-name first-title">开始时间：</text>
						<text>{{ list.startDate }}</text>
					</view>
					<view class="toCall">
						<view v-if="list.callDirection == 0">
							<text>呼出</text>
							<text class="iconfont call">&#xe69e;</text>
						</view>
						<view v-if="list.callDirection == 1">
							<text>呼入</text>
							<text class="iconfont call callIn">&#xe6ad;</text>
						</view>
					</view>
				</view>
				<view class="info-item">
					<text class="item-name">客户名称</text>
					<text style="color: #007AFF;">{{ list.clientName || "暂无" }}</text>
				</view>
				<view class="info-item">
					<text class="item-name">坐席工号</text>
					<text>{{ list.agentId }}</text>
				</view>
				<view class="info-item">
					<text class="item-name">客户号码</text>
					<text>{{ list.clientPhoneNo }}</text>
				</view>
			</view>
			<!-- <view style="margin: 30upx auto; text-align: center;">没有更多了~</view> -->
		</view>
		<view style="text-align: center; padding: 40upx;font-size: 30upx;" v-else>暂无相关数据</view>
	</view>
</template>

<script>
	import News from "@/components/News.vue";
	export default {
		components: {
			News
		},
		
		props: ["infoArr"],
		
		data() {
			return {

			}
		},

		mounted: function(){
			
		},
		
		methods: {
			
			// 列表详情数据存储
			goNext(index,phone){
				var self = this
				var obj = {}
				obj = this.infoArr[index]
				
				//填写的数据缓存
				uni.setStorage({
					key: 'obj',
					data: obj,
					success: function() {
						uni.navigateTo({
							url: '/pages/home/contact/external?phone='+phone
						})
					}
				});
				
			},

		}
	}
</script>

<style lang="less">


	.info-list {
		padding: 20upx 0upx 20upx 30upx;
		margin-bottom: 20upx;
		font-size: 30upx;
		background: #fff;
		
		.info-item {
			display: flex;
			padding-top: 20upx;
			
			.item-name {
				width: 20%;
				color: #808080;
				font-size: 29upx;
			}
		}
		
		.first {
			justify-content: space-between;
			align-items: center;
			padding: 0 30upx 20upx 0;
			border-bottom: 1upx solid #ccc;
			
			.first-title {
				color: #333;
				font-size: 30upx;
			}
			
			.toCall{
				font-size: 28upx;
				
				.call {
					font-size: 30upx;
					color: #55A532;
				}
				
				.callIn {
					color: #EE9900;
				}
			}
			
		}
	
	}
	
	.active {
		background: #ECECEC;
	}

</style>
