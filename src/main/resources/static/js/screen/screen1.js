var emphasisCaseChart = {att:null,sen:null};
var timer_eventTrend,timer_eventList,timer_eventScroll;
var	timer_sensitiveTrend,timer_sensitiveList,timer_sensitiveScroll;
var timer_provinceHot,timer_weiboHot;
var timer_provinceScroll,timer_weiboHotScroll;
//数据更新周期，单位秒
var updateInterval = 60*2;
var updateInterval_list = 60;
var hotRankingTime = 180;
var mediaTypeGlobal;
var baseUrl;
var orderDataTime = 60*5;
var allTotalSum=[];var wechatsum=[];var newssum=[];var weibosum=[];var clientsum=[];var blogsum=[];
var overseasum=[];var bbssum=[];var papersum=[];
var allTotalCount=[];var traditionalCurrentTotalCount=[];var newCurrentTotalCount=[];var traditionalTotalCount=[];var newTotalCount=[];
var allComm=[];var currentWeekTask=[];var currentWeekComm=[];var allTask=[];var allComm=[];
var aStep;
var jsonObject={
		"allTotalSum":0,
		"wechatsum":0,
		"newssum":0,
		"weibosum":0,
		"clientsum":0,
		"blogsum":0,
		"overseasum":0,
		"bbssum":0,
		"papersum":0,
		"allTotalCount":0,
		"traditionalCurrentTotalCount":0,
		"newCurrentTotalCount":0,
		"traditionalTotalCount":0,
		"newTotalCount":0,
		"allComm":0,
		"currentWeekTask":0,
		"currentWeekComm":0,
		"allTask":0,
		//"allComm":0
};

$(function(){
	jsonObject.allTotalSum=allTotalSum;
	jsonObject.wechatsum=wechatsum;
	jsonObject.newssum=newssum;
	jsonObject.weibosum=weibosum;
	jsonObject.clientsum=clientsum;
	jsonObject.blogsum=blogsum;
	jsonObject.overseasum=overseasum;
	jsonObject.bbssum=bbssum;
	jsonObject.papersum=papersum;
	jsonObject.allTotalCount=allTotalCount;
	jsonObject.traditionalCurrentTotalCount=traditionalCurrentTotalCount;
	jsonObject.newCurrentTotalCount=newCurrentTotalCount;
	jsonObject.traditionalTotalCount=traditionalTotalCount;
	jsonObject.newTotalCount=newTotalCount;
	jsonObject.allComm=allComm;
	jsonObject.currentWeekTask=currentWeekTask;
	jsonObject.currentWeekComm=currentWeekComm;
	jsonObject.allTask=allTask;
	//jsonObject.allComm=allComm;
	//点击按钮弹出网页信息弹窗
	$(".hotRankList a").die("click").live("click",function(){
		$("#iframe").attr("src",$(this).attr("value"));
		$("#iframe").attr("src");
		$(".pageInfo").show();
		return false;
	});
	//点击按钮弹出网页信息弹窗
	$(".pCaseList a").die("click").live("click",function(){
		$("#iframe").attr("src",$(this).attr("value"));
		$("#iframe").attr("src");
		$(".pageInfo").show();
		return false;
	});
	$(".closePageInfo").click(function(){
		$(".pageInfo").hide();
		return false;
	});
	baseUrl= $("#sysip").val();
	dynamicCase.init();
	getSensitiveDataAjax(1);//初始化敏感信息列表及趋势折线图,需要放在initCharts方法前面
	initCharts();  //初始化行政区域
	getOrderData();//获取网评的统计数据
	initHotWordCloud();  //初始化热词云
	senInfoSwitch();  //关注敏感信息类型切换
	handleCaseTrendSwitch();  //切换关注事件趋势事件
	getHotRankingData();//2处热点排行榜，定时滚动列表
	initTimer();//2处热点排行榜,定时从后台更新数据
	handleFold();

});

//地图数据折叠
function handleFold() {
	$('#shanxiProvince').on('click','.j_foldBtn',function(){
		if($(this).hasClass('open')){
			$(this).removeClass('open').next().slideUp();
			if($('.j_foldBtn.open').size() == 0){
				//$('#shanxiProvince').removeClass('dSlideDown');
			}
		}else{
			$(this).addClass('open').next().slideDown();
			//$('#shanxiProvince').addClass('dSlideDown');
		}
	});
}

//初始化热点云
function initHotWordCloud(){
	$('#wholeCouHotWord').windstagball({
		radius:100,
		speed:0.5,
		depth:1200,
		fontsize:38
	});
	$('#wechatHotWord').windstagball({
		radius:100,
		speed:0.5,
		depth:1200,
		fontsize:38
	});
}

	var dynamicCase = {
		curData:[],
		loadTimeInt:180000,  //定时加载事件数据时间间隔
		refreshTimeInt:30000  //定时更新事件时间间隔
	};
	//初始化动态更新数据方法
	dynamicCase.init = function(){
		$.ajax({
			type:"get",
			url:baseUrl+'/screen/screen_one!getLeftEventList.do',
			dataType:"json",
			success:function(data){
				if (data.length == 0) {
					return;
				}
				for ( var i = 0; i < data.length; i++ ) {
					var html;
					//热词
				//	var reci = data[i].hotWords;
				//	reci = reci=="" ? "无" : reci+"等";
					var type= data[i].topicName.substring(0,1);
					if (i == 0) {
						html='<li>' +
							'<span class="tag">'+type+'</span>' +
							'<a href="javascript:;" class="showTrent cur"></a>' +
							'<a href="'+baseUrl+'/screen/screen_two!toScreen2.do?eventId='+data[i].id+'&eventName='+data[i].title+'" class="caseText">'+data[i].title+'</a>' +
							'<input type="hidden" class="caseEid" value="'+data[i].id+'" />' +
							'<div class="caseInfo clearfix">' +
								'<label class="left">相关信息：</label><a class="left infoValue" href="#">'+data[i].sum+'条</a>' +
					//			'<label class="left">热词：</label><span class="left infoValue" href="#">'+reci+'</span>' +
							'</div>' +
						'</li>'
					}else{
						html='<li>' +
							'<span class="tag">'+type+'</span>' +
							'<a href="javascript:;" class="showTrent"></a>' +
							'<a href="'+baseUrl+'/screen/screen_two!toScreen2.do?eventId='+data[i].id+'&eventName='+data[i].title+'" class="caseText">'+data[i].title+'</a>' +
							'<input type="hidden" class="caseEid" value="'+data[i].id+'" />' +
							'<div class="caseInfo clearfix">' +
								'<label class="left">相关信息：</label><a class="left infoValue" href="#">'+data[i].sum+'条</a>' +
						//		'<label class="left">热词：</label><span class="left infoValue" href="#">'+reci+'</span>' +
							'</div>' +
						'</li>'	
					}
					$("#attCaseList").append(html);
				}
				$("#eventTotal").append("共"+data[0].totle+"事件");
				switchCaseTo(0);
				dynamicCase.curData = data;
				dynamicCase.attIndex = data.length-1;  //初始化关注舆情事件循环更新数据index
				dynamicCase.refresh();  //开始循环更新已加载数据
			},
			error:function(){
				alert("加载事件列表数据有误!");
			}
		});
		
		//定时加载数据
		dynamicCase.loadTimer = setInterval(function(){
			$.ajax({
				type:"get",
				url:baseUrl+'/screen/screen_one!getLeftEventList.do',
				dataType:"json",
				success:function(data) {
					//定时加载数据的时候要刷新列表。
					$("#attCaseList").empty();
					if (data.length == 0) {
						return ;
					}
					for ( var i = 0; i < data.length; i++ ) {
						var html;
						//热词
					//	var reci = data[i].hotWords;
					//	reci = reci=="" ? "无" : reci+"等";
						var type= data[i].topicName.substring(0,1);
						if (i == 0) {
							html='<li>' +
								'<span class="tag">'+type+'</span>' +
								'<a href="javascript:;" class="showTrent cur"></a>' +
								'<a href="'+baseUrl+'/screen/screen_two!toScreen2.do?eventId='+data[i].id+'&eventName='+data[i].title+'" class="caseText">'+data[i].title+'</a>' +
								'<input type="hidden" class="caseEid" value="'+data[i].id+'" />' +
								'<div class="caseInfo clearfix">' +
									'<label class="left">相关信息：</label><a class="left infoValue" href="#">'+data[i].sum+'条</a>' +
						//			'<label class="left">热词：</label><span class="left infoValue" href="#">'+reci+'</span>' +
								'</div>' +
							'</li>'
						}else{
							html='<li>' +
								'<span class="tag">'+type+'</span>' +
								'<a href="javascript:;" class="showTrent"></a>' +
								'<a href="'+baseUrl+'/screen/screen_two!toScreen2.do?eventId='+data[i].id+'&eventName='+data[i].title+'" class="caseText">'+data[i].title+'</a>' +
								'<input type="hidden" class="caseEid" value="'+data[i].id+'" />' +
								'<div class="caseInfo clearfix">' +
									'<label class="left">相关信息：</label><a class="left infoValue" href="#">'+data[i].sum+'条</a>' +
							//		'<label class="left">热词：</label><span class="left infoValue" href="#">'+reci+'</span>' +
								'</div>' +
							'</li>'	
						}
						$("#attCaseList").append(html);
					}
					dynamicCase.curData = data;
					dynamicCase.attIndex = data.length-1;  //初始化关注舆情事件循环更新数据index
				},
				error:function(){
					alert("定时加载数据有误!");
				}
			});
		},dynamicCase.loadTimeInt);
	}

	//循环更新已加载的数据
	dynamicCase.refresh = function() {
		//关注舆情事件实时更新
		dynamicCase.reAttTimer = setInterval(dynamicCase.refreshAtt,dynamicCase.refreshTimeInt);
		$('#attCaseList').on('mouseenter','li',function(){
				clearInterval(dynamicCase.reAttTimer);
		});
		$('#attCaseList').on('mouseleave','li',function(){
			dynamicCase.reAttTimer = setInterval(dynamicCase.refreshAtt,dynamicCase.refreshTimeInt);
		});
	}
	//关注舆情事件实时更新
	dynamicCase.refreshAtt = function(){
			if(dynamicCase.curData && dynamicCase.curData.length > 0){
				var curData = dynamicCase.curData[dynamicCase.attIndex];
				//consolr.info(curData);
				//var reci = curData.hotWords;
				//reci = reci==""?"无":reci+"等";
				var type = curData.topicName.substring(0,1);
				var html = '<li style="display:none">' +
						'<span class="tag">'+type+'</span>' +
						'<a href="javascript:;" class="showTrent"></a>' +
						'<a href="'+baseUrl+'/screen/screen_two!toScreen2.do?eventId='+curData.id+'&eventName='+curData.title+'" class="caseText">'+curData.title+'</a>' +
						'<input type="hidden" class="caseEid" value="'+curData.id+'" />' +
						'<div class="caseInfo clearfix">' +
							'<label class="left">相关信息：</label><a class="left infoValue" href="#">'+curData.sum+'条</a>' +
						//	'<label class="left">热词：</label><span class="left infoValue" href="#">'+reci+'</span>' +
						'</div>' +
					'</li>'
				refreshList('attCaseList',html);
				//统计图切换至最新事件
				switchCaseTo(0);
				if(dynamicCase.attIndex > 0){
					dynamicCase.attIndex--
				}else{
					dynamicCase.attIndex = dynamicCase.curData.length-1;
				}
			}
	}

/*
 *  更新列表方法
 * 
 * @param id 列表ul标签id
 * @param html 更新项的html结构
 * @param time 更新时间间隔
 * 
 */

function refreshList(id,html){
	var length = $('#'+ id +' > li').size();
	//隐藏选中的元素，让后删除
	$('#'+ id +' > li').eq(length - 1).slideUp(500,'swing',function(){
		$(this).remove();
	});
	$('#'+ id +' > li').eq(0).before(html);
	//显示选中的元素
	$('#'+ id +' > li').eq(0).slideDown(800);
}

//初始化统计图
function initCharts(){
	//定时刷新敏感信息折线图
//	timer_sensitiveTrend = setInterval(function(){
//		$("#sensitiveTotal").empty();
//		$("#sensitiveList").empty();
//		getSensitiveDataAjax(mediaTypeGlobal);
//	}, updateInterval*1000);
	drawMap();  //陕西地图
	getMapPage("西安市");  //弹窗内统计图
}
function initTimer(){
//	clearInterval(timer_provinceScroll);
//	clearInterval(timer_weiboHotScroll);
	timer_provinceHot = setInterval(function() {
		//clearInterval(timer_provinceScroll);
		//clearInterval(timer_weiboHotScroll);
		$("#provinceHotRanking > li").remove();
		$("#weiboHotRanking > li").remove();
		getHotRankingData();
	}, hotRankingTime * 1000);
	timer_OrderData = setInterval(function(){
		getOrderData();
	}, orderDataTime*1000);
}

//关注敏感信息切换
function senInfoSwitch(){
	var iNow=0;
	iNow=$('.j_sISwitch .tab').index($('.j_sISwitch .cur'));
	var curLocation = 1;
	var timer=null;
	timer = setInterval(function() {
		iNow++;
		
		if(iNow==8)
		{
			iNow=0;
		}
		
		if(curLocation == 8){
			curLocation = 0;
		}
		if(curLocation >= 6){
			curLocation++;
			//alert(6 + "---------==" + curLocation);
			$(".tab1").css("left","-128px");
			$(".tab2").css("left","-128px");
			$(".tab3").css("left","47px");
			$(".tab4").css("left","218px");
			$(".tab5").css("left","389px");
			$(".tab6").css("left","560px");
			$(".tab7").css("left","731px");
			$(".tab8").css("left","902px");
		}else{
			curLocation++;
			//alert(7 + "---------==" + curLocation);
			$(".tab1").css("left","47px");
			$(".tab2").css("left","218px");
			$(".tab3").css("left","389px");
			$(".tab4").css("left","560px");
			$(".tab5").css("left","731px");
			$(".tab6").css("left","902px");
			$(".tab7").css("left","1072px");
			$(".tab8").css("left","1248px");
			
		}
		
		$('.j_sISwitch .tab').eq(iNow).addClass('cur').siblings().removeClass('cur');
		senInfoSwitchTo(iNow);//折线图和列表展示
	},updateInterval*1000);
	$('.j_sISwitch').on('mouseenter',function(){
		clearInterval(timer)
	});
	$('.j_sISwitch').on('mouseleave',function(){
		timer=setInterval(function(){
			iNow++;
			if(iNow==8)
			{
				iNow=0;
			}
			if(curLocation == 8){
				curLocation = 0;
			}
			if(curLocation >= 6){
				curLocation++;
				//alert(8 + "---------==" + curLocation);
				$(".tab1").css("left","-128px");
				$(".tab2").css("left","-128px");
				$(".tab3").css("left","47px");
				$(".tab4").css("left","218px");
				$(".tab5").css("left","389px");
				$(".tab6").css("left","560px");
				$(".tab7").css("left","731px");
				$(".tab8").css("left","902px");
			}else{
				curLocation++;
				//alert(9 + "---------==" + curLocation);
				$(".tab1").css("left","47px");
				$(".tab2").css("left","218px");
				$(".tab3").css("left","389px");
				$(".tab4").css("left","560px");
				$(".tab5").css("left","731px");
				$(".tab6").css("left","902px");
				$(".tab7").css("left","1072px");
				$(".tab8").css("left","1248px");
				
			}
			$('.j_sISwitch .tab').eq(iNow).addClass('cur').siblings().removeClass('cur');
			clearInterval(timer_sensitiveList);
			senInfoSwitchTo(iNow);//折线图和列表展示
		},updateInterval*1000);
	});
	//往左切换
	$('.j_sISwitch').on('click','.switch-left',function(){
		if(curLocation >= 1){
			curLocation--;
		}
		if(curLocation <= 3 && curLocation >= 1){
			//alert(1 + "--------- ==  " + curLocation);
			$(".tab1").css("left","47px");
			$(".tab2").css("left","218px");
			$(".tab3").css("left","389px");
			$(".tab4").css("left","560px");
			$(".tab5").css("left","731px");
			$(".tab6").css("left","902px");
			$(".tab7").css("left","1072px");
			$(".tab8").css("left","1248px");
			if(curLocation == 1){
				curLocation = 9;
			}
		}else{
			if(curLocation == 0){
				curLocation = 8;
			}
			//alert(2 + "--------- ==  " + curLocation);
			$(".tab1").css("left","-128px");
			$(".tab2").css("left","-128px");
			$(".tab3").css("left","47px");
			$(".tab4").css("left","218px");
			$(".tab5").css("left","389px");
			$(".tab6").css("left","560px");
			$(".tab7").css("left","731px");
			$(".tab8").css("left","902px");
			
		}
		var index = $('.j_sISwitch .tab').index($('.j_sISwitch .cur'));
		iNow=index-1;
		if(index != 0){
			senInfoSwitchTo(index - 1);
		}else{
			senInfoSwitchTo(7);
		}
	});
	//往右切换
	$('.j_sISwitch').on('click','.switch-right',function(){
		var index = $('.j_sISwitch .tab').index($('.j_sISwitch .cur'));
		if(curLocation == 8){
			curLocation = 0;
		}
		if(curLocation >= 6){
			curLocation++;
			//alert(3 + "---------==" + curLocation);
			$(".tab1").css("left","-128px");
			$(".tab2").css("left","-128px");
			$(".tab3").css("left","47px");
			$(".tab4").css("left","218px");
			$(".tab5").css("left","389px");
			$(".tab6").css("left","560px");
			$(".tab7").css("left","731px");
			$(".tab8").css("left","902px");
		}else{
			curLocation++;
			//alert(4 + "---------==" + curLocation);
			$(".tab1").css("left","47px");
			$(".tab2").css("left","218px");
			$(".tab3").css("left","389px");
			$(".tab4").css("left","560px");
			$(".tab5").css("left","731px");
			$(".tab6").css("left","902px");
			$(".tab7").css("left","1072px");
			$(".tab8").css("left","1248px");
			
		}
		iNow=index;
		if(index != 7){
			senInfoSwitchTo(index + 1);
		}else{
			senInfoSwitchTo(0);
		}
	});
	//tab切换
	$('.j_sISwitch').on('click','.tab',function(){
		//curLocation = iNow+1;
		if(!$(this).hasClass('cur')){
			var index = $('.j_sISwitch .tab').index($(this));
			curLocation = index+1;
			//alert(5 + "-----" + curLocation)
			iNow=index;
			senInfoSwitchTo(index);
		}
	});
	
}

//敏感信息列表信息和趋势折线图  请求数据
function getSensitiveDataAjax(mediaType){
	mediaTypeGlobal = mediaType;
	$.ajax({
		type : "POST",
		url : baseUrl+"/screen/screen_one!getMediaDataList.do",
		data : {
			mediaType:mediaType
		},
		dataType : "json",
		success : function(data) {
			if (data.length > 0) {
				//添加html标签 展示列表数据
				var length = data.length > 8 ? 7 : data.length-1;
				for ( var i= 0 ; i < length ; i++ ) {
					var display = data[i]. author== '' ?'none':'';
					var displayDomain = data[i]. subDomain == '' ?'none':'';
					var len = data[i].title.length > 21 ? 21 : data[i].title.length-1;
					
					var title = data[i].title == '' ?  data[i].content.substring(0,len)+"..." : data[i].title;
					var html="<li class=\"odd\"><img src="+data[i].imageUrls+" /> "+
					"<a class=\"caseText\" href=\"#\" value=\""+ data[i].url +"\">"+title+"</a> "+
					"<div class=\"caseInfo clearfix\"> "+
					"<label class=\"left\" style=\"display:"   +displayDomain+   "\">域名：</label> "+
					"<span class=\"left infoValue\" >"+data[i].subDomain+"</span> "+
					"<label class=\"left\" style=\"display:"   +display+   "\">昵称：</label> "+
					"<span class=\"left infoValue\" href=\"#\" style=\"display:"   +display+   "\">"+data[i].author+"</span> "+
					"<span class=\"left infoValue mr0\" style=\"float:right\" href=\"#\">"+new Date(data[i].publishDate.time).toLocaleString()+"</span> "+
					"</div>"+
					"</li>";
					$("#sensitiveList").append(html);
				}
				if (data[data.length-1] == undefined) {
					$("#sensitiveTotal").append("共"+0+"信息");				
				}else{
					$("#sensitiveTotal").append("共"+data[data.length-1]+"信息");
				}				
			}
			//实时更新敏感信息列表，暂时注释
			/*var index=19;
			//关注敏感信息实时更新
			var timerGetSen = function(){
				if(data && data.length > 0){
					var curData = data[index];
					var html = '<li style="display:none;">' +
									'<img src="images/i_sina_2.png" />' +
									'<a class="caseText">'+ curData.title +'</a>' +
									'<div class="caseInfo clearfix">' +
										'<label class="left">域名：</label>' +
										'<a class="left infoValue" href="#">'+ curData.domain +'</a>' +
										'<label class="left">昵称：</label>' +
										'<span class="left infoValue" href="#">'+ curData.name +'</span>' +
										'<span class="left infoValue mr0" href="#">'+ new Date(curData.pubTime.time).toLocaleString() +'</span>' +
									'</div>' +
								'</li>';
					refreshList('sensitiveList',html);
					if(index > 0){
						index--
					}else{
						index = 19;
					}
				}
			}
			clearInterval(timer_sensitiveList);
			//关注敏感信息实时更新
			timer_sensitiveList = setInterval(timerGetSen,2000);
			$('#sensitiveList').on('mouseenter','li',function(){
					clearInterval(timer_sensitiveList);
			});
			$('#sensitiveList').on('mouseleave','li',function(){
				timer_sensitiveList = setInterval(timerGetSen,2000);
			});*/
		}
	});
	$.ajax({
		type : "POST",
		url : baseUrl+"/screen/screen_one!getScreenTrendLine.do",
		data : {
			mediaType:mediaType
		},
		dataType : "json",
		success : function(data) {
			//drawSenInfoTrend(data,"senInfo_id");
			
			if($("#senInfo_id").find("canvas").size() == 0){
				drawSenInfoTrend(data,"senInfo_id");
			}else{
				var json = data;
				var array = [];
				for (var i=0;i<json.yAxis.length;i++) {
					array.push(parseInt(json.yAxis[i]));
				}
				//emphasisCaseChart.clear();
				emphasisCaseChart.sen.setOption({
					tooltip : {
						trigger: 'axis',
						textStyle:{
							color:'#fff',
							fontSize:38
						}
					},
					calculable : true,
					xAxis : [
							{
								type : 'category',
								boundaryGap : false,
								splitLine:{
									show:true,
									lineStyle:{
										color:'#096b82'
									}
								},
								axisLine:{
									lineStyle:{
										color:'#0080ff',
										width:5
									}
								},
								data : json.xAxis,
								//data :[08-01,08-02,08-03,08-04,08-05,08-06,08-07],
								axisLabel:{
									margin:35,
									textStyle:{
										color:'#fff',
										fontSize:36
									}
								}
							}
						],
						yAxis : [
							{
								type : 'value',
								//max:10000,
								splitLine:{
									show:false,
									lineStyle:{
										color:'#096b82'
									}
								},
								axisLine:{
									lineStyle:{
										color:'#0080ff',
										width:5
									}
								},
								splitArea:{
									show:true,
									areaStyle:{
										color:[
											'rgba(0,128,255,0)',
											'rgba(0,128,255,0.1)'
										]
									}
								},
								axisLabel:{
									margin:20,
									textStyle:{
										color:'#fff',
										fontSize:36
									}
								}
							}
						],
						grid:{
							x:175,
							x2:80,
							y:40,
							y2:125,
							borderWidth:2,
							borderColor:"#1a4d80"
						},
					series : [
						{
							name:'当天总数',
							type:'line',
							smooth:'true',
							symbolSize:10,
							data:array,
							//data : [100,200,300,400,500,600,100],
							itemStyle:{
								normal:{
									color:'#e5e617',
									areaStyle:{color:'rgba(0,229,229,0.3)'}
								}
							},
							markPoint : {
								data : [
									{
										type : 'max', 
										name: '最大值',
										symbolSize:40,
										itemStyle:{
											normal:{
												position:'top',
												color:'#990000',
												label:{
													textStyle:{
														color:'#fff',
														fontSize:24
													}
												}
											}
											
										}
									}
								]
							}
						}
					],
					animationDuration:2000,
					animationEasing:'Linear'
				});
			}
		}
	});
	
}

/*
 * 关注敏感信息内容切换至指定类型内容
 * 
 * @param index 切换至类型种类的index
 * 
 */
function senInfoSwitchTo(index){
	clearInterval(timer_sensitiveList);
	$('.j_sISwitch .tab').removeClass('cur').eq(index).addClass('cur');
	$("#sensitiveTotal").empty();
	$("#sensitiveList").empty();
	var mediaType=1;//新闻
	if (index==1) mediaType=5;//微博
	if (index==2) mediaType=6;//weixin
	if (index==3) mediaType=2;//论坛
	if (index==4) mediaType=7;//移动端
	if (index==5) mediaType=10;//境外
	if (index==6) mediaType=3;//博客
	if (index==7) mediaType=9;//纸媒
	
	//在这里添加html标签
	getSensitiveDataAjax(mediaType)
}

//获取点击地图后的数据
function getMapPage(cityName){
	$.ajax({
		type : "POST",
		url : baseUrl+"/screen/screen_one!getMapList.do",
		dataType:"text",
		data : {
			cityName:cityName
		},
		success : function(data) {
//			showPopupChart(data);
			$('#shanxiProvince').append(data);
		}
	});
}

Date.prototype.toLocaleString = function() {
	var minutes = this.getMinutes()>10?this.getMinutes():("0"+this.getMinutes());
	var seconds = this.getSeconds()>10?this.getSeconds():("0"+this.getSeconds())
    return this.getFullYear() + "-" + (this.getMonth() + 1) + "-" + this.getDate() + "&nbsp;&nbsp;" + 
    	this.getHours() + ":" + minutes + ":" + seconds;
};

/*
 * 获取 网评数据进行页面展示
 */
function getOrderData(){
	$.ajax({
		type: "post",
		url: baseUrl+"/screen/screen_one!getOrderData.do",
		dataType: 'json',
		async: false,
		success: function(jsonData) {
			//console.info(jsonData);
			for (var p in jsonData) {
				/*console.info(p);
				console.info(jsonData[p]);*/
				changeElementPlace(p,jsonData[p]);
			}
			$("#orderCountData").empty();
			
			$("#orderCountData").
			append("<h3 class='clearfix'>" +
				        "<span class='left infolabel'>网评总量</span>" +
				       // "<span class='left infoData facyb' >"+toThousands(jsonData.allComm)+"</span>" +
				        "<span class='left infoData facyb numAnimate76' id='allComm' value='"+jsonData.allComm+"'></span>" +
			        "</h3> <div class='j_foldBtn foldBtn btn-right'><span class='arrow'></span></div>" +
			        "<ul class='dataInfoList reviewInfoList clearfix' style='display:none;'>" +
					    "<li class='left'><label class='i-task'>本周网评任务</label><span class='facy left numAnimate46' id='currentWeekTask' value='"+jsonData.currentWeekTask+"'></span></li>" +
					    "<li class='left'><label class='i-file'>本周评论量</label><span class='facy left numAnimate46' id='currentWeekComm' value='"+jsonData.currentWeekComm+"'></span></li>" +
					    "<li class='left'><label class='i-statistics'>总任务数</label><span class='facy left numAnimate46' id='allTask' value='"+jsonData.allTask+"'></span></li>" +
					   // "<li class='left'><label class='i-total'>总评论量</label><span class='facy left'>"+toThousands(jsonData.allComm)+"</span></li>" +
					    "<li class='left'><label class='i-total'>总评论量</label><span class='facy left numAnimate46' id='allComm2' value='"+jsonData.allComm+"'></span></li>" +
				    "</ul>");
			$("#orderCountData .numAnimate46,#orderCountData .numAnimate76").each(function(){
				//console.info($(this).attr("id")+" class: "+$(this).attr("class")+" value: "+$(this).attr("value"));
				getAnimateGrid($(this).attr("id"));
			});
		},
		error: function() {
			alert('获取网评总量数据失败');
		}
	});
	$.ajax({
		type: "post",
		url: baseUrl+"/screen/screen_one!getDataCount.do",
		dataType: 'json',
		async: false,
		success: function(jsonData) {
			for (var p in jsonData) {
				/*console.info(p);
				console.info(jsonData[p]);*/
				changeElementPlace(p,jsonData[p]);
				/*if (ip == "traditionalTotalCount") {
					console.info(jsonData["traditionalTotalCount"]);
				}*/
			}
			//console.info(jsonObject);
			$("#countData").empty();
			
			$("#countData").
			append("<h3 class='clearfix'>" +
				        "<span class='left infolabel'>上报总量</span>" +
				        "<span class='left infoData facyb numAnimate76' id='allTotalCount' value='"+jsonData.allTotalCount+"'></span>" +
			        "</h3> <div class='j_foldBtn foldBtn btn-right'><span class='arrow'></span></div>" +
			        "<ul class='dataInfoList reviewInfoList clearfix' style='display:none;'>" +
					    "<li class='left'><label class='i-task'>传统媒体今天量</label><span class='facy left numAnimate46' id='traditionalCurrentTotalCount' value='"+jsonData.traditionalCurrentTotalCount+"' ></span></li>" +
					    //"<li class='left'><label class='i-file'>新媒体今天量</label><span class='facy left'>"+toThousands(jsonData.newCurrentTotalCount)+"</span></li>" +
					    "<li class='left'><label class='i-file'>新媒体今天量</label><span class='facy left numAnimate46' id='newCurrentTotalCount' value='"+jsonData.newCurrentTotalCount+"'></span></li>" +
					    "<li class='left'><label class='i-statistics'>传统媒体总量</label><span class='facy left numAnimate46' id='traditionalTotalCount' value='"+jsonData.traditionalTotalCount+"'></span></li>" +
					    "<li class='left'><label class='i-total'>新媒体总量</label><span class='facy left numAnimate46' id='newTotalCount' value='"+jsonData.newTotalCount+"'></span></li>" +
				    "</ul>");
			$("#countData .numAnimate46,#countData .numAnimate76").each(function(){
				//console.info($(this).attr("id")+" class: "+$(this).attr("class")+" value: "+$(this).attr("value"));
				getAnimateGrid($(this).attr("id"));
			});
			
		},
		error: function() {
			alert('获取上报总量数据失败');
		}
	});	
	//数据平台总量
	$.ajax({
		type: "post",
		url: baseUrl+"/screen/screen_one!getPlatformDataSum.do",
		dataType: 'json',
		async: false,
		success: function(jsonobj) {
			for (var p in jsonobj) {
				changeElementPlace(p,jsonobj[p]);
			}
			//changeElementPlace(jsonobj.allTotalSum);
			$("#platformSum").empty();
			var html='<h3 class="clearfix">'+
							'<span class="left infolabel">数据平台总量</span>'+
							//'<span class="left infoData facyb" id="number_1">'+jsonobj.allTotalSum+'</span>'+
							//'<input type="hidden" id="number_1" value="'+jsonobj.allTotalSum+'"/>'+
							'<span class="left infoData facyb numAnimate76" id="allTotalSum" value="'+jsonobj.allTotalSum+'"></span>'+
						'</h3>'+
						'<div class="j_foldBtn foldBtn btn-left"><span class="arrow"></span></div>'+
						'<ul class="dataInfoList clearfix" style="display:none;"><li class="left">'+
						'		<label class="left i-news">新闻</label>'+
						'		<span class="left facy numAnimate46" id="newssum" value="'+jsonobj.newssum+'"></span>'+
						'	</li>'+
						'	<li class="left">'+
						'		<label class="left i-wechart">微信</label>'+
						//'		<span class="left facy" id="numAnimate46">'+jsonobj.wechatsum+'</span>'+
						'		<span class="left facy numAnimate46" id="wechatsum" value="'+jsonobj.wechatsum+'"></span>'+
						'	</li>'+
						'	<li class="left">'+
						'		<label class="left i-micblog">微博</label>'+
						'		<span class="left facy numAnimate46" id="weibosum" value="'+jsonobj.weibosum+'"></span>'+
						'	</li>'+
						'	<li class="left">'+
						'		<label class="left i-term">客户端</label>'+
						'		<span class="left facy numAnimate46" id="clientsum" value="'+jsonobj.clientsum+'"></span>'+
						'	</li>'+
						'	<li class="left">'+
						'		<label class="left i-blog">博客</label>'+
						'		<span class="left facy numAnimate46" id="blogsum" value="'+jsonobj.blogsum+'"></span>'+
						'	</li>'+
						'	<li class="left">'+
						'		<label class="left i-overseas">境外</label>'+
							'	<span class="left facy numAnimate46" id="overseasum" value="'+jsonobj.overseasum+'"></span>'+
						'	</li>'+
						'	<li class="left">'+
						'		<label class="left i-forum">论坛</label>'+
						'		<span class="left facy numAnimate46" id="bbssum" value="'+jsonobj.bbssum+'"></span>'+
						'	</li>'+
						'	<li class="left">'+
						'		<label class="left i-paper">纸媒</label>'+
						'		<span class="left facy numAnimate46" id="papersum" value="'+jsonobj.papersum+'"></span>'+
						'	</li>'+
						'</ul>';
			$("#platformSum").append(html);
			
			/*ued样例
		    $('#allTotalSum').animateGrid({
				//url:'json/count.json',
				value : 1000,
				step:76
		    });
			
		  $('#wechatsum').animateGrid({
				//url:'json/count.json',
				value :10,
				step:46
			})*/
			$("#platformSum .numAnimate46,#platformSum .numAnimate76").each(function(){
				//console.info($(this).attr("id"));
				getAnimateGrid($(this).attr("id"));
			});
		},
		error: function() {
			alert('获取数据平台总量数据失败');
		}
	});
	
}

//调用翻牌的函数
function getAnimateGrid(id) {
	var value;
	var add;
	if (id == "allTotalSum"||id=="allTotalCount" || id == "allComm"){
		aStep=76;
	}else {
		aStep=46;
	}
	if (id == "allComm2") {
		value = jsonObject["allComm"][0];
		add = jsonObject["allComm"][2];
	} else {
		value = jsonObject[id][0];
		add = jsonObject[id][2];
	}
  $('#'+id+'').animateGrid({
		value : value,
		step : aStep
	},add)
}
/*
 * 组装计算数据。
 *将当前的元素的值放在数组第二个位置上，历史数据赋值给第一个元素。第三个元素是增量。 
 */
function changeElementPlace(p,data) {
	//虚定初始值与当前值的查为1000；
	var initVariable = 1000;
	if (typeof($('#'+p+'').attr("value")) == "undefined") {
		//上面定义和封装的对象，便于通过事件id拿到对应的数组。
		if ( data < initVariable) {
			initVariable = data;
		} 
		jsonObject[p][0] = data - initVariable;
	} else {
		jsonObject[p][0] = parseInt($('#'+p+'').attr("value"));
	}
	//历史数据和当前数据比较。
	jsonObject[p][1] =data;
	jsonObject[p][2] =parseInt( (jsonObject[p][1]-jsonObject[p][0])/orderDataTime*3);
}

//关注舆情事件事件切换
function handleCaseTrendSwitch(){
	//切换至前一个事件
	$('.j_caseSwitch').on('click','.casePrev',function(){
		var $showTrent = $('#attCaseList .showTrent');
		var index = $showTrent.index($('#attCaseList .cur'));
		if(0 == index){
			index = $showTrent.length - 1;
		}else{
			index = index - 1;
		}
		switchCaseTo(index);
	});
	
	//切换至后一个事件
	$('.j_caseSwitch').on('click','.caseNext',function(){
		var $showTrent = $('#attCaseList .showTrent');
		var index = $showTrent.index($('#attCaseList .cur'));
		if($showTrent.length == index){
			index = 0;
		}else{
			index = index + 1;
		}
		switchCaseTo(index);
	});
	
	//选择当前事件
	$('#attCaseList').on('click','.showTrent',function(){
		if(!$(this).hasClass('cur')){
			var index = $('#attCaseList .showTrent').index($(this));
			switchCaseTo(index);
		}
	});
	
}
//陕西YQ重大事件折线图
function getShanxiImportantEventTrend(eid){
	$.ajax({
		type : "POST",
		url : baseUrl+"/screen/screen_one!getScreenTrendLine.do",
		data : {
			mediaType:'',
			eid:eid
		},
		dataType : "json",
		success : function(data) {
			//drawSenInfoTrend(data,"emphasisCase");
			
			if($("#emphasisCase").find("canvas").size() == 0){
				drawSenInfoTrend(data,"emphasisCase");
			}else{
				var json = data;
				var array = [];
				for (var i=0;i<json.yAxis.length;i++) {
					array.push(parseInt(json.yAxis[i]));
				}
				//如果我没记错的话，这上面几行的几个关键字是在你们这个项目里面有的
				//比如，yAsis  data什么的
				//emphasisCaseChart.clear();
				emphasisCaseChart.att.setOption({
					tooltip : {
						trigger: 'axis',
						textStyle:{
							color:'#fff',
							fontSize:38
						}
					},
					calculable : true,
					xAxis : [
							{
								type : 'category',
								boundaryGap : false,
								splitLine:{
									show:true,
									lineStyle:{
										color:'#096b82'
									}
								},
								axisLine:{
									lineStyle:{
										color:'#0080ff',
										width:5
									}
								},
								data : json.xAxis,
								//data :[08-01,08-02,08-03,08-04,08-05,08-06,08-07],
								axisLabel:{
									margin:35,
									textStyle:{
										color:'#fff',
										fontSize:36
									}
								}
							}
						],
						yAxis : [
							{
								type : 'value',
								//max:10000,
								splitLine:{
									show:false,
									lineStyle:{
										color:'#096b82'
									}
								},
								axisLine:{
									lineStyle:{
										color:'#0080ff',
										width:5
									}
								},
								splitArea:{
									show:true,
									areaStyle:{
										color:[
											'rgba(0,128,255,0)',
											'rgba(0,128,255,0.1)'
										]
									}
								},
								axisLabel:{
									margin:20,
									textStyle:{
										color:'#fff',
										fontSize:36
									}
								}
							}
						],
						grid:{
							x:175,
							x2:80,
							y:40,
							y2:125,
							borderWidth:2,
							borderColor:"#1a4d80"
						},
					series : [
						{
							name:'当天总数',
							type:'line',
							smooth:'true',
							symbolSize:10,
							data:array,
							//data : [100,200,300,400,500,600,100],
							itemStyle:{
								normal:{
									color:'#e5e617',
									areaStyle:{color:'rgba(0,229,229,0.3)'}
								}
							},
							markPoint : {
								data : [
									{
										type : 'max', 
										name: '最大值',
										symbolSize:40,
										itemStyle:{
											normal:{
												position:'top',
												color:'#990000',
												label:{
													textStyle:{
														color:'#fff',
														fontSize:24
													}
												}
											}
											
										}
									}
								]
							}
						}
					],
					animationDuration:2000,
					animationEasing:'Linear'
				});
			}
			
			
			/*
			var json = data;
			var array = [];
			for (var i=0;i<json.yAxis.length;i++) {
				array.push(parseInt(json.yAxis[i]));
			}
			emphasisCaseChart.setOption({
				tooltip : {
					trigger: 'axis',
					textStyle:{
						color:'#fff',
						fontSize:38
					}
				},
				calculable : true,
				xAxis : [
						{
							type : 'category',
							boundaryGap : false,
							splitLine:{
								show:true,
								lineStyle:{
									color:'#096b82'
								}
							},
							axisLine:{
								lineStyle:{
									color:'#0080ff',
									width:5
								}
							},
							data : json.xAxis,
							axisLabel:{
								margin:35,
								textStyle:{
									color:'#fff',
									fontSize:36
								}
							}
						}
					],
					yAxis : [
						{
							type : 'value',
							//max:10000,
							splitLine:{
								show:false,
								lineStyle:{
									color:'#096b82'
								}
							},
							axisLine:{
								lineStyle:{
									color:'#0080ff',
									width:5
								}
							},
							splitArea:{
								show:true,
								areaStyle:{
									color:[
										'rgba(0,128,255,0)',
										'rgba(0,128,255,0.1)'
									]
								}
							},
							axisLabel:{
								margin:20,
								textStyle:{
									color:'#fff',
									fontSize:36
								}
							}
						}
					],
					grid:{
						x:175,
						x2:80,
						y:40,
						y2:125,
						borderWidth:2,
						borderColor:"#1a4d80"
					},
				series : [
					{
						name:'当天总数',
						type:'line',
						smooth:'true',
						symbolSize:10,
						data:array,
						itemStyle:{
							normal:{
								color:'#e5e617',
								areaStyle:{color:'rgba(0,229,229,0.3)'}
							}
						},
						markPoint : {
							data : [
								{
									type : 'max', 
									name: '最大值',
									symbolSize:40,
									itemStyle:{
										normal:{
											position:'top',
											color:'#990000',
											label:{
												textStyle:{
													color:'#fff',
													fontSize:24
												}
											}
										}
										
									}
								}
							]
						}
					}
				],
				animationDuration:2000,
				animationEasing:'Linear'
			});
			*/
		}
	});
}

//切换当前事件，并生成事件趋势折线图
function switchCaseTo(index){
	$('#attCaseList .cur').removeClass('cur');
	var text = $('#attCaseList .showTrent').eq(index).addClass('cur').siblings('.caseText').text();
	var eid = $($('.caseEid')[index]).val();
	$('.j_caseSwitch .caseText').text(text);
	getShanxiImportantEventTrend(eid);
}
//全省热点排行榜 和新闻热点排行
function getHotRankingData(){
	
	$.ajax({
		type : "get",
		url : baseUrl+"/screen/screen_one!getThisProvinceHotData.do",
		dataType : "json",
		success : function(data) {
			if (data.data.length==0) {
				return ;
			}
			var length = data.data.length > 7 ? 7 : data.data.length;
			
			//更新填充列表
			for ( var i=0; i<length; i++ ) {
				
				var odd = i % 2 == 0 ? "odd" : "";
				var html='<li class="'+odd+'">'+
						'<a class="caseText" href="#" value="'+ data.data[i].url +'">'+data.data[i].title+'</a>'+
						'<div class="caseInfo clearfix">'+
						'	<label class="left">发布时间：</label>'+
						'	<span class="left infoValue" href="#">'+data.data[i].pubtime+'</span>'+
						'	<label class="left">来源：</label>'+
						'	<span class="left infoValue" href="#">'+data.data[i].source+'</span>'+
						'</div>'+
						'</li>'
				$("#provinceHotRanking").append(html);
			}
			clearInterval(timer_provinceScroll);
			var index = data.data.length-1;
			var dynamic = function() {
				var array = data.data;
				var odd = index % 2 == 0 ? "odd" : "";
				var html='<li style="display:none" class="'+odd+'">'+
						'<a class="caseText" href="#" value="'+ array[index].url +'">'+array[index].title+'</a>'+
						'<div class="caseInfo clearfix">'+
						'	<label class="left">发布时间：</label>'+
						'	<span class="left infoValue" href="#">'+array[index].pubtime+'</span>'+
						'	<label class="left">来源：</label>'+
						'	<span class="left infoValue" href="#">'+array[index].source+'</span>'+
						'</div>'+
						'</li>'
				//滚动列表		
				refreshList("provinceHotRanking",html);
				if ( index > 0 ) {
					index--;
				} else {
					index = data.data.length-1;
				}
			}
			//定时滚动列表
			timer_provinceScroll = setInterval(dynamic , 5*1000);
			$('#provinceHotRanking').off('mouseenter').on('mouseenter','li',function(){
				clearInterval(timer_provinceScroll);
			});
			$('#provinceHotRanking').off('mouseleave').on('mouseleave','li',function(){
				timer_provinceScroll = setInterval(dynamic , 5*1000);
			});
		}
	});
	//现在改为新闻热点了，方法名未改。
	$.ajax({
		type : "get",
		url : baseUrl+"/screen/screen_one!getWeiboHotData.do",
		dataType : "json",
		success : function(data) {
			//$("#weiboHotRanking").empty();
			if (data.data.length == 0) {
				return;
			}
			var length = data.data.length > 7 ? 7 : data.data.length;
			for ( var i = 0; i < length; i++ ) {
				var odd = i % 2 == 0 ? "odd" : "";
				var html='<li class="'+odd+'">'+
						//	'<img src="images/i_sina_2.png" />'+
							'<a class="caseText"  href="#" value="'+ data.data[i].url +'">'+data.data[i].title+'</a>'+
							'<div class="caseInfo clearfix">'+
							'	<label class="left">发布时间：</label>'+
							'	<span class="left infoValue" href="#">'+data.data[i].pubtime+'</span>'+
							'	<label class="left">来源：</label>'+
							'	<span class="left infoValue" href="#">'+data.data[i].source+'</span>'+
							'</div>'+
						'</li>'
				$("#weiboHotRanking").append(html);
			}
			clearInterval(timer_weiboHotScroll);
			var index=data.data.length-1;
			var dynamic = function() {
				var array = data.data;
				var odd = index % 2 == 0 ? "odd" : "";
				var html='<li style="display:none" class="'+odd+'">'+
						'<a class="caseText"  href="#" value="'+ array[index].url +'">'+array[index].title+'</a>'+
						'<div class="caseInfo clearfix">'+
						'	<label class="left">发布时间：</label>'+
						'	<span class="left infoValue" href="#">'+array[index].pubtime+'</span>'+
						'	<label class="left">来源：</label>'+
						'	<span class="left infoValue" href="#">'+array[index].source+'</span>'+
						'</div>'+
					'</li>'
				refreshList("weiboHotRanking",html);
				if ( index > 0 ) {
					index--;
				} else {
					index = data.data.length-1;
				}
			}
			timer_weiboHotScroll = setInterval(dynamic,5*1000);
			
			$('#weiboHotRanking li').off("mouseenter").on('mouseenter',function(){
				clearInterval(timer_weiboHotScroll);
			});
			$('#weiboHotRanking li').off("mouseleave").on('mouseleave',function(){
				timer_weiboHotScroll = setInterval(dynamic,5*1000);
			});
		}
	});
	
	
}

/*
 * 格式化数字显示方式
 */
function toThousands(number) {
    var num = (number || 0).toString(), result = '';
    while (num.length > 3) {
        result = ',' + num.slice(-3) + result;
        num = num.slice(0, num.length - 3);
    }
    if (num) { 
    	result = num + result; 
    }
    return result;
}


