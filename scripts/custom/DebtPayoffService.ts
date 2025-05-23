import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { ExportedClass as TDebtPayoff } from './TDebtPayoff';
import { ExportedClass as UserService } from '../custom/userService';
import {tap} from 'rxjs/operators';
import { ExportedClass as AuthService} from '../custom/AuthService';
import {ExportedClass as BalanceSheetService} from './BalanceSheetService';
import {
    ExportedClass as DebtPayoffGraphQLService
} from '../../scripts/custom/GraphQLServices/DebtPayoffGraphQLService';

@Injectable()
class DebtPayoffService {
    public debtPayoffNumbersOutdated = true;
    public debtPayoffBurnDownChartDataOutdated = true;
    private debtPayoffNumbers: any;
    private debtPayoffBurnDownChartData: any;

    constructor(
        private userSvc: UserService,
        private authService: AuthService,
        private balanceSheetService: BalanceSheetService,
        private debtPayoffGraphQLService: DebtPayoffGraphQLService
    ) {
        this.authService.off(AuthService.LOGOUT_EVENT, this.invalidate.bind(this)).on(AuthService.LOGOUT_EVENT, this.invalidate.bind(this));
        this.balanceSheetService.off(BalanceSheetService.BS_CHANGE_EVENT, this.invalidate.bind(this)).on(BalanceSheetService.BS_CHANGE_EVENT, this.invalidate.bind(this));
    }

    invalidate() {
        this.debtPayoffNumbersOutdated = true;
        this.debtPayoffBurnDownChartDataOutdated = true;
        this.debtPayoffNumbers = undefined;
        this.debtPayoffBurnDownChartData = undefined;
    }

    calculateDebtPayoff(sortPayoffBy: string) {
        return of(this.debtPayoffGraphQLService.calculateDebtPayoff( sortPayoffBy ));
    }
}

export { DebtPayoffService as ExportedClass };
