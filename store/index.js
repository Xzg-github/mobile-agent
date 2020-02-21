import Vue from 'vue'
import Vuex from 'vuex'
//import phone from './phone'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		uerInfo: {}, //用户信息（登入接口返回）
		hasLogin: false,
		phoneReceiveObj: {}, // 软电话接收socket对象
		newsReceiveObj:{}, //消息接收socket对象
	},
	getters: {
		//软电话
		phoneReceiveObj(state) {
			return state.phoneReceiveObj
		},
		//消息
		newsReceiveObj(state) {
			return state.newsReceiveObj
		}
		
	},
	mutations: {
		login(state, provider) { //改变登录状态  
			console.log(provider)
			state.hasLogin = true
			state.uerInfo.nickname = provider.nickname //用户姓名
			state.uerInfo.username = provider.username //用户工号
			state.uerInfo.agentNo = provider.agentNo //仅软电话socket   data的工号使用
			state.uerInfo.organName = provider.organName //组织机构名称
			state.uerInfo.organCode = provider.organCode; //组织机构代码
			state.uerInfo.organId = provider.organId; //组织机构id
			state.uerInfo.roleNames = provider.roleNames //角色名称列表（数组形式的字符串）
			state.uerInfo.token = provider.token //登录token,后续请求头需带上（Arch6WithCloud+" "+token)）
			state.uerInfo.id = provider.id //用户id
			state.uerInfo.extension = provider.extension //分机号
			state.uerInfo.port = provider.port //软电话IP端口
			state.uerInfo.ctiIp = provider.ctiIp //软电话IP地址
			state.uerInfo.areaCode = provider.areaCode //归属地区号
			state.uerInfo.platformType = provider.platformType //判断客户  3、亚太  4、aspect
			uni.setStorage({ //将用户信息保存在本地  
				key: 'uerInfo',
				data: provider
			})
		},
		logout(state) { //退出登录  
			state.hasLogin = false
			state.uerInfo = {}
			uni.removeStorage({
				key: 'uerInfo'
			})
		},

		// 设置 软电话接收socket对象
		setPhoneReceiveObj(state, provider) {
			//console.log('store:')
			//console.log(provider)
			state.phoneReceiveObj = provider
		},
		
		// 设置 消息接收socket对象
		setNewsReceiveObj(state, provider) {
			//console.log('store:')
			//console.log(provider)
			state.newsReceiveObj = provider
		},
	}
})
  
export default store
