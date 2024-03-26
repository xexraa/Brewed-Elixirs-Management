import { LightningElement, wire } from "lwc";
import { refreshApex } from "@salesforce/apex";
import { CurrentPageReference } from "lightning/navigation";

import getAllPriceBooks from "@salesforce/apex/PriceManagementTabController.getAllPriceBooks";

import ToastUtility from "c/utility";
import * as LABELS from "c/labelsManagement";

const ACTIONS = [
  { label: LABELS.LABEL_Edit, name: "edit" },
  { label: LABELS.LABEL_AddProducts, name: "addProduct" }
];

const COLUMNS = [
  {
    label: LABELS.LABEL_Name,
    fieldName: "Name",
    type: "text",
    sortable: true
  },
  {
    label: LABELS.LABEL_StartDate,
    fieldName: "Start_Date__c",
    type: "date",
    sortable: true,
    typeAttributes: {
      day: "numeric",
      month: "numeric",
      year: "numeric"
    }
  },
  {
    label: LABELS.LABEL_EndDate,
    fieldName: "End_Date__c",
    type: "date",
    sortable: true,
    typeAttributes: {
      day: "numeric",
      month: "numeric",
      year: "numeric"
    }
  },
  {
    label: LABELS.LABEL_IsInactive,
    fieldName: "IsInactive__c",
    type: "boolean",
    sortable: true
  },
  {
    label: LABELS.LABEL_IsActive,
    fieldName: "IsActive",
    type: "boolean",
    sortable: true
  },
  {
    label: LABELS.LABEL_Description,
    fieldName: "Description",
    type: "text",
    sortable: true
  },
  {
    type: "action",
    typeAttributes: { rowActions: ACTIONS }
  }
];

export default class PriceManagementTab extends LightningElement {
  label = LABELS;
  columns = COLUMNS;

  isLoading = true;
  isNewPriceBookModalVisible = false;
  isEditPriceBookModalVisible = false;
  isAddProductModalVisible = false;

  wiredPriceBooksResult;
  data = [];
  selectedPriceBook;
  defaultSortDirection = "asc";
  sortDirection;
  sortedBy;

  @wire(CurrentPageReference)
  wiredPageRef() {
    this.refreshCmp();
  }

  @wire(getAllPriceBooks)
  wiredPriceBooks(result) {
    this.isLoading = true;
    this.wiredPriceBooksResult = result;

    if (result.data) {
      this.data = result.data;
    } else if (result.error) {
      ToastUtility.displayToast(
        result.error.body.message || this.label.TOAST_Error,
        "error"
      );
    }

    this.isLoading = false;
  }

  handleRowAction(event) {
    const actionName = event.detail.action.name;
    const row = event.detail.row;

    switch (actionName) {
      case "edit":
        this.editSelectedPriceBook(row);
        break;

      case "addProduct":
        this.addProductToPriceBook(row);
        break;

      default:
    }
  }

  openNewPriceBookModal() {
    this.isNewPriceBookModalVisible = true;
  }

  editSelectedPriceBook(pricebook) {
    this.selectedPriceBook = pricebook;
    console.log(JSON.stringify(pricebook));
    this.isEditPriceBookModalVisible = true;
  }

  addProductToPriceBook(pricebook) {
    this.selectedPriceBook = pricebook;
    console.log(JSON.stringify(pricebook));
    this.isAddProductModalVisible = true;
  }

  closeModal() {
    this.refreshCmp();
    this.isEditPriceBookModalVisible = false;
    this.isAddProductModalVisible = false;
    this.isNewPriceBookModalVisible = false;
  }

  sortBy(field, reverse, primer) {
    const key = primer
      ? function (x) {
          return primer(x[field]);
        }
      : function (x) {
          return x[field];
        };

    return function (a, b) {
      a = key(a);
      b = key(b);
      return reverse * ((a > b) - (b > a));
    };
  }

  onHandleSort(event) {
    const { fieldName: sortedBy, sortDirection } = event.detail;
    const cloneData = [...this.data];

    cloneData.sort(this.sortBy(sortedBy, sortDirection === "asc" ? 1 : -1));
    this.data = cloneData;
    this.sortDirection = sortDirection;
    this.sortedBy = sortedBy;
  }

  refreshCmp() {
    this.isLoading = true;

    refreshApex(this.wiredPriceBooksResult)
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
}
