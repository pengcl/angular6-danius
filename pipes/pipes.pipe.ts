import {Injectable, Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'age',
  pure: false
})

@Injectable()
export class AgePipe implements PipeTransform {
  transform(ym): any {
    const now = new Date();
    return now.getFullYear() - ym.split('-')[0] + (now.getMonth() + 1 >= parseInt(ym.split('-')[1], 10) ? 0 : -1);
  }
}

@Pipe({
  name: 'label',
  pure: false
})

@Injectable()
export class LabelPipe implements PipeTransform {
  transform(value, arr): any {
    if (!value) {
      return '不限';
    }

    let label = '';

    arr.forEach(item => {
      if (value.toString() === item.value) {
        label = item.label;
      }
    });

    return label;
  }
}

@Pipe({
  name: 'repairDate',
  pure: false
})

@Injectable()
export class RepairDatePipe implements PipeTransform {
  transform(value): any {
    value = value.split('.')[0].replace(/\-/g, '/');
    return value;
  }
}

@Pipe({
  name: 'formatDate',
  pure: false
})

@Injectable()
export class FormatDatePipe implements PipeTransform {
  transform(value): any {
    value = value.split('.')[0].replace(/\-/g, '/');
    console.log(value);
    return value;
  }
}
