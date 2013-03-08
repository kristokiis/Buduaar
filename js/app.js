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

var app = {

	currentNews: 0,
	serverUrl: 'http://buduaar.ee/Api/',
	imageUrl: 'http://buduaar.ee/files/Upload/Articles/%image%',
	
	init: function() {
		this.initLogin();
		this.initNews();
		
		//this.initProducts();
		//this.initAccount();
	},
	
	initLogin: function() {
		
	},
	
	initNews: function() {
		this.initNewsLinks();
		this.getNewsCats();
		this.getArticles('hot', false);
	},
	
	initProducts: function() {
		this.getMarketCats();
		this.getProducts(true);
	},
	
	initAccount: function() {
			
	},
	
	initNewsLinks: function() {
		
		$('.today').click(function(e) {
			app.getArticles('today');
		});
		
		$('#searchForm').submit(function(e) {
			e.preventDefault();
			//console.log('ok..');
			app.getArticles('search', $('#search').val());
		});
		
		$('.comments-tab').click(function(e) {
			e.preventDefault();
			$('.comments-tab').removeClass('active');
			$(this).addClass('active');
			
			if ($(this).hasClass('add-comment')) {
				$('#commentsList').hide();
				$('#addcomment').show();
			} else {
				$('#commentsList').show();
				$('#addcomment').hide();
			}
			
		});
		
		$('#commentForm').submit(function(e) {
			e.preventDefault();
			status = validateComment();
			if (status)
				app.postComment();
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
			//console.log(allCats);
			$('.menu_level1').find('a').unbind('click');
			$('.menu_level1').find('a').click(function(e) {
				e.preventDefault();
				$('.categories').removeClass('active');
				$('.sidebar').removeClass('active');
				app.getArticles('category', $(this).data('cats'));
				if ($('#newsList').hasClass('opened')) {
					$('#newsList').removeClass('opened');
					$('#newsItem').removeClass('opened');
				}
			});
			
			app.getArticles('last', false);
			
		}, 'jsonp');
		
	},
	
	getArticles: function(type, search) {
		
		data = {};
		
		if (type == 'hot') {
			searchStr = '?categories=58&limit=8';
		} else if (type == 'last') {
			searchStr = '?lang=est&limit=20';
		} else if (type == 'today') {
			var today = new Date();
			//today = 
			searchStr = '?lang=est&limit=20&startDate=05-03-2013&endDate=05-03-2013';
		} else if (type == 'search') {
			searchStr = '?lang=est&limit=20&word=' + search;
		} else if (type == 'category') {
			//console.log(search);
			searchStr = '?lang=est&limit=20&categories=' + search;
		}
		
		$.get(app.serverUrl + 'Article/search/' + searchStr, data, function(results) {
			
			if (type == 'hot') {
				app.parseHotNews(results.data);
			} else {
				app.parseNewsList(results.data);
			}
			
		}, 'jsonp');
		
	},
	
	parseHotNews: function(news) {
		//console.log(news);
		template = $('.hotTemplate');
		$('.hotnews_title').find('.title').html('Nädala kuumad! (' + news.length + ')');
		$('#hotNews').html('');
		$.each(news, function(i, item) {
			image = app.imageUrl.replace('%image%', item.largeIcon);
			template.find('li').attr('rel', item.id);
			template.find('span').html(item.headline);
			template.find('img').attr('src', image);
			$('#hotNews').append(template.html());
		});
		
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
	},
	
	parseNewsList: function(news) {
		template = $('.newsTemplate');
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
		
		//$('body').css('');
		
	},
	
	getNews: function(id) {
		data = {};
		app.currentNews = id;
		$('.postthumb:first').attr('src', '');
		$.get(app.serverUrl + 'Article/article/' + id, data, function(results) {
			
			$('#gallery').hide();
			$('#comments').hide();
			
			$('.menu_bar').find('.back').click(function(e) {
				e.preventDefault();
				$('#newsList').removeClass('opened');
				$('#newsItem').removeClass('opened');
				$('#newsContent').html('');
				$('#commentsList').html('');
			});
			
			$('#post').find('h2').html(results.data.headline);
			$('#newsContent').html(results.data.contents);
			
			$('.postthumb:first').attr('src', results.data.image);
			
			$('.postthumb:first').unbind('load');
			$('.postthumb:first').load(function() {
				$('#newsList').addClass('opened');
				$('#newsItem').addClass('opened');
				//setTimeout(function() {
				$('body').scrollTop(0);
				//}, 100);
				
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
					
					$.get('http://projects.efley.ee/buduaar/support.php', data, function(results) {

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
							$('.gallery').append('<li><a href="http://buduaar.ee/files/Upload/Articles/Gallery/'+image.image+'"><img class="" src="http://buduaar.ee/files/Upload/Articles/Gallery/'+image.icon+'" alt="thumb"/></a></li>');
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
						
					}
					
				}, 'jsonp');
				
			});
			
		
		}, 'jsonp');
		

	},
	
	postComment: function() {
		data = {};
		
		data.action = 'postComment';
		data.id = app.currentNews;
		data.name = $('#nimi').val();
		data.mail = $('#email').val();
		data.age = $('#vanus').val();
		data.comment = $('#comment').val();
		
		$.get('http://projects.efley.ee/buduaar/support.php', data, function(results) {
			//console.log(results);
			if (results.status == 'success') {
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
		data.answer = answer;
	
		$.get('http://projects.efley.ee/buduaar/support.php', data, function(result) {
			if (result.status == 'success') {
				
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
	app.init();
});