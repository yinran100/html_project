//若有复选，存在首位为0不保存的bug
String.prototype.getBytesLength = function() {				//获取字符串字节数
	return this.replace(/[^\x00-\xff]/gi, "--").length;
} 
var K_public = parent.K_public;
var console = parent.console;
var webApi = parent.webApi;
var hasNoFlag = K_public.hasNoFlag;	//有没有默认视图为no的选项
var spLastview = 0;
var MAX_CONTEXT=2;
var sp_play = parent.person_setting.sp_playEname;
var playCodeNum= hasNoFlag?(parent.person_setting.playCode=="NO"?0:(Math.max(parent.gameArray.playname.indexOf(parent.person_setting.playCode),0)+1)):Math.max(parent.gameArray.playname.indexOf(parent.person_setting.playCode),0); //玩法
var playView=parent.person_setting.playview; //视图
var showPage=parent.person_setting.showpage-1; //第几页显示
var showStation=parent.person_setting.showstation; //站点显示
var showVersion=parent.person_setting.showversion; //版本显示
var showYilou=parent.person_setting.showyilou;//号码间是否显示遗漏
var skinStyle = parent.person_setting.skinStyle; //界面风格
var fupingviewNum= Math.max(K_public.CS_name.indexOf(parent.person_setting.fupingview),0); //副屏视图
var fupingpage = parent.person_setting.fupingpage-1; //副屏页码
var fontsize= parent.person_setting.fontsize;
var bt3color= parent.person_setting.bt3color;
var th2color= parent.person_setting.th2color;
var th3color= parent.person_setting.th3color;
var lh3color= parent.person_setting.lh3color;
var k12BaseStyle = parent.person_setting.k12BaseStyle;
var screenLight=parent.person_setting.screenLight; //亮度
var screenLight_B=parent.person_setting.screenLight_B; //副屏亮度
var sysSoundVal=parent.person_setting.sysSoundVal; //音量
var sysSoundVal_B=parent.person_setting.sysSoundVal_B; //副屏音量

var current = parent.strPage=="0"||parent.strPage=="1"?1:0;
var row=0;  //第几行nowpage
var prerow = 0; //前一个行
var col;  //第几个
var precol = 0;
var clicktag = 0; //隐藏为0，不可用为-1，密码为1，修改站点为2，修改ip为3
var page = -1;
var num = 0;
var numli = new Array($("#keyBoard .key_1"),$("#keyBoard .key_2"),$("#keyBoard .key_3"),$("#keyBoard .key_4"),$("#keyBoard .key_5"),$("#keyBoard .key_6"),$("#keyBoard .key_7")
							,$("#keyBoard .key_8"),$("#keyBoard .key_9"),$("#keyBoard .key_0"),$("#keyBoard .vk_point"),$("#keyBoard .vk_back"),$("#link"),$("#confirm"));
var enterBtn={
	line: $("#enter"),
	editBox: new Array($("#enter")), //选中选项边框
	result: function(){
		showPage = parseInt(resarr[0].currentSelect)+1;
		skinStyle = resarr[1].currentSelect;  //多彩风格
		playCodeNum = hasNoFlag?parseInt(resarr[2].currentSelect)-1:parseInt(resarr[2].currentSelect);
		playView = resarr[3].currentSelect;
		k12BaseStyle = resarr[4].currentSelect;
		showStation = resarr[5].currentSelect;
		showVersion = resarr[6].currentSelect;
		showYilou = resarr[7].currentSelect;
		fupingpage = parseInt(resarr[8].currentSelect)+1;
		fupingviewNum = parseInt(resarr[9].currentSelect);
		fontsize= resarr[10].currentSelect;
		bt3color= resarr[11].currentSelect;
		th2color= resarr[12].currentSelect;
		th3color= resarr[13].currentSelect;
		lh3color= resarr[14].currentSelect;
		var paramVue="playCode\|"+(playCodeNum<0?"NO":parent.gameArray.playname[playCodeNum])+"\|playView\|"+playView+"\|skinStyle\|"+skinStyle+"\|showPage\|"+showPage
					+"\|showStation\|"+showStation+"\|showVersion\|"+showVersion+"\|showYilou\|"+showYilou+"\|k12BaseStyle\|"+k12BaseStyle+"\|fontsize\|"+fontsize+"\|bt3color\|"+bt3color
					+"\|th2color\|"+th2color+"\|th3color\|"+th3color+"\|lh3color\|"+lh3color+"\|fupingview\|"+K_public.CS_name[fupingviewNum]+"\|fupingpage\|"+fupingpage;
		// var paramVue='[{"paramKey":"playCode","paramValue":"'+(playCodeNum<0?"NO":parent.gameArray.playname[playCodeNum])+'","screenFlag":"public"},'+
		// 	'{"paramKey":"playView","paramValue":"'+playView+'","screenFlag":"A"},'+
		// 	'{"paramKey":"skinStyle","paramValue":"'+skinStyle+'","screenFlag":"A"},'+
		// 	'{"paramKey":"showPage","paramValue":"'+showPage+'","screenFlag":"A"},'+
		// 	'{"paramKey":"showStation","paramValue":"'+showStation+'","screenFlag":"public"},'+
		// 	'{"paramKey":"showVersion","paramValue":"'+showVersion+'","screenFlag":"public"},'+
		// 	'{"paramKey":"showYilou","paramValue":"'+showYilou+'","screenFlag":"public"},'+
		// 	'{"paramKey":"fontsize","paramValue":"'+fontsize+'","screenFlag":"public"},'+
		// 	'{"paramKey":"k12BaseStyle","paramValue":"'+k12BaseStyle+'","screenFlag":"public"},'+
		// 	'{"paramKey":"bt3color","paramValue":"'+bt3color+'","screenFlag":"public"},'+
		// 	'{"paramKey":"th2color","paramValue":"'+th2color+'","screenFlag":"public"},'+
		// 	'{"paramKey":"th3color","paramValue":"'+th3color+'","screenFlag":"public"},'+
		// 	'{"paramKey":"lh3color","paramValue":"'+lh3color+'","screenFlag":"public"},'+
		// 	'{"paramKey":"fupingview","paramValue":"'+K_public.CS_name[fupingviewNum]+'","screenFlag":"B"},'+
		// 	'{"paramKey":"fupingpage","paramValue":"'+fupingpage+'","screenFlag":"B"}]';
		console.info(paramVue);
		var webApi=parent.webApi;
		var result = parent.debugflag!=0?webApi.invoke("/term/setting",paramVue):true;
		if(result){console.log(playCodeNum);
			parent.person_setting.playCode = playCodeNum<0?"NO":parent.gameArray.playname[playCodeNum];
			parent.person_setting.playview = parseInt(playView); //视图
			parent.person_setting.skinStyle = parseInt(skinStyle); //视图
			parent.person_setting.showpage= parseInt(showPage); //第几页显示
			parent.person_setting.showstation = parseInt(showStation); //站点显示
			parent.person_setting.showversion = parseInt(showVersion); //版本显示
			parent.person_setting.showyilou = parseInt(showYilou);//号码间是否显示遗漏
			parent.person_setting.fupingview = K_public.CS_name[fupingviewNum]; 
			parent.person_setting.fupingpage = parseInt(fupingpage); 
			parent.person_setting.k12BaseStyle = parseInt(k12BaseStyle); 
			parent.person_setting.fontsize = parseInt(fontsize); 
			parent.person_setting.th2color = parseInt(th2color); 
			parent.person_setting.bt3color = parseInt(bt3color); 
			parent.person_setting.th3color = parseInt(th3color); 
			parent.person_setting.lh3color = parseInt(lh3color);
			layer.msg("设置成功!",{icon: 1});
		}
	},
	isQuestion:false,
	hasSlider:false,
	isSecQuestion:false
};

var lrBtn ={	//左右切换行
	line: $("#lr"),
	editBox: new Array($("#left"), $("#right")), //选中选项边框
	result: function(){
		var c = current;
		if($("#left").is(".ac")){
			current= current-1;
			if(current<0) current=MAX_CONTEXT-1;
		}else{
			current= current+1;
			if(current>=MAX_CONTEXT)current=0;
		} 
		nowpage = currentpage[current];
		row = nowpage.length-2;
		changePage(c);
	},
	isQuestion:false,//不是问题就是按钮
	hasSlider:false,
	isSecQuestion:false
};
var context1q1 = {	//默认打开第几页
	line: $("#context1 article .q1"),  //当前行高亮
	editBox: new Array($("#context1 article .q1 span").eq(0), $("#context1 article .q1 span").eq(1), $("#context1 article .q1 span").eq(2), 
								$("#context1 article .q1 span").eq(3), $("#context1 article .q1 span").eq(4), $("#context1 article .q1 span").eq(5)), //选中选项边框
	choosed: new Array($("#context1 .s1.y1"), $("#context1 .s1.y2"), $("#context1 .s1.y3"), 
								$("#context1 .s1.y4"), $("#context1 .s1.y5"), $("#context1 .s1.y6")), //选择框选中
	isRadio: true,  //是否单选
	currentSelect: showPage+"",
	isQuestion:true,
	hasSlider:false,
	isSecQuestion:false
};
var context1q2 = { // 风格
	line: $("#context1 article .q2"),  //当前行高亮
	editBox: new Array($("#context1 article .q2 span").eq(0), $("#context1 article .q2 span").eq(1)), //选中选项边框
	choosed: new Array($("#context1 .s2.y1"), $("#context1 .s2.y2")), //选择框选中
	isRadio: true,  //是否单选
	currentSelect: skinStyle+"",
	isQuestion:true,
	hasSlider:false,
	isSecQuestion:false
};
var context1q3s = {		//短周期的某个视图
	line: $("#context1 article .q3s"),  //当前行高亮
	editBox: new Array(), //选中选项边框
	choosed: new Array(), //选择框选中
	isRadio: true,  //是否单选
	currentSelect: playView+"",
	isQuestion:true,
	hasSlider:false,
	isSecQuestion:false
};
var context1q3 = {		//默认打开的玩法
	line: $("#context1 article .q3"),  //当前行高亮
	editBox: new Array(), //选中选项边框
	choosed: new Array(), //选择框选中
	isRadio: true,  //是否单选
	currentSelect: playCodeNum+"",
	isQuestion:true,
	hasSlider:false,
	isSecQuestion:true,
	secTarget:context1q3s,
	secNo:"0"		//选择第几个的时候目标secTarget变为可用, K_public.CS_COUNT
};
var context1q4 = { // 风格
	line: $("#context1 article .q4"),  //当前行高亮
	editBox: new Array($("#context1 article .q4 span").eq(0), $("#context1 article .q4 span").eq(1)), //选中选项边框
	choosed: new Array($("#context1 .s4.y1"), $("#context1 .s4.y2")), //选择框选中
	isRadio: true,  //是否单选
	currentSelect: k12BaseStyle+"",
	isQuestion:true,
	hasSlider:false,
	isSecQuestion:false
};
var context2q1 = { // 第二页第一问 显示站点号
	line: $("#context2 article .q1"),  //当前行高亮
	editBox: new Array($("#context2 article .q1 span").eq(0), $("#context2 article .q1 span").eq(1)), //选中选项边框
	choosed: new Array($("#context2 .s1.y1"), $("#context2 .s1.y2")), //选择框选中
	isRadio: true,  //是否单选
	currentSelect: showStation+"",
	isQuestion:true,
	hasSlider:false,
	isSecQuestion:false
};
var context2q2 = { // 第二页第二问 显示版本号
	line: $("#context2 article .q2"),  //当前行高亮
	editBox: new Array($("#context2 article .q2 span").eq(0), $("#context2 article .q2 span").eq(1)), //选中选项边框
	choosed: new Array($("#context2 .s2.y1"), $("#context2 .s2.y2")), //选择框选中
	isRadio: true,   //是否单选
	currentSelect: showVersion+"",
	isQuestion:true,
	hasSlider:false,
	isSecQuestion:false
};
var context2q3 = { // 第二页第三问 显示遗漏
	line: $("#context2 article .q3"),  //当前行高亮
	editBox: new Array($("#context2 article .q3 span").eq(0), $("#context2 article .q3 span").eq(1)), //选中选项边框
	choosed: new Array($("#context2 .s3.y1"), $("#context2 .s3.y2")), //选择框选中
	isRadio: true,  //是否单选
	currentSelect: showYilou+"",
	isQuestion:true,
	hasSlider:false,
	isSecQuestion:false
};
var context2q4 = { // 第二页第四 亮度
	line: $("#context2 article .q4"),  //当前行高亮
	editBox: new Array($("#context2 .s4").find("div").eq(0),$("#context2 .s4").find("div").eq(1),$("#context2 .s4").find("span")), //选中选项边框
	choosed: new Array(), //选择框选中
	isRadio: false,  //是否单选
	currentSelect:screenLight+"",
	result:function(){},
	isQuestion:false,
	hasSlider:true,
	isSecQuestion:false
};
var context2q5 = { // 第二页第五 音量
	line: $("#context2 article .q5"),  //当前行高亮
	editBox: new Array($("#context2 .s5").find("div").eq(0),$("#context2 .s5").find("div").eq(1),$("#context2 .s5").find("span")), //选中选项边框
	choosed: new Array(), //选择框选中
	isRadio: false,  //是否单选
	currentSelect:sysSoundVal+"",
	result:function(){},
	isQuestion:false,
	hasSlider:true,
	isSecQuestion:false
};
var context2q6 = { // 第二页第六
	line: $("#context2 article .q6"),  //当前行高亮
	editBox: new Array($("#context2 .s6")), //选中选项边框
	choosed: new Array(), //选择框选中
	result:function(){
		clicktag =K_public.ipCode?1:3;
		showInput(clicktag);
	},
	isRadio: false,  //是否单选
	currentSelect:"",
	isQuestion:false,
	hasSlider:false,
	isSecQuestion:false
};
var context2q7 = { // 第二页第七
	line: $("#context2 article .q7"),  //当前行高亮
	editBox: new Array($("#context2 .s7")), //选中选项边框
	choosed: new Array(), //选择框选中
	result:function(){
		if(parent.person_setting.sp_playEname.length==0||parent.strPage=="1"||parent.strPage=="0"){
			clicktag =2;
			showInput(clicktag);
		}else  layer.msg('本站点不能修改站点机号！', {
				icon: 0,
				time: 2500 //1.5秒关闭（如果不配置，默认是3秒）
			});
	},
	isRadio: false,  //是否单选
	currentSelect:"",
	isQuestion:false,
	hasSlider:false,
	isSecQuestion:false
};
var context2q8 = { // 一键清除
	line: $("#context2 article .q8"),  //当前行高亮
	editBox: new Array($("#context2 .s8")), //选中选项边框
	choosed: new Array(), //选择框选中
	result:function(){
		console.log("确认重启");
		if(parent.debugflag==0){
			parent.location.reload();
		}else if("undefined" != typeof webApi&&webApi!=null) webApi.invoke("/term/clearLoaclDataAndRestart",null);
	},
	isRadio: false,  //是否单选
	currentSelect:"",
	isQuestion:false,
	hasSlider:false,
	isSecQuestion:false
};
var context3q1 = { // 第三页第一
	line: $("#context3 article .q1"),  //当前行高亮
	editBox: new Array($("#context3 article .q1 span").eq(0), $("#context3 article .q1 span").eq(1), $("#context3 article .q1 span").eq(2), 
								$("#context3 article .q1 span").eq(3), $("#context3 article .q1 span").eq(4), $("#context3 article .q1 span").eq(5)), //选中选项边框
	choosed: new Array($("#context3 .s1.y1"), $("#context3 .s1.y2"), $("#context3 .s1.y3"), 
								$("#context3 .s1.y4"), $("#context3 .s1.y5"), $("#context3 .s1.y6")), //选择框选中
	isRadio: true,  //是否单选
	currentSelect:fupingpage+"",
	isQuestion:true,
	hasSlider:false,
	isSecQuestion:false
};
var context3q2 = { // 第三页第二
	line: $("#context3 article .q2"),  //当前行高亮
	editBox: new Array(), //选中选项边框
	choosed: new Array(), //选择框选中
	isRadio: true,  //是否单选
	currentSelect:fupingviewNum+"",
	isQuestion:true,
	hasSlider:false,
	isSecQuestion:false
};
var context3q3 = { // 第三页第三 副屏亮度
	line: $("#context3 article .q3"),  //当前行高亮
	editBox: new Array($("#context3 .s3").find("div").eq(0),$("#context3 .s3").find("div").eq(1),$("#context3 .s3").find("span")), //选中选项边框
	choosed: new Array(), //选择框选中
	isRadio: false,  //是否单选
	currentSelect:screenLight_B+"",
	result:function(){},
	isQuestion:false,
	hasSlider:true,
	isSecQuestion:false
};
var context3q4 = { // 第三页第四 副屏音量
	line: $("#context3 article .q4"),  //当前行高亮
	editBox: new Array($("#context3 .s4").find("div").eq(0),$("#context3 .s4").find("div").eq(1),$("#context3 .s4").find("span")), //选中选项边框
	choosed: new Array(), //选择框选中
	isRadio: false,  //是否单选
	currentSelect:sysSoundVal_B+"",
	result:function(){},
	isQuestion:false,
	hasSlider:true,
	isSecQuestion:false
};
var context4q1 = { // 第四页第一
	line: $("#context4 article .q1"),  //当前行高亮
	editBox: new Array($("#context4 article .q1 span").eq(0), $("#context4 article .q1 span").eq(1), $("#context4 article .q1 span").eq(2)), //选中选项边框
	choosed: new Array($("#context4 .s1.y1"), $("#context4 .s1.y2"), $("#context4 .s1.y3")), //选择框选中
	isRadio: true,  //是否单选
	currentSelect:fontsize+"",
	isQuestion:true,
	hasSlider:false,
	isSecQuestion:false
};
var context4q2 = { // 第四页第二
	line: $("#context4 article .q2"),  //当前行高亮
	editBox: new Array($("#context4 article .q2 span").eq(0), $("#context4 article .q2 span").eq(1), $("#context4 article .q2 span").eq(2), 
			$("#context4 article .q2 span").eq(3),$("#context4 article .q2 span").eq(4), $("#context4 article .q2 span").eq(5)), //选中选项边框
	choosed: new Array($("#context4 .s2.y1"), $("#context4 .s2.y2"), $("#context3 .s2.y3"), $("#context4 .s2.y4"),$("#context4 .s2.y5"),$("#context4 .s2.y6")), //选择框选中
	isRadio: true,  //是否单选
	currentSelect:bt3color+"",
	isQuestion:true,
	hasSlider:false,
	isSecQuestion:false
};
var context4q3 = { // 第四页第三
	line: $("#context4 article .q3"),  //当前行高亮
	editBox: new Array($("#context4 article .q3 span").eq(0), $("#context4 article .q3 span").eq(1), $("#context4 article .q3 span").eq(2),
			$("#context4 article .q3 span").eq(3),$("#context4 article .q3 span").eq(4), $("#context4 article .q3 span").eq(5)), //选中选项边框
	choosed: new Array($("#context4 .s3.y1"), $("#context4 .s3.y2"), $("#context4 .s3.y3"), $("#context4 .s3.y4"),$("#context4 .s3.y5"),$("#context4 .s3.y6")), //选择框选中
	isRadio: true,  //是否单选
	currentSelect:th2color+"",
	isQuestion:true,
	hasSlider:false,
	isSecQuestion:false
};
var context4q4 = { // 第四页第四
	line: $("#context4 article .q4"),  //当前行高亮
	editBox: new Array($("#context4 article .q4 span").eq(0), $("#context4 article .q4 span").eq(1), $("#context4 article .q4 span").eq(2),
			$("#context4 article .q4 span").eq(3),$("#context4 article .q4 span").eq(4), $("#context4 article .q4 span").eq(5)), //选中选项边框
	choosed: new Array($("#context4 .s4.y1"), $("#context4 .s4.y2"), $("#context4 .s4.y3"), $("#context4 .s4.y4"),$("#context4 .s4.y5"),$("#context4 .s4.y6")), //选择框选中
	isRadio: true,  //是否单选
	currentSelect:th3color+"",
	isQuestion:true,
	hasSlider:false,
	isSecQuestion:false
};
var context4q5 = { // 第四页第五
	line: $("#context4 article .q5"),  //当前行高亮
	editBox: new Array($("#context4 article .q5 span").eq(0), $("#context4 article .q5 span").eq(1), $("#context4 article .q5 span").eq(2), 
			$("#context4 article .q5 span").eq(3),$("#context4 article .q5 span").eq(4), $("#context4 article .q5 span").eq(5)), //选中选项边框
	choosed: new Array($("#context4 .s5.y1"),$("#context4 .s5.y2"),$("#context4 .s5.y3"),$("#context4 .s5.y4"),$("#context4 .s5.y5"),$("#context4 .s5.y6")), //选择框选中
	isRadio: true,  //是否单选
	currentSelect:lh3color+"",
	isQuestion:true,
	hasSlider:false,
	isSecQuestion:false
};

var currentpage = new Array(new Array(context1q1,context1q2, context1q3, context1q3s,context1q4, lrBtn, enterBtn),	
			new Array(context2q1, context2q2, context2q3, context2q4,context2q5, context2q6,context2q7,context2q8, lrBtn, enterBtn),
			new Array(context3q1, context3q2,context3q3,context3q4, lrBtn, enterBtn),
			new Array(context4q1, context4q2, context4q3, context4q4,context4q5, lrBtn, enterBtn));

var	resarr = new Array(context1q1,context1q2,context1q3, context1q3s, context1q4, context2q1, context2q2, context2q3,context3q1, context3q2,
								context4q1, context4q2, context4q3, context4q4,context4q5);
var nowpage = currentpage[current];
$(function(){
	putSetText();
	if(playCodeNum==0&&hasNoFlag){		//主菜单
		removeArrOf(currentpage[0], context1q3s);
		context1q3s.line.addClass("darkgray");
	}else if(playCodeNum<parent.gameArray.playname.length-K_public.CS_COUNT+(hasNoFlag?1:0)){
		context1q3s.line.removeClass("darkgray");
	}else{
		removeArrOf(currentpage[0], context1q3s);
		context1q3s.line.addClass("darkgray");
	}
	nowpage = currentpage[current];
	$("#context2 .s6 span").text(parent.person_setting.serverIP);
	$("#context2 .s7 span").text(parent.person_setting.jihao);
	if(parent.strPage=="0"){
		clicktag =K_public.ipCode?1:3;
		showInput(clicktag);
		layer.msg('请设置服务器IP！', {
			  icon: 0,
			  time: 2500 //2秒关闭（如果不配置，默认是3秒）
		});
	}else if(parent.strPage=="1"){
		clicktag =2;
		showInput(clicktag);
		layer.msg('请设置站点机号！', {
			  icon: 0,
			  time: 2500 //2秒关闭（如果不配置，默认是3秒）
		});
	}
	initialize();
	if(parent.strPage=="0"||parent.strPage=="1")changePage(0);
	ajustButton(0);
	ajustButton(3);
	col=parseInt(nowpage[row].currentSelect);
});
function putSetText(){
	if(K_public.setFuping){	//有主副屏
		$("#slect0").text("主屏视图设置");
		$("#slect2").show();
		context2q4.line.text("4、主屏亮度");
		context2q5.line.text("5、主屏音量");
		MAX_CONTEXT = 3;
	}
	var strlength = 0,count = 0;
	if(!K_public.skinFlag){				//去掉多彩风格设置选项
		$("#context1 .q2").remove();
		$("#context1 .s2").remove();
		$("#context1 .q3").text("2、默认玩法");
		removeArrOf(currentpage[0], context1q2);	
	}	
	if(parent.gameArray.playname.indexOf(parent.K12NAME)<0){		//快乐12的样式选择
		$("#context1 .q4").remove();
		$("#context1 .s4").remove();
		removeArrOf(currentpage[0], context1q4);
	}
	var arr = hasNoFlag?["主菜单"]:[];
	arr = arr.concat(parent.gameArray.settingtext);
	for (var i in arr) {		//玩法名，根据字节数长度,判断什么时候换行
		strlength = strlength+arr[i].getBytesLength()/2;
		count++;
		if(strlength+count*2>23||count>5){
			context1q3.line.eq(0).append("<br/><span class='padleft'></span>");
			strlength=arr[i].getBytesLength()/2;
			count=1;
		}else context1q3.line.eq(0).append("<span></span>");
		context1q3.editBox.push(context1q3.line.find("span").eq(i));
		context1q3.editBox[i].text(arr[i]);
		$("<div class='s3 choosebox y"+(arr.length-i)+"'></div>").appendTo($("#context1"));
		context1q3.choosed.push($("#context1 .s3.y"+(arr.length-i)));
	}
	strlength = 0;
	count=0;
	for(var i in K_public.CS_text){		//视图名称
		strlength = strlength+K_public.CS_text[i].getBytesLength()/2;
		count++;//console.info(K_public.CS_text[i]+strlength);
		if(strlength+count*2>23||count>5){
			context3q2.line.eq(0).append("<br/><span class='padleft'></span>");
			strlength=K_public.CS_text[i].getBytesLength()/2;
			count=1;
		}else context3q2.line.eq(0).append("<span></span>");
		context3q2.editBox.push(context3q2.line.find("span").eq(i));
		context3q2.editBox[i].text(K_public.CS_text[i]);
		//$("<div class='s2 choosebox y"+(K_public.CS_text.length-i)+"'></div>").appendTo($("#context3 .s3"));
		$("#context3 .s3").before("<div class='s2 choosebox y"+(K_public.CS_text.length-i)+"'></div>");
		context3q2.choosed.push($("#context3 .s2.y"+(K_public.CS_text.length-i)));
	}
	context3q2.choosed.reverse();
	context1q3.choosed.reverse();
	selectPlayView(playCodeNum);
}
function selectPlayView(n){
	if(parent.gameArray.playname.length>K_public.CS_COUNT){				//有短周期，显示选择视图选项playCodeNum
		//$("#slect2").show();
		if(n>=parent.gameArray.playname.length-K_public.CS_COUNT) n=0;
		spLastview = n;
		context1q3s.line.eq(1).empty();
		context1q3s.editBox =[];
		context1q3s.choosed =[];
		$("#context1 .mm").remove();
		var strlength = 0,count = 0;
		var sp_view = parent.gameArray.relationview[n].sp_view;
		for(var i in sp_view){		//视图名，根据字节数长度,判断什么时候换行
			strlength = strlength+sp_view[i].getBytesLength()/2;
			count++;
			if(strlength+count*2>28||count>4){		
				context1q3s.line.eq(1).append("<br/><span></span>");
				strlength=sp_view[i].getBytesLength()/2;
				count=1;
			}else context1q3s.line.eq(1).append("<span></span>");
			context1q3s.editBox.push(context1q3s.line.find("span").eq(i));
			context1q3s.editBox[i].text(sp_view[i]);
			$("<div class='choosebox mm m"+(sp_view.length-i)+"'></div>").appendTo($("#context1"));
			context1q3s.choosed.push($("#context1 .mm.m"+(sp_view.length-i)));
		}
		context1q3s.line.eq(0).text("若选择"+parent.gameArray.settingtext[n]+"视图").css("font-style","italic");
		context1q3s.choosed.reverse();
		ajustButton(1);
	}else ajustButton(0);
}
function ajustButton(a){		//1表示玩法名按钮调整，2表示视图选项按钮调整,3表示所有初始化
	if(a==1||a==0){
		for(var i in context1q3.choosed){//console.log(i);
			context1q3.choosed[i].css("left",context1q3.editBox[i].offset().left-100+"px");
			context1q3.choosed[i].css("top",context1q3.editBox[i].offset().top-708+"px");
		}
	}
	if(a==2||a==0){
		if(parent.gameArray.playname.length>K_public.CS_COUNT)
			for(var i in context1q3s.choosed){
				context1q3s.choosed[i].css("left",context1q3s.editBox[i].offset().left-100+"px");
				context1q3s.choosed[i].css("top",context1q3s.editBox[i].offset().top-708+"px");
			}
		else MAX_CONTEXT=2;	//没有短周期，即没有快3字体设置,也不会有关于副屏的设置
	}
	if(a==3){
		for(var i in nowpage){
			if(nowpage[i].isQuestion&&nowpage[i]!=context1q3&&nowpage[i]!=context1q3s){
				for(var j in nowpage[i].choosed){
					nowpage[i].choosed[j].css("left",nowpage[i].editBox[j].offset().left-100+"px");
					nowpage[i].choosed[j].css("top",nowpage[i].editBox[j].offset().top-708+"px");
				}
			}
		}
	}
}
function showInput(n){
	$("#input").show();
	if(n==1){
		$("#link").hide();
		$("input").attr({type:"password",placeholder:"验证密码才能修改IP"});
		$("#confirm").css("left","430px");
		$("#confirm p").text("验证密码");
		if(numli.length==14) numli.splice(12,1);
		layer.msg('请输入密码！', {
			icon: 0,
		 	time: 1500 //1.5秒关闭（如果不配置，默认是3秒）
		});
	}else if(n==2){
		$("#link").hide();
		$("input").attr({type:"text",placeholder:"请输入站点号"});
		$("#confirm").css("left","430px");
		$("#confirm p").text("确认并重启");
		if(numli.length==14) numli.splice(12,1);
	}else if(n==3){
		$("#link").show();
		$("input").attr({type:"text",placeholder:"请输入IP"});
		$("#confirm").css("left","550px");
		$("#confirm p").text("确认并重启");
		if(numli.length<14) numli.splice(12,0,$("#link"));
	}
	num = 0;
	numli[num].find("p").addClass("ac");
	$("input").attr("value","");
}
function changePage(c){
	$("#context"+(current+1)).show();
	$("#context"+(c+1)).hide();
	$("#slect"+current).addClass("ac");
	$("#slect"+c).removeClass("ac");
	ajustButton(3);
}
//初始化
function initialize(){
	for(var i in currentpage){
		for(var j in currentpage[i]){
			if(i==current&&j==row){
				currentpage[i][j].line.addClass("ac");
				if(!currentpage[i][j].hasSlider&&currentpage[i][j].isQuestion){
					if(currentpage[i][j].isRadio) currentpage[i][j].editBox[parseInt(currentpage[i][j].currentSelect)].addClass("ac");//选中的行的选中项加虚框
					else {
						var radio = currentpage[i][j].currentSelect.split("");
						currentpage[i][j].editBox[radio[0]].addClass("ac");//多选里的第一个
					}
				}
			}else  currentpage[i][j].line.removeClass("ac");
			if(i==0||j<currentpage[i].length-2){
				if(currentpage[i][j].isQuestion){
					try{
						if(currentpage[i][j].isRadio){
							var n = parseInt(currentpage[i][j].currentSelect);
							currentpage[i][j].choosed[n].addClass("ac");//每一个选择框按照设置被选中
						}else{
							var radio = currentpage[i][j].currentSelect.split("");
							for(var x in radio)
								currentpage[i][j].choosed[radio[x]].addClass("ac");//多选的话，每一个选择框按照设置被选中
						}
					}catch(e){
						console.info('第'+(parseInt(i)+1)+'页,第'+(parseInt(j)+1)+'行项目有问题',e);
					}
				}else if(currentpage[i][j].hasSlider){
					var n = parseInt(currentpage[i][j].currentSelect)*3+250;
					currentpage[i][j].editBox[1].css("left",n+"px");
					currentpage[i][j].editBox[2].text(currentpage[i][j].currentSelect);
				}
			}
		}
	}
	
}

var re = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
document.onkeydown=function(event){
	var e1 = event || window.event || arguments.callee.caller.arguments[0];
	var n1 = e1.keyCode;
	if(e1&&clicktag==0){
		if(n1==65 || n1==37){  //向左 a
			if(nowpage[row].hasSlider){
				var p = Math.max(nowpage[row].editBox[1].offset().left-60-30,280);
				nowpage[row].editBox[1].css("left",p+"px");
				nowpage[row].currentSelect=Math.floor((p-250)/3)+"";
				nowpage[row].editBox[2].text(nowpage[row].currentSelect);
				if(nowpage[row]==context2q4){//主屏亮度
					parent.person_setting.screenLight = parseInt(nowpage[row].currentSelect);
					console.log("/term/setScreenLight",'{"paramKey":"screenLightVal","paramValue":"'+nowpage[row].currentSelect+'","screenFlag":"A"}');
					webApi.invoke("/term/setScreenLight",'{"paramKey":"screenLightVal","paramValue":"'+nowpage[row].currentSelect+'","screenFlag":"A"}');
				}else if(nowpage[row]==context2q5){	//主屏音量
					parent.person_setting.sysSoundVal = parseInt(nowpage[row].currentSelect);
					console.log("/term/setScreenVol",'{"paramKey":"sysSoundVal","paramValue":"'+nowpage[row].currentSelect+'","screenFlag":"A"}');
					webApi.invoke("/term/setScreenVol",'{"paramKey":"sysSoundVal","paramValue":"'+nowpage[row].currentSelect+'","screenFlag":"A"}');
				}else if(nowpage[row]==context3q3){	//副屏亮度
					parent.person_setting.screenLight_B = parseInt(nowpage[row].currentSelect);
					console.log("/term/setScreenLight",'{"paramKey":"screenLightVal","paramValue":"'+nowpage[row].currentSelect+'","screenFlag":"B"}');
					webApi.invoke("/term/setScreenLight",'{"paramKey":"screenLightVal","paramValue":"'+nowpage[row].currentSelect+'","screenFlag":"B"}');
				}else if(nowpage[row]==context3q4){	//副屏音量
					parent.person_setting.sysSoundVal_B = parseInt(nowpage[row].currentSelect);
					console.log("/term/setScreenVol",'{"paramKey":"sysSoundVal","paramValue":"'+nowpage[row].currentSelect+'","screenFlag":"B"}');
					webApi.invoke("/term/setScreenVol",'{"paramKey":"sysSoundVal","paramValue":"'+nowpage[row].currentSelect+'","screenFlag":"B"}');
				}
			}else{
				for(var i=0;i<nowpage[row].editBox.length;i++)
				if(nowpage[row].editBox[i].is(".ac"))   
					col = i; //找到之前所在的
				precol = col;
				col = Math.max(0,col-1);
				nowpage[row].editBox[precol].removeClass("ac");
				nowpage[row].editBox[col].addClass("ac");
			}
		}
		if(n1==68 || n1==39){  //向右 d
			if(nowpage[row].hasSlider){
				var p = Math.min(nowpage[row].editBox[1].offset().left-60+30,550);
				nowpage[row].editBox[1].css("left",p+"px");
				nowpage[row].currentSelect=Math.floor((p-250)/3);
				nowpage[row].editBox[2].text(nowpage[row].currentSelect);
				if(nowpage[row]==context2q4){//主屏亮度
					parent.person_setting.screenLight = parseInt(nowpage[row].currentSelect);
					console.log("/term/setScreenLight",'{"paramKey":"screenLightVal","paramValue":"'+nowpage[row].currentSelect+'","screenFlag":"A"}');
					webApi.invoke("/term/setScreenLight",'{"paramKey":"screenLightVal","paramValue":"'+nowpage[row].currentSelect+'","screenFlag":"A"}');
				}else if(nowpage[row]==context2q5){	//主屏音量
					parent.person_setting.sysSoundVal = parseInt(nowpage[row].currentSelect);
					console.log("/term/setScreenVol",'{"paramKey":"sysSoundVal","paramValue":"'+nowpage[row].currentSelect+'","screenFlag":"A"}');
					webApi.invoke("/term/setScreenVol",'{"paramKey":"sysSoundVal","paramValue":"'+nowpage[row].currentSelect+'","screenFlag":"A"}');
				}else if(nowpage[row]==context3q3){	//副屏亮度
					parent.person_setting.screenLight_B = parseInt(nowpage[row].currentSelect);
					console.log("/term/setScreenLight",'{"paramKey":"screenLightVal","paramValue":"'+nowpage[row].currentSelect+'","screenFlag":"B"}');
					webApi.invoke("/term/setScreenLight",'{"paramKey":"screenLightVal","paramValue":"'+nowpage[row].currentSelect+'","screenFlag":"B"}');
				}else if(nowpage[row]==context3q4){	//副屏音量
					parent.person_setting.sysSoundVal_B = parseInt(nowpage[row].currentSelect);
					console.log("/term/setScreenVol",'{"paramKey":"sysSoundVal","paramValue":"'+nowpage[row].currentSelect+'","screenFlag":"B"}');
					webApi.invoke("/term/setScreenVol",'{"paramKey":"sysSoundVal","paramValue":"'+nowpage[row].currentSelect+'","screenFlag":"B"}');
				}
			}else{
				for(var i=0;i<nowpage[row].editBox.length;i++)
				if(nowpage[row].editBox[i].is(".ac"))   
					col = i;
				precol = col;
				col = Math.min(nowpage[row].editBox.length-1,col+1);
				nowpage[row].editBox[precol].removeClass("ac");
				nowpage[row].editBox[col].addClass("ac");
			}
		}
		if(n1==87 || n1==38){	//向上 w
			prerow = row;
			row--;
			if(row<0) row = nowpage.length-1;
			col=parseInt(nowpage[row].currentSelect);
			nowpage[prerow].line.removeClass("ac");
			nowpage[row].line.addClass("ac");
			for(var x in nowpage[prerow].editBox)
				nowpage[prerow].editBox[x].removeClass("ac");
			if(nowpage[row].hasSlider){
				for(var x in nowpage[row].editBox)
					nowpage[row].editBox[x].addClass("ac");
			}else if(nowpage[row].isQuestion){
				for(var i=0;i<nowpage[row].choosed.length;i++){
				if(nowpage[row].choosed[i].is(".ac")){
						nowpage[row].editBox[i].addClass("ac");
						break;
					}
					if(nowpage[row].currentSelect=="")//多选可能没有任何选中
						nowpage[row].editBox[0].addClass("ac");
				}		
			}else{
				nowpage[row].editBox[0].addClass("ac");
			}
		}
		if(n1==83 || n1==40){	//向下 s
			prerow = row;
			row++;
			if(row>nowpage.length-1) row = 0;
			col=parseInt(nowpage[row].currentSelect);
			nowpage[prerow].line.removeClass("ac");
			nowpage[row].line.addClass("ac");
			for(var x in nowpage[prerow].editBox)
				nowpage[prerow].editBox[x].removeClass("ac");
			if(nowpage[row].hasSlider){
				for(var x in nowpage[row].editBox)
					nowpage[row].editBox[x].addClass("ac");
			}else if(nowpage[row].isQuestion){
				for(var i=0;i<nowpage[row].choosed.length;i++){
					if(nowpage[row].choosed[i].is(".ac")){
						nowpage[row].editBox[i].addClass("ac");
						break;
					}
					if(nowpage[row].currentSelect=="")
						nowpage[row].editBox[0].addClass("ac");
				}	
			}else{
				nowpage[row].editBox[0].addClass("ac");
			}
		}
		if(n1==82 || n1==36){ //backspance
			if(parent.person_setting.skinStyle==1){
				$('.part', parent.document).show();
				parent.ALL_COLOR[0] = "#434242";
				parent.K_public.S3_COLOR[1]="#434242";
			}else{
				$('.part', parent.document).hide();
				parent.ALL_COLOR[0] = "black";
				parent.K_public.S3_COLOR[1]="black";
			}
			parent.changek12Style();
			K_public.COLOR=[parent.ALL_COLOR[parseInt(lh3color)],parent.ALL_COLOR[parseInt(bt3color)],parent.ALL_COLOR[parseInt(th2color)],parent.ALL_COLOR[parseInt(th3color)]];
			parent.FLAG = 1;
			parent.$(".homePage").show();
			parent.$("#ifrContent").attr("src", "about:blank").hide()[0].focus();
		}
		if(n1==13 || n1==75){ //确认  回车
			if(nowpage[row].isQuestion){
				if(col!=parseInt(nowpage[row].currentSelect)){
					if(nowpage[row].isSecQuestion){		//该项目是否有绑定的置灰问题选项
						if(nowpage[row].secNo.split("|").indexOf(hasNoFlag?col-1+"":col+"")<0){		//选择的是会置灰的选项，如是长周期
							if(!nowpage[row].secTarget.line.is(".darkgray")){
								nowpage[row].secTarget.choosed[nowpage[row].secTarget.currentSelect].removeClass("ac");
								nowpage[row].secTarget.line.addClass("darkgray");
								nowpage.splice(row+1,1);	//删除下一个，默认置灰项目在这个后面
							}
						}else {
							nowpage[row].secTarget.currentSelect = Math.min(parseInt(nowpage[row].secTarget.currentSelect),nowpage[row].secTarget.choosed.length-1);
							if(nowpage[row].secTarget.line.is(".darkgray")){	//暗的
								//console.log(spLastview!=(hasNoFlag?col-1:col));
								if(spLastview!=(hasNoFlag?col-1:col)) selectPlayView(hasNoFlag?col-1:col);//切换不同短周期，待验证--
								nowpage[row].secTarget.choosed[nowpage[row].secTarget.currentSelect].addClass("ac");
								nowpage[row].secTarget.line.removeClass("darkgray");
								nowpage.splice(row+1,0,nowpage[row].secTarget);
							}else {		//本来就没暗
								selectPlayView(hasNoFlag?col-1:col);//切换不同短周期，待验证--
								nowpage[row].secTarget.choosed[nowpage[row].secTarget.currentSelect].addClass("ac");
							}
						}
					}
				}
				if(nowpage[row].isRadio){  //若为单选，之前选择恢复，新选择变黄
					//console.log(col);
					if(col!=parseInt(nowpage[row].currentSelect))
						nowpage[row].choosed[nowpage[row].currentSelect].removeClass("ac");
					nowpage[row].choosed[col].addClass("ac");
					nowpage[row].currentSelect = col+"";
				}else{
					nowpage[row].choosed[col].toggleClass(".ac");
					nowpage[row].currentSelect="";
					for (var i in nowpage[row].choosed){
						if(nowpage[row].choosed[i].is(".ac"))
							nowpage[row].currentSelect = nowpage[row].currentSelect+""+i;
					}
				}
			}else{
				nowpage[row].result();
			}
		}
	}else if(e1&&clicktag!=0){
		if(n1==82 || n1==36){ //backspance
			if(parent.strPage=="0"){
				layer.msg('请设置服务器IP！', {
					  icon: 0,
					  time: 2500 //2秒关闭（如果不配置，默认是3秒）
				});
			}else if(parent.strPage=="1"){
				layer.msg('请设置站点机号！', {
					  icon: 0,
					  time: 2500 //2秒关闭（如果不配置，默认是3秒）
				});
			}else{
				$("#input").hide();
				clicktag = 0;
				numli[num].find("p").removeClass("ac");
				num = 0;
			}
		}
		if(n1==65 || n1==37){  //向左 a
			numli[num].find("p").removeClass("ac");
			num = Math.max(0, num-1);
			numli[num].find("p").addClass("ac");
		}
		if(n1==68 || n1==39){  //向右 d
			numli[num].find("p").removeClass("ac");
			num = Math.min(numli.length-1, num+1);
			numli[num].find("p").addClass("ac");
		}
		if(n1==83 || n1==40){	//向下 s
			numli[num].find("p").removeClass("ac");
			num = Math.min(numli.length-1,num+3);
			numli[num].find("p").addClass("ac");
		}
		if(n1==87 || n1==38){	//向上 w
			numli[num].find("p").removeClass("ac");
			num = Math.max(num%3,num-3);
			numli[num].find("p").addClass("ac");
		}
		if(n1==13 || n1==75){	//OK
			var val = $("input").val();
			if(num<10){			//数字
				$("input").attr("value",val+(num+1)%10);
			}else if(num==10){	//.val
				$("input").attr("value",val+".");
			}else if(num==11){
				$("input").attr("value",val.substring(0,val.length-1));
			}else if(clicktag==3&&num==numli.length-2){	//、尝试连接
				clicktag=-1;
				if (re.test(val)){
					console.log("尝试"+val);
					var termlist = parent.debugflag==0?{result:true,data:true}:JSON.parse(webApi.invoke("/term/tryConnect",val));
					if(termlist&&termlist.result){
						if(termlist.data){
							layer.msg('ip地址连接成功可用！', {
			  					icon: 0,
			  					time: 2500 //1.5秒关闭（如果不配置，默认是3秒）
							});
							//parent.person_setting.serverIP = val;
						}else {
							layer.msg('IP地址连接不成功！', {
			  					icon: 0,
			  					time: 2500 //1.5秒关闭（如果不配置，默认是3秒）
							});
						}
					}else{
						console.log("没有返回"+val);
					}
				}else{
					layer.msg('IP地址格式不合法，请重新输入！', {
			  					icon: 0,
			  					time: 2500 //1.5秒关闭（如果不配置，默认是3秒）
							});
					console.log(val+"IP地址格式不合法"); //else
				}
				clicktag=3;
			}else if(num==numli.length-1){	//确认重启
				if(clicktag==3){
					clicktag=-1;
					if (re.test(val)){
						webApi.invoke("/term/updateCenterIpconfig",val);	//重启
					}else{
						layer.msg('IP地址格式不合法，请重新输入！', {
							icon: 0,
					 		time: 2500 //1.5秒关闭（如果不配置，默认是3秒）
						});
						console.log(val+"IP地址格式不合法"); //else
					}
					clicktag=3;
				}else if(clicktag==2){
					if(val!="")	webApi.invoke("/term/retryGetData",val);
					else layer.msg('站点机号为空，请重新输入！', {
						icon: 0,
					 	time: 2500 //1.5秒关闭（如果不配置，默认是3秒）
					});
				}else if(clicktag==1){
					if(val=="1234"){
						clicktag=3;
						numli[num].find("p").removeClass("ac");
						showInput(clicktag);
						layer.msg('密码验证成功，请输入IP', {
							icon: 0,
						 	time: 1500 //1.5秒关闭（如果不配置，默认是3秒）
						});
					}else layer.msg('密码错误！', {
						icon: 0,
					 	time: 2500 //1.5秒关闭（如果不配置，默认是3秒）
					});
				}
			}
		}
	}   
}; 
function removeArrOf(arr,val){
	var index = arr.indexOf(val);
	if (index > -1) {
		arr.splice(index, 1);
	}
}
