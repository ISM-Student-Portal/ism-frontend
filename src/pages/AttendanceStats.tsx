import Footer from '@app/modules/main/footer/Footer';
import { ContentHeader } from '@components';
import DataTable from '../components/data-table/DataTableBase'
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import React, { useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container'
import TextField from '@mui/material/TextField';


import { toast } from 'react-toastify';
import memoize from 'memoize-one';

import { updateStudentStatus, deleteStudent, fetchStudentAttendanceReport } from '@app/services/admin/studentServices';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, FormGroup, Switch } from '@mui/material';
import FilterComponent from '@app/components/data-table/FilterComponent';


const AttendanceStats = () => {

  const [pending, setpending] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [editStudentStatus, setEditStudentStatus] = React.useState(false);
  const [editStudentSub, setEditStudentSub] = React.useState(false);
  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(
    false
  );



  const [selectedStudent, setSelectedStudent] = React.useState<any>();



  const [rows, setRows] = React.useState([]);




  const handleOpenEdit = () => {
    setOpenEdit(true);
  };
  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const filteredItems = rows.filter(
    (item: any) =>
      JSON.stringify(item)
        .toLowerCase()
        .indexOf(filterText.toLowerCase()) !== -1
  );

  const subHeaderComponent = useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText("");
      }
    };

    return (
      <FilterComponent
        onFilter={(e: any) => setFilterText(e.target.value)}
        onClear={handleClear}
        filterText={filterText}
      />
    );
  }, [filterText, resetPaginationToggle]);

  const handleOpenDelete = () => {
    setOpenDelete(true);
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
  };



  const handleButtonClick = async (type: any, student: any) => {
    setSelectedStudent(student);
    if (type === 'edit') {
      // await changeStudentPass(student.id);
      // toast.success('Student updated Successfully!');

      setEditStudentStatus(student.is_admin);
      setEditStudentSub(student.profile.subscription === 'premium')
      handleOpenEdit();
    } else {
      handleOpenDelete();
    }
  }

  

  const performActionDelete = async () => {
    setLoading(true);
    const res = await deleteStudent(selectedStudent?.id, selectedStudent?.is_active);
    if (res.status === 'success') {
      toast.success('Student Deleted Successfully!');
      handleCloseDelete();
      getStudents();
    }
    setLoading(false);
  }

  const getStudents = async () => {
    const students = await fetchStudentAttendanceReport();
    setRows(students.stats);
    setpending(false);
  }








  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };
  const columns = memoize(clickHandler => [
    { name: 'First Name', selector: (row: any) => row.profile?.first_name, sortable: true, sortFunction: caseInsensitiveFirstSort },
    { name: 'Last Name', selector: (row: any) => row.profile?.last_name, sortable: true, sortFunction: caseInsensitiveLastSort },
    { name: 'Email', selector: (row: any) => row.email, sortable: true, sortFunction: caseInsensitiveSort },
    { name: 'Reg No', selector: (row: any) => row.reg_no, grow: 1, sortable: true, sortFunction: caseInsensitiveRegSort },
    { name: 'Class Attended', selector: (row: any) => row.attendance_count, grow: 1 },
    { name: 'Percent Class Attended', selector: (row: any) => row.attendance_count_percent + "%", sortable: true },




    // {
    //   name: 'Action',

    //   cell: (row: any) => (<div><button className='btn btn-primary btn-sm' onClick={() => { clickHandler('edit', row) }}>Edit</button> <button className='btn btn-danger btn-sm' onClick={() => { clickHandler('delete', row) }}>Deact</button></div>),
    //   ignoreRowClick: true,
    //   allowOverflow: true,
    //   button: true,

    // },


  ]);

  const caseInsensitiveSort = (rowA: any, rowB: any) => {
    const a = rowA.email?.toLowerCase();
    const b = rowB.email?.toLowerCase();

    if (a > b) {
      return 1;
    }

    if (b > a) {
      return -1;
    }

    return 0;
  };
  const caseInsensitiveRegSort = (rowA: any, rowB: any) => {
    const a = rowA.reg_no?.toLowerCase();
    const b = rowB.reg_no?.toLowerCase();

    if (a > b) {
      return 1;
    }

    if (b > a) {
      return -1;
    }

    return 0;
  };

  const caseInsensitiveLastSort = (rowA: any, rowB: any) => {
    const a = rowA.profile?.last_name?.toLowerCase();
    const b = rowB.profile?.last_name?.toLowerCase();

    if (a > b) {
      return 1;
    }

    if (b > a) {
      return -1;
    }

    return 0;
  };

  const caseInsensitiveFirstSort = (rowA: any, rowB: any) => {
    const a = rowA.profile?.first_name?.toLowerCase();
    const b = rowB.profile?.first_name?.toLowerCase();

    if (a > b) {
      return 1;
    }

    if (b > a) {
      return -1;
    }

    return 0;
  };


  useEffect(() => {
    getStudents();
  }, [])
  return (
    <div>
      <ContentHeader title="Attendance Report" />
      <section className="content">

        <div className="container-fluid">

          <DataTable columns={columns(handleButtonClick)} data={filteredItems} progressPending={pending} responsive={true} striped={true} subHeader subHeaderComponent={subHeaderComponent} />
        </div>
      </section>
      <Footer />







      <Dialog
        open={openDelete}
        onClose={handleCloseDelete}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description">

        <DialogTitle align='center' variant='h5'>Set Student Inactive</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to <b>{selectedStudent?.is_active ? 'deactivate' : 'reactivate'}</b> student <b>{selectedStudent?.profile?.first_name}</b>?</DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button variant='outlined' size='small' sx={{
            marginRight: ".2rem"
          }} onClick={handleCloseDelete}>Cancel</Button>
          <Button variant='contained' size='small' color='error' onClick={performActionDelete} disabled={loading}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AttendanceStats;
