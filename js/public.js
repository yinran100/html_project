
var clicktag = 0; //防止快速按键
var pageST,lineST;
var layer = parent.layer;
var lineflag = 0; //首次打开划线延时
var csstext = parent.person_setting.skinStyle==0?"color":"background-color";
var cvs = document.getElementById("line").getContext("2d");
var select = parent.currentSelect;
var K_public =parent.K_public;
var console = parent.console;
var dataUtils =parent.dataUtils;
var Longdata = parent.Longdata;
var ALLview = parent.ALLview;
var gameArray = parent.gameArray;
var datanum = ALLview.datanum[select];
var yilouData = {
	cur_yilou: parent.yilouarr[select].cur_yilou.split(",").map(Math.abs),
	max_yilou: parent.yilouarr[select].max_yilou.split(",").map(Math.abs)
};
var maindata;
var max_page = K_public.MAX_PAGE,max_rowcount = K_public.MAX_ROWCOUNT;
var dayline=[];
var trendModel={
	mainnote:ko.observable(parent.mainnote[datanum]),
	page:ko.observable(K_public.MAX_PAGE-1),
	weichuk3:ko.observable(parent.weichustr_k3)
};
$(function() {
	if(ALLview.isScross[select]==1){
		max_rowcount = K_public.KPROWCOUNT;
		trendModel.mainnote(parent.mainnote[datanum].slice(1-K_public.MAX_PAGE*max_rowcount));
	} 
	if(ALLview.viewtext[select]<2) maindata = gameArray.maindata[datanum].slice(1-K_public.MAX_PAGE*max_rowcount);	//短周期
	if(parent.Timer)clearTimeout(parent.Timer);
	if(trendModel.mainnote().length == max_rowcount*K_public.MAX_PAGE-1||ALLview.htmlname[select]=="K3_yilou.html"||ALLview.htmlname[select]=="K3_hotnumber.html"){
		trendModel.page((K_public.isfuping?parent.person_setting.fupingpage:parent.person_setting.showpage) - 1);
	}else {
		max_page = Math.ceil((parent.mainnote[datanum].length+1) / max_rowcount);
		trendModel.page(Math.min((K_public.isfuping?parent.person_setting.fupingpage:parent.person_setting.showpage) - 1, max_page - 1));
		layer.msg('数据不足，最大页数为'+max_page+'页！', {
			  icon: 0,
			  time: 2500 //2秒关闭（如果不配置，默认是3秒）
			});
	}
	if(ALLview.htmlname[select]=="K3_hotnumber.html"||ALLview.htmlname[select]=="K3_yilou.html")max_page=0;
	parent.FLAG = 0;
	parent.clickMedia = 0;
	initThisModel();
	initModel();
	ko.applyBindings(trendModel);
	showPage(0);
	K_public.tacolor();
	parent.putNotification();//文字通知滚动 
	$(".version").find("span").eq(0).text(parent.person_setting.showstation == 0 ? "站点号： " + parent.person_setting.jihao : "");
	$(".version").find("span").eq(1).text(parent.person_setting.showversion == 0 ? " 版本号：" + parent.person_setting.version : "");
	if(parent.firstCSview==0&&parent.person_setting.sp_playEname.length==0&&!K_public.isfuping){
		dataUtils.openMedia();
		console.log("第一次进长周期，播放媒体");
	}
	parent.firstCSview=1;
	layer.close(parent.index); 
	shortcut.add("Ctrl+L",function() {parent.$(".vc-switch").click();});
	shortcut.add("Ctrl+H",function() {parent.$(".vc-mask").click();});
});
function initModel(){
	trendModel.wintimes = ko.dependentObservable(function () {	//出现期数
		var arr=[];
		if(ALLview.viewtext[select]<2){
			for(var i = 0; i < this.maindiagram()[0].length; i++) 
				arr.push(dataUtils.checkWin2(this.maindiagram(),i,this.maindiagram().length-1));
				return changeEnd(arr,"当日出现期数");
		}else{
			for(var i = 0; i < this.maindiagram()[0].length; i++) 
				arr.push(dataUtils.checkWin2(this.maindiagram(),i));
			return changeEnd(arr,"当页出现期数");
		}	
	}, trendModel);
	trendModel.misstimes = ko.dependentObservable(function () {	//当前遗漏
		if(ALLview.viewtext[select]<2)
			 return changeEnd(this.maindiagram()[this.maindiagram().length-1].concat(), "当前遗漏");
		else {
		   return changeEnd(yilouData.cur_yilou.concat(), "当前遗漏");
		}
	}, trendModel);
	trendModel.maxtimes = ko.dependentObservable(function () {	//最大遗漏 
		if(ALLview.viewtext[select]<2){
			var arr=[];
			for(var i = 0; i < this.maindiagram()[0].length; i++) 
				arr.push(dataUtils.checkMiss(this.maindiagram(),i,yilouData.max_yilou));
			return changeEnd(arr,"最大遗漏");
		}else {
			return changeEnd(yilouData.max_yilou.concat(),"最大遗漏");
		}
	}, trendModel);
}
function showPage(n){		//显示页码，n为标志位，2代表不允许操作，1代表显示页码，0代表显示页码并换线、
	if(n==2) $("#layer").text("!").fadeIn(500);
	else $("#layer").text(trendModel.page()+1).fadeIn(500);
	if(pageST)clearTimeout(pageST);
	pageST =setTimeout(function() {
		$("#layer").fadeOut(800);
	}, 1000);
	if(n==0){
		if(ALLview.htmlname[select]!="K3_yilou.html")
			for(var i in trendModel.diagramHtml())
				$("#tabody tr").eq(i).empty().prepend(trendModel.diagramHtml()[i].htmlstr);
		getpoint();	//收集点 后划线 radius
		$(".bottom, .ta").height(ALLview.isScross[select]==1?26:30);
	}
}
function bottomAttr(index){		
	return index==0?WIN_NUMBER+1:"1";
}
function showEnd(arr,str,m,n) {		//方便左右两边加一些没有统计项的表格
	if(m)	for(var i=0;i<m;i++)
		arr.unshift("-");
	if(n)	for(var i=0;i<n;i++)
		arr.push("-");
	arr.unshift(str);
	return arr;
}
function isLast(i){			//判断是不是倒计时那一行
	return trendModel.note().length==i;
}
function trHeight(){		//每一行的高度
	var het = ALLview.isScross[select]==1?26:30;
	return parseInt(($(".table").height()-het*($(".hot").length+$(".ta").length+$(".bottom").length+2))/max_rowcount)+"px";
}
function drawline(radius){		//划线等操作
	var time = parent.firstCSview==1?400:2000;
	if(lineflag==0||trendModel.page()==K_public.MAX_PAGE-1){
		lineflag =1;
		if(lineST)clearTimeout(lineST);
		lineST = setTimeout(function(){
			htmlUtils.addline(point,linecolor,radius);
		},time);//画线，延时防止有偏差
	}else htmlUtils.addline(point,linecolor,radius);
	htmlUtils.prompt(gameArray.playstate[datanum],ALLview.viewtext[select]);
}
document.onkeyup = function(event) {
	var e = event || window.event || arguments.callee.caller.arguments[0];
	var n = e.keyCode;
	//keyboard C-F:67-72
	//arrow left37 up38 right39 down40
	if(e&&!K_public.isfuping) {		//副屏屏蔽键盘操作
		if(n == 83 || n == 40) { //向下 s  +1
			if(clicktag==0){
				clicktag=1;
				setTimeout(function () { 
					clicktag = 0;
				},300);
				if(trendModel.page() < max_page - 1 &&max_page!=0) {	//不是最大页,而且不是特殊单页
					parent.theload();
					trendModel.page(trendModel.page()+1);
					showPage(0);
					layer.close(parent.index);
				}
			}
		}
		if(n == 87 || n == 38) { //向上 w  -1
			if(clicktag==0){
				clicktag=1;
				setTimeout(function () { 
					clicktag = 0;
				},300);
				if(trendModel.page() > 0 &&max_page!=0) {	//不是最小页,而且不是特殊单页
					parent.theload();
					trendModel.page(trendModel.page()-1);
					showPage(0);
					layer.close(parent.index);
				}
			}
		}
		//		if (cur_i>=0){
		//			if(wtime<=0||wtime>=30){
		//				if(n==65 || n==37){//向左 a
		//					if(cur_i>0)
		//						$("#ifrContent",window.top.document.body).attr("src", html[cur_i-1]).show()[0].focus();
		//				}else if (n==68 || n==39){//向右 d
		//					if(cur_i<3)
		//						$("#ifrContent",window.top.document.body).attr("src", html[cur_i+1]).show()[0].focus();
		//				}
		//			}else if(clicktag == 0){
		//				clicktag = 1;
		//				setTimeout(function () { 
		//					clicktag = 0;
		//					$("#layer").text("!").fadeIn(500);
		//					$("#layer").fadeOut(500);
		//				},500);
		//			}
		//		}
		//return(R):82 home:36  list(G):71  ok:75  off:79	$(".vc-switch").click()
		if(n == 82 || n == 36) { //backspance
			if(parent.PLAYING==0||ALLview.viewtext[select]<2){
				if(parent.clickMedia == 0) { //防止重复调用该方法
					parent.clickMedia = 1;
					dataUtils.closeMedia();
				}
				if(pageST)clearTimeout(pageST);
				parent.FLAG = 1;
				parent.removescross();
				layer.close(parent.index);
				parent.$(".homePage").show();
				window.top.document.body.focus();
				parent.$("#ifrContent").attr("src", "about:blank").hide();
//				$(".homePage", window.top.document.body).show();
//				$("#ifrContent", window.top.document.body).attr("src", "about:blank").hide()[0].focus();
			}else{
				showPage(2);
			}
		}
		if(n == 13 || n == 75) { //确认  回车 home
			showPage(1);
		}
		if(parent.debugflag==0&&n==80){
			parent.dataUtils.openMedia();
		}
	}
};