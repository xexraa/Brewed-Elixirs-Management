import { LightningElement, wire } from "lwc";
import { refreshApex } from "@salesforce/apex";
import { CurrentPageReference } from "lightning/navigation";
import { NavigationMixin } from "lightning/navigation";

import getProducts from "@salesforce/apex/ProductsTabController.getProducts";

import ToastUtility from "c/utility";
import { DEFAULT_PAGE_SIZE } from "c/constants";
import * as LABELS from "c/labelsManagement";

const COLUMNS = [
  {
    label: LABELS.LABEL_Name,
    fieldName: "Name",
    type: "button",
    sortable: true,
    typeAttributes: {
      label: { fieldName: "Name" },
      name: "navigateToDetails",
      disabled: false,
      variant: "base"
    },
    rowActions: [
      {
        label: "View Details",
        name: "navigateToDetails"
      }
    ]
  },
  {
    label: LABELS.LABEL_Brand,
    fieldName: "Mark__c",
    type: "text",
    sortable: true
  },
  {
    label: LABELS.LABEL_Type,
    fieldName: "Type__c",
    type: "text",
    sortable: true
  },
  {
    label: LABELS.LABEL_Subtype,
    fieldName: "Subtype__c",
    type: "text",
    sortable: true
  },
  {
    label: LABELS.LABEL_Taste,
    fieldName: "Taste__c",
    type: "text",
    sortable: true
  },
  {
    label: LABELS.LABEL_Weight,
    fieldName: "Weight__c",
    type: "text",
    sortable: true
  }
];

export default class ProductsTab extends NavigationMixin(LightningElement) {
  label = LABELS;
  columns = COLUMNS;

  isLoading = true;
  defaultSortDirection = "asc";
  sortDirection;
  sortedBy;
  keyword;
  wiredProductsResult;
  totalRecords = 0;
  pageSize;
  totalPages;
  pageNumber = 1;
  recordsToDisplay = [];
  originalRecords = [];
  searchedRecords = [];

  @wire(CurrentPageReference)
  wiredPageRef() {
    this.refreshCmp();
  }

  @wire(getProducts)
  wiredProducts(result) {
    this.isLoading = true;
    this.wiredProductsResult = result;

    if (result.data) {
      this.originalRecords = result.data;
      this.totalRecords = result.data.length;
      this.pageSize = DEFAULT_PAGE_SIZE;
      this.recordsToDisplay = [...this.originalRecords];
      this.paginationHelper();
    } else if (result.error) {
      ToastUtility.displayToast(
        result.error.body.message || this.label.TOAST_Error,
        "error"
      );
    }

    this.isLoading = false;
  }

  previousPage() {
    this.pageNumber--;
    this.paginationHelper();
  }

  nextPage() {
    this.pageNumber++;
    this.paginationHelper();
  }

  firstPage() {
    this.pageNumber = 1;
    this.paginationHelper();
  }

  lastPage() {
    this.pageNumber = this.totalPages;
    this.paginationHelper();
  }

  paginationHelper() {
    if (this.keyword) {
      this.totalPages = Math.ceil(this.searchedRecords.length / this.pageSize);
    } else {
      this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    }

    if (this.pageNumber <= 1) {
      this.pageNumber = 1;
    } else if (this.pageNumber >= this.totalPages) {
      this.pageNumber = this.totalPages;
    }

    const startIndex = (this.pageNumber - 1) * this.pageSize;
    let endIndex;
    if (this.keyword) {
      endIndex = Math.min(
        startIndex + this.pageSize,
        this.searchedRecords.length
      );
    } else {
      endIndex = Math.min(startIndex + this.pageSize, this.totalRecords);
    }

    if (this.keyword) {
      this.recordsToDisplay = this.searchedRecords.slice(startIndex, endIndex);
    } else {
      this.recordsToDisplay = this.originalRecords.slice(startIndex, endIndex);
    }

    this.refreshSortState();
  }

  handleKeyWordChange(event) {
    this.keyword = event.target.value;
    this.searchByKeyword();
  }

  searchByKeyword() {
    if (this.keyword) {
      this.searchedRecords = this.originalRecords.filter((item) => {
        return item.Name.toLowerCase().includes(this.keyword.toLowerCase());
      });

      this.totalRecords = this.searchedRecords.length;
    } else {
      this.recordsToDisplay = [...this.originalRecords];
      this.totalRecords = this.originalRecords.length;
    }

    this.paginationHelper();
  }

  handleRowAction(event) {
    const action = event.detail.action;
    const rowId = event.detail.row.Id;

    if (action.name === "navigateToDetails") {
      this.navigateToProductPage(rowId);
    }
  }

  navigateToProductPage(productId) {
    this[NavigationMixin.Navigate]({
      type: "standard__navItemPage",
      attributes: {
        apiName: "ProductManagement"
      },
      state: {
        c__productId: productId
      }
    });
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
    const cloneData = [...this.recordsToDisplay];

    cloneData.sort(this.sortBy(sortedBy, sortDirection === "asc" ? 1 : -1));
    this.recordsToDisplay = cloneData;
    this.sortDirection = sortDirection;
    this.sortedBy = sortedBy;
  }

  refreshSortState() {
    this.recordsToDisplay.sort(
      this.sortBy(this.sortedBy, this.sortDirection === "asc" ? 1 : -1)
    );
  }

  refreshCmp() {
    this.isLoading = true;

    refreshApex(this.wiredProductsResult)
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

  get buttonDisableFirst() {
    return this.pageNumber === 1;
  }

  get buttonDisableLast() {
    return this.pageNumber === this.totalPages;
  }
}
