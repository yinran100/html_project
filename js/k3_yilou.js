var mainresult=[];
var thisyilou = {
	cur_yilou: parent.thissant.cur_yilou.split(",").map(Math.abs),
	max_yilou: parent.thissant.max_yilou.split(",").map(Math.abs),
	times_val: parent.thissant.times_val.split(",").map(Math.abs)
};
var rbtarr=[]; //二不同数组
var totalEnd =[]; //统计
function initThisModel(){
	if(rbtarr.length==0){
		for(var i=1;i<=6;i++)
			for(var j=1;j<=6;j++)
				if(i<j)	rbtarr.push(i*10+j+"");
	}
	trendModel.note = ko.dependentObservable(function () {	//
		getdata();
		return dataUtils.getarr(this.mainnote(), this.page());
	}, trendModel);
	trendModel.diagram = ko.dependentObservable(function () {	//当页
		var arr = [];
		return arr;
	}, trendModel);
	trendModel.maindiagram = ko.dependentObservable(function (){	//今天的期，算最大遗漏使用
		var maindiagram =[];
		maindiagram.push(thisyilou.cur_yilou);
		return maindiagram;
	}, trendModel);
}

var item =[".sth,.rth,.sbt",".sum",".rbt",".rthfx",".dm",".jodx",".sl"];

function getdata(){
	mainresult=[];
	for(var i=0;i<2;i++){
		mainresult.push(count(i));
	}
	showEndData();
}
var len = [0,56,72,87,93,99,107,109];
function count(day){
	note = day==0? gameArray.todaynote[datanum]:parent.yestonote_k3;
	var x =  day==0?Math.max(0,trendModel.mainnote().length - gameArray.todaynote[datanum].length):Math.max(0,trendModel.mainnote().length-gameArray.todaynote[datanum].length-parent.yestonote_k3.length);
	var sum =[];//和值
	var diffrent2 =[];//二不同号
	var fx =[];	//二同号复选
	var dm =[];//单码
	var jodx=[];//奇偶大小
	var ll=[];//三连号，三同号
	if(day==0){
		sum.push(thisyilou.cur_yilou.slice(56,72));
		diffrent2.push(thisyilou.cur_yilou.slice(72,87));
		fx.push(thisyilou.cur_yilou.slice(87,93));
		dm.push(thisyilou.cur_yilou.slice(93,99));
		jodx.push(thisyilou.cur_yilou.slice(99,107));
		ll.push(thisyilou.cur_yilou.slice(107,109));
	}
	for(var i=0;i<note.length;i++){
		sum.push(dataUtils.getTrend(sum,maindata[i+x].sum,16,0));
		diffrent2.push(getDiffrent2(diffrent2, note[i].numbers));
		fx.push(getFx(fx, note[i].numbers));
		dm.push(getDm(dm, note[i].numbers));
		jodx.push(getJodx(jodx,i+x));
		ll.push(getLl(ll,maindata[i+x].form));
	}
	var alldiagram =  parent.getalldiagram(note,thisyilou.cur_yilou.slice(0,56));
	//return {"diagram":diagram,"sum":sum,"diffrent2":diffrent2,"fx":fx,"dm":dm,"jodx":jodx,"ll":ll};
	return [alldiagram,sum,diffrent2,fx,dm,jodx,ll];
}

function getDiffrent2(arr,num,st){
	var start = st?st:0;
	var c = new Array(15);
	num = [num[0],num[1],num[2]].sort();
	var str = num[0]*100+num[1]*10+num[2]+"";
	for(var i=0;i<c.length;i++){
		if(str.indexOf(rbtarr[i].charAt(0))>=0&&str.indexOf(rbtarr[i].charAt(1))>=0)
			c[i]=0;
		else {
			if (arr.length > 0) {
				c[i] = arr[arr.length - 1][i+start] + 1;
			} else {
				c[i] = 1;
			}
		}
	}
	return c;
}
function getFx(arr,num,st){
	var start = st?st:0;
	var d = new Array(6);
	num = [num[0],num[1],num[2]].sort();
	var n = num[0]*100+num[1]*10+num[2]+"";
	for(var i=0;i<d.length;i++){
		if(n.split(i+1+"").length>2)
			d[i]=0;
		else {
			if (arr.length > 0) {
				d[i] = arr[arr.length - 1][i+start] + 1;
			} else {
				d[i] = 1;
			}
		}
	}
	return d;
}

function getDm(arr,num,st){
	var start = st?st:0;
	var e = new Array(6);
	for(var i=0;i<e.length;i++){
		if(num.indexOf(i+1)>=0)
			e[i]=0;
		else {
			if (arr.length > 0) {
				e[i] = arr[arr.length - 1][i+start] + 1;
			} else {
				e[i] = 1;
			}
		}
	}
	return e;
}
function getJodx(arr,n,st){
	var start = st?st:0;
	var f = new Array(8);
	var js = maindata[n].js;
	var ds = maindata[n].ds;
	for(var i=0;i<f.length;i++){
		if((i<4&&i==3-js)||(i>=4&&i-4==3-ds))
			f[i]=0;
		else {
			if (arr.length > 0) {
				f[i] = arr[arr.length - 1][i+start] + 1;
			} else {
				f[i] = 1;
			}
		}
	}
	return f;
}
function getLl(arr,form,st){
	var start = st?st:0;
	var g = new Array(2);
	for(var i=0;i<g.length;i++){
		if((i==0&&form==3)||(i==1&&form==0))
			g[i]=0;
		else {
			if (arr.length > 0) {
				g[i] = arr[arr.length - 1][i+start] + 1;
			} else {
				g[i] = 1;
			}
		}
	}
	return g;
}
function showEndData(){
	totalEnd=[];//7个项目
	for(var j=0;j<mainresult[0].length;j++){
		everyarr=[];//每个项目的6组数据
		for(var i=0;i<mainresult.length;i++){
			var wintimes = []; //出现总次数一行
			if(i==0){
				var misstimes = mainresult[i][j][mainresult[i][j].length - 1]; //当前遗漏
				var maxtimes = [];//最大遗漏次数一行
				for(var k=0;k<mainresult[i][j][0].length;k++){//console.log(mainresult[i][j][k].join());
						wintimes.push(dataUtils.checkWin2(mainresult[i][j],k,gameArray.todaynote[datanum].length));
						maxtimes.push(dataUtils.checkMiss(mainresult[i][j],k,thisyilou.max_yilou.slice(len[j],len[j+1])));
				}
			}else{
				var misstimes = thisyilou.cur_yilou.slice(len[j],len[j+1]); //当前遗漏
				var maxtimes = thisyilou.max_yilou.slice(len[j],len[j+1]);
				var wintimes = thisyilou.times_val.slice(len[j],len[j+1]);
//				for(var k=0;k<mainresult[i][j][0].length;k++){	//出现期数
//						wintimes.push(dataUtils.checkWin2(mainresult[i][j],k,parent.yestodaynote.length));
//				}
			}
			everyarr.push(wintimes);
			everyarr.push(misstimes);
			everyarr.push(maxtimes);
		}
		totalEnd.push(everyarr);
	}
	/*
	var r =6;
	console.log(parent.yilouarr[parent.currentSelect].cur_yilou.split(",").slice(len[r],len[r+1]).join());
	var arr =[];console.log(mainresult[0][r][0].length);
	for(var k=0;k<mainresult[0][r].length;k++){
		console.log(mainresult[0][r][k].join());
	}	
	for(var m=0;m<mainresult[0][r][0].length;m++)
		arr.push(dataUtils.checkWin2(mainresult[0][r],m,parent.todaynote.length));
		console.log(arr.join());
	*/
}
function changeEnd(arr,str){
	return showEnd(arr,str,0,0);
}
function gethtml(){
	var t=0;
	$(".table .slh .termNB").eq(1).text(gameArray.newterm[datanum].termcode);
	for(var i=0;i<totalEnd.length;i++){//console.log(totalEnd.length+"totalEnd.length");//i=item.length==7
		t += i<=1?0:totalEnd[i-1][0].length;
		for(var j=0;j<totalEnd[i].length;j++){//console.log(totalEnd[i][j].join());//j=6个统计信息	
			for(var k=0;k<totalEnd[i][j].length;k++){//console.log(totalEnd[3][j].length+"totalEnd[3][j].length");
				$("table tr").eq(k+t+3).find(item[i]).eq(j-6).text(totalEnd[i][j][k]);
			}	
		}
	}
}
function getpoint(){	//收集连线
	htmlUtils.prompt(gameArray.playstate[datanum],ALLview.viewtext[select]);
	gethtml();
}