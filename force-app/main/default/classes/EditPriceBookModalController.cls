public with sharing class EditPriceBookModalController {
    
    @AuraEnabled
    public static void updatePriceBook(Pricebook2 priceBookData) {
        try {
            Pricebook2Service.updatePriceBook(priceBookData);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}