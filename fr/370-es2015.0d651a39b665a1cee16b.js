(self.webpackChunkboardbuilder=self.webpackChunkboardbuilder||[]).push([[370],{86370:function(e,t,n){"use strict";n.r(t),n.d(t,{BoardSetsModule:function(){return it},routes:function(){return nt}});var i=n(61116),o=n(33464),r=n(12762),a=n(31041),s=n(91550),l=n(74703),c=n(35366),p=n(92935),d=n(93315),u=n(69244),h=n(35965),m=n(84369),f=n(79418),g=n(77307),b=n(82151),x=n(97388),_=n(94720),v=n(19861),S=n(99235),w=n(55959),y=n(40878),Z=n(56238),I=n(25416);function T(e,t){1&e&&c.Hsn(0)}const A=["*"];let O=(()=>{class e{constructor(e){this._elementRef=e}focus(){this._elementRef.nativeElement.focus()}}return e.\u0275fac=function(t){return new(t||e)(c.Y36(c.SBq))},e.\u0275dir=c.lG2({type:e,selectors:[["","cdkStepHeader",""]],hostAttrs:["role","tab"]}),e})(),C=(()=>{class e{constructor(e){this.template=e}}return e.\u0275fac=function(t){return new(t||e)(c.Y36(c.Rgc))},e.\u0275dir=c.lG2({type:e,selectors:[["","cdkStepLabel",""]]}),e})(),k=0;const B=new c.OlP("STEPPER_GLOBAL_OPTIONS");let q=(()=>{class e{constructor(e,t){this._stepper=e,this.interacted=!1,this.interactedStream=new c.vpe,this._editable=!0,this._optional=!1,this._completedOverride=null,this._customError=null,this._stepperOptions=t||{},this._displayDefaultIndicatorType=!1!==this._stepperOptions.displayDefaultIndicatorType,this._showError=!!this._stepperOptions.showError}get editable(){return this._editable}set editable(e){this._editable=(0,v.Ig)(e)}get optional(){return this._optional}set optional(e){this._optional=(0,v.Ig)(e)}get completed(){return null==this._completedOverride?this._getDefaultCompleted():this._completedOverride}set completed(e){this._completedOverride=(0,v.Ig)(e)}_getDefaultCompleted(){return this.stepControl?this.stepControl.valid&&this.interacted:this.interacted}get hasError(){return null==this._customError?this._getDefaultError():this._customError}set hasError(e){this._customError=(0,v.Ig)(e)}_getDefaultError(){return this.stepControl&&this.stepControl.invalid&&this.interacted}select(){this._stepper.selected=this}reset(){this.interacted=!1,null!=this._completedOverride&&(this._completedOverride=!1),null!=this._customError&&(this._customError=!1),this.stepControl&&this.stepControl.reset()}ngOnChanges(){this._stepper._stateChanged()}_markAsInteracted(){this.interacted||(this.interacted=!0,this.interactedStream.emit(this))}}return e.\u0275fac=function(t){return new(t||e)(c.Y36((0,c.Gpc)(()=>z)),c.Y36(B,8))},e.\u0275cmp=c.Xpm({type:e,selectors:[["cdk-step"]],contentQueries:function(e,t,n){if(1&e&&c.Suo(n,C,5),2&e){let e;c.iGM(e=c.CRH())&&(t.stepLabel=e.first)}},viewQuery:function(e,t){if(1&e&&c.Gf(c.Rgc,7),2&e){let e;c.iGM(e=c.CRH())&&(t.content=e.first)}},inputs:{editable:"editable",optional:"optional",completed:"completed",hasError:"hasError",stepControl:"stepControl",label:"label",errorMessage:"errorMessage",ariaLabel:["aria-label","ariaLabel"],ariaLabelledby:["aria-labelledby","ariaLabelledby"],state:"state"},outputs:{interactedStream:"interacted"},exportAs:["cdkStep"],features:[c.TTD],ngContentSelectors:A,decls:1,vars:0,template:function(e,t){1&e&&(c.F$t(),c.YNc(0,T,1,0,"ng-template"))},encapsulation:2,changeDetection:0}),e})(),z=(()=>{class e{constructor(e,t,n,i){this._dir=e,this._changeDetectorRef=t,this._elementRef=n,this._destroyed=new w.xQ,this.steps=new c.n_E,this._linear=!1,this._selectedIndex=0,this.selectionChange=new c.vpe,this._orientation="horizontal",this._groupId=k++,this._document=i}get linear(){return this._linear}set linear(e){this._linear=(0,v.Ig)(e)}get selectedIndex(){return this._selectedIndex}set selectedIndex(e){var t;const n=(0,v.su)(e);this.steps&&this._steps?(this._isValidIndex(e),null===(t=this.selected)||void 0===t||t._markAsInteracted(),this._selectedIndex!==n&&!this._anyControlsInvalidOrPending(n)&&(n>=this._selectedIndex||this.steps.toArray()[n].editable)&&this._updateSelectedItemIndex(e)):this._selectedIndex=n}get selected(){return this.steps?this.steps.toArray()[this.selectedIndex]:void 0}set selected(e){this.selectedIndex=e&&this.steps?this.steps.toArray().indexOf(e):-1}get orientation(){return this._orientation}set orientation(e){this._orientation=e,this._keyManager&&this._keyManager.withVerticalOrientation("vertical"===e)}ngAfterContentInit(){this._steps.changes.pipe((0,Z.O)(this._steps),(0,I.R)(this._destroyed)).subscribe(e=>{this.steps.reset(e.filter(e=>e._stepper===this)),this.steps.notifyOnChanges()})}ngAfterViewInit(){this._keyManager=new x.Em(this._stepHeader).withWrap().withHomeAndEnd().withVerticalOrientation("vertical"===this._orientation),(this._dir?this._dir.change:(0,y.of)()).pipe((0,Z.O)(this._layoutDirection()),(0,I.R)(this._destroyed)).subscribe(e=>this._keyManager.withHorizontalOrientation(e)),this._keyManager.updateActiveItem(this._selectedIndex),this.steps.changes.subscribe(()=>{this.selected||(this._selectedIndex=Math.max(this._selectedIndex-1,0))}),this._isValidIndex(this._selectedIndex)||(this._selectedIndex=0)}ngOnDestroy(){this.steps.destroy(),this._destroyed.next(),this._destroyed.complete()}next(){this.selectedIndex=Math.min(this._selectedIndex+1,this.steps.length-1)}previous(){this.selectedIndex=Math.max(this._selectedIndex-1,0)}reset(){this._updateSelectedItemIndex(0),this.steps.forEach(e=>e.reset()),this._stateChanged()}_getStepLabelId(e){return`cdk-step-label-${this._groupId}-${e}`}_getStepContentId(e){return`cdk-step-content-${this._groupId}-${e}`}_stateChanged(){this._changeDetectorRef.markForCheck()}_getAnimationDirection(e){const t=e-this._selectedIndex;return t<0?"rtl"===this._layoutDirection()?"next":"previous":t>0?"rtl"===this._layoutDirection()?"previous":"next":"current"}_getIndicatorType(e,t="number"){const n=this.steps.toArray()[e],i=this._isCurrentStep(e);return n._displayDefaultIndicatorType?this._getDefaultIndicatorLogic(n,i):this._getGuidelineLogic(n,i,t)}_getDefaultIndicatorLogic(e,t){return e._showError&&e.hasError&&!t?"error":!e.completed||t?"number":e.editable?"edit":"done"}_getGuidelineLogic(e,t,n="number"){return e._showError&&e.hasError&&!t?"error":e.completed&&!t?"done":e.completed&&t?n:e.editable&&t?"edit":n}_isCurrentStep(e){return this._selectedIndex===e}_getFocusIndex(){return this._keyManager?this._keyManager.activeItemIndex:this._selectedIndex}_updateSelectedItemIndex(e){const t=this.steps.toArray();this.selectionChange.emit({selectedIndex:e,previouslySelectedIndex:this._selectedIndex,selectedStep:t[e],previouslySelectedStep:t[this._selectedIndex]}),this._containsFocus()?this._keyManager.setActiveItem(e):this._keyManager.updateActiveItem(e),this._selectedIndex=e,this._stateChanged()}_onKeydown(e){const t=(0,S.Vb)(e),n=e.keyCode,i=this._keyManager;null==i.activeItemIndex||t||n!==S.L_&&n!==S.K5?i.onKeydown(e):(this.selectedIndex=i.activeItemIndex,e.preventDefault())}_anyControlsInvalidOrPending(e){return!!(this._linear&&e>=0)&&this.steps.toArray().slice(0,e).some(e=>{const t=e.stepControl;return(t?t.invalid||t.pending||!e.interacted:!e.completed)&&!e.optional&&!e._completedOverride})}_layoutDirection(){return this._dir&&"rtl"===this._dir.value?"rtl":"ltr"}_containsFocus(){const e=this._elementRef.nativeElement,t=this._document.activeElement;return e===t||e.contains(t)}_isValidIndex(e){return e>-1&&(!this.steps||e<this.steps.length)}}return e.\u0275fac=function(t){return new(t||e)(c.Y36(_.Is,8),c.Y36(c.sBO),c.Y36(c.SBq),c.Y36(i.K0))},e.\u0275dir=c.lG2({type:e,selectors:[["","cdkStepper",""]],contentQueries:function(e,t,n){if(1&e&&(c.Suo(n,q,5),c.Suo(n,O,5)),2&e){let e;c.iGM(e=c.CRH())&&(t._steps=e),c.iGM(e=c.CRH())&&(t._stepHeader=e)}},inputs:{linear:"linear",selectedIndex:"selectedIndex",selected:"selected",orientation:"orientation"},outputs:{selectionChange:"selectionChange"},exportAs:["cdkStepper"]}),e})(),F=(()=>{class e{constructor(e){this._stepper=e,this.type="submit"}_handleClick(){this._stepper.next()}}return e.\u0275fac=function(t){return new(t||e)(c.Y36(z))},e.\u0275dir=c.lG2({type:e,selectors:[["button","cdkStepperNext",""]],hostVars:1,hostBindings:function(e,t){1&e&&c.NdJ("click",function(){return t._handleClick()}),2&e&&c.Ikx("type",t.type)},inputs:{type:"type"}}),e})(),D=(()=>{class e{constructor(e){this._stepper=e,this.type="button"}_handleClick(){this._stepper.previous()}}return e.\u0275fac=function(t){return new(t||e)(c.Y36(z))},e.\u0275dir=c.lG2({type:e,selectors:[["button","cdkStepperPrevious",""]],hostVars:1,hostBindings:function(e,t){1&e&&c.NdJ("click",function(){return t._handleClick()}),2&e&&c.Ikx("type",t.type)},inputs:{type:"type"}}),e})(),Q=(()=>{class e{}return e.\u0275fac=function(t){return new(t||e)},e.\u0275mod=c.oAB({type:e}),e.\u0275inj=c.cJS({imports:[[_.vT]]}),e})();var M=n(87064),Y=n(87570),J=n(44689),L=n(79996),R=n(98720),E=n(99713);function N(e,t){if(1&e&&c.GkF(0,8),2&e){const e=c.oxw();c.Q6J("ngTemplateOutlet",e.iconOverrides[e.state])("ngTemplateOutletContext",e._getIconContext())}}function G(e,t){if(1&e&&(c.TgZ(0,"span"),c._uU(1),c.qZA()),2&e){const e=c.oxw(2);c.xp6(1),c.Oqu(e._getDefaultTextForState(e.state))}}function P(e,t){if(1&e&&(c.TgZ(0,"mat-icon"),c._uU(1),c.qZA()),2&e){const e=c.oxw(2);c.xp6(1),c.Oqu(e._getDefaultTextForState(e.state))}}function $(e,t){if(1&e&&(c.ynx(0,9),c.YNc(1,G,2,1,"span",10),c.YNc(2,P,2,1,"mat-icon",11),c.BQk()),2&e){const e=c.oxw();c.Q6J("ngSwitch",e.state),c.xp6(1),c.Q6J("ngSwitchCase","number")}}function H(e,t){if(1&e&&(c.TgZ(0,"div",12),c.GkF(1,13),c.qZA()),2&e){const e=c.oxw();c.xp6(1),c.Q6J("ngTemplateOutlet",e._templateLabel().template)}}function U(e,t){if(1&e&&(c.TgZ(0,"div",12),c._uU(1),c.qZA()),2&e){const e=c.oxw();c.xp6(1),c.Oqu(e.label)}}function j(e,t){if(1&e&&(c.TgZ(0,"div",14),c._uU(1),c.qZA()),2&e){const e=c.oxw();c.xp6(1),c.Oqu(e._intl.optionalLabel)}}function V(e,t){if(1&e&&(c.TgZ(0,"div",15),c._uU(1),c.qZA()),2&e){const e=c.oxw();c.xp6(1),c.Oqu(e.errorMessage)}}function K(e,t){}function W(e,t){if(1&e&&(c.Hsn(0),c.YNc(1,K,0,0,"ng-template",0)),2&e){const e=c.oxw();c.xp6(1),c.Q6J("cdkPortalOutlet",e._portal)}}const X=["*"];function ee(e,t){1&e&&c._UZ(0,"div",9)}const te=function(e,t){return{step:e,i:t}};function ne(e,t){if(1&e&&(c.ynx(0),c.GkF(1,7),c.YNc(2,ee,1,0,"div",8),c.BQk()),2&e){const e=t.$implicit,n=t.index,i=t.last;c.oxw(2);const o=c.MAs(4);c.xp6(1),c.Q6J("ngTemplateOutlet",o)("ngTemplateOutletContext",c.WLB(3,te,e,n)),c.xp6(1),c.Q6J("ngIf",!i)}}function ie(e,t){if(1&e){const e=c.EpF();c.TgZ(0,"div",10),c.NdJ("@horizontalStepTransition.done",function(t){return c.CHM(e),c.oxw(2)._animationDone.next(t)}),c.GkF(1,11),c.qZA()}if(2&e){const e=t.$implicit,n=t.index,i=c.oxw(2);c.Q6J("@horizontalStepTransition",i._getAnimationDirection(n))("id",i._getStepContentId(n)),c.uIk("aria-labelledby",i._getStepLabelId(n))("aria-expanded",i.selectedIndex===n),c.xp6(1),c.Q6J("ngTemplateOutlet",e.content)}}function oe(e,t){if(1&e&&(c.ynx(0),c.TgZ(1,"div",3),c.YNc(2,ne,3,6,"ng-container",4),c.qZA(),c.TgZ(3,"div",5),c.YNc(4,ie,2,5,"div",6),c.qZA(),c.BQk()),2&e){const e=c.oxw();c.xp6(2),c.Q6J("ngForOf",e.steps),c.xp6(2),c.Q6J("ngForOf",e.steps)}}function re(e,t){if(1&e){const e=c.EpF();c.TgZ(0,"div",13),c.GkF(1,7),c.TgZ(2,"div",14),c.TgZ(3,"div",15),c.NdJ("@verticalStepTransition.done",function(t){return c.CHM(e),c.oxw(2)._animationDone.next(t)}),c.TgZ(4,"div",16),c.GkF(5,11),c.qZA(),c.qZA(),c.qZA(),c.qZA()}if(2&e){const e=t.$implicit,n=t.index,i=t.last,o=c.oxw(2),r=c.MAs(4);c.xp6(1),c.Q6J("ngTemplateOutlet",r)("ngTemplateOutletContext",c.WLB(9,te,e,n)),c.xp6(1),c.ekj("mat-stepper-vertical-line",!i),c.xp6(1),c.Q6J("@verticalStepTransition",o._getAnimationDirection(n))("id",o._getStepContentId(n)),c.uIk("aria-labelledby",o._getStepLabelId(n))("aria-expanded",o.selectedIndex===n),c.xp6(2),c.Q6J("ngTemplateOutlet",e.content)}}function ae(e,t){if(1&e&&(c.ynx(0),c.YNc(1,re,6,12,"div",12),c.BQk()),2&e){const e=c.oxw();c.xp6(1),c.Q6J("ngForOf",e.steps)}}function se(e,t){if(1&e){const e=c.EpF();c.TgZ(0,"mat-step-header",17),c.NdJ("click",function(){return t.step.select()})("keydown",function(t){return c.CHM(e),c.oxw()._onKeydown(t)}),c.qZA()}if(2&e){const e=t.step,n=t.i,i=c.oxw();c.ekj("mat-horizontal-stepper-header","horizontal"===i.orientation)("mat-vertical-stepper-header","vertical"===i.orientation),c.Q6J("tabIndex",i._getFocusIndex()===n?0:-1)("id",i._getStepLabelId(n))("index",n)("state",i._getIndicatorType(n,e.state))("label",e.stepLabel||e.label)("selected",i.selectedIndex===n)("active",e.completed||i.selectedIndex===n||!i.linear)("optional",e.optional)("errorMessage",e.errorMessage)("iconOverrides",i._iconOverrides)("disableRipple",i.disableRipple)("color",e.color||i.color),c.uIk("aria-posinset",n+1)("aria-setsize",i.steps.length)("aria-controls",i._getStepContentId(n))("aria-selected",i.selectedIndex==n)("aria-label",e.ariaLabel||null)("aria-labelledby",!e.ariaLabel&&e.ariaLabelledby?e.ariaLabelledby:null)}}let le=(()=>{class e extends C{}return e.\u0275fac=function(){let t;return function(n){return(t||(t=c.n5z(e)))(n||e)}}(),e.\u0275dir=c.lG2({type:e,selectors:[["","matStepLabel",""]],features:[c.qOj]}),e})(),ce=(()=>{class e{constructor(){this.changes=new w.xQ,this.optionalLabel="Optional"}}return e.\u0275fac=function(t){return new(t||e)},e.\u0275prov=c.Yz7({factory:function(){return new e},token:e,providedIn:"root"}),e})();const pe={provide:ce,deps:[[new c.FiY,new c.tp0,ce]],useFactory:function(e){return e||new ce}};class de extends O{constructor(e){super(e)}}const ue=(0,M.pj)(de,"primary");let he=(()=>{class e extends ue{constructor(e,t,n,i){super(n),this._intl=e,this._focusMonitor=t,this._intlSubscription=e.changes.subscribe(()=>i.markForCheck())}ngAfterViewInit(){this._focusMonitor.monitor(this._elementRef,!0)}ngOnDestroy(){this._intlSubscription.unsubscribe(),this._focusMonitor.stopMonitoring(this._elementRef)}focus(e,t){e?this._focusMonitor.focusVia(this._elementRef,e,t):this._elementRef.nativeElement.focus(t)}_stringLabel(){return this.label instanceof le?null:this.label}_templateLabel(){return this.label instanceof le?this.label:null}_getHostElement(){return this._elementRef.nativeElement}_getIconContext(){return{index:this.index,active:this.active,optional:this.optional}}_getDefaultTextForState(e){return"number"==e?`${this.index+1}`:"edit"==e?"create":"error"==e?"warning":e}}return e.\u0275fac=function(t){return new(t||e)(c.Y36(ce),c.Y36(x.tE),c.Y36(c.SBq),c.Y36(c.sBO))},e.\u0275cmp=c.Xpm({type:e,selectors:[["mat-step-header"]],hostAttrs:["role","tab",1,"mat-step-header"],inputs:{color:"color",state:"state",label:"label",errorMessage:"errorMessage",iconOverrides:"iconOverrides",index:"index",selected:"selected",active:"active",optional:"optional",disableRipple:"disableRipple"},features:[c.qOj],decls:10,vars:19,consts:[["matRipple","",1,"mat-step-header-ripple","mat-focus-indicator",3,"matRippleTrigger","matRippleDisabled"],[1,"mat-step-icon-content",3,"ngSwitch"],[3,"ngTemplateOutlet","ngTemplateOutletContext",4,"ngSwitchCase"],[3,"ngSwitch",4,"ngSwitchDefault"],[1,"mat-step-label"],["class","mat-step-text-label",4,"ngIf"],["class","mat-step-optional",4,"ngIf"],["class","mat-step-sub-label-error",4,"ngIf"],[3,"ngTemplateOutlet","ngTemplateOutletContext"],[3,"ngSwitch"],[4,"ngSwitchCase"],[4,"ngSwitchDefault"],[1,"mat-step-text-label"],[3,"ngTemplateOutlet"],[1,"mat-step-optional"],[1,"mat-step-sub-label-error"]],template:function(e,t){1&e&&(c._UZ(0,"div",0),c.TgZ(1,"div"),c.TgZ(2,"div",1),c.YNc(3,N,1,2,"ng-container",2),c.YNc(4,$,3,2,"ng-container",3),c.qZA(),c.qZA(),c.TgZ(5,"div",4),c.YNc(6,H,2,1,"div",5),c.YNc(7,U,2,1,"div",5),c.YNc(8,j,2,1,"div",6),c.YNc(9,V,2,1,"div",7),c.qZA()),2&e&&(c.Q6J("matRippleTrigger",t._getHostElement())("matRippleDisabled",t.disableRipple),c.xp6(1),c.Gre("mat-step-icon-state-",t.state," mat-step-icon"),c.ekj("mat-step-icon-selected",t.selected),c.xp6(1),c.Q6J("ngSwitch",!(!t.iconOverrides||!t.iconOverrides[t.state])),c.xp6(1),c.Q6J("ngSwitchCase",!0),c.xp6(2),c.ekj("mat-step-label-active",t.active)("mat-step-label-selected",t.selected)("mat-step-label-error","error"==t.state),c.xp6(1),c.Q6J("ngIf",t._templateLabel()),c.xp6(1),c.Q6J("ngIf",t._stringLabel()),c.xp6(1),c.Q6J("ngIf",t.optional&&"error"!=t.state),c.xp6(1),c.Q6J("ngIf","error"==t.state))},directives:[M.wG,i.RF,i.n9,i.ED,i.O5,i.tP,g.Hw],styles:[".mat-step-header{overflow:hidden;outline:none;cursor:pointer;position:relative;box-sizing:content-box;-webkit-tap-highlight-color:transparent}.mat-step-optional,.mat-step-sub-label-error{font-size:12px}.mat-step-icon{border-radius:50%;height:24px;width:24px;flex-shrink:0;position:relative}.mat-step-icon-content,.mat-step-icon .mat-icon{position:absolute;top:50%;left:50%;transform:translate(-50%, -50%)}.mat-step-icon .mat-icon{font-size:16px;height:16px;width:16px}.mat-step-icon-state-error .mat-icon{font-size:24px;height:24px;width:24px}.mat-step-label{display:inline-block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:50px;vertical-align:middle}.mat-step-text-label{text-overflow:ellipsis;overflow:hidden}.mat-step-header .mat-step-header-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}\n"],encapsulation:2,changeDetection:0}),e})();const me={horizontalStepTransition:(0,E.X$)("horizontalStepTransition",[(0,E.SB)("previous",(0,E.oB)({transform:"translate3d(-100%, 0, 0)",visibility:"hidden"})),(0,E.SB)("current",(0,E.oB)({transform:"none",visibility:"inherit"})),(0,E.SB)("next",(0,E.oB)({transform:"translate3d(100%, 0, 0)",visibility:"hidden"})),(0,E.eR)("* => *",(0,E.jt)("500ms cubic-bezier(0.35, 0, 0.25, 1)"))]),verticalStepTransition:(0,E.X$)("verticalStepTransition",[(0,E.SB)("previous",(0,E.oB)({height:"0px",visibility:"hidden"})),(0,E.SB)("next",(0,E.oB)({height:"0px",visibility:"hidden"})),(0,E.SB)("current",(0,E.oB)({height:"*",visibility:"inherit"})),(0,E.eR)("* <=> current",(0,E.jt)("225ms cubic-bezier(0.4, 0.0, 0.2, 1)"))])};let fe=(()=>{class e{constructor(e){this.templateRef=e}}return e.\u0275fac=function(t){return new(t||e)(c.Y36(c.Rgc))},e.\u0275dir=c.lG2({type:e,selectors:[["ng-template","matStepperIcon",""]],inputs:{name:["matStepperIcon","name"]}}),e})(),ge=(()=>{class e{constructor(e){this._template=e}}return e.\u0275fac=function(t){return new(t||e)(c.Y36(c.Rgc))},e.\u0275dir=c.lG2({type:e,selectors:[["ng-template","matStepContent",""]]}),e})(),be=(()=>{class e extends q{constructor(e,t,n,i){super(e,i),this._errorStateMatcher=t,this._viewContainerRef=n,this._isSelected=Y.w.EMPTY}ngAfterContentInit(){this._isSelected=this._stepper.steps.changes.pipe((0,J.w)(()=>this._stepper.selectionChange.pipe((0,L.U)(e=>e.selectedStep===this),(0,Z.O)(this._stepper.selected===this)))).subscribe(e=>{e&&this._lazyContent&&!this._portal&&(this._portal=new b.UE(this._lazyContent._template,this._viewContainerRef))})}ngOnDestroy(){this._isSelected.unsubscribe()}isErrorState(e,t){return this._errorStateMatcher.isErrorState(e,t)||!!(e&&e.invalid&&this.interacted)}}return e.\u0275fac=function(t){return new(t||e)(c.Y36((0,c.Gpc)(()=>Se)),c.Y36(M.rD,4),c.Y36(c.s_b),c.Y36(B,8))},e.\u0275cmp=c.Xpm({type:e,selectors:[["mat-step"]],contentQueries:function(e,t,n){if(1&e&&(c.Suo(n,le,5),c.Suo(n,ge,5)),2&e){let e;c.iGM(e=c.CRH())&&(t.stepLabel=e.first),c.iGM(e=c.CRH())&&(t._lazyContent=e.first)}},inputs:{color:"color"},exportAs:["matStep"],features:[c._Bn([{provide:M.rD,useExisting:e},{provide:q,useExisting:e}]),c.qOj],ngContentSelectors:X,decls:1,vars:0,consts:[[3,"cdkPortalOutlet"]],template:function(e,t){1&e&&(c.F$t(),c.YNc(0,W,2,1,"ng-template"))},directives:[b.Pl],encapsulation:2,changeDetection:0}),e})(),xe=(()=>{class e extends z{}return e.\u0275fac=function(){let t;return function(n){return(t||(t=c.n5z(e)))(n||e)}}(),e.\u0275dir=c.lG2({type:e,features:[c.qOj]}),e})(),_e=(()=>{class e extends xe{}return e.\u0275fac=function(){let t;return function(n){return(t||(t=c.n5z(e)))(n||e)}}(),e.\u0275dir=c.lG2({type:e,selectors:[["mat-horizontal-stepper"]],features:[c.qOj]}),e})(),ve=(()=>{class e extends xe{}return e.\u0275fac=function(){let t;return function(n){return(t||(t=c.n5z(e)))(n||e)}}(),e.\u0275dir=c.lG2({type:e,selectors:[["mat-vertical-stepper"]],features:[c.qOj]}),e})(),Se=(()=>{class e extends z{constructor(e,t,n,i){super(e,t,n,i),this.steps=new c.n_E,this.animationDone=new c.vpe,this.labelPosition="end",this._iconOverrides={},this._animationDone=new w.xQ;const o=n.nativeElement.nodeName.toLowerCase();this.orientation="mat-vertical-stepper"===o?"vertical":"horizontal"}ngAfterContentInit(){super.ngAfterContentInit(),this._icons.forEach(({name:e,templateRef:t})=>this._iconOverrides[e]=t),this.steps.changes.pipe((0,I.R)(this._destroyed)).subscribe(()=>{this._stateChanged()}),this._animationDone.pipe((0,R.x)((e,t)=>e.fromState===t.fromState&&e.toState===t.toState),(0,I.R)(this._destroyed)).subscribe(e=>{"current"===e.toState&&this.animationDone.emit()})}}return e.\u0275fac=function(t){return new(t||e)(c.Y36(_.Is,8),c.Y36(c.sBO),c.Y36(c.SBq),c.Y36(i.K0))},e.\u0275cmp=c.Xpm({type:e,selectors:[["mat-stepper"],["mat-vertical-stepper"],["mat-horizontal-stepper"],["","matStepper",""]],contentQueries:function(e,t,n){if(1&e&&(c.Suo(n,be,5),c.Suo(n,fe,5)),2&e){let e;c.iGM(e=c.CRH())&&(t._steps=e),c.iGM(e=c.CRH())&&(t._icons=e)}},viewQuery:function(e,t){if(1&e&&c.Gf(he,5),2&e){let e;c.iGM(e=c.CRH())&&(t._stepHeader=e)}},hostAttrs:["role","tablist"],hostVars:9,hostBindings:function(e,t){2&e&&(c.uIk("aria-orientation",t.orientation),c.ekj("mat-stepper-horizontal","horizontal"===t.orientation)("mat-stepper-vertical","vertical"===t.orientation)("mat-stepper-label-position-end","horizontal"===t.orientation&&"end"==t.labelPosition)("mat-stepper-label-position-bottom","horizontal"===t.orientation&&"bottom"==t.labelPosition))},inputs:{selectedIndex:"selectedIndex",labelPosition:"labelPosition",disableRipple:"disableRipple",color:"color"},outputs:{animationDone:"animationDone"},exportAs:["matStepper","matVerticalStepper","matHorizontalStepper"],features:[c._Bn([{provide:z,useExisting:e},{provide:_e,useExisting:e},{provide:ve,useExisting:e}]),c.qOj],decls:5,vars:3,consts:[[3,"ngSwitch"],[4,"ngSwitchCase"],["stepTemplate",""],[1,"mat-horizontal-stepper-header-container"],[4,"ngFor","ngForOf"],[1,"mat-horizontal-content-container"],["class","mat-horizontal-stepper-content","role","tabpanel",3,"id",4,"ngFor","ngForOf"],[3,"ngTemplateOutlet","ngTemplateOutletContext"],["class","mat-stepper-horizontal-line",4,"ngIf"],[1,"mat-stepper-horizontal-line"],["role","tabpanel",1,"mat-horizontal-stepper-content",3,"id"],[3,"ngTemplateOutlet"],["class","mat-step",4,"ngFor","ngForOf"],[1,"mat-step"],[1,"mat-vertical-content-container"],["role","tabpanel",1,"mat-vertical-stepper-content",3,"id"],[1,"mat-vertical-content"],[3,"tabIndex","id","index","state","label","selected","active","optional","errorMessage","iconOverrides","disableRipple","color","click","keydown"]],template:function(e,t){1&e&&(c.ynx(0,0),c.YNc(1,oe,5,2,"ng-container",1),c.YNc(2,ae,2,1,"ng-container",1),c.BQk(),c.YNc(3,se,1,22,"ng-template",null,2,c.W1O)),2&e&&(c.Q6J("ngSwitch",t.orientation),c.xp6(1),c.Q6J("ngSwitchCase","horizontal"),c.xp6(1),c.Q6J("ngSwitchCase","vertical"))},directives:[i.RF,i.n9,i.sg,i.tP,i.O5,he],styles:['.mat-stepper-vertical,.mat-stepper-horizontal{display:block}.mat-horizontal-stepper-header-container{white-space:nowrap;display:flex;align-items:center}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header-container{align-items:flex-start}.mat-stepper-horizontal-line{border-top-width:1px;border-top-style:solid;flex:auto;height:0;margin:0 -16px;min-width:32px}.mat-stepper-label-position-bottom .mat-stepper-horizontal-line{margin:0;min-width:0;position:relative}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::before,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::before,.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::after,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::after{border-top-width:1px;border-top-style:solid;content:"";display:inline-block;height:0;position:absolute;width:calc(50% - 20px)}.mat-horizontal-stepper-header{display:flex;height:72px;overflow:hidden;align-items:center;padding:0 24px}.mat-horizontal-stepper-header .mat-step-icon{margin-right:8px;flex:none}[dir=rtl] .mat-horizontal-stepper-header .mat-step-icon{margin-right:0;margin-left:8px}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header{box-sizing:border-box;flex-direction:column;height:auto}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::after,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::after{right:0}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::before,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::before{left:0}[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:last-child::before,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:first-child::after{display:none}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header .mat-step-icon{margin-right:0;margin-left:0}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header .mat-step-label{padding:16px 0 0 0;text-align:center;width:100%}.mat-vertical-stepper-header{display:flex;align-items:center;height:24px}.mat-vertical-stepper-header .mat-step-icon{margin-right:12px}[dir=rtl] .mat-vertical-stepper-header .mat-step-icon{margin-right:0;margin-left:12px}.mat-horizontal-stepper-content{outline:0}.mat-horizontal-stepper-content[aria-expanded=false]{height:0;overflow:hidden}.mat-horizontal-content-container{overflow:hidden;padding:0 24px 24px 24px}.mat-vertical-content-container{margin-left:36px;border:0;position:relative}[dir=rtl] .mat-vertical-content-container{margin-left:0;margin-right:36px}.mat-stepper-vertical-line::before{content:"";position:absolute;left:0;border-left-width:1px;border-left-style:solid}[dir=rtl] .mat-stepper-vertical-line::before{left:auto;right:0}.mat-vertical-stepper-content{overflow:hidden;outline:0}.mat-vertical-content{padding:0 24px 24px 24px}.mat-step:last-child .mat-vertical-content-container{border:none}\n'],encapsulation:2,data:{animation:[me.horizontalStepTransition,me.verticalStepTransition]},changeDetection:0}),e})(),we=(()=>{class e extends F{}return e.\u0275fac=function(){let t;return function(n){return(t||(t=c.n5z(e)))(n||e)}}(),e.\u0275dir=c.lG2({type:e,selectors:[["button","matStepperNext",""]],hostAttrs:[1,"mat-stepper-next"],hostVars:1,hostBindings:function(e,t){2&e&&c.Ikx("type",t.type)},inputs:{type:"type"},features:[c.qOj]}),e})(),ye=(()=>{class e extends D{}return e.\u0275fac=function(){let t;return function(n){return(t||(t=c.n5z(e)))(n||e)}}(),e.\u0275dir=c.lG2({type:e,selectors:[["button","matStepperPrevious",""]],hostAttrs:[1,"mat-stepper-previous"],hostVars:1,hostBindings:function(e,t){2&e&&c.Ikx("type",t.type)},inputs:{type:"type"},features:[c.qOj]}),e})(),Ze=(()=>{class e{}return e.\u0275fac=function(t){return new(t||e)},e.\u0275mod=c.oAB({type:e}),e.\u0275inj=c.cJS({providers:[pe,M.rD],imports:[[M.BQ,i.ez,b.eL,m.ot,Q,g.Ps,M.si],M.BQ]}),e})();var Ie=n(13070),Te=n(9550);function Ae(e,t){1&e&&c.SDv(0,28)}function Oe(e,t){1&e&&c.SDv(0,29)}let Ce=(()=>{class e{constructor(e,t,n){this.dialogRef=e,this.service=t,this.formBuilder=n,this.name=new a.NI("")}ngOnInit(){this.boardSetForm=this.formBuilder.group({name:["",a.kI.required]}),this.board=new s.$({name:"Board 1",rows:3,columns:4,captions_position:"below"})}create(){const e=new r.V({name:this.boardSetForm.value.name,boards:[this.board]});this.service.add(e).subscribe(e=>this.dialogRef.close(e))}stepperStepChanged(e){1===e.selectedIndex&&this.boardEditorForm.focusTitleField()}}return e.\u0275fac=function(t){return new(t||e)(c.Y36(p.so),c.Y36(d.o),c.Y36(a.qu))},e.\u0275cmp=c.Xpm({type:e,selectors:[["app-new-board-set-dialog"]],viewQuery:function(e,t){if(1&e&&c.Gf(l.q,5),2&e){let e;c.iGM(e=c.CRH())&&(t.boardEditorForm=e.first)}},decls:38,vars:5,consts:function(){let e,t,n,i,o,r,a,s,l,c,p,d;return e="Cr\xE9er un ensemble de planches",t="fermer",n="Titre de l\u2019ensemble de planches",i="Choisissez un nom pour le nouvel ensemble de planches.",o="Ensemble de planches",r="Un ensemble de cartes est une collection de tableaux de communication - autant ou aussi peu que vous le souhaitez.",a="Sur la page suivante, nous allons configurer le premier tableau.",s="prochain",l="Pr\xE9c\xE9dent",c="cr\xE9er",p="Ensemble de planches",d="Choisir un mod\xE8le",[["cdkDrag","","cdkDragRootElement",".cdk-overlay-pane","cdkDragBoundary","body"],["fxLayout","row","fxLayoutAlign","space-between center",1,"mb-3"],["mat-dialog-title","",1,"mb-0"],e,["mat-icon-button","","aria-label",t,"appStopPropagation","",3,"mat-dialog-close"],["mat-dialog-content",""],["linear","",3,"selectionChange"],[3,"stepControl"],["matStepLabel",""],[3,"formGroup"],["appStopPropagation","",1,"w-100","mb-3"],n,["matInput","","formControlName","name","required","","cdkFocusInitial",""],i,["align","end"],["fxLayout","row","fxLayout.xs","column","fxLayoutAlign","space-between start","fxLayoutGap","20px"],["src","assets/images/board-set.svg","alt",o],r,a,["fxLayout","row","fxLayoutAlign","end none",1,"mt-2"],["mat-raised-button","","matStepperNext","","color","primary","appStopPropagation","","type","submit"],s,[3,"board"],["fxLayout","row","fxLayoutAlign","space-between center",1,"mt-2"],["mat-raised-button","","matStepperPrevious","","appStopPropagation",""],l,["mat-raised-button","","color","primary","appStopPropagation","",3,"click"],c,p,d]},template:function(e,t){1&e&&(c.TgZ(0,"div",0),c.TgZ(1,"header",1),c.TgZ(2,"h1",2),c.SDv(3,3),c.qZA(),c.TgZ(4,"button",4),c.TgZ(5,"mat-icon"),c._uU(6,"close"),c.qZA(),c.qZA(),c.qZA(),c.TgZ(7,"div",5),c.TgZ(8,"mat-horizontal-stepper",6),c.NdJ("selectionChange",function(e){return t.stepperStepChanged(e)}),c.TgZ(9,"mat-step",7),c.YNc(10,Ae,1,0,"ng-template",8),c.TgZ(11,"form",9),c.TgZ(12,"mat-form-field",10),c.TgZ(13,"mat-label"),c.SDv(14,11),c.qZA(),c._UZ(15,"input",12),c.TgZ(16,"mat-hint"),c.SDv(17,13),c.qZA(),c.TgZ(18,"mat-hint",14),c._uU(19),c.qZA(),c.qZA(),c.TgZ(20,"div",15),c._UZ(21,"img",16),c.TgZ(22,"div"),c.TgZ(23,"p"),c.SDv(24,17),c.qZA(),c.TgZ(25,"p"),c.SDv(26,18),c.qZA(),c.qZA(),c.qZA(),c.TgZ(27,"div",19),c.TgZ(28,"button",20),c.SDv(29,21),c.qZA(),c.qZA(),c.qZA(),c.qZA(),c.TgZ(30,"mat-step"),c.YNc(31,Oe,1,0,"ng-template",8),c._UZ(32,"app-board-editor-form",22),c.TgZ(33,"div",23),c.TgZ(34,"button",24),c.SDv(35,25),c.qZA(),c.TgZ(36,"button",26),c.NdJ("click",function(){return t.create()}),c.SDv(37,27),c.qZA(),c.qZA(),c.qZA(),c.qZA(),c.qZA(),c.qZA()),2&e&&(c.xp6(4),c.Q6J("mat-dialog-close",!1),c.xp6(5),c.Q6J("stepControl",t.boardSetForm),c.xp6(2),c.Q6J("formGroup",t.boardSetForm),c.xp6(8),c.hij("",t.boardSetForm.value.name.length||0,"\xa0/\xa0250"),c.xp6(13),c.Q6J("board",t.board))},directives:[u.Zt,h.xw,h.Wh,p.uh,m.lW,f._,p.ZT,g.Hw,p.xY,Se,be,le,a._Y,a.JL,a.sg,Ie.KE,Ie.hX,Te.Nt,a.Fj,a.JJ,a.u,a.Q7,Ie.bx,h.SQ,we,l.q,ye],styles:["img[_ngcontent-%COMP%]{max-height:8rem}  .mat-horizontal-stepper-header-container{display:none!important}"]}),e})();var ke=n(47068),Be=n(98508),qe=n(97070),ze=n(40936),Fe=n(22797),De=n(24311),Qe=n(12905);const Me=function(e){return{boardSet:e}};function Ye(e,t){if(1&e&&(c.TgZ(0,"button",11),c.TgZ(1,"mat-icon"),c._uU(2,"more_vert"),c.qZA(),c.qZA()),2&e){const e=c.oxw();c.Q6J("matMenuTriggerFor",e.menu)("matMenuTriggerData",c.VKq(2,Me,e.boardSet))}}function Je(e,t){if(1&e&&(c.TgZ(0,"div",12),c._UZ(1,"img",13),c.qZA()),2&e){const e=t.$implicit;c.xp6(1),c.Q6J("src",e.image_url,c.LSH)("matTooltip",e.caption)}}function Le(e,t){if(1&e&&(c.TgZ(0,"div",14),c.ynx(1),c.SDv(2,15),c.BQk(),c._uU(3),c.qZA()),2&e){const e=c.oxw();c.xp6(3),c.AsE(" ",e.boardSet.owner.prename," ",e.boardSet.owner.surname," ")}}function Re(e,t){if(1&e&&(c.ynx(0),c.ynx(1),c.SDv(2,17),c.BQk(),c._uU(3),c.ALo(4,"amTimeAgo"),c.BQk()),2&e){const e=c.oxw(2);c.xp6(3),c.hij(" ",c.lcZ(4,1,e.boardSet.opened_at.toString()),"")}}function Ee(e,t){1&e&&(c.ynx(0),c.SDv(1,18),c.BQk())}function Ne(e,t){if(1&e&&(c.TgZ(0,"div",14),c.YNc(1,Re,5,3,"ng-container",16),c.YNc(2,Ee,2,0,"ng-container",16),c.qZA()),2&e){const e=c.oxw();c.xp6(1),c.Q6J("ngIf",e.boardSet.opened_at),c.xp6(1),c.Q6J("ngIf",!e.boardSet.opened_at)}}const Ge=function(e){return["/","boardsets",e]};let Pe=(()=>{class e{constructor(){}ngOnInit(){}}return e.\u0275fac=function(t){return new(t||e)},e.\u0275cmp=c.Xpm({type:e,selectors:[["app-board-set-tile"]],inputs:{boardSet:"boardSet",menu:"menu"},decls:13,vars:8,consts:function(){let e,t,n;return e="par",t="ouvert",n="Jamais ouvert",[["fxFlexFill","","fxLayout","column"],["fxFlex","grow"],["fxLayout","row","fxLayoutAlign","space-between start",1,"w-100"],["fxFlex","",1,"mt-1"],["fxFlex","",3,"routerLink"],["mat-icon-button","",3,"matMenuTriggerFor","matMenuTriggerData",4,"ngIf"],[1,"mb-0","text-muted"],["fxLayout","column","fxLayoutAlign","space-between none",1,"mt-2"],["fxLayout","row","fxLayoutGap","1rem grid"],["fxFlex","20","fxLayoutAlign","center center",4,"ngFor","ngForOf"],["class","mt-2",4,"ngIf"],["mat-icon-button","",3,"matMenuTriggerFor","matMenuTriggerData"],["fxFlex","20","fxLayoutAlign","center center"],[1,"preview-image",3,"src","matTooltip"],[1,"mt-2"],e,[4,"ngIf"],t,n]},template:function(e,t){1&e&&(c.TgZ(0,"mat-card",0),c.TgZ(1,"mat-card-header",1),c.TgZ(2,"div",2),c.TgZ(3,"mat-card-title",3),c.TgZ(4,"a",4),c._uU(5),c.qZA(),c.qZA(),c.YNc(6,Ye,3,4,"button",5),c.qZA(),c.qZA(),c.TgZ(7,"mat-card-content",6),c.TgZ(8,"div",7),c.TgZ(9,"div",8),c.YNc(10,Je,2,2,"div",9),c.qZA(),c.YNc(11,Le,4,2,"div",10),c.YNc(12,Ne,3,2,"div",10),c.qZA(),c.qZA(),c.qZA()),2&e&&(c.xp6(4),c.Q6J("routerLink",c.VKq(6,Ge,t.boardSet.id)),c.xp6(1),c.Oqu(t.boardSet.name),c.xp6(1),c.Q6J("ngIf",t.menu),c.xp6(4),c.Q6J("ngForOf",t.boardSet.preview_cells),c.xp6(1),c.Q6J("ngIf",t.boardSet.owner),c.xp6(1),c.Q6J("ngIf",!t.boardSet.readonly))},directives:[Fe.a8,h.s9,h.xw,Fe.dk,h.yH,h.Wh,Fe.n5,o.yS,i.O5,Fe.dn,h.SQ,i.sg,m.lW,qe.p6,g.Hw,De.gM],pipes:[Qe.eG],styles:[".mat-card-header-text{margin-left:0!important;margin-right:0!important}mat-card-title[_ngcontent-%COMP%]{overflow-wrap:break-word;word-wrap:break-word;-ms-word-break:break-all;word-break:break-all;word-break:break-word;-webkit-hyphens:auto;hyphens:auto}mat-card-title[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{color:#000!important;text-decoration:none}mat-card-title[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover{text-decoration:underline}mat-card.add-boardset[_ngcontent-%COMP%]   mat-card-actions[_ngcontent-%COMP%]{padding-top:0;margin-top:-8px}img.preview-image[_ngcontent-%COMP%]{max-height:54px;max-width:100%;opacity:.7}mat-card[_ngcontent-%COMP%]:hover   img.preview-image[_ngcontent-%COMP%]{opacity:1}"]}),e})();function $e(e,t){1&e&&c._UZ(0,"app-loading-notice",6)}function He(e,t){if(1&e&&c._UZ(0,"app-board-set-tile",19),2&e){const e=t.$implicit;c.oxw(2);const n=c.MAs(6);c.Q6J("boardSet",e)("menu",n)}}function Ue(e,t){1&e&&c._UZ(0,"app-board-set-tile",20),2&e&&c.Q6J("boardSet",t.$implicit)}function je(e,t){if(1&e){const e=c.EpF();c.ynx(0),c.TgZ(1,"div",7),c.TgZ(2,"div",8),c.TgZ(3,"mat-card",9),c.TgZ(4,"mat-card-actions",10),c.TgZ(5,"button",11),c.NdJ("click",function(){return c.CHM(e),c.oxw().newBoardSet()}),c.TgZ(6,"mat-icon",12),c._uU(7,"add"),c.qZA(),c._UZ(8,"br"),c.ynx(9),c.SDv(10,13),c.BQk(),c.qZA(),c.TgZ(11,"button",14),c.NdJ("click",function(){return c.CHM(e),c.oxw().uploadObz()}),c.SDv(12,15),c.qZA(),c.qZA(),c.qZA(),c.qZA(),c.YNc(13,He,1,2,"app-board-set-tile",16),c.qZA(),c.TgZ(14,"h2"),c.SDv(15,17),c.qZA(),c.TgZ(16,"div",7),c.YNc(17,Ue,1,1,"app-board-set-tile",18),c.qZA(),c.BQk()}if(2&e){const e=c.oxw();c.xp6(13),c.Q6J("ngForOf",e.boardSets),c.xp6(4),c.Q6J("ngForOf",e.featuredBoardSets)}}function Ve(e,t){if(1&e){const e=c.EpF();c.TgZ(0,"button",21),c.NdJ("click",function(){c.CHM(e);const t=c.oxw().boardSet;return c.oxw().deleteBoardSet(t)}),c.TgZ(1,"mat-icon"),c._uU(2,"delete"),c.qZA(),c.TgZ(3,"span"),c.SDv(4,24),c.qZA(),c.qZA()}}function Ke(e,t){if(1&e){const e=c.EpF();c.TgZ(0,"button",21),c.NdJ("click",function(){const t=c.CHM(e).boardSet;return c.oxw().openBoardSet(t)}),c.TgZ(1,"mat-icon"),c._uU(2,"launch"),c.qZA(),c.TgZ(3,"span"),c.SDv(4,22),c.qZA(),c.qZA(),c.YNc(5,Ve,5,0,"button",23)}if(2&e){const e=t.boardSet;c.xp6(5),c.Q6J("ngIf",!e.readOnly)}}let We=(()=>{class e{constructor(e,t,n,i,o){this.service=e,this.router=t,this.dialog=n,this.dialogService=i,this.toolbarService=o}ngOnInit(){this.loadBoardSets(),this.loadFeaturedBoardSets()}ngOnDestroy(){this.toolbarService.clearButtons()}loadBoardSets(){this.loading=!0,this.service.list("preview_cells").subscribe(e=>this.boardSets=e,e=>null,()=>this.loading=!1)}loadFeaturedBoardSets(){this.service.featured("preview_cells").subscribe(e=>this.featuredBoardSets=e)}newBoardSet(){void 0===this.currentDialogRef&&(this.currentDialogRef=this.dialog.open(Ce,{width:"600px"}),this.currentDialogRef.afterClosed().subscribe(e=>{e instanceof r.V&&this.router.navigate(["/","boardsets",e.id]),this.currentDialogRef=void 0}))}uploadObz(){this.dialogService.uploadObz().afterClosed().subscribe(e=>{e instanceof r.V&&this.service.add(e).subscribe(e=>this.openBoardSet(e))})}openBoardSet(e){this.router.navigate(["/","boardsets",e.id])}deleteBoardSet(e){this.dialogService.deleteBoardSet(e,{heading:`Delete '${e.name}'?`,content:"The Board Set and all its Boards will be deleted. This cannot be undone."}).afterClosed().subscribe(t=>{t&&this.service.delete(e).subscribe(e=>this.loadBoardSets())})}}return e.\u0275fac=function(t){return new(t||e)(c.Y36(d.o),c.Y36(o.F0),c.Y36(p.uw),c.Y36(ke.x),c.Y36(Be.O))},e.\u0275cmp=c.Xpm({type:e,selectors:[["app-board-sets"]],decls:8,vars:2,consts:function(){let e,t,n,i,o,r,a;return e="Mon ensembles de cartes de communication",t="Ensembles de cartes de communication",n="Cr\xE9er un ensemble de planches",i="Importer OBZ",o="Ensembles de cartes de communication en vedette",r="ouvrir",a="supprimer",[[1,"container","mt-3"],e,["subject",t,4,"ngIf"],[4,"ngIf"],["menu","matMenu"],["matMenuContent",""],["subject",t],["fxLayout","row wrap","fxLayoutGap","1rem grid"],["fxFlex.xs","50","fxFlex.sm","33","fxFlex","25",1,"card-container"],["fxFlexFill","",1,"add-boardset"],["fxFlex","","fxLayout","column",1,"p-0"],["fxFlex","","mat-flat-button","","color","primary",3,"click"],[1,"mat-icon-2x"],n,["mat-flat-button","","color","primary",1,"mt-1",3,"click"],i,["fxFlex.xs","50","fxFlex.sm","33","fxFlex","25",3,"boardSet","menu",4,"ngFor","ngForOf"],o,["fxFlex.xs","50","fxFlex.sm","33","fxFlex","25",3,"boardSet",4,"ngFor","ngForOf"],["fxFlex.xs","50","fxFlex.sm","33","fxFlex","25",3,"boardSet","menu"],["fxFlex.xs","50","fxFlex.sm","33","fxFlex","25",3,"boardSet"],["mat-menu-item","",3,"click"],r,["mat-menu-item","",3,"click",4,"ngIf"],a]},template:function(e,t){1&e&&(c.TgZ(0,"div",0),c.TgZ(1,"h2"),c.SDv(2,1),c.qZA(),c.YNc(3,$e,1,0,"app-loading-notice",2),c.YNc(4,je,18,2,"ng-container",3),c.qZA(),c.TgZ(5,"mat-menu",null,4),c.YNc(7,Ke,6,1,"ng-template",5),c.qZA()),2&e&&(c.xp6(3),c.Q6J("ngIf",t.loading),c.xp6(1),c.Q6J("ngIf",!t.loading))},directives:[i.O5,qe.VK,qe.KA,ze.W,h.xw,h.SQ,h.yH,Fe.a8,h.s9,Fe.hq,m.lW,g.Hw,i.sg,Pe,qe.OP],styles:[".card-container[_ngcontent-%COMP%]{min-height:165px}"]}),e})();var Xe=n(52309),et=n(23695),tt=n(75425);const nt=[{path:"",component:We,pathMatch:"full"}];let it=(()=>{class e{}return e.\u0275fac=function(t){return new(t||e)},e.\u0275mod=c.oAB({type:e}),e.\u0275inj=c.cJS({imports:[[i.ez,o.Bz.forChild(nt),h.ae,g.Ps,De.AV,m.ot,Fe.QW,Xe.N6,Qe._G,u._t,p.Is,Te.c,a.u5,a.UX,et.KP,tt.m,Ze,qe.Tx]]}),e})()}}]);