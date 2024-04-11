import { getUpcoming, markAttendance } from '@app/services/student/classServices';
import { ContentHeader } from '@components';
import { Button, Container } from '@mui/material';
import { useEffect, useState } from 'react';
import moment from 'moment';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';

interface Classroom {
    id: number
    title: string,
    description: string,
    link: string,
    expires_on: string | any
}

const StudentClassroom = () => {
    const profile = useSelector((state: any) => state.profile.profile);
    const [classroom, setClassroom] = useState<Classroom>();
    const [attendanceMarked, setAttendanceMarked] = useState(false);
    const [attendanceExpired, setAttendanceExpired] = useState(false);

    const [loading, setLoading] = useState(false);




    const getUpcomingClass = async () => {
        try {
            let classroom1 = await getUpcoming();
            let res = classroom1.data[classroom1.data.length - 1]
            setClassroom(res);
            let attendances = profile.attendances;
            let item = attendances.find((item: any) => {
                return item.classroom_id === res?.id
            });
            if (item) {
                setAttendanceMarked(true);
                // setLoading(true);
            }
            if(moment() > moment(res?.expires_on)){
                setAttendanceExpired(true);
            }

        }
        catch (error: any) {
            console.log(error);
        }



    }
    const getDate = (date: string) => {
        let day = moment(date);
        if (moment() > moment(date)) {
            return "Expired " + day.toNow()
        }
        return "Will Expire " + day.fromNow();
    }

    const getClassLink = async () => {
        setLoading(true)
        let result = await markAttendance(classroom?.id);
        if (result.status === 'Success') {
            setAttendanceMarked(true);
        }
        setLoading(false);
    }

    useEffect(() => {
        getUpcomingClass();
    }, []);
    return (
        <div>
            <ContentHeader title="Upcoming Class" />

            <section className="content">
                <div className="container-fluid">
                    <Card variant="outlined" sx={{ maxWidth: "420px" }}>
                        <Box sx={{ p: 2 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography gutterBottom variant="h6" component="div">
                                    {classroom?.title}
                                </Typography>
                                <Chip label={getDate(classroom?.expires_on)} variant='filled' color='secondary'>
                                </Chip>

                            </Stack>
                            <Typography color="text.secondary" variant="body1">
                                {classroom?.description}
                            </Typography>

                            <Typography color="text.secondary" variant="h6">
                                <a href={classroom?.link} target='_blank'> {classroom?.link}</a>
                            </Typography>
                        </Box>
                        <Divider />
                        <Box sx={{ p: 2 }}>

                            <Stack direction="row" spacing={1}>
                                <Button variant='contained' color='success' onClick={getClassLink} disabled={attendanceMarked || attendanceExpired}>Mark Attendance</Button>
                            </Stack>
                        </Box>
                    </Card>

                </div>
            </section>
        </div>
    );
};

export default StudentClassroom;
