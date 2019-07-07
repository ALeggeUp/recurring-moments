import { expect } from 'chai';
import RRule, { Frequency  } from 'rrule';

import moment from 'moment';

import { RuleSet } from '../../main/typescript/rule-set';
import { toArray } from 'rxjs/operators';

describe('Moment Library Usage Tests', () => {

  describe('Parsing UTC Date Strings', () => {

    it('should parse a date from a string and then convert back to a known string', () => {

      const dateFormat = 'YYYY-MM-DD HH:mm:ss Z';
      const initialDate = '2019-07-06 00:48:57 +0000';
      const expectedDate = 'Sat Jul 06 2019 00:48:57 GMT+0000';

      const parsedDate = moment(initialDate, dateFormat).utc(false);

      expect(parsedDate.toString()).equals(expectedDate);
      expect(parsedDate.zoneAbbr()).equals('UTC');
      expect(parsedDate.utcOffset()).equals(0);
    });

    it('should parse a date, add a year and convert back to a string', () => {

      const dateFormat = 'YYYY-MM-DD HH:mm:ss Z';
      const initialDate = '2019-07-06 00:48:57 +0000';
      const expectedDate = 'Mon Jul 06 2020 00:48:57 GMT+0000';

      const parsedDate = moment(initialDate, dateFormat).utc(false).add(1, 'year');

      expect(parsedDate.zoneAbbr()).equals('UTC');
      expect(parsedDate.utcOffset()).equals(0);
      expect(parsedDate.toString()).equals(expectedDate);
    });
  });

  describe('Recurring Dates With Moments', () => {

    it('should return a list with duplicates removed', () => {
        const dateFormat = 'YYYY-MM-DD HH:mm:ss Z';
        const initialDate = '2019-07-06 00:48:57 +0000';

        const parsedDate = moment(initialDate, dateFormat).utc(false);
        const ruleSet: RuleSet = new RuleSet();

        const rule1 = new RRule({
              dtstart: parsedDate.toDate(),
              freq: Frequency.WEEKLY,
              interval: 2,
              until: parsedDate.clone().add(2, 'year').toDate(),
              bymonth: [3, 8]
        });

        const rule2 = new RRule({
              dtstart: parsedDate.toDate(),
              freq: Frequency.WEEKLY,
              interval: 2,
              until: parsedDate.clone().add(3, 'year').toDate(),
              bymonth: [1, 8, 11]
        });

        const rule3 = new RRule({
              dtstart: parsedDate.toDate(),
              freq: Frequency.WEEKLY,
              interval: 2,
              until: parsedDate.clone().add(3, 'year').toDate(),
              bymonth: [1, 8, 11]
        });

        ruleSet.addRule(rule1);
        ruleSet.addRule(rule2);
        ruleSet.addRule(rule3);

        const allRuleCount = rule1.all().length + rule2.all().length + rule3.all().length;

        ruleSet.getDistinctMoments()
          .pipe(toArray())
          .subscribe(array => {
            expect(allRuleCount).equal(54),
            expect(array.length).lessThan(allRuleCount);
            expect(array.length).equal(26);
          });
    });
  });

});
