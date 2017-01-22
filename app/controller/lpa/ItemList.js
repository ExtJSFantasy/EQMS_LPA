Ext.define('EQMS.controller.lpa.ItemList', {
	extend: 'Ext.app.Controller',
	config: {
		refs: {
			main: 'main',
			itemListView: 'itemList',
			itemDetail: 'itemDetail',
			lpaListView: 'lpaList',
			commit: 'itemList [itemId=commit]'
		},
		control: {
			itemListView: {
				itemtap: 'optTap',
				tapcommit: function(e, value){
					this.saveItemList(this.getItemListView());
				},
				onBackBtn: function(e, value){
					var it = this;
					//判断是否已经提交
					var itemListView = this.getItemListView();
					var _createDate = itemListView.getLpaListRecord().get('createDate');
					if(!_createDate){
						Ext.Msg.confirm( '提示', '数据没有提交，是否确认返回？', function(buttonId, value ,opt){
							if(buttonId == 'yes'){
								it.getMain().pop();
							}
						});
					}else{
						it.getMain().pop();
					}
				}
			}
		}
	},
	optTap: function( list, index, target, record, e, eOpts ){
		var action = e.target.getAttribute('action');
		var _lapListRecord = list.getLpaListRecord(); //list选项
		var _classNo = list.down('selectfield#classes').getValue(); //班次
		var it = this;
		var _itemDetail= it.getItemDetail();
		if(!_itemDetail) _itemDetail = Ext.create('EQMS.view.lpa.ItemDetail');
		var store = list.getStore();
		store.setRemoteSort(true);
		if (action == "nok") {
			_itemDetail.setLpaListRecord(_lapListRecord);
			_itemDetail.setItemListRecord(record);
			_itemDetail.setItemList(list);
			var values = record.data;
			//赋值
			if(values.solveMethod != '' && values.solveMethod != null){
				console.log(12345678);
				var _form = _itemDetail;
				console.log("values",values);
				_form.setValues(values);
				
				//初始化图片
				it.initPicture(_itemDetail, values, _lapListRecord.data);
			}else if((values.solveMethod == '' || values.solveMethod == null) && values.auditResult == '不符合'){
				console.log(87654321);
				console.log("xiangdeshan",values.auditResult);
				var _createDate = _lapListRecord.get('createDate') == null ? '' : util.dateToString(_lapListRecord.get('createDate'));
				var _workDate = util.dateToString(_lapListRecord.get('workDate'));
				var _stepId = _lapListRecord.get('stepId');
				var _groupId = _lapListRecord.get('groupId');
				console.log("getlistId",_lapListRecord.get('listId'));
				var _listSubId = _lapListRecord.get('listId');
				var _itemSubId = record.get('itemSubId');
				console.log("_itemSubId",_itemSubId);
				var _params1 = {
					createDate : _createDate,
					workDate : _workDate,
					auditorId : $userName,
					stepId : _stepId,
					groupId : _groupId,
					listSubId : _listSubId,
					itemSubId : _itemSubId
				};
				var url = 'lpa/getListItemRecord';
				util.myAjax(url, _params1, function(response, request){
					var _data = Ext.decode(response.responseText).data;
					var _form = _itemDetail;
					
					//初始化图片
					it.initPicture(_itemDetail, _data[0], _lapListRecord.data);
				});
			}
			it.getMain().push(_itemDetail);
		}else if(action != null && action != ''){
			var _auditResult = action == 'ok' ? '符合':'不适用'
			record.set("auditResult", _auditResult);
		}
	},
	initPicture: function(view, itemRecord, listRecord){//初始化图片
		var it = this;
		var _createDate = listRecord.createDate == null ? '' : Ext.Date.format(listRecord.createDate, 'Y-m-d H:i:s')
		var _id = itemRecord.itemSubId + '' + listRecord.listId +''+listRecord.stepId + '-'+_createDate
		var _params1 = {
			applicationType : '分层审核',
			subID : _id,
			workStation : 'pad',
			operator : $userName,
			showType : 'listGrid',
			modelType : '分层审核'
		};
		var url = 'lpa/getAttachment';
		util.myAjax(url, _params1, function(response, request){
			var _data = Ext.decode(response.responseText).data;
			Ext.each(_data, function(img){
				var _imgPanel = util.createImg(img.url, 1);
				view.down('camera').add(_imgPanel);
			})
		});
	},
	saveItemList: function(view){
		var _items = view.getStore().getData().items;
		var cnt = 0;
		var it = this;
		Ext.each(_items, function(_item){
			if(_item.data.auditResult == null){
				cnt++
			}
		});
		
		if(cnt == 0){
			var _lpaListRecord = view.getLpaListRecord().data; //list选项Ext.Date.format
			var _workDate = _lpaListRecord.workDate != null ? util.dateToString(_lpaListRecord.workDate) : util.dateToString(new Date());
			var _createDate = _lpaListRecord.createDate != null ?  _lpaListRecord.createDate  : new Date();
			// var _createDate = new Date();
			var _classNo = view.down('selectfield#classes').getValue(); //班次
			var _stepId = _lpaListRecord.stepId;
			var _groupId = _lpaListRecord.groupId;
			var _groupName = _lpaListRecord.groupName;
			var _stepName = _lpaListRecord.stepName;
			var _listSubId = _lpaListRecord.listId;
			var _listName = _lpaListRecord.listName;
			var _month = _lpaListRecord.month;
			var _arr = [];
			console.log("_workDate",_workDate);
			Ext.each(_items, function(_item){
				//用法！！！
				_item.data.classes = _classNo;
				//用法！！！
				_item.data.auditorName = $userDescription;
				_item.data.auditor = $userName;
				_arr.push(_item.data);
			});
			var _xml = util.toXmlForDataFilters(_arr);
			var _params = {
				userName : $userName,
				workDate :_workDate,
				listSubId:_listSubId,
				createDate:_createDate,
				workStation:'',
				xml:_xml
			};
			var _params1 = {
				taskUsername : $userName,
				workDate :_workDate,
				month:_month,
				listName:_listName,
				listId:_listSubId,
				groupId:_groupId,
				stepName:_stepName,
				stepId:_stepId,
				groupName:_groupName
			};
			var url = 'lpa/savePlanPerItemDetail';
			
			util.myAjax(url, _params, function(response, request){
				var _data = Ext.decode(response.responseText);
				if(_data.success == 1){
					var url1 = 'lpa/saveResult';
					util.myAjax(url1, _params1, function(response, request){
						var _data = Ext.decode(response.responseText);
						if(_data.success == 1){
							Ext.toast('提交成功!');
							it.getMain().pop();
						}else{
							Ext.toast(_data.message);
						}
					});
				}else{
					Ext.toast(_data.message);
				}
			});

		}else{
			Ext.toast('您存在未审核项，请确认!');
		}
	}
});