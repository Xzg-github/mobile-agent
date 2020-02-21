<template>
	<view>
		<News></News>
		<view class="screen">
			<form>
				<view class="ipt-box">
					<picker class="pk" mode="selector" @change="bindPickerChange" :value="moldIndex" range-key="name" :range="selectArr[0]">
						<view>
							<text class="option">{{ selectArr[0][moldIndex].name || '请选择' }}</text>
							<view class="pk-icon">
								<text class="iconfont">&#xe662;</text>
								<text class="line"></text>
							</view>
						</view>
					</picker>
					<image class="search-img" src="../../../static/images/search.png"></image>
					<input class="itp" type="text" v-model="query" @confirm="screen()" confirm-type="search" placeholder="请输入相应的内容" />
				</view>
				<view class="s-bottom">
					<picker mode="selector" @change="bindDirectionChange" :value="directionIndex" range-key="name" :range="selectArr[1]">
						{{ selectArr[1][directionIndex].name || '呼叫方向' }}
						<text class="iconfont icon">&#xe662;</text>
					</picker>
					<view style="display: flex;">
						<!-- <view>时间：</view> -->
						<view class="btm-item">
							<picker class="list" mode="date" :value="date" start="2015-09-01" end="endDate" @change="bindStarDateChange">
								<text>{{ starDate }}</text>
								<text class="iconfont icon">&#xe662;</text>
							</picker>
						</view>
						<text style="padding: 0 14upx;">~</text>
						<view class="btm-item">
							<picker class="list" mode="date" :value="date" start="2015-09-01" end="endDate" @change="bindEndDateChange">
								<text>{{ endDate }}</text>
								<text class="iconfont icon">&#xe662;</text>
							</picker>
						</view>
					</view>
				</view>
			</form>
			<view>
				<view class="round xs-round"></view>
				<view class="round big-round"></view>
				<view class="iconfont tit-icon">&#xe6a8;</view>
			</view>
		</view>
		
		<ContactHistory :infoArr="infoArr"></ContactHistory>
		
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import ContactHistory from "@/components/ContactHistory.vue"
	import common from "@/components/softphone/config/common";
	import News from "@/components/News.vue";
	export default {

		components: {
			ContactHistory,
			News
		},

		// 提取存储数据
		computed: mapState(['hasLogin', 'uerInfo']),

		data() {

			return {
				goHomeFlag: false,
				query: '', // 输入框的值
				selectArr: [[],[]], //所有下拉列表的值
				directionIndex: '', //呼叫方向
				moldIndex: '0', //筛选下拉选择
				starDate: '', //开始时间
				endDate: '', //结束时间
				infoArr: [], //请求返回的数据
				page: 1, //页码
			}
		},

		onLoad() {
			this.endDate = common.getCurrentDay() //获取结束时间
			this.starDate = common.getPrevMonthDay(this.endDate) //获取开始时间

			// 获取最近一个月的数据
			this.search(1)

			//获取数据字典
			var self = this
			uni.getStorage({
				key: 'allDate',
				success: function(res) {
					if (res.data) {
						self.allDate = res.data
						// 获取对应下拉框的数据
						self.allDate.forEach(function(rs) {
							if (rs.classify == 'history.queryArry') {
								self.selectArr[0].push(self.getItemData(rs))
							} else if (rs.classify == 'history.callType') {
								self.selectArr[1].push(self.getItemData(rs))
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

			// 选择输入框的字段名称
			bindPickerChange(e) {
				this.moldIndex = e.detail.value
			},

			// 选择输呼叫方向
			bindDirectionChange(e) {
				this.directionIndex = e.detail.value
				this.page = 1
				this.search(2)
			},

			// 工单类型选项
			bindPickerType(e) {
				this.typeIndex = e.detail.value
			},

			// 选择开始日期
			bindStarDateChange(e) {
				this.starDate = e.detail.value
				this.page = 1
				this.search(2)
			},

			// 选择结束日期
			bindEndDateChange(e) {
				this.endDate = e.detail.value
				this.page = 1
				this.search(2)
			},
			
			screen(){
				this.page = 1
				this.search(2)
			},

			// 筛选
			search(type) {
				var self = this
				var obj = {}
				obj.startDate = this.starDate; //服务时间开始
				obj.endDate = this.endDate; //服务时间结束
				obj.callDirection = this.directionIndex; //呼叫方向 0呼出 1呼入
				obj.callFrom = ''; //查询号码 （客户号、分机号）
				obj.agentId = ''; //坐席工号
				obj.agentName = ''; //坐席姓名
				obj.current = this.page
				obj.size = '10'
          
				switch (this.moldIndex) {
					case '0':
						obj.callFrom = this.query // 查询号码
						break;
					case '1':
						obj.agentId = this.query // 坐席工号
						break;
					case '2':
						obj.agentName = this.query // 坐席姓名
						break;
					default:
						obj.ani = this.query // 默认
						break;
				}

				uni.showLoading({
					title: '加载中'
				})
				uni.request({
					method: 'GET',
					url: this.apiDomian + '/contact/page',
					data: obj,
					header: {
						'content-type': 'application/json',
						'Authorization': 'Arch6WithCloud ' + self.uerInfo.token
					}
				
				})
				.then((data) => {
					uni.hideLoading();
					
					var obj = data[1].data.data
					if(obj){
						this.page = this.page + 1
						var lastPage = obj.pages
						if(obj.records.length == 0){
							uni.showToast({
							    title: '没有更多数据了',
							    duration: 1000,
								icon: 'none'
							});
						}
						
						if(type == 1){
							this.infoArr = [...this.infoArr , ...obj.records]
						}else{
							this.infoArr = obj.records
						}
					}
					
				})
				
				
			},

		},
		onReachBottom(){
			this.search(1)
		}


	}
</script>

<style lang="less">
	body {
		background: #F5F2F0;
		margin-bottom: 90upx;
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
				padding-right: 30upx;
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
			top: 18upx;
			left: 30upx;
			font-size: 90upx;
			color: #fff;
			opacity: 0.8;
		}

		.s-bottom {
			margin-top: 30upx;
			padding: 20upx 30upx;
			display: flex;
			justify-content: space-between;
			align-items: center;
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

	.active {
		background: #ECECEC;
	}
</style>
