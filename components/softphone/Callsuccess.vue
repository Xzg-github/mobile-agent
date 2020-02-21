<template>
		<view>
			<!-- 按钮组 -->
			<view class="top-wrap">
				<view class="callIn-box">
					<view class="btn" hover-class="active" @click="Hold">
						<view class="iconfont icon">&#xe715;</view>
						<view>保持</view>
					</view>
					<view class="btn" hover-class="active" @click="showPop('1')">
						<view class="iconfont icon">&#xe60c;</view>
						<view>转接</view>
					</view>
					<view class="btn" hover-class="active" @click="Hangup">
						<view class="iconfont icon">&#xe705;</view>
						<view>挂断</view>
					</view>
				</view>
			</view>
			<view class="bottom-wrap">
				<!-- 显示状态组 -->
				<view class="statusBar-box">
					<text class="lable">通话中</text>
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
			<!-- 咨询 、转接弹窗 -->
			<view class="popUp" v-if="pop == 1">
				<view class="inner">
					<view class="close" @click="close">
						<view class="iconfont">&#xe6c3;</view>
					</view>
					<text class="title">转接</text>
					<view class="nav">
						<view :class='["nav-item",state=="A" ? "active" : ""]' @click="changeNav('A')">
							<text>按坐席</text>
						</view>
						<view :class='["nav-item",state=="C" ? "active" : ""]' @click="changeNav('C')">
							<text>按外部号码</text>
						</view>
					</view>
					<view class='bottom'>
						<view v-if="state=='A'">
							<form bindsubmit="search">
								<view class="ipt-box">
									<image class="search-img" src="../../static/images/search.png"></image>
									<input class="itp" type="text" v-model="query" @confirm="getMsg()" confirm-type="search" placeholder="请输入" />
								</view>
							</form>
							<!-- 在线坐席列表 -->
							<view class="onlineWrap">
								<view class="infoTit">
									<view>坐席姓名</view>
									<view>坐席工号</view>
									<view>坐席分机</view>
								</view>
								<scroll-view class="scroll" scroll-y>
									<vie v-if="infoArr != ''">
										<view class="infoBox" v-for="(list,index) in infoArr" v-if="list.agentId != uerInfo.username" :key="index">
											<view class="left">{{ list.agentName }}</view>
											<view class="middle">{{ list.agentId }}</view>
											<view class="right" @click="blindtransfer(list.phoneNo)">{{ list.phoneNo }}</view>
										</view>
									</vie>
									<view class="tip" v-else>暂无在线坐席</view>
								</scroll-view>
							</view>
						</view>
						<view v-if="state == 'C'">
							<form bindsubmit="search">
								<view class="ipt-box">
									<image class="search-img" src="../../static/images/search.png"></image>
									<input class="itp" type="number" v-model="phoneData" placeholder="请输入外部号码" />
								</view>
							</form>
							<view class="fix" hover-class="hover" @click="blindtransfer(phoneData)">转接</view>
						</view>
					</view>
				</view>
			</view>
		</view>
</template>

<script>
	import socketYatai from "@/components/softphone/config/socket/yatai";
	import socketMain from "@/components/softphone/config/socket/main";
	import common from "@/components/softphone/config/common";
	import api from "@/components/softphone/config/api";
	import {  mapState,  mapMutations  } from 'vuex';
	
	export default {
		props:['timer','stra','strb'],
		computed: mapState(['hasLogin','uerInfo']),
		data() {
			return {
				state :'A', //A转接在线坐席 C转接手机号码
				phoneData:'', //输入的外部号码
				newPhoneNum:'', //外地手机加0
				pop:0,
				query:'', //搜索框的值
				ajaxInfoArr:[], //筛选在线坐席列表的变量 
				infoArr:[], //在线坐席列表
			}
		},
		
		mounted: function(){
			this.getInfo() //获取在先坐席分机
		},
		
		methods: {
			
			//关键字筛选
			getMsg(){
				var self = this
				var text = this.query //输入框的值
				var length = text.length; //输入框值的长度
				var arr = this.ajaxInfoArr 
				var temp = []
				for (var i = 0; i < arr.length; i++) {
					if(arr[i].agentId.toString().indexOf(text) != -1
						||arr[i].agentName.indexOf(text) != -1
							||arr[i].phoneNo.indexOf(text) != -1
					){
						temp.push(arr[i]) //重新赋值 
					}
				}
				self.infoArr = temp
			},
			
			//获取在线坐席分机
			getInfo(){
				var self = this
				api.getInfoAjax(self.apiDomian,self.uerInfo.token,function(data){
					self.ajaxInfoArr = data[1].data.data
					self.infoArr = data[1].data.data
				})
			},
			
			// 切换导航
			changeNav(val) {
				this.state = val
			},
			
			//收起软电话
			changeClose(){
				this.$emit('close')
			},
			//显示弹窗
			showPop(){
				this.pop = 1
			},
			//关闭弹窗
			close(){
				this.pop = 0
			},
			
			//保持通话
			Hold(){
				socketMain.hold(this.stra)
			},
			
			//挂断通话
			Hangup(){
				socketMain.hangUp(this.stra)
			},
			
			//盲转接
			blindtransfer(key){
				var self = this
				//判断手机号格式
				self.phoneData = self.phoneData.replace(/\s/g, "")
				var phoneFlag = common.checkPhone(self.phoneData)
				if(!phoneFlag){
					return false
				}
				if(key.length > 5){
					async function blindtransferAjax () {
						//异地号码前加0 （9固定写）例9018575663545
						var dial = await api.getDialNumber(self.phoneData,self.uerInfo.areaCode,self.apiDomian,self.uerInfo.token)
						var phoneNum = '9'+dial[1].data.data
						self.newPhoneNum = phoneNum
						socketMain.blindTransfer(self.newPhoneNum)
					}
					blindtransferAjax()
					
				}else if (key.length == 0){
					uni.showToast({
					    title: '请输入手机号码',
					    duration: 2000,
						icon: 'none'
					});
				}else {
					socketMain.blindTransfer(key)
				}
				
			}
		}
	}
</script>

<style lang="less">

</style>


