Ext.define('EQMS.controller.lpa.ItemDetail', {
	extend: 'Ext.app.Controller',
	config: {
		refs: {
			main: 'main',
			itemListView: 'itemList',
			itemDetailView: 'itemDetail',
			confirmBtn: 'itemDetail [itemId=confirm]'
		},
		control: {
			confirmBtn:{
				tap:'onConfirmBtn'
			}
		}
	},
	onConfirmBtn:function(view){
		var it = this;
		var _view = it.getItemDetailView();
		var _values = it.getItemDetailView().getValues();
		var _solveMethod = _view.getItemListRecord().data.solveMethod;

		var _items2 = [];
		var _data;
		var _size;
		var button;
		var url = 'lpa/getAllQustionsType';
		var _params1 = '';
		util.myAjax(url, _params1, function(response, request) {
			 _data = Ext.decode(response.responseText).data;
			 _size = Ext.decode(response.responseText).totalCounts;
			//console.log("_data",_data);
			//console.log("_size",_size);
			for(var i=0;i<_size;i++){
				//console.log("_data[i].typeName",_data[i]);
		        button = {
		                text:''+_data[i].typeName,
		                //margin:'20 0 0 0',
		                handler:function(at)
		                {
		                    //返回清单界面，保存图片。将本页面数据带回到上个界面
							//将text传过去
							//console.log("at",at.getText());
							var _text = at.getText();
							it.saveItemDetail(_view,_text);
							view.setText(_text);
							actionSheet.destroy();
		                },
		                listeners:{
							initialize:function( btn, eOpts ){
								if(btn.getText() == _solveMethod){
									btn.addCls('excep');
								}
								//console.log(btn.getText());
							}
						}
		            }
				_items2.push(button);
			};
			var actionSheet = Ext.create('Ext.ActionSheet', {
				hideOnMaskTap:true,
				style:{
					'font-size': '1.5em'
				},
				items: _items2
			});
			Ext.Viewport.add(actionSheet);
		});
	},
	saveItemDetail:function(view,text){
		console.log("保存");
		util.showMessage('正在拼命保存中。。。', false);
		//var it = this;
		var _itemListRecord = view.getItemListRecord().data;
		var _form = view;
		var _values = _form.getValues();
		console.log("_values",_values);
		_values.isNC = _itemListRecord.isNC == false ? 0 : 1;
		//校验
		var _model = Ext.create('EQMS.model.lpa.ItemDetail');
		if(util.valid(_model, _form)){
			//保存图片和数据
			this.uploadImg(view, _values,text);
		}else{
			util.hideMessage();
		}
	},
	saveData: function(values, view,_text){
		var it = this;
		view.getItemListRecord().set("auditResult", '不符合');
		view.getItemListRecord().getData().solveMethod = _text;
		for(var i in values){
			view.getItemListRecord().set(i, values[i]);
		}
		util.hideMessage();
		/*Ext.Msg.confirm("", "确定提交？", function(button){
                if (button == 'yes') {
                    if(_text == '当即整改'){
						it.getMain().pop();
					}
                } else {
                    return false;
                }
        });*/
        /*if(_text == '当即整改'){
			it.getMain().pop();
		}*/
	},
	uploadImg: function(view, values,text){
		var it = this;
		var host = util.getHost();
		var imgs = view.query('image');
		var _lpaListRecord = view.getLpaListRecord().data;
		var _itemListRecord = view.getItemListRecord().data;
		var _createDate = _lpaListRecord.createDate != null && _lpaListRecord.createDate != '' ? Ext.Date.format(_lpaListRecord.createDate, 'Y-m-d H:i:s') : '';
		var _imgObj = new Array();
		for(var i = 0; i < imgs.length; i++){ //获取所有未上传的图片
			if(imgs[i].getIsUpload() == 0){//未上传 1：已上传
				_imgObj.push(imgs[i])
			}
		}
		if (_imgObj.length == 0) {
			console.log(12345123456);
			it.saveData(values, view,text) ;
			return;
		}
		var img =  _imgObj[0];
		var imageURI = img.getSrc();
		var options = new FileUploadOptions();
		options.fileKey = "file";
		options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
		options.mimeType = "multipart/form-data";
		var params = {};
		params.createUser = $userName;
		params.itemType = '分层审核';
		params.fileDir = 'lpa';
		params.correspondingNo = _itemListRecord.itemSubId + _lpaListRecord.listId + _lpaListRecord.stepId + "-" + (_createDate != '' && _createDate != null ? _createDate : '');
		params.url  = host+'upload/lpa/'; //链接地址
		options.params = params;
		var ft = new FileTransfer();
		ft.onprogress = function(progressEvent) {
			if (progressEvent.lengthComputable) {
				img.setProgress(Math.ceil(progressEvent.loaded / progressEvent.total * 100))
			}
		};
		ft.upload(
			imageURI,
			encodeURI(host+'lpa/upload'),
			function(result){
				var obj = Ext.decode(result.response);
				if (obj.success == 1){
					img.setIsUpload(1);
					it.uploadImg(view, values,text);
				}else{
					Ext.toast(obj.message);
				}
			},
			function(error){
				Ext.toast('上传失败!');
				it.uploadImg(view, values,text);
			},
			options
		);
	}
});