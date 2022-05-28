"use strict";
const itemsContainer = document.querySelectorAll('.items-container');
let actualContainer, actualBtn, actualUl, actualForm, actualTextInput, actualValidation;
const handleContainerDeletion = (e) => {
    const btn = e.target;
    const btnsArray = [...document.querySelectorAll('.delete-container-btn')];
    const containers = [...document.querySelectorAll('.items-container')];
    containers[btnsArray.indexOf(btn)].remove();
};
const deleteBtnListeners = (btn) => {
    btn.addEventListener('click', handleContainerDeletion);
};
let dragSrcEl;
function handleDragStart(e) {
    var _a;
    e.stopPropagation();
    if (actualContainer)
        toggleForm(actualBtn, actualForm, false);
    dragSrcEl = this;
    (_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.setData('text/html', this.innerHTML);
}
function handleDragOver(e) {
    e.preventDefault();
}
function handleDragDrop(e) {
    var _a;
    e.stopPropagation();
    const receptionEl = this;
    if (dragSrcEl.nodeName === 'LI' && receptionEl.classList.contains('items-container')) {
        receptionEl.querySelector('ul').appendChild(dragSrcEl);
        addDDListeners(dragSrcEl);
        handleItemDeletion(dragSrcEl.querySelector('button'));
    }
    if (dragSrcEl !== this && this.classList[0] === dragSrcEl.classList[0]) {
        dragSrcEl.innerHTML = this.innerHTML;
        this.innerHTML = (_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.getData('text/html');
        if (this.classList.contains('items-container')) {
            addContainerListeners(this);
            this.querySelectorAll('li').forEach((li) => {
                handleItemDeletion(li.querySelector('button'));
                addDDListeners(li);
            });
        }
        else {
            addDDListeners(this);
            handleItemDeletion(this.querySelector('button'));
        }
    }
}
function handleDragEnd(e) {
    e.stopPropagation();
    if (this.classList.contains('items-container')) {
        addContainerListeners(this);
        this.querySelectorAll('li').forEach((li) => {
            handleItemDeletion(li.querySelector('button'));
            addDDListeners(li);
        });
    }
    else {
        addDDListeners(this);
    }
}
const setContainerItems = (btn) => {
    actualBtn = btn;
    actualContainer = btn.parentElement;
    actualUl = actualContainer.querySelector('ul');
    actualForm = actualContainer.querySelector('form');
    actualTextInput = actualContainer.querySelector('input');
    actualValidation = actualContainer.querySelector('.validation-msg');
};
const toggleForm = (btn, form, action) => {
    form.style.display = action ? 'block' : 'none';
    btn.style.display = action ? 'none' : 'block';
};
const handleAddItem = (e) => {
    const btn = e.target;
    if (actualContainer)
        toggleForm(actualBtn, actualForm, false);
    setContainerItems(btn);
    toggleForm(actualBtn, actualForm, true);
};
const handleItemDeletion = (btn) => {
    btn.addEventListener('click', () => {
        const elToRemove = btn.parentElement;
        elToRemove.remove();
    });
};
const createNewItem = (e) => {
    e.preventDefault();
    // validation
    if (actualTextInput.value.length === 0) {
        actualValidation.textContent = 'Le champ doit contenir au minimum 1 caractère.';
        return;
    }
    else {
        actualValidation.textContent = '';
    }
    // create item
    const itemContent = actualTextInput.value;
    const li = `<li class="item" draggable="true">
            <p>${itemContent}</p>
            <button type="button">X</button>
        </li>`;
    actualUl.insertAdjacentHTML('beforeend', li);
    const item = actualUl.lastElementChild;
    const liBtn = item.querySelector('button');
    handleItemDeletion(liBtn);
    addDDListeners(item);
    actualTextInput.value = '';
};
const addItemBtnListeners = (btn) => {
    btn.addEventListener('click', handleAddItem);
};
const closingFormBtnListeners = (btn) => {
    btn.addEventListener('click', () => toggleForm(actualBtn, actualForm, false));
};
const addFormSubmitListeners = (form) => {
    form.addEventListener('submit', createNewItem);
};
const addDDListeners = (element) => {
    element.addEventListener('dragstart', handleDragStart);
    element.addEventListener('dragover', handleDragOver);
    element.addEventListener('drop', handleDragDrop);
    element.addEventListener('dragend', handleDragEnd);
};
const addContainerListeners = (currentContainer) => {
    const currentContainerDeletionBtn = currentContainer.querySelector('.delete-container-btn');
    const currentAddItemBtn = currentContainer.querySelector('.add-item-btn');
    const currentCloseFormBtn = currentContainer.querySelector('.close-form-btn');
    const currentForm = currentContainer.querySelector('form');
    deleteBtnListeners(currentContainerDeletionBtn);
    addItemBtnListeners(currentAddItemBtn);
    closingFormBtnListeners(currentCloseFormBtn);
    addFormSubmitListeners(currentForm);
    addDDListeners(currentContainer);
};
itemsContainer.forEach((container) => {
    addContainerListeners(container);
});
const addContainerBtn = document.querySelector('.add-container-btn');
const addContainerForm = document.querySelector('.add-new-container form');
const addContainerFormInput = document.querySelector('.add-new-container input');
const validationNewContainer = document.querySelector('.add-new-container .validation-msg');
const addContainerCloseBtn = document.querySelector('.close-add-list');
const addNewContainer = document.querySelector('.add-new-container');
const containerList = document.querySelector('main');
const createNewContainer = (e) => {
    e.preventDefault();
    // validation
    if (addContainerFormInput.value.length === 0) {
        validationNewContainer.textContent = 'Le champ doit contenir au minimum 1 caractère.';
        return;
    }
    else {
        validationNewContainer.textContent = '';
    }
    const itemsContainer = document.querySelector('.items-container');
    const newContainer = itemsContainer.cloneNode();
    const newContainerContent = `<div class="top-container">
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
    </form>`;
    newContainer.innerHTML = newContainerContent;
    containerList.insertBefore(newContainer, addNewContainer);
    addContainerFormInput.value = '';
    addContainerListeners(newContainer);
};
addContainerBtn.addEventListener('click', () => {
    toggleForm(addContainerBtn, addContainerForm, true);
});
addContainerCloseBtn.addEventListener('click', () => {
    toggleForm(addContainerBtn, addContainerForm, false);
});
addContainerForm.addEventListener('submit', createNewContainer);
