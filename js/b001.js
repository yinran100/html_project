var textcolor =new Array("#BEBEBD","#DC143C","orangered"); //#F26C86
var linecolor = new Array("dodgerblue");
var point = new Array(1);
var WIN_NUMBER = 0;

function initThisModel(){
	trendModel.note = ko.dependentObservable(function () {	//
		return dataUtils.getarr(this.mainnote(), this.page(), max_page, max_rowcount);
	}, trendModel);
	trendModel.maindiagram = ko.dependentObservable(function (){	
		var  diagram =[];
		for (var i in this.note()){
			diagram.push(getCurrentDiagram(diagram,this.note()[i].numbers));
		}
		return diagram;
	}, trendModel);
	trendModel.colorArea = ko.dependentObservable(function () {	//
		return dataUtils.getAnalysis(this.maindiagram(),32);
	}, trendModel);
	trendModel.diagramHtml = ko.dependentObservable(function () {	//页面的分布二维数组html	
		var diagramHtml = [],diastr ='',day = 0;
		dayline =[];
		for (var i = 0; i < max_rowcount; i++) {
			if(i<this.note().length){
				diastr = '<td class=\"termN\">'+this.note()[i].term.slice(-3)+'</td>';
				var term = this.note()[i].term;
				if((i==0&&term.slice(-3)=="001")||i > 0&&(term.slice(0,4) != this.note()[i-1].term.slice(0,4))){
					day = 1;
					dayline.push({
						termDate:ALLview.viewtext[select]<2?term.slice(0, 2)+"-"+term.slice(2, 4):term.slice(0, 4),
						targetCount: i+1
					});
				}
				var colarr = this.colorArea()[i];
				$.each(this.maindiagram()[i], function(index, value) {
					if (value == 0) {
						if(index<33){
							diastr+= '<td class=\"dia\"><div class=\"one\" style=\"'+csstext+':'+textcolor[colarr[index]]+';\">'+(index+1>9?(index+1):"0"+(index+1))+'</div></td>';
						}else{
							diastr+= '<td class=\"dia\"><div class=\"two\">'+(index-32>9?(index-32):"0"+(index-32))+'</div></td>';
						}
					} else {
						if(parent.person_setting.showyilou==0)	diastr+= '<td class=\"dia\"><div>'+value+'</div></td>';
							else diastr+= '<td class=\"dia\"><div></div></td>';
					}
				});
			}else if(i==this.note().length){		//倒计时那一行
				diastr = '<td class=\"termN time\">新期销售中</td>';
				for(var j=0;j<49;j++)	diastr+= '<td class=\"dia\"><div></div></td>';
			}else{
				diastr = '<td class=\"termN\">-</td>';
				for(var j=0;j<49;j++)	diastr+= '<td class=\"dia\"><div>-</div></td>';
			}
			diagramHtml.push({
				daycut:day,
				htmlstr:diastr
			});
			day = 0;
		}
	    return diagramHtml;
	}, trendModel);
}

function getpoint(){	//收集连线
	point[0] = [];
	$(".dia").find("div").each(function() {
		if ($(this).is(".two")) {
			point[0].push(this);
		}
	});
	drawline(13);
}
function changeEnd(arr,str){
	return showEnd(arr,str,0,0);
}
//本次的中奖分布图
function getCurrentDiagram(arr,winnumber) {
	var a = new Array(49);
	for (var i = 0; i < a.length; i++) {
		if ((i<33&&winnumber.indexOf(i<33?i+1:i-32)>=0&&winnumber.indexOf(i<33?i+1:i-32)<6)||(i>=33&&winnumber[6]+32==i)){
			a[i] = 0;
		}else {
			if (arr.length > 0) {
				a[i] = arr[arr.length - 1][i] + 1;
			} else {
				a[i] = 1;
			}
		}
	}
	return a;
}