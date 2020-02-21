(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/softphone/Callcontent"],{"47e2":function(t,n,e){"use strict";(function(t){Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var e={props:["timer","stra","strb","strc"],data:function(){return{}},methods:{changeClose:function(){this.$emit("close")},Hangup:function(){var n="Method|hangup|"+this.stra;t.sendSocketMessage({data:n})}}};n.default=e}).call(this,e("6e42")["default"])},"6acc":function(t,n,e){"use strict";e.r(n);var a=e("8372"),u=e("bf17");for(var r in u)"default"!==r&&function(t){e.d(n,t,function(){return u[t]})}(r);var o=e("2877"),c=Object(o["a"])(u["default"],a["a"],a["b"],!1,null,null,null);n["default"]=c.exports},8372:function(t,n,e){"use strict";var a=function(){var t=this,n=t.$createElement;t._self._c},u=[];e.d(n,"a",function(){return a}),e.d(n,"b",function(){return u})},bf17:function(t,n,e){"use strict";e.r(n);var a=e("47e2"),u=e.n(a);for(var r in a)"default"!==r&&function(t){e.d(n,t,function(){return a[t]})}(r);n["default"]=u.a}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/softphone/Callcontent-create-component',
    {
        'components/softphone/Callcontent-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('6e42')['createComponent'](__webpack_require__("6acc"))
        })
    },
    [['components/softphone/Callcontent-create-component']]
]);
