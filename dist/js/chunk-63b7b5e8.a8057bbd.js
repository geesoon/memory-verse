(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-63b7b5e8"],{"2cfd":function(e,s,t){"use strict";t("e314")},"73cf":function(e,s,t){"use strict";t.r(s);var i=function(){var e=this,s=e.$createElement,t=e._self._c||s;return t("section",{staticClass:"register-container"},[t("div",{staticClass:"register-header"},[t("div",{staticClass:"home-title-top-left",on:{click:e.gotoHome}},[e._v("Memory Verse")]),e._m(0)]),e.isLoading?t("div",{staticStyle:{"text-align":"center"}},[t("p",[e._v("Registering...")]),t("v-progress-circular",{attrs:{indeterminate:"",color:"primary"}})],1):t("v-form",{staticClass:"register-form",on:{submit:function(s){return s.preventDefault(),e.register(s)}}},[t("v-text-field",{attrs:{label:"Email",rules:[e.rules.email]},model:{value:e.email,callback:function(s){e.email=s},expression:"email"}}),t("v-text-field",{attrs:{"append-icon":e.showPassword?"mdi-eye":"mdi-eye-off",type:e.showPassword?"text":"password",rules:[e.rules.required,e.rules.min],label:"Password"},on:{"click:append":function(s){e.showPassword=!e.showPassword}},model:{value:e.password,callback:function(s){e.password=s},expression:"password"}}),t("v-btn",{attrs:{depressed:"",color:"action"},on:{click:e.register}},[e._v("Sign Up")])],1),t("div",{staticClass:"sign-in-tip"},[t("span",[e._v("Already have an account? "),t("br"),t("router-link",{staticClass:"sign-in-link",attrs:{to:"/"}},[e._v("Log In")])],1)])],1)},r=[function(){var e=this,s=e.$createElement,t=e._self._c||s;return t("div",{staticClass:"register-info"},[t("p",{staticClass:"sign-up"},[e._v("Sign Up")]),t("p",[e._v("Create your own verse collection with an account.")])])}],a=t("2591"),n={data:function(){return{email:"",password:"",showPassword:!1,rules:{required:function(e){return!!e||"Required."},min:function(e){return e.length>=8||"Min 8 characters"},email:function(e){var s=/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;return s.test(e)||"Invalid e-mail."}},isLoading:!1}},methods:{gotoHome:function(){this.$router.push({path:"/"})},register:function(){var e=this;this.isLoading=!0,a["a"].auth().createUserWithEmailAndPassword(this.email,this.password).then((function(){e.$store.dispatch("setAlert",{message:"Successfully registered! Please login.",type:"success"}),e.$router.push("/")})).catch((function(s){e.$store.dispatch("setAlert",{message:s.message,type:"warning"})})),this.isLoading=!1}}},o=n,c=(t("2cfd"),t("2877")),l=t("6544"),u=t.n(l),d=t("8336"),p=t("4bd4"),f=t("490a"),m=t("8654"),g=Object(c["a"])(o,i,r,!1,null,null,null);s["default"]=g.exports;u()(g,{VBtn:d["a"],VForm:p["a"],VProgressCircular:f["a"],VTextField:m["a"]})},e314:function(e,s,t){}}]);
//# sourceMappingURL=chunk-63b7b5e8.a8057bbd.js.map