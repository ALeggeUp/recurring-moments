
import moment from 'moment';

import { RRule, Options  } from 'rrule';

import { from as observableFrom, Observable } from 'rxjs';
import { map, toArray, distinct, concatMap } from 'rxjs/operators';

export class RuleSet {

    private rules: Array<RRule> = [];

    constructor() {
    }

    addRule(rule: RRule): void {
        this.rules.push(rule);
    }

    addRuleFromOptions(options: Partial<Options>): void {
        this.rules.push(new RRule(options));
    }

    getDistinctMoments(): Observable<moment.Moment> {
        return observableFrom(this.rules).pipe(
            concatMap(this.allDatesForRule),
            map(this.jsDateToMoment),
            toArray(),
            concatMap(this.sortMoments),
            distinct(this.momentKeySelector)
        );
    }

    private sortMoments(moments: Array<moment.Moment>): Array<moment.Moment> {
        return moments.sort(this.momentCompareFn);
    }

    private momentCompareFn(a: moment.Moment, b: moment.Moment): number {
        return a.isSame(b) ? 0 : a.isBefore(b) ? -1 : 1;
    }

    private momentKeySelector(value: moment.Moment): string {
        return value.toISOString(false);
    }

    private jsDateToMoment(date: Date): moment.Moment {
        return moment(date).utc(false);
    }

    private allDatesForRule(rule: RRule): Array<Date> {
        return rule.all();
    }
}
