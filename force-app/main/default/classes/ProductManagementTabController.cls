public with sharing class ProductManagementTabController {
    
    @AuraEnabled(Cacheable=true)
    public static Product2 getProductById(Id productId) {
        try {
            return Product2Service.getProductById(productId);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}