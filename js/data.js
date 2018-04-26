/*各省份差别：江苏32：快3无三连号,默认形态，有多彩简约版，有主菜单选项，7张快三图，5个长周期，有html的开奖动画和奖池，前三日未出名字改为多日未出，有一行日期分界线，表头表尾为浅绿色，中间为白色
 * 			青海63：（一体机）快三无三连号,默认形态，有多彩简约版，有主菜单选项，比江苏多一个综合走势，3个基本长周期,3D增加了和值一列用S3_63.html，没有html的开奖动画和奖池，没有考虑没有短周期，表头表尾为浅绿色，中间为白色
 * 			西藏54：（一体机和xz2100）快3无三连号,散号黑色，对子绿色，三同号红色，有多彩简约版，无主菜单选项，7张快三图，3个长周期，没有html的开奖动画和奖池，表头表尾为浅绿色，中间为白色
 * 			福建35：快3有三连号，四张基本图，无多彩简约版，无主菜单选项，有字体大小颜色设置，和值走势图用sum.html，没有考虑没有短周期，表头表尾为浅绿色，中间为白色
 * 			江西36：快3有三连号,默认形态，8张图参考截图，无多彩简约版，无主菜单选项，视图菜单顺序形态是快3第一个， 开奖动画全省控制，设置也可以设置是否显示开奖动画，影响个性化该选项是否置灰，有个最早最晚播放时间以及动画时长，U3D的全屏动画
 * 				3D都有三连号，全国统一
 * 			海南46：（一体机）快三叫快乐三宝，k3、k2两个短周期，无主菜单选项，无多彩简约版，快3四个图参考截图
 * 			河南41：幸运彩，日切点为3点，无多彩简约版，有主菜单选项，无开奖动画，两行日期分界变色，无长周期，没有考虑没有短周期，IP设置需要密码，表头表尾为浅绿色，中间为白色
 *			快乐12还没做完,css边框按顺选1
 * 			吉林有一个横屏，没有开奖动画
 * *****关于快三的不同省份，这里分别分配了不同的K3view+省码，针对不同省份的任务，只需要修改该省份的K3view即可，并把gameArray.relationview的K3view改成本项目所在的省份，并同步上述对应的参数；
 * 打开快3字体颜色大小设置的个性化：1、把setting.html里#context4的快三字体那部分display：none改为显示；
 * 								2、把setting.js里的MAX_CONTEXT改为4（第10行左右），若无主副屏则是3。但和副屏设置不能共存，空间不够
 * 制作菜单图标：用firework更改模板里的文字，通过黄色边框显示，导出两个图，截取视图534*297的框大小，用ps放进那两个图中，缩放调整，得到菜单图标，
 * 					最后用firework按ctrl+shift+x（图像预览）把图标变成8位png，而且选项是alpha透明导出
 * *************某些省份后台接口没有统一，需要把相应的方法同步过来，与福建，河南，江苏等同步；
 */
var K2view = {		//虽然该工程里没有这个玩法
	htmlname:new Array("kuai2.html", "gezi.html"),
	menuicon:new Array("img/menu/k2_01.png", "img/menu/k2_02.png"),
	menuicon_ac:new Array("img/menu/k2_01_ac.png", "img/menu/k2_02_ac.png"),
	particon:new Array("", ""),
	menumsg: new Array("快2（基本走势）", "快2（格子和012路）"),
	sp_view: new Array("基本走势图","格子和012路图"),
	viewtext: new Array(1, 0),//不同视图的信息提示不同，长周期和设置页面不需要
	datanum: new Array(0, 0),
	isScross: new Array(0, 0),		//是否横屏
	yilounum: new Array("0", "")	//每个视图需要的遗漏序号
};
var K10view = {
	htmlname:new Array("K10_base.html", "K10_xuan1.html", "K10_zhi3.html"),
	menuicon:new Array("img/menu/k10_base.png", "img/menu/k10_xuan1.png", "img/menu/k10_zhi3.png"),
	menuicon_ac:new Array("img/menu/k10_base_ac.png", "img/menu/k10_xuan1_ac.png","img/menu/k10_zhi3_ac.png"),
	particon:new Array(),
	menumsg: new Array("快乐十分（基本走势图）","快乐十分（选一走势图）",  "快乐十分（前直走势图）"),
	sp_view: new Array("基本走势图","选一走势图","前直走势图"),
	viewtext:new Array(0, 0, 0),
	datanum: new Array(0, 0, 0),
	isScross: new Array(0, 0, 0),		//是否横屏
	yilounum: new Array("0", "1|4|5|6|7|8", "0") 	//每个视图需要的遗漏序号
};
var K12view = {			
	htmlname:new Array("K12_base.html", "K12_sum.html", "K12_zhi2.html", "K12_zhi3.html"),
	menuicon:new Array("img/menu/k12_base.png", "img/menu/k12_sum.png", "img/menu/k12_zhi2.png", "img/menu/k12_zhi3.png"),
	menuicon_ac:new Array("img/menu/k12_base_ac.png", "img/menu/k12_sum_ac.png", "img/menu/k12_zhi2_ac.png", "img/menu/k12_zhi3_ac.png"),
	particon:new Array(),
	menumsg: new Array("基本走势图", "和值走势图", "前二直走势图", "前三直走势图"),
	sp_view: new Array("基本走势图","选一走势图","前直走势图"),
	viewtext:new Array(0, 0, 0, 0),
	datanum: new Array(0, 0, 0, 0),
	isScross: new Array(0, 0, 0, 0),		//是否横屏
	yilounum: new Array("0", "4", "1|2", "1|2|3") 	//每个视图需要的遗漏序号
};
var K3view_63 = {
	htmlname:new Array("K3_base.html", "K3_zonghe.html", "K3_sum_36.html", "K3_form.html", "K3_weitu.html", "K3_2thdan.html", "K3_2bt.html", "K3_3bt.html"),
	menuicon:new Array("img/menu/k3_base.png", "img/menu/k3_zonghe.png", "img/menu/k3_sum.png", "img/menu/k3_form.png", "img/menu/k3_weitu.png", "img/menu/k3_2thdan.png", "img/menu/k3_2bt.png", "img/menu/k3_3bt.png"),
	menuicon_ac:new Array("img/menu/k3_base_ac.png", "img/menu/k3_zonghe_ac.png","img/menu/k3_sum_ac.png","img/menu/k3_form_ac.png","img/menu/k3_weitu_ac.png","img/menu/k3_2thdan_ac.png","img/menu/k3_2bt_ac.png","img/menu/k3_3bt_ac.png"),
	particon:new Array("img/menu/k3_base_part.png", "img/menu/k3_zonghe_part.png","img/menu/k3_sum_part.png","img/menu/k3_form_part.png","img/menu/k3_weitu_part.png",
							"img/menu/k3_2btdan_part.png","img/menu/k3_2th_part.png","img/menu/k3_3bt_part.png"),
	menumsg: new Array("快3（基本走势图）", "快3（综合走势图）", "快3（和值走势图）", "快3（形态走势图）", "快3（位图走势图）",
							"快3（二同号单选走势图）","快3（二同二不同复选与三同号走势图）","快3（三不同号单选走势图）"),
	sp_view: new Array("基本走势图","综合走势图","和值走势图","形态走势图","位图走势图","二同号单选走势图","二同二不同复选与三同号走势图","三不同号单选走势图"),
	viewtext:new Array(0, 0, 0, 0, 0, 0, 0, 0),
	datanum: new Array(0, 0, 0, 0, 0, 0, 0, 0),
	isScross: new Array(0, 0, 0, 0, 0, 0, 0, 0),		//是否横屏
	yilounum: new Array("0|1|8", "14|15|16|0|1|8", "1|20|19|13|21", "0|1|8", "0|14|15|16","3","4|5|7","6|8") 	//每个视图需要的遗漏序号 0|1|2**1|18|13
};
var K3view_32 = {	//江苏
	htmlname:new Array("K3_base.html", "K3_sum.html", "K3_form.html", "K3_weitu.html", "K3_2thdan.html", "K3_2bt.html", "K3_3bt.html"),
	menuicon:new Array("img/menu/k3_base.png", "img/menu/k3_sum.png", "img/menu/k3_form.png", "img/menu/k3_weitu.png", "img/menu/k3_2thdan.png", "img/menu/k3_2bt.png", "img/menu/k3_3bt.png"),
	menuicon_ac:new Array("img/menu/k3_base_ac.png","img/menu/k3_sum_ac.png","img/menu/k3_form_ac.png","img/menu/k3_weitu_ac.png","img/menu/k3_2thdan_ac.png","img/menu/k3_2bt_ac.png","img/menu/k3_3bt_ac.png"),
	particon:new Array("img/menu/k3_base_part.png","img/menu/k3_sum_part.png","img/menu/k3_form_part.png","img/menu/k3_weitu_part.png",
							"img/menu/k3_2btdan_part.png","img/menu/k3_2th_part.png","img/menu/k3_3bt_part.png"),
	menumsg: new Array("快3（基本走势图）", "快3（和值走势图）", "快3（形态走势图）", "快3（位图走势图）",
							"快3（二同号单选走势图）","快3（二同二不同复选与三同号走势图）","快3（三不同号单选走势图）"),
	sp_view: new Array("基本走势图","综合走势图","和值走势图","形态走势图","位图走势图","二同号单选走势图","二同二不同复选与三同号走势图","三不同号单选走势图"),
	viewtext:new Array(0, 0, 0, 0, 0, 0, 0),
	datanum: new Array(0, 0, 0, 0, 0, 0, 0),
	isScross: new Array(0, 0, 0, 0, 0, 0, 0),		//是否横屏
	yilounum: new Array("0|1|8", "0|1|2", "0|1|8", "0|14|15|16","3","4|5|7","6|8") 	//每个视图需要的遗漏序号 0|1|2**1|18|13
};
var K3view_35 = {	//福建
	htmlname:new Array("K3_base.html", "K3_sum_35.html", "K3_form.html", "K3_weitu.html"),
	menuicon:new Array("img/menu/k3_base.png", "img/menu/k3_sum.png", "img/menu/k3_form.png", "img/menu/k3_weitu.png"),
	menuicon_ac:new Array("img/menu/k3_base_ac.png","img/menu/k3_sum_ac.png","img/menu/k3_form_ac.png","img/menu/k3_weitu_ac.png"),
	particon:new Array("img/menu/k3_base_part.png","img/menu/k3_sum_part.png","img/menu/k3_form_part.png","img/menu/k3_weitu_part.png"),
	menumsg: new Array("快3（基本走势图）", "快3（和值走势图）", "快3（形态走势图）", "快3（位图走势图）"),
	sp_view: new Array("基本走势图","综合走势图","和值走势图","形态走势图","位图走势图"),
	viewtext:new Array(0, 0, 0, 0),
	datanum: new Array(0, 0, 0, 0),
	isScross: new Array(0, 0, 0, 0),		//是否横屏
	yilounum: new Array("0|1|8", "1|18|13", "0|1|8", "0|14|15|16") 	//每个视图需要的遗漏序号
};
var K3view_36 = {	//江西
	htmlname:new Array( "K3_form.html","K3_base_36.html", "K3_sum_36.html", "K3_weitu.html","K3_2bt.html","K3_3bt.html","K3_hotnumber.html","K3_yilou.html"),
	menuicon:new Array("img/menu/k3_form.png", "img/menu/k3_base.png", "img/menu/k3_sum.png", "img/menu/k3_weitu.png",
								"img/menu/k3_2bt.png", "img/menu/k3_3bt.png", "img/menu/k3_hotnumber.png", "img/menu/k3_yilou.png"),
	menuicon_ac:new Array("img/menu/k3_form_ac.png","img/menu/k3_base_ac.png","img/menu/k3_sum_ac.png","img/menu/k3_weitu_ac.png",
								"img/menu/k3_2bt_ac.png","img/menu/k3_3bt_ac.png","img/menu/k3_hotnumber_ac.png","img/menu/k3_yilou_ac.png"),
	particon:new Array("img/menu/k3_form_part.png","img/menu/k3_base_part.png","img/menu/k3_sum_part.png","img/menu/k3_weitu_part.png",
							"img/menu/k3_2btdan_part.png","img/menu/k3_2th_part.png","img/menu/k3_3bt_part.png","img/menu/k3_3bt_part.png"),
	menumsg: new Array( "快3（形态走势图）", "快3（基本走势图）", "快3（和值走势图）","快3（位图走势图）","快3（二不同号和二同号复选走势图）", 
						"快3（三不同号走势图）", "快3（四码三不同和二同号复选走势图）", "快3（56注号码遗漏走势图）"),
	sp_view: new Array("形态走势图","基本走势图","和值走势图","位图走势图","二不同号和二同号复选走势图","三不同走势图","四码三不同和二同号复选走势图","56 注号码遗漏走势图"),
	viewtext:new Array(0, 0, 0, 0, 0, 0, 0, 0),
	datanum: new Array(0, 0, 0, 0, 0, 0, 0, 0),
	isScross: new Array(0, 0, 0, 0, 0, 0, 0, 0),		//是否横屏
	yilounum: new Array("0|1|8", "0|1|20", "1|20|19|13|21", "0|14|15|16", "4|5|7", "6|8", "0|6|4","") 	//每个视图需要的遗漏序号
};
var K3view_52 = {	//贵州
	htmlname:new Array( "K3_form.html","K3_base_52.html", "K3_sum.html", "K3_weitu.html","K3_2bt.html","K3_3bt.html","K3_hotnumber.html","K3_yilou.html"),
	menuicon:new Array("img/menu/k3_form.png", "img/menu/k3_base.png", "img/menu/k3_sum.png", "img/menu/k3_weitu.png",
								"img/menu/k3_2bt.png", "img/menu/k3_3bt.png", "img/menu/k3_hotnumber.png", "img/menu/k3_yilou.png"),
	menuicon_ac:new Array("img/menu/k3_form_ac.png","img/menu/k3_base_ac.png","img/menu/k3_sum_ac.png","img/menu/k3_weitu_ac.png",
								"img/menu/k3_2bt_ac.png","img/menu/k3_3bt_ac.png","img/menu/k3_hotnumber_ac.png","img/menu/k3_yilou_ac.png"),
	particon:new Array("img/menu/k3_form_part.png","img/menu/k3_base_part.png","img/menu/k3_sum_part.png","img/menu/k3_weitu_part.png",
							"img/menu/k3_2btdan_part.png","img/menu/k3_2th_part.png","img/menu/k3_3bt_part.png","img/menu/k3_3bt_part.png"),
	menumsg: new Array( "快3（形态走势图）", "快3（基本走势图）", "快3（和值走势图）","快3（位图走势图）","快3（二不同号和二同号复选走势图）", 
						"快3（三不同号走势图）", "快3（四码三不同和二同号复选走势图）", "快3（56注号码遗漏走势图）"),
	sp_view: new Array("形态走势图","基本走势图","和值走势图","位图走势图","二不同号和二同号复选走势图","三不同走势图","四码三不同和二同号复选走势图","56 注号码遗漏走势图"),
	viewtext:new Array(0, 0, 0, 0, 0, 0, 0, 0),
	datanum: new Array(0, 0, 0, 0, 0, 0, 0, 0),
	isScross: new Array(0, 0, 0, 0, 0, 0, 0, 0),		//是否横屏
	yilounum: new Array("0|1|8", "0|1|11|12", "0|1|2", "0|14|15|16", "4|5|7", "6|8", "0|6|4","") 	//每个视图需要的遗漏序号
};
var K3view_54 = {	//西藏
	htmlname:new Array("K3_base.html", "K3_sum.html", "K3_form.html", "K3_weitu.html","K3_2thdan.html","K3_2bt.html","K3_3bt.html"),
	menuicon:new Array("img/menu/k3_base.png", "img/menu/k3_sum.png", "img/menu/k3_form.png", "img/menu/k3_weitu.png", "img/menu/k3_2thdan.png", "img/menu/k3_2bt.png", "img/menu/k3_3bt.png"),
	menuicon_ac:new Array("img/menu/k3_base_ac.png","img/menu/k3_sum_ac.png","img/menu/k3_form_ac.png","img/menu/k3_weitu_ac.png","img/menu/k3_2thdan_ac.png","img/menu/k3_2bt_ac.png","img/menu/k3_3bt_ac.png"),
	particon:new Array("img/menu/k3_base_part.png","img/menu/k3_sum_part.png","img/menu/k3_form_part.png","img/menu/k3_weitu_part.png",
							"img/menu/k3_2btdan_part.png","img/menu/k3_2th_part.png","img/menu/k3_3bt_part.png"),
	menumsg: new Array("快3（基本走势图）", "快3（和值走势图）", "快3（形态走势图）", "快3（位图走势图）",
						"快3（二同号单选走势图）","快3（二同二不同复选与三同号走势图）","快3（三不同号单选走势图）"),
	sp_view: new Array("基本走势图","和值走势图","形态走势图","位图走势图","二同号单选走势图","二同二不同复选与三同号走势图","三不同号单选走势图"),
	viewtext:new Array(0, 0, 0, 0, 0, 0, 0),
	datanum: new Array(0, 0, 0, 0, 0, 0, 0),
	isScross: new Array(0, 0, 0, 0, 0, 0, 0),		//是否横屏
	yilounum: new Array("0|1|8", "0|1|2", "0|1|8", "0|14|15|16", "3", "4|5|7", "6|8") 	//每个视图需要的遗漏序号
};
var K3view_22 = {	//吉林
	htmlname:new Array("K3_base.html", "K3_sum.html", "K3_form.html", "K3_weitu.html","K3_2thdan.html","K3_2bt.html","K3_3bt.html","K3_3ma.html"),
	menuicon:new Array("img/menu/k3_base.png", "img/menu/k3_sum.png", "img/menu/k3_form.png", "img/menu/k3_weitu.png", "img/menu/k3_2thdan.png", "img/menu/k3_2bt.png", "img/menu/k3_3bt.png", "img/menu/k3_3ma.png"),
	menuicon_ac:new Array("img/menu/k3_base_ac.png","img/menu/k3_sum_ac.png","img/menu/k3_form_ac.png","img/menu/k3_weitu_ac.png","img/menu/k3_2thdan_ac.png","img/menu/k3_2bt_ac.png","img/menu/k3_3bt_ac.png","img/menu/k3_3ma_ac.png"),
	particon:new Array("img/menu/k3_base_part.png","img/menu/k3_sum_part.png","img/menu/k3_form_part.png","img/menu/k3_weitu_part.png",
							"img/menu/k3_2btdan_part.png","img/menu/k3_2th_part.png","img/menu/k3_3bt_part.png","img/menu/k3_3ma_part.png"),
	menumsg: new Array("快3（基本走势图）", "快3（和值走势图）", "快3（形态走势图）", "快3（位图走势图）",
						"快3（二同号单选走势图）","快3（二同二不同复选与三同号走势图）","快3（三不同号单选走势图）","快3（三码走势图）-横屏"),
	sp_view: new Array("基本走势图","和值走势图","形态走势图","位图走势图","二同号单选走势图","二同二不同复选与三同号走势图","三不同号单选走势图","三码走势图（横屏）"),
	viewtext:new Array(0, 0, 0, 0, 0, 0, 0, 0),
	datanum: new Array(0, 0, 0, 0, 0, 0, 0, 0),
	isScross: new Array(0, 0, 0, 0, 0, 0, 0, 1),		//是否横屏
	yilounum: new Array("0|1|8", "0|1|2", "0|1|8", "0|14|15|16", "3", "4|5|7", "6|8", "0|1|8|7|10|6") 	//每个视图需要的遗漏序号
};
var K3view_46 = {	//海南的快乐三宝
	htmlname:new Array("K3_base_52.html", "K3_sum.html", "K3_form.html", "weitu.html"),
	menuicon:new Array("img/menu/k3_base.png", "img/menu/k3_sum.png", "img/menu/k3_form.png", "img/menu/k3_weitu.png"),
	menuicon_ac:new Array("img/menu/k3_base_ac.png","img/menu/k3_sum_ac.png","img/menu/k3_form_ac.png","img/menu/k3_weitu_ac.png"),
	menumsg: new Array("快乐三宝（基本走势图）", "快乐三宝（和值走势图）", "快乐三宝（形态走势图）", "快乐三宝（位图走势图）"),
	sp_view: new Array("快乐三宝（基本走势图）", "快乐三宝（和值走势图）", "快乐三宝（形态走势图）", "快乐三宝（位图走势图）"),
	particon:new Array(),
	viewtext:new Array(0, 0, 0, 0),
	datanum: new Array(0, 0, 0, 0),
	isScross: new Array(0, 0, 0, 0),		//是否横屏
	yilounum: new Array("0|1|11|12", "1|18|13", "0|1|8", "0|14|15|16") 	//每个视图需要的遗漏序号
};
var XYCview = {		//幸运彩
	htmlname:new Array("XYC_base1.html", "XYC_base2.html", "XYmo_base.html", "XYmo_sum.html", "Warrior_base.html", "Warrior_sum.html"),
	menuicon:new Array("img/menu/xyc_base1.png", "img/menu/xyc_base2.png", "img/menu/xymo_base.png", "img/menu/xymo_sum.png", "img/menu/warrior_base.png", "img/menu/warrior_sum.png"),
	menuicon_ac:new Array("img/menu/xyc_base1_ac.png","img/menu/xyc_base2_ac.png","img/menu/xymo_base_ac.png","img/menu/xymo_sum_ac.png","img/menu/warrior_base_ac.png","img/menu/warrior_sum_ac.png"),
	particon:new Array("", "", "", "", "", ""),
	menumsg: new Array("幸运彩（基本走势一）","幸运彩（基本走势二）","幸运魔方（基本走势）","幸运魔方（和值与形态走势图）","勇士争先（基本走势）","勇士争先（和值走势）"),
	sp_view: new Array("幸运彩（基本走势一）","幸运彩（基本走势二）","幸运魔方（基本走势）","幸运魔方（和值与形态走势图）","勇士争先（基本走势）","勇士争先（和值走势）"),
	viewtext: new Array(0, 0, 0, 0, 0, 0),	//不同视图的信息提示不同，长周期和设置页面不需要
	datanum: new Array(0, 0, 0, 0, 0, 0),
	isScross: new Array(0, 0, 0, 0, 0, 0),		//是否横屏
	yilounum: new Array("0|5", "6|7|5", "0", "1|2|3|4","6|7|5","9")	//每个视图需要的遗漏序号
};
var ALLview ={		//K_public.CS_name，K_public.CS_text的长周期玩法名 也要同步
	htmlname: new Array("B001.html", "S3_63.html", "QL730.html", "setting.html"),
	menuicon: new Array("img/menu/b001.png", "img/menu/s3.png", "img/menu/ql730.png", "img/menu/set.png"),
	menuicon_ac: new Array("img/menu/b001_ac.png", "img/menu/s3_ac.png", "img/menu/ql730_ac.png", "img/menu/set_ac.png"),
	particon: new Array("img/menu/b001_part.png", "img/menu/s3_part.png","img/menu/ql730_part.png"),
	menumsg: new Array("双色球（基本走势图）", "3D（基本走势图）", "七乐彩（基本走势图）", "个性化设置"),
	viewtext: new Array(2, 2, 2, 2),
	datanum: new Array(0, 1, 2, 3),
	isScross: new Array(0, 0, 0, 0),		//是否横屏
	yilounum: new Array("0|1", "0|1|2|3", "0") 	//每个视图需要的遗漏序号
};
//var ALLview ={
//	htmlname: new Array("B001.html", "S3.html", "QL730.html", "Sp61.html", "QL515.html", "setting.html"),
//	menuicon: new Array("img/menu/b001.png", "img/menu/s3.png", "img/menu/ql730.png", "img/menu/sp61.png", "img/menu/ql515.png","img/menu/set.png"),
//	menuicon_ac: new Array("img/menu/b001_ac.png", "img/menu/s3_ac.png", "img/menu/ql730_ac.png", "img/menu/sp61_ac.png", "img/menu/ql515_ac.png", "img/menu/set_ac.png"),
//	particon: new Array("img/menu/b001_part.png", "img/menu/s3_part.png","img/menu/ql730_part.png", "img/menu/sp61_part.png", "img/menu/ql515_part.png"),
//	menumsg: new Array("双色球（基本走势图）", "3D（基本走势图）", "七乐彩（基本走势图）", "东方6+1（基本走势图）", "15选5（基本走势图）","个性化设置"),
//	viewtext: new Array(2, 2, 2, 2, 2, 2),
//	datanum: new Array(0, 1, 2, 3, 4, 5),
//	yilounum: new Array("0|1", "0|1|2|3", "0", "7|9|11|6","0|1|2|3|4|5") 	//每个视图需要的遗漏序号
//};
//var ALLview ={		//可用玩法最少的情况，起码有设置
//	htmlname: new Array("setting.html"),
//	menuicon: new Array("img/menu/set.png"),
//	menuicon_ac: new Array("img/menu/set_ac.png"),
//	particon: new Array(),
//	menumsg: new Array("个性化设置"),
//	viewtext: new Array(),
//	datanum: new Array(),
//	yilounum: new Array() 	//每个视图需要的遗漏序号
//};
var gameArray = { 
	playname : new Array(K2NAME, K3NAME, XYCNAME, K10NAME, K12NAME), //所有玩法
	relationview: new Array(K2view, K3view_22, XYCview, K10view, K12view),
	settingtext : new Array("快2","快3","幸运彩","快乐10分","快乐12"),
	playstate : new Array(2, 2, 2, 2, 2),			 //目前状态，0为等待开奖中，1为新期等待中，2为新期售卖中（只兑）
	playLastate: new Array(2, 2, 2, 2, 2),
	remainTime :new Array(0, 0, 0, 0, 0),
	waitTime : new Array(0, 0, 0, 0, 0),
	newterm: new Array({termcode:"",endtime:"",encashFlag:0}, {termcode:"",endtime:"",encashFlag:0}, {termcode:"",endtime:"",encashFlag:0}, {termcode:"",endtime:"",encashFlag:0}, {termcode:"",endtime:"",encashFlag:0}),
	getPriceinfoTime: new Array(10, 15, 15, 15, 15),
	getTermTime : new Array(15, 25, 25, 25, 25),
	todaynote : new Array(new Array(), new Array(), new Array(), new Array(), new Array()),
	maindata: new Array(new Array(), new Array(), new Array(), new Array(), new Array()),
	loadFunction : new Array(preloadK2,preloadK3,preloadXYC,preloadK10,preloadK12),
};
var ALL_COLOR = new Array("black", "orangered","#e8980e", "blue","green","purple");	//号码颜色
var K_public={
	hasNoFlag: false,	//有没有默认视图为no的选项
	playHtmlMvflag:true,		//是否播放开奖动画和奖池
	haslx:0,	//是否有三连号,0代表没有
	ipCode:false,		//修改是否需要密码
	skinFlag:true,		//是否有简约多彩风格选项
	isfuping :false,  //是否为副屏
	setFuping:false,	//个性化是否带有副屏设置
	CS_COUNT:ALLview.htmlname.length-1,
	CS_name:new Array("B001","S3","QL730"),
	CS_text:new Array("双色球", "3D", "七乐彩"),
	K2_PL: new Array(),//所有号码组合
	K3_PL: new Array(),//所有号码组合
	all56:new Array(),
	MAX_ROWCOUNT:50,//最大显示期数
	MAX_PAGE:6, //总页数
	KPROWCOUNT:27,
	K2_WIN_NUMBER:1,
	K2_ALL_NUMBER:22,
	K3_WIN_NUMBER:3,
	K3_ALL_NUMBER:6,
	K10_WIN_NUMBER:8,
	K10_ALL_NUMBER:20,
	K12_WIN_NUMBER:5,
	K12_ALL_NUMBER:12,
	cut:0,//日切点
	headheight:74,
	bottomheight:44,
	weekday:new Array("星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"),
	COLOR:new Array(ALL_COLOR[person_setting.lh3color],ALL_COLOR[person_setting.bt3color],ALL_COLOR[person_setting.th2color],ALL_COLOR[person_setting.th3color]),	//号码颜色
	CLASS:new Array("lh3","bt3","th2","th3"),
	S3_COLOR:new Array("green", "black", "orangered", "blue"),
	repeattime:3, //当开奖号码没取到时间隔时间 
	termtime:600, //期长
	spterm:5, 	//当新期没取到时间隔时间
	tacolor:function(){
		for(var i in K_public.CLASS)
			myframe.$("."+K_public.CLASS[i]).css("color" , K_public.COLOR[i]);
	}
};
var B001PricePool={
	term_code:"",  		 //当前期
	innext_firstaward:0, 			//奖池累金(已取整，元)
	big_win_num:0,			 //大奖个数 (已取整，个数为0不显示)
	big_win_amount:0, //大奖金  (已取整，元需截位为亿元，为0不显示)
};
var Longdata = {
	getlongdata_time:6,//获取长周期的时间，每天6点
	WIN_B001:7,
	ALL_B001:33,
	WIN_S3:3,
	ALL_S3:10,
	WIN_QL730:8,
	ALL_QL730:30,
	WIN_SP61:7,
	ALL_SP61:10,
	WIN_I515:5,
	ALL_I515:15
};
var PLAYING = 0;
var mainnote = []; //所有玩法的note
var s3color = []; //存储3D号码颜色
var PLAY;
var thissant ;	//56注号码遗漏
var yestonote_k2 =[];//上交易日的
var yestonote_k3= [];
var weichustr_k2 = "";
var weichustr_k3 = [];
var longflag = 0;//长周期获取的标志
var yilouarr = [];
var firstCSview = 0;
var mainhui = []; //快乐10分299期的回摆
var addnote= []; //299期以外的数据，需要留着
var $frame =$("#ifrContent").contents();
function ajustPlayView(){
	//gameArray.playname = new Array(k2name,k3name, "B001","S3","QL730");	//全，不需修改
	var arr = [];	
	for(var i in gameArray.playname){		
		if(person_setting.sp_playEname.indexOf(gameArray.playname[i])<0){
			arr.push(i);	//存储没用玩法的序号
		}else gameArray.loadFunction[i]();
	}
	if(K_public.skinFlag)skinload();
	arr.sort(function(a,b){return b-a});
	for(var i in arr){
		for(var key in gameArray)
			gameArray[key].splice(arr[i],1);	//过滤掉不用的玩法，筛选出要用的视图
	}
	for(var x in gameArray.relationview){
		if(x>0){
			for(var i in gameArray.relationview[x].datanum)
				gameArray.relationview[x].datanum[i]+=1;
		} 
		for(var i in ALLview.datanum)  ALLview.datanum[i]+=1;
		for(var key in ALLview){
			ALLview[key] = gameArray.relationview[x][key].concat(ALLview[key]);	
		}
	}
	//if(K_public.isfuping){		//副屏不需要菜单页的内容
		for(var i in K_public.CS_name){
			if(i<K_public.CS_COUNT){
				gameArray.playname.push(K_public.CS_name[i]);
				gameArray.settingtext.push(K_public.CS_text[i]);
			}
		}
		for(var i in ALLview.htmlname){
			$(".i"+i).css("background-image","url("+ALLview.menuicon[i]+")");
			$(".i"+i).find(".part").css("background-image","url("+ALLview.particon[i]+")");
		}
		if(ALLview.htmlname.length>12){
			$("#ad").css("background-image","none");
			$(".menubody").css("top",0);
		} 
	//}
}
function getlongdata(){
	if(new Date().getHours()==Longdata.getlongdata_time&&longflag==0){
		console.log("到了凌晨自动更新时间");
		FLAG = 0;
		if($("#ifrContent").attr("src")!="about:blank")	theload();
		getalldata(); //每天五点或重启取长周期数据
		longflag = 1;
		FLAG = 1;
		loadpage();
	}else if(longflag == 1&&new Date().getHours()!=Longdata.getlongdata_time) longflag = 0;
	if(K_public.isfuping){			//副屏定时取文字通知
		noticelist=dataUtils.getNotification();
		putNotification();
	}

}

//倒计时
function CountDown(nameindex){
	gameArray.playLastate[nameindex] = gameArray.playstate[nameindex];
	if(parseInt(gameArray.remainTime[nameindex])>=1){
		gameArray.remainTime[nameindex]--;
		if(gameArray.playstate[nameindex]==2){				//新期售卖的时候
			if(parseInt(gameArray.remainTime[nameindex])%10==0||parseInt(gameArray.remainTime[nameindex])==5)//每半分钟调整一次倒计时 ,最后五秒再调一次
				gameArray.remainTime[nameindex] = dataUtils.getDate2(gameArray.newterm[nameindex].endtime,nameindex);
			if($("#ifrContent").attr("src")!="about:blank"&&ALLview.datanum[currentSelect]==nameindex){
				try{
					if(myframe.trendModel.page()==K_public.MAX_PAGE - 1||myframe.trendModel.page()==myframe.max_page-1)
			 			myframe.htmlUtils.countDown(gameArray.remainTime[nameindex],ALLview.viewtext[currentSelect]);
				}catch(e){
					//TODO handle the exception
				}
			}
		}
	}else if(parseInt(gameArray.remainTime[nameindex])==0){
		var nowdj  = 0-dataUtils.getDate2(gameArray.newterm[nameindex].endtime,nameindex);
		if(nowdj>=gameArray.getPriceinfoTime[nameindex]){//到了开奖动画时间
			if(gameArray.playstate[nameindex]==1){			//新期等待
				if(nowdj>=gameArray.getTermTime[nameindex]){
					if(dataUtils.getcountime(nameindex)<0) gameArray.remainTime[nameindex] = nowdj<K_public.termtime?K_public.spterm:K_public.spterm*6;
					else{			//取到了新期
						gameArray.playstate[nameindex] = 2;
						gameArray.remainTime[nameindex] = dataUtils.getDate2(gameArray.newterm[nameindex].endtime,nameindex);
					}
				}else gameArray.remainTime[nameindex] = 0;
			}else if(newdata(nameindex, gameArray.newterm[nameindex].encashFlag)){//取新的开奖号码
				if(K_public.playHtmlMvflag&&gameArray.playname[nameindex]==K3NAME&&PLAYING==0){			//快3有开奖动画的情况
						var mvres=false;
						var newnote = mainnote[nameindex][mainnote[nameindex].length-1];
						if(gameArray.newterm[nameindex].encashFlag!=1) mvres = dataUtils.playMvandB001(newnote.term+"|0"+newnote.numbers.join("0")+"|"
								+B001PricePool.term_code+"|"+B001PricePool.innext_firstaward+"|"+B001PricePool.big_win_num+"|"+B001PricePool.big_win_amount);
						if(mvres){
							if(debugflag!=0) dataUtils.getB001();//取奖池
							PLAYING = 1;
							putplay(gameArray.newterm[nameindex].encashFlag);
							gameArray.remainTime[nameindex] = 10;
						}else{
							gameArray.playstate[nameindex] = 1;//变成新期等待
							gameArray.remainTime[nameindex] = 0;
							dataUtils.getSysParam(nameindex); //获取期结数据
							noticelist=dataUtils.getNotification();
							if($("#ifrContent").attr("src")!="about:blank"&&ALLview.datanum[currentSelect]==nameindex&&ALLview.viewtext[currentSelect]<2){
								theload();
								loadpage();
								if(gameArray.newterm[nameindex].encashFlag!=1&&!K_public.playHtmlMvflag) dataUtils.openMedia();
							} 
						}
				}else{
					gameArray.playstate[nameindex] = 1;//变成新期等待
					gameArray.remainTime[nameindex] = 0;
					dataUtils.getSysParam(nameindex); //获取期结数据
					noticelist=dataUtils.getNotification();
					if($("#ifrContent").attr("src")!="about:blank"&&ALLview.datanum[currentSelect]==nameindex&&ALLview.viewtext[currentSelect]<2){
						theload();
						loadpage();
						if(gameArray.newterm[nameindex].encashFlag!=1&&!K_public.playHtmlMvflag) dataUtils.openMedia();
					} 
				}
			}else{
				gameArray.playstate[nameindex] = 0;
				gameArray.remainTime[nameindex] = K_public.repeattime;//3秒取一次开奖号码
			}
		}else if(gameArray.playstate[nameindex] !=0){//等待开奖中
			dataUtils.closeMedia();
			gameArray.playstate[nameindex] = 0;
			gameArray.remainTime[nameindex] = 0;
		}
	}else if(parseInt(gameArray.remainTime[nameindex])<0){
		if(0-parseInt(gameArray.remainTime[nameindex])<gameArray.getPriceinfoTime[nameindex]){//还没到期结后多久取开奖公告
			gameArray.playstate[nameindex] = 0;
			gameArray.remainTime[nameindex] = 0;//等到时间结束
		}else if(gameArray.newterm[nameindex].termcode==mainnote[nameindex][mainnote[nameindex].length-1].term){//取到了开奖号码
				gameArray.playstate[nameindex] = 1;
				if(0-parseInt(gameArray.remainTime[nameindex])<K_public.GetTermTime){//还没到期结后多久取新期
					gameArray.remainTime[nameindex] = 0;//等到时间结束
				}else if(0-parseInt(gameArray.remainTime[nameindex])<gameArray.getTermTime[nameindex]){//小于一个期长
					gameArray.remainTime[nameindex] = K_public.spterm;//重复取新期
				}else{//大于一个期长
					gameArray.remainTime[nameindex] = K_public.spterm*6;//重复取新期，时间间隔慢点
				}
		}else{
			gameArray.playstate[nameindex] = 0;//console.log(":K_public.repeattime");
			gameArray.remainTime[nameindex]=K_public.repeattime;//3秒取一次开奖号码
		}
	}
	if(gameArray.playLastate[nameindex]!=gameArray.playstate[nameindex]){//变动状态
		if($("#ifrContent").attr("src")!="about:blank"&&ALLview.datanum[currentSelect]==nameindex){
			try{
				if(myframe.trendModel.page()==K_public.MAX_PAGE - 1||myframe.trendModel.page()==myframe.max_page-1)
		 			myframe.htmlUtils.prompt(gameArray.playstate[nameindex],ALLview.viewtext[currentSelect]);
			}catch(e){
				//TODO handle the exception
			}
		}
	}
}
function getalldata(){
	mainnote = [];mainhui = [];
	yilouarr = dataUtils.getmaxyilou();//获取所有遗漏信息
	for(var i in gameArray.playname){
		if(i<gameArray.playname.length-K_public.CS_COUNT) gameArray.maindata[i]=[];
		mainnote.push(loadAllData(gameArray.playname[i]));
	}
	noticelist=dataUtils.getNotification();
}
function loadAllData(name){
	if(name==K2NAME) return dataUtils.loadDataK2();
	else if(name==K3NAME) return dataUtils.loadDataK3();
	else if(name==K12NAME) return dataUtils.loadDataK12();
	else if(name==K10NAME) return dataUtils.loadDataK10();
	else if(name==XYCNAME) return dataUtils.loadDataxyc();
	else if(name=="B001") return dataUtils.getDcb();
	else if(name=="S3") return dataUtils.get3D();
	else if(name=="QL730") return dataUtils.get7L();
	else if(name=="SP61") return dataUtils.getSp61();
	else if(name=="QL515") return dataUtils.getI515();
}
function newdata(n,encash){
	if(gameArray.playname[n]==K3NAME&&K_public.playHtmlMvflag&&PLAYING==1){
		return true;
	}else{
		var re =  dataUtils.getnewData(n);
		if(re)	return true;
		else if(encash==1){
			console.log("只兑期");
			return true;
		}else return false;
	}
}
var noticelist =[];//文字通知

//添加数据并加载页面
function loadpage(){
	if($("#ifrContent").attr("src")!="about:blank"&&currentSelect!=ALLview.htmlname.length-1){
		console.log("刷新"+$("#ifrContent").attr("src")+"视图的页面数据");
		if(ALLview.isScross[currentSelect]==1){
			if(ALLview.viewtext[currentSelect]<2) myframe.maindata = gameArray.maindata[ALLview.datanum[currentSelect]].slice(1-K_public.MAX_PAGE*K_public.KPROWCOUNT);
			myframe.trendModel.mainnote(mainnote[ALLview.datanum[currentSelect]].slice(1-K_public.MAX_PAGE*K_public.KPROWCOUNT));
			myframe.max_page = Math.min(K_public.MAX_PAGE, Math.ceil((mainnote[ALLview.datanum[currentSelect]].length+1) / K_public.KPROWCOUNT));		//更新最大页数
		}else{
			if(ALLview.viewtext[currentSelect]<2) myframe.maindata = gameArray.maindata[ALLview.datanum[currentSelect]].slice(1-K_public.MAX_PAGE*K_public.MAX_ROWCOUNT);
			myframe.trendModel.mainnote(mainnote[ALLview.datanum[currentSelect]]);
			myframe.max_page = Math.min(K_public.MAX_PAGE, Math.ceil((mainnote[ALLview.datanum[currentSelect]].length+1) / K_public.MAX_ROWCOUNT));		//更新最大页数
		}
		if(gameArray.playname[ALLview.datanum[currentSelect]]==K3NAME){
			myframe.trendModel.weichuk3(weichustr_k3);
			K_public.tacolor();
		}
		putNotification();//文字通知滚动 
		myframe.showPage(0);
	}
	layer.close(index); 
}
function putNotification(){
	$frame =$("#ifrContent").contents();
	$frame.find("#notice").empty();
	var speed = 2;
	for(var i = 0; i<noticelist.length;i++){
		$frame.find("#notice").append("<span></span>");
		$frame.find("#notice").find("span").eq(i).text(noticelist[i].content);
		speed=parseInt(noticelist[i].speed);
	}
	//通知信息放入网页
	if(speed==1){
		$frame.find("#notice").attr("scrollamount","3");
	}else if(speed==2){
		$frame.find("#notice").attr("scrollamount","4");
	}else if(speed==3){
		$frame.find("#notice").attr("scrollamount","5");
	}
}
function countweichu_k2(mnote){
	var arr =[];
	arr = arr.concat(dataUtils.getbefore(mnote,1));//昨日出现的号码
	var arr2 = [];
	var str = "";
	for (var i = 0; i < arr.length; i++) {
		var r = arr[i].numbers[0]==22?21:arr[i].numbers[0];
		if (arr2.indexOf(r)<0&&K_public.K2_PL.indexOf(r) >= 0) {
			arr2.push(r);//获取几日里已出的
		}
	}
	var count =0;
	for (var i = 0; i < K_public.K2_PL.length; i++) {
		if (arr2.indexOf(K_public.K2_PL[i]) < 0) {
			count++;
			if(count>15){
				str = str+"<span> ...</span>";
				break;
			}
			var gg = dataUtils.jtyichuK2(todaynote_k2, K_public.K2_PL[i]);
			var nn = dataUtils.yilou(todaynote_k2,K_public.K2_PL[i], yilouarr[0].cur_yilou.split(",").slice(0,21).map(Math.abs)[i]);
			var num =K_public.K2_PL[i]>20?"公益":K_public.K2_PL[i];
			str = str + "<span style='color:" + gg + "'> " + num + "</span><span class=\"ll\">("+nn+")</span>";
		}
	}
	return str;
}
function putplay(flag){		//延时调用播放视频
	var tm = 13;		//安卓版本的延时了的,大于开奖动画时间，否则有点问题
	if(parseFloat(B001PricePool.innext_firstaward)>0){
		tm+=5;
		if(parseFloat(B001PricePool.big_win_num)>0&&parseFloat(B001PricePool.big_win_amount)>0){
			tm+=5;
		}
	} 
	console.log(tm+"秒后调用播放视频");
	if(PLAY)clearTimeout(PLAY);
	PLAY =  setTimeout(function(){
		PLAYING=0;
		if(flag!=1) dataUtils.openMedia(); 
		if($("#ifrContent").attr("src")!="about:blank"){
			try{
				myframe.window.htmlUtils.putcss();
			}catch(e){
				//location.reload();
			}
		} 
	},tm*1000);
}
function getalldiagram(note,yilou){		//快三所有号码组合遗漏 号码顺序和56注遗漏图右边一样：三同号+二同号+三不同
	var alldiagram = [];
	alldiagram.push(yilou);
	for(var i=0;i<note.length;i++){
		alldiagram.push(getDiagram(alldiagram, note[i].numbers));
	}
	return alldiagram;
}
function getDiagram(arr,num){
	var a= new Array(56);
	num = [num[0],num[1],num[2]].sort();
	var n = num[0]*100+num[1]*10+num[2]+"";
	for(var i=0;i<K_public.all56.length;i++){
		if(n==K_public.all56[i])
			a[i]=0;
		else {
			if (arr.length > 0) {
				a[i] = arr[arr.length - 1][i] + 1;
			} else {
				a[i] = 1;
			}
		}
	}
	return a;
}
function addscross(){
	$("#isScross").attr("href", "css/isScross.css");
	if(person_setting.skinStyle==1){$("body").css("background-image","url(img/new_back_s.jpg)");}
}
function removescross(){
	$("#isScross").attr("href", "");
	if(person_setting.skinStyle==1){$("body").css("background-image","url(img/background.png)");}
}