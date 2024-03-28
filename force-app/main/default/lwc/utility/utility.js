import { ShowToastEvent } from "lightning/platformShowToastEvent";

export class ToastUtility {
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

export class SortUtility {
  static sortBy(field, reverse, primer) {
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
}
