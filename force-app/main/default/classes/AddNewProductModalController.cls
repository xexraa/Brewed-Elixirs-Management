public with sharing class AddNewProductModalController {
    
    @AuraEnabled
    public static Product2 insertNewProduct(Product2 productData) {
        try {
            return Product2Service.insertNewProduct(productData);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}