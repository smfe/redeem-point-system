/**
 * 按钮的权限管理
 */
function buttonRight(roleId, menuId, callbackFunction){
	/**
	 * 按钮信息解析器
	 */
	var buttonReader = new Ext.data.JsonReader({
		totalProperty:"totalCount",
		root:"buttons"
	},[
		{name:"buttonId"},//唯一id
		{name:"buttonName"},//按钮名称
		{name:"buttonText"},//按钮显示的文字
		{name:"menuId"},//菜单ID
		{name:"isShow"},//是否显示
		{name:"buttonIconCls"},//按钮样式
		{name:"handler"},//触发的事件
		{name:"buttonUrl"}//按钮路径
	]);
	/**
	 * 获取有权限的按钮路径
	 * @type 
	 */
	var proxyUrl = path+"/right/showButtons.action?method=buttonRight";
	/**
	 * 按钮信息存储器
	 */
	var buttonStore = new Ext.data.Store({
		proxy:new Ext.data.HttpProxy({
			url:proxyUrl
		}),
		reader:buttonReader
	});
	/**
	 * 读取数据，并且在完成之后，执行后调方法：callbackFunction
	 */
	/*
	buttonStore.load({
		params:{roleId:roleId,menuId:menuId},
		callback:function(records,options,success){
			if(typeof(callbackFunction) == "function"){
				callbackFunction(records,options,success);
			}
		}
	});
	*/
	return buttonStore;
}
/**
 * 读取权限按钮以及页面数据
 * @param {} buttonStore 权限按钮数据
 * @param {} mainDataStore 页面数据
 * @param {} dataGrid 页面展示
 * @param {} pageDiv 页面div
 * @param {} params mainDataStore加载时的参数列表
 */
function loadButtonRight(buttonStore, mainDataStore, dataGrid, pageDiv, params){
	if(!buttonStore || !dataGrid || !pageDiv){
		return;
	}
	var storeParams = {};
	if(!params){
		storeParams.start = 0;
		storeParams.limit = 50;
	}else{
		storeParams = params;
	}
	buttonStore.load({
		params:{roleId:userRole,menuId:currentMenuId},
		callback:function(buttonRecords,buttonOptions,buttonSuccess){
			//这里处理按钮的显示和隐藏
			//alert(buttonRecords.length);
			var tbar = dataGrid.getTopToolbar();
			if(!tbar){
				tbar = new Ext.Toolbar();
			}
			var hasButtonShow = false;
			for(var i=0;i<buttonRecords.length;i++){
				//是否显示
				var isShow = buttonRecords[i].get("isShow");
				//var button = "";
				if(isShow && isShow == "yes"){
					hasButtonShow = true;
					var buttonId = buttonRecords[i].get("buttonName");
					var buttonText = buttonRecords[i].get("buttonText");
					var buttonUrl = buttonRecords[i].get("buttonUrl");
					var buttonCss = buttonRecords[i].get("buttonIconCls");
					var buttonHandler = buttonRecords[i].get("handler");
					var button = new Ext.Button({
						text:buttonText,
						id:buttonId,
						iconCls:buttonCss,
						tooltip:buttonText,
						handlerFunction:buttonHandler,
						handlerUrl:buttonUrl,
						listeners:{
							"click":function(bt, e){
								var handlerFun = bt.handlerFunction;
								if(handlerFun && handlerFun!= "" && typeof (eval(""+handlerFun+"")) == "function"){
									eval(""+handlerFun+"('"+path + bt.handlerUrl+"')");
								}
							}
						}
					});
					tbar.add(button);
				}else{
					continue;
				}
				
				tbar.addSeparator();
			}
			if(!hasButtonShow){
				dataGrid.setHeight(Ext.get(pageDiv).getHeight());
				dataGrid.render();
			}
			if(mainDataStore){
				mainDataStore.load({
					params:storeParams,
					callback:function(records,options,success){
						//alert(proxyUrl);
					}
				});
			}
		}
	});
}