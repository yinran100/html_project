var linecolor = new Array("blueviolet");
var point = new Array(1);
var WIN_NUMBER = 0;

function initThisModel(){
	changeYilou();
	trendModel.note = ko.dependentObservable(function () {	//
		return dataUtils.getarr(this.mainnote(), this.page(), max_page, max_rowcount);
	}, trendModel);
	trendModel.diagram = ko.dependentObservable(function () {	//当页
		var arr = [];//console.log(gameArray.maindata[datanum][48-1+this.page()*K_public.MAX_ROWCOUNT]);
		for(var i in this.note()){
			arr.push(getthisDiagram(arr, this.note()[i].numbers1, this.note()[i].numbers2,parseInt(i)+this.page()*max_rowcount));
		}
		return arr;
	}, trendModel);
	trendModel.maindiagram = ko.dependentObservable(function (){	//今天的期，算最大遗漏使用
		var maindiagram =[];
		//var todaynote = dataUtils.getbefore(this.note(),0);
		maindiagram.push(yilouData.cur_yilou);
		var x = Math.max(0,this.mainnote().length - gameArray.todaynote[datanum].length);
		for (var i in gameArray.todaynote[datanum]){
			maindiagram.push(getthisDiagram(maindiagram, gameArray.todaynote[datanum][i].numbers1, gameArray.todaynote[datanum][i].numbers2,parseInt(i)+x));
		}
		return maindiagram;
	}, trendModel);
	trendModel.diagramHtml = ko.dependentObservable(function(){	//页面的分布二维数组html	
		var diagramHtml = [],diastr ='',day = 0;
		dayline =[];
		for (var i = 0; i < max_rowcount; i++) {
			if(i<this.note().length){
				day = maindata[i+this.page()*max_rowcount].day+0;
				diastr = '<td class=\"termN\">'+(ALLview.isScross[select]!=1?this.note()[i].term.slice(-3):this.note()[i].term)+'</td>';
				var narr1 = this.note()[i].numbers1;
				var narr2 = this.note()[i].numbers2;
				if(day==1&&ALLview.isScross[select]!=1){
					dayline.push({
						termDate:ALLview.viewtext[select]<2?this.note()[i].term.slice(0, 2)+"-"+this.note()[i].term.slice(2, 4):this.note()[i].term.slice(0, 4),
						targetCount: i+1
					});
				}
				if(i!=0||this.page()!=0)
					if(maindata[i+this.page()*max_rowcount-1].day==1) day=1;
				$.each(this.diagram()[i], function(index, value) {
					if(index==9||index==20){
						diastr+= '<td class=\"dia\"><div class=\"one\">'+value+'</div></td>';
						//if(i==0&&index==9) diastr+= '<td rowspan="51">-</td>';
					}else if (parseInt(value)== 0) {
						if(parseInt(index)<9){
							diastr+= '<td class=\"dia\"><div class=\"one\">'+(index%3)+'</div></td>';
						}else if(parseInt(index)<20){
							if(narr2[0]==index-9)	diastr+= '<td class=\"dia first colortd\"><div class=\"two\">'+(index-9)+'</div></td>';
							else if(narr2[1]==index-9)	diastr+= '<td class=\"dia second colortd\"><div class=\"two\">'+(index-9)+'</div></td>';
							else if(narr2[2]==index-9)	diastr+= '<td class=\"dia third colortd\"><div class=\"two\">'+(index-9)+'</div></td>';
						}
					}else {
						if(parent.person_setting.showyilou==0)	diastr+= '<td class=\"dia\"><div>'+value+'</div></td>';
						else diastr+= '<td class=\"dia\"><div></div></td>';
					}
				});
			}else if(i==this.note().length){		//倒计时那一行
				day = 0;
				diastr = '<td class=\"termN time\"></td><td class=\"state\" colspan="3" ></td>';
				for(var j=0;j<18;j++)	diastr+= '<td class=\"dia\"><div></div></td>';
			}else{
				day = 0;
				diastr = '<td class=\"termN\">-</td>';
				for(var j=0;j<21;j++)	diastr+= '<td class=\"dia\"><div></div></td>';
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
	yilouData.cur_yilou.splice(9,0,0);
	yilouData.max_yilou.splice(9,0,0);
}

function getpoint(){	//连线，多彩版倒计时最后一行
	$(".n1").before("<tr class=\"notr\"><td colspan=\"11\"></td><td rowspan=\"51\"></td><td colspan=\"11\"></td></tr>");
	drawline(14);
}
function changeEnd(arr,str){
	if(arr.length>20)
		arr.splice(20,1);
	return showEnd(arr,str,0,1);
}
function getthisDiagram(arr, winnum1,winnum2,n){
	var b = new Array(20);
	for (var i = 0; i < b.length; i++) {
		if ((i<3&&i==winnum1[0])||(i<6&&i>2&&i-3==winnum1[1])||(i<9&&i>5&&i-6==winnum1[2])||(i>9&&winnum2.indexOf(i-9)>=0)) {
			b[i] = 0;
		} else {
			if (arr.length > 0) {
				b[i] = arr[arr.length - 1][i] + 1;
			} else {
				b[i] = 1;
			}
		}
	}
	b[9] = maindata[n].sum1;
	b.push(maindata[n].sum2);
	return b;
}