public with sharing class PriceManagementTabController {
    
    @AuraEnabled(Cacheable=true)
    public static List<Pricebook2> getAllPriceBooks() {
        try {
            return Pricebook2Service.getAllPriceBooks();
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static List<PricebookEntry> getPricebookEntriesForPricebook(Id pricebookId) {
        try {
            return PricebookEntryService.getPricebookEntriesForPricebook(pricebookId);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}