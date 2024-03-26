import { LightningElement, api, wire } from "lwc";

import getStandardPricebookEntries from "@salesforce/apex/AddProductsToPriceBookModalController.getStandardPricebookEntries";
import assignProductsToPriceBook from "@salesforce/apex/AddProductsToPriceBookModalController.assignProductsToPriceBook";

import ToastUtility from "c/utility";
import * as LABELS from "c/labelsManagement";

const COLUMNS = [
  {
    label: LABELS.LABEL_Name,
    fieldName: "Name",
    type: "text"
  },
  {
    label: LABELS.LABEL_Price,
    fieldName: "UnitPrice",
    type: "currency",
    cellAttributes: { alignment: "left" }
    // sortable: true
  }
];

export default class AddProductsToPriceBookModal extends LightningElement {
  label = LABELS;
  columns = COLUMNS;

  isLoading = false;
  wiredProductsResult;
  recordsToDisplay = [];
  selectedProducts = [];

  @api pricebook;

  connectedCallback() {
    this.launchGetStandardPricebookEntries();
  }

  launchGetStandardPricebookEntries() {
    this.isLoading = true;

    getStandardPricebookEntries({ pricebookId: this.pricebook.Id })
      .then((result) => {
        // this.recordsToDisplay = result[0].PricebookEntries;
        console.log(JSON.stringify(result)); // TODO: poprawić tabelkę
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
  }

  // @wire(getStandardPricebookEntries)
  // wiredProducts(result) {
  //   this.isLoading = true;
  //   this.wiredProductsResult = result;

  //   if (result.data) {
  //     this.recordsToDisplay = result.data[0].PricebookEntries;
  //   } else if (result.error) {
  //     ToastUtility.displayToast(
  //       result.error.body.message || this.label.TOAST_Error,
  //       "error"
  //     );
  //   }

  //   this.isLoading = false;
  // }

  handleRowSelection(event) {
    this.selectedProducts = event.detail.selectedRows;
  }

  handleSave() {
    this.isLoading = true;
    let pricebookEntries = [];

    this.selectedProducts.forEach((product) => {
      let pricebookEntry = {
        sobjectType: "PricebookEntry",
        UnitPrice: product.UnitPrice,
        Product2Id: product.Product2Id,
        Pricebook2Id: this.pricebook.Id,
        IsActive: true
      };
      pricebookEntries.push(pricebookEntry);
    });

    assignProductsToPriceBook({ pricebookEntries: pricebookEntries })
      .then(() => {
        ToastUtility.displayToast(this.label.TOAST_Success_General, "success");
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
  }

  closeModal() {
    const closeEvent = new CustomEvent("closemodal");
    this.dispatchEvent(closeEvent);
  }

  get isDisabled() {
    return this.selectedProducts.length === 0 ? true : false;
  }
}
