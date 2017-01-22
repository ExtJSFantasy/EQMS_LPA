Ext.define('EQMS.view.lpa.ItemList', {
	extend: 'Ext.List',
    xtype: 'itemList',
    requires: [
        'Ext.TitleBar',
		'UX.plugin.ListOptions',
		'EQMS.view.lpa.ItemDetail',
		'Ext.form.FieldSet',
		'Ext.form.Select'
    ],
    config: {
		title : '审核清单',
		scrollable: {
            direction: 'vertical',
            directionLock: true
        },
		orient: 'portrait',
		navBtns: [
			{
				action: 'commit',
				text: '提交',
				itemId: 'commit',
				align: 'right'
			}
		],
		cls: 'itemList-view',
		lpaListRecord: null,
		isSave: 0,
        items: [
			{
				xtype : 'fieldset',
				//title: '',
				docked : 'top',
				items:[
					{
						xtype: 'selectfield',
						name: 'classes',
						label: '',
						hidden:true,
						itemId: 'classes',
						placeHolder: '班次',
						valueField: 'text',
						displayField: 'text',
						autoSelect: false,
						options: [
							{text: '早班', value: '早班'},
							{text: '晚班', value: '晚班'}
						]
					}
				]
			}
		],
		variableHeights: true,
		// emptyText : '没有数据',
		scrollToTopOnRefresh: false,
		store: {
			type: 'itemList',
			storeId: 'itemList'
		},
		itemTpl: [
			'<div class="flexbox box-align-center"> ',
				'<div class="flex10">',
					'<h3 class="item">{itemName}</h3>',
				'</div>',
				'<div class="op">',
					'<tpl if="auditResult == \'符合\'">',
						'<div class="btn list-icon green active ok" action="ok"></div>',
						'<div class="btn list-icon gray other" action="other"></div>',
						'<div class="btn list-icon red nok" action="nok"></div>',
					'</tpl>',
					'<tpl if="auditResult == \'不符合\'">',
						'<div class="btn list-icon green ok" action="ok"></div>',
						'<div class="btn list-icon gray other" action="other"></div>',
						'<div class="btn list-icon red active nok" action="nok"></div>',
					'</tpl>',
					'<tpl if="auditResult == \'不适用\'">',
						'<div class="btn list-icon green ok" action="ok"></div>',
						'<div class="btn list-icon gray active other" action="other"></div>',
						'<div class="btn list-icon red nok" action="nok"></div>',
					'</tpl>',
					'<tpl if="auditResult == null">',
						'<div class="btn list-icon green ok" action="ok"></div>',
						'<div class="btn list-icon gray other" action="other"></div>',
						'<div class="btn list-icon red nok" action="nok"></div>',
					'</tpl>',
				'</div>',
			'</div>'
		].join(''),
		// plugins:[ {
			// type:"listopt",
			// items:[ {
				// action:"ok",
				// cls:"write",
				// color:"blue",
				// text:"符合"
			// }, {
				// action:"other",
				// cls:"trash",
				// color:"gray",
				// text:"不适用"
			// }, {
				// action:"nok",
				// cls:"trash",
				// color:"red",
				// text:"不符合"
			// } ]
		// } ],
		fullscreen: true,
		grouped: true
    }
});