<template>
		
		<view>
			<!-- 按钮组 -->
			<view class="top-wrap">
				<view class="btn" hover-class="active" @click="Answer">
					<view class="iconfont icon">&#xe647;</view>
					<view>接听</view>
				</view>
			</view>
			<view class="bottom-wrap">
				<!-- 显示状态组 -->
				<view class="statusBar-box">
					<text class="lable">振铃中</text>
					<view style="display: flex; align-items: center;">
						<view class="line"></view>
						<view>{{ stra }}</view>
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
	//import socketYatai from "@/components/softphone/config/socket/yatai";
	import socketMain from "@/components/softphone/config/socket/main";
	export default {
		props:['stra','strb','timer'],
		data() {
			return {
				
			}
		},
		
		methods: {
			changeClose(){
				this.$emit('close')
			},
			
			//接听
			Answer(){
				socketMain.answer(this.strb)
			}
		}
	}
</script>

<style lang="less">

</style>



