(self.webpackChunkboardbuilder=self.webpackChunkboardbuilder||[]).push([[860],{46024:function(t,e,a){"use strict";a.d(e,{t:function(){return i}});class i{constructor(t){t&&this.deserialise(t)}deserialise(t){return Object.assign(this,t),this}get shortEdge(){return Math.min.apply(Math,[this.x,this.y])}get longEdge(){return Math.max.apply(Math,[this.x,this.y])}get ratio(){return this.longEdge/this.shortEdge}}},74703:function(t,e,a){"use strict";a.d(e,{q:function(){return I}});var i=a(35366),o=a(91286),n=a(35965),d=a(13070),l=a(61116),r=a(9550),s=a(31041),c=a(79418),h=a(57173),g=a(23695),p=a(13841),b=a(87064),u=a(84369),m=a(24311),f=a(46024);function x(t,e){if(1&t&&(i.O4$(),i._UZ(0,"use",14)),2&t){const t=e.$implicit,a=i.oxw();i.uIk("x",t.x)("y",t.y)("height",t.height)("width",t.width)("href","#"+a.randomId+"caption-"+a.board.captions_position)}}let Z=(()=>{class t{constructor(){this.paper=new f.t({name:"A4",x:210,y:297}),this.cellSpacingFraction=.2,this.pagePaddingFraction=.1,this.pageOutlineColour="#6b6b6b",this.generateRandomId(1,1e8)}ngOnChanges(){this.calculatePageDimensions(),this.pagePadding=this.paper.shortEdge*this.pagePaddingFraction,this.pageInnerHeight=this.height-2*this.pagePadding,this.pageInnerWidth=this.width-2*this.pagePadding,this.calculateCellSpacing(),this.innerPageTranslate=`translate(${this.pagePadding} ${this.pagePadding})`,this.viewBox=`0 0 ${this.width} ${this.height}`,this.innerPageViewBox=`${this.pagePadding} ${this.pagePadding} ${this.width-2*this.pagePadding} ${this.height-2*this.pagePadding}`,this.pageOutlineWidth=this.paper.longEdge/55,this.thumbnails=[];const t=(this.pageInnerWidth-this.cellSpacing*(this.board.columns-1))/this.board.columns,e=(this.pageInnerHeight-this.cellSpacing*(this.board.rows-1))/this.board.rows;let a=0;for(let i=1;i<=this.board.rows;i++){let i=0;for(let o=1;o<=this.board.columns;o++)this.thumbnails.push({x:i,y:a,height:e,width:t}),i=i+t+this.cellSpacing;a=a+e+this.cellSpacing}}calculateCellSpacing(){const t=Math.max.apply(Math,[this.board.rows,this.board.columns]),e=Math.max.apply(Math,[this.pageInnerHeight,this.pageInnerWidth]);this.cellSpacing=e/t*this.cellSpacingFraction}calculatePageDimensions(){const t=["left","right"].includes(this.board.captions_position)?2:1;this.board.rows>this.board.columns*t?(this.height=this.paper.longEdge,this.width=this.paper.shortEdge,this.svgWidth="auto",this.svgHeight=this.size):(this.height=this.paper.shortEdge,this.width=this.paper.longEdge,this.svgWidth=this.size,this.svgHeight="auto")}generateRandomId(t,e){this.randomId=Math.floor(Math.random()*(e-t)+t)}}return t.\u0275fac=function(e){return new(e||t)},t.\u0275cmp=i.Xpm({type:t,selectors:[["app-board-preview-svg"]],inputs:{board:"board",paper:"paper",selected:"selected",size:"size",maxHeight:"maxHeight",maxWidth:"maxWidth"},features:[i.TTD],decls:23,vars:30,consts:[["xmlns","http://www.w3.org/2000/svg","shape-rendering","geometricPrecision","image-rendering","optimizeQuality","fill-rule","evenodd"],["d","M14 6l-3.75 5 2.85 3.8-1.6 1.2C9.81 13.75 7 10 7 10l-6 8h22L14 6z",3,"id"],["viewBox","0 0 24 24",3,"id"],[1,"thumbnail"],["transform","translate(0, 4)",1,"thumbnail"],["x1","1","y1","4","x2","23","y2","4",1,"text"],["transform","translate(0, -4)",1,"thumbnail"],["x1","1","y1","20","x2","23","y2","20",1,"text"],["viewBox","0 0 52 24",3,"id"],["transform","translate(28, 0)",1,"thumbnail"],["x1","0","y1","12","x2","24","y2","12",1,"text"],["x1","28","y1","12","x2","52","y2","12",1,"text"],[1,"page"],["class","cell",4,"ngFor","ngForOf"],[1,"cell"]],template:function(t,e){1&t&&(i.O4$(),i.TgZ(0,"svg",0),i.TgZ(1,"style"),i._uU(2," .thumbnail { fill: #006aba; } .text { stroke-width: 2; stroke: #006aba; } .page { fill: none; } svg:not(.selected):hover .page { fill: #BEE0FC; } .selected .text { stroke: white; } .selected use.thumbnail { fill: white; } .selected .page { fill: #006aba; } "),i.qZA(),i.TgZ(3,"defs"),i._UZ(4,"path",1),i.qZA(),i.TgZ(5,"symbol",2),i._UZ(6,"use",3),i.qZA(),i.TgZ(7,"symbol",2),i._UZ(8,"use",4),i._UZ(9,"line",5),i.qZA(),i.TgZ(10,"symbol",2),i._UZ(11,"use",6),i._UZ(12,"line",7),i.qZA(),i.TgZ(13,"symbol",8),i._UZ(14,"use",9),i._UZ(15,"line",10),i.qZA(),i.TgZ(16,"symbol",8),i._UZ(17,"use",3),i._UZ(18,"line",11),i.qZA(),i.TgZ(19,"g"),i._UZ(20,"rect",12),i.TgZ(21,"g"),i.YNc(22,x,1,5,"use",13),i.qZA(),i.qZA(),i.qZA()),2&t&&(i.Udp("width",e.svgWidth)("height",e.svgHeight)("max-height",e.maxHeight)("max-width",e.maxWidth),i.ekj("selected",e.selected),i.uIk("viewBox",e.viewBox),i.xp6(4),i.Q6J("id",e.randomId+"thumbnail"),i.xp6(1),i.Q6J("id",e.randomId+"caption-hidden"),i.xp6(1),i.uIk("href","#"+e.randomId+"thumbnail"),i.xp6(1),i.Q6J("id",e.randomId+"caption-above"),i.xp6(1),i.uIk("href","#"+e.randomId+"thumbnail"),i.xp6(2),i.Q6J("id",e.randomId+"caption-below"),i.xp6(1),i.uIk("href","#"+e.randomId+"thumbnail"),i.xp6(2),i.Q6J("id",e.randomId+"caption-left"),i.xp6(1),i.uIk("href","#"+e.randomId+"thumbnail"),i.xp6(2),i.Q6J("id",e.randomId+"caption-right"),i.xp6(1),i.uIk("href","#"+e.randomId+"thumbnail"),i.xp6(3),i.uIk("x",e.pageOutlineWidth)("y",e.pageOutlineWidth)("width",e.width-2*e.pageOutlineWidth)("height",e.height-2*e.pageOutlineWidth)("stroke",e.pageOutlineColour)("stroke-width",e.pageOutlineWidth),i.xp6(1),i.uIk("transform",e.innerPageTranslate),i.xp6(1),i.Q6J("ngForOf",e.thumbnails))},directives:[l.sg],styles:[""]}),t})();const T=["titleField"];function w(t,e){1&t&&(i.ynx(0),i.SDv(1,35),i.BQk())}function v(t,e){1&t&&(i.TgZ(0,"mat-hint"),i.SDv(1,36),i.qZA())}function y(t,e){1&t&&(i.ynx(0),i.SDv(1,37),i.BQk())}function A(t,e){if(1&t){const t=i.EpF();i.TgZ(0,"div",38),i.TgZ(1,"button",39),i.NdJ("click",function(){const e=i.CHM(t).$implicit;return i.oxw().selectTemplate(e)}),i._UZ(2,"app-board-preview-svg",40),i.qZA(),i.qZA()}if(2&t){const t=e.$implicit,a=i.oxw();i.xp6(1),i.Q6J("matTooltip",t.description),i.xp6(1),i.Q6J("board",t.board)("selected",a.board.matchesTemplate(t))}}let I=(()=>{class t{constructor(t){this.service=t}ngOnInit(){this.service.templates().subscribe(t=>{this.templates=t,this.board.persisted()&&!t.find(t=>this.board.matchesTemplate(t))&&(this.selectedTab=2)})}selectTemplate(t){this.board.rows=t.board.rows,this.board.columns=t.board.columns,this.board.captions_position=t.board.captions_position,this.board.populateCells()}focusTitleField(){setTimeout(()=>this.titleField.nativeElement.select(),500)}}return t.\u0275fac=function(e){return new(e||t)(i.Y36(o.$))},t.\u0275cmp=i.Xpm({type:t,selectors:[["app-board-editor-form"]],viewQuery:function(t,e){if(1&t&&i.Gf(T,5),2&t){let t;i.iGM(t=i.CRH())&&(e.titleField=t.first)}},inputs:{board:"board"},decls:53,vars:24,consts:function(){let t,e,a,i,o,n,d,l,r,s,c,h,g,p,b,u,m,f;return t="\u0417\u0430\u0433\u043B\u0430\u0432\u0438\u0435 / \u0422\u0435\u043C\u0430",e="\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435",a="\u0444\u0430\u043A\u0443\u043B\u0442\u0430\u0442\u0438\u0432\u0435\u043D. \u041F\u043E\u043A\u0430\u0437\u0430\u043D\u0438 \u0432 PDF \u0444\u0430\u0439\u043B\u043E\u0432\u0435, \u043D\u0430\u043F\u0440\u0430\u0432\u0435\u043D\u0438 \u043E\u0442 \u0442\u043E\u0437\u0438 \u0441\u044A\u0432\u0435\u0442.",i="\u041E\u0444\u043E\u0440\u043C\u043B\u0435\u043D\u0438\u0435",o="\u041E\u0431\u0449\u0438 \u0448\u0430\u0431\u043B\u043E\u043D\u0438",n="\u041F\u043E\u0442\u0440\u0435\u0431\u0438\u0442\u0435\u043B\u0441\u043A\u0438 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438",d="\u041A\u043E\u043B\u043E\u043D\u0438: " + "\ufffd0\ufffd" + "",l="\u0420\u0435\u0434\u043E\u0432\u0435: " + "\ufffd0\ufffd" + "",r="\u041F\u043E\u0437\u0438\u0446\u0438\u044F \u043D\u0430 \u043D\u0430\u0434\u043F\u0438\u0441\u0430",s="\u0432\u0440\u044A\u0445",c="\u0434\u044A\u043D\u043E",h="\u041B\u044F\u0432\u043E",g="\u0414\u044F\u0441\u043D\u043E",p="\u0421\u043A\u0440\u0438\u0442",b="\u0417\u0430\u0434\u0430\u0432\u0430 \u043C\u044F\u0441\u0442\u043E\u0442\u043E, \u043A\u044A\u0434\u0435\u0442\u043E \u0442\u0435\u043A\u0441\u0442\u044A\u0442 \u0441\u0435 \u043F\u043E\u043A\u0430\u0437\u0432\u0430 \u0432\u044A\u0432 \u0432\u0441\u044F\u043A\u0430 \u043A\u043B\u0435\u0442\u043A\u0430 \u0441\u043F\u0440\u044F\u043C\u043E \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435\u0442\u043E.",u="\u041F\u044A\u0440\u0432\u0438 \u0441\u044A\u0432\u0435\u0442",m="\u0418\u0437\u0431\u0435\u0440\u0435\u0442\u0435 \u0438\u043C\u0435 \u0437\u0430 \u043F\u044A\u0440\u0432\u0438\u044F \u0421\u044A\u0432\u0435\u0442 \u0432 \u043D\u043E\u0432\u0438\u044F \u0441\u0438 \u043D\u0430\u0431\u043E\u0440 \u043E\u0442 \u0434\u044A\u0441\u043A\u0438.",f="\u041F\u044A\u0440\u0432\u0438 \u0441\u044A\u0432\u0435\u0442",[["fxLayoutGap","20px grid"],["fxFlex","50",1,"w-100"],[4,"ngIf"],t,["matInput","","required","","maxlength","250","appStopPropagation","",3,"ngModel","ngModelChange"],["titleField",""],["align","end"],["fxFlex","50",1,"w-100","mb-2"],e,["matInput","","maxlength","250","appStopPropagation","",3,"ngModel","ngModelChange"],a,i,["mat-stretch-tabs","","dynamicHeight","",3,"selectedIndex","selectedIndexChange"],["label",o],["fxLayout","row wrap","fxLayoutGap","20px grid","fxLayoutAlign","space-around center",1,"w-100","p-1"],["fxFlex","0 1 calc(25% - 20px)","class","template",4,"ngFor","ngForOf"],["label",n],["fxLayout","row","fxLayoutAlign","space-between start","fxLayoutGap","20px",1,"mt-2"],["fxFlex","50"],d,["appStopPropagation","",1,"example-margin","w-100",3,"max","min","step","thumbLabel","tickInterval","ngModel","ngModelChange","change"],l,r,["appStopPropagation","",3,"ngModel","ngModelChange"],["value","above"],s,["value","below"],c,["value","left"],h,["value","right"],g,["value","hidden"],p,b,u,m,f,["fxFlex","0 1 calc(25% - 20px)",1,"template"],["mat-button","","color","primary","appStopPropagation","","disableRipple","",3,"matTooltip","click"],["size","90","maxHeight","90","maxWidth","90",3,"board","selected"]]},template:function(t,e){1&t&&(i.TgZ(0,"div",0),i.TgZ(1,"mat-form-field",1),i.TgZ(2,"mat-label"),i.YNc(3,w,2,0,"ng-container",2),i.ynx(4),i.SDv(5,3),i.BQk(),i.qZA(),i.TgZ(6,"input",4,5),i.NdJ("ngModelChange",function(t){return e.board.title=t}),i.qZA(),i.YNc(8,v,2,0,"mat-hint",2),i.TgZ(9,"mat-hint",6),i._uU(10),i.qZA(),i.qZA(),i.TgZ(11,"mat-form-field",7),i.TgZ(12,"mat-label"),i.YNc(13,y,2,0,"ng-container",2),i.ynx(14),i.SDv(15,8),i.BQk(),i.qZA(),i.TgZ(16,"input",9),i.NdJ("ngModelChange",function(t){return e.board.description=t}),i.qZA(),i.TgZ(17,"mat-hint"),i.SDv(18,10),i.qZA(),i.TgZ(19,"mat-hint",6),i._uU(20),i.qZA(),i.qZA(),i.qZA(),i.TgZ(21,"div"),i.TgZ(22,"h2"),i.SDv(23,11),i.qZA(),i.TgZ(24,"mat-tab-group",12),i.NdJ("selectedIndexChange",function(t){return e.selectedTab=t}),i.TgZ(25,"mat-tab",13),i.TgZ(26,"div",14),i.YNc(27,A,3,3,"div",15),i.qZA(),i.qZA(),i.TgZ(28,"mat-tab",16),i.TgZ(29,"div",17),i.TgZ(30,"div",18),i.TgZ(31,"mat-label"),i.SDv(32,19),i.qZA(),i.TgZ(33,"mat-slider",20),i.NdJ("ngModelChange",function(t){return e.board.columns=t})("change",function(){return e.board.populateCells()}),i.qZA(),i.TgZ(34,"mat-label"),i.SDv(35,21),i.qZA(),i.TgZ(36,"mat-slider",20),i.NdJ("ngModelChange",function(t){return e.board.rows=t})("change",function(){return e.board.populateCells()}),i.qZA(),i.qZA(),i.TgZ(37,"mat-form-field",18),i.TgZ(38,"mat-label"),i.SDv(39,22),i.qZA(),i.TgZ(40,"mat-select",23),i.NdJ("ngModelChange",function(t){return e.board.captions_position=t}),i.TgZ(41,"mat-option",24),i.SDv(42,25),i.qZA(),i.TgZ(43,"mat-option",26),i.SDv(44,27),i.qZA(),i.TgZ(45,"mat-option",28),i.SDv(46,29),i.qZA(),i.TgZ(47,"mat-option",30),i.SDv(48,31),i.qZA(),i.TgZ(49,"mat-option",32),i.SDv(50,33),i.qZA(),i.qZA(),i.TgZ(51,"mat-hint"),i.SDv(52,34),i.qZA(),i.qZA(),i.qZA(),i.qZA(),i.qZA(),i.qZA()),2&t&&(i.xp6(3),i.Q6J("ngIf",!e.board.board_set_id),i.xp6(3),i.Q6J("ngModel",e.board.title),i.xp6(2),i.Q6J("ngIf",!e.board.board_set_id||!0),i.xp6(2),i.hij("",(null==e.board.title?null:e.board.title.length)||0,"\xa0/\xa0250"),i.xp6(3),i.Q6J("ngIf",!e.board.board_set_id),i.xp6(3),i.Q6J("ngModel",e.board.description),i.xp6(4),i.hij("",(null==e.board.description?null:e.board.description.length)||0,"\xa0/\xa0250"),i.xp6(4),i.Q6J("selectedIndex",e.selectedTab),i.xp6(3),i.Q6J("ngForOf",e.templates),i.xp6(5),i.pQV(e.board.columns),i.QtT(32),i.xp6(1),i.Q6J("max",12)("min",1)("step",1)("thumbLabel",!0)("tickInterval",1)("ngModel",e.board.columns),i.xp6(2),i.pQV(e.board.rows),i.QtT(35),i.xp6(1),i.Q6J("max",12)("min",1)("step",1)("thumbLabel",!0)("tickInterval",1)("ngModel",e.board.rows),i.xp6(4),i.Q6J("ngModel",e.board.captions_position))},directives:[n.SQ,d.KE,n.yH,d.hX,l.O5,r.Nt,s.Fj,s.Q7,s.nD,c._,s.JJ,s.On,d.bx,h.SP,h.uX,n.xw,n.Wh,l.sg,g.pH,p.gD,b.ey,u.lW,m.gM,Z],styles:[".template[_ngcontent-%COMP%]{text-align:center}.template[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{padding:0}.template[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{max-height:90px;max-width:90px}mat-tab-body[_ngcontent-%COMP%]{padding-top:20px}"]}),t})()}}]);