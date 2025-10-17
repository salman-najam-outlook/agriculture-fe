<template>
  <div class="esg-guide-page">
    <!-- Breadcrumbs -->
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    
    <!-- Header with Title and Download Button -->
    <div>
      <div class="header-content">
        <h1 class="page-title">ESG Guide</h1>
        <v-btn 
          class="download-btn-header" 
          color="primary"
          @click="downloadPDF"
        >
          DOWNLOAD PDF
        </v-btn>
      </div>
    </div>
    
    <div class="page-container">
      <!-- Header - Fixed -->
      <div class="page-header">
        <div class="text-center mb-4">
          <h2 class="guide-subtitle">Your Essential Guide Hub</h2>
        </div>
      </div>

      <!-- Scrollable Content Section -->
      <div class="page-content">
        <div class="content-section">
          <h3 class="section-title mb-4">ESG: Environmental, Social, and Governance</h3>
          
          <p class="content-text mb-4">
            ESG stands for Environmental, Social, and Governance, representing three fundamental dimensions used to evaluate the sustainability 
            and ethical impact of an organization's operations and management.
          </p>

          <p class="content-text mb-4">
            The Environmental aspect considers a company's impact on the natural world, including its use of resources, waste generation, and 
            contribution to climate change. The Social dimension examines the company's relationships with and impact on people, encompassing 
            labor practices, community engagement, and product responsibility. Finally, Governance refers to the system of rules, practices, and 
            processes by which a business is directed and controlled, including corporate leadership, ethics, and accountability.
          </p>

          <div class="standards-section mb-4">
            <h4 class="standards-title mb-3">1. ESG Standard</h4>
            <p class="content-text mb-3">
              An ESG Standard is a recognized and established set of guidelines and requirements that provide a structured approach for 
              organizations to identify, measure, and report their performance on Environmental, Social, and Governance topics. These standards 
              provide consistency and comparability in ESG disclosure across different companies and sectors. They often specify the metrics to be 
              tracked and the format for reporting this information, ensuring transparency and accountability.
            </p>
            <p class="content-text mb-3">
              What rules or reporting frameworks should we align with? This question is answered by understanding ESG Standards. They guide how 
              sustainability goals are defined and ultimately disclosed. Furthermore, these standards help organizations determine which ESG Topics 
              are most relevant to their specific industry, adhering to a particular standard often requires the use of specific sustainability indices and 
              methodologies to calculate and report ESG indicators.
            </p>
            <p class="content-text mb-3">
              Examples of prominent ESG Standards include ESRS (European Sustainability Reporting Standards), GRI (Global Reporting Initiative), SASB 
              (Sustainability Accounting Standards Board), TCFD (Task Force on Climate-related Financial Disclosures), and ISO 26000.
            </p>
          </div>

          <div class="guide-section mb-4">
            <h4 class="guide-title mb-3">2. ESG Sustainability Guide</h4>
            <p class="content-text mb-3">
              An ESG Sustainability Guide refers to a specific technical methodology, procedure, or set of guidelines that details how to measure, 
              calculate, or report on ESG topics. These guides provide the sustainability requirements of ESG Standards and the instructions needed to implement the 
              requirements of ESG Standards. They provide the specific steps required to implement and provide the specific steps required to follow 
              sustainability goals towards established sustainability goals by offering detailed, step-by-step instructions for data 
              performance tracking.
            </p>
            <p class="content-text mb-3">
              "How do we actually calculate or track ESG progress?" This question is answered by ESG Sustainability Guides. They provide the detailed 
              "how-to" for putting ESG Standards into action. They implement and provide the specific steps required to follow ESG Standards. Furthermore, 
              they are essential for verifying the progress an organization is making towards its ESG goals. The specific Sustainability Guide used will 
              depend on the particular ESG Standard or governance framework being addressed.
            </p>
            <p class="content-text mb-3">
              Examples of widely used ESG Sustainability Guides include the Greenhouse Gas Sustainability Guide, the CDP Scoring Methodology, and 
              the SBTI (Science Based Targets Initiative) Calculation Guidance.
            </p>
          </div>

          <div class="issue-section mb-4">
            <h4 class="guide-title mb-3">3. ESG Issue</h4>
            <p class="content-text mb-3">
              An ESG Issue refers to a specific topic or challenge related to environmental, social, or governance factors that presents potential risks or 
              opportunities for farmers, an organization and its stakeholders. These Topics represent the core areas that a company needs to 
              monitor, address, and report on to ensure sustainability and responsible operations. Identifying and responding to ESG Issues is a 
              foundational step that guides the selection of ESG goals, the adoption of appropriate standards, and the implementation of relevant 
              Sustainability Guides.
            </p>
            <p class="content-text mb-3">
              It answers the question: "What sustainability-related topics should we care about and act on?"
            </p>
            <p class="content-text mb-3">
              The identification of ESG Topics typically comes first in the ESG management process. These Topics then drive the selection of specific ESG 
              goals, the ESG Standards an organization chooses to follow, and the ESG Sustainability Guides used for implementation and reporting. The 
              most relevant ESG Topics vary depending on the industry, its geographical location, and the expectations of its key stakeholders (e.g., 
              investors, customers, employees, regulators).
            </p>
            <p class="content-text mb-3">
              Examples of common ESG Topics include climate change, biodiversity loss, water resources, gender equality, employees working 
              conditions, and corruption.
            </p>
          </div>

          <div class="goal-section mb-4">
            <h4 class="guide-title mb-3">4. ESG Goal</h4>
            <p class="content-text mb-3">
              An ESG Goal is a specific and measurable objective that an organization sets to address one or more identified ESG Topics. These goals 
              represent the company's commitments to improve its performance in environmental, social, or governance areas over a defined period 
              or to maintain a certain level of compliance. ESG Goals are a direct response to the ESG Topics that a company has identified as significant. They are often structured and framed using the 
              guidelines of relevant ESG Standards to ensure alignment with broader reporting frameworks and to facilitate transparent disclosure.
            </p>
            <p class="content-text mb-3">
              It answers the question: "What outcomes do we want to achieve in response to a given ESG Issue?"
            </p>
            <p class="content-text mb-3">
              ESG Goals directly respond to the ESG Topics that a company has identified as significant. They are often structured and framed using the 
              guidelines of relevant ESG Standards to ensure alignment with broader reporting frameworks and to facilitate transparent disclosure. 
              Progress towards these goals is tracked using specific metrics and indicators, which provide the methodologies for data collection and analysis.
            </p>
            <p class="content-text mb-3">
              Examples of ESG Goals include: Reduce greenhouse gas (GHG) emissions by 30% by the year 2030; Achieve gender pay equity across the 
              organization by the end of the next fiscal year; Source 100% of key agricultural inputs from suppliers adhering to fair labor standards by 
              2027.
            </p>
          </div>

          <div class="target-section mb-4">
            <h4 class="guide-title mb-3">5. ESG Target</h4>
            <p class="content-text mb-3">
              An ESG Target is a specific, measurable, achievable, relevant, and time-bound (SMART) milestone that represents a concrete step 
              towards achieving a broader ESG Goal. Targets break down long-term goals into smaller, manageable actions with defined timelines, 
              making it easier for shorter periods (e.g., annually) within the timeframe of a multi-year ESG Goal. They provide specific milestones for 
              performance an organization aims to reach at a particular point in time for a given ESG metric.
            </p>
            <p class="content-text mb-3">
              It answers the question: "What specific, short-term actions can we take to make progress towards our bigger ESG Goals?"
            </p>
            <p class="content-text mb-3">
              ESG Targets are the practical actions that help you reach your overall ESG Goals. Our platform helps you define these targets in a way 
              that aligns with recognized ESG Standards, ensuring your efforts are credible and can be understood by others. We also provide the 
              tools (based on ESG Sustainability Guides) to track your progress on these specific targets, so you can see how your specific actions 
              contribute to your larger sustainability ambitions. Ultimately, these targets focus on making measurable improvements to the important 
              ESG Topics your business faces.
            </p>
            <p class="content-text mb-3">
              Examples: Instead of aiming to reduce farm emissions (an ESG Goal), a specific ESG Target might be to decrease fuel use on tractors by 
              5% in the next year. Or, alongside a goal to improve worker well-being, a target could be to provide safety training to all new farm 
              employees within a first year of practice.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Guide',
  data() {
    return {
      breadcrumbs: [
        { text: 'ESG Compliance', disabled: false, to: { name: 'esgAccountDashboard' } },
        { text: 'Dashboard', disabled: false, to: { name: 'esgAccountDashboard' } },
        { text: 'ESG Guide', disabled: true }
      ]
    }
  },
  methods: {
    async downloadPDF() {
      try {
        // Import jsPDF directly
        const { jsPDF } = await import('jspdf');

        // Create new PDF document
        const doc = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });

        // Set up document properties
        doc.setProperties({
          title: 'ESG Guide - Introduction to ESG',
          subject: 'Environmental, Social, and Governance Guide',
          author: 'Dimitra.io',
          creator: 'Dimitra Admin Panel'
        });

        // Page dimensions
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 8;
        const contentWidth = pageWidth - (margin * 2);
        let yPosition = margin;

        // Helper function to add text with word wrapping
        const addWrappedText = (text, x, y, maxWidth, fontSize = 8, fontStyle = 'normal', color = [51, 51, 51]) => {
          doc.setFontSize(fontSize);
          // Using helvetica as closest alternative to Poppins in jsPDF
          doc.setFont('helvetica', fontStyle);
          doc.setTextColor(color[0], color[1], color[2]);
          
          const lines = doc.splitTextToSize(text, maxWidth);
          // Further reduced line height for tighter text spacing
          const lineHeight = fontSize * 0.6;
          
          lines.forEach((line, index) => {
            if (y + (index * lineHeight) > pageHeight - margin) {
              doc.addPage();
              y = margin;
            }
            doc.text(line, x, y + (index * lineHeight));
          });
          
          return y + (lines.length * lineHeight);
        };

        // Helper function to add header to each page
        const addHeader = async () => {
          const headerHeight = 15; // Reduced from 30 to 15
          
          // Add logo on the left side
          try {
            // Load the actual logo image
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            await new Promise((resolve, reject) => {
              img.onload = () => {
                try {
                  // Create canvas to maintain original image quality
                  const canvas = document.createElement('canvas');
                  const ctx = canvas.getContext('2d');
                  
                  // Use original image dimensions to preserve quality
                  canvas.width = img.naturalWidth;
                  canvas.height = img.naturalHeight;
                  
                  // Disable image smoothing for crisp rendering
                  ctx.imageSmoothingEnabled = false;
                  ctx.webkitImageSmoothingEnabled = false;
                  ctx.mozImageSmoothingEnabled = false;
                  ctx.msImageSmoothingEnabled = false;
                  
                  // Draw logo at original size
                  ctx.drawImage(img, 0, 0);
                  
                  // Convert to high-quality data URL
                  const logoDataUrl = canvas.toDataURL('image/png', 1.0);
                  
                  // Calculate appropriate size for PDF while maintaining aspect ratio
                  const maxWidth = 40; // Increased from 30 for better visibility
                  const aspectRatio = img.naturalHeight / img.naturalWidth;
                  const logoWidth = maxWidth;
                  const logoHeight = maxWidth * aspectRatio;
                  
                  // Add the logo image to PDF with original quality
                  doc.addImage(logoDataUrl, 'PNG', margin, 5, logoWidth, logoHeight);
                  
                  resolve();
                } catch (error) {
                  console.warn('Logo processing failed:', error);
                  reject(error);
                }
              };
              
              img.onerror = () => {
                console.warn('Failed to load logo image');
                reject(new Error('Logo load failed'));
              };
              
              // Set image source
              img.src = '/icons/dds/logo.png';
            });
            
          } catch (error) {
            console.warn('Logo image loading failed, using text fallback:', error);
            // Fallback to text-based logo
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(34, 139, 34); // Forest green color
            doc.text('DIMITRA', margin, 11);
            doc.setTextColor(51, 51, 51); // Dark gray
            doc.text('ESG', margin + 25, 11);
          }
          
          // Add intro text to the right of the logo
          doc.setFontSize(8);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(102, 102, 102);
          const introText = 'INTRODUCTION TO ESG';
          const textWidth = doc.getTextWidth(introText);
          doc.text(introText, pageWidth - margin - textWidth, 11); // Changed from margin + 8 to 11
          
          return headerHeight;
        };

        // Helper function to check if we need a new page
        const checkNewPage = async (requiredSpace) => {
          if (yPosition + requiredSpace > pageHeight - margin) {
            doc.addPage();
            const headerHeight = await addHeader();
            yPosition = margin + headerHeight + 5; // Account for header space
          }
        };

        // Add header to first page
        const headerHeight = await addHeader();
        yPosition = headerHeight + 2; // Reduced spacing after header (was margin + headerHeight + 5)

        // Add the main ESG guide image
        try {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          
          await new Promise((resolve) => {
            img.onload = () => {
              try {
                // Create canvas to maintain original image quality
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Use original image dimensions to preserve quality
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                
                // Disable image smoothing for crisp rendering
                ctx.imageSmoothingEnabled = false;
                ctx.webkitImageSmoothingEnabled = false;
                ctx.mozImageSmoothingEnabled = false;
                ctx.msImageSmoothingEnabled = false;
                
                // Draw image at original size
                ctx.drawImage(img, 0, 0);
                
                // Convert to high-quality data URL
                const imgDataUrl = canvas.toDataURL('image/png', 1.0);
                
                // Calculate dimensions for PDF - FULL WIDTH with original quality
                const imgWidth = pageWidth;
                const imgHeight = (img.naturalHeight / img.naturalWidth) * imgWidth;
                
                // Add image to PDF - Full width starting from edge with original quality
                doc.addImage(imgDataUrl, 'PNG', 0, yPosition, imgWidth, imgHeight);
                
                yPosition += imgHeight + 10; // Add space after image
                resolve();
              } catch (error) {
                console.warn('Image processing failed:', error);
                resolve(); // Continue without image
              }
            };
            
            img.onerror = () => {
              console.warn('Failed to load ESG guide image');
              resolve(); // Continue without image
            };
            
            // Set image source
            img.src = '/icons/dimitraEsgGuide.png';
          });
        } catch (error) {
          console.warn('ESG guide image loading failed:', error);
        }

        // Main title - centered styling (10px, bold)
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(44, 62, 80);
        
        const titleText = 'ESG: Environmental, Social, and Governance';
        const titleWidth = doc.getTextWidth(titleText);
        const centerX = (pageWidth - titleWidth) / 2;
        
        doc.text(titleText, centerX, yPosition);
        yPosition += 8;

        // Introduction paragraphs - using content text styling (8px, normal)
        const intro1 = 'ESG stands for Environmental, Social, and Governance, representing three fundamental dimensions used to evaluate the sustainability and ethical impact of an organization\'s operations and management.';
        yPosition = addWrappedText(intro1, margin, yPosition, contentWidth, 8, 'normal', [51, 51, 51]);
        yPosition += 3;

        const intro2 = 'The Environmental aspect considers a company\'s impact on the natural world, including its use of resources, waste generation, and contribution to climate change. The Social dimension examines the company\'s relationships with and impact on people, encompassing labor practices, community engagement, and product responsibility. Finally, Governance refers to the system of rules, practices, and processes by which a business is directed and controlled, including corporate leadership, ethics, and accountability.';
        yPosition = addWrappedText(intro2, margin, yPosition, contentWidth, 8, 'normal', [51, 51, 51]);
        yPosition += 8;

        // Section 1: ESG Standard - using section title styling (10px, bold)
        checkNewPage(50);
        yPosition = addWrappedText('1. ESG Standard', margin, yPosition, contentWidth, 10, 'bold', [44, 62, 80]);
        yPosition += 3;

        const standard1 = 'An ESG Standard is a recognized and established set of guidelines and requirements that provide a structured approach for organizations to identify, measure, and report their performance on Environmental, Social, and Governance topics. These standards provide consistency and comparability in ESG disclosure across different companies and sectors. They often specify the metrics to be tracked and the format for reporting this information, ensuring transparency and accountability.';
        yPosition = addWrappedText(standard1, margin, yPosition, contentWidth, 8, 'normal', [51, 51, 51]);
        yPosition += 3;

        const standard2 = 'What rules or reporting frameworks should we align with? This question is answered by understanding ESG Standards. They guide how sustainability goals are defined and ultimately disclosed. Furthermore, these standards help organizations determine which ESG Topics are most relevant to their specific industry, adhering to a particular standard often requires the use of specific sustainability indices and methodologies to calculate and report ESG indicators.';
        yPosition = addWrappedText(standard2, margin, yPosition, contentWidth, 8, 'normal', [51, 51, 51]);
        yPosition += 3;

        const standard3 = 'Examples of prominent ESG Standards include ESRS (European Sustainability Reporting Standards), GRI (Global Reporting Initiative), SASB (Sustainability Accounting Standards Board), TCFD (Task Force on Climate-related Financial Disclosures), and ISO 26000.';
        yPosition = addWrappedText(standard3, margin, yPosition, contentWidth, 8, 'normal', [51, 51, 51]);
        yPosition += 8;

        // Section 2: ESG Sustainability Guide
        checkNewPage(50);
        yPosition = addWrappedText('2. ESG Sustainability Guide', margin, yPosition, contentWidth, 10, 'bold', [44, 62, 80]);
        yPosition += 3;

        const guide1 = 'An ESG Sustainability Guide refers to a specific technical methodology, procedure, or set of guidelines that details how to measure, calculate, or report on ESG topics. These guides provide the sustainability requirements of ESG Standards and the instructions needed to implement the requirements of ESG Standards. They provide the specific steps required to implement and provide the specific steps required to follow sustainability goals towards established sustainability goals by offering detailed, step-by-step instructions for data performance tracking.';
        yPosition = addWrappedText(guide1, margin, yPosition, contentWidth, 8, 'normal', [51, 51, 51]);
        yPosition += 3;

        const guide2 = '"How do we actually calculate or track ESG progress?" This question is answered by ESG Sustainability Guides. They provide the detailed "how-to" for putting ESG Standards into action. They implement and provide the specific steps required to follow ESG Standards. Furthermore, they are essential for verifying the progress an organization is making towards its ESG goals. The specific Sustainability Guide used will depend on the particular ESG Standard or governance framework being addressed.';
        yPosition = addWrappedText(guide2, margin, yPosition, contentWidth, 8, 'normal', [51, 51, 51]);
        yPosition += 3;

        const guide3 = 'Examples of widely used ESG Sustainability Guides include the Greenhouse Gas Sustainability Guide, the CDP Scoring Methodology, and the SBTI (Science Based Targets Initiative) Calculation Guidance.';
        yPosition = addWrappedText(guide3, margin, yPosition, contentWidth, 8, 'normal', [51, 51, 51]);
        yPosition += 1;

        // Section 3: ESG Issue
        await checkNewPage(50);
        yPosition = addWrappedText('3. ESG Issue', margin, yPosition, contentWidth, 10, 'bold', [44, 62, 80]);
        yPosition += 3;

        const issue1 = 'An ESG Issue refers to a specific topic or challenge related to environmental, social, or governance factors that presents potential risks or opportunities for farmers, an organization and its stakeholders. These Topics represent the core areas that a company needs to monitor, address, and report on to ensure sustainability and responsible operations. Identifying and responding to ESG Issues is a foundational step that guides the selection of ESG goals, the adoption of appropriate standards, and the implementation of relevant Sustainability Guides.';
        yPosition = addWrappedText(issue1, margin, yPosition, contentWidth, 8, 'normal', [51, 51, 51]);
        yPosition += 3;

        const issue2 = 'It answers the question: "What sustainability-related topics should we care about and act on?"';
        yPosition = addWrappedText(issue2, margin, yPosition, contentWidth, 8, 'normal', [51, 51, 51]);
        yPosition += 3;

        const issue3 = 'The identification of ESG Topics typically comes first in the ESG management process. These Topics then drive the selection of specific ESG goals, the ESG Standards an organization chooses to follow, and the ESG Sustainability Guides used for implementation and reporting. The most relevant ESG Topics vary depending on the industry, its geographical location, and the expectations of its key stakeholders (e.g., investors, customers, employees, regulators).';
        yPosition = addWrappedText(issue3, margin, yPosition, contentWidth, 8, 'normal', [51, 51, 51]);
        yPosition += 3;

        const issue4 = 'Examples of common ESG Topics include climate change, biodiversity loss, water resources, gender equality, employees working conditions, and corruption.';
        yPosition = addWrappedText(issue4, margin, yPosition, contentWidth, 8, 'normal', [51, 51, 51]);
        yPosition += 8;

        // Section 4: ESG Goal
        await checkNewPage(50);
        yPosition = addWrappedText('4. ESG Goal', margin, yPosition, contentWidth, 10, 'bold', [44, 62, 80]);
        yPosition += 3;

        const goal1 = 'An ESG Goal is a specific and measurable objective that an organization sets to address one or more identified ESG Topics. These goals represent the company\'s commitments to improve its performance in environmental, social, or governance areas over a defined period or to maintain a certain level of compliance. ESG Goals are a direct response to the ESG Topics that a company has identified as significant. They are often structured and framed using the guidelines of relevant ESG Standards to ensure alignment with broader reporting frameworks and to facilitate transparent disclosure.';
        yPosition = addWrappedText(goal1, margin, yPosition, contentWidth, 8, 'normal', [51, 51, 51]);
        yPosition += 3;

        const goal2 = 'It answers the question: "What outcomes do we want to achieve in response to a given ESG Issue?"';
        yPosition = addWrappedText(goal2, margin, yPosition, contentWidth, 8, 'normal', [51, 51, 51]);
        yPosition += 3;

        const goal3 = 'ESG Goals directly respond to the ESG Topics that a company has identified as significant. They are often structured and framed using the guidelines of relevant ESG Standards to ensure alignment with broader reporting frameworks and to facilitate transparent disclosure. Progress towards these goals is tracked using specific metrics and indicators, which provide the methodologies for data collection and analysis.';
        yPosition = addWrappedText(goal3, margin, yPosition, contentWidth, 8, 'normal', [51, 51, 51]);
        yPosition += 3;

        const goal4 = 'Examples of ESG Goals include: Reduce greenhouse gas (GHG) emissions by 30% by the year 2030; Achieve gender pay equity across the organization by the end of the next fiscal year; Source 100% of key agricultural inputs from suppliers adhering to fair labor standards by 2027.';
        yPosition = addWrappedText(goal4, margin, yPosition, contentWidth, 8, 'normal', [51, 51, 51]);
        yPosition += 8;

        // Section 5: ESG Target
        await checkNewPage(50);
        yPosition = addWrappedText('5. ESG Target', margin, yPosition, contentWidth, 10, 'bold', [44, 62, 80]);
        yPosition += 3;

        const target1 = 'An ESG Target is a specific, measurable, achievable, relevant, and time-bound (SMART) milestone that represents a concrete step towards achieving a broader ESG Goal. Targets break down long-term goals into smaller, manageable actions with defined timelines, making it easier for shorter periods (e.g., annually) within the timeframe of a multi-year ESG Goal. They provide specific milestones for performance an organization aims to reach at a particular point in time for a given ESG metric.';
        yPosition = addWrappedText(target1, margin, yPosition, contentWidth, 8, 'normal', [51, 51, 51]);
        yPosition += 3;

        const target2 = 'It answers the question: "What specific, short-term actions can we take to make progress towards our bigger ESG Goals?"';
        yPosition = addWrappedText(target2, margin, yPosition, contentWidth, 8, 'normal', [51, 51, 51]);
        yPosition += 3;

        const target3 = 'ESG Targets are the practical actions that help you reach your overall ESG Goals. Our platform helps you define these targets in a way that aligns with recognized ESG Standards, ensuring your efforts are credible and can be understood by others. We also provide the tools (based on ESG Sustainability Guides) to track your progress on these specific targets, so you can see how your specific actions contribute to your larger sustainability ambitions. Ultimately, these targets focus on making measurable improvements to the important ESG Topics your business faces.';
        yPosition = addWrappedText(target3, margin, yPosition, contentWidth, 8, 'normal', [51, 51, 51]);
        yPosition += 3;

        const target4 = 'Examples: Instead of aiming to reduce farm emissions (an ESG Goal), a specific ESG Target might be to decrease fuel use on tractors by 5% in the next year. Or, alongside a goal to improve worker well-being, a target could be to provide safety training to all new farm employees within a first year of practice.';
        yPosition = addWrappedText(target4, margin, yPosition, contentWidth, 8, 'normal', [51, 51, 51]);

        // Add footer to all pages (but ensure headers are already added)
        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
          doc.setPage(i);
          
          // Add footer
          doc.setFontSize(8);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(102, 102, 102);
          doc.text('Dimitra.io', margin, pageHeight - 10);
          doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
        }

        // Save the PDF
        doc.save('ESG_Guide_Introduction_to_ESG.pdf');
      } catch (error) {
        console.error('Error generating PDF:', error);
        if (this.$notify) {
          this.$notify({
            type: 'error',
            title: 'PDF Generation Failed',
            text: 'There was an error generating the PDF. Please try again.'
          });
        }
      }
    }
  }
}
</script>

<style scoped>
.esg-guide-page {
  background: #F4F8F7;
  min-height: 100vh;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 5% 10px 5%;
}

.page-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.download-btn-header {
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 8px;
}

.page-container {
  display: flex;
  flex-direction: column;
  max-width: 90%;
  height: 80vh;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.page-header {
  flex-shrink: 0;
  padding: 40px 40px 20px 40px;
  border-radius: 12px 12px 0 0;
}

.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 12px;
}

.esg-logo {
  max-width: 350px;
  height: auto;
  margin-bottom: 8px;
}

.guide-subtitle {
  font-size: 1.8rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0;
  margin-top: 0;
  letter-spacing: 0.5px;
}

.page-content {
  flex: 1;
  overflow-y: auto;
  padding: 0% 4%;
  margin: 10px 0;
  border-radius: 8px;
}

.content-section {
  padding: 20px;
  background: white;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  text-align: center;
}

.content-text {
  font-size: 0.95rem;
  line-height: 1.6;
  text-align: justify;
}

.standards-title,
.guide-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-top: 2.5rem;
}

.page-footer {
  flex-shrink: 0;
  background: #F4F8F7;
  border-radius: 0 0 12px 12px;
}

.footer-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}

.footer-center-row {
  display: flex;
  justify-content: center;
  width: 100%;
}

.download-btn {
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 8px;
}

/* Custom scrollbar styling */
.page-content::-webkit-scrollbar {
  width: 6px;
}

.page-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.page-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.page-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

@media (max-width: 600px) {
  .esg-guide-page {
    padding: 10px;
  }
  
  .page-header {
    padding: 20px 20px 15px 20px;
  }
  
  .page-footer {
    padding: 15px 20px 20px 20px;
  }
  
  .page-content {
    padding: 0 20px;
  }
  
  .esg-logo {
    max-width: 220px;
  }
  
  .guide-subtitle {
    font-size: 1.2rem;
  }
}
</style>