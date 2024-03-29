/**
 * 账目管理, 由ext系统移植而来
 */
//消费主类型
var accountMainTypeStore = parent.accountMainTypeStore;
accountMainTypeStore.load({params:{codeId:"4028098136ce7b900136ceb23e860001"}});
//消费次类型
var accountEnSecondTypeStore = parent.accountEnSecondTypeStore;

//账目明细数据解析器
var accountReader;
//账目明细临时数据
var accountTempDate = {"totalCount":0, "account":[], "success":true};
//警报点数据解析器
var alertReader;
//警报点临时数据
var alertTempDate = {"totalAlertCount":0, "alerts":[], "success":true};
//结算结果数据解析器
var balanceReader;
//结算结果临时数据
var balanceTempDate = {"totalCount":0, "balances":[], "success":true};
//查看权限数据解析器
var rightReader;
//查看权限临时数据
var rightTempDate = {"totalCount":0, "rights":[], "success":true};
/**
 * 账户信息
 */
var bankAccountReader;
//账户临时数据
var cardInfoTempDate = {"totalCount":0, "accountCard":[], "success":true};
//合计栏
var summary = new Ext.grid.GroupSummary(); 
//主数据分组显示
var accountGroupStore;
/**
 * 预算信息
 */
var budgetTempDate = {"totalCount":0, "budgetList":[], "success":true};

/**
 * 警报点数据存储
 */
var alertStore;
/**
 * 结算账目数据存储,分组显示
 */
var balanceGroupStore;
/**
 * 展示可允许查看账目信息的好友信息数据存储
 */
var rightStore;
/**
 * 账户信息
 */
var bankAccountStore;
/**
 * 备份文件信息
 */
var backFileStore;
/**
 * 备份文件信息解析
 */
var backFileReader;
/**
 * 备份设置解析
 */
var backSettingReader;
/**
 * 备份设置数据
 */
var backSettingStore;

function accountBalance(){
	
	//账目明细数据解析器
	if(!accountReader){
		accountReader = new Ext.data.JsonReader({
			totalProperty : "totalCount",
			root : "account"
		},[
			{name:"baseinfoid"},//唯一id
			{name:"baseyear"},//年份
			{name:"basemonth"},//月份
			{name:"basedate"},//具体日期
			{name:"accountenter"},//当天收入
			{name:"accountout"},//当天消费
			{name:"accountmargin"},//当天结算
			{name:"accountcard"},//卡号
			{name:"maintype"},//主类别
			{name:"setype"},//次类别
			{name:"remark"},//备注
			{name:"userid"},//备注
			{name:"username"},//备注
			{name:"deletetag"},//删除标志，1：已删除，0未删除
			{name:"margintag"},//结算标志：1：已结算，0未结算
			{name:"accountalert"},//日警告点
			{name:"accountalertmon"}//月报警点
		]);
	}
	
	//警报点数据解析器
	if(!alertReader){
		alertReader = new Ext.data.JsonReader({
			totalProperty:"totalAlertCount",
			root:"alerts"
		},[
			{name:"alertid"},
			{name:"alerttype"},//警报类型
			{name:"userid"},//用户id
			{name:"username"},//用户名
			{name:"alertvalue"},//警报值
			{name:"begindate"},//开始日期
			{name:"enddate"},//结束日期
			{name:"remark"}//备注
		]);
	}
	
	if(!backFileReader){
		backFileReader = new Ext.data.JsonReader({
			totalProperty:"totalCount",
			root:"backinfo"
		},[
			{name:"backDate"},//备份时间
			{name:"fileName"},//备份文件
			{name:"backFileId"},//备份文件id
			{name:"backType"},//备份类型
			{name:"username"}//用户名
		]);
	}
	
	if(!backSettingReader){
		backSettingReader = new Ext.data.JsonReader({
			totalProperty:"totalCount",
			root:"backsetting"
		},[
			{name:"id"},//备份时间
			{name:"backType"},//备份类型
			{name:"backValue"},
			{name:"cronValue"},//Cron表达式
			{name:"userName"},//用户名
			{name:"backTime"}//备份时间
		]);
	}
	
	//结算结果数据解析器
	if(!balanceReader){
		balanceReader = new Ext.data.JsonReader({
			totalProperty:"totalCount",
			root:"balances"
		},[
			{name:"balanceid"},
			{name:"begindate"},//结算范围起始日期
			{name:"enddate"},//结算范围终止日期
			{name:"balanceyear"},//结算年度
			{name:"balancemonth"},//结算月度
			{name:"balancetype"},//结算类型
			{name:"accountenter"},//结算期间总收入
			{name:"accountout"},//结算期间总支出
			{name:"accountmargin"},//差额
			{name:"alertvalue"},//年度结算警告点
			{name:"balance"},//盈利
			{name:"remark"},//备注
			{name:"userid"},//用户id
			{name:"username"}//用户名
		]);
	}
	
	//查看权限数据解析器
	if(!rightReader){
		rightReader = new Ext.data.JsonReader({
			totalProperty:"totalCount",
			root:"rights"
		},[
			{name:"balancerightid"},
			{name:"userid"},//用户id
			{name:"username"},//用户名
			{name:"allowuserid"},//用户名
			{name:"allowusername"}//用户名
		]);
	}
	
	/**
	 * 账户信息
	 */
	if(!bankAccountReader){
		bankAccountReader = new Ext.data.JsonReader({
			totalProperty:"totalCount",
			root:"bankAccountList"
		},[
			{name:"bankaccountid"},//主键id
			{name:"accountcardid"},//账户卡id
			{name:"username"},//用户名
			{name:"bankaccountname"},//账户名
			{name:"bankaccounttype"},//账户类型
			{name:"bankaccountsavings"}//账户存款
		]);
	}
	
	// define a custom summary function
	// 定义自定义结算函数
    Ext.grid.GroupSummary.Calculations['totalCost'] = function(v, record, field){
        return getRound(0 + parseFloat(parseFloat(v) + (parseFloat(record.data.accountenter) - parseFloat(record.data.accountout))),2);
    };
    Ext.grid.GroupSummary.Calculations['currentMonth'] = function(v, record, field){
        return dateFormat(record.data.basemonth,'Y-m',"Y 年 m 月")+" 小结";
    };
    Ext.grid.GroupSummary.Calculations['alertMonth'] = function(v, record, field){
        return record.data.accountalertmon;
    };
    Ext.grid.GroupSummary.Calculations['marginTag'] = function(v, record, field){
        return (record.data.margintag);
    };
    Ext.grid.GroupSummary.Calculations['balanceYear'] = function(v, record, field){
        return (record.data.balanceyear) +" 年度总结";
    };
    
    if(!backFileStore){
    	backFileStore = new Ext.data.Store({
    		proxy:new Ext.data.HttpProxy({
				url:path+"/systembackup/backupList.action?method=backupList"
			}),
			reader:backFileReader,
			baseParams:{userName:userName, backType:"accountBanlance"}
    	});
    }
    
    if(!backSettingStore){
    	backSettingStore = new Ext.data.Store({
    		proxy:new Ext.data.HttpProxy({
				url:path+"/systembackup/backupSettingList.action?method=getBackupSettingList"
			}),
			reader:backSettingReader,
			baseParams:{userName:userName}
    	});
    }
    
    //主数据分组显示
    if(!accountGroupStore){
    	accountGroupStore = new Ext.data.GroupingStore({
    		url:path+"/account_manage/accountList.action?method=accountList",
    		reader:accountReader,
    		groupField:"basemonth",
    		//groupOnSort:false,
    		baseParams:{userName:userName},
    		sortInfo:{field: 'basedate', direction: "ASC"},
    		listeners:{
    			loadexception:function(dataProxy, type, action, options, response, arg) { 
    				try{
    					if(action.status == "200"){
    						var o = Ext.util.JSON.decode(action.responseText);
    						if(o && !o.success){
    							Ext.Msg.alert('错误提示',o.msg, function(btn){
    								accountGroupStore.loadData(accountTempDate);
    							});
    						}
    					}else{
    						httpStatusCodeHandler(action.status);
    					}
    				}catch(e){
    					Ext.Msg.alert('错误提示',"系统错误！错误代码："+e);
    					accountGroupStore.loadData(accountTempDate);
    				}
    			}
    		}
    	});
    }
	
	if(!alertStore){
		alertStore = new Ext.data.Store({
			proxy:new Ext.data.HttpProxy({
				url:path+"balance/accoutalert.action?method=showAccoutAlert"
			}),
			reader:alertReader,
			baseParams:{username:userName}
		});
	}
	if(!balanceGroupStore){
		balanceGroupStore = new Ext.data.GroupingStore({
			url:path+"balance/balancelist.action?method=showBalanceInfo",
			reader:balanceReader,
			groupField:"balanceyear",
			//groupOnSort:false,
			baseParams:{username:userName},
			sortInfo:{field: 'balancemonth', direction: "ASC"}
		});
	}
	
	if(!rightStore){
		rightStore = new Ext.data.Store({
			proxy:new Ext.data.HttpProxy({
				url:path+"balance/balanceright.action?method=showRightInfo"
			}),
			reader:rightReader,
			baseParams:{username:userName}
		});
	}

	if(!bankAccountStore){
		bankAccountStore = new Ext.data.Store({
			proxy:new Ext.data.HttpProxy({
				url:path+"balance/balanceright.action?method=showRightInfo"
			}),
			reader:bankAccountReader,
			baseParams:{username:userName}
		});
	}
	
	//分组显示
	var groupView = new Ext.grid.GroupingView({
		forceFit:true,
		showGroupName: false,
		enableNoGroups:false, // REQUIRED!
		hideGroupedColumn: false,
		groupTextTpl: '{text} ({[values.rs.length]}  条记账信息)          本月设置消费报警值：<font color="red">{[(isNaN(parseFloat(values.rs[0].data.accountalertmon)) || parseFloat(values.rs[0].data.accountalertmon) < 0)?"未设置":values.rs[0].data.accountalertmon]}</font>（单位：人民币/元）'
	});
	//结算之后，以年度方式来分组显示
	var balanceGroupView = new Ext.grid.GroupingView({
		forceFit:true,
		showGroupName: false,
		enableNoGroups:false, // REQUIRED!
		hideGroupedColumn: false,
		groupTextTpl: '{text} 年度总结          本年度设置总支出警报值：<font color="red">{[(isNaN(parseFloat(values.rs[0].data.alertvalue)) || parseFloat(values.rs[0].data.alertvalue) < 0)"未设置":values.rs[0].data.alertvalue]}</font>（单位：人民币/元）'
	});
	//数据展现样式
	var accountSM = new Ext.grid.CheckboxSelectionModel();
	//展示样式
	var accountCM = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(),accountSM,{
		dataIndex:"baseinfoid",
		hidden:true,
		hideable:false//不允许将隐藏的字段显示出来
	},{
		header:"年度",
		dataIndex:"baseyear",
		width:150,
		hidden:true,
		hideable:false
	},{
		header:"月份",
		dataIndex:"basemonth",
		width:150,
		//renderer:showmonth,
		hidden:true,
		hideable:false
	},{
		header:"记账理由",
		groupable: false,
		dataIndex:"remark",
		renderer:edited,
		width:180
	},{
		header:"记账日期",
		groupable: false,
		dataIndex:"basedate",
		summaryType:"currentMonth",
		sortable:true,
		renderer:showdate,
		width:130
	},{
		header:"记账账户",
		groupable: false,
		dataIndex:"accountcard",
		sortable:true,
		renderer:showAccount,
		width:80
	},{
		header:"当天收入",
		groupable: false,
		dataIndex:"accountenter",
		renderer:showmoney,
		summaryType:"sum",
		width:80
	},{
		header:"当天消费",
		groupable: false,
		dataIndex:"accountout",
		summaryType:"sum",
		renderer:showoutmoney,
		//summaryRenderer:showmoney,
		width:80
	},{
		header:"当天结算",
		groupable: false,
		dataIndex:"accountmargin",
		summaryType:"totalCost",
		renderer:showmoney,
		width:80
	},{
		header:"结算标志",
		groupable: false,
		dataIndex:"margintag",
		summaryType:"marginTag",
		renderer:showmargintag,
		width:50
	},{
		dataIndex:"accountalert",
		summaryType:"average",
		hidden:true,
		hideable:false//不允许将隐藏的字段显示出来
	},{
		dataIndex:"accountalertmon",
		summaryType:"alertMonth",
		hidden:true,
		hideable:false,//不允许将隐藏的字段显示出来
		header:"aaaa"
	}]);
	//展示列表
	var accountGrid = new Ext.grid.GridPanel({
		id:"accountGrid",
		title:"账目详细信息（单位：人民币/元）",
		collapsible:false,//是否可以展开
		animCollapse:true,//展开时是否有动画效果
		autoScroll:true,
		width:Ext.get("account_div").getWidth(),
		height:Ext.get("account_div").getHeight()-20,
		//width:800,
		//height:500,
		//loadMask:new Ext.LoadMask(Ext.getBody(),{msg:"数据正在加载中，请稍候..."}),
		loadMask:true,//载入遮罩动画（默认）
		frame:true,
		autoShow:true,		
		store:accountGroupStore,
		cm:accountCM,
		sm:accountSM,
		renderTo:"account_div",
		viewConfig:{forceFit:true},//若父容器的layout为fit，那么强制本grid充满该父容器
		split: true,
		//columnLines:true,
		stripeRows: true,
		view:groupView,
		plugins: summary,
		listeners : {
			"rowclick":function(thiz, rowIndex, e){
				var record = accountGroupStore.getAt(rowIndex);
				var value = record.get("remark");
				if(!value || value.trim() == ""){
					var w = Ext.getCmp("showRemarkWindow");
					if(w) w.close();
				}
			}
		},
		bbar:new Ext.PagingToolbar({
			pageSize:50,//每页显示数
			store:accountGroupStore,
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
	loadButtonRight(buttonRightStore, accountGroupStore, accountGrid, "account_div", null, null, function(){
		// 检查用户是否存在账户列表, 若不存在, 系统自动创建一个默认账户
		checkAccountList();
	});
	
	/**
	 * 显示超链接
	 * @param value
	 * @param metadata
	 * @param record
	 * @param rowIndex
	 * @param colIndex
	 * @param store
	 * @return
	 */
	function edited(value,metadata,record,rowIndex,colIndex,store){
		return '<a href="javascript:void(0)" onclick=\'javascript:showRemark("'+rowIndex+'")\'>'+value+'</a>';
	}
	/**
	 * 显示记账理由窗口
	 */
	this.showRemark = function(rowIndex){
		var w = Ext.getCmp("showRemarkWindow");
		if(w) w.close();
		var record = accountGroupStore.getAt(rowIndex);
		var item = new Ext.form.TextArea({
			value:record.get("remark")
		});
		showAllWindow("showRemarkWindow", "记账理由", 300, 110, item, null, null, false);
	};
	/**
	 * 格式化日期
	 */
	function showdate(value,metadata,rocord,rowIndex,colIndex,store){
		if(value && value!=""){
			//引用unit.js中的方法
			return dateFormat(value,'Y-m-d H:i:s',"Y-m-d");
		}
	}
	/**
	 * 格式化账户信息
	 * @param value
	 * @param metadata
	 * @param rocord
	 * @param rowIndex
	 * @param colIndex
	 * @param store
	 * @returns
	 */
	function showAccount(value,metadata,rocord,rowIndex,colIndex,store){
		var v = getCodeNameFromStore(value, cardInfosStore, "accountId", "cardName");
		if(v == value){
			return "未知账户";
		}
		return v;
	}
	/**
	 * 格式化月份
	 */
	function showmonth(value,metadata,rocord,rowIndex,colIndex,store){
		//引用unit.js中的方法
		return dateFormat(value,'Y-m',"Y-M");
	}
	/**
	 * 格式化金钱
	 */
	function showmoney(value,metadata,record,rowIndex,colIndex,store){
		if(parseFloat(value)>0){
			return "￥ "+"<font color='red'>"+value+"</font>";
		}
		return "￥ "+ value;
	}
	/**
	 * 格式化金额，并且比较年度总消费与年度警告，超出则已红色警告
	 * @param {} value
	 * @param {} metadata
	 * @param {} record
	 * @param {} rowIndex
	 * @param {} colIndex
	 * @param {} store
	 * @return {}
	 */
	function showalertmoney(value,metadata,record,rowIndex,colIndex,store){
		var alertvalue = "";
		var accountenter = "";
		if(parseFloat(value)<0){
			metadata.attr = "ext:qtip='今日已经入不敷出啦，注意节约哦！'";
			return "￥ "+"<font color='red'>"+value+"</font>";
		}
		try{
			accountenter = record.get("accountenter");
			alertvalue = record.get("alertvalue");
			if(accountenter){
				if(parseFloat(value)>=parseFloat(accountenter)){
					metadata.attr = "ext:qtip='"+record.data.balanceyear+"年"+record.data.balancemonth+" 月消费过度啦，注意节约哦！'";
					return "￥ "+"<font color='red'>"+value+"</font>";
				}
			}
			/*
			if(parseFloat(value)>=parseFloat(alertvalue)){
				metadata.attr = "ext:qtip='"+record.get("balanceyear")+" 年消费过度啦，注意节约哦！'";
				return "￥ "+"<font color='red'>"+value+"</font>";
			}
			*/
		}catch(e){
			alertvalue = record.data.alertvalue;
			accountenter = record.data.accountenter;
			if(alertvalue){
				if(parseFloat(value)>=parseFloat(alertvalue)){
					metadata.attr = "ext:qtip='"+record.data.balanceyear+" 年消费过度啦，注意节约哦！'";
					return "￥ "+"<font color='red'>"+value+"</font>";
				}
			}
			if(accountenter){
				if(parseFloat(value)>=parseFloat(accountenter)){
					metadata.attr = "ext:qtip='"+record.data.balanceyear+" 年消费过度啦，注意节约哦！'";
					return "￥ "+"<font color='red'>"+value+"</font>";
				}
			}
		}
		return "￥ "+ value;
	}
	
	/**
	 * 格式化金额，小于0的将以红色展示
	 * @param {} value
	 * @param {} metadata
	 * @param {} record
	 * @param {} rowIndex
	 * @param {} colIndex
	 * @param {} store
	 */
	function showresultmoney(value,metadata,record,rowIndex,colIndex,store){
		if(parseFloat(value)<0){
			metadata.attr = "ext:qtip='出现红色财政赤字啦，注意节约哦！'";
			return "￥ "+"<font color='red'>"+value+"</font>";
		}
		return "￥ "+ value;
	}
	
	/**
	 * 格式化金钱，并且判断是否超出警告点
	 */
	function showoutmoney(value,metadata,record,rowIndex,colIndex,store){
		var alertvalue = "";
		try{
			alertvalue = record.get("accountalert");
			metadata.attr = "ext:qtip='今日设置消费报警值：<br><font color=red>"+(isNaN(parseFloat(alertvalue))?"未设置":parseFloat(alertvalue))+"</font>  （单位：人民币/元）'";
			if(parseFloat(value)>=parseFloat(alertvalue)){
				return "￥"+"<font color='red'>"+value+"</font>";
			}
			return "￥"+value;
		}catch(e){
			var currentMonBalance = record.data.basedate;
			currentMonBalance = currentMonBalance.split(" ");
			var currentMon = currentMonBalance[0] + "-" +currentMonBalance[2];
			if(parseFloat(value)>=parseFloat(record.data.accountalertmon)){
				return "￥"+"<font color='red'>"+value+"</font>";
			}
			return "￥"+value;
		}
	}
	
	/**
	 * 格式化结算标志
	 */
	function showmargintag(value,metadata,record,rowIndex,colIndex,store){
		if(value=="1"){
			return "已结算";
		}else{
			return "<font color='red'>未结算</font>";
		}
	}
	/**
	 * 格式化警报类型
	 * @param {} value ：要被格式化的值
	 * @param {} metadata
	 * @param {} rocord ：该行的数据
	 * @param {} rowIndex：第几行
	 * @param {} colIndex：第几列
	 * @param {} store：数据存储
	 */
	function showalerttype(value,metadata,rocord,rowIndex,colIndex,store){
		return getCodeNameFromStore(value,alertTypeStore,"codeid","codename");
	}
	
	//==========================按钮功能区==========================================
	/**
	 * 新增按钮
	 */
	this.addAccountInfo = function(url){
		var accountInForm = getInAccountForm(url, "今日收入", false, false);
		var accountOutForm = getOutAccountForm(url, "今日支出", false, false);
		var accountForm = [accountOutForm, accountInForm];
		var tab = getAccountTabPanel(accountForm);
		
		var buttons = [{
			text:"保存",
			handler:function(){
				var formId = tab.getActiveTab().getItemId();
				var form = Ext.getCmp(formId);
				
				var d = new Date(accountOutForm.form.findField("account.basedate").getValue());
				var v = accountOutForm.form.findField("account.accountout").getValue() + "元";
				var c = accountOutForm.form.findField("account.accountcard");
				var t = accountOutForm.form.findField("account.maintype");
				var s = accountOutForm.form.findField("account.setype");
				accountOutForm.form.findField("account.remark").setValue("消费时间："+d.format("Y-m-d") + "\n消费金额：" + v + "\n消费账户：" + c.el.dom.value + "\n消费主类别：" + t.el.dom.value + "\n消费次类别："+s.el.dom.value);
				
				var d1 = new Date(accountInForm.form.findField("account.basedate").getValue());
				var v1 = accountInForm.form.findField("account.accountenter").getValue() + "元";
				var c1 = accountInForm.form.findField("account.accountcard");
				var t1 = accountInForm.form.findField("account.maintype");
				var s1 = accountInForm.form.findField("account.setype");
				accountInForm.form.findField("account.remark").setValue("收入时间："+d1.format("Y-m-d") + "\n收入金额：" + v1 + "\n收入账户：" + c1.el.dom.value + "\n收入主类别：" + t1.el.dom.value + "\n收入次类别："+s1.el.dom.value);
				
				if(form && form.form.isValid()){
					saveAccountForm(form, "addAccount");
				}
			}
		},{
			text:"关闭窗口",
			handler:function(){
				var w = Ext.getCmp("addAccount");
				if(w) w.close();
			}
		}];
		showAccountWindow("addAccount","新增家庭账目信息", 500, 350, tab, null, buttons);
	};
	/**
	 * 修改按钮
	 */
	this.editAccountInfo = function(url){
		var gridSelection = accountGrid.getSelectionModel().getSelections();
		if(gridSelection.length != 1){
            showSystemMsg("系统提示", "请选择一条账目信息");
            return false;
        }
		var accountenter = gridSelection[0].get("gridSelection");
		var accountout = gridSelection[0].get("accountout");
		
		var accountInForm = getInAccountForm(url, "今日收入", false, false);
		var accountOutForm = getOutAccountForm(url, "今日支出", false, false);
		var accountForm;
		var mask = "";
		if((accountenter == null || accountenter == "" || parseFloat(accountenter) <= 0)
				&& (accountout != null && accountout != "" && parseFloat(accountout) > 0)){
			//该账目收入为空，则记录的是支出
			accountForm = accountOutForm;
			mask = "out";
		}else{
			//该账目收入不为空，则记录的是收入
			accountForm = accountInForm;
			mask = "in";
		}
		
		var tab = getAccountTabPanel(accountForm);
		
		var buttons = [{
			text:"保存",
			handler:function(){
				var formId = tab.getActiveTab().getItemId();
				var form = Ext.getCmp(formId);
				
				var d = new Date(accountOutForm.form.findField("account.basedate").getValue());
				var v = accountOutForm.form.findField("account.accountout").getValue() + "元";
				var c = accountOutForm.form.findField("account.accountcard");
				var t = accountOutForm.form.findField("account.maintype");
				var s = accountOutForm.form.findField("account.setype");
				accountOutForm.form.findField("account.remark").setValue("消费时间："+d.format("Y-m-d") + "\n消费金额：" + v + "\n消费账户：" + c.el.dom.value + "\n消费主类别：" + t.el.dom.value + "\n消费次类别："+s.el.dom.value);
				
				var d1 = new Date(accountInForm.form.findField("account.basedate").getValue());
				var v1 = accountInForm.form.findField("account.accountenter").getValue() + "元";
				var c1 = accountInForm.form.findField("account.accountcard");
				var t1 = accountInForm.form.findField("account.maintype");
				var s1 = accountInForm.form.findField("account.setype");
				accountInForm.form.findField("account.remark").setValue("收入时间："+d1.format("Y-m-d") + "\n收入金额：" + v1 + "\n收入账户：" + c1.el.dom.value + "\n收入主类别：" + t1.el.dom.value + "\n收入次类别："+s1.el.dom.value);
				
				
				if(form && form.form.isValid()){
					saveAccountForm(form, "editAccount");
				}
			}
		},{
			text:"关闭窗口",
			handler:function(){
				var w = Ext.getCmp("editAccount");
				if(w) w.close();
			}
		}];
		showAccountWindow("editAccount","修改家庭账目信息", 500, 350, tab, null, buttons);
		
		//根据主类别加载子类别
		accountEnSecondTypeStore.load({params:{codeId:"4028098136ce7b900136ceb23e860001",parentCodeId:gridSelection[0].get("maintype")}, callback:function(){
			if(mask == "out"){
				accountOutForm.form.findField("account.basedate").setValue(dateFormat(gridSelection[0].get("basedate")));
				accountOutForm.form.findField("account.baseyear").setValue(gridSelection[0].get("baseyear"));
				accountOutForm.form.findField("account.basemonth").setValue(gridSelection[0].get("basemonth"));
				accountOutForm.form.findField("account.baseinfoid").setValue(gridSelection[0].get("baseinfoid"));
				accountOutForm.form.findField("account.margintag").setValue(gridSelection[0].get("margintag"));
				accountOutForm.form.findField("account.username").setValue(gridSelection[0].get("username"));
				accountOutForm.form.findField("account.accountout").setValue(gridSelection[0].get("accountout"));
				accountOutForm.form.findField("account.accountcard").setValue(gridSelection[0].get("accountcard"));
				accountOutForm.form.findField("account.maintype").setValue(gridSelection[0].get("maintype"));
				accountOutForm.form.findField("account.setype").setValue(gridSelection[0].get("setype"));
				accountOutForm.form.findField("account.remark").setValue(gridSelection[0].get("remark"));
			}else if(mask == "in"){
				accountInForm.form.findField("account.basedate").setValue(dateFormat(gridSelection[0].get("basedate")));
				accountInForm.form.findField("account.baseyear").setValue(gridSelection[0].get("baseyear"));
				accountInForm.form.findField("account.basemonth").setValue(gridSelection[0].get("basemonth"));
				accountInForm.form.findField("account.baseinfoid").setValue(gridSelection[0].get("baseinfoid"));
				accountInForm.form.findField("account.margintag").setValue(gridSelection[0].get("margintag"));
				accountInForm.form.findField("account.username").setValue(gridSelection[0].get("username"));
				accountInForm.form.findField("account.accountenter").setValue(gridSelection[0].get("accountenter"));
				accountInForm.form.findField("account.accountcard").setValue(gridSelection[0].get("accountcard"));
				accountInForm.form.findField("account.maintype").setValue(gridSelection[0].get("maintype"));
				accountInForm.form.findField("account.setype").setValue(gridSelection[0].get("setype"));
				accountInForm.form.findField("account.remark").setValue(gridSelection[0].get("remark"));
			}
		}});
	};
	/**
	 * 删除按钮
	 */
	this.deleteAccountInfo = function(url){
		var gridSelection = accountGrid.getSelectionModel().getSelections();
		if(gridSelection.length < 1){
            showSystemMsg("系统提示", "请至少选择一条账目信息");
            return false;
        }
		
		var accountIdArray = new Array();
		for(var i=0; i< gridSelection.length; i++){
			accountIdArray.push(gridSelection[i].get("baseinfoid"));
		}
		var accountIds = accountIdArray.join(",");
		Ext.Msg.confirm("系统提示","请确认是否删除所选账目信息？",function(btn){
			if(btn == "ok" || btn == "yes"){
				Ext.MessageBox.show({
					msg: '正在删除数据, 请稍侯...',
					progressText: '正在删除数据',
					width:300,
					wait:true,
					waitConfig: {interval:200},
					icon:Ext.Msg.INFO
				});
				Ext.Ajax.request({
	    			params:{balanceListId:accountIds},
	    			url:url,
	    			success:function(response,options){
		    			Ext.MessageBox.hide();
		    			try{
		    				var msg = Ext.util.JSON.decode(response.responseText);
		    				if(msg && msg.success){
		    					showSystemMsg("提示信息",msg.msg,function(){
		    						accountGroupStore.reload();
			    				});
		    				}else{
		    					Ext.Msg.alert("提示信息",msg.msg);
		    				}
		    			}catch(e){
		    				Ext.Msg.alert("提示信息","错误代码："+e);
		    			}
			     	},failure:function(response,options){
			     		Ext.Msg.hide();
			     		try{
			     			var re = Ext.util.JSON.decode(response.responseText);
					    	Ext.Msg.alert("提示信息",re.msg);
			     		}catch(e){
			     			Ext.Msg.alert("提示信息","错误代码："+e);
			     		}
				    	return;
			     	}
	    		});
			}
		});
		
	};
	/**
	 * 我的账号管理
	 */
	this.myAccountInfoManage = function(url){
		var myAccount = new accountInfoGrid(url);
		showAccountWindow("myAccountInfo","我的账户信息", 600, 350, myAccount.getCardInfoGrid(), null, null);
	};
	/**
	 * 账目预算
	 */
	this.accountBudget = function(url){
		var budget = new accountBudgetManage(url);
		showAccountWindow("budgetWindow", "我的账目预算", 600, 350, budget.getBudgetGrid(), null, null);
	};
	/**
	 * 备份同步
	 */
	this.accountBackup = function(url){
		var uploadForm = getRestoreForm(url);
		var restoreForm = getBackupForm(url);
		var setForm = setBackupForm(url);
		var form = [uploadForm, restoreForm, setForm];
		var tab = getAccountTabPanel(form);
		showAllWindow("accountBackupWindow", "账目备份同步", 600, 250, tab, null, null, true);
		backSettingStore.load({
			callback:function(records, opstions, success){
				if(records && records.length > 0){
					var backType = records[0].get("backType");
					var backValue = records[0].get("backValue");
					var backTime = records[0].get("backTime");
					setForm.form.findField("id").setValue(records[0].get("id"));
					setForm.form.findField("backType").setValue(backType);
					setForm.form.findField("backValue").setValue(backValue);
					setForm.form.findField("backTime").setValue(backTime);
					
					if(backType == "day"){
						Ext.getCmp("backDay").setValue(backValue);
						Ext.getCmp("backTime1").setValue(backTime);
						
						Ext.getCmp("dataId1").setValue(true);
						Ext.getCmp("dataId2").setValue(false);
						Ext.getCmp("dataId3").setValue(false);
						
						Ext.getCmp("backDay").setDisabled(false);
						Ext.getCmp("backWeek").setDisabled(true);
						Ext.getCmp("backMonth").setDisabled(true);
						
						Ext.getCmp("backTime1").setDisabled(false);
						Ext.getCmp("backTime2").setDisabled(true);
						Ext.getCmp("backTime3").setDisabled(true);
					}else if(backType == "week"){
						Ext.getCmp("backWeek").setValue(backValue);
						Ext.getCmp("backTime2").setValue(backTime);
						
						Ext.getCmp("dataId1").setValue(false);
						Ext.getCmp("dataId2").setValue(true);
						Ext.getCmp("dataId3").setValue(false);
						
						Ext.getCmp("backDay").setDisabled(true);
						Ext.getCmp("backWeek").setDisabled(false);
						Ext.getCmp("backMonth").setDisabled(true);
						
						Ext.getCmp("backTime1").setDisabled(true);
						Ext.getCmp("backTime2").setDisabled(false);
						Ext.getCmp("backTime3").setDisabled(true);
					}else if(backType = "month"){
						Ext.getCmp("backMonth").setValue(backValue);
						Ext.getCmp("backTime3").setValue(backTime);
						
						Ext.getCmp("dataId1").setValue(false);
						Ext.getCmp("dataId2").setValue(false);
						Ext.getCmp("dataId3").setValue(true);
						
						Ext.getCmp("backDay").setDisabled(true);
						Ext.getCmp("backWeek").setDisabled(true);
						Ext.getCmp("backMonth").setDisabled(false);
						
						Ext.getCmp("backTime1").setDisabled(true);
						Ext.getCmp("backTime2").setDisabled(true);
						Ext.getCmp("backTime3").setDisabled(false);
					}
					
				}
			}
		});
	};
	//========================通用功能区==========================================
	function getRestoreForm(uri){
		var isTrue = false;
		var importForm = new Ext.form.FormPanel({
			url:uri,
			title:"账目信息恢复",
			frame: true,
			labelAlign: 'right',
			labelWidth:70,
			autoScroll:false,
			waitMsgTarget:true,
			viewConfig:{forceFit:true},
			fileUpload: true,
			items:[{
	        	xtype:"fieldset",
	        	height:145,
	        	title:"请选择账目文件上传",
	        	items:[{
					xtype: 'fileuploadfield',
		            name: 'accountFile',
		            width:250,
		            emptyText: '请选择您要上传的账目文件',
		            fieldLabel: '文件',
		            allowBlank:false,
		            buttonCfg: {
		                text: '选择文件'
		            },
		            validator : function(){
		            	return isTrue;
		            },
		            listeners:{
		            	"fileselected":function(fb,v){
		            		var extName = v.substr(v.lastIndexOf(".")+1);
		            		if(extName!="xls" && extName != "xlsx"){
		            			Ext.Msg.alert("提示信息","请您选择Excel文件！");
		            			isTrue = false;
		            		}else{
		            			isTrue = true;
		            		}
		            	}
		            }
				}]
	        }],
			bbar:["->","-",
			   new Ext.Button({
				   text:"上传账目文件",
				   iconCls :"table_save",
				   handler:function(){
					   if(importForm && importForm.form.isValid()){
						   
					   }
				   }
			   }),
			   "-",
			   new Ext.Button({
				   text:"取消",
				   iconCls:"table",
				   handler:function(){
					   var w = Ext.getCmp("accountBackupWindow");
					   if(w) w.close();
				   }
			   }),
			]
		});
		return importForm;
	}
	/**
	 * 下载备份文件
	 * @param uri
	 * @returns {Ext.form.FormPanel}
	 */
	function getBackupForm(uri){
		var url = path + "/systembackup/backupDownload.action?method=backupDownload";
		var sysForm = new Ext.form.FormPanel({
			//url:uri,
			onSubmit:Ext.emptyFn,
			submit:function(){
				this.getEl().dom.action = url;
				this.getEl().dom.target = "targetFram";
				this.getEl().dom.submit();
			},
			title:"账目信息备份",
			frame: true,
			labelAlign: 'right',
			labelWidth:70,
			autoScroll:false,
			waitMsgTarget:true,
			viewConfig:{forceFit:true},
			layout:"fit",
	        items:[new Ext.grid.GridPanel({
        		collapsible:true,//是否可以展开
        		animCollapse:true,//展开时是否有动画效果
        		autoScroll:true,
        		loadMask:true,//载入遮罩动画（默认）
        		frame:true,
        		autoShow:true,		
        		store:backFileStore,
        		columns:[{
        			header:"备份时间", dataIndex:"backDate"
        		},{
        			header:"文件名", dataIndex:"fileName"
        		},{
        			dataIndex:"backFileId", hidden :true, hideable :false
        		}],
        		sm:new Ext.grid.RowSelectionModel({singleSelect:true}),
        		viewConfig:{forceFit:true},//若父容器的layout为fit，那么强制本grid充满该父容器
        		split: true,
        		//columnLines:true,
        		stripeRows: true,
        		bbar:new Ext.PagingToolbar({
        			pageSize:50,//每页显示数
        			store:backFileStore,
        			displayInfo:true,
        			displayMsg:"显示{0}-{1}条记录，共{2}条记录",
        			nextText:"下一页",
        			prevText:"上一页",
        			emptyMsg:"无相关记录"
        		})
        	}),{
	        	xtype:"hidden",
	        	name:"backFileId"
	        }],
			bbar:["->","-",
			   new Ext.Button({
				   text:"下载备份文件",
				   iconCls :"table_save",
				   handler:function(){
					   var grid = sysForm.getComponent(0);
					   var selectModel = grid.getSelectionModel();
					   var selections = selectModel.getSelections();
					   if(!selections || selections.length != 1){
						   showSystemMsg("系统提示", "请选择一个备份文件下载！");
						   return;
					   }
					   //parent.downloadBackFile(selections[0].get("backFileId"));
					   sysForm.form.findField("backFileId").setValue(selections[0].get("backFileId"));
					   sysForm.getForm().submit();
				   }
			   }),
			   "-",
			   new Ext.Button({
				   text:"取消",
				   iconCls:"table",
				   handler:function(){
					   var w = Ext.getCmp("accountBackupWindow");
					   if(w) w.close();
				   }
			   }),
			]
		});
		backFileStore.load({params:{start:0, limit:50}});
		return sysForm;
	}
	/**
	 * 账目信息备份恢复设置
	 * @param uri
	 * @returns {Ext.form.FormPanel}
	 */
	function setBackupForm(uri){
		var url = path + "/systembackup/backupSetting.action?method=systemBackupSetting";
		var setForm = new Ext.form.FormPanel({
			url:url,
			title:"账目信息备份恢复设置",
			frame: true,
			labelAlign: 'right',
			labelWidth:60,
			autoScroll:false,
			waitMsgTarget:true,
			viewConfig:{forceFit:true},
	        items:[{
	        	xtype:"fieldset",
	        	height:145,
	        	title:"请设置账目备份时间",
	        	items:[{
	        		layout:"column",
	        		items:[{
						layout:"form",
						columnWidth:0.2,
						items:[{
							xtype:"radio", fieldLabel: '按天备份', name: 'dataId',id:"dataId1",inputValue :"day", checked:true,
							listeners :{
								"check":function(thiz, checked){
									if(checked){
										Ext.getCmp("backDay").setDisabled(false);
										Ext.getCmp("backWeek").setDisabled(true);
										Ext.getCmp("backMonth").setDisabled(true);
										
										Ext.getCmp("backTime1").setDisabled(false);
										Ext.getCmp("backTime2").setDisabled(true);
										Ext.getCmp("backTime3").setDisabled(true);
									}
								}
							}
						}]
					},{
						layout:"form",
						columnWidth:0.5,
						labelWidth:140,
						items:[{
							xtype:"combo", fieldLabel: '请选择每几天备份一次', name: 'backDay', id:"backDay",
							store:new Ext.data.SimpleStore({
								fields :["key","value"],
								data :[["每一天","1"],["每三天","3"],["每五天","5"],["每十天","10"],["每二十天","20"],["每三十天","30"],["每六十天","60"],["每一百天","100"]]
							}),
							valueField:"value",//将codeid设置为传递给后台的值
							displayField:"key",
							hiddenName:"value",//这个值就是传递给后台获取的值
							mode: "local",
							anchor:"90%",
							triggerAction:"all",
							allowBlank:false,
							editable:false,
							listeners : {
								"change":function(thiz, newValue, oldValue){
									setForm.form.findField("backType").setValue("day");
									setForm.form.findField("backValue").setValue(newValue);
								}
							}
						}]
					},{
						layout:"form",
						columnWidth:0.3,
						labelWidth:80,
						items:[{
							xtype:"timefield",
							name:"backTime1",
							id:"backTime1",
							allowBlank:false,
							width:60,
							anchor:"87%",
							fieldLabel:"备份触发时间",
							format :"H:i",
							listeners :{
								"change":function(thiz, newValue, oldValue){
									setForm.form.findField("backTime").setValue(newValue);
								}
							}
						}]
					}]
	        	},{
	        		layout:"column",
	        		items:[{
						layout:"form",
						columnWidth:0.2,
						items:[{
							xtype:"radio", fieldLabel: '按周备份', name: 'dataId',id:"dataId2",inputValue :"week",
							listeners :{
								"check":function(thiz, checked){
									if(checked){
										Ext.getCmp("backDay").setDisabled(true);
										Ext.getCmp("backWeek").setDisabled(false);
										Ext.getCmp("backMonth").setDisabled(true);
										
										Ext.getCmp("backTime1").setDisabled(true);
										Ext.getCmp("backTime2").setDisabled(false);
										Ext.getCmp("backTime3").setDisabled(true);
									}
								}
							}
						}]
					},{
						layout:"form",
						columnWidth:0.5,
						labelWidth:140,
						items:[{
							xtype:"combo", fieldLabel: '请选择每周几备份一次', name: 'backWeek', id:"backWeek",
							store:new Ext.data.SimpleStore({
								fields :["key","value"],
								data :[["周一","MON"],["周二","TUE"],["周三","WED"],["周四","THU"],["周五","FRI"],["周六","SAT"],["周七","SUN"]]
							}),
							valueField:"value",//将codeid设置为传递给后台的值
							displayField:"key",
							hiddenName:"value",//这个值就是传递给后台获取的值
							mode: "local",
							anchor:"90%",
							disabled:true,
							allowBlank:false,
							triggerAction:"all",
							editable:false,
							listeners : {
								"change":function(thiz, newValue, oldValue){
									setForm.form.findField("backType").setValue("week");
									setForm.form.findField("backValue").setValue(newValue);
								}
							}
						}]
					},{
						layout:"form",
						columnWidth:0.3,
						labelWidth:80,
						items:[{
							xtype:"timefield",
							name:"backTime2",
							id:"backTime2",
							disabled:true,
							allowBlank:false,
							width:60,
							anchor:"87%",
							fieldLabel:"备份触发时间",
							format :"H:i",
							listeners :{
								"change":function(thiz, newValue, oldValue){
									setForm.form.findField("backTime").setValue(newValue);
								}
							}
						}]
					}]
	        	},{
	        		layout:"column",
					items:[{
						layout:"form",
						columnWidth:0.2,
						items:[{
							xtype:"radio", fieldLabel: '按月备份', name: 'dataId',id:"dataId3",inputValue :"month",
							listeners :{
								"check":function(thiz, checked){
									if(checked){
										Ext.getCmp("backDay").setDisabled(true);
										Ext.getCmp("backWeek").setDisabled(true);
										Ext.getCmp("backMonth").setDisabled(false);
										
										Ext.getCmp("backTime1").setDisabled(true);
										Ext.getCmp("backTime2").setDisabled(true);
										Ext.getCmp("backTime3").setDisabled(false);
									}
								}
							}
						}]
					},{
						layout:"form",
						columnWidth:0.5,
						labelWidth:140,
						items:[{
							xtype:"combo", fieldLabel: '请选择每月几日备份一次', name: 'backMonth', id:"backMonth",
							store:new Ext.data.SimpleStore({
								fields :["key","value"],
								data :[["每月一日","1"],["每月二日","2"],["每月三日","3"],["每月十日","10"],["每月十五日","15"],["每月二十五日","25"],["每月最后一天","end"]]
							}),
							valueField:"value",//将codeid设置为传递给后台的值
							displayField:"key",
							hiddenName:"value",//这个值就是传递给后台获取的值
							mode: "local",
							anchor:"90%",
							allowBlank:false,
							disabled:true,
							triggerAction:"all",
							editable:false,
							listeners : {
								"change":function(thiz, newValue, oldValue){
									setForm.form.findField("backType").setValue("month");
									setForm.form.findField("backValue").setValue(newValue);
								}
							}
						}]
					},{
						layout:"form",
						columnWidth:0.3,
						labelWidth:80,
						items:[{
							xtype:"timefield",
							name:"backTime3",
							id:"backTime3",
							anchor:"87%",
							allowBlank:false,
							disabled:true,
							width:60,
							fieldLabel:"备份触发时间",
							format :"H:i",
							listeners :{
								"change":function(thiz, newValue, oldValue){
									setForm.form.findField("backTime").setValue(newValue);
								}
							}
						}]
					}]
	        	},{
	        		xtype:"hidden",
	        		name:"backType"
	        	},{
	        		xtype:"hidden",
	        		name:"backValue"
	        	},{
	        		xtype:"hidden",
	        		name:"userName",
	        		value:userName
	        	},{
	        		xtype:"hidden",
	        		name:"backTime",
	        	},{
	        		xtype:"hidden",
	        		name:"id"
	        	}]
	        }],
			bbar:["->","-",
			   new Ext.Button({
				   text:"保存设置",
				   iconCls :"table_save",
				   handler:function(){
					   if(setForm && setForm.form.isValid()){
						   saveBackupSetting("accountBackupWindow", setForm);
					   }
				   }
			   }),
			   "-",
			   new Ext.Button({
				   text:"取消",
				   iconCls:"table",
				   handler:function(){
					   var w = Ext.getCmp("accountBackupWindow");
					   if(w) w.close();
				   }
			   }),
			]
		});
		return setForm;
	}
	
	/**
	 * 获取账目信息tab面板
	 */
	function getAccountTabPanel(items){
		var tab = new Ext.TabPanel({
			activeTab: 0,
			deferredRender:false,
			layoutOnTabChange:true,//当activeTab改变的时候，执行doLayout
			items:items
		});
		return tab;
	}
	/**
	 * 获取支出账目信息的表单
	 * @param url
	 * @param isNull
	 * @param readOnly
	 */
	function getOutAccountForm(url, title, isNull, readOnly){
		var accountOutForm = new Ext.form.FormPanel({
			url:url,
			frame: true,
			labelAlign: 'right',
			title:title,
			labelWidth:70,
			autoScroll:false,
			waitMsgTarget:true,
			viewConfig:{forceFit:true},
			items:[{
				layout:"column",
				border:false,
				labelSeparator:'：',
				items:[{
					layout:"form",
					columnWidth:0.5,
					height:50,
					items:[{
						xtype: 'datefield',
						name:"account.basedate",
						anchor:"90%",
						fieldLabel:"记账时间",
						format:"Y-m-d",
						readOnly:readOnly,
						value:new Date(),
						allowBlank:isNull
					},{
						xtype:"hidden",
						name:"account.baseyear"
					},{
						xtype:"hidden",
						name:"account.basemonth"
					},{
						xtype:"hidden",
						name:"account.baseinfoid"
					},{
						xtype:"hidden",
						name:"account.margintag",
						value:'0'
					},{
						xtype:"hidden",
						name:"account.username",
						value:userName
					}]
				}]
			},{
				layout : 'column',
				columns : 2,
				items:[{
					columnWidth : .5,
					layout : 'form',
					height:50,
					border : false,
					items:[{
						xtype: 'numberfield',
						name:"account.accountout",
						anchor:"90%",
						fieldLabel:"支出金额",
						readOnly:readOnly,
						value:0,
						allowBlank:isNull,
						listeners:{
							"blur":function(thiz){
								var d = new Date(accountOutForm.form.findField("account.basedate").getValue());
								accountOutForm.form.findField("account.remark").setValue("消费时间："+d.format("Y-m-d") + "\n消费金额：" + thiz.value + "元");
							}
						}
					}]
				},{
					columnWidth : .5,
					layout : 'form',
					border : false,
					height:50,
					items:[{
						xtype: 'combo',
						name:"account.accountcard",
						store:cardInfosStore,
						anchor:"90%",
						fieldLabel:"账户",
						editable:false,//false：不可编辑
						triggerAction:"all",//避免选定了一个值之后，再选的时候只显示刚刚选择的那个值
						valueField:"accountId",//将codeid设置为传递给后台的值
						displayField:"cardName",
						hiddenName:"account.accountcard",//这个值就是传递给后台获取的值
						mode: "local",
						allowBlank:isNull,
						listeners:{
							"blur":function(thiz){
								var d = new Date(accountOutForm.form.findField("account.basedate").getValue());
								var v = accountOutForm.form.findField("account.accountout").getValue() + "元";
								accountOutForm.form.findField("account.remark").setValue("消费时间："+d.format("Y-m-d") + "\n消费金额：" + v + "\n消费账户：" + thiz.el.dom.value);
							}
						}
					}]
				},{
					columnWidth : .5,
					layout : 'form',
					border : false,
					height:50,
					items:[{
						xtype: 'combo',
						name:"account.maintype",
						store:accountMainTypeStore,
						anchor:"90%",
						fieldLabel:"主类别",
						editable:false,//false：不可编辑
						triggerAction:"all",//避免选定了一个值之后，再选的时候只显示刚刚选择的那个值
						valueField:"dataKey",//将codeid设置为传递给后台的值
						displayField:"dataValue",
						hiddenName:"account.maintype",//这个值就是传递给后台获取的值
						mode: "local",
						allowBlank:isNull,
						listeners: {
							'select': function(combo, record, index){
								accountOutForm.form.findField("account.setype").setValue("");
								accountEnSecondTypeStore.load({params:{codeId:"4028098136ce7b900136ceb23e860001",parentCodeId:combo.getValue()}});
							},
							"blur":function(thiz){
								var d = new Date(accountOutForm.form.findField("account.basedate").getValue());
								var v = accountOutForm.form.findField("account.accountout").getValue() + "元";
								var c = accountOutForm.form.findField("account.accountcard");
								accountOutForm.form.findField("account.remark").setValue("消费时间："+d.format("Y-m-d") + "\n消费金额：" + v + "\n消费账户：" + c.el.dom.value + "\n消费主类别：" + thiz.el.dom.value);
							}
						}
					}]
				},{
					columnWidth : .5,
					layout : 'form',
					border : false,
					height:50,
					items:[{
						xtype: 'combo',
						name:"account.setype",
						store:accountEnSecondTypeStore,
						anchor:"90%",
						fieldLabel:"次类别",
						editable:false,//false：不可编辑
						triggerAction:"all",//避免选定了一个值之后，再选的时候只显示刚刚选择的那个值
						valueField:"dataKey",//将codeid设置为传递给后台的值
						displayField:"dataValue",
						hiddenName:"account.setype",//这个值就是传递给后台获取的值
						mode: "local",
						listeners:{
							"blur":function(thiz){
								var d = new Date(accountOutForm.form.findField("account.basedate").getValue());
								var v = accountOutForm.form.findField("account.accountout").getValue() + "元";
								var c = accountOutForm.form.findField("account.accountcard");
								var t = accountOutForm.form.findField("account.maintype");
								accountOutForm.form.findField("account.remark").setValue("消费时间："+d.format("Y-m-d") + "\n消费金额：" + v + "\n消费账户：" + c.el.dom.value + "\n消费主类别：" + t.el.dom.value + "\n消费次类别："+thiz.el.dom.value);
							}
						}
					}]
				}]
			},{
				layout:"column",
				border:false,
				labelSeparator:'：',
				height:70,
				items:[{
					layout:"form",
					columnWidth:1,
					//height:50,
					items:[{
						xtype: 'textarea',
						name:"account.remark",
						anchor:"90%",
						fieldLabel:"记账理由",
						readOnly:true
					}]
				}]
			}]
		});
		return accountOutForm;
	}
	/**
	 * 获取收入账目信息表单
	 * @param url
	 * @param title
	 * @param isNull
	 * @param readOnly
	 * @returns {Ext.form.FormPanel}
	 */
	function getInAccountForm(url, title, isNull, readOnly){
		var accountInForm = new Ext.form.FormPanel({
			url:url,
			frame: true,
			labelAlign: 'right',
			title:title,
			labelWidth:70,
			autoScroll:false,
			waitMsgTarget:true,
			viewConfig:{forceFit:true},
			items:[{
				layout:"column",
				border:false,
				labelSeparator:'：',
				items:[{
					layout:"form",
					columnWidth:0.5,
					height:50,
					items:[{
						xtype: 'datefield',
						name:"account.basedate",
						anchor:"90%",
						fieldLabel:"记账时间",
						format:"Y-m-d",
						readOnly:readOnly,
						value:new Date(),
						allowBlank:isNull
					},{
						xtype:"hidden",
						name:"account.baseyear"
					},{
						xtype:"hidden",
						name:"account.basemonth"
					},{
						xtype:"hidden",
						name:"account.baseinfoid"
					},{
						xtype:"hidden",
						name:"account.margintag",
						value:'0'
					},{
						xtype:"hidden",
						name:"account.username",
						value:userName
					}]
				}]
			},{
				layout : 'column',
				columns : 2,
				items:[{
					columnWidth : .5,
					layout : 'form',
					border : false,
					height:50,
					items:[{
						xtype: 'numberfield',
						name:"account.accountenter",
						anchor:"90%",
						fieldLabel:"收入金额",
						readOnly:readOnly,
						value:0,
						allowBlank:isNull,
						listeners:{
							"blur":function(thiz){
								var d = new Date(accountInForm.form.findField("account.basedate").getValue());
								accountInForm.form.findField("account.remark").setValue("收入时间："+d.format("Y-m-d") + "\n收入金额：" + thiz.value);
							}
						}
					}]
				},{
					columnWidth : .5,
					layout : 'form',
					border : false,
					height:50,
					items:[{
						xtype: 'combo',
						name:"account.accountcard",
						store:cardInfosStore,
						anchor:"90%",
						fieldLabel:"账户",
						editable:false,//false：不可编辑
						triggerAction:"all",//避免选定了一个值之后，再选的时候只显示刚刚选择的那个值
						valueField:"accountId",//将codeid设置为传递给后台的值
						displayField:"cardName",
						hiddenName:"account.accountcard",//这个值就是传递给后台获取的值
						mode: "local",
						allowBlank:isNull,
						listeners:{
							"blur":function(thiz){
								var d = new Date(accountInForm.form.findField("account.basedate").getValue());
								var v = accountInForm.form.findField("account.accountenter").getValue() + "元";
								accountInForm.form.findField("account.remark").setValue("收入时间："+d.format("Y-m-d") + "\n收入金额：" + v + "\n收入账户：" + thiz.el.dom.value);
							}
						}
					}]
				},{
					columnWidth : .5,
					layout : 'form',
					border : false,
					height:50,
					items:[{
						xtype: 'combo',
						name:"account.maintype",
						store:accountMainTypeStore,
						anchor:"90%",
						fieldLabel:"主类别",
						editable:false,//false：不可编辑
						triggerAction:"all",//避免选定了一个值之后，再选的时候只显示刚刚选择的那个值
						valueField:"dataKey",//将codeid设置为传递给后台的值
						displayField:"dataValue",
						hiddenName:"account.maintype",//这个值就是传递给后台获取的值
						mode: "local",
						allowBlank:isNull,
						listeners: {
							'select': function(combo, record, index){
								accountInForm.form.findField("account.setype").setValue("");
								accountEnSecondTypeStore.load({params:{codeId:"4028098136ce7b900136ceb23e860001",parentCodeId:combo.getValue()}});
							},
							"blur":function(thiz){
								var d = new Date(accountInForm.form.findField("account.basedate").getValue());
								var v = accountInForm.form.findField("account.accountenter").getValue() + "元";
								var c = accountInForm.form.findField("account.accountcard");
								accountInForm.form.findField("account.remark").setValue("收入时间："+d.format("Y-m-d") + "\n收入金额：" + v + "\n收入账户：" + c.el.dom.value + "\n收入主类别：" + thiz.el.dom.value);
							}
						}
					}]
				},{
					columnWidth : .5,
					layout : 'form',
					border : false,
					height:50,
					items:[{
						xtype: 'combo',
						name:"account.setype",
						store:accountEnSecondTypeStore,
						anchor:"90%",
						fieldLabel:"次类别",
						editable:false,//false：不可编辑
						triggerAction:"all",//避免选定了一个值之后，再选的时候只显示刚刚选择的那个值
						valueField:"dataKey",//将codeid设置为传递给后台的值
						displayField:"dataValue",
						hiddenName:"account.setype",//这个值就是传递给后台获取的值
						mode: "local",
						listeners:{
							"blur":function(thiz){
								var d = new Date(accountInForm.form.findField("account.basedate").getValue());
								var v = accountInForm.form.findField("account.accountenter").getValue() + "元";
								var c = accountInForm.form.findField("account.accountcard");
								var t = accountInForm.form.findField("account.maintype");
								accountInForm.form.findField("account.remark").setValue("收入时间："+d.format("Y-m-d") + "\n收入金额：" + v + "\n收入账户：" + c.el.dom.value + "\n收入主类别：" + t.el.dom.value + "\n收入次类别："+thiz.el.dom.value);
							}
						}
					}]
				}]
			},{
				layout:"column",
				border:false,
				labelSeparator:'：',
				items:[{
					layout:"form",
					columnWidth:1,
					height:70,
					items:[{
						xtype: 'textarea',
						name:"account.remark",
						anchor:"90%",
						fieldLabel:"记账理由",
						readOnly:true
					}]
				}]
			}]
		});
		return accountInForm;
	}
	/**
	 * 检查用户账户列表
	 */
	function checkAccountList(){
		if(cardInfosStore.getTotalCount() < 1){
			var btn = Ext.getCmp("account_info_btn_manage");
			var url;
			if(btn){
				url = btn.handlerUrl;
				Ext.Msg.alert("系统提示", "您还没有设置您的账户信息！系统将跳转到账户信息设置页面...", function(btn){
					myAccountInfoManage(path + url);
				});
			}
		}
	}
	/**
	 * 保存账目备份信息
	 * @param windowId
	 * @param form
	 */
	function saveBackupSetting(windowId, form){
		Ext.MessageBox.show({
			msg:"正在保存账目备份信息，请稍候...",
			progressText:"正在保存账目备份信息，请稍候...",
			width:300,
			wait:true,
			waitConfig: {interval:200},
			icon:Ext.Msg.INFO
		});
		form.getForm().submit({
			timeout:60000,
			success: function(form, action) {
				Ext.Msg.hide();
				try{
					var result = Ext.decode(action.response.responseText);
					if(result && result.success){
						var msg = "账目备份设置信息保存成功！";
						if(result.msg){
							msg = result.msg;
						}
						showSystemMsg("系统提示信息", msg, function(btn, text) {
							if (btn == 'ok') {
								backSettingStore.reload();
								Ext.getCmp(windowId).close();
							}
						});
					}else if(!result.success){
						var msg = "账目备份设置信息保存失败，请检查您所填信息是否完整无误！";
						if(result.msg){
							msg = result.msg;
						}
						Ext.Msg.alert('系统提示信息', msg);
					}
				}catch(e){
					Ext.Msg.alert('系统提示信息', "系统错误，错误代码："+e);
				}
			},
			failure: function(form, action) {//action.result.errorMessage
				Ext.Msg.hide();
				var msg = "账目备份信息保存失败，请检查您的网络连接或者联系管理员！";
				try{
					var result = Ext.decode(action.response.responseText);
					if(result.msg){
						msg = result.msg;
					}
				}catch(e){
					msg = "系统错误，错误代码：" + e;
				}
				Ext.Msg.alert('系统提示信息', msg);
			}
		});
	}
	
	/**
	 * 保存账目信息
	 * @param form
	 * @param windowId
	 */
	function saveAccountForm(form, windowId){
		Ext.MessageBox.show({
			msg:"正在保存账目信息，请稍候...",
			progressText:"正在保存账目信息，请稍候...",
			width:300,
			wait:true,
			waitConfig: {interval:200},
			icon:Ext.Msg.INFO
		});
		form.getForm().submit({
			timeout:60000,
			success: function(form, action) {
				Ext.Msg.hide();
				try{
					var result = Ext.decode(action.response.responseText);
					if(result && result.success){
						var msg = "账目信息保存成功！";
						if(result.msg){
							msg = result.msg;
						}
						showSystemMsg("系统提示信息", msg, function(btn, text) {
							if (btn == 'ok') {
								accountGroupStore.reload();
								Ext.getCmp(windowId).close();
							}
						});
					}else if(!result.success){
						var msg = "账目信息保存失败，请检查您所填信息是否完整无误！";
						if(result.msg){
							msg = result.msg;
						}
						Ext.Msg.alert('系统提示信息', msg);
					}
				}catch(e){
					Ext.Msg.alert('系统提示信息', "系统错误，错误代码："+e);
				}
			},
			failure: function(form, action) {//action.result.errorMessage
				Ext.Msg.hide();
				var msg = "账目信息保存失败，请检查您的网络连接或者联系管理员！";
				try{
					var result = Ext.decode(action.response.responseText);
					if(result.msg){
						msg = result.msg;
					}
				}catch(e){
					msg = "系统错误，错误代码：" + e;
				}
				Ext.Msg.alert('系统提示信息', msg);
			}
		});
	}
}

/**
 * 公用窗口
 * @param {} id
 * @param {} title
 * @param {} width
 * @param {} height
 * @param {} items
 * @param {} html
 * @param {} buttons
 */
function showAccountWindow(id, title, width, height, items, html, buttons){
	var accountWindow = new Ext.Window({
		id:id,
		title:title,
		width:width,
		height:height,
		items:items,
		//html:html,
		buttons:buttons,
		modal:true,
		//animateTarget:"giftmanage_div",//动画展示
		layout:"fit",
		resizable:false
	});
	accountWindow.show();
}
/**
 * 卡类型数据
 */
var cardTypeStore = parent.cardTypeStore;
cardTypeStore.load({params:{codeId:"4028098136dd28da0136dd4ba0360001"}});
/**
 * 卡信息
 */
var cardInfoReader = new Ext.data.JsonReader({
	totalProperty : "totalCount",
	root : "accountCard"
},[
   {name:"accountId"},//账户id
   {name:"cardId"},//卡号
   {name:"cardName"},//账户名称
   {name:"cardType"},//账户类型
   {name:"cardStatus"},//账户状态
   {name:"cardBank"},//开户行
   {name:"cardCurrency"},//币种
   {name:"comment"},//备注
   {name:"cardBalance"},//余额
   {name:"cardUser"},//持卡人
]);
/**
 * 卡信息
 */
var cardInfosStore = new Ext.data.Store({
	proxy:new Ext.data.HttpProxy({
		url: path + "/account_manage/myAccountList.action?method=myAccountList",
	}),
	reader:cardInfoReader,
	baseParams:{userName:userName}
});


/**
 * 程序主入口
 */
Ext.onReady(function(){
	Ext.QuickTips.init();
	Ext.form.Field.prototype.msgTarget = 'side';
	cardInfosStore.load({
		callback:function(){
			accountBalance();
		}
	});
});