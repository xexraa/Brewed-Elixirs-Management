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
}