@isTest
public class Constants {
    
    public static final String ORDER_STATUS_DRAFT = 'Draft';
    public static final String ORDER_IN_PACKING_STATUS = 'In Packing';
    public static final String ORDER_SENT_STATUS = 'Sent';
    public static final String SUMMARY_FILE_NAME = BrewedElixirsSettings__mdt.getInstance('BrewedElixirsSettings').SummaryFileName__c;
    public static final Id CURRENT_USER_CONTACT_ID = UserService.getCurrentUserContactId();
    public static final Date TODAY = Date.today();
    public static final Date THREE_DAYS_AGO = TODAY.addDays(-3);
    public static final String SUMMARY_EMAIL_TEMPLATE = 'Brewed_Elixirs_Summary';
    public static final String ORDER_SENT_EMAIL_TEMPLATE = 'Brewed_Elixirs_Order_Sent';
    public static final String DEFAULT_IMAGE_NAME = 'DefaultImage';
}