<template>
	<view class="content">
		<view class="nav-box">
			<view :class='["btn",show=="CAR" ? "active" : ""]' @click="changeNav('CAR')">车险</view>
			<view :class='["btn",show=="UNCAR" ? "active" : ""]' @click="changeNav('UNCAR')">非车险</view>
		</view>
		<form @submit="formSubmit">
			<view class="form-wrap">
				<view class="regForm-item" v-if="show == 'CAR'">
					<view class="regForm-item-tit"><text class="tips">*</text>车牌/车架号</view>
					<input class="ipt" v-model="policySearchNo" type="text" placeholder="请填写车牌号">
				</view>
				<view class="regForm-item" v-if="show == 'UNCAR'">
					<picker class="regForm-item-tit" mode="selector" @change="bindIdTypeChange" :value="idTypeIndex" :range="selectArr[5]" range-key="name">
						<view>
							<text class="tips">*</text>
							{{ selectArr[5][idTypeIndex].name || '请选择' }}
							<text class="iconfont" style="margin-left: 6upx;">&#xe662;</text>
						</view>
					</picker>
					<input class="ipt" type="text">
				</view>
				<view class="regForm-item">
					<view class="regForm-item-tit"><text class="tips">*</text>出险时间</view>
					<view class="ipt" style="display: flex; align-items: center;">
						<picker :class="['data',getDate=='' ? 'default' : 'select']" mode="date" :value="date" @change="bindStarChange">
							<view class="iconfont">&#xe798;<text class="time-text">{{ getDate || '请选择日期' }}</text></view>
						</picker>
						<picker :class="['time',getTime=='' ? 'default' : 'select']" mode="time" :value="date"  @change="bindEndChange">
							<view class="iconfont">&#xe64e;<text class="time-text">{{ getTime || '请选择时间' }}</text></view>
						</picker>
					</view>
				</view>
				<view class="regForm-item">
					<view class="regForm-item-tit"><text class="tips">*</text>报案人</view>
					<input class="ipt" type="text" placeholder="请填写报案人" v-model="reportName">
				</view>
				<view class="regForm-item">
					<view class="regForm-item-tit"><text class="tips">*</text>报案人电话</view>
					<input class="ipt" type="number" placeholder="请填写报案人电话" v-model="reportPhone">
				</view>
				<view class="regForm-item"  v-if="show == 'CAR'">
					<view class="regForm-item-tit">驾驶员</view>
					<input class="ipt" type="text" placeholder="请填写驾驶员" v-model="driverName">
				</view>
				<view class="regForm-item"  v-if="show == 'CAR'">
					<view class="regForm-item-tit">驾驶员电话</view>
					<input class="ipt" type="text" placeholder="请填写驾驶员电话" v-model="driverPhone">
				</view>
				<view class="regForm-item"  v-if="show == 'CAR'">
					<view class="regForm-item-tit"><text class="tips">*</text>现场类型</view>
					<picker class="ipt" mode="selector" @change="bindSceneChange" :value="sceneIndex" :range="selectArr[0]" range-key="name">
						<view :class="['set', !selectArr[0][sceneIndex] ? 'default' : 'select']">{{ selectArr[0][sceneIndex].name || '请选择' }}</view>
						<text class="iconfont fr">&#xe672;</text>
					</picker>
				</view>
				<view v-if="show == 'CAR'">
					<!-- 现场类型是非第一现场的时候显示 -->
					<view v-if="sceneIndex == '1'">
						<view class="regForm-item">
							<view class="regForm-item-tit"><text class="tips">*</text>车辆目前位置</view>
							<input class="ipt" type="text" placeholder="请填写目前位置">
						</view>
						<view class="regForm-item">
							<view class="regForm-item-tit"><text class="tips">*</text>车辆详细地址</view>
							<textarea class="textarea" @blur="bindTextAreaBlur" placeholder="请输入车辆详细地址" />
						</view>
					</view>
				</view>
				<view class="regForm-item">
					<view class="regForm-item-tit"><text class="tips">*</text>出险地点</view>
					<!-- <picker class="ipt clearfix" mode="multiSelector" @columnchange="bindDangerChange" :value="dangerIndex" range-key="name"
					 :range="dangerData">
						<view class="set">
							{{danger[0][dangerIndex[0]].name}}
							{{danger[1][dangerIndex[1]].name || ''}}
							{{danger[2][dangerIndex[2]].name || ''}}
						</view>
						<text class="iconfont fr">&#xe672;</text>
					</picker> -->
					<!-- <City :picketData="cityData" :ajaxobj_rs="ajaxobj_rs" @getPickerData="getPickerData"></City> -->
				</view>
				<view class="regForm-item">
					<view class="regForm-item-tit"><text class="tips">*</text>出险地址</view>
					<textarea class="textarea" @blur="bindAccidentAreaBlur" placeholder="请填写车辆出险地址"/>
				</view>
				<view class="regForm-item"  v-if="show == 'CAR'">
					<view class="regForm-item-tit"><text class="tips">*</text>事故类型</view>
					<picker class="ipt" mode="selector" @change="bindAccidentTypeChange" :value="accidentTypeIndex" :range="selectArr[1]"
					 range-key="name">
						<view :class="['set', !selectArr[1][accidentTypeIndex] ? 'default' : 'select']">{{ selectArr[1][accidentTypeIndex].name || '请选择' }}</view>
						<text class="iconfont fr">&#xe672;</text>
					</picker>
				</view> 
				<view class="regForm-item"  v-if="show == 'CAR'">
					<view class="regForm-item-tit"><text class="tips">*</text>损失类型</view>
					<checkbox-group @change="checkboxChange">
						<label class="list-cell" v-for="item in selectArr[2]" :key="item.id">
							<checkbox :value="item.name" />
							<view>{{ item.name }}</view>
						</label>
					</checkbox-group>
				</view>
				<view class="regForm-item"  v-if="show == 'CAR'">
					<view class="regForm-item-tit"><text class="tips">*</text>报警情况</view>
					<picker class="ipt" mode="selector" @change="bindPoliceChange" :value="policeIndex" :range="selectArr[3]" range-key="name">
						<view :class="['set', !selectArr[3][policeIndex] ? 'default' : 'select']">{{ selectArr[3][policeIndex].name || '请选择' }}</view>
						<text class="iconfont fr">&#xe672;</text>
					</picker>
				</view>
				<view class="regForm-item" v-if="show == 'CAR'">
					<view class="regForm-item-tit"><text class="tips">*</text>出险原因</view>
					<picker class="ipt" mode="selector" @change="bindReasonChange" :value="reasonIndex" :range="selectArr[4]" range-key="name">
						<view :class="['set', !selectArr[4][reasonIndex] ? 'default' : 'select']">{{ selectArr[4][reasonIndex].name || '请选择' }}</view>
						<text class="iconfont fr">&#xe672;</text>
					</picker>
				</view>
				<view class="regForm-item" v-if="show == 'UNCAR'">
					<view class="regForm-item-tit"><text class="tips">*</text>出险原因</view>
					<picker class="ipt" mode="selector" @change="bindReasonChange" :value="reasonIndex" :range="selectArr[6]" range-key="name">
						<view :class="['set', !selectArr[6][reasonIndex] ? 'default' : 'select']">{{ selectArr[6][reasonIndex].name || '请选择' }}</view>
						<text class="iconfont fr">&#xe672;</text>
					</picker>
				</view>
				<view class="regForm-item">
					<view class="regForm-item-tit"><text class="tips">*</text>出险经过</view>
					<textarea class="textarea" @blur="bindAccidentDetailBlur" placeholder="请填写车辆出险经过"/>
				</view>
			</view>
			<button class="submit" formType="submit">提交</button>
		</form>
	</view>
</template>

<script>
	import City from "@/components/City.vue" 
	import { mapState,mapMutations } from 'vuex'
	export default {
		
		// 提取存储数据
		computed: mapState(['hasLogin', 'uerInfo']),
		
		components: {
			City
		},
		data() {
			return {
				selectArr: [[],[],[],[],[],[],[]],// 全部下拉列表值
				cityData: [],
				ajaxobj_rs: {},
				allDate: [], //数据字典
				show: 'CAR', // CAR车险 UNCAR非车险 
				idTypeIndex: 0, //证件类型
				policySearchNo: '', //车牌/车架号
				getDate: '', //出险出险时间
				getTime: '', //出险结束时间
				reportName: '', //报案人
				reportPhone: '', //报案电话
				driverName: '', //驾驶员
				driverPhone: '', //驾驶员电话
				sceneIndex: '', //现场类型
				accidentAreaStreem:'', //出险详细地址
				carNowAreaName:'', //车辆目前位置
				carNowAreaStreem: '', //车辆目前详细地址
				accidentTypeIndex:'', //事故类型
				dangerIndex: [0, 0, 0], // 服务类型下标
				dangerData: ['广东省', '深圳市'],
				lossIndex: '', //损失类型
				lossArray:[],
				policeIndex: '', //报警情况
				accidentDetail:'', //出险经过
				reasonIndex:'', //出险原因
			}
		},

		onLoad() {
			// this.getCityData()

			//获取字典数据缓存
			var self = this
			uni.getStorage({
				key: 'allDate',
				success: function(res) {
					if (res.data) {
						self.allDate = res.data
						// 获取对应下拉框的数据
						self.allDate.forEach (function(rs){			
						    if(rs.classify == 'register.sceneType'){
								self.selectArr[0].push(self.getItemData(rs))
							}
							else if(rs.classify == 'register.accidentType'){
								self.selectArr[1].push(self.getItemData(rs))
							}
							else if(rs.classify == 'register.lossType'){
								self.selectArr[2].push(self.getItemData(rs))
							}
							else if(rs.classify == 'register.alarmSituation'){
								self.selectArr[3].push(self.getItemData(rs))
							}
							else if(rs.classify == 'register.dangerReason'){
								self.selectArr[4].push(self.getItemData(rs))
							}
							else if(rs.classify == 'register.papersType'){ 
								self.selectArr[5].push(self.getItemData(rs))
							}
							else if(rs.classify == 'register.nonCarDangerReason'){
								self.selectArr[6].push(self.getItemData(rs))
							}
						});
						
					}
				}
			})
		},

		methods: {
			
			//获取数据字典相应的值
			getItemData(rs){
				var obj = {}
				obj.name = rs.dataValue
				obj.id = rs.dataKey
				return obj
			},
			
			// 复选框的选择
			checkboxChange: function (e) {
				var items = this.selectArr[2],
					values = e.detail.value;
				for (var i = 0, lenI = items.length; i < lenI; ++i) {
					const item = items[i]
					if(values.includes(item.value)){
						this.$set(item,'checked',true)
					}else{
						this.$set(item,'checked',false)
					}
				}
				this.lossArray = values.join('#')
			},
			// getCityData(){
			// 	var self = this
			// 	uni.request({
			// 		method: 'GET',
			// 		url: this.apiDomian + '/serviceType/findTreeByCode',
			// 		data: {
			// 			typeCode: 1
			// 		},
			// 		header: {
			// 			'content-type': 'application/x-www-form-urlencoded',
			// 			'Authorization': 'Arch6WithCloud ' + self.uerInfo.token
			// 		}
			// 	})
			// 	.then((data) => {
			// 		var ajaxobj = data[1].data.data.children
			// 		self.ajaxobj_rs = ajaxobj
			// 		var ajaxarr1 = self.setCityData(ajaxobj)
			// 		var ajaxarr2 = []
			// 		var ajaxarr3 = []
			// 		if(ajaxobj[0].children){
			// 			ajaxarr2 = self.setCityData(ajaxobj[0].children)
			// 			if(ajaxobj[0].children[0]){ 
			// 				ajaxarr3 = self.setCityData(ajaxobj[0].children[0].children)
			// 			}
			// 		}
			// 				
			// 		var temp_arr = []
			// 		temp_arr.push(ajaxarr1)
			// 		temp_arr.push(ajaxarr2)
			// 		temp_arr.push(ajaxarr3)
			// 		self.cityData = temp_arr
			// 	})
			// },
			
			// setCityData(){
			// 	if(!obj) return
			// 	var ajaxarr = [];
			// 	for (var i in obj) {
			// 		var temp = {}
			// 		temp.id = obj[i].id
			// 		temp.name = obj[i].typeName
			// 		ajaxarr.push(temp); 
			// 	}
			// 	return ajaxarr
			// },

			// 判断显示是否是车险，非车险
			changeNav(key) {
				this.show = key
			},

			// 选择出险日期
			bindStarChange: function(e) {
				this.getDate = e.target.value
			},

			// 选择出险时间
			bindEndChange: function(e) {
				this.getTime = e.target.value
			},
			
			// 选择证件类型
			bindIdTypeChange(e) {
				this.idTypeIndex = e.target.value
			},

			// 选择现场类型
			bindSceneChange(e) {
				this.sceneIndex = e.target.value
			},

			// 选择损失类型
			bindLossChange(e) {
				this.lossIndex = e.target.value
			},

			// 选择报警情况
			bindPoliceChange(e) {
				this.policeIndex = e.target.value
			},
			
			// 选择事故类型
			bindAccidentTypeChange(e){
				this.accidentTypeIndex = e.target.value
			},
			
			// 选择出险原因
			bindReasonChange(e) {
				this.reasonIndex = e.target.value
			},
			
			//车辆目前详细地址
			bindTextAreaBlur(e){
				this.carNowAreaStreem = e.target.value
			},
			
			//车辆出险地址
			bindAccidentAreaBlur(e){
				this.accidentAreaStreem = e.target.value
			},
			
			// 车辆出险经过
			bindAccidentDetailBlur(e){
				this.accidentDetail = e.target.value
			},

			formSubmit() {
				
				// 判断表单
				if(this.policySearchNo == '' || this.getDate == ''|| this.getTime == '' || this.reportName == '' || this.reportPhone == ''
					|| !this.selectArr[0][this.sceneIndex] || this.accidentAreaStreem == '' || !this.selectArr[1][this.accidentTypeIndex]
					|| this.lossArray == '' || !this.selectArr[3][this.policeIndex] || !this.selectArr[4][this.reasonIndex] || this.accidentDetail == ''
				){
					wx.showModal({
						title: '提示',
						content: '请填写完整的信息！',
						showCancel: false,
					})
					return false;
				}
				// 判断非第一现场需增加填的内容
				if(this.sceneIndex == '1'){
					if(this.carNowAreaStreem == ''){
						wx.showModal({
							title: '提示',
							content: '请填写完整的信息！',
							showCancel: false,
						})
						return false;
					}
				}
				
				uni.request({
					method: 'POST',
					url: this.apiDomian + '/register/add',
					data: {
						registType:this.show, //报案类型
						policySearchNo: this.policySearchNo, //车牌/车架号
						accidentTime: this.getDate+' '+ this.getTime+':00', //出险时间
						reportName: this.reportName, //报案人名称
						reportPhone: this.reportPhone, //报案人电话
						driverName: this.driverName, //驾驶员
						driverPhone: this.driverPhone, //驾驶员电话
						local: this.selectArr[0][this.sceneIndex].id, //现场类型
						accidentAreaName: '广东省#深圳市#罗湖区', //出险省市区名称
						accidentAreaCode: '省编码#市编码#区编码',  //出险省市区编码
						accidentAreaStreem: this.accidentAreaStreem, //出险详细地址
						carNowAreaName: '省#市#区',  //车辆目前位置省市区
						carNowAreaCode: '省编码#市编码#区编码',  //车辆目前位置省市区编码
						carNowAreaStreem: this.carNowAreaStreem, //车辆目前位置详细地址
						accidentType: this.selectArr[1][this.accidentTypeIndex].id, //事故类型
						lossType: this.lossArray, //损失类型
						alarm: this.selectArr[3][this.policeIndex].id, //报警情况
						accidentDetail: this.accidentDetail, //出险经过
						accidentReason: this.selectArr[4][this.reasonIndex].id, //出险原因
					},
					header: {
						'content-type': 'application/json'
					}

				})
				.then((data) => {
					console.log(data)
				})
			}
		}
	}
</script>

<style lang="less">
	.content {
		padding-bottom: 90upx;
	}
	
	.nav-box {
		margin: 60upx 30upx;
		display: flex;
		background: #DBDBDB;
		border-radius: 8upx;

		.btn {
			width: 50%;
			text-align: center;
			border-radius: 8upx;
			margin: 12upx;
			height: 60upx;
			line-height: 60upx;
			font-size: 28upx;
		}

		.active {
			background: #4a85d3;
			color: #fff;
		}

	}

	.form-wrap {
		margin: 30upx 40upx 80upx 30upx;
		font-size: 28upx;

		.regForm-item {
			display: flex;
			align-items: center;
			margin-bottom: 34upx;
			
			checkbox-group {
				display: flex;
				flex-flow: row wrap;
				flex: 1;
			}

			.regForm-item-tit {
				font-size: 26upx;
				width: 180upx;
				padding-right: 40upx;
				text-align: right;
				
				.tips {
					color: #f5222d;
					padding-right: 8upx;
				}
			}
			
			.list-cell {
				display: flex;
				width: 50%;
				
				checkbox {
					transform: scale(0.6,0.6);
				}
			}

			.ipt {
				display: block;
				padding: 0 10upx;
				border: 1upx solid #ccc;
				flex: 1;
				height: 60upx;
				line-height: 60upx;
				position: relative;
				
				.set {
					width: 100%;
					height: 60upx;
				}
				
				.fr {
					position: absolute;
					top: 6upx;
					right: 16upx;
				}
			}
			
			.textarea {
				padding:10upx;
				height: 70upx;
				flex: 1;
				border: 1upx solid #ccc;
				
			}
			
			.data {
				width: 240upx;
			}
			.time {
				flex: 1;
			}

			.time-text {
				margin-left: 10upx;
			}
			// picker默认颜色
			.default {
				color: #808080;
			}
			// 有值的颜色
			.select {
				color: #333;
			}
		}

	}

	.submit {
		margin: 90upx 30upx;
		padding: 0;
		background: #4a85d3;
		color: #fff;
	}

	button:after {
		border: none;
	}
</style>
