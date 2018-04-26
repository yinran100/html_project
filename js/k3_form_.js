var note = []; //记录数组

var diagram = []; //中奖号分布
var maindiagram = [];
var form = []; //形态分布
var mainform = [];
var sum = []; //和值分布
var mainsum = [];
var wintimes = []; //出现总次数一行
var misstimes = []; //当前遗漏
var maxtimes = [];//最大遗漏次数一行
var linecolor = new Array("blueviolet","blueviolet");
var page = K_public.MAX_PAGE-1;
var point=new Array(1);
var flag = 0;//标记是否开启第一次写入网页
var rr =0;//标记是否补回第二格（等待开奖中...）
var formStr = new Array("三同号","三不同号","二同号","二不同号");

var htmlstr = "<td class=\"termN\"></td><td class=\"win\"></td><td class=\"win\"></td><td class=\"win\"></td>";
$(function(){
	var insertText = "";
	for(var i=0;i<27;i++){
	 	if(i<6) htmlstr=htmlstr+"<td class=\"dia\"><div></div></td>";
	 	else if(i<10) htmlstr=htmlstr+"<td class=\"form\"><div></div></td>";
	 	else if(i<26) htmlstr=htmlstr+"<td class=\"total\"><div></div></td>";
		else htmlstr=htmlstr+"<td class=\"kua\"><div></div></td>";
	}
	for (var i = 1; i <= K_public.MAX_ROWCOUNT; i++) {
		insertText += "<tr class=\"n" + i + "\">" + htmlstr + "</tr>";
	}
	$(".h").after(insertText);
	if(lineST)clearTimeout(lineST);
	lineST = setTimeout(function(){parent.loadpage();},50);//添加数据并加载页面
});
function changepage() {
	flag = 0;
	getdata();
	gethtml(); //放入网页
	if(lineST)clearTimeout(lineST);
	lineST = setTimeout(function(){htmlUtils.addline(point,linecolor,15);htmlUtils.putcss();},100);
}
function last(){
	maindiagram = [];
	mainsum = [];
	mainform = [];
	var yilou = parent.yilouarr[select].cur_yilou.split(",").map(Math.abs);
	maindiagram.push(yilou.slice(0,6)); //把当前遗漏放在第一行并转换格式，进行后续计算
	mainform.push(changeYilou(yilou.slice(6,10)));
	mainsum.push(yilou.slice(10,26));
	var x = Math.max(0,parent.mainnote[ALLview.datanum[select]].length - parent.todaynote_k3.length);
	for (var i = 0; i < parent.todaynote_k3.length; i++){
		var num = parent.todaynote_k3[i].numbers;
		maindiagram.push(dataUtils.getDiagram(maindiagram,num,K_public.K3_ALL_NUMBER));
		mainsum.push(dataUtils.getTrend(mainsum, gameArray.maindata[ALLview.datanum[select]][i+x].sum-3,16));
		mainform.push(getCurrenrForm(mainform,gameArray.maindata[ALLview.datanum[select]][i+x].form));
	}
	showEnd();
	htmlUtils.putEnd(wintimes,misstimes,maxtimes,15);//底部统计
	htmlUtils.weichu();
	if(lineST)clearTimeout(lineST);
	lineST = setTimeout(function(){htmlUtils.addline(point,linecolor,14);},2000);//画线，延时防止有偏差
}
function changeYilou(arr){
	return new Array(arr[1],arr[0],arr[3],arr[2]);
}
function getdata(arr){
	note = dataUtils.getarr(parent.mainnote[ALLview.datanum[select]], page);//当页数据
	diagram =[];
	sum = [];
	form = [];	
	for(var i = 0; i<note.length; i++){
		diagram.push(dataUtils.getDiagram(diagram, note[i].numbers,K_public.K3_ALL_NUMBER));
		form.push(getCurrenrForm(form,gameArray.maindata[ALLview.datanum[select]][i+page*K_public.MAX_ROWCOUNT].form));
		sum.push(dataUtils.getTrend(sum, gameArray.maindata[ALLview.datanum[select]][i+page*K_public.MAX_ROWCOUNT].sum-3,16));
	}
}

//本次的形态走势
function getCurrenrForm(arr,theform) {
	var b = new Array(4);
	try{
		for (var i = 0; i < b.length; i++) {
			if ((i==0&&theform==3)||(i==1&&theform==1)||(i==2&&theform==2)||(i==3&&theform!=3)) {
				b[i] = 0;
			} else {
				if (arr.length > 0) {
					b[i] = arr[arr.length - 1][i] + 1;
				} else {
					b[i] = 1;
				}
			}	
	   }
	 }catch(error){}
	return b;
}

//显示底部统计
function showEnd() {
	wintimes = []; //出现总次数一行
	misstimes = maindiagram[maindiagram.length-1].concat(mainform[mainform.length-1],mainsum[mainsum.length-1]); //当前遗漏
	maxtimes = [];//最大遗漏次数一行
	var yilou = parent.yilouarr[select].max_yilou.split(",").map(Math.abs);
	for (var i = 0; i < maindiagram[0].length+mainform[0].length+mainsum[0].length; i++) {
		if(i < maindiagram[0].length){
			wintimes.push(dataUtils.checkWin2(maindiagram,i,parent.todaynote_k3.length));
			maxtimes.push(dataUtils.checkMiss(maindiagram,i,yilou.slice(0,6)));
		}else if(i < maindiagram[0].length+mainform[0].length){
			wintimes.push(dataUtils.checkWin2(mainform,i-maindiagram[0].length,parent.todaynote_k3.length));
			maxtimes.push(dataUtils.checkMiss(mainform,i-maindiagram[0].length,changeYilou(yilou.slice(6,10))));
		}else{
			wintimes.push(dataUtils.checkWin2(mainsum,i-maindiagram[0].length-mainform[0].length,parent.todaynote_k3.length));
			maxtimes.push(dataUtils.checkMiss(mainsum,i-maindiagram[0].length-mainform[0].length,yilou.slice(10,26)));
		}
	}
}

function gethtml() {
	htmlUtils.retract(K_public.K3_WIN_NUMBER,parent.mainnote[ALLview.datanum[select]].length%K_public.MAX_ROWCOUNT+1);
	for (var i = 0; i < K_public.MAX_ROWCOUNT; i++) {
		var $tr = $(".table").find(".n" + (i+1));
		if(i<note.length){
			var cor = gameArray.maindata[ALLview.datanum[select]][i+page*K_public.MAX_ROWCOUNT].form;
			htmlUtils.addDayline(note,i);
			$tr.find(".termN").text(note[i].term.slice(-3)).removeClass("bb"); //期号
			if(note[i].numbers!=[]){
				for(var j=0;j<K_public.K3_WIN_NUMBER;j++)
					$tr.find(".win").eq(j).text(note[i].numbers[j]).removeClass("yy").css("color",K_public.COLOR[cor]); //中奖号码
			}
			for (var j = 0; j < diagram[i].length; j++) { //分布图
				if (diagram[i][j] == 0) {
					$tr.find(".dia").eq(j).find("div").text(j + 1).addClass("zero");
					if(cor==2&&dataUtils.match(j + 1, note[i].numbers)==1)
						$tr.find(".dia").eq(j).find("div").css(csstext, K_public.COLOR[1]);
					else $tr.find(".dia").eq(j).find("div").css(csstext, K_public.COLOR[cor]);
				} else {
					$tr.find(".dia").eq(j).find("div").text(parent.person_setting.showyilou==0?diagram[i][j]:"").removeClass("zero").css(csstext,csstext=="color"?"#A9A9A9":"transparent"); 	
				}
			}
			for(var j = 0; j < form[i].length; j++) {//形态走势
				if (form[i][j] == 0)
					$tr.find(".form").eq(j).find("div").text(formStr[j]).addClass("zero").addClass("zero").css("color", K_public.COLOR[cor]);
				else	$tr.find(".form").eq(j).find("div").text(parent.person_setting.showyilou==0?form[i][j]:"").removeClass("zero").css("color","#A9A9A9");
			}
			for (var j = 0; j < sum[i].length; j++) { //和值走势图
				if (sum[i][j] == 0) 
					$tr.find(".total").eq(j).find("div").text(j + 3).addClass("zero").css(csstext, K_public.COLOR[cor]);
				else{
					$tr.find(".total").eq(j).find("div").text(parent.person_setting.showyilou==0?sum[i][j]:"").removeClass("zero").css(csstext,csstext=="color"?"#A9A9A9":"transparent");
				}
			}
			$tr.find(".kua").find("div").text(gameArray.maindata[ALLview.datanum[select]][i+page*K_public.MAX_ROWCOUNT].span).css(csstext,K_public.COLOR[cor]);
		}else if(i>note.length){
			$tr.find(".termN").text("-").removeClass("bb"); //期号
			$tr.find(".win").text("-").removeClass("yy");
			$tr.find(".dia,.total,.form,.kua").find("div").text(parent.person_setting.showyilou==0?"-":"").removeClass("zero").css("color", "#A9A9A9");
		}
	}
	point[0] = [];
		$(".total").find("div").each(function() {
			if ($(this).is(".zero")) {
				point[0].push(this);
			}
		});
}
