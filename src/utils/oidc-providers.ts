import { UserManager, UserManagerSettings } from 'oidc-client-ts';
import { sleep } from './helpers';
import axios from 'axios';
import { resolve } from 'path';



declare const FB: any;

const GOOGLE_CONFIG: UserManagerSettings = {
  authority: 'https://accounts.google.com',
  client_id: '',
  client_secret: '',
  redirect_uri: `${window.location.protocol}//${window.location.host}/callback`,
  scope: 'openid email profile',
  loadUserInfo: true,
};

export const GoogleProvider = new UserManager(GOOGLE_CONFIG);

export const facebookLogin = () => {
  return new Promise((res, rej) => {
    let authResponse: any;
    FB.login(
      (r: any) => {
        if (r.authResponse) {
          authResponse = r.authResponse;
          FB.api(
            '/me?fields=id,name,email,picture.width(640).height(640)',
            (profileResponse: any) => {
              authResponse.profile = profileResponse;
              authResponse.profile.picture = profileResponse.picture.data.url;
              res(authResponse);
            }
          );
        } else {
          console.log('User cancelled login or did not fully authorize.');
          rej(undefined);
        }
      },
      { scope: 'public_profile,email' }
    );
  });
};

export const getFacebookLoginStatus = () => {
  return new Promise((res, rej) => {
    let authResponse: any = {};
    FB.getLoginStatus((r: any) => {
      if (r.authResponse) {
        authResponse = r.authResponse;
        FB.api(
          '/me?fields=id,name,email,picture.width(640).height(640)',
          (profileResponse: any) => {
            authResponse.profile = profileResponse;
            authResponse.profile.picture = profileResponse.picture.data.url;
            res(authResponse);
          }
        );
      } else {
        res(undefined);
      }
    });
  });
};

export const authLogin = (email: string, password: string) => {
  const data = {email, password};

  return new Promise((resolve, reject) => {
    axios.post(`${process.env.REACT_APP_API_URL}/login`, data, {
      headers: {
        "Content-Type": 'application/json',
        "Accept": 'application/json'
      }
    }).then(res => {
      
        console.log(res);
      localStorage.setItem(
              'authentication',
              JSON.stringify(res.data.token)           
            );
      localStorage.setItem(
              'profile',
              JSON.stringify({...res.data.user  })          
            );
            resolve({profile: {...res.data.user}, authentication: res.data.token  });
      
     
      
    }).catch((err: any) => {
      reject({ message: 'Credentials are wrong!' })});
    // return new Promise(async (res, rej) => {
    //   await sleep(500);
    //   if (email === 'admin@example.com' && password === 'admin') {
    //     localStorage.setItem(
    //       'authentication',
    //       JSON.stringify({ profile: { email: 'admin@example.com' } })
    //     );
    //     return res({ profile: { email: 'admin@example.com' } });
    //   }
    //   return rej({ message: 'Credentials are wrong!' });
    // });
  })
  
  axios.post(`${process.env.REACT_APP_API_URL}/login`, data, {
    headers: {
      "Content-Type": 'application/json',
      "Accept": 'application/json'
    }
  }).then(res => {
    if(res.data.status === "success"){
      console.log(res);
    localStorage.setItem(
            'token',
            res.data.token.plainTextToken            
          );
    localStorage.setItem(
            'profile',
            JSON.stringify({profile: {email: res.data.user.email, ...res.data.profile}  })          
          );
          return {profile: {email: res.data.user.email, ...res.data.profile}  };
    }
    else{

      // return { message: 'Credentials are wrong!' };
    }
    
  }).catch((err: any) => {
    return { message: 'Credentials are wrong!' }});
  // return new Promise(async (res, rej) => {
  //   await sleep(500);
  //   if (email === 'admin@example.com' && password === 'admin') {
  //     localStorage.setItem(
  //       'authentication',
  //       JSON.stringify({ profile: { email: 'admin@example.com' } })
  //     );
  //     return res({ profile: { email: 'admin@example.com' } });
  //   }
  //   return rej({ message: 'Credentials are wrong!' });
  // });
};

export const getAuthStatus = () => {
  return new Promise(async (res, rej) => {
    await sleep(500);
    try {
      let authentication = localStorage.getItem('authentication');
      if (authentication) {
        authentication = JSON.parse(authentication);
        return res(authentication);
      }
      return res(undefined);
    } catch (error) {
      return res(undefined);
    }
  });
};

export const getProfileStatus = () => {
  return new Promise(async (res, rej) => {
    await sleep(500);
    try {
      let profile = localStorage.getItem('profile');
      if (profile) {
        profile = JSON.parse(profile);
        return res(profile);
      }
      return res(undefined);
    } catch (error) {
      return res(undefined);
    }
  });
};
