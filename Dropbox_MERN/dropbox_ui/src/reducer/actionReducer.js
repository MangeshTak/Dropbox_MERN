const defaultState = {
	firstName: "",
    lastName: "",
    email: "",
    userId: 0,
    userOverview: "",
    workData: "",
    educationData: "",
    contactNumber: "",
    interests: "",
    loginFailed:false,
    loginMsg:"",
    registerFailed:false,
    registerMsg:"",
    isloggedIn:false,
    starredFileList:[],
    fileList:[],
    currentFileId: "",
    newFolderName:"",
    starFlag:false,
    activityList:[],
    userList: [],
    sharedFileList: [],
    hierarchy:[],
    groupMemberList:[],
    groupOwnerId: ""
}

export default function actionReducer (state = defaultState, action){
	const newState = {...state};
	switch(action.type){
		case 'loginSuccess':
			newState.firstName= action.payload.firstName;
		    newState.lastName= action.payload.lastName;
		    newState.email= action.payload.email;
		    newState.userId= action.payload.userId;
		    newState.userOverview= action.payload.userOverview;
		    newState.workData= action.payload.workData;
		    newState.educationData= action.payload.educationData;
		    newState.contactNumber= action.payload.contactNumber;
		    newState.interests= action.payload.interests;
			newState.loginFailed= !action.payload.success;
			newState.loginMsg= action.payload.message;
			newState.isloggedIn= true;
			newState.currentFileId= action.payload.userId
			return newState;
		case 'loginFailed':
			newState.loginFailed= true;
			newState.loginMsg= action.payload.message;
			return newState;
		case 'registerSuccess':
			newState.firstName= "";
		    newState.lastName= "";
		    newState.email= "";
		    newState.userId= 0;
		    newState.userOverview= "";
		    newState.workData= "";
		    newState.educationData= "";
		    newState.contactNumber= "";
		    newState.interests= "";
			newState.registerFailed= !action.payload.success;
			newState.registerMsg= action.payload.message;
			return newState;
		case 'registerFailed':
			newState.registerFailed= true;
			newState.registerMsg= action.payload.message;
			return newState;
		case 'retriveGroupListSuccess':
		case 'retriveFileListSuccess':
			newState.fileList= action.payload.list;
			if(action.payload.currentFileId){
				newState.currentFileId= action.payload.currentFileId;
			}
			if(action.payload.hierarchy)
			newState.hierarchy = action.payload.hierarchy;
			return newState;
		case 'retriveRecentFileListSuccess':
			newState.fileList= action.payload.recentFileList.reverse().slice(0,5).reverse();
			return newState;
		case 'retriveStarredListSuccess':
			newState.starredFileList= action.payload.starredFileList;
			return newState;
		case 'fileUploadSuccess':
			return newState;
		case 'fileDownloadSuccess':
			return newState;
		case 'createNewFolderSuccess':
			return newState;
		case 'userProfileUpdateSuccess':			
			return newState;
		case 'retrieveUserProfileSuccess':	
			newState.firstName= action.payload.firstName;
		    newState.lastName= action.payload.lastName;
		    newState.email= action.payload.email;
		    newState.userOverview= action.payload.userOverview;
		    newState.workData= action.payload.workData;
		    newState.educationData= action.payload.educationData;
		    newState.contactNumber= action.payload.contactNumber;
		    newState.interests= action.payload.interests;
			return newState;
		case 'starFileSuccess':
			newState.starFlag= true;
			return newState;
		case 'fetchActivitySuccess':
			newState.activityList = action.payload.activityList;
			return newState;
		case 'fileDeleteSuccess':
			return newState;
		case 'searchUserSuccess':
			newState.userList= action.payload.userList;
			return newState;
		case 'shareWithUserSuccess':
			newState.userList= [];
			return newState;
		case 'retriveSharedFileListSuccess':
			newState.sharedFileList = action.payload.sharedFileList;
			return newState;
		case 'addPersonInGroupSuccess':
			return newState;
		case 'retriveGroupMembersSuccess':
			newState.groupMemberList= action.payload.groupMemberList;
			newState.groupOwnerId = action.payload.groupOwnerId;
			return newState;
		case 'deleteGroupMembersSuccess':
			return newState;
		case 'fileNavClick':
		case 'homeNavClick':
		case 'groupNavClick':
			sessionStorage.setItem('currentFileId', sessionStorage.getItem('userId'));
			newState.hierarchy=[];
			return newState;
		case 'starFileFailed':
		case 'fileUploadFailed':
		case 'fileDownloadFailed':
		case 'createNewFolderFailed':
		case 'retrieveUserProfileFailed':
		case 'userProfileUpdateFailed':
		case 'retriveFileListFailed':
		case 'retriveGroupListFailed':
		case 'retriveStarredListFailed':
		case 'fetchActivityFailed':
		case 'fileDeleteSuccessFailed':
		case 'searchUserFailed':
		case 'shareWithUserFailed':
		case 'retriveSharedFileListFailed':
		case 'addPersonInGroupFailed':
		case 'deleteGroupMembersFailed':
			if(action.payload.status===401){
   			   	sessionStorage.removeItem('currentFileId');
   				sessionStorage.removeItem('jwtToken');
   				sessionStorage.removeItem('userId');
			}
			newState.userId="";
			newState.currentFileId="";
			return newState;
		default:
			return newState;
	}
}