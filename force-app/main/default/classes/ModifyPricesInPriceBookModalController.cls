public with sharing class ModifyPricesInPriceBookModalController {

    @AuraEnabled
    public static List<PricebookEntry> getPricebookEntriesForPricebook(Id pricebookId) {
        try {
            return PricebookEntryService.getPricebookEntriesForPricebook(pricebookId);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void updatePricebookEntries(List<PricebookEntry> pricebookEntries) {
        try {
            PricebookEntryDML.updatePricebookEntries(pricebookEntries);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}