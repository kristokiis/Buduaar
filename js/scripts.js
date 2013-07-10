var eventSt = (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i)) ? "touchstart" : "click";
		
var eventEnd = (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i)) ? "touchend" : "click";

function validateForm(){
	
	jQuery("#username, #password").removeClass('alertForm');		
	var toret = true;
	if(jQuery('#username').val() == jQuery("#username").attr('title')){	
		jQuery("#username").addClass('alertForm');
		toret = false;
	}
	if(jQuery("#password").val() == jQuery("#password").attr('title')){
		jQuery("#password").addClass('alertForm');
		toret = false;
	}
	return toret;
}


function validateSearch(){
	
	jQuery("#search").removeClass('alertForm');		
	var toret = true;
	if(jQuery('#search').val() == jQuery("#search").attr('title')){	
		jQuery("#search").addClass('alertForm');
		toret = false;
	}

	return toret;
}


function validateComment(){
	
	jQuery("#nimi, #email, #vanus, #comment").removeClass('alertForm');		
	var toret = true;
	
	if($("#email").val() == "" || !validateEmail($("#email").val()) || $("#email").val() == $("#email")[0].title){
		$("#email").addClass('alertForm');
		toret = false;
	}
	
	return toret;
}

function validateEmail($email) {
	var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
	if( !emailReg.test( $email ) ) {
		return false;
	} else {
		return true;
	}
}

function capitaliseFirstLetter(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}