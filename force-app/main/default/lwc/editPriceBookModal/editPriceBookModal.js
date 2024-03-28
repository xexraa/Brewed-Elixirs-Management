import { LightningElement, api } from "lwc";

import updatePriceBook from "@salesforce/apex/EditPriceBookModalController.updatePriceBook";

import { ToastUtility } from "c/utility";
import * as LABELS from "c/labelsManagement";

export default class EditPriceBookModal extends LightningElement {
  label = LABELS;

  isLoading = false;
  isStartDateValid = true;
  isEndDateValid = true;

  pricebookId;
  isActive;
  isDeactivated;
  name;
  startDate;
  endDate;

  @api pricebook;

  connectedCallback() {
    this.populateInitialValues(this.pricebook);
  }

  populateInitialValues(pricebook) {
    this.pricebookId = pricebook.Id;
    this.isActive = this.getFieldValue(pricebook.IsActive);
    this.name = this.getFieldValue(pricebook.Name);
    this.startDate = this.getFieldValue(pricebook.Start_Date__c);
    this.endDate = this.getFieldValue(pricebook.End_Date__c);
  }

  getFieldValue(field) {
    return typeof field === "undefined" ? "" : field;
  }

  handleSave() {
    this.isLoading = true;

    if (this.isInputValid()) {
      let priceBookData = { sobjectType: "Pricebook2" };
      priceBookData.Id = this.pricebookId;
      if (this.isDeactivated === true) {
        priceBookData.IsActive = false;
      }
      priceBookData.Name = this.name;
      priceBookData.Start_Date__c = this.startDate;
      priceBookData.End_Date__c = this.endDate;

      updatePriceBook({ priceBookData: priceBookData })
        .then(() => {
          ToastUtility.displayToast(
            this.label.TOAST_Success_PriceBookEdited,
            "success"
          );
          this.closeModal();
        })
        .catch((error) => {
          ToastUtility.displayToast(
            error.body.message || this.label.TOAST_Error,
            "error"
          );
        })
        .finally(() => {
          this.isLoading = false;
        });
    } else {
      this.isLoading = false;
    }
  }

  isInputValid() {
    let isValid = true;
    let inputFields = this.template.querySelectorAll(".validate");

    inputFields.forEach((inputField) => {
      if (
        !inputField.checkValidity() ||
        (inputField.required && !inputField.value)
      ) {
        inputField.reportValidity();
        isValid = false;
      }

      if (!this.isStartDateValid || !this.isEndDateValid) {
        isValid = false;
      }
    });

    return isValid;
  }

  handleChange(event) {
    if (event.target.dataset.name === "isDeactivated") {
      this[event.target.dataset.name] = event.target.checked;
    } else {
      this[event.target.dataset.name] = event.target.value;
    }

    if (
      event.target.dataset.name === "startDate" ||
      event.target.dataset.name === "endDate"
    ) {
      this.checkInputDateValidity(event.target);
    }
  }

  checkInputDateValidity(eventTarget) {
    let inputTarget = this.template.querySelector(
      `[data-name="${eventTarget.dataset.name}"]`
    );
    inputTarget.setCustomValidity("");

    if (
      eventTarget.dataset.name === "startDate" &&
      inputTarget.value >= this.endDate
    ) {
      inputTarget.setCustomValidity(this.label.VALIDATION_ERROR_StartDate);
      this.isStartDateValid = false;
    } else if (
      eventTarget.dataset.name === "endDate" &&
      inputTarget.value <= this.startDate
    ) {
      inputTarget.setCustomValidity(this.label.VALIDATION_ERROR_EndDate);
      this.isEndDateValid = false;
    } else {
      this.isStartDateValid = true;
      this.isEndDateValid = true;
    }

    inputTarget.reportValidity();
  }

  closeModal() {
    const closeEvent = new CustomEvent("closemodal");
    this.dispatchEvent(closeEvent);
  }
}
