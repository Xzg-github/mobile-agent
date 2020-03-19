<template>
		
		<view>
			<!-- 按钮组 -->
			<view class="top-wrap">
				<view class="btn" hover-class="active" @click="Hangup">
					<view class="iconfont icon">&#xe705;</view>
					<view>结束会议</view>
				</view>
			</view>
			<view class="bottom-wrap">
				<!-- 显示状态组 -->
				<view class="statusBar-box">
					<text class="lable">会议通话中</text>
					<view class="line"></view>
					<view>{{ timer }}</view>
				</view>
				<view class="divide"></view>
				<view class="iconfont pickUp" @click="changeClose">&#xe6de;</view>
			</view>
			
		</view>
</template>

<script>
	//import socketYatai from "@/components/softphone/config/socket/yatai";
	import socketMain from "@/components/softphone/config/socket/main";
	export default {
		props:['timer','stra'],
		data() {
			return {
				
			}
		},
		
		methods: {
			changeClose(){
				this.$emit('close')
			},
			
			//结束会议
			Hangup (){
				socketMain.hangUp(this.stra)
			}
		}


	}
</script>

<style lang="less">

</style>



