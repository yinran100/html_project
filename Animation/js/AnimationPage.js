//var str = "0105001:020405:120:1.4:221:12";  //MDEwNTAwMTowMjA0MDU6MTIwOjEuNDoyMjE6MTI=
var text = 1;   //0为展示图片
var anInt;
var anShowInt;

var PLAYING = 0;

$(function(){
	var strPage = window.location.search;
	if(strPage != ""){
	  	strPage = strPage.substr(1,strPage.length);	  	 	
	  		showwinnum(strPage);	
	}
	//console.log(new Base64().encode(str));
});

function annSound(vol){
	try{console.log("语音"+vol);
		if (vol=='0' || vol==0){
			 $("#womenAnnSound").get(0).load();
			 $("#womenAnnSound").get(0).play();
		}else if (Number(vol)>=1){ 
			 $("#numSound"+vol).get(0).load();
			 $("#numSound"+vol).get(0).play();
		}	
	}catch(error){		
	}	
}
var B001PricePool={
	term_code:"",  		 //当前期
	innext_firstaward:0, 			//奖池累金(已取整，元)
	big_win_num:0,			 //大奖个数 (已取整，个数为0不显示)
	big_win_amount:0, //大奖金  (已取整，元需截位为亿元，为0不显示)
};
function showwinnum(strPage){//url的内容=期号：中奖号码
	PLAYING = 1;
	var b = new Base64(); 
	var res =b.decode(strPage).split(":");
	var winnumber= [res[1].charAt(1),res[1].charAt(3),res[1].charAt(5)];
	B001PricePool.term_code = res[2];
	B001PricePool.innext_firstaward = parseFloat(res[3]);
	B001PricePool.big_win_num =  parseInt(res[4]);
	B001PricePool.big_win_amount = parseInt(res[5]);
	$(".term_code span").text(res[0]);
	$("#kjdh").fadeIn(500);
	annSound(0);	//本期开奖号码为（语音）
	if (anInt){window.clearTimeout(anInt);}
		anInt = window.setTimeout(
	 	function(){
			var i=0;			
			  var timeFunTimer = self.setInterval(function(){
			  annSound(winnumber[i]);	
			  bomb(i);	  	//爆炸
			  $("#kjdh .win_code"+i).text(winnumber[i]);
					i++;
					if(i>2){
						window.clearInterval(timeFunTimer);
						i=0;
						showfirework();
					} 
				}, 1500);
		},1500);
	if (anShowInt) {clearTimeout(anShowInt);}
	anShowInt = setTimeout(function () {
		$("#kjdh").fadeOut(500);
		$("#kjdh .win_code0").hide();
		$("#kjdh .win_code1").hide();
		$("#kjdh .win_code2").hide();
		$("#kjdh .firework0").hide();
		$("#kjdh .firework1").hide();
		$("#kjdh .firework2").hide();
		playB001();
	},13000);
}
//爆炸
function bomb(i){
	var j=0;
	var h= self.setInterval(function(){
	$(".bomb"+i).css("background-position","-"+512*j+"px,0px").show();
			j++;
			if(j==13)$(".win_code"+i).show();
			if(j>=24) {
				window.clearInterval(h);
				$(".bomb"+i).hide();
				j=1;
		}
	}, 60);
}
//烟花
function showfirework(){
	var i=0;
	var tt=0;
	var s=getRandom(5,10);
	time = self.setInterval(function() {
		tt++;
		if(tt>=s){
			s=getRandom(4,9);
		 	setTimeout(function(){
		  		$(".firework"+i%3).css({"top":getRandom(-150,200)+"px","left":getRandom(-150,700)+"px"});
		  		fire(i%3);
		  	},getRandom(2,6)*50);//添加数据并加载页面
			i++;
			if(i>7){
				window.clearInterval(time);
				i=0;
			} 
			tt=0;
		}
	}, 150);
}
function fire(i){
	var j=0;
	var ll= self.setInterval(function() {
	    $(".firework"+i).css("background-position","-"+512*j+"px,0px").show();
			j++;
			if(j>=19) {
				window.clearInterval(ll);
				$(".firework"+i).hide();
				j=1;
		}
	}, 60);
}

function playB001(){
	if(text==0){
		if(B001PricePool.innext_firstaward>10000000){			//累计奖池不小于1q
			console.log("累计奖池");
			$("#B001ad").css("background-image","url(img/b001win_a.png)").fadeIn(500);
			$("#B001ad .big_win_num").hide();
			$("#B001ad .big_win_amount").hide();
			$("#B001ad .term_code").empty().append(getnumber(B001PricePool.term_code,0)).show();
			$("#B001ad .innext_firstaward").empty().append(getnumber(B001PricePool.innext_firstaward,0)).show();
			if (anShowInt) clearTimeout(anShowInt);
			anShowInt = setTimeout(function () {
				$("#B001ad .term_code").hide();
				$("#B001ad .innext_firstaward").hide();
				if(B001PricePool.big_win_num>0 && B001PricePool.big_win_amount>0){		//双色球第二个图
					console.log("第二个图");
					$("#B001ad").css("background-image","url(img/b001win_b.png)");
					$("#B001ad .big_win_num").empty().append(getnumber(B001PricePool.big_win_num,1)).show();
					$("#B001ad .big_win_amount").empty().append(getnumber(B001PricePool.big_win_amount,1)).show();
					if (anShowInt) clearTimeout(anShowInt);
						anShowInt = setTimeout(function () {
							$("#B001ad .big_win_num").hide();
							$("#B001ad .big_win_amount").hide();
							$("#B001ad").fadeOut(500);
							PLAYING = 0;
					},5000);
				}else {
					$("#B001ad").fadeOut(500);
					PLAYING = 0;
				}
			},5000);
		}else PLAYING = 0;
	}else{
		if(B001PricePool.innext_firstaward>0){			//累计奖池不为0
			console.log("累计奖池");
			$("#B001ad").css("background-image","url(img/b001win_a.png)").fadeIn(500);
			$("#B001ad .big_win_num").hide();
			$("#B001ad .big_win_amount").hide();
			$("#B001ad .term_code").text(B001PricePool.term_code).show();
			$("#B001ad .innext_firstaward").text(B001PricePool.innext_firstaward).show();
			if (anShowInt) clearTimeout(anShowInt);
			anShowInt = setTimeout(function () {
				$("#B001ad .term_code").hide();
				$("#B001ad .innext_firstaward").hide();
				if(B001PricePool.big_win_num>0&&B001PricePool.big_win_amount>0){		//双色球第二个图
					console.log("第二个图");
					$("#B001ad").css("background-image","url(img/b001win_b.png)");
					$("#B001ad .big_win_num").text(B001PricePool.big_win_num).show();
					$("#B001ad .big_win_amount").text(B001PricePool.big_win_amount).show();
					if (anShowInt) clearTimeout(anShowInt);
					anShowInt = setTimeout(function () {
							$("#B001ad .big_win_num").hide();
							$("#B001ad .big_win_amount").hide();
							$("#B001ad").fadeOut(500);
							PLAYING = 0;
					},5000);
				}else {
					$("#B001ad").fadeOut(500);
					PLAYING = 0;
				}
			},5000);
		}else PLAYING = 0;
	}
}
function getnumber(num,mod){
	var numstr = Math.floor(num/100000000)+"";
	var divstr = "";
	for(var i=0;i<numstr.length;i++){
		var chart = numstr.charAt(i);
		if(mod==0){		//第一个图的 
			if(chart==".") divstr = divstr+"<div class = 'num1 np'></div>";
			else  divstr = divstr+"<div class = 'num1 n"+chart+"'></div>";
		}else {			//第二个图的 
			if(chart==".") divstr = divstr+"<div class = 'num2 nbp'></div>";
			else  divstr = divstr+"<div class = 'num2 nb"+chart+"'></div>";
		}
	}
	return divstr;
}
//生成一定范围的随机数
function getRandom(x, y) {
	y = y + 1;
	return parseInt(y - Math.random() * (y - x), 10);
}