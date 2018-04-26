var linecolor = new Array("blueviolet","blueviolet");
var point = new Array(2);
var WIN_NUMBER = 3;

function initThisModel(){
	trendModel.note = ko.dependentObservable(function () {	//
		return dataUtils.getarr(this.mainnote(), this.page(), max_page, max_rowcount);
	}, trendModel);
	trendModel.diagram = ko.dependentObservable(function () {	//当页
		var arr = [];//console.log(gameArray.maindata[datanum][48-1+this.page()*K_public.MAX_ROWCOUNT]);
		for(var i in this.note()){
			var num = this.note()[i].numbers2; 
			arr.push(dataUtils.getTrend(arr,num[0]-1,10,0).concat(dataUtils.getTrend(arr,num[1]-1,10,10),dataUtils.getDiagram(arr,num,10,20),sumdia(arr,parseInt(i)+this.page()*max_rowcount,30)));
		}
		return arr;
	}, trendModel);
	trendModel.maindiagram = ko.dependentObservable(function (){	//今天的期，算最大遗漏使用
		var maindiagram =[];
		maindiagram.push(yilouData.cur_yilou);
		var x = Math.max(0,this.mainnote().length - gameArray.todaynote[datanum].length);
		for (var i in gameArray.todaynote[datanum]){
			var num = gameArray.todaynote[datanum][i].numbers2; 
			maindiagram.push(dataUtils.getTrend(maindiagram,num[0]-1,10,0).concat(dataUtils.getTrend(maindiagram,num[1]-1,10,10),dataUtils.getDiagram(maindiagram,num,10,20),sumdia(maindiagram,parseInt(i)+x,30)));
		}
		return maindiagram;
	}, trendModel);
	trendModel.diagramHtml = ko.dependentObservable(function(){	//页面的分布二维数组html	
		var diagramHtml = [],diastr ='',data = [];
		dayline =[];
		for (var i = 0; i < max_rowcount; i++) {
			if(i<this.note().length){
				data = deepCopy(maindata[i+this.page()*max_rowcount]) ;
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
				$.each(narr1, function(index, value) {
					diastr += '<td class=\"win\">'+value+'</td>';
				});
				$.each(this.diagram()[i], function(index, value) {
					if (parseInt(value)== 0) {
						if(parseInt(index)<10){
							diastr+= '<td class=\"dia first colortd\"><div class=\"one\">'+(index+1)+'</div></td>';
						}else if(parseInt(index)<20){
							diastr+= '<td class=\"dia second colortd\"><div class=\"two\">'+(index-9)+'</div></td>';
						}else if(parseInt(index)<30){
							if(narr2[0]==index-19)	diastr+= '<td class=\"dia first colortd\"><div class=\"three\">'+(index-19)+'</div></td>';
							else if(narr2[1]==index-19)	diastr+= '<td class=\"dia second colortd\"><div class=\"three\">'+(index-19)+'</div></td>';
							else if(narr2[2]==index-19)	diastr+= '<td class=\"dia third colortd\"><div class=\"three\">'+(index-19)+'</div></td>';
						}else if(parseInt(index)==30)
							 diastr+= '<td class=\"dia\"><div>'+data.sum2+'</div></td>';
						else if(parseInt(index)==31)
							 diastr+= '<td class=\"dia\"><div class=\"four\">'+(data.ds==3?"大":"小")+'</div></td>';
						else if(parseInt(index)==32)
							 diastr+= '<td class=\"dia\"><div class=\"four\">'+(data.js==3?"单":"双")+'</div></td>';
					}else {
						if(parent.person_setting.showyilou==0&&parseInt(index)<30)	diastr+= '<td class=\"dia\"><div>'+value+'</div></td>';
						else diastr+= '<td class=\"dia\"><div></div></td>';
					}
				});
			}else if(i==this.note().length){		//倒计时那一行
				diastr = '<td class=\"termN time\"></td><td class=\"state\" colspan="3" ></td>';
				for(var j=0;j<33;j++)	diastr+= '<td class=\"dia\"><div></div></td>';
			}else{
				diastr = '<td class=\"termN\">-</td><td class=\"win\"></td><td class=\"win\"></td><td class=\"win\"></td>';
				for(var j=0;j<33;j++)	diastr+= '<td class=\"dia\"><div></div></td>';
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
	$(".dia").find("div").each(function() {
		if ($(this).is(".one")) {
			point[0].push(this);
		}
		if ($(this).is(".two")) {
			point[1].push(this);
		}
	});
	drawline(14);
}
function changeEnd(arr,str){
	if(arr.length>30)
		arr.splice(30,3);
	return showEnd(arr,str,0,3);
}
function sumdia(arr,n,st){
	var start = st?st:0;
	var a = new Array(3);
	for (var i = 0; i < 3; i++) {
		if (i==0||(i==1&&maindata[n].ds%3==0)||(i==2&&maindata[n].js%3==0)) {
			a[i] = 0;
		} else {
			if (arr.length > 0) {
				a[i] = arr[arr.length - 1][i+start] + 1;
			} else {
				a[i] = 1;
			}
		}
	}
	return a;
}
