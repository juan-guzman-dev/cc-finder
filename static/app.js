let banks = document.getElementsByClassName('banks');
let earns = document.getElementsByClassName('earns');

/*
Initialize popovers
*/
$(function () {
	$('[data-toggle="popover"]').popover();
});

/*
Toggle Fontawesome icons
*/
$(document).ready(function () {
	$('.myCards').on('click', function () {
		$(this).find(':first-child > i').toggleClass('fa-plus-square fa-minus-square');
	});
});

$(document).ready(function () {
	$('.moreDetails').on('click', function () {
		$(this).find('i').toggleClass('fa-chevron-down fa-chevron-up');
		if ($(this).find('i').hasClass('fa-chevron-up')) {
			$(this).find('span').html('See Less Details');
		} else {
			$(this).find('span').html('See More Details');
		}
	});
});

/*
Table Pagination and Search form
*/
getPagination('#myTable');

/*					PAGINATION 
- on change max rows select options fade out all rows gt option value mx = 5
- append pagination list as per numbers of rows / max rows option (20row/5= 4pages )
- each pagination li on click -> fade out all tr gt max rows * li num and (5*pagenum 2 = 10 rows)
- fade out all tr lt max rows * li num - max rows ((5*pagenum 2 = 10) - 5)
- fade in all tr between (maxRows*PageNum) and (maxRows*pageNum)- MaxRows 
*/

function getPagination(table) {
	let lastPage = 1;

	$('#maxRows')
		.on('change', function (evt) {
			$('.paginationprev').html(''); // reset pagination

			lastPage = 1;
			$('.pagination').find('li').slice(1, -1).remove();
			let trnum = 0; // reset tr counter
			let maxRows = parseInt($(this).val()); // get Max Rows from select option

			if (maxRows == 367) {
				$('.pagination').hide();
			} else {
				$('.pagination').show();
			}

			// .filter(function() {
			// 	return $(this).css('display') !== 'none';
			// })
			let totalRows = $('tbody .myCards').length; // numbers of rows
			$('tbody .myCards').each(function () {
				// each TR in  table and not the header
				trnum++; // Start Counter
				if (trnum > maxRows) {
					// if tr number gt maxRows

					$(this).hide(); // fade it out
				}
				if (trnum <= maxRows) {
					$(this).show();
				} // else fade in Important in case if it ..
			}); //  was fade out to fade it in
			if (totalRows > maxRows) {
				// if tr total rows gt max rows option
				let pagenum = Math.ceil(totalRows / maxRows); // ceil total(rows/maxrows) to get ..
				//	numbers of pages
				for (let i = 1; i <= pagenum;) {
					// for each page append pagination li
					$('.pagination #prev')
						.before(
							'<li class="page-link" data-page="' +
							i +
							'">\
			  <span>' +
							i++ +
							'<span class="sr-only">(current)</span></span>\
			</li>'
						)
						.show();
				} // end for i
			} // end if row count > max rows
			$('.pagination [data-page="1"]').addClass('active'); // add active class to the first li

			//SHOWING ROWS NUMBER OUT OF TOTAL DEFAULT
			showing_rows_count(maxRows, 1, totalRows);

			$('.pagination li').on('click', function (evt) {
				// on click each page
				evt.stopImmediatePropagation();
				evt.preventDefault();
				let pageNum = $(this).attr('data-page'); // get it's number

				let maxRows = parseInt($('#maxRows').val()); // get Max Rows from select option

				if (pageNum == 'prev') {
					if (lastPage == 1) {
						return;
					}
					pageNum = --lastPage;
				}
				if (pageNum == 'next') {
					if (lastPage == $('.pagination li').length - 2) {
						return;
					}
					pageNum = ++lastPage;
				}

				lastPage = pageNum;
				let trIndex = 0; // reset tr counter
				$('.pagination li').removeClass('active'); // remove active class from all li
				$('.pagination [data-page="' + lastPage + '"]').addClass('active'); // add active class to the clicked
				// $(this).addClass('active');					// add active class to the clicked
				limitPagging();

				//SHOWING ROWS NUMBER OUT OF TOTAL
				showing_rows_count(maxRows, pageNum, totalRows);
				//SHOWING ROWS NUMBER OUT OF TOTAL

				$('tbody .myCards').each(function () {
					// each tr in table not the header
					trIndex++; // tr index counter
					// if tr index gt maxRows*pageNum or lt maxRows*pageNum-maxRows fade if out
					if (trIndex > maxRows * pageNum || trIndex <= maxRows * pageNum - maxRows) {
						$(this).hide();
					} else {
						$(this).show();
					} //else fade in
				}); // end of for each tr in table
			}); // end of on click pagination list
			limitPagging();
		})
		.val(10)
		.change();

	// end of on select change

	// END OF PAGINATION
}

//ROWS SHOWING FUNCTION
function showing_rows_count(maxRows, pageNum, totalRows) {
	//Default rows showing
	let end_index = maxRows * pageNum;
	let start_index = maxRows * pageNum - maxRows + parseFloat(1);
	let string = 'Showing ' + start_index + ' to ' + end_index + ' of ' + totalRows + ' entries';
	$('.rows_count').html(string);
}

function limitPagging() {
	// alert($('.pagination li').length)

	if ($('.pagination li').length > 7) {
		if ($('.pagination li.active').attr('data-page') <= 3) {
			$('.pagination li:gt(5)').hide();
			$('.pagination li:lt(5)').show();
			$('.pagination [data-page="next"]').show();
		}
		if ($('.pagination li.active').attr('data-page') > 3) {
			$('.pagination li:gt(0)').hide();
			$('.pagination [data-page="next"]').show();
			for (
				let i = parseInt($('.pagination li.active').attr('data-page')) - 2;
				i <= parseInt($('.pagination li.active').attr('data-page')) + 2;
				i++
			) {
				$('.pagination [data-page="' + i + '"]').show();
			}
		}
	}
}

/*
// All Table search script
function FilterkeyWord_all_table() {
	// Count td if you want to search on all table instead of specific column

	let count = $('.table').children('tbody').children('tr:first-child').children('td').length;

	// Declare variables
	let input, filter, table, tr, td, i;
	input = document.getElementById('myInput');
	let input_value = document.getElementById('myInput').value;
	filter = input.value.toLowerCase();
	if (input_value != '') {
		table = document.getElementById('myTable');
		tr = table.getElementsByClassName('myCards');

		// Loop through all table rows, and hide those who don't match the search query
		for (i = 0; i < tr.length; i++) {
			let flag = 0;

			for (j = 0; j < count; j++) {
				td = tr[i].getElementsByTagName('td')[j];
				if (td) {
					let td_text = td.innerHTML;
					if (td.innerHTML.toLowerCase().indexOf(filter) > -1) {
						//let td_text = td.innerHTML;
						//td.innerHTML = 'shaban';
						flag = 1;
					} else {
						//DO NOTHING
					}
				}
			}
			if (flag == 1) {
				tr[i].style.display = '';
			} else {
				tr[i].style.display = 'none';
			}
		}
	} else {
		//RESET TABLE
		$('#maxRows').trigger('change');
	}
}
*/

/*
		SEARCH CARD NAME BAR
*/
$(document).ready(function () {
	$('#myInput').keyup(function () {
		var input, filter, tr, td, txtValue, lastPage, cardsFound, totalRows, maxRows, trnum;
		input = $('#myInput');
		filter = input.val().toUpperCase();
		if (filter !== '') {
			tr = $('.myCards');
			tr.each(function () {
				td = $(this).find('td:nth-child(2)');
				if (td) {
					txtValue = td.text();
					if (txtValue.toUpperCase().search(filter) > -1) {
						$(this).show();
					} else {
						$(this).hide();
					}
				}
			});

			lastPage = 1;
			$('.pagination').empty();
			trnum = 0; // reset tr counter
			maxRows = $('#maxRows').val(); // get Max Rows from dropdown

			if (maxRows == 368) {
				$('.pagination').hide();
			} else {
				$('.pagination').show();
			}

			cardsFound = $('.myCards:visible');
			totalRows = cardsFound.length;

			// console.log(`total rows: ${totalRows}`);
			$('.myCards:visible').each(function () {
				// each visible TR in table
				trnum++; // Start Counter
				if (trnum > maxRows) {
					// if tr number gt maxRows
					$(this).hide(); // fade it out
				}
				if (trnum <= maxRows) {
					$(this).show();
				} // else fade in Important in case if it ..
			}); //  was fade out to fade it in
			if (totalRows > maxRows) {
				$('.pagination')
					.append(
						'<li class="page-link" data-page="prev" id="prev2">\
					<span> < <span class="sr-only">(current)</span></span>\
				</li>\
				<li class="page-link" data-page="next" id="prev">\
					<span> > <span class="sr-only">(current)</span></span>\
				</li>'
					)
					.show();

				// if tr total rows gt max rows option
				let pagenum = Math.ceil(totalRows / maxRows); // ceil total(rows/maxrows) to get ..
				//	numbers of pages
				for (let i = 1; i <= pagenum;) {
					// for each page append pagination li
					$('.pagination #prev')
						.before(
							'<li class="page-link" data-page="' +
							i +
							'">\
		  <span>' +
							i++ +
							'<span class="sr-only">(current)</span></span>\
		</li>'
						)
						.show();
				} // end for i
			} // end if row count > max rows
			$('.pagination [data-page="1"]').addClass('active'); // add active class to the first li
			//SHOWING ROWS NUMBER OUT OF TOTAL DEFAULT
			showing_rows_count(maxRows, 1, totalRows);

			$('.pagination li').on('click', function (evt) {
				// on click each page
				evt.stopImmediatePropagation();
				evt.preventDefault();
				let pageNum = $(this).attr('data-page'); // get it's number

				let maxRows = $('#maxRows').val(); // get Max Rows from select option

				if (pageNum == 'prev') {
					if (lastPage == 1) {
						return;
					}
					pageNum = --lastPage;
				}
				if (pageNum == 'next') {
					if (lastPage == $('.pagination li').length - 2) {
						return;
					}
					pageNum = ++lastPage;
				}

				lastPage = pageNum;
				let trIndex = 0; // reset tr counter
				$('.pagination li').removeClass('active'); // remove active class from all li
				$('.pagination [data-page="' + lastPage + '"]').addClass('active'); // add active class to the clicked
				// $(this).addClass('active');					// add active class to the clicked
				limitPagging();

				//SHOWING ROWS NUMBER OUT OF TOTAL
				showing_rows_count(maxRows, pageNum, totalRows);
				//SHOWING ROWS NUMBER OUT OF TOTAL

				cardsFound.each(function () {
					// each tr filtered by search bar
					trIndex++; // tr index counter
					// if tr index gt maxRows*pageNum or lt maxRows*pageNum-maxRows fade if out
					if (trIndex > maxRows * pageNum || trIndex <= maxRows * pageNum - maxRows) {
						$(this).hide();
					} else {
						$(this).show();
					} //else fade in
				}); // end of for each tr in table
			}); // end of on click pagination list
			limitPagging();
		} else {
			//RESET TABLE
			$('#maxRows').trigger('change');
		}
	});
});

/*
Remove fa-question-circle from Intro Bonus if = 0
*/
$(function () {
	$('.signup-bonus').each(function () {
		if ($(this).text() == 0) {
			$(this).children().first().remove();
		}
	});
});

/*
Alert if all banks checkboxes unchecked
*/
// $(function () {
// 	$btn = $('#filter');
// 	$btn.on('click', function (evt) {
// 		if ($('.banks:checked').length === 0) {
// 			alert('Please select a credit card company.');
// 		}
// 	});
// 	return
// });

/*
Alert if all earn categories checkboxes unchecked
*/
// $(function () {
// 	$btn = $('#filter');
// 	$btn.on('click', function (evt) {
// 		if ($('.earns:checked').length === 0) {
// 			alert('Please select an earning category.');
// 		}
// 	});
// });

/*      'BANKS' CHECKBOXES
- Persist form values to local storage
- Implement Check/Uncheck All functionality
*/
$(document).ready(function () {
	var banksFormValues = JSON.parse(localStorage.getItem('banksFormValues')) || {};
	var $checkboxes = $('#checkbox-container-banks :checkbox');
	var $button = $('#checkbox-container-banks button');
	var $warning_msg = $('#warning_banks');

	function allChecked() {
		return $checkboxes.length === $checkboxes.filter(':checked').length;
	}

	function allUnchecked() {
		return $checkboxes.filter(':checked').length === 0;
	}

	function handleWarningMsg() {
		allUnchecked() ? $warning_msg.removeClass('d-none') : $warning_msg.addClass('d-none');
	}

	function updateButtonStatus() {
		$button.text(allChecked() ? 'Uncheck all' : 'Check all');
	}

	function handleButtonClick() {
		$checkboxes.prop('checked', allChecked() ? false : true);
	}

	function warningMsgState() {
		if ($warning_msg.hasClass('d-none')) {
			return 'hidden';
		} else {
			return 'visible';
		}
	}

	function updateStorage() {
		$checkboxes.each(function () {
			banksFormValues[this.id] = this.checked;
		});

		banksFormValues['buttonText'] = $button.text();
		banksFormValues['msg'] = warningMsgState();
		localStorage.setItem('banksFormValues', JSON.stringify(banksFormValues));
	}

	$button.on('click', function () {
		handleButtonClick();
		updateButtonStatus();
		handleWarningMsg();
		warningMsgState();
		updateStorage();
	});

	$checkboxes.on('change', function () {
		updateButtonStatus();
		handleWarningMsg();
		warningMsgState();
		updateStorage();
	});

	// On page load
	$.each(banksFormValues, function (key, value) {
		$('#' + key).prop('checked', value);
	});
	if (banksFormValues['msg'] === 'visible') {
		$warning_msg.removeClass('d-none');
	} else {
		$warning_msg.addClass('d-none');
	}
	$button.text(banksFormValues['buttonText']);
});

/*      'EARNING CATEGORIES' CHECKBOXES
- Persist form values to local storage
- Implement Check/Uncheck All functionality
*/
$(document).ready(function () {
	var earnsFormValues = JSON.parse(localStorage.getItem('earnsFormValues')) || {};
	var $checkboxes = $('#checkbox-container-earns :checkbox');
	var $button = $('#checkbox-container-earns button');
	var $warning_msg = $('#warning_cats');

	function allChecked() {
		return $checkboxes.length === $checkboxes.filter(':checked').length;
	}

	function allUnchecked() {
		return $checkboxes.filter(':checked').length === 0;
	}

	function handleWarningMsg() {
		allUnchecked() ? $warning_msg.removeClass('d-none') : $warning_msg.addClass('d-none');
	}

	function updateButtonStatus() {
		$button.text(allChecked() ? 'Uncheck all' : 'Check all');
	}

	function handleButtonClick() {
		$checkboxes.prop('checked', allChecked() ? false : true);
	}

	function warningMsgState() {
		if ($warning_msg.hasClass('d-none')) {
			return 'hidden';
		} else {
			return 'visible';
		}
	}

	function updateStorage() {
		$checkboxes.each(function () {
			earnsFormValues[this.id] = this.checked;
		});

		earnsFormValues['buttonText'] = $button.text();
		earnsFormValues['msg'] = warningMsgState();
		localStorage.setItem('earnsFormValues', JSON.stringify(earnsFormValues));
	}

	$button.on('click', function () {
		handleButtonClick();
		updateButtonStatus();
		handleWarningMsg();
		warningMsgState();
		updateStorage();
	});

	$checkboxes.on('change', function () {
		updateButtonStatus();
		handleWarningMsg();
		warningMsgState();
		updateStorage();
	});

	// On page load
	$.each(earnsFormValues, function (key, value) {
		$('#' + key).prop('checked', value);
	});
	if (earnsFormValues['msg'] === 'visible') {
		$warning_msg.removeClass('d-none');
	} else {
		$warning_msg.addClass('d-none');
	}
	$button.text(earnsFormValues['buttonText']);
});

/*      'I WANT' CHECKBOXES
- Persist form values to local storage
- Implement Check/Uncheck All functionality
*/
$(document).ready(function () {
	var formValuesWants = JSON.parse(localStorage.getItem('formValuesWants')) || {};
	var $checkboxes = $('#checkbox-container-wants :checkbox');
	var $button = $('#checkbox-container-wants button');

	function allChecked() {
		return $checkboxes.length === $checkboxes.filter(':checked').length;
	}

	function updateButtonStatus() {
		$button.text(allChecked() ? 'Uncheck all' : 'Check all');
	}

	function handleButtonClick() {
		$checkboxes.prop('checked', allChecked() ? false : true);
	}

	function updateStorage() {
		$checkboxes.each(function () {
			formValuesWants[this.id] = this.checked;
		});

		formValuesWants['buttonText'] = $button.text();
		localStorage.setItem('formValuesWants', JSON.stringify(formValuesWants));
	}

	$button.on('click', function () {
		handleButtonClick();
		updateButtonStatus();
		updateStorage();
	});

	$checkboxes.on('change', function () {
		updateButtonStatus();
		updateStorage();
	});

	// On page load
	$.each(formValuesWants, function (key, value) {
		$('#' + key).prop('checked', value);
	});

	$button.text(formValuesWants['buttonText']);
});

/*      'REWARDS PROGRAMS' CHECKBOXES
- Persist form values to local storage
- Implement Check/Uncheck All functionality
*/
$(document).ready(function () {
	var programsFormValues = JSON.parse(localStorage.getItem('programsFormValues')) || {};
	var $checkboxes = $('#checkbox-container-programs :checkbox');
	var $button = $('#checkbox-container-programs button');
	var $warning_msg = $('#warning_programs');

	function allChecked() {
		return $checkboxes.length === $checkboxes.filter(':checked').length;
	}

	function allUnchecked() {
		return $checkboxes.filter(':checked').length === 0;
	}

	function handleWarningMsg() {
		allUnchecked() ? $warning_msg.removeClass('d-none') : $warning_msg.addClass('d-none');
	}

	function updateButtonStatus() {
		$button.text(allChecked() ? 'Uncheck all' : 'Check all');
	}

	function handleButtonClick() {
		$checkboxes.prop('checked', allChecked() ? false : true);
	}

	function warningMsgState() {
		if ($warning_msg.hasClass('d-none')) {
			return 'hidden';
		} else {
			return 'visible';
		}
	}

	function updateStorage() {
		$checkboxes.each(function () {
			programsFormValues[this.id] = this.checked;
		});

		programsFormValues['buttonText'] = $button.text();
		programsFormValues['msg'] = warningMsgState();
		localStorage.setItem('programsFormValues', JSON.stringify(programsFormValues));
	}

	$button.on('click', function () {
		handleButtonClick();
		updateButtonStatus();
		handleWarningMsg();
		warningMsgState();
		updateStorage();
	});

	$checkboxes.on('change', function () {
		updateButtonStatus();
		handleWarningMsg();
		warningMsgState();
		updateStorage();
	});

	// On page load
	$.each(programsFormValues, function (key, value) {
		$('#' + key).prop('checked', value);
	});
	if (programsFormValues['msg'] === 'visible') {
		$warning_msg.removeClass('d-none');
	} else {
		$warning_msg.addClass('d-none');
	}
	$button.text(programsFormValues['buttonText']);
});

/*      HANDLE MONTHLY SPEND FORM
- On submit: gather inputs from form and display and send ajax post request to view
- Display column with the calculated First Year Rewards for each table row
*/
$(document).ready(function () {
	var firstYearRewards = JSON.parse(localStorage.getItem('firstYearRewards')) || {};
	var $th = $('#calc-th');
	var $cards = $('.myCards');

	function columnHidden() {
		return $th.hasClass('d-none');
	}

	function handleButtonClick() {
		if (columnHidden()) {
			$th.removeClass('d-none');
			$cards.each(function () {
				$(this).find('td:eq(2)').removeClass('d-none');
			});
		}
	}

	function updateStorage() {
		$cards.each(function () {
			firstYearRewards[this.id] = $(this).find('td:eq(2)').html();
		});
		firstYearRewards['msg'] = columnHidden();
		console.log(firstYearRewards);
		localStorage.setItem('firstYearRewards', JSON.stringify(firstYearRewards));
	}

	$('#spendForm').on('submit', function (event) {
		event.preventDefault();
		handleButtonClick();

		// gather spend inputs from form
		var formData = {
			air: $('input[name=air]').val().replace(/\$|,/g, '') || 0,
			cable: $('input[name=cable]').val().replace(/\$|,/g, '') || 0,
			car: $('input[name=car]').val().replace(/\$|,/g, '') || 0,
			dept: $('input[name=dept]').val().replace(/\$|,/g, '') || 0,
			drug: $('input[name=drug]').val().replace(/\$|,/g, '') || 0,
			entertain: $('input[name=entertain]').val().replace(/\$|,/g, '') || 0,
			gas: $('input[name=gas]').val().replace(/\$|,/g, '') || 0,
			home: $('input[name=home]').val().replace(/\$|,/g, '') || 0,
			hotel: $('input[name=hotel]').val().replace(/\$|,/g, '') || 0,
			office: $('input[name=office]').val().replace(/\$|,/g, '') || 0,
			online: $('input[name=online]').val().replace(/\$|,/g, '') || 0,
			phone: $('input[name=phone]').val().replace(/\$|,/g, '') || 0,
			restaurant: $('input[name=restaurant]').val().replace(/\$|,/g, '') || 0,
			supermarket: $('input[name=supermarket]').val().replace(/\$|,/g, '') || 0,
			utility: $('input[name=utility]').val().replace(/\$|,/g, '') || 0
		};
		// url: 'http://127.0.0.1:5000/credit-cards',
		$.ajax({
			url: 'https://cc-finder.herokuapp.com/credit-cards',
			type: 'post',
			data: formData,
			success: function (d) {
				$('.myCards').each(function () {
					// gather the points earned by each spend category (they are displayed on the DOM by the back end)
					let $airPts = parseFloat($(this).find('#air_pts').text());
					let $cablePts = parseFloat($(this).find('#cable_pts').text());
					let $carPts = parseFloat($(this).find('#car_pts').text());
					let $deptPts = parseFloat($(this).find('#dept_pts').text());
					let $drugPts = parseFloat($(this).find('#drug_pts').text());
					let $entertainPts = parseFloat($(this).find('#entertain_pts').text());
					let $gasPts = parseFloat($(this).find('#gas_pts').text());
					let $homePts = parseFloat($(this).find('#home_pts').text());
					let $hotelPts = parseFloat($(this).find('#hotel_pts').text());
					let $officePts = parseFloat($(this).find('#office_pts').text());
					let $onlinePts = parseFloat($(this).find('#online_pts').text());
					let $phonePts = parseFloat($(this).find('#phone_pts').text());
					let $restaurantPts = parseFloat($(this).find('#restaurant_pts').text());
					let $supermarketPts = parseFloat($(this).find('#supermarket_pts').text());
					let $utilityPts = parseFloat($(this).find('#utility_pts').text());
					let $everywherePts = parseFloat($(this).find('#everywhere_pts').text());
					// gather signup bonus and annual fee
					let $signupBonus = parseFloat($(this).find('.signup-bonus').text().replace(',', '')); // remove comma
					let $annualFee = parseFloat($(this).find('#annual_fee').text().replace('$', '')); // remove Dollar sign

					let $totalSpend =
						parseFloat(formData['air']) +
						parseFloat(formData['cable']) +
						parseFloat(formData['car']) +
						parseFloat(formData['dept']) +
						parseFloat(formData['drug']) +
						parseFloat(formData['entertain']) +
						parseFloat(formData['gas']) +
						parseFloat(formData['home']) +
						parseFloat(formData['hotel']) +
						parseFloat(formData['office']) +
						parseFloat(formData['online']) +
						parseFloat(formData['phone']) +
						parseFloat(formData['restaurant']) +
						parseFloat(formData['supermarket']) +
						parseFloat(formData['utility']);

					// for each spend category, calculate accelerated points earned
					let $accAir = function () {
						if ($airPts !== 0) {
							return ($airPts - $everywherePts) * parseFloat(formData['air']);
						} else {
							return 0;
						}
					};

					let $accCable = function () {
						if ($cablePts !== 0) {
							return ($cablePts - $everywherePts) * parseFloat(formData['cable']);
						} else {
							return 0;
						}
					};

					let $accCar = function () {
						if ($carPts !== 0) {
							return ($carPts - $everywherePts) * parseFloat(formData['car']);
						} else {
							return 0;
						}
					};

					let $accDept = function () {
						if ($deptPts !== 0) {
							return ($deptPts - $everywherePts) * parseFloat(formData['dept']);
						} else {
							return 0;
						}
					};

					let $accDrug = function () {
						if ($drugPts !== 0) {
							return ($drugPts - $everywherePts) * parseFloat(formData['drug']);
						} else {
							return 0;
						}
					};

					let $accEntertain = function () {
						if ($entertainPts !== 0) {
							return ($entertainPts - $everywherePts) * parseFloat(formData['entertain']);
						} else {
							return 0;
						}
					};

					let $accGas = function () {
						if ($gasPts !== 0) {
							return ($gasPts - $everywherePts) * parseFloat(formData['gas']);
						} else {
							return 0;
						}
					};

					let $accHome = function () {
						if ($homePts !== 0) {
							return ($homePts - $everywherePts) * parseFloat(formData['home']);
						} else {
							return 0;
						}
					};

					let $accHotel = function () {
						if ($hotelPts !== 0) {
							return ($hotelPts - $everywherePts) * parseFloat(formData['hotel']);
						} else {
							return 0;
						}
					};

					let $accOffice = function () {
						if ($officePts !== 0) {
							return ($officePts - $everywherePts) * parseFloat(formData['office']);
						} else {
							return 0;
						}
					};

					let $accOnline = function () {
						if ($onlinePts !== 0) {
							return ($onlinePts - $everywherePts) * parseFloat(formData['online']);
						} else {
							return 0;
						}
					};

					let $accPhone = function () {
						if ($phonePts !== 0) {
							return ($phonePts - $everywherePts) * parseFloat(formData['phone']);
						} else {
							return 0;
						}
					};

					let $accRestaurant = function () {
						if ($restaurantPts !== 0) {
							return ($restaurantPts - $everywherePts) * parseFloat(formData['restaurant']);
						} else {
							return 0;
						}
					};

					let $accSupermarket = function () {
						if ($supermarketPts !== 0) {
							return ($supermarketPts - $everywherePts) * parseFloat(formData['supermarket']);
						} else {
							return 0;
						}
					};

					let $accUtility = function () {
						if ($utilityPts !== 0) {
							return ($utilityPts - $everywherePts) * parseFloat(formData['utility']);
						} else {
							return 0;
						}
					};

					let $basePoints = $everywherePts * $totalSpend;
					let $acceleratedPoints =
						$accAir() +
						$accCable() +
						$accCar() +
						$accDept() +
						$accDrug() +
						$accEntertain() +
						$accGas() +
						$accHome() +
						$accHotel() +
						$accOffice() +
						$accOnline() +
						$accPhone() +
						$accRestaurant() +
						$accSupermarket() +
						$accUtility();

					// calculate the First Year Rewards and populate to third column in the table
					$(this).find('td:eq(2)').html(
						((($basePoints + $acceleratedPoints) * 12 + // total monthly points are converted to annual points
							$signupBonus) * // the signup bonus points are added
							0.01 - // the total points from spend and signup bonus are converted to Dollars based on 1 pt = $0.01 ratio
							$annualFee) // the annual fee is subtracted to calculate the net economic value of the rewards
							.toFixed(0)
							.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + ' USD'
					);
				});
			}
		});
		setTimeout(function () {
			updateStorage();
		}, 3000);
	});

	// On page load
	$.each(firstYearRewards, function (key, value) {
		$('#' + key).find('td:eq(2)').html(value);
	});
	// console.log(firstYearRewards);

	if (firstYearRewards['msg'] === false) {
		$th.removeClass('d-none');
		$cards.each(function () {
			$(this).find('td:eq(2)').removeClass('d-none');
		});
	}
});

/*		HANDLE SPEND FORM
- Handle messages
*/
$(function () {
	var $submitMsg = $('#submitMsg');
	$('#spendForm').on('submit', function () {
		// hide send form message
		$submitMsg.hide();
		// display form submitted message
		// $('#submittedMsg').show();
		$('#submittedMsg').removeClass('d-none')
		$('#submittedMsg').fadeTo(3000, 500).slideUp(500, function () {
			$('#submittedMsg').slideUp(500);
		});
	});
});

// allow user to close message sooner
$(function () {
	$('#submittedMsgBtn').on('click', function () {
		$('#submittedMsg').hide();
	});
});

// On page load display send form message
$(document).ready(function () {
	$('#submitMsg').show();
});

/*      
		FORMAT INPUTS IN SPEND FORM
*/
$("input[data-type='currency']").on({
	keyup: function () {
		formatCurrency($(this));
	},
	blur: function () {
		formatCurrency($(this), 'blur');
	}
});

function formatNumber(n) {
	// format number 1000000 to 1,234,567
	return n.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function formatCurrency(input, blur) {
	// appends $ to value, validates decimal side
	// and puts cursor back in right position.

	// get input value
	var input_val = input.val();

	// don't validate empty input
	if (input_val === '') {
		return;
	}

	// original length
	var original_len = input_val.length;

	// initial caret position
	var caret_pos = input.prop('selectionStart');

	// check for decimal
	if (input_val.indexOf('.') >= 0) {
		// get position of first decimal
		// this prevents multiple decimals from
		// being entered
		var decimal_pos = input_val.indexOf('.');

		// split number by decimal point
		var left_side = input_val.substring(0, decimal_pos);
		var right_side = input_val.substring(decimal_pos);

		// add commas to left side of number
		left_side = formatNumber(left_side);

		// validate right side
		right_side = formatNumber(right_side);

		// On blur make sure 2 numbers after decimal
		if (blur === 'blur') {
			right_side += '00';
		}

		// Limit decimal to only 2 digits
		right_side = right_side.substring(0, 2);

		// join number by .
		input_val = '$' + left_side + '.' + right_side;
	} else {
		// no decimal entered
		// add commas to number
		// remove all non-digits
		input_val = formatNumber(input_val);
		input_val = '$' + input_val;

		// final formatting
		if (blur === 'blur') {
			input_val += '.00';
		}
	}

	// send updated string to input
	input.val(input_val);

	// put caret back in the right position
	var updated_len = input_val.length;
	caret_pos = updated_len - original_len + caret_pos;
	input[0].setSelectionRange(caret_pos, caret_pos);
}

/*      
	CALC AND DISPLAY TOTAL MONTHLY SPEND IN SPEND FORM
*/
$(function () {
	$('.form-group').on('input', '.prc', function () {
		var totalSum = 0;

		$('.form-group input.prc').each(function () {
			var inputVal = $(this).val().replace(/\$|,/g, '');
			if ($.isNumeric(inputVal)) {
				totalSum += parseFloat(inputVal);
				totalSumFormatted = '$' + totalSum.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
			}
		});
		$('#result').html(`Total monthly spend: ${totalSumFormatted}`);
	});
});

/*
		HIDE/SHOW SPEND FORM CONTAINER
*/
$(document).ready(function () {
	var spendFormValues = JSON.parse(localStorage.getItem('spendFormValues')) || {};
	var $container = $('#spendContainer');
	var $button = $('#form-section-btn');

	function containerHidden() {
		return $container.hasClass('d-none');
	}

	function updateButtonStatus() {
		$button.find('span').text(containerHidden() ? 'Show spend form' : 'Hide spend form');
	}

	function handleButtonClick() {
		containerHidden() ? $container.removeClass('d-none') : $container.attr('class', 'container d-none');
		containerHidden()
			? $button.find('i').addClass('fa-chevron-down').removeClass('fa-chevron-up')
			: $button.find('i').addClass('fa-chevron-up').removeClass('fa-chevron-down');
	}

	function updateStorage() {
		spendFormValues['buttonText'] = $button.text();
		spendFormValues['fasIcon'] = $button.find('i').attr('class');
		spendFormValues['containerState'] = containerHidden();
		localStorage.setItem('spendFormValues', JSON.stringify(spendFormValues));
	}

	$button.on('click', function () {
		handleButtonClick();
		updateButtonStatus();
		updateStorage();
		console.log(spendFormValues);
		console.log($container.attr('class'));
	});

	// On page load
	// if (spendFormValues['containerState'] === true) {
	// 	$container.attr('class', 'container d-none');
	// } else {
	// 	$container.removeClass('d-none');
	// }
	$button.find('span').text(spendFormValues['buttonText']);
	$button.find('i').attr('class', spendFormValues['fasIcon']);
});

/*
		SPINNER WHILE DOM RELOADS
*/
document.onreadystatechange = function () {
	if (document.readyState !== 'complete') {
		document.querySelector('header').style.visibility = 'hidden';
		document.querySelector('main').style.visibility = 'hidden';
		document.querySelector('footer').style.visibility = 'hidden';
		document.querySelector('#loader').style.visibility = 'visible';
	} else {
		document.querySelector('#loader').style.display = 'none';
		document.querySelector('header').style.visibility = 'visible';
		document.querySelector('main').style.visibility = 'visible';
		document.querySelector('footer').style.visibility = 'visible';
	}
};

/*      
		SAVE SPEND FORM VALUES LOCAL STORAGE
*/
$(document).ready(function () {
	var spendFormValues = JSON.parse(localStorage.getItem('spendFormValues')) || {};
	var $inputs = $('#spendForm :text');
	var $button = $('#spendForm button');
	var $result = $('#spendForm p');

	function updateStorage() {
		$inputs.each(function () {
			spendFormValues[this.id] = $(this).val();
		});
		spendFormValues['result'] = $result.html();

		localStorage.setItem('spendFormValues', JSON.stringify(spendFormValues));
	}

	$button.on('click', function () {
		updateStorage();
		console.log(spendFormValues);
	});

	// On page load
	$.each(spendFormValues, function (key, value) {
		$('#' + key).val(value);
	});
	console.log(spendFormValues);
	$result.html(spendFormValues['result']);
});

/*      
		TOGGLE SIDEBAR
*/
$(document).ready(function () {
	$('#sidebarShow').on('click', function () {
		$('.left-column').toggleClass('d-none col-12');
		$('.right-column').toggleClass('col d-none');
	});
});

/*      
		TOGGLE SUMMARY
*/
$(document).ready(function () {
	$('#summaryBtn').on('click', function () {
		$('#paragraph').toggleClass('d-none d-flex');
		$(this).find('i').toggleClass('fa-plus-circle fa-minus-circle');
	});
});

/*      
On page load, check display status of spendContainer
*/
console.log($('#spendContainer').attr('class'));
