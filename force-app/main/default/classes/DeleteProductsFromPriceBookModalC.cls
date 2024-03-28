public with sharing class DeleteProductsFromPriceBookModalC {

    @AuraEnabled
    public static List<PricebookEntry> getPricebookEntriesForPricebook(Id pricebookId) {
        try {
            return PricebookEntryService.getPricebookEntriesForPricebook(pricebookId);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void deletePricebookEntries(List<PricebookEntry> pricebookEntries) {
        try {
            PricebookEntryDML.deletePricebookEntries(pricebookEntries);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}