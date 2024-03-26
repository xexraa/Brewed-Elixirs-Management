public with sharing class PricebookEntryService {
    
    private final static Date TODAY = Constants.TODAY;

    public static ProductFullDescriptionWrapper getProductById(Id productId) {
        PricebookEntry productEntry = [
            SELECT Id, Product2Id, CurrencyIsoCode, UnitPrice, Product2.Name, Product2.Description, Product2.Mark__c, Product2.Weight__c, Product2.Taste__c, Product2.ImageUrl__c
            FROM PricebookEntry 
            WHERE Product2Id = :productId
            AND Pricebook2.IsActive = true
            AND Pricebook2.Start_Date__c <= :TODAY 
            AND Pricebook2.End_Date__c >= :TODAY
            AND Product2.IsActive = true
            LIMIT 1
        ];

        return new ProductFullDescriptionWrapper(
            productEntry.Product2Id,
            productEntry.Product2.Name,
            productEntry.Product2.Description,
            productEntry.UnitPrice,
            productEntry.CurrencyIsoCode,
            productEntry.Product2.Mark__c,
            productEntry.Product2.Weight__c,
            productEntry.Product2.Taste__c,
            productEntry.Product2.ImageUrl__c
        );
    }

    public static List<ProductFullDescriptionWrapper> getProductsByTypeAndSubtype(String type, String subtype) {
        List<ProductFullDescriptionWrapper> productsListWrapper = new List<ProductFullDescriptionWrapper>();
        List<PricebookEntry> productsList = [
            SELECT Id, Product2Id, CurrencyIsoCode, UnitPrice, Product2.Name, Product2.Description, Product2.Mark__c, Product2.Weight__c, Product2.Taste__c, Product2.ImageUrl__c
            FROM PricebookEntry 
            WHERE Product2.Type__c = :type
            AND Product2.Subtype__c = :subtype
            AND Pricebook2.IsActive = true
            AND Pricebook2.Start_Date__c <= :TODAY 
            AND Pricebook2.End_Date__c >= :TODAY
            AND Product2.IsActive = true
        ];

        for (PricebookEntry entry : productsList) {
            productsListWrapper.add(new ProductFullDescriptionWrapper(
                entry.Product2Id,
                entry.Product2.Name,
                entry.Product2.Description,
                entry.UnitPrice,
                entry.CurrencyIsoCode,
                entry.Product2.Mark__c,
                entry.Product2.Weight__c,
                entry.Product2.Taste__c,
                entry.Product2.ImageUrl__c             
            ));
        }

        return productsListWrapper;
    }

    public static List<ProductFullDescriptionWrapper> getProductsBySearchQuery(String query) {
        String searchString = '%' + query + '%';
        List<ProductFullDescriptionWrapper> productsListWrapper = new List<ProductFullDescriptionWrapper>();
        List<PricebookEntry> productsList = [
            SELECT Id, Product2Id, CurrencyIsoCode, UnitPrice, Product2.Name, Product2.Description, Product2.Mark__c, Product2.Weight__c, Product2.Taste__c, Product2.ImageUrl__c
            FROM PricebookEntry 
            WHERE Product2.Name LIKE :searchString    
            AND Pricebook2.IsActive = true
            AND Pricebook2.Start_Date__c <= :TODAY 
            AND Pricebook2.End_Date__c >= :TODAY
            AND Product2.IsActive = true      
        ];

        if (!productsList.isEmpty()) {
            for (PricebookEntry entry : productsList) {
                productsListWrapper.add(new ProductFullDescriptionWrapper(
                    entry.Product2Id,
                    entry.Product2.Name,
                    entry.Product2.Description,
                    entry.UnitPrice,
                    entry.CurrencyIsoCode,
                    entry.Product2.Mark__c,
                    entry.Product2.Weight__c,
                    entry.Product2.Taste__c,
                    entry.Product2.ImageUrl__c             
                ));
            }
        }

        return productsListWrapper;
    }

    public static List<ProductBaseDataWrapper> getProducts() {
        List<ProductBaseDataWrapper> productsWithImageData = new List<ProductBaseDataWrapper>();
        List<PricebookEntry> productsList = [
            SELECT Id, Product2Id, CurrencyIsoCode, UnitPrice, Product2.Name, Product2.ImageUrl__c
            FROM PricebookEntry 
            WHERE Pricebook2.IsStandard = false
            AND Pricebook2.IsActive = true
            AND Pricebook2.Start_Date__c <= :TODAY 
            AND Pricebook2.End_Date__c >= :TODAY
            AND Product2.Type__c IN ('Coffee', 'Tea')
            AND Product2.IsActive = true
            LIMIT 9
        ];    

        for (PricebookEntry entry : productsList) {
            productsWithImageData.add(new ProductBaseDataWrapper(
                entry.Product2Id,
                entry.Product2.Name,
                entry.UnitPrice,
                entry.CurrencyIsoCode,
                entry.Product2.ImageUrl__c
            ));
        }

        return productsWithImageData;
    }

    public static List<ProductBaseDataWrapper> getProductsByIdsList(List<Id> idsList) {
        List<ProductBaseDataWrapper> productsData = new List<ProductBaseDataWrapper>();
        List<PricebookEntry> productsList = [
            SELECT Id, Product2Id, CurrencyIsoCode, UnitPrice, Product2.Name, Product2.ImageUrl__c
            FROM PricebookEntry 
            WHERE Product2.Id IN :idsList
            AND Pricebook2.IsStandard = false
            AND Pricebook2.IsActive = true
            AND Pricebook2.Start_Date__c <= :TODAY 
            AND Pricebook2.End_Date__c >= :TODAY
            AND Product2.IsActive = true
        ];    

        for (PricebookEntry entry : productsList) {
            productsData.add(new ProductBaseDataWrapper(
                entry.Product2Id,
                entry.Product2.Name,
                entry.UnitPrice,
                entry.CurrencyIsoCode,
                entry.Product2.ImageUrl__c
            ));
        }

        return productsData;
    }

    public class ProductBaseDataWrapper {
        @AuraEnabled
        public Id productId { get; set; }
        @AuraEnabled
        public String name { get; set; }
        @AuraEnabled
        public Decimal price { get; set; }
        @AuraEnabled
        public String currencyIsoCode { get; set; }
        @AuraEnabled
        public String imageUrl { get; set; }

        public ProductBaseDataWrapper(Id productId, String name, Decimal price, String currencyIsoCode, String imageUrl) {
            this.productId = productId;
            this.name = name;
            this.price = price;
            this.currencyIsoCode = currencyIsoCode;
            this.imageUrl = imageUrl;
        }
    } 

    public class ProductFullDescriptionWrapper {
        @AuraEnabled
        public Id productId { get; set; }
        @AuraEnabled
        public String name { get; set; }
        @AuraEnabled
        public String description { get; set; }
        @AuraEnabled
        public Decimal price { get; set; }
        @AuraEnabled
        public String currencyIsoCode { get; set; }
        @AuraEnabled
        public String mark { get; set; }
        @AuraEnabled
        public String weight { get; set; }
        @AuraEnabled
        public String taste { get; set; }
        @AuraEnabled
        public String imageUrl { get; set; }

        public ProductFullDescriptionWrapper(
            Id productId, 
            String name, 
            String description, 
            Decimal price, 
            String currencyIsoCode, 
            String mark, 
            String weight, 
            String taste, 
            String imageUrl
        ) {
            this.productId = productId;
            this.name = name;
            this.description = description;
            this.price = price;
            this.currencyIsoCode = currencyIsoCode;
            this.mark = mark;
            this.weight = weight;
            this.taste = taste;
            this.imageUrl = imageUrl;
        }
    } 
}