public with sharing class FileService {

    private final static String DEFAULT_IMAGE_NAME = Constants.DEFAULT_IMAGE_NAME;

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

    public static void assignProductMainImage(Id imageId, Id productId) {
        List<ContentDocumentLink> productDocumentLinks = [SELECT ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId = :productId];

        Set<Id> documentIds = new Set<Id>();
        for(ContentDocumentLink link : productDocumentLinks) {
            documentIds.add(link.ContentDocumentId);
        }

        List<ContentVersion> productContentVersions = [SELECT Id, IsMainImage__c FROM ContentVersion WHERE Id IN :documentIds];

        Boolean mainImageExists = false;
        for(ContentVersion cv : productContentVersions) {
            if (cv.IsMainImage__c) {
                mainImageExists = true;
                break;
            }
        }

        if (!mainImageExists) {
            update new ContentVersion(
                Id = imageId,
                IsMainImage__c = true
            );
        }
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

    public static String getProductMainImage(Id productId) {
        List<ContentVersion> productImages = getProductImages(productId);
        String imageUrl;

        if (!productImages.isEmpty()) {
            for (ContentVersion image : productImages) {
                if (image.IsMainImage__c) {
                    return imageUrl = image.VersionDataUrl;
                }
            }
            return imageUrl = productImages[0].VersionDataUrl;
        } else {
            return imageUrl = '/resource/' + DEFAULT_IMAGE_NAME;
        }
    }
}