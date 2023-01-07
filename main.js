let csv
let mainPY
let pyodide
let headers = document.getElementById('headers');
let output = document.getElementById('output');
let inputBtn = document.getElementById('inputbtn');
let downloadBtn = document.getElementById('downloadbtn');
let editbtn = document.getElementById('editbtn');
let fileName = document.getElementById('fileName');

let openCSV = (e) => {
    let input = e.target;
  
    let reader = new FileReader();
    reader.onload = function() {
      let text = reader.result;
      csv = text;
      pyodide.runPython('csv = """'+csv+'"""');
      pyodide.runPython(mainPY);
      
      let e = pyodide.runPython('failed')
      if(!e){
        csv = pyodide.runPython('df.to_csv(index=False, float_format="%.2f")').split('\n');
        headers.innerText = csv[0]
        let temp = '';
        for(let i = 1; i < csv.length; i++){
            temp += csv[i]+'\n'
        }
        csv = temp.slice(0, -1);
        output.innerText = csv

        downloadBtn.style.visibility = 'visible';
        editbtn.style.visibility = 'visible';
      } else {
        output.innerText = csv+"\nError reading file, please double check that you chose the right file and try again.\n"+e
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
    fileName.value = new Date().toLocaleDateString().replaceAll('/', '-');
    console.log('Loaded')

    output.innerText = ''
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