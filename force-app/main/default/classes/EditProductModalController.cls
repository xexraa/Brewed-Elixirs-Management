public with sharing class EditProductModalController {
    
    @AuraEnabled
    public static Product2 updateProduct(Product2 productData) {
        try {
            return Product2Service.updateProduct(productData);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}