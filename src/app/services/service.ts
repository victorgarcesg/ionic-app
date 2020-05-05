import { HttpClient } from '@angular/common/http';
import { ConfigData } from './config';
import { CacheService } from './cache/cache.service';
import { Observable } from 'rxjs';

export abstract class Service {

    constructor(public http: HttpClient, public path: String, private cacheService: CacheService) { }

    getServiceName() {
        return this.path;
    }

    getCacheService() {
        return this.cacheService;
    }
    getRootUrl() {
        return `${ConfigData.rootUrl}${this.path}`;
    }

    getItemList(filter = null, orderBy = null, order = null, page = null, perPage = ConfigData.numberOfItemPerPage) {
        let query = '';
        const filterData = filter ? filter : '';
        const orderByData = orderBy ? `orderby=${orderBy}` : '';
        const orderData = order ? `order=${order}` : '';

        if (filterData) {
            query += `?${filterData}`;
        }

        if (orderByData) {
            if (query) {
                query += `&${filterData}`;
            } else {
                query += `?${filterData}`;
            }
        }

        if (orderData) {
            if (query) {
                query += `&${order}`;
            } else {
                query += `?${order}`;
            }
        }
        return this.http.get(`${this.getRootUrl()}${query}`);
    }

    getItemById(itemId) {
        if (this.getCacheService()) {
            return new Observable(observer => {
                const cacheItem = this.getCacheService().findById(itemId);
                if (cacheItem) {
                    observer.next(cacheItem);
                    observer.complete();
                } else {
                    this.http.get(`${this.getRootUrl()}/${itemId}`).subscribe(item => {
                        this.getCacheService().save(item);
                        observer.next(item);
                        observer.complete();
                    }, err => {
                        observer.error(err);
                        observer.complete();
                    });
                }
            });
        }
        return this.http.get(`${this.getRootUrl()}/${itemId}`);
    }
}
