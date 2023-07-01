import { Routes } from '@angular/router';
import { MenuPage } from './pages/menu/menu';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'menu/home',
    pathMatch: 'full',
  },
  {
    path: 'menu',
    component: MenuPage,
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./pages/home/home').then((m) => m.HomePage),
      },
      {
        path: 'PersonalDetails',
        loadComponent: () => import('./pages/personal-details/personal-details').then( (m) => m.PersonalDetailsPage)
      },
      {
        path: 'MyAccountPage',
        loadComponent: () => import('./pages/my-account/my-account').then( (m) => m.MyAccountPage)
      },
      {
        path: 'ChangePasswordPage',
        loadComponent: () => import('./pages/change-password/change-password').then( m => m.ChangePasswordPage)
      },
      {
        path: 'HolidayListPage',
        loadComponent: () => import('./pages/holiday-list/holiday-list').then( m => m.HolidayListPage)
      },
      {
        path: 'MonthlyPayslipPage',
        loadComponent: () => import('./pages/monthly-payslip/monthly-payslip').then( m => m.MonthlyPayslipPage)
      },
      {
        path: 'YtdStatementPage',
        loadComponent: () => import('./pages/ytd-statement/ytd-statement').then( m => m.YtdStatementPage)
      },
      {
        path: 'PfYtdStatementPage',
        loadComponent: () => import('./pages/pf-ytd-statement/pf-ytd-statement').then( m => m.PfYtdStatementPage)
      },
      {
        path: 'ItComputationPage',
        loadComponent: () => import('./pages/it-computation/it-computation').then( m => m.ItComputationPage)
      },
      {
        path: 'ItDeclarationsPage',
        loadComponent: () => import('./pages/it-declarations/it-declarations').then( m => m.ItDeclarationsPage)
      },
      {
        path: 'AttendancePage',
        loadComponent: () => import('./pages/attendance/attendance').then( m => m.AttendancePage)
      },
      {
        path: 'ItDeclarationProofsPage',
        loadComponent: () => import('./pages/it-declaration-proofs/it-declaration-proofs').then( m => m.ItDeclarationProofsPage)
      },
      {
        path: 'LoanStatementPage',
        loadComponent: () => import('./pages/loan-statement/loan-statement').then( m => m.LoanStatementPage)
      },
      {
        path: 'AppVersionUpdatePage',
        loadComponent: () => import('./pages/app-version-update/app-version-update').then( m => m.AppVersionUpdatePage)
      },
      {
        path: 'ApproveCompOffRequestPage',
        loadComponent: () => import('./pages/approve-comp-off-request/approve-comp-off-request').then( m => m.ApproveCompOffRequestPage)
      },
      {
        path: 'ApproveHwPermitPage',
        loadComponent: () => import('./pages/approve-hw-permit/approve-hw-permit').then( m => m.ApproveHwPermitPage)
      },
      {
        path: 'ApproveLeaveApplicantPage',
        loadComponent: () => import('./pages/approve-leave-applicant/approve-leave-applicant').then( m => m.ApproveLeaveApplicantPage)
      },
      {
        path: 'ApproveOnDutyPage',
        loadComponent: () => import('./pages/approve-on-duty/approve-on-duty').then( m => m.ApproveOnDutyPage)
      },
      {
        path: 'ApproveRhRequestPage',
        loadComponent: () => import('./pages/approve-rh-request/approve-rh-request').then( m => m.ApproveRhRequestPage)
      },
      {
        path: 'CalendarPage',
        loadComponent: () => import('./pages/calendar/calendar').then( m => m.CalendarPage)
      },
      {
        path: 'CompOffRequestPage',
        loadComponent: () => import('./pages/comp-off-request/comp-off-request').then( m => m.CompOffRequestPage)
      },
      {
        path: 'CompOffRequestApprovalPage',
        loadComponent: () => import('./pages/comp-off-request-approval/comp-off-request-approval').then( m => m.CompOffRequestApprovalPage)
      },
      {
        path: 'ForgotPasswordPage',
        loadComponent: () => import('./pages/forgot-password/forgot-password').then( m => m.ForgotPasswordPage)
      },
      {
        path: 'HolidayWorkPermitPage',
        loadComponent: () => import('./pages/holiday-work-permit/holiday-work-permit').then( m => m.HolidayWorkPermitPage)
      },
      { 
        path: 'HolidayWorkPermitApprovalPage',
        loadComponent: () => import('./pages/holiday-work-permit-approval/holiday-work-permit-approval').then( m => m.HolidayWorkPermitApprovalPage)
      }, //added
      {
        path: 'ViewReimbursementDataPage',
        loadComponent: () => import('./pages/view-reimbursement-data/view-reimbursement-data').then( m => m.ViewReimbursementDataPage)
      },
      {
        path: 'ViewHwEmployeesPage',
        loadComponent: () => import('./pages/view-hw-employees/view-hw-employees').then( m => m.ViewHwEmployeesPage)
      },
      {
        path: 'ViewAttachmentPage',
        loadComponent: () => import('./pages/view-attachment/view-attachment').then( m => m.ViewAttachmentPage)
      },
      {
        path: 'RhRequestCancellationPage',
        loadComponent: () => import('./pages/rh-request-cancellation/rh-request-cancellation').then( m => m.RhRequestCancellationPage)
      },
      {
        path: 'RhRequestPage',
        loadComponent: () => import('./pages/rh-request/rh-request').then( m => m.RhRequestPage)
      },
      {
        path: 'RhCancelApprovalPage',
        loadComponent: () => import('./pages/rh-cancel-approval/rh-cancel-approval').then( m => m.RhCancelApprovalPage)
      },
      { 
        path: 'RhApprovalPage',
        loadComponent: () => import('./pages/rh-approval/rh-approval').then( m => m.RhApprovalPage)
      },
      {
        path: 'PreviewfilePage',
        loadComponent: () => import('./pages/previewfile/previewfile').then( m => m.PreviewfilePage)
      },
      {
        path: 'OnDutyRequestStatusPage',
        loadComponent: () => import('./pages/on-duty-request-status/on-duty-request-status').then( m => m.OnDutyRequestStatusPage)
      },
      {
        path: 'OnDutyCancellationRequestPage',
        loadComponent: () => import('./pages/on-duty-cancellation-request/on-duty-cancellation-request').then( m => m.OnDutyCancellationRequestPage)
      },
      {
        path: 'OnDutyCancelApprovalPage',
        loadComponent: () => import('./pages/on-duty-cancel-approval/on-duty-cancel-approval').then( m => m.OnDutyCancelApprovalPage)
      },
      {
        path: 'OnDutyApprovalPage',
        loadComponent: () => import('./pages/on-duty-approval/on-duty-approval').then( m => m.OnDutyApprovalPage)
      },
      {
        path: 'ModelPage',
        loadComponent: () => import('./pages/model/model').then( m => m.ModelPage)
      },
      {
        path: 'MorePage',
        loadComponent: () => import('./pages/more/more').then( m => m.MorePage)
      },
      {
        path: 'LoanStatementPage',
        loadComponent: () => import('./pages/loan-statement/loan-statement').then( m => m.LoanStatementPage)
      },
      {
        path: 'LoanDescriptionPage',
        loadComponent: () => import('./pages/loan-description/loan-description').then( m => m.LoanDescriptionPage)
      },
      {
        path: 'ListPage',
        loadComponent: () => import('./pages/list/list').then( m => m.ListPage)
      },
      {
        path: 'LeaveRequestCancellationPage',
        loadComponent: () => import('./pages/leave-request-cancellation/leave-request-cancellation').then( m => m.LeaveRequestCancellationPage)
      },
      {
        path: 'LeaveCancellationApprovalPage',
        loadComponent: () => import('./pages/leave-cancellation-approval/leave-cancellation-approval').then( m => m.LeaveCancellationApprovalPage)
      },
      {
        path: 'LeaveBalancePage',
        loadComponent: () => import('./pages/leave-balance/leave-balance').then( m => m.LeaveBalancePage)
      },
      {
        path: 'LeaveApplicationApprovalPage',
        loadComponent: () => import('./pages/leave-application-approval/leave-application-approval').then( m => m.LeaveApplicationApprovalPage)
      },
      {
        path: 'LeaveApplicationPage',
        loadComponent: () => import('./pages/leave-application/leave-application').then( m => m.LeaveApplicationPage)
      },
      {
        path: 'ReimbursementClaimsPage',
        loadComponent: () => import('./pages/reimbursement-claims/reimbursement-claims').then( m => m.ReimbursementClaimsPage)
      },
      {
        path: 'RhRequestStatusPage',
        loadComponent: () => import('./pages/rh-request-status/rh-request-status').then( m => m.RhRequestStatusPage)
      },
      {
        path: 'OnDutyRequestPage',
        loadComponent: () => import('./pages/on-duty-request/on-duty-request').then( m => m.OnDutyRequestPage)
      },
    ]
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then( (m) => m.LoginPage)
  },
  {
    path: 'leaveApplicationStatus',
    loadComponent: () => import('./pages/leave-application-status/leave-application-status').then( (m) => m.LeaveApplicationStatusPage)
  },
  {
    path: 'photo-viewer',
    loadComponent: () => import('./pages/photo-viewer/photo-viewer.page').then( m => m.PhotoViewerPage)
  },
  {
    path: 'HelpPage',
    loadComponent: () => import('./pages/help/help').then( m => m.HelpPage)
  },
  {
    path: 'UploadDocumentPage',
    loadComponent: () => import('./pages/upload-document/upload-document').then( m => m.UploadDocumentPage)
  },
  // {
  //   path: '',
  //   redirectTo: 'login',
  //   pathMatch: 'full',
  // },
  // {
  //   path: 'login',
  //   loadComponent: () => import('./pages/login/login').then( (m) => m.LoginPage)
  // },
  // {
  //   path: 'home',
  //   loadComponent: () =>
  //   import('./pages/home/home').then((m) => m.HomePage),
  // },
  // {
  //   path: 'menu',
  //   component: MenuPage,
  //   children: [
  //     {
  //       path: 'home',
  //       loadComponent: () =>
  //         import('./pages/home/home.page').then((m) => m.HomePage),
  //     },
  //     {
  //       path: 'login',
  //       loadComponent: () => import('./pages/login/login.page').then( (m) => m.LoginPage)
  //     },
  //   ]
  // },
];
