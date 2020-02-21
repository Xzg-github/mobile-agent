<template>
		
		<view>
			<!-- 按钮组 -->
			<view class="top-wrap">
				<view class="btn" hover-class="active" @click="Hangup">
					<view class="iconfont icon">&#xe705;</view>
					<view>挂断</view>
				</view>
			</view>
			<view class="bottom-wrap">
				<!-- 显示状态组 -->
				<view class="statusBar-box">
					<text class="lable">振铃中</text>
					<view style="display: flex; align-items: center;">
						<view class="line"></view>
						<view>{{ strb }}</view>
					</view>
					<view class="line"></view>
					<view>{{ timer }}</view>
				</view>
				<view class="divide"></view>
				<view class="iconfont pickUp" @click="changeClose">&#xe6de;</view>
			</view>
		</view>
</template>

<script>
	import socketMain from "@/components/softphone/config/socket/main";
	export default {
		props:['timer','stra','strb'],
		data() {
			return {
				// phoneNum:'15875998451',
			}
		},
		
		methods: {
			changeClose(){
				this.$emit('close')
			},
			
			//挂断外呼
			Hangup(){
				var self = this
				socketMain.hangOff(this.stra,function(){
					self.$emit("func",true);
				})
			}
		}
	}
</script>

<style lang="less">

</style>


