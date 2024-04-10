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

export const updateStudentStatus = async(id: number, is_admin: boolean) => {
    try{
        const student = await axios.put('/set-admin-status/'+id, {is_admin: !is_admin});
        return student.data;
    
        }catch (error: any){
            return error.message
        }
}

export const deleteStudent = async(id:number, is_active: boolean) => {
    try{
        const student = await axios.put('/set-active-status/'+id, {is_active: !is_active});
        return student.data;
    
        }catch (error: any){
            return error.message
        }
}