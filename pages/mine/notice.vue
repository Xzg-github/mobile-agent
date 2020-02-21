<template>
	<view>
		<News></News>
		<view class="inner">
			<view class="title">{{obj.noticeTitle}}</view>
			<view class="content"><u-parse :content="obj.content" /></view>
			<view class="bottom">
				<view>创建人：{{obj.createName}}</view>
				<view>创建时间：{{obj.sendTime}}</view>
			</view>
		</view>
	</view>
</template>
	
<script>
	import uParse from '@/components/gaoyia-parse/parse.vue'
	import News from "@/components/News.vue";
	import { mapState,  mapMutations } from 'vuex';
	
	export default {
		// 提取存储数据
		computed: mapState(['hasLogin','uerInfo']), 
		
		components: {
		    uParse,
			News
		},
		data() {
			return {
				obj:{},
			}
		},
		
		onLoad(options) {
			var self = this
			uni.getStorage({
				key: 'newContent',
				success: function(res) {
					self.obj = res.data
					self.readNew()//更新已读消息
				}
			})

		},
		methods: {
			//更新已读消息
			readNew(){
				var self = this
				uni.request({
				    method: 'POST',
				    url: this.apiDomian+'/news/readNew', 
				    data: {
						msgId: self.obj.msgId,
						agentId: self.uerInfo.username
					},
				    header: {
				        'content-type' : 'application/json',
						'Authorization': 'Arch6WithCloud ' + self.uerInfo.token
				    }
				    
				})
				.then((data) => {
				
				})
			}
		}
	}
</script>

<style lang="less">
	.inner {
		margin: 50upx 30upx 30upx 30upx;
		padding: 20upx;
		
		.title {
			padding-bottom: 40upx;
			text-align: center;
			font-size: 34upx;
			font-weight: bold;
		}
		
		.content {
			text-indent: 2em;
			font-size: 28upx;
			line-height: 40upx;
		}
		
		.bottom {
			padding-top: 50upx;
			display: flex;
			justify-content: space-between;
			font-size: 24upx;
			color: #808080;
		}
	}
	
</style>


