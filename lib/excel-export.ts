import * as XLSX from 'xlsx';
import { ApplicationWithRelations, ApplicationWithJobInfo } from './types';

export interface ExcelExportData {
  applications: ApplicationWithRelations[];
  jobTitle: string;
  startupName: string;
}

export interface BulkExportData {
  applications: ApplicationWithJobInfo[];
  startupName: string;
}

export const exportApplicationsToExcel = (data: ExcelExportData | BulkExportData): void => {
  const { applications, startupName } = data;
  const jobTitle = 'jobTitle' in data ? data.jobTitle : 'All Jobs';

  // Prepare the data for Excel
  const excelData = applications.map((application, index) => {
    const row: any = {
      'S.No': index + 1,
      'Applicant Name': application.user.name,
      'Email': application.user.email,
      'Job Title': (application as any).jobTitle || jobTitle,
      'Application Date': new Date(application.appliedAt).toLocaleDateString(),
      'Application Time': new Date(application.appliedAt).toLocaleTimeString(),
      'Status': application.status,
      'Website': application.user.website || 'N/A',
      'LinkedIn': application.user.linkedin || 'N/A',
      'GitHub': application.user.github || 'N/A',
      'Resume Link': application.resumePdfUrl || 'N/A',
    };

    // Add custom question answers
    if (application.customAnswers && application.customAnswers.length > 0) {
      application.customAnswers.forEach((answer, qIndex) => {
        const questionKey = `Q${qIndex + 1}: ${answer.question.question}`;
        row[questionKey] = answer.answer || 'N/A';
      });
    }

    // Add resume information if available
    if (application.user.resume) {
      row['Phone'] = application.user.resume.phone || 'N/A';
      row['Bio'] = application.user.resume.bio || 'N/A';
      row['Skills'] = application.user.resume.skills?.join(', ') || 'N/A';
      row['Resume Text'] = application.user.resume.resumeText || 'N/A';
      row['Resume PDF'] = application.resumePdfFileName || 'N/A';
    }

    return row;
  });

  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(excelData);

  // Set column widths
  const columnWidths = [
    { wch: 5 },   // S.No
    { wch: 20 },  // Applicant Name
    { wch: 25 },  // Email
    { wch: 25 },  // Job Title
    { wch: 15 },  // Application Date
    { wch: 15 },  // Application Time
    { wch: 12 },  // Status
    { wch: 20 },  // Website
    { wch: 25 },  // LinkedIn
    { wch: 20 },  // GitHub
    { wch: 40 },  // Resume Link
    { wch: 15 },  // Phone
    { wch: 30 },  // Bio
    { wch: 40 },  // Skills
    { wch: 50 },  // Resume Text
    { wch: 20 },  // Resume PDF
  ];

  // Add custom question columns (dynamic width)
  if (applications.length > 0 && applications[0].customAnswers) {
    applications[0].customAnswers.forEach(() => {
      columnWidths.push({ wch: 30 }); // Default width for custom questions
    });
  }

  worksheet['!cols'] = columnWidths;

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Applications');

  // Generate filename
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `${startupName}_${jobTitle}_Applications_${timestamp}.xlsx`;

  // Save the file
  XLSX.writeFile(workbook, filename);
};

export const exportApplicationsToCSV = (data: ExcelExportData | BulkExportData): void => {
  const { applications, startupName } = data;
  const jobTitle = 'jobTitle' in data ? data.jobTitle : 'All Jobs';

  // Prepare the data for CSV
  const csvData = applications.map((application, index) => {
    const row: any = {
      'S.No': index + 1,
      'Applicant Name': application.user.name,
      'Email': application.user.email,
      'Job Title': (application as any).jobTitle || jobTitle,
      'Application Date': new Date(application.appliedAt).toLocaleDateString(),
      'Application Time': new Date(application.appliedAt).toLocaleTimeString(),
      'Status': application.status,
      'Website': application.user.website || 'N/A',
      'LinkedIn': application.user.linkedin || 'N/A',
      'GitHub': application.user.github || 'N/A',
      'Resume Link': application.resumePdfUrl || 'N/A',
    };

    // Add custom question answers
    if (application.customAnswers && application.customAnswers.length > 0) {
      application.customAnswers.forEach((answer, qIndex) => {
        const questionKey = `Q${qIndex + 1}: ${answer.question.question}`;
        row[questionKey] = answer.answer || 'N/A';
      });
    }

    // Add resume information if available
    if (application.user.resume) {
      row['Phone'] = application.user.resume.phone || 'N/A';
      row['Bio'] = application.user.resume.bio || 'N/A';
      row['Skills'] = application.user.resume.skills?.join(', ') || 'N/A';
      row['Resume Text'] = application.user.resume.resumeText || 'N/A';
      row['Resume PDF'] = application.resumePdfFileName || 'N/A';
    }

    return row;
  });

  // Convert to CSV
  const worksheet = XLSX.utils.json_to_sheet(csvData);
  const csv = XLSX.utils.sheet_to_csv(worksheet);

  // Generate filename
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `${startupName}_${jobTitle}_Applications_${timestamp}.csv`;

  // Create and download the file
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}; 