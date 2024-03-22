public with sharing class Product2Service {
    
    public static void updateProductImageUrl(String url, Id productId) {
        Product2 product = new Product2(
                Id = productId,
                ImageUrl__c = url
            );   

        update product;
    }

    public static List<Product2> getProducts() {
        return [SELECT Id, Name, Mark__c, Subtype__c, Taste__c, Type__c, Weight__c FROM Product2 WHERE IsActive = true AND (Type__c = 'Coffee' OR Type__c = 'Tea')];
    }

    public static Product2 getProductById(Id productId) {
        return [SELECT Id, Name, Mark__c, Subtype__c, Taste__c, Type__c, Weight__c, Description FROM Product2 WHERE Id = :productId];
    }

    public static Product2 insertNewProduct(Product2 productData) {
        insert productData;
        
        return productData;
    }
}