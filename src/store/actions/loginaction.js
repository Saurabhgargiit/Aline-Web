import * as actionTypes from "../actionTypes";
import { ApiRelativePaths } from "../../utils/globalConstants";
import axios from "axios";


const userUpdate = (userData) => {
  return {
    type: actionTypes.UPDATE_USER,
    data: userData
  }

}

const loginAction = (loginInfo) => {
  return {
    type: actionTypes.LOGIN,
    data: loginInfo
  }

}

const login = (loginData) => {

  return sendHttpsRequest(loginData);

}


const getLoginData = (url_path, data) => {
  return dispatch => {
    const urlPath = ApiRelativePaths[url_path];

    axios.post(urlPath, data)
      .then(res => {
        data = {
          result: "success",
          data: res.data
        }
      })
      .catch(err => {
        data = {
          result: "error",
          data: err.response?.data
        }
      })
      .then(() => {
        dispatch(loginAction(data))
      })

  }

}
