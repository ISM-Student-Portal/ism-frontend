import Footer from '@app/modules/main/footer/Footer';
import { ContentHeader } from '@components';
import DataTable from '../../../components/datatable-original/Datatable';
import React, { useEffect, useMemo } from 'react';

import DeleteIcon from '@mui/icons-material/Delete';

import { toast } from 'react-toastify';

import { fetchAllAdmins, deactivateAdmin } from '@app/services/admin/studentServices';

import { ColorRing } from 'react-loader-spinner';
import { Button, Form, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { inviteAdmin } from '@app/services/admin/lecturerServices';


const Admins = () => {
  const [pending, setpending] = React.useState(true);
  const [email, setEmail] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [openAdd, setOpenAdd] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [editStudentStatus, setEditStudentStatus] = React.useState(false);
  const [editStudentSub, setEditStudentSub] = React.useState(false);

  const [selectedStudent, setSelectedStudent] = React.useState<any>();

  const [rows, setRows] = React.useState([]);



  const handleOpenEdit = () => {
    setOpenEdit(true);
  };



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
    } else {
      setSelectedStudent(student);
      handleOpenDelete();
    }
  }




  const getAdmins = async () => {
    const admins = await fetchAllAdmins();
    setRows(admins.admins);
    setpending(false);
  }

  const deactivateAdminAction = async () => {
    setLoading(true);

    const student = await deactivateAdmin(selectedStudent.id);
    if (student.message === 'successful') {
      student.admin.is_active ? toast.success('Admin Activated Successfully!') : toast.success('Admin Deactivated Successfully!');
      handleCloseDelete();
      getAdmins();
      setLoading(false);
    }
    else {
      toast.error('Something went wrong!');
    }

  }

  const createAdmin = async () => {
    try {
      setLoading(true);
      const data = {
        email: email,
        username: username,
        phone: phone,

      }
      const student = await inviteAdmin(data);
      if (student.message === 'successful') {
        toast.success('Invitation sent Successfully!');
        handleCloseAdd();
        getAdmins();
        setLoading(false);
      }
      else {
        toast.error('Something went wrong!');
      }

    } catch (error) {
      toast.error('Something went wrong!');
    }
    finally {
      setLoading(false);
    }


  }






  useEffect(() => {
    getAdmins();
  }, [])
  return (
    <div>
      <ContentHeader title="Admins" />
      <section className="content">

        <div className="container-fluid">
          {rows.length > 0 ? (
            <div>
              <div className="d-grid gap-2 d-md-block py-2 my-5">
                <Button size='sm' variant='warning' onClick={handleOpenAdd} className="float-right mx-1" type="button">Invite Admin</Button>

              </div>
              <div></div>
              <DataTable slots={{
                4: (data: any, row: any) => (
                  row.is_active ? (
                    <OverlayTrigger placement='top' overlay={<Tooltip id={row.id}>Deactivate</Tooltip>}>
                      <Button as="span" variant='outline-light' size='sm' onClick={() => handleButtonClick('delete', row)}><DeleteIcon className='text-danger mx-2 pointer' /></Button>

                    </OverlayTrigger>
                  ) : (
                    <OverlayTrigger placement='top' overlay={<Tooltip id={row.id}>Activate</Tooltip>}>
                      <Button as="span" variant='outline-light' size='sm' onClick={() => handleButtonClick('delete', row)}><AddCircleOutlineIcon className='text-success mx-2 pointer' /></Button>

                    </OverlayTrigger>
                  )


                )
              }} className='table table-striped table-bordered order-column dt-head-center' options={{
                buttons: {
                  buttons: ['copy', 'csv']
                }
              }} data={rows} columns={[{ data: 'email', title: 'Email' }, { data: 'username', title: 'Username' }, { data: 'phone_number', title: 'Phone' }, {
                data: 'is_active', title: 'Status', render(data, type, row, meta) {
                  return data ? 'Active' : 'Inactive'
                },
              }, { title: 'Action' }]}>

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
      <Modal show={openAdd} onHide={handleCloseAdd} size='sm' centered>
        <Modal.Header closeButton>
          <Modal.Title>Invite Admin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId='classform.title'>
              <Form.Label>Email</Form.Label>
              <Form.Control type='text' required placeholder='email' value={email} onChange={(e) => setEmail(e.target.value)}></Form.Control>
            </Form.Group>

            <Form.Group controlId='classform.description'>
              <Form.Label>Username</Form.Label>
              <Form.Control placeholder='username' required value={username} onChange={(e) => setUsername(e.target.value)}></Form.Control>
            </Form.Group>

            <Form.Group controlId='classform.link'>
              <Form.Label>Phone number</Form.Label>
              <Form.Control type='text' placeholder='Phone' required value={phone} onChange={(e) => setPhone(e.target.value)}></Form.Control>
            </Form.Group>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAdd}>
            Close
          </Button>
          <Button variant="warning" onClick={createAdmin} disabled={loading} >
            Send
          </Button>
        </Modal.Footer>
      </Modal>


      <Modal show={openDelete} onHide={handleCloseDelete} size='lg' centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedStudent?.is_active ? 'Confirm Deactivation' : 'Confirm Activation'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to {selectedStudent?.is_active ? 'deactivate' : 'activate'} {selectedStudent?.username}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deactivateAdminAction} disabled={loading} >
            Yes
          </Button>
        </Modal.Footer>

      </Modal>



    </div>
  );
};

export default Admins;
