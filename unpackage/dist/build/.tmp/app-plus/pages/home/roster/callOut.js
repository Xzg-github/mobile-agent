(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/home/roster/callOut"],{"373b":function(t,e,n){"use strict";(function(t){n("4976"),n("832f");i(n("66fd"));var e=i(n("7f7b"));function i(t){return t&&t.__esModule?t:{default:t}}t(e.default)}).call(this,n("6e42")["createPage"])},4459:function(t,e,n){"use strict";n.r(e);var i=n("96d1"),a=n.n(i);for(var o in i)"default"!==o&&function(t){n.d(e,t,function(){return i[t]})}(o);e["default"]=a.a},"76cc":function(t,e,n){"use strict";var i=function(){var t=this,e=t.$createElement;t._self._c},a=[];n.d(e,"a",function(){return i}),n.d(e,"b",function(){return a})},"7f7b":function(t,e,n){"use strict";n.r(e);var i=n("76cc"),a=n("4459");for(var o in a)"default"!==o&&function(t){n.d(e,t,function(){return a[t]})}(o);n("cf4b");var s=n("2877"),r=Object(s["a"])(a["default"],i["a"],i["b"],!1,null,null,null);e["default"]=r.exports},"96d1":function(t,e,n){"use strict";(function(t,i){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var a=n("2f62");function o(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{},i=Object.keys(n);"function"===typeof Object.getOwnPropertySymbols&&(i=i.concat(Object.getOwnPropertySymbols(n).filter(function(t){return Object.getOwnPropertyDescriptor(n,t).enumerable}))),i.forEach(function(e){s(t,e,n[e])})}return t}function s(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}n("2200");var r=function(){return n.e("components/ContactInfo").then(n.bind(null,"7030"))},c=function(){return n.e("components/ContactHistory").then(n.bind(null,"2abe"))},u=function(){return n.e("components/Questionnaire").then(n.bind(null,"b230"))},h=function(){return n.e("components/Service").then(n.bind(null,"d85e"))},d=function(){return n.e("components/BasicInfo").then(n.bind(null,"dc2b"))},l=function(){return n.e("components/Softphone").then(n.bind(null,"9416"))},p={components:{ContactInfo:r,ContactHistory:c,Questionnaire:u,Service:h,BasicInfo:d,Softphone:l},data:function(){return{pageName:"详情",phone:"",tel:"",newPhone:"",province:"",city:"",phoneCode:"",campaignId:"",id:"",batchId:"",customerCode:"",customerName:"",customInfoObj:"",show:"A",questionnaireId:"",typeCode:"",picket_item_2:0,questionData:{},ajaxobj_rs:{},multiIndex:[0,0,0],questionObj:{},picketData:[],lastConnectTime:"",yes:"N",nextSubjectId:"0",prev_arr:["0"],prev_id:0,infoArr:[],endDate:"",starDate:"",cus_info:"",boot:!1,textArea:"",dial:!1,socketObj:{},callid:"",startTime:"",toCallFlag:!1,contentTime:"",endTime:"",contentState:""}},computed:o({},(0,a.mapState)(["hasLogin","uerInfo"]),{phoneReceiveObj:function(){return console.log(t("computed method in Home.vue"," at pages\\home\\roster\\callOut.vue:129")),this.$store.state.phoneReceiveObj}}),watch:{phoneReceiveObj:function(e,n){console.log(t("watch method in Home.vue"," at pages\\home\\roster\\callOut.vue:136")),this.socketObj=e}},onLoad:function(t){var e=this;this.campaignId=t.campaignId,this.id=t.id,this.batchId=t.batchId,this.phone=t.phone,this.customerCode=t.customerCode,this.customerName=t.customerName,this.questionnaireId=t.questionnaireId,this.typeCode=t.serviceType,this.endDate=this.getCurrentDays(),this.starDate=this.getPrevMonthDays(),this.getBasicInfo(),this.changeNav("A"),this.tel=this.geTel(this.phone),this.pageName="详情",i.request({method:"GET",url:this.apiDomian+"/serviceType/findTreeByCode",data:{typeCode:e.typeCode},header:{"content-type":"application/json",Authorization:"Arch6WithCloud "+e.uerInfo.token}}).then(function(t){var n=t[1].data.data.children;e.ajaxobj_rs=n;var i=e.setPickerData(n),a=[],o=[];n[0]&&(a=e.setPickerData(n[0].children),n[0].children[0]&&(o=e.setPickerData(n[0].children[0].children)));var s=[];s.push(i),s.push(a),s.push(o),e.picketData=s}),i.request({method:"GET",url:this.apiDomian+"/phoneArea/getRegion",data:{phoneArea:e.phone},header:{"content-type":"application/json",Authorization:"Arch6WithCloud "+e.uerInfo.token}}).then(function(t){var n=t[1].data.data;e.province=n.province,e.city=n.city,e.phoneCode=n.phoneCode})},methods:{connectFlag:function(t){this.contentState=t},getPageLen:function(t){this.page_len=t},setStateActiveCallId:function(t){this.callid=t},callStartTime:function(t){this.contentTime=t},callEndTime:function(t){this.endTime=t},task_info:function(){var t=this;i.showLoading({title:"加载中"});var e=this;i.request({method:"GET",url:this.apiDomian+"/batchTask/info",data:{campaignId:e.campaignId,id:e.id},header:{"content-type":"application/json",Authorization:"Arch6WithCloud "+e.uerInfo.token}}).then(function(e){i.hideLoading(),t.customInfoObj=e[1].data.data})},history_info:function(){var t=this,e=this;i.request({method:"GET",url:this.apiDomian+"/contact/page",data:{callFrom:e.phone,callDirection:"",agentId:"",agentName:"",startDate:e.starDate,endDate:e.endDate},header:{"content-type":"application/json",Authorization:"Arch6WithCloud "+e.uerInfo.token}}).then(function(e){e[1].data.data&&(t.infoArr=e[1].data.data.records)})},geTel:function(t){var e=/^(\d{3})\d{4}(\d{4})$/;return t.replace(e,"$1****$2")},getBasicInfo:function(){var t=this;i.request({method:"GET",url:this.apiDomian+"/customer/list/"+this.phone,data:{},header:{"content-type":"application/json",Authorization:"Arch6WithCloud "+this.uerInfo.token}}).then(function(e){e[1].data.data?t.cus_info=e[1].data.data[0]:t.cus_info=""})},getLastimes:function(){var t=new Date,e=t.getFullYear(),n=t.getMonth()+1;n=n<10?"0"+n:n;var i=t.getDate(),a=t.getHours()<10?"0"+t.getHours():t.getHours(),o=t.getMinutes()<10?"0"+t.getMinutes():t.getMinutes(),s=t.getSeconds()<10?"0"+t.getSeconds():t.getSeconds(),r=e+"-"+n+"-"+i+" "+a+":"+o+":"+s;this.lastConnectTime=r},getCurrentDays:function(){var t=new Date,e=t.getFullYear(),n=t.getMonth()+1;n=n<10?"0"+n:n;var i=t.getDate();i=i<10?"0"+i:i;var a=e+"-"+n+"-"+i;return a},getPrevMonthDays:function(){var t=this.endDate,e=t.split("-"),n=e[0],i=e[1],a=e[2],o=new Date(n,i,0);o=o.getDate();var s=n,r=parseInt(i)-1;0==r&&(s=parseInt(s)-1,r=12);var c=a,u=new Date(s,r,0);u=u.getDate(),c>u&&(c=u),r<10&&(r="0"+r);var h=s+"-"+r+"-"+c;return h},getPickerData:function(t,e){this.multiIndex=t,this.picketData=e},getTimeData:function(t,e,n){this.yes=t,this.date=e,this.time=n},serviceLog:function(t){this.textArea=t},changeNav:function(t){this.show=t,"A"==this.show&&""==this.customInfoObj?this.task_info():"U"==this.show&&""==this.infoArr&&this.history_info()},getValue:function(t){var e=this;if("H"==t){i.showLoading({title:"加载中"});var n=this;i.request({method:"GET",url:this.apiDomian+"/exam/"+n.questionnaireId,data:{},header:{"content-type":"application/json"}}).then(function(t){i.hideLoading();var n=t[1].data.data;e.questionData=n})}},toCall:function(){var t=this;if(t.toCallFlag=!0,!t.uerInfo.extension)return i.showToast({title:"软电话未登录",duration:2e3,icon:"none"}),!1;t.show="H",t.boot=!0,t.dial=!0,t.apiinsAdd(),t.getLastimes(),t.getValue("H"),i.request({method:"GET",url:t.apiDomian+"/phoneArea/getDialNumber",data:{phone:t.phone,code:"0755"},header:{"content-type":"application/x-www-form-urlencoded"}}).then(function(e){var n="9"+e[1].data.data;t.newPhone=n,i.sendSocketMessage({data:"Method|make_call|"+t.newPhone+"|"})}),i.request({method:"GET",url:t.apiDomian+"/examSubject/next/"+t.questionnaireId+"/"+t.nextSubjectId,data:{},header:{"content-type":"application/json",Authorization:"Arch6WithCloud "+t.uerInfo.token}}).then(function(e){var n=e[1].data.data;t.questionObj=n})},apiinsAdd:function(){var t=this;i.request({method:"POST",url:this.apiDomian+"/serviceLog/apiinsAdd",data:{callType:"0",ani:t.uerInfo.extension,dnis:this.phone,customerCode:"null"==t.customerCode?"":t.customerCode,customerName:"null"==t.customerName?"":t.customerName,userCode:t.uerInfo.username,userName:t.uerInfo.nickname,organCode:t.uerInfo.organCode,organNamee:t.uerInfo.organName,agentNo:t.uerInfo.extension,serviceLog:"",campaignId:t.campaignId,batchId:t.batchId,taskId:t.id,phoneCode:t.phoneCode,province:t.province,city:t.city,callId:t.callid,callStartTime:t.contentTime},header:{"content-type":"application/json",Authorization:"Arch6WithCloud "+this.uerInfo.token}}).then(function(t){})},formSubmit:function(){var t=this,e=this;if(0==e.toCallFlag)return i.showToast({title:"请先进行外呼",duration:2e3,icon:"none"}),!1;var n={callType:0,connectStatus:""==this.contentState?"N":"Y",id:this.id,lastConnectTime:this.lastConnectTime,orderPhone:this.phone,orderStatus:this.yes,serviceResult1:this.picketData[0][this.multiIndex[0]].name,serviceType1:this.picketData[0][this.multiIndex[0]].id,validStatus:3};this.picketData[1][this.multiIndex[1]]&&(n.serviceResult2=this.picketData[1][this.multiIndex[1]].name,n.serviceType2=this.picketData[1][this.multiIndex[1]].id,this.picketData[2][this.multiIndex[2]]&&(n.serviceResult3=this.picketData[2][this.multiIndex[2]].name,n.serviceType3=this.picketData[2][this.multiIndex[2]].id)),"Y"==this.yes&&(n.orderTime=this.date+" "+this.time),i.request({method:"GET",url:this.apiDomian+"/batchTask/update",data:n,header:{"content-type":"application/json",Authorization:"Arch6WithCloud "+e.uerInfo.token}}).then(function(e){t.apiinsEdit(),i.showToast({title:"提交成功",duration:2e3}),i.setStorage({key:"endPhoneFlag",data:!0,success:function(){}})})},apiinsEdit:function(){var t=this,e={serviceResult1:this.picketData[0][this.multiIndex[0]].name,serviceType1:this.picketData[0][this.multiIndex[0]].id,serviceLog:this.textArea,callId:t.callid,callEndTime:t.endTime};this.picketData[1][this.multiIndex[1]]&&(e.serviceResult2=this.picketData[1][this.multiIndex[1]].name,e.serviceType2=this.picketData[1][this.multiIndex[1]].id,this.picketData[2][this.multiIndex[2]]&&(e.serviceResult3=this.picketData[2][this.multiIndex[2]].name,e.serviceType3=this.picketData[2][this.multiIndex[2]].id)),i.request({method:"POST",url:this.apiDomian+"/serviceLog/apiinsEdit",data:e,header:{"content-type":"application/json",Authorization:"Arch6WithCloud "+t.uerInfo.token}}).then(function(t){})},loadQuestionList:function(t,e,n){"add"==n?(this.prev_id=this.prev_id+1,this.prev_arr[this.prev_id]=e):this.prev_id=this.prev_id-1,this.questionObj=t},setPickerData:function(t){if(t){var e=[];for(var n in t){var i={};i.id=t[n].id,i.name=t[n].typeName,e.push(i)}return e}}}};e.default=p}).call(this,n("0de9")["default"],n("6e42")["default"])},cf4b:function(t,e,n){"use strict";var i=n("fc58"),a=n.n(i);a.a},fc58:function(t,e,n){}},[["373b","common/runtime","common/vendor"]]]);