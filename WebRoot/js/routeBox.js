 /**
  * 全局变量,当前选中的输入框DIV**/ 
var thisBox=$(".routebox .routebox-content .routebox-input.route-start");

//百度地图API功能
var maArea = document.getElementById("mapArea");
var map = new BMap.Map(maArea, { minZoom:6, maxZoom: 15 });    // 创建Map实例，设定缩放大小限制
map.centerAndZoom(new BMap.Point(104.071216, 30.576279), 11);           // 初始化地图，设置中心点坐标和地图缩放级别
map.enableScrollWheelZoom(true);
var styleJson=[
               {
                   "featureType": "all",
                   "elementType": "all",
                   "stylers": {
                             "lightness": 10,
                             "saturation": -100
                   }
         		}
			];
map.setMapStyle({
	  styleJson:styleJson
});
//开启鼠标滚轮缩放
map.addControl(new BMap.NavigationControl());         //添加缩放按钮
//左上角比例尺控件
var scaleControl = new BMap.ScaleControl({ anchor: BMAP_ANCHOR_TOP_LEFT });
map.addControl(scaleControl);
//测距工具
var disTool=new BMapLib.DistanceTool(map);
//获取坐标
var move=true;
var firstEnter=true;
function getMapPoint(){
	if($("#point").text()=="获取坐标"){
		$("#point").text("关闭坐标");
		$('#tip').css('display','block');
		var top=0;
		var left=0;
		move=true;
		if(firstEnter){
			$("#mapArea").mousemove(function(e){
				if($("#point").text()=="关闭坐标"&&move){
					    top = e.pageY+5;
					    left = e.pageX+5;
					    $('#tip').css({
						'top' : top + 'px',
					    'left': left+ 'px'
					   });
				}else{
					return true;
				}
			 });
			$("#mapArea").click(function(e){
				move=(!move);
			 });
			 map.addEventListener("mousemove",function(e){
				 if(move){
					 $('#tip').text(e.point.lng + "," + e.point.lat); 
				 }
			});
		}
		
	}else{
		$("#point").text("获取坐标");
		 $('#tip').css('display','none');
	}
	firstEnter=false;	
}

//右下角缩略图控件
var overView = new BMap.OverviewMapControl();
var overViewOpen = new BMap.OverviewMapControl({ isOpen: true, anchor: BMAP_ANCHOR_BOTTOM_RIGHT });
map.addControl(overView);
map.addControl(overViewOpen);

//复杂的自定义覆盖物
function ComplexCustomOverlay(point, text, mouseoverText,color) {
	this._point = point;
	this._text = text;
	this._overText = mouseoverText;
	this._id = 0;
	this._class='';
	this._color = color;
}
// *实例继承自Overlay类 
ComplexCustomOverlay.prototype = new BMap.Overlay();

//增加设置ID的方法
ComplexCustomOverlay.prototype.setId = function (id) {
	this._id = id;
}
//增加获取ID的方法

ComplexCustomOverlay.prototype.setClass= function (cls) {
	 this._class=cls;
}
ComplexCustomOverlay.prototype.getClass = function () {
	return this._class;
}
// 初始化该类

ComplexCustomOverlay.prototype.initialize = function (map) {
	this._map = map;
	var div = this._div = document.createElement("div");
	div.style.position = "absolute";
	div.style.zIndex = BMap.Overlay.getZIndex(this._point);
	div.style.backgroundColor = "#EE5D5B";
	div.style.border = "1px solid #BC3B3A";
	div.style.color = this._color;
	div.style.height = "18px";
	div.style.padding = "2px";
	div.style.lineHeight = "18px";
	div.style.whiteSpace = "nowrap";
	div.style.MozUserSelect = "none";
	div.style.fontSize = "13px"
	var span = this._span = document.createElement("span");
	div.appendChild(span);
	span.appendChild(document.createTextNode(this._text));
	var that = this;//此处的that为该覆盖物对象
	var arrow = this._arrow = document.createElement("div");
	arrow.style.background = "url(../../images/label.png) no-repeat";
	arrow.style.position = "absolute";
	arrow.style.width = "11px";
	arrow.style.height = "10px";
	arrow.style.top = "22px";
	arrow.style.left = "10px";
	arrow.style.overflow = "hidden";
	div.appendChild(arrow);
	//鼠标移动到label

	div.onmouseover = function () {
		this.style.zIndex = "999999";
		this.style.backgroundColor = "#6BADCA";
		this.style.borderColor = "#0000ff";
		this.getElementsByTagName("span")[0].innerHTML = that._overText;
		arrow.style.backgroundPosition = "0px -20px";
	}
	//鼠标移除label

	div.onmouseout = function () {
		this.style.zIndex = "999998";
		this.style.backgroundColor = "#EE5D5B";
		this.style.borderColor = "#BC3B3A";
		this.getElementsByTagName("span")[0].innerHTML = that._text;
		arrow.style.backgroundPosition = "0px 0px";
	}
	//点击label

	div.onclick = function () {
		// alert(that.getId())
	}
	
	map.getPanes().labelPane.appendChild(div);
	return div;
}

ComplexCustomOverlay.prototype.draw = function () {
	var mp = this._map;
	var pixel = mp.pointToOverlayPixel(this._point);
	this._div.style.left = pixel.x - parseInt(this._arrow.style.left) + "px";
	this._div.style.top = pixel.y - 30 + "px";
}
//自定义marker类
//主要是为了添加id属性  

function diyMarker(point,option) {
	//构造函数调用Marker类的构造函数
	BMap.Marker.call(this, point,option);
	this._id = 0;
}
//该类继承自Marker

diyMarker.prototype = new BMap.Marker();
diyMarker.prototype.setId = function (id) {
	this._id = id;
}
//增加获取Id的方法

diyMarker.prototype.getId = function () {
	return this._id;
}

//自定义告警标记
function WarnMarker(point,option) {
	//构造函数调用Marker类的构造函数
	BMap.Marker.call(this, point,option);
	this.setTop(true);//告警的图标放在最上层
	this._id = 0;
	this._info = '';
	this._name="";
}
//该类继承自Marker

WarnMarker.prototype = new BMap.Marker();
//增加设置Id的方法
WarnMarker.prototype.setId = function (id) {
	this._id = id;
}

//增加获取Id的方法
WarnMarker.prototype.getId = function () {
	return this._id;
}
//增加设置Info的方法

WarnMarker.prototype.getInfo= function () {
	return this._info;
}
WarnMarker.prototype.setInfo = function (info) {
	this._info = info;
}
WarnMarker.prototype.getName= function () {
	return this._name;
}
WarnMarker.prototype.setName = function (name) {
	this._name = name;
}


//自定义光路地标标记
function RouteMarker(point,option) {
	//构造函数调用Marker类的构造函数
	BMap.Marker.call(this, point,option);
	this._id = 0;
	this._info = '';
	this._name="";
}
//该类继承自Marker

RouteMarker.prototype = new BMap.Marker();
//增加设置Id的方法
RouteMarker.prototype.setId = function (id) {
	this._id = id;
}

//增加获取Id的方法
RouteMarker.prototype.getId = function () {
	return this._id;
}
//增加设置Info的方法

RouteMarker.prototype.getInfo= function () {
	return this._info;
}
RouteMarker.prototype.setInfo = function (info) {
	this._info = info;
}
RouteMarker.prototype.getName= function () {
	return this._name;
}
RouteMarker.prototype.setName = function (name) {
	this._name = name;
}


//定义光缆地标覆盖物
function LandmarkOverlay(point, text, mouseoverText){
  this._point = point;
  this._text = text;
  this._overText = mouseoverText;
}
LandmarkOverlay.prototype = new BMap.Overlay();
LandmarkOverlay.prototype.initialize = function(map){
  this._map = map;
  var div = this._div = document.createElement("div");
  div.style.position = "absolute";
  div.style.zIndex = BMap.Overlay.getZIndex(this._point);
  div.style.backgroundColor = "#6BADCA";
  div.style.border = "1px solid #0000ff";
  div.style.color = "white";
  div.style.height = "18px";
  div.style.padding = "2px";
  div.style.lineHeight = "18px";
  div.style.whiteSpace = "nowrap";
  div.style.MozUserSelect = "none";
  div.style.fontSize = "12px"
  var span = this._span = document.createElement("span");
  div.appendChild(span);
  span.appendChild(document.createTextNode(this._text));      
  var that = this;
  var arrow = this._arrow = document.createElement("div");
  arrow.style.background = "url(../../images/label.png) 0px -22px no-repeat";
  arrow.style.position = "absolute";
  arrow.style.width = "11px";
  arrow.style.height = "10px";
  arrow.style.top = "22px";
  arrow.style.left = "10px";
  arrow.style.overflow = "hidden";
  div.appendChild(arrow);
 
  div.onmouseover = function(){
	this.style.backgroundColor = "#EE5D5B";
	this.style.borderColor = "#BC3B3A";
	this.style.zIndex = "999999";
    this.getElementsByTagName("span")[0].innerHTML = that._overText;
    arrow.style.backgroundPosition = "0px 0px";
  }

  div.onmouseout = function(){
	 this.style.backgroundColor = "#6BADCA";
	 this.style.borderColor = "#0000ff";
	 this.style.zIndex = "999998";
     this.getElementsByTagName("span")[0].innerHTML = that._text;
     arrow.style.backgroundPosition = "0px -22px";
  }

  map.getPanes().labelPane.appendChild(div);
  
  return div;
}
LandmarkOverlay.prototype.draw = function(){
  var map = this._map;
  var pixel = map.pointToOverlayPixel(this._point);
  this._div.style.left = pixel.x - parseInt(this._arrow.style.left) + "px";
  this._div.style.top  = pixel.y - 30 + "px";
}

//获取局站坐标信息

$.ajax({
	url: '../../getMapPoints',
	type: 'post', //数据发送方式
	dataType: 'json', //接受数据格式
	async: false,
	success: function (json) {
		if (json[0].status) {
			var cablePoint = json[0].points;
			plotMarker(cablePoint);
			getCableLines();
		}
	},
	error:function(XMLHttpRequest,Error){
  	}
});
//获取光缆坐标信息 

function getCableLines() {
	$.ajax({
		url: '../../getCableLines',
		type: 'post', //数据发送方式
		dataType: 'json', //接受数据格式
		async: false,
		success: function (json) {
			if (json[0].status) {
				var cableLines = json[0].cables;
				plotLine(cableLines);
				getRouteLandmarkers();//绘制光路信息
			}
		},
		error:function(XMLHttpRequest,Error)
	      {
	      }
	});
}
//获取光路坐标和告警信息 

function getRouteLandmarkers() {
	$.ajax({
		url: '../../getRouteLandmarkers',
		type: 'post', //数据发送方式
		dataType: 'json', //接受数据格式
		async: false,
		success: function (json) {
			if (json.status) {
				var routes = json.routes;//光路信息
				plotRoutes(routes);//绘制光路信息
			}
		},
		error:function(XMLHttpRequest,Error)
	      {
	      }
	});
}
/**
 *绘制局站 
 
 ***/
function plotMarker(cablePoint){
	if(cablePoint.length>0){
		map.centerAndZoom(new BMap.Point(cablePoint[0].lng, cablePoint[0].lat), 11);           // 如果存在局站，设置中心点坐标为第一个局站的位置
	}
	for(var i = 0; i < cablePoint.length; i++){
		var lng = cablePoint[i].lng;
		var lat = cablePoint[i].lat;
		var pointName = cablePoint[i].name;
		var pointId = cablePoint[i].id;
		var position = new BMap.Point(lng, lat);
		var icon = new BMap.Icon('../../images/house_32.png', new BMap.Size(32, 32), {
		    anchor: new BMap.Size(10, 25)
		});
		var marker = new diyMarker(position,{icon:icon});//新建自定义marker; 
		marker.setId(pointId);//设置makerId    
		map.addOverlay(marker);//绘制标记点
		var pointLabel = new BMap.Label(pointName, { offset: new BMap.Size(20, -10) });
		pointLabel.setStyle({background:"#3385ff",color :"#ffffff",fontSize : "14px",borderColor:"blue",}) 
		marker.setLabel(pointLabel);//绘制标签
		/**
		 * 点击局站
		 */
		marker.addEventListener("click", function(){    
			 var box=$(thisBox).find("input[type='text']");
			 $(box).val(this.getLabel().getContent()+"(id:"+this.getId()+")"); 
			 $(thisBox).find("div[class='input-clear']").show();
		});
		
	}
}

//绘制光缆
//起始点相同的光缆用平行方式错开
//param cableLine 光缆的起始点坐标
//cableLine 为JSON数组

function plotLine(cableLine) {

	for (var i = 0; i < cableLine.length; i++) {
		var alng = cableLine[i].pointA[0];
		var alat = cableLine[i].pointA[1];
		var blng = cableLine[i].pointB[0];
		var blat = cableLine[i].pointB[1];
		var aPosition = new BMap.Point(alng, alat);
		var bPosition = new BMap.Point(blng, blat);
		var points = [aPosition, bPosition];
		var lineCount = cableLine[i].count;
		var lineNames = cableLine[i].name;
		var lineLengths = cableLine[i].length;
		var hasRoute=cableLine[i].hasRoute;
		var lineIds = cableLine[i].id;
		var marks=cableLine[i].landmarks;//光缆地标
		for (var j = 0; j < lineCount; j++) {
			var tempPoints = [aPosition];//全部的点
			for(var markIndex=0;markIndex<marks[j].length;markIndex++){//取每条光缆的
				var mark=marks[j][markIndex];
				var position=new BMap.Point(mark.lng,mark.lat);
				tempPoints.push(position);//加入地标点
				if(hasRoute[j]==false||hasRoute[j]=="false"){
	 				var pointName=mark.name;
	 				 // 创建标注对象并添加到地图   
	 				var mouseoverTxt = mark.name + " 地标类型："+mark.type+" 距离起点："+mark.distance+"km" ;
	     			var landMark = new LandmarkOverlay(position, mark.name,mouseoverTxt);
	 				map.addOverlay(landMark);
				}
			}
			tempPoints.push(bPosition);//加入终点
			var cutPoint =[];//标记光缆名字的位置
			var forCut=[];
			var medium=parseInt(lineCount/2);
			if(marks[j].length==0){//如果没有地标，则添加中点作为偏移量
				var centerlng = (aPosition.lng + bPosition.lng) / 2;
				var centerlat = (aPosition.lat + bPosition.lat) / 2;
				forCut = [[aPosition.lng, aPosition.lat], [centerlng, centerlat]];
				if(j>medium){
					forCut = [[centerlng, centerlat],[bPosition.lng, bPosition.lat]];
				}
				cutPoint = lineDiv(forCut, j);
			}
			else{
				var cIndex=parseInt(tempPoints.length/2);//光缆途经点的中点index
				forCut=[[tempPoints[cIndex-1].lng, tempPoints[cIndex-1].lat], [tempPoints[cIndex].lng, tempPoints[cIndex].lat]];
				if(j>medium){
					var end=[];
					forCut=[[tempPoints[cIndex].lng, tempPoints[cIndex].lat], [tempPoints[cIndex+1].lng, tempPoints[cIndex+1].lat]];
				}
				
				cutPoint=lineDiv(forCut,1);
			}
			var lastPoint=tempPoints.pop();
			forCut=[[tempPoints[tempPoints.length-1].lng,tempPoints[tempPoints.length-1].lat],[lastPoint.lng,lastPoint.lat]];
			var offsetPoint=lineDiv(forCut,j);
			tempPoints.push(new BMap.Point(offsetPoint[0],offsetPoint[1]));
			tempPoints.push(lastPoint);
			var cablePolyline = new BMap.Polyline(tempPoints, { strokeColor: "rgb(0,0,0)", strokeWeight: 9, strokeOpacity: 0.45-0.5*j });
			map.addOverlay(cablePolyline);
			var labelPosition = new BMap.Point(cutPoint[0],cutPoint[1]);
			var context=lineNames[j]+" 总长度："+lineLengths[j]+"km"
			var myCompOverlay = new ComplexCustomOverlay(labelPosition, lineNames[j], context,"white");
			myCompOverlay.setClass('cableLabel');
			myCompOverlay.setId(lineIds[j]);
			map.addOverlay(myCompOverlay);			
		}
	}

};

/***绘制光路
**光路信息中包含以下字段：<br/>
*    name:光路名称
*    length:光路长度
*    stationA、stationZ：起止站点，均为JSON对象，包含：<br/>
*  	   lat:告警点纬度
*   	   lng:告警点经度 
*        name:名称
*    warns JSONArray:未处理的告警信息，每个元素为一个JSONObject，包含：<br>
	  *    time：告警时间
	  *	   type:告警类型
	  *	   source：告警来源
	  *    route：光路类型
	  *    below:告警位置据上一个地标信息
	  *    beyond:告警位置据下一个地标信息
	  *    lat:告警点纬度
	  *    lng:告警点经度 
	  
	  marks JSONArray:光路地标，每个元素为一个JSONObject，包含：<br>
	  *    name:地标名称
	  *	   type:地标类型
	  *    distance：距起点的位置
	  *    lat:地标纬度
	  *    lng:地标经度     
***/
function plotRoutes(routes) {
	var routeMarkLabel = new BMap.Icon('../../images/landmark.png', new BMap.Size(32, 32), {
			anchor: new BMap.Size(10, 25)
	});
	var ployLines=[];

	for (var i = 0; i <routes.length; i++) {
		var name=routes[i].name;
		var len=routes[i].length;
		var alng = routes[i].stationA.lng;//A站经度
		var alat = routes[i].stationA.lat;
		var zlng = routes[i].stationZ.lng;//Z站经度
		var zlat = routes[i].stationZ.lat;
		var aPoint = new BMap.Point(alng, alat);//A站
		var zPoint = new BMap.Point(zlng, zlat);//Z站
		var points = [aPoint];//全部的点
		var marks=routes[i].marks;//光路地标
		var warns=routes[i].warns;//光路地标
		/***绘制光路地标***/
		for (var j = 0; j < marks.length; j++) {
			var mark=marks[j];
			var position=new BMap.Point(mark.lng,mark.lat);
			points.push(position);//加入地标点
			if(mark.type=='站点'){
				position=new BMap.Point(mark.lng-0.003,mark.lat+0.0003);
			}
			var routeMarkBlue = new RouteMarker(position,{icon:routeMarkLabel});  // 创建标注
			map.addOverlay(routeMarkBlue);               // 将标注添加到地图中
			var infoMark ="<div style='font-size:13px;line-height:1.5;margin-bottom:10px'>"+
								"<div style='margin:0;text-indent:0.5em'>"+
							       "<span style='font-weight:bold;'>  地标名称：</span>" +mark.name +
							    "<div/>"+
							    "<div style='margin:0;text-indent:0.5em'>"+
							    	"<span style='font-weight:bold;'>  地标类型：</span>" +mark.type +
							    "<div/>"+
							    "<div style='margin:0;text-indent:0.5em'>"+
							       "<span style='font-weight:bold;'> 距离起点:</span>"+mark.distance+"km"+
							    "</div>"+
				       "</div>";
		    routeMarkBlue.setInfo(infoMark);
		    routeMarkBlue.setName(mark.name);
		    routeMarkBlue.addEventListener("mouseover", function(){
		    	var routeMarLabel = new BMap.Label(this.getName(), { offset: new BMap.Size(10, -20) });
		    	routeMarLabel.setStyle({background:"black",color :"white",fontSize : "13px",borderColor:"black",})
	            this.setLabel(routeMarLabel);//绘制标签
			});
		    routeMarkBlue.addEventListener("mouseout", function(){
		    	map.removeOverlay(this.getLabel());
			});
		    routeMarkBlue.addEventListener("click", function(){
				   var opts={width:160,height:100};
				   var infoWindow = new BMap.InfoWindow(this.getInfo(),opts);
				   infoWindow.setTitle("<div style='color:red;margin:0 0 5px 0;padding:0.2em 0'>光路地标</div>")
				   this.openInfoWindow(infoWindow);
			});
		}
		var icon = new BMap.Icon('../../images/errorLabel32_1.png', new BMap.Size(32, 32), {
		    anchor: new BMap.Size(10, 25)
		});
		/***绘制告警信息***/
		for (var j = 0; j < warns.length; j++) {
			var warn=warns[j];
			var point=new BMap.Point(warn.lng,warn.lat);
			var warnMarker = new WarnMarker(point,{icon:icon});  // 创建标注
			map.addOverlay(warnMarker);               // 将标注添加到地图中
			warnMarker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
			var info ="<div style='font-size:13px;line-height:1.5;margin-bottom:10px'>"+
						"<div style='margin:0;text-indent:0.5em'>"+
					       "<span style='font-weight:bold;'> 告警时间:</span>" +warn.time +
					    "<div/>"+
					    "<div style='margin:0;text-indent:0.5em'>"+
					       "<span style='font-weight:bold;'> 告警原因:</span>"+warn.reason+
					    "<div/>"+
					    "<div style='margin:0;text-indent:0.5em'>"+
					       "<span style='font-weight:bold;'> 告警位置:</span>"+warn.site+
					    "</div>"+
					    "<div style='margin:0;text-indent:0.5em'>"+
					       "<span style='font-weight:bold;'> 距上个地标:</span>"+warn.below+
					    "</div>"+
					    "<div style='margin:0;text-indent:0.5em'>"+
						   "<span style='font-weight:bold;'> 距下个地标:</span>"+warn.beyond+
						"</div>"+	   
						"<div style='margin:0;text-indent:0.5em'>"+
						   "<a href='javascript:confirmWarn("+warn.id+")'>确认告警</a>"+
						"</div>"
					 "</div>";
			warnMarker.setInfo(info);
			warnMarker.setName(warn.route);
			warnMarker.addEventListener("click", function(){
		       var opts={width:220,height:150,title:warn.route};
		       var infoWindow = new BMap.InfoWindow(this.getInfo(),opts);
		       infoWindow.setTitle("<div style='color:red;margin:0 0 5px 0;padding:0.2em 0'>"+this.getName()+" &nbsp;&nbsp;&nbsp;&nbsp;告警"+"</div>")
		       this.openInfoWindow(infoWindow);
		   });
		   warnMarker.addEventListener("mouseover", function(){
				this.setAnimation(false); //跳动的动画
				var warnLabel = new BMap.Label("故障点!", { offset: new BMap.Size(10, -20) });
				warnLabel.setStyle({background:"yellow",color :"black",fontSize : "13px",borderColor:"yellow",})
	            this.setLabel(warnLabel);//绘制标签
		   });
		   warnMarker.addEventListener("mouseout", function(){
				this.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
				map.removeOverlay(this.getLabel());
		   });
		   
		}
		points.push(zPoint);//加入终点
		var cutPoint =[];//标记光路名字的位置
		var count=parseInt(routes[i].count);//有共同起终点的光路条数
		var index=parseInt(routes[i].index);
		var medium=parseInt(count/2);
		var forCut=[];
		if(marks.length==0){//如果没有地标，则添加中点作为偏移量
			var centerlng = (aPoint.lng + zPoint.lng) / 2;
			var centerlat = (aPoint.lat + zPoint.lat) / 2;
			points.push(new BMap.Point(centerlng,centerlat));//如果没有地标，则添加偏移量
			forCut = [[aPoint.lng, aPoint.lat], [centerlng, centerlat]];
			if(index>medium){
				forCut = [[centerlng, centerlat],[zPoint.lng, zPoint.lat]];
				index=index-medium;
			}
			else{
				index+=1;
				if(index>2){
					index-=2;
					forCut=[lineDiv(forCut,1),[centerlng, centerlat]];
				}
				
			}
			cutPoint = lineDiv(forCut,index);//多条光路以A、Z站点为终点
		}else{
			var cIndex=parseInt(points.length/2);//光路途经点的中点index
			forCut=[[points[cIndex-1].lng, points[cIndex-1].lat], [points[cIndex].lng, points[cIndex].lat]];
			if(index>medium){
				forCut =[[points[cIndex].lng, points[cIndex].lat], [points[cIndex+1].lng, points[cIndex+1].lat]];
				index=index-medium;
			}
			else{
				index+=1;
				if(index>2){
					index-=2;
					forCut=[lineDiv(forCut,1),[points[cIndex].lng, points[cIndex].lat]];
				}
			}
			cutPoint=lineDiv(forCut,index);
		}
		var lastPoint=points.pop();
		forCut=[[points[points.length-1].lng,points[points.length-1].lat],[lastPoint.lng,lastPoint.lat]];
		var offsetPoint=lineDiv(forCut,index);
		points.push(new BMap.Point(offsetPoint[0],offsetPoint[1]));
		points.push(lastPoint);
		var color="rgb(0,255,0)";
		var strokeWeight=4;
		var strokeOpacity=0.75;
		if(warns.length>0){
			color="red";
			strokeWeight=2;
			strokeOpacity=1;	
		}
		var newPolyline = new BMap.Polyline(points, {strokeColor: color, strokeWeight:strokeWeight, strokeOpacity:strokeOpacity});
		map.addOverlay(newPolyline);
		var labelPosition = new BMap.Point(cutPoint[0], cutPoint[1]);
		var context=name+" 总长度："+len+"km";
		var myCompOverlay = new ComplexCustomOverlay(labelPosition,name, context,"black");
		map.addOverlay(myCompOverlay);  
	}
};
/***确认告警***/
function confirmWarn(selectId){
	 $.ajax({
       type : "post",
       async : false,  //异步请求 先执行后续操作，再执行sucess
       url : "../../alarm/handleAlarm/ignore",
       dataType:"json",
       data : {
       		"warnId":selectId,
       },
       success:function(json){
         var txt="";
		    	 if(json[0].status){
		    		txt+="处理成功.<br/>"
		    	}
		    	else{
		    		txt+="处理失败，请重试.";
		    	}
			     var option = {
							title: "提示",
							btn: parseInt("0001",2),
							onOk: function(){//点击确认的执行方法
								map.clearOverlays();
								$.ajax({
									url: '../../getMapPoints',
									type: 'post', //数据发送方式
									dataType: 'json', //接受数据格式
									async: false,
									success: function (json) {
										if (json[0].status) {
											var cablePoint = json[0].points;
											plotMarker(cablePoint);
											getCableLines();
										}
									},
									error:function(XMLHttpRequest,Error){
								  	}
								});
							}
						}
				  window.wxc.xcConfirm(txt, "info", option);
		      },
		    error:function(XMLHttpRequest,Error){
		    	    var txt="处理告警失败,";
		    	    txt+="失败原因：";
		    	    if(XMLHttpRequest.status==401){
		    	        txt+="您不具有当前操作的权限.";
		    	     }
		    	     else{
		    	        	txt+="网络错误,";
		    	        	txt+="状态码："+XMLHttpRequest.status;
		    	        }
		    	      var option={
		    	   					title: "提示",
		    	   					btn: parseInt("0001",2),
		    	   					onOk: function(){//点击确认的执行方法       			    	   						
		    	  			       }
		    	   				}
		    	   	window.wxc.xcConfirm(txt, "info", option);
		  }
   });
}
/**
 * 递归找等分点**/
function lineDiv(point,cutCount){
	if(cutCount==0)
	   return point[1];
	else {
	   var cutLng=(point[0][0]+point[1][0])/2;
	   var cutLat=(point[0][1]+point[1][1])/2;
	   var cutPoint=[cutLng,cutLat];
	   return lineDiv([point[0],cutPoint],cutCount-1)
	}
		
}
/**
 * 设置站点输入框相关**/
$(document).ready(function(){
	 /***
	    * 增加站点*/
	 $(".route-input-add-icon").click(function(){
		    if($(".routebox-inputs").children().length<=10){
		    	var routeThrough=document.createElement("div");
			    routeThrough.className="routebox-input route-through";
			    $(routeThrough).append(
			    		 "<div class='route-input-icon'> </div> "+
			    		 "<input autocomplete='off' placeholder='请选择途经点' class='route-through-input' type='text'>"+
			    		 "<div class='input-clear' title='清空'> </div>"+
			    		 "<div class='route-input-remove-icon' data-index='1' title='移除站点'></div>"
			    );
			    $(".routebox .routebox-content .routebox-input.route-end").before(routeThrough);
		    }
    });
	 /**
		* 移除站点
		* 应用live绑定事件可以使得新增加的元素同样具有该属性**/
	 $(document).on('click',".route-input-remove-icon", function(){
			$(this).parent().remove();//移除当前节点的父节点，也就是移除了一个输入项
		});
	//jquery 1.9.1以后移除了live()方法，用on()代替
//	$(".route-input-remove-icon").live('click', function(){
//		$(this).parent().remove();//移除当前节点的父节点，也就是移除了一个输入项
//	});
	/**
	* 起点终点反转
	* **/
	$(".routebox-revert-icon").click(function(){
		   var startStation=$(".route-start-input").val();
		   $(".route-start-input").val($(".route-end-input").val());
		   $(".route-end-input").val(startStation);
		})
  /**
   * 点击起点输入框**/	
	$(".routebox .routebox-content .routebox-input.route-start").click(function() {
		thisBox=this;
    });
  /**
	 * 点击途经站点输入框**/
	$(document).on('click',".routebox .routebox-content .routebox-input.route-through", function(){
		thisBox=this;
	});
	//jquery 1.9.1以后移除了live()方法，用on()代替
   //	$(".routebox .routebox-content .routebox-input.route-through").live('click', function(){
   //		thisBox=this;
   //	});
 /**
   * 点击终点输入框**/
	$(".routebox .routebox-content .routebox-input.route-end").click(function(){
		thisBox=this;
	});
 /**
  清空站点内容
  **/
	$(document).on('click',".searchbox-content .input-clear", function(){
		var box=$(this).parent().find("input[type='text']");//通过获取当前clear图标的父节点来寻找输入框
		$(box).val("");
		$(this).hide();
	})
	//jquery 1.9.1以后移除了live()方法，用on()代替
//	$(".searchbox-content .input-clear").live('click', function(){
//		var box=$(this).parent().find("input[type='text']");//通过获取当前clear图标的父节点来寻找输入框
//		$(box).val("");
//		$(this).hide();
//	})
	/**
	 * 点击提交按键**/
	$("#set-button").click(function(){
		    var IDs=[];
		    //获取所选局站的ID
		    $(".routebox-inputs").children().each(
		    	function(){
		    	  var inValue=$(this).find("input[type='text']").val().split("id:")[1];
		    	  IDs.push(parseInt(inValue.split(")")[0]));
		    	}
		    );
		    $.ajax({
				    url:'../../setRoute',
			        type:'post', //数据发送方式
			        dataType:'json', //接受数据格式
			        async: false,
			        data:{
			        	    "id":JSON.stringify(IDs),
			             },
			         success: function(json){
			        	var crossStation=[];
			        	var route=[];
			        	var topological=[];
			        	var preparatoryId=[];
			        	var framePortOrder=[];
			        	if(json[0].status){
			        		for(var count=1;count<json.length;count++){
			        			route.push(json[count].rtuName+"_"+json[count].rtuPortOrder+"—"+json[count].frameName+"_"+json[count].framePortOrder);
			        			var top=[json[count].topologicalRoute,json[count].topologicalPoint];
			        			topological.push(top);//拓扑图+
			        			preparatoryId.push(json[count].preparatoryId);//preparatoryId
			        			framePortOrder.push(json[count].framePortOrder);//framePortOrder
			        		}
			        		crossStation.push(json[1].topologicalStation);//局站id
			        		localStorage.setItem('route', JSON.stringify(route));
			        		localStorage.setItem('topological', JSON.stringify(topological));
			        		localStorage.setItem('preparatoryId', JSON.stringify(preparatoryId));
			        		localStorage.setItem('framePortOrder', JSON.stringify(framePortOrder));
			        		localStorage.setItem('crossStation', JSON.stringify(crossStation));
			        		var routeSetedPara=[];
			        		localStorage.setItem("routeSetedPara",JSON.stringify(routeSetedPara));
			        		$(".preRouteList").load("selectRoute.html");
			   	           
			        	 }
			        	else{
			        		      var txt= "您选择的站点不存在可用光路，请核对后重试";
			        			  var option = {
			        						title: "提示",
			        						btn: parseInt("0001",2),
			        						onOk: function(){//点击确认的执行方法
			        						}
			        					}
			        			  window.wxc.xcConfirm(txt, "info", option);
			        		}
			         },
			         error:function(XMLHttpRequest,textStatus){
			   		  var txt= "设置错误，网络故障,";
			   		  txt+="状态码："+XMLHttpRequest.status+",";
			   		  txt+="错误原因：" +XMLHttpRequest.statusText;    
			   	       var option = {
			   					title: "提示",
			   					btn: parseInt("0001",2),
			   					onOk: function(){//点击确认的执行方法
			   					}
			   				}
			   		  window.wxc.xcConfirm(txt, "info", option);
			   	}
			});  
	 })
})
