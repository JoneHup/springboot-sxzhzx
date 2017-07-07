var jsonObject2={
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

(function($) {
	var allTotalSum=null;var wechatsum=null;var newssum=null;var weibosum=null;var clientsum=null;var blogsum=null;
	var overseasum=null;var bbssum=null;var papersum=null;
	var allTotalCount=null;var traditionalCurrentTotalCount=null;var newCurrentTotalCount=null;var traditionalTotalCount=null;var newTotalCount=null;
	var allComm=null;var currentWeekTask=null;var currentWeekComm=null;var allTask=null;var allComm=null;
	jsonObject2.allTotalSum=allTotalSum;
	jsonObject2.wechatsum=wechatsum;
	jsonObject2.newssum=newssum;
	jsonObject2.weibosum=weibosum;
	jsonObject2.clientsum=clientsum;
	jsonObject2.blogsum=blogsum;
	jsonObject2.overseasum=overseasum;
	jsonObject2.bbssum=bbssum;
	jsonObject2.papersum=papersum;
	jsonObject2.allTotalCount=allTotalCount;
	jsonObject2.traditionalCurrentTotalCount=traditionalCurrentTotalCount;
	jsonObject2.newCurrentTotalCount=newCurrentTotalCount;
	jsonObject2.traditionalTotalCount=traditionalTotalCount;
	jsonObject2.newTotalCount=newTotalCount;
	jsonObject2.allComm=allComm;
	jsonObject2.currentWeekTask=currentWeekTask;
	jsonObject2.currentWeekComm=currentWeekComm;
	jsonObject2.allTask=allTask;
if(!document.defaultView || !document.defaultView.getComputedStyle){
    var oldCurCSS = jQuery.curCSS;
    jQuery.curCSS = function(elem, name, force){
        if(name === 'background-position'){
            name = 'backgroundPosition';
        }
        if(name !== 'backgroundPosition' || !elem.currentStyle || elem.currentStyle[ name ]){
            return oldCurCSS.apply(this, arguments);
        }
        var style = elem.style;
        if ( !force && style && style[ name ] ){
            return style[ name ];
        }
        return oldCurCSS(elem, 'backgroundPositionX', force) +' '+ oldCurCSS(elem, 'backgroundPositionY', force);
    };
}

var oldAnim = $.fn.animate;
$.fn.animate = function(prop){
    if('background-position' in prop){
        prop.backgroundPosition = prop['background-position'];
        delete prop['background-position'];
    }
    if('backgroundPosition' in prop){
        prop.backgroundPosition = '('+ prop.backgroundPosition + ')';
    }
    return oldAnim.apply(this, arguments);
};

$.fn.animateGrid = function(p,add){
	p = $.extend({
		url:null,
		data:null,
		method:'post',
		query:null,
		dataType:'json',
		time:3000,
		id:null,
		count:0,
		step:15, //背景图片每个数字的高度
		value:0
	},p);
	p.id = $(this).attr('id');
	clearInterval(jsonObject2[p.id]);
	getAjax(p.id,p,add);
	jsonObject2[p.id]=setInterval(function (){
		getAjax(p.id,p,add);
	}, p.time);	
};

function getAjax(id,p,add){
	// 异步请求加载
/*	if(p.url){
		$.ajax({
		   type: p.method,
		   url: p.url,
		   data: p.query,
		   dataType: p.dataType,
		   success: function(data){show_num(id,p.count+=parseInt(data.count),p.step);},
		   error: function() {alert('返回的数据格式不正确！');}
		 });
	}else if(p.value){*/
		show_num(id,p.value+=parseInt(add),p.step);
	//}
}

function show_num(id,n,step){
	var it = $("#"+id+" i");
	var len = String(n).length;
	for(var i= 0;i < len; i++) {
		if(it.length <= i) {
			//alert("i:"+i);
			//alert("len:"+len);
			//alert(len-i-1);
			//var point = '';
			//if (i != len-1 && (len-i-1)%3 == 0) {
				//point="<span style='font-size:40px; color:#ff0;'>,</span>";
			//}
			//$('#'+id).append("<i></i>"+point);
			$('#'+id).append("<i></i>");
		}
		var num=String(n).charAt(i);
		var y = -parseInt(num)*step;
		var obj = $("#"+id+" i").eq(i);
		obj.animate({
			backgroundPosition :'(0 '+String(y)+'px)' 
			}, 'slow','swing',function(){}
		);
	}
}
	
	
function toArray(strg){
    strg = strg.replace(/left|top/g,'0px');
    strg = strg.replace(/right|bottom/g,'100%');
    strg = strg.replace(/([0-9\.]+)(\s|\)|$)/g,"$1px$2");
    var res = strg.match(/(-?[0-9\.]+)(px|\%|em|pt)\s(-?[0-9\.]+)(px|\%|em|pt)/);
    return [parseFloat(res[1],10),res[2],parseFloat(res[3],10),res[4]];
}

$.fx.step.backgroundPosition = function(fx) {
    if (!fx.bgPosReady) {
        var start = $.curCSS(fx.elem,'backgroundPosition');

        if(!start){//FF2 no inline-style fallback
            start = '0px 0px';
        }

        start = toArray(start);

        fx.start = [start[0],start[2]];

        var end = toArray(fx.end);
        fx.end = [end[0],end[2]];

        fx.unit = [end[1],end[3]];
        fx.bgPosReady = true;
    }

    var nowPosX = [];
    nowPosX[0] = ((fx.end[0] - fx.start[0]) * fx.pos) + fx.start[0] + fx.unit[0];
    nowPosX[1] = ((fx.end[1] - fx.start[1]) * fx.pos) + fx.start[1] + fx.unit[1];
    fx.elem.style.backgroundPosition = nowPosX[0]+' '+nowPosX[1];
};
})(jQuery);