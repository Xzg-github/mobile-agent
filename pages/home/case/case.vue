<template>
	<view>
		<view class="screen">
			<form bindsubmit="search">
				<view class="ipt-box">
					<picker class="pk" mode="selector" @change="bindPickerChange" :value="moldIndex" range-key="name" :range="moldArray">
						<view>
							<text class="option">{{ moldArray[moldIndex].name }}</text>
							<view class="pk-icon">
								<text class="iconfont">&#xe662;</text>
								<text class="line"></text>
							</view>
						</view>
					</picker>
					<image class="search-img" src="../../../static/images/search.png"></image>
					<input class="itp" type="text" placeholder="请输入相应的内容" />
				</view>
				<view class="s-bottom">
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
				<view class="iconfont tit-icon">&#xe604;</view>
			</view>
		</view>	
		<view class="content-wrap">
			<navigator class="list-wrap" url="##">
				<view class="list-body">
					<view class="list-title" style="border-bottom: 1upx solid #eee;">
						<view style="font-size: 30upx;">案件号：2018200186</view>
						<view style="color: #EE9900;">车险</view>
					</view>
					<view class="item">
						<view class="item-tit">报案人：</view>
						<text style="color: #007AFF;">张三</text>
					</view>
					<view class="item">
						<view class="item-tit">报案人号码：</view>
						<text>13157877845</text>
					</view>
					<view class="item">
						<view class="item-tit">案件状态：</view>
						<text>已报警</text>
					</view>
					<view class="item">
						<view class="item-tit">报案时间：</view>
						<text>2019-08-23 09:31:17</text>
					</view>
				</view>
			</navigator>
		</view>
		<view class="btn-box">
			<navigator class="report" url="reportForm">报案</navigator>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				moldIndex: '0',
				moldArray: [
					{
						id: 0,
						name: '案件号'
					},
					{
						id: 1,
						name: '车牌号'
					},
					{
						id: 2,
						name: '车架号'
					},
					{
						id: 3,
						name: '发动机号'
					},
					{
						id: 4,
						name: '报案人'
					},
					{
						id: 5,
						name: '报案人电话'
					},
					{
						id: 6,
						name: '保单号'
					},
					
				],
				date: '报案时间',
			}
		},
		onLoad() {

		},
		methods: {
			// 选择输入框的字段名称
			bindPickerChange(e) {
				console.log('picker发送选择改变，携带值为', e.detail.value)
				this.moldIndex = e.detail.value
			},

			// 工单类型选项
			bindPickerType(e) {
				console.log('picker发送选择改变，携带值为', e.detail.value)
				this.typeIndex = e.detail.value
			},
			
			// 选择日期
			bindDateChange(e) {
				console.log('picker发送选择改变，携带值为', e.detail.value)
				this.date = e.detail.value
			}
		}
	}
</script>

<style lang="less">
	body {
		border-top: 1upx solid #ccc;
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
			left: 30upx;
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
				flex: 0.5;
				text-align: center;
				color: #555;
				font-weight: bold;
			}

		}
	}
	// 列表样式
	.list-wrap {
		padding-left: 30upx;
		margin-top: 20upx;
		border-radius: 14upx;
		background: #fff;
		
		.list-title {
			padding: 0 30upx 20upx 0;
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
			padding: 20upx 0;
			font-size: 28upx;
			
			.item {
				display: flex;
				padding-top: 20upx;
				
				.item-tit {
					width: 200upx;
					color: #666;
				}
			}
			
		}
	}
	
	.btn-box {
		position: fixed;
		bottom: 50upx;
		width: 100%;
		
		.report {
			margin: 0 30upx;
			height: 80upx;
			line-height: 80upx;
			text-align: center;
			background: #4a85d3;
			border-radius: 10upx;
			color: #fff;
		}
	}
	
</style>
