public with sharing class Pricebook2Service {
    
    public static List<Pricebook2> getAllPriceBooks() {
        return [
            SELECT Id, Name, Description, Start_Date__c, End_Date__c, IsInactive__c, IsActive
            FROM Pricebook2
            WHERE IsStandard = false
            WITH SECURITY_ENFORCED
        ];
    }

    public static void insertPriceBook(Pricebook2 priceBookData) {
        insert priceBookData;
    }

    public static void updatePriceBook(Pricebook2 priceBookData) {
        update priceBookData;
    }

    public static List<PricebookEntry> getStandardPricebookEntries(Id pricebookId) {
        Set<Id> existingProductIds = new Set<Id>();

        for (PricebookEntry existingEntry : [SELECT Product2Id FROM PricebookEntry WHERE Pricebook2Id = :pricebookId]) {
            existingProductIds.add(existingEntry.Product2Id);
        }
    
        return [
            SELECT Id, Name, UnitPrice, Product2Id 
            FROM PricebookEntry 
            WHERE Pricebook2.IsStandard = true 
            AND Product2Id NOT IN :existingProductIds
            WITH SECURITY_ENFORCED
        ];
    }

    public static void assignProductsToPriceBook(List<PricebookEntry> pricebookEntries) {
        insert pricebookEntries;
        system.debug('pricebookEntries: ' + pricebookEntries);
    }
}