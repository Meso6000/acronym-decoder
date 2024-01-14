var parts = document.getElementsByTagName('*');
var localAcrynoms = {
    Acronym: "full definition"
}

// get paragraph
// split paragraph into words using space separator
// search words for (XXXX) format
// if found, move backward the number of words that match the acrynom
// sanity check the words and acrynom
// save acrynom + words into dictionary

for (let i = 0; i < parts.length; i++){
    let part = parts[i];

    // for (let j = 0; j < part.childNodes.length; j++){

        let text = part.innerText.toLowerCase();
        text = text.replace(/(\r\n|\n|\r|\t)/gm, " "); // replace new lines and tabs with spaces
        let words = text.split(" ");
        words = words.filter(word => word !== ""); // remove empty strings

        if(words.length < 3){
            continue;
        }
        console.log(words);

        for (let k = 0; k < words.length; k++){
            if (words[k].includes("(") && words[k].includes(")")){ //found acrynom candidate
                var acronym = words[k].replace("(", "").replace(")", "").replace(".", "").replace(",", ""); // remove the brackets
                let numberOfLetters = acronym.length; 

                if ((k - numberOfLetters) < 0){ // avoid negative array elements, go to next acrynom candidate
                    acronym = "";
                    numberOfLetters = 0;
                    continue;
                }

                var acronymDef = "";
                //for as many letters in acrynom
                for (let index = 0; index < numberOfLetters; index++) {
                    var letter = acronym[index];
                    var firstLetter = words[k - numberOfLetters + index][0];
                    //check if the letter is the same as the first letter in the word preceeding the acrynom
                    if(letter.toLowerCase() !== firstLetter.toLowerCase()){
                        acronymDef = "";
                        break;
                    }
                    else{
                        //capitalize each word of the definition
                        words[k - numberOfLetters + index] = words[k - numberOfLetters + index][0].toUpperCase() + words[k - numberOfLetters + index].substr(1);
                        acronymDef += (words[k - numberOfLetters + index] + " ");
                    }
                    
                }
                //if the acrynom is valid, add it to the dictionary
                if (acronymDef !== ""){
                    localAcrynoms[acronym.toUpperCase()] = acronymDef;
                }
            }
        };
        
   // }
}

for (let i = 0; i < parts.length; i++){
    let part = parts[i];

    for (let j = 0; j < part.childNodes.length; j++){
        let node = part.childNodes[j];

        if (node.nodeType === 3){
            for (const [key, value] of Object.entries(localAcrynoms)) {
                var text = node.nodeValue;
                var replacedText = text.replaceAll(key, value +"** ");
                //var replacedText = text.replace('Logo', Object.keys(localAcrynoms));
                if (replacedText !== text) {
                    part.replaceChild(document.createTextNode(replacedText), node);
                }
            }
            // var replacedText = text.replace('all', Object.keys(localAcrynoms));
            // if (replacedText !== text) {
            //     part.replaceChild(document.createTextNode(replacedText), node);
            // }
        }
    }
}