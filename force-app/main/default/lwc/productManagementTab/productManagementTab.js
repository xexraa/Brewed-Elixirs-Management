import { LightningElement, wire } from "lwc";
import { CurrentPageReference } from "lightning/navigation";

import getProductById from "@salesforce/apex/ProductManagementTabController.getProductById";
import getProductImages from "@salesforce/apex/ProductManagementTabController.getProductImages";
import insertProductWithDefaultImage from "@salesforce/apex/ProductManagementTabController.insertProductWithDefaultImage";
import updateProduct from "@salesforce/apex/ProductManagementTabController.updateProduct";
import changeProductMainImage from "@salesforce/apex/ProductManagementTabController.changeProductMainImage";

import ToastUtility from "c/utility";
import { IMAGES_FORMATS_ALLOWED } from "c/constants";
import * as LABELS from "c/labelsManagement";

export default class ProductManagementTab extends LightningElement {
  label = LABELS;

  isLoading = false;
  isProductSectionVisible = false;

  productId;
  name;
  mark;
  type;
  subtype;
  taste;
  weight;
  description;
  isActive = false;
  productImages = [];
  mainImageId;

  @wire(CurrentPageReference)
  wiredPageRef(ref) {
    if (ref.state.c__productId) {
      this.productId = ref.state.c__productId;
      this.loadProductDetails();
      this.loadProductImages();
    }
  }

  loadProductDetails() {
    this.isLoading = true;

    getProductById({ productId: this.productId })
      .then((result) => {
        this.populateCmpWithDetails(result);
        this.isProductSectionVisible = true;
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

  loadProductImages() {
    this.isLoading = true;

    getProductImages({ productId: this.productId })
      .then((result) => {
        this.productImages = result;
        this.mainImageId = this.productImages.find(
          (image) => image.IsMainImage__c
        )?.Id;
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

  populateCmpWithDetails(product) {
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
    if (this.isInputValid()) {
      let productData = { sobjectType: "Product2" };
      if (this.productId) {
        productData.Id = this.productId;
      }
      productData.Name = this.name;
      productData.Mark__c = this.mark;
      productData.Type__c = this.type;
      productData.Subtype__c = this.subtype;
      productData.Taste__c = this.taste;
      productData.Weight__c = this.weight;
      productData.Description = this.description;
      productData.IsActive = this.isActive;

      if (!this.productId) {
        this.launchInsertProductWithDefaultImage(productData);
      } else {
        this.launchUpdateProduct(productData);
      }
    }
  }

  launchInsertProductWithDefaultImage(productData) {
    this.isLoading = true;

    insertProductWithDefaultImage({ productData: productData })
      .then((result) => {
        ToastUtility.displayToast(
          this.label.TOAST_Success_ProductSaved,
          "success"
        );

        this.populateCmpWithDetails(result);
        this.loadProductImages();
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

  launchUpdateProduct(productData) {
    this.isLoading = true;

    updateProduct({ productData: productData })
      .then((result) => {
        ToastUtility.displayToast(
          this.label.TOAST_Success_ProductSaved,
          "success"
        );

        this.populateCmpWithDetails(result);
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

  handleMainImageChange(event) {
    this.launchUpdateMainImage(event.target.value);
  }

  launchUpdateMainImage(imageId) {
    this.isLoading = true;

    changeProductMainImage({
      oldImageId: this.mainImageId ? this.mainImageId : null,
      newImageId: imageId
    })
      .then(() => {
        ToastUtility.displayToast(
          this.label.TOAST_Success_MainImageChanged,
          "success"
        );

        this.loadProductImages();
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

  handleClear() {
    this.refreshCmp();
  }

  handleUploadFinished() {
    this.loadProductImages();
  }

  openNewProductSection() {
    this.isProductSectionVisible = true;
  }

  refreshCmp() {
    this.productId = undefined;
    this.name = undefined;
    this.mark = undefined;
    this.type = undefined;
    this.subtype = undefined;
    this.taste = undefined;
    this.weight = undefined;
    this.description = undefined;
    this.isActive = false;
    this.productImages = [];
  }

  get acceptedFormats() {
    return IMAGES_FORMATS_ALLOWED;
  }

  get isProductSectionActive() {
    return this.isProductSectionVisible ? true : false;
  }

  get isProductImagesEmpty() {
    return this.productImages.length === 0 ? true : false;
  }

  get isProductId() {
    return this.productId ? false : true;
  }

  get acceptedFormatsString() {
    const acceptedFormats = IMAGES_FORMATS_ALLOWED;
    return acceptedFormats.join(", ");
  }
}
