import Footer from '@app/modules/main/footer/Footer';
import { ContentHeader } from '@components';
import DataTable from '../components/data-table/DataTableBase'
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import React, { ChangeEvent, useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container'
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add'
import { toast } from 'react-toastify';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import UploadFileIcon from "@mui/icons-material/UploadFile";
import axios from '../utils/axios';



import memoize from 'memoize-one';

import { fetchAllAssignments, deleteAssignment, updateSubmission } from '@app/services/admin/classServices';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { spawn } from 'child_process';


const Assignment = () => {

  const [open, setOpen] = React.useState(false);
  const [pending, setpending] = React.useState(true);
  const [pending2, setpending2] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [openAdd, setOpenAdd] = React.useState(false);
  const [openGrade, setOpenGrade] = React.useState(false);
  const [grade, setGrade] = React.useState<any>();
  const [changedGrade, setChangedGrade] = React.useState<any>();
  const [selectedAssignment, setSelectedAssignment] = React.useState<any>();
  const [selectedSubmission, setSelectedSubmission] = React.useState<any>();
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [filename, setFilename] = React.useState("");
  const [file, setFile] = React.useState(null);


  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [link, setLink] = React.useState('');
  const [deadline, setDeadline] = React.useState<any>();
  const [rows, setRows] = React.useState([]);
  const [attendance, setAttendance] = React.useState([]);

  const profile = useSelector((state: any) => state.profile.profile);




  const handleOpenAdd = () => {
    setOpenAdd(true);
  }

  const handleCloseAdd = () => {
    setOpenAdd(false);
  }

  const handleOpenGrade = () => {
    setOpenGrade(true);
  }

  const handleCloseGrade = () => {
    setOpenGrade(false);
  }
  const handleOpenEdit = async (id: any) => {
    setpending2(true);

    setpending2(false);
    setOpenEdit(true);
  };
  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const handleOpenDelete = () => {
    setOpenDelete(true);
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleDownload = async (assignment: any) => {
    setLoading(true)
    console.log('got here')
    axios.post('/download-file', { file_url: assignment?.file_url }, { responseType: 'blob' }).then((res: any) => {
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      let filename: any = assignment?.file_url.split('/');
      if (filename?.length > 0) {
        let filenameS = filename[filename?.length - 1];
        filenameS = filenameS.split(" ").join("_");
        link.href = url;
        link.setAttribute('download', filenameS); //or any other extension
        document.body.appendChild(link);
        link.click();
        toast.success("Request was successful");

      }

    }).finally(() => {
      setLoading(false);
    })
  };

  const handleButtonClick = (type: any, assignment: any) => {
    setSelectedAssignment(assignment);
    if (type === 'edit') {
      handleOpenEdit(assignment.id);
    } else if (type === 'delete') {
      handleOpenDelete();
    } else {
      handleDownload(assignment);
    }
  }

  const handleButtonClick2 = async (submission: any) => {
    // setLoading(true);
    setSelectedSubmission(submission);
    setGrade(submission.grade);
    handleOpenGrade();
    // let updatedGrade = await updateSubmission(submission.id, { grade: changedGrade });
    // toast.success('Grade updated successfully')
    // console.log(submission, 'work please')
    // setLoading(true);


  }
  const updateGrade = async () => {
    setLoading(true);
    let updatedGrade = await updateSubmission(selectedSubmission.id, { grade: grade });
    toast.success('Grade updated successfully')
    handleCloseGrade();
    handleCloseEdit()
    await getAssignments();
    // setSelectedSubmission({ ...selectedSubmission, grade: grade });
    // handleOpenEdit(selectedAssignment?.id);
    setLoading(false);



  }
  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }
    const file: any = e.target.files[0];
    setFile(file);
    const { name } = file;

    setFilename(name);
  }

  const getAssignments = async () => {
    const assignments = await fetchAllAssignments();
    setRows(assignments.assignments);
    setpending(false);
  }
  const performActionDelete = async () => {
    setLoading(true);
    const res = await deleteAssignment(selectedAssignment?.id);
    if (res.message === 'success') {
      toast.success('Assignment Deleted Successfully!');
      handleCloseDelete();
      getAssignments();

    }
    setLoading(false);
  }


  // const createAssignmentAction = async () => {
  //   setLoading(true);
  //   const data = {
  //     title: title,
  //     description: description,
  //     link: link,
  //   }
  //   const assignment = await createAssignment(data);
  //   console.log(assignment);
  //   toast.success('Assignment Created Successfully!');
  //   handleCloseAdd();
  //   getAssignments();
  //   setLoading(false);



  // }

  const createAssignmentAction = async () => {
    setLoading(true);
    let formData = new FormData();
    //@ts-ignore
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("link", link);
    if (deadline) {
      formData.append("deadline", deadline);

    }

    let res = await axios.post('/assignments', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    if (res) {
      toast.success('Assignment created');
    }
    setLoading(false);
    handleCloseAdd();
    getAssignments();


  }
  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 650,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };

  const style2 = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };
  const columns = memoize(clickHandler => [
    { name: 'Title', selector: (row: any) => row.title },
    { name: 'Description', selector: (row: any) => row.description },
    { name: 'Link', selector: (row: any) => (<a target='_blank' href={row.link}>{row.link}</a>) },
    { name: 'Deadline', selector: (row: any) => row.deadline },
    {
      name: 'Download File', cell: (row: any) => {
        return row.file_url ? (<button className='btn btn-primary btn-sm p-1' title='Download File' disabled={loading} onClick={() => { clickHandler('download', row) }}>Download</button>) : <div></div>
      }
    },

    {
      name: 'Action',

      cell: (row: any) => (<div><button className='btn btn-primary btn-sm p-1' title='View Submissions' onClick={() => { clickHandler('edit', row) }}>View</button> {profile.is_superadmin ? (<button className='btn p-1 btn-danger btn-sm' onClick={() => { clickHandler('delete', row) }} title='Delete Assignment'>Delete</button>) : (<span></span>)}</div>),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ])

  const columns2 = memoize(clickHandler2 => [
    { name: 'Email', selector: (row: any) => row?.student?.email, grow: 2 },
    { name: 'Link', selector: (row: any) => (<a target='_blank' href={row?.link}>{row?.link}</a>), grow: 2 },
    { name: 'Feedback', selector: (row: any) => row?.feedback },
    { name: 'Time Submitted', selector: (row: any) => moment(row?.created_at).toString(), grow: 2 },
    {
      name: 'Grade', selector: (row: any) => (
        row?.grade
      )
    },
    {
      cell: (row: any) => (<div><Button className='btn p-1 btn-success btn-sm' variant='contained' disabled={loading} color='success' onClick={() => { clickHandler2(row) }}>Update</Button></div>), ignoreRowClick: true,
      allowOverflow: false,
      button: true,
    }
  ]);


  useEffect(() => {
    getAssignments();
  }, [])
  return (
    <div>
      <ContentHeader title="Assignments" />
      <section className="content">

        <div className="container-fluid">
          <div className="d-grid gap-2 d-md-block py-2">
            <Button size='small' variant='outlined' startIcon={<AddIcon />} onClick={handleOpenAdd} className="btn btn-primary btn-sm float-right mx-1" type="button">Add</Button>
          </div>
          <DataTable columns={columns(handleButtonClick)} data={rows} progressPending={pending} responsive keyField='id' striped />
        </div>
      </section>
      <Footer />

      <Modal
        open={openAdd}
        onClose={handleCloseAdd}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description">
        <Container sx={{
          ...style, borderRadius: '5px', paddingY: '1.5rem'
        }} maxWidth="lg" component="form" noValidate>
          <h5 id="child-modal-title" className='text-center my-3'>Create Assignment</h5>
          <Container
          >

            <TextField
              id="outlined-controlled"
              size='small'
              label="Title"
              value={title}
              sx={{ marginRight: '1rem', marginY: '.5rem', width: '100%' }}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setTitle(event.target.value);
              }}
            />
            <DateTimePicker label="Deadline"
              value={deadline}
              onChange={(newValue) => setDeadline(newValue)}></DateTimePicker>
            <TextField
              id="outlined-controlled"
              label="Description"
              size='small'
              sx={{ marginRight: '1rem', marginY: '.5rem', width: '100%' }}


              value={description}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setDescription(event.target.value);
              }}
            />

          </Container>

          <Container
          >

            <TextField
              id="outlined-controlled"
              label="Link"
              size='small'
              sx={{ marginRight: '1rem', marginY: '.5rem', width: '100%' }}



              value={link}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setLink(event.target.value);
              }}
            />

            <Button
              component="label"
              variant="outlined"
              startIcon={<UploadFileIcon />}
              sx={{ marginRight: "1rem" }}
              disabled={loading}
            >
              Upload File
              <input
                type="file"
                hidden
                onChange={handleFileUpload}
              />
            </Button>
            <span>{filename}</span>

          </Container>


          <br />
          <Box sx={{
            marginRight: "1rem",
            float: 'right'
          }}>
            <Button variant='outlined' size='small' sx={{
              marginRight: ".2rem"
            }} onClick={handleCloseAdd}>Cancel</Button>
            <Button variant='contained' size='small' onClick={createAssignmentAction} disabled={loading}>Submit</Button>
          </Box>

          {/* <Button variant="outlined" onClick={handleClose}>Close Child Modal</Button> */}
        </Container>
      </Modal>


      <Modal
        open={openEdit}
        onClose={handleCloseEdit}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description">
        <Container sx={{
          ...style2, borderRadius: '5px', paddingY: '1.5rem'
        }} maxWidth="lg" component="form" noValidate>
          <h5 id="child-modal-title" className='text-center my-3'>View Submissions for <b>{selectedAssignment?.title}</b> assignment</h5>


          <DataTable columns={columns2(handleButtonClick2)} data={selectedAssignment?.submissions} progressPending={pending2} responsive keyField='id' striped />


          <Box sx={{
            marginRight: "1rem",
            float: 'right'
          }}>
            <Button variant='outlined' size='small' sx={{
              marginRight: ".2rem"
            }} onClick={handleCloseEdit}>Cancel</Button>
            <Button variant='contained' size='small' onClick={createAssignmentAction} disabled={loading}>Submit</Button>
          </Box>

          {/* <Button variant="outlined" onClick={handleClose}>Close Child Modal</Button> */}
        </Container>
      </Modal>

      <Dialog
        open={openDelete}
        onClose={handleCloseDelete}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description">

        <DialogTitle align='center' variant='h5'>Delete Assignment</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to <b>delete</b> {selectedAssignment?.title}</DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button variant='outlined' size='small' sx={{
            marginRight: ".2rem"
          }} onClick={handleCloseDelete}>Cancel</Button>
          <Button variant='contained' size='small' color='error' onClick={performActionDelete} disabled={loading}>Submit</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openGrade}
        onClose={handleCloseGrade}
      >

        <DialogTitle align='center' variant='h5'>Grade Submission</DialogTitle>
        <DialogContent>
          <TextField
            id="outlined-controlled"
            size='small'
            label="Grade in percent"
            value={grade}
            sx={{ marginRight: '1rem', marginY: '.5rem', width: '100%' }}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setGrade(event.target.value);
            }}
          />

        </DialogContent>

        <DialogActions>
          <Button variant='outlined' size='small' sx={{
            marginRight: ".2rem"
          }} onClick={handleCloseGrade}>Cancel</Button>
          <Button variant='contained' size='small' color='primary' onClick={updateGrade} disabled={loading}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Assignment;
