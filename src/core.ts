export interface TimeOffset {
  years?: number;
  months?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;
}

export const OriginalDate: DateConstructor = globalThis.Date;

export function setupDateProxy(getOffset: () => TimeOffset | undefined): void {
  const DateCtor = globalThis.Date;

  const DateProxy = new Proxy(DateCtor, {
    construct(target, args, newTarget) {
      const offset = getOffset();
      if (offset && args.length === 0) {
        const t = fakeCurrentTime(DateCtor, offset);
        return Reflect.construct(target, [t], newTarget);
      }
      return Reflect.construct(target, args, newTarget);
    },

    get(target, prop, receiver) {
      if (prop === "now") {
        const offset = getOffset();
        if (offset) {
          return () => fakeCurrentTime(DateCtor, offset);
        }
      }
      return Reflect.get(target, prop, receiver);
    },

    apply(target, thisArg, args) {
      const offset = getOffset();
      if (offset && args.length === 0) {
        const t = fakeCurrentTime(DateCtor, offset);
        return new DateCtor(t).toString();
      }
      return Reflect.apply(target, thisArg, args);
    },
  });

  globalThis.Date = DateProxy;
}

function fakeCurrentTime(ctor: DateConstructor, offset: TimeOffset): number {
  const date = new ctor();

  if (offset.years) {
    date.setFullYear(date.getFullYear() + offset.years);
  }

  if (offset.months) {
    date.setMonth(date.getMonth() + offset.months);
  }

  if (offset.days) {
    date.setDate(date.getDate() + offset.days);
  }

  if (offset.hours) {
    date.setHours(date.getHours() + offset.hours);
  }

  if (offset.minutes) {
    date.setMinutes(date.getMinutes() + offset.minutes);
  }

  if (offset.seconds) {
    date.setSeconds(date.getSeconds() + offset.seconds);
  }

  if (offset.milliseconds) {
    date.setMilliseconds(date.getMilliseconds() + offset.milliseconds);
  }

  return date.getTime();
}
