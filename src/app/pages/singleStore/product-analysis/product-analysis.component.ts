import { Component } from '@angular/core';
import { CustomerInsightsComponent } from '../../../shared/customer-insights/customer-insights.component';
import { CrossSellingProductsComponent } from '../../../shared/cross-selling-products/cross-selling-products.component';
import { data } from '../../data';
<<<<<<< HEAD
import { customerData } from '../../../../data';
import { crossSellingProducts } from '../../../../data';
import { LineChartComponent } from '../../../shared/line-chart/line-chart.component';
=======
import {
  LineChartComponent,
  LineChartData,
} from '../../../shared/line-chart/line-chart.component';
import { DropDownComponent } from '../../../shared/drop-down/drop-down.component';
>>>>>>> 9cb9b6dec6e2799a92a13127fe10b6bcb0c7364f

@Component({
  selector: 'app-product-analysis',
  imports: [
    CustomerInsightsComponent,
    CrossSellingProductsComponent,
    DropDownComponent,
    LineChartComponent,
  ],
  templateUrl: './product-analysis.component.html',
  styleUrl: './product-analysis.component.css',
})
export class ProductAnalysisComponent {
<<<<<<< HEAD
  crossSellingProducts = crossSellingProducts;
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
  listElements = ['Apple', 'Mango', 'Orange', 'Cucumber'];
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
