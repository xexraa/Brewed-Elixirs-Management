import { LightningElement } from "lwc";

import insertPriceBook from "@salesforce/apex/AddNewPriceBookModalController.insertPriceBook";

import { ToastUtility } from "c/utility";
import * as LABELS from "c/labelsManagement";

export default class AddNewPriceBookModal extends LightningElement {
  label = LABELS;

  isLoading = false;
  isStartDateValid = true;
  isEndDateValid = true;

  name;
  startDate;
  endDate;
  description;

  handleSave() {
    this.isLoading = true;

    if (this.isInputValid()) {
      let priceBookData = { sobjectType: "Pricebook2" };
      priceBookData.Name = this.name;
      priceBookData.Start_Date__c = this.startDate;
      priceBookData.End_Date__c = this.endDate;
      priceBookData.Description = this.description;

      insertPriceBook({ priceBookData: priceBookData })
        .then(() => {
          ToastUtility.displayToast(
            this.label.TOAST_Success_PriceBookAdded,
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
    this[event.target.dataset.name] = event.target.value;

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
