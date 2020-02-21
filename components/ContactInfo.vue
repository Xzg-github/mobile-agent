<template>
	<view>
		<view class="customer-info" v-if="customInfoObj">
			<view class="info-list"  v-for="(item,index) in customInfoObj" :key="index">
				<view class="info-item">
					<text>{{index}}：</text>
					<text>{{item}}</text>
				</view>
			</view>
		</view>
		<view  v-else style="padding: 30upx; font-size: 28upx; text-align: center;">暂无相关数据</view>
	</view>
</template>

<script>
	export default {
		// 父级传值子级
		props:["customInfoObj"],
		
		data() {
			return {
				show: 'U' ,
				sex: '1', //男女的标识 0女 1男
			}
		},

		onLoad() {

		},
		
		methods: {
			changeNav(key) {
				this.show = key
			},
			
			//切换radio选项
			changeSex(key) {
				console.log(key)
				this.sex = key
			},
		}


	}
</script>

<style lang="less">
	.customer-info {
		padding: 30upx;
		font-size: 30upx;

		.info-list {
			line-height: 50upx;
		}
		
		// 问卷
		.questionnaire {
			font-size: 26upx;
		}
		.head {
			color: #808080;
			
			.head-item {
				padding-bottom: 16upx;
				display: flex;
				
				.item-name {
					width: 20%;
				}
				
				text {
					flex: 1;
				}
			}
		}
		
		
	}
</style>
