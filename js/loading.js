var clickflag = 0;
var currentSelect = 0;
$(function(){
	$(".layer").fadeIn(300);
	$(".loading",$("#divCommWait").show()).addClass("effect_rotate");
	if(currentSelect==0) $(".dialog span.y").addClass("ac");
	else	$(".dialog span.n").addClass("ac");
});
$(".loading").click(function(){
	setStationshow();
});
function setIPconfirmshow(){//弹窗
	console.log("中心服务器IP连接不通，请选择相应操作？");
	clickflag = 1;
	$(".layer2").show();
	$(".dialog").show();
	$(".dialog .q").text("中心服务器IP连接不通，请选择相应操作？").css("margin","20px");
	$(".dialog .y").text("重试").css("margin","140px");
	$(".dialog .n").show();
}
function setIPconfirmhide(){//不弹窗
	clickflag = 0;
	$(".layer2").hide();
	$(".dialog").hide();
}
function setStationshow(){
	console.log("站点号检测不合法，按OK键重新设置");
	clickflag = 2;
	$(".layer2").show();
	$(".dialog").show();
	$(".dialog .q").text("站点号检测不合法，按OK键重新设置！").css("margin","60px");
	$(".dialog .y").text("确定").css("margin","300px");
	$(".dialog .n").hide();
}
document.onkeydown=function(event){
	var e = event || window.event || arguments.callee.caller.arguments[0];
	var n = e.keyCode;
	if(e&&clickflag!=0){
		if(n==65 || n==37&&clickflag==1){  //向左 a
			currentSelect = 0;
			$("*").removeClass("ac");
			$(".dialog span.y").addClass("ac");
		}
		if(n==68 || n==39&&clickflag==1){  //向右 d
			currentSelect = 1;
			$("*").removeClass("ac");
			$(".dialog span.n").addClass("ac");
		}
		if(n==13 || n==75){ //确认  回车 home
			if(clickflag==1){
				if(currentSelect==0){
					console.log('重试！');
					setIPconfirmhide();
					setTimeout(function(){webApi.invoke("/term/retryNetCheck",null);},1000);
				}else {
					console.log('设置ip');
					location.href='menu.html?0'; 
				}
			}else {
				console.log('设置站点');
				location.href='menu.html?1'; 
			}
		}   
	}
}; 

