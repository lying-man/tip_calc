"use strict";

//remove images dragNdrop
const allImages = document.images;
for (let img of allImages) img.ondragstart = () => false;

const $calculateBtn = document.querySelector(".btn-perform-actions");
const $tipOnePerson = document.querySelector(".salary-one");
const $tipAllPerson = document.querySelector(".salary-total");

const INPUTS_DATA = {

    Bill: {
        buttonInput: document.querySelector(".btn-bill"),
        messageEl: document.querySelector(".error-bill"),
        input: document.querySelector(".input-bill"),
        hasMessage: false,

        validate() {

            if (this.hasMessage) return false;
            
            let value = this.input.value.trim();

            if (value[0] === "0") {
                this.hasMessage = true;
                setTimeout(() => {
                    this.messageEl.classList.add("show");
                    this.buttonInput.classList.add("error");
                }, 100);
                return false;
            }

            if (value[0] === "." || value[value.length - 1] === "." || isNaN(value)) {
                this.hasMessage = true;
                setTimeout(() => {
                    this.messageEl.classList.add("show");
                    this.buttonInput.classList.add("error");
                }, 100);
                return false;
            }

            return true;

        }

    },

    People: {
        buttonInput: document.querySelector(".btn-people"),
        messageEl: document.querySelector(".error-people"),
        input: document.querySelector(".input-people"),
        hasMessage: false,
        
        validate() {

            if (this.hasMessage) return false;
            
            let value = this.input.value.trim();

            if (value[0] === "0") {
                this.hasMessage = true;
                this.messageEl.classList.add("show");
                this.buttonInput.classList.add("error");
                return false;
            }

            return true;

        }

    },

    Select: {
        wrapperSelect: document.querySelector(".select-block-content"),
        btnSelect: document.querySelector(".select-own"),
        selectItems: document.querySelectorAll(".select-item"),
        messageEl: document.querySelector(".error-select"),
        input: document.querySelector(".input-select"),
        inputOverlay: document.querySelector(".select-own-overlay"),
        hasMessage: false,
        valueSelect: false,

        validate() {

            if (this.hasMessage) return false;

            if (!this.valueSelect) {
                this.hasMessage = true;
                this.messageEl.classList.add("show");
                return false;
            }

            return true;

        }

    }

};

//prohibit enter words and other symbols to input
for (let el in INPUTS_DATA) {

    //constraint actions for inputs
    INPUTS_DATA[el].input.addEventListener("copy", (e) => e.preventDefault());
    INPUTS_DATA[el].input.addEventListener("pointerdown", (e) => e.preventDefault());

    if (el === "Bill") {
        INPUTS_DATA[el].input.addEventListener("keydown", (event) => {

            const { code, key } = event;
    
            if (code === "Space") return event.preventDefault();
    
            if (
                !((key >= 0 || key <= 9) ||
                (code === "ArrowRight" || code === "ArrowLeft") ||
                (code === "Backspace" || key === "."))
            ) {
                event.preventDefault();
                return;
            }

            let inputValue = INPUTS_DATA[el].input.value;

            if (inputValue === "0" && code !== "ArrowLeft" && code !== "ArrowRight" && code !== "Backspace" && key !== ".") {
                INPUTS_DATA[el].input.value = "";
                return;
            }
    
            if (inputValue !== "0" && inputValue.length === 1 && code === "Backspace") {
                event.preventDefault();
                INPUTS_DATA[el].input.value = "0";
                return;
            }

            if (inputValue === "0" && code === "Backspace") {
                event.preventDefault();
                return;
            }
    
        });
        continue;
    }

    INPUTS_DATA[el].input.addEventListener("keydown", (event) => {

        const { code, key } = event;

        if (code === "Space") return event.preventDefault();

        if (
            !((key >= 0 || key <= 9) ||
            (code === "ArrowRight" || code === "ArrowLeft") ||
            (code === "Backspace"))
        ) {
            event.preventDefault();
            return;
        }

        let inputValue = INPUTS_DATA[el].input.value;

        if (inputValue === "0" && code !== "ArrowLeft" && code !== "ArrowRight" && code !== "Backspace") {
            INPUTS_DATA[el].input.value = "";
            return;
        }

        if (inputValue !== "0" && inputValue.length === 1 && code === "Backspace") {
            event.preventDefault();
            INPUTS_DATA[el].input.value = "0";
            return;
        }

        if (inputValue === "0" && code === "Backspace") {
            event.preventDefault();
            return;
        }

    });

}

//focus inputs by click button wrapper
for (let el in INPUTS_DATA) {

    //handlers for select input
    if (!INPUTS_DATA[el].buttonInput) {

        const input = INPUTS_DATA[el].input;
        const overlay = INPUTS_DATA[el].inputOverlay;
        const button = INPUTS_DATA[el].btnSelect;

        input.addEventListener("focus", () => {

            if (INPUTS_DATA[el].messageEl.classList.contains("show")) {
                INPUTS_DATA[el].messageEl.classList.remove("show");
                INPUTS_DATA[el].hasMessage = false;
            }

            INPUTS_DATA.Select.selectItems.forEach(el => el.classList.remove("active"));
            button.classList.add("focus");
            input.classList.add("focus");
            overlay.classList.add("disable");
        });

        input.addEventListener("input", () => {
            if (Number(input.value) > 100) {
                input.value = 100;
            }
        });

        input.addEventListener("blur", () => {

            button.classList.remove("focus");

            if (input.value === "0") {
                input.classList.remove("focus");
                overlay.classList.remove("disable");
                INPUTS_DATA[el].valueSelect = false;
                return;
            }

            INPUTS_DATA[el].valueSelect = Number(input.value);

        });

        continue;

    }

    const currentBtnInput = INPUTS_DATA[el].buttonInput;
    const currentInput = INPUTS_DATA[el].input;

    currentBtnInput.addEventListener("click", () => {

        if (INPUTS_DATA[el].messageEl.classList.contains("show")) {
            currentBtnInput.classList.remove("error");
            INPUTS_DATA[el].messageEl.classList.remove("show");
            INPUTS_DATA[el].hasMessage = false;
        }

        currentBtnInput.classList.add("focus");
        currentInput.classList.add("focus");
        currentInput.focus();
    });

    currentInput.addEventListener("blur", () => {
        if (currentInput.value === "0") currentInput.classList.remove("focus");
        currentBtnInput.classList.remove("focus");
    });

}

//select procent
INPUTS_DATA.Select.wrapperSelect.addEventListener("click", chooseProcentTip);

function chooseProcentTip(event) {

    let { target } = event;

    if (target.matches(".select-item")) {
        INPUTS_DATA.Select.hasMessage = false;
        INPUTS_DATA.Select.messageEl.classList.remove("show");
        INPUTS_DATA.Select.selectItems.forEach(el => el.classList.remove("active"));
        target.classList.add("active");
        INPUTS_DATA.Select.valueSelect = Number(target.dataset.procent);
        const selectEls = INPUTS_DATA.Select;
        selectEls.input.value = "0";
        selectEls.inputOverlay.classList.remove("disable");
        selectEls.input.classList.remove("focus");
        selectEls.btnSelect.classList.remove("focus");
        return;
    }

    if (target.closest(".select-own")) {
        INPUTS_DATA.Select.input.focus();
    }

}

//validation
$calculateBtn.addEventListener("click", performCalculate);

function performCalculate() {

    let valuesCalc = validationInputs();

    if (valuesCalc) {
        let totalTip = valuesCalc.bill * valuesCalc.procent / 100;
        let oneTip = totalTip / valuesCalc.people;
        $tipAllPerson.textContent = `$${totalTip.toFixed(2)}`;
        $tipOnePerson.textContent = `$${oneTip.toFixed(2)}`;
    }

}

function validationInputs() {

    let values = { bill: null, procent: null, people: null };

    let checkBillCorrect = INPUTS_DATA.Bill.validate();
    if (checkBillCorrect) {
        values.bill = Number(INPUTS_DATA.Bill.input.value);
    } else {
        return false;
    }

    let checkSelectCorrect = INPUTS_DATA.Select.validate();
    if (checkSelectCorrect) {
        values.procent = INPUTS_DATA.Select.valueSelect;
    } else {
        return false;
    }

    let checkPeopleCorrect = INPUTS_DATA.People.validate();
    if (checkPeopleCorrect) {
        values.people = Number(INPUTS_DATA.People.input.value);
    } else {
        return false;
    }

    return values;

}



