<template>
	<view>
		<view class="news-box" v-if="messageFlag" @click="goNext">
			<view class="newsTit">
				<text class="iconfont">&#xe616;</text>
				<text>{{ messageData.msgTitle }}</text> 
			</view>
			<text style="color: #808080; font-size: 26upx; flex: 1; text-align: right;">{{ messageData.sendTime }}</text>
		</view>
	</view>
</template>

<script>
	export default {
		//props: ['messageData'],
		data() {
			return {
				messageFlag: false,//消息是否弹窗
				messageData:{} //接收实时消息
			}
		},
		
		computed:{
			
			//消息
			newsReceiveObj() {
				//console.log('这是组件接收的compted的值')
				//console.log('computed method in Home.vue')
				return this.$store.state.newsReceiveObj
			},
			
		},
		watch: {
			//消息
			newsReceiveObj(curData,prevData){
				//console.log('watch method in Home.vue')
				//console.log('这是watch的值')
				this.messageData = curData
				this.messageFlag = true;
				var self = this
				setTimeout(function(){
					self.messageFlag = false;
				},7000)
			},
			
		},
		
		onLoad() {

		},
		methods: {
			goNext(){
				var self = this
				//数据缓存
				var newData = {}
				newData.content = self.messageData.msgDate//消息内容
				newData.createName = self.messageData.operatorName //发布人名称
				newData.sendTime = self.messageData.sendTime //发布时间
				newData.noticeTitle = self.messageData.msgTitle //消息标题
				newData.msgId = self.messageData.msgId //消息标题
				
				uni.setStorage({
					key: 'newContent',
					data: newData,
					success: function() {
						uni.navigateTo({
							url: '/pages/mine/notice'
						})
					}
				});
				
			}
		}
	}
</script>

<style lang="less">
	.news-box {
		padding: 0 20upx;
		font-size: 28upx;
		margin: 0 5%;
		box-sizing: border-box;
		position: fixed;
		top: 20upx;
		display: flex;
		justify-content: space-between;
		width: 90%;
		border-radius: 8upx;
		height: 100upx;
		line-height: 100upx;
		background: #eee;
		box-shadow: 0 0 8upx #ccc;
		opacity: 0.9;
		
		.iconfont {
			padding-right: 20upx;
			font-size: 34upx;
		}
		
		.newsTit {
			width: 320upx;
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
		}
	}
</style>

