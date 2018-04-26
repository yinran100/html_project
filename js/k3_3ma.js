var linecolor = new Array("blueviolet","blueviolet");
var point = new Array(2);
var WIN_NUMBER = K_public.K3_WIN_NUMBER;
var lastlist = new Array(111, 222, 333, 444, 555, 666, "三同号通选",123,234,345,456,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18);
function initThisModel(){
	changeYilou();	//遗漏变形成本图需要的排列
	trendModel.note = ko.dependentObservable(function () {	//
		return dataUtils.getarr(this.mainnote(), this.page(), max_page, max_rowcount);
	}, trendModel);
	trendModel.diagram = ko.dependentObservable(function () {	//当页
		var arr = [];//console.log(maindata[48-1+this.page()*max_rowcount]);
		for(var i in this.note()){
			var sum = maindata[parseInt(i)+this.page()*max_rowcount].sum-3;
			var span = maindata[parseInt(i)+this.page()*max_rowcount].span;
			arr.push(dataUtils.getDiagram(arr,this.note()[i].numbers,6,0).concat(dataUtils.getTrend(arr,sum,16,6),dataUtils.getTrend(arr,span,6,22)));
		}
		return arr;
	}, trendModel);
	trendModel.maindiagram = ko.dependentObservable(function (){	//今天的期，算最大遗漏使用
		var maindiagram =[];
		//var todaynote = dataUtils.getbefore(this.note(),0);
		maindiagram.push(yilouData.cur_yilou.slice(0,28));
		var x = Math.max(0,this.mainnote().length - gameArray.todaynote[datanum].length);
		for (var i in gameArray.todaynote[datanum]){
			var sum = maindata[parseInt(i)+x].sum-3;
			var span = maindata[parseInt(i)+x].span;
			maindiagram.push(dataUtils.getDiagram(maindiagram,gameArray.todaynote[datanum][i].numbers,6,0).concat(dataUtils.getTrend(maindiagram,sum,16,6),dataUtils.getTrend(maindiagram,span,6,22)));
		}
		return maindiagram;
	}, trendModel);
	trendModel.lastdiagram = ko.dependentObservable(function () {	//
		var lastdiagram = [];
		lastdiagram.push(yilouData.cur_yilou.slice(-11));	//三同号+三同号通选+三连号 11个遗漏
		var x = Math.max(0,this.mainnote().length - gameArray.todaynote[datanum].length);
		for(var i=0;i<gameArray.todaynote[datanum].length;i++){
			lastdiagram.push(getthisDiagram(lastdiagram, gameArray.todaynote[datanum][i].numbers,maindata[i+x].form));
		}
		return lastdiagram;
	}, trendModel);
	trendModel.currentYilou = ko.dependentObservable(function () {	//
		return this.lastdiagram()[this.lastdiagram().length-1].concat(this.maindiagram()[this.maindiagram().length-1].slice(6,22));
	}, trendModel);
	trendModel.historyYilou = ko.dependentObservable(function () {	//
		var arr=[],arr1=[];
		for(var i = 0; i < this.lastdiagram()[0].length; i++) 
				arr.push(dataUtils.checkMiss(this.lastdiagram(),i,yilouData.max_yilou.slice(-11)));
		for(var i = 0; i < this.maindiagram()[0].length; i++) 
				arr1.push(dataUtils.checkMiss(this.maindiagram(),i,yilouData.max_yilou));
		return arr.concat(arr1.slice(6,22));
	}, trendModel);
	trendModel.diagramHtml = ko.dependentObservable(function () {	//页面的分布二维数组html	
		var diagramHtml = [],data=[],diastr ='';
		dayline =[];
		for (var i = 0; i <max_rowcount; i++) {
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
						}else if(parseInt(index)<22){
							diastr+= '<td class=\"dia\"><div class=\"two\" style=\"'+csstext+':'+K_public.COLOR[data.form]+'">'+(index-3)+'</div></td>';
						}else{
							diastr+= '<td class=\"dia\"><div class=\"kua\" style=\"'+csstext+':'+K_public.COLOR[data.form]+'">'+(index-22)+'</div></td>';
						}
					} else {
						if(parent.person_setting.showyilou==0)	diastr+= '<td class=\"dia\"><div>'+value+'</div></td>';
						else diastr+= '<td class=\"dia\"><div></div></td>';
					}
				});
			}else if(i==this.note().length){		//倒计时那一行
				data.day = 0;
				diastr = '<td class=\"termN time\"></td><td class=\"state\" colspan="3" ></td>';
				for(var j=0;j<28;j++)	diastr+= '<td class=\"dia\"><div></div></td>';
			}else{
				data.day = 0;
				diastr = '<td class=\"termN\">-</td><td class=\"win\">-</td><td class=\"win\">-</td><td class=\"win\">-</td>';
				for(var j=0;j<28;j++)	diastr+= '<td class=\"dia\"><div></div></td>';
			}
			if(i<lastlist.length){
				if(i==0)	diastr+='<td class=\"head list\" rowspan="7">三同号</td>';
				else if(i==7)	diastr+='<td class=\"head list\" rowspan="4">三连号</td>';
				else if(i==11)	diastr+='<td class=\"head list\" rowspan="16">和值</td>';
				diastr+='<td class=\"list'+(i==6||i==10||i==26?' bord':'')+(i==6?' hz':'')+'\">'+lastlist[i]+'</td>';		//遗漏号码
				diastr+='<td class=\"list'+(i==6||i==10||i==26?' bord':'')+'\">'+this.historyYilou()[i]+'</td>';		//历史遗漏
				diastr+='<td class=\"list'+(i==6||i==10||i==26?' bord':'')+'\">'+this.currentYilou()[i]+'</td>';		//当前遗漏
			}else if(i==lastlist.length) diastr+='<td class=\"list head\" rowspan=\"3\" colspan=\"4\"></td>';
			diagramHtml.push({
				daycut:data.day,
				htmlstr:diastr
			});
			
		}
	    return diagramHtml;
	}, trendModel);
}

function getpoint(){	//连线，多彩版倒计时最后一行
	point[0] = [];
	point[1] = [];
	$(".dia").find("div").each(function() {
		if ($(this).is(".two")) {
			point[0].push(this);
		}
		if ($(this).is(".kua")) {
			point[1].push(this);
		}
	});
	drawline(14);
}
function changeEnd(arr,str){
	return showEnd(arr,str,0,4);
}
function changeYilou(){//yilouData.max_yilou
	var ar1	= yilouData.cur_yilou.slice(0,36);
	var ar2 = yilouData.max_yilou.slice(0,36);
	ar1.push(yilouData.cur_yilou[45]);		//添加三连号
	ar1.push(yilouData.cur_yilou[51]);
	ar1.push(yilouData.cur_yilou[54]);
	ar2.push(yilouData.max_yilou[45]);		//添加三连号
	ar2.push(yilouData.max_yilou[51]);
	ar2.push(yilouData.max_yilou[54]);
	yilouData.cur_yilou = ar1;
	yilouData.max_yilou = ar2;
}
function getthisDiagram(arr,num,form){
	var a= new Array(11);
	var result = getResult(num);
	for(var i=0;i<a.length;i++){
		if((i!=6&&result==lastlist[i])||(i==6&&form==3))
			a[i]=0;
		else {
			if (arr.length > 0) {
				a[i] = arr[arr.length - 1][i] + 1;
			} else {
				a[i] = 1;
			}
		}
	}
	return a;
}
//计算号码的排列
function getResult(a){
	var o = new Array(a[0],a[1],a[2]);
	o.sort();
    var r = o[0]*100+o[1]*10+o[2];
	return r;
}