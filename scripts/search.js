
$(function(){
	$("#inputTxt").keyup(function(event){
		var myEvent = event || window.event;
		var keyCode = myEvent.keyCode; //获取键值
		//只有按键盘的字母键、退格、删除、空格、ESC等键才进行响应
		if(keyCode >= 65 && keyCode <= 90 || keyCode >= 48 && keyCode <= 57 || keyCode >= 96 && keyCode <= 111 || keyCode >= 186 && keyCode <= 222 || keyCode == 8 || keyCode == 46 || keyCode == 32 || keyCode == 13){
			//考虑到请求是百度的服务器及用户体验问题，故不需要考虑性能问题，没必要等几秒再请求，直接实时请求。如果延时请求，解开下面代码即可
            //                    clearTimeout(timeoutId);
            //                    timeoutId = setTimeout(function () {
            //                        timeoutId = FillUrls();
            //                    }, 500)
			jsonpxhr();
			if(currIndex !=-1) {
				currIndex = -1;
			} 
		}
		else if(keyCode == 38 || keyCode ==40) {
				if(keyCode == 38) {	//向上
					var autoNodes = $("#auto").children("div");
					if(currIndex != -1) {
						//如果原来存在高亮节点，则将背景色改称白色
	                    autoNodes.eq(currIndex).css("background-color", "white");
	                    currIndex--;
                	} else {
                		//如果修改索引值以后index变成-1，则将索引值指向最后一个元素
                		currIndex = autoNodes.length - 1;
               		}
               		autoNodes.eq(currIndex).css("background-color","#ebebeb");
              		//	取出当前选中的项 赋值到输入框内
              		var comText = autoNodes.eq(currIndex).text();
              		$("#inputTxt").val(comText);
				}
				if(keyCode == 40) { //向上
					var autoNodes = $("#auto").children("div");
					if(currIndex != -1) {
						//如果原来存在高亮节点，则将背景色改称白色
	                    autoNodes.eq(currIndex).css("background-color", "white");
	                    currIndex++;
                	} 
                	if(currIndex == autoNodes.length) {
                		//如果修改索引值为最后一个，则将索引值指向第一个元素
                		currIndex = 0;
               		}
               		autoNodes.eq(currIndex).css("background-color","#ebebeb");
              		//	取出当前选中的项 赋值到输入框内
              		var comText = autoNodes.eq(currIndex).text();
              		$("#inputTxt").val(comText);
				}
			} else if(keyCode == 13) { //回车

				if(highlightindex != -1) {
					var comText = $("#auto").hide().children('div').eq(currIndex).text();
					currIndex = -1;
					$("#inputTxt").val(comText);
				} else {
					$("auto").hide();
					//已经提交，让文本框失去焦点（再点提交或者按回车就不会触发keyup事件了）
                	$("#inputTxt").get(0).blur();
				}
			} else if(keyCode == 27) {	//按下Esc 隐藏弹出层
				if($("auto").is(":visible")) {
					$("#auto").hide();
				}
			}
	});
	//点击页面隐藏自动补全提示
	document.onclick = function(e) {
		var e = e ? e:window.event;
		var tar = e.srcElement || target;
		if( tar.id != "inputTxt") {
			if ($("#auto").is(":visible")) {
                $("#auto").css("display", "none");
            }
		} 
	};
});

//jsonp跨域访问
function jsonpxhr() {
    var _inputTxt = $("#inputTxt").val();
    var _data = {
        'wd': _inputTxt,
        'p': '3',
        'cb': 'getData',
        't': new Date().getMilliseconds().toString()
    };
    $.ajax({
        async: false,
        url: "https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su",
        type: "GET",
        dataType: 'jsonp',
        jsonp: 'callback',
        data: _data,
        timeout: 5000,
        success: function(json) {},
        error: function(xhr) {}
    });
}

//callback数据
function getData(strData) {
	autoDisplay(strData);
}

//自动获取弹出框
function autoDisplay(autoStr) {
	var info = autoStr.s; //获取到关键字提示
	var autoNode = $("#auto"); //缓存对象（弹出框）

	if(info.length === 0 ) {
		autoNode.hide();
		return false;
	}

	autoNode.empty(); //清空上次

	for(var i = 0,len = info.length;i<len; i++) {
		var wordNode = info[i]; //弹出框里的每一条内容
		var newDivNode = $("<div>").attr("id",i); //设置每一个节点id的值
		newDivNode.attr("style","font:14px/25px arial;height:25px;padding:0 8px;cursor: pointer;");
		newDivNode.html(wordNode).appendTo(autoNode); //追加到弹出框
		//鼠标移入高亮
		newDivNode.mouseover(function() {
			if(currIndex != -1) {
				autoNode.children("div").eq(currIndex).css("background-color","white");
			}
			//记录新的高亮节点索引
			currIndex = $(this).attr("id");
			$(this).css("background-color","#ebebeb");
		});
		//鼠标点击文字进入搜索框
		newDivNode.click(function(){
			//取出高亮节点的文本内容
			var comText = autoNode.hide().children("div").eq(currIndex).text();
			currIndex = -1;
			//高亮的内容进入到文本框
			$("#inputTxt").val(comText);
		});
		//如果有数据返回，弹出自动补全提示框
		if(info.length >0) {
			autoNode.show();
		} else {
			autoNode.hide();
			//弹出框隐藏的同时，高亮节点索引值也变成-1
			currIndex = -1;
		}
	}
//var timeoutId;延迟请求服务器
}
var currIndex = -1; //当前高亮的索引
