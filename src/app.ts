const itemsContainer = document.querySelectorAll('.items-container') as NodeListOf<HTMLDivElement>

let actualContainer: HTMLDivElement,
    actualBtn: HTMLButtonElement,
    actualUl: HTMLUListElement,
    actualForm: HTMLFormElement,
    actualTextInput: HTMLInputElement,
    actualValidation: HTMLSpanElement

const handleContainerDeletion = (e: MouseEvent) => {
    const btn = e.target as HTMLButtonElement
    const btnsArray = [...document.querySelectorAll('.delete-container-btn')] as HTMLButtonElement[]
    const containers = [...document.querySelectorAll('.items-container')] as HTMLDivElement[]
    containers[btnsArray.indexOf(btn)].remove()
}

const deleteBtnListeners = (btn: HTMLButtonElement) => {
    btn.addEventListener('click', handleContainerDeletion)
}

let dragSrcEl: HTMLElement
function handleDragStart (this: HTMLElement, e: DragEvent) {
    e.stopPropagation()

    if (actualContainer) toggleForm(actualBtn, actualForm, false)

    dragSrcEl = this
    e.dataTransfer?.setData('text/html', this.innerHTML)
}

function handleDragOver (e: DragEvent) {
    e.preventDefault()
}

function handleDragDrop(this: HTMLElement, e: DragEvent) {
    e.stopPropagation()
    const receptionEl = this

    if (dragSrcEl.nodeName === 'LI' && receptionEl.classList.contains('items-container')) {
        (receptionEl.querySelector('ul') as HTMLUListElement).appendChild(dragSrcEl)
        addDDListeners(dragSrcEl)
        handleItemDeletion(dragSrcEl.querySelector('button') as HTMLButtonElement)
    }

    if (dragSrcEl !== this && this.classList[0] === dragSrcEl.classList[0]) {
        dragSrcEl.innerHTML = this.innerHTML
        this.innerHTML = e.dataTransfer?.getData('text/html') as string
        if (this.classList.contains('items-container')) {
            addContainerListeners(this as HTMLDivElement)

            this.querySelectorAll('li').forEach((li: HTMLLIElement) => {
                handleItemDeletion(li.querySelector('button') as HTMLButtonElement)
                addDDListeners(li)
            })
        } else {
            addDDListeners(this)
            handleItemDeletion(this.querySelector('button') as HTMLButtonElement)
        }
    }
}

function handleDragEnd (this: HTMLElement, e: DragEvent) {
    e.stopPropagation()

    if (this.classList.contains('items-container')) {
        addContainerListeners(this as HTMLDivElement)
        this.querySelectorAll('li').forEach((li: HTMLLIElement) => {
            handleItemDeletion(li.querySelector('button') as HTMLButtonElement)
            addDDListeners(li)
        })
    } else {
        addDDListeners(this)
    }
}

const setContainerItems = (btn: HTMLButtonElement) => {
    actualBtn = btn
    actualContainer = btn.parentElement as HTMLDivElement
    actualUl = actualContainer.querySelector('ul') as HTMLUListElement
    actualForm = actualContainer.querySelector('form') as HTMLFormElement
    actualTextInput = actualContainer.querySelector('input') as HTMLInputElement
    actualValidation = actualContainer.querySelector('.validation-msg') as HTMLSpanElement
}

const toggleForm = (btn: HTMLButtonElement, form: HTMLFormElement, action: Boolean) => {
    form.style.display = action ? 'block' : 'none'
    btn.style.display = action ? 'none' : 'block'
}

const handleAddItem = (e: MouseEvent) => {
    const btn = e.target as HTMLButtonElement
    if (actualContainer) toggleForm(actualBtn, actualForm, false)
    setContainerItems(btn)
    toggleForm(actualBtn, actualForm, true)
}

const handleItemDeletion = (btn: HTMLButtonElement) => {
    btn.addEventListener('click', () => {
        const elToRemove = btn.parentElement as HTMLLIElement
        elToRemove.remove()
    })
}

const createNewItem = (e: Event) => {
    e.preventDefault()

    // validation
    if (actualTextInput.value.length === 0) {
        actualValidation.textContent = 'Le champ doit contenir au minimum 1 caractère.'
        return 
    } else {
        actualValidation.textContent = ''
    }

    // create item
    const itemContent = actualTextInput.value
    const li = 
        `<li class="item" draggable="true">
            <p>${itemContent}</p>
            <button type="button">X</button>
        </li>`
    actualUl.insertAdjacentHTML('beforeend', li)

    const item = actualUl.lastElementChild as HTMLLIElement
    const liBtn = item.querySelector('button') as HTMLButtonElement
    handleItemDeletion(liBtn)
    addDDListeners(item)
    actualTextInput.value = ''
}

const addItemBtnListeners = (btn: HTMLButtonElement) => {
    btn.addEventListener('click', handleAddItem)
}

const closingFormBtnListeners = (btn: HTMLButtonElement) => {
    btn.addEventListener('click', () => toggleForm(actualBtn, actualForm, false))
}

const addFormSubmitListeners = (form: HTMLFormElement) => {
    form.addEventListener('submit', createNewItem)
}

const addDDListeners = (element: HTMLElement) => {
    element.addEventListener('dragstart', handleDragStart)
    element.addEventListener('dragover', handleDragOver)
    element.addEventListener('drop', handleDragDrop)
    element.addEventListener('dragend', handleDragEnd)
}

const addContainerListeners = (currentContainer: HTMLDivElement) => {
    const currentContainerDeletionBtn = currentContainer.querySelector('.delete-container-btn') as HTMLButtonElement
    const currentAddItemBtn = currentContainer.querySelector('.add-item-btn') as HTMLButtonElement
    const currentCloseFormBtn = currentContainer.querySelector('.close-form-btn') as HTMLButtonElement
    const currentForm = currentContainer.querySelector('form') as HTMLFormElement

    deleteBtnListeners(currentContainerDeletionBtn)
    addItemBtnListeners(currentAddItemBtn)
    closingFormBtnListeners(currentCloseFormBtn)
    addFormSubmitListeners(currentForm)
    addDDListeners(currentContainer)
}

itemsContainer.forEach((container: HTMLDivElement) => {
    addContainerListeners(container)
})

const addContainerBtn = document.querySelector('.add-container-btn') as HTMLButtonElement
const addContainerForm = document.querySelector('.add-new-container form') as HTMLFormElement
const addContainerFormInput = document.querySelector('.add-new-container input') as HTMLInputElement
const validationNewContainer = document.querySelector('.add-new-container .validation-msg') as HTMLSpanElement
const addContainerCloseBtn = document.querySelector('.close-add-list') as HTMLButtonElement
const addNewContainer = document.querySelector('.add-new-container') as HTMLDivElement
const containerList = document.querySelector('main') as HTMLDivElement

const createNewContainer = (e: Event) => {
    e.preventDefault()

    // validation
    if (addContainerFormInput.value.length === 0) {
        validationNewContainer.textContent = 'Le champ doit contenir au minimum 1 caractère.'
        return 
    } else {
        validationNewContainer.textContent = ''
    }

    const itemsContainer = document.querySelector('.items-container') as HTMLDivElement
    const newContainer = itemsContainer.cloneNode() as HTMLDivElement
    const newContainerContent = 
    `<div class="top-container">
        <h1>${addContainerFormInput.value}</h1>
        <button class="delete-container-btn" type="button">X</button>
    </div>

    <ul></ul>

    <button class="add-item-btn" type="button">Add an item</button>

    <form autocomplete="off">
        <div class="top-form-container">
            <label for="item">Add new item</label>
            <button type="button" class="close-form-btn">X</button>
        </div>
        <input type="text" name="item" id="item">
        <span class="validation-msg"></span>
        <button type="submit">Submit</button>
    </form>`

    newContainer.innerHTML = newContainerContent
    containerList.insertBefore(newContainer, addNewContainer)
    addContainerFormInput.value = ''
    addContainerListeners(newContainer)
}

addContainerBtn.addEventListener('click', () => {
    toggleForm(addContainerBtn, addContainerForm, true)
})
addContainerCloseBtn.addEventListener('click', () => {
    toggleForm(addContainerBtn, addContainerForm, false)
})
addContainerForm.addEventListener('submit', createNewContainer)

