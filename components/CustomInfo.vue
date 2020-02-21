<template>
	<view>
		<view v-if="title =='U'" class="list_box">
			<view class="main-wrap" hover-class="active" v-for="(item,index) in customData" :key="index" @click="goNext(item)">
				<view class="item">
					<text class="attribute">客户姓名：</text>
					<text class="clickable">{{ item.customerName }}</text>
				</view>
				<view class="item">
					<text class="attribute">所属活动：</text>
					<text>{{ item.campaignName }}</text>
				</view>
				<view class="item">
					<text class="attribute">批次：</text>
					<text>{{ item.batchId }}</text>
				</view>
			</view>
			<!-- <view class="noneDate" v-if="customData == ''">暂无相关数据</view> -->
		</view>
		
		<view  v-else-if="title =='H'" class="list_box">
			<view class="main-wrap" hover-class="active" v-for="(item,index) in customData" :key="index" @click="goNext(item)">
				<view class="item">
					<text class="attribute">客户姓名：</text>
					<text class="clickable">{{ item.customerName }}</text>
				</view>
				<view class="item">
					<text class="attribute">联系状态：</text>
					<text>{{ item.connectStatus=='Y'? '已接通' : '未接通' }}</text>
				</view>
				<view class="item">
					<text class="attribute">预约时间：</text>
					<text>{{ item.orderTime }}</text>
				</view>
			</view>
			<!-- <view class="noneDate" v-if="customData == ''">暂无相关数据</view> -->
		</view>
		
		<view  v-else-if="title =='P'" class="list_box">
			<view class="main-wrap" hover-class="active" v-for="(item,index) in customData" :key="index" @click="goNext(item)">
				<view class="item">
					<text class="attribute">客户姓名：</text>
					<text class="clickable">{{ item.customerName }}</text>
				</view>
				<view class="item">
					<text class="attribute">联系状态：</text>
					<text>{{ item.connectStatus=='Y'? '已接通' : '未接通' }}</text>
				</view>
				<view class="item">
					<text class="attribute">服务结果：</text>
					<text>{{ item.serviceResult1 }}</text>
					<text v-if='item.serviceResult2 != null'>/{{ item.serviceResult2 }}</text>
					<text v-if='item.serviceResult3 != null'>/{{ item.serviceResult3 }}</text>
				</view>
				<view class="item">
					<text class="attribute">上次联系时间：</text>
					<text>{{ item.lastConnectTime }}</text>
				</view>
			</view>
			<!-- <view class="noneDate" v-if="customData == ''">暂无相关数据</view> -->
		</view>
	</view>
	
</template>

<script>
	import {  mapState,  mapMutations  } from 'vuex'
	
	export default {
		
		// 父级传值子级
		props:["title","customData"],
		
		data() {
			return {
				questionnaireId: '',
				serviceType:''
			}
		},
		onLoad() {
			
		},
		// 提取存储数据
		computed: mapState(['hasLogin','uerInfo']), 
		
		methods: {
			
			// 获取活动信息
			// goNext(key,id,phone1){
				goNext(key){
				var self = this
				// 电话号码6个的情况
				// var customArr = []
				// customArr[0] = self.customData[index].phone1
				// customArr[1] = self.customData[index].phone2
				// customArr[2] = self.customData[index].phone3
				// customArr[3] = self.customData[index].phone4
				// customArr[4] = self.customData[index].phone5
				// customArr[5] = self.customData[index].phone6
				// customArr = customArr.filter(Boolean)
				// customArr = customArr.join(',')
				//this.$emit("passtoparent", customArr);
				console.log(key)
				uni.request({
				    method: 'GET',
				    url: this.apiDomian+'/campaign/'+key.campaignId,  
				    data: {},
				    header: {
				        'content-type': 'application/json',
						'Authorization': 'Arch6WithCloud '+self.uerInfo.token
				    }
				})
				.then((data) => {
					var obj = data[1].data.data
					self.questionnaireId = obj.questionnaireId
					self.serviceType = obj.serviceType
					uni.navigateTo({
						url: '/pages/home/roster/callOut?campaignId='+key.campaignId+'&id='+key.id+'&phone='+key.phone1+'&batchId='+key.batchId+'&customerName='+key.customerName+'&customerCode='+key.customerCode+'&questionnaireId='+self.questionnaireId+'&serviceType='+self.serviceType
					})
				})
			}
		}
	}
</script>

<style lang="less">
	.list_box {
		padding-bottom: 100upx;
	}
	.main-wrap {
		margin-bottom: 20upx;
		background: #fff;
		padding: 20upx 30upx;
		font-size: 28upx;
		line-height: 52upx;
		
		.item {
			display: flex;
		}
		
		.attribute {
			display: block;
			width: 200upx;
			color: #666;
		}
		
		.clickable {
			color: #007AFF;
		}
	}
	
	
	.active {
		background: #ECECEC;
	}
</style>


