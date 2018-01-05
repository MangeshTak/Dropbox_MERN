import React, { Component } from 'react';
import { connect } from 'react-redux';
import { retriveFileList, retriveStarredList, folderClicked, handleFileUpload, downloadFile, createNewFolder, changeUserProfile, fileNavClick,
	fileDelete, retrieveUserProfile, starFile, fetchAcivity, findUser, shareWithUser, retriveSharedFileList, homeNavClick, groupNavClick } from '../actions/allActions';

const mapStateToProps = (state) => {
  return {
    userId: sessionStorage.getItem('userId'),
    firstName: state.actionReducer.firstName,
    lastName: state.actionReducer.lastName,
    email: state.actionReducer.email,
    isloggedIn: state.actionReducer.isloggedIn,    
    starredFileList: state.actionReducer.starredFileList,
    fileList: state.actionReducer.fileList,
    currentFileId: sessionStorage.getItem('currentFileId'),
    newFolderName: state.actionReducer.newFolderName,
    userOverview: state.actionReducer.userOverview,
    workData: state.actionReducer.workData,
    educationData: state.actionReducer.educationData,
    contactNumber: state.actionReducer.contactNumber,
    interests: state.actionReducer.interests,
    starFlag: state.actionReducer.starFlag,
    activityList: state.actionReducer.activityList,
    sharedFileList: state.actionReducer.sharedFileList,
    hierarchy: state.actionReducer.hierarchy,
    userList: state.actionReducer.userList
  }
}

const mapDispatchToProps = (dispatch) => {
  let actions = { retriveFileList, retriveStarredList, folderClicked, handleFileUpload, downloadFile, createNewFolder, groupNavClick, fileNavClick,
  	fileDelete, changeUserProfile, retrieveUserProfile, starFile, fetchAcivity, findUser, shareWithUser, retriveSharedFileList, homeNavClick};
  return { ...actions, dispatch };
}

class Files extends Component {

	constructor(props) {
		super(props); 	  	
	    this.state = {
	      showLogout:false,
	      showOptions:"",
	      shareSearch:""
	     }
		this.handleFileUpload = this.handleFileUpload.bind(this);
    	this.createNewFolder = this.createNewFolder.bind(this);
    	this.createNewFolderSubmit = this.createNewFolderSubmit.bind(this);
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
    	this.shareWithUser = this.shareWithUser.bind(this);
    	this.folderClicked = this.folderClicked.bind(this);
    	this.homeNavClick =this.homeNavClick.bind(this);
    	this.groupNavClick =this.groupNavClick.bind(this);
    	this.fileNavClick =this.fileNavClick.bind(this);
	}

  fileNavClick(){
  	this.setState({hierarchy:[]});
  	sessionStorage.setItem('currentFileId', this.props.userId);
  	this.props.dispatch(this.props.fileNavClick());
	this.props.dispatch(this.props.retriveFileList(this.props))
	 .then(() => this.props.dispatch(this.props.retriveSharedFileList(this.props)));
  }

  homeNavClick(){
  	this.setState({hierarchy:[]});
  	sessionStorage.setItem('currentFileId', this.props.userId);
  	this.props.dispatch(this.props.homeNavClick());
	this.props.history.push('/home');
  }

  groupNavClick(){
  	this.setState({hierarchy:[]});
  	sessionStorage.setItem('currentFileId', this.props.userId);
  	this.props.dispatch(this.props.groupNavClick());
	this.props.history.push('/groups');
  }
	  handleDropdownClick(e){
	  	this.setState({showLogout:!this.state.showLogout});
	  }

	  handleOptionsDropdownClick(fileId){
	  	if(this.state.showOptions===fileId){
	  		this.setState({showOptions:""});
	  	} else {
	  		this.setState({showOptions:fileId});
	  	}
	  }

	  fileDelete(file){
	  	this.props.dispatch(this.props.fileDelete(file))
	  	.then(() => this.props.dispatch(this.props.retriveFileList(this.props)))
	  	.then(() => this.props.dispatch(this.props.retriveSharedFileList(this.props)));
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

    handleFNChange(event){
    	this.setState({firstName: event.target.value});
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
	  .then(() => this.props.dispatch(this.props.retriveFileList(this.props)))
	  .then(() => this.props.dispatch(this.props.retriveSharedFileList(this.props)));
	}

	createNewFolder(e) {
    	this.setState({newFolderName: e.target.value});
	}

	createNewFolderSubmit(){
		this.props.dispatch(this.props.createNewFolder(this.props, this.state.newFolderName))
		.then(() => this.props.dispatch(this.props.retriveFileList(this.props)))
	  	.then(() => this.props.dispatch(this.props.retriveSharedFileList(this.props)));
	}

  componentDidMount(){
  	this.props.dispatch(this.props.retriveFileList(this.props));
  	this.props.dispatch(this.props.retrieveUserProfile(this.props));
  	this.props.dispatch(this.props.retriveSharedFileList(this.props));
  }

  componentWillReceiveProps(nextProps){
  	if(sessionStorage.getItem('jwtToken')==null){
  		this.props.history.push('/login');
  	}
  }

  starFile(file){
  	this.props.dispatch(this.props.starFile(file))
  	.then(() => this.props.dispatch(this.props.retriveFileList(this.props)))
	.then(() => this.props.dispatch(this.props.retriveSharedFileList(this.props)));
  }

	handleShareSearchChange(event){
		this.setState({shareSearch: event.target.value});
	}

  findUser(){
  	this.props.dispatch(this.props.findUser(this.state));
  }

  shareWithUser(otherUserId){
  	this.props.dispatch(this.props.shareWithUser(this.state, otherUserId));
  }

  folderClicked(file){
  	var steps = [];
  	if(this.state.hierarchy){
	  	for(var i=0; i<this.state.hierarchy.length; i++){
	  		if(this.state.hierarchy[i].fileId===file.fileId){
	  			break;
	  		}
	  		steps.push(this.state.hierarchy[i]);
	  	}
	}
  	steps.push({fileName:file.fileName, fileId:file.fileId});
	this.setState({hierarchy: steps});
  	sessionStorage.setItem('currentFileId', file.fileId);
  	this.props.dispatch(this.props.folderClicked(file, steps));
  }

  render() {
    return (
    	<div className="homePage"><div className="vertical-menu col-md-3">
			  <div className="navigationPanel">
			   <a className="navHomeButton" onClick={this.homeNavClick}>
			      <img className="navLogo" alt="Dropbox" src="images/dropbox_logo.svg" width="32px" height="32px"/>
			   </a>
			   <div className="navContents">
			      <ul className="navFeatures">
			         <li>
			            <h2 className="navFeatures-header"><a onClick={this.homeNavClick} className="navFeature nav__active-feature">Home</a></h2>
			         </li>
			         <li>
			            <h2 className="navFeatures-header"><a className="navFeatures-header-link">Files</a></h2>
			         </li>
			         <li>
			            <h2 className="navFeatures-header"><a onClick={this.groupNavClick} className="navFeature nav__active-feature">Groups</a></h2>
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
                    <h1 className="pageHeader__heading">Files</h1>
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
	                  		<div className="starredTitle"><span className="hierarchyLink" onClick={this.fileNavClick}>My files: </span>
	                  			{this.props.hierarchy.map(step =>
	                  				<span key={step.fileId}><span id={step.fileId} onClick={this.folderClicked.bind(this, step)} href="" className="hierarchyLink">{step.fileName}</span>
	                  				<span> ></span></span>
	                  			)}
	                  		</div>
	                  		<ul className="starredList">	                  			
	                  			{this.props.fileList.map(file =>
	                  				(file.isFile ? 
	                  					null: 
		                  			<li key={file.fileId} className="starredListItem">
		                       			<span><img className="dropbox_logo logoClass" src="images/folder.png" alt="userIcon"/>
		                       			<span className="starredListText" id={file.fileId} onClick={this.folderClicked.bind(this, file)}>{file.fileName}</span></span>
		                       			{ file.isStarred ? 
		                       				<img onClick={this.starFile.bind(this, file)} className="dropbox_logo logoClass" src="images/star.png" alt="star"/>:
		                       				<img onClick={this.starFile.bind(this, file)} className="dropbox_logo logoClass" src="images/starEmpty.png" alt="star"/>}
		                       			<img className="dropbox_logo logoClass dotsLogo" src="images/dots.png" alt="dots" onClick={this.handleOptionsDropdownClick.bind(this,file.fileId)}/>
		                       			{(this.state.showOptions===file.fileId) ? <ul className="dotsDropdown">
		                       			  <li onClick={this.folderClicked.bind(this, file)}>Open</li> 
										  <li data-toggle="modal" data-target="#shareModal">Share</li>
										  {file.isOwner===1? <li onClick={this.fileDelete.bind(this, file)}>Delete...</li>:null}
										</ul>:null}
		                  			</li>)
						          )}                  			
	                  			{this.props.fileList.map(file =>
		                  			( file.isFile ? 
		                  			<li key={file.fileId} className="starredListItem">
	                  					<span><img className="dropbox_logo logoClass" src="images/file.png" alt="userIcon"/> 
	                       				<span className="starredListText" id={file.fileId} onClick={() => this.props.dispatch(this.props.downloadFile(file))}>{file.fileName}</span></span>
		                       			{ file.isStarred ? 
		                       				<img onClick={this.starFile.bind(this, file)} className="dropbox_logo logoClass" src="images/star.png" alt="star"/>:
	                       				<img onClick={this.starFile.bind(this, file)} className="dropbox_logo logoClass" src="images/starEmpty.png" alt="star"/>}
		                       			<img className="dropbox_logo logoClass dotsLogo" src="images/dots.png" alt="dots" onClick={this.handleOptionsDropdownClick.bind(this,file.fileId)}/>
		                       			{(this.state.showOptions===file.fileId) ? <ul className="dotsDropdown">
		                       			  	<li onClick={() => this.props.dispatch(this.props.downloadFile(file))}>download</li>
										  <li data-toggle="modal" data-target="#shareModal">Share</li>
										  {file.isOwner===1? <li onClick={this.fileDelete.bind(this, file)}>Delete...</li>:null}
										</ul>:null}
		                  			</li>:null)
						          )}
	                  		</ul>
	                  	</div>                  	                  	
	                  	<div className="starredPortion">
	                  		<div className="starredTitle">Files/folders shared with me
	                  		</div>
	                  		<ul className="starredList">	                  			
	                  			{this.props.sharedFileList.map(file =>
	                  				(file.isFile ? 
	                  					null: 
		                  			<li key={file.fileId} className="starredListItem">
		                       			<span><img className="dropbox_logo logoClass" src="images/folder.png" alt="userIcon"/>
		                       			<span className="starredListText" id={file.fileId} onClick={this.folderClicked.bind(this, file)}>{file.fileName}</span></span>
		                       			<img className="dropbox_logo logoClass dotsLogo" src="images/dots.png" alt="dots" onClick={this.handleOptionsDropdownClick.bind(this,file.fileId)}/>
		                       			{(this.state.showOptions===file.fileId) ? <ul className="dotsDropdown">
		                       			  <li onClick={this.folderClicked.bind(this, file)}>Open</li> 
										  <li data-toggle="modal" data-target="#shareModal">Share</li>
										  {file.isOwner===1? <li onClick={this.fileDelete.bind(this, file)}>Delete...</li>:null}
										</ul>:null}
		                  			</li>)
						          )}                  			
	                  			{this.props.sharedFileList.map(file =>
		                  			( file.isFile ? 
		                  			<li key={file.fileId} className="starredListItem">
	                  					<span><img className="dropbox_logo logoClass" src="images/file.png" alt="userIcon"/> 
	                       				<span className="starredListText" id={file.fileId} onClick={() => this.props.dispatch(this.props.downloadFile(file))}>{file.fileName}</span></span>
		                       			{ file.isStarred ? 
		                       				<img onClick={this.starFile.bind(this, file)} className="dropbox_logo logoClass" src="images/star.png" alt="star"/>:
	                       				<img onClick={this.starFile.bind(this, file)} className="dropbox_logo logoClass" src="images/starEmpty.png" alt="star"/>}
		                       			<img className="dropbox_logo logoClass dotsLogo" src="images/dots.png" alt="dots" onClick={this.handleOptionsDropdownClick.bind(this,file.fileId)}/>
		                       			{(this.state.showOptions===file.fileId) ? <ul className="dotsDropdown">
		                       			  	<li onClick={() => this.props.dispatch(this.props.downloadFile(file))}>download</li>
										  <li data-toggle="modal" data-target="#shareModal">Share</li>
										  {file.isOwner===1? <li onClick={this.fileDelete.bind(this, file)}>Delete...</li>:null}
										</ul>:null}
		                  			</li>:null)
						          )}
	                  		</ul>
	                  	</div>
	                  </div>
	                    <div className="secondary-sidebar col-md-3">
	                        <label className="btn login-button col-md-12"><input type="file" onChange={this.handleFileUpload}/>Upload files</label>
	               			<div data-toggle="modal" data-target="#newFolderModal"><img className="dropbox_logo logoClassRightPanel" src="images/folder.png" alt="folder"/><span className="rightPanelText">New folder</span></div>
	               			<div data-toggle="modal" data-target="#activityModal"><img className="dropbox_logo logoClassRightPanel" src="images/activity.png" alt="shared folder"/>
	               					<span onClick={() => this.props.dispatch(this.props.fetchAcivity())} className="rightPanelText">Recent Activity
	               					</span>
	               				</div>
	               			<div>
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
						</div>
	                   <div id="newFolderModal" className="modal fade" role="dialog">
						  <div className="modal-dialog">
						    <div className="modal-content">
						      <div className="modal-header">
						        <h4 className="modal-title">Enter folder name</h4>
						        <button type="button" className="close" data-dismiss="modal">&times;</button>
						      </div>
						      <div className="modal-body">
						        <input required placeholder="Folder name" className="text-input-input autofocus" type="text" name="newFolderName" onChange={this.createNewFolder} />
						      </div>
						      <div className="modal-footer">
						        <button type="button" className="btn login-button" data-dismiss="modal" onClick={this.createNewFolderSubmit}>Close</button>
						      </div>
						    </div>
						  </div>
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
    )
  }
}

export default connect(
  mapStateToProps, 
  mapDispatchToProps
)(Files);