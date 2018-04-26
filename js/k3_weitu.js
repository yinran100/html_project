var point = new Array(3);//百位
var linecolor = new Array("purple", "chocolate", "green");
var WIN_NUMBER = K_public.K3_WIN_NUMBER;
function initThisModel(){
	trendModel.note = ko.dependentObservable(function () {	//
		return dataUtils.getarr(this.mainnote(), this.page(), max_page, max_rowcount);
	}, trendModel);
	trendModel.diagram = ko.dependentObservable(function () {	//当页
		var arr = [];
		for(var i in this.note()){
			var num = this.note()[i].numbers; 
			arr.push(dataUtils.getDiagram(arr,num,6,0).concat(dataUtils.getTrend(arr,num[0]-1,6,6),dataUtils.getTrend(arr,num[1]-1,6,12),dataUtils.getTrend(arr,num[2]-1,6,18)));
		}
		return arr;
	}, trendModel);
	trendModel.maindiagram = ko.dependentObservable(function (){	//今天的期，算最大遗漏使用
		var maindiagram =[];
		//var todaynote = dataUtils.getbefore(this.note(),0);
		maindiagram.push(yilouData.cur_yilou);
		var x = Math.max(0,this.mainnote().length - gameArray.todaynote[datanum].length);
		for (var i in gameArray.todaynote[datanum]){
			var num = gameArray.todaynote[datanum][i].numbers;  
			maindiagram.push(dataUtils.getDiagram(maindiagram,num,6,0).concat(dataUtils.getTrend(maindiagram,num[0]-1,6,6),dataUtils.getTrend(maindiagram,num[1]-1,6,12),dataUtils.getTrend(maindiagram,num[2]-1,6,18)));
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
						}else if(parseInt(index)<12){
							diastr+= '<td class=\"dia\"><div class=\"second\" style=\"'+csstext+':'+K_public.COLOR[data.form]+'">'+(index-5)+'</div></td>';
						}else if(parseInt(index)<18){
							diastr+= '<td class=\"dia\"><div class=\"third\" style=\"'+csstext+':'+K_public.COLOR[data.form]+'">'+(index-11)+'</div></td>';
						}else{
							diastr+= '<td class=\"dia\"><div class=\"fouth\" style=\"'+csstext+':'+K_public.COLOR[data.form]+'">'+(index-17)+'</div></td>';
						}
					} else {
						if(parent.person_setting.showyilou==0)	diastr+= '<td class=\"dia\"><div>'+value+'</div></td>';
						else diastr+= '<td class=\"dia\"><div></div></td>';
					}
				});
				diastr+= '<td class=\"dia\"><div class=\"zero\" style=\"'+csstext+':'+K_public.COLOR[data.form]+'">'+gameArray.maindata[datanum][i+this.page()*K_public.MAX_ROWCOUNT].sum+'</div></td>';
				diastr+= '<td class=\"dia\"><div class=\"zero\" style=\"'+csstext+':'+K_public.COLOR[data.form]+'">'+gameArray.maindata[datanum][i+this.page()*K_public.MAX_ROWCOUNT].span+'</div></td>';
			}else if(i==this.note().length){		//倒计时那一行
				data.day = 0;
				diastr = '<td class=\"termN time\"></td><td class=\"state\" colspan="3" ></td>';
				for(var j=0;j<26;j++)	diastr+= '<td class=\"dia\"><div></div></td>';
			}else{
				data.day = 0;
				diastr = '<td class=\"termN\">-</td><td class=\"win\"></td><td class=\"win\"></td><td class=\"win\"></td>';
				for(var j=0;j<26;j++)	diastr+= '<td class=\"dia\"><div>-</div></td>';
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
	point[2] = [];
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
	});
	drawline(14);
}
function changeEnd(arr,str){
	return showEnd(arr,str,0,2);
}