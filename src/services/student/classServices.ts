import axios from '../../utils/axios';




export const getUpcoming = async() => {
    try{
        const classroom = await axios.get('/classroom');
        return classroom.data;
    
        }catch (error: any){
            return error.message
        }
}

export const getAssignment = async() => {
    try{
        const classroom = await axios.get('/assignments');
        return classroom.data;
    
        }catch (error: any){
            return error.message
        }
}

export const markAttendance = async(id: any) => {
    try{
        const attendance = await axios.put('/mark-attendance/'+id);
        return attendance.data;
    
        }catch (error: any){
            return error.message
        }
}

export const createSubmission = async(data: any) => {
    try{
        const attendance = await axios.post('/submissions', data);
        return attendance.data;
    
        }catch (error: any){
            return error.message
        }
}