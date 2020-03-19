<template>
		
		<view>
			<!-- 按钮组 -->
			<view class="top-wrap">
				<view @tap="call">
					<view class="iconfont btn btnImg">&#xe647;</view>
				</view>
			</view>
			<view class="bottom-wrap">
				<!-- 显示状态组 -->
				<view class="statusBar-box">
					<view style="display: flex;">
						<text class="lable">暂放中</text>
					</view>
					<view class="line"></view>
					<view>{{ timer }}</view>
				</view>
				<view class="btn2">
					<view @tap="Agentavailable">
						<view>示闲 <text class="iconfont freeImg">&#xe733;</text></view>
					</view>
				</view>
				<view class="divide"></view>
				<view class="iconfont pickUp" @tap="changeClose">&#xe6de;</view>
			</view>
			
			<!-- 打电话弹窗 -->
			<view class="popUp" v-if="pop == 1">
				<view class="inner">
					<view class="close" @tap="close">
						<view class="iconfont">&#xe6c3;</view>
					</view>
					<view class="valueBox">
						<input class="ipt" type="number" v-model="num" maxlength="15">
					</view>
					<view class="num-wrap">
						<view v-for="(list, index) in NumArr" :key="index">
							<view class="item" hover-class="itemActive" @tap="addNum(list)">{{ list }}</view>
						</view>
					</view>
					<view style="position: relative;">
						<view class="item phone-box" hover-class="callActive" @tap="makecall">
							<view class="iconfont phone">&#xe647;</view>
						</view>
						<view class="iconfont delete" v-if="num" @tap="deleteNum">&#xe698;</view>
					</view>
				</view>
			</view>
		</view>
</template>

<script>
	//import socketYatai from "@/components/softphone/config/socket/yatai";
	import socketMain from "@/components/softphone/config/socket/main";
	import common from "@/components/softphone/config/common";
	import api from "@/components/softphone/config/api";
	import {  mapState,  mapMutations  } from 'vuex';
	
	export default {
		props:['timer'],
		
		// 提取存储数据
		computed: mapState(['hasLogin','uerInfo']),  
		
		data() {
			return {
				pop: '',
				NumArr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0], //拨号号码
				num: '', //拨号输入的值
				newPhoneNum: '',//加了90后的号码
				province:'', //省份
				city:'' ,//城市
				callPhoneFlag:false//拨号的弹窗，避免跟呼入弹窗冲突
			}
		},

		mounted() {
			
		},
		
		methods: {
			
			changeClose(){
				this.$emit('close')
			},
			// 打电话弹窗
			call() {
				this.pop = 1
			},
			
			// 点击号码
			addNum(key) {
				this.num = (this.num + key).replace(/\s/g, "");
				this.num = this.num.substring(0, 3) + ' ' + this.num.substring(3, 7) + ' ' + this.num.substring(7, 11);//电话号码输入格式3-4-4
			},
			
			// 关闭弹窗
			close() {
				this.pop = 0
			},
			
			// 删除号码
			deleteNum() {
				var num = this.num.replace(/\s/g, "")
				num = num.substring(0, num.length - 1)
				this.num = num.substring(0, 3) + ' ' + num.substring(3, 7) + ' ' + num.substring(7, 11);//电话号码输入格式3-4-4
			},
			
			
			// 打电话 
			makecall(){
				
				var self = this
				self.callPhoneFlag = true //拨号的弹窗，避免跟呼入弹窗冲突
				self.$emit("funb", self.callPhoneFlag);
				
				if(self.num.length > 7){
					// 判断手机号格式
					self.num = self.num.replace(/\s/g, "")
					var phoneFlag = common.checkPhone(self.num)
					if(!phoneFlag){
						return false
					}
					async function makeCall () {
						// 获取归属地
						await api.getPhoneCode(self.apiDomian,self.uerInfo.token,self.num,function(data){
							var region = data[1].data.data
							self.city = region.city
							self.province = region.province
						})
						//异地号码前加0 （9固定写）例9018575663545
						var dial = await api.getDialNumber(self.num,self.uerInfo.areaCode,self.apiDomian,self.uerInfo.token)
						var phoneNum = '9'+dial[1].data.data
						self.newPhoneNum = phoneNum
						var funa_obj = {
							num: self.num,
							city: self.city,
							province: self.province
						}
						self.$emit("funa", funa_obj);
						
						// 拨打电话
						await socketMain.makecall(phoneNum,self.num)
					}
					makeCall()
					
				}else {
					var funa_obj = {
						num: self.num.replace(/\s/g, ""),
						city: '暂无',
						province: '暂无'
					}
					self.$emit("funa", funa_obj);
					var mun = self.num.replace(/\s/g, "")
					socketMain.makecall(mun)
				}

				this.pop = 0   // 关闭拨号界面
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


