import Footer from '@app/modules/main/footer/Footer';
import { ContentHeader } from '@components';
import DataTable from '../../../components/datatable-original/Datatable';

import { toast } from 'react-toastify';
import axios from '../../../utils/axios';
import React, { useEffect, useMemo } from 'react';

import { fetchAllStudents, createStudent, updateStudentStatus, deleteStudent, deactivateStudent } from '@app/services/admin/studentServices';
import FilterComponent from '@app/components/data-table/FilterComponent';
import { ColorRing } from 'react-loader-spinner';
import { Button, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';



const Students = () => {
  const [open, setOpen] = React.useState(false);
  const [pending, setpending] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [openAdd, setOpenAdd] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [editStudentStatus, setEditStudentStatus] = React.useState(false);
  const [editStudentSub, setEditStudentSub] = React.useState(false);
  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(
    false
  );
  const [selectedStudent, setSelectedStudent] = React.useState<any>();
  const [filename, setFilename] = React.useState("");
  const [file, setFile] = React.useState(null);
  const [email, setEmail] = React.useState('');
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [regNo, setRegNo] = React.useState('');
  const [phoneNumber, setPhoneNumber] = React.useState('');

  const [rows, setRows] = React.useState([]);
  const navigate = useNavigate();


  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

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
  const handleOpenAdd = () => {
    setOpenAdd(true);
  }

  const handleCloseAdd = () => {
    setOpenAdd(false);
  }
  const handleButtonClick = (type: any, student: any) => {
    setSelectedStudent(student);
    if (type === 'edit') {
      // await changeStudentPass(student.id);
      // toast.success('Student updated Successfully!');

      setEditStudentStatus(student.is_admin);
      setEditStudentSub(student.profile.subscription === 'premium')
      handleOpenEdit();
    } else if (type === 'delete') {
      setSelectedStudent(student);
      handleOpenDelete();
    }
  }




  const getStudents = async () => {
    const students = await fetchAllStudents();
    setRows(students.students);
    setpending(false);
  }

  const deactivateStudentAction = async () => {
    setLoading(true);

    const student = await deactivateStudent(selectedStudent.id);
    if (student.message === 'successful') {
      student.lecturer.is_active ? toast.success('Student Activated Successfully!') : toast.success('Student Deactivated Successfully!');
      handleCloseDelete();
      getStudents();
      setLoading(false);
    }
    else {
      toast.error('Something went wrong!');
    }
    setLoading(false);

  }


  const downloadStudents = async () => {
    setLoading(true)
    await axios.get('/admin/students/export', { responseType: 'blob' }).then((res: any) => {
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Students.xlsx'); //or any other extension
      document.body.appendChild(link);
      link.click();
      toast.success("Request was successful");

    }).finally(() => {
      setLoading(false);
    })

  }









  useEffect(() => {
    getStudents();
  }, [])
  return (
    <div>
      <ContentHeader title="Students" />
      <section className="content">

        <div className="container-fluid">
          {rows.length > 0 ? (
            <div>
              <div className="d-grid gap-2 d-md-block py-2">
              </div>
              <div className="d-grid gap-2 d-md-block py-2 my-5">
                <Button size='sm' variant='warning' onClick={downloadStudents} className="float-right mx-1" type="button">Download CSV</Button>

              </div>
              <DataTable slots={{
                8: (data: any, row: any) => (
                  <div className='d-flex '>
                    <OverlayTrigger placement='top' overlay={<Tooltip id={row.id}>View Course</Tooltip>}>
                      <Button as="span" variant='outline-light' size='sm' onClick={() => navigate('/admin/students/' + row.id)}><VisibilityIcon className='text-success mx-2 pointer' /></Button>

                    </OverlayTrigger>

                    {row.is_active ? (
                      <OverlayTrigger placement='top' overlay={<Tooltip id={row.id}>Deactivate</Tooltip>}>
                        <Button as="span" variant='outline-light' size='sm' onClick={() => handleButtonClick('delete', row)}><DeleteIcon className='text-danger mx-2 pointer' /></Button>

                      </OverlayTrigger>
                    ) : (
                      <OverlayTrigger placement='top' overlay={<Tooltip id={row.id}>Activate</Tooltip>}>
                        <Button as="span" variant='outline-light' size='sm' onClick={() => handleButtonClick('delete', row)}><AddCircleOutlineIcon className='text-success mx-2 pointer' /></Button>

                      </OverlayTrigger>
                    )}



                  </div>

                )
              }} className='table table-striped table-bordered order-column' options={{
                buttons: {
                  buttons: ['copy', 'csv']
                }
              }} data={rows} columns={[{ data: 'first_name', title: 'First Name' }, { data: 'last_name', title: 'Last Name' }, { data: 'email', title: 'Email' }, { data: 'phone', title: 'Phone' }, { data: 'plan', title: 'Plan' }, { data: 'participation_mode', title: 'Participation Mode' }, { data: 'country', title: 'Country' }, { data: 'city', title: 'City' }, { title: 'Action' }]}>

              </DataTable></div>
          ) : (<div className='h-100 d-flex align-items-center justify-content-center'><ColorRing
            visible={true}
            height="150"
            width="150"
            ariaLabel="color-ring-loading"
            wrapperStyle={{}}
            wrapperClass="color-ring-wrapper"
            colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}

          />Loading... Please wait </div>)}


        </div>
      </section>
      <Footer />

      <Modal show={openDelete} onHide={handleCloseDelete} size='lg' centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedStudent?.is_active ? 'Confirm Deactivation' : 'Confirm Activation'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to {selectedStudent?.is_active ? 'deactivate' : 'activate'} {selectedStudent?.first_name} {selectedStudent?.last_name}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deactivateStudentAction} disabled={loading} >
            Yes
          </Button>
        </Modal.Footer>

      </Modal>

    </div>
  );
};

export default Students;
