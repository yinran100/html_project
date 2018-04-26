var colorArea = [];//关于特殊分析
var textcolor1 =new Array("#A9A9A9","#DC143C","orangered"); //#F26C86
var textcolor2 =new Array("#A9A9A9","blue","#2D93CA"); //dodgerblue
var WIN_NUMBER = 0;
var linecolor = new Array();
var point = new Array(0);
function initThisModel(){
	trendModel.note = ko.dependentObservable(function () {	//
		return dataUtils.getarr(this.mainnote(), this.page(), max_page, max_rowcount);
	}, trendModel);
	trendModel.maindiagram = ko.dependentObservable(function (){	
		var  diagram =[];
		for (var i in this.note()){
			diagram.push(dataUtils.getDiagram(diagram,this.note()[i].numbers,30));
		}
		return diagram;
	}, trendModel);
	trendModel.colorArea = ko.dependentObservable(function () {	//
		return dataUtils.getAnalysis(this.maindiagram(),29);
	}, trendModel);
	trendModel.diagramHtml = ko.dependentObservable(function () {	//页面的分布二维数组html	
		var diagramHtml = [],diastr ='',day = 0;
		dayline =[];
		for (var i = 0; i < max_rowcount; i++) {
			if(i<this.note().length){
				diastr = '<td class=\"termN\">'+(ALLview.isScross[select]!=1?this.note()[i].term.slice(-3):this.note()[i].term)+'</td>';
				var term = this.note()[i].term;
				if((i==0&&term.slice(-3)=="001")||i > 0&&(term.slice(0,4) != this.note()[i-1].term.slice(0,4))&&ALLview.isScross[select]!=1){
					day = 1;
					dayline.push({
						termDate:ALLview.viewtext[select]<2?term.slice(0, 2)+"-"+term.slice(2, 4):term.slice(0, 4),
						targetCount: i+1
					});
				}
				var colarr = this.colorArea()[i];
				var narr = this.note()[i].numbers;
				$.each(this.maindiagram()[i], function(index, value) {
					if (value == 0) {
						if(narr.indexOf(parseInt(index)+1)<Longdata.WIN_QL730-1){
							diastr+= '<td class=\"dia\"><div class=\"one\" style=\"'+csstext+':'+textcolor1[colarr[index]]+';\">'+(index+1>9?(index+1):"0"+(index+1))+'</div></td>';
						}else{
							diastr+= '<td class=\"dia\"><div class=\"one\" style=\"'+csstext+':'+textcolor2[colarr[index]]+';\">'+(index+1>9?(index+1):"0"+(index+1))+'</div></td>';
						}
					} else {
						if(parent.person_setting.showyilou==0)	diastr+= '<td class=\"dia\"><div>'+value+'</div></td>';
							else diastr+= '<td class=\"dia\"><div></div></td>';
					}
				});
			}else if(i==this.note().length){		//倒计时那一行
				diastr = '<td class=\"termN time\">新期销售中</td>';
				for(var j=0;j<30;j++)	diastr+= '<td class=\"dia\"><div></div></td>';
			}else{
				diastr = '<td class=\"termN\">-</td>';
				for(var j=0;j<30;j++)	diastr+= '<td class=\"dia\"><div>-</div></td>';
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
	drawline(14);
}
function changeEnd(arr,str){
	return showEnd(arr,str,0,0);
}