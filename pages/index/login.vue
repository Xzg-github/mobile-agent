<template>
	<view class="content">
		<form @submit="formSubmit">
			<image class="logo" mode="widthFix" src="../../static/images/login-Img.jpg"></image>
			<view class="login">
				<text style="font-weight: bold;text-align: center;display: block;">智能呼叫中心</text>
				<view style="margin-top:50upx;">
					<view class="list">
						<text class="iconfont">&#xe614;</text>
						<input class="ipt" v-model="obj.username" placeholder="请输入用户名"/>
					</view>
					<view class="list">
						<text class="iconfont">&#xe64a;</text>
						<input class="ipt" v-model="obj.password" password placeholder="请输入密码"/>
					</view>
					<view class="list">
						<text class="iconfont">&#xe671;</text>
						<input class="ipt" type="number" v-model="obj.extension" placeholder="请输入分机号"/>
					</view>
				</view>
				<button type="primary" formType="submit">登录</button>
			</view>
		</form>
	</view>
</template>

<script>
	
	import md5 from 'js_sdk/js-md5/src/md5.js'
	import { mapState,  mapMutations } from 'vuex';  
	
	export default {
		
		// 提取存储数据
		//computed: mapState(['hasLogin','uerInfo']), 
		
		data() {
			return {
				obj: {
				    username: '', //用户名
				    password: '', //密码
				    extension: '' //分机
				},
				agentNo: '' ,//工号（仅socket 里data里传）
				port: '',//软电话IP端口
				ctiIp:'',//软电话IP地址
				areaCode:'' ,//归属地区号
				platformType: '', //3、亚太 4、aspect
			}
		},
		
		onLoad() {

			//获取数据缓存
			var self = this
			uni.getStorage({
				key: 'userObj',
				success: function(res) {
					if (res.data) {
						self.obj.username = res.data.username //工号
						self.obj.password = res.data.password //密码
						self.obj.extension = res.data.extension //分机
					}
				}
			})

		},
		
		methods: {
			//...mapMutations(['setPhoneReceiveObj']),
			//提交表单
			formSubmit(){  
			    var self = this
				// 登入判断
				if (self.obj.username == '') {
					uni.showModal({
					    title: '提示',
					    content: '请输入用户名',
					    showCancel: false,
					})
					return false;
				}else if (self.obj.password == '') {
					uni.showModal({
					    title: '提示',
					    content: '请输入密码',
					    showCancel: false,
					})
					return false;
				}else{
					//填写的数据缓存
					var userObj = {}
					userObj.username = this.obj.username //用户名
					userObj.password = this.obj.password //密码
					userObj.extension = this.obj.extension //分机

					uni.setStorage({
						key: 'userObj',
						data: userObj,
						
					});
	
					uni.showLoading({
						title: '加载中'
					});
					uni.request({
					    method: 'POST',
					    url: this.apiDomian+'/jwt/oauth', 
					    data: {
							username: self.obj.username,
							password: md5(self.obj.password),
							tenantCode: 'default' //默认为“default”
						},
					    header: {
					        'content-type' : 'application/x-www-form-urlencoded',
					    }
					    
					})
					.then((data) => {
						uni.hideLoading();
						var obj = data[1].data
						if(obj.status != '200'){
						    uni.showModal({
								title: '提示',
								content: obj.statusText,
								showCancel: false,
						    })
						}else{ 
							// 存储登录数据
							var token = obj.data.token; //登录token,后续请求头需带上（Arch6WithCloud+" "+token)
							var id = obj.data.id
							
							// 获取字典的值
							uni.request({
							    method: 'GET',
							    url: this.apiDomian+'/dictionary/useable', 
							    data: {
								},
							    header: {
							        'content-type': 'application/json',
									'Authorization': 'Arch6WithCloud ' + token
							    }
							    
							})
							.then((data) => {
								var allDate = []
								allDate = data[1].data.data
								uni.setStorage({
									key: 'allDate',
									data: allDate,
									success: function() {
									}
								});
							
							})
							
							//获取软电话接口用到的工号及其他接口需要用到的电话归属地区号
							uni.request({
								method: 'GET',
								url: this.apiDomian+'/platform/jwt/'+id, //登入接口传的id
								data: {},
								header: {
									'content-type': 'application/json',
									'Authorization': 'Arch6WithCloud ' + token
								}
								
							})
							.then((data) => {
								self.agentNo = data[1].data.data.agent.agentNo//工号（仅socket 里data里传）
								self.areaCode = data[1].data.data.areaCode //手机区号
								self.platformType = data[1].data.data.platformType //判断客户  3、亚太  4、aspect
								var ctiIpPort = data[1].data.data.ctiIpPort.split(':')
								self.port = ctiIpPort[0] //软电话IP端口
								self.ctiIp = ctiIpPort[1] //软电话IP地址
								
								var rs = {} //存储登录数据
								rs.areaCode = self.areaCode; //归属地区号
								rs.nickname = obj.data.nickname; //用户姓名
								rs.username = obj.data.username; //用户工号
								rs.agentNo = self.agentNo; //工号（仅socket 里data里传）
								rs.organName = obj.data.organName; //组织机构名称
								rs.organId = obj.data.organId;//组织机构id
								rs.organCode = obj.data.organCode; //组织机构代码
								rs.roleNames = obj.data.roleNames.slice(1, -1); //角色名称列表（数组形式的字符串）
								rs.id = obj.data.id; //用户id
								rs.token = obj.data.token; //登录token,后续请求头需带上（Arch6WithCloud+" "+token）
								rs.extension = self.obj.extension;  //分机号
								rs.port = self.port //IP端口
								rs.ctiIp = self.ctiIp //IP地址
								rs.platformType = self.platformType //判断客户  3、亚太  4、aspect
								this.login(rs) 
								
								//在线坐席登入（aspect不需要请求此接口）
								if( self.platformType == '3'){
									uni.showLoading({
										title: '加载中'
									});
									uni.request({
										method: 'POST',
										url: this.apiDomian+'/onlineAgent/login', 
										data: {
											agentId: this.obj.username, //工号
											agentName: obj.data.nickname,//姓名 
											phoneNo: self.obj.extension //分机号
										},
										header: {
											'content-type': 'application/json',
											'Authorization': 'Arch6WithCloud ' + token
										}
										
									}).then((data) => {
										uni.hideLoading();
										var code = data[1].data.errCode
										if( code != '0' ){
											uni.showModal({
												title: '提示',
												content: data[1].data.errMsg,
												showCancel: false,
											});
											return false
										}else {
											// 跳转到首页
											uni.reLaunch({
												url: '/pages/index/home'
											})
										}
									})
								}else{
									uni.reLaunch({
										url: '/pages/index/home'
									})
								}
								
							})
							
						}
					})
					
				}
			},
			...mapMutations(['login'])  
		}
	}
</script>

<style lang="less">

	.logo {
		display: block;
		width: 100%;
	}
	.login {
		padding: 0upx 15% 0 15%;
		font-size: 46upx;

		.list {
			padding: 0 20upx;
			display: flex;
			align-items: center;
			height: 100upx;
			margin-bottom: 46upx;
			font-size: 34upx;
			border-bottom: 1upx solid #C0C0C0;
			
			.iconfont {
				display: block;
				font-size: 36upx;
				color: #555;
				padding-right: 40upx;
			}
			
			.ipt {
			  width: 100%;
			  padding: 14upx 0;
			}
		}
		
		button {
			margin-top: 88upx;
			background: none;
			border: 2upx solid #4a85d3;
			color: #4a85d3;
			border-radius: 14upx;
		}
		
		button:after {
			border: none;
		}
		
		.button-hover {
			background-color: #4a85d3;
			color: #fff;
		}

	}
	
</style>
