(self.webpackChunkboardbuilder=self.webpackChunkboardbuilder||[]).push([[731],{72081:function(e){e.exports=function(){"use strict";var e=/^(b|B)$/,t={iec:{bits:["b","Kib","Mib","Gib","Tib","Pib","Eib","Zib","Yib"],bytes:["B","KiB","MiB","GiB","TiB","PiB","EiB","ZiB","YiB"]},jedec:{bits:["b","Kb","Mb","Gb","Tb","Pb","Eb","Zb","Yb"],bytes:["B","KB","MB","GB","TB","PB","EB","ZB","YB"]}},n={iec:["","kibi","mebi","gibi","tebi","pebi","exbi","zebi","yobi"],jedec:["","kilo","mega","giga","tera","peta","exa","zetta","yotta"]},o={floor:Math.floor,ceil:Math.ceil};function i(i){var a,r,c,l,s,d,u,f,b,m,g,p,y,x,Z,h,v,M,A,T,S=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},w=[],q=0;if(isNaN(i))throw new TypeError("Invalid number");if(c=!0===S.bits,Z=!0===S.unix,p=!0===S.pad,y=void 0!==S.round?S.round:Z?1:2,u=void 0!==S.locale?S.locale:"",f=S.localeOptions||{},h=void 0!==S.separator?S.separator:"",v=void 0!==S.spacer?S.spacer:Z?"":" ",A=S.symbols||{},M=2===(r=S.base||2)&&S.standard||"jedec",g=S.output||"string",s=!0===S.fullform,d=S.fullforms instanceof Array?S.fullforms:[],a=void 0!==S.exponent?S.exponent:-1,T=o[S.roundingMethod]||Math.round,l=r>2?1e3:1024,(b=(m=Number(i))<0)&&(m=-m),(-1===a||isNaN(a))&&(a=Math.floor(Math.log(m)/Math.log(l)))<0&&(a=0),a>8&&(a=8),"exponent"===g)return a;if(0===m)w[0]=0,x=w[1]=Z?"":t[M][c?"bits":"bytes"][a];else{q=m/(2===r?Math.pow(2,10*a):Math.pow(1e3,a)),c&&(q*=8)>=l&&a<8&&(q/=l,a++);var B=Math.pow(10,a>0?y:0);w[0]=T(q*B)/B,w[0]===l&&a<8&&void 0===S.exponent&&(w[0]=1,a++),x=w[1]=10===r&&1===a?c?"kb":"kB":t[M][c?"bits":"bytes"][a],Z&&(w[1]="jedec"===M?w[1].charAt(0):a>0?w[1].replace(/B$/,""):w[1],e.test(w[1])&&(w[0]=Math.floor(w[0]),w[1]=""))}if(b&&(w[0]=-w[0]),w[1]=A[w[1]]||w[1],!0===u?w[0]=w[0].toLocaleString():u.length>0?w[0]=w[0].toLocaleString(u,f):h.length>0&&(w[0]=w[0].toString().replace(".",h)),p&&!1===Number.isInteger(w[0])&&y>0){var C=h||".",z=w[0].toString().split(C),O=z[1]||"",_=O.length,k=y-_;w[0]="".concat(z[0]).concat(C).concat(O.padEnd(_+k,"0"))}return s&&(w[1]=d[a]?d[a]:n[M][a]+(c?"bit":"byte")+(1===w[0]?"":"s")),"array"===g?w:"object"===g?{value:w[0],symbol:w[1],exponent:a,unit:x}:w.join(v)}return i.partial=function(e){return function(t){return i(t,e)}},i}()},26731:function(e,t,n){"use strict";n.r(t),n.d(t,{MediaModule:function(){return z},routes:function(){return C}});var o=n(61116),i=n(82051),a=n(35366),r=n(22318),c=n(47068),l=n(97070),s=n(40936),d=n(35965),u=n(84369),f=n(88006),b=n(77307),m=n(22797),g=n(72081);let p=(()=>{class e{static transformOne(e,t){return g(e,t)}transform(t,n){return Array.isArray(t)?t.map(t=>e.transformOne(t,n)):e.transformOne(t,n)}}return e.\u0275fac=function(t){return new(t||e)},e.\u0275pipe=a.Yjl({name:"filesize",type:e,pure:!0}),e})(),y=(()=>{class e{}return e.\u0275fac=function(t){return new(t||e)},e.\u0275mod=a.oAB({type:e}),e.\u0275inj=a.cJS({}),e})();function x(e,t){1&e&&a._UZ(0,"app-loading-notice",6)}function Z(e,t){1&e&&(a.TgZ(0,"p",18),a.SDv(1,19),a.qZA())}const h=function(){return{round:0}},v=function(e){return{mediaItem:e}};function M(e,t){if(1&e&&(a.TgZ(0,"div",20),a.TgZ(1,"mat-card"),a._UZ(2,"img",21),a.TgZ(3,"mat-card-actions",22),a.TgZ(4,"span"),a._uU(5),a.ALo(6,"filesize"),a.qZA(),a.TgZ(7,"button",23),a.TgZ(8,"mat-icon"),a._uU(9,"more_vert"),a.qZA(),a.qZA(),a.qZA(),a.qZA(),a.qZA()),2&e){const e=t.$implicit;a.oxw(2);const n=a.MAs(4);a.xp6(2),a.Q6J("src",e.public_url,a.LSH),a.xp6(3),a.Oqu(a.xi3(6,4,e.filesize,a.DdM(7,h))),a.xp6(2),a.Q6J("matMenuTriggerFor",n)("matMenuTriggerData",a.VKq(8,v,e))}}function A(e,t){if(1&e){const e=a.EpF();a.ynx(0),a.TgZ(1,"h2"),a.SDv(2,7),a.qZA(),a.TgZ(3,"p"),a.SDv(4,8),a.ALo(5,"filesize"),a.qZA(),a.YNc(6,Z,2,0,"p",9),a.TgZ(7,"div",10),a.TgZ(8,"div",11),a.TgZ(9,"button",12),a.NdJ("click",function(){return a.CHM(e),a.oxw().openSymbolCreator()}),a.TgZ(10,"div",13),a.TgZ(11,"mat-icon",14),a._uU(12,"construction"),a.qZA(),a.TgZ(13,"div",15),a.SDv(14,16),a.qZA(),a.qZA(),a.qZA(),a.qZA(),a.YNc(15,M,10,10,"div",17),a.qZA(),a.BQk()}if(2&e){const e=a.oxw();a.xp6(5),a.pQV(a.xi3(5,3,e.spaceUsed,a.DdM(6,h))),a.QtT(4),a.xp6(1),a.Q6J("ngIf",0===e.media.length),a.xp6(9),a.Q6J("ngForOf",e.media)}}function T(e,t){if(1&e){const e=a.EpF();a.TgZ(0,"button",24),a.NdJ("click",function(){const t=a.CHM(e).mediaItem;return a.oxw().openSymbolCreator(t)}),a.TgZ(1,"mat-icon"),a._uU(2,"construction"),a.qZA(),a.TgZ(3,"span"),a.SDv(4,25),a.qZA(),a.qZA(),a.TgZ(5,"button",26),a.NdJ("click",function(){const t=a.CHM(e).mediaItem;return a.oxw().download(t)}),a.TgZ(6,"mat-icon"),a._uU(7,"save_alt"),a.qZA(),a.TgZ(8,"span"),a.SDv(9,27),a.qZA(),a.qZA(),a.TgZ(10,"button",26),a.NdJ("click",function(){const t=a.CHM(e).mediaItem;return a.oxw().delete(t)}),a.TgZ(11,"mat-icon"),a._uU(12,"delete"),a.qZA(),a.TgZ(13,"span"),a.SDv(14,28),a.qZA(),a.qZA()}2&e&&a.Q6J("disabled",!t.mediaItem.canvas_url)}let S=(()=>{class e{constructor(e,t){this.service=e,this.dialogService=t}ngOnInit(){this.loadMedia()}loadMedia(){this.loading=!0,this.service.list().subscribe(e=>this.media=e,e=>null,()=>this.loading=!1)}delete(e){this.dialogService.delete({heading:"Delete this Symbol?",content:"The Symbol will be permanently removed from any Boards it's used in."}).afterClosed().subscribe(t=>{t&&this.service.delete(e).subscribe(t=>{this.media=this.media.filter(t=>t!==e)})})}get spaceUsed(){let e=0;return this.media.forEach(t=>e+=t.filesize),e}openSymbolCreator(e){this.dialogService.openSymbolCreator(e).afterClosed().subscribe(e=>{e&&this.loadMedia()})}download(e){this.service.getImage(e).subscribe(e=>{const t=e.type.match(/\/([a-z]+)/)[1];(0,i.saveAs)(e,`image.${t}`)})}}return e.\u0275fac=function(t){return new(t||e)(a.Y36(r.y),a.Y36(c.x))},e.\u0275cmp=a.Xpm({type:e,selectors:[["app-media"]],decls:6,vars:2,consts:function(){let e,t,n,o,i,a,r,c;return e="\u0627\u0644\u0631\u0645\u0648\u0632",t="\u0631\u0645\u0648\u0632\u064A",n="\u0644\u0642\u062F \u0627\u0633\u062A\u062E\u062F\u0645\u062A " + "\ufffd0\ufffd" + ".",o="\u0625\u0646\u0634\u0627\u0621 \u0631\u0645\u0632",i="\u0644\u0645 \u062A\u0642\u0645 \u0628\u062A\u062D\u0645\u064A\u0644 \u0623\u064A \u0635\u0648\u0631 \u0628\u0639\u062F.",a="\u062A\u062D\u0631\u064A\u0631 \u0627\u0644\u0631\u0645\u0632",r="\u062D\u0641\u0638 \u0625\u0644\u0649 \u0627\u0644\u062C\u0647\u0627\u0632",c="\u062D\u0630\u0641 \u0627\u0644\u0631\u0645\u0632",[[1,"container","mt-3"],["subject",e,4,"ngIf"],[4,"ngIf"],["xPosition","before"],["menu","matMenu"],["matMenuContent",""],["subject",e],t,n,["class","text-center mt-3",4,"ngIf"],["fxLayout","row wrap","fxLayoutGap","1rem grid"],["fxFlex.xs","50","fxFlex.sm","33","fxFlex","20",1,"add-symbol-button","text-center"],["mat-flat-button","","color","primary","fxFlex","","gaCategory","SymbolCreator","gaEvent","open",3,"click"],["fxLayout","column","fxLayoutAlign","space-between center"],["fxFlex","grow"],[1,"mt-3"],o,["fxFlex.xs","50","fxFlex.sm","33","fxFlex","20",4,"ngFor","ngForOf"],[1,"text-center","mt-3"],i,["fxFlex.xs","50","fxFlex.sm","33","fxFlex","20"],["mat-card-image","","alt","Media Item",3,"src"],["fxLayoutAlign","space-between center"],["mat-icon-button","",3,"matMenuTriggerFor","matMenuTriggerData"],["mat-menu-item","",3,"disabled","click"],a,["mat-menu-item","",3,"click"],r,c]},template:function(e,t){1&e&&(a.TgZ(0,"div",0),a.YNc(1,x,1,0,"app-loading-notice",1),a.YNc(2,A,16,7,"ng-container",2),a.qZA(),a.TgZ(3,"mat-menu",3,4),a.YNc(5,T,15,1,"ng-template",5),a.qZA()),2&e&&(a.xp6(1),a.Q6J("ngIf",t.loading),a.xp6(1),a.Q6J("ngIf",!t.loading))},directives:[o.O5,l.VK,l.KA,s.W,d.xw,d.SQ,d.yH,u.lW,f.ht,f.kw,d.Wh,b.Hw,o.sg,m.a8,m.G2,m.hq,l.p6,l.OP],pipes:[p],styles:["img[_ngcontent-%COMP%], object[_ngcontent-%COMP%]{-o-object-fit:scale-down;object-fit:scale-down;height:10rem;margin-top:0;margin-bottom:0}mat-card-actions[_ngcontent-%COMP%]{color:rgba(0,0,0,.5)}.add-symbol-button[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{font-size:large}.add-symbol-button[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{display:block;height:8rem;width:8rem;font-size:8rem}"]}),e})();var w=n(75425),q=n(33464),B=n(24311);const C=[{path:"",component:S,pathMatch:"full"}];let z=(()=>{class e{}return e.\u0275fac=function(t){return new(t||e)},e.\u0275mod=a.oAB({type:e}),e.\u0275inj=a.cJS({imports:[[y,o.ez,w.m,q.Bz.forChild(C),l.Tx,b.Ps,d.ae,u.ot,m.QW,B.AV,f.yz]]}),e})()}}]);