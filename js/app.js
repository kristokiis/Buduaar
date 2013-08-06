window.addEventListener("load",function() {
  // Set a timeout...
  setTimeout(function(){
    // Hide the address bar!
    window.scrollTo(0, 1);
  }, 0);
});

var user = {};
var newsCats = {};
var allCats = '';

var newsType = '';
var newsSearch = '';

var loaded = false;

var page_inited = 0;

var pages = ['main', 'news', 'messages', 'market'];
var offlineAlerted = false;
var offlineTimeout;

var hasGallery = false;

var data = {};

var stores = [];

var first = true;

var search = {};

var offline = false;

var appMode = false;

var app = {

	marketCats: {},

	currentNews: 0,
	serverUrl: 'http://buduaar.ee/sites/api/',
	imageUrl: 'http://buduaar.ee/files/Upload/Articles/%image%',
	supportUrl: 'http://projects.efley.ee/budu_live/support.php/',
	session: '',
	productCat: '',
	storeMode: false,
	
	catsTree: {},
	currentProduct: 0,
	
	saveStage: 1,
	
	currentEditId: false,
	
	imageURI: '',
	
	saveParams: {},
	oldAndroid: false,
	
	isMarketSearch: false,
	
	init: function() {
		
		app.oldAndroidStuff();
	
		if (offline == true) {
			document.addEventListener("online", function() {
				offline = false;
				app.init();
				return false;
			}, false);
		}
		
		if(appMode) {
		
			networkState = navigator.connection.type;
			
			if (networkState == Connection.NONE){
				alert('Interneti ühendus puudub');
				offline = true;
				app.init();
				return false;
			}
		
		}
		
		window.addEventListener('popstate', function(e) {
			if(!first) {
				if($('.page-wrap').hasClass('opened')) {
					e.preventDefault();
					//$('.page-wrap').removeClass('opened');
					app.triggerBack();
				} else {
					e.preventDefault();
					app.triggerBack();
				}
				
			}
			first = false;
			//
		});
		
		this.initLogin();
		
		app.getMarketCats();
		
		this.subInit();
		
		page_inited = page_inited+1;
		
		offlineAlerted = false;
		
		clearTimeout(offlineTimeout);
		
	},
	
	subInit: function() {
		if (app.session) {
			$('.message-to-user').parent().show();
			$('.login-to-use').hide();	
		}
		if (appMode) {
			$('.only-app').show();
			$('.no-app').hide();
			$('.app-mode').show();
		} else {
			$('.no-app').show();
			$('.only-app').hide();
			$('.app-mode').hide();
		}
		
		$('.login-to-use-link').unbind('click');
		$('.login-to-use-link').click(function(e) {
			e.preventDefault();
			app.showLogin();
		});
	
		$('.search span').unbind('click');
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
		
		$('.categories').unbind('click');
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
		
		//app.initMarketCatsNav();
		
		var allPanels = $('#accordion .content');
		var allPanels2 = $('#accordion .title');
		
		$('#accordion .title').unbind(eventEnd);
		$('#accordion .title').bind(eventEnd, function() {
		
			if ($(this).hasClass('active')) {
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
	
		
		this.initScrolls();
		
		this.initMainBack();
		
		$('.logo-link').click(function(e){
			e.preventDefault();
			$('body').removeClass('bturg');
			$('body').scrollTop(0);
			$('#page-wrap').removeClass('active');
			$('.page-sidebar-wrap').removeClass('active');
			setTimeout(function() {
				$('.page-sidebar-wrap').hide();
			}, 300);
			$('.page-wrap').removeClass('opened');
		});
		$('.home').click(function(e){
			e.preventDefault();
			$('body').removeClass('bturg');
			$('body').scrollTop(0);
			$('#page-wrap').removeClass('active');
			$('.page-sidebar-wrap').removeClass('active');
			setTimeout(function() {
				$('.page-sidebar-wrap').hide();
			}, 300);
			$('.page-wrap').removeClass('opened');
		});
		
		
		/*
		* Special!!!
		*/
		
		$('.messages').unbind('click');
		$('.messages').click(function(e) {
			window.history.pushState('stuff', 'stuff', '');
			window.history.pushState('stuff', 'stuff', '');
			e.preventDefault();
			$('.page-sidebar-wrap').hide().removeClass('active');
			$('#messagesPage').show();
			setTimeout(function() {
				
				$('#page-wrap').addClass('active');
				$('#messagesPage').addClass('active');
				setTimeout(function() {
					$('body').addClass('bturg');
				}, 300);
			}, 200);
			
			app.hideSearch();
			app.hideCategories();
			data = {};
			
		});

		$('.addphoto').unbind('click');
		$('.addphoto').click(function(e) {
			e.preventDefault();
			var subPage = 'add-item';
			if($('#marketPage').is(':visible')) 
				app.showSubPage(subPage);
			else
				app.clickMarket(subPage);
		});
		
		$('.sub_menu_icons').find('.list').unbind('click');
		$('.sub_menu_icons').find('.list').click(function(e) {
			e.preventDefault();
			var subPage = 'my-orders';
			if($('#marketPage').is(':visible')) 
				app.showSubPage(subPage);
			else
				app.clickMarket(subPage);
		});
		
		$('.sub_menu_icons').find('.horn').unbind('click');
		$('.sub_menu_icons').find('.horn').click(function(e) {
			e.preventDefault();
			var subPage = 'my-list';
			if($('#marketPage').is(':visible')) 
				app.showSubPage(subPage);
			else
				app.clickMarket(subPage);
			
		});
		
		$('.logout').unbind('click');
		$('.logout').click(function(e) {
		
			$('.message-to-user').parent().hide();
			$('.login-to-use').show();
		
			$('.open_bt_login').find('img').attr('src', 'images/login_img.png');
		
			$('.logged-out').show();
			$('.logged-in').hide();
			$('.logout-link').hide();
			
			//$('#userUsername').find('span').html('Viimati lisatud');
			
			e.preventDefault();
			app.session = '';
			$('#page-wrap').removeClass('active');
			$('.page-sidebar-wrap').removeClass('active');
			setTimeout(function() {
				$('.page-sidebar-wrap').hide();
			}, 300);
			$('body').removeClass('bturg');
			
			$('.smi').hide();
			$('.log-header').show();
			
			$('.open_bt_login').find('span').html('LOGI SISSE');
			localStorage.removeItem('budu_username');
			localStorage.removeItem('budu_password');
			app.initLogin();
		});
		
		$('.add-new').unbind('click');
		$('.add-new').click(function(e) {
			e.preventDefault();
			app.initMarketAdd(false);
			app.hideSearch();
			app.hideCategories();
		});

		$('.check-new').unbind('click');
		$('.check-new').click(function(e) {
			e.preventDefault();
			id = $(this).attr('rel');
			app.getProduct(id, true);
			$('.marketContainer').find('.page-wrap').hide();
			$('#marketDetail').show();
			$('#marketList').show();
			app.hideSearch();
			app.hideCategories();
		});

	},
	
	oldAndroidStuff: function() {
		
		var ua = navigator.userAgent;
		if( ua.indexOf("Android") >= 0 ) {
			var androidversion = parseFloat(ua.slice(ua.indexOf("Android")+8)); 
			//alert(androidversion);
			if (androidversion <= 2.3) {
				$('.intro_btns div').css('font-family', 'Arial');
				app.oldAndroid = true;
			} else if (androidversion <= 4.1) {
				//$('.intro_btns div').css('font-family', 'Arial');
			}
		}
		
	},
	
	showLoader: function(line) {
		
		$('.ajax-loader').css('height', $('body').height() + 'px');
		$('.ajax-loader').find('img').center();
		$('.ajax-loader').fadeIn();
		
		setTimeout(function() {
			//alert('hide loader!!');
			$(".ajax-loader").hide();
		}, 4000);
	},
	
	showLogin: function() {
		$('.login-popup').center();
		$('.login-popup').fadeIn();
		$('.error-popup').find('.close-popup').click(function(e) {
			e.preventDefault();
			$('.login-popup').hide();
		});
	},
	
	showDialog: function(message, heading) {
		
		$('.error-popup').find('h2').html(heading);
		$('.error-popup').find('p').html(message);
		$('.error-popup').center();
		$('.error-popup').fadeIn();
		$('.error-popup').find('.close-popup').click(function(e) {
			e.preventDefault();
			$('.error-popup').hide();
		});
		$('.error-popup').find('input').click(function(e) {
			e.preventDefault();
			$('.error-popup').hide();
		});
	},
	
	hideLoader: function() {
		$('.ajax-loader').css('height', $('body').height() + 'px');
		$('.ajax-loader').find('img').center();
		$('.ajax-loader').fadeIn();
	},
	
	initMainBack: function() {
		
		$('.menu_bar').find('.back').unbind('click');
		$('.menu_bar').find('.back').click(function(e) {
			e.preventDefault();
			app.triggerBack();
		});	
	
		
	},
	
	triggerBack: function() {
		//if we are in detail view..	
		$(window).scrollTop(0);
		
		if ($('.ps-toolbar-close').length) {
			$('.ps-toolbar-close').click();
			return false;
		}
		
		if($('.page-sidebar-wrap').find('.sidebar.active').length) {
			$('.page-sidebar-wrap').find('.sidebar.active').removeClass('active');
			$('.categories').removeClass('active');
			return false;
		}
		
		if($('.page-sidebar-wrap').find('.searchbox.active').length) {
			$('.search').find('span.active').removeClass('active');
			$('.page-sidebar-wrap').find('.underbarsubmenu.active').removeClass('active');
			$('.page-sidebar-wrap').find('.searchbox.active').removeClass('active');
			$('.page-sidebar-wrap').find('.barsubmenu.active').removeClass('active');
			return false;
		}
		
		if($('#marketPage').is(':visible')) {
			
			
			if(app.isMarketSearch) {
			
				data = {};
				data.start = 0;
				data.limit = 10;
				app.isMarketSearch = false;
				
				$('#marketSearchStr').val('');
				$('#marketSearchPriceFrom').val('');
				$('#marketSearchPriceTo').val('');
				
				app.getMarket(data);
				return false;

			}
			
			
			$('#sellerother').html('');
			
			if ($('#marketAdd').is(':visible') || $('#marketOrders').is(':visible') || $('#myList').is(':visible')) {
				$('.oth').hide();
				$('.marketContainer').find('.page-wrap').show();
				$('#marketAdd').hide();
				$('#marketOrders').hide();
				$('#myList').hide();
				
				return false;
			}
			
		} else if($('#messagesPage').is(':visible')) {
			
			if ($('#newMessageForm').is(':visible')) {
				$('.messages-tab.active').click();
				return false;
			}
			
		} else if($('#newsPage').is(':visible')) {
			$('#newsContent').html('');
			$('#commentsList').html('');
			app.initNewsListScroll();
			
		}
		
		if ($('.page-wrap.opened').length) {
			
			$('.page-wrap').removeClass('opened');
			
		} else {
			
			$('#page-wrap').removeClass('active');
			$('#page-wrap').show();
			$('.page-sidebar-wrap').removeClass('active');
			setTimeout(function() {
				$('.page-sidebar-wrap').hide();
			}, 300);
			$('body').removeClass('bturg');
			
		}
			
	},
	
	initLogin: function() {
	
		if (localStorage.getItem('budu_username') && localStorage.getItem('budu_password')) {
			$('#username').val(localStorage.getItem('budu_username'));
			$('#password').val(localStorage.getItem('budu_password'));
		}
		
		$('.open_bt_login').unbind('click');
		$('.open_bt_login').toggle(function(e) {
			e.preventDefault();
			$(this).addClass('active');	
			$('.bturglogin, #footer').addClass('active');
			$('.usual-site').hide();
			$('body').animate({scrollTop: "200px"}, 200);
		}, function(e) {
			e.preventDefault();
			$(this).removeClass('active');	
			$('.bturglogin, #footer').removeClass('active');
			$('.usual-site').show();
			$('body').animate({scrollTop: "0px"}, 200);
		});
		
		$('.loginForm2').unbind('submit');
		$('.loginForm2').submit(function(e) {
			e.preventDefault();
			
			user_input = $(this).find('input[name="username"]');
			pass_input = $(this).find('input[name="password"]');
			
			user_input.removeClass('alertForm');
			pass_input.removeClass('alertForm');
					
			var toret = true;
			if(user_input.val() == user_input.attr('title')){	
				user_input.addClass('alertForm');
				toret = false;
			}
			if(pass_input == pass_input.attr('title')){
				pass_input.addClass('alertForm');
				toret = false;
			}
			
			if (toret) {
				userData = {};
				userData.username = user_input.val();
				userData.password = pass_input.val();

			
				app.doLogin(userData);
			}
			
		});
		
		if (localStorage.getItem('budu_username') && localStorage.getItem('budu_password')) {
			$('#loginForm2').submit();
		}
	
		$('.market-link').unbind('click');
		$('.market-link').click(function(e) {
			
			e.preventDefault();			
			
			app.clickMarket(false);

		});

		$('.news-link').unbind('click');
		$('.news-link').click(function(e) {

			e.preventDefault();
			
			app.showLoader(457);
			
			app.hideEverything();

			if ($('#newsPage').html().length) {
				setTimeout(function() {
					app.toNewsPage();
				}, 1000);
			} else {
			
				setTimeout(function() {
				
					$.get('newsPage.html', function(data) {
					
						$('#newsPage').html(data);
						
						app.toNewsPage();
					});	
				
				}, 1000);
			
			}
			
		});
		
	},
	
	clickMarket: function(subPage) {
		
		app.showLoader(416);

		app.hideEverything();
		
		//alert($('#marketPage').html().length);
		
		if ($('#marketPage').find('.other-content').html().length) {
			setTimeout(function() {
				app.toMarketPage(subPage);
			}, 1000);
			//alert('straight to it');
		} else {
			
			$('#marketPage').find('.other-content').html('');
			
			setTimeout(function() {
		
				$.get('marketPage.html', function(data) {
					//$('.result').html(data);				
					
					$('#marketPage').find('.other-content').html($('.huge-header').html());
					$('#marketPage').find('.other-content').append(data);
					
					app.toMarketPage(subPage);
					
				});	
			
			}, 1000);
		}
			
	},
	
	toMarketPage: function(subPage) {
		
		$('#marketPage').show();
		$('body').scrollTop(0);			
		$('.ajax-loader').hide();
		setTimeout(function() {
			$('#page-wrap').addClass('active');
			$('#marketPage').addClass('active');
			setTimeout(function() {
				$('body').addClass('bturg');
			}, 300);
		}, 200);
		
		window.history.pushState('stuff', 'stuff', '');
		window.history.pushState('stuff', 'stuff', '');
		
		app.subInit();
		
		data = {};
		app.initMarket();
		
		if (subPage) {
			
			app.showSubPage(subPage);
			
		}
		
	},
	
	showSubPage: function(subPage) {
		$('body').scrollTop(0);	
		switch(subPage) {
				
			case 'add-item':
				
				$('.page-sidebar-wrap').hide().removeClass('active');
				$('body').addClass('bturg');
				$('#marketPage').show();
				
				$('#marketOrders').hide();
				$('#myList').hide();
				
				setTimeout(function() {
					$('#page-wrap').addClass('active');
					$('#marketPage').addClass('active');
				}, 200);
				if ($('#marketAdd').is(':visible')) {
					/*$('.oth').hide();
					$('#marketList').show();
					$('#marketDetail').show();
					$('#marketAdd').hide();*/
				} else {
					$('.oth').show();
					$('.marketContainer').find('.page-wrap').hide();
					$('#marketAdd').fadeIn('fast');
				}
				app.initMarketAdd(false);
				app.hideSearch();
				app.hideCategories();
			
				break;
			case 'my-list':
				$('.page-sidebar-wrap').hide().removeClass('active');
				$('body').addClass('bturg');
				$('#marketPage').show();
				
				$('#marketOrders').hide();
				$('#marketAdd').hide();
				
				setTimeout(function() {
					$('#page-wrap').addClass('active');
					$('#marketPage').addClass('active');
				}, 200);
					$('.oth').hide();
				if ($('#myList').is(':visible')) {
					/*$('#marketList').show();
					$('#marketDetail').show();
					$('#myList').hide();*/
				} else {
					$('.marketContainer').find('.page-wrap').hide();
					$('#myList').fadeIn('fast');
					app.getUserMarket(false);
				}
				app.hideSearch();
				app.hideCategories();
				break;
			case 'my-orders':
				$('.page-sidebar-wrap').hide().removeClass('active');
				$('body').addClass('bturg');
				$('#marketPage').show();
				setTimeout(function() {
					$('#page-wrap').addClass('active');
					$('#marketPage').addClass('active');
				}, 200);
				
				$('.oth').hide();	
				$('#myList').hide();	
				$('#marketAdd').hide();
				
				if ($('#marketOrders').is(':visible')) {
					/*$('#marketList').show();
					$('#marketDetail').show();
					$('#marketOrders').hide();*/
				} else {
					$('.marketContainer').find('.page-wrap').hide();
					$('#marketOrders').fadeIn('fast');
					app.getUserOrders('buyer');
				}
				app.hideSearch();
				app.hideCategories();
			
				break;
			
		}
	},
	
	toNewsPage: function() {
		
		app.subInit();
						
		app.initNews(true);
		
		window.history.pushState('stuff', 'stuff', '');
		window.history.pushState('stuff', 'stuff', '');
	
		app.hideEverything();
		$('body').removeClass('bturg');
		data = {};
		
		$('body').scrollTop(0);	
		
		$('#newsPage').show();
		setTimeout(function() {
			$('#page-wrap').addClass('active');
			$('#newsPage').addClass('active');
		}, 200);
		
		app.initNewsListScroll();
		app.hideSearch();
		app.hideCategories();
		
	},
	
	toMessagesPage: function() {
		
		
			
	},
	
	hideEverything: function() {
		
		$('.page-wrap').removeClass('opened');
		$('.search span').removeClass('active');
		setTimeout(function() {
			$('.searchbox').css('z-index', '-1');
		}, 300);	
		$('.searchbox').removeClass('active');
		$('.newssection, .newssectionopen, .barsubmenu, .underbarsubmenu, .toodepage, .account, .page-wrap').removeClass('active');
			
	},
	
	doLogin: function(userData) {
	
		$.get(app.supportUrl + '?action=login', userData, function(results) {
					
			if (results.code == '1') {
				//http:buduaar.ee/sites/api/User/loggedInUser/?callback=user
				
				$('.message-to-user').parent().show();
				$('.login-to-use').hide();
				
				$('.logout-link').show();
			
				$('.logged-out').hide();
				$('.logged-in').show();
				
				$('.smi').show();
				
				$('#userUsername').find('span').html(userData.username);
				$('#u_username').html(userData.username);
				
				$('.open_bt_login').find('img').attr('src', 'images/laptop.jpg');
				$('.login-popup').hide();

				if ($('#rememberMe').is(':checked')) {
					
					localStorage.setItem('budu_username', userData.username);
					localStorage.setItem('budu_password', userData.password);
				} else {
					
					localStorage.removeItem('budu_username');
					localStorage.removeItem('budu_password');
				}
			
				app.session = results.data;
				
				$.get(app.serverUrl + 'User/loggedInUser', {session: app.session}, function(results) {
					user = results.data;
					$('#nimi').val(user.username);
					$('#email').val(user.email);
					cur_date = new Date();
					birth_date = new Date(user.birthday);
					
					var vanus = getAge(birth_date, cur_date);
					if(parseInt(vanus) < 100 && parseInt(vanus) > 1)
						$('#vanus').val(vanus);
						
				}, 'jsonp');
				
				$('.open_bt_login').find('span').html('TEATED');
				$('.open_bt_login').removeClass('active');	
				$('.bturglogin, #footer').removeClass('active');
				$('.usual-site').show();
				$('body').animate({scrollTop: "0px"}, 200);
				
				$('#messagesPage').html('');
					
				//app.showLoader(662);
				
				//app.hideEverything();
				
				//setTimeout(function() {
				
					$.get('messagesPage.html', function(data) {
				
						//$('body').addClass('bturg');
						$('#messagesPage').html($('.smi:last').clone());
						
						$('#messagesPage').append(data);
						$('body').animate({scrollTop: "0px"}, 200);
					});
					
				//}, 1000);
				
				$('.open_bt_login').unbind('click');
				$('.open_bt_login').click(function(e) {
					e.preventDefault();	
					$('#messagesPage').show();
					setTimeout(function() {
						$('#page-wrap').addClass('active');
						$('#messagesPage').addClass('active');
						setTimeout(function() {
							$('body').addClass('bturg');
						}, 300);
						app.subInit();
					}, 200);
					app.initMessagesPage();
				});
				
				//$('#page-wrap').hide();
				//$('#messagesPage').fadeIn('fast');
				
				app.initMessagesPage();
				$('.refreshMessages').click(function(e) {
					e.preventDefault();
					app.initMessagesPage();
				});
				
				
			} else if (results.code == '201') {
				$('input[name="username"]').addClass('alertForm');
			} else if (results.code == '202') {
				
			} else if (results.code == '203') {
				
			} else if (results.code == '204') {
				$('input[name="password"]').addClass('alertForm');
			}
		
		}, 'jsonp');	
		
	},
	
	initScrolls: function() {
		
		loaded = false;
		
		$(window).unbind('scroll');
		
		$(window).scroll(function() {
		
		   if (loaded == false) {
			   if ($('#messagesPage').is(':visible')) {
				   if ($(window).scrollTop() + $(window).height() + 60 >= $(document).height() && !loaded) {
				   	   
				   	   
				   	   if(!$('#messageList').hasClass('opened') && !$('#newMessageForm').is(':visible')) {
				   	   	   loaded = true;
					       totalNews = $('#messagesList').find('.wrap').length;
					       
					       if ($('.messages-tab.active').hasClass('send'))
					       		app.initMessagesPage(totalNews, 1);
					       else
					       		app.initMessagesPage(totalNews, 0);
					       
					       setTimeout(function() {
						       loaded = false;
					       }, 1000);
				       
				       }
				       
				       //alert('whaat');
				   }
			   } else if($('#marketPage').is(':visible')) {
			   	   
				   if ($(window).scrollTop() + $(window).height() + 60 >= $(document).height() && !loaded) {
				   	   
				   	   
				   	   if(!$('#marketList').hasClass('opened') && $('#marketList').is(':visible')) {
				   	   	   loaded = true;
					       totalItems = $('#marketList').find('.item').length;
					       data.start = totalItems;
					       data.limit = 10;
					       
					       if (app.storeMode) {
					       		//data.limit = 100;
					       		//data.start = 0;
					       		//app.getStores(data);
					       } else {
					       		app.showLoader();
					       		app.getMarket(data);
					       }
					       setTimeout(function() {
						       loaded = false;
					       }, 1000);
					       //alert('whaat');
				       
				       } else if ($('#myList').is(':visible')) {
					       loaded = true;
					       totalItems = $('#myList').find('.news').length;
					       app.showLoader();
					       app.getUserMarket(totalItems);
					       setTimeout(function() {
						       loaded = false;
					       }, 1000);
				       } else if ($('#marketOrders').is(':visible')) {
				       		
				       		loaded = true;
				       		totalItems = $('.orders-content').find('tr').length;
				       		app.showLoader();
				       		data = {};
					   		data.start = totalItems;
					   		data.limit = 10;
					   		
							if ($(this).hasClass('order-buy')) {
								app.getUserOrders('buyer');
								$('.seller-buyer').html('Müüja');
							} else {
								app.getUserOrders('seller');
								$('.seller-buyer').html('Ostja');
							}
							
							setTimeout(function() {
						    	loaded = false;
						    }, 1000);
							
				       }
				   }
			   } else if ($('#newsPage').is(':visible')) {
				   if ($(window).scrollTop() + $(window).height() + 60 >= $(document).height() && !loaded) {
					   	if (!$('#newsItem').hasClass('opened') && !$('#newsPage').find('.sidebar').hasClass('active')) {
						   	loaded = true;
							totalNews = $('.newslist').find('.news').length;
							if(newsType == 'hot')
								newsType = 'last';
							
							app.showLoader();
							app.getArticles(newsType, newsSearch, totalNews);
							setTimeout(function() {
								loaded = false;
							}, 1000);
					   	}
						
						//alert('whaat');
					}
			   }
		   }
		});		
		
	},
	
	getMarketCats: function() {
		//localStorage.removeItem('marketCats');
		if(app.marketCats = localStorage.getObject('marketCats')) {
			app.parseMarketCats();
		} else {
			$.get(app.serverUrl + 'Market/categories/', {}, function(results) {
				app.marketCats = results.data;
				localStorage.setObject('marketCats', results.data);
				app.parseMarketCats();
				
			}, 'jsonp');
		}
	},
	
	parseMarketCats: function() {
		//$('#marketPage').find('.menu_level1').html('');
		$('#marketMenu').html('<nav class="menu_level1"></nav>');
		
		var level1s = {};
		var level2s = {};
		var level3s = {};
		
		var catsHtml1 = '';
		var catsHtml2 = '';
		var catsHtml3 = '';
		
		$.each(app.marketCats, function(i, cat) {
			if (cat.level == 0) {
				$('#marketMenu').find('.menu_level1').append('<a class="main-cat" rel="' + cat.id + '"  href="#">' + cat.name + '<span></span></a>');
			} else {
				if ($('.subnav' + cat.parentId).length) {
					$('.subnav' + cat.parentId).append('<a href="#" rel="' + cat.id + '">' + cat.name + '<span></span></a>');
				} else {
					$('#marketMenu').append('<div style="display:none;" class="sub-cat subnav' + cat.parentId + '"><a rel="' + cat.parentId + '" class="catsback" href="#">Tagasi</a><a href="#" rel="' + cat.id + '">' + cat.name + '<span></span></a></div>');
				}
			}
			
			if (cat.level == 0) {
				level1s[cat.id] = cat;
			} else if (cat.level == 1) {
				level2s[cat.id] = cat;
			} else {
				level3s[cat.id] = cat;
			}
			
		});
		
		
		setTimeout(function() {
			$.each(level3s, function(key, val) {
			
				if (level2s[val.parentId]) {
					if(!level2s[val.parentId].children)
						level2s[val.parentId].children = {};
						
					level2s[val.parentId].children[val.id] = val;
				}
			});
			
			$.each(level2s, function(key, val) {
				if (level1s[val.parentId]) {
					if(!level1s[val.parentId].children)
						level1s[val.parentId].children = {};
					
					level1s[val.parentId].children[val.id] = val;
				}
			});
			
			app.catsTree = level1s;
		}, 2000);
		
		
		app.initMarketCatsNav();
			
	},
	
	initMarketCatsNav: function() {
		
		var lastSubCat = false;
		var loadSubCat = false;
		
		$('.main-cat').unbind('click');
		$('.main-cat').bind('click', function(e) {
			e.preventDefault();
			rel = $(this).attr('rel');
			$(window).scrollTop(0);
			
			$('#marketMenu').find('a').removeClass('active');
			$(this).addClass('active');

			$('#marketPage').find('.menu_level1').removeClass('active');
			$(this).parent().removeClass('active');
			$('#marketPage').find('.sidebar').removeClass('active');
			$('#marketPage').find('.categories').removeClass('active');
			
			data.category = rel;
			data.limit = 10;
			data.start = 0;
			
			app.getMarket(data);
		});
		$('.main-cat').find('span').unbind('click');
		$('.main-cat').find('span').bind('click', function(e) {
			rel = $(this).parent().attr('rel');
			
			lastSubCat = rel;
			loadSubCat = false;
			
			e.preventDefault();
			e.stopPropagation();
			$(window).scrollTop(0);
			$('#marketPage').find('.menu_level1').addClass('active');
			$('.subnav' + rel).show().addClass('active');
		});
		$('.sub-cat').find('span').unbind('click');
		$('.sub-cat').find('span').bind('click', function(e) {
			rel = $(this).parent().attr('rel');
			e.preventDefault();
			e.stopPropagation();
			$(window).scrollTop(0);
			
			if ($('.subnav' + rel).html()) {
				loadSubCat = true;
				$('.sub-cat').removeClass('active');
				$('.subnav' + rel).show().addClass('active');
				 
			} else {
				$('#marketMenu').find('a').removeClass('active');
				$(this).addClass('active');
				
				$('#marketPage').find('.menu_level1').removeClass('active');
				$(this).parent().removeClass('active');
				$('#marketPage').find('.sidebar').removeClass('active');
				$('#marketPage').find('.categories').removeClass('active');
				
				
				data.category = rel;
				data.limit = 10;
				data.start = 0;
				
				app.getMarket(data);
			}
		});
		$('.sub-cat').find('a').unbind('click');
		$('.sub-cat').find('a').bind('click', function(e) {
			
			e.preventDefault();
			
			rel = $(this).attr('rel');
			
			$('#marketMenu').find('a').removeClass('active');
			$(this).addClass('active');
			
			
			
			$('#marketPage').find('.menu_level1').removeClass('active');
			$(this).parent().removeClass('active');
			$('#marketPage').find('.sidebar').removeClass('active');
			$('#marketPage').find('.categories').removeClass('active');
			
			
			data.category = rel;
			data.limit = 10;
			data.start = 0;
			
			app.getMarket(data);
			
		});
		
		$('.catsback').unbind('click');
		$('.catsback').bind('click', function(e) {
			e.preventDefault();
			rel = $(this).attr('rel');
			
			if (loadSubCat) {
				$('.sub-cat').removeClass('active');
				$('.subnav' + lastSubCat).show().addClass('active');
				lastSubCat = false;
				loadSubCat = false;
			} else {
				$('#marketPage').find('.menu_level1').removeClass('active');
				$('.subnav' + rel).removeClass('active');
			}
			
		});	
		
	},
	
	initMarket: function() {
		
		data = {};
		data.limit = 10;
		
		$('.oth').hide();
		
		$('.to-main-new').unbind('click');
		$('.to-main-new').click(function(e) {
			data = {};
			data.start = 0;
			data.limit = 10;
			e.preventDefault();
			app.getMarket(data);
			app.storeMode = false;
			app.hideSearch();
			app.hideCategories();
		});
		
		$('.refreshMarket').unbind('click');
		$('.refreshMarket').click(function(e) {
			$('.market-header').hide();
			$('.oth').hide();
			data = {};
			data.start = 0;
			data.limit = 10;
			e.preventDefault();
			app.getMarket(data);
			app.storeMode = false;
			app.hideSearch();
			app.hideCategories();
		});
		
		$('.get-auctions').unbind('click');
		$('.get-auctions').click(function(e) {
			
			e.preventDefault();
			$('.market-header').hide();
			$('.oth').hide();
			data = {};
			data.itemTypes = [];
			data.start = 0;
			data.limit = 10;
			data.itemTypes.push('auction');
			app.getMarket(data);
			app.storeMode = false;
			app.hideSearch();
			app.hideCategories();
		});
		
		$('.get-markets').unbind('click');
		$('.get-markets').click(function(e) {
			e.preventDefault();
			data = {};
			data.start = 0;
			data.limit = 10;
			$('.market-header').hide();
			$('.oth').hide();
			if ($(this).hasClass('fashion')) {
				data.types = 'fashion';
			} else {
				data.types = 'big,small';
			}
			
			app.storeMode = true;
			app.getStores(data);
			app.hideSearch();
			app.hideCategories();
		});
		
		$('.get-products').unbind('click');
		$('.get-products').click(function(e) {
			e.preventDefault();
			$('.market-header').hide();
			$('.oth').hide();
			data = {};
			data.start = 0;
			data.limit = 10;
			app.storeMode = false;
			app.getMarket(data);
			app.hideSearch();
			app.hideCategories();
		});
		
		$('#searchMarketForm').unbind('submit');
		$('#searchMarketForm').submit(function(e) {
			e.preventDefault();
			data = {};
			search = {};
			
			data.start = 0;
			data.limit = 10;
			
			data.minPrice = $('#marketSearchPriceFrom').val();
			data.maxPrice = $('#marketSearchPriceTo').val();
			if ($('#condition').val() && $('#condition').val() != 0) {
				data.conditions = [];
				data.conditions.push($('#condition').val());
				search.condition = $('#condition').val();
			}
			if ($('#location').val() && $('#location').val() != 0) {
				data.locations = [];
				data.locations.push($('#location').val());
				search.location = $('#location').val();
			}
			
			data.dealType = $('#dealtype').val();
			search.dealType = $('#dealtype').val();
			
			data.itemType = $('#dealtype').val();
			search.itemType = $('#dealtype').val();
			
			data.availability = $('#dealtype').val();
			search.availability = $('#dealtype').val();
			
			app.hideSearch();
			app.hideCategories();
			
			data.searchString = $('#marketSearchStr').val();
			
			app.getMarket(data);
			
			app.isMarketSearch = true;
			
		});
		
		app.getMarket(data);
		
		
		/*
		* scroll down, load more..
		*/		
		
	},
	
	hideSearch: function() {
		
		$('.search span').removeClass('active');
		setTimeout(function() {
			$('.searchbox').css('z-index', '-1');
		}, 300);	
		$('.searchbox').removeClass('active');
		$('.newssection, .newssectionopen, .barsubmenu, .underbarsubmenu, .toodepage, .account, .page-wrap').removeClass('active');
			
	},
	
	hideCategories: function() {
		
		$('.categories').removeClass('active');	
		$('.sidebar').removeClass('active');
			
	},
	
	getFilters: function(data) {
		
		http://api.buduaar.ee/Market//?callback=filters	
		//data = {};
		$.get(app.serverUrl + 'Market/searchFilters/', data, function(results) {
		
			$('#searchFilters').html('');
			
			$.each(results.data, function(key, val) {
				if(!parseInt(key) && key != 'price' && key != 'category') {
					
					options = '<option value="0">' + val.name + '</option>';
					
					$.each(val.values, function(key2, val2) {
						
						options = options + '<option value="' + key2 + '" ' + (search[key] && search[key] == key2 ? ' selected="selected"' : '') + '>' + val2.name + ' (' + val2.count + ')</option>'
					
					});
					
					$('#searchFilters').append('<div class="select-container"><select id="' + key + '" style="height:50px;margin-bottom:0%;">' + options + '</select><label for="' + key + '" class="itemreturn"><span></span></label></div>');
					
					
				}
				
				
			});

		}, 'jsonp');
		
	},
	
	initMarketAdd: function(id) {
	
		$('.oth').show();
		
		if (id)
			app.currentEditId = id;
		else
			app.currentEditId = false;
		
		app.saveStage = 1;
		app.imageURI = '';
		
		$('#auction_length').html('');
		for (var i=1; i<31; i++) {
			$('#auction_length').append('<option value="' + i + '">' + i + ' päeva</option>');
		}
		
		$('#profilePic').attr('src', '#');
		
		$('#back1').unbind('click');
		$('#back1').click(function(e) {
			e.preventDefault();
			$('#marketOrders').hide();
			$('#marketAdd').hide();
			
			setTimeout(function() {
				$('#page-wrap').addClass('active');
				$('#marketPage').addClass('active');
			}, 200);
				$('.oth').hide();
			if ($('#myList').is(':visible')) {
				$('#marketList').show();
				$('#marketDetail').show();
				$('#myList').hide();
			} else {
				$('.marketContainer').find('.page-wrap').hide();
				$('#myList').fadeIn('fast');
				app.getUserMarket(false);
			}
		});
		
		$('#back2').unbind('click');
		$('#back2').click(function(e) {
			e.preventDefault();
			$('#itemForm2').hide();
			$('#itemForm').css('margin-top', '-' + 0 + 'px');
			app.saveStage = 1;
		});
		
		$('#back3').unbind('click');
		$('#back3').click(function(e) {
			e.preventDefault();
			$('#itemForm3').hide();
			height1 = $('#itemForm').height();
			total_h = height1;
			$('#itemForm').css('margin-top', '-' + total_h + 'px');
			app.saveStage = 2;
		});
		
		$('.one').unbind('click');
		$('.one').click(function(e) {
			e.preventDefault();
		});
		
		$('.two').unbind('click');
		$('.two').click(function(e) {
			e.preventDefault();
		});
		
		$('.three').unbind('click');
		$('.three').click(function(e) {
			e.preventDefault();
		});
		
		$('#itemForm').unbind('submit');
		$('#itemForm').submit(function(e) {
			e.preventDefault();
			//alert('wdf..');
		});
		$('#itemForm2').unbind('submit');
		$('#itemForm2').submit(function(e) {
			e.preventDefault();
		});
		$('#itemForm3').unbind('submit');
		$('#itemForm3').submit(function(e) {
			e.preventDefault();
		});
		
		$('#marketAdd').find('input:not(input[type="submit"])').val('');
		$('#marketAdd').find('select').val('');
		$('#marketAdd').find('textarea').val('');
		$('.uploaded').html('');
		
		if (id) {
		
			$('.no-pic-text').hide();
			
			$.get(app.serverUrl + 'Market/userMarketItem/' + id, {}, function(results) {
				
				item = results.data.item[0];
				
				$('input[name="post"]').removeAttr('checked');
				
				$('#postSizes').hide();
				$('#smartSizes').hide();
				
				$.each(results.data.postingMethods, function(i, method) {
					$('#' + method.method).attr('checked', 'checked');
					if (method.method == 'smartpost') {
						$('#smartSizes').show();
						$('#smartPostPacketSize').val(method.packageSize);
					}
					if (method.method == 'eestipost') {
						$('#postSizes').show();
						$('#post24PackageSize').val(method.packageSize);
					}
				});
				
				$('#ad_name').val(item.name);
				$('#add_description').val(item.description);
				$('#add_additional').val();
				$('.client-type-box').find('input[value="'+item.businessClient+'"]').prop('checked', true);
				$('input[value="'+item.itemType+'"]').prop('checked', true);
				$('input[value="'+item.dealType+'"]').prop('checked', true);
				
				$('#ad_condition').val(item.condition);
				$('#ad_availability').val(item.availability);
				
				if(item.itemType == 'auction') {
					
					data.price = $('#auction_price').val(item.openingPrice);
					data.length = $('#auction_length').val(item.length);
					data.bidStep = $('#auction_step').val(item.bidStep);
					
					$('.add-auction-section').show();
					$('.add-ad-section').hide();
					$('.add-type-box').hide();
					
					$('#add_ad').removeAttr('checked');
					$('#add_auction').attr('checked', 'checked');
					
				} else {
					$('#ad_price').val(item.price);
					$('#ad_quantity').val(item.amount);
					$('#ad_quantity').val();
					
					$('.add-auction-section').hide();
					$('.add-ad-section').show();
					$('.add-type-box').show();
					
					$('#add_auction').removeAttr('checked');
					$('#add_ad').attr('checked', 'checked');

				}
				
				$('#ad_location').val(item.location);
				$('#ad_deliveryTimeInDays').val(3);
				
				
				$('#ad_category').val(item.category);
				
				app.getCatFeatures(item.category, results.data.descriptionOptions);
				
				$('.category-features').show();
				
				$('.marketContainer').find('.page-wrap').hide();
				$('#marketAdd').show();
				
				$('.uploaded').html('');
				
				//$('.uploaded').append('<a href="#" class="remove-pic" rel="'+item.id+'"><img src="'+item.image+'" /><span></span></a>');
				
				
				
				
				$('#add_ad').parent().hide();
				
				$('#profilePic').attr('src', item.image);
				
				$.get(app.serverUrl + 'Market/itemImages/' + id, {}, function(results) {
					
					$.each(results.data, function(i, itemImage) {
						$('.uploaded').append('<a class="remove-pic" rel="'+itemImage.id+'" href="#"><img class="toode_thumb" src="'+itemImage.icon+'" alt="logo"/><br style="clear:both;" /><span></span></a>')
						//$('.toode_thumb').attr('src', ).parent().attr('href', );
	
					});	
					
					app.initPicRemove();
				
				}, 'jsonp');
				
				
				
				//$('.uploaded').append();
				
			}, 'jsonp');
			
		} else {
		
			$('#add_ad').parent().show();
		
			$('.no-pic-text').show();
			$('.category-features').html('');
			
			
			$('input[name="post"]').attr('checked', 'checked');
			$('#postSizes').show();
			$('#smartSizes').show();
			
			$('#add_auction').removeAttr('checked');
			$('#add_ad').attr('checked', 'checked');
			
			$('.add-ad-section').show();
			
		}
		
		$('#ad_deliveryTimeInDays').val(3);
		
		$('#marketAdd').find('.takepicture').unbind('click');
		$('#marketAdd').find('.takepicture').click(function(e) {
			e.preventDefault();
			if ($(this).hasClass('.step2-capture')) {
				if($('.uploaded').find('img').lenght == 4) {
					alert('Maksimum piltide arv on 4, kustuta, et laadida juurde');
				} else {
					captureImage();
				}
			} else {
				captureImage();
			}
			
		});
		
		$('#marketAdd').find('.upload').unbind('click');
		$('#marketAdd').find('.upload').click(function(e) {
			e.preventDefault();
			if ($(this).hasClass('.step2-capture')) {
				if($('.uploaded').find('img').lenght == 4) {
					alert('Maksimum piltide arv on 4, kustuta, et laadida juurde');
				} else {
					getPhoto();
				}
			} else {
				getPhoto();
			}
			
		});
		
		
		
		$('#itemForm').css('margin-top', 0);
		$('#itemForm2').hide();
		$('#itemForm3').hide();
		$('#saveFinish').hide();
		
		$('.one').addClass('active');
		$('.two').removeClass('active');
		$('.three').removeClass('active');

		$('.add-auction-section').hide();
		
		$('#add_auction').unbind('click');
		$('#add_auction').click(function() {
			$('.add-auction-section').show();
			$('.add-ad-section').hide();
			$('.add-type-box').hide();
			
		});
		
		$('#add_ad').unbind('click');
		$('#add_ad').click(function() {
			$('.add-auction-section').hide();
			$('.add-ad-section').show();
			$('.add-type-box').show();
		});
		
		$('#add_sale').unbind('click');
		$('#add_sale').click(function() {
			$('#ad_availability').show();
		});
		
		$('#add_buy').unbind('click');
		$('#add_buy').click(function() {
			$('#ad_availability').hide();
		});
		
		
		/*
		* POST STUFF!!
		*/
		
		$('.transport-check').unbind('click');
		$('.transport-check').click(function(e) {
			if($(this).attr('id') == 'smartpost') {
				$('#smartSizes').toggle();
			}
			if($(this).attr('id') == 'eestipost') {
				$('#postSizes').toggle();
			}
		});
		
		$.each(app.catsTree, function(i, cat) {
						
			$('#ad_category').append('<option value="' + cat.id + '" disabled="disabled">' + cat.name + '</option>');
			
			if (cat.children) {
				
				$.each(cat.children, function(i, sub_cat) {
				
					$('#ad_category').append('<option value="' + sub_cat.id + '"' + (sub_cat.children && sub_cat.children.length ? 'disabled="disabled"' : '' ) + '>&nbsp;&nbsp;&nbsp;&nbsp;' + sub_cat.name+'</option>');
					
					if(sub_cat.children) {
				
						$.each(sub_cat.children, function(i, sub_sub_cat) {
						
							$('#ad_category').append('<option value="'+sub_sub_cat.id+'">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + sub_sub_cat.name+'</option>');
						
						});
						
					}
					
				});
				
			}
			
			
		});
		
		$('#ad_category').unbind('change');
		$('#ad_category').change(function() {
			cat_id = $(this).val();
			app.getCatFeatures(cat_id, false);
		});
		
		$('#addStep1').unbind('click');
		$('#addStep1').click(function(e) {
			e.preventDefault();
			app.saveItem(1, false);
			
		});
		
		$('#addStep2').unbind('click');
		$('#addStep2').click(function(e) {
			e.preventDefault();
			app.saveItem(2, false);
			
		});
		
		$('#addStep3').unbind('click');
		$('#addStep3').click(function(e) {
			e.preventDefault();
			app.saveItem(3, false);
			
		});
		
		$('#saveStep1').unbind('click');
		$('#saveStep1').click(function(e) {
			e.preventDefault();
			app.saveItem(1, true);
		});
		
		$('#saveStep2').unbind('click');
		$('#saveStep2').click(function(e) {
			e.preventDefault();
			app.saveItem(2, true);
		});
		
		$('#saveStep3').unbind('click');
		$('#saveStep3').click(function(e) {
			e.preventDefault();
			app.saveItem(3, true);
		});
		
		$('#addCountry').val(user.country);
		$('#addCounty').val(user.county);
		$('#addCity').val(user.city);
		$('#addStreet').val(user.street);
		$('#addHouse').val(user.houseNumber);
		$('#addApartment').val(user.apartmentNumber);
		$('#addIndex').val(user.postalIndex);
		
		$('#add_additional').val(user.marketItemsAdditionalInformation);
		
	},
	
	initPicRemove: function() {
		$('.remove-pic').click(function(e) {
			e.preventDefault();
		});
		$('.remove-pic').find('span').unbind('click');
		$('.remove-pic').find('span').click(function(e) {
			e.preventDefault();
			img_element = $(this).parent();
			rel = img_element.attr('rel');
			$.get(app.serverUrl + 'Market/deleteItemImage/' + rel, {}, function(results) {
				img_element.remove();
				$('body').scrollTop(0);	
				$('.uploaded').hide();
				setTimeout(function() {
					$('.uploaded').show();
				}, 300);					
			}, 'jsonp');
			
		});
			
	},
	
	getCatFeatures: function(cat_id, user_cats) {
		app.showLoader();
		
		$.get(app.serverUrl + 'Market/categoryFeatures/' + cat_id, {}, function(results) {
				$('.category-features').html('');
				
				$.each(results.data, function(i, item) {
					values = '';
					fieldType = 'radio';
					if (item.fieldType == 'checkboxes') {
						fieldType = 'checkbox';
					}
					
					if (item.fieldType == 'select') {
						
						$.each(item.values, function(j, value) {
							values = values + '<option value="'+j+'">'+value.valueEst+'</option>';
						});
						
						$('.category-features').append('<div class="select-container"><select id="select_'+i+'"><option>'+item.nameEst+'</option>' + values + '</select><label for="select_'+i+'" class="itemreturn"><span></span></label></div>');
						
					} else {
						special_str = '';
						$.each(item.values, function(j, value) {
							if(user_cats[i]) {
								
								$.each(user_cats[i].values, function(k,l) {
									if (l == value.valueEst) {
										special_str = ' checked="checked"';
									} else {
										special_str = '';
									}
								});
							}
							values = values + '<input ' + special_str + ' type="' + fieldType + '" data-parent="' + i + '" data-value="' + j + '" id="check_'+j+'" name="check_'+i+'" value="' + j + '" /><label style="margin:5px;" for="check_'+j+'"><span></span> '+value.valueEst+'</label>';
						});
						
						
						
						$('.category-features').append('<div class="pricebox"><span style="width:auto;margin-right:10px;">'+item.nameEst+': </span>' + values + '<br style="clear:both;" />');
					
					
					}
					
				});
				$('.ajax-loader').hide();
				
			}, 'jsonp');	
		
	},
	
	saveItem: function(step, isSave) {
		
		data = {};
		
		if(app.currentEditId)
			data.id = app.currentEditId;		
		
		data.stage = step;
		data.session = app.session;

		$('.check-new').attr('rel', app.currentEditId);

		/*
		* Transport
		*/
		
		//if (step == 1) {
			
			/*
			* Check if fields filled..
			*/
			
			data.name = $('#ad_name').val();
			data.description = $('#add_description').val();
			data.marketItemsAdditionalInformation = $('#add_additional').val();
			
			data.businessClient = $('input[name="ad_client"]:checked').data('value');
			data.adType = $('input[name="ad_type"]:checked').data('value');
			
			
			data.condition = $('#ad_condition').val();
			data.availability = $('#ad_availability').val();
			
			if(data.adType == 'oksjon') {
				data.price = $('#auction_price').val();
				data.length = $('#auction_length').val();
				data.bidStep = $('#auction_step').val();
				
			} else {
				data.dealType = $('input[name="ad_deal_type"]:checked').data('value');
				data.price = $('#ad_price').val();
				data.amount = $('#ad_quantity').val();
				data.amountLeft = $('#ad_quantity').val();
			}
			
			
			data.category = $('#ad_category').val();

			data.isNotBuyAble = 0;
			
			$('.category-features').find('input:checked').each(function(i, item) {
				
				value = 'desc_option_' + $(this).data('parent') + '[' + $(this).data('value') + ']';
				
				data[value] = $(this).data('value');
				
			});
			
			
			app.saveParams = data;

		//}
		
		if (step == 2) {

			/*
			* upload photos to server or smthng, get script from minudate. 20min, do it later, when app is ready.
			* 
			*/
			
		}
		
		if (step == 3) {

			data.location = $('#ad_location').val();
			data.deliveryTimeInDays = $('#ad_deliveryTimeInDays').val();
			
			data.postingMethods = [];
			
			$('input[name="post"]:checked').each(function(i,item) {
			
				value = 'postingMethods[' + $(this).data('value') + ']';
				
				data[value] = $(this).data('value');
			
				//data.postingMethods.push($(item).data('value'));
			});
			
			data.smartPostPacketSize = $('#smartPostPacketSize').val();
			data.post24PacketSize = $('#post24PackageSize').val();
			
			data.country = $('#addCountry').val();
			data.county = $('#addCounty').val();
			data.city = $('#addCity').val();
			data.street = $('#addStreet').val();
			data.houseNumber = $('#addHouse').val();
			data.apartmentNumber = $('#addApartment').val();
			data.postalIndex = $('#addIndex').val();
			
		}
		
		data.action = 'addItem';
		if (step == 1) {
			uploadFile(app.imageURI, isSave);
		} else {
			$.get(app.supportUrl, data, function(results) {
				
				if (results.code == '1' || results.code == 1) {
				
					app.currentEditId = results.data.item.id;

					
					if (step == 3) {
				
						$('body').scrollTop(0);
						$('#saveFinish').show();
						height1 = $('#itemForm').height();
						height2 = $('#itemForm2').height();
						height3 = $('#itemForm3').height();
						total_h = height1 + height2 + height3;
						$('#itemForm').css('margin-top', '-' + total_h + 'px');
						$('.oth').hide();
						
					} else {
						if (!isSave) {
							if (step == 2) {
								
								$('.one').removeClass('active');
								$('.two').removeClass('active');
								$('.three').addClass('active');
								
								$('body').scrollTop(0);
								$('#itemForm3').show();
								
								height1 = $('#itemForm').height();
								height2 = $('#itemForm2').height();
								total_h = height1 + height2;
								app.saveStage = 3;
								$('#itemForm').css('margin-top', '-' + total_h + 'px');
								return false;
								
							}
							
						} else {
							app.showDialog('Salvestatud!', 'Teade!');
						}
						
					}
					
				} else {
					//alert(results.data);
					if(results.data && results.data.length) {
						app.showDialog(results.data, 'Teade!');
					} else {
						app.showDialog(results.message, 'Teade!');
					}
				}
			
			}, 'jsonp');
		}
	},
	
	responseFunction: function(data) {
		
		return false;
			
	},
	
	getStores: function(data) {
		data.limit = 100;
		app.showLoader(603);
		
		$('.marketContainer').find('.page-wrap').hide();
		$('.marketContainer').find('#marketList').show();
		$('.marketContainer').find('#marketDetail').show();
		
		$.get(app.serverUrl + 'Market/randomizedStores/', data, function(results) {
		
			$('.page-wrap').removeClass('opened');
		
			if (!data.start)
				$('#itemsList').html('');
			
			stores = [];
			
			$.each(results.data, function(i, item) {
			
				category = '';
				
				stores[item.id] = item;
			
				$('.market-template').find('.item').attr('data-id', item.id);
				$('.market-template').find('img').attr('src', item.mediumIcon);

				$('.market-template').find('.item-description').html(item.name + '(' + item.numberOfMarketItems + ')');
				$('.market-template').find('.price').html('');
				if (isOdd(i+1))
					$('#itemsList').append($('.market-template').html());
				
			});
			$.each(results.data, function(i, item) {
			
				category = '';
			
				$('.market-template').find('.item').attr('data-id', item.id);
				$('.market-template').find('img').attr('src', item.mediumIcon);

				$('.market-template').find('.item-description').html(item.name + '(' + item.numberOfMarketItems + ')');
				$('.market-template').find('.price').html('');
				if (!isOdd(i+1))
					$('#itemsList').append($('.market-template').html());
				
			});
			
			$('.ajax-loader').hide();
			
			$('.item').unbind('click');
			$('.item').click(function(e) {
				e.preventDefault();
				//app.showLoader();
				
				$(window).scrollTop(0);
				
				data = {};
				data.limit = 10;
				data.start = 0;
				
				data.store = $(this).data('id');
				
				var curStore = stores[data.store];

				$('.market-header').find('.market-image').attr('src', curStore.mediumIcon);
				$('.market-header').find('.market-title').html(curStore.name);
				$('.market-header').find('.market-description').html(curStore.description);
				$('.market-header').find('.market-message-to-owner').attr('data-username', curStore.owner);
				
				if (!curStore.email || curStore.email == '')
					$('.market-mail').html('-');
				else
					$('.market-header').find('.market-mail').html('<a style="color:#da4b8b;" href="mailto:' + curStore.email + '">' + curStore.email + '</a>');
					
				if (!curStore.contactPhoneNumber || curStore.contactPhoneNumber == '')
					$('.market-phone').html('-');
				else
					$('.market-header').find('.market-phone').html('<a style="color:#da4b8b;" href="mailto:' + curStore.contactPhoneNumber + '">' + curStore.contactPhoneNumber + '</a>');
					
				if (!curStore.website || curStore.website == '')
					$('.market-web').html('-');
				else
					$('.market-header').find('.market-web').html('<a style="color:#da4b8b;" href="mailto:' + curStore.website + '">' + curStore.website + '</a>');
				
				$('.market-message-to-owner').unbind('click');
				$('.market-message-to-owner').click(function(e) {
					e.preventDefault();
				
					$('#messageForm2').find('#user').val($(this).data('username'));
					
					$('.page-sidebar-wrap').hide().removeClass('active');
					$('#messagesPage').show();
					setTimeout(function() {
						$('body').scrollTop(0);
						$('#page-wrap').addClass('active');
						$('#messagesPage').addClass('active');
						setTimeout(function() {
							$('body').addClass('bturg');
							$('#startNewMessage').parent().click();
						}, 300);
					}, 200);
				});					
					
				if (curStore.headerColor)
					$('.market-header').css('background-color', curStore.headerColor);
				else
					$('.market-header').css('background-color', '#E7E7E7');
						
					
				
				$('.market-header').show();
				
				app.getMarket(data);
				
				$('.menu_bar').find('.back').unbind('click');
				$('.menu_bar').find('.back').click(function(e) {
					e.preventDefault();
					if($('.page-wrap.opened').length) {
						//alert('opened!!');
						$('.page-wrap').removeClass('opened');
						//return false;
					} else {
						$('.market-header').hide();
						
						data = {};
						data.limit = 10;
						data.start = 0;
						app.getStores(data);
						app.initMainBack();
						app.storeMode = true;
					}
					
				});
				
			});
			$('.ajax-loader').hide();
			
			
		}, 'jsonp');	
		
	},
	
	getUserOrders: function(which) {
	
		$('.market-header').hide();
		
		$('.list-container').show();
		$('.detail-container').hide();
	
		if(!data)
			
		
		app.storeMode = false;
		
		if (!data.start)
			start = 0;
		else
			start = data.start;
			
		data = {};
		data.limit = 10;
		data.start = start;
		
		app.showLoader(723);
		
		data.key = which;
		data.session = app.session;
		
		if (which == 'buyer') {
			//app.getUserOrders('buyer');
			$('#marketOrders').find('table').addClass('buyer').removeClass('seller');
		} else {
			//app.getUserOrders('seller');
			$('#marketOrders').find('table').addClass('seller').removeClass('buyer');
		}
		
		$.get(app.serverUrl + 'Market/orders/', data, function(results) {
			
			if (!data.start)
				$('.orders-content').html('');
		
			setTimeout(function() {
				$('.ajax-loader').hide();
			}, 1000);
		
			$.each(results.data, function(i, item) {
				
				category = '';
				$('.order-template').find('.item').attr('data-id', item.id);
				if(which == 'buyer')
					orderer = item.sellerUsername;
				else
					orderer = item.buyerUsername;
				
				orderRow = '<tr data-id="' + item.id + '">';	
				orderRow = orderRow + '<td>' + orderer + '</td>';
				orderRow = orderRow + '<td>' + item.datetime + '</td>';
				orderRow = orderRow + '<td>' + item.stateLang + '</td>';
				orderRow = orderRow + '<td>' + item.quantity + '</td>';
				orderRow = orderRow + '<td>' + parseFloat(item.price).toFixed(2) + ' €</td>';
				orderRow = orderRow + '<td>' + parseFloat(item.totalPrice).toFixed(2) + ' €</td>';
				orderRow = orderRow + '</tr>';
				
				$('.orders-content').append(orderRow);
				
			});
			
			//alert('hide this shit..');
			
			$('.ajax-loader').hide();
			
			$('.orders-content').find('tr').unbind('click');
			$('.orders-content').find('tr').click(function(e) {
				e.preventDefault();
				//app.showLoader();
				app.showOrder($(this).data('id'));
			});
			
			
			$('.orders-tab').unbind('click');
			$('.orders-tab').click(function(e) {
				e.preventDefault();
				$('.orders-tab').removeClass('active');
				$(this).addClass('active');
				//$('#newMessageForm').fadeOut();
				
				data.start = 0;
				
				if ($(this).hasClass('order-buy')) {
					app.getUserOrders('buyer');
					$('.seller-buyer').html('Müüja');
				} else {
					app.getUserOrders('seller');
					$('.seller-buyer').html('Ostja');
				}
			});
			

		}, 'jsonp');
	},
	
	showOrder: function(id) {
		data = {};
		data.session = app.session;
		
		app.showLoader();
		
		$.get(app.serverUrl + 'Market/order/' + id, data, function(results) {
			order = results.data;
			var content = $('.detail-container');
			content.show();
			$('.list-container').hide();
			
			$('#orderId').html(order.id);
			$('#orderStatus').html(order.stateLang);
			$('#orderPrice').html(parseFloat(order.price).toFixed(2) + ' €');
			$('#orderQuantity').html(order.quantity);
			$('#orderTransport').html(order.postingMethod);
			$('#orderSize').html(order.id);
			$('#depositeDescription').html(order.depositServiceTypeLang);
			$('#orderSeller').html(order.sellerFirstName + ' ' + order.sellerLastName + ', kasutajanimi: ' + order.sellerUsername);
			$('#orderSellerMail').find('a').attr('href','mailto:' + order.sellerEmail).html(order.sellerEmail);
			$('#orderSellerPhone').find('a').attr('href','tel:' + order.sellerPhone).html(order.sellerPhone);
			$('#orderBuyer').html(order.buyerFirstName + ' ' + order.buyerLastName + ', kasutajanimi: ' + order.buyerUsername);
			$('#orderBuyerMail').find('a').attr('href','mailto:' + order.buyerEmail).html(order.buyerEmail);
			$('#orderBuyerPhone').find('a').attr('href','tel:' + order.buyerPhone).html(order.buyerPhone);
			if (order.explanation && order.explanation != '')
				$('#orderComments').html(order.explanation);
			else
				$('#orderComments').html('&nbsp;');
			
			$('.ajax-loader').hide();
			
		}, 'jsonp');
		
	},
	
	getUserMarket: function(start) {
		
		$('.market-header').hide();
		
		data = {};
		
		app.storeMode = false;
		data.session = app.session;
		
		data.limit = 20;
		
		if (!start)
			data.start = 0;
		else
			data.start = start;
		
		app.showLoader(773);
		$.get(app.serverUrl + 'Market/userMarketItems/', data, function(results) {
			
			if (!data.start)
				$('#myList').find('.list-container').html('').show();
		
			$('.ajax-loader').hide();
		
			$.each(results.data, function(i, item) {
			
				category = '';
				$('.my-item-template').find('.news').attr('data-id', item.id);
				if (item.active && item.active == 1)
					$('.my-item-template').find('.item-status').html('Aktiivne').css('color', 'green');
				else
					$('.my-item-template').find('.item-status').html('Mitte aktiivne').css('color', 'red');
				
				$('.my-item-template').find('img').attr('src', item.icon);
				
				$('.my-item-template').find('h2').html(item.name);
				$('.my-item-template').find('.meta').html(item.categoryLang);
				
				$('.my-item-template').find('.edit-user-item').attr('rel', item.id);
				$('.my-item-template').find('.refresh-user-item').attr('rel', item.id);
				
				$('.my-item-template').find('.price').html(parseFloat(Math.round(item.price * 100) / 100).toFixed(2) + '€');
				
				$('#myList').find('.list-container').append($('.my-item-template').html());
				
			});
			
			//alert('hide this shit..');
			setTimeout(function() {
				$('.ajax-loader').hide();
			}, 1000);
			
			
			$('.list-container').find('.news').unbind('click');
			$('.list-container').find('.news').click(function(e) {
				e.preventDefault();
				//app.showLoader();
				$('.marketContainer').find('.page-wrap').hide();
				$('#marketDetail').show();
				$('#marketList').show();
				app.getProduct($(this).data('id'), false);
			});
			
			$('.edit-user-item').unbind('click');
			$('.edit-user-item').click(function(e) {
			
				rel = $(this).attr('rel');
			
				e.preventDefault();
				e.stopPropagation();
				
				app.initMarketAdd(rel);
				
				//e.stopPropagation();
				//alert('what');
				return false;
			});
			
			$('.refresh-user-item').unbind('click');
			$('.refresh-user-item').click(function(e) {
				e.preventDefault();
				e.stopPropagation();
				
				element = $(this);
				rel = $(this).attr('rel');
				
				//e.stopPropagation();
				$.get(app.serverUrl + 'Market/updateMarketItemExpires/' + rel, data, function(results) {
					app.showDialog(results.data, 'Teade!');
					
					//alert(results.data);
					element.hide();
					//return false;	
				
				}, 'jsonp');
				
				//$('.addphoto').click();
			});

		}, 'jsonp');	
		
	},
	
	getMarket: function(data) {
	
		if(!data.store)
			$('.market-header').hide();
	
		app.storeMode = false;
		
		app.getFilters(data);
		
		$('.marketContainer').find('.page-wrap').hide();
		$('.marketContainer').find('#marketList').show();
		$('.marketContainer').find('#marketDetail').show();
		
		app.showLoader();
		
		$.get(app.serverUrl + 'Market/search/', data, function(results) {
			
			$('.page-wrap').removeClass('opened');
	
			if (!data.start)
				$('#itemsList').html('');

			$.each(results.data, function(i, item) {
				//console.log(item);
				category = '';
				
				$('.market-template').find('.item').attr('data-id', item.id);
				$('.market-template').find('.special-thumb').find('.thumb').attr('src', 'images/FF4D00-0.0.png');
				if (app.oldAndroid)
					$('.market-template').find('.special-thumb').css('background-image', 'url("' + item.mediumIcon + '")');
				else
					$('.market-template').find('.special-thumb').css('background-image', 'url("' + item.image + '")');
					
				$('.market-template').find('.item-description').html(item.categoryName);
				$('.market-template').find('.price').html(parseFloat(Math.round(item.price * 100) / 100).toFixed(2) + '€');
				$('#itemsList').append($('.market-template').html());
				
			});
			$('.item').unbind('click');
			$('.item').click(function(e) {
				e.preventDefault();
				//app.showLoader();
				app.getProduct($(this).data('id'), false);
				
				app.productCat = $(this).find('.item-description').html();
				
			});
			
			setTimeout(function() {
				$('.ajax-loader').hide();
			}, 500);

		}, 'jsonp');	
	},
	
	getProduct: function(id, isUser) {
		
		app.showLoader();
		
		$('body').scrollTop(0);
		
		if(isUser)
			method = 'userMarketItem';
		else
			method = 'item';
		
		$.get(app.serverUrl + 'Market/' + method + '/' + id, {}, function(results) {
		
			if(!results.data.item.length) {
				$('.toode').find('h2').html('Kuulutus pole aktiivne');
				$('.toode').find('.product-thumbs').hide();
				$('.toode').find('.ad-content').hide();
				$('.toode').find('.toode_preview').hide();
				$('.marketContainer').find('.page-wrap').addClass('opened');
				$('.ajax-loader').hide();
				return false;
			} else {
				$('.toode').find('.ad-content').show();
				$('.toode').find('.toode_preview').show();
				$('.toode').find('.product-thumbs').show();
			}
			
			$('.ajax-loader').hide();
			
			offer = results.data.item[0];
			
			$('.images-container').html('<a href="'+offer.image+'" class="item-image"><img class="toode_preview" src="'+offer.image+'" alt="logo"/></a><div class="product-thumbs"></div>');
			
			$('.toode_preview').attr('src', offer.image).parent().attr('href', offer.image);
			
			
			$('.toode').find('h2').html(offer.name);
			$('.item-cat').html(offer.categoryLang);
			
			$('.is-availeble').html(offer.availabilityLang);
			
			$('.is-new').html(offer.conditionLang);
			
			itemQuantity = offer.amount;
			
			$('.item-description-detail').html(offer.description);
			$('.item-location').html(offer.locationLang);
			if(offer.price)
				$('.item-price').html(parseFloat(offer.price) + '€');
			else
				$('.item-price').html('0.00 €');
				
			$('.item-quantity').html(offer.amount);
			
			$('.item-offerer').html(offer.username);
			
			$('.desc-options').html('');
			$('.product-thumbs').html('');
			
			$.each(results.data.descriptionOptions, function(i, option) {
				
				//armap = option.values.map();
				var arr = $.map(option.values, function (value, key) { return value; });
				
				if(option.values)
					$('.desc-options').append('<p><strong style="text-transform:capitalize;">' + option.name + '</strong>: ' + arr.join(', ') + '</p>');
				
			});
			
			
			if(offer.itemType == 'ad') {
				
				$('.item-bid-step').parent().hide();
				
				$('.item-quantity').parent().show();
				
				$('.buy').find('span').html('Broneeri');
				
				$('.minus').unbind('click');
				$('.minus').bind('click', function(e){
					e.preventDefault();
					var curr = Number($('.itemcount span').text());
					if(curr >= 2){
						$('.itemcount span').text(Number(curr) - 1);
					}
					
				});
				$('.plus').unbind('click');
				$('.plus').bind('click', function(e){
					e.preventDefault();
					
					var curr = $('.itemcount span').text();
					if(curr < itemQuantity)
						$('.itemcount span').text(Number(curr) + 1);
					//return false;
				});
			
			} else {
				
				$('.item-bid-step').parent().show();
			
				$('.buy').find('span').html('Paku');
				
				$('.item-quantity').parent().hide();
				
				$('.auction-info').show();
				$('.item-bid-step').html(offer.bidStep);
				if(offer.price)
					$('#orderCount').html(parseFloat(offer.price) + parseFloat(offer.bidStep));
				else
					$('#orderCount').html(0 + parseFloat(offer.bidStep));
				$('.minus').unbind('click');
				$('.minus').bind('click', function(e){
					e.preventDefault();
					var curr = Number($('.itemcount span').text());
					if(curr > (parseFloat(offer.price) + parseFloat(offer.bidStep))) {
						var new_val = Number(curr) - parseFloat(offer.bidStep);
						$('.itemcount span').text(new_val.toFixed(2));
					}
					
				});
				$('.plus').unbind('click');
				$('.plus').bind('click', function(e){
					e.preventDefault();
					
					var curr = $('.itemcount span').text();
					//if(curr < itemQuantity)
					var new_val = Number(curr) + parseFloat(offer.bidStep);
					$('.itemcount span').text(new_val.toFixed(2));
					//return false;
				});
				
				//$('#orderCount').html(offer.price);
			}
			$('#sale_label').unbind('click');
			$('#sale_label').click(function(e) {
				e.preventDefault();
				$('.availability-section').show();
			});	
			
			$('#buy_label').unbind('click');
			$('#buy_label').click(function(e) {
				e.preventDefault();
				$('.availability-section').hide();
			});		
			
			if(offer.isNotBuyable && offer.isNotBuyable == 1) {
				$('.itemcount').hide();
				$('.buy').hide();
				$('.not-buy-info').show();
			} else {
				$('.itemcount').show();
				$('.buy').show();
				$('.not-buy-info').hide();
			}
			
			$('.buy').unbind('click');
			$('.buy').bind('click', function(e) {
				
				e.preventDefault();
				
				quantity = parseInt($('#orderCount').html());
				oldQuantity = parseInt($('.item-quantity').html());
				if (!app.session) {
					app.showLogin();
					return false;
				}
				
				if(offer.itemType == 'ad') {
					data = {};
					data.action = 'bookItem';
					data.id = results.data.item.id;
					data.quantity = quantity;
					data.session = app.session;
					
					$.get(app.supportUrl, data, function(results) {
						app.showDialog(results.data, 'Teade!');
						if (results.code == '1') {
							$('.item-quantity').html(oldQuantity - quantity);
							itemQuantity = itemQuantity-quantity;
						}
					
						// http:/api.buduaar.ee/Market/makeAuctionBid/[$i d]/[$amount]/
					}, 'jsonp');
				} else {
					var r=confirm("Oled kinde, et soovid pakkumist teha?")
					if (r==true) {
						$.get(app.serverUrl + 'Market/makeAuctionBid/' + id + '/' + quantity, data, function(results) {
							app.showDialog(results.data, 'Teade!');
							if (results.code == '1') {
								
								bidStep = parseFloat($('.item-bid-step').html());
								bid = parseFloat($('#orderCount').html());
								//oldPrice = $('.item-price').val();
							
								$('.item-price').html(bid + '€');
								//itemQuantity = itemQuantity-quantity;
								$('#orderCount').html(bidStep + bid);
							}
							
							
							
						}, 'jsonp');
					} else {
						//alert("You pressed Cancel!")
					}
					
					
				}
				
				return false;
				
			});
			
			$('.message-to-user').attr('data-username', offer.username);
			$('.message-to-user').attr('data-id', offer.user);
			
			$('.message-to-user').unbind('click');
			$('.message-to-user').click(function(e) {
			
				e.preventDefault();
				
				username = $(this).data('username');
				
				$('.page-sidebar-wrap').hide().removeClass('active');
				$('#messagesPage').show();
				setTimeout(function() {
					$('body').scrollTop(0);
					$('#page-wrap').addClass('active');
					$('#messagesPage').addClass('active');
					app.initMessagesPage();
					setTimeout(function() {
						$('body').addClass('bturg');
						$('#startNewMessage').parent().click();
						$('#messageForm2').find('#user').val(username);
					}, 1000);
				}, 200);
			});
			
			$('.ajax-loader').hide();
			$('.marketContainer').find('.page-wrap').addClass('opened');
			
		
			$.get(app.serverUrl + 'Market/itemImages/' + id, data, function(results) {
				
				$.each(results.data, function(i, itemImage) {
					$('.product-thumbs').append('<a class="item-image" href="'+itemImage.image+'"><img class="toode_thumb" src="'+itemImage.icon+'" alt="logo"/></a>')
					//$('.toode_thumb').attr('src', ).parent().attr('href', );

				});
				var myPhotoSwipe2 = {};
				myPhotoSwipe2 = $(".images-container a").photoSwipe({ enableMouseWheel: false , enableKeyboard: false, captionAndToolbarShowEmptyCaptions: false, backButtonHideEnabled: true, captionAndToolbarAutoHideDelay: 0 });	
				
			}, 'jsonp');
		
			//template = ;
			
			data2 = {};
			data2.user = offer.user;
			data2.limit = 12;
		
			$.get(app.serverUrl + 'Market/search/', data2, function(results) {
				
				$('#sellerother').html('');
				
				if (results.data.length > 0) {
					$('.sellerother:last').show();
				} else {
					$('.sellerother:last').hide();
				}
				
				$.each(results.data, function(i, sub_offer) {
					if(sub_offer.id != offer.id) {
						$('.selletother-template').find('.other').attr('data-id', sub_offer.id);
						$('.selletother-template').find('img').attr('src', sub_offer.icon);
						$('.selletother-template').find('p').html(sub_offer.name);
						$('.selletother-template').find('.price').html(parseFloat(Math.round(sub_offer.price * 100) / 100).toFixed(2) + '€');
						$('#sellerother').append($('.selletother-template').html());
					}
				});
				
				$('.other').unbind('click');
				$('.other').click(function(e) {
					e.preventDefault();
					app.showLoader(1031);
					app.getProduct($(this).data('id'));
				});
				
				//$('')
			}, 'jsonp');
			
		}, 'jsonp');
	},
	
	initMessagesPage: function(start, send) {
		
		if (send) {
			$('.arrived').removeClass('active');
			$('.send').addClass('active');
		} else {
			$('.send').removeClass('active');
			$('.arrived').addClass('active');
		}
		
		app.showLoader(1059);
		data = {};
		data.session = app.session;
		data.limit = 20;
		data.start = start;
		data.onlyUnread = 0;
		data.sent = send;
		
		$('#newMessageForm').fadeOut();
		
		$.get(app.serverUrl + 'User/messages/', data, function(results) {
		
			$('.ajax-loader').hide();
			
			if (!start)
				$('#messagesList').html('');
			$.each(results.data, function(i, item) {
				$('.messageTemplate').find('.wrap').attr('id', item.id);
				$('.messageTemplate').find('h3').html(item.username + ' ' + item.datetime);
				$('.messageTemplate').find('p').html(item.headline);
				
				$('#messagesList').append($('.messageTemplate').html());
			});
			loaded = false;
			
			if (!send) {
				data = {};
				data.limit = 100;
				data.start = 0;
				data.onlyUnread = 1;
				data.session = app.session;
				data.sent = 0;
				
				$.get(app.serverUrl + 'User/messages/', data, function(results) {
					total = results.data.length;
					$.each(results.data, function(i, item) {
						//unread[item.id] = true;
						
						$('#messagesList').find('.wrap').each(function() {
							if($(this).attr('id') == item.id) {
								$(this).find('p').css('font-weight', 'bold');
							}
						});
					});
					if (!parseInt(total))
						total = 0;
					$('.newMessagesCount').html(total);
				}, 'jsonp');
			}
			
			$('.ajax-loader').hide();
			
			$('#messagesList').find('.wrap').click(function(){
				app.initMessage($(this).attr('id'), send);
				
			});
			
			$('.messages-tab').unbind('click');
			$('.messages-tab').click(function(e) {
				e.preventDefault();
				$('.messages-tab').removeClass('active');
				$(this).addClass('active');
				$('#newMessageForm').fadeOut();
				if ($(this).hasClass('arrived')) {
					app.initMessagesPage(0, 0);
				} else {
					app.initMessagesPage(0, 1);
				}
			});
			
		}, 'jsonp');
		
		toUser = 0;
		
		$('#startNewMessage').parent().unbind('click');
		$('#startNewMessage').parent().click(function(e) {
			e.preventDefault();
			
			$('.page-wrap').removeClass('opened');
			
			$('#messagesList').html('');
			$('#newMessageForm').fadeIn();
			
			$('#messageForm2').find('#user').val('Kasutajanimi');
			$('#messageForm2').find('#heading').val('Pealkiri');

			$('#messageForm2').find('#user').keyup(function() {
				
				if ($(this).val().length > 2) {
					data = {};
					data.username = $(this).val();
					app.showLoader();
					$.get(app.serverUrl + 'User/users/', data, function(results) {
					
						$('.auto-search').html('');
						total = results.data.length;
						$.each(results.data, function(i, item) {
							$('.auto-search').append('<a href="#" rel="' + item.id + '">' + item.username + '</a>');
						});
						
						$('.ajax-loader').hide();
						
						$('.auto-search').find('a').click(function(e) {
							e.preventDefault();
							$('#messageForm2').find('#user').val($(this).html());
							toUser = $(this).attr('rel');
							$('.auto-search').html('');
						});
						
						
					}, 'jsonp');
				}
				
			});
			
			$('#messageForm2').unbind('submit');
			$('#messageForm2').submit(function(e) {
				e.preventDefault();
				toret = true;
				if($('#messageForm2').find('#user').val() == $('#messageForm2').find('#user').attr('title') && toUser != 0) {
					$('#messageForm2').find("#user").addClass('user');
					toret = false;
				}
				
				if($('#messageForm2').find("#heading").val() == $('#messageForm2').find("#heading").attr('title')){
					$('#messageForm2').find("#heading").addClass('alertForm');
					toret = false;
				}
				if($('#messageForm2').find("#message").val() == $('#messageForm2').find("#message").attr('title') && $('#messageForm2').find("#message").val() < 3){
					$('#messageForm2').find("#message").addClass('alertForm');
					toret = false;
				}
				if (toret) {
					data = {};
					data.heading = $('#heading').val();
					data.message = $('#message').val();
					data.session = app.session;
					data.to = toUser;
					
					$.get(app.supportUrl + '?action=sendMessage', data, function(results) {
						if (results.code == '1') {
							jQuery("#heading").removeClass('alertForm');
							jQuery("#message").removeClass('alertForm').val('');
							
							//$('#messagesPage').find('.menu_bar').find('.back').click();
							$('#messagesPage').find('.send').click();
						} else {
							app.showDialog(results.data, 'Teade!');
						}
						
					}, 'jsonp');
				}
			});
			
		});
		
		
		
	},
	
	initMessage: function(id, sent) {
	
		app.showLoader(1227);
		$('body').scrollTop(0);
		
		id = id;
		
		data = {};
		if (sent)
			data.viewAsSent = 1;
		else
			data.markAsRead = 1;
		//data.markAsRead = true;
		
		$.get(app.serverUrl + 'User/message/' + id, data, function(results) {
			$('.ajax-loader').hide();
			
			$('#messageDetail').find('h3').html(results.data.username + ' ' + results.data.datetime);
			$('#messageDetail').find('strong').html(results.data.headline);
			$('#messageDetail').find('.message-description').html(results.data.contents);
			$('#heading').val(results.data.headline);
			
			
			data = {};
			data.limit = 100;
			data.start = 0;
			data.onlyUnread = 1;
			data.session = app.session;
			data.sent = 0;	
			$.get(app.serverUrl + 'User/messages/', data, function(results) {
				total = results.data.length;
				if (!parseInt(total))
					total = 0;
				$('.newMessagesCount').html(total);
			}, 'jsonp');
			
			$('.messagesContainer').find('.page-wrap').addClass('opened');
			
			if (results.data.username == 'Buduaar.ee') {
				$('#messageForm').hide();
			} else {
				$('#messageForm').show();
			}
			
			$('#messageForm').unbind('submit');
			$('#messageForm').submit(function(e) {
				e.preventDefault();
				toret = true;
				if(jQuery("#heading").val() == jQuery("#heading").attr('title')){
					jQuery("#heading").addClass('alertForm');
					toret = false;
				}
				if(jQuery("#message").val() == jQuery("#message").attr('title') && jQuery("#message").val() < 3){
					jQuery("#message").addClass('alertForm');
					toret = false;
				}
				if (toret) {
					data = {};
					data.heading = $('#heading').val();
					data.message = $('#message').val();
					data.session = app.session;
					if (sent)
						data.to = results.data.to;
					else
						data.to = results.data.from;
					
					$.get(app.supportUrl + '?action=sendMessage', data, function(results) {
						jQuery("#heading").removeClass('alertForm');
						jQuery("#message").removeClass('alertForm').val('');
						
						$('#messagesPage').find('.menu_bar').find('.back').click();
						$('#messagesPage').find('.send').click();
					
					}, 'jsonp');
				}
			});
		
		}, 'jsonp');
		
	},
	
	initNewsListScroll: function() {
		if(appMode)
			return false;
		
		if (history.pushState)
			window.history.pushState('news', 'news', "");
	
		/*$(window).unbind('scroll');
		$(window).scroll(function() {
			//alert($(window).scrollTop() + ' ja ' + $(window).height() + ' ning ' + $(document).height());
			
		});	*/
		setTimeout(function() {
			//if (1 == 1 && !localStorage.getItem("android_denied")) {
			if (navigator.userAgent.match(/Android/i) && !localStorage.getItem("android_denied")) {
				$('#newsPage').find('#searchForm').hide();
				$('#newsPage').find('.android-message').show();
				$('#newsPage').find('.searchbox').addClass('active');
				$('#newsPage').find('.newssection, .newssectionopen, .barsubmenu, .underbarsubmenu, .toodepage, .account').addClass('active');
				$('.android-message').find('.close').unbind('click');
				$('.android-message').find('.close').click(function(e){
					e.preventDefault();
					$('#newsPage').find('#searchForm').show();
					$('#newsPage').find('.android-message').hide();
					$('#newsPage').find('.searchbox').removeClass('active');
					$('#newsPage').find('.newssection, .newssectionopen, .barsubmenu, .underbarsubmenu, .toodepage, .account').removeClass('active');
					localStorage.setItem("android_denied", true);
				});
			}
			setTimeout(function() {
				$('#newsPage').find('#searchForm').show();
				$('#newsPage').find('.android-message').hide();
				$('#newsPage').find('.searchbox').removeClass('active');
				$('#newsPage').find('.newssection, .newssectionopen, .barsubmenu, .underbarsubmenu, .toodepage, .account').removeClass('active');
			}, 5000);
		}, 1000);
		
		setTimeout(function(){
			
			var pageheight = $(document).height();
			
			$('.oveflowscroll').css('height', pageheight);
		},500);
		
	},
	
	initNews: function(cats) {
		this.initNewsLinks();
		this.getNewsCats();
		this.getArticles('hot', false, 0);
		
		$('#newsPage').find('.refresh').unbind('click');
		$('#newsPage').find('.refresh').click(function(e) {
			e.preventDefault();
			//app.getArticles('hot', false, 0);
			app.getArticles('last', false, 0);
			
		})
	},
	
	initProducts: function() {
		this.getMarketCats();
		this.getProducts(true);
	},
	
	initAccount: function() {
			
	},
	
	initNewsLinks: function() {
		
		$('.today').click(function(e) {
			e.preventDefault();
			app.getArticles('today', false, 0);
		});
		
		$('.top10').click(function(e) {
			e.preventDefault();
			app.getArticles('top10', false, 0);
		});
		
		$('#searchForm').submit(function(e) {
			e.preventDefault();
			app.getArticles('search', $('#newsPage').find('#search').val(), 0);
		});
		
		$('.comments-tab').click(function(e) {
			e.preventDefault();
			$('.comments-tab').removeClass('active');
			$(this).addClass('active');
			
			if ($(this).hasClass('add-comment')) {
				$('#commentsList').hide();
				$('#addcomment').show();
				
				$('.add-invisible').hide();
				$('.add-visible').show();
				$('#addcomment').focus();
				offset = $('#commentForm').offset();
				
				$('body').scrollTop(offset.top-70);
				
			} else {
				/*$('#commentsList').show();
				$('#addcomment').hide();
				$('.add-invisible').show();
				$('.add-visible').hide();
				if (!hasGallery)
					$('#gallery').hide();*/
					
				$('#commentsList').show();
				$('#addcomment').hide();
				
				$('.add-invisible').hide();
				$('.add-visible').show();
				$('#addcomment').focus();
					
					
				offset = $('#commentsList').offset();	
				$('body').scrollTop(offset.top-70);
			}
			
		});
		
		$('#commentForm').unbind('submit');
		$('#commentForm').submit(function(e) {
			e.preventDefault();
			//status = validateComment();
			status = true;
			
			if (status == true || status == 'true') {
				
				app.postComment();
			}
		})
		
	},
	
	getNewsCats: function() {
		
		if (app.newsCats = localStorage.getObject('newsCats')) {
			app.parseNewsCats();
		} else {
			$.get(app.serverUrl + 'Article/topics/', {}, function(results) {
				app.newsCats = results.data;
				localStorage.setObject('newsCats', results.data);
				app.parseNewsCats();
				
			}, 'jsonp');
		}
	},
	
	parseNewsCats: function() {
	
		$.each(app.newsCats, function(i, item) {
			cats = '';
			$.each(item.categories, function(j, cat) {
				if (j == 0) {
					cats = cat;
					if (i == 0)
						allCats = cat;
				} else {
					cats = cats + ',' + cat;
					allCats = allCats + ',' + cat;
				}
			});
			$('#newsPage').find('.menu_level1').append('<a href="#" data-cats="' + cats + '">' + item.nameEst + '</a>');
		});
		//$('.menu_level1').append('<a href="#" data-cats="' + 17 + '">Shopping</a>');
		
		$('#newsPage').find('.menu_level1').find('a').unbind('click');
		$('#newsPage').find('.menu_level1').find('a').click(function(e) {
			e.preventDefault();
			$('.categories').removeClass('active');
			$('.sidebar').removeClass('active');
			$('body').scrollTop(0);
			app.getArticles('category', $(this).data('cats'), 0);
			
			app.initNewsListScroll();
		});
		
		app.getArticles('last', false, 0);
		
	},
	
	getArticles: function(type, search, start) {
		//app.showLoader(1492);
		newsType = type;
		newsSearch = search;
		
		specialBack = true;
		
		app.showLoader();
		
		data = {};
		switch (type) {
			case 'hot':
				searchStr = '?onlyCategory=58&lang=est&limit=8&start=' + start;
				break;
			case 'last':
				searchStr = '?lang=est&limit=20&start=' + start;
				specialBack = false;
				break;
			case 'today':
				var today = new Date();
				var dd = today.getDate();
				var mm = today.getMonth()+1; //January is 0!
				var yyyy = today.getFullYear();
				if (dd<10)
					dd='0'+dd;
				if (mm<10)
					mm='0'+mm;
				today = dd + '-' + mm + '-' + yyyy;
				searchStr = '?lang=est&limit=20&startDate=' + today + '&endDate=' + today + '&start=' + start;
				break;
			case 'top10':
				var date = new Date();
				date.setDate(date.getDate() - 7);
				var dd = date.getDate();
				var mm = date.getMonth()+1; //January is 0!
				var yyyy = date.getFullYear();
				if (dd<10)
					dd='0'+dd;
				if (mm<10)
					mm='0'+mm;
				week_ago = dd + '-' + mm + '-' + yyyy;
				searchStr = '?lang=est&limit=10&start=0&orderBy=views&startDate=' + week_ago + '';
				if (start > 0) {
					$('.ajax-loader').hide();
					return false;
				}
				break;
			case 'search':
				searchStr = '?lang=est&limit=20&word=' + search + '&start=' + start;
				break;
			case 'category':
				
				searchStr = '?lang=est&limit=20&categories=' + search + '&start=' + start;
				break;
		}
		
		if (type == 'last' || type == 'hot')
			$('.hotnews').show();
		else
			$('.hotnews').hide();
		
		
		$.get(app.serverUrl + 'Article/search/' + searchStr, data, function(results) {
		
			if ($('#newsList').hasClass('opened')) {
				$('#newsList').removeClass('opened');
				$('#newsItem').removeClass('opened');
			}
			
			if (type == 'hot') {
				app.parseHotNews(results.data);
			} else {
				if (start > 0)
					app.parseNewsList(results.data, true);
				else
					app.parseNewsList(results.data, false);
			}
			
			$('.ajax-loader').hide();
			
		}, 'jsonp');
		
	},
	
	parseHotNews: function(news) {
		template = $('.hotTemplate');
		$('.hotnews_title').find('.title').html('Nädala kuumad!');
		$('#hotNews').html('');
		total = news.length;
		$.each(news, function(i, item) {
			image = app.imageUrl.replace('%image%', item.largeIcon);
			template.find('li').attr('rel', item.id).attr('data-cat', item.categoryName).attr('data-date', item.date);
			template.find('span').html(item.headline);
			template.find('img').attr('src', image);
			$('#hotNews').append(template.html());
		});
		
		setTimeout(function() {
			var slider = new Swipe(document.getElementById('slider') , {'auto': 4000} );
			$('#slider').find('.next').click(function(e) {
				e.preventDefault();
				slider.next();
			});
			$('#slider').find('.prev').click(function(e) {
				e.preventDefault();
				slider.prev();
			});
			$('#hotNews').find('li').click(function(e) {
				e.preventDefault();
				//$('.newssectionopen').find('.meta:first').html($(this).find('.meta').html());
				app.getNews($(this).attr('rel'));
				console.log($(this).data('cat'));
				$('.newssectionopen').find('.meta:first').html($(this).data('date') + ' | ' + $(this).data('cat'));
				
			});
		}, 800);
		
	},
	
	parseNewsList: function(news, add) {
		template = $('.newsTemplate');
		if (!add)
			$('.newslist').html('');
		$.each(news, function(i, item) {
			image = app.imageUrl.replace('%image%', item.smallIcon);
			template.find('a').attr('rel', item.id);
			template.find('span').html(item.headline);
			template.find('.meta').html(item.date + ' | ' + item.categoryName);
			template.find('img').attr('src', image);
			$('.newslist').append(template.html());
		});
		$('.news').find('a').unbind('click');
		$('.news').find('a').click(function(e) {
			e.preventDefault();
			$('.newssectionopen').find('.meta:first').html($(this).find('.meta').html());
			app.getNews($(this).attr('rel'));
		});
		
	},
	
	getNews: function(id) {
		if (history.pushState)
			window.history.pushState(id, id, "");
		app.showLoader(1614);
		//$(window).unbind('scroll');
		
		$('.add-invisible').show();
		$('.add-visible').hide();
		
		data = {};
		app.currentNews = id;
		$('.postthumb:first').attr('src', '');
		
		$.get(app.serverUrl + 'Article/article/' + id, data, function(results) {
			console.log(results);
			$('#gallery').hide();
			$('#comments').hide();
			
			/*$('.reccomend-container').html('<iframe src="//www.facebook.com/plugins/like.php?href=http%3A%2F%2Fbuduaar.ee%2FArticle%2Farticle%2F' + id + '&amp;send=false&amp;layout=standard&amp;width=450&amp;show_faces=false&amp;font&amp;colorscheme=light&amp;action=recommend&amp;height=35&amp;appId=161092774064906" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:310px; height:35px;" allowTransparency="true"></iframe>');*/
			
			//$('#fbShare').attr('href', 'https://www.facebook.com/sharer/sharer.php?u=buduaar.ee/Article/article/' + results.data.id);
			
			$('.top-tab').unbind('click');
			$('.top-tab').click(function(e) {
				e.preventDefault();
				$('#commentsList').show();
				$('#addcomment').hide();
				$('.add-invisible').show();
				$('.add-visible').hide();
				if (!hasGallery)
					$('#gallery').hide();
				$(window).scrollTop(0);
			});
			
			$('#post').find('h2').html(results.data.headline);
			results.data.contents = results.data.contents.replace(/px/g, '');
			results.data.contents = results.data.contents.replace(/&nbsp;/g, ' ');
			
			$('#newsContent').html(results.data.contents);
			$('#newsShortContent').html(results.data.introduction);
			
			$('.postthumb:first').attr('src', results.data.image);
			$('.postthumb:first').attr('alt', results.data.headline);
			
			newsItem = results.data;
			
			$('.postthumb:first').removeClass('full-size');
			
			$('.postthumb:first').unbind('load');
			$('.postthumb:first').load(function() {
				$('.ajax-loader').hide();
				$('#newsList').addClass('opened');
				$('#newsItem').addClass('opened');
				//setTimeout(function() {
				$('body').scrollTop(0);
				//}, 100);
				
				$('#newsImage').attr('href', results.data.image);
				//myPhotoSwipeMain = {};
				//var myPhotoSwipeMain = $('#newsImage').photoSwipe({ enableMouseWheel: false , enableKeyboard: false, captionAndToolbarShowEmptyCaptions: false });
				$('#newsImage').unbind('click');
				$('#newsImage').click(function(e) {
					e.preventDefault();
					if($('.postthumb:first').hasClass('full-size')) {
						$('.postthumb:first').removeClass('full-size');
					} else {
						$('.postthumb:first').addClass('full-size');
					}
				});
				
				if (results.data.pollActive != '0') {
					totalVote = results.data.timesPollTaken;
					pollQuestion = results.data.pollQuestion;
					$('#comments').html('<h3>' + pollQuestion + '</h3>');
					data = {};
					data.action = 'unserialize';
					data.options = results.data.pollOptions;
					data.options2 = results.data.pollStatistics;
					
					pollEnds = new Date(results.data.pollEnds);
					currentTime = new Date();
					
					if (pollEnds > currentTime)
						pollActive = true;
					else
						pollActive = false;
					
					
					$.get(app.supportUrl, data, function(results) {

						if (localStorage.getItem("poll_" + app.currentNews) || !pollActive) {
							
							$.each(results.options, function(i, option) {
								$('#comments').append('<p>' + option + ' ('+((results.options2[i]*100)/totalVote).toFixed(0)+'%)</p><section class="loading"><section class="loader" style="width:'+((results.options2[i]*100)/totalVote)+'%"></section></section>');
								
							});
						} else {
							
							$.each(results.options, function(i, option) {
									$('#comments').append('<p><input type="radio" value="' + i + '">' + option + '</p>');
								});
								$('#comments').find('input').click(function(e) {
									app.answerPoll($(this).val(), results, totalVote, pollQuestion);
							});
						}
						$('#comments').show();
						
						
					}, 'jsonp');
				}
				
				$.get(app.serverUrl + 'Article/comments/' + id + '?limit=1000', data, function(results) {
					
					total = results.data.length;
					$('.commentsCount').html(total);
					
					$('#commentsList').html('');
					$.each(results.data, function(i, item) {
					
						$('.comments-template').find('h3').html(item.nickname + ' ' + item.time);
						$('.comments-template').find('p').html(item.comment);
						
						$('#commentsList').append($('.comments-template').html());
						
					});
					
				}, 'jsonp');
				
				$('#specialGallery').hide();
				$('#gallery').hide();

				$.get(app.serverUrl + 'Article/gallery/' + id + '?limit=1000', data, function(results) {
					
					if(results.data.length) {
						
						$('.gallery').html('');
						
						if (newsItem.isDescriptionGallery && newsItem.isDescriptionGallery == 1) {
							$('#specialGallery').show();
							$('#gallery').hide();
							$.each(results.data, function(i, image) {
								$('.special-gal').append('<p><a href="http://buduaar.ee/files/Upload/Articles/Gallery/'+image.image+'"><img class="" alt="'+i+'" src="http://buduaar.ee/files/Upload/Articles/Gallery/'+image.icon+'" alt="thumb"/></a><h3 style="font-weight:bold;">'+image.names+'</h3>'+image.description+'</p><br style="clear:both;" />');
							});
							
							var myPhotoSwipe = $(".special-gal a").photoSwipe({ enableMouseWheel: false , enableKeyboard: false, captionAndToolbarShowEmptyCaptions: false, backButtonHideEnabled: true, captionAndToolbarAutoHideDelay: 0 });
						} else {
							$('#specialGallery').hide();
							$('#gallery').show();
							$.each(results.data, function(i, image) {
								$('.gallery').append('<li><a href="http://buduaar.ee/files/Upload/Articles/Gallery/'+image.image+'"><img class="" alt="'+i+'" src="http://buduaar.ee/files/Upload/Articles/Gallery/'+image.icon+'" alt="thumb"/></a></li>');
							});
							
							var myPhotoSwipe = $(".gallery a").photoSwipe({ enableMouseWheel: false , enableKeyboard: false, captionAndToolbarShowEmptyCaptions: false });
						}
						
						hasGallery = true;
					} else {
						hasGallery = false;
					}
					
				}, 'jsonp');
				
			});
			
		
		}, 'jsonp');
		

	},
	
	postComment: function() {
		data = {};
		
		data.action = 'postComment';
		data.id = app.currentNews;
		
		if ($('#nimi').val() != $('#nimi').attr('title'))
			data.name = $('#nimi').val();
		if ($('#email').val() != $('#email').attr('title'))
			data.mail = $('#email').val();
		if ($('#vanus').val() != $('#vanus').attr('title'))
			data.age = $('#vanus').val();
		if ($('#comment').val() != $('#comment').attr('title'))
			data.comment = $('#comment').val();
		
		$.get(app.supportUrl, data, function(results) {
			
			if (results.code == '1') {
				$('#nimi').val('');
				$('#email').val('');
				$('#vanus').val('');
				$('#comment').val('');
				
				app.showLoader();
				
				$.get(app.serverUrl + 'Article/comments/' + app.currentNews + '?limit=1000', data, function(results) {
					
					total = results.data.length;
					$('.commentsCount').html(total);
					
					$('#commentsList').html('');
					$.each(results.data, function(i, item) {
					
						$('.comments-template').find('h3').html(item.nickname + ' ' + item.time);
						$('.comments-template').find('p').html(item.comment);
						
						$('#commentsList').append($('.comments-template').html());
						
					});
					
					$('.ajax-loader').hide();
					
					$('.comments-tab:not(.active)').click();
					
				}, 'jsonp');
				
			} else {
				
				if (results.data && results.data.length) {
					app.showDialog(results.data, 'Teade!');
				}
			}
				
			
		}, 'jsonp');
		
	},
	
	answerPoll: function(answer, results, total, question) {
		data = {};
		
		data.action = 'answerPoll';
		data.id = app.currentNews;
		data.answer = answer;
	
		$.get(app.supportUrl, data, function(result) {
			if (result.code == '1' || result.code == '108') {
				if (result.code == '1')
					total = parseInt(total)+1;
				
				results.options2[answer] = parseInt(results.options2[answer]) + 1;
			
				localStorage.setItem("poll_" + app.currentNews, true);
				$('#comments').html('<h3>' + question + '</h3>');
				$.each(results.options, function(i, option) {
					$('#comments').append('<p>' + option + ' ('+((results.options2[i]*100)/total)+'%)</p><section class="loading"><section class="loader" style="width:'+((results.options2[i]*100)/total)+'%"></section></section>');
								
				});
			}
		}, 'jsonp');
	}
	
}

jQuery.fn.center = function () {
    this.css("position","absolute");
    this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + 
                                                $(window).scrollTop()) + "px");
    this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + 
                                                $(window).scrollLeft()) + "px");
    return this;
}


Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
}

function isOdd(num) { return num % 2;}

function getAge(d1, d2){
    d2 = d2 || new Date();
    var diff = d2.getTime() - d1.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}


function captureImage() {
    
	navigator.camera.getPicture(captureSuccess, captureError, {
		quality : 50, 
		destinationType: destinationType.FILE_URI,
		targetWidth: 1280,
		targetHeight: 960
	});
}

function getPhoto() {
      // Retrieve image file location from specified source
      navigator.camera.getPicture(captureSuccess, captureError, { 
      	quality: 50, 
      	targetWidth: 1280, 
      	targetHeight: 960, 
        destinationType: destinationType.FILE_URI,
        sourceType: pictureSource.PHOTOLIBRARY });
}

// Upload files to server
function uploadFile(mediaFile, isSave) {
     
    //alert(app.saveStage);
    
    if (mediaFile) {
	    var ft = new FileTransfer();
	    var path = mediaFile;
	        
	    $('.loading').show();
	    $('.loader').css('width', '0');
	    
	    var options = new FileUploadOptions();
	    options.fileKey="image";
	    //option.mimeType="image/jpeg";
	    //options.fileName="image.jpg";
	    
	    ft.onprogress = function(progressEvent) {
		    if (progressEvent.lengthComputable) {
		      percent = ((progressEvent.loaded * 100) / progressEvent.total);
		      $('.loader').css('width', percent + '%');
		      if(percent == 100)
		      	app.showLoader();
		    } else {
		      $('.loader').css('width', '100%');
		    }
		};
		
		var params = app.saveParams;
		 
		if (app.saveStage == 1) {
			options.params = params;
			url = app.supportUrl + "?session=" + app.session + '&action=uploadFile&type=main&callback=123';
		} else {
			url = app.supportUrl + "?session=" + app.session + '&action=uploadFile&type=extra&id=' + app.currentEditId + '&callback=123';
		}
		
	    ft.upload(path, url,
	        function(result) {
	        	
				result.response = result.response.replace('123(', '').replace(')' , '');
				
				console.log(result.response);
				
				$('.ajax-loader').hide();
				
				try {
	            	response = $.parseJSON(result.response);  
	            } catch(e) {
	            	app.showDialog('Tundmatu viga, kontrolli väljasid', 'Teade!');
	            }
				if(app.saveStage == 1) {
					
					if (response.code == '1' || response.code == 1) {
				
						app.currentEditId = response.data.item.id;
						app.saveParams.id = app.currentEditId;
						
						$('.no-pic-text').hide();
						
						if (!isSave) {
							$('.one').removeClass('active');
							$('.two').addClass('active');
							
							$('body').scrollTop(0);
							$('#itemForm2').show();
							height1 = $('#itemForm').height();
							$('#itemForm').css('margin-top', '-' + height1 + 'px');
							app.saveParams = {};
							app.saveStage = 2;
							
						} else {
							app.showDialog('Salvestatud', 'Teade!');
						}
						
					} else {
						//alert('error');
						if(response.data && response.data.length) {
							app.showDialog(results.data, 'Teade!');
							//alert(response.data);
						} else {
							
							if (!response) {
								app.showDialog('Tundmatu viga', 'Teade!');
							} else {
								app.showDialog(response.message, 'Teade!');
							}
							
							//alert(response.message);
						}
					}
					
				} else {
					//alert(app.currentEditId);
					//$('.uploaded').hide();
					app.showLoader();
					setTimeout(function() {
						$('.ajax-loader').hide();
						$('.uploaded').hide();
						/*$('.uploaded').append('<a href="#" class="remove-pic" rel="'+response.id+'"><img src="'+response.icon+'" /><span></span></a>');*/
						$.get(app.serverUrl + 'Market/itemImages/' + app.currentEditId, data, function(results) {
							$('.uploaded').html('');
							$.each(results.data, function(i, itemImage) {
								$('.uploaded').append('<a class="remove-pic" rel="'+itemImage.id+'" href="#"><img class="toode_thumb" src="'+itemImage.icon+'" alt="logo"/><br style="clear:both;" /><span></span></a>')
								//$('.toode_thumb').attr('src', ).parent().attr('href', );
			
							});	
							$('.uploaded').show();
							app.initPicRemove();
						
						}, 'jsonp');
						
						//app.initPicRemove();
					}, 500);
					
					
				}
				
				
				$('.loading').hide();
				
	        },
	        function(error) {
	        	app.showDialog('Viga faili laadimisel', 'Teade!');
	        }, options
	    ); 
	    
    } else {
    
    	data = {};
    	data.id = app.currentEditId;
    	data = app.saveParams;
    	data.action = 'addItem';
	    $.get(app.supportUrl, data, function(results) {
				
			if (results.code == '1' || results.code == 1) {
				if(!isSave) {
					
					app.currentEditId = results.data.item.id;
					$('.one').removeClass('active');
					$('.two').addClass('active');
					
					$('body').scrollTop(0);
					$('#itemForm2').show();
					height1 = $('#itemForm').height();
					$('#itemForm').css('margin-top', '-' + height1 + 'px');
					app.saveParams = {};
					app.saveStage = 2;
				} else {
					app.showDialog('Salvestatud', 'Teade!');
					app.currentEditId = results.data.item.id;
					//alert('Salvestatud');
				}
			
			} else {
				if (results.data && results.data.length) {
					app.showDialog(results.data, 'Teade!');
				} else {
					app.showDialog(results.message, 'Teade!');
				}
			}
		}, 'jsonp');
    }
      
}

function captureSuccess(imageURI) {
	app.imageURI = imageURI;
	if (imageURI != null && app.saveStage != 1) {
		uploadFile(imageURI, false);
    } else {
    	$('.no-pic-text').hide();
	    $('#profilePic').attr('src', imageURI);
    }
}

function captureError(error) {
    var msg = 'Viga pildi saamisel: ' + error;
}