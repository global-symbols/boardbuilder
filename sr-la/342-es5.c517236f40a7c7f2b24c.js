!function(){var e,a,t,o,i,r,n,l,c,u,s,f,d,b;function m(e,a){return a||(a=e.slice(0)),Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(a)}}))}function p(e,a){if(!(e instanceof a))throw new TypeError("Cannot call a class as a function")}function g(e,a){for(var t=0;t<a.length;t++){var o=a[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}(self.webpackChunkboardbuilder=self.webpackChunkboardbuilder||[]).push([[342],{3342:function(v,h,Z){"use strict";Z.r(h),Z.d(h,{SettingsModule:function(){return B}});var _=Z(61116),w=Z(47133),T=Z(35366),S=Z(73501),k=Z(98508),A=Z(33464),y=Z(40936),C=Z(77307),x=Z(35965),q=Z(76710),P=Z(96055),J=Z(84369),Q=Z(24311),z=Z(12905);function D(e,a){1&e&&T._UZ(0,"app-loading-notice",4)}function N(e,a){if(1&e){var t=T.EpF();T.TgZ(0,"button",25),T.NdJ("click",function(e){return T.CHM(t),T.oxw(2).updateHair(null),e.stopPropagation()}),T.TgZ(1,"mat-icon",26),T._uU(2,"format_color_reset"),T.qZA(),T.qZA()}}function I(e,a){if(1&e){var t=T.EpF();T.TgZ(0,"button",27),T.NdJ("click",function(e){return T.CHM(t),T.oxw(2).updateSkin(null),e.stopPropagation()}),T.TgZ(1,"mat-icon",26),T._uU(2,"format_color_reset"),T.qZA(),T.qZA()}}function U(e,a){if(1&e&&(T.ynx(0),T.TgZ(1,"div",28),T.TgZ(2,"strong"),T.SDv(3,29),T.qZA(),T.qZA(),T._UZ(4,"app-adaptable-image",22),T._UZ(5,"app-adaptable-image",22),T.BQk()),2&e){var t=T.oxw(2);T.xp6(4),T.Q6J("adaptable",!0)("cell",t.malePreview)("image",t.malePreview.image_url),T.xp6(1),T.Q6J("adaptable",!0)("cell",t.femalePreview)("image",t.femalePreview.image_url)}}function H(e,a){if(1&e&&(T.TgZ(0,"div"),T.TgZ(1,"small"),T.TgZ(2,"mat-icon",30),T._uU(3,"check"),T.qZA(),T.TgZ(4,"span"),T.SDv(5,31),T.ALo(6,"amTimeAgo"),T.qZA(),T.qZA(),T.qZA()),2&e){var t=T.oxw(2);T.xp6(2),T.Q6J("inline",!0),T.xp6(4),T.pQV(T.lcZ(6,2,t.savedAt)),T.QtT(5)}}function O(e,a){if(1&e){var t=T.EpF();T.TgZ(0,"div"),T.TgZ(1,"h3"),T.SDv(2,5),T.qZA(),T.TgZ(3,"p"),T.SDv(4,6),T.qZA(),T.TgZ(5,"p"),T.SDv(6,7),T.qZA(),T.TgZ(7,"p"),T.tHW(8,8),T._UZ(9,"mat-icon",9),T.N_p(),T.qZA(),T.TgZ(10,"div",10),T.TgZ(11,"div"),T.TgZ(12,"div",11),T.TgZ(13,"strong",12),T.SDv(14,13),T.qZA(),T.ynx(15),T.YNc(16,N,3,0,"button",14),T.BQk(),T.qZA(),T.TgZ(17,"app-colour-picker",15),T.NdJ("valueChange",function(e){return T.CHM(t),T.oxw().user.default_hair_colour=e})("valueChange",function(e){return T.CHM(t),T.oxw().updateHair(e)}),T.qZA(),T.TgZ(18,"div",16),T.TgZ(19,"strong",12),T.SDv(20,17),T.qZA(),T.ynx(21),T.YNc(22,I,3,0,"button",18),T.BQk(),T.qZA(),T.TgZ(23,"app-colour-picker",19),T.NdJ("valueChange",function(e){return T.CHM(t),T.oxw().user.default_skin_colour=e})("valueChange",function(e){return T.CHM(t),T.oxw().updateSkin(e)}),T.qZA(),T.qZA(),T.TgZ(24,"div"),T.TgZ(25,"div",20),T.TgZ(26,"strong"),T.SDv(27,21),T.qZA(),T.qZA(),T._UZ(28,"app-adaptable-image",22),T._UZ(29,"app-adaptable-image",22),T.YNc(30,U,6,6,"ng-container",3),T.qZA(),T.qZA(),T.TgZ(31,"button",23),T.NdJ("click",function(){return T.CHM(t),T.oxw().save()}),T.SDv(32,24),T.qZA(),T.YNc(33,H,7,4,"div",3),T.qZA()}if(2&e){var o=T.oxw();T.xp6(9),T.Q6J("inline",!0),T.xp6(7),T.Q6J("ngIf",o.user.default_hair_colour),T.xp6(1),T.Q6J("value",o.user.default_hair_colour)("width",302)("border",!0),T.xp6(5),T.Q6J("ngIf",o.user.default_skin_colour),T.xp6(1),T.Q6J("value",o.user.default_skin_colour)("width",302)("border",!0),T.xp6(5),T.Q6J("adaptable",!1)("cell",o.malePreview)("image",o.malePreview.image_url),T.xp6(1),T.Q6J("adaptable",!1)("cell",o.femalePreview)("image",o.femalePreview.image_url),T.xp6(1),T.Q6J("ngIf",o.user.default_hair_colour||o.user.default_skin_colour),T.xp6(3),T.Q6J("ngIf",o.savedAt)}}var $,M=function(){var v=function(){function e(a,t,o){p(this,e),this.userService=a,this.toolbarService=t,this.router=o,this.malePreview=new w.b({image_url:"assets/images/previews/happy-man.svg"}),this.femalePreview=new w.b({image_url:"assets/images/previews/happy-woman.svg"})}var a,t,o;return a=e,(t=[{key:"ngOnInit",value:function(){var e=this;this.loading=!0,this.userSubscription=this.userService.get().subscribe(function(a){e.user=a,e.loading=!1,e.malePreview.hair_colour=a.default_hair_colour,e.femalePreview.hair_colour=a.default_hair_colour,e.malePreview.skin_colour=a.default_skin_colour,e.femalePreview.skin_colour=a.default_skin_colour}),this.toolbarService.setButtons([{text:"Board Sets",icon:"arrow_back",action:function(){return e.router.navigate(["/","boardsets"])}}])}},{key:"ngOnDestroy",value:function(){this.toolbarService.clearButtons(),this.userSubscription.unsubscribe()}},{key:"updateHair",value:function(e){this.user.default_hair_colour=e,this.malePreview.hair_colour=e,this.femalePreview.hair_colour=e}},{key:"updateSkin",value:function(e){this.user.default_skin_colour=e,this.malePreview.skin_colour=e,this.femalePreview.skin_colour=e}},{key:"save",value:function(){var e=this;this.userService.update(this.user).subscribe(function(a){e.savedAt=new Date})}}])&&g(a.prototype,t),o&&g(a,o),e}();return v.\u0275fac=function(e){return new(e||v)(T.Y36(S.K),T.Y36(k.O),T.Y36(A.F0))},v.\u0275cmp=T.Xpm({type:v,selectors:[["app-page"]],decls:5,vars:2,consts:function(){var p,g,v;return[[1,"container","mt-3"],"Settings",["subject",p="Settings",4,"ngIf"],[4,"ngIf"],["subject",p],"Custom Symbols","Some symbols let you customise hair and skin colours.","The colours you choose here will be applied to customisable symbols automatically.","Customisable symbols will show a " + "\ufffd#9\ufffd" + "emoji_emotions" + "\ufffd/#9\ufffd" + " symbol in search results.",["color","primary",3,"inline"],["fxLayout","row wrap","fxLayoutGap","50px grid",1,"mb-2"],["fxLayout","row","fxLayoutAlign","space-between center",1,"mb-1"],[1,"mt-2","mb-2"],"Custom Hair Colour",["mat-icon-button","","matTooltip",g="Remove Custom Hair Colour","matTooltipPosition","left",3,"click",4,"ngIf"],["palette","hair",3,"value","width","border","valueChange"],["fxLayout","row","fxLayoutAlign","space-between center",1,"mt-3","mb-1"],"Custom Skin Colour",["mat-icon-button","","matTooltip",v="Remove Custom Skin Colour","matTooltipPosition","left",3,"click",4,"ngIf"],["palette","skin",3,"value","width","border","valueChange"],[1,"mb-1"],"Original Symbols",[3,"adaptable","cell","image"],["mat-button","","mat-raised-button","","color","primary",1,"mb-2",3,"click"],"Save",["mat-icon-button","","matTooltip",g,"matTooltipPosition","left",3,"click"],["color","primary"],["mat-icon-button","","matTooltip",v,"matTooltipPosition","left",3,"click"],[1,"mt-2","mb-1"],"Customised Symbols",[3,"inline"],"Changes saved " + "\ufffd0\ufffd" + ""]},template:function(e,a){1&e&&(T.TgZ(0,"div",0),T.TgZ(1,"h2"),T.SDv(2,1),T.qZA(),T.YNc(3,D,1,0,"app-loading-notice",2),T.YNc(4,O,34,17,"div",3),T.qZA()),2&e&&(T.xp6(3),T.Q6J("ngIf",a.loading),T.xp6(1),T.Q6J("ngIf",a.user))},directives:[_.O5,y.W,C.Hw,x.xw,x.SQ,x.Wh,q.a,P.y,J.lW,Q.gM],pipes:[z.eG],styles:[""]}),v}(),L=Z(75425),Y=Z(19936),j=[{path:"",component:M,pathMatch:"full"}],B=(($=function e(){p(this,e)}).\u0275fac=function(e){return new(e||$)},$.\u0275mod=T.oAB({type:$}),$.\u0275inj=T.cJS({imports:[[_.ez,A.Bz.forChild(j),L.m,Y.be,J.ot,x.ae,Q.AV,C.Ps,z._G]]}),$)}}])}();