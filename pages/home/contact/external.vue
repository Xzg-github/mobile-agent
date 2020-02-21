<template>
	<view class="content">
		<News></News>
		<view class="main-wrap">
			<view class="title">
				<view class="tit-text"></view>
				<text>联络信息</text>
			</view>
			<view class="attributes">
				<view class="list"><text>客户号码：</text>{{ getDate.clientPhoneNo || '暂无' }}</view>
				<view class="list"><text>客户姓名：</text>{{ getDate.clientName || '暂无' }}</view>
				<view class="list"><text>呼叫方向：</text>{{ getDate.callDirection == 0 ? '呼出' : '呼入'}}</view>
				<view class="list"><text>坐席姓名：</text>{{ getDate.agentName || '暂无' }}</view>
				<view class="list"><text>坐席工号：</text>{{ getDate.agentId || '暂无' }}</view>
				<view class="list"><text>坐席分机号：</text>{{ getDate.extensionNumber || '暂无' }}</view>
				<view class="list"><text>通话时间：</text>{{ getDate.startDate || '暂无' }}</view>
				<view class="list"><text>通话时长：</text>{{ getDate.timeLength || '暂无' }}</view>
				
			</view>
		</view>
		<view class="main-wrap"> 
			<view class="title">
				<view class="tit-text"></view>
				<text>服务小结</text>
			</view>
			<view class="attributes">
				<view class="list"><text>服务类型：</text>
				{{ getDate.dealName || '暂无' }}
				</view>
				<view class="list"><text>服务小结：</text>
				{{ getDate.remark || '暂无' }}
				</view>
			</view>
		</view>
		<view class="main-wrap">
			<view class="title">
				<view class="tit-text"></view>
				<text>客户信息</text>
			</view>
			<view class="attributes" v-if="infoArr">
				<view class="list"><text>客户姓名：</text>{{ infoArr.clientName || '暂无' }}</view>
				<view class="list"><text>客户身份：</text>{{ infoArr.sourceName || '暂无' }}</view>
				<view class="list"><text>等级：</text>{{ infoArr.groupName || '暂无' }}</view>
				<view class="list"><text>客户ID：</text>{{ infoArr.clientId || '暂无' }}</view>
				<view class="list"><text>联系电话：</text>{{ infoArr.phone || '暂无' }}</view>
				<view class="list"><text>创建时间：</text>{{ infoArr.updatetime || '暂无' }}</view>
			</view>
			<view class="attributes" v-else>
				<view style="padding: 30upx 0;">暂无客户信息</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {  mapState,  mapMutations  } from 'vuex';
	import News from "@/components/News.vue";
	export default {
		components: {
			News
		},
		// 提取存储数据
		computed: mapState(['hasLogin','uerInfo']), 
		
		data() {
			return {
				getDate: { },
				clientPhoneNo:'',
				infoArr:{}
			}
		},
		
		onLoad(options) { 
			this.clientPhoneNo = options.phone
			// 获取数据
			var self = this
			uni.getStorage({
				key: 'obj',
				success: function(res) {
					self.getDate = res.data;
				}
			})
			//获取客户信息
			uni.request({
			    method: 'GET',
			    url: this.apiDomian+'/customer/list/'+this.clientPhoneNo, 
			    header: {
			        'content-type': 'application/json',
					'Authorization': 'Arch6WithCloud '+self.uerInfo.token
			    }
			    
			})  
			.then((data) => {
				console.log(data)
				if(data[1].data.data){
					this.infoArr= data[1].data.data[0]
				}
			})

		},
		
		methods: {
			

		}
	}
</script>

<style lang="less">
	body {
		background: #f7f6f9;
	}
	.content {
		padding-bottom: 100upx;
	}
	.main-wrap {
		margin-bottom: 30upx;
		background: #fff;
		padding: 30upx 0;
		font-size: 28upx;
	
		.title {
			display: flex;
			align-items: center;
			font-size: 34upx;
			font-weight: bold;
			padding: 0 0 26upx 40upx;
			border-bottom: 1upx solid #ccc;
			
			.tit-text {
				width: 5upx;
				border-radius: 4upx;
				margin-right: 20upx;
				background: #4a85d3;
				height: 30upx;
			}
		}
		
		.attributes {
			padding: 0 40upx;
			color: #000;
			
			.list {
				padding: 13upx 0;
				justify-content: space-between;
				display: flex;
				
				text {
					color: #666;
				}
			}
			
		}

	}
</style>

