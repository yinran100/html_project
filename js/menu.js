var dev_mode=0; //0为前端调试模式
var debugflag=1;//0为调试模式可单机运行，实际运行设为1，非常重要！
var K2NAME = "K221";//------------------------------------------------------
var K3NAME = "K3";
var XYCNAME = "GAMEAB";
var K10NAME = "K520";
var K12NAME = "K512";
var QYHNAME = "K523";
var currentSelect = 0;
var clickMedia = 0;
var FLAG = 0; //开机进入某一页
var cc = 0;//计时
var strPage = window.location.search;
strPage = strPage.substr(1,strPage.length);	
var timeFunTimer;
var index ;
$(function(){
	if(dev_mode==0) $("#head").append("<script src='js/vconsole.min.js'></script>");
	setTimeout(function(){
		if(navigator.platform.substr(0,3)=="Win"&&("undefined"==typeof webApi||webApi==null)){
			debugflag=0;
			console.info("windows系统下调试，标志位置为0");
		}
	},2100);
	shortcut.add("Ctrl+L",function() {$(".vc-switch").click();});
	shortcut.add("Ctrl+H",function() {$(".vc-mask").click();});
});

var web = self.setInterval(function(){
	if(debugflag!=0&&("undefined" == typeof webApi||webApi==null)){
		console.info("webApi还未初始化");
	}else { 
		clearInterval(web);
		theload();
		console.log("参数"+strPage);
		FLAG = 1;
		if(strPage=="0"||strPage=="1"){	//0设置ip，1设置站点号
			currentSelect = ALLview.htmlname.length-1;
			layer.close(index); 
		}else{			
			if(strPage=="B") K_public.isfuping=true;
			if(debugflag==1){
				var screenSet = JSON.parse(webApi.invoke("/term/getTmScreenSet", '{"paramKey":"screen_num","screenFlag":"A"}'));
				if(screenSet&&screenSet.data && screenSet.result){
					console.log(screenSet.data);
					K_public.setFuping = screenSet.data.param_value!="1";
				}
			}else if(strPage=="A") K_public.setFuping = true;
			console.log((K_public.setFuping?"双屏模式：":"常规屏")+(K_public.setFuping&&K_public.isfuping?"这是副屏":"这是主屏"));
			$(".msg").show();
			dataUtils.initialize();			//初始化，站点号和版本号
			ajustPlayView();
			if(K_public.hasNoFlag&&person_setting.playCode=="NO"&&!K_public.isfuping){
			}else{
				var code = K_public.isfuping?person_setting.fupingview:person_setting.playCode;//主屏用playCode,副屏根据fupingview	
				if(code==""||gameArray.playname.indexOf(code)<0)   //过滤掉没有默认视图和玩法名称没有的情况
					code=gameArray.playname[0];
				var order = gameArray.playname.indexOf(code);	
				if(order>=gameArray.playname.length-K_public.CS_COUNT)	//是长周期
					currentSelect = ALLview.htmlname.length-1-(gameArray.playname.length-order);
				else {
					person_setting.playview = Math.min(Math.max(person_setting.playview, 0), gameArray.relationview[order].htmlname.length-1);
					for(var i=0;i<=order;i++){
						if(i==order)
							currentSelect = currentSelect+person_setting.playview;
						else currentSelect = gameArray.relationview[i].htmlname.length-1;	
					}
				}
			}
			for(var i in person_setting.sp_playEname){
				dataUtils.getSysParam(i); //获取期结数据
				gameArray.remainTime[i] = dataUtils.getcountime(i);
			}
			getalldata();
		}
		$("*").removeClass("ac");
		$(".i"+currentSelect).css("background-image","url("+ALLview.menuicon_ac[currentSelect]+")");
		$(".msg span.view").text(ALLview.menumsg[currentSelect]);
		if(person_setting.playCode!="NO"){
			$(".homePage").hide();
			$("#ifrContent").attr("src", ALLview.htmlname[currentSelect]).show().focus();
		}else layer.close(index);  
		if(strPage!="0"&&strPage!="1")
			var timeFunTimer = self.setInterval(function(){//唯一的时间触发器
				cc++;
				if(cc==600){
					getlongdata();
					cc = 0;
				}
				if($("#ifrContent").attr("src")&&$("#ifrContent").attr("src")!="about:blank") {
					try{
						myframe.window.htmlUtils.puttime();//时钟
					}catch(e){} 
				}
				for(var i in person_setting.sp_playEname) CountDown(i);  //每个短周期
				if(K_public.isfuping&&cc%5==0){		//每五秒调整页面
					var t=JSON.parse(webApi.invoke("/term/getCsPlayShowInfo","B"));
					if(t&&t.result){
						//for(var key in t.data) console.log(key+"="+t.data[key]);
						if(t.data.fupingview&&t.data.fupingpage&&t.data.showyilou&&t.data.showVersion&&t.data.showStation&&t.data.skinStyle){
							var view=t.data.fupingview;
							var page=t.data.fupingpage;
							if(view!=person_setting.fupingview||page!=person_setting.fupingpage
								||t.data.showyilou!=person_setting.showyilou||t.data.showVersion!=person_setting.showversion
								||t.data.showStation!=person_setting.showstation||t.data.skinStyle!=person_setting.skinStyle){
								person_setting.fupingview = view;
								person_setting.fupingpage = parseInt(page);
								person_setting.showyilou= parseInt(t.data.showyilou);
								person_setting.showversion= parseInt(t.data.showVersion);
								person_setting.skinStyle= parseInt(t.data.skinStyle);
								person_setting.showstation= parseInt(t.data.showStation);
								gotoPage(view,page);
							}
						}
					}
				}
			}, 980);			//公司的机器运行有点卡 要是设置1000就容易偏离很多,也不能太快，机器也跟不上。。
	}
},500);

function theload(){
	index = layer.load(2, {
	  	shade: [0.4,'#111']//0.1透明度的白色背景
	});
}
document.onkeydown=function(event){
	var e = event || window.event || arguments.callee.caller.arguments[0];
	var n = e.keyCode;
	if(e&&FLAG!=0){
		//arrow left 37 up38 right39 down40
		if(n==65 || n==37){  //向左 a
			$(".i"+currentSelect).css("background-image","url("+ ALLview.menuicon[currentSelect]+")");
			currentSelect = Math.max(0, currentSelect-1);
			//$("*").removeClass("ac");
			$(".i"+currentSelect).css("background-image","url("+ ALLview.menuicon_ac[currentSelect]+")");
			$(".msg span.view").text(ALLview.menumsg[currentSelect]);
		}
		if(n==68 || n==39){  //向右 d
			$(".i"+currentSelect).css("background-image","url("+ ALLview.menuicon[currentSelect]+")");
			currentSelect = Math.min(ALLview.htmlname.length-1, currentSelect+1);
			//$("*").removeClass("ac");
			$(".i"+currentSelect).css("background-image","url("+ ALLview.menuicon_ac[currentSelect]+")");
			$(".msg span.view").text(ALLview.menumsg[currentSelect]);
		}
		if(n==87 || n==38){	//向上 w
			$(".i"+currentSelect).css("background-image","url("+ ALLview.menuicon[currentSelect]+")");
			currentSelect = Math.max(currentSelect%3,currentSelect-3);
			//$("*").removeClass("ac");
			$(".i"+currentSelect).css("background-image","url("+ ALLview.menuicon_ac[currentSelect]+")");
			$(".msg span.view").text(ALLview.menumsg[currentSelect]);
		}
		if(n==83 || n==40){	//向下 s
			$(".i"+currentSelect).css("background-image","url("+ ALLview.menuicon[currentSelect]+")");
			currentSelect = Math.min(ALLview.htmlname.length-1,currentSelect+3);
			//$("*").removeClass("ac");
			$(".i"+currentSelect).css("background-image","url("+ ALLview.menuicon_ac[currentSelect]+")");
			$(".msg span.view").text(ALLview.menumsg[currentSelect]);
		}
		if(n==13 || n==75){ //确认  回车 home
			FLAG = 0;
			$(".homePage").hide();
			if(currentSelect!= ALLview.htmlname.length-1) theload();
			$("#ifrContent").attr("src",  ALLview.htmlname[currentSelect]).show().focus();
		}   
	}else if(e){
		if(debugflag==0&&n==35){
			location.reload();
		}
	}
}; 
function gotoPage(fupingview,fupingpage){		//跳转某一页，后台接口
	if(K_public.isfuping){
		var i = gameArray.playname.indexOf(fupingview);
		if(i<K_public.CS_COUNT){			//跳长周期页面
			currentSelect = i;
			$("#ifrContent").attr("src",ALLview.htmlname[i]).show().focus();
		}
	}
}
function openNotice(content,title,kind,screen,time){
	var kind = kind?kind:"A";
	var screen = (screen||screen==0)?screen:0;
	var time = (time||time==0)?time:5;
	var myDate = new Date();
	console.log("快捷通知"+kind,screen==1?"全屏":"半屏",time+"秒-"+myDate.toLocaleString());
	mynotice.model(kind,screen);
	mynotice.setText(content,title);
	$("#ifrNotice").css("height",screen==0?"960px":"1920px").show();
	$("#ifrContent").focus();
	if(time>0) setTimeout(function(){closeNotice();},time*1000);
}
function closeNotice(){
	mynotice.clearImg();
	$("#ifrNotice").hide();
	$("#ifrContent").focus();
}

