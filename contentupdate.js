var parts = document.getElementsByTagName('*');
var localAcrynoms = {}

for (let i = 0; i < parts.length; i++){
    let part = parts[i];
    let text = part.innerText;

    if (text === undefined){
        continue;
    }

    text = text.replace(/(\r\n|\n|\r|\t)/gm, " "); // replace new lines and tabs with spaces
    let words = text.split(" ");
    words = words.filter(word => word !== ""); // remove empty strings
    
    if(words.length < 3){
        continue;
    }

    for (let j = 0; j < words.length; j++){
        if (words[j].includes("(") && words[j].includes(")")){ //found acrynom candidate
            var acronym = words[j].replace("(", "").replace(")", "").replace(".", "").replace(",", ""); // remove the brackets
            let numberOfLetters = acronym.length; 
            
            if ((j - numberOfLetters) < 0){ // avoid negative array elements, go to next acrynom candidate
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
                localAcrynoms[acronym.toUpperCase()] = acronymDef;
            }
        }
    };
        
}

for (let i = 0; i < parts.length; i++){
    let part = parts[i];

    for (let j = 0; j < part.childNodes.length; j++){
        let node = part.childNodes[j];

        if (node.nodeType === 3){
            if (node.nodeValue === undefined){
                continue;
            }
            for (const [key, value] of Object.entries(localAcrynoms)) {
                let text = node.nodeValue;
                var replacedText = text;
                if(text.includes("(" + key + ")")){
                    replacedText = text.replaceAll(key, value).replace("(" + value, "(" + key);
                }else if(text.includes(key)){
                    replacedText = text.replaceAll(key, value);
                }
                if (replacedText !== text) {
                    if(part.contains(node)){
                        part.replaceChild(document.createTextNode(replacedText), node);
                    }
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