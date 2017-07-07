//地图
function drawMap(){
	// 路径配置
	require.config({
		paths: {
			echarts: $("#sysip").val()+"/js"
		}
	});
	
	// 使用
	require(
		[
			'echarts',
			'echarts/chart/map'
		],
		function (ec) {
			if(document.getElementById('dataMap')){
				var cityCarouselTimer;
				var myChart = ec.init(document.getElementById('dataMap')); 
				var option =  {
						tooltip : {
							trigger: 'item',
							formatter: '{b}',
							textStyle:{
								color:'#fff',
								fontSize:38
							}
						},
						series : [
							{
								name: '',
								type: 'map',
								mapType: '陕西',
								mapLocation : {x:'right',y:'center'} ,
								selectedMode : 'single',
								itemStyle:{
									normal:{
										label:{
											show:true,
											textStyle:{
												color:'#ffffff',
												fontSize:48,
												fontFamily:'微软雅黑'	
											}
										},
										areaStyle:{
											color:'#0044cc'
										},
										borderColor:'#00fafb',
										borderWidth:3
									},
									emphasis:{
										label:{
											show:true,
											textStyle:{
												color:'#ff0',
												fontSize:60	,
												fontFamily:'微软雅黑'										
											}
										},
										areaStyle:{
											color:'#7a0f1f'
										},
										borderColor:'#cc0000',
										borderWidth:4
									}
								},
								data:[
									{
										name:"西安市",
										selected:true
									}
								]
							}
						]
					};
				myChart.setOption(option); 
				var ecConfig = require('echarts/config');
				var mapSelected = false;
				var cityArray = ["榆林市","延安市","铜川市","渭南市","咸阳市","西安市","宝鸡市","商洛市","汉中市","安康市"]
				var curCityIndex = 7;
				var refreshPopup = function(cityName){
					$.ajax({
						type:"get",
						url:$("#sysip").val()+"/screen/screen_one!getMapList.do?cityName="+cityName,
						dataType:"text",
						success: function(data){
							$('#shanxiProvince').find(".popup").remove();
							$('#shanxiProvince').append(data);
						},
						error:function(){
							alert("弹窗加载失败");
						}
					});
				};
				var cityCarousel = function(){//轮播方法
					var dynamicSeries = option.series;
					var url = "";
					dynamicSeries[0].data =  [
						{
							name:"榆林市",
							selected:false
						},{
							name:"延安市",
							selected:false
						},{
							name:"铜川市",
							selected:false
						},{
							name:"渭南市",
							selected:false
						},{
							name:"咸阳市",
							selected:false
						},{
							name:"西安市",
							selected:false
						},{
							name:"宝鸡市",
							selected:false
						},{
							name:"商洛市",
							selected:false
						},{
							name:"汉中市",
							selected:false
						},{
							name:"安康市",
							selected:false
						}
					];
					//判断是否轮播至最后一个市
					if(curCityIndex < 9){
						curCityIndex ++;
					}else{
						curCityIndex = 0;
					}
					dynamicSeries[0].data[curCityIndex].selected = true;
					myChart.clear();
					myChart.setOption(option);
					refreshPopup(cityArray[curCityIndex]);
				}
				//地图绑定点击事件
				myChart.on(ecConfig.EVENT.MAP_SELECTED, function (param){
					var target = param.target
					var url = "";
					mapSelected = true;
					switch(target){
						case "榆林市":
							curCityIndex = 0;
							break;
						case "延安市":
							curCityIndex = 1;
							break;
						case "铜川市":
							curCityIndex = 2;
							break;
						case "渭南市":
							curCityIndex = 3;
							break;
						case "咸阳市":
							curCityIndex = 4;
							break;
						case "西安市":
							curCityIndex = 5;
							break;
						case "宝鸡市":
							curCityIndex = 6;
							break;
						case "商洛市":
							curCityIndex = 7;
							break;
						case "汉中市":
							curCityIndex = 8;
							break;
						case "安康市":
							curCityIndex = 9;
							break;
					}
					if(cityCarouselTimer){
						clearInterval(cityCarouselTimer);
					}
					refreshPopup(cityArray[curCityIndex]);
					//从当前城市轮播
					cityCarouselTimer = setInterval(cityCarousel,10000);
				});
				//城市轮播
				if(cityCarouselTimer){
					clearInterval(cityCarouselTimer);
				}
				$('#shanxiProvince').on('click',function(e){
					if($(e.target).closest('.popup').size() == 0){
						var hidePopup = function(){
							//alert(mapSelected);
							var dynamicSeries = option.series;
							dynamicSeries[0].data =  [
														{
															name:"榆林市",
															selected:false
														},{
															name:"延安市",
															selected:false
														},{
															name:"铜川市",
															selected:false
														},{
															name:"渭南市",
															selected:false
														},{
															name:"咸阳市",
															selected:false
														},{
															name:"西安市",
															selected:false
														},{
															name:"宝鸡市",
															selected:false
														},{
															name:"商洛市",
															selected:false
														},{
															name:"汉中市",
															selected:false
														},{
															name:"安康市",
															selected:false
														}
													];
							$('#shanxiProvince').find('.popup').remove();
							myChart.clear();
							myChart.setOption(option);
						}
						setTimeout(function(){
							if(!mapSelected){
								hidePopup();
							}else{
								mapSelected = false;
							}
						},300);
					}
				});
				cityCarouselTimer = setInterval(cityCarousel,10000);
			}
		}
	)
}

//关注敏感信息趋势图
function drawSenInfoTrend(data,id){
	var json = data;
	var array = [];
	for (var i=0;i<json.yAxis.length;i++) {
		array.push(parseInt(json.yAxis[i]));
	}
	// 路径配置
	require.config({
		paths: {
			echarts: $("#sysip").val()+"/js"
		}
	});
	
	// 使用
	require(
		[
			'echarts',
			'echarts/chart/line'
		],
		function (ec) {
			//var myChart_4 = ec.init(document.getElementById(id)); 
			if(id == "emphasisCase"){
				emphasisCaseChart.att = ec.init(document.getElementById(id)); 
			}else if(id == "senInfo_id"){
				emphasisCaseChart.sen = ec.init(document.getElementById(id));
			}
			
			var option_4 =  {
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
			};
			//myChart_4.setOption(option_4); 
			//emphasisCaseChart.setOption(option_4); 
			if(id == "emphasisCase"){
				emphasisCaseChart.att.setOption(option_4); 
			}else if(id == "senInfo_id"){
				emphasisCaseChart.sen.setOption(option_4); 
			}
		}
	)
}

//弹窗内图表
function showPopupChart(data){
	var array = [];
	for (var i=0;i<data.yAxis.length;i++) {
		array.push(parseInt(data.yAxis[i]));
	}
	// 路径配置
	require.config({
		paths: {
			echarts: "build/dist"
		}
	});
	
	// 使用
	require(
		[
			'echarts',
			'echarts/chart/line'
		],
		function (ec) {
			//敏感境外一周数据走势
			if(document.getElementById('popChart')){
				var myChart_6 = ec.init(document.getElementById('popChart')); 
				var option_6 =  {
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
							data : data.xAxis,
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
							//max:1000,
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
						x:140,
						x2:80,
						y:40,
						y2:80,
						borderWidth:2,
						borderColor:"#1a4d80"
					},
					series : [
						{
							type:'line',
							symbolSize:5,
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
				};
				myChart_6.setOption(option_6);
			}//end of if
		}
	);
}
