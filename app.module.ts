import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import { PipesModule } from './scripts/pipes.module';
import { DirectivesModule } from './scripts/directives.module';
import { ComponentsModule } from './scripts/components.module';
import { CustomComponentsModule } from './scripts/custom-components.module';
import { CustomModulesModule } from './scripts/custom-modules.module';
import { app } from './app';
import { AppRoutingModule } from './app-routing.module';
import { TutorialTemplate } from './TutorialTemplate/TutorialTemplate';
import { FreedomNumberTutorial } from './FreedomNumberTutorial/FreedomNumberTutorial';
import { CompoundReturnTutorial } from './CompoundReturnTutorial/CompoundReturnTutorial';
import { ND1Tutorial } from './ND1Tutorial/ND1Tutorial';
import { LifestyleNumberTutorial } from './LifestyleNumberTutorial/LifestyleNumberTutorial';
import { DebtPayoffTutorial } from './DebtPayoffTutorial/DebtPayoffTutorial';
import { ND2Tutorial } from './ND2Tutorial/ND2Tutorial';
import { FreedomNumberDetailsModal } from './FreedomNumberDetailsModal/FreedomNumberDetailsModal';
import { SideMenu } from './SideMenu/SideMenu';
import { IosPWAInstallDialog } from './IosPWAInstallDialog/IosPWAInstallDialog';
import { Modal } from './Modal/Modal';
import { ExportedClass as FLNService } from './scripts/custom/FLNService';
import { ExportedClass as AppSideMenuService } from './scripts/custom/AppSideMenuService';
import { ExportedClass as CompoundReturnService } from './scripts/custom/CompoundReturnService';
import { ExportedClass as ND2Service } from './scripts/custom/ND2Service';
import { ExportedClass as UserGoalsService } from './scripts/custom/UserGoalsService';
import { ExportedClass as PWAInstallService } from './scripts/custom/PWAInstallService';
import { ExportedClass as AppRateService } from './scripts/custom/AppRateService';
import { ExportedClass as PlansService } from './scripts/custom/PlansService';
import { ExportedClass as RouterOutletService } from './scripts/custom/RouterOutletService';
import { ExportedClass as AccountsService } from './scripts/custom/AccountsService';
import { ExportedClass as userService } from './scripts/custom/userService';
import { ExportedClass as AuthService } from './scripts/custom/AuthService';
import { ExportedClass as UserService } from './scripts/custom/userService';
import { ExportedClass as UserProfileService } from './scripts/custom/UserProfileService';
import { ExportedClass as ND1Service } from './scripts/custom/ND1Service';
import { ExportedClass as BalanceSheetService } from './scripts/custom/BalanceSheetService';
import { ExportedClass as AccountsGraphQLService } from './scripts/custom/GraphQLServices/AccountsGraphQLService';
import { ExportedClass as BalanceSheetGraphQLService } from './scripts/custom/GraphQLServices/BalanceSheetGraphQLService';
import { ExportedClass as UserGraphQLService } from './scripts/custom/GraphQLServices/UserGraphQLService';
import { ExportedClass as DebtPayoffGraphQLService } from './scripts/custom/GraphQLServices/DebtPayoffGraphQLService';
import { ExportedClass as AuthGraphQLService } from './scripts/custom/GraphQLServices/AuthGraphQLService';
import { ExportedClass as CompoundReturnGraphQLService } from './scripts/custom/GraphQLServices/CompoundReturnGraphQLService';
import { ExportedClass as  MetricService} from './scripts/custom/MetricService';
import { ExportedClass as  MetricGraphQLService} from './scripts/custom/GraphQLServices/MetricGraphQLService';
import { ExportedClass as AppSyncService } from './scripts/services/AppSyncService';
import { ExportedClass as DebtPayoffService } from './scripts/custom/DebtPayoffService';
import { ExportedClass as GraphQLClientService } from './scripts/custom/GraphQLServices/GraphQLClientService';
import { ExportedClass as PlaidGraphQLService } from './scripts/custom/GraphQLServices/PlaidGraphQLService';
import { ExportedClass as PlaidService } from './scripts/custom/PlaidService';
import { Camera } from '@awesome-cordova-plugins/camera/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { WebView } from '@awesome-cordova-plugins/ionic-webview/ngx';
import { Device } from '@awesome-cordova-plugins/device/ngx';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { Keyboard } from '@awesome-cordova-plugins/keyboard/ngx';
import { httpInterceptorProviders } from 'src/app/scripts/custom/httpInterceptors';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { ReactiveFormsModule } from '@angular/forms';
import { ExportedClass as AuthGuard } from './scripts/custom/AuthGuard';
import { ExportedClass as Page2DeActivateGuard } from './scripts/custom/Page2DeActivateGuard';
import { ExportedClass as Page1DeActivateGuard } from './scripts/custom/Page1DeActivateGuard';
import { ExportedClass as ProcessLoginNavigation } from './scripts/custom/ProcessLoginNavigation';
import { AppRate } from '@awesome-cordova-plugins/app-rate/ngx';
import { FileTransfer } from '@awesome-cordova-plugins/file-transfer/ngx';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { SharedModule } from './shared.module';
import { ChartsModule } from 'ng2-charts';
import { CommonProvider } from './utility/common';
import { NgxTippyModule } from 'ngx-tippy-wrapper';
import {
  RecaptchaModule,
  RecaptchaFormsModule,
  RECAPTCHA_V3_SITE_KEY,
  RecaptchaV3Module,
} from 'ng-recaptcha';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { environment } from 'src/environments/environment';
import { OldModal } from './OldModal/OldModal';
import { ServiceWorkerModule } from '@angular/service-worker';
const RECAPTCHA_V3_SITE_KEY_VALUE = environment.RECAPTCHA_V3_SITE_KEY_VALUE;
export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

@NgModule({
  declarations: [
    app,
    TutorialTemplate,
    FreedomNumberTutorial,
    CompoundReturnTutorial,
    ND1Tutorial,
    LifestyleNumberTutorial,
    DebtPayoffTutorial,
    ND2Tutorial,
    FreedomNumberDetailsModal,
    SideMenu,
    IosPWAInstallDialog,
    Modal,
    OldModal,
  ],
  imports: [
    BrowserModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    RecaptchaV3Module,
    FormsModule,
    IonicModule.forRoot(),
    HttpClientModule,
    PipesModule,
    DirectivesModule,
    ComponentsModule,
    CustomComponentsModule,
    CustomModulesModule,
    IonicStorageModule.forRoot(),
    ReactiveFormsModule,
    AppRoutingModule,
    SharedModule,
    ChartsModule,
    NgxTippyModule,
    NgxMaskModule.forRoot(options),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    // MomentTimezonePickerModule,
  ],
  bootstrap: [app],
  providers: [
    StatusBar,
    SplashScreen,
    Device,
    Keyboard,
    Camera,
    File,
    InAppBrowser,
    FLNService,
    AppSideMenuService,
    CompoundReturnService,
    ND2Service,
    UserGoalsService,
    PWAInstallService,
    AppRateService,
    PlansService,
    RouterOutletService,
    AccountsService,
    userService,
    AuthService,
    CommonProvider,
    UserService,
    UserProfileService,
    ND1Service,
    BalanceSheetService,
    DebtPayoffService,
    AppSyncService,
    PlaidService,
    AccountsGraphQLService,
    BalanceSheetGraphQLService,
    UserGraphQLService,
    AuthGraphQLService,
    DebtPayoffGraphQLService,
    CompoundReturnGraphQLService,
    PlaidGraphQLService,
    GraphQLClientService,
    httpInterceptorProviders,
    WebView,
    AuthGuard,
    Page1DeActivateGuard,
    Page2DeActivateGuard,
    ProcessLoginNavigation,
    AppRate,
    FileTransfer,
    ScreenOrientation,
    MetricService,
    MetricGraphQLService,
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: RECAPTCHA_V3_SITE_KEY_VALUE,
    },
  ],
})
export class AppModule {}
