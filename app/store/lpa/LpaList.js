Ext.define('EQMS.store.lpa.LpaList', {
    extend: 'EQMS.store.Abstract.Store',
	alias: 'store.lpaList',
	config : {
		storeId: 'lpaList',
		model: 'EQMS.model.lpa.LpaList',
		method: 'lpa/getTaskView',
		proxy: {
			type: 'ajax',
			// url: Config.host+'query',
			actionMethods: {
				read: "POST"
			},
			reader: {
				type: 'json',
				rootProperty: "data"
			}
		}
	},
	initialize: function () {
		var it = this;
		this.callParent(arguments);
	}
});