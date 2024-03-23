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
    public static Product2 upsertProduct(Product2 productData) {
        try {
            return Product2Service.upsertProduct(productData);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void assignImagesToProduct(Id documentId, Id contentVersionId, Id productId) {
        try {
            FileService.assignImagesToProduct(documentId, contentVersionId, productId);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}