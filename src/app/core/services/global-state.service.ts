import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { LayoutEnum } from 'src/app/enums/layout.enum';

@Injectable({ providedIn: 'root' })
export class GlobalStateService {
  isOpenFixedNav$ = new BehaviorSubject<
    LayoutEnum.RecentlyViewed | LayoutEnum.Category | null
  >(null);

  private data = new Subject();
  private subscriptions: Map<string, EventItem[]> = new Map<
    string,
    EventItem[]
  >();
  private dataStream$ = this.data.asObservable();
  private previous = 0;
  constructor() {
    this.dataStream$.subscribe((data) => this.onEvent(data));
  }

  public notifyDataChanged(event: string, value: unknown): void {
    const current: Anykey = this.data;
    if (current[event] !== value) {
      current[event] = value;
      this.data.next({
        event,
        data: current[event],
      });
    }
  }

  public subscribe(
    event: string,
    callback: (value: any) => void
  ): EventItemSubscription {
    const subscribers = this.subscriptions.get(event) || [];
    const uniqueId = this.getUniqueID();
    subscribers.push({ id: uniqueId, cb: callback });
    this.subscriptions.set(event, subscribers);
    return { event, id: uniqueId };
  }

  private onEvent(data: any) {
    const subscribers = this.subscriptions.get(data.event) || [];
    subscribers.forEach((ei: EventItem) => {
      ei.cb.call(null, data.data);
    });
  }

  public unsubscribe(
    event: string,
    id: number | null | undefined = undefined
  ): void {
    const subscribers = this.subscriptions.get(event) || [];
    let includes;
    if (id) {
      includes = subscribers.filter((ei) => ei.id !== id);
    } else {
      subscribers.splice(subscribers.length - 1, 1);
      includes = subscribers;
    }
    this.subscriptions.set(event, includes);
  }

  private getUniqueID() {
    try {
      let date = Date.now();

      if (date <= this.previous) {
        date = ++this.previous;
      } else {
        this.previous = date;
      }

      return date;
    } catch (e) {
      return 0;
    }
  }
}

interface EventItem {
  id: number;
  cb: (value: any) => void;
}
interface EventItemSubscription {
  id: number;
  event: string;
}
interface Anykey {
  [key: string]: any;
}
