<template>
		
		<view>
			<view class="bottom-wrap">
				<!-- 显示状态组 -->
				<view class="statusBar-box">
					<text class="lable">签入中</text>
					<view class="line"></view>
					<view>{{ timer }}</view>
				</view>
				<view class="divide"></view>
				<view class="iconfont pickUp" @click="changeClose">&#xe6de;</view>
			</view>
		</view>
</template>

<script>
	export default {
		props:['timer'],
		data() {
			return {

			}
		},
		
		methods: {
			changeClose(){
				this.$emit('close')
			},
		}


	}
</script>

<style lang="less">

</style>


