<template>
	<view>
		<view class="info">
			<view class="header-wrap">
				<view>客户信息</view>
				<view @click="change" class="iconfont rect" :class="['iconfont', state == true ? 'rect' : 'rects'] ">&#xe60d;</view>
			</view>
			<view v-if="state">
				<view class="list">
					<view class="title">等级：</view>
					<text>{{ cus_info.groupName || '暂无' }}</text>
				</view>
				<view class="list">
					<view class="title">姓名：</view>
					<text>{{ cus_info.clientName || '暂无' }}</text>
				</view>
				<view class="list">
					<view class="title">客户ID：</view>
					<text>{{ cus_info.clientId || '暂无' }}</text>
				</view>
				<view class="list">
					<view class="title">号码：</view>
					<text>{{ cus_info.phone || '暂无' }}</text>
				</view>
				<view class="list">
					<view class="title">身份：</view>
					<text>{{ cus_info.sourceName || '暂无' }}</text>
				</view>
				<view class="list">
					<view class="title">创建时间：</view>
					<text>{{ cus_info.updatetime || '暂无' }}</text>
				</view>
				
			</view>
			
		</view>
		
	</view>
</template>

<script>

	export default {
		
		props: ['cus_info'],
		data() {
			return {
				state:true
			}
		},
		
		methods: {
			change(){
				this.state = !this.state
			}
		}
	}
</script>

<style lang="less">

	.info {
		background: #fff;
		border-radius: 14upx;
		margin: 20upx 30upx;
		padding: 30upx;
		font-size: 30upx;
		line-height: 58upx;
		
		.header-wrap {
			font-size: 32upx;
			font-weight: bold;
			display: flex;
			justify-content: space-between;
			
			.rect {
				font-size: 34upx;
				color:	#4169E1;
				font-weight: bold;
				left: 48%;
				bottom: -20upx;
			}
			.rects {
				transform:rotate(180deg);
				font-size: 34upx;
				color:	#4169E1;
				font-weight: bold;
				left: 48%;
				bottom: -20upx;
			}
			
		}
		
		
		.list {
			display: flex;
			
			.title{
				color: #808080;
			}
		}
		
	}
</style>
