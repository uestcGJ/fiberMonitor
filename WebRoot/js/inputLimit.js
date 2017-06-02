/**
 * 对所有的输入框进行限制
 */
function valide(id){
		var th=document.getElementById(id);	
		var wrongCharacter = /[<> %;!$^&*)(&{}[]|\/]/g; //在[]中填写需要屏蔽的特殊字符
	    if(wrongCharacter.test(th.value)){
			$(th).val(th.value.replace(wrongCharacter,""));
	    }
	}
$(function(){	
	$("input[type='text']").attr('oninput','valide(this.id)');
	$("input[type='email']").attr('oninput','valide(this.id)');
	$("input[type='password']").attr('oninput','valide(this.id)');
	$("input[type='tel']").attr('oninput','valide(this.id)');
	$("textarea").attr('oninput',"valide(this.id)");
})
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
		