var point = new Array(5);
var linecolor = new Array("purple", "chocolate", "green", "blueviolet", "blueviolet");
var WIN_NUMBER = K_public.K3_WIN_NUMBER;
function initThisModel(){
	trendModel.note = ko.dependentObservable(function () {	//
		return dataUtils.getarr(this.mainnote(), this.page(), max_page, max_rowcount);
	}, trendModel);
	trendModel.diagram = ko.dependentObservable(function () {	//当页
		var arr = [];
		for(var i in this.note()){
			var num = this.note()[i].numbers; 
			var sum = maindata[parseInt(i)+this.page()*max_rowcount].sum-3;
			var span = maindata[parseInt(i)+this.page()*max_rowcount].span;
			arr.push(dataUtils.getTrend(arr,num[0]-1,6,0).concat(dataUtils.getTrend(arr,num[1]-1,6,6),dataUtils.getTrend(arr,num[2]-1,6,12)
									,dataUtils.getDiagram(arr,num,6,18),dataUtils.getTrend(arr,sum,16,24),dataUtils.getTrend(arr,span,6,40)));
		}
		return arr;
	}, trendModel);
	trendModel.maindiagram = ko.dependentObservable(function (){	//今天的期，算最大遗漏使用
		var arr =[];
		//var todaynote = dataUtils.getbefore(this.note(),0);
		arr.push(yilouData.cur_yilou);
		var x = Math.max(0,this.mainnote().length - gameArray.todaynote[datanum].length);
		for (var i in gameArray.todaynote[datanum]){
			var num = gameArray.todaynote[datanum][i].numbers;  
			var sum = maindata[parseInt(i)+x].sum-3;
			var span = maindata[parseInt(i)+x].span;
			arr.push(dataUtils.getTrend(arr,num[0]-1,6,0).concat(dataUtils.getTrend(arr,num[1]-1,6,6),dataUtils.getTrend(arr,num[2]-1,6,12)
									,dataUtils.getDiagram(arr,num,6,18),dataUtils.getTrend(arr,sum,16,24),dataUtils.getTrend(arr,span,6,40)));
		}
		return arr;
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
						if(parseInt(index)<6){
							diastr+= '<td class=\"dia\"><div class=\"second\" style=\"'+csstext+':'+K_public.COLOR[data.form]+'">'+(index+1)+'</div></td>';
						}else if(parseInt(index)<12){
							diastr+= '<td class=\"dia\"><div class=\"third\" style=\"'+csstext+':'+K_public.COLOR[data.form]+'">'+(index-5)+'</div></td>';
						}else if(parseInt(index)<18){
							diastr+= '<td class=\"dia\"><div class=\"fouth\" style=\"'+csstext+':'+K_public.COLOR[data.form]+'">'+(index-11)+'</div></td>';
						}else if(parseInt(index)<24){
							if(data.form==2&&narr.indexOf(parseInt(index)-17)==narr.lastIndexOf(parseInt(index)-17))
								diastr+= '<td class=\"dia\"><div class=\"one\" style=\"'+csstext+':'+K_public.COLOR[1]+'">'+(index-17)+'</div></td>';
							else diastr+= '<td class=\"dia\"><div class=\"one\" style=\"'+csstext+':'+K_public.COLOR[data.form]+'">'+(index-17)+'</div></td>';
						}else if(parseInt(index)<40){
							diastr+= '<td class=\"dia\"><div class=\"two\" style=\"'+csstext+':'+K_public.COLOR[data.form]+'">'+(index-21)+'</div></td>';
						}else{
							diastr+= '<td class=\"dia\"><div class=\"kua\" style=\"'+csstext+':'+K_public.COLOR[data.form]+'">'+(index-40)+'</div></td>';
						}
					} else {
						if(parent.person_setting.showyilou==0)	diastr+= '<td class=\"dia\"><div>'+value+'</div></td>';
						else diastr+= '<td class=\"dia\"><div></div></td>';
					}
				});
			}else if(i==this.note().length){		//倒计时那一行
				data.day = 0;
				diastr = '<td class=\"termN time\"></td><td class=\"state\" colspan="3" ></td>';
				for(var j=0;j<46;j++)	diastr+= '<td class=\"dia\"><div></div></td>';
			}else{
				data.day = 0;
				diastr = '<td class=\"termN\">-</td><td class=\"win\"></td><td class=\"win\"></td><td class=\"win\"></td>';
				for(var j=0;j<46;j++)	diastr+= '<td class=\"dia\"><div>-</div></td>';
			}
			diagramHtml.push({
				daycut:data.day,
				htmlstr:diastr
			});
		}
	    return diagramHtml;
	}, trendModel);
}
function getpoint(){	//收集连线
	point[0] = [];
	point[1] = [];
	point[2] = [];
	point[3] = [];
	point[4] = [];
	$(".dia").find("div").each(function() {
		if ($(this).is(".second")) {
			point[0].push(this);
		}
		if ($(this).is(".third")) {
			point[1].push(this);
		}
		if ($(this).is(".fouth")) {
			point[2].push(this);
		}
		if ($(this).is(".two")) {
			point[3].push(this);
		}
		if ($(this).is(".kua")) {
			point[4].push(this);
		}
	});
	drawline(14);
}
function changeEnd(arr,str){
	return showEnd(arr,str,0,0);
}