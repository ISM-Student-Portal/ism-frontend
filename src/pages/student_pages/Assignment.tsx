import { createSubmission, getAssignment } from '@app/services/student/classServices';
import { ContentHeader } from '@components';
import { Button, Container, Modal, TextField } from '@mui/material';
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
  const [openAdd, setOpenAdd] = useState(false);
  const [feedbacks, setFeedbacks] = useState<any>();
  const [link, setLink] = useState<any>();



  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [attendanceExpired, setAttendanceExpired] = useState(false);

  const [loading, setLoading] = useState(false);



  const handleOpenAdd = () => {
    setOpenAdd(true);
  }

  const handleCloseAdd = () => {
    setOpenAdd(false);
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
      let res = classroom1.assignments[classroom1.assignments.length - 1]
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
  const downloadFile = async () => {
    setLoading(true)
    axios.post('/download-file', { file_url: classroom?.file_url }, { responseType: 'blob' }).then((res: any) => {
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'assignment.pdf'); //or any other extension
      document.body.appendChild(link);
      link.click();
      toast.success("Request was successful");

    }).finally(() => {
      setLoading(false);
    })
  };

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
            <Card variant="outlined" sx={{ maxWidth: "600px" }}>
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
                  <button onClick={downloadFile} className='text-success pointer-cursor bold'> Get Assignment File</button>
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
        }} maxWidth="lg" component="form" noValidate>
          <h5 id="child-modal-title" className='text-center my-3'>Create Assignment</h5>
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
            <Button variant='contained' size='small' onClick={submitAssignment} disabled={loading}>Submit</Button>
          </Box>

          {/* <Button variant="outlined" onClick={handleClose}>Close Child Modal</Button> */}
        </Container>
      </Modal>
    </div>
  );
};

export default Assignment;
