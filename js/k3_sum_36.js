var point = new Array(1);
var linecolor = new Array("blueviolet");
var WIN_NUMBER = K_public.K3_WIN_NUMBER;
function initThisModel(){
	trendModel.note = ko.dependentObservable(function () {	//
		return dataUtils.getarr(this.mainnote(), this.page(), max_page, max_rowcount);
	}, trendModel);
	trendModel.diagram = ko.dependentObservable(function () {	//当页
		var arr = [];//console.log(gameArray.maindata[datanum][48-1+this.page()*K_public.MAX_ROWCOUNT]);
		for(var i in this.note()){
			arr.push(getCurrenrSum(arr,this.note()[i].numbers,parseInt(i)+this.page()*max_rowcount));
		}
		return arr;
	}, trendModel);
	trendModel.maindiagram = ko.dependentObservable(function () {	//今天的期，算最大遗漏使用
		var maindiagram =[];
		//var todaynote = dataUtils.getbefore(this.note(),0);
		maindiagram.push(yilouData.cur_yilou);
		var x = Math.max(0,this.mainnote().length - gameArray.todaynote[datanum].length);
		for (var i in gameArray.todaynote[datanum]){
			maindiagram.push(getCurrenrSum(maindiagram,gameArray.todaynote[datanum][i].numbers,parseInt(i)+x));
		}
		return maindiagram;
	}, trendModel);
	trendModel.diagramHtml = ko.dependentObservable(function () {	//页面的分布二维数组html	
		var diagramHtml = [], diastr ='',data = [];
		dayline =[];
		for (var i = 0; i < max_rowcount; i++) {
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
						if(parseInt(index)<16){
							diastr+= '<td class=\"dia\"><div class=\"two\" style=\"'+csstext+':'+K_public.COLOR[data.form]+'">'+(index+3)+'</div></td>';
						}else if(parseInt(index)<18){
							diastr+= '<td class=\"dia\"><div class=\"jo\" style=\"'+csstext+':'+K_public.COLOR[data.form]+'">'+(index - 16==0?"奇":"偶")+'</div></td>';
						}else if(parseInt(index)<21){
							if(parseInt(index)==18)	diastr+= '<td class=\"dia dzx\"><div class=\"jo\" style=\"'+csstext+':'+K_public.COLOR[data.form]+'">大</div></td>';
							else diastr+= '<td class=\"dia dzx\"><div class=\"jo\" style=\"'+csstext+':'+K_public.COLOR[data.form]+'">'+(index - 19==0?"小":"中")+'</div></td>';
						}else if(parseInt(index)<24){
							diastr+= '<td class=\"dia lu\"><div class=\"four\" style=\"'+csstext+':'+K_public.COLOR[data.form]+'">'+(index - 21)+'</div></td>';
						}else{
							diastr+= '<td class=\"dia\"><div class=\"jo\" style=\"'+csstext+':'+K_public.COLOR[data.form]+'">'+(index - 24==0?"奇":"偶")+'</div></td>';
						}
					} else {
						diastr+= '<td class=\"dia\"><div>'+(parent.person_setting.showyilou==0?value:"")+'</div></td>';
					}
				});
			}else if(i==this.note().length){		//倒计时那一行
				data.day = 0;
				diastr = '<td class=\"termN time\"></td><td class=\"state\" colspan="3" ></td>';
				for(var j=0;j<26;j++)	diastr+= '<td class=\"dia\"><div></div></td>';
			}else{
				data.day = 0;
				diastr = '<td class=\"termN\">-</td><td class=\"win\">-</td><td class=\"win\">-</td><td class=\"win\">-</td>';
				for(var j=0;j<26;j++)	diastr+= '<td class=\"dia\"><div>-</div></td>';
			}
			diagramHtml.push({
				daycut:data.day,
				htmlstr:diastr
			});
		}
	    return diagramHtml;
	}, trendModel);
}
function getpoint(){	
	point[0] = [];
	$(".dia").find("div").each(function() {
		if ($(this).is(".two")) {
			point[0].push(this);
		}
	});
	drawline(14);
}
function changeEnd(arr,str){
	return showEnd(arr,str,0,0);
}
//本次的和值和和尾等等
function getCurrenrSum(arr,winnumber,n) {
	var b = new Array(26);
	var s =maindata[n].sum;
	var tail = s%10; //和尾
	var ds=0; 
	if(s>7){
		if(s<14)ds = 1;
		else ds = 2;
	}
	var d = s%3;	//求除3余数
	var k = maindata[n].span;
	for (var i = 0; i < b.length; i++) {
		if ((i<16&&i == s-3)||(i>=16&&i<18&&s%2!=i-16)||(i>=18&&i<21&&i-18==ds)||(i>=21&&i<24&&i == d+21)||(i>=24&&i-24 != k%2)) {
			b[i] = 0;
		} else {
			if (arr.length > 0) {
				b[i] = arr[arr.length - 1][i] + 1;
			} else {
				b[i] = 1;
			}
		}
	}
	return b;
}