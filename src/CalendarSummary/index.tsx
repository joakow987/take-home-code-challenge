import { AgGridReact } from 'ag-grid-react';
import React, { useEffect, useState } from 'react';
import { TableRowObject } from './helpers-types';
import helpers from './helpers';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import './calendar-summary.css'

const CalendarSummary: React.FunctionComponent = () => {

  const [tableData, setTableData] = useState<TableRowObject[]>();

  const gridOptions = {
    columnDefs: [
      { field: 'date', resizable: true, width: 150, maxWidth: 200, minWidth: 100 },
      { field: 'numberOfEvents', resizable: true, width: 200, maxWidth: 250, minWidth: 150 },
      { field: 'totalDuration', resizable: true, width: 200, maxWidth: 250, minWidth: 150 },
      { field: 'longestEvent', resizable: true, width: 500, maxWidth: 500, minWidth: 200 },
    ]
  }
  useEffect(() => {
    helpers.getTableRowsData().then(data => setTableData(data));
  }, [])

  return (
    <div className="calendar-summary-container">
      <h2>Calendar summary</h2>

      <div className="ag-theme-alpine">
        <AgGridReact
          gridOptions={gridOptions}
          rowData={tableData}>
        </AgGridReact>
      </div>

    </div>
  );
};

export default CalendarSummary;
