var linecolor = new Array();
var point = new Array(0);
var WIN_NUMBER = K_public.K3_WIN_NUMBER;
var ARR = K_public.all56.slice(6,36);

function initThisModel(){
	trendModel.note = ko.dependentObservable(function () {	//
		return dataUtils.getarr(this.mainnote(), this.page(), max_page, max_rowcount);
	}, trendModel);
	trendModel.diagram = ko.dependentObservable(function () {	//当页
		var arr = [];//console.log(gameArray.maindata[datanum][48-1+this.page()*K_public.MAX_ROWCOUNT]);
		for(var i in this.note()){
			arr.push(getCurrenrDif(arr,this.note()[i].numbers));
		}
		return arr;
	}, trendModel);
	trendModel.maindiagram = ko.dependentObservable(function (){	//今天的期，算最大遗漏使用
		var maindiagram =[];var l = this.mainnote().length;  //不能删这个
		maindiagram.push(yilouData.cur_yilou);
		for (var i in gameArray.todaynote[datanum]){
			maindiagram.push(getCurrenrDif(maindiagram,gameArray.todaynote[datanum][i].numbers));
		}
		return maindiagram;
	}, trendModel);
	trendModel.diagramHtml = ko.dependentObservable(function () {	//页面的分布二维数组html	
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
						diastr+= '<td class=\"dia\"><div class=\"dif\" style=\"color:'+K_public.COLOR[data.form]+'">'+ARR[index]+'</div></td>';
					} else {
						if(parent.person_setting.showyilou==0)	diastr+= '<td class=\"dia\"><div>'+value+'</div></td>';
						else diastr+= '<td class=\"dia\"><div></div></td>';
					}
				});
			}else if(i==this.note().length){		//倒计时那一行
				data.day = 0;
				diastr = '<td class=\"termN time\"></td><td class=\"state\" colspan="3" ></td>';
				for(var j=0;j<30;j++)	diastr+= '<td class=\"dia\"><div></div></td>';
			}else{
				data.day = 0;
				diastr = '<td class=\"termN\">-</td><td class=\"win\">-</td><td class=\"win\">-</td><td class=\"win\">-</td>';
				for(var j=0;j<30;j++)	diastr+= '<td class=\"dia\"><div>-</div></td>';
			}
			diagramHtml.push({
				daycut:data.day,
				htmlstr:diastr
			});
		}
	    return diagramHtml;
	}, trendModel);
}

//本次的
function getCurrenrDif(arr, winnumber) {
	var b = new Array(30);
	var result = getResult(winnumber);
	for (var i = 0; i < b.length; i++) {
		if (ARR[i]==result) {
			b[i] = 0;
		} else {
			if (arr.length > 0) {
				b[i] = arr[arr.length - 1][i] + 1;
			} else {
				b[i] = 1;
			}
		} 
	}
	return b;
}
//计算号码的排列
function getResult(a){
	var o = new Array(a[0],a[1],a[2]);
	o.sort();
    var r = o[0]*100+o[1]*10+o[2];
	return r;
}
function getpoint(){	//收集连线
	drawline(14);
}
function changeEnd(arr,str){
	return showEnd(arr,str,0,0);
}
