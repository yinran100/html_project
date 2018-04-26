var point = new Array(3);//百位
var linecolor = new Array("purple", "chocolate", "dodgerblue");
var WIN_NUMBER = parent.Longdata.WIN_S3;
var hasSum = $('#ifrContent', parent.document).attr("src").indexOf("S3_63")>=0;
var s3color = parent.s3color.slice(1-K_public.MAX_PAGE*max_rowcount);
var yilouData = {
	cur_yilou: parent.yilouarr[select].cur_yilou.split(",").map(Math.abs),
	max_yilou: parent.yilouarr[select].max_yilou.split(",").map(Math.abs)
};
function initThisModel(){
	trendModel.note = ko.dependentObservable(function () {	//
		return dataUtils.getarr(this.mainnote(), this.page(), max_page, max_rowcount);
	}, trendModel);
	trendModel.maindiagram = ko.dependentObservable(function (){	
		var  diagram =[];
		for (var i in this.note()){
			var num = this.note()[i].numbers; 
			diagram.push(getCurrentDiagram(diagram,num));
		}
		return diagram;
	}, trendModel);
	trendModel.diagramHtml = ko.dependentObservable(function () {	//页面的分布二维数组html	
		var diagramHtml = [],diastr ='',day = 0;
		dayline =[];
		for (var i = 0; i < max_rowcount; i++) {
			if(i<this.note().length){
				diastr = '<td class=\"termN\">'+(ALLview.isScross[select]!=1?this.note()[i].term.slice(-3):this.note()[i].term)+'</td>';
				var narr = this.note()[i].numbers;
				var term = this.note()[i].term;
				var cor = s3color[i+this.page()*max_rowcount];
				if((i==0&&term.slice(-3)=="001")||i > 0&&(term.slice(0,4) != this.note()[i-1].term.slice(0,4))&&ALLview.isScross[select]!=1){
					day = 1;
					dayline.push({
						termDate:ALLview.viewtext[select]<2?term.slice(0, 2)+"-"+term.slice(2, 4):term.slice(0, 4),
						targetCount: i+1
					});
				}
				$.each(narr, function(index, value) {
					diastr += '<td class=\"win\" style=\"color:'+K_public.S3_COLOR[cor]+'">'+value+'</td>';
				});
				$.each(this.maindiagram()[i], function(index, value) {
					if (value == 0) {
						if(parseInt(index)<10){
							if(cor==2&&narr.indexOf(parseInt(index))==narr.lastIndexOf(parseInt(index)))
								diastr+= '<td class=\"dia\"><div class=\"one\" style=\"'+csstext+':'+K_public.S3_COLOR[1]+'">'+index+'</div></td>';
							else diastr+= '<td class=\"dia\"><div class=\"one\" style=\"'+csstext+':'+K_public.S3_COLOR[cor]+'">'+index+'</div></td>';
						}else if(parseInt(index)<20){
							diastr+= '<td class=\"dia\"><div class=\"two\" style=\"'+csstext+':'+K_public.S3_COLOR[cor]+'">'+(index-10)+'</div></td>';
						}else if(parseInt(index)<30){
							diastr+= '<td class=\"dia\"><div class=\"three\" style=\"'+csstext+':'+K_public.S3_COLOR[cor]+'">'+(index-20)+'</div></td>';
						}else{
							diastr+= '<td class=\"dia\"><div class=\"four\" style=\"'+csstext+':'+K_public.S3_COLOR[cor]+'">'+(index-30)+'</div></td>';
						}
					} else {
						if(parent.person_setting.showyilou==0)	diastr+= '<td class=\"dia\"><div>'+value+'</div></td>';
							else diastr+= '<td class=\"dia\"><div></div></td>';
					}
				});
				if(hasSum){
					diastr+= '<td class=\"dia\"><div class=\"zero\">'+dataUtils.getspan(narr,10)+'</div></td>';
					diastr+= '<td class=\"dia\"><div class=\"zero\">'+dataUtils.sumValue(narr)+'</div></td>';
				} 
			}else if(i==this.note().length){		//倒计时那一行
				var temp = hasSum?2:0;
				diastr = '<td class=\"termN time\">- - : - -</td><td class=\"state\" colspan="3" >新期销售中</td>';
				for(var j=0;j<40+temp;j++)	diastr+= '<td class=\"dia\"><div></div></td>';
			}else{
				diastr = '<td class=\"termN\">-</td><td class=\"win\">-</td><td class=\"win\">-</td><td class=\"win\">-</td>';
				for(var j=0;j<40+temp;j++)	diastr+= '<td class=\"dia\"><div>-</div></td>';
			}
			diagramHtml.push({
				daycut:day,
				htmlstr:diastr
			});
			day = 0;
		}
	    return diagramHtml;
	}, trendModel);
}
function getpoint(){	//收集连线
	point[0] = [];
	point[1] = [];
	point[2] = [];
	$(".dia").find("div").each(function() {
		if ($(this).is(".two")) {
			point[0].push(this);
		}
		if ($(this).is(".three")) {
			point[1].push(this);
		}
		if ($(this).is(".four")) {
			point[2].push(this);
		}
	});
	drawline(14);
}
function changeEnd(arr,str){
	if(hasSum) return showEnd(arr,str,0,2);
	return showEnd(arr,str,0,0);
}
//本次的中奖分布图
function getCurrentDiagram(arr,winnumber) {
	var a = new Array(Longdata.ALL_S3*4);
	for (var i = 0; i < a.length; i++) {
		if ((i<10&&winnumber.indexOf(i)>=0)||(i>=10&&winnumber[Math.floor(i/10)-1]== i-Math.floor(i/10)*10)) {
			a[i] = 0;
		} else {
			if (arr.length > 0) {
				a[i] = arr[arr.length - 1][i] + 1;
			} else {
				a[i] = 1;
			}
		}
	}
	return a;
}

