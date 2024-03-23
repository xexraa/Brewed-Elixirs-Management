public with sharing class FileService {

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

    public static List<ContentVersion> getProductImages(Id productId) {
        // List<ContentVersion> imageUrls = new List<ContentVersion>();

        List<ContentDocumentLink> documentLinks = [SELECT ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId = :productId];

        if (!documentLinks.isEmpty()) {
            Set<Id> contentDocumentIds = new Set<Id>();
            for (ContentDocumentLink link : documentLinks) {
                contentDocumentIds.add(link.ContentDocumentId);
            }

            List<ContentVersion> contentVersions = [SELECT VersionDataUrl, IsMainImage__c FROM ContentVersion WHERE ContentDocumentId IN :contentDocumentIds];

            // for (ContentVersion cv : contentVersions) {
            //     imageUrls.add(cv.VersionDataUrl);
            // }
            return contentVersions;
        } else {
            return null;
        }

    }

    public static List<String> getImagesForProduct(Id productId) {
        List<String> imageUrls = new List<String>();
        
        List<ContentDocumentLink> documentLinks = [SELECT ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId = :productId];
        
        for (ContentDocumentLink link : documentLinks) {
            imageUrls.add('/sfc/servlet.shepherd/version/download/' + link.ContentDocumentId);
        }
        
        return imageUrls;
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