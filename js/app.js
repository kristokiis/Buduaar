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

var pages = ['main', 'news', 'messages'];
var offlineAlerted = false;
var offlineTimeout;

var hasGallery = false;

var app = {

	currentNews: 0,
	serverUrl: 'http://buduaar.ee/sites/api/',
	imageUrl: 'http://buduaar.ee/files/Upload/Articles/%image%',
	supportUrl: 'http://projects.efley.ee/budu_live/support.php/',
	session: '',
	
	init: function() {
		//if (1 == 1) {
		document.addEventListener("online", function() {
			
		}, false);
		
		if (navigator.onLine) {

			this.initLogin();
			this.initNews(true);
			
			$('.logo-link').click(function(e){
				e.preventDefault();
				$('body').scrollTop(0);
				$('#page-wrap').fadeIn('fast');
				$('#newsPage').hide();
				$('#marketPage').hide();
				$('.page-wrap').removeClass('opened');
			});
			$('.home').click(function(e){
				e.preventDefault();
				$('body').scrollTop(0);
				$('#page-wrap').fadeIn('fast');
				$('#newsPage').hide();
				$('#marketPage').hide();
				$('.page-wrap').removeClass('opened');
			});
			
			page_inited = page_inited+1;
			
			offlineAlerted = false;
			
			clearTimeout(offlineTimeout);
		
		} else {
			 
			offlineTimeout = setTimeout(function() {
				app.init();
			}, 3000);
			
			if (!offlineAlerted) {
				alert('Ühendus puudub, ühenda seade internetti, et kasutada rakendust');
				offlineAlerted = true;
			}
		}
		
		$('.home').click(function(e) {
			e.preventDefault();
			
			$('#page-wrap').fadeIn('fast');
			$('#marketPage').hide();
			$('#newsPage').hide('fast');
		});
		
	},
	
	showLoader: function() {
		$('.ajax-loader').css('height', $('body').height() + 'px');
		
		$('.ajax-loader').find('img').center();
		
		$('.ajax-loader').fadeIn();
		
	},
	
	initLogin: function() {
		$('.news-link').unbind('click');
		$('.news-link').click(function(e) {
			e.preventDefault();
			$('#page-wrap').hide();
			$('#newsPage').fadeIn('fast');
			app.initNewsListScroll();
			var slider = new Swipe(document.getElementById('slider') , {'auto': 2000} );
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
			});
			
		});
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
		$('#loginForm2').unbind('submit');
		$('#loginForm2').submit(function(e) {
			e.preventDefault();
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
			
			if (toret) {
				
				data.username = $('#username').val();
				data.password = $('#password').val();
			
				$.get(app.supportUrl + '?action=login', data, function(results) {
					
					if (results.code == '1') {
						app.session = results.data;
						$('.open_bt_login').find('span').html('TEATED');
						$('.open_bt_login').removeClass('active');	
						$('.bturglogin, #footer').removeClass('active');
						$('.usual-site').show();
						$('body').animate({scrollTop: "0px"}, 200);
						
						$('#page-wrap').hide();
						$('#marketPage').fadeIn('fast');
						
						app.initMessagesPage();
						loaded = true;
						$(window).unbind('scroll');
						$(window).scroll(function() {
						   if($(window).scrollTop() + $(window).height() == $(document).height() && !loaded) {
						   	   loaded = true;
						       totalNews = $('.messagesList').find('.wrap').length;
						       
						       if ($('.messages-tab.active').hasClass('send'))
						       		app.initMessagesPage(totalNews, 1);
						       else
						       		app.initMessagesPage(totalNews, 0);
						       
						       setTimeout(function() {
							       loaded = false;
						       }, 1000);
						       //alert('whaat');
						   }
						});	
						
					} else if (results.code == '201') {
						jQuery("#username").addClass('alertForm');
					} else if (results.code == '202') {
						
					} else if (results.code == '203') {
						
					} else if (results.code == '203') {
						jQuery("#password").addClass('alertForm');
					}
				
				}, 'jsonp');
			}
			
		});
		
	},
	
	initMessagesPage: function(start, send) {
	
		app.showLoader();
		data = {};
		data.session = app.session;
		data.limit = 20;
		data.start = start;
		data.onlyUnread = 0;
		data.sent = send;
		
		$('#newMessageForm').fadeOut();
		
		$.get(app.serverUrl + 'User/messages/', data, function(results) {
			
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
				data.limit = 20;
				data.start = 0;
				data.onlyUnread = 1;
				data.session = app.session;
				data.sent = 0;
				
				$.get(app.serverUrl + 'User/messages/', data, function(results) {
					total = results.data.length;
					$.each(results.data, function(i, item) {
						//unread[item.id] = true;
						//console.log(item);
						//console.log(unread);
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
			
			$('.open_bt_login').unbind('click');
			$('.open_bt_login').click(function(e) {
				e.preventDefault();
				$('#page-wrap').hide();
				$('#marketPage').fadeIn('fast');
				app.initMessagesPage();
			});
			
			$('.logout').unbind('click');
			$('.logout').click(function(e) {
				e.preventDefault();
				app.session = '';
				$('#page-wrap').fadeIn('fast');
				$('#marketPage').hide();
				$('.open_bt_login').find('span').html('LOGI SISSE');
				app.initLogin();
			});
			
			$('.menu_bar').find('.back').unbind('click');
			$('.menu_bar').find('.back').click(function(e) {
				e.preventDefault();
				$('#page-wrap').fadeIn('fast');
				$('#marketPage').hide();
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
		
		$('#startNewMessage').unbind('click');
		$('#startNewMessage').click(function(e) {
			e.preventDefault();
			
			$('#messagesList').html('');
			$('#newMessageForm').fadeIn();
			
			$('#messageForm2').find('#user').keyup(function() {
				
				if ($(this).val().length > 2) {
					data = {};
					data.username = $(this).val();
					
					$.get(app.serverUrl + 'User/users/', data, function(results) {
					
						$('.auto-search').html('');
						total = results.data.length;
						$.each(results.data, function(i, item) {
							$('.auto-search').append('<a href="#" rel="' + item.id + '">' + item.username + '</a>');
						});
						
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
						jQuery("#heading").removeClass('alertForm');
						jQuery("#message").removeClass('alertForm').val('');
						
						//$('#marketPage').find('.menu_bar').find('.back').click();
						$('#marketPage').find('.send').click();
						
					}, 'jsonp');
				}
			});
			
		});
		
	},
	
	initMessage: function(id, sent) {
	
		app.showLoader();
		
		id = id;
		
		data = {};
		if (sent)
			data.viewAsSent = 1;
		else
			data.markAsRead = 1;
		//data.markAsRead = true;
		
		$('.menu_bar').find('.back').unbind('click');
		$('.menu_bar').find('.back').click(function(e) {
			e.preventDefault();
			//console.log('ok');
			$('.messagesContainer').find('.page-wrap').removeClass('opened');
			$('.menu_bar').find('.back').unbind('click');
			$('.menu_bar').find('.back').click(function(e) {
				e.preventDefault();
				$('#page-wrap').fadeIn('fast');
				$('#marketPage').hide();
			});
		});
		
		$.get(app.serverUrl + 'User/message/' + id, data, function(results) {
			$('.ajax-loader').hide();
			
			
			
			$('#messageDetail').find('h3').html(results.data.username + ' ' + results.data.datetime);
			$('#messageDetail').find('strong').html(results.data.headline);
			$('#messageDetail').find('.message-description').html(results.data.contents);
			$('#heading').val(results.data.headline);
			
			
			data = {};
			data.limit = 20;
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
						
						$('#marketPage').find('.menu_bar').find('.back').click();
						$('#marketPage').find('.send').click();
					
					}, 'jsonp');
				}
			});
		
		}, 'jsonp');
		
	},
	
	initNewsListScroll: function() {
	
		if (history.pushState)
			window.history.pushState('news', 'news', "");
	
		$(window).unbind('scroll');
		$(window).scroll(function() {
			//alert($(window).scrollTop() + ' ja ' + $(window).height() + ' ning ' + $(document).height());
			if($(window).scrollTop() + $(window).height() + 60 >= $(document).height() && !loaded) {
	
				loaded = true;
				totalNews = $('.newslist').find('.news').length;
				app.getArticles(newsType, newsSearch, totalNews);
				setTimeout(function() {
					loaded = false;
				}, 1000);
				//alert('whaat');
			}
		});	
		/*
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
		*/
		
		$('.menu_bar').find('.back').unbind('click');
		$('.menu_bar').find('.back').click(function(e) {
			e.preventDefault();
			if (newsType != 'last') {
				app.getArticles('last', false, 0);
			} else {
				if (history.pushState)
					window.history.pushState('main', 'main', "");
				$('#newsPage').hide();
				$('#page-wrap').fadeIn('fast');
				$(window).unbind('scroll');
			}
		});
		
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
			//console.log('ok..');
			app.getArticles('search', $('#search').val(), 0);
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
		
		$('#commentForm').submit(function(e) {
			e.preventDefault();
			//status = validateComment();
			status = true;
			//console.log(status);
			if (status == true || status == 'true') {
				//console.log('davai');
				app.postComment();
			}
		})
		
	},
	
	getNewsCats: function() {
		
		data = {};
		
		$.get(app.serverUrl + 'Article/topics/', data, function(results) {
			
			newsCats = results.data;
			//console.log(newsCats);
			
			$.each(results.data, function(i, item) {
				cats = '';
				$.each(item.categories, function(j, cat) {
					if (j == 0) {
						cats = cat;
						if (i == 0)
							allCats = cat;
					} else {
						cats = cats + ',' + cat;
						allCats = allCats + ',' + cat;
						//console.log(allCats);
					}
				});
				$('.menu_level1').append('<a href="#" data-cats="' + cats + '">' + item.nameEst + '</a>');
			});
			//$('.menu_level1').append('<a href="#" data-cats="' + 17 + '">Shopping</a>');
			//console.log(allCats);
			$('.menu_level1').find('a').unbind('click');
			$('.menu_level1').find('a').click(function(e) {
				e.preventDefault();
				$('.categories').removeClass('active');
				$('.sidebar').removeClass('active');
				$('body').scrollTop(0);
				app.getArticles('category', $(this).data('cats'), 0);
				
				app.initNewsListScroll();
			});
			
			app.getArticles('last', false, 0);
			
		}, 'jsonp');
		
	},
	
	getArticles: function(type, search, start) {
		app.showLoader();
		newsType = type;
		newsSearch = search;
		
		specialBack = true;
		
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
				//console.log(search);
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
		//console.log(news);
		template = $('.hotTemplate');
		$('.hotnews_title').find('.title').html('Nädala kuumad!');
		$('#hotNews').html('');
		total = news.length;
		$.each(news, function(i, item) {
			image = app.imageUrl.replace('%image%', item.largeIcon);
			template.find('li').attr('rel', item.id);
			template.find('span').html(item.headline);
			template.find('img').attr('src', image);
			$('#hotNews').append(template.html());
		});		
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
		app.showLoader();
		$(window).unbind('scroll');
		
		$('.add-invisible').show();
		$('.add-visible').hide();
		
		data = {};
		app.currentNews = id;
		$('.postthumb:first').attr('src', '');
		
		
		
		$.get(app.serverUrl + 'Article/article/' + id, data, function(results) {
			
			//console.log(results);

			$('#gallery').hide();
			$('#comments').hide();
			
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
			
			$('.back-tab').unbind('click');
			$('.back-tab').click(function(e) {
				e.preventDefault();
				$('#newsList').removeClass('opened');
				$('#newsItem').removeClass('opened');
				$('#newsContent').html('');
				$('#commentsList').html('');
				app.initNewsListScroll();
				$(window).scrollTop(0);
			});
			
			$('.menu_bar').find('.back').unbind('click');
			$('.menu_bar').find('.back').click(function(e) {
				e.preventDefault();
				$('#newsList').removeClass('opened');
				$('#newsItem').removeClass('opened');
				$('#newsContent').html('');
				$('#commentsList').html('');
				app.initNewsListScroll();
			});
			
			$('#post').find('h2').html(results.data.headline);
			$('#newsContent').html(results.data.contents);
			$('#newsShortContent').html(results.data.introduction);
			
			$('.postthumb:first').attr('src', results.data.image);
			$('.postthumb:first').attr('alt', results.data.headline);
			
			$('.postthumb:first').removeClass('full-size');
			
			$('.postthumb:first').unbind('load');
			$('.postthumb:first').load(function() {
				$('.ajax-loader').hide();
				$('#newsList').addClass('opened');
				$('#newsItem').addClass('opened');
				//setTimeout(function() {
				$('body').scrollTop(0);
				//}, 100);
				//console.log(results.data.image);
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
					
					//console.log(pollEnds + ' ja ' + currentTime);
					
					//console.log(pollActive);
					
					$.get(app.supportUrl, data, function(results) {

						if (localStorage.getItem("poll_" + app.currentNews) || !pollActive) {
							
							$.each(results.options, function(i, option) {
								$('#comments').append('<p>' + option + '</p><section class="loading"><section class="loader" style="width:'+((results.options2[i]*100)/totalVote)+'%"></section></section>');
								
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

				$.get(app.serverUrl + 'Article/gallery/' + id + '?limit=1000', data, function(results) {
					
					if(results.data.length) {
						$('.gallery').html('');
						$('#gallery').show();
						$.each(results.data, function(i, image) {
							$('.gallery').append('<li><a href="http://buduaar.ee/files/Upload/Articles/Gallery/'+image.image+'"><img class="" alt="'+i+'" src="http://buduaar.ee/files/Upload/Articles/Gallery/'+image.icon+'" alt="thumb"/></a></li>');
						});
						
						var myPhotoSwipe = $(".gallery a").photoSwipe({ enableMouseWheel: false , enableKeyboard: false, captionAndToolbarShowEmptyCaptions: false });
						
						$('#gallery .gallery-slider').flexslider({
			              	animation: "slide",
						    animating: false,
						    itemWidth: 120,
						    itemMargin: 1,
						    controlNav: false,
						    directionNav: false
			    		});
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
		//console.log(data);
		$.get(app.supportUrl, data, function(results) {
			//console.log(results);
			if (results.code == '1') {
				$('#nimi').val('');
				$('#email').val('');
				$('#vanus').val('');
				$('#comment').val('');
				
				$.get(app.serverUrl + 'Article/comments/' + app.currentNews + '?limit=1000', data, function(results) {
					
					total = results.data.length;
					$('.commentsCount').html(total);
					
					$('#commentsList').html('');
					$.each(results.data, function(i, item) {
					
						$('.comments-template').find('h3').html(item.nickname + ' ' + item.time);
						$('.comments-template').find('p').html(item.comment);
						
						$('#commentsList').append($('.comments-template').html());
						
					});
					
					$('.comments-tab:not(.active)').click();
					
				}, 'jsonp');
				
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
				
				//console.log(results);
				
				results.options2[answer] = parseInt(results.options2[answer]) + 1;
			
				localStorage.setItem("poll_" + app.currentNews, true);
				$('#comments').html('<h3>' + question + '</h3>');
				$.each(results.options, function(i, option) {
					$('#comments').append('<p>' + option + '</p><section class="loading"><section class="loader" style="width:'+((results.options2[i]*100)/total)+'%"></section></section>');
								
				});
			}
		}, 'jsonp');
	}
	
}
$(document).ready(function() {

	window.addEventListener('popstate', function(event) {
    	//console.log('Pop: ' + page_inited);
    	if (page_inited > 0) {
    		//console.log('Pop2');
			if(!event.state)
		  		page = 'main';
		  	else
		  		page = event.state;
		  
		  	if (!pages[page] && parseInt(page)) {
				app.getNews(page);
			} else {

				switch(page) {
					case 'news':
						$('#newsPage').fadeIn('fast');
						$('#page-wrap').hide();
						$('.page-wrap').removeClass('opened');
						break;
					case 'main':
						$('#page-wrap').fadeIn('fast');
						$('#marketPage').hide();
						$('#newsPage').hide();
						break;
				}
			}
	    }
	  //updateContent(event.state);
	});

	app.init();
});
jQuery.fn.center = function () {
    this.css("position","absolute");
    this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + 
                                                $(window).scrollTop()) + "px");
    this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + 
                                                $(window).scrollLeft()) + "px");
    return this;
}
