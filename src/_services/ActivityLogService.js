import DeforestationService from './DeforestationService';

class ActivityLogService {
    async createActivityLog(input) {
        try {
            // Get the DDS user ID instead of using the main user ID
            let ddsUserId = input.userId;
            
            try {
                const ddsUserResponse = await DeforestationService.currentUserDeforestation();
                const ddsUser = ddsUserResponse?.data?.currentUserDDS?.userDetail;
                if (ddsUser && ddsUser.id) {
                    ddsUserId = ddsUser.id;
                }
            } catch (ddsUserError) {
                // Fall back to main user ID if DDS user can't be retrieved
            }
            
            const mappedInput = {
                diligence_id: parseInt(input.diligenceId),
                user_id: parseInt(ddsUserId),
                activity: input.activity,
                description: input.description
            };
                        
            console.log('Creating activity log with data:', mappedInput);

            const response = await DeforestationService.createDiligenceActivityLog(mappedInput);
            console.log('Activity log response:', response);

            if (response && response.errors && response.errors.length > 0) {
                return null;
            }
            
            if (!response || !response.data || !response.data.createDiligenceActivityLog) {
                return null;
            }
            
            return response;
        } catch (error) {
            return null;
        }
    }

    // ===== REPORT DETAILS SEGMENT =====
    
    async logDDSReportCreated(diligenceId, userId, reportType = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Report Details',
            description: `Created new ${reportType} due diligence report`
        });
    }

    async logDDSReportDetailsUpdated(diligenceId, userId, changes = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Report Details',
            description: `Updated report details${changes ? `: ${changes}` : ''}`
        });
    }

    async logDDSInternalReferenceNumberUpdated(diligenceId, userId, oldNumber, newNumber) {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Report Details',
            description: `Changed internal reference number from "${oldNumber}" to "${newNumber}"`
        });
    }

    async logDDSEUDRReferenceNumberUpdated(diligenceId, userId, oldNumber, newNumber) {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Report Details',
            description: `Changed EUDR reference number from "${oldNumber}" to "${newNumber}"`
        });
    }

    async logDDSProductInformationUpdated(diligenceId, userId, productName, changes = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Report Details',
            description: `Updated product information for ${productName}${changes ? `: ${changes}` : ''}`
        });
    }

    async logDDSCountryOfActivityUpdated(diligenceId, userId, oldCountries, newCountries) {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Report Details',
            description: `Updated countries of activity from "${oldCountries}" to "${newCountries}"`
        });
    }

    async logDDSContainerInformationUpdated(diligenceId, userId, containerCount, changes = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Report Details',
            description: `Updated ${containerCount} container(s) information${changes ? `: ${changes}` : ''}`
        });
    }

    // ===== PRODUCTION PLACE SEGMENT =====

    async logDDSSupplierAssigned(diligenceId, userId, supplierName, supplierEmail = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Production Place',
            description: `Assigned supplier: ${supplierName}${supplierEmail ? ` (${supplierEmail})` : ''}`
        });
    }

    async logDDSOperatorAssigned(diligenceId, userId, operatorName, operatorEmail = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Production Place',
            description: `Assigned operator: ${operatorName}${operatorEmail ? ` (${operatorEmail})` : ''}`
        });
    }

    async logDDSSupplierChanged(diligenceId, userId, oldSupplier, newSupplier) {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Production Place',
            description: `Changed supplier from "${oldSupplier}" to "${newSupplier}"`
        });
    }

    async logDDSOperatorChanged(diligenceId, userId, oldOperator, newOperator) {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Production Place',
            description: `Changed operator from "${oldOperator}" to "${newOperator}"`
        });
    }

    async logDDSExporterSearched(diligenceId, userId, exporterEmail, searchResult = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Production Place',
            description: `Searched for exporter with email: ${exporterEmail}${searchResult ? ` - Result: ${searchResult}` : ''}`
        });
    }

    async logDDSExporterAssigned(diligenceId, userId, exporterName, exporterEmail = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Production Place',
            description: `Assigned exporter: ${exporterName}${exporterEmail ? ` (${exporterEmail})` : ''}`
        });
    }

    async logDDSSupplierAdded(diligenceId, userId, supplierName, supplierEmail = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Production Place',
            description: `Added supplier: ${supplierName}${supplierEmail ? ` (${supplierEmail})` : ''}`
        });
    }

    async logDDSSupplierRemoved(diligenceId, userId, supplierName, reason = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Production Place',
            description: `Removed supplier: ${supplierName}${reason ? ` - Reason: ${reason}` : ''}`
        });
    }

    async logDDSOperatorRemoved(diligenceId, userId, operatorName, reason = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Production Place',
            description: `Removed operator: ${operatorName}${reason ? ` - Reason: ${reason}` : ''}`
        });
    }

    async logDDSProductionPlaceAdded(diligenceId, userId, placeName, placeType = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Production Place',
            description: `Added ${placeType} production place: ${placeName}`
        });
    }

    async logDDSProductionPlaceUpdated(diligenceId, userId, placeName, changes = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Production Place',
            description: `Updated production place: ${placeName}${changes ? ` - Changes: ${changes}` : ''}`
        });
    }

    async logDDSProductionPlaceDeleted(diligenceId, userId, placeName, reason = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Production Place',
            description: `Deleted production place: ${placeName}${reason ? ` - Reason: ${reason}` : ''}`
        });
    }

    async logDDSProductionPlaceRestored(diligenceId, userId, placeName) {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Production Place',
            description: `Restored production place: ${placeName}`
        });
    }

    async logDDSProductionPlacesBulkDeleted(diligenceId, userId, placeCount, reason = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Production Place',
            description: `Bulk deleted ${placeCount} production places${reason ? ` - Reason: ${reason}` : ''}`
        });
    }

    async logDDSProductionPlacesBulkRestored(diligenceId, userId, placeCount) {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Production Place',
            description: `Bulk restored ${placeCount} production places`
        });
    }

    async logDDSMultipleProductionPlacesDeleted(diligenceId, userId, placeCount, reason = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Production Place',
            description: `Deleted ${placeCount} production places${reason ? ` - Reason: ${reason}` : ''}`
        });
    }

    // ===== LOCATION VERIFICATION SEGMENT =====

    async logDDSGeolocationPrivacyUpdated(diligenceId, userId, isPrivate) {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Location Verification',
            description: `Updated geolocation privacy to: ${isPrivate ? 'Private' : 'Public'}`
        });
    }

    async logDDSLocationOverlapCheckStarted(diligenceId, userId) {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Location Verification',
            description: 'Started checking for location overlaps and conflicts'
        });
    }

    async logDDSLocationOverlapCheckCompleted(diligenceId, userId, result, warningCount = 0) {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Location Verification',
            description: `Completed location overlap check with result: ${result}${warningCount > 0 ? ` - ${warningCount} warning(s) found` : ''}`
        });
    }

    async logDDSLocationOverlapCheckFailed(diligenceId, userId, error = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Location Verification',
            description: `Failed to check location overlaps${error ? `: ${error}` : ''}`
        });
    }

    async logDDSGeofenceCreated(diligenceId, userId, farmId, farmName = '', geofenceType = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Location Verification',
            description: `Created ${geofenceType} geofence for farm${farmName ? `: ${farmName}` : ''} (Farm ID: ${farmId})`
        });
    }

    async logDDSGeofenceUpdated(diligenceId, userId, farmId, farmName = '', changes = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Location Verification',
            description: `Updated geofence for farm${farmName ? `: ${farmName}` : ''} (Farm ID: ${farmId})${changes ? ` - Changes: ${changes}` : ''}`
        });
    }

    async logDDSGeofenceDeleted(diligenceId, userId, farmId, farmName = '', reason = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Location Verification',
            description: `Deleted geofence for farm${farmName ? `: ${farmName}` : ''} (Farm ID: ${farmId})${reason ? ` - Reason: ${reason}` : ''}`
        });
    }

    async logDDSGeofenceEdited(diligenceId, userId, farmId, farmName = '', geofenceType = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Location Verification',
            description: `Edited ${geofenceType} geofence for farm${farmName ? `: ${farmName}` : ''} (Farm ID: ${farmId})`
        });
    }

    async logDDSGeofenceViewed(diligenceId, userId, farmId, farmName = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Location Verification',
            description: `Viewed geofence for farm${farmName ? `: ${farmName}` : ''} (Farm ID: ${farmId})`
        });
    }

    // ===== EUDR DEFORESTATION ASSESSMENT SEGMENT =====

    async logDDSReportUploadedToEU(diligenceId, userId, reportType = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'EUDR Deforestation Assessment',
            description: `Uploaded ${reportType} report to EU portal`
        });
    }

    async logDDSBlockchainUploadStarted(diligenceId, userId) {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'EUDR Deforestation Assessment',
            description: 'Started blockchain upload process'
        });
    }

    async logDDSBlockchainUploadCompleted(diligenceId, userId) {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'EUDR Deforestation Assessment',
            description: 'Successfully completed blockchain upload'
        });
    }

    async logDDSBlockchainUploadFailed(diligenceId, userId, error = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'EUDR Deforestation Assessment',
            description: `Blockchain upload failed${error ? `: ${error}` : ''}`
        });
    }

    // ===== REGIONAL RISK ASSESSMENT SEGMENT =====

    async logDDSRegionalRiskCriteriaUpdated(diligenceId, userId, criteriaType, oldValue, newValue) {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Regional Risk Assessment',
            description: `${criteriaType} criteria changed from "${oldValue}" to "${newValue}"`
        });
    }

    async logDDSProtectedAreasCriteriaUpdated(diligenceId, userId, criteriaType, oldValue, newValue) {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Regional Risk Assessment',
            description: `${criteriaType} criteria changed from "${oldValue}" to "${newValue}"`
        });
    }

    // ===== RISK ASSESSMENT SEGMENT =====

    async logDDSRiskMitigationStarted(diligenceId, userId, farmId = '', farmName = '', riskType = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Risk Assessment',
            description: `Started risk mitigation${farmId ? ` for farm ID: ${farmId}` : ''}${farmName ? `: ${farmName}` : ''}${riskType ? ` - Risk type: ${riskType}` : ''}`
        });
    }

    async logDDSRiskMitigationCompleted(diligenceId, userId, farmId = '', farmName = '', riskType = '', outcome = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Risk Assessment',
            description: `Completed risk mitigation${farmId ? ` for farm ID: ${farmId}` : ''}${farmName ? `: ${farmName}` : ''}${riskType ? ` - Risk type: ${riskType}` : ''}${outcome ? ` - Outcome: ${outcome}` : ''}`
        });
    }

    async logDDSEUDRDeforestationAnalysisCompleted(diligenceId, userId, issueCount = 0) {
        let description = 'Completed EUDR deforestation analysis';
        
        if (issueCount > 0) {
            description += ` - Found ${issueCount} issue(s)`;
        } else {
            description += ' - No issues found';
        }
        
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'EUDR Deforestation Assessment',
            description: description
        });
    }

    async logDDSRiskMitigationFailed(diligenceId, userId, farmId = '', farmName = '', riskType = '', reason = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Risk Assessment',
            description: `Failed risk mitigation${farmId ? ` for farm ID: ${farmId}` : ''}${farmName ? `: ${farmName}` : ''}${riskType ? ` - Risk type: ${riskType}` : ''}${reason ? ` - Reason: ${reason}` : ''}`
        });
    }

    async logDDSManualMitigationStarted(diligenceId, userId, farmId = '', farmName = '', riskType = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Risk Assessment',
            description: `Started manual mitigation${farmId ? ` for farm ID: ${farmId}` : ''}${farmName ? `: ${farmName}` : ''}${riskType ? ` - Risk type: ${riskType}` : ''}`
        });
    }

    async logDDSManualMitigationCompleted(diligenceId, userId, farmId = '', farmName = '', riskType = '', outcome = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Risk Assessment',
            description: `Completed manual mitigation${farmId ? ` for farm ID: ${farmId}` : ''}${farmName ? `: ${farmName}` : ''}${riskType ? ` - Risk type: ${riskType}` : ''}${outcome ? ` - Outcome: ${outcome}` : ''}`
        });
    }

    async logDDSManualMitigationFailed(diligenceId, userId, farmId = '', farmName = '', riskType = '', reason = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Risk Assessment',
            description: `Failed manual mitigation${farmId ? ` for farm ID: ${farmId}` : ''}${farmName ? `: ${farmName}` : ''}${riskType ? ` - Risk type: ${riskType}` : ''}${reason ? ` - Reason: ${reason}` : ''}`
        });
    }

    async logDDSSurveyStarted(diligenceId, userId, surveyName, farmId = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Risk Assessment',
            description: `Started survey: ${surveyName}${farmId ? ` (Farm ID: ${farmId})` : ''}`
        });
    }

    async logDDSSurveyCompleted(diligenceId, userId, surveyName, farmId = '', responseCount = 0) {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Risk Assessment',
            description: `Completed survey: ${surveyName}${farmId ? ` (Farm ID: ${farmId})` : ''}${responseCount > 0 ? ` with ${responseCount} responses` : ''}`
        });
    }

    async logDDSSurveyResponseSubmitted(diligenceId, userId, surveyName, farmId = '', responseCount = 0) {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Risk Assessment',
            description: `Submitted survey response for ${surveyName}${farmId ? ` (Farm ID: ${farmId})` : ''}${responseCount > 0 ? ` with ${responseCount} responses` : ''}`
        });
    }

    // Warning operations - called from CreateDueDiligenceReport.vue during farm validation
    async logDDSWarningGenerated(diligenceId, userId, warningType, warningMessage = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Risk Assessment',
            description: `Generated ${warningType} warning${warningMessage ? `: ${warningMessage}` : ''}`
        });
    }

    async logDDSWarningResolved(diligenceId, userId, warningType, resolution = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Risk Assessment',
            description: `Resolved ${warningType} warning${resolution ? ` - Resolution: ${resolution}` : ''}`
        });
    }

    // File operations - called from EUDRDeforestationAssessment.vue during risk mitigation
    async logDDSFileUploaded(diligenceId, userId, fileName, fileType = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Risk Assessment',
            description: `Uploaded file: ${fileName}${fileType ? ` (Type: ${fileType})` : ''}`
        });
    }

    async logDDSFileDeleted(diligenceId, userId, fileName, fileType = '', reason = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Risk Assessment',
            description: `Deleted file: ${fileName}${fileType ? ` (Type: ${fileType})` : ''}${reason ? ` - Reason: ${reason}` : ''}`
        });
    }

    async logDDSFileDownloaded(diligenceId, userId, fileName, fileType = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Risk Assessment',
            description: `Downloaded file: ${fileName}${fileType ? ` (Type: ${fileType})` : ''}`
        });
    }

    async logDDSDocumentUploaded(diligenceId, userId, documentName, documentType = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Risk Assessment',
            description: `Uploaded document: ${documentName}${documentType ? ` (Type: ${documentType})` : ''}`
        });
    }

    async logDDSDocumentUpdated(diligenceId, userId, documentName, documentType = '', changes = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Risk Assessment',
            description: `Updated document: ${documentName}${documentType ? ` (Type: ${documentType})` : ''}${changes ? ` - Changes: ${changes}` : ''}`
        });
    }

    async logDDSDocumentDeleted(diligenceId, userId, documentName, documentType = '', reason = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Risk Assessment',
            description: `Deleted document: ${documentName}${documentType ? ` (Type: ${documentType})` : ''}${reason ? ` - Reason: ${reason}` : ''}`
        });
    }

    // ===== FINAL REPORT SEGMENT =====

    async logDDSReportStatusUpdated(diligenceId, userId, oldStatus, newStatus) {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Final Report',
            description: `Report status changed from "${oldStatus}" to "${newStatus}"`
        });
    }

    async logDDSReportPublished(diligenceId, userId, publishType = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Final Report',
            description: `Published report${publishType ? ` as ${publishType}` : ''}`
        });
    }

    async logDDSReportApprovedByUser(diligenceId, userId, approverName = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Final Report',
            description: `Report approved${approverName ? ` by ${approverName}` : ''}`
        });
    }

    async logDDSReportRejectedByUser(diligenceId, userId, rejectorName = '', reason = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Final Report',
            description: `Report rejected${rejectorName ? ` by ${rejectorName}` : ''}${reason ? ` - Reason: ${reason}` : ''}`
        });
    }

    async logDDSReportSentToOperator(diligenceId, userId, operatorName = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Final Report',
            description: `Report sent to operator${operatorName ? `: ${operatorName}` : ''}`
        });
    }

    async logDDSReportSharedWithExporter(diligenceId, userId, exporterName = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Final Report',
            description: `Report shared with exporter${exporterName ? `: ${exporterName}` : ''}`
        });
    }

    async logDDSReportSaved(diligenceId, userId) {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Final Report',
            description: 'Report saved successfully'
        });
    }

    async logDDSReportAssigned(diligenceId, userId, assignedToUserId, assignedToName) {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Final Report',
            description: `Report assigned to: ${assignedToName} (ID: ${assignedToUserId})`
        });
    }

    async logDDSReportAssignmentFailed(diligenceId, userId, assignedToUserId, assignedToName, reason) {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Final Report',
            description: `Failed to assign report to: ${assignedToName} (ID: ${assignedToUserId}). Reason: ${reason}`
        });
    }

    async logDDSReportApproved(diligenceId, userId, approvalType = 'permanent') {
        const typeText = approvalType === 'temporary' ? 'Temporary Approval' : 'Permanent Approval';
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Final Report',
            description: `Report ${typeText} granted`
        });
    }

    async logDDSReportApprovalFailed(diligenceId, userId, reason) {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Final Report',
            description: `Report approval failed. Reason: ${reason}`
        });
    }

    async logDSTemporaryApprovalExpirationSet(diligenceId, userId, expirationValue, expirationUnit) {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Final Report',
            description: `Set temporary approval expiration to ${expirationValue} ${expirationUnit}`
        });
    }

    async logDDSReportRejected(diligenceId, userId, reason = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Final Report',
            description: `Report rejected${reason ? ` - Reason: ${reason}` : ''}`
        });
    }

    async logDDSReportRejectionFailed(diligenceId, userId, reason) {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Final Report',
            description: `Report rejection failed. Reason: ${reason}`
        });
    }

    async logDDSReportStatusChanged(diligenceId, userId, oldStatus, newStatus) {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Final Report',
            description: `Report status changed from "${oldStatus}" to "${newStatus}"`
        });
    }

    async logDDSReportStatusLegendsUpdated(diligenceId, userId, legendType, changes = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Final Report',
            description: `Updated ${legendType} status legends${changes ? ` - Changes: ${changes}` : ''}`
        });
    }

    async logDDSReportReviewStarted(diligenceId, userId, reviewerName = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Final Report',
            description: `Report review started${reviewerName ? ` by ${reviewerName}` : ''}`
        });
    }

    async logDDSReportReviewCompleted(diligenceId, userId, reviewerName = '', outcome = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Final Report',
            description: `Report review completed${reviewerName ? ` by ${reviewerName}` : ''}${outcome ? ` - Outcome: ${outcome}` : ''}`
        });
    }

    async logDDSReportUnderReview(diligenceId, userId) {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Final Report',
            description: 'Report marked as under review'
        });
    }

    async logDDSReportReadyToProceed(diligenceId, userId) {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Final Report',
            description: 'Report marked as ready to proceed'
        });
    }

    async logDDSReportProcessingFarms(diligenceId, userId, farmCount = 0) {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Final Report',
            description: `Processing farms for report${farmCount > 0 ? ` (${farmCount} farms)` : ''}`
        });
    }

    async logDDSReportAnalyzingDeforestation(diligenceId, userId) {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Final Report',
            description: 'Analyzing deforestation data for report'
        });
    }

    async logDDSReportCompliant(diligenceId, userId) {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Final Report',
            description: 'Report marked as compliant'
        });
    }

    async logDDSReportNonCompliant(diligenceId, userId, reason = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Final Report',
            description: `Report marked as non-compliant${reason ? ` - Reason: ${reason}` : ''}`
        });
    }

    async logDDSReportMitigationRequired(diligenceId, userId, mitigationType = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Final Report',
            description: `Report marked as requiring mitigation${mitigationType ? ` - Type: ${mitigationType}` : ''}`
        });
    }

    async logDDSReportDuplicated(diligenceId, userId, originalReportId = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Final Report',
            description: `Report duplicated${originalReportId ? ` from report ID: ${originalReportId}` : ''}`
        });
    }

    async logDDSReportDeleted(diligenceId, userId, reason = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Final Report',
            description: `Report deleted${reason ? ` - Reason: ${reason}` : ''}`
        });
    }

    async logDDSReportDownloaded(diligenceId, userId, format = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Final Report',
            description: `Report downloaded${format ? ` in ${format} format` : ''}`
        });
    }

    async logDDSReportExported(diligenceId, userId, exportFormat = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Final Report',
            description: `Report exported${exportFormat ? ` in ${exportFormat} format` : ''}`
        });
    }

    async logDDSReportFilterApplied(diligenceId, userId, filterType, filterValue = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Final Report',
            description: `Applied ${filterType} filter${filterValue ? `: ${filterValue}` : ''}`
        });
    }

    async logDDSReportSearchPerformed(diligenceId, userId, searchTerm = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Final Report',
            description: `Performed search${searchTerm ? ` for: ${searchTerm}` : ''}`
        });
    }

    // Dispute operations - typically occur during Final Report review/approval (not currently called but likely to be used in dispute resolution)
    async logDDSDisputeCreated(diligenceId, userId, disputeType, disputeReason = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Final Report',
            description: `Created ${disputeType} dispute${disputeReason ? ` - Reason: ${disputeReason}` : ''}`
        });
    }

    async logDDSDisputeUpdated(diligenceId, userId, disputeType, changes = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Final Report',
            description: `Updated ${disputeType} dispute${changes ? ` - Changes: ${changes}` : ''}`
        });
    }

    async logDDSDisputeResolved(diligenceId, userId, disputeType, resolution = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Final Report',
            description: `Resolved ${disputeType} dispute${resolution ? ` - Resolution: ${resolution}` : ''}`
        });
    }

    async logDDSDisputeReopened(diligenceId, userId, disputeType, reason = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Final Report',
            description: `Reopened ${disputeType} dispute${reason ? ` - Reason: ${reason}` : ''}`
        });
    }

    // Comment operations - typically occur during Final Report review/feedback (not currently called but likely to be used)
    async logDDSCommentAdded(diligenceId, userId, commentType, commentText = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Final Report',
            description: `Added ${commentType} comment${commentText ? `: ${commentText.substring(0, 100)}${commentText.length > 100 ? '...' : ''}` : ''}`
        });
    }

    async logDDSCommentUpdated(diligenceId, userId, commentType, commentText = '', changes = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Final Report',
            description: `Updated ${commentType} comment${commentText ? `: ${commentText.substring(0, 100)}${commentText.length > 100 ? '...' : ''}` : ''}${changes ? ` - Changes: ${changes}` : ''}`
        });
    }

    async logDDSCommentDeleted(diligenceId, userId, commentType, reason = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Final Report',
            description: `Deleted ${commentType} comment${reason ? ` - Reason: ${reason}` : ''}`
        });
    }

    // User assignment operations - called from AdminDueDiligenceReportsComponent.vue
    async logDDSUserAssignedToReports(diligenceId, userId, assignedUserId, assignedUserName, reportCount) {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Final Report',
            description: `User ${assignedUserName} (ID: ${assignedUserId}) assigned to ${reportCount} reports`
        });
    }

    async logDDSUserRemovedFromReports(diligenceId, userId, removedUserId, removedUserName, reportCount) {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Final Report',
            description: `User ${removedUserName} (ID: ${removedUserId}) removed from ${reportCount} reports`
        });
    }

    // Report viewing operations - not currently called but likely to be used in report review
    async logDDSReportViewed(diligenceId, userId, viewType) {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Final Report',
            description: `Report viewed in ${viewType} mode`
        });
    }

    async logReportViewed(diligenceId, userId, viewType = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Final Report',
            description: `Report viewed${viewType ? ` in ${viewType} mode` : ''}`
        });
    }

    // Status change operations - called from FinalReport.vue
    async logStatusChange(diligenceId, userId, oldStatus, newStatus, reason = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Final Report',
            description: `Status changed from ${oldStatus} to ${newStatus}${reason ? ` - Reason: ${reason}` : ''}`
        });
    }

    async logReportDownload(diligenceId, userId, format = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Final Report',
            description: `Report downloaded${format ? ` in ${format} format` : ''}`
        });
    }

    // ===== APPROVAL FLOW SEGMENT =====

    // Bulk operations - called from AdminDueDiligenceReportsComponent.vue in approval flow
    async logDDSBulkReportsAssigned(diligenceId, userId, assignedToUserId, assignedToName, reportCount) {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Approval Flow',
            description: `Bulk assigned ${reportCount} reports to: ${assignedToName} (ID: ${assignedToUserId})`
        });
    }

    async logDDSBulkReportsApproved(diligenceId, userId, approvalType, reportCount) {
        const typeText = approvalType === 'temporary' ? 'Temporary Approval' : 'Permanent Approval';
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Approval Flow',
            description: `Bulk ${typeText} granted for ${reportCount} reports`
        });
    }

    async logDDSBulkReportsRejected(diligenceId, userId, reportCount, reason = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Approval Flow',
            description: `Bulk rejected ${reportCount} reports${reason ? ` - Reason: ${reason}` : ''}`
        });
    }

    // Generic bulk operations - not currently called but available for future use
    async logDDSBulkOperationStarted(diligenceId, userId, operationType, itemCount = 0) {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Approval Flow',
            description: `Started bulk ${operationType} operation${itemCount > 0 ? ` on ${itemCount} items` : ''}`
        });
    }

    async logDDSBulkOperationCompleted(diligenceId, userId, operationType, itemCount = 0) {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Approval Flow',
            description: `Completed bulk ${operationType} operation${itemCount > 0 ? ` on ${itemCount} items` : ''}`
        });
    }

    async logDDSBulkOperationFailed(diligenceId, userId, operationType, reason = '') {
        return this.createActivityLog({
            diligenceId,
            userId,
            activity: 'Approval Flow',
            description: `Bulk ${operationType} failed. Reason: ${reason}`
        });
    }
}

export default new ActivityLogService();
