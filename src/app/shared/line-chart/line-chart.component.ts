import { Component, inject, input, ViewChild } from '@angular/core';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { curveCatmullRom } from 'd3-shape';
import { CustomLinerChartService } from './CustomLineChartService';
import { timeFrame } from '../../type';
import { HttpService } from '../../service/http-service.service';
@Component({
  selector: 'app-line-chart',
  imports: [NgxChartsModule],
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.css',
})
export class LineChartComponent {
  private customLinerChartService = inject(CustomLinerChartService);
  format = '';
  chartData = input.required<LineChartData>();
  yAxisLabel = input.required<'sales' | 'quantity'>();
  xAxisLabel: 'Month' | 'Week' | 'Year' | 'Day' = 'Month';
  private httpService = inject(HttpService);

  @ViewChild('chart') chart: any;
  view: [number, number] = [760, 400];
  colors: string[] = [];
  curve = curveCatmullRom;

  get Trends() {
    let trends = this.yAxisLabel();
    trends = trends.at(0)?.toUpperCase() + trends.substring(1);
    return trends + ' trends';
  }

  ngOnInit() {
    this.colors = [
      '#50c878',
      '#e92929',
      '#2d91e4',
      '#5e2de4',
      '#e929df',
      '#e99d0f',
      '#F4C542',
      '#000000',
    ];
    this.customScheme.domain = this.colors;
  }

  ngOnChanges() {
    this.format = this.httpService.getTimeFrame();
  }

  ngAfterViewChecked() {
    this.customLinerChartService.showDots(this.chart);
  }

  customScheme: Color = {
    domain: [],
    name: 'customScheme',
    selectable: true,
    group: ScaleType.Ordinal,
  };

  getFormatter() {
    if (this.format === 'week') {
      this.xAxisLabel = 'Week';
      return this.weekFormatter;
    } else {
      if (this.format === 'month') {
        this.xAxisLabel = 'Month';
        return this.monthFormatter;
      } else {
        if (this.format === 'year') {
          this.xAxisLabel = 'Year';
          return this.YearFormatter;
        }
        this.xAxisLabel = 'Day';
        return this.dayFormatter;
      }
    }
  }

  dayFormatter(date: string) {
    const hour = new Date(date).getHours();
    if (hour === 0) return 24;
    return hour;
  }

  weekFormatter(date: string) {
    const day = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    return day[new Date(date).getDay()];
  }

  monthFormatter(date: string) {
    return new Date(date).getDate();
  }
  YearFormatter(date: string) {
    const months = [
      'JAN',
      'FEB',
      'MAR',
      'APR',
      'MAY',
      'JUN',
      'JUL',
      'AUG',
      'SEP',
      'OCT',
      'NOV',
      'DEC',
    ];
    return months[new Date(date).getMonth()];
  }

  yAxisFormat(d: number) {
    return '$' + d;
  }
}

export type LineChartData = {
  name: string;
  series: {
    name: string;
    value: string;
  }[];
}[];
