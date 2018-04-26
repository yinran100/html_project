var point = new Array(2);
var linecolor = new Array("blueviolet", "blueviolet");
var WIN_NUMBER = K_public.K3_WIN_NUMBER;
function initThisModel(){
	trendModel.note = ko.dependentObservable(function () {	//
		return dataUtils.getarr(this.mainnote(), this.page(), max_page, max_rowcount);
	}, trendModel);
	trendModel.diagram = ko.dependentObservable(function () {	//当页
		var arr = [];
		for(var i in this.note()){
			var sum = maindata[parseInt(i)+this.page()*max_rowcount].sum-3;
			arr.push(dataUtils.getTrend(arr,sum,16,0).concat(dataUtils.getTrend(arr,sum%10,10,16),dataUtils.getTrend(arr,sum%3,3,26)));
		}
		return arr;
	}, trendModel);
	trendModel.maindiagram = ko.dependentObservable(function () {	//今天的期，算最大遗漏使用
		var maindiagram =[];
		maindiagram.push(yilouData.cur_yilou);
		var x = Math.max(0,this.mainnote().length - gameArray.todaynote[datanum].length);
		for (var i in gameArray.todaynote[datanum]){
			var sum = maindata[parseInt(i)+x].sum-3;
			maindiagram.push(dataUtils.getTrend(maindiagram,sum,16,0).concat(dataUtils.getTrend(maindiagram,sum%10,10,16),dataUtils.getTrend(maindiagram,sum%3,3,26)));
		}
		return maindiagram;
	}, trendModel);
	trendModel.diagramHtml = ko.dependentObservable(function () {	//页面的分布二维数组html	
		var diagramHtml = [], diastr ='',data = [];
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
						if(parseInt(index)<16){
							diastr+= '<td class=\"dia\"><div class=\"two\" style=\"'+csstext+':'+K_public.COLOR[data.form]+'">'+(index+3)+'</div></td>';
						}else if(parseInt(index)<26){
							diastr+= '<td class=\"dia\"><div class=\"three\" style=\"'+csstext+':'+K_public.COLOR[data.form]+'">'+(index-16)+'</div></td>';
						}else{
							diastr+= '<td class=\"dia lu\"><div class=\"four\" style=\"color:'+K_public.COLOR[data.form]+'">'+(index-26)+'</div></td>';
						}
					} else {
						if(parent.person_setting.showyilou==0)	diastr+= '<td class=\"dia\"><div>'+value+'</div></td>';
						else diastr+= '<td class=\"dia\"><div></div></td>';
					}
				});
				diastr+= '<td class=\"dia\"><div style=\"color:'+K_public.COLOR[data.form]+'">'+maindata[i+this.page()*max_rowcount].span+'</div></td>';
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
function getpoint(){	
	point[0] = [];
	point[1] = [];
	$(".dia").find("div").each(function() {
		if ($(this).is(".two")) {
			point[0].push(this);
		}
		if ($(this).is(".three")) {
			point[1].push(this);
		}
	});
	drawline(14);
}
function changeEnd(arr,str){
	return showEnd(arr,str,0,1);
}
