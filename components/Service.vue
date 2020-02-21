<template>
	<view class="content">
		<!-- 第四模块 填写资料 -->
		<form  @submit="formSubmit">
			<view class="mainBody">
				<view class="item center">
					<view class="item-mane"><text class="tips">*</text>服务类型</view>
					<view class="picker-box">
						<picker class="picker"  mode="multiSelector" @columnchange="picketChange" :value="multiIndex" range-key="name" :range="picketData" >
							<view>
								{{ picketData[0][multiIndex[0]].name || '请选择' }}
								{{ picketData[1][multiIndex[1]].name || '' }}
								{{ picketData[2][multiIndex[2]].name || '' }}
							</view>
							<text class="iconfont down">&#xe672;</text>
						</picker>
					</view>
				</view>
				<view>
					<view class="item center">
						<text class="item-mane"><text class="tips">*</text>服务结果</text>
						<view style="display: flex;">
							<view style="display: flex;" @click="changeYes('N')">
								<text class="iconfont ridao icn" v-if="yes == 'N'">&#xe6b1;</text>
								<text class="iconfont ridao" v-else>&#xe6a4;</text>
								<text>完成</text>
							</view>
							<view style="display: flex; margin-left: 40upx;" @click="changeYes('Y')">
								<text class="iconfont ridao icn" v-if="yes == 'Y'">&#xe6b1;</text>
								<text class="iconfont ridao" v-else>&#xe6a4;</text>
								<text>预约</text>
							</view>
						</view>
					</view>
					<view class="section center" style="display: flex;" v-if="yes == 'Y' ">
						<view class="item-mane"><text class="tips">*</text>预约时间</view>
						<view class="picker-box">
							<picker class="picker" mode="date" :value="date" start="2015-09-01" end="2028-09-01" @change="bindDateChange">
								<view>{{ date }} {{ time }}</view>
								<text class="iconfont down">&#xe672;</text>
							</picker>
						</view>
					</view>
				</view>
				<view class="item">
					<text class="item-mane">服务小结</text>
					<textarea v-model="serviceLog" @input="bindTextAreaBlur" name="" id="" cols="30" rows="10"></textarea>
				</view>
			</view>
			<button class="btn" formType="submit">提交</button>
		</form>
		<!-- 第四模块 填写资料 END-->
	</view>
</template>

<script>
	export default {
		props: {
			typeCode: Array,
			picketData: Array,
			ajaxobj_rs: Object
		},
		data() {
			return {
				multiIndex: [0, 0, 0], // 服务类型下标
				yes: 'N', //服务结果
				date: '', //预约时间默认年月日
				time: '', //预约时间默认时分秒
				serviceLog:'',//服务结果
			}
		},
		
		methods: {
			
			//服务小结的输入内容
			bindTextAreaBlur: function (e) {
				this.serviceLog = e.detail.value
				this.$emit("serviceLog", this.serviceLog);
			},
			
			// 服务类型的三级联动
			picketChange(e){
				var val = e.detail.value
				if(e.detail.column == '0'){
					this.picket_item_2 = val
					var item1 = this.picketData[0]
					var item2 =  this.setPickerData(this.ajaxobj_rs[val].children)
					var item3 = []
					if(this.ajaxobj_rs[val].children[0]){
						item3 =  this.setPickerData(this.ajaxobj_rs[val].children[0].children)
					}
					
					//this.multiIndex[0] = val
					this.multiIndex.splice(0, 1, val)
				}else if(e.detail.column == '1'){
					var item1 = this.picketData[0]
					var item2 =  this.picketData[1]
					if(this.ajaxobj_rs[this.picket_item_2].children[val]){
						var item3 =  this.setPickerData(this.ajaxobj_rs[this.picket_item_2].children[val].children)
					}
					//this.multiIndex[1] = val
					this.multiIndex.splice(1, 1, val)
				}else if(e.detail.column == '2'){
					var item1 = this.picketData[0]
					var item2 =  this.picketData[1]
					var item3 = this.picketData[2]
					//this.multiIndex[2] = val
					this.multiIndex.splice(2, 1, val)
				}
				
				// 向父级传值
				let picketData_temp = []
				picketData_temp.push(item1)
				picketData_temp.push(item2)
				picketData_temp.push(item3)
				this.$emit("getPickerData", this.multiIndex, picketData_temp);
			},
			
			// 提交表单数据
			formSubmit() {
				this.$emit("formSubmit")
			},
			
			//获取服务类型--预约时间默认年月日
			getDatimes(){
				var data = new Date();
				var year = data.getFullYear();
				var month = data.getMonth() + 1;
				month = month < 10 ? "0" + month : month;
				var date = data.getDate();
				date = date < 10 ? "0" + date : date;
				var lastConnectTime = (year +'-'+ month +'-'+ date)
				this.date = lastConnectTime
			},
			
			//获取服务类型--预约时间默认时分秒
			getTimes(){
				var data = new Date();
				var hour = data.getHours() < 10 ? "0" + data.getHours() : data.getHours();
				var minute = data.getMinutes() < 10 ? "0" + data.getMinutes() : data.getMinutes();
				var second = data.getSeconds() < 10 ? "0" + data.getSeconds() : data.getSeconds();
				var lastConnectTime = (hour +':'+ minute +':'+ second)
				this.time = lastConnectTime
			},
			
			//切换radio选项
			changeYes(key) {
				this.yes = key
				this.getDatimes()//默认预约显示的年月日
				this.getTimes()//默认预约显示的时分秒
				this.$emit("getTimeData", this.yes, this.date,this.time);
			},
			
			// 选择日期
			bindDateChange(e) {
				this.date = e.detail.value
				
				this.$emit("getTimeData", this.yes, this.date,this.time);
			},
			
			// 获取ajax三级联动的数据  
			setPickerData(obj){
				if(!obj) return
				var ajaxarr = [];
				for (var i in obj) {
					var temp = {}
					temp.id = obj[i].id
					temp.name = obj[i].typeName
					ajaxarr.push(temp); 
				}
				return ajaxarr
			},
		}
	}
</script>

<style lang="less">

	.mainBody {
		padding: 30upx;
		font-size: 28upx;
		background: #fff;
		
		.item,
		.section {
			padding-bottom: 30upx;
			display: flex;
	
			.picker-box {
				font-size: 26upx;
				flex: 1;
				box-sizing: border-box;
				padding: 10upx 34upx 10upx 20upx;
				border: 1upx solid #999;
				border-radius: 6upx;
			}
			
			.picker {
				position: relative;
				
				.down {
					position: absolute;
					right: -26upx;
					top: 6upx;
				}
			}
	
			.item-mane {
				width: 146upx;
				text-align: right;
				margin-right: 20upx;
				font-size: 30upx;
				
				.tips {
					margin-right: 6upx;
					color: #f5222d
				}
			}
	
			textarea {
				flex: 1;
				height: 100upx;
				border: 1upx solid #999;
				border-radius: 6upx;
				padding: 10upx 20upx;
				box-sizing: border-box;
			}
	
			.ridao {
				display: block;
				padding: 3upx 6upx 0 0;
				font-size: 30upx;
			}
	
			.icn {
				color: #4a85d3;
			}
		}
		.center {
			align-items: center;
		}
	}
	.btn {
		background: #4a85d3;
		padding: 0;
		margin: 0 30upx;
		color: #fff;
	}
</style>
