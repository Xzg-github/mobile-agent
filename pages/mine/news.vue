<template>
	<view>
		<News></News>
		<view class="nav">
			<view :class='["nav-item",show=="1" ? "active" : ""]' @click="changeNav('1')">
				<text>未读</text>
			</view>
			<view :class='["nav-item",show=="2" ? "active" : ""]' @click="changeNav('2')">
				<text>已读</text>
			</view>
		</view>
		
		<form action="">
			<view style="background: #fff;">
				<view class="ipt-box">
					<picker class="pk" mode="selector" @change="bindPickerChange" :value="moldIndex" range-key="name" :range="selectArr">
						<view>
							<text class="option">{{ selectArr[moldIndex].name || '请选择' }}</text>
							<view class="pk-icon">
								<text class="iconfont" style="color: #708090;">&#xe662;</text>
								<text class="line"></text>
							</view>
						</view>
					</picker>
					<image class="search-img" src="../../static/images/search.png"></image>
					<input class="itp" type="text" v-model="query" @confirm="getNewsMsg()" confirm-type="search" placeholder="搜索" />
				</view>
				<view class="s-bottom">
					<view style="display: flex;">
						<view>起止时间：</view>
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
			</view>
		</form>
		<view style="height: 20upx; background: #f0f0f0;"></view>
		<MsgList :msgArr='msgArr'></MsgList>
		
	</view>
</template>
	
<script>
	import uParse from '@/components/gaoyia-parse/parse.vue'
	import MsgList from "@/components/MsgList.vue"
	import News from "@/components/News.vue";
	import common from "@/components/softphone/config/common";
	
	import { mapState,mapMutations } from 'vuex'
	
	export default {
		components: {
			MsgList,
			News
		},
		
		// 提取存储数据
		computed: mapState(['hasLogin', 'uerInfo']),
		
		data() {
			return {
				show: '1',
				msgArr:'', //返回消息列表
				query:'',//输入框的值
				starDate: '', //开始时间
				endDate: '', //结束时间
				moldIndex:'0',
				selectArr:[] ,//消息筛选关键词
				page: 1 //页码
			}
		},

		onLoad() {
			
			//获取数据字典
			var self = this
			uni.getStorage({
				key: 'allDate',
				success: function(res) {
					if (res.data) {
						self.allDate = res.data
						// 获取对应下拉框的数据
						self.allDate.forEach(function(rs) {
							if (rs.classify == 'message.filter') {
								self.selectArr.push(self.getItemData(rs))
							}
						});
			
					}
				}
			})
			
			this.endDate = common.getCurrentDay() //获取结束时间
			this.starDate = common.getPrevMonthDay(this.endDate) //获取开始时间
			this.changeNav('1') //默认未读消息
		},
		
		methods: {
			
			//获取数据字典相应的值
			getItemData(rs) {
				var dataObj = {}
				dataObj.name = rs.dataValue
				dataObj.id = rs.dataKey
				return dataObj
			},
			
			changeNav(key) {
				this.show = key
				this.page = 1
				this.msgArr = []
				this.getNewsMsg(key)
			},
			
			// 选择输入框的字段名称
			bindPickerChange(e) {
				this.moldIndex = e.detail.value
			},
			
			// 选择开始日期
			bindStarDateChange(e) {
				this.starDate = e.detail.value
				
				this.page = 1
				this.msgArr = []
				this.getNewsMsg()
			},
			
			// 选择结束日期
			bindEndDateChange(e) {
				this.endDate = e.detail.value
				
				this.page = 1
				this.msgArr = []
				this.getNewsMsg()
			},
			
			getNewsMsg(){
				var self = this
				var obj = {}
				obj.selectType = self.show;  //查询类型 1：未读消息列表 2：已读消息列表
				obj.agentId =  self.uerInfo.username;  //坐席工号 测试可用 8099
				obj.startTime = self.starDate; //查询时间开始
				obj.endTime = self.endDate; //查询时间结束
				obj.contentKeyWords = '';
				obj.title = '';
				obj.current = this.page,
				obj.size ='10'
				
				switch (self.moldIndex) {
					case '0':
						obj.contentKeyWords = self.query //内容关键词
						break;
					case '1':
						obj.title = self.query //标题
						break;
					default:
						obj.contentKeyWords = self.query // 默认
						break;
				}
				uni.showLoading({
					title: '加载中'
				})
				uni.request({
					method: 'GET',
					url: this.apiDomian + '/news/page',
					data:obj,
					header: {
						'content-type': 'application/x-www-form-urlencoded',
						'Authorization': 'Arch6WithCloud ' + self.uerInfo.token
					}
						
				})
				.then((data) => {
					uni.hideLoading();
					if( data[1].data.data == null){
						this.msgArr = ''
						return false
					}else{
						//this.msgArr = data[1].data.data.records
						self.page = self.page + 1
						self.msgArr = [...self.msgArr ,...data[1].data.data.records]
					}
				
				})
			}
		},
		onReachBottom(){
			this.getNewsMsg()
		}
	}
</script>

<style lang="less">

	.nav {
		display: flex;
		padding: 0 30upx;
		margin-bottom: 20upx;
		text-align: center;
		background-color: #fff;
		font-size: 30upx;
		height: 88upx;
		line-height: 88upx;
		border-bottom: 1upx solid #E9E9E9;
	
		.nav-item {
			flex: 1;
	
			&.active {
				text {
					position: relative;
					font-size: 32upx;
					color: #4a85d3;
	
					&:before {
						content: " ";
						position: absolute;
						top: 62upx;
						left: 50%;
						margin-left: -18upx;
						width: 36upx;
						height: 4upx;
						background-color: #4a85d3;
					}
				}
			}
		}
	}
	
	.ipt-box {
		margin: 0upx 30upx;
		display: flex;
		align-items: center;
		height: 70upx;
		border: 1upx solid #ccc;
		border-radius: 10upx;
		font-size: 28upx;
		background: #eee;
		position: relative;
		z-index: 99;

		.pk {
			position: relative;
			width: 28%;
			padding: 0 20upx;

			.option {
				color: #333;
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
	
	
	.s-bottom {
		padding: 20upx 30upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: #333;
		font-size: 28upx;
	
		.btm-item {
			// flex: 1;
			text-align: center;
			
			.icon {
				margin-left: 8upx;
				color: #333;
			}
		}
	
	}
</style>


