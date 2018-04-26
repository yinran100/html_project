var point = new Array(3);//百位
var linecolor = new Array("green", "purple", "chocolate");
var WIN_NUMBER = parent.Longdata.WIN_I515;
var sqbarr = [];//每一期的三区比
function initThisModel(){
	trendModel.note = ko.dependentObservable(function () {	//
		return dataUtils.getarr(this.mainnote(), this.page(), max_page, max_rowcount);
	}, trendModel);
	trendModel.maindiagram = ko.dependentObservable(function (){	
		var  arr =[];	sqbarr=[];
		for (var i in this.note()){
			var num = this.note()[i].numbers; 
			var con = getcon(num);
			//arr.push(dataUtils.getDiagram(arr,num));
			arr.push(dataUtils.getDiagram(arr,this.note()[i].numbers,15,0).concat(dataUtils.getTrend(arr,con[0],6,15),dataUtils.getTrend(arr,con[1],6,21),dataUtils.getTrend(arr,con[2],6,27)));
		}
		return arr;
	}, trendModel);
	trendModel.diagramHtml = ko.dependentObservable(function () {	//页面的分布二维数组html	
		var diagramHtml = [],diastr ='',day = 0;
		dayline =[];
		for (var i = 0; i < max_rowcount; i++) {
			if(i<this.note().length){
				diastr = '<td class=\"termN\">'+(ALLview.isScross[select]!=1?this.note()[i].term.slice(-3):this.note()[i].term)+'</td>';
				var narr = this.note()[i].numbers;
				var term = this.note()[i].term;
				var cor = parent.s3color[i+this.page()*max_rowcount];
				if((i==0&&term.slice(-3)=="001")||i > 0&&(term.slice(0,4) != this.note()[i-1].term.slice(0,4))&&ALLview.isScross[select]!=1){
					day = 1;
					dayline.push({
						termDate:ALLview.viewtext[select]<2?term.slice(0, 2)+"-"+term.slice(2, 4):term.slice(0, 4),
						targetCount: i+1
					});
				}
				$.each(narr, function(index, value){
					diastr += '<td class=\"win\">'+(value>9?value:"0"+value)+'</td>';
				});
				$.each(this.maindiagram()[i], function(index, value){
					if(value == 0){
						if(parseInt(index)<15){
							diastr+= '<td class=\"dia\"><div class=\"one\">'+(index+1>9?(index+1):"0"+(index+1))+'</div></td>';
						}else if(parseInt(index)<21)
							diastr+= '<td class=\"dia\"><div class=\"two\">'+(index-15)+'</div></td>';
						else if(parseInt(index)<27)
							diastr+= '<td class=\"dia\"><div class=\"three\">'+(index-21)+'</div></td>';
						else 
							diastr+= '<td class=\"dia\"><div class=\"four\">'+(index-27)+'</div></td>';
					}else{
						if(parent.person_setting.showyilou==0)	diastr+= '<td class=\"dia\"><div>'+value+'</div></td>';
							else diastr+= '<td class=\"dia\"><div></div></td>';
					}
				});
				diastr+= '<td class=\"dia\"><div >'+sqbarr[i]+'</div></td>';
			}else if(i==this.note().length){		//倒计时那一行
				day = 0;
				diastr = '<td class=\"termN time\">- - : - -</td><td class=\"state\" colspan="5" >新期销售中</td>';
				for(var j=0;j<34;j++)	diastr+= '<td class=\"dia\"><div></div></td>';
			}else{
				day = 0;
				diastr = '<td class=\"termN\">-</td><td class=\"win\">-</td><td class=\"win\">-</td><td class=\"win\">-</td><td class=\"win\">-</td><td class=\"win\">-</td>';
				for(var j=0;j<34;j++)	diastr+= '<td class=\"dia\"><div>-</div></td>';
			}
			diagramHtml.push({
				daycut:day,
				htmlstr:diastr
			});
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
	return showEnd(arr,str,0,1);
}
function getcon(winnum){//计算区个数分布
	var arr = [0,0,0];
	var arr2 = new Array(18);
	for(var i = 0;i<winnum.length;i++){
		if(winnum[i]<=5)
			arr[0]=arr[0]+1;
		else if(winnum[i]<=10)
			arr[1]=arr[1]+1;
		else
			arr[2]=arr[2]+1;
	}
	sqbarr.push(arr[0]+":"+arr[1]+":"+arr[2]);
	return arr;
}