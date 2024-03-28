public with sharing class ProductManagementTabController {
    
    @AuraEnabled
    public static PricebookEntry getProductByIdWithStandardPrice(Id productId) {
        try {
            return PricebookEntryService.getProductByIdWithStandardPrice(productId);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static List<ContentVersion> getProductImages(Id productId) {
        try {
            return FileService.getProductImages(productId);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static Id insertProduct(Product2 productData, Decimal defaultPrice) {
        try {
            return Product2Service.insertProduct(productData, defaultPrice);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void updateProduct(Product2 productData, Decimal defaultPrice) {
        try {
            Product2Service.updateProduct(productData, defaultPrice);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void changeProductMainImage(Id oldImageId, Id newImageId) {
        try {
            FileService.changeProductMainImage(oldImageId, newImageId);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}