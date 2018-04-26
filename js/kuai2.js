var note = []; //每页记录数组
var dia = []; //中奖号分布
//var fu = [];//福禄寿喜
var wei = [];//东南西北中
var maindia = [];
var mainfu = [];
var	mainwei = [];
var fuarr = new Array("福","禄","寿","禧");
var searr = new Array("红","橙","黄","绿","青","蓝","紫","乐","运","彩");
var weiarr = new Array("东","西","南","北","中");
var property =[];
var wintimes = []; //出现总次数一行
var misstimes = []; //最大遗漏次数一行
var misstimes = [];
var page = K_public.MAX_PAGE - 1;
var linecolor = new Array("blueviolet","blueviolet","blueviolet");//new Array("#EE984C","#EE984C","#EE984C");
var point = new Array(1);
var cvs = document.getElementById("line").getContext("2d");
var flag = 0; //标记是否开启第一次写入网页
var rr = 0; //标记是否补回第二格（等待开奖中...）

var htmlstr = "<td class=\"termN\"></td><td class=\"win\"></td>";
$(function(){
	var insertText = "";
	for(var i=0;i<26;i++){
	 	if(i<21) htmlstr=htmlstr+"<td class=\"dia\"><div></div></td>";
	 	else htmlstr=htmlstr+"<td class=\"lu\"><div></div></td>";
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
	lineST = setTimeout(function(){htmlUtils.addline(point,linecolor,15);htmlUtils.putcss();},200);
}
function last(){
	maindia = [];
//	mainfu = [];
//	mainwei = [];
	maindia.push(parent.yilouarr[select].cur_yilou.split(",").slice(0,21).map(Math.abs)); //把当前遗漏放在第一行并转换格式，进行后续计算
//	mainfu.push(parent.yilouarr[select].cur_yilou.split(",").slice(21,25).map(Math.abs));
//	mainwei.push(parent.yilouarr[select].cur_yilou.split(",").slice(25,29).map(Math.abs));
	for (var i = 0; i < parent.todaynote_k2.length; i++){
		var num = parent.todaynote_k2[i].numbers;
		maindia.push(getthisDiagram(maindia, num));
//		mainwei.push(getWei(mainwei,num,4));//东南西北中
	}
	showEnd();
	htmlUtils.putEnd(wintimes,maxtimes,misstimes,14);//底部统计
	if(lineST)clearTimeout(lineST);
	lineST = setTimeout(function(){htmlUtils.addline(point,linecolor,14);},2000);//画线，延时防止有偏差
}
function getdata() {
	note = dataUtils.getarr(parent.mainnote[ALLview.datanum[select]], page);//当页数据
	dia = [];
//	fu = [];
//	wei = [];
	property=[];
	for (var i = 0; i < note.length; i++) {
		dia.push(getthisDiagram(dia, note[i].numbers));
//		fu.push(getWei(fu,note[i].numbers,5));//福禄寿喜
//		wei.push(getWei(wei,note[i].numbers,4));//东南西北中
		property.push(getProperty(note[i].numbers));
	}
}
//显示底部统计
function showEnd() {
	wintimes = []; //本页最大出现次数
	misstimes = []; //最大遗漏
	maxtimes = maindia[maindia.length-1];//当前
	for (var i = 0; i < maindia[0].length; i++) {
			wintimes.push(dataUtils.checkWin2(maindia,i,parent.todaynote_k2.length));
			misstimes.push(dataUtils.checkMiss(maindia,i,parent.yilouarr[select].max_yilou.split(",").slice(0,21)));
	}
}
function getProperty(winnum){//012路，单双，大小
	var gy=new Array("-","-","-","-","-");
	var a = new Array(5);
	if(winnum[0]>20){
		return gy;
	}else{
		a[0]=searr[Math.floor((winnum[0]-1)/2)];
		a[1]=fuarr[Math.floor((winnum[0]-1)/5)];
		a[2]=winnum[0]%3;
		a[3]=winnum[0]%2==0?"双":"单";
		a[4]=winnum[0]>10?"大":"小";
	}
	return a;
}
function getthisDiagram(arr,winnum){
	var a = new Array(21);
		for (var i = 0; i < a.length; i++) {
			if (winnum[0]==i+1||(winnum[0]==22&&i==20)) {
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
function getWei(arr,winnum,n){//5
	var a = new Array((K_public.ALL_NUMBER-2)/n);
		for (var i = 0; i < a.length; i++) {
			if (winnum[0]<21&&Math.ceil(winnum[0]/n)==i+1) {
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

function gethtml() {
	htmlUtils.retract(K_public.K2_WIN_NUMBER,parent.mainnote[ALLview.datanum[select]].length%K_public.MAX_ROWCOUNT+1);
	var x = 0;
	for (var i = 0; i < K_public.MAX_ROWCOUNT; i++) {
		var $tr = $(".table").find(".n" + (i + 1));
		if(i<note.length){
			htmlUtils.addDayline(note,i);
			$tr.find(".termN").text(note[i].term.slice(-3)).removeClass("bb"); //期号
			if(note[i].numbers!=[]){
				for(var j=0;j<K_public.K2_WIN_NUMBER;j++){
					if(note[i].numbers[j]>20)	$tr.find(".win").eq(j).text("公益").removeClass("yy").addClass("hz"); //中奖号码
					else $tr.find(".win").eq(j).text(note[i].numbers[j]).removeClass("yy hz"); //中奖号码
				}
			}
			for (var j = 0; j < dia[i+x].length; j++) { //分布图
				if (dia[i+x][j] == 0) {
					 if(j==20) $tr.find(".dia").eq(j).find("div").text("").addClass("zero1");
					 else $tr.find(".dia").eq(j).find("div").text(j+1).addClass("zero");
				} else 
					$tr.find(".dia").eq(j).find("div").text(parent.person_setting.showyilou==0?dia[i+x][j]:"").removeClass("zero zero1"); 
			}
//			for (var j = 0; j < fu[i+x].length; j++) { //福禄寿喜
//				if (fu[i+x][j] == 0) {
//					$tr.find(".fu").eq(j).find("div").text(fuarr[j]).addClass("zero");
//					$tr.find(".fu").eq(j).addClass("zero");
//				} else{
//					$tr.find(".fu").eq(j).find("div").text(parent.person_setting.showyilou==0?fu[i+x][j]:"").removeClass("zero");
//					$tr.find(".fu").eq(j).removeClass("zero");
//				}
//					
//			}
//			for (var j = 0; j < wei[i+x].length; j++) { //东南西北中
//				if (wei[i+x][j] == 0) {
//					$tr.find(".wei").eq(j).find("div").text(weiarr[j]).addClass("zero");
//					$tr.find(".wei").eq(j).addClass("zero");
//				} else{
//					$tr.find(".wei").eq(j).find("div").text(parent.person_setting.showyilou==0?wei[i+x][j]:"").removeClass("zero"); 
//					$tr.find(".wei").eq(j).removeClass("zero"); 
//				}
//			}
			for (var j = 0; j < property[i+x].length; j++)
				$tr.find(".lu").eq(j).find("div").text(property[i+x][j]);
		}else if(i>note.length){
			$tr.find(".termN").text("-").removeClass("bb"); //期号
			$tr.find(".win").text("-").removeClass("yy");
			$tr.find(".dia,.fu, .wei").find("div").text("-").removeClass("zero zero1");
			$tr.find(".lu").find("div").text("-");
		}
	}
	point[0] = [];
	$(".dia").find("div").each(function() {
		if ($(this).is(".zero")||$(this).is(".zero1"))	point[0].push(this);
	});
	weichu();
}
function weichu(){
	$(".t1").find("span").each(function() {
		this.remove();
	});
	$(".t1").empty().prepend(parent.weichustr_k2);
}

