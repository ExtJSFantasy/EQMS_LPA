Ext.define('EQMS.controller.Apps', {
	extend: 'Ext.app.Controller',
	requires: [
		'Ext.ActionSheet'
	],
	config: {
		refs: {
			main: 'main',
			home: 'home',
			apps: 'apps'
		},
		control: {
			apps:{
				itemtap:'onItemTap'
			}
		}
	},
	onItemTap: function( list, index, target, record, e, eOpts ){
		var _xtype = record.get('redirectTo');
		if(_xtype =='lpaList'){
			var _view = Ext.widget(record.get('redirectTo'));
			var main = this.getMain();
			main.push(_view);
		}else{
			Ext.toast("正在努力开发中。。。");
		}
	}
});