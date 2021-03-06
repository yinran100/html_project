var linecolor = new Array("blueviolet","blueviolet","blueviolet");
var point = new Array(3);
var WIN_NUMBER = 3;

function initThisModel(){
	trendModel.note = ko.dependentObservable(function () {	//
		return dataUtils.getarr(this.mainnote(), this.page(), max_page, max_rowcount);
	}, trendModel);
	trendModel.diagram = ko.dependentObservable(function () {	//当页
		var arr = [];//console.log(gameArray.maindata[datanum][48-1+this.page()*K_public.MAX_ROWCOUNT]);
		for(var i in this.note()){
			var num = this.note()[i].numbers1; 
			arr.push(dataUtils.getTrend(arr,num[0],3,0).concat(dataUtils.getTrend(arr,num[1],3,3),dataUtils.getTrend(arr,num[2],3,6)));
		}
		return arr;
	}, trendModel);
	trendModel.maindiagram = ko.dependentObservable(function (){	//今天的期，算最大遗漏使用
		var maindiagram =[];
		maindiagram.push(yilouData.cur_yilou);
		var x = Math.max(0,this.mainnote().length - gameArray.todaynote[datanum].length);
		for (var i in gameArray.todaynote[datanum]){
			var num = gameArray.todaynote[datanum][i].numbers1; 
			maindiagram.push(dataUtils.getTrend(maindiagram,num[0],3,0).concat(dataUtils.getTrend(maindiagram,num[1],3,3),dataUtils.getTrend(maindiagram,num[2],3,6)));
		}
		return maindiagram;
	}, trendModel);
	trendModel.diagramHtml = ko.dependentObservable(function(){	//页面的分布二维数组html	
		var diagramHtml = [],diastr ='',data = [];
		dayline =[];
		for (var i = 0; i < max_rowcount; i++) {
			if(i<this.note().length){
				data = deepCopy(maindata[i+this.page()*max_rowcount]);
				diastr = '<td class=\"termN\">'+(ALLview.isScross[select]!=1?this.note()[i].term.slice(-3):this.note()[i].term)+'</td>';
				var narr1 = this.note()[i].numbers1;
				var narr2 = this.note()[i].numbers2;
				if(data.day==1&&ALLview.isScross[select]!=1){
					dayline.push({
						termDate:ALLview.viewtext[select]<2?this.note()[i].term.slice(0, 2)+"-"+this.note()[i].term.slice(2, 4):this.note()[i].term.slice(0, 4),
						targetCount: i+1
					});
				}
				if(maindata[i+this.page()*max_rowcount-1].day==1) data.day=1;
				$.each(narr1, function(index, value) {
					diastr += '<td class=\"win\">'+value+'</td>';
				});
				$.each(this.diagram()[i], function(index, value) {
					if (parseInt(value)== 0) {
						if(parseInt(index)<3){
							diastr+= '<td class=\"dia\"><div class=\"one\">'+index+'</div></td>';
						}else if(parseInt(index)<6){
							diastr+= '<td class=\"dia\"><div class=\"two\">'+(index-3)+'</div></td>';
						}else {
							diastr+= '<td class=\"dia\"><div class=\"three\">'+(index-6)+'</div></td>';
						}
					}else {
						if(parent.person_setting.showyilou==0)	diastr+= '<td class=\"dia\"><div>'+value+'</div></td>';
						else diastr+= '<td class=\"dia\"><div></div></td>';
					}
				});
				diastr+= '<td class=\"dia\"><div>'+data.sum1+'</div></td>';
			}else if(i==this.note().length){		//倒计时那一行
				diastr = '<td class=\"termN time\"></td><td class=\"state\" colspan="3" ></td>';
				for(var j=0;j<10;j++)	diastr+= '<td class=\"dia\"><div></div></td>';
			}else{
				diastr = '<td class=\"termN\">-</td><td class=\"win\"></td><td class=\"win\"></td><td class=\"win\"></td>';
				for(var j=0;j<10;j++)	diastr+= '<td class=\"dia\"><div></div></td>';
			}
			diagramHtml.push({
				daycut:data.day,
				htmlstr:diastr
			});
				data.day = 0;
		}
	    return diagramHtml;
	}, trendModel);
}
function getpoint(){	//收集连线
	point[0] = [];
	point[1] = [];
	point[2] = [];
	$(".dia").find("div").each(function() {
		if ($(this).is(".one")) {
			point[0].push(this);
		}
		if ($(this).is(".two")) {
			point[1].push(this);
		}
		if ($(this).is(".three")) {
			point[2].push(this);
		}
	});
	drawline(14);
}
function changeEnd(arr,str){
	return showEnd(arr,str,0,1);
}