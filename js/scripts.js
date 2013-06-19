var eventSt = (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i)) ? "touchstart" : "click";
		
var eventEnd = (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i)) ? "touchend" : "click";
		
jQuery(document).ready(function ($){
		$('.search span').click(function(e) {
			e.preventDefault();
			if ($(this).hasClass('active')) {
				
				$('.search span').removeClass('active');
				setTimeout(function() {
					$('.searchbox').css('z-index', '-1');
				}, 300);	
				$('.searchbox').removeClass('active');
				$('.newssection, .newssectionopen, .barsubmenu, .underbarsubmenu, .toodepage, .account, .page-wrap').removeClass('active');
			
			} else {
			
				$('.menu_level1').removeClass('active');
				//$(this).parent().removeClass('active');
				$('.sidebar').removeClass('active');
				$('.categories').removeClass('active');
				
				$(this).addClass('active');	
				$('.searchbox').addClass('active');
				setTimeout(function() {
					$('.searchbox').css('z-index', '0');
				}, 300);
				$('.newssection, .newssectionopen, .barsubmenu, .underbarsubmenu, .toodepage, .account, .page-wrap').addClass('active');
				
			}
		});
		
		
		$('.categories').click(function(e) {
			e.preventDefault();
			if ($(this).hasClass('active')) {
				$(this).removeClass('active');	
				$('.sidebar').removeClass('active');
			} else {
				$(this).addClass('active');	
				$('.sidebar').addClass('active');
			}
		});	
		
		/*$('.toode_thumb').bind(eventEnd, function(e){
			e.preventDefault();
			$('.toode_preview').attr('src',$(this).attr('src'));
		});*/
		
		
		var allPanels = $('#accordion .content');
		var allPanels2 = $('#accordion .title');
		
		$('#accordion .title').bind(eventEnd, function() {
			
			//console.log($(this).hasClass('active'));
			//if($(this).next().height() == '0') { 
				if ($(this).hasClass('active')) {
					console.log('do this shit');
					allPanels.addClass('active');
					allPanels2.addClass('active');
					$(this).removeClass('active');
					$(this).next().removeClass('active');
				} else {
					allPanels.removeClass('active');
					allPanels2.removeClass('active');
					$(this).addClass('active');
					$(this).next().addClass('active');
				}
				
				$('body').scrollTop(500);
			//}
			
			return false;
		});
		
		$(".defaultText").focus(function(srcc){
			if ($(this).val() == $(this)[0].title){
				$(this).removeClass("defaultTextActive");
				$(this).val("");
			}
		});
		
		$(".defaultText").blur(function(){
			if ($(this).val() == ""){
				$(this).addClass("defaultTextActive");
				$(this).val($(this)[0].title);
			}
		});
		
		$(".defaultText").blur(); 
		
		

});


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