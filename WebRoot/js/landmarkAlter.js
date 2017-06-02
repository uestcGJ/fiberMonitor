/***
 * 修改landmark
 */
/***全局变量，当前地标标识***/
var landmarkId=0;
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
/***---------------页面载入时将当前选中的landmark的信息读取到对话框中------------------*/
$(document).ready(function(){
	var trs = document.querySelectorAll("#landmarkTableDetail tbody tr");
	var landmarkPara=[];
	 for (var i=0;i<trs.length;i++){
	    if($(trs[i]).hasClass("currtr")){
	    	for(var count=1;count<9;count++){//读取欲取的值
	    		landmarkPara.push(trs[i].children[count].innerHTML);
	    	}
	    	i=trs.length;
	    }
	 }
	 /***坐标输入只能为数字**/
	 $(".LongAndLatitude").focus(function(){
	 	   $(this).keypress(function (event) {
	            var eventObj = event || e;
	            var keyCode = eventObj.keyCode || eventObj.which;
	            if ((keyCode >= 48 && keyCode <= 57)||(keyCode==46))
	                return true;
	            else
	                return false;
	 	  	})
	}) 
/**----------------给landmark各项设置值--------------*/
	/**-------读取表格中的经纬度值，进行拆分------*/
	 var lng=landmarkPara[3];
	 var lat=landmarkPara[4];
	 landmarkId=landmarkPara[0];
	 $("#thisCableName").val(landmarkPara[2]); 
	 $("#LandmarkName").val(landmarkPara[1]);
	 $("#lngFloat").val(lng);
	 $("#latFloat").val(lat);
	 $("#type").val(landmarkPara[5]);
	 $("#distance").val(landmarkPara[6]);
	 $("#landmarkDescription").val(landmarkPara[7]);	 
});
/**----------------close------------------*/
$(".sidebar_close").click(function(){
    $(".contentDiv").html("");
    $(".sidebarDiv").html("");
});
/**-------------------确认修改----------------*/
$(".alterConfirm").click(function(){
	var lng=$("#lngFloat").val();
	var lat=$("#latFloat").val();
	var validate=false;
	var lng=$("#lngFloat").val();
	var lat=$("#latFloat").val();
	var distance= $("#distance").val();
	if(lng.indexOf(".")>0&&lat.indexOf(".")>0&&(!isNaN(lat))&&(!isNaN(lng))&&(parseInt(lat)>0&&parseInt(lat)<180)&&(parseInt(lng)>0&&parseInt(lng)<180)&&(!isNaN(distance))&&parseInt(distance)>=0){//必须含有小数点,必须为数字
		   validate=true;
	}
	else{
		     validate=false;
		     var txt="经纬度格式不正确，经纬度必须为0-180范围内的小数，请重新输入经纬度."
		     if(isNaN(distance)||parseInt(distance)<0){
		    	txt="地标距离格式不正确，距离必须为不小于0的有效数字，请重新输入地标距离."
		     }
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
			 url:'landmark/modifyLandmark',
	         type:'post', //数据发送方式
	         dataType:'json', //接受数据格式
	         async: false,
	         data:{
	        	    "LandmarkId":landmarkId,
	        	    "landmarkName":$("#LandmarkName").val(),
	        	    "cableId":$("#cableName").val(),
	        	    "Longtitude":lng,
	        	    "type":$("#type").val(),
	        	    "distance":$("#distance").val(),
					"Latitude":lat,
	        	    "description":$("#landmarkDescription").val(),
	        	  },
	         success:function(json){
	        		    $(".sidebarDiv").html("");
				    	var txt="";
				    	if(json[0].status){
				    		txt+="修改成功."
				    	}
				    	else{
				    		txt+="修改失败，请重试";
				    	}
					     var option = {
									title: "提示",
									btn: parseInt("0001",2),
									onOk: function(){//点击确认的执行方法
										 refreashTable(json[0].cableId);
									}
								}
						  window.wxc.xcConfirm(txt, "info", option);
				      },
				    error:function(XMLHttpRequest,Error)
				      {
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
/**-----------------取消修改-----------------*/
$(".alterCancel").click(function(){
    $(".contentDiv").html("");
    $(".sidebarDiv").html("");
});
