<template>
		
		<view>
			<!-- 按钮组 -->
			<view class="top-wrap">
				<view class="btn" hover-class="active" @click="changeEnter">
					<view class="iconfont icon">&#xe620;</view>
					<view>签入</view>
				</view>
			</view>
			<view class="bottom-wrap">
				<!-- 显示状态组 -->
				<view class="statusBar-box">
					<view style="display: flex;">
						<text class="lable">未签入</text>
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
	import {  mapState,  mapMutations  } from 'vuex';
	export default {
		props:['timer'],
		// 提取存储数据
		computed: mapState(['hasLogin', 'uerInfo']),
		data() {
			return {

			}
		},

		
		methods: {
			changeClose(){
				this.$emit('close')
			},
			
			//签入
			changeEnter(){
				//socketYatai.login()
				socketMain.login()
			}
		}
	}
</script>

<style lang="less">

</style>


