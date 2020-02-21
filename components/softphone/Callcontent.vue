<template>
		
		<view>
			<!-- 按钮组 -->
			<view class="top-wrap" v-if="!strc">
				<view class="btn" hover-class="active" @click="Hangup">
					<view class="iconfont icon">&#xe705;</view>
					<view>挂断</view>
				</view>
			</view>
			<view class="bottom-wrap">
				<!-- 显示状态组 -->
				<view class="statusBar-box">
					<text class="lable">连接中</text>
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
	import socketYatai from "@/components/softphone/config/socket/yatai";
	export default {
		props:['timer','stra','strb','strc'],
		data() {
			return {
			}
		},

		
		methods: {
			changeClose(){
				this.$emit('close')
			},
			
			//外呼挂断
			Hangup(){
				socketYatai.hangUp(this.stra)
			}
		}


	}
</script>

<style lang="less">

</style>


