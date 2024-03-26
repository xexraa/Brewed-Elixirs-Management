public with sharing class AddNewPriceBookModalController {
    
    @AuraEnabled
    public static void insertPriceBook(Pricebook2 priceBookData) {
        try {
            Pricebook2Service.insertPriceBook(priceBookData);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}