try{
	if(parent.person_setting.skinStyle==0)
		document.getElementById("sizecss").setAttribute("href","css/size_"+parent.person_setting.fontsize+".css");
	else document.getElementById("sizecss").setAttribute("href","");
}catch(e){} 
if(parent.person_setting.skinStyle==1){
	var obj = document.getElementById("basecss");
	obj.setAttribute("href","css/new/base.css");
	obj = document.getElementById("viewcss");
	obj.setAttribute("href","css/new"+obj.href.substring(obj.href.lastIndexOf("/"),obj.href.length));
} 
if(parent.ALLview.isScross[parent.currentSelect]==1){
//	$("#homePage").css({"-moz-transform":"rotate(90deg)",
//		"-webkit-transform":"rotate(90deg)",
//		"-o-transform":"rotate(90deg)",
//		"transform":"rotate(90deg)",
//		"left":"-420px","top":"420px"});
//	$("#homePage").css({"-moz-transform":"rotate(90deg)",
//		"-webkit-transform":"rotate(90deg)",
//		"-o-transform":"rotate(90deg)",
//		"transform":"rotate(90deg)",
//		"left":"1080px"});
	parent.addscross();
//	$('head').append('<link rel="stylesheet" type="text/css"  href="css/isScross.css"/>');
//	$("#homePage").css({"width":"1920px","height":"1080px"});
//	$(".table").css({"width":"1920px","height":"962px"});
	$("#line").attr({"width":"962","height":"1920"});
//	$("#layer").css({"top":"35%","left":"35%"});
//	$(".rightfoot,.leftfoot").css("bottom","840px");
	if(parent.person_setting.skinStyle==0)$("#notice").css("width","86%");
	else  $("#notice").css({"width":"72%","left":"14%"});
}
$(".logo").click(function() {
	if(parent.debugflag==0) window.clearInterval(parent.timeFunTimer);
});
var htmlUtils={
	puttime:function(){//顶部时钟变化
		var d = new Date();
		var time = "";
		var MM = d.getMonth() + 1;
		if (MM < 10) MM = '0' + MM;
		var dd = d.getDate();
		if (dd < 10) dd = '0' + dd;
		var hh = d.getHours();
		if (hh < 10) hh = '0' + hh;
		var mm = d.getMinutes();
		if (mm < 10) mm = '0' + mm;
		var ss = d.getSeconds();
		if (ss < 10) ss = '0' + ss;
		time = d.getFullYear() + "-" + MM + "-" + dd + " " + hh + ":" + mm + ":" + ss;
		var xq = " " + K_public.weekday[d.getDay()] + " ";
		$(".date span").eq(0).text(time);
		if (xq != $(".date span").eq(1).text()) {
			$(".date span").eq(1).text(xq);
		}
	},
	countDown:function(maxtime, viewtext){//显示倒计时
		if(viewtext<2){
			if(maxtime>0){
				var minutes = Math.floor(maxtime / 60);
				var seconds = parseInt(maxtime % 60);
				if (minutes < 10) minutes = "0" + minutes;
				if (seconds < 10) seconds = "0" + seconds;
				if(minutes>59){
					$(".table tr td.time").text("59:59");
				}else{
					$(".table tr td.time").text(minutes + ":" + seconds);
				}
			}else{
				$(".table tr td.time").text("- - : - -");
			}	
		}
	},
	prompt:function(state, viewtext){//console.log(maxtime+"******"+state+"@@@@@@@@"+viewtext);
		if(viewtext<2){
			if(state==2){
				if (gameArray.newterm[datanum].encashFlag==1){
					$(".table tr td.state").text("只兑");
				}else{
					$(".table tr td.state").text(viewtext==0?"新期售卖中":"新期售卖");
				}
			}else if(state==0){
				$(".table tr td.time").text("- - : - -");
				$(".table tr td.state").text(viewtext==0?"等待开奖中":"等待开奖");
			}else if(state==1){
				$(".table tr td.time").text("- - : - -");
				$(".table tr td.state").text(viewtext==0?"新期等待中":"新期等待");
			}
		}
	},
	addline:function(point,linecolor,r){
		var le = parent.person_setting.skinStyle==0?0:1;
		cvs.clearRect(0, 0, 1920, 1920);
		if (point[0]&&point[0].length > 1) {
			for(var i = 0; i < point.length; i++){
				cvs.beginPath();
				for(var j = 0; j < point[i].length; j++){
					if (j != point[i].length - 1) {
						var a = ALLview.isScross[select]==1?$(point[i][j]).offset().left + $(point[i][j]).height()/2:$(point[i][j]).offset().left + $(point[i][j]).width()/2;
						var b = ALLview.isScross[select]==1?$(point[i][j]).offset().top + $(point[i][j]).width()/2:$(point[i][j]).offset().top + $(point[i][j]).height()/2;
						var c = ALLview.isScross[select]==1?$(point[i][j+1]).offset().left + $(point[i][j+1]).height()/2:$(point[i][j+1]).offset().left + $(point[i][j+1]).width()/2;
						var d = ALLview.isScross[select]==1?$(point[i][j+1]).offset().top + $(point[i][j+1]).width()/2:$(point[i][j+1]).offset().top + $(point[i][j+1]).height()/2;
						var p = htmlUtils.adjust(a+le, b+le, c+le, d+le,r+le);
						cvs.moveTo(p[0], p[1]);
						cvs.lineTo(p[2], p[3]);
					}
				}
				cvs.lineWidth = 1.5;
				cvs.strokeStyle = linecolor[i];
				cvs.stroke();
			}
		}
		for(var i=0;i<dayline.length;i++){ //天分界线
			//target = $(".n"+dayline[i].targetCount);
			cvs.beginPath();
			if(ALLview.isScross[select]==1){
				cvs.moveTo($(".n"+dayline[i].targetCount).offset().left+$(".n"+dayline[i].targetCount).height()-K_public.bottomheight,45);
				cvs.lineTo($(".n"+dayline[i].targetCount).offset().left+$(".n"+dayline[i].targetCount).height()-K_public.bottomheight,1930);
			}else{
				cvs.moveTo(45, $(".n"+dayline[i].targetCount).offset().top-K_public.headheight);
				cvs.lineTo(1080, $(".n"+dayline[i].targetCount).offset().top-K_public.headheight);
			}
			cvs.lineWidth = 2;
			cvs.strokeStyle = "crimson";
			cvs.stroke();
		  	cvs.font = "16px ar";
		    cvs.fillStyle = "crimson";
		    cvs.textBaseline="middle"; 
		    if(ALLview.isScross[select]==1){
		    	cvs.fillText(dayline[i].termDate,  $(".n"+dayline[i].targetCount).offset().left-K_public.bottomheight,20);
		    }else cvs.fillText(dayline[i].termDate, 0, $(".n"+dayline[i].targetCount).offset().top-K_public.headheight);
		}
	},
	adjust:function(a, b, c, d, r){//重新计算坐标 x1 y1 x2 y2 r
		
		var l = Math.sqrt(Math.pow(a - c, 2) + Math.pow(b - d, 2));
		var x = r * Math.abs(a - c) / l;
		var y = r * Math.abs(b - d) / l;
		if(ALLview.isScross[select]==1){
			if (b > d)	var p = [a - x- K_public.bottomheight, b - y , c + x- K_public.bottomheight, d + y ];
			else var p = [a - x- K_public.bottomheight, b + y , c + x- K_public.bottomheight, d - y ];
		}else{
			if (a < c)	var p = [a + x, b + y - K_public.headheight, c - x, d - y - K_public.headheight];
			else var p = [a - x, b + y - K_public.headheight, c + x, d - y - K_public.headheight];
		}
		return p;
	},
	putcss:function(){
		if(parent.person_setting.skinStyle==0) $(".header").css("background-image",ALLview.isScross[select]==1?"":"url(img/header.png)").show();
		else $(".header").css("background-image",ALLview.isScross[select]==1?"":"url(img/new_header.png)").show();
		$(".logo").css("background-image","url(img/logo.png)").show();
		if(parent.person_setting.skinStyle==0){
			$(".k3_logo").css("background-image","url(img/logo_k3.png)").show();
			$(".rightfoot").css("background-image","url(img/foot_right.png)").show();
		}else {
			$(".news").css("background-image",ALLview.isScross[select]==1?"":"url(img/bottom.png)").show();
			$(".k3_logo").css("background-image","url(img/logo_k3_s.png)").show();
			$(".leftfoot").css("background-image","url(img/left_bottom.png)").show();
			$(".rightfoot").css("background-image","url(img/right_bottom.png)").show();
		}
	}
};
