public with sharing class FileService {

    private final static String DEFAULT_IMAGE_NAME = Constants.DEFAULT_IMAGE_NAME;

    public static void assignImagesToProduct(Id documentId, Id contentVersionId, Id productId) {
        ContentDocumentLink link = new ContentDocumentLink(
            ContentDocumentId = documentId,
            LinkedEntityId = productId,
            ShareType = 'V',
            Visibility = 'AllUsers'
        );
        insert link;

        ContentDistribution cd = new ContentDistribution(
            Name = productId,
            ContentVersionId = contentVersionId,
            PreferencesAllowViewInBrowser = true
        );
        // insert cd;

        system.debug('link ' + link);
        system.debug('cd ' + cd);
    }

    public static void assignDefaultImageToProduct(Id productId) {
        StaticResource sr = [SELECT Id, Body, Name, ContentType FROM StaticResource WHERE Name = :DEFAULT_IMAGE_NAME LIMIT 1];

        ContentVersion cv = new ContentVersion();
        cv.Title = sr.Name;
        cv.PathOnClient = sr.Name + '.' + getFileExtension(sr.ContentType);
        cv.VersionData = sr.Body;
        cv.FirstPublishLocationId = productId;
        cv.IsMainImage__c = true;
        
        insert cv;

        system.debug('cv ' + cv);
    }

    public static List<ContentVersion> getProductImages(Id productId) {
        Set<Id> contentDocumentIds = new Set<Id>();

        List<ContentDocumentLink> documentLinks = [SELECT ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId = :productId];

        if (!documentLinks.isEmpty()) {
            for (ContentDocumentLink link : documentLinks) {
                contentDocumentIds.add(link.ContentDocumentId);
            }
        }

        return [SELECT VersionDataUrl, IsMainImage__c, Title, FileExtension FROM ContentVersion WHERE ContentDocumentId IN :contentDocumentIds];
    }

    public static void changeProductMainImage(Id oldImageId, Id newImageId) {
        if (oldImageId != null) {
            update new ContentVersion(
                Id = oldImageId,
                IsMainImage__c = false
            );
        }

        update new ContentVersion(
            Id = newImageId,
            IsMainImage__c = true
        );
    }

    public static List<String> getImagesForProduct(Id productId) {
        List<String> imageUrls = new List<String>();
        
        List<ContentDocumentLink> documentLinks = [SELECT ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId = :productId];
        
        for (ContentDocumentLink link : documentLinks) {
            imageUrls.add('/sfc/servlet.shepherd/version/download/' + link.ContentDocumentId);
        }
        
        return imageUrls;
    }

    private static String getFileExtension(String contentType) {
        return contentType.substringAfter('image/');
    }

    // public static void assignImageToProduct(String imageTitle, Id productId) {
    //     ContentVersion cv = [SELECT Id, ContentDocumentId, VersionDataUrl FROM ContentVersion WHERE Title = :imageTitle LIMIT 1];

    //     if (cv != null) {
    //         ContentDocumentLink link = new ContentDocumentLink();
    //         link.ContentDocumentId = cv.ContentDocumentId;
    //         link.LinkedEntityId = productId;
    //         link.ShareType = 'V';
    //         link.Visibility = 'AllUsers';
    //         insert link;

    //         Product2Service.updateProductImageUrl(cv.VersionDataUrl, productId);

    //         ContentDistribution cd = new ContentDistribution(
    //             Name = productId,
    //             ContentVersionId = cv.Id,
    //             PreferencesAllowViewInBrowser = true
    //         );
    //         insert cd;
    //     }
    // }
}