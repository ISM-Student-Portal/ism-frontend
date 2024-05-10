import { createSubmission, getAssignment } from '@app/services/student/classServices';
import { ContentHeader } from '@components';
import { Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Modal, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import moment from 'moment';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';
import DataTable from '../../components/data-table/DataTableBase';
import { toast } from 'react-toastify';
import axios from '../../utils/axios';




interface Assignment {
  id: number
  title: string,
  description: string,
  link: string,
  deadline: string | any
  file_url: string
}

const Assignment = () => {
  const profile = useSelector((state: any) => state.profile.profile);
  const [classroom, setClassroom] = useState<Assignment>();
  const [classroomList, setClassroomList] = useState([]);
  const [pending, setPending] = useState(true);
  const [openPrompt, setOpenPrompt] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [feedbacks, setFeedbacks] = useState<any>();
  const [link, setLink] = useState<any>();



  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [attendanceExpired, setAttendanceExpired] = useState(false);

  const [loading, setLoading] = useState(false);



  const handleOpenAdd = () => {
    setOpenAdd(true);
  }

  const handleOpenPrompt = () => {
    setOpenPrompt(true);
  }

  const handleCloseAdd = () => {
    setOpenAdd(false);
  }

  const handleClosePrompt = () => {
    setOpenPrompt(false);
  }

  const handleChange = (state: any) => {
    let classR = state.selectedRows[0];
    if (classR) {
      setClassroom(classR);
      if (classR.submissions?.length > 0) {

        setAttendanceMarked(true);
        // setLoading(true);
      }
      else {
        setAttendanceMarked(false);
      }
      if (moment() > moment(classR?.deadline)) {

        setAttendanceExpired(true);
      }
      else {
        setAttendanceExpired(false);
      }
    }

  }


  const getUpcomingAssignment = async () => {
    try {
      let classroom1: any = await getAssignment();
      setClassroomList(classroom1?.assignments);
      let res = classroom1.assignments[0]
      setClassroom(res);

      if (res?.submissions?.length > 0) {
        setAttendanceMarked(true);
        // setLoading(true);
      }
      if (moment() > moment(res?.deadline)) {
        setAttendanceExpired(true);
      }

    }
    catch (error: any) {
      console.log(error);
    }
    setPending(false);



  }
  
  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    // width: '50%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };
  const getDate = (date: string) => {
    let day = moment(date);
    if (moment() > moment(date)) {
      return "Expired " + day.toNow()
    }
    return "The Submission link will Expire " + day.fromNow();
  }

  const submitAssignment = async () => {
    setLoading(true)
    let data = {
      assignment_id: classroom?.id,
      feedbacks: feedbacks,
      link: link
    }
    let result = await createSubmission(data);
    if (result.message === 'Success') {
      setAttendanceMarked(true);
      toast.success('Submission made successfully');
    }
    setLoading(false);
    handleClosePrompt();
    handleCloseAdd();
  }
  const columns = [
    { name: 'Title', selector: (row: any) => row.title },
    { name: 'Description', selector: (row: any) => row.description },
    { name: 'Link', selector: (row: any) => (<a target='_blank' href={row.link}>{row.link}</a>) },
    { name: 'Submission Link', selector: (row: any) => (<a target='_blank' href={row.submissions[0]?.link}>{row.submissions[0]?.link}</a>) },
    { name: 'Grade', selector: (row: any) => row.submissions[0]?.grade },


  ]

  useEffect(() => {
    getUpcomingAssignment();
  }, []);
  return (
    <div>
      <ContentHeader title="Assignment" />

      <section className="content">
        <div className="container-fluid">
          {classroom ? (
            <Card variant="outlined" sx={{ maxWidth: "550px" }}>
              <Box sx={{ p: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography gutterBottom variant="h6" component="div" align='center'>
                    {classroom?.title}
                  </Typography>
                  <Chip label={getDate(classroom?.deadline)} variant='filled' color='secondary'>
                  </Chip>

                </Stack>
                <Typography color="text.secondary" variant="body1">
                  {classroom?.description}
                </Typography>

                <Typography color="text.secondary" variant="h6">
                  <a href={classroom?.link} target='_blank'> {classroom?.link}</a>
                </Typography>

                {classroom.file_url ? (
                  <a href={classroom.file_url} target='_blank' className='text-success pointer-cursor bold'> <b>Download Assignment File</b></a>
                ) : (<div></div>)}

              </Box>
              <Divider />
              <Box sx={{ p: 2 }}>

                <Stack direction="row" spacing={1}>

                  <Button variant='contained' color='success' onClick={handleOpenAdd} disabled={attendanceMarked || attendanceExpired}>Make Submission</Button>
                </Stack>
              </Box>
            </Card>
          ) : (
            <Card variant="outlined" sx={{ maxWidth: "420px" }}>
              <Box sx={{ p: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography gutterBottom variant="h6" component="div" align='center'>
                    There is no assignment for now
                  </Typography>


                </Stack>
                <Typography color="text.secondary" variant="body1">
                  Check back later
                </Typography>
              </Box>
              <Divider />

            </Card>
          )}


        </div>
      </section>
      <section className="content my-3">

        <div className="container-fluid">
          <Typography variant='h5'>All Assignment List</Typography>


          <DataTable columns={columns} data={classroomList} progressPending={pending} responsive keyField='id' striped selectableRows selectableRowsSingle onSelectedRowsChange={handleChange} />
        </div>
      </section>
      <Modal
        open={openAdd}
        onClose={handleCloseAdd}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description">
        <Container sx={{
          ...style, borderRadius: '5px', paddingY: '1.5rem'
        }} maxWidth="sm" component="form" noValidate>
          <h5 id="child-modal-title" className='text-center my-3'>Create Submission</h5>
          <Container
          >

            <TextField
              id="outlined-controlled"
              label="Feedback (Optional)"
              size='small'
              sx={{ marginRight: '1rem', marginY: '.5rem', width: '100%' }}


              value={feedbacks}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setFeedbacks(event.target.value);
              }}
            />

          </Container>

          <Container
          >

            <TextField
              id="outlined-controlled"
              label="Link"
              size='small'
              required

              sx={{ marginRight: '1rem', marginY: '.5rem', width: '100%' }}



              value={link}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setLink(event.target.value);
              }}
            />



          </Container>


          <br />
          <Box sx={{
            marginRight: "1rem",
            float: 'right'
          }}>
            <Button variant='outlined' size='small' sx={{
              marginRight: ".2rem"
            }} onClick={handleCloseAdd}>Cancel</Button>
            <Button variant='contained' size='small' onClick={handleOpenPrompt} disabled={loading}>Submit</Button>
          </Box>

          {/* <Button variant="outlined" onClick={handleClose}>Close Child Modal</Button> */}
        </Container>
      </Modal>

      <Dialog
        open={openPrompt}
        onClose={handleClosePrompt}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description">

        <DialogTitle align='center' variant='h5'>Very Important!!</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure to want make submission for <b>{classroom?.title}</b></DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button variant='outlined' size='small' sx={{
            marginRight: ".2rem"
          }} color='error' onClick={handleClosePrompt}>Cancel</Button>
          <Button variant='contained' size='small' color='primary' onClick={submitAssignment} disabled={loading}>Yes</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Assignment;
