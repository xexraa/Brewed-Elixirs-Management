public with sharing class PricebookEntryDML {

    public static void assignProductsToPriceBook(List<PricebookEntry> pricebookEntries) {
        insert pricebookEntries;
    }
    
    public static void updatePricebookEntries(List<PricebookEntry> pricebookEntries) {
        update pricebookEntries;
    }

    public static void deletePricebookEntries(List<PricebookEntry> pricebookEntries) {
        delete pricebookEntries;
    }
}