
var express = require('express')
  , http = require('http')
  , path = require('path')
  , bodyParser = require('body-parser')
  , mysql = require('mysql')
  , fs = require('fs-extra')
  , bcrypt = require('bcrypt');

var app = express();

// all environments
app.set('port', process.env.PORT || 3001);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, authorization');
    next();
});
app.disable('etag');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'maulik',
  password : 'Unix11!',
  database : 'dropbox'
});

var pool  = mysql.createPool({
  connectionLimit : 500,
  host            : 'localhost',
  user            : 'maulik',
  password        : 'Unix11!',
  database        : 'dropbox'
});

var salt = bcrypt.genSaltSync(10);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var jwt = require('jsonwebtoken');

app.set('superSecret', 'CMPE272_dropbox');

app.post('/login', function(req, res){
    pool.query("SELECT * FROM usertable WHERE email='"+req.body.email+"'", function(err, rows){
    	if (err) throw err;
        if(rows!=undefined && rows.length>0){
	    	bcrypt.compare(req.body.password, rows[0].userPassword, function(err, doesMatch){
	    		  if (doesMatch){
			        	 var data = {firstName : rows[0].firstName,
			     				lastName : rows[0].lastName,
			     				email : rows[0].email,
			     				userId : rows[0].userId};
						var token = jwt.sign(data, app.get('superSecret'), {
							 expiresIn : 60*60
						});
						res.json({
						    success: true,
						    message: 'Login successful!',
						    token: token,
						    firstName : rows[0].firstName,
							lastName : rows[0].lastName,
							email : rows[0].email,
							userId : rows[0].userId,
							userOverview : rows[0].userOverview,
							workData : rows[0].workData,
							educationData : rows[0].educationData,
							contactNumber : rows[0].contactNumber,
							interests : rows[0].interests
						});
	    		  }else{
			        	res.status(401).send({ success: false, message: 'Authentication failed.' });
	    		  }
			 });
    	} else {
        	res.status(400).send({ success: false, message: 'User does not exist!' });
    	}
    });
});

app.get('/getUser', function(req, res){
	verifyTocken(req, res, function(req, res) {
		if(req.query.userId!='undefined'){
			pool.query("SELECT * FROM usertable WHERE userId='"+req.query.userId+"'", function(err, rows){
				if (err) throw err;
		         if(rows!=undefined && rows.length>0){
					res.json({
					    success: true,
					    message: 'User retrieval successful!',
					    firstName : rows[0].firstName,
						lastName : rows[0].lastName,
						email : rows[0].email,
						userOverview : rows[0].userOverview,
						workData : rows[0].workData,
						educationData : rows[0].educationData,
						contactNumber : rows[0].contactNumber,
						interests : rows[0].interests
					});
		         }
			});
		} else {
			return res.status(400).send({ 
			      success: false, 
			      message: 'mandatory parameter missing.' 
			  });
		}
	});
});

app.post('/uploadFile', function(req, res){
	verifyTocken(req, res, function(req, res) {
		var tmp_path = req.files.uploadThis.path;
		var target_path;
		if(req.body.parentFolder!='undefined' && req.files.uploadThis!='undefined' && req.body.userId!='undefined'){
			const tempFileId = req.files.uploadThis.name.split(".")[0]+Date.now();
		    target_path = './files/'+tempFileId+"."+req.files.uploadThis.name.split(".")[1];	
		    fs.copy(tmp_path, target_path, function(err) {
		        if (err) throw err;
		    });
		    pool.getConnection(function(err, connection) {
				connection.query("INSERT INTO filetable (fileId, parentFileId, fileName, isActive, isFile) VALUES ('"+tempFileId+"', '"+req.body.parentFolder+"', '"+req.files.uploadThis.name+"',1,1)");
				connection.query("INSERT INTO fileusertable (userFileCombo, fileId, userId, isOwner) VALUES ('"+req.body.userId.toString()+tempFileId+"', '"+tempFileId+"', '"+req.body.userId+"', 1)", function(error, results){
					connection.query("INSERT INTO userActivityTable (userId, activity) VALUES ('"+req.body.userId+"', '"+'New file uploaded : '+ req.files.uploadThis.name+"')", function(innerError, results){
						connection.release();
						if (innerError) throw innerError;
					});
					res.json({ success: true, message: 'New file uploaded : '+ req.files.uploadThis.name});
				});
		    });
		} else{
			return res.status(400).send({
			      success: false, 
			      message: 'mandatory parameter missing.' 
			  });
		}
	});
});

app.get('/downloadFile', function(req, res){
	verifyTocken(req, res, function(req, res) {
		if(req.query.fileName!='undefined' && req.query.actualFileName!='undefined'){
			res.download('./files/'+req.query.fileName, req.query.actualFileName);
		} else{
			return res.status(400).send({ 
			      success: false, 
			      message: 'mandatory parameter missing.' 
			  });			
		}
	});
});
	
app.get('/createFolder', function(req, res){
	verifyTocken(req, res, function(req, res) {
		if(req.query.parentFolder!='undefined' && req.query.newFolder!='undefined' && req.query.userId!='undefined'){
			const tempFileId = req.query.newFolder+Date.now();
		    pool.getConnection(function(err, connection) {
				connection.query("INSERT INTO filetable (fileId, parentFileId, fileName, isActive, isFile) VALUES ('"+tempFileId+"', '"+req.query.parentFolder+"', '"+req.query.newFolder+"',1, 0)");
				connection.query("INSERT INTO fileusertable (userFileCombo, fileId, userId, isOwner) VALUES ('"+req.query.userId.toString()+tempFileId+"', '"+tempFileId+"', '"+req.query.userId+"', 1)", function(){
					connection.query("INSERT INTO userActivityTable (userId, activity) VALUES ('"+req.query.userId+"', '"+'New folder created: ' + req.query.newFolder+"')", function (error, results, fields) {
						connection.release();
						if (error) throw error;
					});
					res.send({ 
					      success: true, 
					      message: 'New folder created: ' + req.query.newFolder 
					  });
				});
			});
		} else {
			return res.status(400).send({ 
			      success: false, 
			      message: 'mandatory parameter missing.' 
			  });
		}
	});
});

app.get('/shareFile', function(req, res){
	verifyTocken(req, res, function(req, res) {
			if(req.query.fileId!='undefined' && req.query.otherUserId!='undefined'){
				pool.query("INSERT INTO fileusertable (userFileCombo, fileId, userId, isOwner) VALUES ('"+req.query.otherUserId.toString()+req.query.fileId+"', '"+req.query.fileId+"', '"+req.query.otherUserId+"', 0)", function(error){
					if (error) throw error;
					res.send('File/folder shared');
				});
			} else {
				return res.status(400).send({ 
				      success: false, 
				      message: 'mandatory parameter missing.' 
				  });
			}
	});
});

app.get('/starMe', function(req, res){
	verifyTocken(req, res, function(req, res) {
		if(req.query.fileId!='undefined' && req.query.userId!='undefined' && req.query.doStar!='undefined' && req.query.fileName!='undefined'){
			//connection.query("UPDATE filetable SET isStarred='"+req.query.doStar+"' WHERE fileId='"+ req.query.fileId +"'");
		    pool.getConnection(function(err, connection) {
				connection.query("UPDATE fileusertable SET isStarred='"+req.query.doStar+"' WHERE userFileCombo='"+ req.query.userId.toString()+req.query.fileId +"'", function(){
					connection.query("INSERT INTO userActivityTable (userId, activity) VALUES ('"+req.query.userId+"', '"+'File successfully starred: ' + req.query.fileName+"')", function(error){
						connection.release();
						if (error) throw error;
					});
					res.send('File successfully starred: ' + req.query.fileName);
				});
		    });
		} else {
			return res.status(400).send({ 
			      success: false, 
			      message: 'mandatory parameter missing.' 
			  });
		}
	});
});

app.get('/fetchActivity', function(req, res){
	verifyTocken(req, res, function(req, res) {
		if(req.query.userId!='undefined'){
			var data=[];
			var dataFrame={};
			pool.query("SELECT * from userActivityTable WHERE userId='"+ req.query.userId +"' ORDER BY activityId DESC LIMIT 10", function(err, rows){
				if (err) throw err;
				if(rows!=undefined && rows.length>0){
					for(var i=0; i<rows.length; i++){
						dataFrame = {activity : rows[i].activity};
						data.push(dataFrame);
					}
				}
				res.json({ success: true, activityList: data });
			});
		} else {
			return res.status(400).send({ 
			      success: false, 
			      message: 'mandatory parameter missing.' 
			  });
		}
	});
});

app.get('/deleteFile', function(req, res){
	verifyTocken(req, res, function(req, res) {
		var target_path="";
		if(req.query.fileId!='undefined' && req.query.userId!='undefined' && req.query.fileName!='undefined'){
			target_path = './files/'+req.query.fileId+"."+req.query.fileName.split(".")[1];	
			if (fs.existsSync(target_path)) {	
				fs.unlinkSync(target_path, function(err) {
			        if (err) throw err;
			    });
			}
		    pool.getConnection(function(err, connection) {
				connection.query("DELETE FROM filetable WHERE fileId = '"+req.query.fileId+"'", function(err, rows){
				//connection.query("UPDATE filetable SET isActive='"+0+"' WHERE fileId='"+ req.query.fileId +"'", function(err, rows){
					connection.query("INSERT INTO userActivityTable (userId, activity) VALUES ('"+req.query.userId+"', '"+'File successfully deleted: ' + req.query.fileName+"')", function(error, rows){
						connection.release();
						if (error) throw error;
					});
					res.send('File successfully deleted: ' + req.query.fileName);
				});
		    });
		} else {
			return res.status(400).send({ 
			      success: false, 
			      message: 'mandatory parameter missing.' 
			  });
		}
	});
});

app.get('/getFileList', function(req, res){
	verifyTocken(req, res, function(req, res) {
		if(req.query.parentFileId!='undefined' && req.query.userId!='undefined'){
			var data=[];
			var dataFrame={};
			pool.query("Select * from fileTable T1, fileusertable T2 WHERE T1.fileId=T2.fileId and T1.isActive=1 and T1.parentFileId='"+ req.query.parentFileId +"' group by T2.fileId", function(err, rows){
				if(rows!=undefined && rows.length>0){
					for(var i=0; i<rows.length; i++){
						dataFrame = {fileName : rows[i].fileName,
								fileId : rows[i].fileId,
								isActive: rows[i].isActive,
								isFile : rows[i].isFile,
								isOwner:rows[i].isOwner,
								isStarred: rows[i].isStarred,
								isGroup: rows[i].isGroup};
						data.push(dataFrame);
					}
				}
				if (err) throw err;
				res.json({ success: true, list: data });
			});
		} else {
			return res.status(400).send({ 
			      success: false, 
			      message: 'mandatory parameter missing.' 
			  });
		}
	});
});

app.get('/createGroup', function(req, res){
	verifyTocken(req, res, function(req, res) {
		if(req.query.userId!='undefined' && req.query.groupName!='undefined'){
			const tempGroupId = req.query.groupName+Date.now();
			pool.getConnection(function(err, connection) {
				connection.query("INSERT INTO filetable (fileId, parentFileId, fileName, isActive, isFile, isGroup) VALUES ('"+tempGroupId+"', NULL, '"+req.query.groupName+"',1, 0, 1)");
				connection.query("INSERT INTO fileusertable (userFileCombo, fileId, userId, isOwner, groupId, groupName) VALUES ('"+req.query.userId.toString()+tempGroupId+"', '"+tempGroupId+"', '"+req.query.userId+"', 1, '"+tempGroupId+"', '"+req.query.groupName+"')", function(){
					connection.query("INSERT INTO userActivityTable (userId, activity) VALUES ('"+req.query.userId+"', '"+'New group created: ' + req.query.groupName+"')", function(error, rows){
						connection.release();
						if (error) throw error;
					});
					res.send('New group created: ' + req.query.groupName);
				});
			});
		} else {
			return res.status(400).send({ 
			      success: false, 
			      message: 'mandatory parameter missing.' 
			  });
		}
	});
});

app.get('/getGroupList', function(req, res){
	verifyTocken(req, res, function(req, res) {
		if(req.query.userId!='undefined'){
			var data=[];
			var dataFrame={};
			pool.query("Select * from fileTable T1, fileusertable T2, usertable T3 where T1.isGroup=1 and T1.isActive=1 and T1.fileId=T2.fileId and T3.userId="+req.query.userId+" and T3.userId=T2.userId group by T2.fileId", function(err, rows){
				if (err) throw err;
				if(rows!=undefined && rows.length>0){
					for(var i=0; i<rows.length; i++){
						dataFrame = {fileName : rows[i].fileName,
								fileId : rows[i].fileId,
								isActive: rows[i].isActive,
								isFile : rows[i].isFile,
								isOwner:rows[i].isOwner,
								isStarred: rows[i].isStarred,
								isGroup: rows[i].isGroup,
								groupName: rows[i].groupName,
								groupId: rows[i].groupId};
						data.push(dataFrame);
					}
				}
				res.json({ success: true, list: data });
			});
		} else {
			return res.status(400).send({ 
			      success: false, 
			      message: 'mandatory parameter missing.' 
			  });
		}
	});
});

app.get('/getGroupMemebers', function(req, res){
	verifyTocken(req, res, function(req, res) {
		if(req.query.userId!='undefined' && req.query.groupId!='undefined'){
			var data=[];
			var dataFrame={};
			var groupOwnerId="";
			pool.query("Select * from fileusertable T1, usertable T2 where T1.groupId='"+req.query.groupId+"' and T1.userId=T2.userId", function(err, rows){
				if (err) throw err;
				if(rows!=undefined && rows.length>0){
					for(var i=0; i<rows.length; i++){
						if(rows[i].isOwner){
							groupOwnerId = rows[i].userId;
						}
						dataFrame = {firstName : rows[i].firstName,
								lastName : rows[i].lastName,
								userId: rows[i].userId,
								email : rows[i].email,
								isOwner:rows[i].isOwner,
								groupName: rows[i].groupName,
								groupId: rows[i].groupId};
						data.push(dataFrame);
					}
				}
				res.json({ success: true, groupMemberList: data, groupOwnerId: groupOwnerId});
			});
		} else {
			return res.status(400).send({ 
			      success: false, 
			      message: 'mandatory parameter missing.' 
			  });
		}
	});
});

app.get('/addPersonInGroup', function(req, res){
	verifyTocken(req, res, function(req, res) {
		if(req.query.groupId!='undefined' && req.query.newUserId!='undefined' && req.query.userId!='undefined' && req.query.groupName!='undefined'){
			 pool.getConnection(function(err, connection) {	
				connection.query("INSERT INTO fileusertable (userFileCombo, fileId, userId, isOwner, groupId, groupName) VALUES ('"+req.query.newUserId.toString()+req.query.groupId+"', '"+req.query.groupId+"', '"+req.query.newUserId+"', 0, '"+req.query.groupId+"', '"+req.query.groupName+"')", function(){
					connection.query("INSERT INTO userActivityTable (userId, activity) VALUES ('"+req.query.userId+"', '"+'User: '+req.query.newUserId+'added to group: ' + req.query.groupName+"')", function(error, rows){
						connection.release();
						if (error) throw error;
					});
					res.send('User: '+req.query.newUserId+'added to group: ' + req.query.groupName);
				});
			 });
		} else {
			return res.status(400).send({ 
			      success: false, 
			      message: 'mandatory parameter missing.' 
			  });
		}
	});
});

app.get('/deletePersonInGroup', function(req, res){
	verifyTocken(req, res, function(req, res) {
		if(req.query.groupId!='undefined' && req.query.deleteUserId!='undefined'){
			 pool.getConnection(function(err, connection) {	
				connection.query("DELETE FROM fileusertable WHERE groupId = '"+req.query.groupId+"' and userId='"+req.query.deleteUserId+"'", function(err, rows){
					connection.query("INSERT INTO userActivityTable (userId, activity) VALUES ('"+req.query.deleteUserId+"', '"+'Member successfully deleted with ID: ' + req.query.deleteUserId+"')", function(error, rows){
						connection.release();
						if (error) throw error;
					});
					res.send('Member successfully deleted with ID: ' + req.query.deleteUserId);
				});
			 });
		} else {
			return res.status(400).send({ 
			      success: false, 
			      message: 'mandatory parameter missing.' 
			  });
		}
	});
});

app.get('/findUser', function(req, res){
	verifyTocken(req, res, function(req, res) {
		if(req.query.searchString!='undefined'){
			var data=[];
			var dataFrame={};
			pool.query("SELECT * FROM usertable WHERE email LIKE '%"+req.query.searchString+"%' OR firstName LIKE '%"+req.query.searchString+"%' OR lastName LIKE '%"+req.query.searchString+"%'", function(err, rows){
				if (err) throw err;
				if(rows!=undefined && rows.length>0){
					for(var i=0; i<rows.length; i++){
						dataFrame = {firstName : rows[i].firstName,
			     				lastName : rows[i].lastName,
			     				email : rows[i].email,
			     				userId : rows[i].userId};
						data.push(dataFrame);
					}
					res.json({ success: true, userList: data, message: "User list fetched!!" });
				} else {
					dataFrame = {firstName : "No user found! Try again!",
		     				lastName : "",
		     				email : "",
		     				userId : ""};
					data.push(dataFrame);
					res.json({ success: true, userList: data, message: "No user found! Try again!" });
				}
			});
		} else {
			return res.status(400).send({ 
			      success: false, 
			      message: 'mandatory parameter missing.' 
			  });
		}
	});
});

app.get('/getRecentFileList', function(req, res){
	verifyTocken(req, res, function(req, res) {
		if(req.query.userId!='undefined'){
			var data=[];
			var dataFrame={};
			pool.query("Select * from fileTable T1, fileusertable T2, usertable T3 where T1.isActive=1 and T1.fileId=T2.fileId and T3.userId="+req.query.userId+" and T3.userId=T2.userId group by T2.fileId", function(err, rows){
				if (err) throw err;
				if(rows!=undefined && rows.length>0){
					for(var i=0; i<rows.length; i++){
						dataFrame = {fileName : rows[i].fileName,
								fileId : rows[i].fileId,
								parentFileId: rows[i].parentFileId,
								isActive:rows[i].isActive,
								isFile:rows[i].isFile,
								isOwner:rows[i].isOwner,
								isStarred:rows[i].isStarred};
								data.push(dataFrame);
					}
				}
				res.json({ success: true, recentFileList: data });
			});
		} else {
			return res.status(400).send({ 
			      success: false, 
			      message: 'mandatory parameter missing.' 
			  });
		}
	});
});

app.get('/getSharedFileList', function(req, res){
	verifyTocken(req, res, function(req, res) {
		if(req.query.userId!='undefined'){
			var data=[];
			var dataFrame={};
			pool.query("Select * from fileTable T1, fileusertable T2 where T1.isActive=1 and (T1.isGroup=0 or T1.isGroup IS NULL) and T2.isOwner!=1 and T1.fileId=T2.fileId and T2.userId='"+req.query.userId+"' group by T2.fileId", function(err, rows){
				if (err) throw err;
				if(rows!=undefined && rows.length>0){
					for(var i=0; i<rows.length; i++){
						console.log(rows[i]);
						console.log(rows[i].isStarred);
						dataFrame = {fileName : rows[i].fileName,
								fileId : rows[i].fileId,
								parentFileId: rows[i].parentFileId,
								isActive:rows[i].isActive,
								isFile:rows[i].isFile,
								isOwner:rows[i].isOwner,
								isStarred:rows[i].isStarred};
								data.push(dataFrame);
					}
				}
				res.json({ success: true, sharedFileList: data });
			});
		} else {
			return res.status(400).send({ 
			      success: false, 
			      message: 'mandatory parameter missing.' 
			  });
		}
	});
});

app.get('/getStarredList', function(req, res){
	verifyTocken(req, res, function(req, res) {
		if(req.query.userId!='undefined'){
			var data=[];
			var dataFrame={};
			pool.query("Select * from fileTable T1, fileusertable T2, usertable T3 where T1.isActive=1 and T1.fileId=T2.fileId and T2.isStarred=1 and T3.userId="+req.query.userId+" and T3.userId=T2.userId group by T2.fileId", function(err, rows){
				if (err) throw err;
				if(rows!=undefined && rows.length>0){
					for(var i=0; i<rows.length; i++){
						dataFrame = {fileName : rows[i].fileName,
								fileId : rows[i].fileId,
								parentFileId: rows[i].parentFileId,
								isActive:rows[i].isActive,
								isFile:rows[i].isFile,
								isOwner:rows[i].isOwner,
								isStarred:rows[i].isStarred};
								data.push(dataFrame);
					}
				}
				res.json({ success: true, starredFileList: data });
			});
		} else {
			return res.status(400).send({ 
			      success: false, 
			      message: 'mandatory parameter missing.' 
			  });
		}
	});
});

/*app.post('/addGroupUser', function(req, res){
	verifyTocken(req, res, function(req, res) {
		if(req.body.userList!=""){
			connection.query("INSERT INTO fileusertable (userFileCombo, fileId, userId) VALUES ('"+req.body.userId.toString()+tempFileId+"', '"+tempFileId+"', '"+req.body.userId+"')", function(){
				res.json({
				  success: true,
				  message: 'User data update successful!'
				});
			});
		}
	});
});
*/
app.post('/register', function(req, res){
	bcrypt.hash(req.body.password, salt, function(err, password) {
		 pool.getConnection(function(err, connection) {	
			connection.query("SELECT * FROM usertable WHERE email='"+req.body.email+"'", function(err, rows){
				if(rows!=undefined && rows.length>0){
		     		res.status(400).send({ success: false, message: 'User already exists.' });
				} else {
					connection.query("INSERT INTO usertable (userPassword, firstName, lastName, email) VALUES ('"+password+"', '"+req.body.firstName+"', '"+req.body.lastName+"', '"+req.body.email+"')", function(){
						connection.query("SELECT * FROM usertable WHERE email='"+req.body.email+"'", function(err, rows){
							if(rows!=undefined && rows.length>0){
								connection.query("INSERT INTO filetable (fileId, parentFileId, fileName, isActive, isFile) VALUES ('"+rows[0].userId+"', NULL, '"+rows[0].userId+"',1,0)", function(){
									connection.query("INSERT INTO fileusertable (userFileCombo, fileId, userId, isOwner) VALUES ('"+rows[0].userId+rows[0].userId+"', '"+rows[0].userId+"', '"+rows[0].userId+"', 1)", function(error){
										connection.release();
										if (error) throw error;
									});
								});
							}
						});
						res.json({
						  success: true,
						  message: 'Registartion successful!'
						});
					}, function(){
						res.status(400).send({
						  success: false,
						  message: 'Registartion failed!'
						});
					});
				}
			});
		});
	});
});

app.post('/updateUserData', function(req, res){
	verifyTocken(req, res, function(req, res) {
		if(req.body.userId!=""){
			pool.query("UPDATE usertable SET userOverview='"+req.body.userOverview+"', workData='"+req.body.workData+"', educationData='"+req.body.educationData+"', contactNumber='"+req.body.contactNumber+"', interests='"+req.body.interests+"' WHERE userId='"+req.body.userId+"'", function(err, rows){
				res.json({
				  success: true,
				  message: 'User data updated successfully!'
				});
			});
		}else {
			return res.status(400).send({ 
			      success: false, 
			      message: 'mandatory parameter missing.' 
			  });
		}
	});
});

function verifyTocken(req, res, callBack){
	var token = req.body.token || req.query.token || req.headers['x-access-token'];
	if (token) {
	  jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
	    if (err) {
	      return res.status(401).send({ success: false, message: 'Failed to authenticate token.' });    
	    } else {
	      // if everything is good, save to request for use in other routes
	      req.decoded = decoded;
	      callBack(req, res, true);
	    }
	  });
	} else {
	  return res.status(403).send({ 
	      success: false, 
	      message: 'No token provided.' 
	  });
	}
}

module.exports = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});