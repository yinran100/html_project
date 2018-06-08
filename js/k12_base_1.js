var point = new Array(3);//百位
var linecolor = new Array("blueviolet","blueviolet","blueviolet");
var WIN_NUMBER = 0;
function initThisModel(){
	trendModel.note = ko.dependentObservable(function () {	//
		return dataUtils.getarr(this.mainnote(), this.page(), max_page, max_rowcount);
	}, trendModel);
	trendModel.diagram = ko.dependentObservable(function () {	//当页
		var arr = [];//console.log(gameArray.maindata[datanum][48-1+this.page()*K_public.MAX_ROWCOUNT]);
		for(var i in this.note()){
			var num = this.note()[i].numbers; 
			arr.push(dataUtils.getTrend(arr,num[0]-1,12,0).concat(dataUtils.getTrend(arr,num[1]-1,12,12),
								dataUtils.getTrend(arr,num[2]-1,12,24),dataUtils.getDiagram(arr,num,12,36)));
		}
		return arr;
	}, trendModel);
	trendModel.maindiagram = ko.dependentObservable(function (){	//今天的期，算最大遗漏使用
		var maindiagram =[];
		maindiagram.push(yilouData.cur_yilou);
		var x = Math.max(0,this.mainnote().length - gameArray.todaynote[datanum].length);
		for (var i in gameArray.todaynote[datanum]){
			var num = gameArray.todaynote[datanum][i].numbers; 
			maindiagram.push(dataUtils.getTrend(maindiagram,num[0]-1,12,0).concat(dataUtils.getTrend(maindiagram,num[1]-1,12,12),
								dataUtils.getTrend(maindiagram,num[2]-1,12,24),dataUtils.getDiagram(maindiagram,num,12,36)));
		}
		return maindiagram;
	}, trendModel);
	trendModel.diagramHtml = ko.dependentObservable(function () {	//页面的分布二维数组html	
		var diagramHtml = [],data=[],diastr ='';
		dayline = [];
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
				$.each(this.diagram()[i], function(index, value) {
					if (parseInt(value) == 0) {
						if(parseInt(index)<12){
							diastr += '<td class=\"dia\"><div class=\"first\">'+(index+1)+'</div></td>';
						}else if(parseInt(index)<24){
							diastr += '<td class=\"dia\"><div class=\"second\">'+(index-11)+'</div></td>';
						}else if(parseInt(index)<36){
							diastr += '<td class=\"dia\"><div class=\"third\">'+(index-23)+'</div></td>';
						}else	
						diastr+= '<td class=\"dia '+(data.lian[index-36]==1?'back':'')+'\"><div class=\"'+(narr.indexOf(index-35)<1?'one':'zero')+'\">'+(index-35)+'</div></td>';
					} else {
						if(parent.person_setting.showyilou==0)	diastr+= '<td class=\"dia\"><div>'+value+'</div></td>';
						else diastr+= '<td class=\"dia\"><div></div></td>';
					}
				});
			}else if(i==this.note().length){		//倒计时那一行
				data.day = 0;
				diastr = '<td class=\"termN time\"></td>';
				for(var j=0;j<48;j++)	diastr+= '<td class=\"dia\"><div></div></td>';
			}else{
				data.day = 0;
				diastr = '<td class=\"termN\">-</td>';
				for(var j=0;j<48;j++)	diastr+= '<td class=\"dia\"><div></div></td>';
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
	$(".dia").find("div").each(function() {
		if ($(this).is(".first")) {
			point[0].push(this);
		}
		if ($(this).is(".second")) {
			point[1].push(this);
		}
		if ($(this).is(".third")) {
			point[2].push(this);
		}
	});
	drawline(14);
}
function changeEnd(arr,str){
	return showEnd(arr,str,0,0);
}