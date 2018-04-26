var data = []; //结果数据
var	todaytd = new Array([],[],[],[],[]);//相应数据所在的格子
var hotnumber =[];//热号
var htmlstr = "";
var page =K_public.MAX_PAGE-1;
var layer = parent.layer;
var select = parent.currentSelect;
document.onkeyup = function(event) {
	var e = event || window.event || arguments.callee.caller.arguments[0];
	var n = e.keyCode;
	//keyboard C-F:67-72
	//arrow left37 up38 right39 down40
	if(e && parent.FLAG != 0) {
		if(n == 82 || n == 36) { //backspance
			if(parent.clickMedia == 0) { //防止重复调用该方法
				parent.clickMedia = 1;
				dataUtils.closeMedia();
			}
			layer.close(parent.index);
			parent.$(".homePage").show();
				parent.$("#ifrContent").attr("src", "about:blank").hide()[0].focus();
		}
	}
};
var hotarr = new Array(22);
var codecolor = new Array("red","chocolate","#0066CC");

$(function(){
	parent.FLAG = 1;
	parent.clickMedia = 0;
	$(".version").find("span").eq(0).text(parent.person_setting.showstation == 0 ? "站点号： " + parent.person_setting.jihao : "");
	$(".version").find("span").eq(1).text(parent.person_setting.showversion == 0 ? " 版本号：" + parent.person_setting.version : "");
	var insertText = "";
	for(var i=0;i<25;i++){
	 	if(i<5) htmlstr=htmlstr+"<td class=\"wu\"><div></div></td>";
	 	else htmlstr=htmlstr+"<td class=\"shi\"><div></div></td>";
	}
	for (var i = 0; i < 20; i++) {
		 insertText += "<tr>" + htmlstr + "</tr>";
	}
	$(".h").after(insertText);
	
	for (var y = document.getElementsByClassName("two"),i = 0; i < y.length; i++) {
	  	y[i].rowSpan = "2";
	  	y[i].colSpan = "2";
	}
	checktd();
	setTimeout(function(){parent.loadpage();},100);//添加数据并加载页面
	
	
//	layer.close(parent.index);  
});

//添加数据并加载页面
function getdata(){
	hotnumber =[];
	data = getgezi(parent.todaynote_k2,0);
	//gethtml(); //放入网页
}
function getgezi(arr,c) {//返回一个长度为4的数组，第一个放的是格子开奖号码分布，第二个是012路结果分布，第三个是出球次数，第四个是012路次数
	var ge =[];
	var lu=[];
	var gearr = [];
	var luarr = [];
	for (var i = 0; i < arr.length; i++){//格子分布
		gearr.push(arr[i].numbers[0]);
		luarr.push(arr[i].numbers[0]>20?-1:arr[i].numbers[0]%3);//-1代表公益号没有012路
	}
	for(var i = 0; i < 21; i++){//出现次数
		if(i!=20)
			ge.push(dataUtils.match(i+1,gearr));
		else ge.push(dataUtils.match(i+1,gearr)+dataUtils.match(i+2,gearr));
	}
	for(var i = 0; i < 3; i++){//出现次数
		lu.push(dataUtils.match(i,luarr));
	}
	hotnumber = gethotnumber(gearr);
	return new	Array(gearr,luarr,ge,lu);
}

function checktd(){
	
	for(var i=40;i>0;i--){
		for(var j=4;j>=0;j--){
			todaytd[0].push($(".table tr").eq(i).find("td").eq(j));
		}
	}
	for(var i=1;i<21;i++){
		for(var j=5;j<25;j++){
			if(j<15)	todaytd[1].push($(".table tr").eq(i).find("td").eq(j));
			else	todaytd[2].push($(".table tr").eq(i).find("td").eq(j));
		}
	}
	for(var i=0;i<21;i++){
		todaytd[3].push($(".table tr").find(".times").eq(i));
	}
	for(var i=0;i<3;i++){
		todaytd[4].push($(".table tr").find(".lu").eq(i));
	}
}
var other =parent.mainnote[ALLview.datanum[select]].slice(-199);
function gethtml(){
	var temp;
	htmlUtils.prompt(parent.maxtime,parent.state,ALLview.viewtext[parent.currentSelect],0);
		for(var j=0;j<data.length;j++){
			if(j==0) {
				var m = data[j].length;
				for(var k = 0;k<data[j].length+1;k++){
					if(k==0)	todaytd[j][k].find("div").text("?").css("color","#993333");
					else {
						if(data[j][m-k]>20)
							todaytd[j][k].find("div").text("").css("background-color",codecolor[hotarr[data[j][m-k]-1]]).addClass("zero1");
						else todaytd[j][k].find("div").text(data[j][m-k]).css({"color":codecolor[hotarr[data[j][m-k]-1]],"background-color":""}).removeClass("hz2 zero1");
					}
					if(k!=data[j].length){//十格表
						if(data[j][k]>20)
							todaytd[j+1][k].find("div").text("").css("background-color",codecolor[hotarr[data[j][k]-1]]).addClass("zero1");
						else todaytd[j+1][k].find("div").text(data[j][k]).css({"color":codecolor[hotarr[data[j][k]-1]],"background-color":""}).removeClass("hz2 zero1");
					}
				}
			}else if(j==1){
				for(var k = 0;k<data[j].length;k++){
					todaytd[j+1][k].text(data[j][k]<0?"-":data[j][k]);
				}
			}else{
				for(var k = 0;k<data[j].length;k++){
					todaytd[j+1][k].text(data[j][k]);
				}
			}
		}
	
	for(var k = 0;k<todaytd[0].length;k++){ //五格图
		if(k>parent.todaynote_k2.length){
			var num = other[other.length-k].numbers[0];
			if(num>20)	todaytd[0][k].find("div").text("").css("background-color","#A9A9A9").addClass("zero1");
			else todaytd[0][k].find("div").text(num).addClass("hz2");
		}
	}
}
function last(){
	getdate();
	$(".table tr").find(".lu").eq(3).text(hotnumber[0]).css("color",codecolor[0]);
	$(".table tr").find(".lu").eq(4).text(hotnumber[1]).css("color",codecolor[2]);
	$(".table tr").css("height",1802/41+"px");
	htmlUtils.prompt(gameArray.remainTime[datanum],gameArray.playstate[datanum],ALLview.viewtext[select]);
}
function getdate(){
	var d = new Date();
	var hh = d.getHours();
	if(hh<K_public.cut)
		d = new Date(d.getTime() - 24*60*60*1000);  //前n天
	var time = "";
	var MM = d.getMonth() + 1;
	if (MM < 10) MM = '0' + MM;
	var dd = d.getDate();
	if (dd < 10) dd = '0' + dd;
	time = d.getFullYear() + "-" + MM + "-" + dd;
	$(".t1 span").text(time);
	var MMdd = dataUtils.getMMdd(parent.mainnote[ALLview.datanum[select]]);
	var thatday=(MM+""+dd)==MMdd[0]?MMdd[1]:MMdd[0];
	$(".t2 span").text(getMonth_id(parent.mainnote[ALLview.datanum[select]],thatday).substring(0,4)+"-"+thatday.substring(0,2)+"-"+thatday.substring(2,4));
}
function getMonth_id(mainnote,mmdd){//之前第几个交易日的数据
	var monthid ="";
	for (var i =0 ; i<mainnote.length; i++){
		if (mainnote[i].term.substring(0, 4) == mmdd) {
			return mainnote[i].yearmonth+"";
		}
	}
}
function gethotnumber(gearr){
	var h = [];
	var c = [];
	for (var i = 0; i < 21; i++){//格子分布
		var t =dataUtils.match(i+1,gearr);
		var mode = 1;
		if(mode==0){
			if(i<20){
				if(t>=10){	//热号
					h.push(i+1);
					hotarr[i]=0;
				}else if(t<6){ //冷号
					c.push(i+1);
					hotarr[i]=2;
				}else hotarr[i]=1;//温号
			}else {
				t =t+dataUtils.match(i+2,gearr);
				if(t>=10){			//热号
					h.push("公益");
					hotarr[i]=0;
					hotarr[i+1]=0;
				}else if(t<6){			//冷号
					c.push("公益");
					hotarr[i]=2;
					hotarr[i+1]=2;
				}else{				//温号
					hotarr[i]=1;
					hotarr[i+1]=1;
				}
			}
		}else{
			if(i<20){
				if(t/gearr.length>=0.08){	//热号
					h.push(i+1);
					hotarr[i]=0;
				}else if(t<1||t/gearr.length<=0.02){	//冷号
					c.push(i+1);
					hotarr[i]=2;
				}else hotarr[i]=1;	//温号
			}else {
				t =t+dataUtils.match(i+2,gearr);
				if(t>2&&t/gearr.length>=0.16){	//热号
					h.push("公益");
					hotarr[i]=0;
					hotarr[i+1]=0;
				}else if(t<2||t/gearr.length<=0.04){	//冷号
					c.push("公益");
					hotarr[i]=2;
					hotarr[i+1]=2;
				}else{				//温号
					hotarr[i]=1;
					hotarr[i+1]=1;
				}
			}
		}
	}
//	var hstr = h.join();
//	var cstr = c.join();
//	if(h.length>12) {
//		hstr = h.slice(0,12).join(",  ")+", ...";
//	}
//	if(c.length>12) {
//		cstr = c.slice(0,12).join(",  ")+", ...";
//	}
		var hstr = h.join(",  ");
		var cstr = c.join(",  ");
	return new Array(hstr,cstr);
}

