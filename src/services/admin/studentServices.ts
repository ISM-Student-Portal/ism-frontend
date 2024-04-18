import axios from '../../utils/axios';


export const fetchAllStudents = async() => {
    try{
    const students = await axios.get('/students');
    return students.data;

    }catch (error: any){
        return error.message
    }
}

export const fetchAllAdmins = async() => {
    try{
    const admins = await axios.get('/admins');
    return admins.data;

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

export const createAdmin = async(data: any) => {
    try{
        const admin = await axios.post('/create-admin', data);
        return admin.data;
    
        }catch (error: any){
            return error.message
        }
}

export const updateStudentStatus = async(id: number, data: any) => {
    try{
        const student = await axios.put('/set-admin-status/'+id, data);
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

export const updateProfile = async(data: any) => {
    try{
        const profile = await axios.put('/update-profile', data);
        return profile.data;
    
        }catch (error: any){
            return error.message
        }
}


export const uploadPics = async(data: any) => {
    try{
        const profile = await axios.put('/update-profile-pix', data);
        return profile.data;
    
        }catch (error: any){
            return error.message
        }
}