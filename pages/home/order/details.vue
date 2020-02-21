<template>
	<view class="content">
		<view class="main-wrap">
			<view class="title">
				<view class="tit-text"></view>
				<text>基本信息</text>
			</view>
			<view class="attributes">
				<view class="list"><text>工单号：</text>201855224545</view>
				<view class="list"><text>业务号：</text>201855224545</view>
				<view class="list"><text>业务类型：</text>保险类</view>
				<view class="list"><text>联系人：</text>张三</view>
				<view class="list"><text>联系人电话：</text>18585454565</view>
				<view class="list"><text>工单类型：</text>紧急</view>
				<view class="list"><text>工单来源：</text>官网</view>
				<view class="list"><text>同被保人关系：</text>亲戚</view>
				<view class="list"><text>投诉类型：</text>(工单类型为投诉时展示)</view>
				<view class="list"><text>投诉对象：</text>(工单类型为投诉时展示)</view>
				<view class="list"><text>工单事由：</text>因为某某原因所以要什么什么</view>
				<view class="list"><text>受理时间：</text>2018-16-11</view>
				<view class="list"><text>受理人：</text>李四</view>
			</view>
		</view>
		<view class="main-wrap">
			<view class="title">
				<view class="tit-text"></view>
				<text>处理记录</text>
			</view>
			<view class="attributes">
				<view class="list"><text>处理人：</text>张三</view>
				<view class="list"><text>处理时间：</text>2019-08-23 09:31:17</view>
				<view class="list"><text>处理任务：</text>待跟进</view>
				<view class="list"><text>处理意见：</text>已完成</view>
				<view class="list"><text>处理状态：</text>已处理</view>
			</view>
		</view>
		<view class="main-wrap">
			<view class="title">
				<view class="tit-text"></view>
				<text>催办记录</text>
			</view>
			<view class="attributes">
				<view class="list"><text>催办人：</text>张三</view>
				<view class="list"><text>催办时间：</text>2019-08-23 09:31:17</view>
				<view class="list"><text>内容：</text>官网</view>
				<form @submit="formSubmit">
					<view  v-if="show == 'B'">
						<textarea class="inputBox" @blur="bindTextBlur" placeholder="请输入催办内容"></textarea>
						<button class="btn" formType="submit">提交</button>
					</view>
				</form>
				<button v-if="show == 'A'" class="btn" @click="urge" >催办</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
	
		data() {
			return {
				show: 'A',
				urgeText:'',
			}
		},
		
		onLoad() {
			
		},
		methods: {
			
			// 点击催办
			urge(){
				this.show = 'B'
			},
			
			// 获取催办内容
			bindTextBlur(e) {
				this.urgeText = e.detail.value
			},
			
			//提交催办内容
			formSubmit (){
				uni.request({
				    method: 'GET',
				    // url: this.apiDomian+'/dictionary/useable', 
				    data: {
						urgeText: this.urgeText,
					},
				    header: {
				        'content-type': 'application/json',
				    }
				    
				})
				.then((data) => {
				
				})
			},
			

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
		font-size: 29upx;
	
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
			
			.inputBox {
				margin: 30upx 0;
				border: 1upx solid #ccc;
				width: 100%;
				height: 120upx;
			}
		}
		
		.btn {
			padding: 0;
			background: #4a85d3;
			color: #fff;
			margin-top: 40upx;
		}
	}
</style>

