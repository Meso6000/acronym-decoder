(function() {
    var elements = document.getElementsByTagName('*');
    var localAcronyms = {}
    // Words to skip when matching acronyms
    const skipWords = ["for", "to", "of", "and", "the", "in", "on", "at", "by", "with"];

    for (let i = 0; i < elements.length; i++){
        let part = elements[i];
        let text = part.innerText;

        if (text === undefined){
            continue;
        }

        text = text.replace(/(\r\n|\n|\r|\t)/gm, " ");
        let words = text.split(" ");

        // remove empty strings
        words = words.filter(word => word !== "");
        if(words.length < 3){
            continue;
        }

        for (let j = 0; j < words.length; j++){
            if (words[j].includes("(") && words[j].includes(")")){ //found acronym candidate
                var acronym = words[j].replace(/[().,]/g, ""); // remove the brackets and punctation
                if (acronym.match(/\d+/g) || localAcronyms[acronym.toUpperCase()]){ // if we have a number or already have seen it
                    continue;
                }

                let numberOfLetters = acronym.length;
                if ((j - numberOfLetters) < 0){ // avoid negative array elements, go to next acronym candidate
                    continue;
                }

                // Step 1: Find the start of the acronym definition by looping backwards
                let start = j;
                let matchedLetters = acronym.length - 1;

                // Loop backwards to find the first letter match in the acronym
                while (matchedLetters >= 0 && start >= 0 && start >= j - 15) { //15 is max we search backwards
                    const word = words[start].toLowerCase();

                    if (!skipWords.includes(word) && words[start][0] === acronym[matchedLetters]) {
                        matchedLetters--;
                    }
                    start--;
                }

                // Step 2: Build the definition by stepping forward and matching letters
                start++; // Adjust to point to the first word of the definition
                matchedLetters = 0;
                var acronymDef = "";

                for (let i = start; i < j; i++) {
                    let word = words[i];

                    // Always add skip words to the definition
                    if (skipWords.includes(word.toLowerCase())) {
                        acronymDef += word + " ";
                        continue;
                    }

                    // Match acronym letters with non-skip words
                    if (acronym[matchedLetters] === word[0]) {
                        // Capitalize each matching word and add to the definition
                        words[i] = word[0].toUpperCase() + word.substr(1);
                        acronymDef += words[i] + " ";
                        matchedLetters++;
                    } else {
                        // Failed to match, reset the definition
                        acronymDef = "";
                        break;
                    }
                }

                //if the acrynom is valid, add it to the dictionary
                if (acronymDef !== ""){
                    // Remove trailing space
                    acronymDef = acronymDef.trim();
                    localAcronyms[acronym.toUpperCase()] = acronymDef;
                }
            }
        }
    }

    for (let i = 0; i < elements.length; i++){
        let part = elements[i];

        for (let j = 0; j < part.childNodes.length; j++){
            let node = part.childNodes[j];

            if (node.nodeType === 3 && node.nodeValue !== undefined){
                let text = node.nodeValue;
                var replacedText = text;

                for (const [key, value] of Object.entries(localAcronyms)) {
                    if(text.includes("(" + key + ")")){
                        //this is the first initial definition, keep the acronym here
                        continue;
                    }else if(text.includes(" "+ key)){
                        replacedText = text.replaceAll(key, value);
                    }
                }

                // only replace full text if any acronyms were detected and replaced
                if (replacedText !== text) {
                    if(part.contains(node)){
                        part.replaceChild(document.createTextNode(replacedText), node);
                    }
                }
            }
        }
    }
    // console.log(localAcronyms);
})();