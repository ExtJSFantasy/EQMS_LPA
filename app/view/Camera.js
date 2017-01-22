Ext.define('EQMS.view.Camera', {
    extend: 'Ext.Container',
    xtype: 'camera',
    config: {
		cls: 'camera-view',
		layout: 'hbox',
		defaults:{
			align: 'center'
		}
    },
	initialize:function(){
		var that = this;
		var camera = Ext.create('Ext.Button', {
			// xtype: 'button',
			ui: 'plain',
			iconCls: 'newcamera',
			//cls:'',
			width: '100px',
			height: '150px',
			text: '',
			scope: this,
			handler : function() {
				if(that.getItems().length >3){
					// Ext.Msg.alert('警告', '最多只能上传三张照片!', Ext.emptyFn);
					util.showMessage('最多只能上传三张照片', true);
				}else{
					navigator.camera.getPicture(
						function(url) {
							var _imgPanel = util.createImg(url, 0);
							
							that.add(_imgPanel);
						}, function(){
							
						}, 
						{
							quality: 50,
							destinationType: navigator.camera.DestinationType.FILE_URI
						}
					);
				}
			}
		});
		
		that.add(camera);
	}
});
