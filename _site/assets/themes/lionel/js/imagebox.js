$(document).ready(function(){
						   		   
	//When you click on a link with class of poplight and the href starts with a # 
	$('a.poplight[href^=#]').click(function() {
		var popID = $(this).attr('rel'); //Get Popup Name
		var popURL = $(this).attr('href'); //Get Popup href to define size
		console.log(popID);
                console.log(popURL);		
		//Pull Query & Variables from href URL
		var query= popURL.split('?');
console.log(query);
		var dim= query[1].split('&');
console.log(dim);
		var popWidth = dim[0].split('=')[1]; //Gets the first query string value
console.log(popWidth); 
		//Fade in the Popup and add close button
		$('#' + popID).fadeIn().css({}).prepend('<a href="#" class="close1"><img src="images/close_pop.png" class="btn_close" title="Close Window" alt="Close" /></a>');
		
		//Define margin for center alignment (vertical + horizontal) - we add 80 to the height/width to accomodate for the padding + border width defined in the css
		var popMargTop = ($('#' + popID).height() + 80) / 2;
		var popMargLeft = ($('#' + popID).width() + 80) / 2;
console.log(popMargTop);
console.log(popMargLeft);
console.log('1');
		//Apply Margin to Popup
		$('#' + popID).css({ 
			'margin-top' : -popMargTop,
			'margin-left' : -popMargLeft
		});
		
		//Fade in Background
		$('body').append('<div id="fade"></div>'); //Add the fade layer to bottom of the body tag.
		$('#fade').css({'filter' : 'alpha(opacity=80)'}).fadeIn(); //Fade in the fade layer 
		
		return false;
	});
	
	
	//Close Popups and Fade Layer
	$('a.close1, #fade').live('click', function() { //When clicking on the close or fade layer...
	  	$('#fade , .popup_block').fadeOut(function() {
			$('#fade, a.close1').remove();  
	}); //fade them both out
	console.log('2');	
		return false;
	});

	
});
