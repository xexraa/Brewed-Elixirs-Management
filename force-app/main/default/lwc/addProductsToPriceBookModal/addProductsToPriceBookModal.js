import { LightningElement, api } from "lwc";

import getStandardPricebookEntries from "@salesforce/apex/AddProductsToPriceBookModalController.getStandardPricebookEntries";
import assignProductsToPriceBook from "@salesforce/apex/AddProductsToPriceBookModalController.assignProductsToPriceBook";

import { ToastUtility, SortUtility } from "c/utility";
import * as LABELS from "c/labelsManagement";

const COLUMNS = [
  {
    label: LABELS.LABEL_Name,
    fieldName: "Name",
    type: "text",
    sortable: true
  },
  {
    label: LABELS.LABEL_DefaultPrice,
    fieldName: "UnitPrice",
    type: "currency",
    cellAttributes: { alignment: "left" },
    sortable: true,
    initialWidth: 120
  }
];

export default class AddProductsToPriceBookModal extends LightningElement {
  label = LABELS;
  columns = COLUMNS;

  isLoading = false;
  isEditSectionVisible = false;
  defaultSortDirection = "asc";
  sortDirection;
  sortedBy;

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

  assignNewPrice(newValue) {
    this.selectedProducts.forEach((product) => {
      product.UnitPrice = newValue;
    });

    this.selectedProducts = [...this.selectedProducts];
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

  handleChoose() {
    this.isEditSectionVisible = true;
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

  get isSelectedProducts() {
    return this.selectedProducts.length === 0 ? true : false;
  }

  get isRecordsToDisplayEmpty() {
    return this.recordsToDisplay.length === 0 ? false : true;
  }
}
