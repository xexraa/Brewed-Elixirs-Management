import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class ToastUtility {
  static showToastMessage(title, variant) {
    return new ShowToastEvent({
      title: title,
      variant: variant
    });
  }

  static displayToast(message, variant) {
    dispatchEvent(this.showToastMessage(message, variant));
  }
}
