import React, { Component } from 'react';
import { connect } from 'react-redux';
import { retriveRecentFileList, retriveStarredList, folderClicked, handleFileUpload, shareWithUser,
 downloadFile, changeUserProfile, retrieveUserProfile, starFile, fetchAcivity, fileDelete, findUser } from '../actions/allActions';

const mapStateToProps = (state) => {
  return {
    userId: sessionStorage.getItem('userId'),
    firstName: state.actionReducer.firstName,
    lastName: state.actionReducer.lastName,
    email: state.actionReducer.email,
    isloggedIn: state.actionReducer.isloggedIn,    
    starredFileList: state.actionReducer.starredFileList,
    fileList: state.actionReducer.fileList.reverse(),
    currentFileId: sessionStorage.getItem('currentFileId'),
    newFolderName: state.actionReducer.newFolderName,
    userOverview: state.actionReducer.userOverview,
    workData: state.actionReducer.workData,
    educationData: state.actionReducer.educationData,
    contactNumber: state.actionReducer.contactNumber,
    interests: state.actionReducer.interests,
    starFlag: state.actionReducer.starFlag,
    activityList: state.actionReducer.activityList,
    userList :state.actionReducer.userList
  }
}

const mapDispatchToProps = (dispatch) => {
  let actions = { retriveRecentFileList, retriveStarredList, folderClicked, handleFileUpload, shareWithUser,
  	downloadFile, changeUserProfile, retrieveUserProfile, starFile, fetchAcivity, fileDelete, findUser };
  return { ...actions, dispatch };
}

class Home extends Component {
	constructor(props) {
    	super(props);    	
	    this.state = {
	      showLogout:false,
	      showOptions:"",
	      shareSearch:"",
	      recentShowOptions:""
	     }
    	this.handleFileUpload = this.handleFileUpload.bind(this);
    	this.folderClicked = this.folderClicked.bind(this);
    	this.handleDropdownClick = this.handleDropdownClick.bind(this);
    	this.handleLogout = this.handleLogout.bind(this);
	    this.handleFNChange = this.handleFNChange.bind(this);
	    this.handleLNChange = this.handleLNChange.bind(this);
	    this.handleUserOverviewChange = this.handleUserOverviewChange.bind(this);
	    this.handleWorkDataChange = this.handleWorkDataChange.bind(this);
	    this.handleEducationDataChange = this.handleEducationDataChange.bind(this);
	    this.handleInterestChange = this.handleInterestChange.bind(this);
	    this.handleContactChange = this.handleContactChange.bind(this);
	    this.changeUserProfile = this.changeUserProfile.bind(this);
	    this.starFile = this.starFile.bind(this);
	    this.handleOptionsDropdownClick = this.handleOptionsDropdownClick.bind(this);
	    this.fileDelete = this.fileDelete.bind(this);
	    this.handleShareSearchChange =this.handleShareSearchChange.bind(this);
	    this.findUser = this.findUser.bind(this);
	    this.handleRecentOptionsDropdownClick = this.handleRecentOptionsDropdownClick.bind(this);
	    this.groupNavClick = this.groupNavClick.bind(this);
	}


    handleFNChange(event){
    	this.setState({firstName: event.target.value});
    }

    handleShareSearchChange(event){
    	this.setState({shareSearch: event.target.value});
    }

    handleLNChange(event){
    	this.setState({lastName: event.target.value});
    }
    handleUserOverviewChange(event){
    	this.setState({userOverview: event.target.value});
    }
    handleWorkDataChange(event){
    	this.setState({workData: event.target.value});
    }
    handleEducationDataChange(event){
    	this.setState({educationData: event.target.value});
    }
    handleInterestChange(event){
    	this.setState({interests: event.target.value});
    }
    handleContactChange(event){
    	this.setState({contactNumber: event.target.value});
    }

	handleFileUpload(e) {
	  this.props.dispatch(this.props.handleFileUpload(this.props, e.target.files[0]))
	  .then(() => this.props.dispatch(this.props.retriveRecentFileList(this.props)));
	}

  componentDidMount(){
  	this.props.dispatch(this.props.retriveRecentFileList(this.props));
  	this.props.dispatch(this.props.retriveStarredList(this.props));
  	this.props.dispatch(this.props.retrieveUserProfile(this.props));
  }

  componentWillReceiveProps(nextProps){
  	if(sessionStorage.getItem('jwtToken')==null){
  		this.props.history.push('/login');
  	}
  }

  folderClicked(fileId){
  	sessionStorage.setItem('currentFileId', fileId);
  	this.props.history.push('/files');
  }

  groupNavClick(){
  	sessionStorage.setItem('currentFileId', this.props.userId);
  	this.props.history.push('/groups');
  }

  handleDropdownClick(e){
  	this.setState({showLogout:!this.state.showLogout});
  }

  handleOptionsDropdownClick(fileId){
  	if(this.state.showOptions===fileId){
  		this.setState({showOptions:""});
  	} else {
  		this.setState({showOptions:fileId, recentShowOptions:""});
  	}
  }

  handleRecentOptionsDropdownClick(fileId){
  	if(this.state.recentShowOptions===fileId){
  		this.setState({recentShowOptions:""});
  	} else {
  		this.setState({recentShowOptions:fileId, showOptions:""});
  	}
  }

  handleLogout(){
  	sessionStorage.removeItem('currentFileId');
  	sessionStorage.removeItem('jwtToken');
  	sessionStorage.removeItem('userId');
  	this.setState({showLogout:!this.state.showLogout});
  	this.props.history.push('/login');
  }

  changeUserProfile(){
  	this.props.dispatch(this.props.changeUserProfile(this.state));  	
  }

  findUser(){
  	this.props.dispatch(this.props.findUser(this.state));
  }

  starFile(file){
  	this.props.dispatch(this.props.starFile(file))
  	.then(() => this.props.dispatch(this.props.retriveRecentFileList(this.props)))
  	.then(() => this.props.dispatch(this.props.retriveStarredList(this.props)));
  }

  fileDelete(file){
  	this.props.dispatch(this.props.fileDelete(file))
  	.then(() => this.props.dispatch(this.props.retriveRecentFileList(this.props)))
  	.then(() => this.props.dispatch(this.props.retriveStarredList(this.props)));
  }

  shareWithUser(otherUserId){
  	this.props.dispatch(this.props.shareWithUser(this.state, otherUserId));
  }

  render() {
    return (
    	<div className="homePage">
	    	<div className="vertical-menu col-md-3">
			  <div className="navigationPanel">
			   <a className="navHomeButton" onClick={() => this.props.history.push('/home')}>
			      <img className="navLogo" alt="Dropbox" src="images/dropbox_logo.svg" width="32px" height="32px"/>
			   </a>
			   <div className="navContents">
			      <ul className="navFeatures">
			         <li>
			            <h2 className="navFeatures-header"><a onClick={() => this.props.history.push('/home')} className="navFeatures-header-link">Home</a></h2>
			         </li>
			         <li>
			            <h2 className="navFeatures-header">
			                <a onClick={this.folderClicked.bind(this, this.props.userId)} className="navFeature nav__active-feature">Files
			                </a>
			            </h2>
			         </li>
			         <li>
			            <h2 className="navFeatures-header">
			                <a onClick={this.groupNavClick} className="navFeature nav__active-feature">Groups
			                </a>
			            </h2>
			         </li>
			      </ul>
			   </div>
			</div>
			<div className="nav-footer">
			  <div className="nav">
			     <span role="button" className="navButton">
			        <div className="navButtonContent">
			           <div className="navButtonInfo">
			              <div className="navButtonTitle">Personal</div>
			              <div className="navButtonLabel">Only you</div>
			           </div>
			        </div>
			     </span>
			  </div>
			</div>
			</div>
	        <div className="rightPart">
	           <div className="inline-upload-status-container"></div>
	           <header className="pageHeader col-md-12">
                    <h1 className="pageHeader__heading">Home</h1>
                    <div className="top-menu-container col-md-6">
                       <img className="userIcon" onClick={this.handleDropdownClick} src="images/userIcon.png" alt="userIcon"/>
                        {this.state.showLogout ? <ul className="userDropdown">
						  <li value="profile" onClick={() => this.setState({showLogout:!this.state.showLogout})} data-toggle="modal" data-target="#profileModal">Profile</li>
						  <li value="logout" onClick={this.handleLogout}>Logout</li>
						</ul>:null}
                       <div className="searchBar--container">
                         <form className="searchBar__input">
                            <input className="searchBar__text-input" placeholder="Search" value=""/>
                            <button className="searchBar__button" type="submit">
                            	<img className="dropbox_logo" src="images/search.png" alt="dropbox_title"/>
                            </button>
                         </form>
                       </div>
                    </div>
                </header>
                <div className="rightPartContainer col-md-12">
                	<div className="row">
	                  <div className="app-content col-md-9">
	                  	<div className="starredPortion">
	                  		<div className="starredTitle">Starred
	                  		</div>
	                  		<ul className="starredList">
	                  			{this.props.starredFileList ? this.props.starredFileList.map(file =>
		                  			<li key={file.fileId} className="starredListItem">
		                  				{ file.isFile ? 
		                  					<span><img className="dropbox_logo logoClass" src="images/file.png" alt="userIcon"/> 
		                       				<span className="starredListText" id={file.fileId} onClick={() => this.props.dispatch(this.props.downloadFile(file))}>{file.fileName}</span></span>: 
		                       			<span><img className="dropbox_logo logoClass" src="images/folder.png" alt="userIcon"/>
		                       			<span className="starredListText" id={file.fileId} onClick={this.folderClicked.bind(this, file.fileId)}>{file.fileName}</span></span>}
		                       			<img onClick={this.starFile.bind(this, file)} className="dropbox_logo logoClass" src="images/star.png" alt="star"/>
		                       			<img className="dropbox_logo logoClass dotsLogo" src="images/dots.png" alt="dots" onClick={this.handleOptionsDropdownClick.bind(this,file.fileId)}/>
		                       			{(this.state.showOptions===file.fileId) ? <ul className="dotsDropdown">
		                       			  { file.isFile ? 
		                       			  	<li onClick={() => this.props.dispatch(this.props.downloadFile(file))}>download</li>:
		                       			  	<li onClick={this.folderClicked.bind(this, file.fileId)}>Open</li>} 
										  <li data-toggle="modal" data-target="#shareModal">Share</li>
										  {file.isOwner===1? <li onClick={this.fileDelete.bind(this, file)}>Delete...</li>:null}
										</ul>:null}
		                  			</li>
						          ):null}
	                  		</ul>
	                  	</div>
	                  	<div className="starredPortion">
	                  		<div className="starredTitle">Recent
	                  		</div>
	                  		<ul className="starredList">	                  			
	                  			{this.props.fileList ? this.props.fileList.map(file =>
		                  			(file.parentFileId==null ? null : <li key={file.fileId} className="starredListItem">
		                  				{ file.isFile ? 
		                  					<span><img className="dropbox_logo logoClass" src="images/file.png" alt="userIcon"/> 
		                       				<span className="starredListText" id={file.fileId} onClick={() => this.props.dispatch(this.props.downloadFile(file))}>{file.fileName}</span></span>: 
		                       			<span><img className="dropbox_logo logoClass" src="images/folder.png" alt="userIcon"/>
		                       			<span className="starredListText" id={file.fileId} onClick={this.folderClicked.bind(this, file.fileId)}>{file.fileName}</span></span>}
		                       			{ file.isStarred ? 
		                       				<img onClick={this.starFile.bind(this, file)} className="dropbox_logo logoClass" src="images/star.png" alt="star"/>:
		                       				<img onClick={this.starFile.bind(this, file)} className="dropbox_logo logoClass" src="images/starEmpty.png" alt="star"/>
		                       			}
		                       			<img className="dropbox_logo logoClass dotsLogo" src="images/dots.png" alt="dots" onClick={this.handleRecentOptionsDropdownClick.bind(this,file.fileId)}/>
		                       			{(this.state.recentShowOptions===file.fileId) ? <ul className="dotsDropdown">
		                       			  { file.isFile ? 
		                       			  	<li onClick={() => this.props.dispatch(this.props.downloadFile(file))}>download</li>:
		                       			  	<li onClick={this.folderClicked.bind(this, file.fileId)}>Open</li>} 
										  <li data-toggle="modal" data-target="#shareModal">Share</li>
										  {file.isOwner===1? <li onClick={this.fileDelete.bind(this, file)}>Delete...</li>:null}
										</ul>:null}
		                  			</li>)
						          ):null}
	                  		</ul>
	                  	</div>
	                  </div>
	                    <div className="secondary-sidebar col-md-3">
	                        <label className="btn login-button col-md-12"><input type="file" onChange={this.handleFileUpload}/>Upload files</label>
	               			<div><img className="dropbox_logo logoClassRightPanel" src="images/folder.png" alt="shared folder"/><span className="rightPanelText">New folder</span></div>
	               			<div><img className="dropbox_logo logoClassRightPanel" src="images/activity.png" alt="shared folder"/>
	               					<span onClick={() => this.props.dispatch(this.props.fetchAcivity())} className="rightPanelText" data-toggle="modal" data-target="#activityModal">Recent Activity
	               					</span>
	               				</div>
	               			<div>
	                   </div>

	                   <div id="shareModal" className="modal fade" role="dialog">
						  <div className="modal-dialog">
						    <div className="modal-content">
						      <div className="modal-header">
						        <h4 className="modal-title">Share Folder</h4>
						        <button type="button" className="close" data-dismiss="modal">&times;</button>
						      </div>
						      <div className="modal-body">
						     	<div className="row col-md-12">
						        	Enter name or email id:<input className="text-input-input autofocus col-md-9" type="text" value={this.props.shareSearch} onChange={this.handleShareSearchChange} />
						        	<button type="button" className="btn btn-primary offset-md-1 col-md-2" onClick={this.findUser}>Find</button>
						        </div>
						        <ul className="userList">
							        {this.props.userList ? this.props.userList.map(singleUser =>
							      		<li onClick={this.shareWithUser.bind(this, singleUser.userId)} key={singleUser.userId} className="userListItem">
							      			<a>{singleUser.firstName} {singleUser.lastName}, ({singleUser.email})</a>
							      		</li>
							      	):null}
							    </ul>
						      </div>
						    </div>
						  </div>
						</div>

	                   <div id="activityModal" className="modal fade" role="dialog">
						  <div className="modal-dialog">
						    <div className="modal-content">
						      <div className="modal-header">
						        <h4 className="modal-title">User Activity</h4>
						        <button type="button" className="close" data-dismiss="modal">&times;</button>
						      </div>
						      <div className="modal-body">
						      	{this.props.activityList ? this.props.activityList.map(activity =>
						      		<div key={activity.activityId} className="starredListItem">{activity.activity}</div>
						      	):null}
						      </div>
						    </div>
						  </div>
						</div>

	                   <div id="profileModal" className="modal fade" role="dialog">
						  <div className="modal-dialog">
						    <div className="modal-content">
						      <div className="modal-header">
						        <h4 className="modal-title">User Profile</h4>
						        <button type="button" className="close" data-dismiss="modal">&times;</button>
						      </div>
						      <div className="modal-body">
						        First Name:<input className="text-input-input autofocus" type="text" value={this.props.firstName} onChange={this.handleFNChange} />
						        Last Name:<input className="text-input-input autofocus" type="text" value={this.props.lastName} onChange={this.handleLNChange} />
						        email:<input disabled className="text-input-input autofocus" type="text" value={this.props.email} />
						        User Overview: <input className="text-input-input autofocus" type="text" value={this.props.userOverview} onChange={this.handleUserOverviewChange} />
						        Work Data:<input className="text-input-input autofocus" type="text" value={this.props.workData} onChange={this.handleEducationDataChange} />
						        Education Data:<input className="text-input-input autofocus" type="text" value={this.props.educationData} onChange={this.handleWorkDataChange} />
						        Contact Number:<input className="text-input-input autofocus" type="text" value={this.props.contactNumber} onChange={this.handleContactChange} />
						        Interests:<input className="text-input-input autofocus" type="text" value={this.props.interests} onChange={this.handleInterestChange} />
						      </div>
						      <div className="modal-footer">												        
						        <button type="button" className="btn btn-primary" onClick={this.changeUserProfile}>Save changes</button>
						        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
						      </div>
						    </div>
						  </div>
						</div>
	                </div>
                </div>
            </div>
        </div>
    </div>
    )
  }
}

export default connect(
  mapStateToProps, 
  mapDispatchToProps
)(Home);