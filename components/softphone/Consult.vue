<template>
		
		<view>
			<!-- 按钮组 -->
			<view class="top-wrap">
				<view class="callIn-box">
					<view class="btn" hover-class="active" @click="Finishtransfer">
						<view class="iconfont icon">&#xe60c;</view>
						<view>转接</view>
					</view>
					<view class="btn" hover-class="active" @click="Finishconference">
						<view class="iconfont icon">&#xe612;</view>
						<view>会议</view>
					</view>
					<view class="btn" hover-class="active" @click="cancel">
						<view class="iconfont icon">&#xe705;</view>
						<view>结束咨询</view>
					</view>
				</view>
			</view>
			<view class="bottom-wrap">
				<!-- 显示状态组 -->
				<view class="statusBar-box">
					<text class="lable">咨询中</text>
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
		props:['timer','stra','strb'],
		data() {
			return {
				
			}
		},
		
		methods: {
			//收起软电话
			changeClose(){
				this.$emit('close')
			},
			
			//转接
			Finishtransfer(){
				socketMain.finishTransfer(this.stra,this.strb)
			}, 
			
			//结束咨询
			cancel(){
				var self = this
				socketMain.end(this.strb,function(){
					self.$emit("funa",8);
				})
			},
			
			//会议
			Finishconference(){
				socketMain.finishConference(this.stra,this.strb)
			}
		}


	}
</script>

<style lang="less">

</style>




