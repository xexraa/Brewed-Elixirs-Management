import { LightningElement, wire } from "lwc";
import { refreshApex } from "@salesforce/apex";
import { CurrentPageReference } from "lightning/navigation";

import getAllPriceBooks from "@salesforce/apex/PriceManagementTabController.getAllPriceBooks";
import getPricebookEntriesForPricebook from "@salesforce/apex/PriceManagementTabController.getPricebookEntriesForPricebook";

import { ToastUtility, SortUtility } from "c/utility";
import * as LABELS from "c/labelsManagement";

const ACTIONS = [
  { label: LABELS.LABEL_Edit, name: "edit" },
  { label: LABELS.LABEL_AddProducts, name: "addProducts" },
  { label: LABELS.LABEL_DeleteProducts, name: "deleteProducts" },
  { label: LABELS.LABEL_ModifyPrices, name: "modifyPrices" }
];

const COLUMNS = [
  {
    label: LABELS.LABEL_Name,
    fieldName: "Name",
    type: "button",
    sortable: true,
    typeAttributes: {
      label: { fieldName: "Name" },
      name: "showDetails",
      disabled: false,
      variant: "base"
    },
    rowActions: [
      {
        label: "View Details",
        name: "showDetails"
      }
    ]
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
  }
];

const PRICEBOOK_COLUMNS = [
  {
    label: LABELS.LABEL_Name,
    fieldName: "Name",
    type: "text"
  },
  {
    label: LABELS.LABEL_Price,
    fieldName: "UnitPrice",
    type: "currency",
    cellAttributes: { alignment: "left" },
    initialWidth: 120
  }
];

export default class PriceManagementTab extends LightningElement {
  label = LABELS;
  columns = COLUMNS;
  pricebookColumns = PRICEBOOK_COLUMNS;

  isLoading = true;
  isSelectedPriceBook = false;
  isNewPriceBookModalVisible = false;
  isEditPriceBookModalVisible = false;
  isAddProductsModalVisible = false;
  isDeleteProductsModalVisible = false;
  isModifyPricesModalVisible = false;

  wiredPriceBooksResult;
  data = [];
  pricebookData = [];
  selectedPriceBook;
  defaultSortDirection = "asc";
  sortDirection;
  sortedBy;
  selectedPricebookFromButton;

  constructor() {
    super();
    this.columns = this.columns.concat([
      { type: "action", typeAttributes: { rowActions: this.getRowActions } }
    ]);
  }

  @wire(CurrentPageReference)
  wiredPageRef() {
    this.isSelectedPriceBook = false;
    this.pricebookData = [];
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

  getRowActions(row, doneCallback) {
    let actions = [];

    if (row.IsInactive__c) {
      actions.push({
        label: LABELS.LABEL_Disabled,
        disabled: true
      });
    } else {
      actions = ACTIONS;
    }

    doneCallback(actions);
  }

  handleRowAction(event) {
    const actionName = event.detail.action.name;
    const row = event.detail.row;

    switch (actionName) {
      case "showDetails":
        this.selectedPricebookFromButton = row;
        this.fetchGetPriceBookById(row);
        break;
      case "edit":
        this.editSelectedPriceBook(row);
        break;

      case "addProducts":
        this.addProductsToPriceBook(row);
        break;

      case "deleteProducts":
        this.deleteProductsFromPriceBook(row);
        break;

      case "modifyPrices":
        this.modifyPricesInPriceBook(row);
        break;

      default:
    }
  }

  fetchGetPriceBookById(pricebook) {
    this.isLoading = true;

    getPricebookEntriesForPricebook({ pricebookId: pricebook.Id })
      .then((result) => {
        this.isSelectedPriceBook = true;

        this.pricebookData = result;
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

  openNewPriceBookModal() {
    this.isNewPriceBookModalVisible = true;
  }

  editSelectedPriceBook(pricebook) {
    this.selectedPriceBook = pricebook;
    this.isEditPriceBookModalVisible = true;
  }

  addProductsToPriceBook(pricebook) {
    this.selectedPriceBook = pricebook;
    this.isAddProductsModalVisible = true;
  }

  deleteProductsFromPriceBook(pricebook) {
    this.selectedPriceBook = pricebook;
    this.isDeleteProductsModalVisible = true;
  }

  modifyPricesInPriceBook(pricebook) {
    this.selectedPriceBook = pricebook;
    this.isModifyPricesModalVisible = true;
  }

  closeModal() {
    this.refreshCmp();
    this.refreshSelectedPricebookEntries();
    this.isEditPriceBookModalVisible = false;
    this.isNewPriceBookModalVisible = false;
    this.isAddProductsModalVisible = false;
    this.isDeleteProductsModalVisible = false;
    this.isModifyPricesModalVisible = false;
  }

  onHandleSort(event) {
    const { fieldName: sortedBy, sortDirection } = event.detail;
    const cloneData = [...this.data];

    cloneData.sort(
      SortUtility.sortBy(sortedBy, sortDirection === "asc" ? 1 : -1)
    );
    this.data = cloneData;
    this.sortDirection = sortDirection;
    this.sortedBy = sortedBy;
  }

  refreshSelectedPricebookEntries() {
    if (this.selectedPricebookFromButton) {
      if (this.selectedPriceBook.Id === this.selectedPricebookFromButton.Id) {
        this.fetchGetPriceBookById(this.selectedPricebookFromButton);
      }
    }
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

  get isPriceBookEmpty() {
    return this.pricebookData.length === 0 ? false : true;
  }
}
