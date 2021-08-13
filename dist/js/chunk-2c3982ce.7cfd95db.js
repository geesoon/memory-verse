(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2c3982ce"],{"027c":function(e,t,i){"use strict";var a=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("v-card",{staticClass:"verse-selection-container",attrs:{flat:""}},[i("v-toolbar",{attrs:{flat:""}},[i("div",{staticClass:"verse-nav-bar"},[i("div",[i("span",{staticClass:"material-icons",on:{click:function(t){return e.goBack()}}},[e._v(" arrow_back ")])]),i("span",{staticClass:"material-icons",on:{click:function(t){return e.resetPanelState()}}},[e._v(" clear ")])])]),"book"==this.getBibleBookSelectionPanelView?i("div",{staticClass:"books-overlay-container"},[i("div",{staticClass:"testament-title"},[i("span",{staticClass:"material-icons"},[e._v(" book ")]),e._v(" Old Testament ")]),i("div",{staticClass:"books-list-container"},e._l(e.OTBooks,(function(t){return i("div",{key:t.id,staticClass:"books-title",on:{click:function(i){return e.showBookChaptersPanel(t.id)}}},[e._v(" "+e._s(t.abbreviation)+" ")])})),0),i("div",{staticClass:"testament-title"},[i("span",{staticClass:"material-icons"},[e._v(" book ")]),e._v("New Testament ")]),i("div",{staticClass:"books-list-container"},e._l(e.NTBooks,(function(t){return i("div",{key:t.id,staticClass:"books-title",on:{click:function(i){return e.showBookChaptersPanel(t.id)}}},[e._v(" "+e._s(t.abbreviation)+" ")])})),0)]):e._e(),"chapter"==this.getBibleBookSelectionPanelView?i("div",{staticClass:"chapters-overlay-container"},[i("div",{staticClass:"book-verses-title"},[i("span",[e._v(" "+e._s(this.getSelection.book.name)+" ")])]),i("div",{staticClass:"chapter-list-container"},e._l(e.numOfChapters,(function(t){return i("div",{key:t,staticClass:"chapter-title-box",on:{click:function(i){return e.showChaptersVersesPanel(t)}}},[e._v(" "+e._s(t)+" ")])})),0)]):e._e(),"verse"==this.getBibleBookSelectionPanelView?i("div",{staticClass:"verses-overlay-container"},[i("div",{staticClass:"book-verses-title"},[i("span",[e._v(" "+e._s(this.getSelection.book.name+" "+this.getSelection.chapter)+" ")]),i("button",{staticClass:"add-verse-btn",on:{click:function(t){return e.finishSelection()}}},[e._v("Add")])]),e.isLoadingVerses?e._e():i("div",{staticClass:"verse-list-container"},e._l(e.numOfVerses,(function(t){return i("div",{key:t,staticClass:"verse-title-box",attrs:{id:"v"+t},on:{click:function(i){return e.updateSelectionVerse(t,"v"+t)}}},[e._v(" v"+e._s(t)+" ")])})),0)]):e._e(),"verse"==this.getBibleBookSelectionPanelView?i("div",{staticClass:"select-verse-bar"},[i("button",{staticClass:"select-verse-btn",on:{click:function(t){return e.finishSelection()}}},[e._v("Add")])]):e._e(),i("loading-overlay",{attrs:{active:e.isLoadingVerses,"is-full-page":e.fullPage}})],1)},n=[],o=(i("1276"),i("ac1f"),i("d3b7"),i("7db0"),i("b0c0"),i("f22b")),s={data:function(){return{NTBooks:[],OTBooks:[],bibleBooks:o.books,numOfChapters:"",numOfVerses:"",isLoadingVerses:!1,isStartAlert:!1,isStartVerse:!0,fullPage:!0}},computed:{getSelection:function(){return this.$store.getters.getVerseInfo.selection},getSelectedBookId:function(){return this.$store.getters.getSelectedBookId},getBibleBookSelectionPanelView:function(){return"chapter"==this.$store.getters.getBibleBookSelectionPanelView&&this.showBookChaptersPanel(this.getSelectedBookId),this.$store.getters.getBibleBookSelectionPanelView}},methods:{finishSelection:function(){""==this.getSelection.chapter&&""!=this.getSelection.book.id?alert("Please select a chapter"):""==this.getSelection.book.id?alert("Please select a book"):(this.$emit("updateVerse"),this.$emit("answer"))},goBack:function(){"book"==this.getBibleBookSelectionPanelView?this.$emit("closeDialog"):"chapter"==this.getBibleBookSelectionPanelView?(this.$store.commit("setChapter",""),this.$store.commit("setBibleBookSelectionPanelView","book")):(this.$store.commit("setStartVerse",""),this.$store.commit("setEndVerse",""),this.$store.commit("setBibleBookSelectionPanelView","chapter"))},updateSelectionVerse:function(e,t){if(this.isStartVerse){for(var i=1;i<=this.numOfVerses;i++)document.getElementById("v".concat(i)).classList="verse-title-box";document.getElementById(t).classList="verse-title-box-active",this.$store.commit("setStartVerse",e),this.isStartVerse=!1}else{var a=this.getSelection.startVerse;if(t.split("v")[1]>a){for(var n=a;n<=t.split("v")[1];n++)document.getElementById("v".concat(n)).classList="verse-title-box-active";this.$store.commit("setEndVerse",e)}this.isStartVerse=!0}},resetPanelState:function(){this.$store.commit("resetSelection"),this.$emit("closeDialog")},showChaptersVersesPanel:function(e){var t=this;this.isLoadingVerses=!0,this.$store.commit("setChapter",e),this.$store.commit("setBibleBookSelectionPanelView","verse");var i=new Headers;i.append("api-key","ea2400ebed2327b5e1b9595f416366e0");var a=new Request("https://api.scripture.api.bible/v1/bibles/de4e12af7f28f599-02/chapters/".concat(this.getSelection.book.id+"."+e,"/verses"),{methods:"GET",headers:i});fetch(a).then((function(e){if(e.ok)return t.isLoadingVerses=!1,e.json();throw new Error("Fail to retrieve verses, please refresh the page")})).then((function(e){t.numOfVerses=e.data.length})).catch((function(e){t.isLoadingVerses=!1,alert(e)}))},showBookChaptersPanel:function(e){var t={id:"",name:""};this.numOfChapters=this.bibleBooks.find((function(t){return t.id===e})).length,t.id=e,t.name=this.bibleBooks.find((function(t){return t.id===e})).name,this.$store.commit("setBook",t),this.$store.commit("setSelectedBookId",t.id),this.$store.commit("setBibleBookSelectionPanelView","chapter")},parseData:function(){for(var e=!1,t=0;t<this.bibleBooks.length;t++)e?this.NTBooks.push(this.bibleBooks[t]):"MAT"==this.bibleBooks[t].id?(e=!0,this.NTBooks.push(this.bibleBooks[t])):this.OTBooks.push(this.bibleBooks[t])}},mounted:function(){this.parseData()}},r=s,l=(i("db5c"),i("2877")),h=i("6544"),c=i.n(h),d=i("b0af"),b=i("71d9"),f=Object(l["a"])(r,a,n,!1,null,null,null);t["a"]=f.exports;c()(f,{VCard:d["a"],VToolbar:b["a"]})},"36a7":function(e,t,i){},"5e23":function(e,t,i){},"71d9":function(e,t,i){"use strict";var a=i("3835"),n=i("5530"),o=(i("a9e3"),i("0481"),i("5e23"),i("8dd9")),s=i("53ca"),r=(i("a15b"),i("8a79"),i("2ca0"),i("8efc"),i("90a2")),l=(i("36a7"),i("24b2")),h=i("58df"),c=Object(h["a"])(l["a"]).extend({name:"v-responsive",props:{aspectRatio:[String,Number],contentClass:String},computed:{computedAspectRatio:function(){return Number(this.aspectRatio)},aspectStyle:function(){return this.computedAspectRatio?{paddingBottom:1/this.computedAspectRatio*100+"%"}:void 0},__cachedSizer:function(){return this.aspectStyle?this.$createElement("div",{style:this.aspectStyle,staticClass:"v-responsive__sizer"}):[]}},methods:{genContent:function(){return this.$createElement("div",{staticClass:"v-responsive__content",class:this.contentClass},this.$slots.default)}},render:function(e){return e("div",{staticClass:"v-responsive",style:this.measurableStyles,on:this.$listeners},[this.__cachedSizer,this.genContent()])}}),d=c,b=i("7560"),f=i("d9f7"),m=i("d9bd"),g="undefined"!==typeof window&&"IntersectionObserver"in window,u=Object(h["a"])(d,b["a"]).extend({name:"v-img",directives:{intersect:r["a"]},props:{alt:String,contain:Boolean,eager:Boolean,gradient:String,lazySrc:String,options:{type:Object,default:function(){return{root:void 0,rootMargin:void 0,threshold:void 0}}},position:{type:String,default:"center center"},sizes:String,src:{type:[String,Object],default:""},srcset:String,transition:{type:[Boolean,String],default:"fade-transition"}},data:function(){return{currentSrc:"",image:null,isLoading:!0,calculatedAspectRatio:void 0,naturalWidth:void 0,hasError:!1}},computed:{computedAspectRatio:function(){return Number(this.normalisedSrc.aspect||this.calculatedAspectRatio)},normalisedSrc:function(){return this.src&&"object"===Object(s["a"])(this.src)?{src:this.src.src,srcset:this.srcset||this.src.srcset,lazySrc:this.lazySrc||this.src.lazySrc,aspect:Number(this.aspectRatio||this.src.aspect)}:{src:this.src,srcset:this.srcset,lazySrc:this.lazySrc,aspect:Number(this.aspectRatio||0)}},__cachedImage:function(){if(!(this.normalisedSrc.src||this.normalisedSrc.lazySrc||this.gradient))return[];var e=[],t=this.isLoading?this.normalisedSrc.lazySrc:this.currentSrc;this.gradient&&e.push("linear-gradient(".concat(this.gradient,")")),t&&e.push('url("'.concat(t,'")'));var i=this.$createElement("div",{staticClass:"v-image__image",class:{"v-image__image--preload":this.isLoading,"v-image__image--contain":this.contain,"v-image__image--cover":!this.contain},style:{backgroundImage:e.join(", "),backgroundPosition:this.position},key:+this.isLoading});return this.transition?this.$createElement("transition",{attrs:{name:this.transition,mode:"in-out"}},[i]):i}},watch:{src:function(){this.isLoading?this.loadImage():this.init(void 0,void 0,!0)},"$vuetify.breakpoint.width":"getSrc"},mounted:function(){this.init()},methods:{init:function(e,t,i){if(!g||i||this.eager){if(this.normalisedSrc.lazySrc){var a=new Image;a.src=this.normalisedSrc.lazySrc,this.pollForSize(a,null)}this.normalisedSrc.src&&this.loadImage()}},onLoad:function(){this.getSrc(),this.isLoading=!1,this.$emit("load",this.src),this.image&&(this.normalisedSrc.src.endsWith(".svg")||this.normalisedSrc.src.startsWith("data:image/svg+xml"))&&(this.image.naturalHeight&&this.image.naturalWidth?(this.naturalWidth=this.image.naturalWidth,this.calculatedAspectRatio=this.image.naturalWidth/this.image.naturalHeight):this.calculatedAspectRatio=1)},onError:function(){this.hasError=!0,this.$emit("error",this.src)},getSrc:function(){this.image&&(this.currentSrc=this.image.currentSrc||this.image.src)},loadImage:function(){var e=this,t=new Image;this.image=t,t.onload=function(){t.decode?t.decode().catch((function(t){Object(m["c"])("Failed to decode image, trying to render anyway\n\n"+"src: ".concat(e.normalisedSrc.src)+(t.message?"\nOriginal error: ".concat(t.message):""),e)})).then(e.onLoad):e.onLoad()},t.onerror=this.onError,this.hasError=!1,this.sizes&&(t.sizes=this.sizes),this.normalisedSrc.srcset&&(t.srcset=this.normalisedSrc.srcset),t.src=this.normalisedSrc.src,this.$emit("loadstart",this.normalisedSrc.src),this.aspectRatio||this.pollForSize(t),this.getSrc()},pollForSize:function(e){var t=this,i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:100,a=function a(){var n=e.naturalHeight,o=e.naturalWidth;n||o?(t.naturalWidth=o,t.calculatedAspectRatio=o/n):e.complete||!t.isLoading||t.hasError||null==i||setTimeout(a,i)};a()},genContent:function(){var e=d.options.methods.genContent.call(this);return this.naturalWidth&&this._b(e.data,"div",{style:{width:"".concat(this.naturalWidth,"px")}}),e},__genPlaceholder:function(){if(this.$slots.placeholder){var e=this.isLoading?[this.$createElement("div",{staticClass:"v-image__placeholder"},this.$slots.placeholder)]:[];return this.transition?this.$createElement("transition",{props:{appear:!0,name:this.transition}},e):e[0]}}},render:function(e){var t=d.options.render.call(this,e),i=Object(f["a"])(t.data,{staticClass:"v-image",attrs:{"aria-label":this.alt,role:this.alt?"img":void 0},class:this.themeClasses,directives:g?[{name:"intersect",modifiers:{once:!0},value:{handler:this.init,options:this.options}}]:void 0});return t.children=[this.__cachedSizer,this.__cachedImage,this.__genPlaceholder(),this.genContent()],e(t.tag,i,t.children)}}),v=i("80d2");t["a"]=o["a"].extend({name:"v-toolbar",props:{absolute:Boolean,bottom:Boolean,collapse:Boolean,dense:Boolean,extended:Boolean,extensionHeight:{default:48,type:[Number,String]},flat:Boolean,floating:Boolean,prominent:Boolean,short:Boolean,src:{type:[String,Object],default:""},tag:{type:String,default:"header"}},data:function(){return{isExtended:!1}},computed:{computedHeight:function(){var e=this.computedContentHeight;if(!this.isExtended)return e;var t=parseInt(this.extensionHeight);return this.isCollapsed?e:e+(isNaN(t)?0:t)},computedContentHeight:function(){return this.height?parseInt(this.height):this.isProminent&&this.dense?96:this.isProminent&&this.short?112:this.isProminent?128:this.dense?48:this.short||this.$vuetify.breakpoint.smAndDown?56:64},classes:function(){return Object(n["a"])(Object(n["a"])({},o["a"].options.computed.classes.call(this)),{},{"v-toolbar":!0,"v-toolbar--absolute":this.absolute,"v-toolbar--bottom":this.bottom,"v-toolbar--collapse":this.collapse,"v-toolbar--collapsed":this.isCollapsed,"v-toolbar--dense":this.dense,"v-toolbar--extended":this.isExtended,"v-toolbar--flat":this.flat,"v-toolbar--floating":this.floating,"v-toolbar--prominent":this.isProminent})},isCollapsed:function(){return this.collapse},isProminent:function(){return this.prominent},styles:function(){return Object(n["a"])(Object(n["a"])({},this.measurableStyles),{},{height:Object(v["f"])(this.computedHeight)})}},created:function(){var e=this,t=[["app","<v-app-bar app>"],["manual-scroll",'<v-app-bar :value="false">'],["clipped-left","<v-app-bar clipped-left>"],["clipped-right","<v-app-bar clipped-right>"],["inverted-scroll","<v-app-bar inverted-scroll>"],["scroll-off-screen","<v-app-bar scroll-off-screen>"],["scroll-target","<v-app-bar scroll-target>"],["scroll-threshold","<v-app-bar scroll-threshold>"],["card","<v-app-bar flat>"]];t.forEach((function(t){var i=Object(a["a"])(t,2),n=i[0],o=i[1];e.$attrs.hasOwnProperty(n)&&Object(m["a"])(n,o,e)}))},methods:{genBackground:function(){var e={height:Object(v["f"])(this.computedHeight),src:this.src},t=this.$scopedSlots.img?this.$scopedSlots.img({props:e}):this.$createElement(u,{props:e});return this.$createElement("div",{staticClass:"v-toolbar__image"},[t])},genContent:function(){return this.$createElement("div",{staticClass:"v-toolbar__content",style:{height:Object(v["f"])(this.computedContentHeight)}},Object(v["n"])(this))},genExtension:function(){return this.$createElement("div",{staticClass:"v-toolbar__extension",style:{height:Object(v["f"])(this.extensionHeight)}},Object(v["n"])(this,"extension"))}},render:function(e){this.isExtended=this.extended||!!this.$scopedSlots.extension;var t=[this.genContent()],i=this.setBackgroundColor(this.color,{class:this.classes,style:this.styles,on:this.$listeners});return this.isExtended&&t.push(this.genExtension()),(this.src||this.$scopedSlots.img)&&t.unshift(this.genBackground()),e(this.tag,i,t)}})},"8a79":function(e,t,i){"use strict";var a=i("23e7"),n=i("06cf").f,o=i("50c4"),s=i("5a34"),r=i("1d80"),l=i("ab13"),h=i("c430"),c="".endsWith,d=Math.min,b=l("endsWith"),f=!h&&!b&&!!function(){var e=n(String.prototype,"endsWith");return e&&!e.writable}();a({target:"String",proto:!0,forced:!f&&!b},{endsWith:function(e){var t=String(r(this));s(e);var i=arguments.length>1?arguments[1]:void 0,a=o(t.length),n=void 0===i?a:d(o(i),a),l=String(e);return c?c.call(t,l,n):t.slice(n-l.length,n)===l}})},"8efc":function(e,t,i){},cb51:function(e,t,i){},db5c:function(e,t,i){"use strict";i("cb51")},f22b:function(e){e.exports=JSON.parse('{"books":[{"id":"GEN","bibleId":"de4e12af7f28f599-02","abbreviation":"Gen","name":"Genesis","nameLong":"The First Book of Moses, called Genesis","length":50},{"id":"EXO","bibleId":"de4e12af7f28f599-02","abbreviation":"Exo","name":"Exodus","nameLong":"The Second Book of Moses, called Exodus","length":40},{"id":"LEV","bibleId":"de4e12af7f28f599-02","abbreviation":"Lev","name":"Leviticus","nameLong":"The Third Book of Moses, called Leviticus","length":27},{"id":"NUM","bibleId":"de4e12af7f28f599-02","abbreviation":"Num","name":"Numbers","nameLong":"The Fourth Book of Moses, called Numbers","length":36},{"id":"DEU","bibleId":"de4e12af7f28f599-02","abbreviation":"Deu","name":"Deuteronomy","nameLong":"The Fifth Book of Moses, called Deuteronomy","length":34},{"id":"JOS","bibleId":"de4e12af7f28f599-02","abbreviation":"Jos","name":"Joshua","nameLong":"The Book of Joshua","length":24},{"id":"JDG","bibleId":"de4e12af7f28f599-02","abbreviation":"Jdg","name":"Judges","nameLong":"The Book of Judges","length":21},{"id":"RUT","bibleId":"de4e12af7f28f599-02","abbreviation":"Rut","name":"Ruth","nameLong":"The Book of Ruth","length":4},{"id":"1SA","bibleId":"de4e12af7f28f599-02","abbreviation":"1Sa","name":"1 Samuel","nameLong":"The First Book of Samuel Otherwise Called The First Book of the Kings","length":31},{"id":"2SA","bibleId":"de4e12af7f28f599-02","abbreviation":"2Sa","name":"2 Samuel","nameLong":"The Second Book of Samuel Otherwise Called The Second Book of the Kings","length":24},{"id":"1KI","bibleId":"de4e12af7f28f599-02","abbreviation":"1Ki","name":"1 Kings","nameLong":"The First Book of the Kings, Commonly Called the Third Book of the Kings","length":22},{"id":"2KI","bibleId":"de4e12af7f28f599-02","abbreviation":"2Ki","name":"2 Kings","nameLong":"The Second Book of the Kings, Commonly Called the Fourth Book of the Kings","length":25},{"id":"1CH","bibleId":"de4e12af7f28f599-02","abbreviation":"1Ch","name":"1 Chronicles","nameLong":"The First Book of the Chronicles","length":29},{"id":"2CH","bibleId":"de4e12af7f28f599-02","abbreviation":"2Ch","name":"2 Chronicles","nameLong":"The Second Book of the Chronicles","length":36},{"id":"EZR","bibleId":"de4e12af7f28f599-02","abbreviation":"Ezr","name":"Ezra","nameLong":"Ezra","length":10},{"id":"NEH","bibleId":"de4e12af7f28f599-02","abbreviation":"Neh","name":"Nehemiah","nameLong":"The Book of Nehemiah","length":13},{"id":"EST","bibleId":"de4e12af7f28f599-02","abbreviation":"Est","name":"Esther","nameLong":"The Book of Esther","length":10},{"id":"JOB","bibleId":"de4e12af7f28f599-02","abbreviation":"Job","name":"Job","nameLong":"The Book of Job","length":42},{"id":"PSA","bibleId":"de4e12af7f28f599-02","abbreviation":"Psa","name":"Psalms","nameLong":"The Book of Psalms","length":150},{"id":"PRO","bibleId":"de4e12af7f28f599-02","abbreviation":"Pro","name":"Proverbs","nameLong":"The Proverbs","length":31},{"id":"ECC","bibleId":"de4e12af7f28f599-02","abbreviation":"Ecc","name":"Ecclesiastes","nameLong":"Ecclesiastes or, the Preacher","length":12},{"id":"SNG","bibleId":"de4e12af7f28f599-02","abbreviation":"Sng","name":"Song of Solomon","nameLong":"The Song of Solomon","length":8},{"id":"ISA","bibleId":"de4e12af7f28f599-02","abbreviation":"Isa","name":"Isaiah","nameLong":"The Book of the Prophet Isaiah","length":66},{"id":"JER","bibleId":"de4e12af7f28f599-02","abbreviation":"Jer","name":"Jeremiah","nameLong":"The Book of the Prophet Jeremiah","length":52},{"id":"LAM","bibleId":"de4e12af7f28f599-02","abbreviation":"Lam","name":"Lamentations","nameLong":"The Lamentations of Jeremiah","length":5},{"id":"EZK","bibleId":"de4e12af7f28f599-02","abbreviation":"Ezk","name":"Ezekiel","nameLong":"The Book of the Prophet Ezekiel","length":48},{"id":"DAN","bibleId":"de4e12af7f28f599-02","abbreviation":"Dan","name":"Daniel","nameLong":"The Book of Daniel","length":12},{"id":"HOS","bibleId":"de4e12af7f28f599-02","abbreviation":"Hos","name":"Hosea","nameLong":"Hosea","length":14},{"id":"JOL","bibleId":"de4e12af7f28f599-02","abbreviation":"Jol","name":"Joel","nameLong":"Joel","length":3},{"id":"AMO","bibleId":"de4e12af7f28f599-02","abbreviation":"Amo","name":"Amos","nameLong":"Amos","length":9},{"id":"OBA","bibleId":"de4e12af7f28f599-02","abbreviation":"Oba","name":"Obadiah","nameLong":"Obadiah","length":1},{"id":"JON","bibleId":"de4e12af7f28f599-02","abbreviation":"Jon","name":"Jonah","nameLong":"Jonah","length":4},{"id":"MIC","bibleId":"de4e12af7f28f599-02","abbreviation":"Mic","name":"Micah","nameLong":"Micah","length":7},{"id":"NAM","bibleId":"de4e12af7f28f599-02","abbreviation":"Nam","name":"Nahum","nameLong":"Nahum","length":3},{"id":"HAB","bibleId":"de4e12af7f28f599-02","abbreviation":"Hab","name":"Habakkuk","nameLong":"Habakkuk","length":3},{"id":"ZEP","bibleId":"de4e12af7f28f599-02","abbreviation":"Zep","name":"Zephaniah","nameLong":"Zephaniah","length":3},{"id":"HAG","bibleId":"de4e12af7f28f599-02","abbreviation":"Hag","name":"Haggai","nameLong":"Haggai","length":2},{"id":"ZEC","bibleId":"de4e12af7f28f599-02","abbreviation":"Zec","name":"Zechariah","nameLong":"Zechariah","length":14},{"id":"MAL","bibleId":"de4e12af7f28f599-02","abbreviation":"Mal","name":"Malachi","nameLong":"Malachi","length":4},{"id":"MAT","bibleId":"de4e12af7f28f599-02","abbreviation":"Mat","name":"Matthew","nameLong":"THE GOSPEL ACCORDING TO ST. MATTHEW","length":28},{"id":"MRK","bibleId":"de4e12af7f28f599-02","abbreviation":"Mrk","name":"Mark","nameLong":"THE GOSPEL ACCORDING TO ST. MARK","length":16},{"id":"LUK","bibleId":"de4e12af7f28f599-02","abbreviation":"Luk","name":"Luke","nameLong":"THE GOSPEL ACCORDING TO ST. LUKE","length":24},{"id":"JHN","bibleId":"de4e12af7f28f599-02","abbreviation":"Jhn","name":"John","nameLong":"THE GOSPEL ACCORDING TO ST. JOHN","length":21},{"id":"ACT","bibleId":"de4e12af7f28f599-02","abbreviation":"Act","name":"Acts","nameLong":"THE ACTS OF THE APOSTLES","length":28},{"id":"ROM","bibleId":"de4e12af7f28f599-02","abbreviation":"Rom","name":"Romans","nameLong":"THE EPISTLE OF PAUL THE APOSTLE TO THE ROMANS","length":16},{"id":"1CO","bibleId":"de4e12af7f28f599-02","abbreviation":"1Co","name":"1 Corinthians","nameLong":"THE FIRST EPISTLE OF PAUL THE APOSTLE TO THE CORINTHIANS","length":16},{"id":"2CO","bibleId":"de4e12af7f28f599-02","abbreviation":"2Co","name":"2 Corinthians","nameLong":"THE SECOND EPISTLE OF PAUL THE APOSTLE TO THE CORINTHIANS","length":13},{"id":"GAL","bibleId":"de4e12af7f28f599-02","abbreviation":"Gal","name":"Galatians","nameLong":"THE EPISTLE OF PAUL THE APOSTLE TO THE GALATIANS","length":6},{"id":"EPH","bibleId":"de4e12af7f28f599-02","abbreviation":"Eph","name":"Ephesians","nameLong":"THE EPISTLE OF PAUL THE APOSTLE TO THE EPHESIANS","length":6},{"id":"PHP","bibleId":"de4e12af7f28f599-02","abbreviation":"Php","name":"Philippians","nameLong":"THE EPISTLE OF PAUL THE APOSTLE TO THE PHILIPPIANS","length":4},{"id":"COL","bibleId":"de4e12af7f28f599-02","abbreviation":"Col","name":"Colossians","nameLong":"THE EPISTLE OF PAUL THE APOSTLE TO THE COLOSSIANS","length":4},{"id":"1TH","bibleId":"de4e12af7f28f599-02","abbreviation":"1Th","name":"1 Thessalonians","nameLong":"THE FIRST EPISTLE OF PAUL THE APOSTLE TO THE THESSALONIANS","length":5},{"id":"2TH","bibleId":"de4e12af7f28f599-02","abbreviation":"2Th","name":"2 Thessalonians","nameLong":"THE SECOND EPISTLE OF PAUL THE APOSTLE TO THE THESSALONIANS","length":3},{"id":"1TI","bibleId":"de4e12af7f28f599-02","abbreviation":"1Ti","name":"1 Timothy","nameLong":"THE FIRST EPISTLE OF PAUL THE APOSTLE TO TIMOTHY","length":6},{"id":"2TI","bibleId":"de4e12af7f28f599-02","abbreviation":"2Ti","name":"2 Timothy","nameLong":"THE SECOND EPISTLE OF PAUL THE APOSTLE TO TIMOTHY","length":4},{"id":"TIT","bibleId":"de4e12af7f28f599-02","abbreviation":"Tit","name":"Titus","nameLong":"THE EPISTLE OF PAUL THE APOSTLE TO TITUS","length":3},{"id":"PHM","bibleId":"de4e12af7f28f599-02","abbreviation":"Phm","name":"Philemon","nameLong":"THE EPISTLE OF PAUL THE APOSTLE TO PHILEMON","length":1},{"id":"HEB","bibleId":"de4e12af7f28f599-02","abbreviation":"Heb","name":"Hebrews","nameLong":"THE EPISTLE OF PAUL THE APOSTLE TO THE HEBREWS","length":13},{"id":"JAS","bibleId":"de4e12af7f28f599-02","abbreviation":"Jas","name":"James","nameLong":"THE GENERAL EPISTLE OF JAMES","length":5},{"id":"1PE","bibleId":"de4e12af7f28f599-02","abbreviation":"1Pe","name":"1 Peter","nameLong":"THE FIRST EPISTLE GENERAL OF PETER","length":5},{"id":"2PE","bibleId":"de4e12af7f28f599-02","abbreviation":"2Pe","name":"2 Peter","nameLong":"THE SECOND EPISTLE GENERAL OF PETER","length":3},{"id":"1JN","bibleId":"de4e12af7f28f599-02","abbreviation":"1Jn","name":"1 John","nameLong":"THE FIRST EPISTLE GENERAL OF JOHN","length":5},{"id":"2JN","bibleId":"de4e12af7f28f599-02","abbreviation":"2Jn","name":"2 John","nameLong":"THE SECOND EPISTLE OF JOHN","length":1},{"id":"3JN","bibleId":"de4e12af7f28f599-02","abbreviation":"3Jn","name":"3 John","nameLong":"THE THIRD EPISTLE OF JOHN","length":1},{"id":"JUD","bibleId":"de4e12af7f28f599-02","abbreviation":"Jud","name":"Jude","nameLong":"THE GENERAL EPISTLE OF JUDE","length":1},{"id":"REV","bibleId":"de4e12af7f28f599-02","abbreviation":"Rev","name":"Revelation","nameLong":"THE REVELATION OF ST. JOHN THE DIVINE","length":22}]}')}}]);
//# sourceMappingURL=chunk-2c3982ce.7cfd95db.js.map