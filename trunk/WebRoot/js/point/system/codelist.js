/**
 * 数据字典
 */
function codeListManage(){
	/**
	 * 数据字典
	 */
	var codeListReader = new Ext.data.JsonReader({
		totalProperty : "totalCount",
		root : "codeList"
	},[
		{name:"codeId"},//数据字典ID
		{name:"codeName"}//数据字典名称
	]);
	
	var codeListDataReader = new Ext.data.JsonReader({
		totalProperty : "totalCount",
		root : "codeListData"
	},[
		{name:"dataId"},//数据字典数据ID
		{name:"dataKey"},//数据字典数据key
		{name:"dataValue"},//数据字典值
		{name:"codeId"},//数据字典ID
		{name:"codeName"},//数据字典
		{name:"parentDataKey"},//父级数据字典
		{name:"parentDataValue"},//父级数据字典
		{name:"remark"}//备注
	]);
	/**
	 * 数据字典列表
	 */
	var proxyCodeUrl = path+"/codelist/codeList.action?method=codeList";
	/**
	 * 数据列表
	 */
	var proxyDataUrl = path+"/codelist/codeDataList.action?method=codeDataList";
	/**
	 * 数据标准存储
	 */
	var codeListStore = new Ext.data.Store({
		proxy:new Ext.data.HttpProxy({
			url:proxyCodeUrl
		}),
		reader:codeListReader
	});
	/**
	 * 数据标准数据存储
	 */
	var codeListDataStore = new Ext.data.GroupingStore({
		url:proxyDataUrl,
		reader:codeListDataReader,
		groupField:"codeId",
		sortInfo:{field: 'dataId', direction: "ASC"}
	});
	
	/**
	 * 数据标准分组显示
	 */
	var groupView = new Ext.grid.GroupingView({
		forceFit:true,
		showGroupName: false,
		enableNoGroups:false, // REQUIRED!
		hideGroupedColumn: false,
		groupTextTpl: '{text} ({[values.rs.length]} {text})'
	});
	
	/**
	 * 数据展现形式 - 多选框
	 */
	var codeSM = new Ext.grid.CheckboxSelectionModel();
	/**
	 * 数据字典展现形式
	 */
	var codeListCM = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(),codeSM,{
		dataIndex:"codeId",
		hidden:true,
		hideable:false//不允许将隐藏的字段显示出来
	},{
		header:"数据字典名称",
		dataIndex:"codeName",
		width:150
	}]);
	/**
	 * 数据字典数据展现形式
	 */
	var codeDataCM = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(),codeSM,{
		dataIndex:"dataId",
		hidden:true,
		hideable:false//不允许将隐藏的字段显示出来
	},{
		header:"数据标准",
		dataIndex:"codeName",
		width:150
	},{
		header:"数据标准编码",
		dataIndex:"dataKey",
		width:150
	},{
		header:"数据标准值",
		dataIndex:"dataValue",
		width:150
	},{
		header:"数据标准父级编码",
		dataIndex:"parentDataValue",
		width:150
	},{
		header:"数据标备注",
		dataIndex:"remark",
		width:150
	}]);
	
	/**
	 * 数据字典数据列表
	 */
	var codeListDataGrid = new Ext.grid.GridPanel({
		collapsible:true,//是否可以展开
		animCollapse:true,//展开时是否有动画效果
		autoScroll:true,
		width:Ext.get("codelist_div").getWidth(),
		height:Ext.get("codelist_div").getHeight()-20,
		loadMask:true,//载入遮罩动画（默认）
		frame:true,
		autoShow:true,		
		store:codeListDataStore,
		renderTo:"codelist_div",
		cm:codeDataCM,
		sm:codeSM,
		viewConfig:{forceFit:true},//若父容器的layout为fit，那么强制本grid充满该父容器
		split: true,
		view:groupView,
		bbar:new Ext.PagingToolbar({
			pageSize:50,//每页显示数
			store:codeListDataStore,
			displayInfo:true,
			displayMsg:"显示{0}-{1}条记录，共{2}条记录",
			nextText:"下一页",
			prevText:"上一页",
			emptyMsg:"无相关记录"
		}),
		tbar:[]
	});
	
	/**
	 * 按钮存储器，尚未执行查询
	 */
	var buttonRightStore = buttonRight();
	/**
	 * 执行权限按钮加载, 并且加载列表数据, 显示权限按钮
	 * see buttonRight.js
	 * loadButtonRight(buttonStore, mainDataStore, dataGrid, pageDiv, params)
	 */
	loadButtonRight(buttonRightStore, codeListDataStore, codeListDataGrid, "codelist_div");
	
	
}

/**
 * @author cdai
 * 数据字典管理
 */
Ext.onReady(function(){
	Ext.QuickTips.init();
	Ext.form.Field.prototype.msgTarget = 'under';
	codeListManage();
});