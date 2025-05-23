import {
    Component, ElementRef, QueryList, ViewChild, ViewChildren
} from '@angular/core';
import {
    ChangeDetectorRef
} from '@angular/core';
import {
    AlertController,
    MenuController,
    ModalController,
    NavController
} from '@ionic/angular';
import {
    Platform
} from '@ionic/angular';
import {
    Router
} from '@angular/router';
import {
    ExportedClass as userService
} from '../scripts/custom/userService';
import {
    ExportedClass as AccountsService
} from '../scripts/custom/AccountsService';
import {
    ExportedClass as TAccountsSummary
} from '../scripts/custom/TAccountsSummary';
import {
    ExportedClass as RouterOutletService
} from '../scripts/custom/RouterOutletService';
import {
    ExportedClass as TFreedomCalculator
} from '../scripts/custom/TFreedomCalculator';
import {
    ExportedClass as TLifestyleCalculator
} from '../scripts/custom/TLifestyleCalculator';
import {
    ExportedClass as TND1Calculator
} from '../scripts/custom/TND1Calculator';
import {
    ExportedClass as TND2Calculator
} from '../scripts/custom/TND2Calculator';
import {
    ExportedClass as TDebtPayoff
} from '../scripts/custom/TDebtPayoff';
import {
    ExportedClass as ND1Service
} from '../scripts/custom/ND1Service';
import {
    ExportedClass as ND2Service
} from '../scripts/custom/ND2Service';
import {
    ExportedClass as DebtPayoffService
} from '../scripts/custom/DebtPayoffService';
import {
    ExportedClass as TDebtPayoffBurnDownChart
} from '../scripts/custom/TDebtPayoffBurnDownChart';
import {
    ExportedClass as CompoundReturnService
} from '../scripts/custom/CompoundReturnService';
import {
    ExportedClass as BalanceSheetService
} from '../scripts/custom/BalanceSheetService';
import {
    ExportedClass as MetricService
} from '../scripts/custom/MetricService'
import {
    NavigationExtras
} from '@angular/router';
import _ from 'lodash';
import {
    CurrencyPipe
} from '@angular/common';
import {
    Subscription
} from 'rxjs';
import {
    ExportedClass as AuthService
} from '../scripts/custom/AuthService';
import {
    ExportedClass as AppSideMenuService
} from '../scripts/custom/AppSideMenuService';
import {
    ExportedClass as CmsResourceList
} from '../scripts/custom/CmsResourceList';
import {
    ExportedClass as TAccountList
} from '../scripts/custom/TAccountList';
import {
    ExportedClass as goalConstants
} from '../scripts/custom/goalConstants';
import { CommonProvider } from '../utility/common';
import { BaseChartDirective } from 'ng2-charts';
import { NavigationOptions } from '@ionic/angular/providers/nav-controller';
import { customAnimation } from '../animations/customAnimation';
import { take } from 'rxjs/operators';
import { Modal } from '../Modal/Modal';
import { DomSanitizer } from '@angular/platform-browser';
import moment from 'moment';

@Component({
    templateUrl: 'Dashboard.html',
    selector: 'page-dashboard',
    styleUrls: ['Dashboard.scss']
})
export class Dashboard {
    public slideOpts = {
        initialSlide: 0,
        speed: 400,
        spaceBetween: 16
    };
    public accountsSummary: TAccountsSummary = {
        netWorth: 0,
        assetWorth: 0,
        liabilityWorth: 0,
        excludedLiabilityWorth: 0,
        tier1: 0,
        tier2: 0,
        tier3: 0,
        totalWealthAccount: 0
    };
    public resourceList: CmsResourceList;
    public sheet: any = 'default';
    public accountsDataLoadingPromise: Promise<any>;
    public freedomCalculatorData: TFreedomCalculator;
    public dataLoadingPromise: Promise<any>;
    public nd1CalculatorData: TND1Calculator;
    public nd2CalculatorData: TND2Calculator;
    public window: any = window;
    public debtPayoffCalculatorData: TDebtPayoff;
    public lifestyleCalculatorData: TLifestyleCalculator;
    public access: string = 'Free';
    public debtPayoffBurnDownChartData: TDebtPayoffBurnDownChart;
    public compoundReturnBurnUpChartData: any;
    public compoundReturnChartShowHorizontalLines: boolean = false;
    public freedomNumber: number;
    public freedomNumberPromise: Promise<any>;
    public lifestyleNumber: number;
    public lifestyleNumberPromise: Promise<any>;
    public isBsExperimentActivated: boolean = false;
    public wideModeMinWidth: number = 1000;
    public currentItem: any = null;
    public mappingData: any = {};
    public userAvatar: string;
    public subscriptions: Subscription[] = [];
    public balanceSheets: any[] = [];
    public accountList: TAccountList = [];
    public nonExcludedAssets: TAccountList = [];
    public assetList: TAccountList = [];
    public assets: any = 0;
    public liabilities: any = 0;
    public primaryGoal: any;
    public isMobile: boolean = true;
    public dashboardBannerMessage: string;
    legendData: any;
    debtLegendData: any = [];
    public isProfileDone: boolean = false;
    public isGoalsDone: boolean = false;
    public isFreedomDone: boolean = false;
    public isLifestyleDone: boolean = false;
    public isLegacyDone: boolean = false;
    public isAssetDone: boolean = false;
    public isLiabilityDone: boolean = false;
    public isBudgetingDone: boolean = false;
    public isCapitalDone: boolean = false;
    public isCompoundDone: boolean = false;
    public isIncomeDone: boolean = false;
    public isPorfolioDone: boolean = false;
    public isRiskDone: boolean = false;
    public isTaxDone: boolean = false;
    public isAssetPDone: boolean = false;
    public isDebtDone: boolean = false;
    public isDebtFree: boolean = false;
    public monthlyEarnedIncome: number;
    public useND1WealthValue: boolean;
    public showMonthly: boolean;
    public useUnearnedIncomeValues: boolean;
    public yearsInvested: number;
    public annualContribution: number;
    public annualIncreaseContribution: number;
    public annualWithdrawal: number;
    public withdrawalStartingYear: number;
    public volatilityDrawdown: number;
    public everyNumberYears: number;
    public defaultAccountList: TAccountList = [];
    public defaultNonExcludedAssets: TAccountList = [];
    public defaultAssetList: TAccountList = [];
    public defaultLiabilityList: TAccountList = [];
    public actionSheetOptions: any = {
        cssClass: 'goals-alert'
    }

    public popoverSheetOptions: any = {
        side: 'bottom',
        size: 'cover',
        cssClass: 'min-width-option'
    };
    public selectAccountId = '';
    @ViewChild('myCompoundCanvas') canvasRef: ElementRef;
    @ViewChild('myDebtCanvas') canvasRef2: ElementRef;
    @ViewChild('nd1Canvas') nd1Canvas: ElementRef;
    @ViewChild('nd2Canvas') nd2Canvas: ElementRef;
    @ViewChild('netWorthCanvas') netWorthCanvas: ElementRef;
    @ViewChild('monthlyIncomeCanvas') monthlyIncomeCanvas: ElementRef;
    @ViewChild('totalBalanceCanvas') totalBalanceCanvas: ElementRef;
    @ViewChild('debtBalanceCanvas') debtBalanceCanvas: ElementRef;
    @ViewChild('debtBalanceAccelCanvas') debtBalanceAccelCanvas: ElementRef;
    @ViewChild('totalAssetWorthCanvas') totalAssetWorthCanvas: ElementRef;
    @ViewChild('totalLiabilityWorthCanvas') totalLiabilityWorthCanvas: ElementRef;
    @ViewChild('tier1Canvas') tier1Canvas: ElementRef;
    @ViewChild('tier2Canvas') tier2Canvas: ElementRef;
    @ViewChild('tier3Canvas') tier3Canvas: ElementRef;
    @ViewChild('totalWealthCanvas') totalWealthCanvas: ElementRef;
    @ViewChild('nd1legendsItems') nd1legendsItems: ElementRef;
    @ViewChild('nd2ChartLegend') nd2ChartLegend: ElementRef;
    @ViewChild('accountBalanceCanvas') accountBalanceCanvas: ElementRef;
    @ViewChildren(BaseChartDirective) charts: QueryList<BaseChartDirective>;

    public graphColors = {
        '--graph-aero': '#66C6FF',
        '--graph-aquamarine': '#5CE593',
        '--graph-yellow': '#FFCF33',
        '--graph-red-crayola': '#FF524D',
        '--graph-orange': '#FFA31A',
        '--graph-violet': '#675CE5',
        '--graph-rich-black': '#0D0D0D',
        '--graph-jet': '#333333',
        '--graph-dim-gray': '#666666',
        '--graph-silver': '#BFBFBF',
        '--graph-green-silver': '#D0D7D4',
        '--graph-blue-silver': '#D0DEE1',
        '--graph-purple-silver': '#ACADB4',
        '--graph-light-gray': '#E6E6E6',
        '--graph-grey': '#F2F2F2',
        '--graph-cultured': '#FAFAFA',
        '--graph-ivory': '#F7F5F3',
        '--graph-coconut': '#DDDDDD'
    };

    public nd1ChartMeta = {
        datasets: [{
            data: [],
            backgroundColor: [
                this.graphColors['--graph-aero'], this.graphColors['--graph-yellow'], this.graphColors['--graph-aquamarine'], this.graphColors['--graph-red-crayola'], this.graphColors['--graph-jet'], this.graphColors['--graph-dim-gray'], this.graphColors['--graph-purple-silver'], this.graphColors['--graph-silver'], this.graphColors['--graph-green-silver'], this.graphColors['--graph-blue-silver'], this.graphColors['--graph-light-gray'], this.graphColors['--graph-grey'], this.graphColors['--graph-cultured'], this.graphColors['--graph-ivory'],
            ],
            borderColor: [
                this.graphColors['--graph-aero'], this.graphColors['--graph-yellow'], this.graphColors['--graph-aquamarine'], this.graphColors['--graph-red-crayola'], this.graphColors['--graph-jet'], this.graphColors['--graph-dim-gray'], this.graphColors['--graph-purple-silver'], this.graphColors['--graph-silver'], this.graphColors['--graph-green-silver'], this.graphColors['--graph-blue-silver'], this.graphColors['--graph-light-gray'], this.graphColors['--graph-grey'], this.graphColors['--graph-cultured'], this.graphColors['--graph-ivory'],
            ],
            borderWidth: 1
        }],
        labels: ['Bills', 'Giving', 'Wealth', 'Debt Accelerator'],
        options: {
            cutoutPercentage: 80,
            legend: {
                position: 'right',
                display: false
            },
            responsive: true,
            aspectRatio: this.platform.width() > 640 ? 1.3 : 1,
            maintainAspectRatio: true,
            tooltips: {
                enabled: true,
                bodyFontSize: 15,
                callbacks: {
                    label: (tooltipItem, data) => {
                        const datasetLabel = data.datasets[tooltipItem.datasetIndex].label || '';
                        return [`${datasetLabel} ${data.labels[tooltipItem.index]}:`];
                    },
                    afterLabel: (tooltipItem, data) => {
                        const datasetLabel = data.datasets[tooltipItem.datasetIndex].label || '';
                        return [` $ ${this.common.numberWithCommas(Math.round(this.nd1CalculatorData.earnedIncome * +data.datasets[0].data[tooltipItem.index] / 100))} (${data.datasets[0].data[tooltipItem.index]}%)`];
                    }
                }

            },

        }
    }
    private getLegendCallback = (function (self) {
        function handle(chart) {
            return chart.legend.legendItems;
        }
        return function (chart) {
            return handle(chart);
        };
    })(this);
    public nd2legends;
    public nd2ChartMeta = {
        datasets: [{
            data: [],
            backgroundColor: [
                this.graphColors['--graph-aero'], this.graphColors['--graph-aquamarine'], this.graphColors['--graph-yellow']
            ],
            borderColor: [
                this.graphColors['--graph-aero'], this.graphColors['--graph-aquamarine'], this.graphColors['--graph-yellow']
            ],
            borderWidth: 1
        }],
        labels: ['T1 Liquidity', 'T2 Cash Flow Assets', 'T3 Speculations'],
        options: {
            cutoutPercentage: 80,
            legend: {
                position: 'right',
                display: false
            },
            responsive: true,
            aspectRatio: this.platform.width() > 640 ? 1.3 : 1,
            maintainAspectRatio: true,
            legendCallback: this.getLegendCallback,
            tooltips: {
                enabled: true,
                bodyFontSize: this.platform.width() > 640 ? 15 : 10,
                callbacks: {
                    label: (tooltipItem, data) => {
                        const datasetLabel = data.datasets[tooltipItem.datasetIndex].label || '';
                        return [`${datasetLabel} ${data.labels[tooltipItem.index]}:`];
                    },
                    afterLabel: (tooltipItem, data) => {
                        const datasetLabel = data.datasets[tooltipItem.datasetIndex].label || '';
                        return [` $ ${this.common.numberWithCommas(Math.round(this.accountsSummary.totalWealthAccount * +data.datasets[0].data[tooltipItem.index] / 100))} (${data.datasets[0].data[tooltipItem.index].toFixed(1)}%)`];
                    }
                }

            },

        }
    }
    public compoundReturnDefaultDataset = [
        {
            label: 'Freedom Number', data: [], fill: false, pointStyle: 'circle',
            pointBorderColor: this.graphColors['--graph-aero'], borderColor: this.graphColors['--graph-aero'], pointRadius: 2,
            backgroundColor: this.graphColors['--graph-aero'],
            pointBackgroundColor: this.graphColors['--graph-aero'],
            pointBorderWidth: 2, yAxisID: "id1"
        },
        {
            label: 'Lifestyle Number', data: [], fill: false, pointStyle: 'circle',
            pointBorderColor: this.graphColors['--graph-violet'], borderColor: this.graphColors['--graph-violet'], pointRadius: 2,
            backgroundColor: this.graphColors['--graph-violet'],
            pointBackgroundColor: this.graphColors['--graph-violet'],
            pointBorderWidth: 2, yAxisID: "id1"
        },
        {
            label: 'Unearned Income', data: [], fill: false, pointStyle: 'circle',
            pointBorderColor: this.graphColors['--graph-aquamarine'], borderColor: this.graphColors['--graph-aquamarine'], pointRadius: 2,
            backgroundColor: this.graphColors['--graph-aquamarine'],
            pointBackgroundColor: this.graphColors['--graph-aquamarine'],
            pointBorderWidth: 2, yAxisID: "id1"
        },
        {
            label: 'Balance', data: [], fill: false, pointStyle: 'circle',
            pointBorderColor: this.graphColors['--graph-yellow'], borderColor: this.graphColors['--graph-yellow'], pointRadius: 2,
            backgroundColor: this.graphColors['--graph-yellow'],
            pointBackgroundColor: this.graphColors['--graph-yellow'],
            pointBorderWidth: 2, yAxisID: "id2"
        },
    ];
    public compoundReturnChartMeta = {
        dataSets: [],
        labels: [],
        options: {
            responsive: true,
            maintainAspectRatio: true,
            legend: {
                display: false
            },
            legendCallback: this.getLegendCallback,
            tooltips: {
                enabled: false,
                custom: (tooltipModel) => {
                    // Tooltip Element
                    var tooltipEl = document.getElementById('chartjs-tooltip');

                    // Create element on first render
                    if (!tooltipEl) {
                        tooltipEl = document.createElement('div');
                        tooltipEl.id = 'chartjs-tooltip';
                        tooltipEl.innerHTML = '<table style="font-family:&quot;neue haas&quot;, sans-serif"></table>';
                        document.body.appendChild(tooltipEl);
                    }

                    // Hide if no tooltip
                    if (tooltipModel.opacity === 0) {
                        tooltipEl.style.opacity = '0';
                        return;
                    }

                    // Set caret Position
                    tooltipEl.classList.remove('above', 'below', 'no-transform');
                    if (tooltipModel.yAlign) {
                        tooltipEl.classList.add(tooltipModel.yAlign);
                    } else {
                        tooltipEl.classList.add('no-transform');
                    }

                    function getBody(bodyItem) {
                        return bodyItem.lines;
                    }

                    // Set Text
                    if (tooltipModel.body) {
                        var titleLines = tooltipModel.title || [];
                        var bodyLines = tooltipModel.body.map(getBody);

                        var innerHtml = '<thead>';

                        // titleLines.forEach(function(title) {
                        //     innerHtml += '<tr><th>' + title + '</th></tr>';
                        // });
                        var style = 'background:#FFFFFF';
                        style += '; border-color:#E6E6E6';
                        style += '; border-width: 2px';
                        innerHtml += '</thead><tbody style="' + style + '">';

                        bodyLines.forEach((body, i) => {
                            const datapoint = this.compoundReturnBurnUpChartData.yearlySnapshots[tooltipModel.dataPoints[0].index];
                            const date = new Date(this.compoundReturnBurnUpChartData.yearlySnapshots[tooltipModel.dataPoints[0].index].year, this.compoundReturnBurnUpChartData.yearlySnapshots[tooltipModel.dataPoints[0].index].month ? this.compoundReturnBurnUpChartData.yearlySnapshots[tooltipModel.dataPoints[0].index].month : 0, 1);
                            let dateString = `<p> ${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}, ${date.getFullYear()}</p>`;
                            dateString +=
                                '<p>Monthly Income: $' + new Intl.NumberFormat().format(this.showMonthly ? datapoint?.yearlyIncome : datapoint?.income) + '</p>' +
                                '<p>Yield: ' + this.compoundReturnBurnUpChartData.yearlySnapshots[tooltipModel.dataPoints[0].index]?.yield + '%</p>' +
                                '<p>Yield on Cost: ' + this.compoundReturnBurnUpChartData.yearlySnapshots[tooltipModel.dataPoints[0].index]?.yieldOnCost + '%</p>' +
                                '<p>Balance: $' + new Intl.NumberFormat().format(this.compoundReturnBurnUpChartData.yearlySnapshots[tooltipModel.dataPoints[0].index]?.balance) + '</p>',
                                this.lifestyleNumber,
                                dateString +
                                `<p>Lifestyle Number: $${new Intl.NumberFormat().format(this.lifestyleNumber)}</p>`,
                                this.freedomNumber,
                                dateString +
                                `<p>Freedom Number: $${new Intl.NumberFormat().format(this.freedomNumber)}</p>`;
                            // var span = '<span style="' + style + '"></span>';
                            innerHtml += '<tr><td style="padding:10px;">' + dateString + '</td></tr>';
                        });
                        innerHtml += '</tbody>';

                        var tableRoot = tooltipEl.querySelector('table');
                        tableRoot.innerHTML = innerHtml;
                    }

                    // `this` will be the overall tooltip
                    var position = this.canvasRef.nativeElement.getBoundingClientRect();

                    // Display, position, and set styles for font
                    tooltipEl.style.opacity = '1';
                    tooltipEl.style.position = 'absolute';
                    tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
                    tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
                    tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
                    tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
                    tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
                    tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
                    tooltipEl.style.pointerEvents = 'none';
                }
            },
            scales: {
                xAxes: [
                    {
                        display: true,
                        gridLines: {
                            display: false
                        },
                        ticks: {
                            maxTicksLimit: 10
                        }
                    }
                ],
                yAxes: [
                    {
                        display: true,
                        position: 'left',
                        type: "linear",
                        id: "id1",
                        ticks: {
                            suggestedMin: 0,
                            maxTicksLimit: 6,
                            callback: function (value, index, values) {
                                if (value == 0)
                                    return 0;
                                else
                                    return typeof (value) == 'number' ? "$" + ((value / 1000)) + "K" : value;
                            }
                        }
                    },
                    {
                        display: true,
                        position: 'right',
                        type: "linear",
                        id: "id2",
                        gridLines: {
                            display: false
                        },
                        ticks: {
                            suggestedMin: 0,
                            maxTicksLimit: 6,
                            callback: function (value, index, values) {
                                if (value == 0)
                                    return 0;
                                else
                                    return typeof (value) == 'number' ? "$" + ((value / 1000)) + "K" : value;
                            }
                        }
                    }
                ]
            },
            plugins: [],
        }
    };
    public debtPayOffChartMeta = {
        dataSets: [
            {
                label: 'Current payoff', data: [], fill: false, pointStyle: 'circle',
                pointBorderColor: this.graphColors['--graph-red-crayola'], borderColor: this.graphColors['--graph-red-crayola'], pointRadius: 2,
                backgroundColor: this.graphColors['--graph-red-crayola'],
                pointBackgroundColor: this.graphColors['--graph-red-crayola'],
                pointBorderWidth: 2,
            },
            {
                label: 'Accelerator payoff', data: [], fill: false, pointStyle: 'circle',
                pointBorderColor: this.graphColors['--graph-orange'], borderColor: this.graphColors['--graph-orange'], pointRadius: 2,
                backgroundColor: this.graphColors['--graph-orange'],
                pointBackgroundColor: this.graphColors['--graph-orange'],
                pointBorderWidth: 2,
            },
        ],
        labels: [],
        options: {
            responsive: true,
            maintainAspectRatio: true,
            legend: {
                display: false
            },
            legendCallback: this.getLegendCallback,
            tooltips: {
                enabled: false,
                mode: 'single',
                intersect: true,
                custom: (tooltipModel) => {
                    // Tooltip Element
                    var tooltipEl = document.getElementById('chartjs-tooltip');

                    // Create element on first render
                    if (!tooltipEl) {
                        tooltipEl = document.createElement('div');
                        tooltipEl.id = 'chartjs-tooltip';
                        tooltipEl.innerHTML = '<table style="font-family:&quot;neue haas&quot;, sans-serif"></table>';
                        document.body.appendChild(tooltipEl);
                    }

                    // Hide if no tooltip
                    if (tooltipModel.opacity === 0) {
                        tooltipEl.style.opacity = '0';
                        return;
                    }

                    // Set caret Position
                    tooltipEl.classList.remove('above', 'below', 'no-transform');
                    if (tooltipModel.yAlign) {
                        tooltipEl.classList.add(tooltipModel.yAlign);
                    } else {
                        tooltipEl.classList.add('no-transform');
                    }

                    function getBody(bodyItem) {
                        return bodyItem.lines;
                    }

                    // Set Text
                    if (tooltipModel.body) {
                        var titleLines = tooltipModel.title || [];
                        var bodyLines = tooltipModel.body.map(getBody);

                        var innerHtml = '<thead>';
                        var style = 'background:#FFFFFF';
                        style += '; border-color:#E6E6E6';
                        style += '; border-width: 2px';
                        innerHtml += '</thead><tbody style="' + style + '">';

                        bodyLines.forEach((body, i) => {
                            const date = new Date(this.debtPayoffBurnDownChartData.yearlySnapshots[tooltipModel.dataPoints[0].index].year, this.debtPayoffBurnDownChartData.yearlySnapshots[tooltipModel.dataPoints[0].index].month ? this.debtPayoffBurnDownChartData.yearlySnapshots[tooltipModel.dataPoints[0].index].month : 0, 1);
                            let dateString = `<p> ${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}, ${date.getFullYear()}</p>`;
                            dateString +=
                                '<p>Balance of all debt: $' + new Intl.NumberFormat().format(this.debtPayoffBurnDownChartData.yearlySnapshots[tooltipModel.dataPoints[0].index].balanceOfAllDebts) + '</p>' +
                                '<p>Balance of all debts with accelerator: $' + new Intl.NumberFormat().format(this.debtPayoffBurnDownChartData.yearlySnapshots[tooltipModel.dataPoints[0].index].balanceOfAllDebtsWithAccel) + '</p>';
                            // var span = '<span style="' + style + '"></span>';
                            innerHtml += '<tr><td style="padding:10px;">' + dateString + '</td></tr>';
                        });
                        innerHtml += '</tbody>';

                        var tableRoot = tooltipEl.querySelector('table');
                        tableRoot.innerHTML = innerHtml;
                    }

                    // `this` will be the overall tooltip
                    var position = this.canvasRef2.nativeElement.getBoundingClientRect();

                    // Display, position, and set styles for font
                    tooltipEl.style.opacity = '1';
                    tooltipEl.style.position = 'absolute';
                    tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
                    tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
                    tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
                    tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
                    tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
                    tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
                    tooltipEl.style.pointerEvents = 'none';
                }
            },
            scales: {
                xAxes: [
                    {
                        display: true,
                        gridLines: {
                            display: false
                        },
                        ticks: {
                            maxTicksLimit: 10
                        }
                    }
                ],
                yAxes: [
                    {
                        display: true,
                        ticks: {
                            suggestedMin: 0,
                            maxTicksLimit: 6,
                            callback: function (value, index, values) {
                                if (value == 0)
                                    return 0;
                                else
                                    return typeof (value) == 'number' ? "$" + ((value / 1000)) + "K" : value;
                            }
                        }
                    }
                ]
            },
            plugins: [],
        }
    }

    public netWorthChartMeta = {
        dataSets: [
            {
                label: 'Balance', data: [], fill: false, pointStyle: 'circle',
                pointBorderColor: this.graphColors['--graph-aero'], borderColor: this.graphColors['--graph-aero'], pointRadius: 2,
                backgroundColor: this.graphColors['--graph-aero'],
                pointBackgroundColor: this.graphColors['--graph-aero'],
                pointBorderWidth: 2
            },
        ],
        labels: [],
        options: {
            responsive: true,
            maintainAspectRatio: true,
            legend: {
                display: false
            },
            legendCallback: this.getLegendCallback,
            tooltips: {
                enabled: false,
                custom: (tooltipModel) => {
                    // Tooltip Element
                    var tooltipEl = document.getElementById('chartjs-tooltip');

                    // Create element on first render
                    if (!tooltipEl) {
                        tooltipEl = document.createElement('div');
                        tooltipEl.id = 'chartjs-tooltip';
                        tooltipEl.innerHTML = '<table style="font-family:&quot;neue haas&quot;, sans-serif"></table>';
                        document.body.appendChild(tooltipEl);
                    }

                    // Hide if no tooltip
                    if (tooltipModel.opacity === 0) {
                        tooltipEl.style.opacity = '0';
                        return;
                    }

                    // Set caret Position
                    tooltipEl.classList.remove('above', 'below', 'no-transform');
                    if (tooltipModel.yAlign) {
                        tooltipEl.classList.add(tooltipModel.yAlign);
                    } else {
                        tooltipEl.classList.add('no-transform');
                    }

                    function getBody(bodyItem) {
                        return bodyItem.lines;
                    }

                    // Set Text
                    if (tooltipModel.body) {
                        var titleLines = tooltipModel.title || [];
                        var bodyLines = tooltipModel.body.map(getBody);

                        var innerHtml = '<thead>';

                        var style = 'background:#FFFFFF';
                        style += '; border-color:#E6E6E6';
                        style += '; border-width: 2px';
                        innerHtml += '</thead><tbody style="' + style + '">';

                        bodyLines.forEach((body, i) => {
                            const date = this.netWorth.dates[tooltipModel.dataPoints[0].index]
                            let dateString = `<p> ${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}, ${date.getFullYear()}</p>`;

                            dateString += '<p>Balance: $' + new Intl.NumberFormat().format(this.netWorth.metricValues[tooltipModel.dataPoints[0].index].toFixed(2)) + '</p>';

                            innerHtml += '<tr><td style="padding:10px;">' + dateString + '</td></tr>';
                        });
                        innerHtml += '</tbody>';

                        var tableRoot = tooltipEl.querySelector('table');
                        tableRoot.innerHTML = innerHtml;
                    }

                    // `this` will be the overall tooltip
                    var position = this.netWorthCanvas.nativeElement.getBoundingClientRect();

                    // Display, position, and set styles for font
                    tooltipEl.style.opacity = '1';
                    tooltipEl.style.position = 'absolute';
                    tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
                    tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
                    tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
                    tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
                    tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
                    tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
                    tooltipEl.style.pointerEvents = 'none';
                }
            },
            scales: {
                xAxes: [
                    {
                        display: true,
                        gridLines: {
                            display: false
                        },
                        ticks: {
                            maxTicksLimit: 10
                        }
                    }
                ],
                yAxes: [
                    {
                        display: true,
                        ticks: {
                            suggestedMin: 0,
                            maxTicksLimit: 6,
                            callback: function (value, index, values) {
                                if (value == 0)
                                    return 0;
                                else
                                    return typeof (value) == 'number' ? "$" + ((value / 1000)) + "K" : value;
                            }
                        }
                    },
                ]
            },
            plugins: [],
        }
    };
    public monthlyIncomeChartMeta = {
        dataSets: [
            {
                label: 'Balance', data: [], fill: false, pointStyle: 'circle',
                pointBorderColor: this.graphColors['--graph-aquamarine'], borderColor: this.graphColors['--graph-aquamarine'], pointRadius: 2,
                backgroundColor: this.graphColors['--graph-aquamarine'],
                pointBackgroundColor: this.graphColors['--graph-aquamarine'],
                pointBorderWidth: 2
            },
        ],
        labels: [],
        options: {
            responsive: true,
            maintainAspectRatio: true,
            legend: {
                display: false
            },
            legendCallback: this.getLegendCallback,
            tooltips: {
                enabled: false,
                custom: (tooltipModel) => {
                    // Tooltip Element
                    var tooltipEl = document.getElementById('chartjs-tooltip');

                    // Create element on first render
                    if (!tooltipEl) {
                        tooltipEl = document.createElement('div');
                        tooltipEl.id = 'chartjs-tooltip';
                        tooltipEl.innerHTML = '<table style="font-family:&quot;neue haas&quot;, sans-serif"></table>';
                        document.body.appendChild(tooltipEl);
                    }

                    // Hide if no tooltip
                    if (tooltipModel.opacity === 0) {
                        tooltipEl.style.opacity = '0';
                        return;
                    }

                    // Set caret Position
                    tooltipEl.classList.remove('above', 'below', 'no-transform');
                    if (tooltipModel.yAlign) {
                        tooltipEl.classList.add(tooltipModel.yAlign);
                    } else {
                        tooltipEl.classList.add('no-transform');
                    }

                    function getBody(bodyItem) {
                        return bodyItem.lines;
                    }

                    // Set Text
                    if (tooltipModel.body) {
                        var titleLines = tooltipModel.title || [];
                        var bodyLines = tooltipModel.body.map(getBody);

                        var innerHtml = '<thead>';

                        var style = 'background:#FFFFFF';
                        style += '; border-color:#E6E6E6';
                        style += '; border-width: 2px';
                        innerHtml += '</thead><tbody style="' + style + '">';

                        bodyLines.forEach((body, i) => {
                            const date = this.monthlyIncome.dates[tooltipModel.dataPoints[0].index]
                            let dateString = `<p> ${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}, ${date.getFullYear()}</p>`;

                            dateString += '<p>Balance: $' + new Intl.NumberFormat().format(this.monthlyIncome.metricValues[tooltipModel.dataPoints[0].index].toFixed(2)) + '</p>';

                            innerHtml += '<tr><td style="padding:10px;">' + dateString + '</td></tr>';
                        });
                        innerHtml += '</tbody>';

                        var tableRoot = tooltipEl.querySelector('table');
                        tableRoot.innerHTML = innerHtml;
                    }

                    // `this` will be the overall tooltip
                    var position = this.monthlyIncomeCanvas.nativeElement.getBoundingClientRect();

                    // Display, position, and set styles for font
                    tooltipEl.style.opacity = '1';
                    tooltipEl.style.position = 'absolute';
                    tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
                    tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
                    tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
                    tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
                    tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
                    tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
                    tooltipEl.style.pointerEvents = 'none';
                }
            },
            scales: {
                xAxes: [
                    {
                        display: true,
                        gridLines: {
                            display: false
                        },
                        ticks: {
                            maxTicksLimit: 10
                        }
                    }
                ],
                yAxes: [
                    {
                        display: true,
                        ticks: {
                            suggestedMin: 0,
                            maxTicksLimit: 6,
                            callback: function (value, index, values) {
                                if (value == 0)
                                    return 0;
                                else
                                    return typeof (value) == 'number' ? "$" + ((value / 1000)) + "K" : value;
                            }
                        }
                    },
                ]
            },
            plugins: [],
        }
    };
    public totalBalanceChartMeta = {
        dataSets: [
            {
                label: 'Balance', data: [], fill: false, pointStyle: 'circle',
                pointBorderColor: this.graphColors['--graph-yellow'], borderColor: this.graphColors['--graph-yellow'], pointRadius: 2,
                backgroundColor: this.graphColors['--graph-yellow'],
                pointBackgroundColor: this.graphColors['--graph-yellow'],
                pointBorderWidth: 2
            },
        ],
        labels: [],
        options: {
            responsive: true,
            maintainAspectRatio: true,
            legend: {
                display: false
            },
            legendCallback: this.getLegendCallback,
            tooltips: {
                enabled: false,
                custom: (tooltipModel) => {
                    // Tooltip Element
                    var tooltipEl = document.getElementById('chartjs-tooltip');

                    // Create element on first render
                    if (!tooltipEl) {
                        tooltipEl = document.createElement('div');
                        tooltipEl.id = 'chartjs-tooltip';
                        tooltipEl.innerHTML = '<table style="font-family:&quot;neue haas&quot;, sans-serif"></table>';
                        document.body.appendChild(tooltipEl);
                    }

                    // Hide if no tooltip
                    if (tooltipModel.opacity === 0) {
                        tooltipEl.style.opacity = '0';
                        return;
                    }

                    // Set caret Position
                    tooltipEl.classList.remove('above', 'below', 'no-transform');
                    if (tooltipModel.yAlign) {
                        tooltipEl.classList.add(tooltipModel.yAlign);
                    } else {
                        tooltipEl.classList.add('no-transform');
                    }

                    function getBody(bodyItem) {
                        return bodyItem.lines;
                    }

                    // Set Text
                    if (tooltipModel.body) {
                        var titleLines = tooltipModel.title || [];
                        var bodyLines = tooltipModel.body.map(getBody);

                        var innerHtml = '<thead>';

                        var style = 'background:#FFFFFF';
                        style += '; border-color:#E6E6E6';
                        style += '; border-width: 2px';
                        innerHtml += '</thead><tbody style="' + style + '">';

                        bodyLines.forEach((body, i) => {
                            const date = this.totalBalance.dates[tooltipModel.dataPoints[0].index]
                            let dateString = `<p> ${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}, ${date.getFullYear()}</p>`;

                            dateString += '<p>Balance: $' + new Intl.NumberFormat().format(this.totalBalance.metricValues[tooltipModel.dataPoints[0].index].toFixed(2)) + '</p>';

                            innerHtml += '<tr><td style="padding:10px;">' + dateString + '</td></tr>';
                        });
                        innerHtml += '</tbody>';

                        var tableRoot = tooltipEl.querySelector('table');
                        tableRoot.innerHTML = innerHtml;
                    }

                    // `this` will be the overall tooltip
                    var position = this.totalBalanceCanvas.nativeElement.getBoundingClientRect();

                    // Display, position, and set styles for font
                    tooltipEl.style.opacity = '1';
                    tooltipEl.style.position = 'absolute';
                    tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
                    tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
                    tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
                    tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
                    tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
                    tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
                    tooltipEl.style.pointerEvents = 'none';
                }
            },
            scales: {
                xAxes: [
                    {
                        display: true,
                        gridLines: {
                            display: false
                        },
                        ticks: {
                            maxTicksLimit: 10
                        }
                    }
                ],
                yAxes: [
                    {
                        display: true,
                        ticks: {
                            suggestedMin: 0,
                            maxTicksLimit: 6,
                            callback: function (value, index, values) {
                                if (value == 0)
                                    return 0;
                                else
                                    return typeof (value) == 'number' ? "$" + ((value / 1000)) + "K" : value;
                            }
                        }
                    },
                ]
            },
            plugins: [],
        }
    };

    public debtBalanceChartMeta = {
        dataSets: [
            {
                label: 'Balance', data: [], fill: false, pointStyle: 'circle',
                pointBorderColor: this.graphColors['--graph-red-crayola'], borderColor: this.graphColors['--graph-red-crayola'], pointRadius: 2,
                backgroundColor: this.graphColors['--graph-red-crayola'],
                pointBackgroundColor: this.graphColors['--graph-red-crayola'],
                pointBorderWidth: 2
            },
        ],
        labels: [],
        options: {
            responsive: true,
            maintainAspectRatio: true,
            legend: {
                display: false
            },
            legendCallback: this.getLegendCallback,
            tooltips: {
                enabled: false,
                custom: (tooltipModel) => {
                    // Tooltip Element
                    var tooltipEl = document.getElementById('chartjs-tooltip');

                    // Create element on first render
                    if (!tooltipEl) {
                        tooltipEl = document.createElement('div');
                        tooltipEl.id = 'chartjs-tooltip';
                        tooltipEl.innerHTML = '<table style="font-family:&quot;neue haas&quot;, sans-serif"></table>';
                        document.body.appendChild(tooltipEl);
                    }

                    // Hide if no tooltip
                    if (tooltipModel.opacity === 0) {
                        tooltipEl.style.opacity = '0';
                        return;
                    }

                    // Set caret Position
                    tooltipEl.classList.remove('above', 'below', 'no-transform');
                    if (tooltipModel.yAlign) {
                        tooltipEl.classList.add(tooltipModel.yAlign);
                    } else {
                        tooltipEl.classList.add('no-transform');
                    }

                    function getBody(bodyItem) {
                        return bodyItem.lines;
                    }

                    // Set Text
                    if (tooltipModel.body) {
                        var titleLines = tooltipModel.title || [];
                        var bodyLines = tooltipModel.body.map(getBody);

                        var innerHtml = '<thead>';

                        var style = 'background:#FFFFFF';
                        style += '; border-color:#E6E6E6';
                        style += '; border-width: 2px';
                        innerHtml += '</thead><tbody style="' + style + '">';

                        bodyLines.forEach((body, i) => {
                            const date = this.debtBalance.dates[tooltipModel.dataPoints[0].index]
                            let dateString = `<p> ${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}, ${date.getFullYear()}</p>`;

                            dateString += '<p>Balance: $' + new Intl.NumberFormat().format(this.debtBalance.metricValues[tooltipModel.dataPoints[0].index].toFixed(2)) + '</p>';

                            innerHtml += '<tr><td style="padding:10px;">' + dateString + '</td></tr>';
                        });
                        innerHtml += '</tbody>';

                        var tableRoot = tooltipEl.querySelector('table');
                        tableRoot.innerHTML = innerHtml;
                    }

                    // `this` will be the overall tooltip
                    var position = this.debtBalanceCanvas.nativeElement.getBoundingClientRect();

                    // Display, position, and set styles for font
                    tooltipEl.style.opacity = '1';
                    tooltipEl.style.position = 'absolute';
                    tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
                    tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
                    tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
                    tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
                    tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
                    tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
                    tooltipEl.style.pointerEvents = 'none';
                }
            },
            scales: {
                xAxes: [
                    {
                        display: true,
                        gridLines: {
                            display: false
                        },
                        ticks: {
                            maxTicksLimit: 10
                        }
                    }
                ],
                yAxes: [
                    {
                        display: true,
                        ticks: {
                            suggestedMin: 0,
                            maxTicksLimit: 6,
                            callback: function (value, index, values) {
                                if (value == 0)
                                    return 0;
                                else
                                    return typeof (value) == 'number' ? "$" + ((value / 1000)) + "K" : value;
                            }
                        }
                    },
                ]
            },
            plugins: [],
        }
    };
    public debtBalanceAccelerationChartMeta = {
        dataSets: [
            {
                label: 'Balance', data: [], fill: false, pointStyle: 'circle',
                pointBorderColor: this.graphColors['--graph-orange'], borderColor: this.graphColors['--graph-orange'], pointRadius: 2,
                backgroundColor: this.graphColors['--graph-orange'],
                pointBackgroundColor: this.graphColors['--graph-orange'],
                pointBorderWidth: 2
            },
        ],
        labels: [],
        options: {
            responsive: true,
            maintainAspectRatio: true,
            legend: {
                display: false
            },
            legendCallback: this.getLegendCallback,
            tooltips: {
                enabled: false,
                custom: (tooltipModel) => {
                    // Tooltip Element
                    var tooltipEl = document.getElementById('chartjs-tooltip');

                    // Create element on first render
                    if (!tooltipEl) {
                        tooltipEl = document.createElement('div');
                        tooltipEl.id = 'chartjs-tooltip';
                        tooltipEl.innerHTML = '<table style="font-family:&quot;neue haas&quot;, sans-serif"></table>';
                        document.body.appendChild(tooltipEl);
                    }

                    // Hide if no tooltip
                    if (tooltipModel.opacity === 0) {
                        tooltipEl.style.opacity = '0';
                        return;
                    }

                    // Set caret Position
                    tooltipEl.classList.remove('above', 'below', 'no-transform');
                    if (tooltipModel.yAlign) {
                        tooltipEl.classList.add(tooltipModel.yAlign);
                    } else {
                        tooltipEl.classList.add('no-transform');
                    }

                    function getBody(bodyItem) {
                        return bodyItem.lines;
                    }

                    // Set Text
                    if (tooltipModel.body) {
                        var titleLines = tooltipModel.title || [];
                        var bodyLines = tooltipModel.body.map(getBody);

                        var innerHtml = '<thead>';

                        var style = 'background:#FFFFFF';
                        style += '; border-color:#E6E6E6';
                        style += '; border-width: 2px';
                        innerHtml += '</thead><tbody style="' + style + '">';

                        bodyLines.forEach((body, i) => {
                            const date = this.debtBalanceAccel.dates[tooltipModel.dataPoints[0].index]
                            let dateString = `<p> ${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}, ${date.getFullYear()}</p>`;

                            dateString += '<p>Balance: $' + new Intl.NumberFormat().format(this.debtBalanceAccel.metricValues[tooltipModel.dataPoints[0].index].toFixed(2)) + '</p>';

                            innerHtml += '<tr><td style="padding:10px;">' + dateString + '</td></tr>';
                        });
                        innerHtml += '</tbody>';

                        var tableRoot = tooltipEl.querySelector('table');
                        tableRoot.innerHTML = innerHtml;
                    }

                    // `this` will be the overall tooltip
                    var position = this.debtBalanceAccelCanvas.nativeElement.getBoundingClientRect();

                    // Display, position, and set styles for font
                    tooltipEl.style.opacity = '1';
                    tooltipEl.style.position = 'absolute';
                    tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
                    tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
                    tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
                    tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
                    tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
                    tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
                    tooltipEl.style.pointerEvents = 'none';
                }
            },
            scales: {
                xAxes: [
                    {
                        display: true,
                        gridLines: {
                            display: false
                        },
                        ticks: {
                            maxTicksLimit: 10
                        }
                    }
                ],
                yAxes: [
                    {
                        display: true,
                        ticks: {
                            suggestedMin: 0,
                            maxTicksLimit: 6,
                            callback: function (value, index, values) {
                                if (value == 0)
                                    return 0;
                                else
                                    return typeof (value) == 'number' ? "$" + ((value / 1000)) + "K" : value;
                            }
                        }
                    },
                ]
            },
            plugins: [],
        }
    };

    public totalAssetWorthChartMeta = {
        dataSets: [
            {
                label: 'Balance', data: [], fill: false, pointStyle: 'circle',
                pointBorderColor: this.graphColors['--graph-violet'], borderColor: this.graphColors['--graph-violet'], pointRadius: 2,
                backgroundColor: this.graphColors['--graph-violet'],
                pointBackgroundColor: this.graphColors['--graph-violet'],
                pointBorderWidth: 2
            },
        ],
        labels: [],
        options: {
            responsive: true,
            maintainAspectRatio: true,
            legend: {
                display: false
            },
            legendCallback: this.getLegendCallback,
            tooltips: {
                enabled: false,
                custom: (tooltipModel) => {
                    // Tooltip Element
                    var tooltipEl = document.getElementById('chartjs-tooltip');

                    // Create element on first render
                    if (!tooltipEl) {
                        tooltipEl = document.createElement('div');
                        tooltipEl.id = 'chartjs-tooltip';
                        tooltipEl.innerHTML = '<table style="font-family:&quot;neue haas&quot;, sans-serif"></table>';
                        document.body.appendChild(tooltipEl);
                    }

                    // Hide if no tooltip
                    if (tooltipModel.opacity === 0) {
                        tooltipEl.style.opacity = '0';
                        return;
                    }

                    // Set caret Position
                    tooltipEl.classList.remove('above', 'below', 'no-transform');
                    if (tooltipModel.yAlign) {
                        tooltipEl.classList.add(tooltipModel.yAlign);
                    } else {
                        tooltipEl.classList.add('no-transform');
                    }

                    function getBody(bodyItem) {
                        return bodyItem.lines;
                    }

                    // Set Text
                    if (tooltipModel.body) {
                        var titleLines = tooltipModel.title || [];
                        var bodyLines = tooltipModel.body.map(getBody);

                        var innerHtml = '<thead>';

                        var style = 'background:#FFFFFF';
                        style += '; border-color:#E6E6E6';
                        style += '; border-width: 2px';
                        innerHtml += '</thead><tbody style="' + style + '">';

                        bodyLines.forEach((body, i) => {
                            const date = this.totalAssetWorth.dates[tooltipModel.dataPoints[0].index]
                            let dateString = `<p> ${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}, ${date.getFullYear()}</p>`;

                            dateString += '<p>Balance: $' + new Intl.NumberFormat().format(this.totalAssetWorth.metricValues[tooltipModel.dataPoints[0].index].toFixed(2)) + '</p>';

                            innerHtml += '<tr><td style="padding:10px;">' + dateString + '</td></tr>';
                        });
                        innerHtml += '</tbody>';

                        var tableRoot = tooltipEl.querySelector('table');
                        tableRoot.innerHTML = innerHtml;
                    }

                    // `this` will be the overall tooltip
                    var position = this.totalAssetWorthCanvas.nativeElement.getBoundingClientRect();

                    // Display, position, and set styles for font
                    tooltipEl.style.opacity = '1';
                    tooltipEl.style.position = 'absolute';
                    tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
                    tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
                    tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
                    tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
                    tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
                    tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
                    tooltipEl.style.pointerEvents = 'none';
                }
            },
            scales: {
                xAxes: [
                    {
                        display: true,
                        gridLines: {
                            display: false
                        },
                        ticks: {
                            maxTicksLimit: 10
                        }
                    }
                ],
                yAxes: [
                    {
                        display: true,
                        ticks: {
                            suggestedMin: 0,
                            maxTicksLimit: 6,
                            callback: function (value, index, values) {
                                if (value == 0)
                                    return 0;
                                else
                                    return typeof (value) == 'number' ? "$" + ((value / 1000)) + "K" : value;
                            }
                        }
                    },
                ]
            },
            plugins: [],
        }
    };

    public totalLiabilityWorthChartMeta = {
        dataSets: [
            {
                label: 'Balance', data: [], fill: false, pointStyle: 'circle',
                pointBorderColor: this.graphColors['---graph-aero'], borderColor: this.graphColors['---graph-aero'], pointRadius: 2,
                backgroundColor: this.graphColors['---graph-aero'],
                pointBackgroundColor: this.graphColors['---graph-aero'],
                pointBorderWidth: 2
            },
        ],
        labels: [],
        options: {
            responsive: true,
            maintainAspectRatio: true,
            legend: {
                display: false
            },
            legendCallback: this.getLegendCallback,
            tooltips: {
                enabled: false,
                custom: (tooltipModel) => {
                    // Tooltip Element
                    var tooltipEl = document.getElementById('chartjs-tooltip');

                    // Create element on first render
                    if (!tooltipEl) {
                        tooltipEl = document.createElement('div');
                        tooltipEl.id = 'chartjs-tooltip';
                        tooltipEl.innerHTML = '<table style="font-family:&quot;neue haas&quot;, sans-serif"></table>';
                        document.body.appendChild(tooltipEl);
                    }

                    // Hide if no tooltip
                    if (tooltipModel.opacity === 0) {
                        tooltipEl.style.opacity = '0';
                        return;
                    }

                    // Set caret Position
                    tooltipEl.classList.remove('above', 'below', 'no-transform');
                    if (tooltipModel.yAlign) {
                        tooltipEl.classList.add(tooltipModel.yAlign);
                    } else {
                        tooltipEl.classList.add('no-transform');
                    }

                    function getBody(bodyItem) {
                        return bodyItem.lines;
                    }

                    // Set Text
                    if (tooltipModel.body) {
                        var titleLines = tooltipModel.title || [];
                        var bodyLines = tooltipModel.body.map(getBody);

                        var innerHtml = '<thead>';

                        var style = 'background:#FFFFFF';
                        style += '; border-color:#E6E6E6';
                        style += '; border-width: 2px';
                        innerHtml += '</thead><tbody style="' + style + '">';

                        bodyLines.forEach((body, i) => {
                            const date = this.totalLiabilityWorth.dates[tooltipModel.dataPoints[0].index]
                            let dateString = `<p> ${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}, ${date.getFullYear()}</p>`;

                            dateString += '<p>Balance: $' + new Intl.NumberFormat().format(this.totalLiabilityWorth.metricValues[tooltipModel.dataPoints[0].index].toFixed(2)) + '</p>';

                            innerHtml += '<tr><td style="padding:10px;">' + dateString + '</td></tr>';
                        });
                        innerHtml += '</tbody>';

                        var tableRoot = tooltipEl.querySelector('table');
                        tableRoot.innerHTML = innerHtml;
                    }

                    // `this` will be the overall tooltip
                    var position = this.totalLiabilityWorthCanvas.nativeElement.getBoundingClientRect();

                    // Display, position, and set styles for font
                    tooltipEl.style.opacity = '1';
                    tooltipEl.style.position = 'absolute';
                    tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
                    tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
                    tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
                    tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
                    tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
                    tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
                    tooltipEl.style.pointerEvents = 'none';
                }
            },
            scales: {
                xAxes: [
                    {
                        display: true,
                        gridLines: {
                            display: false
                        },
                        ticks: {
                            maxTicksLimit: 10
                        }
                    }
                ],
                yAxes: [
                    {
                        display: true,
                        ticks: {
                            suggestedMin: 0,
                            maxTicksLimit: 6,
                            callback: function (value, index, values) {
                                if (value == 0)
                                    return 0;
                                else
                                    return typeof (value) == 'number' ? "$" + ((value / 1000)) + "K" : value;
                            }
                        }
                    },
                ]
            },
            plugins: [],
        }
    };

    public tier1ChartMeta = {
        dataSets: [
            {
                label: 'Balance', data: [], fill: false, pointStyle: 'circle',
                pointBorderColor: this.graphColors['--graph-aquamarine'], borderColor: this.graphColors['--graph-aquamarine'], pointRadius: 2,
                backgroundColor: this.graphColors['--graph-aquamarine'],
                pointBackgroundColor: this.graphColors['--graph-aquamarine'],
                pointBorderWidth: 2
            },
        ],
        labels: [],
        options: {
            responsive: true,
            maintainAspectRatio: true,
            legend: {
                display: false
            },
            legendCallback: this.getLegendCallback,
            tooltips: {
                enabled: false,
                custom: (tooltipModel) => {
                    // Tooltip Element
                    var tooltipEl = document.getElementById('chartjs-tooltip');

                    // Create element on first render
                    if (!tooltipEl) {
                        tooltipEl = document.createElement('div');
                        tooltipEl.id = 'chartjs-tooltip';
                        tooltipEl.innerHTML = '<table style="font-family:&quot;neue haas&quot;, sans-serif"></table>';
                        document.body.appendChild(tooltipEl);
                    }

                    // Hide if no tooltip
                    if (tooltipModel.opacity === 0) {
                        tooltipEl.style.opacity = '0';
                        return;
                    }

                    // Set caret Position
                    tooltipEl.classList.remove('above', 'below', 'no-transform');
                    if (tooltipModel.yAlign) {
                        tooltipEl.classList.add(tooltipModel.yAlign);
                    } else {
                        tooltipEl.classList.add('no-transform');
                    }

                    function getBody(bodyItem) {
                        return bodyItem.lines;
                    }

                    // Set Text
                    if (tooltipModel.body) {
                        var titleLines = tooltipModel.title || [];
                        var bodyLines = tooltipModel.body.map(getBody);

                        var innerHtml = '<thead>';

                        var style = 'background:#FFFFFF';
                        style += '; border-color:#E6E6E6';
                        style += '; border-width: 2px';
                        innerHtml += '</thead><tbody style="' + style + '">';

                        bodyLines.forEach((body, i) => {
                            const date = this.tier1.dates[tooltipModel.dataPoints[0].index]
                            let dateString = `<p> ${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}, ${date.getFullYear()}</p>`;

                            dateString += '<p>Balance: $' + new Intl.NumberFormat().format(this.tier1.metricValues[tooltipModel.dataPoints[0].index].toFixed(2)) + '</p>';

                            innerHtml += '<tr><td style="padding:10px;">' + dateString + '</td></tr>';
                        });
                        innerHtml += '</tbody>';

                        var tableRoot = tooltipEl.querySelector('table');
                        tableRoot.innerHTML = innerHtml;
                    }

                    // `this` will be the overall tooltip
                    var position = this.tier1Canvas.nativeElement.getBoundingClientRect();

                    // Display, position, and set styles for font
                    tooltipEl.style.opacity = '1';
                    tooltipEl.style.position = 'absolute';
                    tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
                    tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
                    tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
                    tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
                    tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
                    tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
                    tooltipEl.style.pointerEvents = 'none';
                }
            },
            scales: {
                xAxes: [
                    {
                        display: true,
                        gridLines: {
                            display: false
                        },
                        ticks: {
                            maxTicksLimit: 10
                        }
                    }
                ],
                yAxes: [
                    {
                        display: true,
                        ticks: {
                            suggestedMin: 0,
                            maxTicksLimit: 6,
                            callback: function (value, index, values) {
                                if (value == 0)
                                    return 0;
                                else
                                    return typeof (value) == 'number' ? "$" + ((value / 1000)) + "K" : value;
                            }
                        }
                    },
                ]
            },
            plugins: [],
        }
    };

    public tier2ChartMeta = {
        dataSets: [
            {
                label: 'Balance', data: [], fill: false, pointStyle: 'circle',
                pointBorderColor: this.graphColors['--graph-yellow'], borderColor: this.graphColors['--graph-yellow'], pointRadius: 2,
                backgroundColor: this.graphColors['--graph-yellow'],
                pointBackgroundColor: this.graphColors['--graph-yellow'],
                pointBorderWidth: 2
            },
        ],
        labels: [],
        options: {
            responsive: true,
            maintainAspectRatio: true,
            legend: {
                display: false
            },
            legendCallback: this.getLegendCallback,
            tooltips: {
                enabled: false,
                custom: (tooltipModel) => {
                    // Tooltip Element
                    var tooltipEl = document.getElementById('chartjs-tooltip');

                    // Create element on first render
                    if (!tooltipEl) {
                        tooltipEl = document.createElement('div');
                        tooltipEl.id = 'chartjs-tooltip';
                        tooltipEl.innerHTML = '<table style="font-family:&quot;neue haas&quot;, sans-serif"></table>';
                        document.body.appendChild(tooltipEl);
                    }

                    // Hide if no tooltip
                    if (tooltipModel.opacity === 0) {
                        tooltipEl.style.opacity = '0';
                        return;
                    }

                    // Set caret Position
                    tooltipEl.classList.remove('above', 'below', 'no-transform');
                    if (tooltipModel.yAlign) {
                        tooltipEl.classList.add(tooltipModel.yAlign);
                    } else {
                        tooltipEl.classList.add('no-transform');
                    }

                    function getBody(bodyItem) {
                        return bodyItem.lines;
                    }

                    // Set Text
                    if (tooltipModel.body) {
                        var titleLines = tooltipModel.title || [];
                        var bodyLines = tooltipModel.body.map(getBody);

                        var innerHtml = '<thead>';

                        var style = 'background:#FFFFFF';
                        style += '; border-color:#E6E6E6';
                        style += '; border-width: 2px';
                        innerHtml += '</thead><tbody style="' + style + '">';

                        bodyLines.forEach((body, i) => {
                            const date = this.tier2.dates[tooltipModel.dataPoints[0].index]
                            let dateString = `<p> ${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}, ${date.getFullYear()}</p>`;

                            dateString += '<p>Balance: $' + new Intl.NumberFormat().format(this.tier2.metricValues[tooltipModel.dataPoints[0].index].toFixed(2)) + '</p>';

                            innerHtml += '<tr><td style="padding:10px;">' + dateString + '</td></tr>';
                        });
                        innerHtml += '</tbody>';

                        var tableRoot = tooltipEl.querySelector('table');
                        tableRoot.innerHTML = innerHtml;
                    }

                    // `this` will be the overall tooltip
                    var position = this.tier2Canvas.nativeElement.getBoundingClientRect();

                    // Display, position, and set styles for font
                    tooltipEl.style.opacity = '1';
                    tooltipEl.style.position = 'absolute';
                    tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
                    tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
                    tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
                    tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
                    tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
                    tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
                    tooltipEl.style.pointerEvents = 'none';
                }
            },
            scales: {
                xAxes: [
                    {
                        display: true,
                        gridLines: {
                            display: false
                        },
                        ticks: {
                            maxTicksLimit: 10
                        }
                    }
                ],
                yAxes: [
                    {
                        display: true,
                        ticks: {
                            suggestedMin: 0,
                            maxTicksLimit: 6,
                            callback: function (value, index, values) {
                                if (value == 0)
                                    return 0;
                                else
                                    return typeof (value) == 'number' ? "$" + ((value / 1000)) + "K" : value;
                            }
                        }
                    },
                ]
            },
            plugins: [],
        }
    };
    public tier3ChartMeta = {
        dataSets: [
            {
                label: 'Balance', data: [], fill: false, pointStyle: 'circle',
                pointBorderColor: this.graphColors['--graph-red-crayola'], borderColor: this.graphColors['--graph-red-crayola'], pointRadius: 2,
                backgroundColor: this.graphColors['--graph-red-crayola'],
                pointBackgroundColor: this.graphColors['--graph-red-crayola'],
                pointBorderWidth: 2
            },
        ],
        labels: [],
        options: {
            responsive: true,
            maintainAspectRatio: true,
            legend: {
                display: false
            },
            legendCallback: this.getLegendCallback,
            tooltips: {
                enabled: false,
                custom: (tooltipModel) => {
                    // Tooltip Element
                    var tooltipEl = document.getElementById('chartjs-tooltip');

                    // Create element on first render
                    if (!tooltipEl) {
                        tooltipEl = document.createElement('div');
                        tooltipEl.id = 'chartjs-tooltip';
                        tooltipEl.innerHTML = '<table style="font-family:&quot;neue haas&quot;, sans-serif"></table>';
                        document.body.appendChild(tooltipEl);
                    }

                    // Hide if no tooltip
                    if (tooltipModel.opacity === 0) {
                        tooltipEl.style.opacity = '0';
                        return;
                    }

                    // Set caret Position
                    tooltipEl.classList.remove('above', 'below', 'no-transform');
                    if (tooltipModel.yAlign) {
                        tooltipEl.classList.add(tooltipModel.yAlign);
                    } else {
                        tooltipEl.classList.add('no-transform');
                    }

                    function getBody(bodyItem) {
                        return bodyItem.lines;
                    }

                    // Set Text
                    if (tooltipModel.body) {
                        var titleLines = tooltipModel.title || [];
                        var bodyLines = tooltipModel.body.map(getBody);

                        var innerHtml = '<thead>';

                        var style = 'background:#FFFFFF';
                        style += '; border-color:#E6E6E6';
                        style += '; border-width: 2px';
                        innerHtml += '</thead><tbody style="' + style + '">';

                        bodyLines.forEach((body, i) => {
                            const date = this.tier3.dates[tooltipModel.dataPoints[0].index]
                            let dateString = `<p> ${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}, ${date.getFullYear()}</p>`;

                            dateString += '<p>Balance: $' + new Intl.NumberFormat().format(this.tier3.metricValues[tooltipModel.dataPoints[0].index].toFixed(2)) + '</p>';

                            innerHtml += '<tr><td style="padding:10px;">' + dateString + '</td></tr>';
                        });
                        innerHtml += '</tbody>';

                        var tableRoot = tooltipEl.querySelector('table');
                        tableRoot.innerHTML = innerHtml;
                    }

                    // `this` will be the overall tooltip
                    var position = this.tier3Canvas.nativeElement.getBoundingClientRect();

                    // Display, position, and set styles for font
                    tooltipEl.style.opacity = '1';
                    tooltipEl.style.position = 'absolute';
                    tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
                    tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
                    tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
                    tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
                    tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
                    tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
                    tooltipEl.style.pointerEvents = 'none';
                }
            },
            scales: {
                xAxes: [
                    {
                        display: true,
                        gridLines: {
                            display: false
                        },
                        ticks: {
                            maxTicksLimit: 10
                        }
                    }
                ],
                yAxes: [
                    {
                        display: true,
                        ticks: {
                            suggestedMin: 0,
                            maxTicksLimit: 6,
                            callback: function (value, index, values) {
                                if (value == 0)
                                    return 0;
                                else
                                    return typeof (value) == 'number' ? "$" + ((value / 1000)) + "K" : value;
                            }
                        }
                    },
                ]
            },
            plugins: [],
        }
    };
    public totalWealthChartMeta = {
        dataSets: [
            {
                label: 'Balance', data: [], fill: false, pointStyle: 'circle',
                pointBorderColor: this.graphColors['--graph-aero'], borderColor: this.graphColors['--graph-aero'], pointRadius: 2,
                backgroundColor: this.graphColors['--graph-aero'],
                pointBackgroundColor: this.graphColors['--graph-aero'],
                pointBorderWidth: 2
            },
        ],
        labels: [],
        options: {
            responsive: true,
            maintainAspectRatio: true,
            legend: {
                display: false
            },
            legendCallback: this.getLegendCallback,
            tooltips: {
                enabled: false,
                custom: (tooltipModel) => {
                    // Tooltip Element
                    var tooltipEl = document.getElementById('chartjs-tooltip');

                    // Create element on first render
                    if (!tooltipEl) {
                        tooltipEl = document.createElement('div');
                        tooltipEl.id = 'chartjs-tooltip';
                        tooltipEl.innerHTML = '<table style="font-family:&quot;neue haas&quot;, sans-serif"></table>';
                        document.body.appendChild(tooltipEl);
                    }

                    // Hide if no tooltip
                    if (tooltipModel.opacity === 0) {
                        tooltipEl.style.opacity = '0';
                        return;
                    }

                    // Set caret Position
                    tooltipEl.classList.remove('above', 'below', 'no-transform');
                    if (tooltipModel.yAlign) {
                        tooltipEl.classList.add(tooltipModel.yAlign);
                    } else {
                        tooltipEl.classList.add('no-transform');
                    }

                    function getBody(bodyItem) {
                        return bodyItem.lines;
                    }

                    // Set Text
                    if (tooltipModel.body) {
                        var titleLines = tooltipModel.title || [];
                        var bodyLines = tooltipModel.body.map(getBody);

                        var innerHtml = '<thead>';

                        var style = 'background:#FFFFFF';
                        style += '; border-color:#E6E6E6';
                        style += '; border-width: 2px';
                        innerHtml += '</thead><tbody style="' + style + '">';

                        bodyLines.forEach((body, i) => {
                            const date = this.totalWealth.dates[tooltipModel.dataPoints[0].index]
                            let dateString = `<p> ${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}, ${date.getFullYear()}</p>`;

                            dateString += '<p>Balance: $' + new Intl.NumberFormat().format(this.totalWealth.metricValues[tooltipModel.dataPoints[0].index].toFixed(2)) + '</p>';

                            innerHtml += '<tr><td style="padding:10px;">' + dateString + '</td></tr>';
                        });
                        innerHtml += '</tbody>';

                        var tableRoot = tooltipEl.querySelector('table');
                        tableRoot.innerHTML = innerHtml;
                    }

                    // `this` will be the overall tooltip
                    var position = this.totalWealthCanvas.nativeElement.getBoundingClientRect();

                    // Display, position, and set styles for font
                    tooltipEl.style.opacity = '1';
                    tooltipEl.style.position = 'absolute';
                    tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
                    tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
                    tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
                    tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
                    tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
                    tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
                    tooltipEl.style.pointerEvents = 'none';
                }
            },
            scales: {
                xAxes: [
                    {
                        display: true,
                        gridLines: {
                            display: false
                        },
                        ticks: {
                            maxTicksLimit: 10
                        }
                    }
                ],
                yAxes: [
                    {
                        display: true,
                        ticks: {
                            suggestedMin: 0,
                            maxTicksLimit: 6,
                            callback: function (value, index, values) {
                                if (value == 0)
                                    return 0;
                                else
                                    return typeof (value) == 'number' ? "$" + ((value / 1000)) + "K" : value;
                            }
                        }
                    },
                ]
            },
            plugins: [],
        }
    };
    public accountBalanceChartMeta = {
        dataSets: [
            {
                label: 'Balance', data: [], fill: false, pointStyle: 'circle',
                pointBorderColor: this.graphColors['--graph-aquamarine'], borderColor: this.graphColors['--graph-aquamarine'], pointRadius: 2,
                backgroundColor: this.graphColors['--graph-aquamarine'],
                pointBackgroundColor: this.graphColors['--graph-aquamarine'],
                pointBorderWidth: 2
            },
        ],
        labels: [],
        options: {
            responsive: true,
            maintainAspectRatio: true,
            legend: {
                display: false
            },
            legendCallback: this.getLegendCallback,
            tooltips: {
                enabled: false,
                custom: (tooltipModel) => {
                    // Tooltip Element
                    var tooltipEl = document.getElementById('chartjs-tooltip');

                    // Create element on first render
                    if (!tooltipEl) {
                        tooltipEl = document.createElement('div');
                        tooltipEl.id = 'chartjs-tooltip';
                        tooltipEl.innerHTML = '<table style="font-family:&quot;neue haas&quot;, sans-serif"></table>';
                        document.body.appendChild(tooltipEl);
                    }

                    // Hide if no tooltip
                    if (tooltipModel.opacity === 0) {
                        tooltipEl.style.opacity = '0';
                        return;
                    }

                    // Set caret Position
                    tooltipEl.classList.remove('above', 'below', 'no-transform');
                    if (tooltipModel.yAlign) {
                        tooltipEl.classList.add(tooltipModel.yAlign);
                    } else {
                        tooltipEl.classList.add('no-transform');
                    }

                    function getBody(bodyItem) {
                        return bodyItem.lines;
                    }

                    // Set Text
                    if (tooltipModel.body) {
                        var titleLines = tooltipModel.title || [];
                        var bodyLines = tooltipModel.body.map(getBody);

                        var innerHtml = '<thead>';

                        var style = 'background:#FFFFFF';
                        style += '; border-color:#E6E6E6';
                        style += '; border-width: 2px';
                        innerHtml += '</thead><tbody style="' + style + '">';

                        bodyLines.forEach((body, i) => {
                            const date = this.accountBalance.dates[tooltipModel.dataPoints[0].index]
                            let dateString = `<p> ${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}, ${date.getFullYear()}</p>`;

                            dateString += '<p>Balance: $' + new Intl.NumberFormat().format(this.accountBalance.metricValues[tooltipModel.dataPoints[0].index].toFixed(2)) + '</p>';

                            if(this.accountBalance.price[tooltipModel.dataPoints[0].index])
                                dateString += '<p>Price: $' + new Intl.NumberFormat().format(this.accountBalance.price[tooltipModel.dataPoints[0].index].toFixed(2)) + '</p>';
                            
                            if(this.accountBalance.quantity[tooltipModel.dataPoints[0].index])
                                dateString += '<p>Quantity: ' + new Intl.NumberFormat().format(this.accountBalance.quantity[tooltipModel.dataPoints[0].index].toFixed(2)) + '</p>';

                            innerHtml += '<tr><td style="padding:10px;">' + dateString + '</td></tr>';
                        });
                        innerHtml += '</tbody>';

                        var tableRoot = tooltipEl.querySelector('table');
                        tableRoot.innerHTML = innerHtml;
                    }

                    // `this` will be the overall tooltip
                    var position = this.accountBalanceCanvas.nativeElement.getBoundingClientRect();

                    // Display, position, and set styles for font
                    tooltipEl.style.opacity = '1';
                    tooltipEl.style.position = 'absolute';
                    tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
                    tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
                    tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
                    tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
                    tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
                    tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
                    tooltipEl.style.pointerEvents = 'none';
                }
            },
            scales: {
                xAxes: [
                    {
                        display: true,
                        gridLines: {
                            display: false
                        },
                        ticks: {
                            maxTicksLimit: 10
                        }
                    }
                ],
                yAxes: [
                    {
                        display: true,
                        ticks: {
                            suggestedMin: 0,
                            maxTicksLimit: 6,
                            callback: function (value, index, values) {
                                if (value == 0)
                                    return 0;
                                else
                                    return typeof (value) == 'number' ? "$" + ((value / 1000)) + "K" : value;
                            }
                        }
                    },
                ]
            },
            plugins: [],
        }
    };

    netWorth = { dates: [], metricValues: [] };
    monthlyIncome = { dates: [], metricValues: [] };
    totalBalance = { dates: [], metricValues: [] };
    debtBalance = { dates: [], metricValues: [] };
    debtBalanceAccel = { dates: [], metricValues: [] };
    totalAssetWorth = { dates: [], metricValues: [] };
    totalLiabilityWorth = { dates: [], metricValues: [] };
    tier1 = { dates: [], metricValues: [] };
    tier2 = { dates: [], metricValues: [] };
    tier3 = { dates: [], metricValues: [] };
    totalWealth = { dates: [], metricValues: [] };
    accountBalance = { dates: [], metricValues: [], price: [], quantity:[] };
    public customGoals: any[] = [];

    constructor(public menuController: MenuController, public userSvc: userService, public navCtrl: NavController, public accountsService: AccountsService, public router: Router, public routerOutletService: RouterOutletService, public nd1Service: ND1Service, public nd2Service: ND2Service, public debtPayoffService: DebtPayoffService, public platform: Platform, public compoundReturnService: CompoundReturnService, public currencyPipe: CurrencyPipe, public balanceSheetService: BalanceSheetService, public common: CommonProvider, public authService: AuthService, public appSideMenuService: AppSideMenuService, public metricService: MetricService, public alertController: AlertController, public modalCtrl: ModalController, public sanitizer: DomSanitizer) {
        // the side menu must be set as disable on load otherwise it will load before all other components
        this.appSideMenuService.setSideMenuEnabled(false);
        this.isMobile = this.isMobileDevice();
        const userId = this.userSvc.userId;
        this.access = this.userSvc.access || this.access;
        this.nd1CalculatorData = {
            _id: '',
            giving: 0,
            wealth: 0,
            debt: 0,
            living: 0,
            earnedIncome: 0,
            customAccounts: []
        };
        this.debtPayoffCalculatorData = {
            _id: "",
            acceleratorAmount: 0,
            sortPayoffBy: "",
            acceleratorPayoffText: "",
            calculatedDebtAccelInterest: "",
            maximumInterestForAllDebts: 0
        };
        this.accountsSummary = {
            netWorth: 0,
            assetWorth: 0,
            liabilityWorth: 0,
            excludedLiabilityWorth: 0,
            tier1: 0,
            tier2: 0,
            tier3: 0,
            totalWealthAccount: 0
        };
        this.freedomNumber = 0;
        this.lifestyleNumber = 0;
        if(this.userSvc.loaderPresent === true) {
            this.userSvc.dismissLoader();
          }
        let toggleSubscribe = this.userSvc.toggleBalance.subscribe((res) => {
            this.masterRefresh(true, false, res);
        })
        this.subscriptions.push(toggleSubscribe);
    }
    isMobileDevice() {
        const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        return width < 573;
    }

    nameSubscribe: Subscription;

    async openDashboardBannerMessage() {
        let modal = await this.modalCtrl.create({
            component: Modal,
            componentProps: {
                content: this.sanitizer.bypassSecurityTrustHtml(this.dashboardBannerMessage)
            },
            cssClass: 'dialog'
        });
        localStorage.setItem('msgShown', 'true');
        return await modal.present();
    }

    async toggleSheet(_sheet) {
        this.sheet = _sheet
        this.userSvc.activeBalanceSheet = _sheet;
        await this.userSvc.presentLoader();
        this.userSvc.updateUser({
            activeBalanceSheet: _sheet
        }).then(res => {
            // this.userSvc.activeBalanceSheet = _sheet;
            // this.balanceClick(id,scroll);
            this.nameSubscribe = this.balanceSheetService.getBalanceSheet(_sheet).subscribe(res => {
                this.masterRefresh(true, false, res.name);
            }, () => { }, () => {
                if (this.nameSubscribe)
                    this.nameSubscribe.unsubscribe();
            })
        }, err => {
            console.error(err)
        });
    }

    updateDebt() {
        this.userSvc.updateUser({
            isDebtFree: this.isDebtFree
        }).then(res => {
        }, err => {
            console.error(err)
        });
    }

    doRefresh(event) {
        this.masterRefresh(true, true);
        setTimeout(function () {
            event.target.complete();
        }, 400);
    }
    createNewAccount() {
        this.navCtrl.navigateForward("accountDetails/new");
    }
    ionViewWillLeave() {
        this.subscriptions.forEach(sub => {
            sub.unsubscribe();
        })
        this.routerOutletService.swipebackEnabled = true;
    }
    ionViewWillEnter() {
        const element = document.getElementsByClassName('grecaptcha-badge')[0] as HTMLElement;
        if (element) {
            element.style.visibility = 'hidden';
        }
        this.routerOutletService.swipebackEnabled = false;
        this.masterRefresh(true, true);
        const slides = document.querySelector('ion-slides');
        // Optional parameters to pass to the swiper instance.
        // See http://idangero.us/swiper/api/ for valid options.
        if (slides) {
            slides.options = {
                clickable: true,
            };
        }
    }
    ionViewDidEnter() {
        this.sideMenuInit();
        let id = 'segmentdash-' + this.userSvc.activeBalanceSheet;
        let tabfocus = _.debounce(() => {
            if (document.getElementById(id)) {
                let rect = document.getElementById(id).getBoundingClientRect();
                if (rect.x > this.platform.width()) {
                    document.getElementById(id).parentElement.parentElement.scrollLeft = rect.x - 240;
                }
            }
        }, 2000, { 'trailing': true });
        tabfocus();
    }
    navigateToProfile() {
        this.menuController.open();
    }
    openBS() {
        this.navCtrl.navigateForward("balancesheets");
    }
    openND1() {
        this.navCtrl.navigateForward("nd1details");
    }
    openND2() {
        this.navCtrl.navigateForward("nd2details");
    }
    openDebtPayoff() {
        this.navCtrl.navigateForward("debtpayoff");
    }
    openGoals() {
        this.navCtrl.navigateForward("goals");
    }
    openCompoundReturn() {
        const navigationExtras: NavigationExtras = {
            state: Object.assign({}, null)
        };
        this.navCtrl.navigateForward("compoundreturn", navigationExtras);
    }
    masterRefresh(reset: boolean, loadSheet = false, name?) {
        let getBalanceSheetsSubscription: Subscription, getUserSubscription: Subscription,
            getAccountsSubscription: Subscription, isBsExperimentActivatedSubscription: Subscription,
            getSignedUrlSubscription: Subscription, getResourcesSubscription: Subscription,
            getDefaultBalanceSheet: Subscription, getDefaultAccountsSubscription: Subscription,
            getMetricSubscription: Subscription, getMonthlyIncomeSubscription: Subscription,
            getTotalBalanceSubscription: Subscription, getDebtBalanceSubscription: Subscription,
            getDebtBalanceWithAccelerationSubscription: Subscription, getTotalAssetWorthSubscription: Subscription,
            getTotalLiabilityWorth: Subscription, getTier1Subscription: Subscription, getConfigurationSubscription: Subscription,
            getTier2Subscription: Subscription, getTier3Subscription: Subscription, getTotalWealthSubscription: Subscription;

        getTotalWealthSubscription = this.metricService.metricData('totalWealth').subscribe(async (res: any) => {
            try {
                if (res) {
                    const resCopy = _.cloneDeep(res.data.getMetricHistoryByUser);
                    let resDateDate = [];
                    let metricValueData = [];
                    let labelDate = []
                    resCopy.sort((a,b) => a.date-b.date);
                    resCopy.forEach(element => {
                        const fullDate = new Date(element.date * 1000);
                        const date = fullDate.getDate().toString();
                        const month = (fullDate.getMonth() + 1).toString();
                        const year = fullDate.getFullYear().toString();
                        const lDate = date + '/' + month + '/' + year
                        labelDate.push(lDate);
                        resDateDate.push(fullDate);
                        metricValueData.push(element.metricValue);
                        this.totalWealth.dates = resDateDate;
                        this.totalWealth.metricValues = metricValueData;
                    });
                    this.totalWealthChartMeta.labels = labelDate;
                    this.totalWealthChartMeta.dataSets[0].data = metricValueData;
                }
            } catch (error) {

                console.error('error', error)
            }
        });
        getTier3Subscription = this.metricService.metricData('tier3').subscribe(async (res: any) => {
            try {
                if (res) {
                    const resCopy = _.cloneDeep(res.data.getMetricHistoryByUser);
                    resCopy.sort((a,b) => a.date-b.date);
                    let resDateDate = [];
                    let metricValueData = [];
                    let labelDate = []
                    resCopy.forEach(element => {
                        const fullDate = new Date(element.date * 1000);
                        const date = fullDate.getDate().toString();
                        const month = (fullDate.getMonth() + 1).toString();
                        const year = fullDate.getFullYear().toString();
                        //    const newDate ={date:date,month:month,year:year}
                        const lDate = date + '/' + month + '/' + year
                        labelDate.push(lDate);
                        resDateDate.push(fullDate);
                        metricValueData.push(element.metricValue);
                        this.tier3.dates = resDateDate;
                        this.tier3.metricValues = metricValueData;
                    });
                    this.tier3ChartMeta.labels = labelDate;
                    this.tier3ChartMeta.dataSets[0].data = metricValueData;
                }
            } catch (error) {

                console.error('error', error)
            }
        });

        getTier2Subscription = this.metricService.metricData('tier2').subscribe(async (res: any) => {
            try {
                if (res) {
                    const resCopy = _.cloneDeep(res.data.getMetricHistoryByUser);
                    resCopy.sort((a,b) => a.date-b.date);
                    let resDateDate = [];
                    let metricValueData = [];
                    let labelDate = []
                    resCopy.forEach(element => {
                        const fullDate = new Date(element.date * 1000);
                        const date = fullDate.getDate().toString();
                        const month = (fullDate.getMonth() + 1).toString();
                        const year = fullDate.getFullYear().toString();
                        //    const newDate ={date:date,month:month,year:year}
                        const lDate = date + '/' + month + '/' + year
                        labelDate.push(lDate);
                        resDateDate.push(fullDate);
                        metricValueData.push(element.metricValue);
                        this.tier2.dates = resDateDate;
                        this.tier2.metricValues = metricValueData;
                    });
                    this.tier2ChartMeta.labels = labelDate;
                    this.tier2ChartMeta.dataSets[0].data = metricValueData;
                }
            } catch (error) {

                console.error('error', error)
            }
        });

        getTier1Subscription = this.metricService.metricData('tier1').subscribe(async (res: any) => {
            try {
                if (res) {
                    const resCopy = _.cloneDeep(res.data.getMetricHistoryByUser);
                    resCopy.sort((a,b) => a.date-b.date);
                    let resDateDate = [];
                    let metricValueData = [];
                    let labelDate = []
                    resCopy.forEach(element => {
                        const fullDate = new Date(element.date * 1000);
                        const date = fullDate.getDate().toString();
                        const month = (fullDate.getMonth() + 1).toString();
                        const year = fullDate.getFullYear().toString();
                        //    const newDate ={date:date,month:month,year:year}
                        const lDate = date + '/' + month + '/' + year
                        labelDate.push(lDate);
                        resDateDate.push(fullDate);
                        metricValueData.push(element.metricValue);
                        this.tier1.dates = resDateDate;
                        this.tier1.metricValues = metricValueData;
                    });
                    this.tier1ChartMeta.labels = labelDate;
                    this.tier1ChartMeta.dataSets[0].data = metricValueData;
                }
            } catch (error) {

                console.error('error', error)
            }
        });

        getTotalLiabilityWorth = this.metricService.metricData('liabilityWorth').subscribe(async (res: any) => {
            try {
                if (res) {
                    const resCopy = _.cloneDeep(res.data.getMetricHistoryByUser);
                    resCopy.sort((a,b) => a.date-b.date);
                    let resDateDate = [];
                    let metricValueData = [];
                    let labelDate = []
                    resCopy.forEach(element => {
                        const fullDate = new Date(element.date * 1000);
                        const date = fullDate.getDate().toString();
                        const month = (fullDate.getMonth() + 1).toString();
                        const year = fullDate.getFullYear().toString();
                        //    const newDate ={date:date,month:month,year:year}
                        const lDate = date + '/' + month + '/' + year
                        labelDate.push(lDate);
                        resDateDate.push(fullDate);
                        metricValueData.push(element.metricValue);
                        this.totalLiabilityWorth.dates = resDateDate;
                        this.totalLiabilityWorth.metricValues = metricValueData;
                    });
                    this.totalLiabilityWorthChartMeta.labels = labelDate;
                    this.totalLiabilityWorthChartMeta.dataSets[0].data = metricValueData;
                }
            } catch (error) {

                console.error('error', error)
            }
        });

        getTotalAssetWorthSubscription = this.metricService.metricData('assetWorth').subscribe(async (res: any) => {
            try {
                if (res) {
                    const resCopy = _.cloneDeep(res.data.getMetricHistoryByUser);
                    resCopy.sort((a,b) => a.date-b.date);
                    let resDateDate = [];
                    let metricValueData = [];
                    let labelDate = []
                    resCopy.forEach(element => {
                        const fullDate = new Date(element.date * 1000);
                        const date = fullDate.getDate().toString();
                        const month = (fullDate.getMonth() + 1).toString();
                        const year = fullDate.getFullYear().toString();
                        //    const newDate ={date:date,month:month,year:year}
                        const lDate = date + '/' + month + '/' + year
                        labelDate.push(lDate);
                        resDateDate.push(fullDate);
                        metricValueData.push(element.metricValue);
                        this.totalAssetWorth.dates = resDateDate;
                        this.totalAssetWorth.metricValues = metricValueData;
                    });
                    this.totalAssetWorthChartMeta.labels = labelDate;
                    this.totalAssetWorthChartMeta.dataSets[0].data = metricValueData;
                }
            } catch (error) {

                console.error('error', error)
            }
        });

        getDebtBalanceWithAccelerationSubscription = this.metricService.metricData('debtBalanceAccel').subscribe(async (res: any) => {
            try {
                if (res) {
                    const resCopy = _.cloneDeep(res.data.getMetricHistoryByUser);
                    resCopy.sort((a,b) => a.date-b.date);
                    let resDateDate = [];
                    let metricValueData = [];
                    let labelDate = []
                    resCopy.forEach(element => {
                        const fullDate = new Date(element.date * 1000);
                        const date = fullDate.getDate().toString();
                        const month = (fullDate.getMonth() + 1).toString();
                        const year = fullDate.getFullYear().toString();
                        //    const newDate ={date:date,month:month,year:year}
                        const lDate = date + '/' + month + '/' + year
                        labelDate.push(lDate);
                        resDateDate.push(fullDate);
                        metricValueData.push(element.metricValue);
                        this.debtBalanceAccel.dates = resDateDate;
                        this.debtBalanceAccel.metricValues = metricValueData;
                    });
                    this.debtBalanceAccelerationChartMeta.labels = labelDate;
                    this.debtBalanceAccelerationChartMeta.dataSets[0].data = metricValueData;
                }
            } catch (error) {
                console.error('error', error);
            }

        });

        getDebtBalanceSubscription = this.metricService.metricData('debtBalance').subscribe(async (res: any) => {
            try {
                if (res) {
                    const resCopy = _.cloneDeep(res.data.getMetricHistoryByUser);
                    resCopy.sort((a,b) => a.date-b.date);
                    let resDateDate = [];
                    let metricValueData = [];
                    let labelDate = []
                    resCopy.forEach(element => {
                        const fullDate = new Date(element.date * 1000);
                        const date = fullDate.getDate().toString();
                        const month = (fullDate.getMonth() + 1).toString();
                        const year = fullDate.getFullYear().toString();
                        //    const newDate ={date:date,month:month,year:year}
                        const lDate = date + '/' + month + '/' + year
                        labelDate.push(lDate);
                        resDateDate.push(fullDate);
                        metricValueData.push(element.metricValue);
                        this.debtBalance.dates = resDateDate;
                        this.debtBalance.metricValues = metricValueData;
                    });
                    this.debtBalanceChartMeta.labels = labelDate;
                    this.debtBalanceChartMeta.dataSets[0].data = metricValueData;
                }
            } catch (error) {
                console.error('error', error);
            }

        });

        getTotalBalanceSubscription = this.metricService.metricData('balance').subscribe(async (res: any) => {
            try {
                if (res) {
                    const resCopy = _.cloneDeep(res.data.getMetricHistoryByUser);
                    resCopy.sort((a,b) => a.date-b.date);
                    let resDateDate = [];
                    let metricValueData = [];
                    let labelDate = []
                    resCopy.forEach(element => {
                        const fullDate = new Date(element.date * 1000);
                        const date = fullDate.getDate().toString();
                        const month = (fullDate.getMonth() + 1).toString();
                        const year = fullDate.getFullYear().toString();
                        const newDate = { date: date, month: month, year: year }
                        const lDate = date + '/' + month + '/' + year
                        labelDate.push(lDate);
                        resDateDate.push(fullDate);
                        metricValueData.push(element.metricValue);
                        this.totalBalance.dates = resDateDate;
                        this.totalBalance.metricValues = metricValueData;
                    });
                    this.totalBalanceChartMeta.labels = labelDate;
                    this.totalBalanceChartMeta.dataSets[0].data = metricValueData;
                }
            } catch (error) {
                console.error('error', error);
            }

        });

        getMonthlyIncomeSubscription = this.metricService.metricData('monthlyIncome').subscribe(async (res: any) => {
            try {
                if (res) {
                    const resCopy = _.cloneDeep(res.data.getMetricHistoryByUser);
                    resCopy.sort((a,b) => a.date-b.date);
                    let netWorthDate = [];
                    let netWorthMetricValue = [];
                    let labelDate = []
                    resCopy.forEach(element => {
                        const fullDate = new Date(element.date * 1000);
                        const date = fullDate.getDate().toString();
                        const month = (fullDate.getMonth() + 1).toString();
                        const year = fullDate.getFullYear().toString();
                        const newDate = { date: date, month: month, year: year }
                        const lDate = date + '/' + month + '/' + year
                        labelDate.push(lDate);
                        netWorthDate.push(fullDate);
                        netWorthMetricValue.push(element.metricValue);
                        this.monthlyIncome.dates = netWorthDate;
                        this.monthlyIncome.metricValues = netWorthMetricValue;

                    });
                    this.monthlyIncomeChartMeta.labels = labelDate;
                    this.monthlyIncomeChartMeta.dataSets[0].data = netWorthMetricValue
                }
            } catch (error) {
                console.error('error', error);
            }

        });
        getMetricSubscription = this.metricService.metricData('netWorth').subscribe(async (res: any) => {
            try {
                if (res) {
                    const resCopy = _.cloneDeep(res.data.getMetricHistoryByUser);
                    resCopy.sort((a,b) => a.date-b.date);
                    let netWorthDate = [];
                    let netWorthMetricValue = [];
                    let labelDate = []
                    resCopy.forEach(element => {
                        const fullDate = new Date(element.date * 1000);
                        const date = fullDate.getDate().toString();
                        const month = (fullDate.getMonth() + 1).toString();
                        const year = fullDate.getFullYear().toString();
                        const newDate = { date: date, month: month, year: year }
                        const lDate = date + '/' + month + '/' + year
                        labelDate.push(lDate);
                        netWorthDate.push(fullDate);
                        netWorthMetricValue.push(element.metricValue);
                        this.netWorth.dates = netWorthDate;
                        this.netWorth.metricValues = netWorthMetricValue;

                    });
                    this.netWorthChartMeta.labels = labelDate;
                    this.netWorthChartMeta.dataSets[0].data = netWorthMetricValue
                }
            } catch (error) {
                console.error('error', error);
            }

        });

        getAccountsSubscription = this.accountsService.getAccounts(reset).subscribe(() => {
            getUserSubscription = this.userSvc.getUser(reset).subscribe(({ data }) => {
                if (data && data.user) {
                    this.setUserDashboardData({ ...data.user });
                    if (data.user.didChangeAccess) {
                        this.userSvc.updateUser({
                            didChangeAccess: false
                        }).then(res => {
                            this.authService.logout();
                            this.userSvc.toast('User access changed successfully. Please login again.')
                        }, err => {
                            console.error(err)
                        });
                    }
                    if (data.user.avatar) {
                        this.userSvc.getSignedUrl(data.user.avatar).subscribe((res: any) => {
                            if (res) {
                                this.userAvatar = res.data.getSignedUrl.signedUrl;
                            }
                        })
                    }
                    this.primaryGoal = data.user.primaryGoal;
                    const { t1Target, t2Target, t3Target, isDebtFree } = data.user;
                    this.isDebtFree = isDebtFree;
                    if (data?.user?.firstName && data?.user?.lastName && data?.user?.birthday && data?.user?.sex) {
                        this.isProfileDone = true;
                    }
                    else {
                        this.isProfileDone = false;
                    }
                    if (data?.user?.currentEarnedIncome && data?.user?.earnedIncomeGoal && data?.user?.financialEducation && data?.user?.primaryGoal
                        && data?.user?.activePassivePreference && data?.user?.temperament && data?.user?.riskPreference && data?.user?.primaryWealthStrategy
                        && data?.user?.secondaryWealthStrategy && data?.user?.legacyModel) {
                        this.isGoalsDone = true;
                    }
                    else {
                        this.isGoalsDone = false;
                    }
                    if (data?.user?.resultFreedom > 0) {
                        this.isFreedomDone = true;
                    }
                    else {
                        this.isFreedomDone = false;
                    }
                    if (data?.user?.resultLifestyle > data?.user?.resultFreedom) {
                        this.isLifestyleDone = true;
                    }
                    else {
                        this.isLifestyleDone = false;
                    }
                    if (data?.user?.legacyStatement) {
                        this.isLegacyDone = true;
                    }
                    else {
                        this.isLegacyDone = false;
                    }
                    if (data?.user?.earnedIncomeOptimizationPlan) {
                        this.isIncomeDone = true;
                    }
                    else {
                        this.isIncomeDone = false;
                    }
                    if (data?.user?.living > 0) {
                        this.isBudgetingDone = true;
                    }
                    else {
                        this.isBudgetingDone = false;
                    }
                    if (data?.user?.implementationProgress) {
                        try {
                            let progress = JSON.parse(data?.user?.implementationProgress)
                            //   if(progress?.incomeOptimization)
                            //     this.isIncomeDone = true
                            //   else
                            //     this.isIncomeDone = false
                            if (progress?.tenPercentPortfolio)
                                this.isPorfolioDone = true
                            else
                                this.isPorfolioDone = false
                            if (progress?.riskManagement)
                                this.isRiskDone = true
                            else
                                this.isRiskDone = false
                            if (progress?.taxEfficiency)
                                this.isTaxDone = true
                            else
                                this.isTaxDone = false
                            if (progress?.assetProtection)
                                this.isAssetPDone = true
                            else
                                this.isAssetPDone = false
                        } catch (e) { }
                    }
                    if (t1Target > 0 || t2Target > 0 || t3Target > 0) {
                        this.isCapitalDone = true
                    }
                    else {
                        this.isCapitalDone = false
                    }
                    if (name) {
                        this.userSvc.dismissLoader();
                        if (name?.toLowerCase() === 'default')
                            this.common.toast('Default mode: Your data is updated with your default Balance Sheet', 'top')
                        else
                            this.common.toast('Sim mode: Your data is updated with ' + name + ' Balance Sheet and is in simulator mode!', 'top')
                    }
                }
            })
            this.accountList = this.accountsService.accounts;
            this.assetList = this.accountList.filter(a => a.accountType === 'Asset');
            this.nonExcludedAssets = this.assetList.filter(a => !a.excludeFromCompoundReturnCalc);
            this.accountsSummary = this.accountsService.accountsSummary;
            let currentT1 = this.accountsSummary.totalWealthAccount ? +((100 * (this.accountsSummary.tier1 / this.accountsSummary.totalWealthAccount))) : 0
            let currentT2 = this.accountsSummary.totalWealthAccount ? +((100 * (this.accountsSummary.tier2 / this.accountsSummary.totalWealthAccount))) : 0
            let currentT3 = this.accountsSummary.totalWealthAccount ? +((100 * (this.accountsSummary.tier3 / this.accountsSummary.totalWealthAccount))) : 0
            let data = [currentT1, currentT2, currentT3]
            this.nd2ChartMeta.datasets[0].data = data;
            let getLegend = _.debounce(() => {
                this.nd2legends = this.charts.get(1)?.chart?.generateLegend();
                let setChartHeight = _.debounce(() => {
                    this.nd2Canvas.nativeElement.style.height = this.nd2ChartLegend.nativeElement.offsetHeight + 'px';
                }, 250, { 'trailing': true });
                if (this.platform.width() < 640) {
                    // setChartHeight();
                }
            }, 1000);
            getLegend();
            if (getUserSubscription) {
                this.subscriptions.push(getUserSubscription);
            }
        });

        getBalanceSheetsSubscription = this.balanceSheetService.getBalanceSheets(reset).subscribe((res: any) => {
            try {
                if (res.data) {
                    if (this.balanceSheets?.length != res.data.balanceSheets.length) {
                        this.balanceSheets = res.data.balanceSheets
                        this.balanceSheets.sort((a, b) => (a.createdAt > b.createdAt) ? 1 : ((b.createdAt > a.createdAt) ? -1 : 0))
                    }
                    this.sheet = this.userSvc.activeBalanceSheet
                }
                isBsExperimentActivatedSubscription = this.balanceSheetService.isBsExperimentActivated().subscribe((isBsExperimentActivated) => {
                    this.isBsExperimentActivated = isBsExperimentActivated;
                });
                this.setBalanceSheetDashboardData();

                getDefaultBalanceSheet = this.balanceSheetService.getDefaultBalanceSheet().subscribe(res => {
                    if (res) {
                        // Deep copy response object to avoid mutating the cache object
                        const responseCopy = _.cloneDeep(res);
                        const {
                            yearlySnapshotsDebtPayoff,
                            yearlySnapshotsCompoundReturn
                        } = responseCopy;
                        if (yearlySnapshotsCompoundReturn?.length > 0)
                            this.isCompoundDone = true;
                        else
                            this.isCompoundDone = false;
                        if (yearlySnapshotsDebtPayoff?.length > 0)
                            this.isDebtDone = true;
                        else
                            this.isDebtDone = false;
                    }
                })

                getDefaultAccountsSubscription = this.accountsService.getDefaultAccounts().subscribe(() => {
                    this.defaultAccountList = this.accountsService.defaultAccounts;
                    this.defaultAssetList = this.defaultAccountList.filter(a => a.accountType === 'Asset');
                    this.defaultLiabilityList = this.defaultAccountList.filter(a => a.accountType === 'Liability');
                    this.defaultNonExcludedAssets = this.defaultAssetList.filter(a => !a.excludeFromCompoundReturnCalc);
                    if (this.defaultAssetList.length > 0)
                        this.isAssetDone = true
                    else
                        this.isAssetDone = false
                    if (this.defaultLiabilityList.length > 0)
                        this.isLiabilityDone = true
                    else
                        this.isLiabilityDone = false

                });
            } catch (error) {
                console.error('error', error)
            }
        });

        getResourcesSubscription = this.userSvc.getResources(reset).subscribe((data) => {
            let resources = data?.data?.resources.map(x => ({
                ...x,
                page: this.getPage(x)
            })).filter((r) => { return r.page == 'courses' });
            if (resources?.length < 4)
                this.resourceList = resources;
            else if (resources?.length > 3) {
                this.resourceList = resources.slice(0, 3);
            }
        },
            (err: any) => {
                console.error(err);
            })

        getConfigurationSubscription = this.userSvc.configurations(reset).subscribe((data) => {
            const { data: { configurations } } = data;
            this.dashboardBannerMessage = configurations.find(x => x.key === "dashboardBanner").value;
            const msgShown = localStorage.getItem('msgShown');
            if (this.dashboardBannerMessage && !msgShown) {
                this.openDashboardBannerMessage();
            }
        },
            (err: any) => {
                console.error(err);
            })

        if (getDefaultAccountsSubscription) {
            this.subscriptions.push(getDefaultAccountsSubscription);
        }

        if (getDefaultBalanceSheet) {
            this.subscriptions.push(getDefaultBalanceSheet);
        }

        if (getAccountsSubscription) {
            this.subscriptions.push(getAccountsSubscription);
        }

        if (getBalanceSheetsSubscription) {
            this.subscriptions.push(getBalanceSheetsSubscription);
        }

        if (getUserSubscription) {
            this.subscriptions.push(getUserSubscription);
        }

        if (isBsExperimentActivatedSubscription) {
            this.subscriptions.push(isBsExperimentActivatedSubscription);
        }

        if (getSignedUrlSubscription) {
            this.subscriptions.push(getSignedUrlSubscription);
        }

        if (getResourcesSubscription) {
            this.subscriptions.push(getResourcesSubscription);
        }
        if (getMetricSubscription) {
            this.subscriptions.push(getMetricSubscription);
        }
        if (getMonthlyIncomeSubscription) {
            this.subscriptions.push(getMonthlyIncomeSubscription);
        }
        if (getTotalBalanceSubscription) {
            this.subscriptions.push(getTotalBalanceSubscription);
        }
        if (getDebtBalanceSubscription) {
            this.subscriptions.push(getDebtBalanceSubscription);
        }
        if (getDebtBalanceWithAccelerationSubscription) {
            this.subscriptions.push(getDebtBalanceWithAccelerationSubscription);
        }
        if (getTotalAssetWorthSubscription) {
            this.subscriptions.push(getTotalAssetWorthSubscription);
        }
        if (getTotalLiabilityWorth) {
            this.subscriptions.push(getTotalLiabilityWorth);
        }
        if (getTier1Subscription) {
            this.subscriptions.push(getTier1Subscription);
        }
        if (getTier2Subscription) {
            this.subscriptions.push(getTier1Subscription);
        }
        if (getTier3Subscription) {
            this.subscriptions.push(getTier1Subscription);
        }
        if (getTotalWealthSubscription) {
            this.subscriptions.push(getTotalWealthSubscription);
        }
        if (getConfigurationSubscription) {
            this.subscriptions.push(getConfigurationSubscription);
        }

    }

    getPage(resource) {
        return (resource.userAccess === "Pro") ? "coaching" : "courses";
    }

    getPersonalGoal(goal: any) {
        return goalConstants.primaryGoal.find((g) => { return g.value == goal || g.id == goal });
    }

    setBalanceSheetDashboardData() {
        this.balanceSheetService.getActiveV2(true).pipe(take(1)).subscribe((res: any) => {
            if (res) {
                this.debtPayoffBurnDownChartData = null;
                // Deep copy response object to avoid mutating the cache object
                const responseCopy = _.cloneDeep(res.data.balanceSheet);
                const {
                    acceleratorAmount,
                    sortPayoffBy,
                    acceleratorPayoffText,
                    calculatedDebtAccelInterest,
                    maximumInterestForAllDebts,
                    currentPayoff,
                    currentTotalInterest,
                    debtAcceleratorPayoff,
                    debtAcceleratorInterest,
                    // monthlyEarnedIncome,
                    // useND1WealthValue,
                    // useUnearnedIncomeValues,
                    // yearsInvested,
                    monthlyUnearnedIncome,
                    // annualContribution,
                    // annualIncreaseContribution,
                    // annualWithdrawal,
                    // withdrawalStartingYear,
                    // volatilityDrawdown,
                    // everyNumberYears,
                    yearlySnapshotsDebtPayoff,
                    yearlySnapshotsCompoundReturn
                } = responseCopy;


                this.debtPayoffCalculatorData.acceleratorAmount = acceleratorAmount;
                this.debtPayoffCalculatorData.sortPayoffBy = sortPayoffBy;
                this.debtPayoffCalculatorData.acceleratorPayoffText = acceleratorPayoffText;
                this.debtPayoffCalculatorData.calculatedDebtAccelInterest = calculatedDebtAccelInterest;
                this.debtPayoffCalculatorData.maximumInterestForAllDebts = maximumInterestForAllDebts;

                if (
                    currentPayoff &&
                    currentTotalInterest &&
                    debtAcceleratorInterest &&
                    debtAcceleratorPayoff &&
                    yearlySnapshotsDebtPayoff
                ) {
                    this.debtPayoffBurnDownChartData = {
                        currentPayoff,
                        currentTotalInterest,
                        debtAcceleratorPayoff,
                        debtAcceleratorInterest,
                        yearlySnapshots: yearlySnapshotsDebtPayoff
                    }

                    if (this.debtPayoffBurnDownChartData?.yearlySnapshots) {
                        const updatedYear = new Date().getFullYear();
                        const updatedMonth = new Date().getMonth();

                        this.debtPayoffBurnDownChartData.yearlySnapshots.forEach(item => {
                            if (!item.last) {
                                item.year = updatedYear + item.year;
                            }
                            if (!item.month) {
                                item.month = updatedMonth;
                            }
                        });
                    }
                    let yearlabels = [];
                    let currentPayoffData = [];
                    let accelreatorPayoffData = [];
                    let previousBalanceOfAllDebtsWithAccel;
                    for (let snap of this.debtPayoffBurnDownChartData.yearlySnapshots) {
                        let localBalanceOfAllDebtsWithAccel = snap.balanceOfAllDebtsWithAccel;
                        yearlabels.push(this.showMonthly ? `${(snap.month + 1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}-${snap.year}` : snap.year);
                        currentPayoffData.push(!snap.balanceOfAllDebts ? 0 + 90 : snap.balanceOfAllDebts);

                        // if balanceOfAllDebtsWithAccel is 0 set as null so that there is no line along the bottom of the chart. Request from Hans.
                        if (previousBalanceOfAllDebtsWithAccel === 0) {
                            accelreatorPayoffData.push(null);
                        } else {
                            accelreatorPayoffData.push(localBalanceOfAllDebtsWithAccel);
                        }
                        previousBalanceOfAllDebtsWithAccel = localBalanceOfAllDebtsWithAccel;
                    }
                    this.debtPayOffChartMeta.labels = yearlabels;
                    this.debtPayOffChartMeta.dataSets[0].data = currentPayoffData;
                    this.debtPayOffChartMeta.dataSets[1].data = accelreatorPayoffData;
                    this.debtLegendData = [];
                    for (let set of this.debtPayOffChartMeta.dataSets) {
                        let legend = { text: set.label, fillStyle: set.backgroundColor }
                        this.debtLegendData.push(legend)
                    }
                }
                if (yearlySnapshotsCompoundReturn?.length == 0 && this.nonExcludedAssets.length > 0) {
                    let data = {
                        monthlyEarnedIncome: this.monthlyEarnedIncome || 0,
                        useND1WealthValue: this.useND1WealthValue || true,
                        useUnearnedIncomeValues: this.useUnearnedIncomeValues || false,
                        showMonthly: this.showMonthly || false,
                        yearsInvested: this.yearsInvested || 20,
                        monthlyUnearnedIncome: monthlyUnearnedIncome || 0,
                        annualContribution: this.annualContribution || 0,
                        annualIncreaseContribution: this.annualIncreaseContribution || 0,
                        annualWithdrawal: this.annualWithdrawal || 0,
                        withdrawalStartingYear: this.withdrawalStartingYear,
                        volatilityDrawdown: this.volatilityDrawdown || 0,
                        everyNumberYears: this.everyNumberYears,
                    }
                    return this.compoundReturnService.calculateCompoundReturn(data).toPromise().then(async (res: any) => {
                        // this.userSvc.dismissLoader();
                        if (res && res.data) {
                            return new Promise((resolve, reject) => {
                                const results = res['data']['calculateCompoundReturn'];
                                const multipleAssets = !!results.weightedResults;
                                const resultsForTable = (multipleAssets && results.weightedResults.length >= 1) ? results.weightedResults : results.results;
                            })

                        }
                    },
                        async (err: any) => {
                            // this.userSvc.dismissLoader();
                            console.error(err);
                            this.userSvc.toast((err.error && err.error.message) || err.message ? (err?.error?.message || err?.message) : "Data save error updating compound return calculator");
                        },
                    );
                }
                this.compoundReturnBurnUpChartData = { yearlySnapshots: yearlySnapshotsCompoundReturn };

                if (this.compoundReturnBurnUpChartData?.yearlySnapshots) {
                    const updatedYear = new Date().getFullYear();
                    const updatedMonth = new Date().getMonth();

                    this.compoundReturnBurnUpChartData.yearlySnapshots.forEach(item => {
                        if (!this.showMonthly) {
                            if (!item.last) {
                                item.year = updatedYear + item.year;
                            }
                            if (!item.month) {
                                item.month = updatedMonth;
                            }
                        } else {
                            if (!item.last) {
                                const snapYear = moment().add(item.year, 'months');
                                item.year = snapYear.year();
                                item.month = snapYear.month();
                            }
                        }
                    });
                }
                let yearlabels = [];
                let freedomNumberdata = [];
                let lifestyleNumberData = [];
                let unearnedIncomeData = [];
                let balanceData = [];
                if (this.compoundReturnBurnUpChartData?.yearlySnapshots) {
                    for (let snap of this.compoundReturnBurnUpChartData.yearlySnapshots) {
                        yearlabels.push(this.showMonthly ? `${(snap.month + 1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}-${snap.year}` : snap.year);
                        freedomNumberdata.push(this.freedomNumber);
                        lifestyleNumberData.push(this.lifestyleNumber);
                        unearnedIncomeData.push(snap.income);
                        balanceData.push(snap.balance);
                    };
                }

                this.compoundReturnChartMeta.labels = yearlabels;
                let customDataSet = [];
                for (let goals of this.customGoals) {
                    let customNumberData = [];
                    for(let snap of this.compoundReturnBurnUpChartData.yearlySnapshots){
                        customNumberData.push(goals.value);
                    }
                    customDataSet.push({label:goals.label,data:customNumberData,fill: false,pointStyle:'circle', pointRadius: 2,
                        pointBorderColor: [], 
                        // borderColor: this.graphColors['--graph-aero'], 
                        // backgroundColor: this.graphColors['--graph-aero'],
                        pointBackgroundColor: [],
                        pointBorderWidth: 2,yAxisID: "id1"})
                }
                this.compoundReturnChartMeta.dataSets = [...this.compoundReturnDefaultDataset, ...customDataSet];
                this.compoundReturnChartMeta.dataSets[0].data = freedomNumberdata;
                this.compoundReturnChartMeta.dataSets[1].data = lifestyleNumberData;
                this.compoundReturnChartMeta.dataSets[2].data = unearnedIncomeData;
                this.compoundReturnChartMeta.dataSets[3].data = balanceData;

                let minimum = 0;
                if (this.compoundReturnBurnUpChartData?.yearlySnapshots?.length > 0) {
                    if (this.freedomNumber < this.lifestyleNumber) {
                        if (this.freedomNumber < this.compoundReturnBurnUpChartData.yearlySnapshots[0].income)
                            minimum = this.freedomNumber
                        else
                            minimum = this.showMonthly ? (this.compoundReturnBurnUpChartData.yearlySnapshots[0].income).toFixed(2) : this.compoundReturnBurnUpChartData.yearlySnapshots[0].income
                    }
                    else {
                        if (this.lifestyleNumber < this.compoundReturnBurnUpChartData.yearlySnapshots[0].income)
                            minimum = this.lifestyleNumber
                        else
                            minimum = this.showMonthly ? (this.compoundReturnBurnUpChartData.yearlySnapshots[0].income).toFixed(2) : this.compoundReturnBurnUpChartData.yearlySnapshots[0].income
                    }
                }
                this.compoundReturnChartMeta.options.scales.yAxes[0].ticks.suggestedMin = minimum;
                if (this.compoundReturnBurnUpChartData?.yearlySnapshots?.length > 0) {
                    setTimeout(() => {
                        if (this.charts.get(3))
                            this.legendData = this.charts.get(3)?.chart?.generateLegend();
                        else
                            this.legendData = this.charts.get(2)?.chart?.generateLegend();
                    },1000)
                }
            }
        })
    }

    setUserDashboardData(user) {
        this.freedomNumber = user.resultFreedom;
        this.lifestyleNumber = user.resultLifestyle;
        this.nd1CalculatorData.earnedIncome = user.currentEarnedIncome || 0;
        this.nd1CalculatorData.giving = user.giving;
        this.nd1CalculatorData.wealth = user.wealth;
        this.nd1CalculatorData.debt = user.debt;
        this.nd1CalculatorData.living = user.living;
        this.nd1CalculatorData.customAccounts = user.customAccounts;
        this.nd1ChartMeta.datasets[0].data = [user.living, user.giving, user.wealth, user.debt];
        this.monthlyEarnedIncome = user.monthlyEarnedIncome;
        this.useND1WealthValue = user.useND1WealthValue;
        this.showMonthly = user.showMonthly;
        this.useUnearnedIncomeValues = user.useUnearnedIncomeValues;
        this.yearsInvested = user.yearsInvested;
        this.annualContribution = user.annualContribution;
        this.annualIncreaseContribution = user.annualIncreaseContribution;
        this.annualWithdrawal = user.annualWithdrawal;
        this.withdrawalStartingYear = user.withdrawalStartingYear;
        this.volatilityDrawdown = user.volatilityDrawdown;
        this.everyNumberYears = user.everyNumberYears;
        this.customGoals = user.customGoals || [];
        // this.nd2ChartMeta.datasets[0].data = [user.tier1 || 0, user.t2Target || 0, user.t3Target || 0];
        if (user.customAccounts?.length) {
            for (let custom of user.customAccounts) {
                this.nd1ChartMeta.labels.push(custom.label);
                this.nd1ChartMeta.datasets[0].data.push(custom.value);
            }
        }
        let setChartHeight = _.debounce(() => {
            this.nd1Canvas.nativeElement.style.height = this.nd1legendsItems.nativeElement.offsetHeight + 'px';
        }, 250, { 'trailing': true });
        if (this.platform.width() < 640) {
            // setChartHeight();
        }
    }

    hasAccessTo() {
        return ["comppro", "pro", "comppremium", "premium", "admin"].indexOf(this.access.toLowerCase()) !== -1;
    }
    hasAccessToFree() {
        return ["free"].indexOf(this.access.toLowerCase()) !== -1;
    }
    hasAccessToPremium() {
        return ["comppremium", "premium"].indexOf(this.access.toLowerCase()) !== -1;
    }
    hasAccessToAdmin() {
        return ['admin'].indexOf(this.access.toLowerCase()) !== -1;
    }
    navigateToAccountsPage() {
        this.router.navigate(['balancesheet']);
    }
    async networth_textClick(event?, currentItem?) {
        let __aio_tmp_val__: any;
        this.router.navigate(['balancesheet']);
    }
    async assets_liabilities_gridClick(type) {
        event.stopPropagation();
        let navigationExtras: NavigationExtras = {
            state: {
                asset: type == 'asset' ? true : false,
                liability: type == 'liability' ? true : false,
            }
        }
        this.navCtrl.navigateForward(`balancesheet`, navigationExtras);
    }
    // async freedomnumbercardClick__j_1325(event?, currentItem?) {
    //     let __aio_tmp_val__: any;
    //     this.router.navigate(['freedomnumberdetails'])
    // }
    // async lifestylenumbercardClick__j_1340(event?, currentItem?) {
    //     let __aio_tmp_val__: any;
    //     this.router.navigate(['lifestylenumberdetails']);
    // }
    sideMenuInit() {
        this.appSideMenuService.setSideMenuEnabled(true);
        this.appSideMenuService.bindHandlers();
    }
    explore() {
        this.navCtrl.navigateForward('resources');
    }
    openResource(id) {
        this.navCtrl.navigateForward(`/resourceDetails/${id}`);
    }
    openProgress() {
        let options: NavigationOptions = {
            animation: customAnimation
        }
        this.navCtrl.navigateForward(`/progress`, options);
    }

    getCompPercentage(isProfileDone, isGoalsDone, isFreedomDone, isLifestyleDone, isLegacyDone,
        isAssetDone, isLiabilityDone, isBudgetingDone, isCapitalDone, isCompoundDone, isIncomeDone,
        isPorfolioDone, isRiskDone, isTaxDone, isAssetPDone, isDebtDone, isDebtFree) {
        let sum = 0;
        if (isProfileDone)
            sum++;
        if (isGoalsDone)
            sum++;
        if (isFreedomDone)
            sum++;
        if (isLifestyleDone)
            sum++;
        if (isLegacyDone)
            sum++;
        if (isAssetDone)
            sum++;
        if (isLiabilityDone)
            sum++;
        if (isBudgetingDone)
            sum++;
        if (isCapitalDone)
            sum++;
        if (isCompoundDone)
            sum++;
        if (isIncomeDone)
            sum++;
        if (isPorfolioDone)
            sum++;
        if (isRiskDone)
            sum++;
        if (isTaxDone)
            sum++;
        if (isAssetPDone)
            sum++;
        if (isDebtDone || isDebtFree)
            sum++;

        return Math.round((sum / 16) * 100);
    }

    toggleSelectedAccount() {
        if(this.selectAccountId != "") {
            const getmetricHistoryByAccountSub = this.metricService.metricHistoryByAccount(this.selectAccountId, 'accountBalance').subscribe(async (res: any) => {
                try {
                    if (res) {
                        const resCopy = _.cloneDeep(res.data.getMetricHistoryByAccount);
                        let resDateDate = [];
                        let metricValueData = [];
                        let labelDate = []
                        let price = [];
                        let quantity = [];
                        resCopy.sort((a,b) => a.date-b.date);
                        resCopy.forEach(element => {
                            const fullDate = new Date(element.date * 1000);
                            const date = fullDate.getDate().toString();
                            const month = (fullDate.getMonth() + 1).toString();
                            const year = fullDate.getFullYear().toString();
                            const lDate = date + '/' + month + '/' + year
                            labelDate.push(lDate);
                            resDateDate.push(fullDate);
                            metricValueData.push(element.metricValue);
                            price.push(element.price);
                            quantity.push(element.quantity);
                        });
                        this.accountBalance.dates = resDateDate;
                        this.accountBalance.metricValues = metricValueData;
                        this.accountBalance.price = price;
                        this.accountBalance.quantity = quantity;
                        this.accountBalanceChartMeta.labels = labelDate;
                        this.accountBalanceChartMeta.dataSets[0].data = metricValueData;
                    }
                } catch (error) {
                    console.error('error', error)
                }
            });
            if (getmetricHistoryByAccountSub) {
                this.subscriptions.push(getmetricHistoryByAccountSub);
            }
        }
        else {
            this.accountBalanceChartMeta.labels = [];
            this.accountBalanceChartMeta.dataSets[0].data = [];
        }
    }
}
