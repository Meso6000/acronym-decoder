let parts = document.getElementsByTagName('*');
let localAcrynoms = {
    Acronym: "full definition"
}

// get paragraph
// split paragraph into words using space separator
// search words for (XXXX) format
// if found, move backward the number of words that match the acrynom
// sanity check the words and acrynom
// save acrynom + words into dictionary

for (let i = 0; i < parts.length; i++){
    var part = parts[i];

    for (let j = 0; j < part.childNodes.length; j++){
        let node = part.childNodes[j];

        if (node.nodeType === 3){
            var text = node.nodeValue;
            var words = text.split(" ");
            let reading = false;
            let number = 0;
            let acrynomReading = 0

            for (let k = 0; k < words.length; k++){
                if (words[k].includes("(")){
                    reading = true;
                    acrynomReading = k;
                    number++;
                }
                else if(words[k].includes(")")){
                    reading = false;
                    acronymDef = ""

                    for (let l = k - number; l <= k; l++){
                        acronymDef += words[l];
                    }
                    
                    localAcrynoms[words[acrynomReading]] = acronymDef;
                    acrynomReading = "";
                    number = 0;
                }
                else if (reading){
                    number++;
                }
            };
            
            var replacedText = text.replace(/Google/gi, 'Gbuddy');
            replacedText += number;
            if (replacedText !== text) {
                part.replaceChild(document.createTextNode(replacedText), node);
            }
        }
    }
}