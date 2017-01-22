Ext.define('EQMS.model.lpa.ItemList', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
			'itemSubId',
			'itemName',
			'fatherGroupBy',
			'childGroupBy',
			'type',
			'tableFatherBom',
			'tableFatherBomSubId',
			'tableBomSubId',
			'auditResult',
			'field08',
			'field09',
			'solveMethod',
			'isNC',
			'isborder',
			'describe',
			'partNo',
			'partName',
			'actualDisqualified',
			'actionMeasure',
			'station',
			'defectType',
			'classes',
			'solverName',
			'solver',
			'auditor',
			'auditorName'
		]
    }
});