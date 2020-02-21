(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/softphone/Answer"],{"20b8":function(t,e,n){"use strict";(function(t,n){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var o={props:["stra","strb","timer"],data:function(){return{}},methods:{changeClose:function(){this.$emit("close")},Answer:function(){var e="Method|answer|"+this.strb;console.log(t(e," at components\\softphone\\Answer.vue:45")),n.sendSocketMessage({data:e})}}};e.default=o}).call(this,n("0de9")["default"],n("6e42")["default"])},"5e84":function(t,e,n){"use strict";n.r(e);var o=n("f1fe"),r=n("b362");for(var u in r)"default"!==u&&function(t){n.d(e,t,function(){return r[t]})}(u);var a=n("2877"),s=Object(a["a"])(r["default"],o["a"],o["b"],!1,null,null,null);e["default"]=s.exports},b362:function(t,e,n){"use strict";n.r(e);var o=n("20b8"),r=n.n(o);for(var u in o)"default"!==u&&function(t){n.d(e,t,function(){return o[t]})}(u);e["default"]=r.a},f1fe:function(t,e,n){"use strict";var o=function(){var t=this,e=t.$createElement;t._self._c},r=[];n.d(e,"a",function(){return o}),n.d(e,"b",function(){return r})}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/softphone/Answer-create-component',
    {
        'components/softphone/Answer-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('6e42')['createComponent'](__webpack_require__("5e84"))
        })
    },
    [['components/softphone/Answer-create-component']]
]);
