import { LightningElement, api } from "lwc";

import getPricebookEntriesForPricebook from "@salesforce/apex/DeleteProductsFromPriceBookModalC.getPricebookEntriesForPricebook";
import deletePricebookEntries from "@salesforce/apex/DeleteProductsFromPriceBookModalC.deletePricebookEntries";

import { ToastUtility, SortUtility } from "c/utility";
import * as LABELS from "c/labelsManagement";

const COLUMNS = [
  {
    label: LABELS.LABEL_Name,
    fieldName: "Name",
    type: "text",
    sortable: true
  }
];

export default class DeleteProductsFromPriceBookModal extends LightningElement {
  label = LABELS;
  columns = COLUMNS;

  isLoading = false;
  defaultSortDirection = "asc";
  sortDirection;
  sortedBy;

  recordsToDisplay = [];
  selectedProducts = [];

  @api pricebook;

  connectedCallback() {
    this.launchGetPricebookEntriesForPricebook();
  }

  launchGetPricebookEntriesForPricebook() {
    this.isLoading = true;

    getPricebookEntriesForPricebook({ pricebookId: this.pricebook.Id })
      .then((result) => {
        this.recordsToDisplay = result;
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

  handleRowSelection(event) {
    this.selectedProducts = event.detail.selectedRows;
  }

  handleSave() {
    this.isLoading = true;
    let pricebookEntries = [];

    this.selectedProducts.forEach((product) => {
      let pricebookEntry = {
        sobjectType: "PricebookEntry",
        Id: product.Id
      };
      pricebookEntries.push(pricebookEntry);
    });

    deletePricebookEntries({ pricebookEntries: pricebookEntries })
      .then(() => {
        ToastUtility.displayToast(
          this.label.TOAST_Success_DeleteGeneral,
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
  }

  closeModal() {
    const closeEvent = new CustomEvent("closemodal");
    this.dispatchEvent(closeEvent);
  }

  onHandleSort(event) {
    const { fieldName: sortedBy, sortDirection } = event.detail;
    const cloneData = [...this.recordsToDisplay];

    cloneData.sort(
      SortUtility.sortBy(sortedBy, sortDirection === "asc" ? 1 : -1)
    );
    this.recordsToDisplay = cloneData;
    this.sortDirection = sortDirection;
    this.sortedBy = sortedBy;
  }

  get isDisabled() {
    return this.selectedProducts.length === 0 ? true : false;
  }

  get isRecordsToDisplayEmpty() {
    return this.recordsToDisplay.length === 0 ? false : true;
  }
}
