var point = new Array(2);//百位
var linecolor = new Array("blueviolet","blueviolet");
var WIN_NUMBER = K_public.K12_WIN_NUMBER;
function initThisModel(){
	trendModel.note = ko.dependentObservable(function () {	//
		return dataUtils.getarr(this.mainnote(), this.page(), max_page, max_rowcount);
	}, trendModel);
	trendModel.diagram = ko.dependentObservable(function () {	//当页
		var arr = [];//console.log(gameArray.maindata[datanum][48-1+this.page()*K_public.MAX_ROWCOUNT]);
		for(var i in this.note()){
			var num = this.note()[i].numbers; 
			arr.push(dataUtils.getTrend(arr,num[0]-1,12,0).concat(dataUtils.getTrend(arr,num[1]-1,12,12)));
		}
		return arr;
	}, trendModel);
	trendModel.maindiagram = ko.dependentObservable(function (){	//今天的期，算最大遗漏使用
		var maindiagram =[];
		maindiagram.push(yilouData.cur_yilou);
		var x = Math.max(0,this.mainnote().length - gameArray.todaynote[datanum].length);
		for (var i in gameArray.todaynote[datanum]){
			var num = gameArray.todaynote[datanum][i].numbers; 
			maindiagram.push(dataUtils.getTrend(maindiagram,num[0]-1,12,0).concat(dataUtils.getTrend(maindiagram,num[1]-1,12,12)));
		}
		return maindiagram;
	}, trendModel);
	trendModel.diagramHtml = ko.dependentObservable(function () {	//页面的分布二维数组html	
		var diagramHtml = [],data=[],diastr ='';
		dayline =[];
		for (var i = 0; i < max_rowcount; i++){
			if(i<this.note().length){
				data = deepCopy(maindata[i+this.page()*max_rowcount]);
				diastr = '<td class=\"termN\">'+(ALLview.isScross[select]!=1?this.note()[i].term.slice(-3):this.note()[i].term)+'</td>';
				var narr = this.note()[i].numbers;
				if(data.day == 1&&ALLview.isScross[select]!=1){
					dayline.push({
						termDate:ALLview.viewtext[select]<2?this.note()[i].term.slice(0, 2)+"-"+this.note()[i].term.slice(2, 4):this.note()[i].term.slice(0, 4),
						targetCount: i+1
					});
				}
				$.each(narr, function(index, value) {
					diastr += '<td class=\"win\">'+(value>9?value:'0'+value)+'</td>';
				});
				$.each(this.diagram()[i], function(index, value) {
					if (parseInt(value) <= 0) {		//********
						if(parseInt(index)<12){
							diastr += '<td class=\"dia\"><div class=\"first\">'+(index+1>9?(index+1):'0'+(index+1))+'</div></td>';
						}else{
							diastr += '<td class=\"dia\"><div class=\"second\">'+(index-11>9?(index-11):'0'+(index-11))+'</div></td>';
						}
					} else {
						if(parent.person_setting.showyilou==0)	diastr += '<td class=\"dia\"><div>'+value+'</div></td>';
						else diastr += '<td class=\"dia\"><div></div></td>';
					}
				});
				diastr += '<td class=\"dia pro\">'+data.js+'</td>';
				diastr += '<td class=\"dia pro\">'+data.zhi+'</td>';
				diastr += '<td class=\"dia pro\">'+data.sum+'</td>';
				diastr += '<td class=\"dia pro\">'+data.span+'</td>';
			}else if(i==this.note().length){		//倒计时那一行
				data.day = 0;
				diastr = '<td class=\"termN time\"></td><td class=\"state\" colspan="5" ></td>';
				for(var j=0;j<28;j++)	diastr+= '<td class=\"dia\"><div></div></td>';
			}else{
				data.day = 0;
				diastr = '<td class=\"termN\">-</td><td class=\"win\">-</td><td class=\"win\">-</td><td class=\"win\">-</td>'
						+'<td class=\"win\">-</td><td class=\"win\">-</td>';
				for(var j=0;j<28;j++)	diastr+= '<td class=\"dia\"><div></div></td>';
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
	$(".dia").find("div").each(function() {
		if ($(this).is(".first")) {
			point[0].push(this);
		}
		if ($(this).is(".second")) {
			point[1].push(this);
		}
	});
	drawline(14);
}
function changeEnd(arr,str){
	return showEnd(arr,str,0,4);
}