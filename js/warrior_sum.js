var linecolor = new Array("blueviolet");
var point = new Array(1);
var WIN_NUMBER = 3;

function initThisModel(){
	trendModel.note = ko.dependentObservable(function () {	//
		return dataUtils.getarr(this.mainnote(), this.page(), max_page, max_rowcount);
	}, trendModel);
	trendModel.diagram = ko.dependentObservable(function () {	//当页
		var arr = [];//console.log(gameArray.maindata[datanum][48-1+this.page()*K_public.MAX_ROWCOUNT]);
		for(var i in this.note()){
			var da = maindata[parseInt(i)+this.page()*max_rowcount];
			arr.push(dataUtils.getTrend(arr,da.sum2-6,22,0));
		}
		return arr;
	}, trendModel);
	trendModel.maindiagram = ko.dependentObservable(function (){	//今天的期，算最大遗漏使用
		var maindiagram =[];
		maindiagram.push(yilouData.cur_yilou);
		var x = Math.max(0,this.mainnote().length - gameArray.todaynote[datanum].length);
		for (var i in gameArray.todaynote[datanum]){
			var da = maindata[parseInt(i)+x];
			maindiagram.push(dataUtils.getTrend(maindiagram,da.sum2-6,22,0));
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
				if(i!=0||this.page()!=0)
					if(maindata[i+this.page()*max_rowcount-1].day==1) data.day=1;
				$.each(narr2, function(index, value) {
					diastr += '<td class=\"win colortd\">'+value+'</td>';
				});
				$.each(this.diagram()[i], function(index, value) {
					if (parseInt(value)== 0) {
							diastr+= '<td class=\"dia\"><div class=\"one\">'+(6+ index)+'</div></td>';
					}else {
						if(parent.person_setting.showyilou==0)	diastr+= '<td class=\"dia\"><div>'+value+'</div></td>';
						else diastr+= '<td class=\"dia\"><div></div></td>';
					}
				});
			}else if(i==this.note().length){		//倒计时那一行
				diastr = '<td class=\"termN time\"></td><td class=\"state\" colspan="3" ></td>';
				for(var j=0;j<22;j++)	diastr+= '<td class=\"dia\"><div></div></td>';
			}else{
				diastr = '<td class=\"termN\">-</td><td class=\"win\"></td><td class=\"win\"></td><td class=\"win\"></td>';
				for(var j=0;j<22;j++)	diastr+= '<td class=\"dia\"><div></div></td>';
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
	$(".dia").find("div").each(function() {
		if ($(this).is(".one")) {
			point[0].push(this);
		}
	});
	drawline(14);
}
function changeEnd(arr,str){
	return showEnd(arr,str,0,0);
}