public with sharing class AddProductsToPriceBookModalController {
    
    @AuraEnabled
    public static List<PricebookEntry> getStandardPricebookEntries(Id pricebookId) {
        try {
            return Pricebook2Service.getStandardPricebookEntries(pricebookId);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void assignProductsToPriceBook(List<PricebookEntry> pricebookEntries) {
        try {
            Pricebook2Service.assignProductsToPriceBook(pricebookEntries);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}