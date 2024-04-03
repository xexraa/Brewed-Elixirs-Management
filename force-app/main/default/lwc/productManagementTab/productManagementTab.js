import { LightningElement, wire } from "lwc";
import { CurrentPageReference } from "lightning/navigation";

import getProductByIdWithStandardPrice from "@salesforce/apex/ProductManagementTabController.getProductByIdWithStandardPrice";
import getProductImages from "@salesforce/apex/ProductManagementTabController.getProductImages";
import insertProduct from "@salesforce/apex/ProductManagementTabController.insertProduct";
import updateProduct from "@salesforce/apex/ProductManagementTabController.updateProduct";
import assignProductMainImage from "@salesforce/apex/ProductManagementTabController.assignProductMainImage";
import changeProductMainImage from "@salesforce/apex/ProductManagementTabController.changeProductMainImage";

import { ToastUtility } from "c/utility";
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
  price;
  productImages = [];
  mainImageId;

  @wire(CurrentPageReference)
  wiredPageRef(ref) {
    this.refreshCmp();
    if (ref.state.c__productId) {
      this.productId = ref.state.c__productId;
      this.loadProductDetails();
      this.loadProductImages();
    }
  }

  loadProductDetails() {
    this.isLoading = true;

    getProductByIdWithStandardPrice({ productId: this.productId })
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
    this.productId = product.Product2Id;
    this.name = this.getFieldValue(product.Product2.Name);
    this.mark = this.getFieldValue(product.Product2.Mark__c);
    this.type = this.getFieldValue(product.Product2.Type__c);
    this.subtype = this.getFieldValue(product.Product2.Subtype__c);
    this.taste = this.getFieldValue(product.Product2.Taste__c);
    this.weight = this.getFieldValue(product.Product2.Weight__c);
    this.description = this.getFieldValue(product.Product2.Description);
    this.price = this.getFieldValue(product.UnitPrice);
    this.isActive = product.Product2.IsActive;
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
        this.launchInsertProduct(productData);
      } else {
        this.launchUpdateProduct(productData);
      }
    }
  }

  launchInsertProduct(productData) {
    this.isLoading = true;

    insertProduct({ productData: productData, defaultPrice: this.price })
      .then((result) => {
        ToastUtility.displayToast(
          this.label.TOAST_Success_ProductSaved,
          "success"
        );

        this.productId = result;
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

    updateProduct({ productData: productData, defaultPrice: this.price })
      .then(() => {
        ToastUtility.displayToast(
          this.label.TOAST_Success_ProductSaved,
          "success"
        );
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
    this[event.target.dataset.name] = event.target.value;

    if (event.target.dataset.name === "isActive") {
      this[event.target.dataset.name] = event.target.checked;
    }
  }

  handleMainImageChange(event) {
    const productId = event.currentTarget.dataset.id
      ? event.currentTarget.dataset.id
      : event.target.value;

    this.launchUpdateMainImage(productId);
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

  handleCancel() {
    this.refreshCmp();
  }

  handleUploadFinished(event) {
    this.isLoading = true;

    assignProductMainImage({
      imageId: event.detail.files[0].contentVersionId,
      productId: this.productId
    })
      .then(() => {
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

  openNewProductSection() {
    this.isProductSectionVisible = true;
  }

  refreshCmp() {
    this.isLoading = false;
    this.isProductSectionVisible = false;
    this.productId = undefined;
    this.name = undefined;
    this.mark = undefined;
    this.type = undefined;
    this.subtype = undefined;
    this.taste = undefined;
    this.weight = undefined;
    this.description = undefined;
    this.isActive = false;
    this.price = undefined;
    this.productImages = [];
    this.mainImageId = undefined;
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
