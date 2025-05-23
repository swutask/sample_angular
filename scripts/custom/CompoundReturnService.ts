import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {tap} from 'rxjs/operators';
import { ExportedClass as TCompoundReturn } from './TCompoundReturn';
import { ExportedClass as UserService } from '../custom/userService';
import { ExportedClass as AuthService} from '../custom/AuthService';
import {ExportedClass as BalanceSheetService} from './BalanceSheetService';
import {
    ExportedClass as CompoundReturnGraphQLService
} from '../../scripts/custom/GraphQLServices/CompoundReturnGraphQLService';

@Injectable()
class CompoundReturnService {
    public compoundReturnNumbersOutdated = true;
    private compoundReturnNumbers: any;
    public compoundReturnChartDataOutdated = true;
    private compoundReturnChartData: any;

    constructor(
        private userSvc: UserService,
        private authService: AuthService,
        private balanceSheetService: BalanceSheetService,
        private compoundReturnGraphQLService: CompoundReturnGraphQLService
    ) {
        this.authService.off(AuthService.LOGOUT_EVENT, this.invalidate.bind(this)).on(AuthService.LOGOUT_EVENT, this.invalidate.bind(this));
        this.balanceSheetService.off(BalanceSheetService.BS_CHANGE_EVENT, this.invalidate.bind(this)).on(BalanceSheetService.BS_CHANGE_EVENT, this.invalidate.bind(this));
    }

    invalidate() {
        this.compoundReturnNumbersOutdated = true;
        this.compoundReturnNumbers = undefined;
        this.compoundReturnChartDataOutdated = true;
        this.compoundReturnChartData = undefined;
    }

    calculateCompoundReturn(input: TCompoundReturn) {
        return of(this.compoundReturnGraphQLService.calculateCompoundReturn(input));
    }
}

export { CompoundReturnService as ExportedClass };
