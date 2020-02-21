<template>
	<view>
		<view class="bottom-wrap">
			<!-- 显示状态组 -->
			<view class="statusBar-box">
				<view class="lable">
					<text>示忙中</text>
					<text v-if="leftval">({{ leftval }})</text>
				</view> 
				<view class="line"></view>
				<view>{{ timer }}</view>
			</view>
			<view class="btn2">
				<view @click="Agentavailable">
					<view>示闲 <text class="iconfont freeImg">&#xe733;</text></view>
				</view>
			</view>
			<view class="divide"></view>
			<view class="iconfont pickUp" @click="changeClose">&#xe6de;</view>
		</view>
	</view>
</template>

<script>
	//import socketYatai from "@/components/softphone/config/socket/yatai";
	import socketMain from "@/components/softphone/config/socket/main";
	var socketApi;
	
	export default {
		props:['timer','leftval'],
		data() {
			return {
			
			}
		},

		mounted() {
		},
		
		methods: {
			changeClose(){
				this.$emit('close')
			},
			
			//点击示闲
			Agentavailable(){
				socketMain.agentavailable() 
			},
		}


	}
</script>

<style lang="less">

</style>

