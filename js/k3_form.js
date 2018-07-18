var linecolor = new Array("blueviolet","blueviolet");
var point=new Array(2);
var formStr = new Array(parent.provinceCode==22?"三不同":"三连号","三不同","二同号","三同号");
var WIN_NUMBER = K_public.K3_WIN_NUMBER;
function initThisModel(){
	trendModel.note = ko.dependentObservable(function () {	
		return dataUtils.getarr(this.mainnote(), this.page(), max_page, max_rowcount);
	}, trendModel);
	trendModel.diagram = ko.dependentObservable(function () {	//当页
		var arr = [];//console.log(gameArray.maindata[datanum][48-1+this.page()*K_public.MAX_ROWCOUNT]);
		for(var i in this.note()){
			var sum = maindata[parseInt(i)+this.page()*max_rowcount].sum-3;
			var span = maindata[parseInt(i)+this.page()*max_rowcount].span;
			arr.push(dataUtils.getDiagram(arr,this.note()[i].numbers,6,0).concat(dataUtils.getTrend(arr,sum,16,6),dataUtils.getTrend(arr,span,6,22)));
		}
		return arr;
	}, trendModel);
	trendModel.maindiagram = ko.dependentObservable(function () {	//今天的期，算最大遗漏使用
		var maindiagram =[];
		//var todaynote = dataUtils.getbefore(this.note(),0);
		maindiagram.push(yilouData.cur_yilou);
		var x = Math.max(0,this.mainnote().length - gameArray.todaynote[datanum].length);
		for (var i in gameArray.todaynote[datanum]){
			var sum = maindata[parseInt(i)+x].sum-3;
			var span = maindata[parseInt(i)+x].span;
			maindiagram.push(dataUtils.getDiagram(maindiagram,gameArray.todaynote[datanum][i].numbers,6,0).concat(dataUtils.getTrend(maindiagram,sum,16,6),dataUtils.getTrend(maindiagram,span,6,22)));
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
						if(parseInt(index)<6){
							if(data.form==2&&narr.indexOf(parseInt(index)+1)==narr.lastIndexOf(parseInt(index)+1))
								diastr+= '<td class=\"dia\"><div class=\"one\" style=\"'+csstext+':'+K_public.COLOR[1]+'">'+(index+1)+'</div></td>';
							else diastr+= '<td class=\"dia\"><div class=\"one\" style=\"'+csstext+':'+K_public.COLOR[data.form]+'">'+(index+1)+'</div></td>';
						}else if(parseInt(index)<22){
							diastr+= '<td class=\"dia\"><div class=\"two\" style=\"'+csstext+':'+K_public.COLOR[data.form]+'">'+(index-3)+'</div></td>';
						}else{
							diastr+= '<td class=\"dia\"><div class=\"kua\" style=\"'+csstext+':'+K_public.COLOR[data.form]+'">'+(index-22)+'</div></td>';
						}
					} else {
						if(parent.person_setting.showyilou==0)	diastr+= '<td class=\"dia\"><div>'+value+'</div></td>';
						else diastr+= '<td class=\"dia\"><div></div></td>';
					}
				});
				diastr+= '<td class=\"dia\"><div class=\"form\" style=\"color:'+K_public.COLOR[data.form]+'">'+formStr[data.form]+'</div></td>';
			}else if(i==this.note().length){		//倒计时那一行
				data.day = 0;	
				diastr = '<td class=\"termN time\"></td><td class=\"state\" colspan="3" ></td>';
				for(var j=0;j<29;j++)	diastr+= '<td class=\"dia\"><div></div></td>';
			}else{
				data.day = 0;	
				diastr = '<td class=\"termN\">-</td><td class=\"win\">-</td><td class=\"win\">-</td><td class=\"win\">-</td>';
				for(var j=0;j<29;j++)	diastr+= '<td class=\"dia\"><div></div></td>';
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
		if ($(this).is(".kua")) {
			point[1].push(this);
		}
	});
	drawline(14);
}
function changeEnd(arr,str){
	return showEnd(arr,str,0,1);
}