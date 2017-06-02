/**
 * 修改局站时读取原来的信息填充
 */
/*---------读取表格的值，给con赋值-------*/
$(document).ready(function(){
 var trs = document.querySelectorAll("#routeTableDetail tbody tr");
 var staPara=[];
 for (var i=0;i<trs.length;i++){
    if($(trs[i]).hasClass("currtr")){
       staPara =[
    		      trs[i].children[1].innerHTML,//光路标识
    		      trs[i].children[2].innerHTML,//光路名字
    		      trs[i].children[12].innerHTML,//光路描述
    		      trs[i].children[9].innerHTML,//光路长度
    		  ];
       getRouteMoudleType(staPara[0]);
    }
    
 }
 $(function() {  
 	
 	$('input[name="integer"]').bind({  
         keydown : function() {  
             $(this).val($(this).val().replace(/[^\d]/g, ''));  
         }  
     });  
   
 	$('input[name="integer"]').each(function() {  
         var _input = $(this)[0];  
         if (_input.attachEvent) {  
             _input.attachEvent('onbeforepaste', formatPasteDataToInteger);  
         } else {  
             _input.addEventListener('onbeforepaste', formatPasteDataToInteger, false);  
         }  
     });  
       
 	$('input[name="float"]').bind({  
 		keydown : function() {  
             $(this).val($(this).val().replace(/[^0-9.]/g, ''));  
         }  
     });  
       
 	$('input[name="float"]').each(function() {  
         var _input = $(this)[0];  
         if (_input.attachEvent) {  
             _input.attachEvent('onbeforepaste', formatPasteDataToFloat);  
         } else {  
             _input.addEventListener('onbeforepaste', formatPasteDataToFloat, false);  
         }  
     });  
   
     function formatPasteDataToInteger() {  
         clipboardData.setData('text', clipboardData.getData('text').replace(/[^\d]/g, ''));  
     }  
   
     function formatPasteDataToFloat() {  
         clipboardData.setData('text', clipboardData.getData('text').replace(/[^0-9.]/g, ''));  
     }  
   
 });  
 /***div拖拽***/
 var offset_x;
 var offset_y;
 function startMove(oEvent,divId){
	var whichButton;
	if(document.all&&oEvent.button==1)
		  whichButton=true;
    else {
	   if(oEvent.button==0)
		whichButton=true;
	}
	if(whichButton){ 
	    var oDiv=divId;
		offset_x=parseInt(oEvent.clientX-oDiv.offsetLeft);
		offset_y=parseInt(oEvent.clientY-oDiv.offsetTop);
		document.documentElement.onmousemove=function(mEvent){    
		    var eEvent;
		    if(document.all){
		          eEvent=event;
		    }
		    else{
		       eEvent=mEvent;
		    }
		    var oDiv=divId;
		    var x=eEvent.clientX-offset_x;
		    var y=eEvent.clientY-offset_y;
		    oDiv.style.left=(x)+"px";
		    oDiv.style.top=(y)+"px";
	   }
    }
}
 //停止移动
function stopMove(oEvent){
	document.documentElement.onmousemove=null; 
}
 function getRouteMoudleType(routeId){
	 /**获取光路所在RTU端口的模块类型，从而限定当前光路的类型
	  *如果在在线模块：光路只能为在线
	    如果在备纤模块：只能为备纤
	    如果在混合模块：可以选择在线或备纤

	  ***/
	 $.ajax({
	 	 url:"getRouteMoudleType",
	 	 dataType:'json', //接受数据格式
	      async: false,
	      data:{"routeId":routeId},
	 	 success: function(json){
	 		 if(json[0].status){
	 			  var moudleType=json[0].moudleType;//模块类型
	 			  $("#alterRouteLink").val(String(json[0].isUplink));
	 			  $("#alterRouteStatus").val(String(json[0].isOnline));
	 			  switch(moudleType){
	 				case"1": 
	 				case "2"://在线 
	 				    $("#alterRouteStatus").attr("disabled","disabled");
	 					break;
	 				case"3"://保护-主
	 					if(json[0].isProtect){//处于保护状态的光路不能修改状态
	 					    $("#alterRouteStatus").attr("disabled","disabled");
	 					}
	 					$("#alterRouteLink").attr("disabled","disabled");
	 					break;
	 				default:
	 					break;
	 			}
	 		}
	 	},	 
	 })
 }

  /**----------------给光路各项设置值--------------*/

	 $("#alterRouteId").val(staPara[0]);
	 $("#alterRouteName").val(staPara[1]);
	 $("#alterRouteDescription").val(staPara[2]);//读取原来的参数
	 $("#length").val(staPara[3]);
		 
});
/*---------------close-------------------------*/
$(".sidebar_close").click(function(){
    $(".contentDiv").html("");
    $(".sidebarDiv").html("");
});
/*-----------------cancel-----------------------*/
$("#cancel").click(function(){
	 $(".contentDiv").html("");
     $(".sidebarDiv").html("");
});
/**---------------confirm-------------------------*/
$(".confirm").click(function(){
	var validate=false;
	var length= $("#length").val();
	if((!isNaN(length))&&parseInt(length)>=0){//必须为数字
		   validate=true;
	}else{
		    validate=false;
		    var txt="光路长度的格式不正确，长度必须为不小于0的有效数字，请重新输入地标距离."
		     
		     var option = {
						title: "提示",
						btn: parseInt("0001",2),
						onOk: function(){//点击确认的执行方法
							
						}
					}
			  window.wxc.xcConfirm(txt, "info", option);
		}
	if(validate){
    $.ajax({
	       	 url:"route/modifyRoute",//服务器地址
	       	 type:"POST",//采用POST请求
	       	 dataType:"json",//
	       	 timeout:5000,
	       	 data:{
	             	"routeId":$("#alterRouteId").val(),
	             	'length':$("#length").val(),
	             	"routeName":$("#alterRouteName").val(),
	             	"routeStatus":$("#alterRouteStatus").val(),
	             	"linkStatus":$("#alterRouteLink").val(),
	             	"routeDescription":$("#alterRouteDescription").val(),
	       	  },
	       	 success: function(json){
		        	$(".sidebarDiv").html("");
			  		var txt="";
			  		if(json[0].status){
			  			  txt+="修改成功."
			  		}
			  		else{
			  			  txt+="修改失败，失败原因："+json[0].err;
			  		}
			  		var option = {
			  						title: "提示",
			  						btn: parseInt("0001",2),
			  						onOk: function(){//点击确认的执行方法
			  							getRouteByRtuId(json[0].rtuId);
			  						}
			  					}
			  					  window.wxc.xcConfirm(txt, "info", option);
			  			      },
			  	error:function(XMLHttpRequest,Error){
			  			$(".sidebarDiv").html("");
			  		    var txt="修改失败<br/>";
			  			txt+="失败原因：";
			  			if(XMLHttpRequest.status==401){
			  			    txt+="您不具有当前操作的权限<br/>";
			  			}
			  			else{
			  			    	txt+="网络错误<br/>";
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
});