
let csv
let mainPY
let pyodide
let node = document.getElementById('output');
let inputBtn = document.getElementById('inputbtn');
let downloadBtn = document.getElementById('downloadbtn');

let openCSV = (e) => {
    let input = e.target;
  
    let reader = new FileReader();
    reader.onload = function() {
      let text = reader.result;
      csv = text;
      pyodide.runPython('csv = """'+csv+'"""');
      pyodide.runPython(mainPY);

      if(!pyodide.runPython('failed')){
        csv = pyodide.runPython('df.to_csv(header=None,index=False)');
        node.innerText = csv

        downloadBtn.style.visibility = 'visible';
      } else {
        node.innerText = "Error reading file, please double check that you chose the right file and try again."
        inputBtn.style.visibility = 'visible'
      }
      
    };
    reader.readAsText(input.files[0]);
}

const openText = async (file) => {
    const response = await fetch(file)
    const text = await response.text()
    return(text)
}

const main = async () => {
    pyodide = await loadPyodide();

    await pyodide.loadPackage(["pandas", "pyparsing"]);
    pyodide.runPython(`
        import pandas as pd
        import pyparsing as pp
    `)

    mainPY = await openText('main.py')
    console.log('Loaded')

    node.innerText = ''
    inputBtn.style.visibility = 'visible';
    
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
}

main();