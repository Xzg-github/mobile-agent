
<template>
		<view>
			<view class="top-wrap">
				<!-- <Login></Login> -->
				<view class="btn" hover-class="active" @click="Agentlogout">
					<view class="iconfont icon">&#xe60b;</view>
					<view>签出</view>
				</view>
			</view>
			<view class="bottom-wrap">
				<!-- 显示状态组 -->
				<view class="statusBar-box">
					<view class="lable">
						<text class="lable">示闲中</text>
					</view>
					<view class="line"></view>
					<view>{{ timer }}</view>
				</view>
				<view class="btn2">
					<view>
						<picker mode="selector" @change="Agentauxwork" :value="selectIndex" :range="selectArr" range-key="name">
							<view>示忙<text class="iconfont busyImg">&#xe74c;</text></view>
						</picker>
					</view>
				</view>
				<view class="divide"></view>
				<view class="iconfont pickUp" @click="changeClose">&#xe6de;</view>
			</view>
		</view>
</template>

<script>
	import socketMain from "@/components/softphone/config/socket/main";
	export default {
		props:['timer'],
		data() {
			return {
				selectIndex: '', //示忙下拉选项
				selectArr: [],
			}
		},

		mounted(){
			//获取数据字典
			var self = this
			uni.getStorage({
				key: 'allDate',
				success: function(res) {
					if (res.data) {
						self.allDate = res.data
						// 获取对应下拉框的数据
						self.allDate.forEach(function(rs) {
							if (rs.classify == 'busy.reason') {
								self.selectArr.push(self.getItemData(rs))
							}
						});
			
					}
				}
			})
		},
		
		methods: {
			
			//获取数据字典相应的值
			getItemData(rs) {
				var dataObj = {}
				dataObj.name = rs.dataValue
				dataObj.id = rs.dataKey
				return dataObj
			},
			
			//收起软电话
			changeClose(){
				this.$emit('close')
			},
			
			// 示忙状态下拉选择
			Agentauxwork(e) {
				var self = this
				self.selectIndex = e.target.value
				
				var selArr = self.selectArr[self.selectIndex]
				
				socketMain.agentAuxwork(selArr.id,function(){
					if(selArr.id == '0'){
						self.$emit("funa", 4, ''); //显示拨号
					}
					else{
						self.$emit("funa", 2, selArr.name); //显示状态
					}
				})
			},
			
			//签出
			Agentlogout(){
				var self = this
				socketMain.agentLogout(function(){
					self.$emit("funb", 1)
				})
			}
		}


	}
</script>

<style lang="less">

</style>


