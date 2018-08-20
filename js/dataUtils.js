/*
 * 用java程序获取数据库中近300期的号码，返回 期号+中奖号码的二维数组
 * 错误编号	000-0:取开奖公告返回false 000-1:第一次取开奖公告没有数据
 * 100-0:取新期返回false
 * 200-0：遗漏数据返回false,200-1:某个玩法遗漏数据不存在，200-2：遗漏数据不完整
 */
var person_setting={
		haveset:0,
		playCode:K3NAME,	//玩法名,"NO"代表不进入任何走势图maindata
		playview:0,		//默认打开第几个视图
		showpage:6,		//K_public.MAX_PAGE,		//显示第几页
		showpage_h:10,
		showstation:0,	//是否显示站点号
		showversion:0,	//是否显示版本号
		showyilou:1,	//是否显示连续遗漏
		skinStyle:0,	//1是多彩版
		sp_playEname:new Array(K3NAME),
		cs_playEname:new Array(),		//默认图 "B001","S3","QL730","SP61","QL515"
		fontsize:0,
		fupingview:"B001",	//副屏上显示的玩法名（长周期）
		fupingpage:6,	//副屏上显示第几页
		bt3color:0,
		th2color:1,
		th3color:3,
		lh3color:0,
		jihao:"",
		version:"",
		serverIP:"",
		k12BaseStyle:1,  //快乐12内容样式选择 1为更新版
		screenLight:90, //主屏亮度
		screenLight_B:90, //副屏亮度
		sysSoundVal:80, //主屏音量
		sysSoundVal_B:80 //副屏音量
};
var dataUtils = {
	initialize: function(){
		if(debugflag!=0){
			var t=JSON.parse(webApi.invoke("/term/checkMenu",null)); 
			if(t&&t.result){
				var sp = t.data;
				try{
					person_setting.jihao = sp.jihaoname;
					person_setting.version = sp.version;
					person_setting.serverIP = sp.serverIP;
					if(sp.fontsize) person_setting.fontsize = parseInt(sp.fontsize);
					if(sp.bt3color!=undefined) person_setting.bt3color = parseInt(sp.bt3color);
					if(sp.th2color!=undefined) person_setting.th2color = parseInt(sp.th2color);
					if(sp.th3color!=undefined) person_setting.th3color = parseInt(sp.th3color);
					if(sp.lh3color!=undefined) person_setting.lh3color = parseInt(sp.lh3color);
					if(sp.playCode!=undefined) person_setting.playCode = sp.playCode;
					if(sp.playView!=undefined&&sp.playView!='undefined') person_setting.playview = parseInt(sp.playView);
					if(sp.showPage!=undefined) person_setting.showpage = Math.min(Math.max(parseInt(sp.showPage), 1), K_public.MAX_PAGE);
					if(sp.fupingview!=undefined&&sp.fupingview!='undefined') person_setting.fupingview = parseInt(sp.fupingview);
					if(sp.fupingpage!=undefined) person_setting.fupingpage = Math.min(Math.max(parseInt(sp.fupingpage), 1), K_public.MAX_PAGE);
					if(sp.showStation!=undefined) person_setting.showstation = parseInt(sp.showStation);
					if(sp.showVersion!=undefined) person_setting.showversion = parseInt(sp.showVersion);
					if(sp.showYilou!=undefined) person_setting.showyilou = parseInt(sp.showYilou);
					if(t.data.skinStyle!=undefined) person_setting.skinStyle = parseInt(t.data.skinStyle);
					if(sp.screenLightVal!=undefined) person_setting.screenLight = parseInt(sp.screenLightVal);
					if(sp.k12BaseStyle!=undefined) person_setting.k12BaseStyle = parseInt(sp.k12BaseStyle);
					if(sp.spPlayEname!=undefined&&!K_public.isfuping){
						person_setting.sp_playEname=[];
						var ar = sp.spPlayEname.split(",");
						for(var x in ar)
							if(ar[x].trim()!='') person_setting.sp_playEname.push(ar[x]);
						//person_setting.sp_playEname.sort();
					}
					if(sp.csPlayEname!=undefined){		//长周期授权，没有这个属性就保持默认
						person_setting.cs_playEname=[];
						var ar = sp.csPlayEname.split(",");
						for(var x in ar)
							if(ar[x].trim()!='') person_setting.cs_playEname.push(ar[x]);
					}
					console.info("取到个性化设置参数");
				}catch(e){console.error("个性化设置参数有错误");
					//TODO handle the exception
					console.error(person_setting);
				}
			}
		}else {
			if(person_setting.jihao=="") person_setting.jihao = "21000000001";
			if(person_setting.version=="") person_setting.version = "1.0.0";
		}
		if(K_public.isfuping){			//副屏不要短周期
			person_setting.sp_playEname=[];
			$("#ad").css("background-image","url(img/all_ad.png))");
		}
		if(person_setting.sp_playEname.length==0) $("#ad").css("background-image","url(img/all_ad.png)");
		else if(person_setting.sp_playEname.indexOf(K3NAME)>=0){
			$("#ad").css("background-image","url(img/ad_k3.png)");
			
		}else if(person_setting.sp_playEname.indexOf(K10NAME)>=0)$("#ad").css("background-image","url(img/ad_k10.png)");
		else if(person_setting.sp_playEname.indexOf(K2NAME)>=0)$("#ad").css("background-image","url(img/ad_k2.png)");
		else if(person_setting.sp_playEname.indexOf(XYCNAME)>=0)$("#ad").css("background-image","url(img/ad_xyc.png)");
		else if(person_setting.sp_playEname.indexOf(K12NAME)>=0)$("#ad").css("background-image","url(img/ad_k12.png)");
		dataUtils.getplayMvflag();//是否播放
		person_setting.haveset=1;
		console.log(person_setting);
		if(person_setting.skinStyle==1){
			$(".part").show();
			ALL_COLOR[0]="#434242";
			K_public.S3_COLOR[1]="#434242";
		} 
		K_public.COLOR=[ALL_COLOR[person_setting.lh3color],ALL_COLOR[person_setting.bt3color],ALL_COLOR[person_setting.th2color],ALL_COLOR[person_setting.th3color]];
	},
	get7L: function() {
			console.log("*****************取七乐彩数据！**************");
			var thenote = [];
			if(debugflag!=0){
				var termlist=JSON.parse(webApi.invoke("/term/getCsPlayData","QL730"));
			}else  var termlist=dataUtils.getdata(Longdata.WIN_QL730,Longdata.ALL_QL730,"long");//*************************************************
			if(termlist&&termlist.result){
				for(var i=termlist.data.length-1;i>=0;i--){
				 	var s = termlist.data[i].play_code;
				 	try{
				 		var num = [];
						for(var j = 0;j<Longdata.WIN_QL730;j++)
							num.push(parseInt(s.substring(j*2, j*2+2)));
				 	}catch(e){//TODO handle the exception
				 		 var num = [];
				 		 console.error("七乐彩"+termlist.data[i].term_code+"期的开奖号码数据有误！");
				 	}
					thenote.push({term: termlist.data[i].term_code, numbers: num});
				}
				if(termlist.data.length==0){
					console.error("七乐彩没有数据！");
					layer.alert("开奖公告数据出错！错误编号000-1：QL730", {icon: 5,btn: [], closeBtn:0});
				}
			}else{
				console.error("七乐彩全部数据出错！/term/getCsPlayData|QL730："+termlist.result);
				layer.alert("开奖公告数据出错！错误编号000-0：QL730", {icon: 5,btn: [], closeBtn:0});
			}
			return  thenote;
	},
	get3D: function() {
		console.log("********************取3D数据！********************");
		var thenote = [];s3color =[];
		if(debugflag!=0){
			var termlist=JSON.parse(webApi.invoke("/term/getCsPlayData","S3"));
		}else  var termlist=dataUtils.getdata(Longdata.WIN_S3,Longdata.ALL_S3,"long","s3");//**********************************************
		if(termlist&&termlist.result){
			for(var i=termlist.data.length-1;i>=0;i--){
			 	var s = termlist.data[i].play_code;
			 	try{
			 		var num = [];
					for(var j = 0;j<Longdata.WIN_S3;j++)
						num.push(parseInt(s.substring(j*2, j*2+2)));
			 	}catch(e){//TODO handle the exception
			 		var num = [];
			 		console.error("3D"+termlist.data[i].term_code+"期的开奖号码数据有误！");
			 	}
				thenote.push({term: termlist.data[i].term_code, numbers: num});
				s3color.push(dataUtils.getcolor(num,true));
			}
			if(termlist.data.length==0){
				console.error("3D没有数据！");
				layer.alert("开奖公告数据出错！错误编号000-1：S3", {icon: 5,btn: [], closeBtn:0});
			}
		}else{
			console.error("3D全部数据出错！/term/getCsPlayData|S3："+termlist.result);
			layer.alert("开奖公告数据出错！错误编号000-0：S3", {icon: 5,btn: [], closeBtn:0});
		}
		return  thenote;
	},
	getDcb: function() {
		console.log("********************取双色球数据！********************");
		var thenote = [];
		if(debugflag!=0){
			var termlist=JSON.parse(webApi.invoke("/term/getCsPlayData","B001"));
		}else  var termlist=dataUtils.getdata(Longdata.WIN_B001,Longdata.ALL_B001,"long","b001");
		if(termlist&&termlist.result){
			for(var i=termlist.data.length-1;i>=0;i--){
			 	var s = termlist.data[i].play_code;
			 	try{
			 		var num = [];
					for(var j = 0;j<Longdata.WIN_B001;j++)
						num.push(parseInt(s.substring(j*2, j*2+2)));
			 	}catch(e){//TODO handle the exception
			 		var num = [];
			 		console.error("双色球"+termlist.data[i].term_code+"期的开奖号码数据有误！");
			 	}
				thenote.push({term: termlist.data[i].term_code, numbers: num});
			}
			if(termlist.data.length==0){
				console.error("双色球没有数据！");
				layer.alert("开奖公告数据出错！错误编号000-1：B001", {icon: 5,btn: [], closeBtn:0});
			}
		}else{
			console.error("双色球全部数据出错！/term/getCsPlayData|B001："+termlist.result);
			layer.alert("开奖公告数据出错！错误编号000-0：B001", {icon: 5,btn: [], closeBtn:0});
		}
		return  thenote;
	},
	getSp61: function() {
		console.log("*****************取东方6+1数据！**************");
		var thenote = [];
		if(debugflag!=0){
			var termlist=JSON.parse(webApi.invoke("/term/getCsPlayData","SP61"));
		}else  var termlist=dataUtils.getdata(Longdata.WIN_SP61,Longdata.ALL_SP61,"long","sp61");//*************************************************
		if(termlist&&termlist.result){
			for(var i=termlist.data.length-1;i>=0;i--){
			 	var s = termlist.data[i].play_code;
			 	try{
			 		var num = [];
					for(var j = 0;j<Longdata.WIN_SP61;j++)
						num.push(parseInt(s.substring(j*2, j*2+2)));
			 	}catch(e){//TODO handle the exception
			 		 var num = "[]";
			 		 console.error("东方6+1"+termlist[i].term_code+"期的开奖号码数据有误！");
			 	}
				thenote.push({term: termlist.data[i].term_code, numbers: num});
			}
			if(termlist.data.length==0){
				console.error("东方6+1没有数据！");
				layer.alert("开奖公告数据出错！错误编号000-1：SP61", {icon: 5,btn: [], closeBtn:0});
			}
		}else{
			console.error("东方6+1全部数据出错！/term/getCsPlayData|SP61："+termlist.result);
			layer.alert("开奖公告数据出错！错误编号000-0：SP61", {icon: 5,btn: [], closeBtn:0});
		}
		return  thenote;
	},
	getI515: function() {
		console.log("*****************取15选5数据！**************");
		var thenote =[];
		if(debugflag!=0){
			var termlist=JSON.parse(webApi.invoke("/term/getCsPlayData","QL515"));
		}else  var termlist=dataUtils.getdata(Longdata.WIN_I515,Longdata.ALL_I515,"long");//*************************************************
		if(termlist&&termlist.result){
			for(var i=termlist.data.length-1;i>=0;i--){
			 	var s = termlist.data[i].play_code;
			 	try{
			 		var num = [];
					for(var j = 0;j<Longdata.WIN_I515;j++)
						num.push(parseInt(s.substring(j*2, j*2+2)));
			 	}catch(e){//TODO handle the exception
			 		 var num = [];
			 		 console.error("15选5"+termlist[i].term_code+"期的开奖号码数据有误！");
			 	}
				thenote.push({term: termlist.data[i].term_code, numbers: num});
			}
			if(termlist.data.length==0){
				console.error("15选5没有数据！");
				layer.alert("开奖公告数据出错！错误编号000-1：QL515", {icon: 5,btn: [], closeBtn:0});
			}
		}else{
			console.error("15选5数据出错！/term/getSpPlayData|QL515："+termlist.result);
			layer.alert("开奖公告数据出错！错误编号000-0：QL515", {icon: 5,btn: [], closeBtn:0});
		}
		return  thenote;
	},
	getB001:function(){
		console.log("*****************获取双色球奖金池********************");
		var result=JSON.parse(webApi.invoke("/term/getB001PricePool",null));
		console.log("B001"+result+"|"+result.data);
		if(result && result.data){
			var res = result.data;
			try{
				B001PricePool.term_code=res.term_code;
				B001PricePool.innext_firstaward=res.innext_firstaward;
				B001PricePool.big_win_num=res.big_win_num;
				B001PricePool.big_win_amount=res.big_win_amount;
			}catch(e){//TODO handle the exception
				 console.error("获取双色球奖金池的数据有误！");
			}
			console.log(B001PricePool);
		}
	},
	playMvandB001:function(str){	//后台播放奖池和开奖号码
		if($("#ifrContent").attr("src")!="about:blank"&&ALLview.viewtext[currentSelect]<2&&ALLview.isScross[currentSelect]==0){
			console.log("html开奖动画参数："+str);
			try{
				if(debugflag!=0) var result=JSON.parse(webApi.invoke("/term/playK3AnnMvAndB001Pool",null));
				else if("undefined" != typeof webApi&&webApi!=null) var result=JSON.parse(webApi.invoke("/term/playK3AnnMvAndB001Pool",str));		//单机
				else var result = {result:true,data:true};
				console.log("动画结果 playK3AnnMvAndB001Pool:"+result.result+"|"+result.data);
				if(result && result.result){
					return result.data;
				}return false;
			}catch(e){//TODO handle the exception
				 console.error("开奖动画出错！");
			}
		}else return false;
	},
	getSysParam:function(n){
		if(debugflag!=0){console.log("*****************获取期结参数********************");
			var sysresult=JSON.parse(webApi.invoke("/term/getSysParam",gameArray.playname[n]));
			if(sysresult && sysresult.result){
					var res = sysresult.data;
					try{
						var temp = parseInt(res.get_term_time);
						if(temp!=null && !isNaN(temp)){
							gameArray.getTermTime[n] = temp;
						}else console.error(gameArray.playname[n]+"期结后多久的新期数据有误！（已设为默认值：）"+gameArray.getTermTime[n]);
						temp = parseInt(res.get_priceinfo_time);
						if(temp!=null && !isNaN(temp)){
							gameArray.getPriceinfoTime[n] = temp;
						}else console.error(gameArray.playname[n]+"期结后多久的取开奖公告数据有误！（已设为默认值：）"+gameArray.getPriceinfoTime[n]);
					/*
						temp =parseInt(res.get_pricemovopen_earliest_time);
						if(temp!=null && !isNaN(temp)){
							K_public.playmintime = temp;
						}else console.error("最早播放开奖动画时间数据有误！（已设为默认值：）"+K_public.playmintime);
						temp =parseInt(res.get_pricemovopen_latest_time);
						if(temp!=null && !isNaN(temp)){
							K_public.playmaxtime = temp;
						}else console.error("最晚播放开奖动画时间数据有误！（已设为默认值：）"+K_public.playmaxtime);
						temp =parseInt(res.get_pricemov_long);
						if(temp!=null && !isNaN(temp)){
							K_public.waittime = temp+4;
						}else console.error("开奖动画时长数据有误！（已设为默认值：）"+K_public.waittime);
						temp =parseInt(res.pricemov_play_flag);
						if(temp!=null && !isNaN(temp)){
							K_public.pricemov_play_flag = temp;
						}else console.error("pricemov_play_flag数据有误！（已设为默认值：）"+K_public.pricemov_play_flag);
					*/
					}catch(e){//TODO handle the exception
						 console.error(gameArray.playname[n]+"期结后多久的数据有误！");
					}
					if(gameArray.getTermTime[n]<=gameArray.getPriceinfoTime[n]) gameArray.getTermTime[n] = gameArray.getPriceinfoTime[n]+5;
//					if(K_public.playmaxtime<=K_public.playmintime)	K_public.playmaxtime=K_public.playmintime+15;
//					if(K_public.waittime<18)	K_public.waittime=19;
					console.log(gameArray.playname[n]+"_getSysParam"+gameArray.getPriceinfoTime[n]+"#"+gameArray.getTermTime[n]);
			}else  console.error(gameArray.playname[n]+"期结后多久的数据有误！/term/getSysParam"+sysresult.result);
		}	
		return
	},
	getplayMvflag:function(){			//后台是否播放开奖动画
		if(debugflag!=0&&"undefined" != typeof webApi&&webApi!=null) var sysresult=JSON.parse(webApi.invoke("/term/getTmScreenSet", '{"paramKey":"export","screenFlag":"A"}'));
		if(sysresult!=undefined && sysresult.result){
			var res = sysresult.data;
			if(res.param_value) K_public.playHtmlMvflag = res.param_value.indexOf("5")>=0;
		}
	},
	openMedia:function(){
		if(($("#ifrContent").attr("src")!="about:blank"&&ALLview.viewtext[currentSelect]<2&&ALLview.isScross[currentSelect]==0&&!K_public.setFuping)||(person_setting.sp_playEname.length==0)){
			if("undefined" != typeof webApi&&webApi!=null){
				var playModel = JSON.parse(webApi.invoke("/term/getIsPlayTerm",null));
				console.log("查询播放："+playModel.data);
				if(playModel.data=="0") return;
				console.info("打开视频媒体！");
				webApi.invoke("/term/openMedia",null);
			}	
		}
	},
	closeMedia:function(){
		if("undefined" != typeof webApi&&webApi!=null){
			var playModel = JSON.parse(webApi.invoke("/term/getIsPlayTerm",null));
			console.log("查询播放："+playModel.data);
			if(playModel.data=="0") return;
			console.info("返回菜单页, 关闭视频媒体！");
			webApi.invoke("/term/closeMedia",null);	
		}	
	},
	getnewData: function(n) { //短周期新数据
		var lastnote = mainnote[n][mainnote[n].length-1];var codestr="";
		if(gameArray.playname[n]==K2NAME)  codestr = dataUtils.getNumcodeStr(1,22,false,false);
		else if(gameArray.playname[n]==K3NAME) codestr = dataUtils.getNumcodeStr(K_public.K3_WIN_NUMBER,K_public.K3_ALL_NUMBER,true,false);
		else if(gameArray.playname[n]==XYCNAME) codestr = dataUtils.getNumcodeStr(3,3,true,true)+dataUtils.getNumcodeStr(3,10,false,false);
		else if(gameArray.playname[n]==K10NAME) codestr = dataUtils.getNumcodeStr(K_public.K10_WIN_NUMBER,K_public.K10_ALL_NUMBER,false,false);
		else if(gameArray.playname[n]==K12NAME) codestr = dataUtils.getNumcodeStr(K_public.K12_WIN_NUMBER,K_public.K12_ALL_NUMBER,false,false);
		console.log("********************取新的短周期数据！"+gameArray.playname[n]+"_"+lastnote.yearmonth+"_"+lastnote.term);
		if(debugflag!=0)
			var termlist=JSON.parse(webApi.invoke("/term/getSpNewTerms",gameArray.playname[n]+"_"+lastnote.yearmonth+"_"+lastnote.term));		
		else var termlist = {result:true,
				data:[{month_id:"201703", term_code:lastnote.term.slice(0, 4)+dataUtils.fullNum(parseInt(lastnote.term.slice(-3))+1,3),play_code:codestr}]
			};
		if(termlist&&termlist.result){
			if(termlist.data.length>0) mainnote[n] = addnote[n].concat(mainnote[n]);  //补回完整期
			for(var i=termlist.data.length-1;i>=0;i--){
				var s = termlist.data[i].play_code.replace(/ /g,"");
				try{
				 	if(gameArray.playname[n]==K2NAME){
				 		var num = [parseInt(s.substring(0, 2))];
				 	}else if(gameArray.playname[n]==K3NAME){
				 		if(gameArray.maindata[n].length==K_public.MAX_PAGE*K_public.MAX_ROWCOUNT-1) gameArray.maindata[n].shift();
				 		var q =0;
						if(termlist.data[i].term_code.slice(0, 4)!=lastnote.term.slice(0, 4)) q = 1;
					 	//if(termlist.data[i].term_code.substring(4, 7)=="001") q = 1;
				 		var num =  [parseInt(s.substring(0, 2)), parseInt(s.substring(2, 4)), parseInt(s.substring(4, 6))];
				 		gameArray.maindata[n].push({				//走势图用到的大部分数据
				 			day:q,
							sum: dataUtils.sumValue(num),  //和值
							span:dataUtils.getspan(num, K_public.K3_ALL_NUMBER),//跨度
							ds:dataUtils.getds(num, K_public.K3_ALL_NUMBER),//大数
							js:dataUtils.getjs(num),//奇数
							zhi:dataUtils.getzhi(num),//质数
							lu:num[0]%3,
							rbt:dataUtils.getrbt(num),
							form:dataUtils.getcolor(num,K_public.haslx)
						});
				 	}else if(gameArray.playname[n]==XYCNAME){
				 		if(gameArray.maindata[n].length==K_public.MAX_PAGE*K_public.MAX_ROWCOUNT-1)	gameArray.maindata[n].shift();
				 		var q =0;
						if(termlist.data[i].term_code.slice(0, 4)!=lastnote.term.slice(0, 4)) q = 1;
						var num1=[],num2=[];
						for(var j = 0;j<3;j++){
							num1.push(parseInt(s.substring(j*2, j*2+2)));
							num2.push(parseInt(s.substring(j*2+6, j*2+8)));
						}
				 		gameArray.maindata[n].push({				//走势图用到的大部分数据
							day:q,
							sum1: dataUtils.sumValue(num1),  //和值
							sum2: dataUtils.sumValue(num2), 
							ds:dataUtils.getds(num2, 10),//大数
							js:dataUtils.getjs(num2),//奇数
							form:dataUtils.getcolor(num1,false)
						});
				 	}else if(gameArray.playname[n]==K10NAME){
				 		if(gameArray.maindata[n].length==K_public.MAX_PAGE*K_public.MAX_ROWCOUNT-1)	gameArray.maindata[n].shift();
				 		var q =0;
						if(termlist.data[i].term_code.slice(0, 4)!=lastnote.term.slice(0, 4)) q = 1;
						var num =[];
						for(var j = 0;j<K_public.K10_WIN_NUMBER;j++)
							num.push(parseInt(s.substring(j*2, j*2+2)));
				 		gameArray.maindata[n].push({				//走势图用到的大部分数据
				 			day:q,
							sum: dataUtils.sumValue(num),  //和值
							span:dataUtils.getspan(num, K_public.K10_ALL_NUMBER),//跨度
							ds:dataUtils.getds(num, K_public.K10_ALL_NUMBER),//大数
							js:dataUtils.getjs(num),//奇数
							zhi:dataUtils.getzhi(num),//质数
							lu:num[0]%3,
							chong: dataUtils.chongtimes(num, lastnote.numbers),
							lian:dataUtils.getlian(num,K_public.K10_ALL_NUMBER,4)  //连续的背景色改变
						});
				 	}else if(gameArray.playname[n]==K12NAME){
				 		if(gameArray.maindata[n].length==K_public.MAX_PAGE*K_public.MAX_ROWCOUNT-1)	gameArray.maindata[n].shift();
				 		var q =0;
						if(termlist.data[i].term_code.slice(0, 4)!=lastnote.term.slice(0, 4)) q = 1;
						var num =[];
						for(var j = 0;j<K_public.K12_WIN_NUMBER;j++)
							num.push(parseInt(s.substring(j*2, j*2+2)));
				 		gameArray.maindata[n].push({				//走势图用到的大部分数据
				 			day:q,
							sum: dataUtils.sumValue(num),  //和值
							span:dataUtils.getspan(num, K_public.K12_ALL_NUMBER),//跨度
							ds:dataUtils.getds(num, K_public.K12_ALL_NUMBER),//大数
							js:dataUtils.getjs(num),//奇数
							zhi:dataUtils.getzhi(num),//质数
							lu:num[0]%3,
							chong: dataUtils.chongtimes(num, lastnote.numbers),
							lian:dataUtils.getlian(num,K_public.K12_ALL_NUMBER,4)  //连续的背景色改变
						});
				 	}
				}catch(e){//TODO handle the exception
					console.error(termlist.data[i].term_code+"期短周期数据有误");
					var num = [];
				}
				if(mainnote[n].length==K_public.MAX_PAGE*K_public.MAX_ROWCOUNT-1) mainnote[n].shift();
				if(gameArray.playname[n]==XYCNAME) mainnote[n].push({term: termlist.data[i].term_code, numbers1: num1,numbers2: num2, yearmonth: termlist.data[i].month_id});
				else mainnote[n].push({term: termlist.data[i].term_code, numbers: num, yearmonth: termlist.data[i].month_id});
				lastnote = mainnote[n][mainnote[n].length-1];
			}
			console.info("取到了"+termlist.data.length+"期数据！");
			if(termlist.data.length>0){
				gameArray.todaynote[n] = dataUtils.getbefore(mainnote[n],0);
				if(gameArray.playname[n]==K2NAME){
					yestonote_k2 = dataUtils.getbefore(mainnote[n],1);
					weichustr_k2 = countweichu_k2(mainnote[n]);
				}else if(gameArray.playname[n]==K3NAME){
					yestonote_k3 =  dataUtils.getbefore(mainnote[n],1);
					weichustr_k3 = [];
					for(var i=0;i<3;i++) weichustr_k3.push(dataUtils.countweichu(mainnote[n],i+1,gameArray.todaynote[gameArray.playname.indexOf(K3NAME)]));
				}else if(gameArray.playname[n]==K10NAME)	mainhui = dataUtils.getallhui(mainnote[n]);//回摆的299条完全统计
				addnote[n] = mainnote[n].slice(0-mainnote[n].length,1-K_public.MAX_PAGE*K_public.MAX_ROWCOUNT);
				mainnote[n] = mainnote[n].slice(1-K_public.MAX_PAGE*K_public.MAX_ROWCOUNT);
				return true;
			}
		}else{
			console.error(gameArray.playname[n]+"_"+lastnote.yearmonth+"_"+lastnote.term+"新的短周期数据出错！/term/getSpNewTerms："+termlist.result);
		}
		return false;
	},
	loadDataK10: function() { //快乐10分开奖号码数据
		console.log("********************取快乐10分数据！********************");
		if(debugflag!=0)	var termlist=JSON.parse(webApi.invoke("/term/getSpPlayData",K10NAME+"_300"));		
		else var termlist = dataUtils.getdata(K_public.K10_WIN_NUMBER,K_public.K10_ALL_NUMBER,"k");
		var thenote =[],lastnum = []; 
		if(termlist&&termlist.result){
			for(var i=termlist.data.length-1;i>=0;i--){
				var s = termlist.data[i].play_code;
				try{
					var num =[];
					for(var j = 0;j<K_public.K10_WIN_NUMBER;j++)
						num.push(parseInt(s.substring(j*2, j*2+2)));
				}catch(e){//TODO handle the exception
					console.error(termlist.data[i].term_code+"期K10数据有误");
					var num = [];
				}
				if(i<K_public.MAX_PAGE*K_public.MAX_ROWCOUNT-1) {
					var q =0;
					if(thenote.length>0&&termlist.data[i].term_code.slice(0, 4)!=thenote[thenote.length-1].term.slice(0, 4)) q = 1;
					else if(thenote.length==0&&termlist.data[i].term_code.slice(0, 4)=="001")  q = 1;
					gameArray.maindata[gameArray.playname.indexOf(K10NAME)].push({				//走势图用到的大部分数据
			 			day:q,
						sum: dataUtils.sumValue(num),  //和值
						span:dataUtils.getspan(num, K_public.K10_ALL_NUMBER),//跨度
						ds:dataUtils.getds(num, K_public.K10_ALL_NUMBER),//大数
						js:dataUtils.getjs(num),//奇数
						zhi:dataUtils.getzhi(num),//质数
						lu:num[0]%3,
						chong: dataUtils.chongtimes(num, lastnum),
						lian:dataUtils.getlian(num, K_public.K10_ALL_NUMBER,4)  //连续的背景色改变
					});
				}
				lastnum = num;
				thenote.push({term: termlist.data[i].term_code, numbers: num, yearmonth: termlist.data[i].month_id});
			}
			if(termlist.data.length==0){
				console.error("快乐10分没有数据！");
				layer.alert("开奖公告数据出错！错误编号000-1："+K10NAME, {icon: 5,btn: [], closeBtn:0});
			}
		}else{
			console.error("K10全部数据出错！/term/getSpPlayData："+K10NAME+"："+termlist.result);
			layer.alert("开奖公告数据出错！错误编号000-0："+K10NAME, {icon: 5,btn: [], closeBtn:0});
		}
		gameArray.todaynote[gameArray.playname.indexOf(K10NAME)] = dataUtils.getbefore(thenote,0);
		addnote[gameArray.playname.indexOf(K10NAME)] = thenote.slice(0-thenote.length,1-K_public.MAX_PAGE*K_public.MAX_ROWCOUNT);
		mainhui = dataUtils.getallhui(thenote);//回摆的299条完全统计
		return  thenote.slice(1-K_public.MAX_PAGE*K_public.MAX_ROWCOUNT);	//去掉多余部分
	},
	loadDataK12: function() { //快乐12开奖号码数据
		console.log("********************取快乐12数据！********************");
		if(debugflag!=0)	var termlist=JSON.parse(webApi.invoke("/term/getSpPlayData",K12NAME+"_300"));		
		else var termlist = dataUtils.getdata(K_public.K12_WIN_NUMBER,K_public.K12_ALL_NUMBER,"k");
		var thenote =[],lastnum = []; 
		if(termlist&&termlist.result){
			for(var i=termlist.data.length-1;i>=0;i--){
				var s = termlist.data[i].play_code;
				try{
					var num =[];
					for(var j = 0;j<K_public.K12_WIN_NUMBER;j++)
						num.push(parseInt(s.substring(j*2, j*2+2)));
				}catch(e){//TODO handle the exception
					console.error(termlist.data[i].term_code+"期K12数据有误");
					var num = [];
				}
				if(i<K_public.MAX_PAGE*K_public.MAX_ROWCOUNT-1) {
					var q =0;
					if(thenote.length>0&&termlist.data[i].term_code.slice(0, 4)!=thenote[thenote.length-1].term.slice(0, 4)) q = 1;
					else if(thenote.length==0&&termlist.data[i].term_code.slice(0, 4)=="001")  q = 1;
					gameArray.maindata[gameArray.playname.indexOf(K12NAME)].push({				//走势图用到的大部分数据
			 			day:q,
						sum: dataUtils.sumValue(num),  //和值
						span:dataUtils.getspan(num, K_public.K12_ALL_NUMBER),//跨度
						ds:dataUtils.getds(num, K_public.K12_ALL_NUMBER),//大数
						js:dataUtils.getjs(num),//奇数
						zhi:dataUtils.getzhi(num),//质数
						chong: dataUtils.chongtimes(num, lastnum),
						lian:dataUtils.getlian(num, K_public.K12_ALL_NUMBER, 4)  //连续的背景色改变
					});
				}
				lastnum = num;
				thenote.push({term: termlist.data[i].term_code, numbers: num, yearmonth: termlist.data[i].month_id});
			}
			if(termlist.data.length==0){
				console.error("快乐12没有数据！");
				layer.alert("开奖公告数据出错！错误编号000-1："+K12NAME, {icon: 5,btn: [], closeBtn:0});
			}
		}else{
			console.error("K12全部数据出错！/term/getSpPlayData："+K12NAME+"："+termlist.result);
			layer.alert("开奖公告数据出错！错误编号000-0："+K12NAME, {icon: 5,btn: [], closeBtn:0});
		}
		gameArray.todaynote[gameArray.playname.indexOf(K12NAME)] = dataUtils.getbefore(thenote,0);
		addnote[gameArray.playname.indexOf(K12NAME)] = thenote.slice(0-thenote.length,1-K_public.MAX_PAGE*K_public.MAX_ROWCOUNT);
		return  thenote.slice(1-K_public.MAX_PAGE*K_public.MAX_ROWCOUNT);	//去掉多余部分
	},
	loadDataK2: function() { //短周期开奖号码数据
		console.log("********************取K2数据！********************");
		if(debugflag!=0)
			var termlist=JSON.parse(webApi.invoke("/term/getSpPlayData",K2NAME+"_400"));
		else var termlist = dataUtils.getdata(K_public.K2_WIN_NUMBER,K_public.K2_ALL_NUMBER);
		var thenote =[];
		if(termlist&&termlist.result){
			for(var i=termlist.data.length-1;i>=0;i--){
				try{
				 	var num = [parseInt(termlist.data[i].play_code.substring(0, 2))];
				}catch(e){//TODO handle the exception
					console.error(termlist.data[i].term_code+"期K2数据有误");
					var num = [];
				}
				thenote.push({term: termlist.data[i].term_code, numbers: num, yearmonth: termlist.data[i].month_id});
			}
			if(termlist.data.length==0){
				console.error("快2没有数据！");
				layer.alert("开奖公告数据出错！错误编号000-1："+K2NAME, {icon: 5,btn: [], closeBtn:0});
			}
		}else{
			console.error("K2全部数据出错！/term/getSpPlayData|"+K2NAME+"："+termlist.result);
			layer.alert("开奖公告数据出错！错误编号000-0："+K2NAME, {icon: 5,btn: [], closeBtn:0});
		}
		gameArray.todaynote[gameArray.playname.indexOf(K2NAME)] = dataUtils.getbefore(thenote,0);
		yestonote_k2 = dataUtils.getbefore(thenote,1);
		weichustr_k2 = countweichu_k2(thenote);
		addnote[gameArray.playname.indexOf(K2NAME)] = thenote.slice(0-thenote.length,1-K_public.MAX_PAGE*K_public.MAX_ROWCOUNT);
		return  thenote.slice(1-K_public.MAX_PAGE*K_public.MAX_ROWCOUNT);//去掉多余部分
	},
	loadDataK3: function() { //K3开奖号码数据
		console.log("********************取所有K3数据！********************");
		if(debugflag!=0)
			var termlist=JSON.parse(webApi.invoke("/term/getSpPlayData",K3NAME+"_400"));		
		else var termlist = dataUtils.getdata(K_public.K3_WIN_NUMBER,K_public.K3_ALL_NUMBER);
		var thenote =[]; 
		if(termlist&&termlist.result){
			for(var i=termlist.data.length-1;i>=0;i--){
				var s = termlist.data[i].play_code;
				try{
					var num = [];
					for(var j = 0;j<K_public.K3_WIN_NUMBER;j++)
						num.push(parseInt(s.substring(j*2, j*2+2)));
				}catch(e){//TODO handle the exception
					console.error(termlist.data[i].term_code+"期K3数据有误");
					var num = [];
				}
				if(i<K_public.MAX_PAGE*K_public.MAX_ROWCOUNT-1){
					var q =0;
					if(thenote.length>0&&termlist.data[i].term_code.slice(0, 4)!=thenote[thenote.length-1].term.slice(0, 4)) q = 1;
					else if(thenote.length==0&&termlist.data[i].term_code.slice(0, 4)=="001")  q = 1;
					gameArray.maindata[gameArray.playname.indexOf(K3NAME)].push({				//走势图用到的大部分数据
			 			day:q,
						sum: dataUtils.sumValue(num),  //和值
						span:dataUtils.getspan(num, K_public.K3_ALL_NUMBER),//跨度
						ds:dataUtils.getds(num, K_public.K3_ALL_NUMBER),//大数
						js:dataUtils.getjs(num),//奇数
						zhi:dataUtils.getzhi(num),//质数
						lu:num[0]%3,
						rbt:dataUtils.getrbt(num),
						form:dataUtils.getcolor(num,K_public.haslx)
					});
				}
				thenote.push({term: termlist.data[i].term_code, numbers: num, yearmonth: termlist.data[i].month_id});
			}
			if(termlist.data.length==0){
				console.error("快3没有数据！");
				layer.alert("开奖公告数据出错！错误编号000-1："+K3NAME, {icon: 5,btn: [], closeBtn:0});
			}
		}else{
			console.error("K3全部数据出错！/term/getSpPlayData："+K3NAME+"："+termlist.result);
			layer.alert("开奖公告数据出错！错误编号000-0："+K3NAME, {icon: 5,btn: [], closeBtn:0});
		}
		yestonote_k3 =  dataUtils.getbefore(thenote,1);
		gameArray.todaynote[gameArray.playname.indexOf(K3NAME)] = dataUtils.getbefore(thenote,0);
		weichustr_k3 = [];
		for(var i=0;i<3;i++) weichustr_k3.push(dataUtils.countweichu(thenote,i+1,gameArray.todaynote[gameArray.playname.indexOf(K3NAME)]));
		addnote[gameArray.playname.indexOf(K3NAME)] = thenote.slice(0-thenote.length,1-K_public.MAX_PAGE*K_public.MAX_ROWCOUNT);
		return  thenote.slice(1-K_public.MAX_PAGE*K_public.MAX_ROWCOUNT);	//去掉多余部分
	},
	loadDataxyc: function() { //幸运彩开奖号码数据
		console.log("********************取所有幸运彩数据！********************");
		if(debugflag!=0)
			var termlist=JSON.parse(webApi.invoke("/term/getSpPlayData",XYCNAME+"_300"));		
		else var termlist = dataUtils.getxycdata();
		var thenote =[]; 
		if(termlist&&termlist.result){
			if(termlist.data.length==0){
				console.error("幸运彩没有数据！");
				layer.alert("开奖公告数据出错！错误编号000-1："+XYCNAME, {icon: 5,btn: [], closeBtn:0});
			} else{
				for(var i=termlist.data.length-1;i>=0;i--){
					var num1=[],num2=[];
					var s = termlist.data[i].play_code;
					try{
						for(var j = 0;j<3;j++){
							num1.push(parseInt(s.substring(j*2, j*2+2)));
							num2.push(parseInt(s.substring(j*2+6, j*2+8)));
						}
					}catch(e){//TODO handle the exception
						console.error(termlist[i].term_code+"期幸运彩数据有误");
						var num1 = [],num2 = [];
					}
					if(i<K_public.MAX_PAGE*K_public.MAX_ROWCOUNT-1){//console.log(termlist.data.length);console.log(i);console.log(thenote.length);
						var q =0;
						if(thenote.length>0&&termlist.data[i].term_code.slice(0, 4)!=thenote[thenote.length-1].term.slice(0, 4)) q = 1;
						else if(thenote.length==0&&termlist.data[i].term_code.slice(0, 4)=="001")  q = 1;
						gameArray.maindata[gameArray.playname.indexOf(XYCNAME)].push({				//走势图用到的大部分数据
							day:q,
							sum1: dataUtils.sumValue(num1),  //和值
							sum2: dataUtils.sumValue(num2), 
							ds:dataUtils.getds(num2, 10),//大数
							js:dataUtils.getjs(num2),//奇数
							form:dataUtils.getcolor(num1,false)
						});
					}
					thenote.push({term: termlist.data[i].term_code, numbers1: num1, numbers2: num2, yearmonth: termlist.data[i].month_id});
				}
			}
		}else{console.error("幸运彩全部数据出错！/term/getSpPlayData|"+XYCNAME+"："+termlist.result);
			layer.alert("开奖公告数据出错！错误编号000-0："+XYCNAME, {icon: 5,btn: [], closeBtn:0});}
		gameArray.todaynote[gameArray.playname.indexOf(XYCNAME)] = dataUtils.getbefore(thenote,0);
		addnote[gameArray.playname.indexOf(XYCNAME)] = thenote.slice(0-thenote.length,1-K_public.MAX_PAGE*K_public.MAX_ROWCOUNT);
		return  thenote.slice(1-K_public.MAX_PAGE*K_public.MAX_ROWCOUNT);	//去掉多余部分
	},
	getcountime:function(n){console.log("********************取新期！"+gameArray.playname[n]);
		if(debugflag!=0) var termendtime=JSON.parse(webApi.invoke("/term/getMaxSpTerm",gameArray.playname[n]));
			else var termendtime={result:true,data:{
				term_code:dataUtils.gettodayMMdd()+"025",
				term_end_datetime:gameArray.playname[n]==K2NAME?dataUtils.getlocalTime(9,50):dataUtils.getlocalTime(1,30),
				only_encash_term_flag:0}
			};
		if(termendtime&&termendtime.result){
			try{
				termendtime=termendtime.data;
				gameArray.newterm[n].endtime=termendtime.term_end_datetime.replace(/-/g,"").replace(/:/g,"").replace(/ /g,"");//yyyyMMddHHmmss
				gameArray.newterm[n].encashFlag=termendtime.only_encash_term_flag;
				gameArray.newterm[n].termcode=termendtime.term_code;
			}catch(e){//TODO handle the exception
				gameArray.newterm[n]="20150101000000";
				gameArray.newterm[n].termcode="000000";
				console.error("没有新期数据！！"+e);
			}
			return dataUtils.getDate2(gameArray.newterm[n].endtime, n);
		}else{
			console.error(gameArray.playname[n]+"取新期出错！！/term/getMaxSpTerm"+termendtime.result);
			layer.alert("新期数据出错！错误编号100-0："+gameArray.playname[n], {icon: 5,btn: [], closeBtn:0});
		}
	},
	getDate2:function(endtime,n){
		if(endtime=="") return dataUtils.getcountime(n);
		try{
			endtime = endtime.substring(0,4)+"/"+endtime.substring(4,6)+"/"+endtime.substring(6,8)+" "
						+endtime.substring(8,10)+":"+endtime.substring(10,12)+":"+endtime.substring(12,14);
			endtime = new Date(endtime);
		}catch(e){//TODO handle the exception
			console.error("计算倒计时出错");
			return 0-gameArray.getTermTime[n];
		}
		var now_date =new Date();
		return (endtime.getTime()-now_date.getTime())/1000;
	},
	getlocalTime:function(min,sec){
		var t =new Date().getTime();
		var s= new Date(t+(min*60+sec)*1000);
		var ll= s.toLocaleDateString().replace(/\//g, "-").replace(/[^0-9]/ig,"")+ " " + s.toTimeString().substr(0, 8);
		if(s.getMonth()<9) ll=ll.slice(0,4)+"0"+ll.slice(4);
		if(s.getDate()<10) ll=ll.slice(0,6)+"0"+ll.slice(6);
		return ll;
	},
	fullNum:function(num,len){
		if(num instanceof Array){
			var arr=[];
			for(var i in num)
				arr.push(dataUtils.fullNum(num[i],len)); 
			return arr;
		} 
		num="00000000000000"+num;
		var rst="";
		for(var i=1; i<=len; i++){
			rst=num[num.length-i].toString()+rst;
		}
		return rst;
	},
	countyilou:function(n, yilouData){//console.log(ALLview.datanum[n]+"&"+n);console.log(ALLview.yilounum[n]);
		var numarr = ALLview.yilounum[n].split("|"); //console.log(yilouData[ALLview.datanum[n]]);
		var cur = "", max = "";
		for(var i in numarr){
			if(numarr[i]!="") numarr[i] = parseInt(numarr[i]);
				else continue;
			if(i < numarr.length-1){
				cur += yilouData[ALLview.datanum[n]][numarr[i]].cur_val+",";
				max += yilouData[ALLview.datanum[n]][numarr[i]].max_val+",";
			}else{
				cur += yilouData[ALLview.datanum[n]][numarr[i]].cur_val;
				max += yilouData[ALLview.datanum[n]][numarr[i]].max_val;
			} 
		}
		return {cur_yilou:cur,
				max_yilou:max};
	},
	getmaxyilou:function(){ //获取所有图的遗漏
		var yilouData = [];
		var yilouList = [];
		for(var i=0;i<gameArray.playname.length;i++){ //所有玩法的遗漏数据
			var yilouresult;
			if(debugflag!=0) yilouresult =JSON.parse(webApi.invoke("/term/getYilou",gameArray.playname[i]));
			else yilouresult = dataUtils.testyilou(gameArray.playname[i]);
			if(yilouresult&&yilouresult.result){
				if(yilouresult.data.length>0)
					yilouData.push(yilouresult.data);
				else {
					yilouData.push([]);
					console.error(gameArray.playname[i]+"遗漏为空/term/getYilou"+yilouresult.result);
					layer.alert("遗漏数据出错！错误编号200-1："+gameArray.playname[i], {icon: 5,btn: [], closeBtn:0});
					break;
				}
			}else{
				console.error(gameArray.playname[i]+"组装遗漏时出错/term/getYilou"+yilouresult.result);
				layer.alert("遗漏数据出错！错误编号200-0："+gameArray.playname[i], {icon: 5,btn: [], closeBtn:0});
				break;
			}
		}
		for(var i in ALLview.htmlname){
			try{
				if(i<ALLview.htmlname.length-1)
					yilouList.push(dataUtils.countyilou(i,yilouData));
			}catch(e){//TODO handle the exception
				yilouList.push([]);
				console.error(ALLview.yilounum[i]+"_"+ALLview.htmlname[i]+"遗漏数据出错或缺失"+e);
				layer.alert(ALLview.htmlname[i]+"遗漏数据出错！错误编号200-2", {icon: 5,btn: [], closeBtn:0});
				break;
			}
			
		}
		var inde = gameArray.playname.indexOf(K3NAME);
		if(inde>=0){
			thissant={ //56注号码遗漏走势图
				cur_yilou: yilouData[inde][7].cur_val+","+yilouData[inde][3].cur_val+","+yilouData[inde][6].cur_val+","+yilouData[inde][1].cur_val+","+yilouData[inde][5].cur_val
								+","+yilouData[inde][4].cur_val+","+yilouData[inde][0].cur_val+","+yilouData[inde][2].cur_val+","+yilouData[inde][10].cur_val+","+yilouData[inde][9].cur_val,
				max_yilou: yilouData[inde][7].max_val+","+yilouData[inde][3].max_val+","+yilouData[inde][6].max_val+","+yilouData[inde][1].max_val+","+yilouData[inde][5].max_val
								+","+yilouData[inde][4].max_val+","+yilouData[inde][0].max_val+","+yilouData[inde][2].max_val+","+yilouData[inde][10].max_val+","+yilouData[inde][9].max_val,
				times_val: yilouData[inde][7].times_val+","+yilouData[inde][3].times_val+","+yilouData[inde][6].times_val+","+yilouData[inde][1].times_val+","+yilouData[inde][5].times_val
								+","+yilouData[inde][4].times_val+","+yilouData[inde][0].times_val+","+yilouData[inde][2].times_val+","+yilouData[inde][10].times_val+","+yilouData[inde][9].times_val
			};
		}
		return yilouList;
	},
	getdata:function(n,m,flag,ff){//测试
		var size = flag=="long"?K_public.MAX_PAGE*K_public.MAX_ROWCOUNT-1:K_public.MAX_PAGE*K_public.MAX_ROWCOUNT+100;
		var l="";var data = [];var str ="";
		dataUtils.yearterm=0;
		dataUtils.todayterm=49;
		for(var i=0;i<size;i++){
			if(ff=="b001") str = dataUtils.getNumcodeStr(6,m,false,false)+ dataUtils.getNumcodeStr(1,16,false,false);
			else if(ff=="s3") str = dataUtils.getNumcodeStr(n,m,true,true);
			else if(flag=="k") str = dataUtils.getNumcodeStr(n,m,false,false);
			else str = dataUtils.getNumcodeStr(n,m,true,false);
			if(flag=="long")	l = {term_code:dataUtils.getlongTerm(),play_code:str};
			else l = {term_code:dataUtils.getterm(),play_code:str,month_id:201703};
			data.push(l);
		}
		if(flag=="long") return {result:true,
				data:data.reverse()};
		else return {result:true,
				data:data};
	},
	getNumcodeStr:function(selectnum,allnum,canRepeat,hasZero){
		var num=[],str ="";
		while(num.length < selectnum){
			var t = hasZero?getRandom(0, allnum-1):getRandom(1, allnum);
			if(canRepeat||num.indexOf(t)<0) {
				num.push(t);
				if(t<10) t="0"+t;
				str = str + t;
			}
		}
		return str;
	},
	getxycdata:function(){
		var size =  K_public.MAX_PAGE*K_public.MAX_ROWCOUNT;
		var l="";var data = [];var str ="";
		dataUtils.todayterm=49;
		for(var i=0;i<size;i++){
			var num=[];str ="";
			l = {term_code:dataUtils.getterm(),play_code:dataUtils.getNumcodeStr(3,3,true,true)+dataUtils.getNumcodeStr(3,10,false,false),month_id:201703};
			data.push(l);
		}
		return {result:true,
			data:data};
	},
	getterm:function(){//测试
		var term_str = "";
		if(dataUtils.todayterm<1){
			dataUtils.todayterm = 75;
			dataUtils.yearterm++;
		}
		if(dataUtils.todayterm<10)	term_str = "00"+dataUtils.todayterm;
		else if(dataUtils.todayterm<100) term_str = "0"+dataUtils.todayterm;
			else term_str = ""+dataUtils.todayterm;
		var d = new Date();
		d = new Date(d.getTime() - (dataUtils.yearterm*24)*60*60*1000);  //前一天
		var MM = d.getMonth() + 1;
		if (MM < 10) MM = '0' + MM;
		var dd = d.getDate();
		if (dd < 10) dd = '0' + dd;
		term_str = MM +""+ dd + term_str;
		dataUtils.todayterm --;
		return term_str;
	},
	getlongTerm:function(){ //计算本次长周期
		var d = new Date();
		dataUtils.yearterm ++;
		if(dataUtils.yearterm<10)	term_str = "00"+dataUtils.yearterm;
		else if(dataUtils.yearterm<100) term_str = "0"+dataUtils.yearterm;
			else term_str = ""+dataUtils.yearterm;
		if(dataUtils.yearterm>184) term_str = d.getFullYear()-1+ term_str;//console.log(term_str);
		else term_str = d.getFullYear()+ term_str;
		return term_str;
	},
	todayterm:49,
	yearterm:0,
	getcolor:function(warr,lx){
		var nn = 0;
		for (var i = 0; i < warr.length; i++) {
			nn = Math.max(nn, dataUtils.match(warr[i], warr));
		}
		if(lx&&dataUtils.islx(warr)&&warr.length==3)
			nn = 0;
		return nn;
	},
	islx: function(warr){
		arr2=[warr[0],warr[1],warr[2]];
		arr2.sort(function(a, b) {
			return a - b
		});
		if (arr2[0] + 1 == arr2[1] && arr2[1] + 1 == arr2[2])
			return true;
		else return false;
	},
	sumValue:function(winnum){//求和值
		var sum = 0;
		for (var i = 0; i < winnum.length; i++) {
			sum += winnum[i];
		}
		return sum;
	},
	getjs:function(winnum){//求奇数
		var j = 0;
		for (var i = 0; i < winnum.length; i++) {
			if (winnum[i] % 2 != 0) j++;
		}
		return j;
	},
	getds:function(winnum,n){//求大数
		var d = 0;
		if (winnum) {
			for (var i = 0; i < winnum.length; i++) {
				if (winnum[i] > n/2) d++;
			}
		}
		return d;
	},
	getzhi:function(winnum){//求质数，包括1
		var z = 0;
		var zhi =[1,2,3,5,7,11,13,17,19,23,29,31];
		try {
			if (winnum) {
				for (var i = 0; i < winnum.length; i++) {
					if (zhi.indexOf(winnum[i])>=0) z++;
				}
			}
		} catch (error) {}
		return z;
	},
	getspan:function(winnum,n){//求跨度
		var min = n;
		var max = 0;
		for (var i = 0; i < winnum.length; i++) {
			min = Math.min(winnum[i],min);
			max = Math.max(winnum[i],max);
		}
		return max-min;
	},
	getrbt:function(winnum){   //算出改开奖号码出现的二不同组合 123就是 12 13 23，122就是22,222就是空
		var o = new Array(winnum[0],winnum[1],winnum[2]);
		o.sort()
		var reg = /(.)(?=.*\1)/g;
        var result = o.join("").replace(reg, "");	//去重
        if(result.length==3)
			return new Array(parseInt(result.substr(0,2)),parseInt(result.substr(1,2)),parseInt(result.charAt(0)+result.charAt(2)));
		else if(result.length==2)
			return new Array(o[1]*11,parseInt(result));
		else return [o[0]*11];
	},
	getallhui:function(note){
		var arr =[],lastnum=[];
		for(var i = 0; i < note.length; i++){
			if(note.length-i<K_public.MAX_PAGE*K_public.MAX_ROWCOUNT){
				arr.push(dataUtils.gethui(arr,note[i].numbers,lastnum));
			}
			lastnum=note[i].numbers;
		}
		return arr;
	},
	gethui:function(arr, n1, n2){//win1这次号码，win2上次号码
		var win1 = n1[0];
		var win2 = n2.length==0?0:n2[0];
		var a = new Array(3);
		if(win1>win2)	var hui = 0;
		else if(win1==win2)	var hui = 1;
		else var hui = 2;
		for (var i = 0; i < a.length; i++) {
			if(hui==i){
				if(arr.length==0){
					a[i]= -1;
				}else{
					if(arr[arr.length - 1][i]>0)
						a[i] = -1;
					else a[i] = arr[arr.length - 1][i]-1;
				}
			} else {
				if(arr.length==0){
					a[i]= 1;
				}else{
					if(arr[arr.length - 1][i]<0)
						a[i] = 1;
					else a[i] = arr[arr.length - 1][i] + 1;
				}
			}
		}
		return a;
	},
	chongtimes:function(w1,w2){ //重号
		var c=0;
		for(var i in w1){
			if(w2.indexOf(w1[i])>=0) c++;
		}
		return c;
	},
	match:function(n,number){//该号码在数组中出现次数
		var x = 0;
		for (var i = 0; i < number.length; i++) {
			if (n == number[i])
				x++;
		}
		return x;
	},
	checkNumWin:function(note,n){//中奖号码本页最大出现次数
		var count = 0;
		for(var i=0;i<note.length;i++){
			count = count+dataUtils.match(n+1,note[i].numbers);
		}
		return count;
	},
	checkWin:function(arr,n,page){//本页最大出现次数
		var b = 0;
		if(page!=null)	arr=dataUtils.getarr(arr,page);
		for (var i = 0; i < arr.length; i++) {
			if(arr[i][n]<=0) b++;
		}
		return b;
	},
	checkWin2:function(arr,n,tonumber){//倒数多少个的出现次数
		var b = 0;
		if(tonumber!=null) {
			if(tonumber==0) arr=[];
			else arr=arr.slice(0-tonumber);
		}
		for (var i = 0; i < arr.length; i++) {
			if(arr[i][n]<=0) b++;
		}
		return b;
	},
	checkMiss:function(arr,n,max_yilou){//本页最大遗漏次数
		var c = 0;
		for (var i = 0; i < arr.length; i++)
			c = Math.max(c, arr[i][n]);
		if(max_yilou)	return Math.max(c, parseInt(max_yilou[n]));
		return c;
	},
	checkCon:function(arr,n){//本页最大连续次数
		var d = 0;
		var max = 0;
		for (var i = 0; i < arr.length; i++) {
			if (arr[i][n] <= 0) {
				d++;
			} else {
				max = Math.max(d, max);
				d = 0;
			}
		}
		max = Math.max(d, max);
		return max;
	},
	getDiagram:function(arr, winnum,n,st){//本次的中奖分布图
		var start = st?st:0;
		var a = new Array(n);
		for (var i = 0; i < n; i++) {
			if (winnum.indexOf(i+1)>=0) {
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
	},
	getTrend:function(arr, val, size,st){	//单连线
		var start = st?st:0;
		var a = new Array(size);
		for (var i = 0; i < size; i++) {
			if(i==val){
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
	},
	gettodayMMdd:function(){//今天的交易日月日
		var d = new Date();
		var hh = d.getHours();
		if(hh<K_public.cut)
			d = new Date(d.getTime() - 24*60*60*1000);  //前n天
		var MM = d.getMonth() + 1;
		if (MM < 10) MM = '0' + MM;
		var dd = d.getDate();
		if (dd < 10) dd = '0' + dd;
		return MM +""+ dd ;
	},
	getbefore:function(mnote, n){//之前第几个交易日的数据
		var b = [];
		var MMdd = dataUtils.getMMdd(mnote);
		var thatday="";
		if(n>0)
			thatday=dataUtils.gettodayMMdd()==MMdd[0]?MMdd[n]:MMdd[n-1];
		else thatday=dataUtils.gettodayMMdd();
		for (var i = 0; i < mnote.length; i++) {
			if (mnote[i].term.slice(0, 4) == thatday) {
				b.push(mnote[i]);
			}
		}
		return b;
	},
	getMMdd:function(mainnote){
		var th =mainnote[mainnote.length-1].term.substring(0, 4);
		var b =[];
		b.push(th);
		for (var i = mainnote.length-1; i>=0; i--){
			if (mainnote[i].term.substring(0, 4) != th) {
				b.push(mainnote[i].term.substring(0, 4));
				th =mainnote[i].term.substring(0, 4);
			}
		}
		return b;
	},
	getarr:function(arr, n, max_page, max_rowcount){//某一页的数据
		if (n == max_page - 1)
			return arr.slice(n * max_rowcount, (n + 1) * max_rowcount - 1);
		else
			return arr.slice(n * max_rowcount, (n + 1) * max_rowcount);
	},
	jtyichuK2:function(todaynote,m){//获得该组合今日是否已出的颜色 m为该号码组合
		var c = "";
		for (var i = 0; i < todaynote.length; i++) {
			var r = todaynote[i].numbers[0]==22?21:todaynote[i].numbers[0];
			if (r == m)
				return "red";
			else c = "black";
		}
		return c;
	},
	jtyichuK3:function(tonote){//获得该组合今日是否已出
		var c = [];
		for (var i = 0; i < tonote.length; i++) {
			var o=[tonote[i].numbers[0],tonote[i].numbers[1],tonote[i].numbers[2]].sort();
			var r = o[0] * 100 + o[1] * 10 + o[2];
			if (c.indexOf(r)<0)c.push(r);
		}
		return c;
	},
	countweichu:function(mnote,n,todaynote_k3){
		var arr =[];
		for(var i=0;i<n;i++)
			arr = arr.concat(dataUtils.getbefore(mnote,i+1));
		var arr2 = [];
		var str = "";
		for (var i = 0; i < arr.length; i++) {
			var o=[arr[i].numbers[0],arr[i].numbers[1],arr[i].numbers[2]].sort();
			var r = o[0] * 100 + o[1] * 10 + o[2];
			if (arr2.indexOf(r)<0&&K_public.K3_PL.indexOf(r) >= 0) {
				arr2.push(r);//获取几日里已出的
			}
		}
		var count = 0 ;//昨日未出， 两日未出最多限制在20个， 多余的带... 因为太多了会把页面挤下去
		var count3Day = 0;//三日未出最多只能显示10个
		var toarr = dataUtils.jtyichuK3(todaynote_k3);//console.log(arr2);
		//return weichucolor(arr2,toarr);
		for (var i = 0; i < K_public.all56.length; i++) {
			if (arr2.indexOf(K_public.all56[i]) < 0) {
				count++;
				if(count <21){
					var numarr = K_public.all56[i].toString().split("").map(Math.abs); 
					var classname = K_public.CLASS[dataUtils.getcolor(numarr,K_public.haslx)];
					if (n != 3){
						if(toarr.indexOf(K_public.all56[i])>=0){
							str = str + "<span class='line "+classname+"'>" + K_public.all56[i] + "</span>";
						}else str = str + "<span class='" + classname + "'> " + K_public.all56[i] + "</span>";
					}else {
						count3Day++;
						if(count3Day <11){
							var nn=dataUtils.yilou(todaynote_k3,K_public.all56[i].toString(), thissant.cur_yilou.split(",").slice(0,56).map(Math.abs)[i]);;
							//如果号码出现，则当前遗漏的颜色从蓝色变红色
							if(toarr.indexOf(K_public.all56[i])>=0){
								str = str + "<span class='line "+classname+"'>" + K_public.all56[i] + "</span><span class=\"ll\">("+nn+")</span>";
							}else{
								str = str + "<span class='" + classname + "'> " + K_public.all56[i] + "</span><span class=\"ll\">("+nn+")</span>";
							}
						}else{
							 str += "<span style='color:black'>...</span>";
							 break;
						}
					}
				}else{
					str += "<span style='color:black'>...</span>";
					break;
				}
			}
		}
		return str;
	},
	yilou:function(tnote, num,current){
		var y=0;
		for(var i=0;i<tnote.length;i++){
			var l = tnote[i].numbers.join("");
			if(l!=num)	current++;
			else return current;
		}
		return current;
	},
	getNotification:function(){
		console.log("********************获取数据库文字通知数据****************");
		if(debugflag!=0)	var termlist=JSON.parse(webApi.invoke("/term/getNotification",null));
		else var termlist = {result:true,data:[{content:"第一条文字通知",speed:1},{content:"第二条文字通知",speed:1},{content:"第三条文字通知",speed:2}]};
		if(termlist&&termlist.result){
			termlist=termlist.data;
		}else{
			console.error("组装文字通知数据时出错/term/getNotification"+termlist.result);
			termlist=[];
		}
		return termlist==null?[]:termlist;
	},
	getAnalysis:function(arr,n){  //可优化
		var newcor = [];
		var colorArea=[];
		for(var i=0;i<arr.length;i++){
			newcor = [];
			for(var j=0;j<n+1;j++){
				if(arr[i][j]==0){
					if(j-1>=0&&j-2>=0){//左
						if(arr[i][j-1]==0&&arr[i][j-2]==0)
							newcor[j]=2;
					}if(j-1>=0&&j+1<=n){//中
						if(arr[i][j-1]==0&&arr[i][j+1]==0)
							newcor[j]=2;
					}if(j+1<=n&&j+2<=n){//右
						if(arr[i][j+1]==0&&arr[i][j+2]==0)
							newcor[j]=2;
					}if(i-1>=0&&i-2>=0){//上
						if(arr[i-1][j]==0&&arr[i-2][j]==0)
							newcor[j]=2;
					}if(i-1>=0&&i+1<=arr.length-1){//中
						if(arr[i-1][j]==0&&arr[i+1][j]==0)
							newcor[j]=2;
					}if(i+1<=arr.length-1&&i+2<=arr.length-1){//下
						if(arr[i+1][j]==0&&arr[i+2][j]==0)
							newcor[j]=2;
					}if(i-1>=0&&j-1>=0&&i-2>=0&&j-2>=0){//左上
						if(arr[i-1][j-1]==0&&arr[i-2][j-2]==0)
							newcor[j]=2;
					}if(i-1>=0&&j-1>=0&&i+1<=arr.length-1&&j+1<=n){//左上中
						if(arr[i-1][j-1]==0&&arr[i+1][j+1]==0)
							newcor[j]=2;
					}if(i+1<=arr.length-1&&j+1<=n&&i+2<=arr.length-1&&j+2<=n){//右下
						if(arr[i+1][j+1]==0&&arr[i+2][j+2]==0)
							newcor[j]=2;
					}if(i-1>=0&&j+1<=n&&i-2>=0&&j+2<=n){//右上
						if(arr[i-1][j+1]==0&&arr[i-2][j+2]==0)
							newcor[j]=2;
					}if(i-1>=0&&j+1<=n&&i+1<=arr.length-1&&j-1>=0){//右上中
						if(arr[i-1][j+1]==0&&arr[i+1][j-1]==0)
							newcor[j]=2;
					}if(i+1<=arr.length-1&&j-1>=0&&i+2<=arr.length-1&&j-2>=0){//左下
						if(arr[i+1][j-1]==0&&arr[i+2][j-2]==0)
							newcor[j]=2;
					}
					newcor[j] = newcor[j]==2?2:1;
				}else newcor[j]=0;
			}
			colorArea.push(newcor);
		}
		return colorArea;
	},
	getlian:function(winnum,n,m){
		var lx=m?m:3;
		var arr = new Array(n);
		var ll = new Array(n);
		for(var i =0;i<arr.length;i++){
			if(winnum.indexOf(i+1)>=0){
				 arr[i]=i==0?1:arr[i-1]+1;
			}else{
				arr[i] = 0;
				ll[i]=0;
			}
			if(arr[i]==lx){
				for(var j=0;j<arr[i];j++) ll[i-j]=1;
			} else if(arr[i]>lx) ll[i]=1;
			else ll[i]=0;
		}
		return ll;
	},
	testyilou:function(name){ //测试
		var data =[];
		if(name==K2NAME){
			data.push({		//开奖分布区
				cur_val:dataUtils.getcurstr(21,10,20),
				max_val:dataUtils.getmaxstr(21,30,60)
			});
			data.push({		//福禄寿喜
				cur_val:dataUtils.getcurstr(4,1,12),
				max_val:dataUtils.getmaxstr(4,15,35)
			});
			data.push({		//东南西北中
				cur_val:dataUtils.getcurstr(5,1,12),
				max_val:dataUtils.getmaxstr(5,15,35)
			});
		}else if(name==K3NAME){
			data.push({		//0开奖号码分布区 6
				cur_val:dataUtils.getcurstr(6,3,20),
				max_val:dataUtils.getmaxstr(6,20,30),
				times_val:dataUtils.getmaxstr(6,50,80)
			});
			data.push({		//1和值 3~18的统计值
				cur_val:dataUtils.getcurstr(16,1,12),
				max_val:dataUtils.getmaxstr(16,65,105),
				times_val:dataUtils.getmaxstr(16,55,65)
			});
			data.push({		//2奇偶大小，八个
				cur_val:dataUtils.getcurstr(8,2,12),
				max_val:dataUtils.getmaxstr(8,15,35),
				times_val:dataUtils.getmaxstr(8,35,65)
			});
			data.push({		//3二同号单选，30个数
				cur_val:dataUtils.getcurstr(30,0,20),
				max_val:dataUtils.getmaxstr(30,30,60),
				times_val:dataUtils.getmaxstr(30,30,60)
			});
			data.push({		//4二同号复选，6个数
				cur_val:dataUtils.getcurstr(6,0,20),
				max_val:dataUtils.getmaxstr(6,30,50),
				times_val:dataUtils.getmaxstr(6,30,50)
			});
			data.push({		//5二不同号，15个数
				cur_val:dataUtils.getcurstr(15,0,20),
				max_val:dataUtils.getmaxstr(15,30,50),
				times_val:dataUtils.getmaxstr(15,30,50)
			});
			data.push({		//6 三不同号，20个数
				cur_val:dataUtils.getcurstr(20,1,20),
				max_val:dataUtils.getmaxstr(20,30,50),
				times_val:dataUtils.getmaxstr(20,30,50)
			});
			data.push({		//7 三同号，6个数
				cur_val:dataUtils.getcurstr(6,0,20),
				max_val:dataUtils.getmaxstr(6,30,50),
				times_val:dataUtils.getmaxstr(6,30,50)
			});
			data.push({		//8 跨度，6个数
				cur_val:dataUtils.getcurstr(6,1,10),
				max_val:dataUtils.getmaxstr(6,15,25),
				times_val:dataUtils.getmaxstr(6,45,65)
			});
			data.push({		//9三连号通选，
				cur_val:dataUtils.getcurstr(1,0,10),
				max_val:dataUtils.getmaxstr(1,15,25),
				times_val:dataUtils.getmaxstr(1,45,65)
			});
			data.push({		//10三同号通选
				cur_val:dataUtils.getcurstr(1,0,10),
				max_val:dataUtils.getmaxstr(1,15,25),
				times_val:dataUtils.getmaxstr(1,35,45)
			});
			data.push({		//11大数个数，4个数
				cur_val:dataUtils.getcurstr(4,1,10),
				max_val:dataUtils.getmaxstr(4,15,25)
			});
			data.push({		//12奇数个数，4个数
				cur_val:dataUtils.getcurstr(4,1,10),
				max_val:dataUtils.getmaxstr(4,15,25), 
				times_val:dataUtils.getmaxstr(4,35,45)
			});
			data.push({		//13除以3的余数个数，3个数
				cur_val:dataUtils.getcurstr(3,1,10),
				max_val:dataUtils.getmaxstr(3,15,25),
				times_val:dataUtils.getmaxstr(3,35,45)
			});
			data.push({		//14第一位号码 1-6
				cur_val:dataUtils.getcurstr(6,1,15),
				max_val:dataUtils.getmaxstr(6,20,30)
			});
			data.push({		//15第二位号码 1-6
				cur_val:dataUtils.getcurstr(6,1,15),
				max_val:dataUtils.getmaxstr(6,20,30)
			});
			data.push({		//16第三位号码 1-6
				cur_val:dataUtils.getcurstr(6,1,15),
				max_val:dataUtils.getmaxstr(6,20,30)
			});
			data.push({		//17形态总合（三不同、三同、二不同、二同）
				cur_val:dataUtils.getcurstr(4,1,10),
				max_val:dataUtils.getmaxstr(4,15,25), 
				times_val:dataUtils.getmaxstr(4,35,45)
			});
			data.push({		//18和尾 10
				cur_val:dataUtils.getcurstr(10,1,15),
				max_val:dataUtils.getmaxstr(10,20,30)
			});//+++++++++++++++++++
			data.push({		//19和值大中小 3
				cur_val:dataUtils.getcurstr(3,1,15),
				max_val:dataUtils.getmaxstr(3,20,30)
			});
			data.push({		//20和值奇偶 2
				cur_val:dataUtils.getcurstr(2,1,15),
				max_val:dataUtils.getmaxstr(2,20,30)
			});
			data.push({		//21跨度奇偶 2
				cur_val:dataUtils.getcurstr(2,1,15),
				max_val:dataUtils.getmaxstr(2,20,30)
			});
		}else if(name==QYHNAME){
			data.push({		//0开奖号码分布区 20
				cur_val:dataUtils.getcurstr(20,3,20),
				max_val:dataUtils.getmaxstr(20,20,30)
			});
			data.push({		//1顺1
				cur_val:dataUtils.getcurstr(20,1,12),
				max_val:dataUtils.getmaxstr(20,15,35)
			});
			data.push({		//2围2 
				cur_val:dataUtils.getcurstr(20,2,12),
				max_val:dataUtils.getmaxstr(20,15,35)
			});
			data.push({		//3五行 （木火土金水 仁智信义礼）
				cur_val:dataUtils.getcurstr(10,1,20),
				max_val:dataUtils.getmaxstr(10,30,60)
			});
			data.push({		//4方位   东南中西北 
				cur_val:dataUtils.getcurstr(5,1,20),
				max_val:dataUtils.getmaxstr(5,30,50)
			});
			data.push({		//5尾数 0-9
				cur_val:dataUtils.getcurstr(10,1,20),
				max_val:dataUtils.getmaxstr(10,30,50)
			});
		}else if(name==XYCNAME){
			data.push({		//0幸运魔方分局分布区0 1 2（第一局）   0 1 2（第二局）   0 1 2（第三局）
				cur_val:dataUtils.getcurstr(9,6,15),
				max_val:dataUtils.getmaxstr(9,25,45)
			});
			data.push({		//1幸运魔方和值分布 7
				cur_val:dataUtils.getcurstr(7,5,22),
				max_val:dataUtils.getmaxstr(7,25,45)
			});
			data.push({		//13除以3的余数个数，3个数
				cur_val:dataUtils.getcurstr(3,1,10),
				max_val:dataUtils.getmaxstr(3,15,25)
			});
			
			data.push({		//3幸运魔方 三不同号 1个数
				cur_val:dataUtils.getcurstr(1,5,22),
				max_val:dataUtils.getmaxstr(1,25,45)
			});
			data.push({		//4幸运魔方 二同号 3个数
				cur_val:dataUtils.getcurstr(3,1,10),
				max_val:dataUtils.getmaxstr(3,15,25)
			});
			data.push({		//5 勇士争先 开奖号码分布 10个数
				cur_val:dataUtils.getcurstr(10,5,22),
				max_val:dataUtils.getmaxstr(10,25,45)
			});
			data.push({		//6勇士争先 第一局分布10个数
				cur_val:dataUtils.getcurstr(10,5,22),
				max_val:dataUtils.getmaxstr(10,25,45)
			});
			data.push({		//7 勇士争先 第二局分布 10个数
				cur_val:dataUtils.getcurstr(10,5,22),
				max_val:dataUtils.getmaxstr(10,25,45)
			});
			data.push({		//8勇士争先第三局分布10个数
				cur_val:dataUtils.getcurstr(10,5,22),
				max_val:dataUtils.getmaxstr(10,25,45)
			});
			data.push({		//9勇士争先 和值分布  22个数
				cur_val:dataUtils.getcurstr(22,5,22),
				max_val:dataUtils.getmaxstr(22,25,45)
			});
		}else if(name==K10NAME){
			data.push({		//开奖分布区
				cur_val:dataUtils.getcurstr(20,8,6),
				max_val:dataUtils.getmaxstr(20,25,55)
			});
			data.push({		//首位分布区
				cur_val:dataUtils.getcurstr(20,1,12),
				max_val:dataUtils.getmaxstr(20,55,85)
			});
			data.push({		//第二位1-20
				cur_val:dataUtils.getcurstr(20,1,12),
				max_val:dataUtils.getmaxstr(20,55,85)
			});
			data.push({		//第三位1-20
				cur_val:dataUtils.getcurstr(20,1,12),
				max_val:dataUtils.getmaxstr(20,55,85)
			});
			data.push({		//回摆 正向、重合、反号
				cur_val:dataUtils.getcurstr(4,1,4),
				max_val:dataUtils.getmaxstr(4,6,20)
			});
			data.push({		//012路
				cur_val:dataUtils.getcurstr(3,1,4),
				max_val:dataUtils.getmaxstr(3,6,12)
			});
			data.push({		//大小
				cur_val:dataUtils.getcurstr(2,1,4),
				max_val:dataUtils.getmaxstr(2,5,10)
			});
			data.push({		//单双
				cur_val:dataUtils.getcurstr(2,1,4),
				max_val:dataUtils.getmaxstr(2,5,10)
			});
			data.push({		//质合
				cur_val:dataUtils.getcurstr(2,1,4),
				max_val:dataUtils.getmaxstr(2,5,10)
			});
		}else if(name==K12NAME){
			data.push({		//开奖分布区
				cur_val:dataUtils.getcurstr(12,5,6),
				max_val:dataUtils.getmaxstr(12,6,12)
			});
			data.push({		//首位分布区
				cur_val:dataUtils.getcurstr(12,1,12),
				max_val:dataUtils.getmaxstr(12,15,35)
			});
			data.push({		//第二位1-20
				cur_val:dataUtils.getcurstr(12,1,12),
				max_val:dataUtils.getmaxstr(12,15,35)
			});
			data.push({		//第三位1-20
				cur_val:dataUtils.getcurstr(12,1,12),
				max_val:dataUtils.getmaxstr(12,15,35)
			});
			data.push({		//和值
				cur_val:dataUtils.getcurstr(36,10,20),
				max_val:dataUtils.getmaxstr(36,10,35)
			});
		}else if(name=="B001"){
			data.push({		//红球 1-33
				cur_val:dataUtils.getcurstr(33,6,15),
				max_val:dataUtils.getmaxstr(33,95,145)
			});
			data.push({		//蓝球 1-16
				cur_val:dataUtils.getcurstr(16,1,12),
				max_val:dataUtils.getmaxstr(16,95,145)
			});
		}else if(name=="S3"){
			data.push({		//开奖号码分布 0-9
				cur_val:dataUtils.getcurstr(10,3,8),
				max_val:dataUtils.getmaxstr(10,8,20)
			});
			data.push({		//百位分布  0-9
				cur_val:dataUtils.getcurstr(10,1,12),
				max_val:dataUtils.getmaxstr(10,15,35)
			});
			data.push({		//十位分布  0-9
				cur_val:dataUtils.getcurstr(10,1,12),
				max_val:dataUtils.getmaxstr(10,15,35)
			});
			data.push({		//个位分布  0-9
				cur_val:dataUtils.getcurstr(10,1,12),
				max_val:dataUtils.getmaxstr(10,15,35)
			});
		}else if(name=="QL730"){
			data.push({		//开奖号码分布  1-30
				cur_val:dataUtils.getcurstr(30,8,15),
				max_val:dataUtils.getmaxstr(30,15,35)
			});
		}else if(name=="SP61"){
			data.push({		//0第一位 0-9
				cur_val:dataUtils.getcurstr(10,1,15),
				max_val:dataUtils.getmaxstr(10,25,35)
			});
			data.push({		//1第二位 0-9
				cur_val:dataUtils.getcurstr(10,1,15),
				max_val:dataUtils.getmaxstr(10,25,35)
			});
			data.push({		//2第三位 0-9
				cur_val:dataUtils.getcurstr(10,1,15),
				max_val:dataUtils.getmaxstr(10,25,35)
			});
			data.push({		//3第四位 0-9
				cur_val:dataUtils.getcurstr(10,1,15),
				max_val:dataUtils.getmaxstr(10,25,35)
			});
			data.push({		//4第五位 0-9
				cur_val:dataUtils.getcurstr(10,1,15),
				max_val:dataUtils.getmaxstr(10,25,35)
			});
			data.push({		//5第六位 0-9
				cur_val:dataUtils.getcurstr(10,1,15),
				max_val:dataUtils.getmaxstr(10,25,35)
			});
			data.push({		//6生肖位 12
				cur_val:dataUtils.getcurstr(12,1,15),
				max_val:dataUtils.getmaxstr(12,25,35)
			});
			data.push({		//7大 6--
				cur_val:dataUtils.getcurstr(6,3,15),
				max_val:dataUtils.getmaxstr(6,25,35)
			});
			data.push({		//8小 6
				cur_val:dataUtils.getcurstr(6,3,15),
				max_val:dataUtils.getmaxstr(6,25,35)
			});
			data.push({		//9奇 6--
				cur_val:dataUtils.getcurstr(6,3,15),
				max_val:dataUtils.getmaxstr(6,25,35)
			});
			data.push({		//10偶 6
				cur_val:dataUtils.getcurstr(6,3,15),
				max_val:dataUtils.getmaxstr(6,25,35)
			});
			data.push({		//11质 6--
				cur_val:dataUtils.getcurstr(6,3,15),
				max_val:dataUtils.getmaxstr(6,25,35)
			});
			data.push({		//12合 6
				cur_val:dataUtils.getcurstr(6,3,15),
				max_val:dataUtils.getmaxstr(6,25,35)
			});
		}else if(name=="QL515"){
			data.push({		//一区
				cur_val:dataUtils.getcurstr(5,1,15),
				max_val:dataUtils.getmaxstr(5,25,35)
			});
			data.push({		//二区
				cur_val:dataUtils.getcurstr(5,2,15),
				max_val:dataUtils.getmaxstr(5,25,35)
			});
			data.push({		//三区
				cur_val:dataUtils.getcurstr(5,2,15),
				max_val:dataUtils.getmaxstr(5,25,35)
			});
			data.push({		//一区个数
				cur_val:dataUtils.getcurstr(6,1,15),
				max_val:dataUtils.getmaxstr(6,25,35)
			});
			data.push({		//二区个数
				cur_val:dataUtils.getcurstr(6,1,15),
				max_val:dataUtils.getmaxstr(6,25,35)
			});
			data.push({		//三区个数
				cur_val:dataUtils.getcurstr(6,1,15),
				max_val:dataUtils.getmaxstr(6,25,35)
			});
		}
		return {result:true,
			data:data};
	},
	getcurstr:function(size,zero,range){	//测试
		var num=[];
		var arr =new Array(size);
		while(num.length < zero){
			var n = getRandom(0, size-1);
			if(num.indexOf(n)<0) num.push(n);
		}
		for(var i =0;i<size;i++){
			if(num.indexOf(i)<0)	arr[i]= getRandom(1, range);
			else arr[i]= 0;
		}
		return arr.join();
	},
	getmaxstr:function(size,min,max){
		var arr = [];
		for(var i =0;i<size;i++){
			arr.push(getRandom(min, max));
		}
		return arr.join();
	}
}; //参数，注意参数名要注意和后台方法参数名要一致
//生成一定范围的随机数
function getRandom(x, y) {
	y = y + 1;
	return parseInt(y - Math.random() * (y - x), 10);
}
