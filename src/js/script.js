$(document).ready(function(){
	$('.carousel__inner').slick({ // $ получает все элементы со страницы по определенному селектору (классы, ID, теги, их комбинации)
		dots: false,
		infinite: true,
		speed: 1200,
		slidesToShow: 1,
		adaptiveHeight: true,
		autoplay: true,
		autoplaySpeed: 2000,
		prevArrow: '<button type="button" class="slick-prev"><img src="icons/arrow_left.png"></button>',
		nextArrow: '<button type="button" class="slick-next"><img src="icons/arrow_right.png"></button>',
		responsive: [
			{
				breakpoint: 992,
				settings: {
				  dots: true,
				  arrows: false,
				}
			}
		]
	  });

	  $('ul.catalog__tabs').on('click', 'li:not(.catalog__tab_active)', function() {
		$(this)
		  .addClass('catalog__tab_active').siblings().removeClass('catalog__tab_active') //   добавить этот класс тому, на который нажали и удалить у всех соседних
		  .closest('div.container').find('div.catalog__content').removeClass('catalog__content_active').eq($(this).index()).addClass('catalog__content_active');  //   получить номер вкладки и добавить класс активности контенту, который сэтим же номером 
	  });

	  function toggleSlide(item) {
		$(item).each(function(i) {	// each - для каждого элемента будет какое-то действие? i - номер по порядку
			$(this).on('click', function(e) {
				e.preventDefault();
				$('.catalog-item__content').eq(i).toggleClass('catalog-item__content_active');	// eq получает элемент по индексу, нужно, чтобы переключался только нужный, а не все
				$('.catalog-item__reverse').eq(i).toggleClass('catalog-item__reverse_active');
			})
		});
	};

	toggleSlide('.catalog-item__link');
	toggleSlide('.catalog-item__back');
	
	$('[data-modal=consultation]').on('click', function() {
		$('.overlay, #consultation').fadeIn('slow');
	});
	$('.modal__close').on('click', function() {
		$('.overlay, #consultation, #thanks, #order').fadeOut('slow');
	});

	$('.button_mini').each(function(i) {
		$(this).on('click', function() {
			$('#order .modal__descr').text($('.catalog-item__subtitle').eq(i).text());	// .catalog-item__subtitle - подзаголовок с названием модели пульсометра, которую надо показать в модальном окне заказа; .eq(i)получает нужный подзаголовок по попрядку; команда text получает подзаголовок, а потом она же добавляет его в .modal__descr
			$('.overlay, #order').fadeIn('slow');
		})
	});

	function validateForms(form){
		$(form).validate({
			rules: {
				name: {
					required: true,
					minlength: 2
				},
				phone: "required",
				email: {
					required: true,
					email: true
				}
			},
			messages: {
				name: {
					required: "Пожалуйста, введите свое имя",
					minlength: jQuery.validator.format("Введите минимум {0} символа!")
				  },
				phone: "Пожалуйста, введите свой номер телефона",
				email: {
				  required: "Пожалуйста, введите свой e-mail",
				  email: "Неправильно введен e-mail адрес"
				}
			}
		});
	};
 	validateForms('#consultation-form');
	validateForms('#consultation form');
	validateForms('#order form');

	// маска ввода номера

	$('input[name=phone]').mask("+7 (999) 999-99-99"); 

	// отправка сообщений с сайта

	$('form').submit(function(e) {	// submit - отправка формы, когда прошла валидацию
		e.preventDefault();
		$.ajax({	// метод ajax в jQuery
			type: "POST",
			url: "mailer/smart.php",  // куда отправлять запрос
			data: $(this).serialize()
		}).done(function() { // когда прошла операция выполнена, то следующее будет это
			$(this).find("input").val("");	// очистить инпуты у формы, с которой работаем (поэтому this)
			$('#consultation, #order').fadeOut();
			$('.overlay, #thanks').fadeIn('slow');

			$('form').trigger('reset'); // очистить все формы сайта
		});
		return false;
	});


	$(window).scroll(function() {
        if ($(this).scrollTop() > 1200) { // стрелка вверх появляется, когда пролистано 1200 px сверху
            $('.pageup').fadeIn();
        } else {
            $('.pageup').fadeOut();
        }
	});

	// плавный скролл вверх

	$("a[href='#up']").click(function(){
        const _href = $(this).attr("href");
        $("html, body").animate({scrollTop: $(_href).offset().top+"px"}); // анимация jQuery
        return false;
	});
	
	// библиотека Wow.js, чтобы отзывы плавно выплывали вверх, когда пользователь долистает до них, а не сразу при загрузке страницы
	new WOW().init();
});