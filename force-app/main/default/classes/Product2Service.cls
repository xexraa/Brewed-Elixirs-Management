public with sharing class Product2Service {

    private final static String BREWED_ELIXIRS_TYPE_COFFEE = Constants.BREWED_ELIXIRS_TYPE_COFFEE;
    private final static String BREWED_ELIXIRS_TYPE_TEA = Constants.BREWED_ELIXIRS_TYPE_TEA;
    
    public static List<Product2> getProducts() {
        return [
            SELECT Id, Name, Mark__c, Subtype__c, Taste__c, Type__c, Weight__c 
            FROM Product2 
            WHERE (Type__c = :BREWED_ELIXIRS_TYPE_COFFEE OR Type__c = :BREWED_ELIXIRS_TYPE_TEA)
            WITH SECURITY_ENFORCED
        ];
    }

    public static Product2 getProductById(Id productId) {
        return [
            SELECT Id, Name, Mark__c, Subtype__c, Taste__c, Type__c, Weight__c, IsActive, Description 
            FROM Product2 
            WHERE Id = :productId
            WITH SECURITY_ENFORCED
        ];
    }

    public static Id insertProduct(Product2 productData, Decimal defaultPrice) {
        insert productData;
        
        PricebookEntryService.createStandardPriceBookEntry(productData.Id, defaultPrice);

        return productData.Id;
    }

    public static void updateProduct(Product2 productData, Decimal defaultPrice) {
        update productData;

        PricebookEntryService.updateStandardPrice(productData.Id, defaultPrice);
    }

    public static void updateProductImageUrl(String url, Id productId) {
        Product2 product = new Product2(
                Id = productId,
                ImageUrl__c = url
            );   

        update product;
    }
}