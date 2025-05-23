import {
    NgModule
} from '@angular/core';
import {
    Routes,
    RouterModule
} from '@angular/router';
import {
    ExportedClass as ProcessLoginNavigation
} from './scripts/custom/ProcessLoginNavigation';
import {
    ExportedClass as AuthGuard
} from './scripts/custom/AuthGuard';
import {
    ExportedClass as Page2DeActivateGuard
} from './scripts/custom/Page2DeActivateGuard';
import {
    ExportedClass as Page1DeActivateGuard
} from './scripts/custom/Page1DeActivateGuard';

const routes: Routes = [{
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadChildren: () => import('./Login/Login.module').then(m => m.LoginPageModule),
        canActivate: [ProcessLoginNavigation],
    },
    {
        path: 'wp-login',
        loadChildren: () => import('./AutoLogin/AutoLogin.module').then(m => m.AutoLoginPageModule),
    },
    {
        path: 'signUp',
        loadChildren: () => import('./SignUp/SignUp.module').then(m => m.SignUpPageModule),
    },
    {
        path: 'termsOfUse',
        loadChildren: () => import('./TermsOfUse/TermsOfUse.module').then(m => m.TermsOfUsePageModule),
    },
    {
        path: 'updatePassword',
        loadChildren: () => import('./UpdatePassword/UpdatePassword.module').then(m => m.UpdatePasswordPageModule),
        canActivate: [AuthGuard],
    },
    {
        path: 'balancesheet',
        loadChildren: () => import('./Accounts/Accounts.module').then(m => m.AccountsPageModule),
        canActivate: [AuthGuard],
    },
    {
        path: 'emailLogin',
        loadChildren: () => import('./EmailLogin/EmailLogin.module').then(m => m.EmailLoginPageModule),
        canActivate: [ProcessLoginNavigation]
    },
    {
        path: 'addaccount',
        loadChildren: () => import('./AddAccount/AddAccount.module').then(m => m.AddAccountPageModule),
        canActivate: [AuthGuard],
    },
    {
        path: 'accountDetails',
        loadChildren: () => import('./AccountDetailsType/AccountDetailsType.module').then(m => m.AccountDetailsTypePageModule),
        canActivate: [AuthGuard],
    },
    {
        path: 'accountDetails/:id',
        loadChildren: () => import('./AccountDetails/AccountDetails.module').then(m => m.AccountDetailsPageModule),
        canActivate: [AuthGuard],
    },
    {
        path: 'articles',
        loadChildren: () => import('./Articles/Articles.module').then(m => m.ArticlesPageModule),
        canActivate: [AuthGuard],
    },
    {
        path: 'articleDetails/:id',
        loadChildren: () => import('./ArticleDetails/ArticleDetails.module').then(m => m.ArticleDetailsPageModule),
        canActivate: [AuthGuard],
    },
    {
        path: 'freedomnumberdetails',
        loadChildren: () => import('./FreedomNumberDetails/FreedomNumberDetails.module').then(m => m.FreedomNumberDetailsPageModule),
        canActivate: [AuthGuard],
    },
    {
        path: 'resources',
        loadChildren: () => import('./Resources/Resources.module').then(m => m.ResourcesPageModule),
        canActivate: [AuthGuard],
    },
    {
        path: 'resourceDetails/:id',
        loadChildren: () => import('./ResourceDetails/ResourceDetails.module').then(m => m.ResourceDetailsPageModule),
        canActivate: [AuthGuard],
    },
    {
        path: 'lifestylenumberdetails',
        loadChildren: () => import('./LifestyleNumberDetails/LifestyleNumberDetails.module').then(m => m.LifestyleNumberDetailsPageModule),
        canActivate: [AuthGuard],
    },
    {
        path: 'nd1details',
        loadChildren: () => import('./ND1Details/ND1Details.module').then(m => m.ND1DetailsPageModule),
        canActivate: [AuthGuard],
    },
    {
        path: 'nd2calcpage',
        loadChildren: () => import('./ND2Calc/ND2Calc.module').then(m => m.ND2CalcPageModule),
        canActivate: [AuthGuard],
    },
    {
        path: 'calculatorslegacy',
        loadChildren: () => import('./CalculatorsLegacy/CalculatorsLegacy.module').then(m => m.CalculatorsLegacyPageModule),
        canActivate: [AuthGuard],
    },
    {
        path: 'debtpayoffcalc',
        loadChildren: () => import('./DebtPayoffCalc/DebtPayoffCalc.module').then(m => m.DebtPayoffCalcPageModule),
        canActivate: [AuthGuard],
    },
    {
        path: 'compoundreturncalc',
        loadChildren: () => import('./CompoundReturnCalc/CompoundReturnCalc.module').then(m => m.CompoundReturnCalcPageModule),
        canActivate: [AuthGuard],
    },
    {
        path: 'positionsizecalc',
        loadChildren: () => import('./PositionSizeCalc/PositionSizeCalc.module').then(m => m.PositionSizeCalcPageModule),
        canActivate: [AuthGuard],
    },
    {
        path: 'freedomcalc_legacy',
        loadChildren: () => import('./FreedomCalc_legacy/FreedomCalc_legacy.module').then(m => m.FreedomCalc_legacyPageModule),
        canActivate: [AuthGuard],
    },
    {
        path: 'lifestylecalc_legacy',
        loadChildren: () => import('./LifestyleCalc_legacy/LifestyleCalc_legacy.module').then(m => m.LifestyleCalc_legacyPageModule),
        canActivate: [AuthGuard],
    },
    {
        path: 'networthcalc',
        loadChildren: () => import('./NetWorthCalc/NetWorthCalc.module').then(m => m.NetWorthCalcPageModule),
        canActivate: [AuthGuard],
    },
    {
        path: 'nd1calc_legacy',
        loadChildren: () => import('./ND1Calc_legacy/ND1Calc_legacy.module').then(m => m.ND1Calc_legacyPageModule),
        canActivate: [AuthGuard],
    },
    {
        path: 'grmcalc',
        loadChildren: () => import('./GRMCalc/GRMCalc.module').then(m => m.GRMCalcPageModule),
        canActivate: [AuthGuard],
    },
    {
        path: 'nd2details',
        loadChildren: () => import('./ND2Details/ND2Details.module').then(m => m.ND2DetailsPageModule),
        canActivate: [AuthGuard],
    },
    {
        path: 'debtpayoff',
        loadChildren: () => import('./DebtPayoff/DebtPayoff.module').then(m => m.DebtPayoffPageModule),
        canActivate: [AuthGuard],
    },
    {
        path: 'dashboard',
        loadChildren: () => import('./Dashboard/Dashboard.module').then(m => m.DashboardPageModule),
        canActivate: [AuthGuard],
    },
    {
        path: 'notifications',
        loadChildren: () => import('./Notifications/Notifications.module').then(m => m.NotificationsPageModule),
        canActivate: [AuthGuard],
    },
    {
        path: 'profile',
        loadChildren: () => import('./EditProfile/EditProfile.module').then(m => m.EditProfilePageModule),
        canActivate: [AuthGuard],
    },
    {
        path: 'my-profile',
        loadChildren: () => import('./MyProfile/MyProfile.module').then(m => m.MyProfilePageModule),
        canActivate: [AuthGuard],
    },
    {
        path: 'goals',
        loadChildren: () => import('./EditGoals/EditGoals.module').then(m => m.EditGoalsPageModule),
        canActivate: [AuthGuard],
    },
    {
        path: 'checklist',
        loadChildren: () => import('./Checklist/Checklist.module').then(m => m.ChecklistPageModule),
    },
    {
        path: 'resourceDetails/:id/:sectionId',
        loadChildren: () => import('./ResourceDetails/ResourceDetails.module').then(m => m.ResourceDetailsPageModule),
        canActivate: [AuthGuard],
    },
    {
        path: 'compoundreturn',
        loadChildren: () => import('./CompoundReturn/CompoundReturn.module').then(m => m.CompoundReturnPageModule),
        canActivate: [AuthGuard],
    },
    {
        path: 'balancesheets',
        loadChildren: () => import('./BalanceSheets/BalanceSheets.module').then(m => m.BalanceSheetsPageModule),
        canActivate: [AuthGuard],
    },
    { 
        path: 'confirmCode/:username', 
        loadChildren: () => import('./ConfirmCode/ConfirmCode.module').then(m => m.ConfirmCodeModule),
        canActivate: [ProcessLoginNavigation]
    },
    { 
        path: 'page1/:phone', 
        loadChildren: () => import('./page1/page1.module').then(m => m.Page1PageModule),
        canActivate: [AuthGuard],
        canDeactivate: [Page1DeActivateGuard]
    },
    { 
        path: 'page2', 
        loadChildren: () => import('./page2/page2.module').then(m => m.Page2PageModule),
        canActivate: [AuthGuard],
        canDeactivate: [Page2DeActivateGuard]
    },
    {
        path: 'login/:otp', 
        loadChildren: () => import('./EmailLoginRedirect/EmailLoginRedirect.module').then(m => m.EmailLoginRedirectPageModule),
        canActivate: [ProcessLoginNavigation] 
    },
    { 
        path: 'progress', 
        loadChildren: () => import('./progress/progress.module').then(m => m.ProgressPageModule),
        canActivate: [AuthGuard]
    },
    {
        path: 'intro',
        loadChildren: () => import('./intro/intro.module').then( m => m.IntroPageModule),
        canActivate: [AuthGuard],
    },
    {
        path: 'intro-goals',
        loadChildren: () => import('./introGoals/intro-goals.module').then( m => m.IntroGoalsPageModule),
        canActivate: [AuthGuard],
    },
    {
        path: 'intro-education',
        loadChildren: () => import('./intro-education/intro-education.module').then( m => m.IntroEducationPageModule),
        canActivate: [AuthGuard],
    },
    {
        path: 'intro-income',
        loadChildren: () => import('./intro-income/intro-income.module').then( m => m.IntroIncomePageModule),
        canActivate: [AuthGuard],
    },
    {
        path: 'intro-budgeting',
        loadChildren: () => import('./intro-budgeting/intro-budgeting.module').then( m => m.IntroBudgetingPageModule),
        canActivate: [AuthGuard],
    },
    {
        path: 'intro-freedom',
        loadChildren: () => import('./intro-freedom/intro-freedom.module').then( m => m.IntroFreedomPageModule),
        canActivate: [AuthGuard],
    },
    {
        path: 'intro-lifestyle',
        loadChildren: () => import('./intro-lifestyle/intro-lifestyle.module').then( m => m.IntroLifestylePageModule),
        canActivate: [AuthGuard],
    },
    {
        path: 'intro-finish',
        loadChildren: () => import('./intro-finish/intro-finish.module').then( m => m.IntroFinishPageModule),
        canActivate: [AuthGuard],
    },
    {
        path: 'intro-finish2',
        loadChildren: () => import('./intro-finish2/intro-finish2.module').then( m => m.IntroFinish2PageModule),
        canActivate: [AuthGuard],
    },
  {
    path: 'intro-congrats',
    loadChildren: () => import('./intro-congrats/intro-congrats.module').then( m => m.IntroCongratsPageModule)
  }
];
@NgModule({
    imports: [RouterModule.forRoot(
        routes, {
    enableTracing: false,
    useHash: true,
    relativeLinkResolution: 'legacy'
}
    )],
    exports: [RouterModule]
})
export class AppRoutingModule {}