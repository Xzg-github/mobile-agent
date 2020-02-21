<template>
	<view>
		<picker class="ipt clearfix" mode="multiSelector" @columnchange="picketChange" :value="multiIndex" range-key="name" :range="picketData" >
			<view class="set">
				{{picketData[0][multiIndex[0]].name}}
				{{picketData[1][multiIndex[1]].name || ''}}
				{{picketData[2][multiIndex[2]].name || ''}}
			</view>
			<text class="iconfont fr">&#xe672;</text>
		</picker>
		
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
			}
		},
		
		methods: {
			// 服务类型的三级联动
			picketChange(e){
				var val = e.detail.value
				
				console.log(this.ajaxobj_rs[val].children)
				if(e.detail.column == '0'){
					this.picket_item_2 = val
					var item1 = this.picketData[0]
					var item2 =  this.setPickerData(this.ajaxobj_rs[val].children)
					var item3 = []
					if(this.ajaxobj_rs[val].children[0]){
						item3 =  this.setPickerData(this.ajaxobj_rs[val].children[0].children)
					}
					
					
					this.multiIndex[0] = val
				}else if(e.detail.column == '1'){
					var item1 = this.picketData[0]
					var item2 =  this.picketData[1]
					var item3 =  this.setPickerData(this.ajaxobj_rs[this.picket_item_2].children[val].children)
					
					this.multiIndex[1] = val
				}else if(e.detail.column == '2'){
					var item1 = this.picketData[0]
					var item2 =  this.picketData[1]
					var item3 = this.picketData[2]
					
					this.multiIndex[2] = val
				}
				
				// 向父级传值
				let picketData_temp = []
				picketData_temp.push(item1)
				picketData_temp.push(item2)
				picketData_temp.push(item3)
				this.$emit("getPickerData", this.multiIndex, picketData_temp);
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
	
	
		.item,
		.section {
			padding-bottom: 20upx;
			display: flex;
	
			.picker-box {
				font-size: 26upx;
				width: 80%;
				box-sizing: border-box;
				padding: 0 6upx;
				height: 48upx;
				line-height: 48upx;
				border: 1upx solid #ccc;
			}
			
			.picker {
				position: relative;
				width: 100%;
				height: 100%;
				
				.down {
					position: absolute;
					right:0;
					top: 0;
				}
			}
	
			.item-mane {
				width: 20%;
			}
	
			textarea {
				width: 80%;
				height: 100upx;
				border: 1upx solid #ccc;
			}
	
			.iconfont {
				display: block;
				padding: 3upx 6upx 0 0;
				font-size: 30upx;
			}
	
			.icn {
				color: #4a85d3;
			}
		}
	}
</style>
