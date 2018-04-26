var point = new Array(1);//百位
var linecolor = new Array("blueviolet");
var WIN_NUMBER = K_public.K10_WIN_NUMBER;
function initThisModel(){
	yilouData.cur_yilou.splice(23,1);
	yilouData.max_yilou.splice(23,1);
	trendModel.note = ko.dependentObservable(function () {	//
		return dataUtils.getarr(this.mainnote(), this.page(), max_page, max_rowcount);
	}, trendModel);
	trendModel.diagram = ko.dependentObservable(function () {	//当页
		var arr = [];//console.log(gameArray.maindata[datanum][48-1+this.page()*K_public.MAX_ROWCOUNT]);
		for(var i in this.note()){
			arr.push(dataUtils.getTrend(arr,this.note()[i].numbers[0]-1,20,0).concat(getHui(arr,parseInt(i)+this.page()*max_rowcount,20)
						,getLu(arr,this.note()[i].numbers[0],parseInt(i)+this.page()*max_rowcount,23)));
		}
		return arr;
	}, trendModel);
	trendModel.maindiagram = ko.dependentObservable(function (){	//今天的期，算最大遗漏使用
		var maindiagram =[];
		maindiagram.push(yilouData.cur_yilou);
		var x = Math.max(0,this.mainnote().length - gameArray.todaynote[datanum].length);
		for (var i in gameArray.todaynote[datanum]){
			maindiagram.push(dataUtils.getTrend(maindiagram,gameArray.todaynote[datanum][i].numbers[0]-1,20,0).concat(getHui(maindiagram,parseInt(i)+x,20)
						,getLu(maindiagram,gameArray.todaynote[datanum][i].numbers[0],parseInt(i)+x,23)));
		}
		return maindiagram;
	}, trendModel);
	trendModel.diagramHtml = ko.dependentObservable(function () {	//页面的分布二维数组html	
		var diagramHtml = [],data=[],diastr ='';
		dayline =[];
		for (var i = 0; i < max_rowcount; i++){
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
					diastr += '<td class=\"win\">'+(value>9?value:'0'+value)+'</td>';
				});
				$.each(this.diagram()[i], function(index, value) {
					if (parseInt(value) <= 0) {		//********
						if(parseInt(index)<20){
							diastr+= '<td class=\"dia\"><div class=\"zero\">'+(index+1>9?(index+1):'0'+(index+1))+'</div></td>';
						}else if(parseInt(index)<23){
							diastr+= '<td class=\"dia first colortd\"><div class=\"one\">'+(0-value)+'</div></td>';
						}else if(parseInt(index)<26){
							diastr+= '<td class=\"dia second colortd\"><div class=\"two\">'+(index-23)+'</div></td>';
						}else if(parseInt(index)<28)
							 diastr+= '<td class=\"dia first colortd\"><div class=\"three\">'+(index-26==0?"大":"小")+'</div></td>';
						else if(parseInt(index)<30)
							 diastr+= '<td class=\"dia second colortd\"><div class=\"four\">'+(index-28==0?"单":"双")+'</div></td>';
						else diastr+= '<td class=\"dia first colortd\"><div class=\"five\">'+(index-30==0?"质":"合")+'</div></td>';
					} else {
						if(parent.person_setting.showyilou==0)	diastr+= '<td class=\"dia\"><div>'+value+'</div></td>';
						else diastr+= '<td class=\"dia\"><div></div></td>';
					}
				});
			}else if(i==this.note().length){		//倒计时那一行
				data.day = 0;
				diastr = '<td class=\"termN time\"></td><td class=\"state\" colspan="8" ></td>';
				for(var j=0;j<32;j++)	diastr+= '<td class=\"dia\"><div></div></td>';
			}else{
				data.day = 0;
				diastr = '<td class=\"termN\">-</td><td class=\"win\">-</td><td class=\"win\">-</td><td class=\"win\">-</td>'
						+'<td class=\"win\">-</td><td class=\"win\">-</td><td class=\"win\">-</td><td class=\"win\">-</td><td class=\"win\">-</td>';
				for(var j=0;j<32;j++)	diastr+= '<td class=\"dia\"><div></div></td>';
			}
			diagramHtml.push({
				daycut:data.day,
				htmlstr:diastr
			});
		}
	    return diagramHtml;
	}, trendModel);
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
function getHui(arr, n, st){//回摆：正向，重号，反向
	var start = st?st:0;
	var a = new Array(3);
	for (var i = 0; i < 3; i++) {
		if(parent.mainhui[n][i]<0){
			a[i]= parent.mainhui[n][i];
		} else if(parent.mainhui[n][i]>0){
			if(arr.length==0){
				a[i] = 1;
			}else{
				a[i] = Math.max(arr[arr.length - 1][i+start] + 1,1);
			}
		}
	}
	return a;
}

function getLu(arr, winnum,n, st){//012路,大小，单双，质合
	var start = st?st:0;
	var a = new Array(9);
	var zhi =[1,2,3,5,7,11,13,17,19];
	var dx =[1,0,0,1,0,1];
	if(winnum>10){dx[0]=0;dx[1]=1} 
	if(winnum%2==0){dx[2]=1;dx[3]=0;} 
	if(zhi.indexOf(winnum)<0){dx[4]=1;dx[5]=0;}
	for (var i = 0; i < a.length; i++) {
		if((i<3&&maindata[n].lu==i)||(i>=3&&dx[i-3]==0)){
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