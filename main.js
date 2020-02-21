import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

// vuex
import store from './store' 
Vue.prototype.$store = store  



// 设置公共的接口地址
Vue.prototype.websiteUrl = 'http://uniapp.dcloud.io';
Vue.prototype.apiDomian = 'https://zkr-dev.apiins.com/api/misc' //测试环境
//Vue.prototype.apiDomian = 'http://192.168.1.176:18020' 
//Vue.prototype.apiDomian = 'http://192.168.1.110:18020'
//Vue.prototype.apiDomian = 'http://172.10.6.162:18020'
//Vue.prototype.apiDomian = 'http://192.168.1.210:9001'
  
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
