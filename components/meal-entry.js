'use strict';

(function () {

  const MEAL_TYPE = {
    'morningSnack': 'LANCHE_MANHA',
    'lunch': 'ALMOCO',
    'afternoonSnack': 'LANCHE_TARDE',
    'dinner': 'JANTAR'
  };


  const MEAL_METHOD = [
    { type: 'BLW', label: 'BLW' },
    { type: 'PARTICIPATIVO', label: 'Participativo' },
    { type: 'TRADICIONAL', label: 'Tradicional' }
  ];

  const MEAL_ACCEPTANCE = [
    { type: 'OTIMO', label: 'Ótimo' },
    { type: 'BOM', label: 'Bom' },
    { type: 'REGULAR', label: 'Regular' },
    { type: 'RECUSOU', label: 'Recusou' }
  ];

  const MEAL_RATING = [
    { type: 'SUCESSO', label: 'Sucesso' },
    { type: 'OK', label: 'Bom' },
    { type: 'CAOS', label: 'Caos' }
  ];

  class MealEntry extends HTMLElement {
    constructor() {
      super();

      const shadow = this.attachShadow({ mode: 'open' });
      const entryContainer = document.createElement('div');

      const linkElem = document.createElement("link");
      linkElem.setAttribute("rel", "stylesheet");
      linkElem.setAttribute("href", "https://res.cloudinary.com/finnhvman/raw/upload/matter/matter-0.2.2.min.css");


      shadow.appendChild(linkElem);

      entryContainer.innerHTML = `
        <style>

          :root {
            font-family: "Roboto", sans-serif;
            --app-primary-color: #3F51B5;
            --app-dark-primary-color: #303F9F;
            --app-primary-text: #212121;
            --app-text: #FFFFFF;
            --app-accent: #b53f51;
        
            --matter-theme-rgb: 48, 63, 159;
            --matter-primary-rgb: 63, 81, 181;
            --matter-onprimary-rgb: 255, 255, 255;
            --matter-onsurface-rgb: 48, 63, 159;
          }
          h4{
            color:var(--app-dark-primary-color);
          }

          .form{
            padding-left:20px;
            margin-bottom: 15px;
          }
        </style>

        <div class="form">
            
            <h4>Método</h4>

            ${MEAL_METHOD.map(item => `
            <div> 
              <label class="matter-radio">
                <input type="radio" id="${item.type}" class="editable" name="metodo" value="${item.type}" />
                <span>${item.label}</span>
              </label>
            </div>
          `).join('')}


            
            <h4>Aceitação</h4>

            ${MEAL_ACCEPTANCE.map(item => `
            <div>
              <label class="matter-radio">
                <input type="radio" id="${item.type}" class="editable" name="aceitacao" value="${item.type}" />
                <span>${item.label}</span>
              </label>
            </div>
          `).join('')}


            
            <h4>Avaliação Geral</h4>

            ${MEAL_RATING.map(item => `
            <div>
              <label class="matter-radio">
                <input type="radio" id="${item.type}" class="editable" name="avaliacao" value="${item.type}" />
                <span>${item.label}</span>
              </label>
              
            </div>
          `).join('')}


          <div>
            <h4>Comentários</h4>
            <label class="matter-textfield-filled">
              <textarea id="comments" name="comentarios" class="editable" rows="5" cols="60"></textarea>
            </label>
            
          </div>
        
        
        
        </div>
      
      
      
      `;

      shadow.appendChild(entryContainer);
    }


    get meal() {
      return MEAL_TYPE[this.getAttribute('meal')] || 'LANCHE_MANHA';
    }


    getData() {

      let data = {};

      const radioElements = this.shadowRoot.querySelectorAll('input[type="radio"]:checked');
      const commentsElement = this.shadowRoot.querySelectorAll('textarea');

      const elements = [...radioElements, ...commentsElement];

      elements.forEach(element => {
        data[element.name] = element.value;
      });

      return data;



    }

    setData(data) {

      for (let attr of Object.keys(data)) {
        let value = data[attr];

        let element = this.shadowRoot.querySelector(`input[name=${attr}][value=${value}]`);
        if (element !== null) {
          element.checked = true;
        }

        let textElement = this.shadowRoot.querySelector(`textarea[name=${attr}]`);
        if (textElement !== null) {
          textElement.value = value;
        }
      }

    }

    resetData() {
      const radioElements = this.shadowRoot.querySelectorAll('input[type="radio"]:checked');
      const commentsElement = this.shadowRoot.querySelectorAll('textarea');

      for (let element of radioElements) {
        element.checked = false;
      }

      for (let element of commentsElement) {
        element.value = '';
      }

    }

    


  }

  customElements.define('meal-entry', MealEntry);
})();