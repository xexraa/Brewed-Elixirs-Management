import { LightningElement, wire } from "lwc";
import { refreshApex } from "@salesforce/apex";
import { CurrentPageReference } from "lightning/navigation";

import getProductById from "@salesforce/apex/ProductManagementTabController.getProductById";

import ToastUtility from "c/utility";
import * as LABELS from "c/labelsManagement";

export default class ProductManagementTab extends LightningElement {
  label = LABELS;

  isLoading = true;
  isAddNewProductModalVisible = false;

  productId;

  @wire(CurrentPageReference)
  wiredPageRef(ref) {
    if (ref.state.c__productId) {
      this.productId = ref.state.c__productId;
      this.loadProductDetails();
    }
    this.isLoading = true;
    // refreshApex(this.recordList);
    this.isLoading = false;
  }

  loadProductDetails() {
    this.isLoading = true;

    getProductById({ productId: this.productId })
      .then((result) => {
        console.log(JSON.stringify(result));
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

  openNewProductModal() {
    this.isAddNewProductModalVisible = true;
  }

  closeNewProductModal() {
    this.isAddNewProductModalVisible = false;
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
}
