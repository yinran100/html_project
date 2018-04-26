var linecolor = new Array("blueviolet");
var point = new Array(1);
var WIN_NUMBER = 3;
var formStr = new Array("","三不同","二同号","三同号");
var htmlstr = "<td class=\"termN\"></td><td class=\"win\"></td><td class=\"win\"></td><td class=\"win\"></td>";

function initThisModel(){
	trendModel.note = ko.dependentObservable(function () {	//
		return dataUtils.getarr(this.mainnote(), this.page(), max_page, max_rowcount);
	}, trendModel);
	trendModel.diagram = ko.dependentObservable(function () {	//当页
		var arr = [];
		for(var i in this.note()){
			var da = maindata[parseInt(i)+this.page()*max_rowcount];
			var num = this.note()[i].numbers1; 
			arr.push(dataUtils.getTrend(arr,da.sum1,7,0).concat(getCurrenrForm(arr,num,da.form,7)));
		}
		return arr;
	}, trendModel);
	trendModel.maindiagram = ko.dependentObservable(function (){	//今天的期，算最大遗漏使用
		var maindiagram =[];
		maindiagram.push(yilouData.cur_yilou);
		var x = Math.max(0,this.mainnote().length - gameArray.todaynote[datanum].length);
		for (var i in gameArray.todaynote[datanum]){
			var da = maindata[parseInt(i)+x];
			var num = gameArray.todaynote[datanum][i].numbers1; 
			maindiagram.push(dataUtils.getTrend(maindiagram,da.sum1,7,0).concat(getCurrenrForm(maindiagram,num,da.form,7)));
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
				$.each(narr1, function(index, value) {
					diastr += '<td class=\"win\">'+value+'</td>';
				});
				$.each(this.diagram()[i], function(index, value) {
					if (parseInt(value)== 0) {
						if(parseInt(index)<7){
							diastr+= '<td class=\"dia\"><div class=\"one\">'+index+'</div></td>';
						}else if(parseInt(index)<10){
							diastr+= '<td class=\"dia first\"><div class=\"two\">三同号</div></td>';
						}else if(parseInt(index)<11){
							diastr+= '<td class=\"dia second\"><div class=\"two\">三不同</div></td>';
						}else	diastr+= '<td class=\"dia third\"><div class=\"two\">二同号</div></td>';
					}else {
						if(parent.person_setting.showyilou==0)	diastr+= '<td class=\"dia\"><div>'+value+'</div></td>';
						else diastr+= '<td class=\"dia\"><div></div></td>';
					}
				});
			}else if(i==this.note().length){		//倒计时那一行
				diastr = '<td class=\"termN time\"></td><td class=\"state\" colspan="3" ></td>';
				for(var j=0;j<14;j++)	diastr+= '<td class=\"dia\"><div></div></td>';
			}else{
				diastr = '<td class=\"termN\">-</td><td class=\"win\"></td><td class=\"win\"></td><td class=\"win\"></td>';
				for(var j=0;j<14;j++)	diastr+= '<td class=\"dia\"><div></div></td>';
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
function getCurrenrForm(arr,winnum,f,st){
	var start = st?st:0;
	var b = new Array(7);
	var w = [winnum[0],winnum[1],winnum[2]];
	w.sort();
	for (var i = 0; i < b.length; i++) {
		if ((i<3&&f==3&&w[0]==i)||(i==3&&f==1)||(i>3&&f>=2&&w[1]==i-4)) {
			b[i] = 0;
		} else {
			if (arr.length > 0) {
				b[i] = arr[arr.length - 1][i+start] + 1;
			} else {
				b[i] = 1;
			}
		}
	}
	return b;
}
function changeEnd(arr,str){
	return showEnd(arr,str,0,0);
}