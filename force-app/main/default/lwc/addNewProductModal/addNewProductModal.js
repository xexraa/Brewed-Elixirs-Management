import { LightningElement } from "lwc";

import insertNewProduct from "@salesforce/apex/AddNewProductModalController.insertNewProduct";

import ToastUtility from "c/utility";
import * as LABELS from "c/labelsManagement";

export default class AddNewProductModal extends LightningElement {
  label = LABELS;

  isLoading = false;

  isActive = false;
  name;
  mark;
  type;
  subtype;
  taste;
  weight;
  description;

  handleSave() {
    this.isLoading = true;

    if (this.isInputValid()) {
      let productData = { sobjectType: "Product2" };
      productData.IsActive = this.isActive;
      productData.Name = this.name;
      productData.Mark__c = this.mark;
      productData.Type__c = this.type;
      productData.Subtype__c = this.subtype;
      productData.Taste__c = this.taste;
      productData.Weight__c = this.weight;
      productData.Description = this.description;

      insertNewProduct({ productData: productData })
        .then((result) => {
          ToastUtility.displayToast(
            this.label.TOAST_Success_ProductAdded,
            "success"
          );
          console.log(JSON.stringify(result));
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

  // Before save check
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
    });

    return isValid;
  }

  handleChange(event) {
    if (event.target.dataset.name === "isActive") {
      this[event.target.dataset.name] = event.target.checked;
    } else {
      this[event.target.dataset.name] = event.target.value;
    }
  }

  closeModal() {
    const closeEvent = new CustomEvent("closemodal");
    this.dispatchEvent(closeEvent);
  }
}
