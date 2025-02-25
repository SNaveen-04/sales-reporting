import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CustomerInsightsComponent } from '../../shared/customer-insights/customer-insights.component';
import {
  LineChartComponent,
  LineChartData,
} from '../../shared/line-chart/line-chart.component';
import { HorizontalBarChartComponent } from '../../shared/horizontal-bar-chart/horizontal-bar-chart.component';
import { HttpService } from '../../service/http-service.service';
import { MultiSelectDropDownComponent } from '../../shared/multi-select-drop-down/multi-select-drop-down.component';
import { ChipsComponent } from '../../shared/chips/chips.component';
import { customerData } from '../../../data';
import { CrossSellingBarChartComponent } from '../../shared/cross-selling-bar-chart/cross-selling-bar-chart.component';
import { customerInsightsData, timeFrame } from '../../type';
@Component({
  selector: 'app-store-analysis',
  imports: [
    LineChartComponent,
    CustomerInsightsComponent,
    HorizontalBarChartComponent,
    MultiSelectDropDownComponent,
    ChipsComponent,
    CrossSellingBarChartComponent,
  ],
  templateUrl: './store-analysis.component.html',
  styleUrl: './store-analysis.component.css',
})
export class StoreAnalysisComponent {
  private httpService = inject(HttpService);
  private destroyRef = inject(DestroyRef);
  public crossData: any[] = [];
  timeFrame: timeFrame = 'month';
  leastSellingData: any[] = [];
  topSellingData: any[] = [];
  topLeastTotalData: any;
  customerData = signal<customerInsightsData>([]);
  LineChartdata!: LineChartData;
  selectedIds: string[] = [];
  yAxisLabel: 'sales' | 'quantity' = 'sales';
  filter = '';
  listElements: {
    id: string;
    name: string;
    selected: boolean;
  }[] = [];
  isLoaded = false;
  get disabled() {
    // if (this.selectedDepartments.length === 1) return true;
    return false;
  }
  get selectedDepartments() {
    return this.listElements
      .filter((d) => d.selected)
      .map((d) => {
        return {
          id: d.id,
          name: d.name,
        };
      });
  }

  select() {
    this.selectedIds = this.listElements
      .filter((element) => element.selected)
      .map((element) => element.id);
    this.getStoreAnalysis();
  }

  ngOnInit() {
    const targetSubscriber = this.httpService.targetValue$.subscribe({
      next: (d) => {
        this.filter = d;
        if (this.yAxisLabel !== d) {
          this.yAxisLabel = d;
          this.getStoreAnalysis();
        }
      },
    });
    const storeSubscriber = this.httpService.storeId$.subscribe({
      next: () => {
        this.getDepartmentsList();
      },
    });
    const timeFrameSubscriber = this.httpService.timeFrame$.subscribe({
      next: (data) => {
        if (this.timeFrame !== data) {
          this.timeFrame = data;
          this.getStoreAnalysis();
        }
      },
    });
    this.destroyRef.onDestroy(() => {
      targetSubscriber.unsubscribe();
      storeSubscriber.unsubscribe();
      timeFrameSubscriber.unsubscribe();
    });
  }

  getStoreAnalysis() {
    if (this.selectedIds.length !== 0) {
      this.getDepartmentTrends();
      this.getTopLeastData();
      this.getCrossSellingData();
      this.getDepartmentComparisonCustomerInsights();
    }
  }

  getTopLeastData() {
    this.httpService.getTopAndLeastPerformance(this.selectedIds).subscribe({
      next: (data) => {
        this.createPerformanceData(data);
      },
      error: (e) => console.log(e),
    });
  }

  // split the product performance into top least bar chart and least selling bar chart data
  //input :  data  - from the  backend
  //output : topSellingData, leastSelling data variable assigned with their values
  createPerformanceData(datas: any[]) {
    this.topLeastTotalData = datas;
    let finalData: any[] = []; // Initialize finalData as an empty array
    datas.forEach((data) => {
      data.data.forEach((item: any) => {
        finalData.push({ name: item.name, value: Math.floor(item.value) });
      });
    });
    finalData.sort((a, b) => {
      return a.value - b.value;
    });
    if (finalData.length <= 10) {
      const mid = Math.floor(finalData.length / 2);
      this.leastSellingData = finalData.slice(0, mid);
      this.topSellingData = finalData.slice(mid, finalData.length);
    } else {
      this.leastSellingData = finalData.slice(0, 5);
      this.topSellingData = finalData.slice(
        finalData.length - 5,
        finalData.length
      );
    }
  }

  removeTopLeastData(id: string) {
    let temp: string = '';
    for (const item of this.listElements) {
      if (item.id === id) {
        temp = item.name;
      }
    }
    this.topLeastTotalData = this.topLeastTotalData.filter(
      (data: any) => data.name !== temp
    );
    this.createPerformanceData(this.topLeastTotalData);
  }

  removeCrossSelingData(id: string) {
    let temp: string = '';
    for (const item of this.listElements) {
      if (item.id === id) {
        temp = item.name;
      }
    }
    this.crossData = this.crossData.filter((data: any) => data.name !== temp);
  }

  getCrossSellingData() {
    this.httpService.getCrossSellingData(this.selectedIds).subscribe({
      next: (data) => {
        this.crossData = data;
      },
      error: (error) => console.log(error),
    });
  }

  getDepartmentTrends() {
    this.httpService.getDepartmentTrends(this.selectedIds).subscribe({
      next: (data) => {
        this.LineChartdata = data;
        this.isLoaded = true;
      },
      error: (error) => console.log(error),
    });
  }

  getDepartmentsList() {
    this.httpService.getDepartmentsList().subscribe({
      next: (data) => {
        this.listElements = data.map((d) => {
          return {
            ...d,
            selected: false,
          };
        });
        // this.selectedIds = [this.listElements[0].id, this.listElements[1].id];
        this.selectedIds = [this.listElements[0].id];
        this.listElements[0].selected = true;

        // this.listElements[1].selected = true;
        this.getStoreAnalysis();
      },
      error: (e) => console.log(e),
    });
  }

  deselect(id: string) {
    if (this.selectedIds.length > 0) {
      this.removeTopLeastData(id);
      this.removeCrossSelingData(id);
      this.removeCustomerInsights(id);
      this.selectedIds = this.selectedIds.filter((d) => d != id);
      let temp = '';
      this.listElements.map((d) => {
        if (d.id === id) {
          temp = d.name;
        }
      });
      this.LineChartdata = this.LineChartdata.filter((d) => d.name !== temp);
    } else {
      this.listElements.map((d) => {
        if (d.id === id) {
          d.selected = true;
        }
      });
    }
  }
  removeCustomerInsights(id: string) {
    this.selectedIds = this.selectedIds.filter((d) => d !== id);
    this.getDepartmentComparisonCustomerInsights();
  }
  getDepartmentComparisonCustomerInsights() {
    this.httpService
      .getDepartmentComparisonCustomerInsights(this.selectedIds)
      .subscribe({
        next: (data: any) => {
          this.customerData.set([]);
          let newCustomerCount = 0;
          let RepeatedCustomerCount = 0;
          let newCustomer = {
            name: 'New Customer',
          } as { name: string; value: number };
          let repeatedCustomer = {
            name: 'Repeated Customer',
          } as { name: string; value: number };
          if (this.filter === 'sales') {
            data.forEach((element: any) => {
              newCustomerCount += element['data'][0]['value'][1];
              RepeatedCustomerCount += element['data'][1]['value'][1];
            });
            newCustomer['value'] = Math.round(newCustomerCount);
            repeatedCustomer['value'] = Math.round(RepeatedCustomerCount);
          } else {
            data.forEach((element: any) => {
              newCustomerCount += element['data'][0]['value'][0];
              RepeatedCustomerCount += element['data'][1]['value'][0];
            });
            newCustomer['value'] = Math.round(newCustomerCount);
            repeatedCustomer['value'] = Math.round(RepeatedCustomerCount);
          }
          this.customerData.set([repeatedCustomer, newCustomer]);
        },
        error: (e) => console.log(e),
      });
  }
}
