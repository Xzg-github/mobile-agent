<template>
	<view>
		<view class="screen">
			<form bindsubmit="search">
				<view class="ipt-box">
					<picker class="pk" mode="selector" @change="bindPickerChange" :value="moldIndex" range-key="name" :range="moldArray">
						<view class="clearfix">
							<text class="option">{{ moldArray[moldIndex].name }}</text>
							<view style="float: right;">
								<text class="iconfont">&#xe662;</text>
								<text class="line"></text>
							</view>
						</view>
					</picker>
					<image class="search-img" src="../../../static/images/search.png"></image>
					<input class="itp" type="text" placeholder="请输入相应的内容" />
				</view>
			</form>
			<view>
				<view class="round xs-round"></view>
				<view  class="round big-round"></view>
			</view>
		</view>	
		<navigator class="list-wrap" url="details">
			<view class="list-title">
				<view>
					<text class="iconfont num">&#xe696;</text>
					<text>2018200000186</text>
				</view>
				<text style="color: #EE9900;">审批中</text>
				
				<view class="iconfont left-round">&#xe607;</view>
				<view class="iconfont right-round">&#xe608;</view>
			</view>
			<view class="list-body">
				<view style="display: flex;">
					<view class="list-box">
						<view class="list-tit">被保人</view>
						<text>张三</text>
					</view>
					<view class="list-box">
						<view class="list-tit">车牌号</view>
						<text class="car-num">粤A 88888</text>
					</view>
					<view class="list-box">
						<view class="list-tit">车型</view>
						<text>奇瑞</text>
					</view>
				</view>
				<view class="bottom">
					<view>
						<text style="color: #666;">险类：</text>
						<text>交强险</text>
					</view>
					<view>
						<text style="color: #666;">归属机构：</text>
						<text>某某机构</text>
					</view>
				</view>
				<view class="tips">
					<text>保险期间：2019-08-23 09:31:17</text>
				</view>
			</view>
		</navigator>
		
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
						name: '保单号'
					},
					{
						id: 1,
						name: '被保人'
					},
					{
						id: 2,
						name: '车牌号'
					},
					{
						id: 3,
						name: '车架号'
					},
					{
						id: 4,
						name: '发动机号'
					},
					{
						id: 5,
						name: '被保人身份证号'
					},
					{
						id: 6,
						name: '投保人身份证号'
					},
					
				],
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
		background: #edeeee;;
	}

	.clearfix:after {
		content: "";
		display: block;
		height: 0;
		clear: both;
		visibility: hidden;
	}
	
	.iconfont {
		margin-left: 10upx;
		font-size: 24upx;
		padding-right: 10upx;
		color: #9b9b9b;
	}
	
	.num {
		font-size: 34upx;
	}
	

	.screen {
		position: relative;
		background: #4a85d3;
		margin-bottom: 40upx;
		padding: 70upx 0 30upx 0;
		border-top: 2upx solid #ccc;
		border-bottom-right-radius: 28upx;
		border-bottom-left-radius: 28upx;
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
				width: 38%;
				text-align: center;
	
				.option {
					color: #666;
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
			right: 304upx;
			top: 40upx;
			width: 50upx;
			height: 50upx;
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

	}
	
	.list-wrap {
		position: relative;
		box-shadow: 0 0 8upx #e0e5ec;
		margin: 0 20upx 30upx 20upx;
		padding: 0 20upx;
		border-radius: 14upx;
		background: #fff;
		overflow: hidden;
		
		.list-title {
			padding: 20upx 0;
			font-size: 30upx;
			display: flex;
			justify-content: space-between;
			border-bottom: 1upx dashed #CCC;
			
			.iconfont {
				color: #4a85d3;
				font-weight: bold;
				padding-right: 10upx;
			}
			
			.left-round {
				position: absolute;
				font-size: 38upx;
				left: -20upx;
				top: 60upx;
				color: #edeeee;
			}
			.right-round {
				position: absolute;
				font-size: 38upx;
				right: -20upx;
				top: 60upx;
				color: #edeeee;
			}
			
			.state {
				color: #55A532;
			}
		}
		
		.list-body {
			padding: 18upx 0;
			line-height: 50upx;
			font-size: 28upx;
			
			.list-box {
				flex: 1;
				text-align: center;
				
				.list-tit {
					font-size: 32upx;
					color: #666;
					margin-bottom: 10upx;
				}
				
				.car-num {
					background: #007AFF;
					color: #fff; 
					padding: 10upx; border-radius: 8upx;
				}
			}
			
			.bottom {
				display: flex;
				justify-content: space-between;
				margin-top: 20upx;
			}
			
			.tips {
				font-size: 26upx;
				color: #666;
			}
		}
	}
</style>
