(self.webpackChunkboardbuilder=self.webpackChunkboardbuilder||[]).push([[176],{93176:function(t,e,n){"use strict";n.r(e),n.d(e,{AuthModule:function(){return v}});var c=n(61116),o=n(33464),a=n(35366),i=n(3796),r=n(22797),s=n(87672),u=n(84369),l=n(35965);function g(t,e){1&t&&(a.TgZ(0,"mat-card-content",5),a._UZ(1,"mat-spinner",6),a.TgZ(2,"p",0),a.SDv(3,7),a.qZA(),a.qZA())}function d(t,e){if(1&t){const t=a.EpF();a.ynx(0),a.TgZ(1,"button",10),a.NdJ("click",function(){return a.CHM(t),a.oxw(2).login()}),a.SDv(2,11),a.qZA(),a.BQk()}}function b(t,e){1&t&&(a.ynx(0),a.TgZ(1,"button",12),a.SDv(2,13),a.qZA(),a.BQk())}function p(t,e){if(1&t&&(a.ynx(0),a.TgZ(1,"mat-card-content",0),a.TgZ(2,"p"),a.SDv(3,8),a.qZA(),a.TgZ(4,"p"),a.SDv(5,9),a.qZA(),a.qZA(),a.TgZ(6,"mat-card-actions",0),a.YNc(7,d,3,0,"ng-container",4),a.ALo(8,"async"),a.YNc(9,b,3,0,"ng-container",4),a.ALo(10,"async"),a.qZA(),a.BQk()),2&t){const t=a.oxw();a.xp6(7),a.Q6J("ngIf",!a.lcZ(8,2,t.canActivateProtectedRoutes)),a.xp6(2),a.Q6J("ngIf",a.lcZ(10,4,t.canActivateProtectedRoutes))}}let f=(()=>{class t{constructor(t,e){this.authService=t,this.router=e,this.isDoneLoading=this.authService.isDoneLoading$,this.canActivateProtectedRoutes=this.authService.canActivateProtectedRoutes$,this.subscription=this.authService.canActivateProtectedRoutes$.subscribe(t=>{t&&this.router.navigate(["/","boardsets"])})}ngOnDestroy(){this.subscription.unsubscribe()}login(){this.authService.login()}}return t.\u0275fac=function(e){return new(e||t)(a.Y36(i.e),a.Y36(o.F0))},t.\u0275cmp=a.Xpm({type:t,selectors:[["app-login"]],decls:7,vars:6,consts:function(){let t,e,n,c,o;return t="\u0622\u067E \u06A9\u0627 \u0627\u06A9\u0627\u0624\u0646\u0679 \u0686\u06CC\u06A9 \u06A9\u0631 \u0631\u06C1\u0627 \u06C1\u06D2\u2026",e="\u0645\u0648\u0627\u0635\u0644\u0627\u062A\u06CC \u0628\u0648\u0631\u0688 \u0628\u0646\u0627\u0646\u06D2 \u06A9\u06D2 \u0644\u0626\u06D2 \u0628\u0648\u0631\u0688 \u0628\u0644\u0688\u0631 \u06A9\u0627 \u0627\u0633\u062A\u0639\u0645\u0627\u0644 \u06A9\u0631\u06CC\u06BA\u06D4",n="\u0633\u0628 \u06A9\u0686\u06BE \u0622\u067E \u06A9\u06D2 \u0639\u0627\u0644\u0645\u06CC \u0639\u0644\u0627\u0645\u0627\u062A \u0627\u06A9\u0627\u0624\u0646\u0679 \u0645\u06CC\u06BA \u0645\u062D\u0641\u0648\u0638 \u06C1\u06D2\u06D4",c="\u0639\u0627\u0644\u0645\u06CC \u0639\u0644\u0627\u0645\u0627\u062A \u06A9\u06D2 \u0633\u0627\u062A\u06BE \u0633\u0627\u0626\u0646 \u0627\u0646 \u06A9\u0631\u06CC\u06BA",o="\u062C\u0627\u0631\u06CC \u0631\u06A9\u06BE\u0646\u0627",[[1,"mt-3"],["mat-card-image","",1,"bg-primary","text-center","py-2"],["src","assets/images/navbar-logo.svg","alt","Global Symbols Board Builder",2,"max-height","1rem"],["class","py-2 text-center",4,"ngIf"],[4,"ngIf"],[1,"py-2","text-center"],[2,"margin","0 auto"],t,e,n,["fxFlex","","mat-flat-button","","color","primary",3,"click"],c,["fxFlex","","mat-flat-button","","color","primary","routerLink","boardsets"],o]},template:function(t,e){1&t&&(a.TgZ(0,"mat-card",0),a.TgZ(1,"div",1),a._UZ(2,"img",2),a.qZA(),a.YNc(3,g,4,0,"mat-card-content",3),a.ALo(4,"async"),a.YNc(5,p,11,6,"ng-container",4),a.ALo(6,"async"),a.qZA()),2&t&&(a.xp6(3),a.Q6J("ngIf",!a.lcZ(4,2,e.isDoneLoading)),a.xp6(2),a.Q6J("ngIf",a.lcZ(6,4,e.isDoneLoading)))},directives:[r.a8,r.G2,c.O5,r.dn,s.$g,r.hq,u.lW,l.yH,o.rH],pipes:[c.Ov],styles:[""]}),t})();var h=n(77154);const m=[{path:"",redirectTo:"/auth/login",pathMatch:"full"},{path:"",children:[{path:"login",component:f}]}];let v=(()=>{class t{}return t.\u0275fac=function(e){return new(e||t)},t.\u0275mod=a.oAB({type:t}),t.\u0275inj=a.cJS({imports:[[c.ez,o.Bz.forChild(m),r.QW,s.Cq,h.o9,u.ot]]}),t})()}}]);