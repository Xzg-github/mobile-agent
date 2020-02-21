<script>
	import {  mapState,  mapMutations  } from 'vuex';
	export default {
		
		//computed: mapState(['phone']), 
		
		methods: {
			 //...mapMutations(['setPhoneReceiveObj'])
		},
		
		onLaunch: function() {
			
			var self = this
			
			
			//更新版本
			const updateManager = uni.getUpdateManager();
			updateManager.onCheckForUpdate(function(res) {
				// 请求完新版本信息的回调
				console.log(res.hasUpdate);
			});
			
			updateManager.onUpdateReady(function(res) {
				uni.showModal({
					title: '更新提示',
					showCancel: false,
					content: '新版本已经准备好，是否重启应用？',
					success(res) {
						if (res.confirm) {
							// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
							updateManager.applyUpdate();
						}
					}
				});
			
			});
			
		},
		
		onShow: function() {
			console.log('App Show')
		},
		
		onHide: function() {
			console.log('App Hide')
		},

	}
</script>

<style >
	/*每个页面公共css */
	
	
	/* @import url("/components/gaoyia-parse/parse.css"); */
	/* 字体图标 */
	@font-face {
		font-family: 'iconfont';
		src: url('./static/font/iconfont.eot');
		src: url('./static/font/iconfont.eot?#iefix') format('embedded-opentype'),
			 url('./static/font/iconfont.woff2') format('woff2'),
			 url('./static/font/iconfont.woff') format('woff'),
			 url('./static/font/iconfont.ttf') format('truetype'),
			 url('./static/font/iconfont.svg#iconfont') format('svg');
	}

	.iconfont {
		font-family: "iconfont" !important;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}
	
</style>
