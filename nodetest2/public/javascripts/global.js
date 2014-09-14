//userlist data array for filling in info box
var userListData = [];

//dom ready
$(document).ready(function(){
	//populate the user table on initial page load
	populateTable();
	//username link click
	$('#userList table tbody').on('click','td a.linkshowuser',showUserInfo);
	//add user button click
	$('#btnAddUser').on('click',addUser);
	//delet user link click
	$('#userList table tbody').on('click','td a.linkdeleteuser',deleteUser);
});
//functions
//fill table with data
function populateTable(){
	//empty content string
	var tableContent = '';
	//jquery ajax call for json
	$.getJSON('/users/userlist',function(data){
		//for each item in our json add a table row and cells to the content string
		$.each(data,function(){
			// Stick our user data array into a userlist variable in the global object
			userListData = data;
			tableContent += '<tr>';
			tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '" title="Show Details">' + this.username + '</a></td>';
			tableContent += '<td>' + this.email + '</td>';
			tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
			tableContent += '</tr>';
		});
		//inject the whole content string into our existing HTML table
		$('#userList table tbody').html(tableContent);
	});
}
//show user info
function showUserInfo(event){
	//prevent link from firing
	event.preventDefault();
	//retrieve username from link rel attribute
	var thisUserName = $(this).attr('rel');
	//get index of object based on the id value
	var arrayPosition = userListData.map(function(arrayItem){return arrayItem.username}).indexOf(thisUserName);
	//get our user object
	var thisUserObject = userListData[arrayPosition];
	//populate info box
	$('#userInfoName').text(thisUserObject.fullname);
	$('#userInfoAge').text(thisUserObject.age);
	$('#userInfoGender').text(thisUserObject.gender);
	$('#userInfoLocation').text(thisUserObject.location);
}
//add user
function addUser(event){
	event.preventDefault();
	//super basic validation - increase errorCount variable if any fields are blank
	var errorCount = 0;
	$('#addUser input').each(function(index,val){
		if($(this).val()===''){errorCount++;}
	});
	//check and make sure errorcount still at zero	
	if(errorCount === 0){
		//if it is, compile all user info into one object
		var newUser = {
			'username' : $('#addUser fieldset input#inputUserName').val(),
			'email' : $('#addUser fieldset input#inputUserEmail').val(),
			'fullname' : $('#addUser fieldset input#inputFullName').val(),
			'age' : $('#addUser fieldset input#inputAge').val(),
			'location' : $('#addUser fieldset input#inputUserLocation').val(),
			'gender' : $('#addUser fieldset input#inputUserGender').val(),
		};
		$.ajax({
			type: 'POST',
			data: newUser,
			url: '/users/adduser',
			dataType: 'JSON'
		}).done(function(response){
			//check for successful blank response
			if(response.msg===''){
				//clear the form inputs
				$('#addUser fieldset input').val('');
				//update the table
				populateTable();
			}else{
				alert('Error:'+response.msg);
			}
		});
	}else{
		alert('Please fill in all fields');
		return false;
	}
}
//delete user
function deleteUser(event){
	event.preventDefault();
	//pop up a confirmation dialog
	var confirmation = confirm('Are you sure you want to delete this user?');
	
	if(confirmation===true){
		$.ajax({
			type: 'DELETE',
			url: '/users/deleteuser/' + $(this).attr('rel')
		}).done(function(response){
			if(response.msg === ''){
			}else{
				alert('Error: ' + response.msg);
			}
			populateTable();
		});
	}else{
		return false;
	}
}
