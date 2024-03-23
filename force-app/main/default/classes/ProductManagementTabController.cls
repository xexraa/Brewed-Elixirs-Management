public with sharing class ProductManagementTabController {
    
    @AuraEnabled
    public static Product2 getProductById(Id productId) {
        try {
            return Product2Service.getProductById(productId);
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
    public static Product2 insertProductWithDefaultImage(Product2 productData) {
        try {
            return Product2Service.insertProductWithDefaultImage(productData);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static Product2 updateProduct(Product2 productData) {
        try {
            return Product2Service.updateProduct(productData);
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