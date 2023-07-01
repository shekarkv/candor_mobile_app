import { Component } from '@angular/core';
import { IonicModule, NavController } from '@ionic/angular';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';

// @IonicPage()
@Component({
  selector: 'page-attendance',
  templateUrl: 'attendance.html', 
  styleUrls: ['attendance.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule,  CommonModule ] 
})
export class AttendancePage {

  i:any;

  loginData: any;
  shownGroup = false;
  shownCancelGroup = false;
  shownRequestGroup = false;
  is_super_wiser: any;
  is_rh_req: any;
  is_on_duty: any;
  is_holiday_work_permit: any;
  login_user_type: any;
  module_arr: any;
  on_duty_flag: any;

  constructor(public navCtrl: NavController ) {

    this.loginData = JSON.parse(localStorage.getItem('loginData'));
    this.is_super_wiser = this.loginData['is_super_wiser'];
    this.login_user_type = this.loginData['login_user_type'];
    this.module_arr = this.loginData['module_arr'];
    this.is_rh_req = this.module_arr.includes("RH Request");
    
    this.is_on_duty = this.module_arr.includes("On Duty Request");
    this.is_holiday_work_permit = this.module_arr.includes("Holiday Work Permitt");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AttendancePage');
  }

  openLeaveApplicationPage() {
    // this.navCtrl.push('LeaveApplicationPage');
    this.navCtrl.navigateForward('menu/LeaveApplicationPage');
  }

  openLeaveBalancePage() {
    // this.navCtrl.push('LeaveBalancePage');
    this.navCtrl.navigateForward('menu/LeaveBalancePage');
  }

  openOnDutyRequestPage() {
    // this.navCtrl.push('OnDutyRequestPage');
    this.navCtrl.navigateForward('menu/OnDutyRequestPage');
  }

  openLeaveApplicationApprovalPage() {
    // this.navCtrl.push('LeaveApplicationApprovalPage');
    this.navCtrl.navigateForward('menu/LeaveApplicationApprovalPage');
  }

  openOnDutyApprovalPage() {
    // this.navCtrl.push('OnDutyApprovalPage');
    this.navCtrl.navigateForward('menu/OnDutyApprovalPage');
  }

  openRHRequestPage() {
    // this.navCtrl.push('RhRequestPage');
    this.navCtrl.navigateForward('menu/RhRequestPage');
  }

  openRHRequestApprovalPage() {
    // this.navCtrl.push('RhApprovalPage');
    this.navCtrl.navigateForward('menu/RhApprovalPage');
  }

  openLeaveRequestCancellationPage() {
    // this.navCtrl.push('LeaveRequestCancellationPage');
    this.navCtrl.navigateForward('menu/LeaveRequestCancellationPage');
  }

  openLeaveCancellationApprovalPage() {
    // this.navCtrl.push('LeaveCancellationApprovalPage');
    this.navCtrl.navigateForward('menu/LeaveCancellationApprovalPage');
  }

  openOnDutyCancellationPage() {
    // this.navCtrl.push('OnDutyCancellationRequestPage');
    this.navCtrl.navigateForward('menu/OnDutyCancellationRequestPage');
  }

  openOnDutyCancelApprovalPage() {
    // this.navCtrl.push('OnDutyCancelApprovalPage');
    this.navCtrl.navigateForward('menu/OnDutyCancelApprovalPage');
  }

  openRHCancellationPage() {
    // this.navCtrl.push('RhRequestCancellationPage');
    this.navCtrl.navigateForward('menu/RhRequestCancellationPage');
  }

  openRHCancelApprovalPage() {
    // this.navCtrl.push('RhCancelApprovalPage');
    this.navCtrl.navigateForward('menu/RhCancelApprovalPage');
  }

  openLeaveApplicationStatusPage() {
    // this.navCtrl.push('LeaveApplicationStatusPage');
    this.navCtrl.navigateForward('leaveApplicationStatus');
  }

  openOnDutyRequestStatusPage() {
    // this.navCtrl.push('OnDutyRequestStatusPage')
    this.navCtrl.navigateForward('menu/OnDutyRequestStatusPage');
  }

  openRHRequestStatusPage() {
    // this.navCtrl.push('RhRequestStatusPage')
    this.navCtrl.navigateForward('menu/RhRequestStatusPage');
  }

  openHolidayWorkPermitPage() {
    // this.navCtrl.push('HolidayWorkPermitPage');
    this.navCtrl.navigateForward('menu/HolidayWorkPermitPage');
  }

  openHWPermitApprovalPage() {
    // this.navCtrl.push('HolidayWorkPermitApprovalPage');
    this.navCtrl.navigateForward('menu/HolidayWorkPermitApprovalPage');
  }

  openCompOffRequestPage() {
    // this.navCtrl.push('CompOffRequestPage');
    this.navCtrl.navigateForward('menu/CompOffRequestPage');
  }

  openCompOffRequestApprovalPage() {
    // this.navCtrl.push('CompOffRequestApprovalPage');
    this.navCtrl.navigateForward('menu/CompOffRequestApprovalPage');
  }

  openCalendar() {
    // this.navCtrl.push('CalendarPage')
    this.navCtrl.navigateForward('menu/CalendarPage');
  }
  
  //for approvals
  toggleGroup(group) {
    console.log(group)
    if (this.isGroupShown(group)) {
      this.shownGroup = false;
    } else {
      this.shownGroup = group;
    }
  }

  isGroupShown(group) {
    return this.shownGroup === group;
  }

  //for application status 
  toggleRequestGroup(group) {
    console.log(group)
    if (this.isRequestGroupShown(group)) {
      this.shownRequestGroup = false;
    } else {
      this.shownRequestGroup = group;
    }
  }

  isRequestGroupShown(group) {
    return this.shownRequestGroup === group;
  }

  //for cancellation
  toggleCancelGroup(group) {
    console.log(group)
    if (this.isCancelGroupShown(group)) {
      this.shownCancelGroup = false;
    } else {
      this.shownCancelGroup = group;
    }
  }

  isCancelGroupShown(group) {
    return this.shownCancelGroup === group;
  }
}
