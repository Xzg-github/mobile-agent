(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/gaoyia-parse/components/wxParseTemplate0"],{"487d":function(e,n,t){"use strict";t.r(n);var a=t("b251"),r=t("a1f1");for(var o in r)"default"!==o&&function(e){t.d(n,e,function(){return r[e]})}(o);var s=t("2877"),u=Object(s["a"])(r["default"],a["a"],a["b"],!1,null,null,null);n["default"]=u.exports},"8f75":function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var a=function(){return Promise.resolve().then(t.bind(null,"487d"))},r=function(){return t.e("components/gaoyia-parse/components/wxParseImg").then(t.bind(null,"e076"))},o=function(){return t.e("components/gaoyia-parse/components/wxParseVideo").then(t.bind(null,"cfe2"))},s=function(){return t.e("components/gaoyia-parse/components/wxParseAudio").then(t.bind(null,"e69a"))},u=function(){return t.e("components/gaoyia-parse/components/wxParseTable").then(t.bind(null,"02f8"))},i={name:"wxParseTemplate",props:{node:{}},components:{wxParseTemplate:a,wxParseImg:r,wxParseVideo:o,wxParseAudio:s,wxParseTable:u},methods:{wxParseATap:function(e,n){var t=n.currentTarget.dataset.href;if(t){var a=this.$parent;while(!a.preview||"function"!==typeof a.preview)a=a.$parent;a.navigate(t,n,e)}}}};n.default=i},a1f1:function(e,n,t){"use strict";t.r(n);var a=t("8f75"),r=t.n(a);for(var o in a)"default"!==o&&function(e){t.d(n,e,function(){return a[e]})}(o);n["default"]=r.a},b251:function(e,n,t){"use strict";var a=function(){var e=this,n=e.$createElement,t=(e._self._c,(e.node.text+"").replace(/^\s+|\s+$/g,""));e.$mp.data=Object.assign({},{$root:{g0:t}})},r=[];t.d(n,"a",function(){return a}),t.d(n,"b",function(){return r})}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/gaoyia-parse/components/wxParseTemplate0-create-component',
    {
        'components/gaoyia-parse/components/wxParseTemplate0-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('6e42')['createComponent'](__webpack_require__("487d"))
        })
    },
    [['components/gaoyia-parse/components/wxParseTemplate0-create-component']]
]);
