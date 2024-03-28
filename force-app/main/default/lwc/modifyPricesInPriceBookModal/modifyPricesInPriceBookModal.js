import { LightningElement, api } from "lwc";

import getPricebookEntriesForPricebook from "@salesforce/apex/ModifyPricesInPriceBookModalController.getPricebookEntriesForPricebook";
import updatePricebookEntries from "@salesforce/apex/ModifyPricesInPriceBookModalController.updatePricebookEntries";

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
    label: LABELS.LABEL_Price,
    fieldName: "UnitPrice",
    type: "currency",
    cellAttributes: { alignment: "left" },
    sortable: true,
    initialWidth: 120
  }
];

export default class ModifyPricesInPriceBookModal extends LightningElement {
  label = LABELS;
  columns = COLUMNS;

  operationOptions = [
    { label: "+", value: "add" },
    { label: "+ %", value: "addPercent" },
    { label: "-", value: "subtract" },
    { label: "- %", value: "subtractPercent" }
  ];

  isLoading = false;
  isEditSectionVisible = false;
  defaultSortDirection = "asc";
  sortDirection;
  sortedBy;
  selectedOperation = "add";

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

    updatePricebookEntries({ pricebookEntries: this.selectedProducts })
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

  handleOperationChange(event) {
    this.selectedOperation = event.detail.value;
  }

  handleChoose() {
    this.isEditSectionVisible = true;
  }

  handleKeyDown(event) {
    if (event.key === "Enter") {
      const newValue = parseFloat(event.target.value);
      const datasetName = event.target.dataset.name;
      const hasMoreThanTwoDecimalPlaces = (newValue * 100) % 1 !== 0;

      if (!isNaN(newValue) && newValue > 0 && !hasMoreThanTwoDecimalPlaces) {
        event.target.setCustomValidity("");
        if (
          datasetName === "calculatedPrice" ||
          datasetName === "settedPrice"
        ) {
          this.handlePriceChange(event);
        }
      } else {
        event.target.setCustomValidity(this.label.VALIDATION_ERROR_Price);
      }

      event.target.reportValidity();
    }
  }

  handlePriceChange(event) {
    const datasetName = event.target.dataset.name;

    if (datasetName === "calculatedPrice") {
      this.calculatePrice(event);
    } else if (datasetName === "settedPrice") {
      this.setNewPrice(event);
    }
  }

  calculatePrice(event) {
    const operation = this.selectedOperation;
    const value = parseFloat(event.target.value);

    this.selectedProducts.forEach((product) => {
      if (operation === "add") {
        product.UnitPrice += value;
      } else if (operation === "addPercent") {
        const percentValue = product.UnitPrice * (value / 100);
        product.UnitPrice += percentValue;
      } else if (operation === "subtract") {
        product.UnitPrice -= value;
      } else if (operation === "subtractPercent") {
        const percentValue = product.UnitPrice * (value / 100);
        product.UnitPrice -= percentValue;
      }
    });

    this.selectedProducts = [...this.selectedProducts];
  }

  setNewPrice(event) {
    const value = parseFloat(event.target.value);

    this.selectedProducts.forEach((product) => {
      product.UnitPrice = value;
    });

    this.selectedProducts = [...this.selectedProducts];
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

  get isRecordsToDisplayEmpty() {
    return this.recordsToDisplay.length === 0 ? false : true;
  }

  get isSelectedProducts() {
    return this.selectedProducts.length === 0 ? true : false;
  }
}
