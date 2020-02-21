<template>
	<view>
		<view class="inner-wrap">
			<view>
				<view class="msg-list" hover-class="active" @click="goNext(index)" v-for="(list, index) in msgArr" :key="index">
					<view class="msgTitle">
						<view class="msgleft">{{ list.msgTitle }}</view>
						<view class="magTime">{{ list.sendTime }}</view>
					</view>
				</view>
			</view>
			<view>
				<image v-if="msgArr == ''" class="img" src="../static/images/nomessige.jpg" mode="aspectFit"></image>
			</view>
		</view>
		
	</view>
</template>
	
<script>
	import { mapState,mapMutations } from 'vuex'
	
	export default { 
		// 提取存储数据
		computed: mapState(['hasLogin', 'uerInfo']),
		
		props:['msgArr'],
		data() {
			return {
				
			}
		},
		

		onLoad() {
		},
		
		methods: {
			
			goNext(index){
				var self = this
				//数据缓存
				var obj = {}
				obj.content = decodeURIComponent(this.msgArr[index].msgDate) //消息内容
				obj.createName = this.msgArr[index].operatorName //发布人名称
				obj.sendTime = this.msgArr[index].sendTime //发布时间
				obj.noticeTitle = this.msgArr[index].msgTitle //消息标题
				obj.msgId = this.msgArr[index].msgId //消息ID
			
				uni.setStorage({
					key: 'newContent',
					data: obj,
					success: function() {
						uni.navigateTo({
							url: '/pages/mine/notice'
						})
					}
				});
				
			},
		}
	}
</script>

<style lang="less">
	.inner-wrap {
		margin: 30upx 0 60upx 0;
		font-size: 28upx;
		
		.msg-list {

			.msgTitle {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-left: 30upx;
				padding: 30upx 30upx 30upx 0;
				box-sizing: border-box;
				border-bottom: 1upx solid #DADADA;
				font-size: 30upx;
				
				.msgleft{
					width: 320upx;
					white-space: nowrap;
					text-overflow: ellipsis;
					overflow: hidden;
				}
				
				.magTime {
					flex: 1;
					text-align: right;
					font-size: 26upx;
					color: #808080;
					font-family:'Helvetica',Courier,monospace; //SimSun
				}
			}
		}
		
		.img {
			display: block;
			margin: 100upx auto;
		}
		
		.active {
			background: #ECECEC;
		}
	}
	
</style>



