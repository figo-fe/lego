(this.webpackJsonplego=this.webpackJsonplego||[]).push([[11],{177:function(e,t,n){var i=n(130),o=i.getLayoutRect,r=i.box,l=i.positionElement,a=n(128),s=n(120);t.layout=function(e,t,n){var i=t.getBoxLayoutParams(),a=t.get("padding"),s={width:n.getWidth(),height:n.getHeight()},c=o(i,s,a);r(t.get("orient"),e,t.get("itemGap"),c.width,c.height),l(e,i,s,a)},t.makeBackground=function(e,t){var n=a.normalizeCssArray(t.get("padding")),i=t.getItemStyle(["color","opacity"]);return i.fill=t.get("backgroundColor"),e=new s.Rect({shape:{x:e.x-n[3],y:e.y-n[0],width:e.width+n[1]+n[3],height:e.height+n[0]+n[2],r:t.get("borderRadius")},style:i,silent:!0,z2:-1})}},352:function(e,t,n){var i=n(119),o=n(118),r=n(129),l=n(121).isNameSpecified,a=n(136).legend.selector,s={all:{type:"all",title:o.clone(a.all)},inverse:{type:"inverse",title:o.clone(a.inverse)}},c=i.extendComponentModel({type:"legend.plain",dependencies:["series"],layoutMode:{type:"box",ignoreSize:!0},init:function(e,t,n){this.mergeDefaultAndTheme(e,n),e.selected=e.selected||{},this._updateSelector(e)},mergeOption:function(e){c.superCall(this,"mergeOption",e),this._updateSelector(e)},_updateSelector:function(e){var t=e.selector;!0===t&&(t=e.selector=["all","inverse"]),o.isArray(t)&&o.each(t,(function(e,n){o.isString(e)&&(e={type:e}),t[n]=o.merge(e,s[e.type])}))},optionUpdated:function(){this._updateData(this.ecModel);var e=this._data;if(e[0]&&"single"===this.get("selectedMode")){for(var t=!1,n=0;n<e.length;n++){var i=e[n].get("name");if(this.isSelected(i)){this.select(i),t=!0;break}}!t&&this.select(e[0].get("name"))}},_updateData:function(e){var t=[],n=[];e.eachRawSeries((function(i){var o,r=i.name;if(n.push(r),i.legendVisualProvider){var a=i.legendVisualProvider.getAllNames();e.isSeriesFiltered(i)||(n=n.concat(a)),a.length?t=t.concat(a):o=!0}else o=!0;o&&l(i)&&t.push(i.name)})),this._availableNames=n;var i=this.get("data")||t,a=o.map(i,(function(e){return"string"!==typeof e&&"number"!==typeof e||(e={name:e}),new r(e,this,this.ecModel)}),this);this._data=a},getData:function(){return this._data},select:function(e){var t=this.option.selected;if("single"===this.get("selectedMode")){var n=this._data;o.each(n,(function(e){t[e.get("name")]=!1}))}t[e]=!0},unSelect:function(e){"single"!==this.get("selectedMode")&&(this.option.selected[e]=!1)},toggleSelected:function(e){var t=this.option.selected;t.hasOwnProperty(e)||(t[e]=!0),this[t[e]?"unSelect":"select"](e)},allSelect:function(){var e=this._data,t=this.option.selected;o.each(e,(function(e){t[e.get("name",!0)]=!0}))},inverseSelect:function(){var e=this._data,t=this.option.selected;o.each(e,(function(e){var n=e.get("name",!0);t.hasOwnProperty(n)||(t[n]=!0),t[n]=!t[n]}))},isSelected:function(e){var t=this.option.selected;return!(t.hasOwnProperty(e)&&!t[e])&&o.indexOf(this._availableNames,e)>=0},getOrient:function(){return"vertical"===this.get("orient")?{index:1,name:"vertical"}:{index:0,name:"horizontal"}},defaultOption:{zlevel:0,z:4,show:!0,orient:"horizontal",left:"center",top:0,align:"auto",backgroundColor:"rgba(0,0,0,0)",borderColor:"#ccc",borderRadius:0,borderWidth:0,padding:5,itemGap:10,itemWidth:25,itemHeight:14,inactiveColor:"#ccc",inactiveBorderColor:"#ccc",itemStyle:{borderWidth:0},textStyle:{color:"#333"},selectedMode:!0,selector:!1,selectorLabel:{show:!0,borderRadius:10,padding:[3,5,3,5],fontSize:12,fontFamily:" sans-serif",color:"#666",borderWidth:1,borderColor:"#666"},emphasis:{selectorLabel:{show:!0,color:"#eee",backgroundColor:"#666"}},selectorPosition:"auto",selectorItemGap:7,selectorButtonGap:10,tooltip:{show:!1}}}),d=c;e.exports=d},353:function(e,t,n){var i=n(119),o=n(118);function r(e,t,n){var i,r={},l="toggleSelected"===e;return n.eachComponent("legend",(function(n){l&&null!=i?n[i?"select":"unSelect"](t.name):"allSelect"===e||"inverseSelect"===e?n[e]():(n[e](t.name),i=n.isSelected(t.name));var a=n.getData();o.each(a,(function(e){var t=e.get("name");if("\n"!==t&&""!==t){var i=n.isSelected(t);r.hasOwnProperty(t)?r[t]=r[t]&&i:r[t]=i}}))})),"allSelect"===e||"inverseSelect"===e?{selected:r}:{name:t.name,selected:r}}i.registerAction("legendToggleSelect","legendselectchanged",o.curry(r,"toggleSelected")),i.registerAction("legendAllSelect","legendselectall",o.curry(r,"allSelect")),i.registerAction("legendInverseSelect","legendinverseselect",o.curry(r,"inverseSelect")),i.registerAction("legendSelect","legendselected",o.curry(r,"select")),i.registerAction("legendUnSelect","legendunselected",o.curry(r,"unSelect"))},354:function(e,t,n){n(122).__DEV__;var i=n(119),o=n(118),r=n(156).createSymbol,l=n(120),a=n(177).makeBackground,s=n(130),c=o.curry,d=o.each,g=l.Group,u=i.extendComponentView({type:"legend.plain",newlineDisabled:!1,init:function(){this.group.add(this._contentGroup=new g),this._backgroundEl,this.group.add(this._selectorGroup=new g),this._isFirstRender=!0},getContentGroup:function(){return this._contentGroup},getSelectorGroup:function(){return this._selectorGroup},render:function(e,t,n){var i=this._isFirstRender;if(this._isFirstRender=!1,this.resetInner(),e.get("show",!0)){var r=e.get("align"),l=e.get("orient");r&&"auto"!==r||(r="right"===e.get("left")&&"vertical"===l?"right":"left");var c=e.get("selector",!0),d=e.get("selectorPosition",!0);!c||d&&"auto"!==d||(d="horizontal"===l?"end":"start"),this.renderInner(r,e,t,n,c,l,d);var g=e.getBoxLayoutParams(),u={width:n.getWidth(),height:n.getHeight()},h=e.get("padding"),p=s.getLayoutRect(g,u,h),f=this.layoutInner(e,r,p,i,c,d),m=s.getLayoutRect(o.defaults({width:f.width,height:f.height},g),u,h);this.group.attr("position",[m.x-f.x,m.y-f.y]),this.group.add(this._backgroundEl=a(f,e))}},resetInner:function(){this.getContentGroup().removeAll(),this._backgroundEl&&this.group.remove(this._backgroundEl),this.getSelectorGroup().removeAll()},renderInner:function(e,t,n,i,r,l,a){var s=this.getContentGroup(),u=o.createHashMap(),h=t.get("selectedMode"),v=[];n.eachRawSeries((function(e){!e.get("legendHoverLink")&&v.push(e.id)})),d(t.getData(),(function(o,r){var l=o.get("name");if(this.newlineDisabled||""!==l&&"\n"!==l){var a=n.getSeriesByName(l)[0];if(!u.get(l))if(a){var d=a.getData(),y=d.getVisual("color"),S=d.getVisual("borderColor");"function"===typeof y&&(y=y(a.getDataParams(0))),"function"===typeof S&&(S=S(a.getDataParams(0)));var x=d.getVisual("legendSymbol")||"roundRect",b=d.getVisual("symbol");this._createItem(l,r,o,t,x,b,e,y,S,h).on("click",c(p,l,null,i,v)).on("mouseover",c(f,a.name,null,i,v)).on("mouseout",c(m,a.name,null,i,v)),u.set(l,!0)}else n.eachRawSeries((function(n){if(!u.get(l)&&n.legendVisualProvider){var a=n.legendVisualProvider;if(!a.containName(l))return;var s=a.indexOfName(l),d=a.getItemVisual(s,"color"),g=a.getItemVisual(s,"borderColor");this._createItem(l,r,o,t,"roundRect",null,e,d,g,h).on("click",c(p,null,l,i,v)).on("mouseover",c(f,null,l,i,v)).on("mouseout",c(m,null,l,i,v)),u.set(l,!0)}}),this)}else s.add(new g({newline:!0}))}),this),r&&this._createSelector(r,t,i,l,a)},_createSelector:function(e,t,n,i,o){var r=this.getSelectorGroup();d(e,(function(e){!function(e){var i=e.type,o=new l.Text({style:{x:0,y:0,align:"center",verticalAlign:"middle"},onclick:function(){n.dispatchAction({type:"all"===i?"legendAllSelect":"legendInverseSelect"})}});r.add(o);var a=t.getModel("selectorLabel"),s=t.getModel("emphasis.selectorLabel");l.setLabelStyle(o.style,o.hoverStyle={},a,s,{defaultText:e.title,isRectText:!1}),l.setHoverStyle(o)}(e)}))},_createItem:function(e,t,n,i,a,s,c,d,u,p){var f=i.get("itemWidth"),m=i.get("itemHeight"),v=i.get("inactiveColor"),y=i.get("inactiveBorderColor"),S=i.get("symbolKeepAspect"),x=i.getModel("itemStyle"),b=i.isSelected(e),w=new g,_=n.getModel("textStyle"),R=n.get("icon"),C=n.getModel("tooltip"),I=C.parentModel,A=r(a=R||a,0,0,f,m,b?d:v,null==S||S);if(w.add(h(A,a,x,u,y,b)),!R&&s&&(s!==a||"none"===s)){var G=.8*m;"none"===s&&(s="circle");var k=r(s,(f-G)/2,(m-G)/2,G,G,b?d:v,null==S||S);w.add(h(k,s,x,u,y,b))}var M="left"===c?f+5:-5,P=c,D=i.get("formatter"),L=e;"string"===typeof D&&D?L=D.replace("{name}",null!=e?e:""):"function"===typeof D&&(L=D(e)),w.add(new l.Text({style:l.setTextStyle({},_,{text:L,x:M,y:m/2,textFill:b?_.getTextColor():v,textAlign:P,textVerticalAlign:"middle"})}));var O=new l.Rect({shape:w.getBoundingRect(),invisible:!0,tooltip:C.get("show")?o.extend({content:e,formatter:I.get("formatter",!0)||function(){return e},formatterParams:{componentType:"legend",legendIndex:i.componentIndex,name:e,$vars:["name"]}},C.option):null});return w.add(O),w.eachChild((function(e){e.silent=!0})),O.silent=!p,this.getContentGroup().add(w),l.setHoverStyle(w),w.__legendDataIndex=t,w},layoutInner:function(e,t,n,i,o,r){var l=this.getContentGroup(),a=this.getSelectorGroup();s.box(e.get("orient"),l,e.get("itemGap"),n.width,n.height);var c=l.getBoundingRect(),d=[-c.x,-c.y];if(o){s.box("horizontal",a,e.get("selectorItemGap",!0));var g=a.getBoundingRect(),u=[-g.x,-g.y],h=e.get("selectorButtonGap",!0),p=e.getOrient().index,f=0===p?"width":"height",m=0===p?"height":"width",v=0===p?"y":"x";"end"===r?u[p]+=c[f]+h:d[p]+=g[f]+h,u[1-p]+=c[m]/2-g[m]/2,a.attr("position",u),l.attr("position",d);var y={x:0,y:0};return y[f]=c[f]+h+g[f],y[m]=Math.max(c[m],g[m]),y[v]=Math.min(0,g[v]+u[1-p]),y}return l.attr("position",d),this.group.getBoundingRect()},remove:function(){this.getContentGroup().removeAll(),this._isFirstRender=!0}});function h(e,t,n,i,o,r){var l;return"line"!==t&&t.indexOf("empty")<0?(l=n.getItemStyle(),e.style.stroke=i,r||(l.stroke=o)):l=n.getItemStyle(["borderWidth","borderColor"]),e.setStyle(l)}function p(e,t,n,i){m(e,t,n,i),n.dispatchAction({type:"legendToggleSelect",name:null!=e?e:t}),f(e,t,n,i)}function f(e,t,n,i){var o=n.getZr().storage.getDisplayList()[0];o&&o.useHoverLayer||n.dispatchAction({type:"highlight",seriesName:e,name:t,excludeSeriesId:i})}function m(e,t,n,i){var o=n.getZr().storage.getDisplayList()[0];o&&o.useHoverLayer||n.dispatchAction({type:"downplay",seriesName:e,name:t,excludeSeriesId:i})}e.exports=u},355:function(e,t){e.exports=function(e){var t=e.findComponents({mainType:"legend"});t&&t.length&&e.filterSeries((function(e){for(var n=0;n<t.length;n++)if(!t[n].isSelected(e.name))return!1;return!0}))}},362:function(e,t,n){var i=n(119);n(352),n(353),n(354);var o=n(355),r=n(131);i.registerProcessor(i.PRIORITY.PROCESSOR.SERIES_FILTER,o),r.registerSubTypeDefaulter("legend",(function(){return"plain"}))}}]);