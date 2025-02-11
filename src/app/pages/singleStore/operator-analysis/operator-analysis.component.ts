import { Component } from '@angular/core';
import { CustomerInsightsComponent } from '../../../shared/customer-insights/customer-insights.component';
import {
  LineChartComponent,
  LineChartData,
} from '../../../shared/line-chart/line-chart.component';
import { ProductSalesComponent } from '../../../shared/product-sales/product-sales.component';
import { customerData } from '../../../../data';
import { data } from '../../data';
import { DropDownComponent } from '../../../shared/drop-down/drop-down.component';

@Component({
  selector: 'app-operator-analysis',
  imports: [
    CustomerInsightsComponent,
    LineChartComponent,
    DropDownComponent,
    ProductSalesComponent,
  ],
  templateUrl: './operator-analysis.component.html',
  styleUrl: './operator-analysis.component.css',
})
export class OperatorAnalysisComponent {
<<<<<<< HEAD
  customerData = customerData;
  data!: {
    name: string;
    color: string;
    series: {
      name: string;
      value: string;
    }[];
  }[];

=======
  data!: LineChartData;
  listElements = ['100', '101', '102', '103'];
>>>>>>> 9cb9b6dec6e2799a92a13127fe10b6bcb0c7364f
  constructor() {
    Object.assign(this, { data });
  }
  selected = this.listElements[0];
  select(value: string) {
    console.log(value);
    this.selected = value;
  }
}
