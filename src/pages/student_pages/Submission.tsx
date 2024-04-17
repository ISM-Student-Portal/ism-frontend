import { createSubmission, getAssignment, getSubmissionList } from '@app/services/student/classServices';
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



interface Submission {
  id: number
  title: string,
  description: string,
  link: string,
  deadline: string | any
}

const Submission = () => {
  const profile = useSelector((state: any) => state.profile.profile);
  const [classroom, setClassroom] = useState<Submission>();
  const [submissionList, setSubmissionList] = useState([]);
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


  const getSubmissions = async () => {
    try {
      let classroom1: any = await getSubmissionList();
      setSubmissionList(classroom1?.submission);

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
    { name: 'Assignment title', selector: (row: any) => row?.assignment?.title },
    { name: 'Submission Link', selector: (row: any) => (<a href={row.link}>{row.link}</a>) },
    { name: 'Grade', selector: (row: any) => row.grade },
    { name: 'Date Submitted', selector: (row: any) => moment(row.created_at).toString() },

  ]

  useEffect(() => {
    getSubmissions();
  }, []);
  return (
    <div>
      <ContentHeader title="Submissions" />

      <section className="content my-3">

        <div className="container-fluid">
          <Typography variant='h5'>All Submissions</Typography>


          <DataTable columns={columns} data={submissionList} progressPending={pending} responsive keyField='id' striped />
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

export default Submission;
