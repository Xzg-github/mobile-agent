<template>
	<view class="content">
		<form>
			<view class="form-wrap">
				<view class="regForm-item">
					<picker class="regForm-item-tit" mode="selector" @change="bindWorkType" :value="businessIndex" :range="selectArr[0]" range-key="name">
						<view>
							{{ selectArr[0][businessIndex].name || '请选择' }}
							<text class="iconfont" style="margin-left: 6upx;">&#xe662;</text>
							<text class="tips">*</text>
						</view>
					</picker>
					<input class="ipt" type="text" placeholder="请填写相应的内容">
				</view>
				<view class="regForm-item">
					<view class="regForm-item-tit">联系人<text class="tips">*</text></view>
					<input class="ipt" v-model="contacts" type="text" placeholder="请填写联系人">
				</view>
				<view class="regForm-item">
					<view class="regForm-item-tit">联系人电话<text class="tips">*</text></view>
					<input class="ipt" v-model="contactTelephone" type="text" placeholder="请填写联系人电话">
				</view>
				<view class="regForm-item">
					<view class="regForm-item-tit">同被保人关系<text class="tips">*</text></view>
					<picker class="ipt" mode="selector"  @change="bindRelation" :value="relationIndex" :range="selectArr[1]" range-key="name">
						<view :class="['set', !selectArr[1][relationIndex] ? 'default' : 'select']">{{ selectArr[1][relationIndex].name || '请选择' }}</view>
						<text class="iconfont fr">&#xe672;</text>
					</picker>
				</view>
				<view class="regForm-item">
					<!-- 判断工单类型显示投诉 or 非投诉类 -->
					<view class="regForm-item-tit">工单类型<text class="tips">*</text></view>
					<picker class="ipt" mode="selector"  @change="bindOrder" :value="orderIndex" :range="selectArr[2]" range-key="name">
						<view :class="['set', !selectArr[2][orderIndex] ? 'default' : 'select']">{{ selectArr[2][orderIndex].name || '请选择' }}</view>
						<text class="iconfont fr">&#xe672;</text>
					</picker>
				</view>
				<!-- 当时投诉类的时候显示 -->
				<view class="regForm-item">
					<view class="regForm-item-tit">投诉对象<text class="tips">*</text></view>
					<picker class="ipt" mode="selector"  @change="bindObject" :value="objectIndex" :range="objectArray" range-key="name">
						<view :class="['set', !objectArray[objectIndex] ? 'default' : 'select']">{{ objectArray[objectIndex] || '请选择' }}</view>
						<text class="iconfont fr">&#xe672;</text>
					</picker>
				</view>
				<!-- 当时投诉类的时候显示 -->
				<view class="regForm-item">
					<view class="regForm-item-tit">投诉类型<text class="tips">*</text></view>
					<picker class="ipt" mode="selector"  @change="bindType" :value="typeIndex" :range="typeArray" range-key="name">
						<view :class="['set', !typeArray[typeIndex] ? 'default' : 'select']">{{ typeArray[typeIndex] || '请选择' }}</view>
						<text class="iconfont fr">&#xe672;</text>
					</picker>
				</view>
				<view class="regForm-item">
					<view class="regForm-item-tit">工单来源<text class="tips">*</text></view>
					<picker class="ipt" mode="selector"  @change="bindSource" :value="sourceIndex" :range="selectArr[3]" range-key="name">
						<view :class="['set', !selectArr[3][sourceIndex] ? 'default' : 'select']">{{ selectArr[3][sourceIndex].name || '请选择' }}</view>
						<text class="iconfont fr">&#xe672;</text>
					</picker>
				</view>
				<view class="regForm-item">
					<view class="regForm-item-tit">工单事由<text class="tips">*</text></view>
					<textarea class="ipt textarea" placeholder="请填写工单事由" @blur="bindTextAreaBlur"></textarea>
				</view>
			</view>
			<button class="submit">提交</button>
		</form>
	</view>
</template>

<script>
	export default {
	
		data() {
			return {
				show: 'B',
				selectArr: [[],[],[],[]], //所有下拉列表的值
				businessIndex:'', //业务号
				contacts:'', //联系人
				contactTelephone:'', //联系人电话
				relationIndex: '',  //同被保人关系
				orderIndex: '',  //工单类型
				sourceIndex: '',  //工单来源
				objectIndex: '',  //投诉对象
				typeIndex: '',  //投诉类型
				reason:'' //工单事由
			}
		},
		
		onLoad() {
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
							else if(rs.classify == 'workOrder.insuredRelation'){
								self.selectArr[1].push(self.getItemData(rs))
							}
							else if(rs.classify == 'workOrder.woType'){
								self.selectArr[2].push(self.getItemData(rs))
							}
							else if(rs.classify == 'workOrder.source'){
								self.selectArr[3].push(self.getItemData(rs))
							}
						});
						
					}
				}
			})
			
			uni.request({
			    method: 'POST',
			    url: 'http://192.168.1.176:18020/VideoWorld/createEnterFlowTask.server', 
			    data: {
					ticketId:this.selectArr[2][this.orderIndex].id, //工单类型
					bussinessType:this.selectArr[0][this.businessIndex].id , //业务号类型
					bussinessNo: this.businessIndex, //业务号：对应业务号类型的业务号
					linkName: this.contacts, //联系人名称
					linkPhone: this.contactTelephone, //联系人电话
					reason:this.reason, //工单事由
					channel: this.selectArr[3][this.sourceIndex].id, //工单来源
					identity: this.selectArr[1][this.relationIndex].id //同被保人关系
				},
			    header: {
			        'content-type': 'application/json',
			    }
			    
			})
			.then((data) => {
				console.log(data)
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
			
			changeNav(key) {
				this.show = key
			},
			
			// 选择业务号类型
			bindWorkType(e) {
				this.businessIndex = e.target.value
			},
			
			// 选择同被保人关系
			bindRelation(e) {
				this.relationIndex = e.target.value
			},
			
			// 选择工单类型
			bindOrder(e) {
				this.orderIndex = e.target.value
			},
			
			// 选择工单来源
			bindSource(e) {
				this.sourceIndex = e.target.value
			},
			
			// 选择投诉对象
			bindObject(e) {
				this.objectIndex = e.target.value
			},
			
			// 选择投诉类型
			bindType(e) {
				this.typeIndex = e.target.value
			},
			
			//工单事由
			bindTextAreaBlur(e){
				this.reason = e.target.value
			},
		}
	}
</script>

<style lang="less">
	.content {
		padding-bottom: 100upx;
	}
	.form-wrap {
		margin: 30upx 30upx 80upx 30upx;
		font-size: 28upx;
		
		.regForm-item {
			margin-bottom: 40upx;
			
			.regForm-item-tit {
				font-size: 28upx;
				font-weight: bold;
				color: #55545b;
				padding-bottom: 18upx;
				
				.tips {
					color: #f5222d;
					padding-left: 8upx;
				}
			}
			
			.ipt {
				position: relative;
				display: block;
				padding: 0 10upx;
				background: #f6f6f8;
				height: 70upx;
				line-height: 70upx;
				border-radius: 8upx;
			}
			
			.set {
				width: 100%;
				height: 70upx;
			}
			
			.textarea {
				height: 100upx;
				line-height: 34upx;
				width: 100%;
				box-sizing: border-box;
			}
			
			.fr {
				position: absolute;
				top: 5upx;
				right: 16upx;
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
		margin: 90upx 30upx 30upx 30upx;
		padding: 0;
		background: #4a85d3;
		color: #fff;
	}
	
	button:after {
		border: none;
	}
</style>


