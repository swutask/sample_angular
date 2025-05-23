import { ExportedClass as TFreedomCalculator} from './TFreedomCalculator';
import { ExportedClass as TLifestyleCalculator } from './TLifestyleCalculator';
import { ExportedClass as TND1Calculator } from './TND1Calculator';
import { ExportedClass as TND2Calculator } from './TND2Calculator';
import { ExportedClass as TDebtPayoff } from './TDebtPayoff';

interface TUserPlans {
    'freedomCalcs': TFreedomCalculator[];
    'lifestyleCalcs': TLifestyleCalculator[];
    'nd1Calcs': TND1Calculator[];
    'nd2Calcs': TND2Calculator[];
    'debtPayoffCalcs': TDebtPayoff[];
}

export {
    TUserPlans as ExportedClass
};