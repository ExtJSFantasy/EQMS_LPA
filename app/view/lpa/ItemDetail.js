Ext.define('EQMS.view.lpa.ItemDetail', {
	extend: 'Ext.form.Panel',
    xtype: 'itemDetail',
    requires: [
        'Ext.TitleBar',
		'UX.plugin.ImageViewer',
		'EQMS.view.Camera',
		'Ext.field.Hidden',
		'Ext.field.TextArea',
		'Ext.field.Number',
		'Ext.tab.Panel',
		'Ext.form.FieldSet',
		'UX.plugin.Select',
		'UX.Img',
		'Ext.field.Search'
    ],
    config: {
		title : '不符合项',
		scrollable: {
            direction: 'vertical',
            directionLock: true
        },
		orient: 'portrait',
		/*navBtns: [
			{
				action: 'save',
				text: '保存',
				itemId: 'save',
				align: 'right'
			}
		],*/
		cls: 'itemDetail',
		lpaListRecord: null,
		itemListRecord: null,
		itemList: null,
		items: [
			{
				xtype : 'fieldset',
				scrollable: null,
				//title:'',
				items : [
					{
						xtype:'fieldset',
						title:'问题描述',
						cls:'sectitle',
						items:[
							{xtype: 'hiddenfield', name: 'isNC', value: '0'},
							{xtype: 'hiddenfield', name: 'isborder', value: '0'},
							{
								xtype: 'textareafield', 
								name: 'describe', 
								label: '', 
								placeHolder: '请输入问题描述', 
								required: true
							}
						]
					},
					{
						xtype:'fieldset',
						layout:'vbox',
						items:[
							{xtype: 'hiddenfield', name: 'isNC', value: '0'},
							{xtype: 'hiddenfield', name: 'solver', value: '0'},
							{xtype: 'hiddenfield', name: 'auditor', value: '0'},
							//auditID: $userName
							{xtype: 'hiddenfield', name: 'isborder', value: '0'},
							/*{
								xtype: 'uxSelectfield', 
								name: 'departmentName',
								label: '责任部门:',
								labelWidth:'40',
								placeHolder: '选择责任部门',
								disabled:true,
								valueField: 'departmentName',
								displayField: 'departmentName',
								autoSelect:false,
								store: {
									type: 'resDepartment', 
									storeId: 'resDepartment',
								},
								listeners : {
									pickerchange: function(me, record){
										console.log("me",me);
										//me.parent.down('[name=partName]').setValue(record.get('partName'));
									}
								}
							},*/
							{
								xtype: 'uxSelectfield', 
								name: 'solverName', 
								label: '责任人 :',
								labelWidth:'40',
								placeHolder: '选择责任人',
								valueField: 'solverName',
								displayField: 'solverName',
								autoSelect:false,
								store: {
									type: 'resDepartment', 
									storeId: 'resDepartment'
								},
								listeners : {
									pickerchange: function(me, record){
										me.parent.down('[name=solver]').setValue(record.get('userName'));
										//me.parent.down('[name=auditor]').setValue($userName);
									}
								}
							}
						]
					}
				]
			},
			{
				height: '20%',
				xtype: 'camera',
				margin: '.8em 0em 0 0'
			},
			{
				xtype: 'button',
				ui:'confirm',
				cls:'btn',
				text:'选择问题类型提交',
				docked : 'bottom',
				itemId:'confirm'
			}
		]
    }
});