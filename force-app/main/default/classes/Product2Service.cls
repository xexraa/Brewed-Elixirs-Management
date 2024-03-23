public with sharing class Product2Service {
    
    public static void updateProductImageUrl(String url, Id productId) {
        Product2 product = new Product2(
                Id = productId,
                ImageUrl__c = url
            );   

        update product;
    }

    public static List<Product2> getProducts() {
        return [SELECT Id, Name, Mark__c, Subtype__c, Taste__c, Type__c, Weight__c FROM Product2 WHERE (Type__c = 'Coffee' OR Type__c = 'Tea')];
    }

    public static Product2 getProductById(Id productId) {
        return [SELECT Id, Name, Mark__c, Subtype__c, Taste__c, Type__c, Weight__c, IsActive, Description FROM Product2 WHERE Id = :productId];
    }

    public static Product2 upsertProduct(Product2 productData) {
        upsert productData;
        
        return productData;
    }

    public static Product2 updateProduct(Product2 productData) {
        update productData;
        
        return productData;
    }
}