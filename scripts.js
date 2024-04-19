
const expandSVGIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>chevron-down</title><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" /></svg>';

const collapseSVGIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>chevron-up</title><path d="M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z" /></svg>';

const MEAL_TYPE = {
    'morningSnack': 'LANCHE_MANHA',
    'lunch': 'ALMOCO',
    'afternoonSnack': 'LANCHE_TARDE',
    'dinner': 'JANTAR'
};

const TIPO_REFEICAO = {
    'LANCHE_MANHA': 'morningSnack',
    'ALMOCO': 'lunch',
    'LANCHE_TARDE': 'afternoonSnack',
    'JANTAR': 'dinner'
};

let mode = "INSERT";

// Buscar lista de registros cadastrados no banco e preenche a tabela
const getEntriesForList = () => {

    let url = 'http://127.0.0.1:5000/listar_diarios';
    fetch(url, {
        method: 'get',
    })
        .then((response) => response.json())
        .then((data) => {
            data["diarios"].forEach(entry => {
                let entryData = {};
                let date = new Date(entry.data_registro);
                date = date.toISOString();
                date = date.toString().substring(0, 10)

                entryData.date = date;
                entryData.mealIdx = entry.refeicoes.reduce((acc, item) => {
                    acc[item.tipo] = item;
                    return acc;
                }, {});

                addEntryToList(entryData)


            })
        })
        .catch((error) => {
            console.error('Error:', error);
        });

}

getEntriesForList();


// Criar listeners para os inputs do tipo checkbox
const setUpMealListeners = () => {

    const elements = document.querySelectorAll('input[type="checkbox"]');

    elements.forEach(element => {
        element.addEventListener('change', (event) => {
            processSelectedMeal(event.target);

        });
    })


}


setUpMealListeners();


// Ajusta a visibilidade de botoes para as refeicoes selecionadas
const processSelectedMeal = (element) => {

    let meal = element.getAttribute('name');
    let mealElement = document.getElementById(`${meal}Entry`);

    if (mealElement === null) {
        return;
    }

    let hideShowBtn = document.getElementById(`${meal}HideShowBtn`);
    let clearBtn = document.getElementById(`${meal}ResetBtn`);

    if (element.checked) {
        mealElement.removeAttribute('hidden');
        clearBtn.removeAttribute("hidden");
        hideShowBtn.removeAttribute("hidden");
        hideShowBtn.innerHTML = '<i class="fa fa-angle-up">';
    } else {
        mealElement.setAttribute('hidden', null);
        clearBtn.setAttribute("hidden", null);
        hideShowBtn.setAttribute("hidden", null);
        hideShowBtn.innerHTML = '<i class="fa fa-angle-down">';

        mealElement.resetData();

    }

}

//exibe o formulario de novo registro e esconde a tabela e o botao de adicionar novo registro
const showEntryForm = () => {

    let newEntryContainer = document.getElementById('newEntryContainer');
    newEntryContainer.removeAttribute('hidden');

    let tableContainer = document.getElementById('tableContainer');
    tableContainer.setAttribute('hidden', null);

    let btnContainer = document.getElementById('btnContainer');
    btnContainer.setAttribute('hidden', null);

}


// toggle do atributo hidden
const toggleHiddenAttr = (target) => {

    let meal = target.getAttribute('meal');
    doToggleAttributeForMealElement(meal);


}

const doToggleAttributeForMealElement = (meal) => {

    let entryElement = document.getElementById(`${meal}Entry`);
    let toggleBtn = document.getElementById(`${meal}HideShowBtn`)

    if (entryElement != null) {
        entryElement.toggleAttribute("hidden");
        toggleBtn.innerHTML = toggleBtn.innerHTML.includes('angle-up') ? '<i class="fa fa-angle-down">' : '<i class="fa fa-angle-down">';
    } else {
        throw new Error('Elemento não encontrado')
    }

}

// Seção com metodos para esconder/exibir botões
const hideButtons = (meal) => {

    let hideBtn = document.getElementById(`${meal}HideShowBtn`);
    hideBtn.setAttribute('hidden', null);

    let resetBtn = document.getElementById(`${meal}ResetBtn`);
    resetBtn.setAttribute('hidden', null);

}

const showButtons = (meal) => {

    let hideBtn = document.getElementById(`${meal}HideShowBtn`);
    hideBtn.removeAttribute('hidden');

    let resetBtn = document.getElementById(`${meal}ResetBtn`);
    resetBtn.removeAttribute('hidden');

}

//Limpa os dados do form, esconde o form e exibe a lista e o botão de inserção de novo registro
const resetForm = () => {

    let entryDateElement = document.getElementById('entryDate');
    entryDateElement.value = '';
    entryDateElement.removeAttribute("disabled");

    document.querySelectorAll('meal-entry')
        .forEach(element => element.resetData());

    document.querySelectorAll('input[type="checkbox"]')
        .forEach(element => {
            if (element.checked) {
                doToggleAttributeForMealElement(element.getAttribute('name'))
                hideButtons(element.getAttribute('name'));
            }

            element.checked = false
        });

    let tableContainer = document.getElementById('tableContainer');
    tableContainer.removeAttribute('hidden');

    let btnContainer = document.getElementById('btnContainer');
    btnContainer.removeAttribute('hidden');

    let newEntryContainer = document.getElementById('newEntryContainer');
    newEntryContainer.setAttribute('hidden', null);

}

//Insere no formulário os dados provenientes do banco de dados
const setFormData = (entryData) => {
    document.getElementById('entryDate').value = entryData.date;

    for (let meal of Object.keys(entryData.mealIdx)) {

        let mealData = entryData.mealIdx[meal];
        let mealType = TIPO_REFEICAO[meal]

        doToggleAttributeForMealElement(mealType);
        showButtons(mealType);

        let mealCheckBox = document.getElementById(`${mealType}Check`);
        mealCheckBox.checked = true;


        let mealElement = document.getElementById(`${mealType}Entry`);
        mealElement.setData(mealData);

    }

}

//Seção com métodos para criar botões programaticamente
const insertRemoveButton = (parent, date) => {
    let removeBtn = document.createElement("button");
    removeBtn.setAttribute('date', date);
    removeBtn.classList.add('icon-button','matter-button-contained');
    removeBtn.innerHTML = '<i class="fa fa-trash">';
    parent.appendChild(removeBtn);

    removeBtn.onclick = () => removeEntryFromList(date);

}

const insertEditButton = (parent, date) => {

    let editBtn = document.createElement("button");
    editBtn.setAttribute('date', date);
    editBtn.classList.add('icon-button','matter-button-contained');
    editBtn.innerHTML = '<i class="fa fa-edit">';
    parent.appendChild(editBtn);

    editBtn.onclick = () => editEntryFromList(date);
}


//Método para limpar os campos do formulário
const resetMealData = (target) => {
    let meal = target.getAttribute('meal');

    let entryElement = document.getElementById(`${meal}Entry`);

    if (entryElement != null) {
        entryElement.resetData();
    } else {
        throw new Error('Elemento não encontrado')
    }
}

//Método para executar o commit das operações realizadas no formulário
const commitOperation = () => {
    let entryData = processEntry();
    if(entryData === undefined){
        return;
    }
    addEntryToList(entryData);
    postEntry(entryData);
    resetForm();

}
//Metodo para processar os dados inseridos no formulario
const processEntry = () => {

    const entry_date = document.getElementById('entryDate').value;


    if(!entry_date){
        alert("A data é obrigatória!");
    }


    let data = {};
    data["date"] = entry_date;


    let mealIdx = {};
    let hasMeal = false;

    document.querySelectorAll('input[type="checkbox"]')
        .forEach(element => {
            if (element.checked) {
                hasMeal = true;

                let mealName = element.getAttribute("name");
                let mealElement = document.getElementById(`${mealName}Entry`);

                let meal = {
                    'tipo': MEAL_TYPE[mealName],
                    ...mealElement.getData()
                };

                mealIdx[MEAL_TYPE[mealName]] = meal;
            }

        });

    if (!hasMeal) {
        alert("É preciso inserir uma refeição!");
        return;
    }

    data["mealIdx"] = mealIdx

    return data;

}



//Seção com metodos que realizam operaões de inserção e remoção de itens da lista

const addEntryToList = (entryData) => {

    let meals = ["LANCHE_MANHA", "ALMOCO", "LANCHE_TARDE", "JANTAR"];
    let mealIdx = entryData["mealIdx"];
    let date = entryData["date"]

    let table = document.getElementById('table');

    if (mode === "EDIT") {
        let row = document.getElementById(`${date}_Row`);
        row.remove();
    }

    let row = table.insertRow();
    row.id = `${date}_Row`;
    insertRemoveButton(row.insertCell(-1), date)
    insertEditButton(row.insertCell(-1), date);
    

    let cell = row.insertCell(0);
    cell.textContent = date;



    for (let i = 1; i <= meals.length; i++) {

        let cell = row.insertCell(i);
        if (mealIdx[meals[i - 1]] !== undefined) {
            cell.textContent = "OK";
        } else {
            cell.textContent = "-";
        }
    }

}

const removeEntryFromList = (entryDate) => {

    let row = document.getElementById(`${entryDate}_Row`);

    if (confirm("Deseja remover o registro?")) {
        row.remove();
        removeEntry(entryDate);
    }

}

// Seção com metodos que fazem requisições http

const editEntryFromList = (entryDate) => {



    let url = `http://127.0.0.1:5000/buscar_diario?data_registro=${entryDate}`;
    fetch(url, {
        method: 'get',
    })
        .then((response) => response.json())
        .then((data) => {
            let entryData = {};
            let date = new Date(data.data_registro);
            date = date.toISOString();
            date = date.toString().substring(0, 10);
            entryData.date = date;

            entryData.date = date;
            entryData.mealIdx = data.refeicoes.reduce((acc, item) => {
                acc[item.tipo] = item;
                return acc;
            }, {});

            mode = "EDIT";

            showEntryForm();
            setFormData(entryData);
            

            let entryDateElement = document.getElementById('entryDate');
            entryDateElement.setAttribute("disabled", null);


        })
        .catch((error) => {
            console.error('Error:', error);
        });


}

const postEntry = (entry) => {

    let data = {
        "data_registro": entry["date"],
        "refeicoes": Object.values(entry["mealIdx"])
    }

    let url = 'http://127.0.0.1:5000/inserir_diario';

    if(mode === "EDIT"){
        url = 'http://127.0.0.1:5000/editar_diario';
    }

    
    fetch(url, {
        method: 'post',
        body:  JSON.stringify(data),
        headers: { "Content-type": "application/json; charset=UTF-8" }
    })
        .then((response) =>  response.json())
        .then((data) => console.log(data))
        .catch((error) => {
            console.error('Error:', error);
        });

}

const removeEntry = (entryDate) => {
    let url = `http://127.0.0.1:5000/deletar_diario?data_registro=${entryDate}`;
    fetch(url, {
        method: 'delete'
    })
        .then((response) => response.json())
        .catch((error) => {
            console.error('Error:', error);
        });
}