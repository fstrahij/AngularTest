/**
 *          NE MIJENJATI!!!
 */

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';

const LOCAL_STORAGE_DATA_KEY = 'talentLyftInterviewA01Data';
const MIN_DELAY_MS = 100;
const MAX_DELAY_MS = 1500;
const ERROR_CHANCE = 0.1;

@Injectable({ providedIn: 'root' })
export class DataService {
    readData<T>(initialData: GenericData<T>): Observable<GenericData<T>> {
        const data = localStorage.getItem(LOCAL_STORAGE_DATA_KEY);
        return this.randomDelay().pipe(
            map((_) => {
                this.throwErrorRandomly();
                if (!data) {
                    return initialData;
                }
                return JSON.parse(data);
            })
        );
    }

    writeData<T>(data: GenericData<T>): Observable<unknown> {
        return this.randomDelay().pipe(
            tap((_) => {
                this.throwErrorRandomly();
                localStorage.setItem(
                    LOCAL_STORAGE_DATA_KEY,
                    JSON.stringify(data)
                );
            })
        );
    }

    private randomDelay(): Observable<unknown> {
        const delayTime =
            MIN_DELAY_MS +
            Math.floor(Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS));
        return of({}).pipe(delay(delayTime));
    }

    private throwErrorRandomly(): void {
        const randomNumber = Math.random();

        if (randomNumber < ERROR_CHANCE) {
            throw new Error('This is API error simulation.');
        }
    }
}

export interface GenericData<T> {
    idCounter: number;
    data: T[];
}
