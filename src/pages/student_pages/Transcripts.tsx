import { getTranscript } from '@app/services/student/classServices';
import { ContentHeader } from '@components';
import { useState } from 'react';
import moment from 'moment';
import Typography from '@mui/material/Typography';
import DataTable from '../../components/data-table/DataTableBase';
import { toast } from 'react-toastify';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from 'react-bootstrap';
import axios from '../../utils/axios';






interface IAssignment {
    id: number
    title: string,
    description: string,
    link: string,
    deadline: string | any
    file_url: string
}

const Transcripts = () => {
    const [classroom, setClassroom] = useState<IAssignment>();
    const queryClient = useQueryClient();





    const [attendanceMarked, setAttendanceMarked] = useState(false);
    const [attendanceExpired, setAttendanceExpired] = useState(false);






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

    const downloadTranscript = async () => {


        axios.get('download-transcript', { responseType: 'blob' }).then((res: any) => {
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'transcript.pdf'); //or any other extension
            document.body.appendChild(link);
            link.click();
        })
        toast.success("Request was successful");


    }


    // const getTranscript = async () => {
    //     try {
    //         let classroom1: any = await getAssignment();
    //         setClassroomList(classroom1?.assignments);
    //         let res = classroom1.assignments[0]
    //         setClassroom(res);

    //         if (res?.submissions?.length > 0) {
    //             setAttendanceMarked(true);
    //             // setLoading(true);
    //         }
    //         if (moment() > moment(res?.deadline)) {
    //             setAttendanceExpired(true);
    //         }

    //     }
    //     catch (error: any) {
    //     }
    //     setPending(false);



    // }

    const {
        isLoading,
        error,
        data: transcript
    } = useQuery({
        queryKey: ['assignmentData'],
        queryFn: getTranscript
    })




    const columns = [
        { name: 'Course Title', selector: (row: any) => row.course_name },
        { name: 'Lecturer', selector: (row: any) => row.lecturer },
        { name: 'Number of Assignments', selector: (row: any) => row.total_assignments },
        { name: 'Grade %', selector: (row: any) => row.grade },


    ]

    return (
        <div>
            <ContentHeader title="Transcript" />


            <section className="content my-3">
                <div className='my-5 text-right mx-3'>
                    <Button variant='success' type={'button'} size='sm' className='' onClick={() => downloadTranscript()}>Download</Button>
                </div>

                <div className="container-fluid">
                    <Typography variant='h5'></Typography>


                    <DataTable columns={columns} data={transcript?.transcript} progressPending={isLoading} responsive keyField='id' striped onSelectedRowsChange={handleChange} />
                </div>
            </section>

        </div>
    );
};

export default Transcripts;
