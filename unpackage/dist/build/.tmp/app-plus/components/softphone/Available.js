(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/softphone/Available"],{"055c":function(e,t,n){"use strict";n.r(t);var a=n("d86a"),u=n("3496");for(var o in u)"default"!==o&&function(e){n.d(t,e,function(){return u[e]})}(o);var s=n("2877"),c=Object(s["a"])(u["default"],a["a"],a["b"],!1,null,null,null);t["default"]=c.exports},3496:function(e,t,n){"use strict";n.r(t);var a=n("77d7"),u=n.n(a);for(var o in a)"default"!==o&&function(e){n.d(t,e,function(){return a[e]})}(o);t["default"]=u.a},"77d7":function(e,t,n){"use strict";(function(e){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n={props:["timer"],data:function(){return{selectIndex:"",selectArr:[]}},mounted:function(){var t=this;e.getStorage({key:"allDate",success:function(e){e.data&&(t.allDate=e.data,t.allDate.forEach(function(e){"busy.reason"==e.classify&&t.selectArr.push(t.getItemData(e))}))}})},methods:{getItemData:function(e){var t={};return t.name=e.dataValue,t.id=e.dataKey,t},changeClose:function(){this.$emit("close")},Agentauxwork:function(t){var n=this;n.selectIndex=t.target.value;var a="Method|agent_auxwork|3|0";e.sendSocketMessage({data:a,success:function(){"0"==n.selectArr[n.selectIndex].id?n.$emit("funa",4,""):n.$emit("funa",2,n.selectArr[n.selectIndex].name)}})},Agentlogout:function(){e.sendSocketMessage({data:"Method|agent_logout|1",success:function(e){JSON.stringify(e)}}),setTimeout(function(){e.sendSocketMessage({data:"Method|de_init"})},1e3)}}};t.default=n}).call(this,n("6e42")["default"])},d86a:function(e,t,n){"use strict";var a=function(){var e=this,t=e.$createElement;e._self._c},u=[];n.d(t,"a",function(){return a}),n.d(t,"b",function(){return u})}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/softphone/Available-create-component',
    {
        'components/softphone/Available-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('6e42')['createComponent'](__webpack_require__("055c"))
        })
    },
    [['components/softphone/Available-create-component']]
]);