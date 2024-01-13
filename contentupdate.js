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

//scan page for acronyms looking for

for (let i = 0; i < parts.length; i++){
    var part = parts[i];
    for (let j = 0; j < part.childNodes.length; j++){
        let node = part.childNodes[j];
        if (node.nodeType === 3){
            var text = node.nodeValue;
            var replacedText = text.replace(/Google/gi, 'Gbuddy');

            if (replacedText !== text) {
                part.replaceChild(document.createTextNode(replacedText), node);
            }
            var words = text.split(" ");
        }
    }
}