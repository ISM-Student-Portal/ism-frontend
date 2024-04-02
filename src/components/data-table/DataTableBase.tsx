import React from 'react';
import DataTable, { TableProps } from 'react-data-table-component';
import Checkbox from '@mui/material/Checkbox';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
const sortIcon = <ArrowDownwardIcon />;
const selectProps = { indeterminate: (isIndeterminate: boolean) => isIndeterminate };

function DataTableBase<T>(props: TableProps<T>): JSX.Element {
	return (
		<DataTable
			pagination
			selectableRowsComponentProps={selectProps}
			sortIcon={sortIcon}
			dense
			{...props}
		/>
	);
}

export default DataTableBase;