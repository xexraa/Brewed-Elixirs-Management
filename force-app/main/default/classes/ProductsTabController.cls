public with sharing class ProductsTabController {
    
    @AuraEnabled(Cacheable=true)
    public static List<Product2> getProducts() {
        try {
            return Product2Service.getProducts();
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}