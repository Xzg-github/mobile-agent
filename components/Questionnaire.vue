<template>
	<view>
		<view class="customer-info">
			<view class="questionnaire" v-if="boot">
				<view class="head">
					<view class="head-item">
						<view class="item-name">问卷名称:</view>
						<text>{{ questionData.examName }}</text>
					</view>
					<view class="head-item">
						<view class="item-name">问卷描述:</view>
						<text>{{ questionData.remark }}</text>
					</view>
					<view class="head-item">
						<view class="item-name">引导语:</view>
						<text v-if="questionData.guide !=null">{{ questionData.guide }}</text>
					</view>
				</view>
				<view>  
					<text class="subject">{{ questionObj.subjectTitle }}</text>
					<view class="content">
						<view class="left">
							<view v-for="(item,index) in questionObj.examItemList" :key="index" @click="changeKey(index,item.id,item.nextSubjectId)">
								<text class="iconfont leftIcon" style="color: #007AFF;" v-if="(item.id+'|'+cur_id) == radioCheckArr[cur_id]">&#xe6b1;</text>
								<text class="iconfont leftIcon" v-else>&#xe6a4;</text>
								<text>{{item.itemName}}</text>
							</view>
						</view>
						<text class="right" v-if="questionObj.subjectSpeech !=null">{{ questionObj.subjectSpeech }}</text>
					</view>
					<view class="btn-box">
						<view class="go" @click="goPrev" v-if="cur_id != 0">上一题</view>
						<view class="go" @click="goNext('btn')" v-if="questionObj.subjectType == 1">下一题</view>
					</view>
				</view>
			</view>
			<view v-else style="text-align: center; padding: 20upx 0;">请选择号码进行外呼</view>
		</view>
	</view>
</template>

<script>
	import {  mapState,  mapMutations  } from 'vuex';
	export default {
		// 父级传值子级
		props: ["questionObj", "questionData", "questionnaireId",'boot',"cur_id","cur_arr","radioCheckArr"], //1、父级接收到的值  2、问卷标题引导语 3、问卷的ID 4、引导语

		// 提取存储数据
		computed: mapState(['hasLogin','uerInfo']), 
		
		data() {
			return {
				sclet: '-1',   // 当前 选中下标
				answer: '',   // 选中的值
				itemId: '', // 当前 选中下标对应的id
				sessionId: '', 
				nextSubjectId: '' ,//当前选项对应的下一题ID
			}
		},

		mounted: function(){
			this.sessionId = this.getSession()
			console.log(this.questionData)
		},
		

		methods: {
						
			//跳转下一题
			goNext(type){
				var self = this
				if(this.answer == ''){
					uni.showToast({
						title: '未选择',
						duration: 1000,
						icon: 'none',
					});
					return false;
				}
				self.saveQuestion();   // 先保存数据
				self.getNextData(type)     // 请求下一题
			}, 
			  

			// 问卷选择题保存
			changeKey(index,itemId,nextSubjectId) { //1题目下标 、2选项的id 、 3下一题的ID
				//下一题清楚 默认选择
				this.$emit('radioCheck',this.cur_id,itemId,this.cur_id)
				
				var self = this
				this.sclet = index
				if (this.sclet == '0') {
					this.answer = 'A'
				} else if (this.sclet == '1') {
					this.answer = 'B'
				} else if (this.sclet == '2') {
					this.answer = 'C'
				} else if (this.sclet == '3') {
					this.answer = 'D'
				} else if (this.sclet == '4') {
					this.answer = 'E'
				}
				
				self.itemId = itemId;
				if(nextSubjectId == null){
					self.nextSubjectId = this.questionObj.nextSubjectId
				}else{
					self.nextSubjectId = nextSubjectId
				}

				this.goNext('select')   //下一题
			},
			
			// 保存当前的选项  然后下一题
			saveQuestion(){
				var self = this
				uni.request({
					method: 'POST',
					url: this.apiDomian + '/examAnswer/add',
					data: {
						answer: this.answer, //问卷选项
						itemId: this.itemId, //选项id
						serviceId: this.sessionId, //年月日时分秒加四位随机数
						subjectId: this.questionObj.id, //题目id
						subjectType: this.questionObj.subjectType //题目类型。1为选择题
					},
					header: {
						'content-type': 'application/json',
						'Authorization': 'Arch6WithCloud '+this.uerInfo.token
					}
				})
				.then((data) => {})
			},
			
			// 请求下一题的接口
			getNextData(type){
				uni.showLoading({
					title: '加载中'
				})
				var self = this
				if(type == 'btn'){
					var post_id = this.cur_arr[this.cur_id+1] || this.questionObj.nextSubjectId 
				}else {
					var post_id = this.nextSubjectId 
				}
				//console.log(post_id)
				
				uni.request({
					method: 'GET',
					url: self.apiDomian + '/examSubject/next/' + self.questionnaireId+'/'+ post_id,
					data: {},
					header: {
						'content-type': 'application/json',
						'Authorization': 'Arch6WithCloud '+this.uerInfo.token
					}
				})
				.then((data) => {
					uni.hideLoading();
					var obj = data[1].data.data
					self.$emit('funa',obj,obj.id,'add')
				})
			},
			
			//获取上一题
			goPrev(){
				uni.showLoading({
					title: '加载中'
				})
				var self = this
				var post_id = this.cur_arr[this.cur_id-1]
				uni.request({
					method: 'GET',
					url: this.apiDomian + '/examSubject/next/'+ self.questionnaireId+'/'+ post_id,
					data: {},
					header: {
						'content-type': 'application/json',
						'Authorization': 'Arch6WithCloud '+this.uerInfo.token
					}
				})
				.then((data) => {
					uni.hideLoading();
					var obj = data[1].data.data
					self.$emit('funa',obj,obj.nextSubjectId,'---')
				})
				
			},
			
			
			getSession(){
				//获取年月日时分秒加四位随机数 sessionId
				var data = new Date();
				var year = data.getFullYear();
				var month = data.getMonth() + 1;
				month = month < 10 ? "0" + month : month;
				var date = data.getDate();
				date = date < 10 ? "0" + date : date;
				var hour = data.getHours() < 10 ? "0" + data.getHours() : data.getHours();
				var minute = data.getMinutes() < 10 ? "0" + data.getMinutes() : data.getMinutes();
				var second = data.getSeconds() < 10 ? "0" + data.getSeconds() : data.getSeconds();
				var value = Math.ceil(9999 * Math.random()) 
				var currentTime = (year +''+ month +''+ date +''+ hour +''+ minute +''+ second +''+ value)
				return  currentTime
			}
		
		}


	}
</script>

<style lang="less">
	.customer-info {
		padding: 30upx;
		font-size: 28upx;

		// 问卷
		.questionnaire {
			font-size: 28upx;
		}

		.head {
			color: #808080;

			.head-item {
				padding-bottom: 16upx;
				display: flex;

				.item-name {
					width: 20%;
				}

				text {
					flex: 1;
				}
			}
		}
		
		.subject {
			line-height: 42upx;
			font-size: 32upx;
			font-weight: bold;
		}

		.content {
			padding-top: 14upx;
			display: flex;
			line-height: 60upx;

			.left {
				width: 50%;
				font-size: 32upx;
				
				.leftIcon {
					font-size: 32upx;
				}
			}

			.right {
				flex: 1;
				font-size: 24upx;
				color: #808080;
				
			}

			.iconfont {
				margin-right: 10upx;
			}
		}

		.btn-box {
			margin-top: 36upx;
			color: #fff;
			width: 380upx;
			justify-content: space-between;
			display: flex;

			.go {
				width: 150upx;
				height: 50upx;
				line-height: 50upx;
				text-align: center;
				background: #4a85d3;
				border-radius: 8upx;
			}
		}

	}
</style>
