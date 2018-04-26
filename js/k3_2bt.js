var linecolor = new Array();
var point = new Array(0);
var WIN_NUMBER = K_public.K3_WIN_NUMBER;
var ARR = [12,13,14,15,16,23,24,25,26,34,35,36,45,46,56];
function initThisModel(){
	trendModel.note = ko.dependentObservable(function () {	//
		return dataUtils.getarr(this.mainnote(), this.page(), max_page, max_rowcount);
	}, trendModel);
	trendModel.diagram = ko.dependentObservable(function () {	//当页
		var arr = [];//console.log(gameArray.maindata[datanum][48-1+this.page()*K_public.MAX_ROWCOUNT]);
		for(var i in this.note()){
			var num =  this.note()[i].numbers;
			arr.push(getCurrentSame(arr,num,parseInt(i)+this.page()*max_rowcount,0).concat(getCurrenrDif(arr,num,parseInt(i)+this.page()*max_rowcount,6),getSth(arr,num,parseInt(i)+this.page()*max_rowcount,21)));
		}
		return arr;
	}, trendModel);
	trendModel.maindiagram = ko.dependentObservable(function (){	//今天的期，算最大遗漏使用
		var maindiagram =[];
		maindiagram.push(yilouData.cur_yilou);
		var x = Math.max(0,this.mainnote().length - gameArray.todaynote[datanum].length);
		for (var i in gameArray.todaynote[datanum]){
			var num = gameArray.todaynote[datanum][i].numbers;
			maindiagram.push(getCurrentSame(maindiagram,num,parseInt(i)+x,0).concat(getCurrenrDif(maindiagram,num,parseInt(i)+x,6),getSth(maindiagram,num,parseInt(i)+x,21)));
		}
		return maindiagram;
	}, trendModel);
	trendModel.diagramHtml = ko.dependentObservable(function (){	//页面的分布二维数组html	
		var diagramHtml = [],data=[],diastr ='';
		dayline =[];
		for (var i = 0; i < max_rowcount; i++) {
			if(i<this.note().length){
				data = deepCopy(maindata[i+this.page()*max_rowcount]);
				diastr = '<td class=\"termN\">'+(ALLview.isScross[select]!=1?this.note()[i].term.slice(-3):this.note()[i].term)+'</td>';
				var narr = this.note()[i].numbers;
				if(data.day==1&&ALLview.isScross[select]!=1){
					dayline.push({
						termDate:ALLview.viewtext[select]<2?this.note()[i].term.slice(0, 2)+"-"+this.note()[i].term.slice(2, 4):this.note()[i].term.slice(0, 4),
						targetCount: i+1
					});
				}
				$.each(narr, function(index, value) {
					diastr += '<td class=\"win\" style=\"color:'+K_public.COLOR[data.form]+'">'+value+'</td>';
				});
				$.each(this.diagram()[i], function(index, value) {
					if (parseInt(value)== 0) {
						if(parseInt(index)<6){
							diastr+= '<td class=\"dia\"><div class=\"one\" style=\"color:'+K_public.COLOR[data.form]+'">'+parseInt(index+1)+""+parseInt(index+1)+'</div></td>';
						}else if(parseInt(index)<21){
							diastr+= '<td class=\"dia\"><div class=\"two\" style=\"color:'+K_public.COLOR[data.form]+'">'+ARR[index-6]+'</div></td>';
						}else{
							diastr+= '<td class=\"dia\"><div class=\"three\" style=\"color:'+K_public.COLOR[data.form]+'">'+parseInt(index-20)+""+parseInt(index-20)+""+parseInt(index-20)+'</div></td>';
						}
					} else {
						if(parent.person_setting.showyilou==0)	diastr+= '<td class=\"dia\"><div>'+value+'</div></td>';
						else diastr+= '<td class=\"dia\"><div></div></td>';
					}
				});
			}else if(i==this.note().length){		//倒计时那一行
				data.day = 0;
				diastr = '<td class=\"termN time\"></td><td class=\"state\" colspan="3" ></td>';
				for(var j=0;j<27;j++)	diastr+= '<td class=\"dia\"><div></div></td>';
			}else{
				data.day = 0;
				diastr = '<td class=\"termN\">-</td><td class=\"win\"></td><td class=\"win\"></td><td class=\"win\"></td>';
				for(var j=0;j<27;j++)	diastr+= '<td class=\"dia\"><div></div></td>';
			}
			diagramHtml.push({
				daycut:data.day,
				htmlstr:diastr
			});
		}
	    return diagramHtml;
	}, trendModel);
}
function changeEnd(arr,str){
	return showEnd(arr,str,0,0);
}
function getpoint(){	//收集连线
	drawline(14);
}
function getSth(arr,winnnum,n,st){//求三同号
	var start = st?st:0;
	var f = new Array(6);
	for(var i=0; i<f.length; i++){
		if(maindata[n].form==3&&winnnum[0]==i+1){
			f[i]=0;
		}else{
			if (arr.length > 0) {
				f[i] = arr[arr.length - 1][i+start] + 1;
			} else {
				f[i] = 1;
			}
		}
	}
	return f;
}
function getCurrentSame(arr,winnumber,n,st){//求二同号
	var start = st?st:0;
	var f = new Array(6);
	for(var i=0; i<f.length; i++){
		if(maindata[n].form>=2&&maindata[n].rbt[0]%10==i+1){
			f[i]=0;
		}else{
			if (arr.length > 0) {
				f[i] = arr[arr.length - 1][i+start] + 1;
			} else {
				f[i] = 1;
			}
		}
	}
	return f;
}
function getCurrenrDif(arr,winnumber,n,st){	//本次的二不同号
	var start = st?st:0;
	var b = new Array(ARR.length);
	var result = maindata[n].rbt;console.log(result);
	for (var i = 0; i < b.length; i++) {
		if (result.indexOf(ARR[i])>=0) {
			b[i] = 0;
		} else {
			if (arr.length > 0) {
				b[i] = arr[arr.length - 1][i+start] + 1;
			} else {
				b[i] = 1;
			}
		} 
	}
	return b;
}