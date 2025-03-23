var elements = document.getElementsByTagName('*');
var localAcronyms = {}

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
            let numberOfLetters = acronym.length; 
            
            if ((j - numberOfLetters) < 0){ // avoid negative array elements, go to next acronym candidate
                acronym = "";
                numberOfLetters = 0;
                continue;
            }
            var acronymDef = "";
            
            //for as many letters in acrynom
            for (let index = 0; index < numberOfLetters; index++) {
                var letter = acronym[index];
                var firstLetter = words[j - numberOfLetters + index][0];
                //check if the letter is the same as the first letter in the word preceeding the acrynom
                if(letter.toLowerCase() !== firstLetter.toLowerCase()){
                    acronymDef = "";
                    break;
                }
                else{
                    //capitalize each word of the definition
                    words[j - numberOfLetters + index] = words[j - numberOfLetters + index][0].toUpperCase() + words[j - numberOfLetters + index].substr(1);
                    acronymDef += (words[j - numberOfLetters + index] + " ");
                }
                
            }
           
            //if the acrynom is valid, add it to the dictionary
            if (acronymDef !== ""){
                localAcronyms[acronym.toUpperCase()] = acronymDef;
            }
        }
    };
        
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
                    replacedText = text.replaceAll(key, value).replace("(" + value, "(" + key);
                }else if(text.includes(key)){
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
chrome.runtime.sendMessage({ update: true })
// (async () => {
//     const response = await chrome.runtime.sendMessage({greeting: "hello"});
//     // do something with response here, not outside the function
//     console.log(response);
// })();
// console.log(localAcrynoms);