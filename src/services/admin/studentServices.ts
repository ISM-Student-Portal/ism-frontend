import axios from '../../utils/axios';


export const fetchAllStudents = async() => {
    try{
    const students = await axios.get('/students');
    return students.data;

    }catch (error: any){
        return error.message
    }
}

export const createStudent = async(data: any) => {
    try{
        const student = await axios.post('/create-user', data);
        return student.data;
    
        }catch (error: any){
            return error.message
        }
}