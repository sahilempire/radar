export const validateTrademarkForm = (formData) => {
  const errors = {};

  // Helper functions for validation
  const validateName = (name) => {
    if (!name?.trim()) return 'This field is required';
    if (name.length > 256) return 'Maximum 256 characters allowed';
    if (!/^[a-zA-Z0-9\s\-.,&()]+$/.test(name)) return 'No special characters allowed except -.,&()';
    return null;
  };

  const validateFile = (file, allowedTypes, maxSizeMB) => {
    if (!file) return null;
    const fileType = file.type.split('/')[1];
    if (!allowedTypes.includes(fileType)) {
      return `Only ${allowedTypes.join(', ')} files are allowed`;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      return `File size must be less than ${maxSizeMB}MB`;
    }
    return null;
  };

  const validateDate = (date) => {
    if (!date) return null;
    const inputDate = new Date(date);
    const today = new Date();
    if (inputDate > today) return 'Date cannot be in the future';
    return null;
  };

  // Step 1: Mark & Owner Details Validation
  const nameError = validateName(formData.trademarkName);
  if (nameError) errors.trademarkName = nameError;

  if (!formData.markType) {
    errors.markType = 'Mark type is required';
  }

  if (['Design Mark (logo or stylized text)', 'Color Mark'].includes(formData.markType)) {
    const fileError = validateFile(formData.logo, ['jpeg', 'png', 'svg'], 10);
    if (fileError) errors.logo = fileError;
    if (!formData.logoDescription?.trim()) {
      errors.logoDescription = 'Mark description is required';
    }
  }

  const ownerNameError = validateName(formData.ownerName);
  if (ownerNameError) errors.ownerName = ownerNameError;

  if (!formData.ownerType) {
    errors.ownerType = 'Owner type is required';
  }

  if (!formData.ownerAddress?.trim()) {
    errors.ownerAddress = 'Owner address is required';
  }

  // Step 2: Filing & Usage Validation
  if (!formData.filingBasis) {
    errors.filingBasis = 'Filing basis is required';
  }

  if (!formData.businessDescription?.trim()) {
    errors.businessDescription = 'Business description is required';
  }

  if (!formData.trademarkClass?.length) {
    errors.trademarkClass = 'At least one trademark class is required';
  }

  if (!formData.goodsServices?.trim()) {
    errors.goodsServices = 'Goods/services description is required';
  }

  // Use in Commerce specific validations
  if (formData.filingBasis === 'Use in Commerce (Section 1(a))') {
    const firstUseError = validateDate(formData.firstUseAnywhere);
    if (firstUseError) errors.firstUseAnywhere = firstUseError;

    const commerceUseError = validateDate(formData.firstUseCommerce);
    if (commerceUseError) errors.firstUseCommerce = commerceUseError;

    if (!formData.typeOfCommerce) {
      errors.typeOfCommerce = 'Type of commerce is required';
    }

    if (!formData.markUsage?.trim()) {
      errors.markUsage = 'Mark usage description is required';
    }

    const specimenError = validateFile(formData.specimen, ['jpeg', 'png', 'pdf'], 10);
    if (specimenError) errors.specimen = specimenError;
  }

  // Step 3: Priority & Declaration Validation
  if (formData.priorityClaim) {
    if (!formData.priorityCountry) {
      errors.priorityCountry = 'Priority country is required';
    }
    if (!formData.priorityAppNumber?.trim()) {
      errors.priorityAppNumber = 'Priority application number is required';
    }
    
    const priorityDateError = validateDate(formData.priorityFilingDate);
    if (priorityDateError) errors.priorityFilingDate = priorityDateError;

    const certifiedCopyError = validateFile(formData.certifiedCopy, ['pdf'], 10);
    if (certifiedCopyError) errors.certifiedCopy = certifiedCopyError;
  }

  if (!formData.declaration) {
    errors.declaration = 'You must agree to the declaration';
  }

  if (!formData.signature?.trim()) {
    errors.signature = 'Digital signature is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}; 