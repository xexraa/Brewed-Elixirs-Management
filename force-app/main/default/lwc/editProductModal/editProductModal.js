import { LightningElement, api } from "lwc";

import updateProduct from "@salesforce/apex/EditProductModalController.updateProduct";

import ToastUtility from "c/utility";
import * as LABELS from "c/labelsManagement";

export default class EditProductModal extends LightningElement {
  label = LABELS;

  isLoading = false;

  productId;
  isActive;
  name;
  mark;
  type;
  subtype;
  taste;
  weight;
  description;

  @api product;

  connectedCallback() {
    this.populateInitialValues(this.product);
  }

  populateInitialValues(product) {
    this.productId = product.Id;
    this.name = this.getFieldValue(product.Name);
    this.mark = this.getFieldValue(product.Mark__c);
    this.type = this.getFieldValue(product.Type__c);
    this.subtype = this.getFieldValue(product.Subtype__c);
    this.taste = this.getFieldValue(product.Taste__c);
    this.weight = this.getFieldValue(product.Weight__c);
    this.description = this.getFieldValue(product.Description);
    this.isActive = product.IsActive;
  }

  getFieldValue(field) {
    return typeof field === "undefined" ? "" : field;
  }

  handleSave() {
    this.isLoading = true;

    if (this.isInputValid()) {
      let productData = { sobjectType: "Product2" };
      productData.Id = this.productId;
      productData.IsActive = this.isActive;
      productData.Name = this.name;
      productData.Mark__c = this.mark;
      productData.Type__c = this.type;
      productData.Subtype__c = this.subtype;
      productData.Taste__c = this.taste;
      productData.Weight__c = this.weight;
      productData.Description = this.description;

      updateProduct({ productData: productData })
        .then((result) => {
          ToastUtility.displayToast(
            this.label.TOAST_Success_ProductEdited,
            "success"
          );
          this.dispatchEvent(
            new CustomEvent("successedit", { detail: result })
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
