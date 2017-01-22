	Ext.define('EQMS.controller.lpa.LpaList', {
	extend: 'Ext.app.Controller',
	config: {
		refs: {
			main: 'main',
			itemList: 'itemList',
			lpaListView: 'lpaList',
			calendar: 'lpaList #calendar'
		},
		control: {
			lpaListView: {
				activate: 'onActivate',
				itemtap: 'onItemListSelect'
			},
			calendar: {
				selectionchange: 'onSelChange', //选择了某一天(灰色选中的日期)
				periodchange: 'onPeriodChange', //此事件表示日期范围变了（也就是左右滑动改变了月）
				refresh: 'onCalendarRefresh' //此事件用于改标题(年月)
			}
		}
	},
	//通用方法，设置navigationview的标题
	setViewTitle: function(view, title) {
		if (view && !view.rendered)
			view.config.title = title;
		var main = this.getMain();
		if (!main) return;
		var activeItem = main.getActiveItem(),
			navBar = main.getNavigationBar();
		if (!view || (view && activeItem === view)) {
			if (navBar && main.getInnerItems().length == navBar.backButtonStack.length) {
				var stack = navBar.backButtonStack;
				stack[stack.length - 1] = title;
				navBar.setTitle(title);
			}
		}
		if (view && view.setTitle)
			view.setTitle(title);
	},
	onItemListSelect: function(view, index, target, record, e, eOpts) {
		var it = this,
			main = it.getMain();
		var itemList = it.getItemList();
		var _lpaListView = this.getLpaListView();
		console.log("recordxdsd",record);

		if (!itemList) itemList = Ext.create('EQMS.view.lpa.ItemList');
		var _recordDate = record.get('createDate') == null ? new Date() : record.get('createDate');
		var _date = util.dateToString(record.get('workDate'));
		var _listSubId = record.get('listId');
		//区域
		var _field01= record.get('field01');
		var _createDate = Ext.Date.format(_recordDate, 'Y-m-d H:i:s');
		var _params = {
			userName: $userName,
			date: _date,
			listSubId: _listSubId,
			createDate: _createDate
		}
		var _title = _field01;
		itemList.down('fieldset').setTitle(_title);
		util.storeLoad(itemList, _params, function(records, operation, success) {
			if (record.get('createDate') != null) {
				itemList.down('#classes').setValue(records[0].getData().classes);
			}
		});
		itemList.setLpaListRecord(record);
		//判断进行身份匹配  
		if (record.get('stepNum') == '4' && record.get('stepNum') != null) {
			if(record.get('createDate') != null && record.get('createDate') != ''){
				main.push(itemList);
				return;
			}
			util.qrcodeScan(function(result) {
				var arr = [];
				var arr = result.split(",");
				//这里写逻辑
				//对返回的的数据进行匹配.取今天的时间和和扫码得到的时间进行核对以及产线和扫码得到的产线进行对比
				if (Ext.util.Format.date(new Date(), 'Y-m-d') == arr[0] && (arr[1].match(_field01) ? true : false)) {
					main.push(itemList);
				}
			});
		} else if (record.get('stepNum') < "4" && record.get('stepNum') != null) {
			if(record.get('createDate') != null && record.get('createDate') != ''){
				main.push(itemList);
				//_lpaListView.destroy();
				return;
			}
			//跳转至带有区域图的界面：包含区域图和一个扫码按钮
			var _items = [{
				xtype: 'component',
				id: 'spectaculars',
				cls:'lpalist-view ',
				tpl: [
					'<div class="andonLayout" style="width:100%;height:100%;background: #4c4949;">',
						'<div class="column-layout" >',
							'<div class = "first1-column-empty-seat"></div>',
							'<div class = "column-empty-seat"></div>',
							'<div class = "column-empty-seat"></div>',
							'<div class = "column-empty-seat"></div>',
							'<div class = "column-empty-seat"></div>',
							'<div class = "column-empty-seat"></div>',
							'<div class = "column-seat" action="1" style="{[values.field01.match("PC12") ? \'background: #fc3e39;\' : \'background: #2fd12a;\']}">PC12</div>',
						'</div>',
						'<div class="column-layout">',
							'<div class = "first1-column-empty-seat"></div>',
							'<div class = "column-seat" action="2" style="{[values.field01.match("GP12") ? \'background: #fc3e39;\' : \'background: #2fd12a;\']}">GP12</div>',
							'<div class = "column-seat" action="3" style="{[values.field01.match("PC9") ? \'background: #fc3e39;\' : \'background: #2fd12a;\']}">PC9</div>',
							'<div class = "column-seat" style="{[values.field01.match("PC8") ? \'background: #fc3e39;\' : \'background: #2fd12a;\']}">PC8</div>',
							'<div class = "column-seat" style="{[values.field01.match("PC6") ? \'background: #fc3e39;\' : \'background: #2fd12a;\']}">PC6</div>',
							'<div class = "column-seat" style="{[values.field01.match("PC15") ? \'background: #fc3e39;\' : \'background: #2fd12a;\']}">PC15</div>',
							'<div class = "column-seat" style="{[values.field01.match("PA5") ? \'background: #fc3e39;\' : \'background: #2fd12a;\']}">PA5</div>',
							'<div class = "column-seat" style="{[values.field01.match("洁净房") ? \'background: #fc3e39;\' : \'background: #2fd12a;\']}">洁净房</div>',
						'</div>',
						'<div class="column-layout">',
							'<div class = "column-seat">New Line</div>',
							'<div class = "column-seat">New Line</div>',
							'<div class = "column-seat" style="{[values.field01.match("PC16") ? \'background: #fc3e39;\' : \'background: #2fd12a;\']}">PC16</div>',
							'<div class="column-layout-inner-two-line">',
								'<div class="column-layout-inner-two-column1" style="{[values.field01.match("PK1") ? \'background: #fc3e39;\' : \'background: #2fd12a;\']}">PK1</div>',
								'<div class="column-layout-inner-two-column2" style="{[values.field01.match("PC17") ? \'background: #fc3e39;\' : \'background: #2fd12a;\']}">PC17</div>',
							'</div>',
							'<div class="column-layout-inner-line" style="{[values.field01.match("PC14") ? \'background: #fc3e39;\' : \'background: #2fd12a;\']}">PC14</div>',
							'<div class="column-layout-inner-line" style="{[values.field01.match("PA7") ? \'background: #fc3e39;\' : \'background: #2fd12a;\']}">PA7</div>',
							'<div class="column-layout-inner-two-line">',
								'<div class="column-layout-inner-seven-line" style="{[values.field01.match("PA4") ? \'background: #fc3e39;\' : \'background: #2fd12a;\']}">PA4    PK5</div>',
							'</div>',
							'<div class="column-layout-inner-line" style="{[(values.field01.match("Coating") || values.field01.match("BSI"))? \'background: #fc3e39;\' : \'background: #2fd12a;\']}">Coating</div>',
						'</div>',
						'<div class="column-layout">',
							'<div class = "column-seat">New Line</div>',
							'<div class = "column-seat">New Line</div>',
							'<div class="column-layout-inner-two-line">',
								'<div class="column-layout-inner-two-column1" style="{[values.field01.match("PA8") ? \'background: #fc3e39;\' : \'background: #2fd12a;\']}">PA8</div>',
								'<div class="column-layout-inner-two-column2" style="{[values.field01.match("PC11") ? \'background: #fc3e39;\' : \'background: #2fd12a;\']}">PK11</div>',
							'</div>',
							'<div class="column-layout-inner-line" style="{[values.field01.match("PC10") ? \'background: #fc3e39;\' : \'background: #2fd12a;\']}">PC10</div>',
							'<div class="column-layout-inner-line" style="{[values.field01.match("PC13") ? \'background: #fc3e39;\' : \'background: #2fd12a;\']}">PC13</div>',
							'<div class="column-layout-inner-line" style="{[values.field01.match("PA6") ? \'background: #fc3e39;\' : \'background: #2fd12a;\']}">PA6</div>',
							'<div class="column-layout-inner-two-line">',
								'<div class="column-layout-inner-eight-line" style="{[values.field01.match("PCK3") ? \'background: #fc3e39;\' : \'background: #2fd12a;\']}">PCK3</div>',
								'<div class="column-layout-inner-seven-line" style="{[values.field01.match("PA3") ? \'background: #fc3e39;\' : \'background: #2fd12a;\']}">PA3</div>',
							'</div>',
							'<div class="column-layout-inner-line2" style="{[values.field01.match("Wave-Soldering") ? \'background: #fc3e39;\' : \'background: #2fd12a;\']}">Wave Soldering</div>',
						'</div>',
						'<div class="column-layout-big">',
							'<div class="column-empty-two-seat" style="{[values.field01.match("LINE7") ? \'background: #fc3e39;\' : \'background: #2fd12a;\']}">SMD Line 7</div>',
							'<div class="column-empty-three-seat" style="{[values.field01.match("LINE6") ? \'background: #fc3e39;\' : \'background: #2fd12a;\']}">SMD Line 6</div>',
							'<div class="column-layout-inner-two-line" >',
							'<div class="column-empty-right-seat">',
								'<div class="column-empty-four-seat-inner" style="{[values.field01.match("TEST5-A") ? \'background: #fc3e39;\' : \'background: #2fd12a;\']}">Test 5-A</div>',
								'<div class="column-empty-four-seat-inner2" style="{[values.field01.match("TEST5-B") ? \'background: #fc3e39;\' : \'background: #2fd12a;\']}">Test 5-B</div>',
							'</div>',
							'<div class="column-layout-inner-two-a" style="{[values.field01.match("LINE5") ? \'background: #fc3e39;\' : \'background: #2fd12a;\']}">SMD Line 5</div>',
							'</div>',
							'<div class="column-layout-inner-two-line">',
							'<div class="column-empty-right-seat">',
								'<div class="column-empty-four-seat-inner" style="{[values.field01.match("TEST4-A") ? \'background: #fc3e39;\' : \'background: #2fd12a;\']}">Test 4-A</div>',
								'<div class="column-empty-eight-seat-inner" style="{[values.field01.match("TEST4-B") ? \'background: #fc3e39;\' : \'background: #2fd12a;\']}">Test 4-B</div>',
							'</div>',
							'<div class="column-layout-inner-two-a" style="{[values.field01.match("LINE4") ? \'background: #fc3e39;\' : \'background: #2fd12a;\']}">SMD Line 4</div>',
						'</div>',
							'<div class="column-layout-inner-two-line">',
								'<div class="column-empty-seat2">',
									'<div class="column-empty-four-seat-inner" style="{[values.field01.match("TEST3-A") ? \'background: #fc3e39;\' : \'background: #2fd12a;\']}">Test 3-A</div>',
									'<div class="column-empty-eight-seat-inner" style="{[values.field01.match("TEST3-B") ? \'background: #fc3e39;\' : \'background: #2fd12a;\']}">Test 3-B</div>',
								'</div>',
								'<div class="column-layout-inner-two-a" style="{[values.field01.match("LINE3") ? \'background: #fc3e39;\' : \'background: #2fd12a;\']}">SMD Line 3</div>',
							'</div>',
							'<div class="column-layout-inner-two-line">',
								'<div class="column-layout-inner-three-line">',
									'<div class="column-layout-inner-three-column1">',
										'<div class="column-empty-four-seat-inner-a" style="{[values.field01.match("PK8/PK9") ? \'background: #fc3e39;\' : \'background: #2fd12a;\']}">PK8/PK9</div>',
										'<div class="column-empty-eight-seat-inner" style="{[values.field01.match("PK10") ? \'background: #fc3e39;\' : \'background: #2fd12a;\']}">PK10</div>',
									'</div>',
									'<div class="column-empty-six-seat-inner" style="{[values.field01.match("TEST2") ? \'background: #fc3e39;\' : \'background: #2fd12a;\']}">Test 2</div>',
								'</div>',
								'<div class="column-layout-inner-two-a" style="{[values.field01.match("LINE2") ? \'background: #fc3e39;\' : \'background: #2fd12a;\']}">SMD Line 2</div>',
							'</div>',
							'<div class="column-layout-inner-two-line">',
								'<div class="column-empty-seat2">',
									'<div class="column-empty-four-seat-inner" style="{[values.field01.match("TEST1-A") ? \'background: #fc3e39;\' : \'background: #2fd12a;\']}">Test 1-A</div>',
									'<div class="column-empty-eight-seat-inner" style="{[values.field01.match("TEST1-B") ? \'background: #fc3e39;\' : \'background: #2fd12a;\']}">Test 1-B</div>',
								'</div>',
								'<div class="column-layout-inner-two-a" style="{[values.field01.match("LINE1") ? \'background: #fc3e39;\' : \'background: #2fd12a;\']}">SMD Line 1</div>',
							'</div>',
							'<div class="column-seat" style="{[values.field01.match("SMD off-line") ? \'background: #fc3e39;\' : \'background: #2fd12a;\']}">SMD Off-line</div>',
						'</div>',
					'</div>'
				].join('')
			}, {
				xtype: 'fieldset',
				docked: 'bottom',
				items: [{
					xtype: 'button',
					text: '开始审核',
					style: 'background:rgba(101,147,74,1)',
					//ui: 'confirm',
					listeners: {
						tap: function() {
							util.qrcodeScan(function(result) {
								var arr = [];
								var arr = result.split(",");
								//这里写逻辑
								//对返回的的数据进行匹配。日期和当天日期相同
								if (Ext.util.Format.date(new Date(), 'Y-m-d') == arr[0] && (arr[1].match(_field01) ? true : false)){
									main.push(itemList);
									actionSheet.destroy();
								} else {
									Ext.toast("您的信息有误！！！", 5000);
								}
							});
						}
					}
				}, {
					xtype: 'button',
					text: '返回',
					style: 'background:rgba(160,191,124,1)',
					listeners: {
						tap: function() {
							actionSheet.destroy();
						}
					}
				}]
			}];
			var actionSheet = Ext.create('Ext.ActionSheet', {
				items: _items,
				listeners:{
					initialize:function(){
						console.log(987654);
						var it = this;
						var spectaculars = it.down('#spectaculars');
						spectaculars.setData({
							field01:_field01
						});
						it.down('#spectaculars').element.on({  
			                  tap : function(com, e, eOpts) {
			                  var action = com.target.getAttribute('action');
			                	  console.log("action",action);  
			                    alert("你点击了panel"+"第"+action+"个");  
			                  },  
			                  touchstart:function(){  
			                    console.log("touch start......");  
			                  },  
			                  touchend:function(){  
			                    console.log("touch end......");  
			                  }  
		             	});
					}
				}

			});
			Ext.Viewport.add(actionSheet);
			actionSheet.show();
		}
	},
	onCalendarRefresh: function(calendarview, date) {
		var t = Ext.Date.format(date, "Y年n月");
		this.setViewTitle(calendarview.up('view2'), t);
	},
	onActivate: function(view) {
		var calendar = view.down('calendar'),
			calview = calendar.getActiveItem(),
			dateRange = calview.getPeriodMinMaxDate();
		calendar.fireEvent('refresh', calendar, calview.getBaseDate()); //改标题(年月)
		calendar.fireEvent('periodchange', calendar, dateRange.min.get('date'), dateRange.max.get('date'), 'none');
	},
	onSelChange: function(calendarview, newDate, prevDate) {
		console.log("newDate",newDate);
		var _params = {
			auditDate: util.dateToString(newDate),
			auditID: $userName
		}
		console.log("_params",_params);
		var _lpaListView = this.getLpaListView();
		if(!_lpaListView) _lpaListView = Ext.widget('lpaList');
		this.storeLoad(_lpaListView, _params);
	},
	onPeriodChange: function(calendar, start, end) {
		var _date = util.dateToString(calendar.getActiveItem().getBaseDate());
		var _month = _date.substring(0, 7);
		var _params1 = {
			month: _month,
			userName: $userName
		};
		var url = 'lpa/getCalendarData';
		util.myAjax(url, _params1, function(response, request) {
			var _data = Ext.decode(response.responseText).data;
			Ext.getStore('calendar').setData(_data);
		});
	},
	//加载stroe
	storeLoad: function (list, params, callback) {
		console.log(12345);
		var store = list.getStore();
		if (params) {
			store.setProxy({
				extraParams: params
			});
		} else if (store.getCount() > 0) {
			return
		}
		store.loadPage(1, {
			callback: function (records, operation, success) {
				if (records.length == 0) {
					list.setEmptyText('没有获取到内容');
				}
				if(callback){
					callback(records, operation, success)
				}
			},
			scope: this
		});
	}
});