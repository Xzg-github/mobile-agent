<template>
		
		<view>
			<!-- 按钮组 -->
			<view class="top-wrap">
				<view class="btn" hover-class="active" @click="end">
					<view class="iconfont icon">&#xe620;</view>
					<view>结束</view>
				</view>
			</view>
			<view class="bottom-wrap">
				<!-- 显示状态组 -->
				<view class="statusBar-box">
					<text class="lable">后处理</text>
					<view class="line"></view>
					<view>{{ timer }}</view>
				</view>
				<view class="btn2">
					<picker mode="selector" @change="Agentauxwork" :value="selectIndex" :range="selectArr" range-key="name">
						<view>示忙<text class="iconfont busyImg">&#xe74c;</text></view>
					</picker>
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
			
			//结束后处理
			end(){
				var self = this
				socketMain.afterTreatment(function(){
					self.$emit('funb')
				})
				
			}
		}
	}
</script>

<style lang="less">

</style>



