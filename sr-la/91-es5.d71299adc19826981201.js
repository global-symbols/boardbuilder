!function(){var e,t,a,n,o,i,c,r,l,s,d,f,g,b,m,u,p,h,y,v,x,Z,S,w,T,A,q;function z(e,t){return t||(t=e.slice(0)),Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(t)}}))}function C(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function Q(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(self.webpackChunkboardbuilder=self.webpackChunkboardbuilder||[]).push([[91],{75091:function($,H,D){"use strict";D.r(H),D.d(H,{HomeModule:function(){return ie},routes:function(){return oe}});var k=D(61116),J=D(35366),M=D(3796),O=D(33464),P=D(98508),B=D(35965);function F(e,t){if(1&e&&(J.TgZ(0,"h1"),J._uU(1),J.qZA()),2&e){var a=J.oxw();J.xp6(1),J.Oqu(a.heading)}}function U(e,t){if(1&e&&(J.TgZ(0,"h2"),J._uU(1),J.qZA()),2&e){var a=J.oxw();J.xp6(1),J.Oqu(a.heading)}}var Y=["*"],_=function(){var e=function e(){Q(this,e),this.headingType="h2"};return e.\u0275fac=function(t){return new(t||e)},e.\u0275cmp=J.Xpm({type:e,selectors:[["app-home-panel"]],inputs:{even:"even",headingType:"headingType",heading:"heading",imageUrl:"imageUrl"},ngContentSelectors:Y,decls:8,vars:6,consts:[["fxLayout","row","fxLayout.xs","column","fxLayoutGap","40px","fxLayoutAlign","space-between center",1,"panel"],["fxFlex","45","fxFlex.sm","50","fxFlex.xs",""],[3,"ngSwitch"],[4,"ngSwitchCase"],["fxFlex","55","fxFlex.sm","50","fxFlex.xs","",3,"fxFlexOrder.gt-sm"],[3,"src","alt"]],template:function(e,t){1&e&&(J.F$t(),J.TgZ(0,"div",0),J.TgZ(1,"div",1),J.ynx(2,2),J.YNc(3,F,2,1,"h1",3),J.YNc(4,U,2,1,"h2",3),J.BQk(),J.Hsn(5),J.qZA(),J.TgZ(6,"div",4),J._UZ(7,"img",5),J.qZA(),J.qZA()),2&e&&(J.xp6(2),J.Q6J("ngSwitch",t.headingType),J.xp6(1),J.Q6J("ngSwitchCase","h1"),J.xp6(1),J.Q6J("ngSwitchCase","h2"),J.xp6(2),J.Q6J("fxFlexOrder.gt-sm",t.even?-1:0),J.xp6(1),J.Q6J("src",t.imageUrl,J.LSH)("alt",t.heading))},directives:[B.xw,B.SQ,B.Wh,B.yH,k.RF,k.n9,B.r7],styles:[".panel[_ngcontent-%COMP%]{margin-bottom:2rem!important}.panel[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{max-width:100%}h1[_ngcontent-%COMP%]{font-size:3rem;line-height:3.2rem}h2[_ngcontent-%COMP%]{font-weight:400;padding-bottom:.83em;border-bottom:2px solid #006aba}"]}),e}(),G=D(84369),I=D(37112);function L(e,t){1&e&&(J.ynx(0),J.SDv(1,27),J.BQk())}function N(e,t){1&e&&(J.ynx(0),J.SDv(1,28),J.BQk())}var j=function(){return["/","media"]};function R(e,t){1&e&&(J.TgZ(0,"button",29),J.SDv(1,30),J.qZA()),2&e&&J.Q6J("routerLink",J.DdM(1,j))}function E(e,t){1&e&&(J.ynx(0),J.SDv(1,31),J.BQk())}function W(e,t){1&e&&(J.ynx(0),J.SDv(1,32),J.BQk())}function X(e,t){1&e&&(J.TgZ(0,"button",29),J.SDv(1,33),J.qZA()),2&e&&J.Q6J("routerLink",J.DdM(1,j))}var K,V=function(){var $=function(){function e(t,a,n){var o=this;Q(this,e),this.authService=t,this.router=a,this.toolbarService=n,this.panelId=0,this.isDoneLoading=this.authService.isDoneLoading$,this.canActivateProtectedRoutes=this.authService.canActivateProtectedRoutes$,this.authService.canActivateProtectedRoutes$.subscribe(function(e){return o.signedIn=e})}var t,a,n;return t=e,(a=[{key:"login",value:function(){this.authService.login()}},{key:"getStarted",value:function(){this.signedIn?this.router.navigate(["/","boardsets"]):this.authService.login()}}])&&C(t.prototype,a),n&&C(t,n),e}();return $.\u0275fac=function(e){return new(e||$)(J.Y36(M.e),J.Y36(O.F0),J.Y36(P.O))},$.\u0275cmp=J.Xpm({type:$,selectors:[["app-home"]],decls:48,vars:15,consts:function(){return[[1,"container",2,"max-width","1000px"],["heading","Komunikacione table na lak\u0161i na\u010Din","imageUrl","assets/images/home/main.svg","headingType","h1",3,"even"],"Napravite table koje \u0107e pomo\u0107i u komunikaciji sa hiljadama besplatnih slika.","Sve je bezbedno uskladi\u0161teno u va\u0161em nalogu \"Globalni simboli\".",["mat-flat-button","","color","primary",1,"button-lg","mb-1","mr-1",3,"ngSwitch","click"],[4,"ngSwitchCase"],["mat-flat-button","","color","primary","class","button-lg mb-1",3,"routerLink",4,"ngIf"],["heading","Zapo\u010Dnite sa predlo\u0161kom ili napravite sopstveni raspored","imageUrl","assets/images/home/templates.svg",3,"even"],"Brzo prvi koraci sa na\u0161om kolekcijom zgodnih predlo\u017Eaka.","Uvek imate kontrolu da prilagodite raspored izvan na\u0161ih predlo\u017Eaka.",["heading","Pretra\u017Eite hiljade besplatnih slika i koristite sopstvene","imageUrl","assets/images/home/search-images.svg",3,"even"],"Brzo prona\u0111ite simbole koji su vam potrebni pretra\u017Eivanjem hiljada besplatnih slika iz popularnih skupova simbola na GlobalSymbolsu.","Uskladi\u0161tite sopstvene fotografije i slike u BoardBuilder i koristite ih na svojim dasakama.",["heading","Komuniciraj sa bojom i jo\u0161 mnogo toga","imageUrl","assets/images/home/colour.svg",3,"even"],"Krojite table sa omiljenim bojama i \u017Eeljenim fontovima.","Lako ponovo rasporedite table i pove\u017Eite se izme\u0111u tabli da biste kreirali komunikacione knjige.",["heading","Kreiranje sopstvenih simbola","imageUrl","assets/images/home/symbol-creator.svg",3,"even"],"Kreirajte sopstvene simbole za nekoliko sekundi kombinuju\u0107i oblike, tekst, simbole, pa \u010Dak i sopstvene slike.","Savr\u0161eno za ona vremena kada ti treba ne\u0161to malo druga\u010Dije.",["heading","Preuzimanje, \u0161tampanje i deljenje","imageUrl","assets/images/home/pdf-and-print.svg",3,"even"],"Brzo konvertujte table u PDF kako bi se lako delile sa bilo kim.","Od\u0161tampajte table \u017Eeljene veli\u010Dine papira, uvezite i izvezite table u OBF i OBZ formatima.",["heading","Prvi koraci","imageUrl","assets/images/home/get-started.svg",3,"even"],"BoardBuilder skladi\u0161ti sve u va\u0161em nalogu za globalne simbole.","Kreirajte nalog ako ga ve\u0107 nemate.",["color","primary"],["fxFlex","",1,"text-center"],"Moji skupovi tabli","Prvi koraci",["mat-flat-button","","color","primary",1,"button-lg","mb-1",3,"routerLink"],"Moji simboli","Moji skupovi tabli","Prvi koraci","Moji simboli"]},template:function(e,t){1&e&&(J.TgZ(0,"div",0),J.TgZ(1,"app-home-panel",1),J.TgZ(2,"p"),J.SDv(3,2),J.qZA(),J.TgZ(4,"p"),J.SDv(5,3),J.qZA(),J.TgZ(6,"button",4),J.NdJ("click",function(){return t.getStarted()}),J.YNc(7,L,2,0,"ng-container",5),J.YNc(8,N,2,0,"ng-container",5),J.qZA(),J.YNc(9,R,2,2,"button",6),J.qZA(),J.TgZ(10,"app-home-panel",7),J.TgZ(11,"p"),J.SDv(12,8),J.qZA(),J.TgZ(13,"p"),J.SDv(14,9),J.qZA(),J.qZA(),J.TgZ(15,"app-home-panel",10),J.TgZ(16,"p"),J.SDv(17,11),J.qZA(),J.TgZ(18,"p"),J.SDv(19,12),J.qZA(),J.qZA(),J.TgZ(20,"app-home-panel",13),J.TgZ(21,"p"),J.SDv(22,14),J.qZA(),J.TgZ(23,"p"),J.SDv(24,15),J.qZA(),J.qZA(),J.TgZ(25,"app-home-panel",16),J.TgZ(26,"p"),J.SDv(27,17),J.qZA(),J.TgZ(28,"p"),J.SDv(29,18),J.qZA(),J.qZA(),J.TgZ(30,"app-home-panel",19),J.TgZ(31,"p"),J.SDv(32,20),J.qZA(),J.TgZ(33,"p"),J.SDv(34,21),J.qZA(),J.qZA(),J.TgZ(35,"app-home-panel",22),J.TgZ(36,"p"),J.SDv(37,23),J.qZA(),J.TgZ(38,"p"),J.SDv(39,24),J.qZA(),J.TgZ(40,"button",4),J.NdJ("click",function(){return t.getStarted()}),J.YNc(41,E,2,0,"ng-container",5),J.YNc(42,W,2,0,"ng-container",5),J.qZA(),J.YNc(43,X,2,2,"button",6),J.qZA(),J.qZA(),J.TgZ(44,"mat-toolbar",25),J.TgZ(45,"div",26),J.TgZ(46,"small"),J._uU(47," \xa9 Global Symbols CIC "),J.qZA(),J.qZA(),J.qZA()),2&e&&(J.xp6(1),J.Q6J("even",!1),J.xp6(5),J.Q6J("ngSwitch",t.signedIn),J.xp6(1),J.Q6J("ngSwitchCase",!0),J.xp6(1),J.Q6J("ngSwitchCase",!1),J.xp6(1),J.Q6J("ngIf",t.signedIn),J.xp6(1),J.Q6J("even",!0),J.xp6(5),J.Q6J("even",!1),J.xp6(5),J.Q6J("even",!0),J.xp6(5),J.Q6J("even",!1),J.xp6(5),J.Q6J("even",!0),J.xp6(5),J.Q6J("even",!1),J.xp6(5),J.Q6J("ngSwitch",t.signedIn),J.xp6(1),J.Q6J("ngSwitchCase",!0),J.xp6(1),J.Q6J("ngSwitchCase",!1),J.xp6(1),J.Q6J("ngIf",t.signedIn))},directives:[_,G.lW,k.RF,k.n9,k.O5,I.Ye,B.yH,O.rH],styles:[".example-container[_ngcontent-%COMP%]{display:flex;flex-direction:column;position:absolute;top:40rem;bottom:0;left:0;right:0}.container[_ngcontent-%COMP%]{font-size:1.2rem;padding:0 2rem}p[_ngcontent-%COMP%]{line-height:1.8rem}.button-lg[_ngcontent-%COMP%]{font-size:1.2rem;line-height:3rem;padding:0 32px}"]}),$}(),ee=D(22797),te=D(77154),ae=D(52309),ne=D(87672),oe=[{path:"",component:V,pathMatch:"full"}],ie=((K=function e(){Q(this,e)}).\u0275fac=function(e){return new(e||K)},K.\u0275mod=J.oAB({type:K}),K.\u0275inj=J.cJS({imports:[[k.ez,O.Bz.forChild(oe),ee.QW,G.ot,te.o9,ae.N6,ne.Cq,I.g0]]}),K)}}])}();