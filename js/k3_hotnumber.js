var linecolor = new Array();
var point = new Array(0);
var SBTARR = ["123","124","125","126","134","135","136","145","146","156","234","235","236","245","246","256","345","346","356","456"];
var htmlstr = "<td class=\"termN\"></td><td class=\"win\"></td><td class=\"win\"></td><td class=\"win\"></td>";
var WIN_NUMBER = K_public.K3_WIN_NUMBER;
var Max_yilou = yilouData.max_yilou.concat();
function initThisModel(){
	trendModel.note = ko.dependentObservable(function () {	//热号是最后一页的
		return this.mainnote().slice(1-max_rowcount);
	}, trendModel);
	trendModel.hot4arr = ko.dependentObservable(function () {	//
		var hot4 = gethot4(this.note()).sort();
		$(".hot th").eq(1).text(hot4.join(", "));
		return getHot4arr(hot4);
	}, trendModel);
	trendModel.totalcur = ko.dependentObservable(function () {	//
		var count =[],totalcur=[],max = [];
		for(var i=0;i<this.hot4arr().length;i++){
			$(".h .d3").eq(i).text(this.hot4arr()[i]);
			if(i<4)	count.push(SBTARR.indexOf(this.hot4arr()[i]));
			else	count.push(20+parseInt(this.hot4arr()[i].charAt(0))-1);
		}
		for(var i in count){
			totalcur.push(yilouData.cur_yilou.slice(6,32)[count[i]]);
			max.push(Max_yilou.slice(6,32)[count[i]]);
		}
		yilouData.max_yilou = yilouData.max_yilou.slice(0,7).concat(max);
		return totalcur;
	}, trendModel);
	trendModel.diagram = ko.dependentObservable(function () {	//当页
		var arr = [];//console.log(gameArray.maindata[datanum][48-1+this.page()*K_public.MAX_ROWCOUNT]);
		for(var i in this.note()){
			var sum = maindata[maindata.length-max_rowcount+1+parseInt(i)].sum;
			arr.push(dataUtils.getDiagram(arr,this.note()[i].numbers,6,0).concat(getCurrenrTotal(arr,this.note()[i].numbers,sum,6)));
		}
		return arr;
	}, trendModel);
	trendModel.maindiagram = ko.dependentObservable(function (){	//今天的期，算最大遗漏使用
		var maindiagram =[];
		maindiagram.push(yilouData.cur_yilou.slice(0,7).concat(this.totalcur()));
		var x = Math.max(0,this.mainnote().length - gameArray.todaynote[datanum].length);
		for (var i in gameArray.todaynote[datanum]){
			var sum = maindata[parseInt(i)+x].sum;
			maindiagram.push(dataUtils.getDiagram(maindiagram,gameArray.todaynote[datanum][i].numbers,6,0).concat(getCurrenrTotal(maindiagram,gameArray.todaynote[datanum][i].numbers,sum,6)));
		}
		return maindiagram;
	}, trendModel);
	trendModel.diagramHtml = ko.dependentObservable(function () {	//页面的分布二维数组html	
		var diagramHtml = [], diastr ='',data = [];
		dayline =[];
		for (var i = 0; i < max_rowcount; i++) {
			if(i<this.note().length){
				data = deepCopy(maindata[maindata.length-max_rowcount+1+parseInt(i)]);
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
				var hot = this.hot4arr();
				$.each(this.diagram()[i], function(index, value) {
					if (parseInt(value)== 0) {
						if(parseInt(index)<6){
							if(data.form==2&&narr.indexOf(parseInt(index)+1)==narr.lastIndexOf(parseInt(index)+1))
								diastr+= '<td class=\"dia\"><div class=\"one\" style=\"'+csstext+':'+K_public.COLOR[1]+'">'+(index+1)+'</div></td>';
							else diastr+= '<td class=\"dia\"><div class=\"one\" style=\"'+csstext+':'+K_public.COLOR[data.form]+'">'+(index+1)+'</div></td>';
						}else {
							diastr+= '<td class=\"dia\"><div class=\"three\" style=\"'+csstext+':'+K_public.COLOR[data.form]+'">'+(hot[index-7])+'</div></td>';
						}
					} else {
						if(parseInt(index)==6) diastr+= '<td class=\"dia\"><div class=\"two\" style=\"'+csstext+':'+K_public.COLOR[data.form]+'">'+value+'</div></td>';
						else diastr+= '<td class=\"dia\"><div>'+(parent.person_setting.showyilou==0?value:"")+'</div></td>';
					}
				});
			}else if(i==this.note().length){		//倒计时那一行
				data.day = 0;
				diastr = '<td class=\"termN time\"></td><td class=\"state\" colspan="3" ></td>';
				for(var j=0;j<15;j++)	diastr+= '<td class=\"dia\"><div></div></td>';
			}else{
				data.day = 0;
				diastr = '<td class=\"termN\">-</td><td class=\"win\">-</td><td class=\"win\">-</td><td class=\"win\">-</td>';
				for(var j=0;j<15;j++)	diastr+= '<td class=\"dia\"><div></div></td>';
			}
			diagramHtml.push({
				daycut:data.day,
				htmlstr:diastr
			});
		}
	    return diagramHtml;
	}, trendModel);
}
function gethot4(note){//计算出最热的四个号
	var x=[];
	var d=[];
	for(var i=1;i<=6;i++){
		if(i>3){
			d.push([dataUtils.checkNumWin(note,i-1),i]);
		}else {
			x.push([dataUtils.checkNumWin(note,i-1),i]);
		}
	}
	d.sort(function(x, y){
  		return y[0]-x[0];
	});
	x.sort(function(x, y){
  		return y[0]-x[0];
	});
	return [x[0][1],x[1][1],d[0][1],d[1][1]];	
}
function getHot4arr(arr){
	arr = [arr[0]+"", arr[1]+"", arr[2]+"", arr[3]+""];
	return [arr[0]+arr[1]+arr[2], arr[0]+arr[1]+arr[3], arr[0]+arr[2]+arr[3], arr[1]+arr[2]+arr[3],arr[0]+arr[0]+"*",arr[1]+arr[1]+"*",arr[2]+arr[2]+"*",arr[3]+arr[3]+"*"];
}
function getpoint(){	//收集连线
	drawline(14);
}
function changeEnd(arr,str){
	return showEnd(arr,str,0,0);
}
//本次的和值和三不同二同
function getCurrenrTotal(arr, winnumber,sum,start) {
	var start =  start?start:0;
	var b = new Array(9);
	var d = [winnumber[0],winnumber[1],winnumber[2]].sort();
	var j =  d[0] * 100 + d[1] * 10 + d[2]+"";
	b[0]=sum;
	for (var i = 1; i < b.length; i++) {
		if ((i < 5 && j == trendModel.hot4arr()[i-1]) || (i >= 5 &&( j.substring(0,2)==trendModel.hot4arr()[i-1].substring(0,2)|| j.substring(1)==trendModel.hot4arr()[i-1].substring(0,2)))) {
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