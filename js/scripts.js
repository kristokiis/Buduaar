jQuery(document).ready(function ($){
		
		var eventSt = (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i)) ? "touchstart" : "click";
		
		var eventEnd = (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i)) ? "touchend" : "click";
		
		$('.search span').toggle(function(e) {
			e.preventDefault();
			$(this).addClass('active');	
			$('.searchbox').addClass('active');
			$('.newssection, .newssectionopen, .barsubmenu, .underbarsubmenu, .toodepage, .account').addClass('active');
		}, function(e) {
			e.preventDefault();
			$(this).removeClass('active');	
			$('.searchbox').removeClass('active');
			$('.newssection, .newssectionopen, .barsubmenu, .underbarsubmenu, .toodepage, .account').removeClass('active');
		});
		
	
		$('.categories').toggle(function(e) {
			e.preventDefault();
			$(this).addClass('active');	
			$('.sidebar').addClass('active');
		}, function(e) {
			e.preventDefault();
			$(this).removeClass('active');	
			$('.sidebar').removeClass('active');
			
		});
		
		$('.women').bind(eventEnd, function(e){
			e.preventDefault();
			$('.menu_level1').addClass('active');
			$('.women2').addClass('active');
		});
		
	
		$('.catsback').bind(eventEnd, function(e){
			e.preventDefault();
			$('.menu_level1').removeClass('active');
			$('.women2').removeClass('active');
		});
		
		
		
		$('.toode_thumb').bind(eventEnd, function(e){
			e.preventDefault();
			$('.toode_preview').attr('src',$(this).attr('src'));
		});
		
		
		var allPanels = $('#accordion .content');
		var allPanels2 = $('#accordion .title');
		
		$('#accordion .title').bind(eventEnd, function() {
			
			
			if($(this).next().height() == '0') { 
				allPanels.removeClass('active');
				allPanels2.removeClass('active');
				$(this).addClass('active');
				$(this).next().addClass('active');
			}
			
			return false;
		});
		
	
		$('.minus').bind(eventEnd, function(e){
			e.preventDefault();
			var curr = Number($('.itemcount span').text());
			if(curr >= 2){
				$('.itemcount span').text(Number(curr) - 1);
			}
			
		});
		
		$('.plus').bind(eventEnd, function(e){
			e.preventDefault();
			
			var curr = $('.itemcount span').text();
			$('.itemcount span').text(Number(curr) + 1);
			return false;
		});
		
	
		$('.buy').bind(eventEnd, function(e){
			e.preventDefault();
			
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