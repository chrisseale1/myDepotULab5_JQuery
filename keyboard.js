$(document).ready(function(){
    $('#keyboard-upper-container').hide();
	var sentence, time;
    var errors = 0;
    var sentenceIndex = 0, letterIndex = 0;	
	var sentences = ['ten ate neite ate nee enet ite ate inet ent eate', 'Too ato too nOt enot one totA not anot tOO aNot', 'oat itain oat tain nate eate tea anne inant nean', 'itant eate anot eat nato inate eat anot tain eat', 'nee ene ate ite tent tiet ent ine ene ete ene ate'];
	
    function setWordText(event) {
		if(sentenceIndex < sentences.length){
            // We still have sentences left. Swap in a new sentence and set things up
            sentence = sentences[sentenceIndex];
            letterIndex = 0; // Reset back to the first letter. This is a new sentence.
            sentenceIndex++; // Go ahead and increment the sentenceIndex so it will be advanced the next time this function is called.
			$('#words').text(sentence); // Put the current sentence onto the page
            setNextLetterDiv(sentence[letterIndex]); // Display the next letter that should be typed
            
            // We need to get a count of the errors
            // So will count the number of Xs in the #words-typed element
            var numErrors = $("#words-typed").find("span.glyphicon-remove").length;
			errors += numErrors; // Add the number of errors to the running sum stored in the errors variable
            // errors = errors + numErrors;

            // Empty out the words-typed element, since we are starting a new sentence
			$('#words-typed').empty();
            
            // Stops any queued animations
			$( "#block" ).stop(true, true).animate({ "left": "15px" });
		} else {
            // We are finished with our sentences.
            //Call the calculateWPM function and pass on the event we received, for timing purposes
			var wpm = calculateWPM(event);
            displayScore(wpm);
            askToPlayAgain();
		}
	};
	
    // Call the function declared above for initial setup. It will be called at a later time from elsewhere in our program.
	setWordText();
	
    // Determines the amount of time that has passed between when we first started and now
    // Determines the WPM based on this time and number of errors.
	function calculateWPM(event) {
		time = event.timeStamp - time;
		var mistakes = errors;
		var numberOfWords = 54;
		var minutes = (time/1000)/60;
		var wpm = Math.floor(numberOfWords/minutes - (mistakes * 2));

		return wpm;
	};
	
	function displayScore(wpm) {
		var message;
		if(parseInt(wpm) < 0) {
				message = 'Yikes there were a lot of mistakes!';
		} else {
			message = 'You typed ' + wpm + ' words per minute!';
		}
		$('#message').html(message).css({'font-size': '44px'});
	};
	
	function askToPlayAgain() {
		setTimeout(function() { // Built into JS. "Execute this function, this many milliseconds from now"
			if(confirm('Would you like to play again?')) {
                // They want to play again.
                // Reset sentence index to 0 (first sentence)
				sentenceIndex = 0;
                
                // Set the time variable to undefined so it will be recalculated on next key press
                time = undefined;
                
                // Remove the WPM message from the screen
                $('#message').empty();
                
                // Call our setup function, setWordText()
                setWordText();
			}
		}, 5000); // 5000ms = 5 seconds
	}
	
	function setNextLetterDiv(letter) {
		$('#next-letter').text(letter);	
	}
	
	function moveYellowBlock() {
		$( "#block" ).animate({ "left": "+=17.5px" }, 'fast');
    }
	
	$(document).on('keydown', function(e) {
		if (e.shiftKey) {
			$('#keyboard-upper-container').show();
			$('#keyboard-lower-container').hide();
        }
	});
    
	$(document).on('keyup', function(e) {
        $('#keyboard-upper-container').hide();
        $('#keyboard-lower-container').show();
		$('.key').css({'background-color': '#f5f5f5', 'color': '#000'});
	});
	
	$(document).on('keypress', function(e) {
		if(!time) { // if the global time variable is undefined, set the time (this must be the first key press)
			time = e.timeStamp;
		}
		
        // Get the ASCII code of the typed character
		var typedLetterCode = e.keyCode;
        
        // Compare the code for the typed character with the code for the current letter
		if(typedLetterCode === sentence[letterIndex].charCodeAt()) {
            // Matched. Add a check
			$('#words-typed').append($('<span class="glyphicon glyphicon-ok"></span>'));	
		} else {
            // Did not match. Add an X.
			$('#words-typed').append($('<span class="glyphicon glyphicon-remove"></span>'));	
		}
        // Increment the letter index (move on to the next letter in the sentence)
		letterIndex++;
		if (letterIndex < sentence.length) { // Still letters remaining in current sentence
			moveYellowBlock();
            setNextLetterDiv(sentence[letterIndex]);
		} else { // End of the sentence. Call our setWordText setup function
            setWordText(e); // Finishing things up for this sentence
		}
		
		var selector = '#' + typedLetterCode;
		
		$(selector).css({'background-color': '#38B0DE', 'color': '#fff'});
	});
	
});