
import axiosInstance from './axiosInstance';


export const getProfileData = async (userType, userId) => {
  try {
    let profileData = {};

    
    if (userType === 'instructor') {
      const [profileResponse, coursesResponse] = await Promise.all([
        axiosInstance.get(`/instructor/profile`), 
        axiosInstance.get('/instructor/courses')   
      ]);

      profileData = {
        profile: profileResponse.data,
        courses: coursesResponse.data,
      };
    }
    // Fetch Student Profile, Courses, and Progress - USING EXISTING ENDPOINTS
    else if (userType === 'student') {
      const [coursesResponse, progressResponse] = await Promise.all([
        axiosInstance.get(`/student/${userId}/courses`), 
        axiosInstance.get('/student/progress')           
      ]);

    
      const profileResponse = await axiosInstance.get(`/student/${userId}`);
      
      profileData = {
        profile: profileResponse.data,
        courses: coursesResponse.data,
        progress: progressResponse.data,
      };
    } else {
      throw new Error('Invalid user type');
    }

    return profileData;
  } catch (error) {
    throw new Error(`Error fetching profile data: ${error.message}`);
  }
};

export const updateProfileSocials = async (userType, socials) => {
  try {
    if (userType === 'instructor') {
      await axiosInstance.put('/instructor/socials', { socials });
      return { message: 'Instructor social links updated successfully' };
    } else {
      throw new Error('Social link updates are only available for instructors');
    }
  } catch (error) {
    throw new Error(`Error updating social links: ${error.message}`);
  }
};