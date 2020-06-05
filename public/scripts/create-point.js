let selectedItems = []

const itemsToCollect = document.querySelectorAll(".items-grid li")
const collectedItems = document.querySelector("input[name=items]")

function populateUFs() {
    const ufSelect = document.querySelector("select[name=uf]")

    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
        .then(res =>  res.json() )
        .then( states => {
            for ( const state of states ) {
                ufSelect.innerHTML += `<option value=${state.id}> ${state.nome} </option>`
            }
        })
}

populateUFs();

function getCities(event) {
    const citiesSelect = document.querySelector("select[name=city]")
    const stateInput = document.querySelector("[name=state]")
    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${event.target.value}/municipios`

    stateInput.value = event.target.options[event.target.selectedIndex].text

    citiesSelect.innerHTML = "<option> Selecione a Cidade </option>"
    citiesSelect.disabled = true

    fetch(url)
        .then(res => res.json())
        .then(cities => {
            for (const city of cities) {
                citiesSelect.innerHTML += `<option value=${city.id}> ${city.nome} </option>`
            }
        })
    
    citiesSelect.disabled = false
}

function handleSelectedItem(evt) {
    const itemLi = event.target

    itemLi.classList.toggle("selected")

    const itemId = itemLi.dataset.id

    console.log(itemId)

    const alreadySelected = selectedItems.findIndex(item => item === itemId)

    if (alreadySelected != -1) {
        selectedItems = selectedItems.filter(item => {
            return item != itemId
        })
    } else {
        selectedItems.push(itemId)
    }

    collectedItems.value = selectedItems
}

for (const item of itemsToCollect) {
    item.addEventListener("click", handleSelectedItem)
}

document
    .querySelector("select[name=uf]")
    .addEventListener("change", getCities)