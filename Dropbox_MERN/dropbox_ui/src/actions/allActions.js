import axios from 'axios';
import fileDownload from 'react-file-download';

export function requestLogin(state){
	return function (dispatch) {
		let temp = {
			"email":state.username,
			"password":state.password
		};
		return axios.post("http://localhost:3001/login/", temp).then((response) => {
			if( response.data.token){
				sessionStorage.setItem('jwtToken', response.data.token);
				sessionStorage.setItem('userId', response.data.userId);
				sessionStorage.setItem('currentFileId', response.data.userId);
				dispatch({type:"loginSuccess", payload: response.data})
			}
		}).catch((err) => {
			 dispatch({type:"loginFailed", payload: err.response.data})
		})
	}
}

export function requestRegister(state){
	return function (dispatch) {
		let temp = {
			"email":state.username,
			"password":state.password,
			"firstName":state.firstName,
			"lastName":state.lastName
		};
		return axios.post("http://localhost:3001/register/", temp).then((response) => {
			 dispatch({type:"registerSuccess", payload: response.data})
		}).catch((err) => {
			 dispatch({type:"registerFailed", payload: err.response.data})
		})
	}
}

export function retriveFileList(state){
	return function (dispatch) {
		return axios.get("http://localhost:3001/getFileList/?userId="+sessionStorage.getItem('userId')+"&parentFileId="+sessionStorage.getItem('currentFileId')+"&token="+sessionStorage.getItem('jwtToken')).then((response) => {
			 dispatch({type:"retriveFileListSuccess", payload: response.data})
		}).catch((err) => {
			 dispatch({type:"retriveFileListFailed", payload: err.response})
		})
	}
}

export function retriveRecentFileList(state){
	return function (dispatch) {
		return axios.get("http://localhost:3001/getRecentFileList/?userId="+sessionStorage.getItem('userId')+"&token="+sessionStorage.getItem('jwtToken')).then((response) => {
			 dispatch({type:"retriveRecentFileListSuccess", payload: response.data})
		}).catch((err) => {
			 dispatch({type:"retriveRecentFileListFailed", payload: err.response})
		})
	}
}

export function retriveStarredList(state){
	return function (dispatch) {
		return axios.get("http://localhost:3001/getStarredList/?userId="+state.userId+"&token="+sessionStorage.getItem('jwtToken')).then((response) => {
			 dispatch({type:"retriveStarredListSuccess", payload: response.data})
		}).catch((err) => {
			 dispatch({type:"retriveStarredListFailed", payload: err.response.data})
		})
	}
}

export function folderClicked(state, hierarchy){
	sessionStorage.setItem('currentFileId', state.fileId);
	return function(dispatch){
		return axios.get("http://localhost:3001/getFileList/?userId="+sessionStorage.getItem('userId')+"&parentFileId="+state.fileId+"&token="+sessionStorage.getItem('jwtToken')).then((response) => {
			 dispatch({type:"retriveFileListSuccess", payload: {...response.data, currentFileId:state.fileId, hierarchy:hierarchy}})
		}).catch((err) => {
			 dispatch({type:"retriveFileListFailed", payload: err.response})
		})
	}
}

export function handleFileUpload(state, file){
	return function(dispatch){
		var data = new FormData();
		data.append("uploadThis", file);
		data.append("parentFolder",state.currentFileId);
		data.append("userId",state.userId);
		data.append("token",sessionStorage.getItem('jwtToken'));

		return axios.post("http://localhost:3001/uploadFile", data).then((response) => {
			 dispatch({type:"fileUploadSuccess", payload: response.data})
		}).catch((err) => {
			 dispatch({type:"fileUploadFailed", payload: err.response})
		})
	}
}

export function downloadFile(state){
	return function(dispatch){
		let fileName = state.fileId+"."+state.fileName.split(".")[1];
		return axios.get("http://localhost:3001/downloadFile?fileName="+fileName+"&actualFileName="+state.fileName+"&token="+sessionStorage.getItem('jwtToken'), { responseType: 'arraybuffer' }).then((response) => {
			 fileDownload(response.data, state.fileName);
			 dispatch({type:"fileDownloadSuccess", payload: response.data})
		}).catch((err) => {
			 dispatch({type:"fileDownloadFailed", payload: err.response})
		})
	}
}

export function createNewFolder(state, newFolderName){
	return function(dispatch){
		return axios.get("http://localhost:3001/createFolder?parentFolder="+state.currentFileId+"&newFolder="+newFolderName+"&userId="+state.userId+"&token="+sessionStorage.getItem('jwtToken')).then((response) => {
			dispatch({type:"createNewFolderSuccess", payload: response.data})
		}).catch((err) => {
			 dispatch({type:"createNewFolderFailed", payload: err.response})
		})
	}
}

export function retrieveUserProfile(state){
	return function(dispatch){
		return axios.get("http://localhost:3001/getUser?userId="+sessionStorage.getItem('userId')+"&token="+sessionStorage.getItem('jwtToken')).then((response) => {
			dispatch({type:"retrieveUserProfileSuccess", payload: response.data})
		}).catch((err) => {
			 dispatch({type:"retrieveUserProfileFailed", payload: err.response})
		})
	}
}

export function changeUserProfile(state){
	return function(dispatch){		
		let temp = {
			"userId": sessionStorage.getItem('userId'),
			"firstName":state.firstName,
			"lastName":state.lastName,
			"userOverview":state.userOverview,
			"workData":state.workData,
			"educationData":state.educationData,
			"contactNumber":state.contactNumber,
			"interests":state.interests
		};
		return axios.post("http://localhost:3001/updateUserData?token="+sessionStorage.getItem('jwtToken'), temp).then((response) => {
			dispatch({type:"userProfileUpdateSuccess", payload: response.data})
		}).catch((err) => {
			 dispatch({type:"userProfileUpdateFailed", payload: err.response})
		})
	}
}

export function starFile(file){
	return function(dispatch){
		let temp = (file.isStarred==1) ? 0 : 1;
		return axios.get("http://localhost:3001/starMe?fileId="+file.fileId+"&fileName="+file.fileName+"&userId="+sessionStorage.getItem('userId')+"&doStar="+temp+"&token="+sessionStorage.getItem('jwtToken')).then((response) => {
			dispatch({type:"starFileSuccess", payload: response.data})
		}).catch((err) => {
			 dispatch({type:"starFileFailed", payload: err.response})
		})
	}
}

export function fetchAcivity(){
	return function(dispatch){
		return axios.get("http://localhost:3001/fetchActivity?userId="+sessionStorage.getItem('userId')+"&token="+sessionStorage.getItem('jwtToken')).then((response) => {
			dispatch({type:"fetchActivitySuccess", payload: response.data})
		}).catch((err) => {
			 dispatch({type:"fetchActivityFailed", payload: err.response})
		}) 
	}
}

export function fileDelete(file){
	return function(dispatch){
		return axios.get("http://localhost:3001/deleteFile?fileId="+file.fileId+"&fileName="+file.fileName+"&userId="+sessionStorage.getItem('userId')+"&token="+sessionStorage.getItem('jwtToken')).then((response) => {
			dispatch({type:"fileDeleteSuccess", payload: response.data})
		}).catch((err) => {
			 dispatch({type:"fileDeleteSuccessFailed", payload: err.response})
		}) 
	}
}

export function findUser(state){
	return function(dispatch){
		return axios.get("http://localhost:3001/findUser?searchString="+state.shareSearch+"&token="+sessionStorage.getItem('jwtToken')).then((response) => {
			dispatch({type:"searchUserSuccess", payload:response.data});
		}).catch((err)=>{
			dispatch({type:"searchUserFailed", payload: err.response})
		})
	}
}

export function shareWithUser(state, otherUserId){
	return function(dispatch){
		return axios.get("http://localhost:3001/shareFile?otherUserId="+otherUserId+"&fileId="+(state.showOptions==="" ? state.recentShowOptions : state.showOptions)+"&token="+sessionStorage.getItem('jwtToken')).then((response) => {
			dispatch({type:"shareWithUserSuccess", payload:response.data});
		}).catch((err)=>{
			dispatch({type:"shareWithUserFailed", payload: err.response})
		})
	}
}

export function retriveSharedFileList(state){
	return function (dispatch) {
		return axios.get("http://localhost:3001/getSharedFileList/?userId="+sessionStorage.getItem('userId')+"&token="+sessionStorage.getItem('jwtToken')).then((response) => {
			 dispatch({type:"retriveSharedFileListSuccess", payload: response.data})
		}).catch((err) => {
			 dispatch({type:"retriveSharedFileListFailed", payload: err.response})
		})
	}
}

export function createNewGroup(state, newGroupName){
	return function(dispatch){
		return axios.get("http://localhost:3001/createGroup?groupName="+newGroupName+"&userId="+state.userId+"&token="+sessionStorage.getItem('jwtToken')).then((response) => {
			dispatch({type:"createNewFolderSuccess", payload: response.data})
		}).catch((err) => {
			 dispatch({type:"createNewFolderFailed", payload: err.response})
		})
	}
}

export function getUserGroups(state){
	return function(dispatch){
		return axios.get("http://localhost:3001/getGroupList/?userId="+sessionStorage.getItem('userId')+"&token="+sessionStorage.getItem('jwtToken')).then((response) => {
			 dispatch({type:"retriveGroupListSuccess", payload: response.data})
		}).catch((err) => {
			 dispatch({type:"retriveGroupListFailed", payload: err.response})
		})
	}
}

export function addPersonInGroup(state, newUserId){
	return function(dispatch){
		return axios.get("http://localhost:3001/addPersonInGroup/?groupName="+state.currentGroupName+"&groupId="+state.currentGroupId+"&newUserId="+newUserId+"&userId="+sessionStorage.getItem('userId')+"&token="+sessionStorage.getItem('jwtToken')).then((response) => {
			 dispatch({type:"addPersonInGroupSuccess", payload: response.data})
		}).catch((err) => {
			 dispatch({type:"addPersonInGroupFailed", payload: err.response})
		})
	}
}

export function retriveGroupMemberList(state){
	return function(dispatch){
		return axios.get("http://localhost:3001/getGroupMemebers/?groupId="+state.groupId+"&userId="+sessionStorage.getItem('userId')+"&token="+sessionStorage.getItem('jwtToken')).then((response) => {
			 dispatch({type:"retriveGroupMembersSuccess", payload: response.data})
		}).catch((err) => {
			 dispatch({type:"retriveGroupMembersFailed", payload: err.response})
		})
	}
}

export function deletePersonInGroup(state, deleteUserId){
	return function(dispatch){
		return axios.get("http://localhost:3001/deletePersonInGroup/?groupId="+state.currentFileId+"&userId="+sessionStorage.getItem('userId')+"&deleteUserId="+deleteUserId+"&token="+sessionStorage.getItem('jwtToken')).then((response) => {
			 dispatch({type:"deleteGroupMembersSuccess", payload: response.data})
		}).catch((err) => {
			 dispatch({type:"deleteGroupMembersFailed", payload: err.response})
		})
	}
}

export function fileNavClick(){
	return function(dispatch){
		dispatch({type:"fileNavClick", payload: {}})
	}
}
export function homeNavClick(){
	return {type:"homeNavClick", payload: {}}
}
export function groupNavClick(){
	return {type:"groupNavClick", payload: {}}
}