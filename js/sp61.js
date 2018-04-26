var linecolor = new Array("dodgerblue");
var point = new Array(1);
var WIN_NUMBER = 0;
var sx = new Array("鼠","牛","虎","兔","龙","蛇","马","羊","猴","鸡","狗","猪");
function initThisModel(){
	changeYilou();
	trendModel.note = ko.dependentObservable(function () {	//
		return dataUtils.getarr(this.mainnote(), this.page(), max_page, max_rowcount);
	}, trendModel);
	trendModel.maindiagram = ko.dependentObservable(function (){	
		var  diagram =[];
		for (var i in this.note()){
			diagram.push(getCurrentDiagram(diagram,this.note()[i].numbers));
		}
		return diagram;
	}, trendModel);
	trendModel.colorArea = ko.dependentObservable(function () {	//
		return dataUtils.getAnalysis(this.maindiagram(),32);
	}, trendModel);
	trendModel.diagramHtml = ko.dependentObservable(function () {	//页面的分布二维数组html	
		var diagramHtml = [],diastr ='',day = 0;
		dayline =[];
		for (var i = 0; i < max_rowcount; i++) {
			if(i<this.note().length){
				diastr = '<td class=\"termN\">'+(ALLview.isScross[select]!=1?this.note()[i].term.slice(-3):this.note()[i].term)+'</td>';
				var term = this.note()[i].term;
				var narr = this.note()[i].numbers;
				if((i==0&&term.slice(-3)=="001")||i > 0&&(term.slice(0,4) != this.note()[i-1].term.slice(0,4))&&ALLview.isScross[select]!=1){
					day = 1;
					dayline.push({
						termDate:ALLview.viewtext[select]<2?term.slice(0, 2)+"-"+term.slice(2, 4):term.slice(0, 4),
						targetCount: i+1
					});
				}
				$.each(this.maindiagram()[i], function(index, value) {
					if (value == 0) {
						if(index<24){
							if(index%4==0) diastr+= '<td class=\"dia\"><div class=\"one\">'+narr[Math.floor(index/4)]+'</div></td>';
							else diastr+= '<td class=\"dia\"><div class=\"two\"></div></td>';
						}else diastr+= '<td class=\"dia\"><div class=\"zero\">'+sx[index-24]+'</div></td>';
					} else {
						if(parent.person_setting.showyilou==0)	diastr+= '<td class=\"dia\"><div>'+value+'</div></td>';
							else diastr+= '<td class=\"dia\"><div></div></td>';
					}
				});
			}else if(i==this.note().length){		//倒计时那一行
				day = 0;
				diastr = '<td class=\"termN time\">新期销售中</td>';
				for(var j=0;j<36;j++)	diastr+= '<td class=\"dia\"><div></div></td>';
			}else{
				day = 0;
				diastr = '<td class=\"termN\">-</td>';
				for(var j=0;j<36;j++)	diastr+= '<td class=\"dia\"><div>-</div></td>';
			}
			diagramHtml.push({
				daycut:day,
				htmlstr:diastr
			});
		}
	    return diagramHtml;
	}, trendModel);
}
function changeYilou(){//yilouData.max_yilou
	var ar1	=[];
	var ar2 =[];
	for(var i=0;i<6;i++){
		ar1.push(0);ar2.push(0);
		ar1.push(yilouData.cur_yilou[i]);
		ar1.push(yilouData.cur_yilou[i+6]);
		ar1.push(yilouData.cur_yilou[i+12]);
		ar2.push(yilouData.max_yilou[i]);
		ar2.push(yilouData.max_yilou[i+6]);
		ar2.push(yilouData.max_yilou[i+12]);
	}
	yilouData.cur_yilou = ar1.concat(yilouData.cur_yilou.slice(18,30));
	yilouData.max_yilou = ar2.concat(yilouData.max_yilou.slice(18,30));
}
function getpoint(){	//收集连线
	point[0] = [];
	$(".dia").find("div").each(function() {
		if ($(this).is(".zero")) {
			point[0].push(this);
		}
	});
	drawline(13);
}
function changeEnd(arr,str){
	return showEnd(arr,str,0,0);
}
//本次的中奖分布图
function getCurrentDiagram(arr,winnum) {
	var a = new Array(36);
	var b = [];
	var zhi =[1,2,3,5,7,11];
	for(var i=0;i<6;i++){
		b.push([winnum[i]>4?0:1, winnum[i]%2==1?0:1, zhi.indexOf(winnum[i])>=0?0:1]);
	}
	for (var i = 0; i < 36; i++) {
		if((i<24&&(i%4==0||b[Math.floor(i/4)][i%4-1]==0))||(i>=24&&i-23==winnum[6])){
			a[i]=0;
		}else{
			if (arr.length > 0) {
				a[i] = arr[arr.length - 1][i] + 1;
			} else {
				a[i] = 1;
			}
		}
	}
	return a;
}
