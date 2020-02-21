<template>
	<view>
		<view class="screen">
			<form bindsubmit="search">
				<view class="ipt-box">
					<picker class="pk" mode="selector" @change="bindPickerChange" :value="moldIndex" :range="moldArray">
						<text class="option">{{ moldArray[moldIndex] }}</text>
						<view class="pk-icon">
							<text class="iconfont">&#xe662;</text>
							<text class="line"></text>
						</view>
					</picker>
					<image class="search-img" src="../../../static/images/search.png"></image>
					<input class="itp" type="text" placeholder="请输入相应的内容" />
				</view>
				<view class="s-bottom">
					<view class="btm-item">
						<picker class="list" @change="bindPickerType" :value="typeIndex" range-key="name" :range="typeArray">
							<text>{{ typeArray[typeIndex].name || '工单类型' }} </text>
							<text class="iconfont icon">&#xe662;</text>
						</picker>
					</view>
					<view class="btm-item">
						<picker class="list" mode="date" :value="date" start="2015-09-01" end="2028-09-01" @change="bindDateChange">
							<text>{{date}}</text>
							<text class="iconfont icon">&#xe662;</text>
						</picker>
					</view>
				</view>
			</form>
			<view>
				<view class="round xs-round"></view>
				<view class="round big-round"></view>
				<view class="iconfont tit-icon">&#xe619;</view>
			</view>
		</view>
		<view class="content">
			<navigator class="list-wrap" url="details">
				<view class="list-body">
					<view class="list-title">
						<view style="display: flex;">
							<view class="item-tit" style="display: flex;">
								<text class="iconfont" style="color: #63A35C; font-size: 36upx;">&#xe61f;</text>
								<view>工单号</view>
							</view>
							<text>2018200186</text>
						</view>
						<view style="color: #EE9900;">审批中</view>
					</view>
					<view style="display: flex;">
						<view class="item-tit">联系人</view>
						<text style="color: #007AFF;">张三</text>
						<text style="margin-left: 20upx;">13878556451</text>
					</view>
					<view style="display: flex;">
						<view class="item-tit">受理人</view>
						<text>李四</text>
					</view>
					<view style="display: flex;">
						<view class="item-tit">工单类型</view>
						<text>承保类</text>
					</view>

					<view style="display: flex;">
						<view class="item-tit">创建时间</view>
						<text>2019-08-23 09:31:17</text>
					</view>
				</view>
			</navigator>
		</view>
		<navigator url="newForm">
			<view class="iconfont build-btn">&#xe609;</view>
		</navigator>
	</view>
</template>

<script>
	export default {
		components :{
			
		},
		data() {
			return {
				moldIndex: '0',
				moldArray: ['工单号', '联系人', '联系人电话','业务号','工单类型','状态','受理人','受理时间'],
				typeIndex: ' ',
				typeArray: [
					{
						id: '',
						name: '全部'
					},
					{
						id: 0,
						name: '承保类'
					},
					{
						id: 1,
						name: '待处理报案'
					},
					{
						id: 2,
						name: '电销类'
					},
					{
						id: 3,
						name: '救援反馈'
					},
				],
				stateIndex: ' ',
				stateArray: ['承保类', '待处理报案', '电销类', '救援反馈'], //状态
				date: '受理时间',
			}
		},
		
		onLoad() {

		},
		methods: {
			// 选择输入框的字段名称
			bindPickerChange(e) {
				this.moldIndex = e.detail.value
			},
			
			// 工单类型选项
			bindPickerType(e) {
				this.typeIndex = e.detail.value
			},
			
			// 状态
			bindPickerState(e) {
				this.stateIndex = e.detail.value
			},
			
			// 选择日期
			bindDateChange(e) {
				this.date = e.detail.value
			}
		}

		
	}
</script>

<style lang="less">
	body {
		background: #f7f6f9;
	}

	.iconfont {
		margin-left: 10upx;
		font-size: 24upx;
		padding-right: 10upx;
		color: #9b9b9b;
	}
	
	.icon {
		margin-left: 14upx;
	}
	.screen {
		position: relative;
		background: #4a85d3;
		margin-bottom: 20upx;
		padding-top: 70upx;
		border-top: 2upx solid #ccc;
		overflow: hidden;
	
		.ipt-box {
			margin: 0upx 30upx;
			display: flex;
			align-items: center;
			height: 70upx;
			border: 1upx solid #ccc;
			border-radius: 10upx;
			font-size: 29upx;
			background: #fff;
			position: relative;
			z-index: 99;

	
			.pk {
				position: relative;
				width: 28%;
				padding: 0 20upx;
	
				.option {
					color: #666;
				}
				
				.pk-icon {
					position: absolute;
					right: 0;
					top: 3upx;
				}
				
				.line {
					padding-left: 10upx;
					border-right: 2upx solid #969896;
				}
			}
	
			.itp {
				flex: 1;
			}
			
			.search-img {
				margin: 0 20upx;
				width: 34upx;
				height: 34upx;
			}
	
		}
		
		.round {
			position: absolute;
			background: #fff;
		}
		
		.xs-round {
			right: 200upx;
			top: 40upx;
			width: 40upx;
			height: 40upx;
			border-radius: 50%;
			opacity: 0.3;
		}
		
		.big-round {
			right: -50upx;
			top: -20upx;
			width: 150upx;
			height: 150upx;
			border-radius: 50%;
			opacity: 0.3;
			z-index: 0;
		}
		
		.tit-icon {
			position: absolute;
			top:18upx;
			left: 20upx;
			font-size: 90upx;
			color: #fff;
			opacity: 0.8;
		}
		.s-bottom {
			margin-top: 30upx;
			padding: 20upx 0;
			display: flex;
			background: #fff;
			border-bottom: 2upx solid #ccc;
			font-size: 28upx;
	
			.btm-item {
				flex: 1;
				color: #555;
				text-align: center;
				font-weight: bold;
				
			}

		}
	}

	
	.list-wrap {
		padding: 0 30upx;
		margin-top: 20upx;
		border-radius: 14upx;
		background: #fff;
		
		.list-title {
			padding-bottom: 20upx;
			display: flex;
			justify-content: space-between;
			
			.list-left {
				width: 20%;
			}

			.state {
				color: #55A532;
			}
		}
		
		.list-body {
			padding: 18upx 0;
			line-height: 50upx;
			font-size: 28upx;
			
			.item-tit {
				width: 140upx;
				color: #666;
				margin-right: 34upx;
				text-align: right;
			}
		}
	}
	.build-btn {
		position: fixed;
		bottom: 90upx;
		left: 50%;
		margin-left: -80upx;
		color: #4a85d3;
		font-size: 160upx;
	}
</style>

